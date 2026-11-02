/**
 * BKN Leave Validation Rules
 * Source: Peraturan Badan Kepegawaian Negara Republik Indonesia Nomor 7 Tahun 2021
 * & Buku Saku Tata Cara Pemberian Cuti Pegawai Negeri Sipil (BKN 2024)
 */

export const LEAVE_TYPES = {
  cuti_tahunan: {
    id: 'cuti_tahunan',
    name: 'Cuti Tahunan',
    allowedASN: ['PNS', 'PPPK'],
    maxDaysDefault: 12,
    legalBasis: 'Peraturan BKN No. 7 Tahun 2021 Pasal 3 - 10',
    description: 'Hak cuti tahunan bagi PNS & PPPK yang telah bekerja paling kurang 1 tahun secara terus menerus selama 12 hari kerja.'
  },
  cuti_besar: {
    id: 'cuti_besar',
    name: 'Cuti Besar',
    allowedASN: ['PNS'],
    maxDaysDefault: 90,
    legalBasis: 'Peraturan BKN No. 7 Tahun 2021 Pasal 11 - 18',
    description: 'Diberikan kepada PNS yang telah bekerja paling singkat 5 tahun secara terus-menerus selama paling lama 3 bulan.'
  },
  cuti_sakit: {
    id: 'cuti_sakit',
    name: 'Cuti Sakit',
    allowedASN: ['PNS', 'PPPK'],
    maxDaysDefault: 365,
    legalBasis: 'Peraturan BKN No. 7 Tahun 2021 Pasal 19 - 25',
    description: 'Setiap PNS & PPPK yang menderita sakit berhak atas cuti sakit dengan melampirkan surat keterangan dokter.'
  },
  cuti_melahirkan: {
    id: 'cuti_melahirkan',
    name: 'Cuti Melahirkan',
    allowedASN: ['PNS', 'PPPK'],
    maxDaysDefault: 90,
    legalBasis: 'Peraturan BKN No. 7 Tahun 2021 Pasal 26 - 30',
    description: 'Diberikan untuk kelahiran anak pertama sampai dengan anak ketiga selama paling lama 3 bulan.'
  },
  cuti_alasan_penting: {
    id: 'cuti_alasan_penting',
    name: 'Cuti Karena Alasan Penting',
    allowedASN: ['PNS'],
    maxDaysDefault: 30,
    legalBasis: 'Peraturan BKN No. 7 Tahun 2021 Pasal 31 - 37',
    description: 'Diberikan karena keluarga inti sakit keras/meninggal, melangsungkan perkawinan, istri melahirkan, bencana alam, dll. paling lama 1 bulan.'
  },
  cuti_bersama: {
    id: 'cuti_bersama',
    name: 'Cuti Bersama',
    allowedASN: ['PNS', 'PPPK'],
    maxDaysDefault: 0,
    legalBasis: 'Peraturan BKN No. 7 Tahun 2021 Pasal 38 - 41',
    description: 'Ditetapkan dengan Keputusan Presiden dan tidak mengurangi hak atas cuti tahunan.'
  },
  cltn: {
    id: 'cltn',
    name: 'Cuti di Luar Tanggungan Negara (CLTN)',
    allowedASN: ['PNS'],
    maxDaysDefault: 1095, // 3 years
    legalBasis: 'Peraturan BKN No. 7 Tahun 2021 Pasal 42 - 50',
    description: 'Diberikan kepada PNS masa kerja min 5 tahun untuk alasan pribadi mendesak selama max 3 tahun.'
  }
};

/**
 * Validate leave application against BKN rules
 * @param {Object} employee 
 * @param {Object} requestData 
 * @returns {Object} { isValid: boolean, errors: string[], warnings: string[] }
 */
