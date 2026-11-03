import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  Building2, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Printer, 
  Calendar,
  Sparkles
} from 'lucide-react';

export default function AdminRecapView({ onSelectRequestForExport }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterUnit, setFilterUnit] = useState('ALL');
  const [filterJenis, setFilterJenis] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

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

  // Filtered requests
  const filtered = requests.filter(r => {
    const matchSearch = (r.pemohon_nama?.toLowerCase().includes(search.toLowerCase()) || 
                         r.pemohon_nip?.includes(search) || 
                         r.nomor_surat?.toLowerCase().includes(search.toLowerCase()));
    const matchUnit = filterUnit === 'ALL' || r.pemohon_unit === filterUnit;
    const matchJenis = filterJenis === 'ALL' || r.jenis_cuti === filterJenis;
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    return matchSearch && matchUnit && matchJenis && matchStatus;
  });

  // Calculate statistics
  const totalApproved = filtered.filter(r => r.status === 'disetujui').length;
  const totalPending = filtered.filter(r => r.status === 'diajukan' || r.status === 'pertimbangan_atasan').length;
  const totalDays = filtered.reduce((acc, cur) => acc + (cur.jumlah_hari || 0), 0);

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = [
      'No',
      'No Registrasi',
      'NIP',
      'Nama Pegawai',
      'Jenis ASN',
      'Jabatan',
      'Unit Kerja',
      'Jenis Cuti',
      'Tgl Mulai',
      'Tgl Selesai',
      'Jumlah Hari',
      'Alasan Cuti',
      'Status Permohonan',
      'Nomor SK Cuti'
    ];

    const rows = filtered.map((r, i) => [
      i + 1,
      `"${r.nomor_surat || r.id}"`,
      `'${r.pemohon_nip}`,
      `"${r.pemohon_nama}"`,
      r.pemohon_jenis_asn || 'PNS',
      `"${r.pemohon_jabatan || '-'}"`,
      `"${r.pemohon_unit || '-'}"`,
      r.jenis_cuti,
      r.tanggal_mulai,
      r.tanggal_selesai,
      r.jumlah_hari,
      `"${(r.alasan_cuti || '').replace(/"/g, '""')}"`,
      r.status,
      `"${r.nomor_sk || '-'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekapitulasi_Cuti_ASN_Kebumen_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Manajemen & Pelaporan BKPSDM</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Rekapitulasi Data Cuti ASN
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Laporan agregat cuti seluruh Perangkat Daerah Kabupaten Kebumen sesuai Peraturan BKN No. 7/2021
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs md:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Ekspor Rekapitulasi (CSV / Excel)
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500">Total Berkas Cuti</span>
          <div className="text-2xl font-extrabold text-slate-800">{filtered.length}</div>
          <p className="text-[10px] text-slate-400">Tersaring dalam sistem</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500">Telah Disetujui (SK)</span>
          <div className="text-2xl font-extrabold text-emerald-600">{totalApproved}</div>
          <p className="text-[10px] text-emerald-700">SK penetapan terbit</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500">Dalam Proses Verifikasi</span>
          <div className="text-2xl font-extrabold text-amber-600">{totalPending}</div>
          <p className="text-[10px] text-amber-700">Atasan / PPK</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500">Total Hari Kerja Diambil</span>
          <div className="text-2xl font-extrabold text-purple-600">{totalDays} Hari</div>
          <p className="text-[10px] text-slate-400">Seluruh jenis cuti</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIP, atau no surat..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <select
            value={filterUnit}
            onChange={(e) => setFilterUnit(e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">Semua Unit Kerja / SKPD</option>
            <option value="Dinas Komunikasi dan Informatika">Dinas Komunikasi dan Informatika</option>
            <option value="SMP Negeri 1 Kebumen">SMP Negeri 1 Kebumen</option>
            <option value="Badan Kepegawaian dan Pengembangan SDM">BKPSDM</option>
          </select>
        </div>

        <div>
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">Semua Jenis Cuti</option>
            <option value="cuti_tahunan">Cuti Tahunan</option>
            <option value="cuti_besar">Cuti Besar</option>
            <option value="cuti_sakit">Cuti Sakit</option>
            <option value="cuti_melahirkan">Cuti Melahirkan</option>
            <option value="cuti_alasan_penting">Cuti Alasan Penting</option>
            <option value="cuti_bersama">Cuti Bersama</option>
            <option value="cltn">CLTN</option>
          </select>
        </div>

        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">Semua Status</option>
            <option value="disetujui">Disetujui (Terbit SK)</option>
            <option value="pertimbangan_atasan">Pertimbangan Atasan</option>
            <option value="diajukan">Baru Diajukan</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
              <th className="pb-3 font-semibold">No</th>
              <th className="pb-3 font-semibold">Pegawai Pemohon</th>
              <th className="pb-3 font-semibold">Unit Kerja</th>
              <th className="pb-3 font-semibold">Jenis Cuti</th>
              <th className="pb-3 font-semibold">Periode & Durasi</th>
              <th className="pb-3 font-semibold">Status & No. SK</th>
              <th className="pb-3 font-semibold text-right">Formulir BKN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((r, idx) => (
              <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 pr-2 text-slate-400 font-mono">{idx + 1}</td>
                
                <td className="py-3.5 pr-3">
                  <div className="font-bold text-slate-900">{r.pemohon_nama}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {r.pemohon_nip} • <span className="font-semibold text-blue-600">{r.pemohon_jenis_asn}</span>
                  </div>
                </td>

                <td className="py-3.5 pr-3 text-slate-600 text-[11px]">
                  {r.pemohon_unit}
                </td>

                <td className="py-3.5 pr-3">
                  <span className="font-semibold text-slate-800 capitalize">
                    {r.jenis_cuti.replace('_', ' ')}
                  </span>
                  <div className="text-[10px] text-slate-400 truncate max-w-xs">{r.alasan_cuti}</div>
                </td>

                <td className="py-3.5 pr-3">
                  <span className="font-bold text-slate-800">{r.jumlah_hari} Hari Kerja</span>
                  <div className="text-[10px] text-slate-400">{r.tanggal_mulai} s.d {r.tanggal_selesai}</div>
                </td>

                <td className="py-3.5 pr-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    r.status === 'disetujui' ? 'bg-emerald-100 text-emerald-800' :
                    r.status === 'pertimbangan_atasan' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {r.status.toUpperCase()}
                  </span>
                  {r.nomor_sk && (
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{r.nomor_sk}</div>
                  )}
                </td>

                <td className="py-3.5 text-right">
                  <button
                    onClick={() => onSelectRequestForExport(r.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition-colors inline-flex items-center gap-1 border border-blue-200 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Lampiran II
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
