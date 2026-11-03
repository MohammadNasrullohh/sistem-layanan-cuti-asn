import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Helper: FIFO calculation function matching Peraturan BKN No. 7/2021
function calculateFifoDeduction(emp, daysToDeduct) {
  let n2 = emp.sisa_cuti_n2 || 0;
  let n1 = emp.sisa_cuti_n1 || 0;
  let n = emp.sisa_cuti_n || 0;
  let remainingToDeduct = daysToDeduct;

  // 1. Deduct oldest N-2 (ditangguhkan) first
  if (n2 > 0) {
    const deductN2 = Math.min(n2, remainingToDeduct);
    n2 -= deductN2;
    remainingToDeduct -= deductN2;
  }
  // 2. Deduct N-1 (tahun sebelumnya, maks 6 hari)
  if (remainingToDeduct > 0 && n1 > 0) {
    const deductN1 = Math.min(n1, remainingToDeduct);
    n1 -= deductN1;
    remainingToDeduct -= deductN1;
  }
  // 3. Deduct N (tahun berjalan)
  if (remainingToDeduct > 0 && n > 0) {
    const deductN = Math.min(n, remainingToDeduct);
    n -= deductN;
    remainingToDeduct -= deductN;
  }

  return { n2, n1, n, unfulfilledDays: remainingToDeduct };
}

// Helper: Working days calculation excluding weekends
function calculateWorkingDays(startDateStr, endDateStr, holidays = []) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (end < start) return 0;

  let workDays = 0;
  let cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    const dateStr = cur.toISOString().slice(0, 10);
    // Exclude Saturday (6), Sunday (0), and national holidays
    if (day !== 0 && day !== 6 && !holidays.includes(dateStr)) {
      workDays++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return workDays;
}

// Helper: BKN Regulatory Eligibility Validator
function validateBknLeaveCompliance({
  jenisAsn,
  masaKerjaTahun,
  jenisCuti,
  jumlahHari,
  totalSisaTahunan,
  kategoriDetail,
  hasAttachment
}) {
  const errors = [];
  const warnings = [];

  // 1. Rule PPPK vs PNS (Buku Saku BKN 2024 Hal. 4)
  if (jenisAsn === 'PPPK') {
    const allowedPppk = ['cuti_tahunan', 'cuti_sakit', 'cuti_melahirkan', 'cuti_bersama'];
    if (!allowedPppk.includes(jenisCuti)) {
      errors.push('PPPK_NOT_ALLOWED');
    }
  }

  // 2. Rule Cuti Tahunan: Min 1 year tenure (Hal. 5)
  if (jenisCuti === 'cuti_tahunan') {
    if (masaKerjaTahun < 1) {
      errors.push('TENURE_LESS_THAN_ONE_YEAR');
    }
    if (jumlahHari > totalSisaTahunan) {
      errors.push('EXCEEDS_ANNUAL_QUOTA');
    }
  }

  // 3. Rule Cuti Besar: Min 5 years tenure for PNS, with exemptions (Hal. 8, 15, 23)
  if (jenisCuti === 'cuti_besar') {
    const isHajiExempt = kategoriDetail === 'ibadah_haji_pertama';
    const isAnak4Exempt = kategoriDetail === 'kelahiran_anak_4_plus';
    if (!isHajiExempt && !isAnak4Exempt && masaKerjaTahun < 5) {
      errors.push('CUTI_BESAR_TENURE_LESS_THAN_5_YEARS');
    }
    if (isHajiExempt && !hasAttachment) {
      errors.push('HAJI_REQUIRES_ATTACHMENT');
    }
    if (jumlahHari > 90) {
      errors.push('CUTI_BESAR_EXCEEDS_3_MONTHS');
    }
  }

  // 4. Rule Cuti Sakit: Requires medical certificate (Hal. 10)
  if (jenisCuti === 'cuti_sakit') {
    if (!hasAttachment) {
      errors.push('SICK_LEAVE_REQUIRES_DOCTOR_NOTE');
    }
    if (kategoriDetail === 'keguguran' && jumlahHari > 45) {
      errors.push('MISCARRIAGE_EXCEEDS_45_DAYS');
    }
  }

  // 5. Rule CLTN: Min 5 years tenure (Hal. 20)
  if (jenisCuti === 'cltn') {
    if (masaKerjaTahun < 5) {
      errors.push('CLTN_TENURE_LESS_THAN_5_YEARS');
    }
  }

  return { isValid: errors.length === 0, errors, warnings };
}

