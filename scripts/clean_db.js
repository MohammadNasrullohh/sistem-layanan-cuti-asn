import db from '../server/db.js';

const res = db.prepare(`
  DELETE FROM leave_requests 
  WHERE alasan_cuti LIKE '%XSS%' 
     OR alasan_cuti LIKE '%script%' 
     OR alasan_cuti = 'mau cuti wok'
`).run();

console.log('Deleted test/junk records:', res.changes);

const list = db.prepare('SELECT id, employee_id, jenis_cuti, alasan_cuti, status FROM leave_requests').all();
console.log('Total remaining records in DB:', list.length);
console.log(list);
