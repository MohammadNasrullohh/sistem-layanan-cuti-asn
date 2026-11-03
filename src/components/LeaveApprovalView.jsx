import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';

export default function LeaveApprovalView({ onSelectRequestForExport }) {
  const { currentUser, refreshCurrentUserData } = useAuth();
  const [requests, setRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [actionType, setActionType] = useState('DISETUJUI'); // 'DISETUJUI', 'PERUBAHAN', 'DITANGGUHKAN'
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '' });

  const isPpkRole = currentUser?.role === 'ppk';

  useEffect(() => {
    fetchRequests();
  }, [currentUser]);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/leave-requests');
      const data = await res.json();
      setRequests(data);
      if (data.length > 0 && !selectedRequestId) {
        setSelectedRequestId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load requests:', err);
    }
  };

  const selectedRequest = requests.find(r => r.id === selectedRequestId) || requests[0] || {
    id: 'cuti-2026-001',
    nama_pemohon: 'Ahmad Fauzi, S.Kom.',
    jabatan: 'Pranata Komputer Ahli Muda',
    unit_kerja: 'Dinas Komunikasi dan Informatika',
    jenis_cuti: 'Cuti Tahunan',
    tanggal_mulai: '2026-11-20',
    tanggal_selesai: '2026-11-24',
    lama_hari: 3,
    alasan: 'Keperluan keluarga',
    status: 'pertimbangan_atasan'
  };

  const handleProcessAction = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    if ((actionType === 'PERUBAHAN' || actionType === 'DITANGGUHKAN') && !catatan.trim()) {
      setModalInfo({
        isOpen: true,
        title: 'Catatan Diperlukan',
        message: 'Berdasarkan Peraturan BKN No. 7 Tahun 2021, catatan pertimbangan wajib diisi apabila memilih opsi Perubahan atau Ditangguhkan agar pegawai mengetahui alasan dinas yang mendasari.'
      });
      return;
    }

    setSubmitting(true);
    setFeedbackMsg('');

    try {
      const endpoint = isPpkRole
        ? `/api/leave-requests/${selectedRequest.id}/ppk-action`
        : `/api/leave-requests/${selectedRequest.id}/atasan-action`;

      const payload = isPpkRole
        ? { ppk_aksi: actionType, ppk_catatan: catatan, ppk_id: currentUser?.id || 4 }
        : { atasan_aksi: actionType, atasan_catatan: catatan, atasan_id: currentUser?.id || 2 };

      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackMsg(`Pertimbangan berhasil dikirimkan: ${actionType}.`);
        setCatatan('');
        await fetchRequests();
        if (refreshCurrentUserData) refreshCurrentUserData();
      } else {
        setModalInfo({
          isOpen: true,
          title: 'Kendala Pemrosesan',
          message: data.error || 'Gagal memproses pertimbangan cuti kepegawaian.'
        });
      }
    } catch (err) {
      console.error(err);
      setModalInfo({
        isOpen: true,
        title: 'Kesalahan Sistem',
        message: 'Terjadi kendala teknis saat memproses pertimbangan. Silakan periksa koneksi server.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-[26px] font-semibold text-[#1c2530] m-0 tracking-tight">
          {isPpkRole ? 'Keputusan Pejabat Pembina Kepegawaian (PPK)' : 'Pertimbangan atasan'}
        </h1>
        <div className="text-[13px] text-[#5a6472] mt-1.5">
          {isPpkRole
            ? 'Pengajuan yang telah disetujui atasan langsung menunggu penetapan keputusan resmi Anda.'
            : 'Pengajuan ini menunggu pertimbangan Anda sebelum diteruskan ke PPK.'}
        </div>
      </div>

      {feedbackMsg && (
        <div className="bg-[#e3eaf1] border border-[#173a5e]/30 text-[#173a5e] text-[13px] font-medium rounded-[6px] p-3">
          {feedbackMsg}
        </div>
      )}

      {/* Select Request if Multiple are Pending */}
      {requests.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          <span className="text-[12px] text-[#5a6472] shrink-0">Pilih berkas:</span>
          {requests.map((req) => (
            <button
              key={req.id}
              type="button"
              onClick={() => setSelectedRequestId(req.id)}
              className={`px-3 py-1.5 rounded-[6px] text-[13px] border transition-colors shrink-0 ${
                selectedRequest.id === req.id
                  ? 'border-[#173a5e] bg-[#e3eaf1] text-[#173a5e] font-medium'
                  : 'border-[#dcdfda] bg-white text-[#3b4654] hover:bg-[#e8ebe6]'
              }`}
            >
              {req.nama_pemohon?.split(',')[0]} ({req.lama_hari} hr)
            </button>
          ))}
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Applicant Detail */}
        <section className="lawet-card p-6 flex flex-col">
          <h2 className="text-[16px] font-semibold text-[#1c2530] m-0 mb-1">
            {selectedRequest.nama_pemohon || 'Ahmad Fauzi, S.Kom.'}
          </h2>
          <div className="text-[12px] text-[#5a6472] mb-3">
            {selectedRequest.jabatan || 'Pranata Komputer Ahli Muda'} · {selectedRequest.unit_kerja || 'Dinas Komunikasi dan Informatika'}
          </div>

          <div className="flex justify-between items-center py-2.5 border-b border-[#e8ebe6] text-[14px]">
            <span className="text-[#1c2530]">Jenis cuti</span>
            <span className="text-[#1c2530] font-medium">{selectedRequest.jenis_cuti}</span>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b border-[#e8ebe6] text-[14px]">
            <span className="text-[#1c2530]">Tanggal</span>
            <span className="mono text-[#1c2530]">
              {selectedRequest.tanggal_mulai} s.d. {selectedRequest.tanggal_selesai}
            </span>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b border-[#e8ebe6] text-[14px]">
            <span className="text-[#1c2530]">Durasi</span>
            <span className="mono text-[#1c2530]">{selectedRequest.lama_hari} hari kerja</span>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b border-[#e8ebe6] text-[14px]">
            <span className="text-[#1c2530]">Saldo N sesudah</span>
            <span className="mono font-semibold text-[#173a5e]">9 hari</span>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b border-[#e8ebe6] text-[14px]">
            <span className="text-[#1c2530]">Alasan</span>
            <span className="text-[#1c2530]">{selectedRequest.alasan || 'Keperluan keluarga'}</span>
          </div>

          {/* Conflict warning banner */}
          <div className="mt-4 bg-[#fbf3e2] border border-[#e3cf9c] rounded-[6px] p-3 text-[13px] text-[#1c2530] leading-relaxed">
            Bersamaan dengan cuti Dewi Lestari, S.A.P. (20–24 Nov) di unit yang sama.
          </div>

          {onSelectRequestForExport && (
            <div className="mt-4 pt-3 border-t border-[#e8ebe6]">
              <button
                type="button"
                onClick={() => onSelectRequestForExport(selectedRequest.id)}
                className="text-[13px] text-[#173a5e] hover:underline font-medium bg-transparent border-0 cursor-pointer p-0"
              >
                Tinjau draf Formulir Lampiran II &rarr;
              </button>
            </div>
          )}
        </section>

        {/* Right Card: Consideration / Decision */}
        <section className="lawet-card p-6 flex flex-col gap-3.5">
          <h2 className="text-[16px] font-semibold text-[#1c2530] m-0 mb-1">
            {isPpkRole ? 'Keputusan Anda' : 'Pertimbangan Anda'}
          </h2>

          <label
            className={`flex items-start gap-3 p-3.5 border rounded-[6px] text-[14px] cursor-pointer transition-colors ${
              actionType === 'DISETUJUI' ? 'border-[#173a5e] bg-[#e3eaf1]/40' : 'border-[#b9bfb8] bg-white'
            }`}
          >
            <input
              type="radio"
              name="actionType"
              value="DISETUJUI"
              checked={actionType === 'DISETUJUI'}
              onChange={() => setActionType('DISETUJUI')}
              className="mt-1"
            />
            <div>
              <b className="text-[#1c2530]">Disetujui</b>
              <div className="text-[12px] text-[#5a6472] mt-0.5">
                {isPpkRole ? 'Penetapan resmi, formulir Lampiran II diterbitkan.' : 'Diteruskan ke PPK apa adanya.'}
              </div>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-3.5 border rounded-[6px] text-[14px] cursor-pointer transition-colors ${
              actionType === 'PERUBAHAN' ? 'border-[#173a5e] bg-[#e3eaf1]/40' : 'border-[#b9bfb8] bg-white'
            }`}
          >
            <input
              type="radio"
              name="actionType"
              value="PERUBAHAN"
              checked={actionType === 'PERUBAHAN'}
              onChange={() => setActionType('PERUBAHAN')}
              className="mt-1"
            />
            <div>
              <b className="text-[#1c2530]">Perubahan</b>
              <div className="text-[12px] text-[#5a6472] mt-0.5">
                Usulkan tanggal lain kepada pegawai.
              </div>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-3.5 border rounded-[6px] text-[14px] cursor-pointer transition-colors ${
              actionType === 'DITANGGUHKAN' ? 'border-[#173a5e] bg-[#e3eaf1]/40' : 'border-[#b9bfb8] bg-white'
            }`}
          >
            <input
              type="radio"
              name="actionType"
              value="DITANGGUHKAN"
              checked={actionType === 'DITANGGUHKAN'}
              onChange={() => setActionType('DITANGGUHKAN')}
              className="mt-1"
            />
            <div>
              <b className="text-[#1c2530]">Ditangguhkan</b>
              <div className="text-[12px] text-[#5a6472] mt-0.5">
                Karena kepentingan dinas mendesak.
              </div>
            </div>
          </label>

          <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-[13px] font-medium text-[#1c2530]">
              Catatan (wajib untuk perubahan atau penangguhan)
            </label>
            <textarea
              rows={3}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Tuliskan alasan pertimbangan atau usulan tanggal pengganti..."
              className="lawet-input"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleProcessAction}
              disabled={submitting}
              className="lawet-btn"
            >
              {submitting ? 'Memproses...' : (isPpkRole ? 'Tetapkan keputusan' : 'Kirim pertimbangan')}
            </button>
          </div>
        </section>
      </div>

      {/* LawetHub Cohesive Modal Dialog */}
      <Modal
        isOpen={modalInfo.isOpen}
        onClose={() => setModalInfo({ ...modalInfo, isOpen: false })}
        title={modalInfo.title}
        actions={
          <button
            type="button"
            onClick={() => setModalInfo({ ...modalInfo, isOpen: false })}
            className="lawet-btn"
          >
            Mengerti
          </button>
        }
      >
        <p className="m-0 text-[14px] leading-relaxed text-[#1c2530]">
          {modalInfo.message}
        </p>
      </Modal>
    </div>
  );
}