export function validateLeaveRequest(employee, requestData) {
  const errors = [];
  const warnings = [];

  const {
    jenis_cuti,
    jumlah_hari,
    kategori_detail,
    anak_ke,
    lampiran_nama
  } = requestData;

  const rule = LEAVE_TYPES[jenis_cuti];
  if (!rule) {
    errors.push(`Jenis cuti "${jenis_cuti}" tidak dikenali dalam sistem BKN.`);
    return { isValid: false, errors, warnings };
  }

  // 1. Validasi Jenis ASN (PNS vs PPPK)
  if (!rule.allowedASN.includes(employee.jenis_asn)) {
    errors.push(
      `Berdasarkan Buku Saku BKN 2024 hal. 4, Pegawai ${employee.jenis_asn} TIDAK BERHAK mengajukan ${rule.name}. ` +
      `PPPK hanya berhak atas: Cuti Tahunan, Cuti Sakit, Cuti Melahirkan, dan Cuti Bersama.`
    );
  }

  // 2. Validasi per Jenis Cuti
  if (jenis_cuti === 'cuti_tahunan') {
    // Syarat masa kerja minimal 1 tahun
    if (employee.masa_kerja_tahun < 1) {
      errors.push(
        `Syarat Cuti Tahunan (Hal. 5): PNS/PPPK harus telah bekerja paling kurang 1 (satu) tahun secara terus-menerus. ` +
        `Masa kerja Anda saat ini baru ${employee.masa_kerja_tahun} tahun ${employee.masa_kerja_bulan} bulan.`
      );
    }

    const totalSisaTahunan = (employee.sisa_cuti_n2 || 0) + (employee.sisa_cuti_n1 || 0) + (employee.sisa_cuti_n || 0);
    if (jumlah_hari > totalSisaTahunan) {
      errors.push(
        `Permintaan cuti (${jumlah_hari} hari) melebihi total hak cuti tahunan Anda (${totalSisaTahunan} hari). ` +
        `Rincian hak: Tahun N (${employee.sisa_cuti_n || 0} hari), Sisa N-1 (${employee.sisa_cuti_n1 || 0} hari), Sisa N-2 (${employee.sisa_cuti_n2 || 0} hari).`
      );
    }

    // Cek apakah tahun ini sedang menggunakan cuti besar
    if (employee.cuti_besar_terakhir && new Date(employee.cuti_besar_terakhir).getFullYear() === new Date().getFullYear()) {
      errors.push('PNS yang menggunakan hak atas cuti besar tidak berhak atas cuti tahunan dalam tahun yang bersangkutan (Hal. 8).');
    }
  }

  if (jenis_cuti === 'cuti_besar') {
    // Pengecualian: Ibadah haji pertama kali atau kelahiran anak ke-4+
    const isHajiPertama = (kategori_detail === 'ibadah_haji_pertama');
    const isAnakKeempatPlus = (kategori_detail === 'kelahiran_anak_4_plus' || (anak_ke && anak_ke >= 4));

    if (!isHajiPertama && !isAnakKeempatPlus) {
      if (employee.masa_kerja_tahun < 5) {
        errors.push(
          `Syarat Cuti Besar (Hal. 8): PNS harus telah bekerja paling singkat 5 (lima) tahun secara terus-menerus. ` +
          `Masa kerja Anda saat ini adalah ${employee.masa_kerja_tahun} tahun ${employee.masa_kerja_bulan} bulan.`
        );
      }
    } else if (isHajiPertama) {
      warnings.push('PNS yang melaksanakan Ibadah Haji untuk pertama kali dikecualikan dari syarat masa kerja 5 tahun cuti besar (Hal. 23). Wajib melampirkan jadwal kloter.');
      if (!lampiran_nama) {
        errors.push('Cuti Ibadah Haji wajib melampirkan Jadwal Keberangkatan / Kelompok Terbang (Kloter) resmi.');
      }
    }

    if (jumlah_hari > 90) {
      errors.push('Lamanya hak atas cuti besar diberikan paling lama 3 (tiga) bulan / 90 hari kalender (Hal. 8).');
    }

    warnings.push(
      'Perhatian (Hal. 8 & 9): Mengambil Cuti Besar menghapus hak Cuti Tahunan Anda tahun ini. ' +
      'Jika cuti besar diambil kurang dari 3 bulan, sisa haknya akan hapus/hangus.'
    );
    warnings.push('Selama Cuti Besar, Anda menerima Gaji Pokok, Tunj. Keluarga, Tunj. Pangan, tetapi TIDAK menerima Tunjangan Jabatan (Hal. 24).');
  }

  if (jenis_cuti === 'cuti_sakit') {
    if (jumlah_hari === 1) {
      warnings.push('Sakit 1 hari: Cukup menyampaikan surat keterangan dokter kepada Atasan Langsung (Hal. 10).');
    } else if (jumlah_hari > 1) {
      warnings.push('Sakit lebih dari 1 hari: Pengajuan harus diajukan kepada PPK dengan surat keterangan dokter resmi (Hal. 10).');
    }

    if (!lampiran_nama) {
      errors.push('Cuti Sakit wajib melampirkan Surat Keterangan Dokter yang memiliki izin praktek resmi (Hal. 10).');
    }

    if (kategori_detail === 'keguguran' && jumlah_hari > 45) {
      errors.push('PNS yang mengalami gugur kandungan berhak atas cuti sakit paling lama 1 1/2 (satu setengah) bulan / 45 hari (Hal. 12).');
    }
  }

  if (jenis_cuti === 'cuti_melahirkan') {
    if (anak_ke && anak_ke > 3) {
      errors.push(
        `Untuk kelahiran anak ke-4 dan seterusnya, hak yang diberikan adalah Cuti Besar (Hal. 13 & 15). ` +
        `Silakan pilih jenis "Cuti Besar" dengan kategori "Kelahiran Anak ke-4+".`
      );
    }
    if (jumlah_hari > 90) {
      errors.push('Lamanya hak atas cuti melahirkan diberikan paling lama 3 (tiga) bulan / 90 hari (Hal. 13).');
    }
    warnings.push('Selama menggunakan hak cuti melahirkan, PNS tetap menerima penghasilan penuh beserta seluruh tunjangan (Hal. 14).');
  }

  if (jenis_cuti === 'cuti_alasan_penting') {
    if (jumlah_hari > 30) {
      errors.push('Lamanya cuti karena alasan penting ditentukan paling lama 1 (satu) bulan / 30 hari (Hal. 17).');
    }

    if (kategori_detail === 'istri_melahirkan') {
      if (!lampiran_nama) {
        errors.push('PNS laki-laki yang mendampingi istri melahirkan/caesar wajib melampirkan surat keterangan rawat inap dari Unit Pelayanan Kesehatan (Hal. 15 & 16).');
      }
    }
  }

  if (jenis_cuti === 'cltn') {
    if (employee.masa_kerja_tahun < 5) {
      errors.push('Syarat CLTN (Hal. 19): PNS harus telah bekerja paling singkat 5 (lima) tahun secara terus-menerus.');
    }
    if (jumlah_hari > 1095) { // 3 years
      errors.push('Cuti di Luar Tanggungan Negara diberikan untuk paling lama 3 (tiga) tahun (Hal. 20).');
    }
    warnings.push(
      'Konsekuensi CLTN (Hal. 20-21): PNS diberhentikan dari jabatan, masa kerja terhenti, ' +
      'dan TIDAK menerima penghasilan apapun (Gaji Pokok, Tunjangan Keluarga, Pangan, Jabatan NOL).'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
