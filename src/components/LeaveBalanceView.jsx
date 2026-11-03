import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function LeaveBalanceView({ setActiveTab }) {
  const { currentUser } = useAuth();

  const cutiN = currentUser?.cuti_n ?? 12;
  const cutiN1 = currentUser?.cuti_n1 ?? 6;
  const cutiN2 = currentUser?.cuti_n2 ?? 0;
  const masaKerjaTahun = currentUser?.masa_kerja_tahun ?? 8;
  const masaKerjaBulan = currentUser?.masa_kerja_bulan ?? 9;
  const eligibleCutiBesar = masaKerjaTahun >= 5;

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold text-[#1c2530] m-0 tracking-tight">
            Saldo dan hak cuti
          </h1>
          <div className="text-[13px] text-[#5a6472] mt-1.5">
            Berdasarkan Peraturan BKN No. 7 Tahun 2021 untuk {currentUser?.nama || 'Ahmad Fauzi, S.Kom.'} ({currentUser?.jenis_asn || 'PNS'})
          </div>
        </div>

        {setActiveTab && (
          <div>
            <button
              type="button"
              onClick={() => setActiveTab('ajukan-cuti')}
              className="lawet-btn"
            >
              Ajukan cuti
            </button>
          </div>
        )}
      </div>

      {/* Table 1: Cuti Tahunan */}
      <section className="lawet-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Cuti tahunan
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Saldo
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Ketentuan
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                  2026 (N)
                </td>
                <td className="px-4 py-3 text-[14px] text-[#1c2530] mono border-b border-[#e8ebe6]">
                  {cutiN} / 12 hari
                </td>
                <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                  Hak penuh bagi pegawai yang bekerja minimal 1 tahun terus-menerus
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
                  Sisa yang tidak digunakan, paling banyak 6 hari
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
                  Hanya jika ditangguhkan PPK (total sampai 24 hari kerja)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Table 2: Jenis Cuti Lain */}
      <section className="lawet-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Jenis lain
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Status Anda
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Ketentuan
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                  Cuti besar
                </td>
                <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                  {eligibleCutiBesar ? 'Memenuhi syarat' : 'Belum memenuhi'}
                </td>
                <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                  Masa kerja {masaKerjaTahun} th {masaKerjaBulan} bln, belum pernah mengambil. Maksimal 3 bulan.
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                  Cuti sakit dan melahirkan
                </td>
                <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                  Hak penuh
                </td>
                <td className="px-4 py-3 text-[14px] text-[#1c2530] border-b border-[#e8ebe6]">
                  Penghasilan penuh. Sakit sampai 1 tahun, ditambah 6 bulan oleh tim penguji.
                </td>
              </tr>
              <tr className="text-[#5a6472]">
                <td className="px-4 py-3 text-[14px] border-0">
                  Guru dan dosen
                </td>
                <td className="px-4 py-3 text-[14px] border-0">
                  Tidak berlaku
                </td>
                <td className="px-4 py-3 text-[14px] border-0">
                  Tetap berhak cuti tahunan walau mendapat liburan menurut peraturan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Table 3: Matriks Hak Keuangan / Penghasilan Saat Cuti (Hal. 24 Buku Saku BKN) */}
      <section className="lawet-card overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e8ebe6] flex justify-between items-center">
          <div className="font-semibold text-[14px] text-[#1c2530]">
            Matriks Hak Keuangan dan Penghasilan ASN Saat Cuti
          </div>
          <div className="text-[12px] text-[#5a6472]">
            Buku Saku BKN Hal. 24
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2.5 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Jenis Cuti
                </th>
                <th className="px-4 py-2.5 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Gaji Pokok
                </th>
                <th className="px-4 py-2.5 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Tunj. Keluarga & Pangan
                </th>
                <th className="px-4 py-2.5 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Tunj. Jabatan
                </th>
                <th className="px-4 py-2.5 text-left text-[12px] font-medium text-[#5a6472] border-b border-[#e8ebe6]">
                  Keterangan
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2.5 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">
                  Cuti Tahunan
                </td>
                <td className="px-4 py-2.5 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">Dapat</td>
                <td className="px-4 py-2.5 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">Dapat</td>
                <td className="px-4 py-2.5 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">Dapat</td>
                <td className="px-4 py-2.5 text-[13px] text-[#5a6472] border-b border-[#e8ebe6]">Penghasilan penuh</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">
                  Cuti Besar
                </td>
                <td className="px-4 py-2.5 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">Dapat</td>
                <td className="px-4 py-2.5 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">Dapat</td>
                <td className="px-4 py-2.5 text-[13px] text-[#8a1f1f] font-medium border-b border-[#e8ebe6]">Tidak Dapat</td>
                <td className="px-4 py-2.5 text-[13px] text-[#5a6472] border-b border-[#e8ebe6]">Tunjangan jabatan dipotong</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">
                  Cuti Sakit / Melahirkan
                </td>
                <td className="px-4 py-2.5 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">Dapat</td>
                <td className="px-4 py-2.5 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">Dapat</td>
                <td className="px-4 py-2.5 text-[13px] text-[#1c2530] border-b border-[#e8ebe6]">Dapat</td>
                <td className="px-4 py-2.5 text-[13px] text-[#5a6472] border-b border-[#e8ebe6]">Penghasilan penuh</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 text-[13px] text-[#1c2530] border-0">
                  Cuti di Luar Tanggungan Negara
                </td>
                <td className="px-4 py-2.5 text-[13px] text-[#8a1f1f] font-medium border-0">Tidak Dapat</td>
                <td className="px-4 py-2.5 text-[13px] text-[#8a1f1f] font-medium border-0">Tidak Dapat</td>
                <td className="px-4 py-2.5 text-[13px] text-[#8a1f1f] font-medium border-0">Tidak Dapat</td>
                <td className="px-4 py-2.5 text-[13px] text-[#5a6472] border-0">Dihentikan dari pembayaran gaji</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
