import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'lawethub_cuti.db');
const db = new DatabaseSync(dbPath);

export function initDatabase() {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      nip TEXT UNIQUE NOT NULL,
      nama TEXT NOT NULL,
      email TEXT,
      no_hp TEXT,
      password TEXT DEFAULT '123456',
      role TEXT NOT NULL, -- 'pegawai', 'atasan', 'ppk', 'admin'
      jenis_asn TEXT NOT NULL, -- 'PNS', 'PPPK'
      jabatan TEXT NOT NULL,
      pangkat_golongan TEXT,
      unit_kerja TEXT NOT NULL,
      instansi TEXT NOT NULL DEFAULT 'Pemerintah Kabupaten Kebumen',
      tmt_cpns TEXT NOT NULL,
      masa_kerja_tahun INTEGER NOT NULL,
      masa_kerja_bulan INTEGER NOT NULL,
      avatar TEXT,
      sisa_cuti_n2 INTEGER DEFAULT 0,
      sisa_cuti_n1 INTEGER DEFAULT 6,
      sisa_cuti_n INTEGER DEFAULT 12,
      cuti_besar_terakhir TEXT,
      cuti_sakit_terpakai INTEGER DEFAULT 0,
      jumlah_anak_lahir INTEGER DEFAULT 2,
      is_active INTEGER DEFAULT 1,
      atasan_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS leave_requests (
      id TEXT PRIMARY KEY,
      nomor_surat TEXT UNIQUE,
      employee_id TEXT NOT NULL,
      jenis_cuti TEXT NOT NULL, 
      alasan_cuti TEXT NOT NULL,
      kategori_detail TEXT, 
      anak_ke INTEGER,
      tanggal_mulai TEXT NOT NULL,
      tanggal_selesai TEXT NOT NULL,
      jumlah_hari INTEGER NOT NULL,
      alamat_selama_cuti TEXT NOT NULL,
      no_telepon_cuti TEXT NOT NULL,
      lampiran_nama TEXT,
      lampiran_url TEXT,
      status TEXT NOT NULL DEFAULT 'diajukan', 
      
      -- Pertimbangan Atasan Langsung
      atasan_id TEXT,
      atasan_aksi TEXT, -- 'DISETUJUI', 'PERUBAHAN', 'DITANGGUHKAN', 'TIDAK_DISETUJUI'
      atasan_catatan TEXT,
      atasan_tanggal TEXT,
      
      -- Keputusan Pejabat Yang Berwenang (PPK)
      ppk_id TEXT,
      ppk_aksi TEXT, -- 'DISETUJUI', 'PERUBAHAN', 'DITANGGUHKAN', 'TIDAK_DISETUJUI'
      ppk_catatan TEXT,
      ppk_tanggal TEXT,
      nomor_sk TEXT,
      
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    );

    CREATE TABLE IF NOT EXISTS public_holidays (
      id TEXT PRIMARY KEY,
      tanggal TEXT NOT NULL,
      keterangan TEXT NOT NULL,
      is_cuti_bersama INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS chat_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT,
      employee_id TEXT,
      sender TEXT, -- 'user', 'bot'
      message TEXT,
      payload TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed sample public holidays 2026/2025
  const countHolidays = db.prepare('SELECT count(*) as count FROM public_holidays').get().count;
  if (countHolidays === 0) {
    const holidays = [
      { id: 'h1', tanggal: '2026-01-01', keterangan: 'Tahun Baru 2026 Masehi', is_cuti_bersama: 0 },
      { id: 'h2', tanggal: '2026-01-16', keterangan: 'Isra Mikraj Nabi Muhammad SAW', is_cuti_bersama: 0 },
      { id: 'h3', tanggal: '2026-02-17', keterangan: 'Tahun Baru Imlek 2577 Kongzili', is_cuti_bersama: 0 },
      { id: 'h4', tanggal: '2026-03-20', keterangan: 'Hari Suci Nyepi Tahun Baru Saka 1948', is_cuti_bersama: 0 },
      { id: 'h5', tanggal: '2026-03-21', keterangan: 'Hari Raya Idul Fitri 1447 Hijriah', is_cuti_bersama: 0 },
      { id: 'h6', tanggal: '2026-03-22', keterangan: 'Hari Raya Idul Fitri 1447 Hijriah', is_cuti_bersama: 0 },
      { id: 'h7', tanggal: '2026-03-23', keterangan: 'Cuti Bersama Hari Raya Idul Fitri', is_cuti_bersama: 1 },
      { id: 'h8', tanggal: '2026-03-24', keterangan: 'Cuti Bersama Hari Raya Idul Fitri', is_cuti_bersama: 1 },
      { id: 'h9', tanggal: '2026-04-03', keterangan: 'Wafat Yesus Kristus', is_cuti_bersama: 0 },
      { id: 'h10', tanggal: '2026-05-01', keterangan: 'Hari Buruh Internasional', is_cuti_bersama: 0 },
      { id: 'h11', tanggal: '2026-05-14', keterangan: 'Kenaikan Yesus Kristus', is_cuti_bersama: 0 },
      { id: 'h12', tanggal: '2026-05-27', keterangan: 'Hari Raya Idul Adha 1447 Hijriah', is_cuti_bersama: 0 },
      { id: 'h13', tanggal: '2026-05-31', keterangan: 'Hari Raya Waisak 2570 BE', is_cuti_bersama: 0 },
      { id: 'h14', tanggal: '2026-06-01', keterangan: 'Hari Lahir Pancasila', is_cuti_bersama: 0 },
      { id: 'h15', tanggal: '2026-06-16', keterangan: 'Tahun Baru Islam 1448 Hijriah', is_cuti_bersama: 0 },
      { id: 'h16', tanggal: '2026-08-17', keterangan: 'Hari Kemerdekaan RI Ke-81', is_cuti_bersama: 0 },
      { id: 'h17', tanggal: '2026-08-25', keterangan: 'Maulid Nabi Muhammad SAW', is_cuti_bersama: 0 },
      { id: 'h18', tanggal: '2026-12-25', keterangan: 'Hari Raya Natal', is_cuti_bersama: 0 },
      { id: 'h19', tanggal: '2026-12-26', keterangan: 'Cuti Bersama Hari Raya Natal', is_cuti_bersama: 1 },
      // Today / November 2026 markers
      { id: 'h20', tanggal: '2026-11-10', keterangan: 'Hari Pahlawan Nasional (Peringatan Khusus)', is_cuti_bersama: 0 },
    ];
    const insertH = db.prepare('INSERT INTO public_holidays (id, tanggal, keterangan, is_cuti_bersama) VALUES (?, ?, ?, ?)');
    for (const h of holidays) {
      insertH.run(h.id, h.tanggal, h.keterangan, h.is_cuti_bersama);
    }
  }

  // Seed sample employees representing PNS, PPPK, Atasan Langsung, PPK, and Admin
  const countEmployees = db.prepare('SELECT count(*) as count FROM employees').get().count;
  if (countEmployees === 0) {
    const employees = [
      {
        id: 'emp-pns-1',
        nip: '199208152018021003',
        nama: 'Ahmad Fauzi, S.Kom.',
        email: 'ahmad.fauzi@kebumenkab.go.id',
        no_hp: '081234567890',
        role: 'pegawai',
        jenis_asn: 'PNS',
        jabatan: 'Pranata Komputer Ahli Muda',
        pangkat_golongan: 'Penata (III/c)',
        unit_kerja: 'Dinas Komunikasi dan Informatika',
        instansi: 'Pemerintah Kabupaten Kebumen',
        tmt_cpns: '2018-02-01',
        masa_kerja_tahun: 8,
        masa_kerja_bulan: 9,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        sisa_cuti_n2: 0,
        sisa_cuti_n1: 6,
        sisa_cuti_n: 12,
        cuti_besar_terakhir: null,
        cuti_sakit_terpakai: 0,
        jumlah_anak_lahir: 2,
        atasan_id: 'emp-atasan-1'
      },
      {
        id: 'emp-pppk-1',
        nip: '199505122023212015',
        nama: 'Siti Rahmawati, S.Pd.',
        email: 'siti.rahmawati@kebumenkab.go.id',
        no_hp: '085678901234',
        role: 'pegawai',
        jenis_asn: 'PPPK',
        jabatan: 'Guru Ahli Pertama',
        pangkat_golongan: 'Golongan IX',
        unit_kerja: 'SMP Negeri 1 Kebumen',
        instansi: 'Pemerintah Kabupaten Kebumen',
        tmt_cpns: '2023-03-01',
        masa_kerja_tahun: 3,
        masa_kerja_bulan: 8,
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        sisa_cuti_n2: 0,
        sisa_cuti_n1: 4,
        sisa_cuti_n: 12,
        cuti_besar_terakhir: null,
        cuti_sakit_terpakai: 1,
        jumlah_anak_lahir: 1,
        atasan_id: 'emp-atasan-1'
      },
      {
        id: 'emp-atasan-1',
        nip: '197904122005011006',
        nama: 'Bambang Trianto, S.T., M.Eng.',
        email: 'bambang.trianto@kebumenkab.go.id',
        no_hp: '081328901122',
        role: 'atasan',
        jenis_asn: 'PNS',
        jabatan: 'Kepala Bidang Aplikasi dan Informatika',
        pangkat_golongan: 'Pembina (IV/a)',
        unit_kerja: 'Dinas Komunikasi dan Informatika',
        instansi: 'Pemerintah Kabupaten Kebumen',
        tmt_cpns: '2005-01-01',
        masa_kerja_tahun: 21,
        masa_kerja_bulan: 10,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        sisa_cuti_n2: 0,
        sisa_cuti_n1: 6,
        sisa_cuti_n: 12,
        cuti_besar_terakhir: '2021-06-15',
        cuti_sakit_terpakai: 0,
        jumlah_anak_lahir: 3,
        atasan_id: 'emp-ppk-1'
      },
      {
        id: 'emp-ppk-1',
        nip: '197009181996031002',
        nama: 'Drs. H. Sukamto, M.Si.',
        email: 'sukamto.bkpsdm@kebumenkab.go.id',
        no_hp: '081299887766',
        role: 'ppk',
        jenis_asn: 'PNS',
        jabatan: 'Kepala BKPSDM (Pejabat Pembina Kepegawaian)',
        pangkat_golongan: 'Pembina Utama Madya (IV/d)',
        unit_kerja: 'Badan Kepegawaian dan Pengembangan SDM',
        instansi: 'Pemerintah Kabupaten Kebumen',
        tmt_cpns: '1996-03-01',
        masa_kerja_tahun: 30,
        masa_kerja_bulan: 8,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        sisa_cuti_n2: 0,
        sisa_cuti_n1: 6,
        sisa_cuti_n: 12,
        cuti_besar_terakhir: '2020-08-10',
        cuti_sakit_terpakai: 0,
        jumlah_anak_lahir: 3,
        atasan_id: null
      },
      {
        id: 'emp-admin-1',
        nip: '198811052010012011',
        nama: 'Dewi Lestari, S.A.P.',
        email: 'dewi.admin@kebumenkab.go.id',
        no_hp: '081765432109',
        role: 'admin',
        jenis_asn: 'PNS',
        jabatan: 'Analis Kepegawaian Muda',
        pangkat_golongan: 'Penata Tk. I (III/d)',
        unit_kerja: 'Bidang Mutasi dan Status Kepegawaian BKPSDM',
        instansi: 'Pemerintah Kabupaten Kebumen',
        tmt_cpns: '2010-01-01',
        masa_kerja_tahun: 16,
        masa_kerja_bulan: 10,
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
        sisa_cuti_n2: 0,
        sisa_cuti_n1: 5,
        sisa_cuti_n: 12,
        cuti_besar_terakhir: null,
        cuti_sakit_terpakai: 0,
        jumlah_anak_lahir: 2,
        atasan_id: 'emp-ppk-1'
      }
    ];

    const insertEmp = db.prepare(`
      INSERT INTO employees (
        id, nip, nama, email, no_hp, role, jenis_asn, jabatan, pangkat_golongan,
        unit_kerja, instansi, tmt_cpns, masa_kerja_tahun, masa_kerja_bulan,
        avatar, sisa_cuti_n2, sisa_cuti_n1, sisa_cuti_n, cuti_besar_terakhir,
        cuti_sakit_terpakai, jumlah_anak_lahir, atasan_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const e of employees) {
      insertEmp.run(
        e.id, e.nip, e.nama, e.email, e.no_hp, e.role, e.jenis_asn, e.jabatan, e.pangkat_golongan,
        e.unit_kerja, e.instansi, e.tmt_cpns, e.masa_kerja_tahun, e.masa_kerja_bulan,
        e.avatar, e.sisa_cuti_n2, e.sisa_cuti_n1, e.sisa_cuti_n, e.cuti_besar_terakhir,
        e.cuti_sakit_terpakai, e.jumlah_anak_lahir, e.atasan_id
      );
    }
  }

  // Seed sample leave requests with various status steps
  const countRequests = db.prepare('SELECT count(*) as count FROM leave_requests').get().count;
  if (countRequests === 0) {
    const sampleRequests = [
      {
        id: 'cuti-2026-001',
        nomor_surat: '800/CUTI-THN/001/XI/2026',
        employee_id: 'emp-pns-1',
        jenis_cuti: 'cuti_tahunan',
        alasan_cuti: 'Keperluan keluarga di luar kota dan mendampingi orang tua kontrol kesehatan',
        kategori_detail: 'Keperluan Keluarga',
        anak_ke: null,
        tanggal_mulai: '2026-11-16',
        tanggal_selesai: '2026-11-18',
        jumlah_hari: 3,
        alamat_selama_cuti: 'Jl. Merdeka No. 45, Purwokerto, Jawa Tengah',
        no_telepon_cuti: '081234567890',
        lampiran_nama: null,
        lampiran_url: null,
        status: 'pertimbangan_atasan',
        atasan_id: 'emp-atasan-1',
        atasan_aksi: null,
        atasan_catatan: null,
        atasan_tanggal: null,
        ppk_id: 'emp-ppk-1',
        ppk_aksi: null,
        ppk_catatan: null,
        ppk_tanggal: null,
        nomor_sk: null,
        created_at: '2026-11-02 09:30:00'
      },
      {
        id: 'cuti-2026-002',
        nomor_surat: '800/CUTI-SKT/002/X/2026',
        employee_id: 'emp-pppk-1',
        jenis_cuti: 'cuti_sakit',
        alasan_cuti: 'Mengalami demam berdarah dan memerlukan rawat inap di RSUD',
        kategori_detail: 'Rawat Inap Dokter',
        anak_ke: null,
        tanggal_mulai: '2026-10-12',
        tanggal_selesai: '2026-10-15',
        jumlah_hari: 4,
        alamat_selama_cuti: 'RSUD Dr. Soedirman Kebumen, Bangsal Teratai',
        no_telepon_cuti: '085678901234',
        lampiran_nama: 'surat_keterangan_sakit_rsud.pdf',
        lampiran_url: '/uploads/surat_sakit_demo.pdf',
        status: 'disetujui',
        atasan_id: 'emp-atasan-1',
        atasan_aksi: 'DISETUJUI',
        atasan_catatan: 'Disetujui, semoga lekas sembuh dan pulih kembali.',
        atasan_tanggal: '2026-10-12 11:00:00',
        ppk_id: 'emp-ppk-1',
        ppk_aksi: 'DISETUJUI',
        ppk_catatan: 'Diberikan hak cuti sakit sesuai ketentuan Peraturan BKN No 7/2021.',
        ppk_tanggal: '2026-10-12 14:15:00',
        nomor_sk: '800/SK-CUTI/042/BKPSDM/2026',
        created_at: '2026-10-12 08:00:00'
      },
      {
        id: 'cuti-2026-003',
        nomor_surat: '800/CUTI-BSR/003/IX/2026',
        employee_id: 'emp-atasan-1',
        jenis_cuti: 'cuti_besar',
        alasan_cuti: 'Melaksanakan Ibadah Umroh dan keperluan keagamaan keluarga',
        kategori_detail: 'Ibadah Keagamaan',
        anak_ke: null,
        tanggal_mulai: '2026-09-01',
        tanggal_selesai: '2026-09-20',
        jumlah_hari: 15,
        alamat_selama_cuti: 'Madinah & Makkah Al-Mukarramah',
        no_telepon_cuti: '081328901122',
        lampiran_nama: 'jadwal_keberangkatan_travel.pdf',
        lampiran_url: '/uploads/travel_haji_umroh.pdf',
        status: 'disetujui',
        atasan_id: 'emp-ppk-1',
        atasan_aksi: 'DISETUJUI',
        atasan_catatan: 'Disetujui untuk menjalankan ibadah dengan lancar.',
        atasan_tanggal: '2026-08-20 10:00:00',
        ppk_id: 'emp-ppk-1',
        ppk_aksi: 'DISETUJUI',
        ppk_catatan: 'SK Cuti Besar diterbitkan tanpa tunjangan jabatan selama masa cuti.',
        ppk_tanggal: '2026-08-21 09:00:00',
        nomor_sk: '800/SK-CUTI/039/BKPSDM/2026',
        created_at: '2026-08-19 14:00:00'
      }
    ];

    const insertReq = db.prepare(`
      INSERT INTO leave_requests (
        id, nomor_surat, employee_id, jenis_cuti, alasan_cuti, kategori_detail, anak_ke,
        tanggal_mulai, tanggal_selesai, jumlah_hari, alamat_selama_cuti, no_telepon_cuti,
        lampiran_nama, lampiran_url, status, atasan_id, atasan_aksi, atasan_catatan,
        atasan_tanggal, ppk_id, ppk_aksi, ppk_catatan, ppk_tanggal, nomor_sk, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const r of sampleRequests) {
      insertReq.run(
        r.id, r.nomor_surat, r.employee_id, r.jenis_cuti, r.alasan_cuti, r.kategori_detail, r.anak_ke,
        r.tanggal_mulai, r.tanggal_selesai, r.jumlah_hari, r.alamat_selama_cuti, r.no_telepon_cuti,
        r.lampiran_nama, r.lampiran_url, r.status, r.atasan_id, r.atasan_aksi, r.atasan_catatan,
        r.atasan_tanggal, r.ppk_id, r.ppk_aksi, r.ppk_catatan, r.ppk_tanggal, r.nomor_sk, r.created_at
      );
    }
  }

  return db;
}

export default db;
