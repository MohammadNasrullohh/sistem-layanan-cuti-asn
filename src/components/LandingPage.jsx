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
  Briefcase,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ setActiveTab, onOpenWhatsApp }) {
  const { currentUser } = useAuth();

  const totalSisaTahunan = currentUser 
    ? (currentUser.sisa_cuti_n2 || 0) + (currentUser.sisa_cuti_n1 || 0) + (currentUser.sisa_cuti_n || 0)
    : 18;
  const eligibleCutiBesar = currentUser?.jenis_asn === 'PNS' && (currentUser?.masa_kerja_tahun || 0) >= 5;

  return (
    <div className="space-y-12 pb-20 w-full font-sans select-none">
      
      {/* 1. HERO SECTION: STATE EXECUTIVE GOVERNMENT PORTAL (TEGAS & RESMI PEMERINTAH) */}
      <section className="relative overflow-hidden rounded-3xl bg-white text-slate-800 p-6 sm:p-10 lg:p-12 shadow-xs border border-slate-200">
        
        {/* Dignified Indonesian State Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Headings, Badges, CTAs (7 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                <span className="inline-block w-3.5 h-2.5 rounded-xs overflow-hidden border border-red-300 shadow-2xs shrink-0">
                  <span className="block h-1/2 bg-red-600"></span>
                  <span className="block h-1/2 bg-white"></span>
                </span>
                <span>REPUBLIK INDONESIA</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                <span>Peraturan BKN No. 7 Tahun 2021</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                <span>SPBE Kebumen</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-700"></span>
                <span>Pemerintah Kabupaten Kebumen • BKPSDM</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
                Sistem Layanan Cuti <br className="hidden sm:inline" />
                <span className="text-blue-700">
                  Aparatur Sipil Negara
                </span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl">
              Portal mandiri pengajuan izin cuti elektronik, audit kepatuhan regulasi otomatis, verifikasi pertimbangan atasan berjenjang, dan penerbitan Surat Keputusan (SK) resmi sesuai standar formulir Lampiran II BKN bagi seluruh PNS dan PPPK Pemerintah Kabupaten Kebumen.
            </p>

            {/* Quick Action CTA Buttons (Authoritative Government Palette) */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('ajukan-cuti')}
                className="px-6 py-3.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-white" />
                <span>Ajukan Permohonan Cuti</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={() => setActiveTab('sisa-cuti')}
                className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm border border-slate-200 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Rincian Saldo Kuota Cuti</span>
              </button>

              <button
                onClick={onOpenWhatsApp}
                className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Layanan WhatsApp</span>
              </button>
            </div>

            {/* Active User Indicator & Key Feature Pills */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              {currentUser && (
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>
                    Aparatur Aktif: <strong className="text-slate-900 font-bold">{currentUser.nama}</strong> ({currentUser.jenis_asn} • {currentUser.jabatan})
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-700">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">7 Jenis Cuti PNS</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">4 Jenis Cuti PPPK</span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">Anak Lampiran II BKN</span>
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">TTE Sah BKN</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Official State Credential Status Card (Solid & High-Contrast) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-slate-50/80 rounded-2xl p-6 text-slate-800 border border-slate-200 space-y-4">
              
              {/* Header: Title & Online Dot */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs uppercase font-extrabold tracking-wider text-slate-900">
                    Status Dokumen ASN
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full border border-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  <span>Sah Regulasi BKN</span>
                </div>
              </div>

              {/* User Identity Snapshot */}
              {currentUser ? (
                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white border border-slate-200">
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                    alt={currentUser.nama}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-sm text-slate-900 truncate leading-tight">
                      {currentUser.nama}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                      NIP: <strong className="text-slate-800">{currentUser.nip}</strong>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`px-2 py-0.2 rounded-md text-[9px] font-bold ${
                        currentUser.jenis_asn === 'PNS' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {currentUser.jenis_asn}
                      </span>
                      <span className="text-[10px] text-slate-600 font-semibold truncate">
                        {currentUser.unit_kerja}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Live Sisa Cuti Box (State Neutral Solid) */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-bold uppercase tracking-wide text-[10px]">Saldo Cuti Tahunan 2026:</span>
                  <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {totalSisaTahunan} <span className="text-xs font-semibold text-slate-500">Hari Kerja</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[9px] font-bold">Tahun N</span>
                    <strong className="text-slate-900 text-sm font-black">{currentUser?.sisa_cuti_n || 12}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[9px] font-bold">N-1 (2025)</span>
                    <strong className="text-slate-900 text-sm font-black">{currentUser?.sisa_cuti_n1 || 6}</strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-slate-500 block text-[9px] font-bold">N-2 (2024)</span>
                    <strong className="text-slate-900 text-sm font-black">{currentUser?.sisa_cuti_n2 || 0}</strong>
                  </div>
                </div>
              </div>

              {/* Smart Holiday Alert Mini Tile (Solid) */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-[10px] text-amber-800 font-black uppercase tracking-wider">
                    Libur / Cuti Bersama Terdekat
                  </div>
                  <div className="text-xs font-extrabold text-slate-900">
                    14-15 Mei 2026 (Bridge Day)
                  </div>
                  <div className="text-[10px] text-amber-700 font-medium">
                    Kenaikan Yesus Kristus (1 Cuti = 4 Libur)
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-[11px] shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  Detail &rarr;
                </button>
              </div>

              {/* Direct Link to Dashboard (Solid dark) */}
              <button
                onClick={() => setActiveTab('dashboard')}
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <span>Buka Dashboard & Dayoff Tracker</span>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* 2. PROCESS FLOW: 4 STEPS AESTHETIC BLUEPRINT */}
      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-xs space-y-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2 border border-blue-200">
            <span>Alur Proses Terstandarisasi BKN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Mekanisme Layanan Cuti Digital LawetHub
          </h2>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Mengikuti arsitektur alur kerja resmi: pemeriksaan hak cuti, validasi ketentuan BKN, pertimbangan atasan, keputusan PPK, dan ekspor formulir.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* STEP 1 */}
          <div className="group p-6 rounded-3xl bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-bold text-sm mb-4 shadow-sm">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Akses & Pilih Menu</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Akses web LawetHub atau kirim pesan WhatsApp. Pilih menu <strong>Lihat Sisa Cuti</strong> atau <strong>Ajukan Cuti</strong>.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-blue-700">
              <span>Web Portal & WA Bot</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* STEP 2 */}
          <div className="group p-6 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-sm mb-4 shadow-xs">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Pengisian & Validasi</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Isi form cuti. Sistem otomatis memvalidasi syarat: masa kerja, sisa kuota, batas durasi, dan dokumen pendukung sesuai BKN.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-blue-700">
              <span>Peraturan BKN No. 7/2021</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* STEP 3 */}
          <div className="group p-6 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm mb-4 shadow-xs">
                3
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Pertimbangan & SK</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Atasan Langsung memberikan pertimbangan (Disetujui/Perubahan/Ditangguhkan), diteruskan ke PPK untuk penetapan keputusan resmi.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span>Approval Berjenjang</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* STEP 4 */}
          <div className="group p-6 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm mb-4 shadow-xs">
                4
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Ekspor Formulir Resmi</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Cetak atau unduh <strong>Lampiran II Peraturan BKN No. 7 Tahun 2021</strong> format 7 bagian lengkap dengan nomor registrasi & QR validasi.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-emerald-700">
              <span>Format Lampiran II BKN</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </section>

      {/* 3. JENIS CUTI ASN: PNS VS PPPK (EDITORIAL 2-COLUMN CARDS) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* PNS Card */}
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black text-base shadow-xs">
                  PNS
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Hak Cuti PNS</h3>
                  <p className="text-xs text-slate-500 font-medium">Pegawai Negeri Sipil (7 Jenis Cuti)</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200">
                7 Jenis Cuti
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Sesuai Buku Saku BKN 2024 hal. 4, Pegawai Negeri Sipil memiliki hak atas 7 (tujuh) jenis cuti berikut:
            </p>

            <div className="space-y-2.5">
              {[
                { name: 'Cuti Tahunan', desc: '12 hari kerja/thn, masa kerja min 1 thn terus menerus, carryover max 6 hari.' },
                { name: 'Cuti Besar', desc: 'Paling lama 3 bulan, masa kerja min 5 thn (dikecualikan untuk haji pertama & anak ke-4+).' },
                { name: 'Cuti Sakit', desc: '1 hari ke Atasan, >1 hari ke PPK + surat dokter. Gugur kandungan max 1,5 bln.' },
                { name: 'Cuti Melahirkan', desc: 'Anak ke 1-3 max 3 bulan. Anak ke-4+ menjadi cuti besar.' },
                { name: 'Cuti Karena Alasan Penting', desc: 'Max 1 bulan: keluarga sakit/meninggal, nikah, istri melahirkan/caesar, bencana.' },
                { name: 'Cuti Bersama', desc: 'Ditetapkan Presiden, tidak mengurangi cuti tahunan.' },
                { name: 'Cuti di Luar Tanggungan Negara (CLTN)', desc: 'Masa kerja min 5 thn, urusan pribadi mendesak s.d. 3 thn + 1 thn.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-blue-50/50 transition-colors text-xs">
                  <div className="w-5 h-5 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900">{item.name}:</span>{' '}
                    <span className="text-slate-600">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Memiliki hak penuh atas seluruh fasilitas cuti aparatur sipil negara.</span>
          </div>
        </div>

        {/* PPPK Card */}
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-base shadow-xs">
                  PPPK
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Hak Cuti PPPK</h3>
                  <p className="text-xs text-slate-500 font-medium">Perjanjian Kerja (4 Jenis Cuti)</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                4 Jenis Cuti
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Sesuai Buku Saku BKN 2024 hal. 4, Pegawai Pemerintah dengan Perjanjian Kerja (PPPK) berhak atas 4 (empat) jenis cuti:
            </p>

            <div className="space-y-3">
              {[
                { name: 'Cuti Tahunan', desc: 'Diberikan setelah bekerja 1 tahun terus menerus, durasi 12 hari kerja per tahun.' },
                { name: 'Cuti Sakit', desc: 'Diberikan kepada PPPK yang menderita sakit dengan surat keterangan dokter resmi.' },
                { name: 'Cuti Melahirkan', desc: 'Diberikan untuk kelahiran anak pertama sampai dengan anak ketiga selama 3 bulan.' },
                { name: 'Cuti Bersama', desc: 'Mengikuti ketetapan cuti bersama nasional tanpa memotong jatah cuti tahunan.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs">
                  <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900">{item.name}:</span>{' '}
                    <span className="text-slate-600">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Ketentuan Pembatas Regulasi BKN:</strong> PPPK <em>tidak berhak</em> atas Cuti Besar, Cuti Karena Alasan Penting (CAP), maupun CLTN. Sistem otomatis mengunci opsi ini jika diajukan oleh akun PPPK.
            </div>
          </div>
        </div>

      </section>

      {/* 4. QUICK ACTION CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div 
          onClick={() => setActiveTab('sisa-cuti')}
          className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
              Cek Kuota & Sisa Cuti
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Periksa rincian sisa cuti tahunan N-2, N-1, N berjalan, kelayakan cuti besar, dan simulasi penghasilan saat cuti.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-blue-700">
            <span>Buka Rincian Sisa Cuti</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('ajukan-cuti')}
          className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
              Formulir Pengajuan Cuti
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Ajukan permohonan cuti secara elektronik dengan validasi otomatis sesuai Peraturan BKN No. 7 Tahun 2021.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-blue-700">
            <span>Isi Formulir Sekarang</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={onOpenWhatsApp}
          className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
              Chatbot WhatsApp ASN
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Simulasi interaksi pesan WhatsApp untuk cek sisa cuti kilat dan kirim permohonan via bot chat.
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
            <span>Mulai Chatbot WA</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </section>

    </div>
  );
}