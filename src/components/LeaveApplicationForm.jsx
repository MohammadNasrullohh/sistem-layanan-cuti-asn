import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LeaveApplicationForm({ setActiveTab, onSelectRequestForExport }) {
  const { currentUser, refreshCurrentUserData } = useAuth();

  // Form states
  const [jenisCuti, setJenisCuti] = useState('cuti_tahunan');
  const [tanggalMulai, setTanggalMulai] = useState('2026-11-20');
  const [tanggalSelesai, setTanggalSelesai] = useState('2026-11-24');
  const [jumlahHari, setJumlahHari] = useState(3);
  const [alasanCuti, setAlasanCuti] = useState('Keperluan keluarga');
  const [alamatSelamaCuti, setAlamatSelamaCuti] = useState('Jl. Pahlawan No. 25, Kebumen, Jawa Tengah');
  const [noTelepon, setNoTelepon] = useState('081234567890');
  
  // File upload for leave types requiring evidence
  const [attachment, setAttachment] = useState(null);
  const [attachmentName, setAttachmentName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [errorBanner, setErrorBanner] = useState('');

  // Initial user values
  useEffect(() => {
    if (currentUser) {
      if (currentUser.no_hp) setNoTelepon(currentUser.no_hp);
    }
  }, [currentUser]);

  // Calculate working days
  useEffect(() => {
    if (tanggalMulai && tanggalSelesai) {
      const start = new Date(tanggalMulai);
      const end = new Date(tanggalSelesai);
      if (end >= start) {
        let count = 0;
        let cur = new Date(start);
        while (cur <= end) {
          const day = cur.getDay();
          if (day !== 0 && day !== 6) {
            count++;
          }
          cur.setDate(cur.getDate() + 1);
        }
        setJumlahHari(count || 1);
      } else {
        setJumlahHari(0);
      }
    }
  }, [tanggalMulai, tanggalSelesai]);

  // Quota and calculations
  const cutiN = currentUser?.cuti_n ?? 12;
  const cutiN1 = currentUser?.cuti_n1 ?? 6;
  const cutiN2 = currentUser?.cuti_n2 ?? 0;
  const totalSisa = cutiN + cutiN1 + cutiN2;

  // Deduction preview
  let saldoNSesudah = cutiN;
  let saldoN1Keterangan = `${cutiN1}, tidak terpakai`;
  if (jenisCuti === 'cuti_tahunan') {
    if (jumlahHari <= cutiN) {
      saldoNSesudah = cutiN - jumlahHari;
      saldoN1Keterangan = `${cutiN1}, tidak terpakai`;
    } else {
      saldoNSesudah = 0;
      const sisaDibutuhkan = jumlahHari - cutiN;
      const sisaN1 = Math.max(0, cutiN1 - sisaDibutuhkan);
      saldoN1Keterangan = `${sisaN1} (terpakai ${cutiN1 - sisaN1} hari)`;
    }
  }

  // Check schedule conflict with colleague Dewi Lestari (20-24 Nov)
  const isConflict = (tanggalMulai <= '2026-11-24' && tanggalSelesai >= '2026-11-20');

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorBanner('');

    if (jumlahHari <= 0) {
      setErrorBanner('Tanggal selesai harus sama atau setelah tanggal mulai.');
      return;
    }

    if (currentUser?.jenis_asn === 'PPPK') {
      const allowedPPPK = ['cuti_tahunan', 'cuti_sakit', 'cuti_melahirkan', 'cuti_bersama'];
      if (!allowedPPPK.includes(jenisCuti)) {
        setErrorBanner('Berdasarkan Buku Saku BKN 2024 hal. 4, Pegawai PPPK hanya berhak atas Cuti Tahunan, Cuti Sakit, Cuti Melahirkan, dan Cuti Bersama.');
        return;
      }
    }

    if (jenisCuti === 'cuti_tahunan' && jumlahHari > totalSisa) {
      setErrorBanner(`Jumlah cuti (${jumlahHari} hari) melebihi total kuota cuti tahunan Anda (${totalSisa} hari).`);
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('employee_id', currentUser?.id || 1);
      formData.append('jenis_cuti', jenisCuti);
      formData.append('alasan', alasanCuti);
      formData.append('tanggal_mulai', tanggalMulai);
      formData.append('tanggal_selesai', tanggalSelesai);
      formData.append('lama_hari', jumlahHari);
      formData.append('alamat_selama_cuti', alamatSelamaCuti);
      formData.append('no_telepon', noTelepon);

      if (attachment) {
        formData.append('lampiran', attachment);
      }

      const res = await fetch('/api/leave-requests', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirimkan permohonan cuti');
      }

      setSubmittedRequest(data.request);
      if (refreshCurrentUserData) {
        refreshCurrentUserData();
      }
    } catch (err) {
      console.error(err);
      setErrorBanner(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // If successfully submitted, display confirmation card
  if (submittedRequest) {
    return (
      <div className="flex-1 max-w-2xl">
        <div className="lawet-card p-6 flex flex-col gap-4">
          <div className="text-[13px] text-[#5a6472]">
            Permohonan Terkirim · Lampiran II Peraturan BKN 7/2021
          </div>
          <h2 className="text-[20px] font-semibold text-[#1c2530] m-0">
            Pengajuan cuti berhasil didaftarkan
          </h2>
          <div className="text-[14px] text-[#1c2530] leading-relaxed">
            Permohonan cuti atas nama <b>{currentUser?.nama || 'Ahmad Fauzi, S.Kom.'}</b> dengan nomor dokumen{' '}
            <span className="mono font-semibold">{submittedRequest.nomor_surat || '800/CUTI-THN/227/XI/2026'}</span> telah diteruskan ke atasan langsung (Bambang Trianto, M.T.) untuk pertimbangan berjenjang.
          </div>

          <div className="bg-[#fbf3e2] border border-[#e3cf9c] rounded-[6px] p-3.5 text-[13px] text-[#1c2530]">
            Status terkini: <b>Menunggu pertimbangan atasan</b>. Anda akan menerima notifikasi otomatis ketika atasan menyelesaikan verifikasi.
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onSelectRequestForExport(submittedRequest.id);
                setActiveTab('ekspor-cuti');
              }}
              className="lawet-btn"
            >
              Lihat formulir Lampiran II
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="lawet-btn-secondary"
            >
              Kembali ke ringkasan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-[26px] font-semibold text-[#1c2530] m-0 tracking-tight">
          Ajukan cuti
        </h1>
        <div className="text-[13px] text-[#5a6472] mt-1.5 leading-normal">
          Mengikuti Formulir Permintaan dan Pemberian Cuti (Lampiran II, Peraturan BKN 7/2021). Data pegawai terisi dari SIMPEG.
        </div>
      </div>

      {/* Main Grid: Form Left, Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* Form Card */}
        <form onSubmit={handleSubmit} className="lawet-card p-6 flex flex-col gap-5">
          {errorBanner && (
            <div className="bg-[#fbf3e2] border border-[#e3cf9c] text-[#1c2530] text-[13px] rounded-[6px] p-3 leading-relaxed">
              {errorBanner}
            </div>
          )}

          {/* Jenis Cuti */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#1c2530]">
              Jenis cuti
            </label>
            <select
              value={jenisCuti}
              onChange={(e) => setJenisCuti(e.target.value)}
              className="lawet-select"
            >
              <option value="cuti_tahunan">Cuti Tahunan — sisa {totalSisa} hari kerja</option>
              <option value="cuti_besar">Cuti Besar</option>
              <option value="cuti_sakit">Cuti Sakit</option>
              <option value="cuti_melahirkan">Cuti Melahirkan</option>
              <option value="cuti_alasan_penting">Cuti Karena Alasan Penting</option>
              <option value="cuti_di_luar_tanggungan">Cuti di Luar Tanggungan Negara</option>
            </select>
          </div>

          {/* Mulai & Selesai Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#1c2530]">
                Mulai
              </label>
              <input
                type="date"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
                className="lawet-input mono"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#1c2530]">
                Selesai
              </label>
              <input
                type="date"
                value={tanggalSelesai}
                onChange={(e) => setTanggalSelesai(e.target.value)}
                className="lawet-input mono"
                required
              />
            </div>
          </div>

          {/* Schedule Conflict Warning */}
          {isConflict && (
            <div className="bg-[#fbf3e2] border border-[#e3cf9c] rounded-[6px] p-3 text-[13px] text-[#1c2530] leading-relaxed">
              Dewi Lestari, S.A.P. dari unit yang sama cuti pada 20–24 Nov. Pertimbangkan tanggal lain atau koordinasi dengan atasan.
            </div>
          )}

          {/* Alasan Cuti */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#1c2530]">
              Alasan cuti
            </label>
            <textarea
              rows={3}
              value={alasanCuti}
              onChange={(e) => setAlasanCuti(e.target.value)}
              placeholder="Jelaskan keperluan cuti..."
              className="lawet-input"
              required
            />
          </div>

          {/* Alamat Selama Menjalankan Cuti */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#1c2530]">
              Alamat selama menjalankan cuti
            </label>
            <input
              type="text"
              value={alamatSelamaCuti}
              onChange={(e) => setAlamatSelamaCuti(e.target.value)}
              placeholder="Alamat lengkap tempat tinggal selama cuti"
              className="lawet-input"
              required
            />
          </div>

          {/* No Telepon / WhatsApp */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#1c2530]">
              Nomor telepon / WhatsApp aktif
            </label>
            <input
              type="text"
              value={noTelepon}
              onChange={(e) => setNoTelepon(e.target.value)}
              className="lawet-input mono"
              required
            />
          </div>

          {/* Lampiran Dokumen jika diperlukan */}
          {(jenisCuti === 'cuti_sakit' || jenisCuti === 'cuti_melahirkan' || jenisCuti === 'cuti_alasan_penting') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#1c2530]">
                Dokumen pendukung (surat dokter / dokumen bukti)
              </label>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setAttachment(e.target.files[0]);
                    setAttachmentName(e.target.files[0].name);
                  }
                }}
                className="lawet-input text-[13px] file:mr-3 file:py-1 file:px-3 file:rounded-[4px] file:border-0 file:text-[12px] file:bg-[#e3eaf1] file:text-[#173a5e] file:font-medium"
              />
              <span className="text-[12px] text-[#5a6472]">
                Wajib untuk Cuti Sakit lebih dari 1 hari atau Cuti Melahirkan.
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="lawet-btn"
            >
              {submitting ? 'Mengirim...' : 'Kirim ke atasan'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="text-[14px] text-[#173a5e] hover:underline px-3 py-2 bg-transparent border-0 cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>

        {/* Right Summary Column with Smart Guidance */}
        <div className="flex flex-col gap-5">
          {/* Card 1: Ringkasan Saldo */}
          <aside className="lawet-card p-5 flex flex-col">
            <h2 className="text-[16px] font-semibold text-[#1c2530] m-0 mb-2">
              Ringkasan
            </h2>

            <div className="flex justify-between items-center py-2.5 border-b border-[#e8ebe6] text-[14px]">
              <span className="text-[#1c2530]">Durasi</span>
              <span className="mono font-medium text-[#1c2530]">
                {jumlahHari} hari kerja
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-[#e8ebe6] text-[14px]">
              <span className="text-[#1c2530]">Saldo N (2026) sebelum</span>
              <span className="mono text-[#1c2530]">{cutiN}</span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-[#e8ebe6] text-[14px]">
              <span className="text-[#1c2530]">Saldo N sesudah</span>
              <span className="mono font-semibold text-[#173a5e]">
                {saldoNSesudah}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-[#e8ebe6] text-[14px]">
              <span className="text-[#1c2530]">Saldo N-1 (2025)</span>
              <span className="mono text-[#5a6472]">{saldoN1Keterangan}</span>
            </div>

            <p className="text-[13px] text-[#5a6472] leading-[1.5] mt-4 mb-0">
              Gaji pokok, tunjangan jabatan, dan TPP tetap dibayar penuh selama cuti tahunan. Alur: atasan, PPK, lalu formulir resmi terbit.
            </p>
          </aside>

          {/* Card 2: Panduan Regulasi Cepat */}
          <div className="lawet-card p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#1c2530]">
                Ketentuan BKN 7/2021
              </span>
              <span className="text-[11px] text-[#5a6472]">Validasi SIMPEG</span>
            </div>

            <ul className="list-disc pl-4 text-[12px] text-[#5a6472] space-y-1.5 m-0">
              <li>Hari Sabtu, Minggu, dan Libur Nasional otomatis dikecualikan dari perhitungan kuota.</li>
              <li>Hak cuti tahun berjalan yang tidak habis dapat diakumulasikan maksimal 6 hari di tahun N+1.</li>
              <li>Tanda tangan elektronik resmi terbit setelah persetujuan PPK (Kepala BKPSDM).</li>
            </ul>

            <div className="pt-2 border-t border-[#e8ebe6] text-[11px] text-[#5a6472]">
              Butuh konsultasi aturan? Klik menu <b>Aturan cuti (BKN)</b> di sidebar.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
