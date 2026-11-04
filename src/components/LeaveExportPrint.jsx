import React, { useState, useEffect } from 'react';

export default function LeaveExportPrint({ requestId, onBack }) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestDetails();
  }, [requestId]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/leave-requests/${requestId}`);
      const data = await res.json();
      setRequest(data);
    } catch (err) {
      console.error('Failed to load export data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const req = request || {
    id: 'cuti-2026-001',
    nama_pemohon: 'Ahmad Fauzi, S.Kom.',
    nip: '199208152018021003',
    jabatan: 'Pranata Komputer Ahli Muda',
    unit_kerja: 'Dinas Komunikasi dan Informatika',
    jenis_cuti: 'Cuti Tahunan',
    alasan: 'Keperluan keluarga',
    lama_hari: 3,
    tanggal_mulai: '2026-11-20',
    tanggal_selesai: '2026-11-24',
    alamat_selama_cuti: 'Jl. Pahlawan No. 25, Kebumen, Jawa Tengah',
    status: 'pertimbangan_atasan'
  };

  const sisaN = req.sisa_cuti_n !== undefined && req.sisa_cuti_n !== null ? Number(req.sisa_cuti_n) : 12;
  const sisaN1 = req.sisa_cuti_n1 !== undefined && req.sisa_cuti_n1 !== null ? Number(req.sisa_cuti_n1) : 6;
  const sisaN2 = req.sisa_cuti_n2 !== undefined && req.sisa_cuti_n2 !== null ? Number(req.sisa_cuti_n2) : 0;
  const durasi = Number(req.jumlah_hari || req.lama_hari || 1);

  let rem = durasi;
  const potongN2 = Math.min(sisaN2, rem); rem -= potongN2;
  const potongN1 = Math.min(sisaN1, rem); rem -= potongN1;
  const potongN = Math.min(sisaN, rem); rem -= potongN;
  const sisaNSesudah = Math.max(0, sisaN - potongN);

  return (
    <div className="flex-1 flex flex-col items-center gap-4 py-2">
      {/* Top Action Bar (hidden when printing) */}
      <div className="w-full max-w-[794px] flex justify-between items-center no-print">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-[14px] text-[#173a5e] hover:underline bg-transparent border-0 cursor-pointer p-0 font-medium"
          >
            &larr; Kembali
          </button>
          <span className="font-medium text-[14px] text-[#1c2530]">
            Formulir Permintaan dan Pemberian Cuti
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="lawet-btn py-2 text-[13px]"
          >
            Unduh PDF / Cetak
          </button>
        </div>
      </div>

      {/* Formal A4 Document Card */}
      <article className="printable-area bg-white w-full max-w-[794px] p-8 sm:p-14 border border-[#cfd3cd] text-[#1c2530] font-sans shadow-xs">
        {/* Document Header */}
        <div className="text-center text-[13px] leading-[1.5] mb-6">
          <b className="text-[14px] tracking-wide">PEMERINTAH KABUPATEN KEBUMEN</b>
          <br />
          <span className="font-semibold text-[13px]">FORMULIR PERMINTAAN DAN PEMBERIAN CUTI</span>
          <br />
          <span className="text-[12px] text-[#5a6472]">
            Lampiran II Peraturan Badan Kepegawaian Negara Republik Indonesia No. 7 Tahun 2021
          </span>
        </div>

        {/* Section I */}
        <h3 className="text-[13px] font-semibold text-[#1c2530] m-0 mt-4 mb-1.5 uppercase">
          I. Data Pegawai
        </h3>
        <table className="w-full border-collapse mb-4">
          <tbody>
            <tr>
              <td className="w-[36%] bg-[#f4f5f3] border border-[#1c2530] p-2 text-[13px] font-medium">
                Nama
              </td>
              <td className="border border-[#1c2530] p-2 text-[13px]">
                {req.nama_pemohon || req.pemohon_nama || 'Ahmad Fauzi, S.Kom.'}
              </td>
            </tr>
            <tr>
              <td className="bg-[#f4f5f3] border border-[#1c2530] p-2 text-[13px] font-medium">
                NIP
              </td>
              <td className="border border-[#1c2530] p-2 text-[13px] mono">
                {req.nip || req.pemohon_nip || '199208152018021003'}
              </td>
            </tr>
            <tr>
              <td className="bg-[#f4f5f3] border border-[#1c2530] p-2 text-[13px] font-medium">
                Jabatan
              </td>
              <td className="border border-[#1c2530] p-2 text-[13px]">
                {req.jabatan || req.pemohon_jabatan || 'Pranata Komputer Ahli Muda'}
              </td>
            </tr>
            <tr>
              <td className="bg-[#f4f5f3] border border-[#1c2530] p-2 text-[13px] font-medium">
                Unit kerja
              </td>
              <td className="border border-[#1c2530] p-2 text-[13px]">
                {req.unit_kerja || req.pemohon_unit || 'Dinas Komunikasi dan Informatika'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Section II */}
        <h3 className="text-[13px] font-semibold text-[#1c2530] m-0 mt-4 mb-1.5 uppercase">
          II. Jenis Cuti Yang Diambil
        </h3>
        <table className="w-full border-collapse mb-4">
          <tbody>
            <tr>
              <td className="border border-[#1c2530] p-2 text-[13px]">
                {req.jenis_cuti?.replace('cuti_', 'Cuti ') || 'Cuti Tahunan'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Section III */}
        <h3 className="text-[13px] font-semibold text-[#1c2530] m-0 mt-4 mb-1.5 uppercase">
          III. Alasan Cuti
        </h3>
        <table className="w-full border-collapse mb-4">
          <tbody>
            <tr>
              <td className="border border-[#1c2530] p-2 text-[13px]">
                {req.alasan || req.alasan_cuti || 'Keperluan keluarga'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Section IV */}
        <h3 className="text-[13px] font-semibold text-[#1c2530] m-0 mt-4 mb-1.5 uppercase">
          IV. Lamanya Cuti
        </h3>
        <table className="w-full border-collapse mb-4">
          <tbody>
            <tr>
              <td className="w-[36%] bg-[#f4f5f3] border border-[#1c2530] p-2 text-[13px] font-medium">
                Selama
              </td>
              <td className="border border-[#1c2530] p-2 text-[13px] mono">
                {req.lama_hari || req.jumlah_hari || 3} hari kerja
              </td>
            </tr>
            <tr>
              <td className="bg-[#f4f5f3] border border-[#1c2530] p-2 text-[13px] font-medium">
                Mulai tanggal
              </td>
              <td className="border border-[#1c2530] p-2 text-[13px] mono">
                {req.tanggal_mulai || '2026-11-20'} s.d. {req.tanggal_selesai || '2026-11-24'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Section V */}
        <h3 className="text-[13px] font-semibold text-[#1c2530] m-0 mt-4 mb-1.5 uppercase">
          V. Catatan Cuti
        </h3>
        <table className="w-full border-collapse mb-4">
          <tbody>
            <tr>
              <td className="w-[36%] bg-[#f4f5f3] border border-[#1c2530] p-2 text-[13px] font-medium">
                Cuti tahun N (2026)
              </td>
              <td className="border border-[#1c2530] p-2 text-[13px]">
                {sisaN} hari{potongN > 0 ? `, diambil ${potongN}, sisa ${sisaNSesudah} hari` : ' (utuh)'}
              </td>
            </tr>
            <tr>
              <td className="bg-[#f4f5f3] border border-[#1c2530] p-2 text-[13px] font-medium">
                Cuti tahun N-1 (2025)
              </td>
              <td className="border border-[#1c2530] p-2 text-[13px]">
                {sisaN1} hari{potongN1 > 0 ? `, diambil ${potongN1}` : ''}
              </td>
            </tr>
            <tr>
              <td className="bg-[#f4f5f3] border border-[#1c2530] p-2 text-[13px] font-medium">
                Cuti tahun N-2 (2024)
              </td>
              <td className="border border-[#1c2530] p-2 text-[13px]">
                {sisaN2} hari{potongN2 > 0 ? `, diambil ${potongN2}` : ''}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Section VI */}
        <h3 className="text-[13px] font-semibold text-[#1c2530] m-0 mt-4 mb-1.5 uppercase">
          VI. Alamat Selama Menjalankan Cuti
        </h3>
        <table className="w-full border-collapse mb-4">
          <tbody>
            <tr>
              <td className="border border-[#1c2530] p-2 text-[13px] min-h-[36px]">
                {req.alamat_selama_cuti || req.alamat || 'Jl. Pahlawan No. 25, Kebumen, Jawa Tengah'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Section VII */}
        <h3 className="text-[13px] font-semibold text-[#1c2530] m-0 mt-4 mb-1.5 uppercase">
          VII. Pertimbangan Atasan & Keputusan Pejabat
        </h3>
        <table className="w-full border-collapse mb-6">
          <tbody>
            <tr>
              <td className="w-[36%] bg-[#f4f5f3] border border-[#1c2530] p-2 text-[13px] font-medium">
                Pertimbangan atasan langsung
              </td>
              <td className="border border-[#1c2530] p-2 text-[13px]">
                {req.status === 'pertimbangan_atasan' || req.status === 'diajukan'
                  ? 'Menunggu pertimbangan'
                  : 'Disetujui'}
              </td>
            </tr>
            <tr>
              <td className="bg-[#f4f5f3] border border-[#1c2530] p-2 text-[13px] font-medium">
                Keputusan Pejabat Yang Berwenang (PPK)
              </td>
              <td className="border border-[#1c2530] p-2 text-[13px]">
                {req.status === 'disetujui'
                  ? 'Disetujui (Surat Keputusan Resmi Terbit)'
                  : 'Menunggu'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Signature Box */}
        <div className="grid grid-cols-2 gap-8 text-[12px] pt-4 border-t border-[#1c2530]">
          <div className="text-center">
            <div>Atasan Langsung,</div>
            <div className="mt-14 font-semibold">Bambang Trianto, M.T.</div>
            <div className="mono text-[#5a6472]">NIP. 198005122005011002</div>
          </div>
          <div className="text-center">
            <div>Pejabat Yang Berwenang Memberikan Cuti,</div>
            <div className="mt-14 font-semibold">Drs. H. Sukamto, M.Si.</div>
            <div className="mono text-[#5a6472]">NIP. 197502111998031001</div>
          </div>
        </div>
      </article>
    </div>
  );
}
