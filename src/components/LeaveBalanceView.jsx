import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Briefcase, 
  HeartPulse, 
  Baby, 
  ShieldAlert, 
  Coins, 
  Info, 
  ArrowRight,
  FileText,
  DollarSign
} from 'lucide-react';

export default function LeaveBalanceView({ setActiveTab }) {
  const { currentUser } = useAuth();
  const [selectedLeaveSim, setSelectedLeaveSim] = useState('cuti_tahunan');

  if (!currentUser) return null;

  const totalSisaTahunan = (currentUser.sisa_cuti_n2 || 0) + (currentUser.sisa_cuti_n1 || 0) + (currentUser.sisa_cuti_n || 0);
  const eligibleCutiBesar = currentUser.jenis_asn === 'PNS' && currentUser.masa_kerja_tahun >= 5;

  // Matriks Pemberian Penghasilan Saat Cuti (Page 24 BKN 2024)
  const salaryMatrixData = [
    {
      id: 'cuti_tahunan',
      nama: 'Cuti Tahunan',
      gajiPokok: true,
      tunjKeluarga: true,
      tunjPangan: true,
      tunjJabatan: true,
      tpp: '100%',
      keterangan: 'Menerima penghasilan penuh tanpa potongan'
    },
    {
      id: 'cuti_besar',
      nama: 'Cuti Besar',
      gajiPokok: true,
      tunjKeluarga: true,
      tunjPangan: true,
      tunjJabatan: false, // DITETAPKAN TIDAK DAPAT
      tpp: '0% / Mengikuti Kebijakan Instansi',
      keterangan: 'Menerima Gaji Pokok, Tunj. Keluarga, Tunj. Pangan. TIDAK menerima Tunjangan Jabatan (Hal. 24)'
    },
    {
      id: 'cuti_sakit',
      nama: 'Cuti Sakit',
      gajiPokok: true,
      tunjKeluarga: true,
      tunjPangan: true,
      tunjJabatan: true,
      tpp: '100%',
      keterangan: 'Menerima seluruh komponen penghasilan penuh'
    },
    {
      id: 'cuti_melahirkan',
      nama: 'Cuti Melahirkan',
      gajiPokok: true,
      tunjKeluarga: true,
      tunjPangan: true,
      tunjJabatan: true,
      tpp: '100%',
      keterangan: 'Menerima penghasilan penuh selama maksimal 3 bulan'
    },
    {
      id: 'cuti_alasan_penting',
      nama: 'Cuti Karena Alasan Penting',
      gajiPokok: true,
      tunjKeluarga: true,
      tunjPangan: true,
      tunjJabatan: true,
      tpp: '100%',
      keterangan: 'Menerima penghasilan penuh maksimal 1 bulan'
    },
    {
      id: 'cuti_bersama',
      nama: 'Cuti Bersama',
      gajiPokok: true,
      tunjKeluarga: true,
      tunjPangan: true,
      tunjJabatan: true,
      tpp: '100%',
      keterangan: 'Hari libur resmi nasional, penghasilan utuh'
    },
    {
      id: 'cltn',
      nama: 'Cuti di Luar Tanggungan Negara (CLTN)',
      gajiPokok: false,
      tunjKeluarga: false,
      tunjPangan: false,
      tunjJabatan: false,
      tpp: '0%',
      keterangan: 'Diberhentikan dari jabatan, seluruh penghasilan dinonaktifkan (NOL Rupiah)'
    }
  ];

  // Selected leave calculation simulation
  const selectedMatrix = salaryMatrixData.find(s => s.id === selectedLeaveSim) || salaryMatrixData[0];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Layanan Mandiri Cuti ASN (Menu 1)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Data Hak dan Sisa Cuti Pegawai
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Transparansi saldo cuti berdasarkan regulasi Peraturan BKN No. 7 Tahun 2021 untuk {currentUser.nama} ({currentUser.jenis_asn})
          </p>
        </div>

        <button
          onClick={() => setActiveTab('ajukan-cuti')}
          className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs md:text-sm shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Ajukan Cuti Sekarang
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Rincian Cuti Tahunan (Peraturan BKN Hal. 5-7) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>1. Rincian Saldo Cuti Tahunan</span>
              <span className="text-xs font-normal text-slate-500">(12 Hari Kerja / Tahun)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Akumulasi saldo cuti tahun berjalan (N), sisa tahun sebelumnya (N-1 max 6 hari), dan sisa penangguhan resmi PPK (N-2).
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Total Sisa Cuti Tahunan</div>
            <div className="text-3xl font-extrabold text-orange-600">
              {totalSisaTahunan} <span className="text-sm font-semibold text-slate-600">Hari Kerja</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Tahun N (2026) */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-orange-900">Tahun N (2026)</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-orange-200/90 text-orange-900 font-extrabold border border-orange-300">
                Tahun Berjalan
              </span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black text-slate-900">
                {currentUser.sisa_cuti_n || 12}
              </div>
              <span className="text-xs font-semibold text-slate-500">/ 12 Hari Kerja</span>
            </div>

            {/* Progress track */}
            <div className="w-full bg-orange-200/70 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, ((currentUser.sisa_cuti_n || 12) / 12) * 100)}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Hak tahun berjalan penuh bagi pegawai yang telah bekerja min. 1 tahun secara terus menerus (Hal. 5).
            </p>
          </div>

          {/* Tahun N-1 (2025) */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">Tahun N-1 (2025)</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-extrabold border border-slate-300">
                Maksimal 6 Hari
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black text-slate-900">
                {currentUser.sisa_cuti_n1 || 0}
              </div>
              <span className="text-xs font-semibold text-slate-500">/ 6 Hari Maks</span>
            </div>

            {/* Progress track */}
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-slate-600 h-2 rounded-full"
                style={{ width: `${Math.min(100, ((currentUser.sisa_cuti_n1 || 0) / 6) * 100)}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Sisa hak cuti tahunan yang tidak digunakan dalam tahun 2025 dapat digunakan pada 2026 paling banyak 6 hari kerja (Hal. 6).
            </p>
          </div>

          {/* Tahun N-2 (2024) */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">Tahun N-2 (2024)</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold border border-blue-200">
                Khusus Ditangguhkan
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-black text-slate-900">
                {currentUser.sisa_cuti_n2 || 0}
              </div>
              <span className="text-xs font-semibold text-slate-500">/ Ditangguhkan PPK</span>
            </div>

            {/* Progress track */}
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min(100, ((currentUser.sisa_cuti_n2 || 0) / 12) * 100)}%` }}
              />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Hanya berlaku jika cuti ditangguhkan oleh PPK karena kepentingan dinas mendesak (s.d. 24 hari kerja total) (Hal. 6).
            </p>
          </div>

        </div>

        {/* Informasi Tambahan Guru / Dosen */}
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Ketentuan Guru & Dosen (Hal. 7 Buku Saku BKN 2024):</strong> PNS yang menduduki jabatan guru pada sekolah dan jabatan dosen pada perguruan tinggi yang mendapat liburan menurut peraturan perundang-undangan, <em>tetap berhak mendapatkan cuti tahunan</em>.
          </div>
        </div>
      </div>

      {/* Saldo Cuti Lainnya (Cuti Besar, Cuti Sakit, Cuti Melahirkan, CAP, CLTN) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Cuti Besar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">2. Cuti Besar (Maks. 3 Bulan)</h3>
                <p className="text-xs text-slate-500">Syarat: Masa kerja min. 5 tahun terus-menerus</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              eligibleCutiBesar ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {eligibleCutiBesar ? 'Memenuhi Syarat' : 'Belum Memenuhi'}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span>Masa Kerja Saat Ini:</span>
              <strong className="text-slate-800">{currentUser.masa_kerja_tahun} Tahun {currentUser.masa_kerja_bulan} Bulan</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span>Terakhir Kali Mengambil:</span>
              <strong className="text-slate-800">{currentUser.cuti_besar_terakhir || 'Belum pernah'}</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <div className="font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Aturan Khusus Cuti Besar (Hal. 8, 9, 23):</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-800">
              <li>PNS yang mengambil cuti besar <strong>tidak berhak atas cuti tahunan</strong> dalam tahun bersangkutan.</li>
              <li>Jika hanya diambil 1 atau 2 bulan, maka <strong>sisa cuti besarnya gugur/hangus</strong>.</li>
              <li><strong>Pengecualian 5 Tahun:</strong> PNS yang akan Ibadah Haji untuk pertama kali dikecualikan dari syarat 5 tahun (Hal. 23).</li>
              <li>Untuk kelahiran anak ke-4 dan seterusnya otomatis diberikan cuti besar tanpa syarat 5 tahun (Hal. 15).</li>
            </ul>
          </div>
        </div>

        {/* Cuti Sakit & Cuti Melahirkan */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">3. Cuti Sakit & Melahirkan</h3>
                <p className="text-xs text-slate-500">Berhak atas penghasilan penuh</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              Hak Penuh
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span>Cuti Sakit Terpakai Tahun Ini:</span>
              <strong className="text-slate-800">{currentUser.cuti_sakit_terpakai || 0} Hari</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span>Batas Maksimal Sakit:</span>
              <strong className="text-slate-800">1 Tahun (+ 6 Bulan Tim Penguji)</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span>Cuti Gugur Kandungan:</span>
              <strong className="text-slate-800">Maksimal 1 1/2 Bulan (45 Hari)</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
              <span>Cuti Melahirkan Anak:</span>
              <strong className="text-slate-800">Anak ke-1 s.d ke-3 (Maks 3 Bulan)</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <strong>PNS Laki-laki:</strong> Suami yang istrinya melahirkan/caesar dapat mengajukan <em>Cuti Karena Alasan Penting (CAP)</em> dengan melampirkan surat rawat inap rumah sakit (Hal. 15).
          </div>
        </div>

      </div>

      {/* MATRIKS PEMBERIAN PENGHASILAN SAAT CUTI (Halaman 24 Buku Saku BKN 2024) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
              <Coins className="w-4 h-4" />
              <span>Regulasi Finansial ASN (Halaman 24 Buku Saku BKN)</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Matriks Pemberian Penghasilan Saat Cuti
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Status hak Gaji Pokok, Tunjangan Keluarga, Tunjangan Pangan, dan Tunjangan Jabatan saat menjalani cuti.
            </p>
          </div>
        </div>

        {/* Official Matrix Table (Page 24 BKN) */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="py-3 px-4 font-bold">Jenis Cuti</th>
                <th className="py-3 px-3 text-center font-bold">Gaji Pokok</th>
                <th className="py-3 px-3 text-center font-bold">Tunjangan Keluarga</th>
                <th className="py-3 px-3 text-center font-bold">Tunjangan Pangan</th>
                <th className="py-3 px-3 text-center font-bold">Tunjangan Jabatan</th>
                <th className="py-3 px-4 font-bold">Keterangan Regulasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salaryMatrixData.map((item) => (
                <tr 
                  key={item.id} 
                  className={`hover:bg-orange-50/40 transition-colors ${
                    selectedLeaveSim === item.id ? 'bg-orange-50/60 font-semibold' : ''
                  }`}
                  onClick={() => setSelectedLeaveSim(item.id)}
                >
                  <td className="py-3.5 px-4 text-slate-800">
                    <div className="font-bold">{item.nama}</div>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {item.gajiPokok ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">✓</span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-700">✕</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {item.tunjKeluarga ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">✓</span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-700">✕</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {item.tunjPangan ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">✓</span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-700">✕</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {item.tunjJabatan ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700">✓</span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-bold">✕</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                    {item.keterangan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          * Catatan: TPP (Tambahan Penghasilan Pegawai) / Tunjangan Kinerja mengikuti ketentuan peraturan bupati / kepala daerah yang berlaku di masing-masing Instansi Pemerintah Daerah.
        </p>
      </div>

    </div>
  );
}
