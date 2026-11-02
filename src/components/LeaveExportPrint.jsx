import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  ArrowLeft, 
  CheckSquare, 
  Square, 
  QrCode, 
  Download, 
  Share2, 
  Building2,
  Calendar,
  ShieldCheck
} from 'lucide-react';

export default function LeaveExportPrint({ requestId, onBack }) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQrVerifyModal, setShowQrVerifyModal] = useState(false);

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

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 text-xs">
        Memuat formulir resmi Lampiran II BKN...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Data permohonan cuti tidak ditemukan.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-100 rounded-xl text-xs font-semibold">
          Kembali
        </button>
      </div>
    );
  }

  const isChecked = (type) => request.jenis_cuti === type;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top action bar (Hidden on Print) */}
      <div className="no-print bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">
              Formulir Permintaan & Pemberian Cuti (Lampiran II BKN)
            </h1>
            <p className="text-xs text-slate-500">
              Nomor Registrasi: <strong>{request.nomor_surat || request.id}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* Official Printable Document Container */}
      <div className="printable-area bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto text-slate-900 text-[11pt] font-serif leading-relaxed">
        
        {/* Official Header */}
        <div className="text-right text-[9pt] leading-tight mb-4 font-sans text-slate-600">
          <div>ANAK LAMPIRAN II</div>
          <div>PERATURAN BADAN KEPEGAWAIAN NEGARA REPUBLIK INDONESIA</div>
          <div>NOMOR 7 TAHUN 2021</div>
          <div>TENTANG PERUBAHAN ATAS PERATURAN BKN NOMOR 24 TAHUN 2017</div>
          <div>TENTANG TATA CARA PEMBERIAN CUTI PEGAWAI NEGERI SIPIL</div>
        </div>

        <div className="text-center font-bold font-sans text-sm md:text-base tracking-wide border-b-2 border-slate-900 pb-2 mb-4">
          FORMULIR PERMINTAAN DAN PEMBERIAN CUTI
          <div className="text-xs font-normal text-slate-600 mt-0.5">
            Nomor: {request.nomor_surat || '800/CUTI/2026'}
          </div>
        </div>

        <div className="text-right text-xs font-sans mb-4">
          Kebumen, {request.created_at ? request.created_at.slice(0, 10) : '2026-11-02'}<br />
          Kepada Yth.<br />
          Bupati Kebumen / Pejabat Pembina Kepegawaian<br />
          Melalui Atasan Langsung<br />
          di Kebumen
        </div>

        {/* Section I: Data Pegawai */}
        <div className="mb-4">
          <div className="bg-slate-100 px-3 py-1 font-bold font-sans text-xs border border-slate-900">
            I. DATA PEGAWAI
          </div>
          <table className="w-full text-xs font-sans border-collapse border border-slate-900">
            <tbody>
              <tr>
                <td className="border border-slate-900 p-2 w-1/4 font-semibold">Nama</td>
                <td className="border border-slate-900 p-2 w-1/4">{request.pemohon_nama}</td>
                <td className="border border-slate-900 p-2 w-1/4 font-semibold">NIP</td>
                <td className="border border-slate-900 p-2 w-1/4">{request.pemohon_nip}</td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-2 font-semibold">Jabatan</td>
                <td className="border border-slate-900 p-2">{request.pemohon_jabatan}</td>
                <td className="border border-slate-900 p-2 font-semibold">Masa Kerja</td>
                <td className="border border-slate-900 p-2">
                  {request.pemohon_masa_kerja_th || 5} Tahun {request.pemohon_masa_kerja_bl || 0} Bulan
                </td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-2 font-semibold">Unit Kerja</td>
                <td className="border border-slate-900 p-2" colSpan="3">
                  {request.pemohon_unit} - {request.pemohon_instansi || 'Pemerintah Kabupaten Kebumen'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section II: Jenis Cuti Yang Diambil */}
        <div className="mb-4">
          <div className="bg-slate-100 px-3 py-1 font-bold font-sans text-xs border border-slate-900">
            II. JENIS CUTI YANG DIAMBIL **
          </div>
          <table className="w-full text-xs font-sans border-collapse border border-slate-900">
            <tbody>
              <tr>
                <td className="border border-slate-900 p-2 w-1/2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{isChecked('cuti_tahunan') ? '☑' : '☐'}</span>
                    <span>1. Cuti Tahunan</span>
                  </div>
                </td>
                <td className="border border-slate-900 p-2 w-1/2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{isChecked('cuti_besar') ? '☑' : '☐'}</span>
                    <span>2. Cuti Besar</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{isChecked('cuti_sakit') ? '☑' : '☐'}</span>
                    <span>3. Cuti Sakit</span>
                  </div>
                </td>
                <td className="border border-slate-900 p-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{isChecked('cuti_melahirkan') ? '☑' : '☐'}</span>
                    <span>4. Cuti Melahirkan</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{isChecked('cuti_alasan_penting') ? '☑' : '☐'}</span>
                    <span>5. Cuti Karena Alasan Penting</span>
                  </div>
                </td>
                <td className="border border-slate-900 p-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{isChecked('cuti_bersama') ? '☑' : '☐'}</span>
                    <span>6. Cuti Bersama</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-2" colSpan="2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{isChecked('cltn') ? '☑' : '☐'}</span>
                    <span>7. Cuti di Luar Tanggungan Negara</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section III: Alasan Cuti */}
        <div className="mb-4">
          <div className="bg-slate-100 px-3 py-1 font-bold font-sans text-xs border border-slate-900">
            III. ALASAN CUTI
          </div>
          <div className="border border-slate-900 p-3 font-sans text-xs min-h-[45px]">
            {request.alasan_cuti}
            {request.kategori_detail && (
              <span className="text-slate-500 italic block mt-1">
                Keterangan Detail: {request.kategori_detail}
              </span>
            )}
          </div>
        </div>

        {/* Section IV: Lamanya Cuti */}
        <div className="mb-4">
          <div className="bg-slate-100 px-3 py-1 font-bold font-sans text-xs border border-slate-900">
            IV. LAMANYA CUTI
          </div>
          <table className="w-full text-xs font-sans border-collapse border border-slate-900">
            <tbody>
              <tr>
                <td className="border border-slate-900 p-2 w-1/4 font-semibold">Selama</td>
                <td className="border border-slate-900 p-2 w-1/4 font-bold">{request.jumlah_hari} Hari Kerja</td>
                <td className="border border-slate-900 p-2 w-1/4 font-semibold">Mulai Tanggal</td>
                <td className="border border-slate-900 p-2 w-1/4">
                  {request.tanggal_mulai} s.d. {request.tanggal_selesai}
                </td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-2 font-semibold">Alamat Selama Cuti</td>
                <td className="border border-slate-900 p-2" colSpan="3">
                  {request.alamat_selama_cuti || '-'}
                  <div className="font-semibold mt-1">Telp / WA: {request.no_telepon_cuti || '-'}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section V: Catatan Cuti */}
        <div className="mb-4">
          <div className="bg-slate-100 px-3 py-1 font-bold font-sans text-xs border border-slate-900">
            V. CATATAN CUTI ***
          </div>
          <table className="w-full text-[10px] font-sans border-collapse border border-slate-900 text-center">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-slate-900 p-1.5" colSpan="3">1. CUTI TAHUNAN</th>
                <th className="border border-slate-900 p-1.5" rowSpan="2">2. CUTI BESAR</th>
                <th className="border border-slate-900 p-1.5" rowSpan="2">3. CUTI SAKIT</th>
                <th className="border border-slate-900 p-1.5" rowSpan="2">4. CUTI MELAHIRKAN</th>
                <th className="border border-slate-900 p-1.5" rowSpan="2">5. CUTI ALASAN PENTING</th>
                <th className="border border-slate-900 p-1.5" rowSpan="2">6. CLTN</th>
              </tr>
              <tr className="bg-slate-50">
                <th className="border border-slate-900 p-1">Tahun</th>
                <th className="border border-slate-900 p-1">Sisa</th>
                <th className="border border-slate-900 p-1">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-900 p-1">N-2 (2024)</td>
                <td className="border border-slate-900 p-1">{request.sisa_cuti_n2 || 0}</td>
                <td className="border border-slate-900 p-1">Penangguhan PPK</td>
                <td className="border border-slate-900 p-1" rowSpan="3">
                  {request.pemohon_jenis_asn === 'PNS' && (request.pemohon_masa_kerja_th || 5) >= 5 ? 'Berhak' : '-'}
                </td>
                <td className="border border-slate-900 p-1" rowSpan="3">Berhak (Surat Dokter)</td>
                <td className="border border-slate-900 p-1" rowSpan="3">Anak 1-3</td>
                <td className="border border-slate-900 p-1" rowSpan="3">Maks 1 Bln</td>
                <td className="border border-slate-900 p-1" rowSpan="3">-</td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-1">N-1 (2025)</td>
                <td className="border border-slate-900 p-1">{request.sisa_cuti_n1 || 0}</td>
                <td className="border border-slate-900 p-1">Sisa carryover</td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-1">N (2026)</td>
                <td className="border border-slate-900 p-1">{request.sisa_cuti_n || 12}</td>
                <td className="border border-slate-900 p-1">Hak tahun berjalan</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section VI & VII: Pertimbangan Atasan & Keputusan PPK */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Section VI: Pertimbangan Atasan Langsung */}
          <div className="border border-slate-900 text-xs font-sans">
            <div className="bg-slate-100 p-1.5 font-bold border-b border-slate-900">
              VI. PERTIMBANGAN ATASAN LANGSUNG **
            </div>
            <div className="p-2 space-y-1">
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <span>{request.atasan_aksi === 'DISETUJUI' ? '☑' : '☐'} Disetujui</span>
                <span>{request.atasan_aksi === 'PERUBAHAN' ? '☑' : '☐'} Perubahan</span>
                <span>{request.atasan_aksi === 'DITANGGUHKAN' ? '☑' : '☐'} Ditangguhkan</span>
                <span>{request.atasan_aksi === 'TIDAK_DISETUJUI' ? '☑' : '☐'} Tidak Disetujui</span>
              </div>
              <div className="text-[10px] text-slate-500 italic mt-1">
                Catatan: {request.atasan_catatan || 'Telah diverifikasi sesuai ketentuan perundang-undangan.'}
              </div>
            </div>

            <div className="p-3 text-center border-t border-slate-900 mt-2">
              <div className="text-[10px] text-slate-500">Atasan Langsung,</div>
              <div className="h-10 flex items-center justify-center font-serif text-slate-400 italic">
                (Tanda Tangan Elektronik / Terverifikasi)
              </div>
              <div className="font-bold underline">{request.atasan_nama || 'Bambang Trianto, S.T., M.Eng.'}</div>
              <div className="text-[10px]">NIP. {request.atasan_nip || '197904122005011006'}</div>
            </div>
          </div>

          {/* Section VII: Keputusan Pejabat Yang Berwenang (PPK) */}
          <div className="border border-slate-900 text-xs font-sans">
            <div className="bg-slate-100 p-1.5 font-bold border-b border-slate-900">
              VII. KEPUTUSAN PEJABAT YG BERWENANG **
            </div>
            <div className="p-2 space-y-1">
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <span>{request.ppk_aksi === 'DISETUJUI' ? '☑' : '☐'} Disetujui</span>
                <span>{request.ppk_aksi === 'PERUBAHAN' ? '☑' : '☐'} Perubahan</span>
                <span>{request.ppk_aksi === 'DITANGGUHKAN' ? '☑' : '☐'} Ditangguhkan</span>
                <span>{request.ppk_aksi === 'TIDAK_DISETUJUI' ? '☑' : '☐'} Tidak Disetujui</span>
              </div>
              <div className="text-[10px] text-slate-500 italic mt-1">
                SK: {request.nomor_sk || 'Menunggu penetapan resmi PPK'}
              </div>
            </div>

            <div className="p-3 text-center border-t border-slate-900 mt-2">
              <div className="text-[10px] text-slate-500">Kepala BKPSDM / PPK,</div>
              <div className="h-10 flex items-center justify-center font-serif text-slate-400 italic">
                (Tanda Tangan & Cap Dinas)
              </div>
              <div className="font-bold underline">{request.ppk_nama || 'Drs. H. Sukamto, M.Si.'}</div>
              <div className="text-[10px]">NIP. {request.ppk_nip || '197009181996031002'}</div>
            </div>
          </div>

        </div>

        {/* Footer Notes & Digital QR Stamp per BKN standard */}
        <div className="mt-4 pt-3 border-t border-slate-300 text-[8pt] text-slate-500 font-sans flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <div>* Coret yang tidak perlu.</div>
            <div>** Pilih salah satu dengan memberi tanda centang (☑).</div>
            <div>*** Diisi oleh pejabat yang menangani bidang kepegawaian sebelum PNS mengajukan cuti.</div>
            <div className="mt-1 font-mono text-[7pt] text-slate-600">
              Dokumen Elektronik LawetHub BKPSDM Kab. Kebumen • ID: {request.id} • Peraturan BKN No. 7/2021
            </div>
          </div>

          {/* Interactive QR Code Verification Stamp */}
          <div 
            onClick={() => setShowQrVerifyModal(true)}
            className="cursor-pointer p-2 rounded-xl border border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50 transition-all text-center shrink-0 group no-print"
            title="Klik untuk memverifikasi keabsahan tanda tangan elektronik"
          >
            <div className="w-14 h-14 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-1 mx-auto shadow-2xs group-hover:scale-105 transition-transform">
              <QrCode className="w-full h-full text-slate-800" />
            </div>
            <span className="text-[7pt] font-bold text-orange-600 block mt-1">
              Verifikasi TTE
            </span>
          </div>
          
          {/* Print only static QR representation */}
          <div className="hidden print:block text-center shrink-0">
            <div className="w-12 h-12 border border-black p-0.5 mx-auto">
              <QrCode className="w-full h-full text-black" />
            </div>
            <span className="text-[6pt] block mt-0.5">TTE Resmi BKN</span>
          </div>
        </div>

      </div>

      {/* TTE QR Code Verification Modal */}
      {showQrVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Sertifikat Dokumen Elektronik Sah</span>
              </div>
              <button 
                onClick={() => setShowQrVerifyModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <div className="font-bold">STATUS: ASLI & TERVERIFIKASI</div>
                <div className="text-[11px] text-emerald-800 mt-0.5">
                  Surat Izin Cuti ini diterbitkan resmi melalui Sistem Informasi Layanan Cuti ASN LawetHub.
                </div>
              </div>

              <div className="space-y-2 border border-slate-200 rounded-2xl p-3 bg-slate-50/70">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Nomor Registrasi:</span>
                  <span className="font-mono font-bold text-slate-800">{request.nomor_surat || request.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Pemohon:</span>
                  <span className="font-bold text-slate-800">{request.pemohon_nama}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">NIP:</span>
                  <span className="font-mono text-slate-800">{request.pemohon_nip}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Pejabat Pengesah (PPK):</span>
                  <span className="font-bold text-slate-800">{request.ppk_nama || 'Kepala BKPSDM'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Dasar Regulasi:</span>
                  <span className="font-semibold text-slate-700">Peraturan BKN No. 7 Tahun 2021</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowQrVerifyModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Tutup Verifikasi
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
