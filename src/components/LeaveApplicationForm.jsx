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
  Info,
  HeartPulse,
  Baby,
  Briefcase,
  Users,
  ShieldAlert,
  Check,
  Building,
  User,
  ArrowUpRight,
  ChevronRight
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
    <div className="w-full space-y-8 pb-16">
      
      {/* Official Government Form Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-slate-900 text-amber-300 text-xs font-black tracking-wide border border-slate-800">
              Anak Lampiran II BKN
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Peraturan BKN No. 7 Tahun 2021
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Formulir Permintaan dan Pemberian Cuti ASN
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Standar format dokumen resmi pengajuan izin cuti Aparatur Sipil Negara Pemerintah Kabupaten Kebumen
          </p>
        </div>

        <button
          onClick={() => setActiveTab('sisa-cuti')}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 border border-slate-200"
        >
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          Lihat Sisa Cuti N
        </button>
      </div>

      {/* Success View (Step: Ekspor Form Cuti) */}
      {submittedRequest ? (
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-lg shadow-emerald-500/5 space-y-6 text-center animate-in fade-in zoom-in-95 max-w-3xl mx-auto">
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
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer border border-slate-700"
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
              className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all cursor-pointer border border-slate-200"
            >
              Buat Pengajuan Baru
            </button>
          </div>
        </div>
      ) : (
        /* Form Section (Widescreen 2-Column Responsive Layout) */
        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: FORM SECTIONS (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-2xs space-y-8">
          
          {/* Bagian I: Data Pemohon (Executive Identity Pass Card) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-amber-400 border border-slate-700 flex items-center justify-center text-xs font-black shadow-xs font-mono">I</span>
                <span>Data Pegawai Pemohon</span>
              </h2>
              <span className="text-[11px] font-semibold text-slate-400">Terisi Otomatis dari Profil LawetHub</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'}
                  alt={currentUser.nama}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-orange-500/30 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                      {currentUser.nama}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      currentUser.jenis_asn === 'PNS' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {currentUser.jenis_asn}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                      {currentUser.pangkat_golongan || 'Golongan IX'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 truncate">
                    NIP: <span className="font-semibold text-slate-800">{currentUser.nip}</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto grid grid-cols-2 md:flex md:items-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200 text-xs text-slate-600">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Jabatan:</div>
                  <div className="font-bold text-slate-800 text-xs truncate max-w-[170px]">{currentUser.jabatan}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Unit Kerja:</div>
                  <div className="font-bold text-slate-800 text-xs truncate max-w-[170px]">{currentUser.unit_kerja}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs col-span-2 md:col-span-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Masa Kerja:</div>
                  <div className="font-bold text-orange-600 text-xs">
                    {currentUser.masa_kerja_tahun} Thn {currentUser.masa_kerja_bulan} Bln
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian II: Jenis Cuti Yang Diambil */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-amber-400 border border-slate-700 flex items-center justify-center text-xs font-black shadow-xs font-mono">II</span>
                <span>Jenis Cuti Yang Diambil</span>
              </h2>
              <span className="text-xs font-bold text-amber-600">Pilih salah satu (7 Kategori BKN)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {[
                { 
                  id: 'cuti_tahunan', 
                  name: 'Cuti Tahunan', 
                  icon: Calendar,
                  tag: '12 Hari Kerja', 
                  tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                  desc: 'Min. 1 tahun masa kerja ASN',
                  lawRef: 'Hal. 5 BKN 2024'
                },
                { 
                  id: 'cuti_besar', 
                  name: 'Cuti Besar', 
                  icon: Briefcase,
                  tag: 'Maks. 3 Bulan', 
                  tagColor: 'bg-purple-100 text-purple-800 border-purple-200',
                  desc: 'Min. 5 tahun kerja (PNS)',
                  lawRef: 'Hal. 8 BKN 2024'
                },
                { 
                  id: 'cuti_sakit', 
                  name: 'Cuti Sakit', 
                  icon: HeartPulse,
                  tag: 'Surat Dokter', 
                  tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
                  desc: 'PNS & PPPK berhak penuh',
                  lawRef: 'Hal. 10 BKN 2024'
                },
                { 
                  id: 'cuti_melahirkan', 
                  name: 'Cuti Melahirkan', 
                  icon: Baby,
                  tag: 'Maks. 3 Bulan', 
                  tagColor: 'bg-pink-100 text-pink-800 border-pink-200',
                  desc: 'Kelahiran anak ke-1 s.d ke-3',
                  lawRef: 'Hal. 13 BKN 2024'
                },
                { 
                  id: 'cuti_alasan_penting', 
                  name: 'Cuti Alasan Penting', 
                  icon: AlertCircle,
                  tag: 'Maks. 1 Bulan', 
                  tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
                  desc: 'Keluarga, Nikah, Musibah',
                  lawRef: 'Hal. 16 BKN 2024'
                },
                { 
                  id: 'cuti_bersama', 
                  name: 'Cuti Bersama', 
                  icon: Users,
                  tag: 'Keppres RI', 
                  tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
                  desc: 'Tidak memotong cuti tahunan',
                  lawRef: 'Hal. 18 BKN 2024'
                },
                { 
                  id: 'cltn', 
                  name: 'CLTN', 
                  icon: ShieldAlert,
                  tag: 'Maks. 3 Tahun', 
                  tagColor: 'bg-slate-200 text-slate-800 border-slate-300',
                  desc: 'Di Luar Tanggungan Negara',
                  lawRef: 'Hal. 20 BKN 2024'
                }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = jenisCuti === item.id;
                return (
                  <label
                    key={item.id}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between select-none ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 shadow-sm ring-2 ring-slate-900/15'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-slate-900 text-amber-400 shadow-2xs border border-slate-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-slate-900 block leading-tight">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {item.lawRef}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-orange-600 fill-orange-100" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                          )}
                          <input
                            type="radio"
                            name="jenis_cuti"
                            value={item.id}
                            checked={isSelected}
                            onChange={() => {
                              setJenisCuti(item.id);
                              setKategoriDetail('');
                            }}
                            className="sr-only"
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 mt-2.5 leading-snug">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${item.tagColor}`}>
                        {item.tag}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-extrabold text-orange-700 tracking-wide uppercase">
                          Terpilih
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
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
                <span className="w-6 h-6 rounded-lg bg-slate-900 text-amber-400 border border-slate-700 flex items-center justify-center text-xs font-black shadow-xs font-mono">III</span>
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
        </div> {/* END LEFT COLUMN (8 cols) */}

        {/* RIGHT COLUMN: STICKY TELEMETRY, BKN VALIDATION & SUBMIT (4 cols - Zero Dead Space) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          <div className="bg-white rounded-3xl p-6 md:p-7 border border-slate-200/90 shadow-md shadow-slate-200/50 space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 border border-slate-700 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Ringkasan Pengajuan
                </h3>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                validationResult.isValid 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
              }`}>
                {validationResult.isValid ? '✓ Terverifikasi BKN' : '✕ Belum Valid'}
              </span>
            </div>

            {/* Telemetry Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Jenis Cuti:</span>
                <strong className="text-slate-900 capitalize">{jenisCuti.replace('_', ' ')}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Durasi Diajukan:</span>
                <strong className="text-slate-900 font-black text-sm">{jumlahHari} Hari Kerja</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500">Periode:</span>
                <span className="text-slate-800 font-semibold">{tanggalMulai} s.d {tanggalSelesai}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Sisa Kuota N Saat Ini:</span>
                <strong className="text-slate-900">{currentUser?.sisa_cuti_n || 12} Hari</strong>
              </div>
            </div>

            {/* Live Quota Simulation for Cuti Tahunan */}
            {jenisCuti === 'cuti_tahunan' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Simulasi Saldo Cuti N:
                  </span>
                  <span className="font-black text-slate-900">
                    {Math.max(0, (currentUser?.sisa_cuti_n || 12) - jumlahHari)} Hari Tersisa
                  </span>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden p-0.5">
                  <div 
                    className="bg-slate-900 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, Math.max(0, (((currentUser?.sisa_cuti_n || 12) - jumlahHari) / 12) * 100))}%`
                    }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-orange-800 font-semibold">
                  <span>Awal: {currentUser?.sisa_cuti_n || 12} Hari</span>
                  <span className="text-rose-600 font-bold">Terpakai: -{jumlahHari} Hari</span>
                </div>
              </div>
            )}

            {/* Hak Penghasilan Preview */}
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-[11px] text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Penghasilan Saat Cuti (Hal. 24):</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {jenisCuti === 'cltn' 
                  ? 'Dinonaktifkan Selama Cuti (NOL Rupiah)' 
                  : jenisCuti === 'cuti_besar'
                  ? 'Gaji Pokok & Tunjangan Keluarga utuh. Tunjangan Jabatan & TPP TIDAK DAPAT.'
                  : 'Menerima 100% Gaji Pokok, Tunjangan Jabatan, dan TPP tanpa potongan.'}
              </p>
            </div>

            {/* Error Box */}
            {!validationResult.isValid && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2 animate-in fade-in">
                <div className="font-bold flex items-center gap-1.5 text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Belum Memenuhi Ketentuan BKN:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-rose-700">
                  {validationResult.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {validationResult.warnings.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-800 text-[11px]">
                  <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Catatan Regulasi:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-amber-800">
                  {validationResult.warnings.map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                disabled={!validationResult.isValid || submitting}
                className={`w-full py-4 rounded-2xl text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  validationResult.isValid && !submitting
                    ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-900 shadow-slate-900/20 active:scale-[0.98]'
                    : 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                }`}
              >
                <Send className="w-4 h-4 text-amber-300" />
                <span>{submitting ? 'Memproses Berkas...' : 'Kirim Permohonan Resmi'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Batal Kembali ke Dashboard
              </button>
            </div>

          </div>

        </div> {/* END RIGHT COLUMN */}

      </div> {/* END GRID */}
    </form>
  )}

    </div>
  );
}
