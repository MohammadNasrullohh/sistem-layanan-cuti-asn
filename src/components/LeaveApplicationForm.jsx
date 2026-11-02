import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Send, 
  ArrowRight, 
  ShieldCheck, 
  X,
  FileCheck2,
  Printer,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LeaveApplicationForm({ setActiveTab, onSelectRequestForExport }) {
  const { currentUser, refreshCurrentUserData } = useAuth();
  
  // Form State
  const [jenisCuti, setJenisCuti] = useState('cuti_tahunan');
  const [kategoriDetail, setKategoriDetail] = useState('');
  const [anakKe, setAnakKe] = useState(1);
  const [tanggalMulai, setTanggalMulai] = useState('2026-11-20');
  const [tanggalSelesai, setTanggalSelesai] = useState('2026-11-24');
  const [jumlahHari, setJumlahHari] = useState(3);
  const [alasanCuti, setAlasanCuti] = useState('');
  const [alamatSelamaCuti, setAlamatSelamaCuti] = useState('');
  const [noTeleponCuti, setNoTeleponCuti] = useState('');
  
  // File Upload State
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState('');
  const [uploading, setUploading] = useState(false);

  // Validation State (Flowchart: Sesuai ketentuan?)
  const [validationResult, setValidationResult] = useState({ isValid: true, errors: [], warnings: [] });
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  // Initialize phone & address from current user
  useEffect(() => {
    if (currentUser) {
      setNoTeleponCuti(currentUser.no_hp || '');
      setAlamatSelamaCuti('Jl. Pahlawan No. 25, Kebumen, Jawa Tengah');
    }
  }, [currentUser]);

  // Calculate working days between two dates
  useEffect(() => {
    if (tanggalMulai && tanggalSelesai) {
      const start = new Date(tanggalMulai);
      const end = new Date(tanggalSelesai);
      if (end >= start) {
        let workDays = 0;
        let cur = new Date(start);
        while (cur <= end) {
          const day = cur.getDay();
          // Exclude Saturday (6) and Sunday (0)
          if (day !== 0 && day !== 6) {
            workDays++;
          }
          cur.setDate(cur.getDate() + 1);
        }
        setJumlahHari(workDays || 1);
      } else {
        setJumlahHari(0);
      }
    }
  }, [tanggalMulai, tanggalSelesai]);

  // Real-time BKN Compliance Validation ("Sesuai ketentuan?")
  useEffect(() => {
    if (!currentUser) return;

    const errors = [];
    const warnings = [];

    // 1. Validasi ASN Status (PNS vs PPPK)
    if (currentUser.jenis_asn === 'PPPK') {
      const allowedPPPK = ['cuti_tahunan', 'cuti_sakit', 'cuti_melahirkan', 'cuti_bersama'];
      if (!allowedPPPK.includes(jenisCuti)) {
        errors.push(
          `Berdasarkan Buku Saku BKN 2024 hal. 4, Pegawai PPPK TIDAK BERHAK atas jenis cuti ini. PPPK hanya berhak atas Cuti Tahunan, Cuti Sakit, Cuti Melahirkan, dan Cuti Bersama.`
        );
      }
    }

    // 2. Validasi Cuti Tahunan
    if (jenisCuti === 'cuti_tahunan') {
      if (currentUser.masa_kerja_tahun < 1) {
        errors.push(`Syarat Cuti Tahunan (Hal. 5): PNS/PPPK harus telah bekerja paling kurang 1 (satu) tahun secara terus-menerus.`);
      }
      const totalSisa = (currentUser.sisa_cuti_n2 || 0) + (currentUser.sisa_cuti_n1 || 0) + (currentUser.sisa_cuti_n || 0);
      if (jumlahHari > totalSisa) {
        errors.push(`Jumlah hari cuti yang diminta (${jumlahHari} hari) melebihi total sisa cuti tahunan Anda (${totalSisa} hari).`);
      }
      if (currentUser.cuti_besar_terakhir && new Date(currentUser.cuti_besar_terakhir).getFullYear() === new Date().getFullYear()) {
        errors.push(`PNS yang menggunakan hak atas cuti besar tidak berhak atas cuti tahunan dalam tahun yang bersangkutan (Hal. 8).`);
      }
    }

    // 3. Validasi Cuti Besar
    if (jenisCuti === 'cuti_besar') {
      const isHaji = (kategoriDetail === 'ibadah_haji_pertama');
      const isAnak4 = (kategoriDetail === 'kelahiran_anak_4_plus');

      if (!isHaji && !isAnak4 && currentUser.masa_kerja_tahun < 5) {
        errors.push(
          `Syarat Cuti Besar (Hal. 8): PNS harus telah bekerja paling singkat 5 (lima) tahun secara terus-menerus. Masa kerja Anda saat ini baru ${currentUser.masa_kerja_tahun} tahun.`
        );
      }
      if (isHaji) {
        warnings.push('PNS yang melaksanakan Ibadah Haji untuk pertama kali dikecualikan dari syarat 5 tahun cuti besar (Hal. 23). Wajib melampirkan jadwal kloter.');
        if (!attachmentName) {
          errors.push('Cuti Ibadah Haji pertama wajib melampirkan bukti Jadwal Keberangkatan / Kloter resmi.');
        }
      }
      if (jumlahHari > 90) {
        errors.push('Lamanya hak cuti besar paling lama 3 bulan / 90 hari kalender (Hal. 8).');
      }
      warnings.push('Perhatian: Mengambil Cuti Besar akan menggugurkan sisa hak Cuti Tahunan Anda tahun ini (Hal. 8).');
      warnings.push('Selama Cuti Besar, Anda TIDAK menerima Tunjangan Jabatan dan TPP (Hal. 24).');
    }

    // 4. Validasi Cuti Sakit
    if (jenisCuti === 'cuti_sakit') {
      if (!attachmentName) {
        errors.push('Cuti Sakit wajib melampirkan Surat Keterangan Dokter yang memiliki izin praktek resmi (Hal. 10).');
      }
      if (kategoriDetail === 'keguguran' && jumlahHari > 45) {
        errors.push('Cuti sakit untuk keguguran kandungan paling lama 1 1/2 bulan (45 hari) (Hal. 12).');
      }
    }

    // 5. Validasi Cuti Melahirkan
    if (jenisCuti === 'cuti_melahirkan') {
      if (anakKe > 3) {
        errors.push(
          `Untuk kelahiran anak ke-4 dan seterusnya, hak yang diberikan adalah Cuti Besar (Hal. 13 & 15). Silakan pilih "Cuti Besar" dengan kategori Kelahiran Anak ke-4+.`
        );
      }
      if (jumlahHari > 90) {
        errors.push('Lamanya cuti melahirkan diberikan paling lama 3 bulan / 90 hari (Hal. 13).');
      }
    }

    // 6. Validasi Cuti Alasan Penting
    if (jenisCuti === 'cuti_alasan_penting') {
      if (jumlahHari > 30) {
        errors.push('Lamanya cuti karena alasan penting diberikan paling lama 1 bulan (30 hari) (Hal. 17).');
      }
      if (kategoriDetail === 'istri_melahirkan' && !attachmentName) {
        errors.push('PNS laki-laki mendampingi istri melahirkan wajib melampirkan surat rawat inap dari rumah sakit/fasilitas kesehatan (Hal. 15).');
      }
    }

    // 7. Validasi CLTN
    if (jenisCuti === 'cltn') {
      if (currentUser.masa_kerja_tahun < 5) {
        errors.push('Syarat CLTN (Hal. 19): PNS harus telah bekerja paling singkat 5 tahun secara terus-menerus.');
      }
      warnings.push('Peringatan: Menjalani CLTN berakibat diberhentikan dari jabatan, tanpa gaji & tunjangan, dan masa kerja terhenti (Hal. 20).');
    }

    // Basic date check
    if (jumlahHari <= 0) {
      errors.push('Tanggal selesai harus sama atau setelah tanggal mulai cuti.');
    }

    setValidationResult({
      isValid: errors.length === 0,
      errors,
      warnings
    });
  }, [jenisCuti, kategoriDetail, anakKe, jumlahHari, tanggalMulai, tanggalSelesai, attachmentName, currentUser]);

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setAttachment(data.fileUrl);
        setAttachmentName(data.fileName);
      }
    } catch (err) {
      console.error('Upload error:', err);
      // Fallback local filename for demo
      setAttachmentName(file.name);
      setAttachment(`/uploads/${file.name}`);
    } finally {
      setUploading(false);
    }
  };

  // Submit Leave Request (Simpan pengajuan)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validationResult.isValid) return;

    setSubmitting(true);
    try {
      const payload = {
        employee_id: currentUser.id,
        jenis_cuti: jenisCuti,
        alasan_cuti: alasanCuti || 'Permohonan cuti kedinasan/pribadi sesuai regulasi',
        kategori_detail: kategoriDetail,
        anak_ke: jenisCuti === 'cuti_melahirkan' ? anakKe : null,
        tanggal_mulai: tanggalMulai,
        tanggal_selesai: tanggalSelesai,
        jumlah_hari: jumlahHari,
        alamat_selama_cuti: alamatSelamaCuti,
        no_telepon_cuti: noTeleponCuti,
        lampiran_nama: attachmentName,
        lampiran_url: attachment
      };

      const res = await fetch('/api/leave-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmittedRequest({
          id: data.requestId,
          nomor_surat: data.nomor_surat,
          ...payload
        });
        refreshCurrentUserData();

        // Celebration confetti
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } else {
        alert(data.message || 'Gagal menyimpan pengajuan');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Title Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Formulir Elektronik (Menu 2)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Pengajuan Permohonan Cuti ASN
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Standar Format Formulir Permintaan dan Pemberian Cuti Peraturan BKN No. 7 Tahun 2021
          </p>
        </div>

        <button
          onClick={() => setActiveTab('sisa-cuti')}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
        >
          <Clock className="w-3.5 h-3.5" />
          Lihat Sisa Cuti
        </button>
      </div>

      {/* Success View (Step: Ekspor Form Cuti) */}
      {submittedRequest ? (
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-lg shadow-emerald-500/5 space-y-6 text-center animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Permohonan Cuti Berhasil Disimpan!
            </h2>
            <p className="text-sm text-slate-600">
              Pengajuan Anda telah tercatat dalam sistem dan otomatis diteruskan ke Atasan Langsung untuk verifikasi pertimbangan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Nomor Registrasi:</span>
              <strong className="text-slate-900">{submittedRequest.nomor_surat}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Jenis Cuti:</span>
              <strong className="text-slate-900 capitalize">{submittedRequest.jenis_cuti.replace('_', ' ')}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Durasi:</span>
              <strong className="text-slate-900">{submittedRequest.jumlah_hari} Hari Kerja</strong>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Periode:</span>
              <strong className="text-slate-900">{submittedRequest.tanggal_mulai} s.d. {submittedRequest.tanggal_selesai}</strong>
            </div>
          </div>

          {/* Action buttons (Flowchart step: Ekspor form cuti) */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onSelectRequestForExport(submittedRequest.id)}
              className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Ekspor Formulir Lampiran II BKN (Cetak / PDF)
            </button>

            <button
              onClick={() => {
                setSubmittedRequest(null);
                setAlasanCuti('');
                setAttachment(null);
                setAttachmentName('');
              }}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all"
            >
              Buat Pengajuan Baru
            </button>
          </div>
        </div>
      ) : (
        /* Form Section */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-xs space-y-8">
          
          {/* Bagian I: Data Pemohon (Readonly Information per BKN standard) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-extrabold">I</span>
                <span>Data Pegawai Pemohon</span>
              </h2>
              <span className="text-xs text-slate-400">Terisi Otomatis dari Profil</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400">Nama Lengkap:</div>
                <div className="font-bold text-slate-800 text-sm mt-0.5">{currentUser.nama}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400">NIP & Golongan:</div>
                <div className="font-bold text-slate-800 text-sm mt-0.5">
                  {currentUser.nip} • {currentUser.pangkat_golongan || 'Golongan IX'}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400">Jabatan & Jenis ASN:</div>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {currentUser.jabatan} ({currentUser.jenis_asn})
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="text-slate-400">Unit Kerja & Masa Kerja:</div>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {currentUser.unit_kerja} • {currentUser.masa_kerja_tahun} Thn {currentUser.masa_kerja_bulan} Bln
                </div>
              </div>
            </div>
          </div>

          {/* Bagian II: Jenis Cuti Yang Diambil */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-extrabold">II</span>
                <span>Jenis Cuti Yang Diambil</span>
              </h2>
              <span className="text-xs text-orange-600 font-semibold">Pilih salah satu</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'cuti_tahunan', name: 'Cuti Tahunan', tag: '12 Hari Kerja', desc: 'Min 1 thn masa kerja' },
                { id: 'cuti_besar', name: 'Cuti Besar', tag: 'Maks. 3 Bulan', desc: 'Min 5 thn masa kerja (PNS)' },
                { id: 'cuti_sakit', name: 'Cuti Sakit', tag: 'Surat Dokter', desc: 'PNS & PPPK berhak' },
                { id: 'cuti_melahirkan', name: 'Cuti Melahirkan', tag: 'Maks. 3 Bulan', desc: 'Anak ke-1 s.d ke-3' },
                { id: 'cuti_alasan_penting', name: 'Cuti Alasan Penting', tag: 'Maks. 1 Bulan', desc: 'Keluarga, Nikah, Musibah' },
                { id: 'cuti_bersama', name: 'Cuti Bersama', tag: 'Keppres', desc: 'Tidak potong tahunan' },
                { id: 'cltn', name: 'CLTN', tag: 'Maks. 3 Tahun', desc: 'Di Luar Tanggungan Negara' }
              ].map((item) => (
                <label
                  key={item.id}
                  className={`relative p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    jenisCuti === item.id
                      ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-xs text-slate-800">{item.name}</span>
                    <input
                      type="radio"
                      name="jenis_cuti"
                      value={item.id}
                      checked={jenisCuti === item.id}
                      onChange={() => {
                        setJenisCuti(item.id);
                        setKategoriDetail('');
                      }}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{item.desc}</span>
                    <span className="font-semibold text-orange-700 bg-orange-100/70 px-1.5 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Matriks Penghasilan Saat Cuti Live Preview (Hal. 24 Buku Saku BKN 2024) */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Status Hak Penghasilan (Hal. 24 BKN):</span>
                <span className="font-bold text-slate-900">
                  {jenisCuti === 'cltn' ? 'Dinonaktifkan Selama Cuti (NOL Rupiah)' :
                   jenisCuti === 'cuti_besar' ? 'Gaji Pokok, Keluarga & Pangan Utuh (Tunj. Jabatan & TPP: TIDAK DAPAT)' :
                   'Menerima Penghasilan Penuh Tanpa Pengurangan Tunjangan'}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                jenisCuti === 'cltn' ? 'bg-rose-100 text-rose-800' :
                jenisCuti === 'cuti_besar' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {jenisCuti === 'cltn' ? 'Tanpa Gaji' : jenisCuti === 'cuti_besar' ? 'Tanpa Tunjangan Jabatan' : 'Gaji Penuh Utuh'}
              </span>
            </div>

            {/* Dynamic Specific Options based on chosen leave */}
            {jenisCuti === 'cuti_besar' && (
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2 text-xs">
                <label className="font-bold text-purple-900 block">Kategori Khusus Cuti Besar:</label>
                <select
                  value={kategoriDetail}
                  onChange={(e) => setKategoriDetail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-purple-200 bg-white text-xs font-medium text-slate-800 focus:ring-2 focus:ring-purple-400"
                >
                  <option value="">Pilih Kategori Cuti Besar (Umum 5 Tahun Kerja)</option>
                  <option value="ibadah_haji_pertama">Ibadah Haji Pertama Kali (Dikecualikan Syarat 5 Tahun - Hal. 23)</option>
                  <option value="kelahiran_anak_4_plus">Kelahiran Anak ke-4 dan seterusnya (Dikecualikan Syarat 5 Tahun - Hal. 15)</option>
                  <option value="keagamaan_lain">Kepentingan Ibadah Keagamaan Lainnya</option>
                </select>
              </div>
            )}

            {jenisCuti === 'cuti_melahirkan' && (
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2 text-xs">
                <label className="font-bold text-teal-900 block">Kelahiran Anak ke berapa?</label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setAnakKe(n)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        anakKe === n
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-white border border-teal-200 text-teal-800 hover:bg-teal-100'
                      }`}
                    >
                      Anak ke-{n}
                    </button>
                  ))}
                </div>
                {anakKe > 3 && (
                  <p className="text-[11px] text-teal-800 font-medium">
                    * Catatan Regulasi (Hal. 15): Untuk kelahiran anak ke-4 dan seterusnya, hak yang diberikan adalah Cuti Besar.
                  </p>
                )}
              </div>
            )}

            {jenisCuti === 'cuti_sakit' && (
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2 text-xs">
                <label className="font-bold text-rose-900 block">Kategori Kondisi Sakit:</label>
                <select
                  value={kategoriDetail}
                  onChange={(e) => setKategoriDetail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-rose-200 bg-white text-xs font-medium text-slate-800 focus:ring-2 focus:ring-rose-400"
                >
                  <option value="sakit_biasa">Sakit Biasa / Rawat Jalan (Surat Dokter Berizin)</option>
                  <option value="rawat_inap">Rawat Inap Rumah Sakit</option>
                  <option value="keguguran">Gugur Kandungan (Maksimal 1 1/2 Bulan - Hal. 12)</option>
                  <option value="kecelakaan_kerja">Kecelakaan Saat Menjalankan Tugas (S.d. Sembuh - Hal. 12)</option>
                </select>
              </div>
            )}

            {jenisCuti === 'cuti_alasan_penting' && (
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-xs">
                <label className="font-bold text-amber-900 block">Alasan Penting (Hal. 16 Buku Saku BKN 2024):</label>
                <select
                  value={kategoriDetail}
                  onChange={(e) => setKategoriDetail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-200 bg-white text-xs font-medium text-slate-800 focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Pilih Alasan Penting Sesuai Regulasi...</option>
                  <option value="keluarga_sakit_meninggal">Keluarga Inti (Ortu, Suami/Istri, Anak, Adik, Kakak, Mertua) Sakit Keras / Meninggal</option>
                  <option value="perkawinan">Melangsungkan Perkawinan (Cuti Nikah)</option>
                  <option value="istri_melahirkan">PNS Laki-laki: Istri Melahirkan / Operasi Caesar (Surat Rawat Inap)</option>
                  <option value="bencana_alam">Musibah Kebakaran Rumah atau Bencana Alam</option>
                  <option value="kondisi_kejiwaan">Penempatan Rawan/Berbahaya (Pemulihan Kejiwaan)</option>
                </select>
              </div>
            )}
          </div>

          {/* Bagian III & IV: Alasan & Lamanya Cuti */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-extrabold">III</span>
                <span>Alasan & Durasi Pelaksanaan Cuti</span>
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Alasan Cuti Lengkap: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="3"
                  value={alasanCuti}
                  onChange={(e) => setAlasanCuti(e.target.value)}
                  placeholder="Contoh: Mengurus keperluan keluarga mendesak dan mendampingi orang tua kontrol medis di rumah sakit..."
                  required
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Mulai Cuti:</label>
                  <input
                    type="date"
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Selesai Cuti:</label>
                  <input
                    type="date"
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jumlah Hari Kerja:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={jumlahHari}
                      onChange={(e) => setJumlahHari(parseInt(e.target.value, 10) || 1)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-orange-600 focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-slate-500 shrink-0">Hari Kerja</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Alamat Selama Menjalankan Cuti:</label>
                  <input
                    type="text"
                    value={alamatSelamaCuti}
                    onChange={(e) => setAlamatSelamaCuti(e.target.value)}
                    placeholder="Alamat domisili selama cuti"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">No. Telepon / WhatsApp Aktif:</label>
                  <input
                    type="text"
                    value={noTeleponCuti}
                    onChange={(e) => setNoTeleponCuti(e.target.value)}
                    placeholder="0812xxxx"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Dokumen Lampiran Pendukung */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Lampiran Dokumen Bukti (Surat Dokter / Tiket Haji / Surat Rawat Inap):
                </label>
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-orange-300 transition-colors bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      {attachmentName ? (
                        <div className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                          <span>{attachmentName}</span>
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">Terunggah</span>
                        </div>
                      ) : (
                        <div className="text-slate-500 text-xs">
                          Unggah berkas PDF / Foto (Maks. 5MB)
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400">Wajib untuk Cuti Sakit, Cuti Haji, & CAP Istri Melahirkan</div>
                    </div>
                  </div>

                  <label className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs cursor-pointer shadow-xs transition-colors">
                    {uploading ? 'Mengunggah...' : 'Pilih Berkas'}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* STEP FLOWCHART: SESUAI KETENTUAN? -> TAMPIL PESAN ERROR / STATUS SESUAI */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pemeriksaan Otomatis Sistem BKN (Sesuai Ketentuan?)
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                validationResult.isValid 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-rose-100 text-rose-800 animate-pulse'
              }`}>
                {validationResult.isValid ? '✓ Memenuhi Regulasi BKN' : '✕ Tidak Sesuai Ketentuan'}
              </span>
            </div>

            {/* Error Message Box (Flowchart: Tampil pesan error) */}
            {!validationResult.isValid && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2 animate-in fade-in">
                <div className="font-bold flex items-center gap-2 text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Pengajuan Tidak Memenuhi Ketentuan Peraturan BKN No. 7 Tahun 2021:</span>
                </div>
                <ul className="list-disc pl-6 space-y-1 text-[11px] text-rose-700">
                  {validationResult.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warning Message Box */}
            {validationResult.warnings.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-2 text-amber-800">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Catatan Penting Regulasi:</span>
                </div>
                <ul className="list-disc pl-6 space-y-1 text-[11px] text-amber-800">
                  {validationResult.warnings.map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Actions (Step: Simpan Pengajuan) */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs md:text-sm transition-all"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={!validationResult.isValid || submitting}
              className={`px-7 py-3 rounded-2xl text-white font-bold text-xs md:text-sm shadow-md transition-all flex items-center gap-2 ${
                validationResult.isValid && !submitting
                  ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/20 active:scale-[0.98]'
                  : 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
              }`}
            >
              <Send className="w-4 h-4" />
              {submitting ? 'Menyimpan...' : 'Simpan Pengajuan Cuti'}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
