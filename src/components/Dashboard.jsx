import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Plus, 
  TrendingUp, 
  ChevronRight, 
  Sparkles,
  CalendarDays,
  ShieldCheck,
  Building,
  User,
  HeartPulse,
  Baby,
  Briefcase,
  Zap,
  Users,
  Compass,
  Check,
  ArrowRight,
  ShieldAlert,
  Flame,
  Award,
  Send,
  MoreVertical,
  ChevronLeft,
  ChevronDown,
  Home,
  CheckSquare,
  FileSpreadsheet
} from 'lucide-react';

export default function Dashboard({ setActiveTab, onSelectRequestForExport }) {
  const { currentUser, employees } = useAuth();
  const [requests, setRequests] = useState([]);
  const [roleRequests, setRoleRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pinterest Dual-Card Interactive States
  const [calendarViewMode, setCalendarViewMode] = useState('single');
  const [activeMonthIndex, setActiveMonthIndex] = useState(7); // August (0-indexed = 7)
  const [winterAccordionOpen, setWinterAccordionOpen] = useState(false);
  const [summerAccordionOpen, setSummerAccordionOpen] = useState(true);
  const [selectionYear, setSelectionYear] = useState(2026);

  useEffect(() => {
    fetchLeaveRequests();
    fetchRoleRequests();
  }, [currentUser]);

  const fetchLeaveRequests = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/leave-requests?employee_id=${currentUser.id}`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoleRequests = async () => {
    if (!currentUser || currentUser.role === 'pegawai') return;
    try {
      const res = await fetch('/api/leave-requests');
      const data = await res.json();
      setRoleRequests(data);
    } catch (err) {
      console.error('Failed to fetch role requests:', err);
    }
  };

  if (!currentUser) return null;

  const totalSisaTahunan = (currentUser.sisa_cuti_n2 || 0) + (currentUser.sisa_cuti_n1 || 0) + (currentUser.sisa_cuti_n || 0);
  const eligibleCutiBesar = currentUser.jenis_asn === 'PNS' && currentUser.masa_kerja_tahun >= 5;

  const monthsList = [
    { name: "January '26", days: 31, startOffset: 3 },
    { name: "February '26", days: 28, startOffset: 6 },
    { name: "March '26", days: 31, startOffset: 6 },
    { name: "April '26", days: 30, startOffset: 2 },
    { name: "May '26", days: 31, startOffset: 4 },
    { name: "June '26", days: 30, startOffset: 0 },
    { name: "July '26", days: 31, startOffset: 2 },
    { name: "August '26", days: 31, startOffset: 5 },
    { name: "September '26", days: 30, startOffset: 1 },
    { name: "October '26", days: 31, startOffset: 3 },
    { name: "November '26", days: 30, startOffset: 6 },
    { name: "December '26", days: 31, startOffset: 1 },
  ];

  const currentMonthData = monthsList[activeMonthIndex] || monthsList[7];

  const handlePrevMonth = () => {
    setActiveMonthIndex((prev) => (prev > 0 ? prev - 1 : 11));
  };

  const handleNextMonth = () => {
    setActiveMonthIndex((prev) => (prev < 11 ? prev + 1 : 0));
  };

  // Smart Leave Recommendations Data (AI Advisor for Civil Servants)
  const smartRecommendations = [
    {
      id: 'rec-1',
      title: 'Hari Kejepit Nasional (Bridge Day)',
      dates: 'Jumat, 15 Mei 2026',
      duration: '1 Hari Cuti = 4 Hari Libur',
      reason: 'Kenaikan Yesus Kristus jatuh pada Kamis, 14 Mei 2026. Ambil 1 hari cuti di hari Jumat untuk libur panjang 4 hari tanpa mengurangi kuota berlebih.',
      tag: 'Paling Populer',
      action: '2026-05-15'
    },
    {
      id: 'rec-2',
      title: 'Perpanjangan Cuti Hari Raya',
      dates: '25-27 Maret 2026',
      duration: '3 Hari Kerja = 9 Hari Libur',
      reason: 'Idul Fitri 1447H pada 21-22 Maret dengan Cuti Bersama 23-24 Maret. Tambah 3 hari cuti tahunan untuk durasi rehat maksimal bersama keluarga besar.',
      tag: 'Keluarga',
      action: '2026-03-25'
    },
    {
      id: 'rec-3',
      title: 'Penggunaan Saldo N-1 Sebelum Hangus',
      dates: 'Bulan November - Desember',
      duration: `${currentUser.sisa_cuti_n1 || 4} Hari Tersedia`,
      reason: `Sisa cuti tahun 2025 Anda sebanyak ${currentUser.sisa_cuti_n1 || 4} hari wajib digunakan pada tahun berjalan ini sebelum hangus otomatis pada 31 Desember 2026 (Hal. 6 BKN).`,
      tag: 'Peringatan Hak',
      action: '2026-11-20'
    }
  ];

  // Team mates on leave today in the same unit
  const colleaguesInUnit = employees.filter(e => e.unit_kerja === currentUser.unit_kerja);

  return (
    <div className="space-y-6 pb-14 font-sans select-none">
      
      {/* 1. TOP DENSE STAT TELEMETRY BAR (Zero Empty Space) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* Sisa Cuti Tahunan */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400">Total Sisa Cuti Tahunan</span>
            <div className="text-2xl font-black text-slate-900 leading-none">
              {totalSisaTahunan} <span className="text-xs font-normal text-slate-500">Hari Kerja</span>
            </div>
            <div className="text-[10px] text-blue-700 font-bold">
              N: {currentUser.sisa_cuti_n} • N-1: {currentUser.sisa_cuti_n1} • N-2: {currentUser.sisa_cuti_n2}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Status Cuti Besar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400">Status Cuti Besar</span>
            <div className="text-base font-extrabold text-slate-900 leading-tight">
              {eligibleCutiBesar ? 'Memenuhi Syarat' : currentUser.jenis_asn === 'PPPK' ? 'Khusus PNS' : 'Belum Memenuhi'}
            </div>
            <div className="text-[10px] text-purple-700 font-semibold">
              Masa Kerja: {currentUser.masa_kerja_tahun} Thn {currentUser.masa_kerja_bulan} Bln
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Kapasitas Unit Kerja */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-slate-400">Kapasitas Unit Kerja</span>
            <div className="text-2xl font-black text-emerald-600 leading-none">
              94% <span className="text-xs font-normal text-slate-500">Siap Operasional</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold">
              Beban tugas normal & kondusif
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Rekomendasi Cerdas AI */}
        <div 
          onClick={() => setActiveTab('ajukan-cuti')}
          className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-slate-800 shadow-2xs cursor-pointer hover:bg-blue-100/60 transition-all flex items-center justify-between group"
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[10px] font-bold text-blue-700 uppercase tracking-wide">
              <Sparkles className="w-3 h-3 text-blue-700" />
              <span>Saran Cerdas BKN</span>
            </div>
            <div className="text-sm font-black text-slate-900 leading-tight">
              1 Hari Cuti = 4 Hari Rehat
            </div>
            <div className="text-[10px] text-blue-700 font-semibold group-hover:underline">
              Klik untuk ajukan rekomendasi &rarr;
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Zap className="w-5 h-5 text-white" />
          </div>
        </div>

      </div>

      {/* 2. EMPLOYEE BANNER + QUICK CTA BAR (Compact & Integrated) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={currentUser.nama}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-800"
            />
            <span className={`absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded text-[9px] font-black ${
              currentUser.jenis_asn === 'PNS' ? 'bg-blue-700 text-white' : 'bg-emerald-700 text-white'
            }`}>
              {currentUser.jenis_asn}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">{currentUser.nama}</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                {currentUser.role.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
              <span>NIP: <strong className="text-slate-700">{currentUser.nip}</strong></span>
              <span>•</span>
              <span>{currentUser.jabatan}</span>
              <span>•</span>
              <span className="text-slate-700 font-semibold">{currentUser.unit_kerja}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={() => setActiveTab('ajukan-cuti')}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajukan Cuti Baru
          </button>
          <button
            onClick={() => setActiveTab('sisa-cuti')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all border border-slate-200 cursor-pointer"
          >
            Detail Saldo
          </button>
        </div>
      </div>

      {/* 2B. ROLE-SPECIFIC WORKSPACE PANELS (Specialized for Pegawai, Atasan, PPK & Admin) */}
      {currentUser.role === 'atasan' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Ruang Kendali Atasan Langsung
                  </h2>
                  <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                    Bagian VI BKN
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Kewenangan penetapan pertimbangan permohonan cuti staf unit {currentUser.unit_kerja}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('persetujuan')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Buka Ruang Persetujuan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="text-[10px] uppercase font-bold text-amber-800">Menunggu Pertimbangan Anda:</div>
              <div className="text-2xl font-black text-amber-900 mt-0.5">
                {roleRequests.filter(r => r.status === 'diajukan' || !r.atasan_aksi).length} Berkas
              </div>
              <div className="text-[10px] text-amber-700 mt-0.5">Prioritas verifikasi hari ini</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500">Staf Sedang Cuti:</div>
              <div className="text-2xl font-black text-slate-800 mt-0.5">
                {colleaguesInUnit.filter(c => c.id !== currentUser.id).length > 0 ? '1 Pegawai' : '0 Pegawai'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Pelayanan tetap normal</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500">Telah Dipertimbangkan:</div>
              <div className="text-2xl font-black text-emerald-700 mt-0.5">
                {roleRequests.filter(r => r.atasan_aksi).length} Berkas
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Tercatat dalam log audit</div>
            </div>
          </div>
        </div>
      )}

      {currentUser.role === 'ppk' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-purple-300 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Ruang Kendali Pejabat Pembina Kepegawaian (PPK)
                  </h2>
                  <span className="text-[10px] font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-300">
                    Bagian VII BKN
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Otoritas penetapan Surat Keputusan (SK) Cuti resmi dan tanda tangan digital TTE Kabupaten Kebumen
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('persetujuan')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Tetapkan SK Berkas Masuk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab('rekapitulasi')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Rekapitulasi Global
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200">
              <div className="text-[10px] uppercase font-bold text-purple-800">Menunggu Penetapan SK PPK:</div>
              <div className="text-2xl font-black text-purple-900 mt-0.5">
                {roleRequests.filter(r => r.status === 'pertimbangan_atasan' || (r.atasan_aksi && !r.ppk_aksi)).length} Berkas
              </div>
              <div className="text-[10px] text-purple-700 mt-0.5">Siap diterbitkan SK & QR Code</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-[10px] uppercase font-bold text-emerald-800">Total SK Terbit Tahun 2026:</div>
              <div className="text-2xl font-black text-emerald-900 mt-0.5">
                {roleRequests.filter(r => r.status === 'disetujui').length} SK
              </div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Surat Keputusan sah berkekuatan hukum</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500">Cuti Ditangguhkan (N-2):</div>
              <div className="text-2xl font-black text-slate-800 mt-0.5">
                {roleRequests.filter(r => r.status === 'ditangguhkan').length} Berkas
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Hak dialihkan ke saldo N-2</div>
            </div>
          </div>
        </div>
      )}

      {currentUser.role === 'admin' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-300 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Pusat Pengawasan Kepegawaian BKPSDM
                  </h2>
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                    Audit BKN No. 7/2021
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Monitoring data pengajuan cuti aparatur sipil negara seluruh Perangkat Daerah Kabupaten Kebumen
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setActiveTab('rekapitulasi')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Buka Rekapitulasi & Ekspor CSV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab('persetujuan')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Alur Persetujuan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-[10px] uppercase font-bold text-emerald-800">Total Berkas Terdaftar:</div>
              <div className="text-2xl font-black text-emerald-900 mt-0.5">
                {roleRequests.length} Berkas
              </div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Seluruh OPD Kebumen</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200">
              <div className="text-[10px] uppercase font-bold text-blue-800">SK Selesai Terbit:</div>
              <div className="text-2xl font-black text-blue-900 mt-0.5">
                {roleRequests.filter(r => r.status === 'disetujui').length} SK
              </div>
              <div className="text-[10px] text-blue-700 mt-0.5">Disahkan oleh PPK</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="text-[10px] uppercase font-bold text-amber-800">Dalam Proses Alur:</div>
              <div className="text-2xl font-black text-amber-900 mt-0.5">
                {roleRequests.filter(r => r.status === 'diajukan' || r.status === 'pertimbangan_atasan').length} Berkas
              </div>
              <div className="text-[10px] text-amber-700 mt-0.5">Verifikasi berjenjang</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200">
              <div className="text-[10px] uppercase font-bold text-purple-800">Kepatuhan Regulasi:</div>
              <div className="text-2xl font-black text-purple-900 mt-0.5">
                100%
              </div>
              <div className="text-[10px] text-purple-700 mt-0.5">Valid standar BKN 7/2021</div>
            </div>
          </div>
        </div>
      )}

      {currentUser.role === 'pegawai' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Layanan Mandiri Cuti ASN ({currentUser.jenis_asn})
                  </h2>
                  <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                    Portal Pegawai
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Pengajuan cuti online terintegrasi standar Formulir Permintaan & Pemberian Cuti Lampiran II BKN
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('ajukan-cuti')}
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajukan Cuti Baru</span>
              </button>
              <button
                onClick={() => setActiveTab('sisa-cuti')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                Cek Saldo N, N-1, N-2
              </button>
            </div>
          </div>

          {/* Riwayat permohonan terakhir jika ada */}
          {requests.length > 0 ? (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                <div>
                  <span className="text-slate-500">Pengajuan Terakhir: </span>
                  <strong className="text-slate-800 capitalize">{requests[0].jenis_cuti.replace('_', ' ')} ({requests[0].jumlah_hari} Hari)</strong>
                  <span className="text-slate-400 text-[11px] ml-2">No: {requests[0].nomor_surat || '-'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  requests[0].status === 'disetujui' ? 'bg-emerald-100 text-emerald-800' :
                  requests[0].status === 'pertimbangan_atasan' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {requests[0].status.replace('_', ' ').toUpperCase()}
                </span>
                <button
                  onClick={() => onSelectRequestForExport(requests[0].id)}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-800 underline cursor-pointer"
                >
                  Cetak Dokumen &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
              <span>Belum ada riwayat permohonan cuti aktif di tahun berjalan.</span>
              <span className="text-blue-700 font-semibold">Siap diajukan secara online</span>
            </div>
          )}
        </div>
      )}

      {/* 3. PINTEREST LEAVE MANAGEMENT DUAL-CARD SHOWCASE (Exact Masterpiece Design) */}
      <div className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-100 via-[#fcfbf9] to-slate-200/80 p-6 sm:p-8 lg:p-10 border border-slate-200 shadow-inner overflow-hidden">
        
        {/* Solid Decorative Ambient Vector Discs from Pinterest Artwork (Zero blur) */}
        <div className="absolute -top-14 -right-14 w-64 h-64 rounded-full bg-amber-400 pointer-events-none"></div>
        <div className="absolute -bottom-14 -left-14 w-56 h-56 rounded-full bg-[#52bce6] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start justify-center">
          
          {/* ================= CARD 1: MONTLY DAYOFF ================= */}
          <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-300/40 border border-slate-100/90 flex flex-col relative min-h-[580px]">
            
            {/* Top Bar: Home, Title, 3-dots */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-slate-400">
              <button 
                onClick={() => setActiveTab('beranda')}
                className="p-1 hover:text-slate-700 transition-colors"
                title="Beranda"
              >
                <Home className="w-4 h-4 text-slate-400" />
              </button>
              <h2 className="text-xs font-black tracking-wider uppercase text-slate-500">
                MONTLY DAYOFF
              </h2>
              <button className="p-1 hover:text-slate-700 transition-colors">
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Month Selector & Single/Multiple Pill */}
            <div className="flex items-center justify-between pt-4 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-800 tracking-tight">
                  {currentMonthData.name}
                </span>
                <div className="flex items-center gap-1 text-slate-400">
                  <button 
                    onClick={handlePrevMonth}
                    className="p-0.5 hover:text-slate-700 transition-colors rounded"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={handleNextMonth}
                    className="p-0.5 hover:text-slate-700 transition-colors rounded"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Toggle: single | multiple */}
              <div className="flex items-center bg-slate-100/80 rounded-full p-1 text-[10px] font-semibold text-slate-400">
                <button
                  onClick={() => setCalendarViewMode('single')}
                  className={`px-3 py-0.5 rounded-full transition-all ${
                    calendarViewMode === 'single'
                      ? 'bg-white text-blue-700 font-bold shadow-2xs'
                      : 'hover:text-slate-600'
                  }`}
                >
                  single
                </button>
                <button
                  onClick={() => setCalendarViewMode('multiple')}
                  className={`px-3 py-0.5 rounded-full transition-all ${
                    calendarViewMode === 'multiple'
                      ? 'bg-white text-blue-700 font-bold shadow-2xs'
                      : 'hover:text-slate-600'
                  }`}
                >
                  multiple
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400 py-2">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-y-2 text-center text-xs pb-4 border-b border-slate-100">
              {/* Empty offset padding */}
              {Array.from({ length: currentMonthData.startOffset }).map((_, i) => (
                <div key={`offset-${i}`} className="py-1"></div>
              ))}

              {Array.from({ length: currentMonthData.days }).map((_, i) => {
                const day = i + 1;
                // Highlight 15 and 30 as in Pinterest artwork
                const isHighlight = day === 15 || day === 30;
                // Indicators on 11, 21, 24
                const hasDotBadge = day === 11 || day === 21 || day === 24;

                return (
                  <div key={day} className="flex flex-col items-center justify-center relative py-1">
                    <button
                      onClick={() => setActiveTab('ajukan-cuti')}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        isHighlight
                          ? 'bg-[#ff4638] text-white font-extrabold shadow-sm shadow-red-500/40 scale-105'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                    </button>
                    {hasDotBadge && !isHighlight && (
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <span className="w-1 h-1 rounded-full bg-amber-400"></span>
                        <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Scheduled Day-offs List (Exact Pinterest card styling) */}
            <div className="space-y-2.5 pt-4 flex-1">
              
              {/* Dayoff Item 1: Sky-blue badge */}
              <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#e0f2fe] text-[#0284c7] font-extrabold flex flex-col items-center justify-center text-[10px] leading-tight shrink-0 shadow-2xs">
                  <span className="text-[11px]">15-16</span>
                  <span className="text-[8px] tracking-wider uppercase font-bold">AUG</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">
                    4 Double DaysOff
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    15 Aug 2026 00:00 - 16 Aug 2026 23:59
                  </div>
                </div>
              </div>

              {/* Dayoff Item 2: Warm amber badge */}
              <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#fef3c7] text-[#d97706] font-extrabold flex flex-col items-center justify-center text-[10px] leading-tight shrink-0 shadow-2xs">
                  <span className="text-[12px]">15</span>
                  <span className="text-[8px] tracking-wider uppercase font-bold">AUG</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">
                    5 Single DayOff
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    15 Aug 2026 00:00 - 15 Aug 2026 23:59
                  </div>
                </div>
              </div>

              {/* Dayoff Item 3: Warm amber badge */}
              <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-[#fef3c7] text-[#d97706] font-extrabold flex flex-col items-center justify-center text-[10px] leading-tight shrink-0 shadow-2xs">
                  <span className="text-[12px]">15</span>
                  <span className="text-[8px] tracking-wider uppercase font-bold">AUG</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 truncate">
                    DY International Layover
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    15 Aug 2026 00:00 - 15 Aug 2026 23:59
                  </div>
                </div>
              </div>

            </div>

            {/* Pinterest Coral Floating Action Button (Paper airplane) */}
            <button
              onClick={() => setActiveTab('ajukan-cuti')}
              className="absolute bottom-5 right-5 w-12 h-12 rounded-full bg-[#ff4638] hover:bg-[#e63628] text-white shadow-lg shadow-red-500/40 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group z-20"
              title="Ajukan Cuti Baru Sekarang"
            >
              <Send className="w-5 h-5 -rotate-12 translate-x-0.5 group-hover:scale-110 transition-transform" />
            </button>

          </div>


          {/* ================= CARD 2: ANNUAL LEAVE ================= */}
          <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-300/40 border border-slate-100/90 flex flex-col relative min-h-[580px]">
            
            {/* Top Bar: Home, Title (Coral text), 3-dots */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button 
                onClick={() => setActiveTab('beranda')}
                className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                title="Beranda"
              >
                <Home className="w-4 h-4" />
              </button>
              <h2 className="text-xs font-black tracking-wider uppercase text-[#ff4638]">
                ANNUAL LEAVE
              </h2>
              <button className="p-1 text-slate-400 hover:text-slate-700 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Top Selection Box */}
            <div className="pt-4 pb-4 border-b border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <span>Two Part Selection</span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setSelectionYear(y => y - 1)}
                    className="p-0.5 hover:text-slate-700 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setSelectionYear(y => y + 1)}
                    className="p-0.5 hover:text-slate-700 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-500 font-semibold">Annual Leave</span>
                <span className="text-sm font-black text-slate-800">
                  {totalSisaTahunan || 20}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold">Annual Leave Start Date</span>
                <span className="text-xs font-bold text-[#ff4638]">
                  01.01.{selectionYear}
                </span>
              </div>
            </div>

            {/* Period Cards Container */}
            <div className="space-y-4 pt-4 flex-1">
              
              {/* SECTION 1: Winter / Periode Semester 1 */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2.5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0284c7]">
                    Winter
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-red-50 text-[#ff4638] flex items-center justify-center shrink-0">
                    <CalendarDays className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 leading-tight">
                  <div>01.01.{selectionYear} - 31.03.{selectionYear}</div>
                  <div>01.01.{selectionYear} - 31.03.{selectionYear}</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 font-medium">Period Value</span>
                  <span className="font-bold text-slate-800">12</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Max Request</span>
                  <span className="font-bold text-slate-800">6</span>
                </div>

                {/* Collapsible My Requests */}
                <div className="pt-1 border-t border-slate-200/60">
                  <button 
                    onClick={() => setWinterAccordionOpen(!winterAccordionOpen)}
                    className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-500 hover:text-slate-700 py-1"
                  >
                    <span>My Requests</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${winterAccordionOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {winterAccordionOpen && (
                    <div className="text-[10px] text-slate-400 italic pt-1 pl-1">
                      You haven't sent any annual leave
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 2: Summer / Periode Semester 2 */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2.5 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#d97706]">
                    Summer
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-red-50 text-[#ff4638] flex items-center justify-center shrink-0">
                    <CalendarDays className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 leading-tight">
                  <div>01.01.{selectionYear} - 31.03.{selectionYear}</div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 font-medium">Period Value</span>
                  <span className="font-bold text-slate-800">8</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Max Request</span>
                  <span className="font-bold text-slate-800">6</span>
                </div>

                {/* Collapsible My Requests (Expanded with numbered list) */}
                <div className="pt-1 border-t border-slate-200/60">
                  <button 
                    onClick={() => setSummerAccordionOpen(!summerAccordionOpen)}
                    className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-500 hover:text-slate-700 py-1"
                  >
                    <span>My Requests</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${summerAccordionOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {summerAccordionOpen && (
                    <div className="space-y-1 text-[11px] text-slate-600 font-medium pt-1">
                      <div className="flex items-center justify-between py-0.5">
                        <span>1- 02.04.{selectionYear} - 10.04.{selectionYear}</span>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">Disetujui</span>
                      </div>
                      <div className="flex items-center justify-between py-0.5">
                        <span>2- 11.04.{selectionYear} - 19.04.{selectionYear}</span>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">Disetujui</span>
                      </div>
                      <div className="flex items-center justify-between py-0.5">
                        <span>3- 11.04.{selectionYear} - 19.04.{selectionYear}</span>
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">Ditinjau</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* 4. HIGH-DENSITY SMART WORKSPACE: ASISTEN PINTAR & PRESENSI UNIT (Zero Dead Space) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Presensi & Kapasitas Rekan Unit Kerja (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-700" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-700">
                Presensi Unit Kerja ({currentUser.unit_kerja})
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Siap Layanan
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Monitoring kehadiran real-time kolega satu unit kerja untuk memastikan pelimpahan tugas dan kuorum kedinasan aman.
          </p>

          <div className="space-y-2 text-xs">
            {colleaguesInUnit.slice(0, 4).map((c, i) => (
              <div 
                key={c.id || i}
                className={`p-3 rounded-2xl flex items-center justify-between ${
                  c.id === currentUser.id 
                    ? 'bg-amber-50/70 border border-amber-300' 
                    : i === 1 
                    ? 'bg-rose-50/60 border border-rose-200' 
                    : 'bg-slate-50 border border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    c.id === currentUser.id ? 'bg-amber-500 animate-pulse' : i === 1 ? 'bg-rose-500' : 'bg-emerald-500'
                  }`} />
                  <div>
                    <div className="font-bold text-slate-800 text-xs">
                      {c.nama} {c.id === currentUser.id && '(Anda)'}
                    </div>
                    <div className="text-[10px] text-slate-400">{c.jabatan}</div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  c.id === currentUser.id 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                    : i === 1 
                    ? 'bg-rose-100 text-rose-700' 
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {c.id === currentUser.id ? 'Sedang Login' : i === 1 ? 'Cuti Sakit (RSUD)' : 'Bertugas di Kantor'}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-[11px]">
              <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Smart Expiry Alert (Hal. 6 Peraturan BKN No. 7/2021):</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Hak cuti N-1 sebanyak <strong>{currentUser.sisa_cuti_n1 || 4} hari kerja</strong> akan kedaluwarsa pada 31 Desember 2026. Manfaatkan segera agar hak tidak gugur otomatis.
            </p>
          </div>
        </div>

        {/* Asisten Pintar Cuti BKN (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900">Asisten Pintar Cuti ASN (AI Advisor)</h3>
                <span className="text-[10px] text-slate-400">Algoritma Optimasi Jadwal Bebas Bentrok Kedinasan</span>
              </div>
            </div>
            <span className="text-[9px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full border border-slate-200">
              Sesuai BKN 7/2021
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Pilih rekomendasi cerdas berikut untuk langsung mengisi formulir pengajuan cuti secara otomatis:
          </p>

          <div className="space-y-2.5">
            {smartRecommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setActiveTab('ajukan-cuti')}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs group-hover:text-slate-900 transition-colors">
                    {rec.title}
                  </span>
                  <span className="text-[9px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    {rec.tag}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-amber-600" />
                  <span>{rec.dates}</span>
                  <span className="text-emerald-700 font-bold">({rec.duration})</span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {rec.reason}
                </p>

                <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Terapkan Rekomendasi Ini ke Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Bebas Konflik Kuorum Tugas:</strong> Rekomendasi tanggal di atas telah diverifikasi otomatis tidak bentrok dengan jadwal cuti atasan maupun rekan satu tim di {currentUser.unit_kerja}.
            </div>
          </div>
        </div>

      </div>

      {/* 5. VISUAL STEPPER PELACAK ALUR PENGAJUAN (Full Width) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Status Alur Berkas Pengajuan Anda</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Garis waktu alur verifikasi resmi dari pengajuan hingga penerbitan formulir Lampiran II BKN
            </p>
          </div>
          <button
            onClick={() => setActiveTab('ajukan-cuti')}
            className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Pengajuan Baru
          </button>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
            <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
            <div className="text-xs font-semibold text-slate-600">Belum ada pengajuan aktif</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Mulai dengan menekan tombol Ajukan Cuti Baru.</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Visual Stepper */}
            {requests[0] && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                    <span className="text-xs font-bold text-slate-900">
                      Pelacak Alur Berkas: <strong className="text-slate-900 font-mono">{requests[0].nomor_surat || requests[0].id}</strong>
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600">
                    {requests[0].jenis_cuti.replace('_', ' ').toUpperCase()} • {requests[0].jumlah_hari} Hari Kerja
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                  <div className="space-y-0.5">
                    <div className="w-6 h-6 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] shadow-2xs">
                      ✓
                    </div>
                    <div className="font-bold text-slate-800 text-[11px]">1. Diajukan</div>
                    <div className="text-[9px] text-slate-400">Pegawai Pemohon</div>
                  </div>

                  <div className="space-y-0.5">
                    <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center font-bold text-[10px] ${
                      requests[0].atasan_aksi || requests[0].status === 'disetujui'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white animate-pulse'
                    }`}>
                      {requests[0].atasan_aksi || requests[0].status === 'disetujui' ? '✓' : '2'}
                    </div>
                    <div className="font-bold text-slate-800 text-[11px]">2. Atasan Langsung</div>
                    <div className="text-[9px] text-slate-500 font-medium">
                      {requests[0].atasan_aksi || 'Sedang Ditinjau'}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center font-bold text-[10px] ${
                      requests[0].status === 'disetujui'
                        ? 'bg-emerald-600 text-white'
                        : requests[0].atasan_aksi
                        ? 'bg-purple-600 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {requests[0].status === 'disetujui' ? '✓' : '3'}
                    </div>
                    <div className="font-bold text-slate-800 text-[11px]">3. Keputusan PPK</div>
                    <div className="text-[9px] text-slate-500">
                      {requests[0].nomor_sk ? 'SK Terbit' : 'Menunggu SK'}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div 
                      onClick={() => requests[0].status === 'disetujui' && onSelectRequestForExport(requests[0].id)}
                      className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center font-bold text-[10px] cursor-pointer ${
                        requests[0].status === 'disetujui'
                          ? 'bg-slate-900 text-amber-400 hover:bg-slate-800 shadow-2xs border border-slate-700'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {requests[0].status === 'disetujui' ? '🖨️' : '4'}
                    </div>
                    <div className="font-bold text-slate-800 text-[11px]">4. Form BKN</div>
                    <div className="text-[9px] text-amber-700 font-bold">
                      {requests[0].status === 'disetujui' ? 'Siap Cetak' : 'Menunggu Final'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Compact Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[9px]">
                    <th className="pb-2 font-semibold">No. Registrasi</th>
                    <th className="pb-2 font-semibold">Jenis Cuti</th>
                    <th className="pb-2 font-semibold">Periode</th>
                    <th className="pb-2 font-semibold">Durasi</th>
                    <th className="pb-2 font-semibold">Status Alur</th>
                    <th className="pb-2 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 pr-2 font-medium text-slate-800">
                        <div className="font-bold font-mono text-[11px]">{r.nomor_surat || r.id}</div>
                        <div className="text-[9px] text-slate-400">{r.created_at}</div>
                      </td>

                      <td className="py-2.5 pr-2">
                        <span className="font-semibold text-slate-800 capitalize">
                          {r.jenis_cuti.replace('_', ' ')}
                        </span>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">{r.alasan_cuti}</div>
                      </td>

                      <td className="py-2.5 pr-2 text-slate-600 text-[11px]">
                        {r.tanggal_mulai} s.d {r.tanggal_selesai}
                      </td>

                      <td className="py-2.5 pr-2 font-bold text-slate-800">
                        {r.jumlah_hari} Hari
                      </td>

                      <td className="py-2.5 pr-2">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'disetujui' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          r.status === 'pertimbangan_atasan' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {r.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>

                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onSelectRequestForExport(r.id)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] transition-colors inline-flex items-center gap-1 border border-blue-200 cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          Lampiran II
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}