describe('Unit Tests: Aturan Regulasi Cuti ASN (Peraturan BKN No. 7/2021)', () => {

  it('1. Cuti Tahunan: Menolak jika masa kerja kurang dari 1 tahun', () => {
    const res = validateBknLeaveCompliance({
      jenisAsn: 'PNS',
      masaKerjaTahun: 0,
      jenisCuti: 'cuti_tahunan',
      jumlahHari: 3,
      totalSisaTahunan: 12,
      kategoriDetail: '',
      hasAttachment: false
    });
    assert.equal(res.isValid, false);
    assert.ok(res.errors.includes('TENURE_LESS_THAN_ONE_YEAR'));
  });

  it('2. Pembatasan Hak PPPK: Menolak Cuti Besar dan CLTN bagi pegawai PPPK', () => {
    const resCutiBesar = validateBknLeaveCompliance({
      jenisAsn: 'PPPK',
      masaKerjaTahun: 6,
      jenisCuti: 'cuti_besar',
      jumlahHari: 30,
      totalSisaTahunan: 12,
      kategoriDetail: '',
      hasAttachment: false
    });
    assert.equal(resCutiBesar.isValid, false);
    assert.ok(resCutiBesar.errors.includes('PPPK_NOT_ALLOWED'));

    const resCltn = validateBknLeaveCompliance({
      jenisAsn: 'PPPK',
      masaKerjaTahun: 6,
      jenisCuti: 'cltn',
      jumlahHari: 60,
      totalSisaTahunan: 12,
      kategoriDetail: '',
      hasAttachment: false
    });
    assert.equal(resCltn.isValid, false);
    assert.ok(resCltn.errors.includes('PPPK_NOT_ALLOWED'));
  });

  it('3. Pengecualian Cuti Besar: Ibadah Haji Pertama mengesampingkan syarat 5 tahun kerja (Hal. 23)', () => {
    const res = validateBknLeaveCompliance({
      jenisAsn: 'PNS',
      masaKerjaTahun: 2, // < 5 tahun
      jenisCuti: 'cuti_besar',
      jumlahHari: 40,
      totalSisaTahunan: 12,
      kategoriDetail: 'ibadah_haji_pertama',
      hasAttachment: true // Ada jadwal kloter resmi
    });
    assert.equal(res.isValid, true);
    assert.equal(res.errors.length, 0);
  });

  it('4. Pengecualian Cuti Besar: Kelahiran anak ke-4 mengesampingkan syarat 5 tahun kerja (Hal. 15)', () => {
    const res = validateBknLeaveCompliance({
      jenisAsn: 'PNS',
      masaKerjaTahun: 3, // < 5 tahun
      jenisCuti: 'cuti_besar',
      jumlahHari: 90,
      totalSisaTahunan: 12,
      kategoriDetail: 'kelahiran_anak_4_plus',
      hasAttachment: true
    });
    assert.equal(res.isValid, true);
    assert.equal(res.errors.length, 0);
  });

  it('5. Cuti Sakit: Wajib melampirkan surat dokter berizin resmi (Hal. 10)', () => {
    const resTanpaDokter = validateBknLeaveCompliance({
      jenisAsn: 'PNS',
      masaKerjaTahun: 5,
      jenisCuti: 'cuti_sakit',
      jumlahHari: 3,
      totalSisaTahunan: 12,
      kategoriDetail: 'sakit_biasa',
      hasAttachment: false
    });
    assert.equal(resTanpaDokter.isValid, false);
    assert.ok(resTanpaDokter.errors.includes('SICK_LEAVE_REQUIRES_DOCTOR_NOTE'));

    const resDenganDokter = validateBknLeaveCompliance({
      jenisAsn: 'PNS',
      masaKerjaTahun: 5,
      jenisCuti: 'cuti_sakit',
      jumlahHari: 3,
      totalSisaTahunan: 12,
      kategoriDetail: 'sakit_biasa',
      hasAttachment: true
    });
    assert.equal(resDenganDokter.isValid, true);
  });

  it('6. FIFO Quota Deduction: Memotong dari saldo tertua N-2 -> N-1 -> N', () => {
    // Skenario: Pegawai punya N-2 = 4, N-1 = 6, N = 12. Mengajukan 8 hari cuti tahunan.
    const emp = { sisa_cuti_n2: 4, sisa_cuti_n1: 6, sisa_cuti_n: 12 };
    const result = calculateFifoDeduction(emp, 8);

    // 4 hari dipotong dari N-2 -> sisa 0
    // 4 hari dipotong dari N-1 -> sisa 2 (dari 6)
    // 0 hari dipotong dari N -> sisa tetap 12
    assert.equal(result.n2, 0, 'N-2 harus habis terpotong lebih dulu');
    assert.equal(result.n1, 2, 'N-1 harus bersisa 2 hari');
    assert.equal(result.n, 12, 'N harus utuh 12 hari karena N-2 & N-1 mencukupi');
    assert.equal(result.unfulfilledDays, 0);
  });

  it('7. FIFO Quota Deduction: Memotong hingga saldo N jika N-2 dan N-1 habis', () => {
    const emp = { sisa_cuti_n2: 2, sisa_cuti_n1: 3, sisa_cuti_n: 12 };
    // Mengajukan 10 hari:
    // N-2 (2) -> sisa 0 (sisa butuh 8)
    // N-1 (3) -> sisa 0 (sisa butuh 5)
    // N (12) -> sisa 7 (12 - 5)
    const result = calculateFifoDeduction(emp, 10);
    assert.equal(result.n2, 0);
    assert.equal(result.n1, 0);
    assert.equal(result.n, 7);
    assert.equal(result.unfulfilledDays, 0);
  });

  it('8. Kalkulator Hari Kerja: Otomatis mengecualikan Sabtu, Minggu, dan Libur Nasional', () => {
    // Tanggal: Jumat, 20 Nov 2026 s.d Selasa, 24 Nov 2026
    // Jumat (20) = Hari kerja (1)
    // Sabtu (21) = Weekend (0)
    // Minggu (22) = Weekend (0)
    // Senin (23) = Hari kerja (2)
    // Selasa (24) = Hari kerja (3)
    const totalHari = calculateWorkingDays('2026-11-20', '2026-11-24', []);
    assert.equal(totalHari, 3, 'Harus 3 hari kerja (Sabtu & Minggu dikecualikan)');

    // Tambah libur nasional di hari Senin 23 Nov
    const totalDenganLibur = calculateWorkingDays('2026-11-20', '2026-11-24', ['2026-11-23']);
    assert.equal(totalDenganLibur, 2, 'Harus 2 hari kerja jika Senin hari libur resmi');
  });

  it('9. Cuti Sakit Keguguran: Dibatasi maksimal 45 hari (1 1/2 bulan per Hal. 12)', () => {
    const resOver = validateBknLeaveCompliance({
      jenisAsn: 'PNS',
      masaKerjaTahun: 4,
      jenisCuti: 'cuti_sakit',
      jumlahHari: 50, // Melebihi 45 hari
      totalSisaTahunan: 12,
      kategoriDetail: 'keguguran',
      hasAttachment: true
    });
    assert.equal(resOver.isValid, false);
    assert.ok(resOver.errors.includes('MISCARRIAGE_EXCEEDS_45_DAYS'));
  });

});
