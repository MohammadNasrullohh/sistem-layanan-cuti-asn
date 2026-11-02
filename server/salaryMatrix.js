/**
 * Matriks Pemberian Penghasilan Saat Cuti Pegawai ASN
 * Berdasarkan Buku Saku BKN 2024 Halaman 24 & Peraturan Perundang-undangan Gaji PNS/PPPK
 */

export const SALARY_MATRIX = {
  cuti_tahunan: {
    jenis: 'Cuti Tahunan',
    gaji_pokok: true,
    tunjangan_keluarga: true,
    tunjangan_pangan: true,
    tunjangan_jabatan: true,
    tpp_persen: 100,
    keterangan: 'Menerima penghasilan penuh tanpa pengurangan tunjangan.'
  },
  cuti_besar: {
    jenis: 'Cuti Besar',
    gaji_pokok: true,
    tunjangan_keluarga: true,
    tunjangan_pangan: true,
    tunjangan_jabatan: false, // TIDAK DAPAT TUNJANGAN JABATAN
    tpp_persen: 0,
    keterangan: 'Menerima Gaji Pokok, Tunj. Keluarga, Tunj. Pangan. TIDAK menerima Tunjangan Jabatan dan TPP.'
  },
  cuti_sakit: {
    jenis: 'Cuti Sakit',
    gaji_pokok: true,
    tunjangan_keluarga: true,
    tunjangan_pangan: true,
    tunjangan_jabatan: true,
    tpp_persen: 100,
    keterangan: 'Menerima penghasilan penuh sesuai masa berlakunya cuti sakit.'
  },
  cuti_melahirkan: {
    jenis: 'Cuti Melahirkan',
    gaji_pokok: true,
    tunjangan_keluarga: true,
    tunjangan_pangan: true,
    tunjangan_jabatan: true,
    tpp_persen: 100,
    keterangan: 'Menerima penghasilan penuh (Gaji Pokok, Tunj. Keluarga, Pangan, Jabatan).'
  },
  cuti_alasan_penting: {
    jenis: 'Cuti Karena Alasan Penting',
    gaji_pokok: true,
    tunjangan_keluarga: true,
    tunjangan_pangan: true,
    tunjangan_jabatan: true,
    tpp_persen: 100,
    keterangan: 'Menerima penghasilan penuh selama masa cuti (maksimal 1 bulan).'
  },
  cuti_bersama: {
    jenis: 'Cuti Bersama',
    gaji_pokok: true,
    tunjangan_keluarga: true,
    tunjangan_pangan: true,
    tunjangan_jabatan: true,
    tpp_persen: 100,
    keterangan: 'Hari libur resmi nasional, penghasilan tetap utuh.'
  },
  cltn: {
    jenis: 'Cuti di Luar Tanggungan Negara (CLTN)',
    gaji_pokok: false, // SEMUA TIDAK DAPAT
    tunjangan_keluarga: false,
    tunjangan_pangan: false,
    tunjangan_jabatan: false,
    tpp_persen: 0,
    keterangan: 'Diberhentikan dari jabatan, seluruh komponen penghasilan dinonaktifkan (NOL Rupiah).'
  }
};

/**
 * Simulasi estimasi penghasilan saat cuti berdasarkan Golongan dan Jenis Cuti
 */
export function calculateEstimatedTakeHomePay(pangkatGolongan, jenisCuti) {
  const matrix = SALARY_MATRIX[jenisCuti] || SALARY_MATRIX.cuti_tahunan;

  // Base estimates by echelon / golongan
  let baseSalary = 3500000;
  let tunjJabatan = 750000;
  let tunjKeluarga = 420000;
  let tunjPangan = 300000;
  let tpp = 2500000;

  if (pangkatGolongan?.includes('IV')) {
    baseSalary = 4800000;
    tunjJabatan = 1500000;
    tunjKeluarga = 576000;
    tunjPangan = 300000;
    tpp = 4500000;
  } else if (pangkatGolongan?.includes('III')) {
    baseSalary = 3700000;
    tunjJabatan = 850000;
    tunjKeluarga = 444000;
    tunjPangan = 300000;
    tpp = 2800000;
  } else if (pangkatGolongan?.includes('IX')) { // PPPK IX
    baseSalary = 3600000;
    tunjJabatan = 540000;
    tunjKeluarga = 432000;
    tunjPangan = 300000;
    tpp = 2200000;
  }

  const realGajiPokok = matrix.gaji_pokok ? baseSalary : 0;
  const realTunjKel = matrix.tunjangan_keluarga ? tunjKeluarga : 0;
  const realTunjPangan = matrix.tunjangan_pangan ? tunjPangan : 0;
  const realTunjJabatan = matrix.tunjangan_jabatan ? tunjJabatan : 0;
  const realTpp = Math.round((matrix.tpp_persen / 100) * tpp);

  const total = realGajiPokok + realTunjKel + realTunjPangan + realTunjJabatan + realTpp;

  return {
    matrix,
    breakdown: {
      gajiPokok: realGajiPokok,
      tunjanganKeluarga: realTunjKel,
      tunjanganPangan: realTunjPangan,
      tunjanganJabatan: realTunjJabatan,
      tpp: realTpp,
      total
    }
  };
}
