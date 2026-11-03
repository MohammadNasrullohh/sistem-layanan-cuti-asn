import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LeaveHistoryView({ setActiveTab, onSelectRequestForExport }) {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [currentUser]);

  const fetchHistory = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/leave-requests?employee_id=${currentUser.id}`);
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error('Failed to load leave history:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'disetujui') {
      return (
        <span className="px-2 py-0.5 rounded-[4px] text-[12px] bg-[#e3eaf1] text-[#173a5e] font-medium">
          Disetujui
        </span>
      );
    }
    if (status === 'diajukan' || status === 'pertimbangan_atasan') {
      return (
        <span className="px-2 py-0.5 rounded-[4px] text-[12px] bg-[#fbf3e2] text-[#1c2530] font-medium">
          Menunggu atasan
        </span>
      );
    }
    if (status === 'disetujui_atasan') {
      return (
        <span className="px-2 py-0.5 rounded-[4px] text-[12px] bg-[#fbf3e2] text-[#1c2530] font-medium">
          Menunggu PPK
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-[4px] text-[12px] bg-[#ecece8] text-[#3b4654]">
        {status}
      </span>
    );
  };

  const displayList = requests.length > 0 ? requests : [
    {
      id: 'cuti-2026-001',
      nomor_surat: '800/CUTI-THN/227/XI/2026',
      jenis_cuti: 'Cuti Tahunan',
      lama_hari: 2,
      status: 'pertimbangan_atasan'
    }
  ];

  return (
    <div className="flex-1 flex flex-col gap-5">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-semibold text-[#1c2530] m-0 tracking-tight">
          Riwayat pengajuan
        </h1>
        <div className="text-[13px] text-[#5a6472] mt-1.5">
          Pengajuan cuti Anda dan formulir resminya.
        </div>
      </div>

      {/* History Table */}
      <section className="lawet-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Nomor
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Jenis
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Hari
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {displayList.map((req, idx) => (
                <tr key={req.id || idx} className="hover:bg-[#f4f5f3]/50 transition-colors">
                  <td className="px-4 py-3 text-[13px] text-[#1c2530] mono border-b border-[#e8ebe6]">
                    {req.nomor_surat || '800/CUTI-THN/227/XI/2026'}
                  </td>
                  <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                    {req.jenis_cuti?.replace('cuti_', 'Cuti ') || 'Cuti Tahunan'}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#1c2530] mono border-b border-[#e8ebe6]">
                    {req.lama_hari || req.jumlah_hari || 2}
                  </td>
                  <td className="px-4 py-3 text-[14px] border-b border-[#e8ebe6]">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="px-4 py-3 text-right text-[14px] border-b border-[#e8ebe6]">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectRequestForExport) onSelectRequestForExport(req.id);
                        if (setActiveTab) setActiveTab('ekspor-cuti');
                      }}
                      className="text-[#173a5e] hover:underline font-medium text-[13px] bg-transparent border-0 cursor-pointer p-0"
                    >
                      {req.status === 'disetujui' ? 'Unduh PDF' : 'Lihat formulir'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
