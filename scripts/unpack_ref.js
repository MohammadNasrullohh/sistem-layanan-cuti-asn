import fs from 'node:fs';
import zlib from 'node:zlib';

const htmlPath = 'C:\\Users\\meong\\Downloads\\Redesain LawetHub – Layanan Cuti ASN.html';
const content = fs.readFileSync(htmlPath, 'utf8');

const manifestTag = '<script type="__bundler/manifest">';
const manifestEnd = '</script>';

const startIdx = content.indexOf(manifestTag);
const endIdx = content.indexOf(manifestEnd, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('Manifest not found');
  process.exit(1);
}

const manifestJson = content.slice(startIdx + manifestTag.length, endIdx);
const manifest = JSON.parse(manifestJson);

const templateTag = '<script type="__bundler/template">';
const templateStart = content.indexOf(templateTag);
const templateEnd = content.indexOf(manifestEnd, templateStart);
let template = '';
if (templateStart !== -1 && templateEnd !== -1) {
  template = JSON.parse(content.slice(templateStart + templateTag.length, templateEnd));
}

for (const [uuid, entry] of Object.entries(manifest)) {
  const buf = Buffer.from(entry.data, 'base64');
  let data;
  if (entry.compressed) {
    data = zlib.gunzipSync(buf);
  } else {
    data = buf;
  }
  const ext = entry.mime.includes('html') ? 'html' : entry.mime.includes('javascript') ? 'js' : entry.mime.includes('css') ? 'css' : 'bin';
  const outPath = `C:\\Users\\meong\\Downloads\\unpacked_${uuid}.${ext}`;
  fs.writeFileSync(outPath, data);
  console.log(`Unpacked ${uuid} -> ${outPath} (${data.length} bytes, ${entry.mime})`);

  if (template.includes(uuid)) {
    template = template.split(uuid).join(outPath);
  }
}

fs.writeFileSync('C:\\Users\\meong\\Downloads\\unpacked_template.html', template);
console.log('Saved unpacked template.');
