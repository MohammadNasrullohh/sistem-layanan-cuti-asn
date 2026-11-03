import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

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

  const cutiN = currentUser?.cuti_n ?? 12;
  const cutiN1 = currentUser?.cuti_n1 ?? 6;
  const cutiN2 = currentUser?.cuti_n2 ?? 0;
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
    <div className="flex-1 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold text-[#1c2530] m-0 tracking-tight">
            Ringkasan cuti
          </h1>
          <div className="text-[13px] text-[#5a6472] mt-1.5">
            {currentUser?.jabatan || 'Pranata Komputer Ahli Muda'} · NIP{' '}
            <span className="mono">{currentUser?.nip || '199208152018021003'}</span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setActiveTab('ajukan-cuti')}
            className="lawet-btn"
          >
            Ajukan cuti
          </button>
        </div>
      </div>

      {/* Top Grid: Saldo & Pengajuan Terakhir */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
        {/* Card: Saldo Cuti Tahunan */}
        <section className="lawet-card">
          <div className="p-5 pb-1 flex justify-between items-baseline">
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

          <div className="mt-2 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-[12px] font-medium text-[#5a6472] px-4 py-3 border-b border-[#e8ebe6]">
                    Tahun
                  </th>
                  <th className="text-left text-[12px] font-medium text-[#5a6472] px-4 py-3 border-b border-[#e8ebe6]">
                    Saldo
                  </th>
                  <th className="text-left text-[12px] font-medium text-[#5a6472] px-4 py-3 border-b border-[#e8ebe6]">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                    2026 (N)
                  </td>
                  <td className="px-4 py-3 text-[14px] text-[#1c2530] mono border-b border-[#e8ebe6]">
                    {cutiN} hari
                  </td>
                  <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                    Hak tahun berjalan
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                    2025 (N-1)
                  </td>
                  <td className="px-4 py-3 text-[14px] text-[#1c2530] mono border-b border-[#e8ebe6]">
                    {cutiN1} hari
                  </td>
                  <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                    Sisa dibawa, paling banyak 6 hari
                  </td>
                </tr>
                <tr className="text-[#5a6472]">
                  <td className="px-4 py-3 text-[14px] border-0">
                    2024 (N-2)
                  </td>
                  <td className="px-4 py-3 text-[14px] mono border-0">
                    {cutiN2} hari
                  </td>
                  <td className="px-4 py-3 text-[14px] border-0">
                    Hanya jika ditangguhkan PPK
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Card: Pengajuan Terakhir */}
        <section className="lawet-card p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1c2530] m-0 mb-3.5">
              Pengajuan terakhir
            </h2>
            <div className="text-[14px] font-medium text-[#1c2530]">
              {latestRequest.jenis_cuti} · {latestRequest.lama_hari} hari kerja
            </div>
            <div className="text-[12px] text-[#5a6472] mono my-1 mb-4">
              {latestRequest.nomor_surat || '800/CUTI-THN/227/XI/2026'}
            </div>

            <ol className="list-none m-0 p-0 flex flex-col gap-2.5 text-[13px]">
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

          <div className="mt-4 pt-3 border-t border-[#e8ebe6]">
            <button
              type="button"
              onClick={() => {
                onSelectRequestForExport(latestRequest.id);
                setActiveTab('ekspor-cuti');
              }}
              className="text-[13px] text-[#173a5e] hover:underline font-medium p-0 bg-transparent border-0 cursor-pointer"
            >
              Lihat dokumen &rarr;
            </button>
          </div>
        </section>
      </div>

      {/* Bottom Card: Libur/Cuti Unit & Jenis Cuti Lain */}
      <section className="lawet-card p-5 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Sub-column */}
        <div>
          <h2 className="text-[16px] font-semibold text-[#1c2530] m-0 mb-1">
            Libur dan cuti unit · November 2026
          </h2>
          <div className="text-[12px] text-[#5a6472] mb-3.5">
            Dilihat sebelum memilih tanggal agar tidak bentrok.
          </div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="px-3 py-2.5 text-[14px] text-[#1c2530] mono w-[120px] border-b border-[#e8ebe6]">
                  Sel 10 Nov
                </td>
                <td className="px-3 py-2.5 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                  Hari Pahlawan (libur nasional)
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-[14px] text-[#1c2530] mono border-b border-[#e8ebe6]">
                  16–18 Nov
                </td>
                <td className="px-3 py-2.5 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                  Ahmad Fauzi (Anda)
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-[14px] text-[#1c2530] mono border-0">
                  20–24 Nov
                </td>
                <td className="px-3 py-2.5 text-[14px] text-[#1c2530] border-0">
                  Dewi Lestari, S.A.P.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Sub-column */}
        <div>
          <h2 className="text-[16px] font-semibold text-[#1c2530] m-0 mb-1">
            Jenis cuti lain
          </h2>
          <div className="text-[12px] text-[#5a6472] mb-3.5">
            Status syarat berdasarkan data kepegawaian Anda.
          </div>
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="px-3 py-2.5 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                  Cuti besar
                </td>
                <td className="px-3 py-2.5 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                  {eligibleCutiBesar
                    ? `Memenuhi syarat (masa kerja ${masaKerjaTahun} th ${masaKerjaBulan} bln)`
                    : `Belum memenuhi (minimal 5 th terus-menerus)`}
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                  Cuti sakit
                </td>
                <td className="px-3 py-2.5 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                  Hak penuh, perlu surat dokter
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 text-[14px] text-[#1c2530] border-0">
                  Cuti bersama
                </td>
                <td className="px-3 py-2.5 text-[14px] text-[#1c2530] border-0">
                  Tidak memotong cuti tahunan
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
