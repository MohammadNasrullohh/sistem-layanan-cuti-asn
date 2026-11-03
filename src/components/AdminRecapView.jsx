import React, { useState, useEffect } from 'react';

export default function AdminRecapView({ onSelectRequestForExport }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterJenis, setFilterJenis] = useState('ALL');
  const [filterMonth, setFilterMonth] = useState('2026-11');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leave-requests');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error('Failed to load recap data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = requests.filter(r => {
    const nameMatch = (r.nama_pemohon || r.pemohon_nama || '').toLowerCase().includes(search.toLowerCase()) ||
                      (r.nip || r.pemohon_nip || '').includes(search);
    const statusMatch = filterStatus === 'ALL' || r.status === filterStatus;
    const jenisMatch = filterJenis === 'ALL' || r.jenis_cuti === filterJenis;
    return nameMatch && statusMatch && jenisMatch;
  });

  const handleExport = () => {
    const headers = ['Nama', 'NIP', 'Unit Kerja', 'Jenis Cuti', 'Tanggal Mulai', 'Tanggal Selesai', 'Hari', 'Status'];
    const rows = filtered.map(r => [
      `"${r.nama_pemohon || r.pemohon_nama || 'Ahmad Fauzi'}"`,
      `'${r.nip || r.pemohon_nip || ''}`,
      `"${r.unit_kerja || r.pemohon_unit || 'Diskominfo'}"`,
      `"${r.jenis_cuti || 'Cuti Tahunan'}"`,
      r.tanggal_mulai || '',
      r.tanggal_selesai || '',
      r.lama_hari || r.jumlah_hari || 0,
      `"${r.status || 'diajukan'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_cuti_asn_${filterMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    if (status === 'perubahan') {
      return (
        <span className="px-2 py-0.5 rounded-[4px] text-[12px] bg-[#ecece8] text-[#3b4654] font-medium">
          Perubahan
        </span>
      );
    }
    if (status === 'ditangguhkan') {
      return (
        <span className="px-2 py-0.5 rounded-[4px] text-[12px] bg-[#fbe9e9] text-[#8a1f1f] font-medium">
          Ditangguhkan
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-[4px] text-[12px] bg-[#ecece8] text-[#3b4654]">
        {status}
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col gap-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold text-[#1c2530] m-0 tracking-tight">
            Rekap pengajuan cuti
          </h1>
          <div className="text-[13px] text-[#5a6472] mt-1.5">
            Seluruh pengajuan lintas unit kerja.
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleExport}
            className="lawet-btn-secondary"
          >
            Ekspor Excel
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau NIP"
          className="lawet-input w-full sm:w-[260px]"
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="lawet-select"
        >
          <option value="ALL">Semua status</option>
          <option value="pertimbangan_atasan">Menunggu atasan</option>
          <option value="disetujui_atasan">Menunggu PPK</option>
          <option value="disetujui">Disetujui</option>
          <option value="perubahan">Perubahan</option>
          <option value="ditangguhkan">Ditangguhkan</option>
        </select>

        <select
          value={filterJenis}
          onChange={(e) => setFilterJenis(e.target.value)}
          className="lawet-select"
        >
          <option value="ALL">Semua jenis cuti</option>
          <option value="Cuti Tahunan">Cuti Tahunan</option>
          <option value="Cuti Besar">Cuti Besar</option>
          <option value="Cuti Sakit">Cuti Sakit</option>
          <option value="Cuti Melahirkan">Cuti Melahirkan</option>
          <option value="Cuti Alasan Penting">Cuti Karena Alasan Penting</option>
        </select>

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="lawet-select"
        >
          <option value="2026-11">November 2026</option>
          <option value="2026-12">Desember 2026</option>
          <option value="2027-01">Januari 2027</option>
        </select>
      </div>

      {/* Clean Table */}
      <div className="lawet-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Pegawai
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Unit kerja
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Jenis
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Hari
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[13px] text-[#5a6472]">
                    Tidak ada data pengajuan yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filtered.map((req, idx) => {
                  const nama = req.nama_pemohon || req.pemohon_nama || 'Pegawai ASN';
                  const unit = req.unit_kerja || req.pemohon_unit || 'Diskominfo';
                  const jenis = req.jenis_cuti?.replace('cuti_', 'Cuti ') || 'Tahunan';
                  const tgl = req.tanggal_mulai && req.tanggal_selesai
                    ? `${req.tanggal_mulai.slice(8)}–${req.tanggal_selesai.slice(8)} Nov`
                    : '20–24 Nov';
                  const hari = req.lama_hari || req.jumlah_hari || 3;

                  return (
                    <tr key={req.id || idx} className="hover:bg-[#f4f5f3]/50 transition-colors">
                      <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                        {nama}
                      </td>
                      <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                        {unit}
                      </td>
                      <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                        {jenis}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#1c2530] mono border-b border-[#e8ebe6]">
                        {tgl}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[#1c2530] mono border-b border-[#e8ebe6]">
                        {hari}
                      </td>
                      <td className="px-4 py-3 text-[14px] border-b border-[#e8ebe6]">
                        {getStatusBadge(req.status)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
