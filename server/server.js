import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import db, { initDatabase } from './db.js';
import { LEAVE_TYPES, validateLeaveRequest } from './bknRules.js';
import { SALARY_MATRIX, calculateEstimatedTakeHomePay } from './salaryMatrix.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB schema & seeds
initDatabase();

const app = express();
const PORT = process.env.PORT || 3001;

// Upload directory setup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `doc_${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// ==========================================
// EMPLOYEES & AUTH ENDPOINTS
// ==========================================

// Get all employees (for role switcher & assignment)
app.get('/api/employees', (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM employees ORDER BY role DESC, nama ASC`);
    const employees = stmt.all();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get specific employee by ID
app.get('/api/employees/:id', (req, res) => {
  try {
    const stmt = db.prepare(`SELECT * FROM employees WHERE id = ?`);
    const emp = stmt.get(req.params.id);
    if (!emp) return res.status(404).json({ error: 'Pegawai tidak ditemukan' });

    // Calculate total annual leave
    emp.total_sisa_tahunan = (emp.sisa_cuti_n2 || 0) + (emp.sisa_cuti_n1 || 0) + (emp.sisa_cuti_n || 0);
    emp.eligible_cuti_besar = emp.jenis_asn === 'PNS' && emp.masa_kerja_tahun >= 5;

    res.json(emp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update employee quota (admin management)
app.put('/api/employees/:id/quotas', (req, res) => {
  try {
    const { sisa_cuti_n2, sisa_cuti_n1, sisa_cuti_n, cuti_sakit_terpakai } = req.body;
    const stmt = db.prepare(`
      UPDATE employees 
      SET sisa_cuti_n2 = ?, sisa_cuti_n1 = ?, sisa_cuti_n = ?, cuti_sakit_terpakai = ?
      WHERE id = ?
    `);
    stmt.run(sisa_cuti_n2, sisa_cuti_n1, sisa_cuti_n, cuti_sakit_terpakai, req.params.id);
    res.json({ success: true, message: 'Kuota cuti berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// LEAVE RULES & SALARY MATRIX
// ==========================================

app.get('/api/rules', (req, res) => {
  res.json({
    leave_types: LEAVE_TYPES,
    salary_matrix: SALARY_MATRIX
  });
});

app.get('/api/salary-simulation', (req, res) => {
  const { pangkat, jenis_cuti } = req.query;
  const result = calculateEstimatedTakeHomePay(pangkat, jenis_cuti);
  res.json(result);
});

// ==========================================
// PUBLIC HOLIDAYS & CALENDAR
// ==========================================

app.get('/api/holidays', (req, res) => {
  try {
    const holidays = db.prepare('SELECT * FROM public_holidays ORDER BY tanggal ASC').all();
    res.json(holidays);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get team leave calendar events
app.get('/api/calendar/events', (req, res) => {
  try {
    const leaves = db.prepare(`
      SELECT 
        lr.id, lr.nomor_surat, lr.jenis_cuti, lr.alasan_cuti, 
        lr.tanggal_mulai, lr.tanggal_selesai, lr.jumlah_hari, lr.status,
        e.nama as employee_name, e.nip as employee_nip, e.unit_kerja, e.avatar
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      WHERE lr.status IN ('disetujui', 'diajukan', 'pertimbangan_atasan')
      ORDER BY lr.tanggal_mulai ASC
    `).all();

    const holidays = db.prepare('SELECT * FROM public_holidays').all();

    res.json({ leaves, holidays });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// LEAVE REQUESTS ENDPOINTS
// ==========================================

// List leave requests with filters
app.get('/api/leave-requests', (req, res) => {
  try {
    const { employee_id, role, status } = req.query;
    let query = `
      SELECT 
        lr.*,
        e.nama as pemohon_nama,
        e.nip as pemohon_nip,
        e.jabatan as pemohon_jabatan,
        e.pangkat_golongan as pemohon_pangkat,
        e.unit_kerja as pemohon_unit,
        e.jenis_asn as pemohon_jenis_asn,
        e.masa_kerja_tahun as pemohon_masa_kerja_th,
        e.masa_kerja_bulan as pemohon_masa_kerja_bl,
        e.sisa_cuti_n2, e.sisa_cuti_n1, e.sisa_cuti_n,
        at.nama as atasan_nama,
        ppk.nama as ppk_nama
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      LEFT JOIN employees at ON lr.atasan_id = at.id
      LEFT JOIN employees ppk ON lr.ppk_id = ppk.id
    `;
    const params = [];

    if (employee_id) {
      query += ` WHERE lr.employee_id = ?`;
      params.push(employee_id);
    } else if (role === 'atasan') {
      // Subordinates of atasan
      query += ` WHERE lr.atasan_id = ? OR lr.status IN ('diajukan', 'pertimbangan_atasan')`;
      params.push(req.query.user_id || 'emp-atasan-1');
    }

    query += ` ORDER BY lr.created_at DESC`;

    const stmt = db.prepare(query);
    const requests = stmt.all(...params);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single leave request details & Lampiran II Peraturan BKN No. 7 Tahun 2021
app.get('/api/leave-requests/:id', (req, res) => {
  try {
    const query = `
      SELECT 
        lr.*,
        e.nama as pemohon_nama,
        e.nip as pemohon_nip,
        e.jabatan as pemohon_jabatan,
        e.pangkat_golongan as pemohon_pangkat,
        e.unit_kerja as pemohon_unit,
        e.instansi as pemohon_instansi,
        e.jenis_asn as pemohon_jenis_asn,
        e.masa_kerja_tahun as pemohon_masa_kerja_th,
        e.masa_kerja_bulan as pemohon_masa_kerja_bl,
        e.sisa_cuti_n2, e.sisa_cuti_n1, e.sisa_cuti_n,
        at.nama as atasan_nama, at.nip as atasan_nip, at.jabatan as atasan_jabatan,
        ppk.nama as ppk_nama, ppk.nip as ppk_nip, ppk.jabatan as ppk_jabatan
      FROM leave_requests lr
      JOIN employees e ON lr.employee_id = e.id
      LEFT JOIN employees at ON lr.atasan_id = at.id
      LEFT JOIN employees ppk ON lr.ppk_id = ppk.id
      WHERE lr.id = ?
    `;
    const request = db.prepare(query).get(req.params.id);
    if (!request) return res.status(404).json({ error: 'Permohonan cuti tidak ditemukan' });

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// File upload endpoint for supporting documents (surat dokter, tiket haji, etc.)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Tidak ada file yang diunggah' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    fileName: req.file.originalname,
    storedName: req.file.filename,
    fileUrl
  });
});

// Submit leave request (Flow: Isi Form -> Sesuai Ketentuan? -> Simpan Pengajuan)
app.post('/api/leave-requests', (req, res) => {
  try {
    const {
      employee_id,
      jenis_cuti,
      alasan_cuti,
      kategori_detail,
      anak_ke,
      tanggal_mulai,
      tanggal_selesai,
      jumlah_hari,
      alamat_selama_cuti,
      no_telepon_cuti,
      lampiran_nama,
      lampiran_url
    } = req.body;

    // Fetch employee
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(employee_id);
    if (!employee) {
      return res.status(404).json({ error: 'Data pegawai pemohon tidak ditemukan' });
    }

    // Step: "Sesuai ketentuan?" Validation against BKN rules
    const validation = validateLeaveRequest(employee, {
      jenis_cuti,
      jumlah_hari: parseInt(jumlah_hari, 10),
      kategori_detail,
      anak_ke: anak_ke ? parseInt(anak_ke, 10) : null,
      lampiran_nama
    });

    if (!validation.isValid) {
      // Step: "Tampil pesan error"
      return res.status(400).json({
        success: false,
        is_compliant: false,
        message: 'Pengajuan cuti tidak memenuhi ketentuan Peraturan BKN No. 7 Tahun 2021',
        errors: validation.errors,
        warnings: validation.warnings
      });
    }

    // Step: "Simpan pengajuan"
    const newId = `cuti-${Date.now()}`;
    const year = new Date().getFullYear();
    const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const currentMonth = romanMonths[new Date().getMonth()];
    
    // Generate official request number
    const prefixCode = {
      cuti_tahunan: 'THN',
      cuti_besar: 'BSR',
      cuti_sakit: 'SKT',
      cuti_melahirkan: 'MLH',
      cuti_alasan_penting: 'CAP',
      cuti_bersama: 'BSM',
      cltn: 'CLTN'
    }[jenis_cuti] || 'CT';
    const randomSeq = Math.floor(100 + Math.random() * 900);
    const nomorSurat = `800/CUTI-${prefixCode}/${randomSeq}/${currentMonth}/${year}`;

    const atasanId = employee.atasan_id || 'emp-atasan-1';
    const ppkId = 'emp-ppk-1';

    const insertStmt = db.prepare(`
      INSERT INTO leave_requests (
        id, nomor_surat, employee_id, jenis_cuti, alasan_cuti, kategori_detail, anak_ke,
        tanggal_mulai, tanggal_selesai, jumlah_hari, alamat_selama_cuti, no_telepon_cuti,
        lampiran_nama, lampiran_url, status, atasan_id, ppk_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pertimbangan_atasan', ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))
    `);

    insertStmt.run(
      newId, nomorSurat, employee_id, jenis_cuti, alasan_cuti, kategori_detail || null,
      anak_ke ? parseInt(anak_ke, 10) : null, tanggal_mulai, tanggal_selesai,
      parseInt(jumlah_hari, 10), alamat_selama_cuti, no_telepon_cuti,
      lampiran_nama || null, lampiran_url || null, atasanId, ppkId
    );

    res.status(201).json({
      success: true,
      is_compliant: true,
      message: 'Pengajuan cuti berhasil disimpan dan diteruskan ke Atasan Langsung',
      requestId: newId,
      nomor_surat: nomorSurat,
      warnings: validation.warnings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atasan Langsung Action (Pertimbangan: Disetujui, Perubahan, Ditangguhkan, Tidak Disetujui)
app.put('/api/leave-requests/:id/atasan-action', (req, res) => {
  try {
    const { atasan_aksi, atasan_catatan, atasan_id } = req.body;
    // atasan_aksi: 'DISETUJUI', 'PERUBAHAN', 'DITANGGUHKAN', 'TIDAK_DISETUJUI'
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const stmt = db.prepare(`
      UPDATE leave_requests
      SET atasan_aksi = ?, atasan_catatan = ?, atasan_tanggal = ?, updated_at = ?
      WHERE id = ?
    `);
    stmt.run(atasan_aksi, atasan_catatan, now, now, req.params.id);

    res.json({
      success: true,
      message: `Pertimbangan atasan langsung berhasil disimpan (${atasan_aksi})`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pejabat Pembina Kepegawaian (PPK) Action (Keputusan: Disetujui, Perubahan, Ditangguhkan, Tidak Disetujui)
app.put('/api/leave-requests/:id/ppk-action', (req, res) => {
  try {
    const { ppk_aksi, ppk_catatan, ppk_id } = req.body;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    // Status resolution
    let finalStatus = 'disetujui';
    let nomorSk = null;
    if (ppk_aksi === 'DISETUJUI') {
      finalStatus = 'disetujui';
      nomorSk = `800/SK-CUTI/${Math.floor(100 + Math.random() * 900)}/BKPSDM/${new Date().getFullYear()}`;
    } else if (ppk_aksi === 'PERUBAHAN') {
      finalStatus = 'perubahan';
    } else if (ppk_aksi === 'DITANGGUHKAN') {
      finalStatus = 'ditangguhkan';
    } else {
      finalStatus = 'ditolak';
    }

    const stmt = db.prepare(`
      UPDATE leave_requests
      SET ppk_aksi = ?, ppk_catatan = ?, ppk_tanggal = ?, status = ?, nomor_sk = ?, updated_at = ?
      WHERE id = ?
    `);
    stmt.run(ppk_aksi, ppk_catatan, now, finalStatus, nomorSk, now, req.params.id);

    // If fully approved and is Cuti Tahunan, deduct quota automatically
    if (ppk_aksi === 'DISETUJUI') {
      const leave = db.prepare('SELECT * FROM leave_requests WHERE id = ?').get(req.params.id);
      if (leave && leave.jenis_cuti === 'cuti_tahunan') {
        const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(leave.employee_id);
        let daysToDeduct = leave.jumlah_hari;
        let n2 = emp.sisa_cuti_n2 || 0;
        let n1 = emp.sisa_cuti_n1 || 0;
        let n = emp.sisa_cuti_n || 0;

        // Deduct from oldest first: N-2, then N-1, then N
        if (n2 > 0) {
          const deductN2 = Math.min(n2, daysToDeduct);
          n2 -= deductN2;
          daysToDeduct -= deductN2;
        }
        if (daysToDeduct > 0 && n1 > 0) {
          const deductN1 = Math.min(n1, daysToDeduct);
          n1 -= deductN1;
          daysToDeduct -= deductN1;
        }
        if (daysToDeduct > 0 && n > 0) {
          const deductN = Math.min(n, daysToDeduct);
          n -= deductN;
          daysToDeduct -= deductN;
        }

        db.prepare('UPDATE employees SET sisa_cuti_n2 = ?, sisa_cuti_n1 = ?, sisa_cuti_n = ? WHERE id = ?')
          .run(n2, n1, n, emp.id);
      } else if (leave && leave.jenis_cuti === 'cuti_besar') {
        db.prepare('UPDATE employees SET cuti_besar_terakhir = ?, sisa_cuti_n = 0 WHERE id = ?')
          .run(now.slice(0, 10), leave.employee_id);
      } else if (leave && leave.jenis_cuti === 'cuti_sakit') {
        db.prepare('UPDATE employees SET cuti_sakit_terpakai = cuti_sakit_terpakai + ? WHERE id = ?')
          .run(leave.jumlah_hari, leave.employee_id);
      }
    }

    res.json({
      success: true,
      message: `Keputusan Pejabat Yang Berwenang (PPK) berhasil ditetapkan (${ppk_aksi})`,
      status: finalStatus,
      nomor_sk: nomorSk
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// WHATSAPP CHATBOT SIMULATOR (DIAGRAM 1)
// ==========================================

app.post('/api/chatbot/message', (req, res) => {
  try {
    const { employee_id, message } = req.body;
    const cleanMsg = (message || '').trim().toLowerCase();

    const emp = db.prepare('SELECT * FROM employees WHERE id = ?').get(employee_id || 'emp-pns-1');
    if (!emp) return res.status(404).json({ error: 'Pegawai tidak ditemukan' });

    let botReply = '';
    let quickActions = [];
    let generatedLink = null;

    if (cleanMsg === '1' || cleanMsg.includes('sisa cuti') || cleanMsg.includes('cek cuti')) {
      // Flow 1: Ambil data sisa cuti -> Kirim sisa cuti via WA
      const totalSisa = (emp.sisa_cuti_n2 || 0) + (emp.sisa_cuti_n1 || 0) + (emp.sisa_cuti_n || 0);
      const isEligibleCutiBesar = emp.jenis_asn === 'PNS' && emp.masa_kerja_tahun >= 5;

      botReply = `📊 *INFORMASI SISA CUTI ASN*
👤 *Nama:* ${emp.nama}
🆔 *NIP:* ${emp.nip}
🏢 *Unit Kerja:* ${emp.unit_kerja}
🏷️ *Status:* ${emp.jenis_asn} (${emp.jabatan})
━━━━━━━━━━━━━━━━━━━━
🌴 *Rincian Hak Cuti Tahunan:*
  • Tahun N-2 (2024): ${emp.sisa_cuti_n2 || 0} hari kerja
  • Tahun N-1 (2025): ${emp.sisa_cuti_n1 || 0} hari kerja
  • Tahun N (2026): ${emp.sisa_cuti_n || 0} hari kerja
👉 *TOTAL TERSEDIA: ${totalSisa} HARI KERJA*

🎖️ *Cuti Besar:* ${isEligibleCutiBesar ? '✅ Berhak (Masa kerja > 5 thn)' : '❌ Belum memenuhi masa kerja 5 tahun'}
🩺 *Cuti Sakit Terpakai:* ${emp.cuti_sakit_terpakai || 0} hari
━━━━━━━━━━━━━━━━━━━━
Ketik *2* atau klik tombol di bawah untuk mengajukan cuti sekarang!`;

      quickActions = [
        { label: '📝 Ajukan Cuti Sekarang', value: '2' },
        { label: '📖 Info Aturan BKN', value: 'aturan' }
      ];
    } else if (cleanMsg === '2' || cleanMsg.includes('form') || cleanMsg.includes('ajukan')) {
      // Flow 2: Kirim link form cuti
      generatedLink = `/ajukan-cuti?emp=${emp.id}`;
      botReply = `📝 *FORMULIR LAYANAN CUTI ELEKTRONIK*
Silakan klik link di bawah untuk mengisi formulir resmi Cuti ASN (Format Peraturan BKN No. 7 Tahun 2021):

👉 [Buka Form Pengajuan Cuti](${generatedLink})

Atau gunakan *Pengajuan Kilat WA* dengan format:
\`AJUKAN#TAHUNAN#YYYY-MM-DD#JUMLAH_HARI#ALASAN\`

Contoh:
\`AJUKAN#TAHUNAN#2026-11-20#3#Keperluan Keluarga Khusus\``;

      quickActions = [
        { label: '🚀 Buka Web Form Cuti', url: generatedLink },
        { label: '📊 Cek Sisa Cuti', value: '1' }
      ];
    } else if (cleanMsg.startsWith('ajukan#')) {
      // Conversational quick-apply directly in WA
      const parts = message.split('#');
      if (parts.length < 5) {
        botReply = `❌ Format salah. Harap gunakan:\n\`AJUKAN#JENIS#YYYY-MM-DD#JUMLAH_HARI#ALASAN\`\nContoh: \`AJUKAN#TAHUNAN#2026-11-20#2#Acara Keluarga\``;
      } else {
        const jenisKey = parts[1].trim().toLowerCase().includes('tahunan') ? 'cuti_tahunan' :
                         parts[1].trim().toLowerCase().includes('besar') ? 'cuti_besar' :
                         parts[1].trim().toLowerCase().includes('sakit') ? 'cuti_sakit' : 'cuti_tahunan';
        const tglMulai = parts[2].trim();
        const jmlHari = parseInt(parts[3].trim(), 10) || 1;
        const alasan = parts.slice(4).join('#').trim();

        // Validate BKN
        const validation = validateLeaveRequest(emp, {
          jenis_cuti: jenisKey,
          jumlah_hari: jmlHari,
          kategori_detail: 'Pengajuan via WA',
          lampiran_nama: null
        });

        if (!validation.isValid) {
          botReply = `⚠️ *PENGAJUAN TIDAK SESUAI KETENTUAN:*\n` + validation.errors.map(e => `• ${e}`).join('\n');
        } else {
          // Calculate tgl selesai roughly
          const d = new Date(tglMulai);
          d.setDate(d.getDate() + jmlHari - 1);
          const tglSelesai = d.toISOString().slice(0, 10);

          const newId = `cuti-wa-${Date.now()}`;
          const noSurat = `800/CUTI-WA/${Math.floor(100+Math.random()*900)}/XI/2026`;

          db.prepare(`
            INSERT INTO leave_requests (
              id, nomor_surat, employee_id, jenis_cuti, alasan_cuti, kategori_detail,
              tanggal_mulai, tanggal_selesai, jumlah_hari, alamat_selama_cuti, no_telepon_cuti,
              status, atasan_id, ppk_id, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pertimbangan_atasan', ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime'))
          `).run(
            newId, noSurat, emp.id, jenisKey, alasan, 'WhatsApp Bot Submission',
            tglMulai, tglSelesai, jmlHari, 'Sesuai Domisili KTP', emp.no_hp,
            emp.atasan_id || 'emp-atasan-1', 'emp-ppk-1'
          );

          botReply = `✅ *BERHASIL! PENGAJUAN CUTI ANDA TELAH TERSIMPAN*
📄 *No. Surat:* ${noSurat}
📅 *Periode:* ${tglMulai} s.d ${tglSelesai} (${jmlHari} hari)
📝 *Jenis:* ${LEAVE_TYPES[jenisKey].name}
📌 *Status:* Diteruskan ke Atasan Langsung untuk pertimbangan.

Unduh formulir Lampiran II BKN sewaktu-waktu di dashboard LawetHub.`;
          generatedLink = `/ekspor-cuti/${newId}`;
          quickActions = [
            { label: '🖨️ Cetak / Unduh Formulir BKN', url: generatedLink },
            { label: '📊 Cek Status Cuti', value: '1' }
          ];
        }
      }
    } else {
      // Default Menu greeting (Diagram 1)
      botReply = `👋 Halo *${emp.nama}*!
Selamat datang di *Layanan Chatbot Cuti LawetHub* BKPSDM Kabupaten Kebumen.

Silakan pilih layanan:
*1.* 📊 Sisa Cuti
*2.* 📝 Form Cuti
*3.* ⚖️ Info Aturan Cuti BKN (Peraturan BKN No. 7/2021)

_Ketik angka 1 atau 2 untuk memulai._`;
      quickActions = [
        { label: '1. Sisa Cuti', value: '1' },
        { label: '2. Form Cuti', value: '2' }
      ];
    }

    // Save chat log
    db.prepare(`
      INSERT INTO chat_logs (phone, employee_id, sender, message)
      VALUES (?, ?, 'user', ?)
    `).run(emp.no_hp, emp.id, message);

    db.prepare(`
      INSERT INTO chat_logs (phone, employee_id, sender, message)
      VALUES (?, ?, 'bot', ?)
    `).run(emp.no_hp, emp.id, botReply);

    res.json({
      reply: botReply,
      quickActions,
      generatedLink
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend dist for production deployment
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Start express server
app.listen(PORT, () => {
  console.log(`[LawetHub Backend] Server running on http://localhost:${PORT}`);
});
