import React from 'react';
import { 
  Building2, 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  MessageSquare, 
  BookOpen, 
  UserCheck, 
  Sparkles, 
  HelpCircle, 
  FileCheck2, 
  Users,
  Award,
  Zap,
  ChevronRight,
  Send,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ setActiveTab, onOpenWhatsApp }) {
  const { currentUser } = useAuth();

  const totalSisaTahunan = currentUser 
    ? (currentUser.sisa_cuti_n2 || 0) + (currentUser.sisa_cuti_n1 || 0) + (currentUser.sisa_cuti_n || 0)
    : 12;
  const eligibleCutiBesar = currentUser?.jenis_asn === 'PNS' && (currentUser?.masa_kerja_tahun || 0) >= 5;

  return (
    <div className="space-y-10 pb-16 w-full">
      
      {/* 1. HERO SECTION: SOLID HIGH-CONTRAST 2-COLUMN POWERHOUSE (ZERO GLASSMORPHISM) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white p-7 md:p-10 lg:p-12 shadow-md">
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Headings, Badges, CTAs (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black tracking-wide border border-amber-300 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Resmi Sesuai Peraturan BKN Nomor 7 Tahun 2021</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
              Layanan Cuti ASN Terpadu <br className="hidden sm:inline" />
              <span className="text-amber-200 underline decoration-amber-300/60 underline-offset-8">
                Modul LawetHub
              </span> Kabupaten Kebumen
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-orange-50 font-normal leading-relaxed max-w-3xl">
              Sub-sistem mandiri pengajuan, validasi regulasi BKN, pertimbangan atasan langsung, dan penetapan SK cuti oleh PPK. Terpasang langsung sebagai modul resmi di dalam portal terpusat Dashboard LawetHub Kabupaten Kebumen.
            </p>

            {/* Quick Action CTA Buttons (Solid colors) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('ajukan-cuti')}
                className="px-6 py-3.5 rounded-2xl bg-white text-orange-700 font-extrabold text-sm shadow-md hover:bg-orange-50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-orange-700" />
                <span>Ajukan Cuti Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('sisa-cuti')}
                className="px-5 py-3.5 rounded-2xl bg-orange-700 hover:bg-orange-800 border-2 border-white text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Cek Sisa Cuti Saya</span>
              </button>

              <button
                onClick={onOpenWhatsApp}
                className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Layanan WA Chatbot</span>
              </button>
            </div>

            {/* Active User Indicator & Key Feature Pills */}
            <div className="pt-3 border-t border-orange-400/40 flex flex-wrap items-center justify-between gap-3 text-xs text-orange-100">
              {currentUser && (
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span>
                    Masuk sebagai: <strong className="text-white font-bold">{currentUser.nama}</strong> ({currentUser.jenis_asn} - {currentUser.jabatan})
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-orange-100">
                <span className="px-2.5 py-1 rounded-lg bg-orange-700/70 border border-orange-400/40">7 Jenis Cuti PNS</span>
                <span className="px-2.5 py-1 rounded-lg bg-orange-700/70 border border-orange-400/40">4 Jenis Cuti PPPK</span>
                <span className="px-2.5 py-1 rounded-lg bg-orange-700/70 border border-orange-400/40">Format Lampiran II BKN</span>
                <span className="px-2.5 py-1 rounded-lg bg-orange-700/70 border border-orange-400/40">Validasi Otomatis</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Solid Pure White Telemetry Card (Zero Glassmorphism) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-3xl p-6 text-slate-800 shadow-xl border border-slate-200 space-y-4">
              
              {/* Header: Title & Online Dot */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="text-xs uppercase font-black tracking-wider text-slate-800">
                    Panel Status ASN
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Terverifikasi BKN</span>
                </div>
              </div>

              {/* User Identity Snapshot */}
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                    alt={currentUser.nama}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-orange-400 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-extrabold text-sm text-slate-900 truncate leading-tight">
                      {currentUser.nama}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                      NIP: {currentUser.nip}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                        {currentUser.jenis_asn}
                      </span>
                      <span className="text-[10px] text-slate-600 font-semibold truncate">
                        {currentUser.unit_kerja}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Live Sisa Cuti Box (Solid) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-bold">Total Sisa Cuti 2026:</span>
                  <span className="text-xl font-black text-orange-600">
                    {totalSisaTahunan} <span className="text-xs font-semibold text-slate-500">Hari Kerja</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[9px] font-semibold">Tahun N</span>
                    <strong className="text-slate-900 text-xs font-black">{currentUser?.sisa_cuti_n || 12}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[9px] font-semibold">N-1 (2025)</span>
                    <strong className="text-slate-900 text-xs font-black">{currentUser?.sisa_cuti_n1 || 6}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <span className="text-slate-400 block text-[9px] font-semibold">N-2 (2024)</span>
                    <strong className="text-slate-900 text-xs font-black">{currentUser?.sisa_cuti_n2 || 0}</strong>
                  </div>
                </div>
              </div>

              {/* Smart Holiday Alert Mini Tile (Solid) */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-[10px] text-amber-800 font-bold uppercase tracking-wide">
                    Libur / Cuti Bersama Terdekat
                  </div>
                  <div className="text-xs font-extrabold text-slate-900">
                    14-15 Mei 2026 (Bridge Day)
                  </div>
                  <div className="text-[10px] text-amber-700">
                    Kenaikan Yesus Kristus (1 Cuti = 4 Libur)
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-3 py-1.5 rounded-xl bg-orange-600 text-white font-bold text-[11px] shadow-xs hover:bg-orange-700 transition-all shrink-0 cursor-pointer"
                >
                  Detail &rarr;
                </button>
              </div>

              {/* Direct Link to Dashboard (Solid dark) */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <span>Buka Dashboard & Dayoff Tracker</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* 2. PROCESS FLOW DIAGRAM: 4 COLUMNS FULL-WIDTH */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xs">
        <div className="max-w-3xl mb-8">
          <div className="text-xs uppercase font-bold tracking-wider text-orange-600 mb-1">
            Alur Proses Terstandarisasi
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Mekanisme Layanan Cuti Digital LawetHub
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Mengikuti arsitektur alur kerja resmi: pemeriksaan hak cuti, validasi ketentuan BKN, pertimbangan atasan, keputusan PPK, dan ekspor formulir.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-orange-300 hover:shadow-xs transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Akses & Pilih Menu</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Akses web LawetHub atau kirim pesan WhatsApp. Pilih menu <strong>Lihat Sisa Cuti</strong> atau <strong>Ajukan Cuti</strong>.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-orange-600 mt-4 block">Web Portal & WA Bot</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-blue-300 hover:shadow-xs transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Pengisian & Validasi</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Isi form cuti. Sistem otomatis memvalidasi syarat: masa kerja, sisa kuota, batas durasi, dan dokumen pendukung sesuai BKN.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-blue-600 mt-4 block">Peraturan BKN No. 7/2021</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-purple-300 hover:shadow-xs transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Pertimbangan & Keputusan</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Atasan Langsung memberikan pertimbangan (Disetujui/Perubahan/Ditangguhkan), diteruskan ke PPK untuk penetapan keputusan resmi.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-purple-600 mt-4 block">Approval Berjenjang</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-emerald-300 hover:shadow-xs transition-all">
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm mb-3">
                4
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Ekspor Formulir Resmi</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Cetak atau unduh <strong>Lampiran II Peraturan BKN No. 7 Tahun 2021</strong> format 7 bagian lengkap dengan nomor registrasi & QR validasi.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-4 block">Format Lampiran II BKN</span>
          </div>

        </div>
      </section>

      {/* 3. JENIS CUTI ASN: PNS VS PPPK MATRIX (FULL-WIDTH 2 COLS) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PNS Card */}
        <div className="bg-white rounded-3xl p-7 md:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
                PNS
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Hak Cuti PNS</h3>
                <p className="text-xs text-slate-500">Pegawai Negeri Sipil (7 Jenis Cuti)</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              7 Jenis Cuti
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Sesuai Buku Saku BKN 2024 hal. 4, Pegawai Negeri Sipil memiliki hak atas 7 (tujuh) jenis cuti berikut:
          </p>

          <div className="space-y-2">
            {[
              { name: 'Cuti Tahunan', desc: '12 hari kerja/thn, masa kerja min 1 thn terus menerus, carryover max 6 hari.' },
              { name: 'Cuti Besar', desc: 'Paling lama 3 bulan, masa kerja min 5 thn (dikecualikan untuk haji pertama & anak ke-4+).' },
              { name: 'Cuti Sakit', desc: '1 hari ke Atasan, >1 hari ke PPK + surat dokter. Gugur kandungan max 1,5 bln.' },
              { name: 'Cuti Melahirkan', desc: 'Anak ke 1-3 max 3 bulan. Anak ke-4+ menjadi cuti besar.' },
              { name: 'Cuti Karena Alasan Penting', desc: 'Max 1 bulan: keluarga sakit/meninggal, nikah, istri melahirkan/caesar, bencana.' },
              { name: 'Cuti Bersama', desc: 'Ditetapkan Presiden, tidak mengurangi cuti tahunan.' },
              { name: 'Cuti di Luar Tanggungan Negara (CLTN)', desc: 'Masa kerja min 5 thn, urusan pribadi mendesak s.d. 3 thn + 1 thn.' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors text-xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800">{item.name}:</span>{' '}
                  <span className="text-slate-500">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PPPK Card */}
        <div className="bg-white rounded-3xl p-7 md:p-8 border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                  PPPK
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Hak Cuti PPPK</h3>
                  <p className="text-xs text-slate-500">Perjanjian Kerja (4 Jenis Cuti)</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                4 Jenis Cuti
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Sesuai Buku Saku BKN 2024 hal. 4, Pegawai Pemerintah dengan Perjanjian Kerja (PPPK) berhak atas 4 (empat) jenis cuti:
            </p>

            <div className="space-y-2.5">
              {[
                { name: 'Cuti Tahunan', desc: 'Diberikan setelah bekerja 1 tahun terus menerus, durasi 12 hari kerja per tahun.' },
                { name: 'Cuti Sakit', desc: 'Diberikan kepada PPPK yang menderita sakit dengan surat keterangan dokter resmi.' },
                { name: 'Cuti Melahirkan', desc: 'Diberikan untuk kelahiran anak pertama sampai dengan anak ketiga selama 3 bulan.' },
                { name: 'Cuti Bersama', desc: 'Mengikuti ketetapan cuti bersama nasional tanpa memotong jatah cuti tahunan.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-emerald-50/50 border border-emerald-100/60 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">{item.name}:</span>{' '}
                    <span className="text-slate-500">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Catatan Regulasi:</strong> PPPK <em>tidak berhak</em> atas Cuti Besar, Cuti Karena Alasan Penting (CAP), maupun Cuti di Luar Tanggungan Negara (CLTN). Sistem LawetHub otomatis memblokir jenis tersebut jika diajukan oleh PPPK.
            </div>
          </div>
        </div>

      </section>

      {/* 4. QUICK ACTION CARDS (3 COLS FULL-WIDTH) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div 
          onClick={() => setActiveTab('sisa-cuti')}
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
            Cek Kuota & Sisa Cuti
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Periksa rincian sisa cuti tahunan N-2, N-1, N berjalan, kelayakan cuti besar, dan simulasi penghasilan saat cuti.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-orange-600">
            <span>Buka Rincian Sisa Cuti</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('ajukan-cuti')}
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            Formulir Pengajuan Cuti
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Ajukan permohonan cuti secara elektronik dengan validasi otomatis sesuai Peraturan BKN No. 7 Tahun 2021.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600">
            <span>Isi Formulir Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={onOpenWhatsApp}
          className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
            Chatbot WhatsApp ASN
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Simulasi interaksi pesan WhatsApp untuk cek sisa cuti kilat dan kirim permohonan via bot chat.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <span>Mulai Chatbot WA</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </section>

    </div>
  );
}