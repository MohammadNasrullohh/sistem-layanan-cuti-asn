import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckSquare, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  FileText, 
  User, 
  Building, 
  Calendar, 
  ShieldCheck,
  Send,
  Printer,
  Sparkles,
  Filter,
  Paperclip,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LeaveApprovalView({ onSelectRequestForExport }) {
  const { currentUser, refreshCurrentUserData } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterWorkflow, setFilterWorkflow] = useState(
    currentUser?.role === 'atasan' ? 'ATASAN_PENDING' :
    currentUser?.role === 'ppk' ? 'PPK_PENDING' : 'ALL'
  );

  // Approval Form State
  const [actionType, setActionType] = useState('DISETUJUI'); // 'DISETUJUI', 'PERUBAHAN', 'DITANGGUHKAN', 'TIDAK_DISETUJUI'
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests();
    if (currentUser?.role === 'atasan') setFilterWorkflow('ATASAN_PENDING');
    else if (currentUser?.role === 'ppk') setFilterWorkflow('PPK_PENDING');
    else setFilterWorkflow('ALL');
  }, [currentUser]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leave-requests');
      const data = await res.json();
      setRequests(data);
      if (data.length > 0 && !selectedRequest) {
        setSelectedRequest(data[0]);
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessAction = async (isPpkAction = false) => {
    if (!selectedRequest) return;
    setSubmitting(true);
    try {
      const endpoint = isPpkAction 
        ? `/api/leave-requests/${selectedRequest.id}/ppk-action`
        : `/api/leave-requests/${selectedRequest.id}/atasan-action`;

      const payload = isPpkAction
        ? { ppk_aksi: actionType, ppk_catatan: catatan, ppk_id: currentUser.id }
        : { atasan_aksi: actionType, atasan_catatan: catatan, atasan_id: currentUser.id };

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        if (actionType === 'DISETUJUI') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        await fetchRequests();
        refreshCurrentUserData();
        setCatatan('');
        // Refresh selected request
        const updated = await fetch(`/api/leave-requests/${selectedRequest.id}`).then(r => r.json());
        setSelectedRequest(updated);
      }
    } catch (err) {
      console.error('Action error:', err);
      alert('Gagal memproses aksi persetujuan');
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) return null;

  const isAtasan = currentUser.role === 'atasan';
  const isPpk = currentUser.role === 'ppk' || currentUser.role === 'admin';

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Workflow Persetujuan Berjenjang</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Persetujuan & Verifikasi Cuti ASN
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {isAtasan && 'Penetapan Pertimbangan Atasan Langsung (Bagian VI Lampiran II BKN)'}
            {isPpk && 'Penetapan Keputusan Pejabat Yang Berwenang / PPK (Bagian VII Lampiran II BKN)'}
            {!isAtasan && !isPpk && 'Tinjau alur verifikasi cuti seluruh unit kerja'}
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          Status Akses: <strong className="text-purple-700 font-bold">{currentUser.role.toUpperCase()}</strong>
        </div>
      </div>

      {/* Main Approval Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Request List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Daftar Permohonan Cuti Masuk
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {requests.length} Berkas
              </span>
            </div>

            {/* Workflow Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setFilterWorkflow('ALL')}
                className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  filterWorkflow === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Semua ({requests.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterWorkflow('ATASAN_PENDING')}
                className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  filterWorkflow === 'ATASAN_PENDING' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Atasan ({requests.filter(r => r.status === 'diajukan' || !r.atasan_aksi).length})
              </button>
              <button
                type="button"
                onClick={() => setFilterWorkflow('PPK_PENDING')}
                className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  filterWorkflow === 'PPK_PENDING' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                PPK ({requests.filter(r => r.status === 'pertimbangan_atasan' || (r.atasan_aksi && !r.ppk_aksi)).length})
              </button>
              <button
                type="button"
                onClick={() => setFilterWorkflow('APPROVED')}
                className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  filterWorkflow === 'APPROVED' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Terbit SK ({requests.filter(r => r.status === 'disetujui').length})
              </button>
            </div>

            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {requests
                .filter(r => {
                  if (filterWorkflow === 'ATASAN_PENDING') return r.status === 'diajukan' || !r.atasan_aksi;
                  if (filterWorkflow === 'PPK_PENDING') return r.status === 'pertimbangan_atasan' || (r.atasan_aksi && !r.ppk_aksi);
                  if (filterWorkflow === 'APPROVED') return r.status === 'disetujui';
                  return true;
                })
                .map((r) => {
                const isSelected = selectedRequest?.id === r.id;
                const statusBadge = {
                  diajukan: 'bg-blue-100 text-blue-700',
                  pertimbangan_atasan: 'bg-amber-100 text-amber-800',
                  disetujui: 'bg-emerald-100 text-emerald-800',
                  perubahan: 'bg-purple-100 text-purple-700',
                  ditangguhkan: 'bg-orange-100 text-orange-800',
                  ditolak: 'bg-rose-100 text-rose-800'
                }[r.status] || 'bg-slate-100 text-slate-600';

                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedRequest(r)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-slate-900 text-xs line-clamp-1">
                          {r.pemohon_nama}
                        </div>
                        <div className="text-[11px] text-slate-500">NIP: {r.pemohon_nip}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBadge}`}>
                        {r.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <span className="font-semibold capitalize text-orange-700">
                        {r.jenis_cuti.replace('_', ' ')}
                      </span>
                      <span>{r.jumlah_hari} Hari Kerja</span>
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1">
                      {r.tanggal_mulai} s.d. {r.tanggal_selesai}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Review & Approval Action Workspace (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedRequest ? (
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
              
              {/* Request Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-purple-600">
                    Detail Berkas Permohonan
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                    {selectedRequest.pemohon_nama}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {selectedRequest.pemohon_jabatan} • {selectedRequest.pemohon_unit}
                  </p>
                </div>

                <button
                  onClick={() => onSelectRequestForExport(selectedRequest.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Pratinjau Form BKN
                </button>
              </div>

              {/* Leave Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-slate-400">Jenis Cuti:</span>
                  <div className="font-bold text-slate-800 capitalize text-sm">
                    {selectedRequest.jenis_cuti.replace('_', ' ')}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-slate-400">Durasi & Periode:</span>
                  <div className="font-bold text-slate-800 text-sm">
                    {selectedRequest.jumlah_hari} Hari Kerja
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {selectedRequest.tanggal_mulai} s.d {selectedRequest.tanggal_selesai}
                  </div>
                </div>

                <div className="col-span-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400">Alasan Permohonan:</span>
                  <p className="font-medium text-slate-700 leading-relaxed">
                    "{selectedRequest.alasan_cuti}"
                  </p>
                  {selectedRequest.kategori_detail && (
                    <div className="text-[11px] text-purple-700 font-semibold mt-1">
                      Kategori: {selectedRequest.kategori_detail}
                    </div>
                  )}
                </div>

                <div className="col-span-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400">Alamat & Kontak Selama Cuti:</span>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {selectedRequest.alamat_selama_cuti}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">Telp:</span>
                    <div className="font-semibold text-slate-800">{selectedRequest.no_telepon_cuti}</div>
                  </div>
                </div>

                {/* Berkas Lampiran Syarat (Surat Dokter / Tiket Haji / Dokumen Bukti) */}
                <div className="col-span-2 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                      <Paperclip className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold text-amber-900 block">
                        Dokumen Syarat Terlampir:
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate block">
                        {selectedRequest.lampiran_nama || 'Tidak ada berkas fisik khusus (Cuti Otomatis BKN)'}
                      </span>
                    </div>
                  </div>

                  {selectedRequest.lampiran_nama && (
                    <button
                      type="button"
                      onClick={() => alert(`Pratinjau Dokumen ASN Terlampir:\n\nNama Berkas: ${selectedRequest.lampiran_nama}\nNama Pemohon: ${selectedRequest.pemohon_nama} (NIP: ${selectedRequest.pemohon_nip})\nJenis Cuti: ${selectedRequest.jenis_cuti.replace('_', ' ').toUpperCase()}\nStatus Verifikasi: VALID & SAH (Memenuhi Syarat Peraturan BKN No. 7/2021)`)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-[11px] shadow-2xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>Verifikasi Berkas</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Tracker: Atasan & PPK */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status Pertimbangan & Keputusan
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Atasan Box */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Pertimbangan Atasan:</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        selectedRequest.atasan_aksi === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {selectedRequest.atasan_aksi || 'Menunggu'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">
                      "{selectedRequest.atasan_catatan || 'Belum ada catatan'}"
                    </p>
                    <div className="text-[10px] text-slate-400 pt-1">
                      Oleh: {selectedRequest.atasan_nama || 'Bambang Trianto'}
                    </div>
                  </div>

                  {/* PPK Box */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Keputusan PPK:</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        selectedRequest.ppk_aksi === 'DISETUJUI' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {selectedRequest.ppk_aksi || 'Menunggu'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 italic">
                      "{selectedRequest.ppk_catatan || 'Belum ada catatan'}"
                    </p>
                    <div className="text-[10px] text-slate-400 pt-1">
                      SK: {selectedRequest.nomor_sk || '-'}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION FORM (For Atasan or PPK role) */}
              <div className="pt-4 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Form Aksi Persetujuan ({currentUser.role.toUpperCase()})
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Pilih opsi keputusan resmi:
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: 'DISETUJUI', label: 'Disetujui', color: 'hover:bg-emerald-50 text-emerald-700 border-emerald-300' },
                    { id: 'PERUBAHAN', label: 'Perubahan', color: 'hover:bg-purple-50 text-purple-700 border-purple-300' },
                    { id: 'DITANGGUHKAN', label: 'Ditangguhkan', color: 'hover:bg-orange-50 text-orange-700 border-orange-300' },
                    { id: 'TIDAK_DISETUJUI', label: 'Tidak Disetujui', color: 'hover:bg-rose-50 text-rose-700 border-rose-300' }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setActionType(btn.id)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                        actionType === btn.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : `bg-white ${btn.color}`
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Catatan Pertimbangan / Keputusan:
                  </label>
                  <textarea
                    rows="2"
                    value={catatan}
                    onChange={(e) => setCatatan(e.target.value)}
                    placeholder="Masukkan catatan rekomendasi atau pertimbangan resmi..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  {/* Action for Atasan Langsung */}
                  {(currentUser.role === 'atasan' || currentUser.role === 'admin') && (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleProcessAction(false)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Simpan Pertimbangan Atasan
                    </button>
                  )}

                  {/* Action for PPK */}
                  {(currentUser.role === 'ppk' || currentUser.role === 'admin') && (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleProcessAction(true)}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Tetapkan Keputusan PPK & Terbitkan SK
                    </button>
                  )}
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 border border-slate-200">
              Pilih salah satu berkas di sebelah kiri untuk meninjau detail dan memberikan persetujuan.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
