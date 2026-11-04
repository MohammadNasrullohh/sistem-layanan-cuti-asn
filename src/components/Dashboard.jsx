import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function formatJenisCuti(val) {
  if (!val) return 'Cuti Tahunan';
  const map = {
    cuti_tahunan: 'Cuti Tahunan',
    cuti_besar: 'Cuti Besar',
    cuti_sakit: 'Cuti Sakit',
    cuti_melahirkan: 'Cuti Melahirkan',
    cuti_alasan_penting: 'Cuti Karena Alasan Penting',
    cuti_di_luar_tanggungan: 'Cuti di Luar Tanggungan Negara'
  };
  return map[val] || val;
}

export default function Dashboard({ setActiveTab, onSelectRequestForExport }) {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveRequests();
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

  const cutiN = currentUser?.sisa_cuti_n ?? currentUser?.cuti_n ?? 12;
  const cutiN1 = currentUser?.sisa_cuti_n1 ?? currentUser?.cuti_n1 ?? 6;
  const cutiN2 = currentUser?.sisa_cuti_n2 ?? currentUser?.cuti_n2 ?? 0;
  const totalTersedia = cutiN + cutiN1 + cutiN2;

  const latestRequest = requests && requests.length > 0 ? requests[0] : {
    id: 'cuti-2026-001',
    nomor_surat: '800/CUTI-THN/227/XI/2026',
    jenis_cuti: 'Cuti Tahunan',
    lama_hari: 2,
    status: 'pertimbangan_atasan'
  };

  // Determine stage progress
  const getStageStyle = (stage) => {
    const s = latestRequest.status;
    if (stage === 1) {
      return { active: true, done: true, label: '✓ Diajukan' };
    }
    if (stage === 2) {
      if (s === 'diajukan' || s === 'pertimbangan_atasan') {
        return { active: true, done: false, label: '● Menunggu pertimbangan atasan' };
      }
      if (s === 'disetujui_atasan' || s === 'disetujui' || s === 'perubahan' || s === 'ditangguhkan') {
        return { active: false, done: true, label: '✓ Pertimbangan atasan selesai' };
      }
      return { active: false, done: false, label: '○ Pertimbangan atasan' };
    }
    if (stage === 3) {
      if (s === 'disetujui_atasan') {
        return { active: true, done: false, label: '● Keputusan PPK' };
      }
      if (s === 'disetujui') {
        return { active: false, done: true, label: '✓ Keputusan PPK disetujui' };
      }
      return { active: false, done: false, label: '○ Keputusan PPK' };
    }
    if (stage === 4) {
      if (s === 'disetujui') {
        return { active: true, done: true, label: '✓ Formulir Lampiran II terbit' };
      }
      return { active: false, done: false, label: '○ Formulir Lampiran II terbit' };
    }
    return { active: false, done: false, label: '' };
  };

  const masaKerjaTahun = currentUser?.masa_kerja_tahun ?? 8;
  const masaKerjaBulan = currentUser?.masa_kerja_bulan ?? 9;
  const eligibleCutiBesar = masaKerjaTahun >= 5;

  return (
    <div className="flex-1 flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[26px] font-semibold text-[#1c2530] m-0 tracking-tight">
              Ringkasan cuti
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[4px] bg-[#e3eaf1] text-[#173a5e] text-[12px] font-medium border border-[#173a5e]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Sistem Pintar BKN Aktif
            </span>
          </div>
          <div className="text-[13px] text-[#5a6472]">
            {currentUser?.jabatan || 'Pranata Komputer Ahli Muda'} · NIP{' '}
            <span className="mono">{currentUser?.nip || '199208152018021003'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('buku-saku')}
            className="lawet-btn-secondary"
          >
            Aturan BKN 7/2021
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ajukan-cuti')}
            className="lawet-btn"
          >
            Ajukan cuti
          </button>
        </div>
      </div>

      {/* Row 1: Saldo Cuti (1.3fr), Pengajuan Terakhir (1fr), dan Audit Kepatuhan Otomatis (1fr) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.25fr_1fr_1fr] gap-6 items-stretch">
        {/* Card 1: Saldo Cuti Tahunan */}
        <section className="lawet-card flex flex-col justify-between">
          <div className="p-5 pb-2">
            <div className="flex justify-between items-baseline mb-3">
              <h2 className="text-[16px] font-semibold text-[#1c2530] m-0">
                Saldo cuti tahunan
              </h2>
              <div className="text-right">
                <span className="text-[32px] font-semibold text-[#1c2530] mono leading-none">
                  {totalTersedia}
                </span>{' '}
                <span className="text-[12px] text-[#5a6472]">hari kerja tersedia</span>
              </div>
            </div>

            {/* Quota Bar */}
            <div className="w-full bg-[#e8ebe6] h-2 rounded-[4px] overflow-hidden mb-3">
              <div
                className="bg-[#173a5e] h-full rounded-[4px]"
                style={{ width: `${Math.min(100, (totalTersedia / 18) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[12px] font-medium text-[#5a6472] px-4 py-2.5 border-b border-[#e8ebe6]">
                    Tahun
                  </th>
                  <th className="text-left text-[12px] font-medium text-[#5a6472] px-4 py-2.5 border-b border-[#e8ebe6]">
                    Saldo
                  </th>
                  <th className="text-left text-[12px] font-medium text-[#5a6472] px-4 py-2.5 border-b border-[#e8ebe6]">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2.5 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                    2026 (N)
                  </td>
                  <td className="px-4 py-2.5 text-[14px] text-[#1c2530] mono border-b border-[#e8ebe6]">
                    {cutiN} hari
                  </td>
                  <td className="px-4 py-2.5 text-[13px] text-[#5a6472] border-b border-[#e8ebe6]">
                    Hak tahun berjalan
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                    2025 (N-1)
                  </td>
                  <td className="px-4 py-2.5 text-[14px] text-[#1c2530] mono border-b border-[#e8ebe6]">
                    {cutiN1} hari
                  </td>
                  <td className="px-4 py-2.5 text-[13px] text-[#5a6472] border-b border-[#e8ebe6]">
                    Sisa dibawa, maks 6 hari
                  </td>
                </tr>
                <tr className="text-[#5a6472]">
                  <td className="px-4 py-2.5 text-[14px] border-0">
                    2024 (N-2)
                  </td>
                  <td className="px-4 py-2.5 text-[14px] mono border-0">
                    {cutiN2} hari
                  </td>
                  <td className="px-4 py-2.5 text-[13px] border-0">
                    Hanya jika ditangguhkan PPK
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Card 2: Pengajuan Terakhir */}
        <section className="lawet-card p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1c2530] m-0 mb-3">
              Pengajuan terakhir
            </h2>
            <div className="text-[14px] font-medium text-[#1c2530]">
              {formatJenisCuti(latestRequest.jenis_cuti)} · {latestRequest.jumlah_hari || latestRequest.lama_hari || 1} hari kerja
            </div>
            <div className="text-[12px] text-[#5a6472] mono my-1 mb-3.5">
              {latestRequest.nomor_surat || '800/CUTI-THN/227/XI/2026'}
            </div>

            <ol className="list-none m-0 p-0 flex flex-col gap-2 text-[13px]">
              <li className="text-[#1c2530]">{getStageStyle(1).label}</li>
              <li className={getStageStyle(2).active ? 'font-semibold text-[#173a5e]' : 'text-[#5a6472]'}>
                {getStageStyle(2).label}
              </li>
              <li className={getStageStyle(3).active ? 'font-semibold text-[#173a5e]' : 'text-[#5a6472]'}>
                {getStageStyle(3).label}
              </li>
              <li className={getStageStyle(4).active ? 'font-semibold text-[#173a5e]' : 'text-[#5a6472]'}>
                {getStageStyle(4).label}
              </li>
            </ol>
          </div>

          <div className="mt-4 pt-3 border-t border-[#e8ebe6] flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onSelectRequestForExport(latestRequest.id);
                setActiveTab('ekspor-cuti');
              }}
              className="text-[13px] text-[#173a5e] hover:underline font-medium p-0 bg-transparent border-0 cursor-pointer"
            >
              Lihat formulir Lampiran II &rarr;
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('riwayat-cuti')}
              className="text-[12px] text-[#5a6472] hover:text-[#173a5e]"
            >
              Semua riwayat
            </button>
          </div>
        </section>

        {/* Card 3 (Sistem Pintar): Audit Kepatuhan Regulasi BKN Real-Time */}
        <section className="lawet-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[16px] font-semibold text-[#1c2530] m-0">
                Audit kepatuhan otomatis
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-[4px] bg-[#e3eaf1] text-[#173a5e] font-medium">
                100% Sah BKN
              </span>
            </div>
            <div className="text-[12px] text-[#5a6472] mb-3.5">
              Verifikasi mesin aturan Peraturan BKN No. 7/2021
            </div>

            <div className="flex flex-col gap-2.5 text-[13px]">
              <div className="flex items-start gap-2.5 pb-2 border-b border-[#e8ebe6]">
                <span className="text-[#173a5e] font-semibold">✓</span>
                <div>
                  <div className="text-[#1c2530] font-medium">Sinkronisasi SIMPEG</div>
                  <div className="text-[11px] text-[#5a6472]">Data kepegawaian & masa kerja tervalidasi</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pb-2 border-b border-[#e8ebe6]">
                <span className="text-[#173a5e] font-semibold">✓</span>
                <div>
                  <div className="text-[#1c2530] font-medium">Syarat Cuti Besar</div>
                  <div className="text-[11px] text-[#5a6472]">Masa kerja {masaKerjaTahun} th {masaKerjaBulan} bln (&ge; 5 th terus-menerus)</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 pb-2 border-b border-[#e8ebe6]">
                <span className="text-[#173a5e] font-semibold">✓</span>
                <div>
                  <div className="text-[#1c2530] font-medium">Perlindungan Kuota FIFO</div>
                  <div className="text-[11px] text-[#5a6472]">Sisa N-1 (6 hari) diprioritaskan potong pertama</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-[#173a5e] font-semibold">✓</span>
                <div>
                  <div className="text-[#1c2530] font-medium">Audit Deteksi Bentrok</div>
                  <div className="text-[11px] text-[#5a6472]">Peringatan otomatis aktif untuk 1 unit kerja</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#e8ebe6] text-[11px] text-[#5a6472]">
            Audited by LawetEngine · Update berkala SIMPEG Kebumen
          </div>
        </section>
      </div>

      {/* Row 2: Libur Unit, Jenis Cuti Lain, dan Rekomendasi Cuti Pintar */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.1fr] gap-6 items-stretch">
        {/* Card 4: Libur dan Cuti Unit */}
        <section className="lawet-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[16px] font-semibold text-[#1c2530] m-0">
                Libur & cuti unit
              </h2>
              <span className="text-[12px] text-[#5a6472] mono">Nov 2026</span>
            </div>
            <div className="text-[12px] text-[#5a6472] mb-3">
              Dilihat sebelum memilih tanggal agar tidak bentrok.
            </div>

            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] mono w-[100px] border-b border-[#e8ebe6]">
                    Sel 10 Nov
                  </td>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">
                    Hari Pahlawan (libur nasional)
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] mono border-b border-[#e8ebe6]">
                    16–18 Nov
                  </td>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">
                    Ahmad Fauzi (Anda)
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] mono border-b border-[#e8ebe6]">
                    20–24 Nov
                  </td>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">
                    Dewi Lestari, S.A.P.
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] mono border-0">
                    Rab 25 Nov
                  </td>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] border-0">
                    Hari Guru Nasional
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#e8ebe6]">
            <button
              type="button"
              onClick={() => setActiveTab('kalender')}
              className="text-[13px] text-[#173a5e] hover:underline font-medium p-0 bg-transparent border-0 cursor-pointer"
            >
              Buka kalender lengkap &rarr;
            </button>
          </div>
        </section>

        {/* Card 5: Jenis Cuti Lain */}
        <section className="lawet-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[16px] font-semibold text-[#1c2530] m-0">
                Jenis cuti lain
              </h2>
              <span className="text-[12px] text-[#5a6472]">7 Hak PNS</span>
            </div>
            <div className="text-[12px] text-[#5a6472] mb-3">
              Status syarat berdasarkan data kepegawaian Anda.
            </div>

            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">
                    Cuti besar
                  </td>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">
                    {eligibleCutiBesar
                      ? `Memenuhi syarat (${masaKerjaTahun} th kerja)`
                      : `Belum memenuhi (min 5 th)`}
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">
                    Cuti sakit
                  </td>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">
                    Hak penuh, surat dokter
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">
                    Cuti melahirkan
                  </td>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">
                    Hak penuh s.d. anak ke-3
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] border-0">
                    Cuti bersama
                  </td>
                  <td className="px-3 py-2 text-[13px] text-[#1c2530] border-0">
                    Tidak memotong cuti tahunan
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#e8ebe6]">
            <button
              type="button"
              onClick={() => setActiveTab('sisa-cuti')}
              className="text-[13px] text-[#173a5e] hover:underline font-medium p-0 bg-transparent border-0 cursor-pointer"
            >
              Lihat matriks hak cuti & penghasilan &rarr;
            </button>
          </div>
        </section>

        {/* Card 6 (Sistem Pintar): Rekomendasi Cuti Pintar / Bridge Day Optimizer */}
        <section className="lawet-card p-5 flex flex-col justify-between bg-gradient-to-br from-white to-[#f7f9f6]">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[16px] font-semibold text-[#1c2530] m-0">
                Rekomendasi cuti pintar
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-[4px] bg-[#fbf3e2] text-[#173a5e] font-semibold border border-[#e3cf9c]">
                Optimalisasi Bridge Day
              </span>
            </div>
            <div className="text-[12px] text-[#5a6472] mb-3">
              Kombinasi hari kejepit cerdas untuk libur maksimal dengan hemat kuota.
            </div>

            {/* Rekomendasi 1 */}
            <div className="p-3 bg-[#e3eaf1]/50 border border-[#dcdfda] rounded-[6px] mb-3">
              <div className="flex items-center justify-between text-[12px] font-semibold text-[#173a5e] mb-1">
                <span>Rekomendasi 1 · Hari Pahlawan</span>
                <span className="mono bg-white px-1.5 py-0.5 rounded border border-[#b9bfb8]/60 text-[11px]">
                  1 Kuota &rarr; 4 Hari Libur
                </span>
              </div>
              <p className="text-[12px] text-[#1c2530] m-0 leading-relaxed">
                Ambil cuti pada <b>Senin, 9 Nov 2026</b> untuk menyambung Hari Pahlawan (Selasa 10 Nov) dengan akhir pekan (7–8 Nov).
              </p>
            </div>

            {/* Rekomendasi 2 */}
            <div className="p-3 bg-white border border-[#dcdfda] rounded-[6px]">
              <div className="flex items-center justify-between text-[12px] font-semibold text-[#173a5e] mb-1">
                <span>Rekomendasi 2 · Libur Natal & Tahun Baru</span>
                <span className="mono bg-[#f4f5f3] px-1.5 py-0.5 rounded border border-[#b9bfb8]/60 text-[11px]">
                  3 Kuota &rarr; 8 Hari Libur
                </span>
              </div>
              <p className="text-[12px] text-[#1c2530] m-0 leading-relaxed">
                Ambil cuti pada <b>28–30 Des 2026</b> pasca Natal untuk menikmati masa libur berkesinambungan hingga tahun baru.
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#e8ebe6]">
            <button
              type="button"
              onClick={() => setActiveTab('ajukan-cuti')}
              className="text-[13px] text-[#173a5e] hover:underline font-medium p-0 bg-transparent border-0 cursor-pointer"
            >
              Terapkan ke formulir pengajuan &rarr;
            </button>
          </div>
        </section>
      </div>

      {/* Row 3: Perlindungan Finansial ASN (1fr) & Log Jejak Audit Terkini (1.3fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-6 items-stretch">
        {/* Card 7: Matriks Hak Keuangan & Gaji */}
        <section className="lawet-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[16px] font-semibold text-[#1c2530] m-0">
                Perlindungan penghasilan ASN saat cuti
              </h2>
              <span className="text-[12px] text-[#5a6472]">Hal. 24 BKN</span>
            </div>
            <div className="text-[12px] text-[#5a6472] mb-3.5">
              Kepastian status hak keuangan pegawai selama menjalankan perizinan.
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center mb-3">
              <div className="p-2.5 bg-[#f4f5f3] rounded-[6px] border border-[#e8ebe6]">
                <div className="text-[11px] text-[#5a6472]">Gaji Pokok</div>
                <div className="text-[13px] font-semibold text-[#173a5e] mt-0.5">100% Tetap</div>
              </div>
              <div className="p-2.5 bg-[#f4f5f3] rounded-[6px] border border-[#e8ebe6]">
                <div className="text-[11px] text-[#5a6472]">Tunjangan Keluarga</div>
                <div className="text-[13px] font-semibold text-[#173a5e] mt-0.5">100% Tetap</div>
              </div>
              <div className="p-2.5 bg-[#f4f5f3] rounded-[6px] border border-[#e8ebe6]">
                <div className="text-[11px] text-[#5a6472]">Tunjangan Jabatan</div>
                <div className="text-[13px] font-semibold text-[#173a5e] mt-0.5">100% Tetap*</div>
              </div>
            </div>

            <p className="text-[12px] text-[#5a6472] leading-relaxed m-0">
              *Tunjangan jabatan tetap dibayar penuh selama Cuti Tahunan, Cuti Sakit, dan Cuti Melahirkan. Tunjangan jabatan tidak dibayarkan khusus selama Cuti Besar (Peraturan BKN No. 7/2021).
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#e8ebe6]">
            <button
              type="button"
              onClick={() => setActiveTab('sisa-cuti')}
              className="text-[13px] text-[#173a5e] hover:underline font-medium p-0 bg-transparent border-0 cursor-pointer"
            >
              Rincian tabel keuangan lengkap &rarr;
            </button>
          </div>
        </section>

        {/* Card 8: Jejak Audit & Notifikasi Berjenjang Terkini */}
        <section className="lawet-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[16px] font-semibold text-[#1c2530] m-0">
                Log aktivitas & jejak audit perizinan
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-[4px] bg-[#e3eaf1] text-[#173a5e] font-medium mono">
                Real-time
              </span>
            </div>
            <div className="text-[12px] text-[#5a6472] mb-3.5">
              Rekam jejak digital verifikasi berjenjang sesuai tata kelola SPBE Kebumen.
            </div>

            <div className="flex flex-col gap-2.5 text-[13px]">
              <div className="flex items-start gap-3 pb-2 border-b border-[#e8ebe6]">
                <span className="mono text-[11px] text-[#5a6472] shrink-0 mt-0.5">03 Nov 14:20</span>
                <div>
                  <span className="font-medium text-[#1c2530]">Permohonan diteruskan ke Atasan Langsung</span>
                  <div className="text-[11px] text-[#5a6472]">
                    Berkas <span className="mono">800/CUTI-THN/227/XI/2026</span> menunggu verifikasi Bambang Trianto, M.T.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-2 border-b border-[#e8ebe6]">
                <span className="mono text-[11px] text-[#5a6472] shrink-0 mt-0.5">01 Nov 08:00</span>
                <div>
                  <span className="font-medium text-[#1c2530]">Sinkronisasi Kuota Cuti N-1 Selesai</span>
                  <div className="text-[11px] text-[#5a6472]">
                    Saldo 6 hari kerja tahun 2025 berhasil diakumulasi ke dalam hak berjalan tahun 2026.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="mono text-[11px] text-[#5a6472] shrink-0 mt-0.5">25 Okt 11:30</span>
                <div>
                  <span className="font-medium text-[#1c2530]">Formulir Lampiran II BKN Terbit & Bertanda Tangan</span>
                  <div className="text-[11px] text-[#5a6472]">
                    Keputusan PPK nomor 800/CUTI-THN/107/X/2026 telah disahkan oleh Kepala BKPSDM.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#e8ebe6] flex items-center justify-between">
            <span className="text-[11px] text-[#5a6472]">Terintegrasi TTE Balai Sertifikasi Elektronik (BSrE)</span>
            <button
              type="button"
              onClick={() => setActiveTab('riwayat-cuti')}
              className="text-[13px] text-[#173a5e] hover:underline font-medium p-0 bg-transparent border-0 cursor-pointer"
            >
              Lihat arsip lengkap &rarr;
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
