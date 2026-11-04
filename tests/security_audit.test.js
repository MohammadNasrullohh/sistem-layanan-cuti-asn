import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:3001';

describe('Security Audit & Defensive Testing', () => {

  it('1. SQL Injection: Query parameter manipulation harus ditolak/dinetralkan', async () => {
    // Attack payload aiming to bypass filtering and dump all records
    const maliciousPayload = encodeURIComponent("' OR 1=1 --");
    const res = await fetch(`${BASE_URL}/api/leave-requests?employee_id=${maliciousPayload}`);
    assert.equal(res.status, 200);
    const data = await res.json();
    // Prepared statement binds the string literal "' OR 1=1 --", matching 0 records
    assert.equal(data.length, 0, 'SQL injection payload tidak boleh mengeksekusi query bypass');
  });

  it('2. SQL Injection: Route parameter UNION injection harus mengembalikan 404', async () => {
    const maliciousRoute = encodeURIComponent("' UNION SELECT 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20 --");
    const res = await fetch(`${BASE_URL}/api/leave-requests/${maliciousRoute}`);
    assert.equal(res.status, 404, 'Route SQL injection harus menghasilkan 404 Not Found');
    const data = await res.json();
    assert.ok(data.error);
  });

  it('3. Input Boundary: Menolak durasi negatif (jumlah_hari <= 0)', async () => {
    const payload = {
      employee_id: 'emp-pns-1',
      jenis_cuti: 'cuti_tahunan',
      alasan_cuti: 'Test boundary validation',
      tanggal_mulai: '2026-11-20',
      tanggal_selesai: '2026-11-24',
      jumlah_hari: -5,
      alamat_selama_cuti: 'Kebumen',
      no_telepon_cuti: '08123456789'
    };

    const res = await fetch(`${BASE_URL}/api/leave-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 400, 'Server harus menolak durasi negatif dengan status 400');
    const data = await res.json();
    assert.ok(data.error.includes('tidak valid'));
  });

  it('4. Input Boundary: Menolak tanggal selesai yang mendahului tanggal mulai', async () => {
    const payload = {
      employee_id: 'emp-pns-1',
      jenis_cuti: 'cuti_tahunan',
      alasan_cuti: 'Test inverted date bounds',
      tanggal_mulai: '2026-11-25',
      tanggal_selesai: '2026-11-20', // Inverted!
      jumlah_hari: 3,
      alamat_selama_cuti: 'Kebumen',
      no_telepon_cuti: '08123456789'
    };

    const res = await fetch(`${BASE_URL}/api/leave-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 400, 'Server harus menolak tanggal terbalik dengan status 400');
    const data = await res.json();
    assert.ok(data.error.includes('mendahului'));
  });

  it('5. Tampering: Menolak aksi pertimbangan atasan di luar whitelist', async () => {
    // Get an existing request
    const requests = await fetch(`${BASE_URL}/api/leave-requests`).then(r => r.json());
    assert.ok(requests.length > 0);
    const targetId = requests[0].id;

    const res = await fetch(`${BASE_URL}/api/leave-requests/${targetId}/atasan-action`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        atasan_aksi: 'MALICIOUS_INJECTION_ACTION',
        atasan_catatan: 'Injection test',
        atasan_id: 'emp-atasan-1'
      })
    });

    assert.equal(res.status, 400, 'Server harus menolak aksi atasan yang tidak terdaftar');
    const data = await res.json();
    assert.ok(data.error.includes('tidak valid'));
  });

  it('6. Tampering: Menolak aksi keputusan PPK di luar whitelist', async () => {
    const requests = await fetch(`${BASE_URL}/api/leave-requests`).then(r => r.json());
    const targetId = requests[0].id;

    const res = await fetch(`${BASE_URL}/api/leave-requests/${targetId}/ppk-action`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ppk_aksi: "DROP TABLE employees; --",
        ppk_catatan: 'SQL injection attempt',
        ppk_id: 'emp-ppk-1'
      })
    });

    assert.equal(res.status, 400, 'Server harus menolak keputusan PPK yang tidak sah');
    const data = await res.json();
    assert.ok(data.error.includes('tidak valid'));
  });

  it('7. XSS Payload Resistance: Input teks script disimpan sebagai string literal aman', async () => {
    const xssString = "<script>alert('XSS_AUDIT')</script><img src=x onerror=alert(1)>";
    const payload = {
      employee_id: 'emp-pns-1',
      jenis_cuti: 'cuti_tahunan',
      alasan_cuti: xssString,
      tanggal_mulai: '2026-12-01',
      tanggal_selesai: '2026-12-02',
      jumlah_hari: 2,
      alamat_selama_cuti: 'Kebumen',
      no_telepon_cuti: '08123456789'
    };

    const res = await fetch(`${BASE_URL}/api/leave-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 201);
    const data = await res.json();
    assert.ok(data.requestId);

    // Fetch the created request
    const getRes = await fetch(`${BASE_URL}/api/leave-requests/${data.requestId}`);
    const created = await getRes.json();
    assert.equal(created.alasan_cuti, xssString, 'Payload tersimpan murni sebagai string data, tanpa evaluasi kode');

    // Clean up test audit record so database stays pristine
    await fetch(`${BASE_URL}/api/leave-requests/${data.requestId}`, { method: 'DELETE' });
  });

  it('8. Security Headers: Header perlindungan browser terpasang', async () => {
    const res = await fetch(`${BASE_URL}/api/employees`);
    assert.equal(res.status, 200);

    const nosniff = res.headers.get('x-content-type-options');
    const frameguard = res.headers.get('x-frame-options');
    const xssProtect = res.headers.get('x-xss-protection');

    assert.equal(nosniff, 'nosniff', 'X-Content-Type-Options harus nosniff');
    assert.equal(frameguard, 'SAMEORIGIN', 'X-Frame-Options harus SAMEORIGIN');
    assert.equal(xssProtect, '1; mode=block', 'X-XSS-Protection harus aktif');
  });

});
