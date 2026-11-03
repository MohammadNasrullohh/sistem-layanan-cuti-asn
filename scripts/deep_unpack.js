import fs from 'node:fs';
import zlib from 'node:zlib';
import path from 'node:path';

function unpackFile(filePath, outDir) {
  const content = fs.readFileSync(filePath, 'utf8');
  const manifestTag = '<script type="__bundler/manifest">';
  const manifestEnd = '</script>';

  const mStart = content.indexOf(manifestTag);
  const mEnd = content.indexOf(manifestEnd, mStart);

  const tTag = '<script type="__bundler/template">';
  const tStart = content.indexOf(tTag);
  const tEnd = content.indexOf(manifestEnd, tStart);

  if (tStart === -1) {
    console.log(`No template in ${filePath}`);
    return;
  }

  let template = JSON.parse(content.slice(tStart + tTag.length, tEnd));

  if (mStart !== -1) {
    const manifest = JSON.parse(content.slice(mStart + manifestTag.length, mEnd));
    for (const [uuid, entry] of Object.entries(manifest)) {
      const buf = Buffer.from(entry.data, 'base64');
      const data = entry.compressed ? zlib.gunzipSync(buf) : buf;
      const text = data.toString('utf8');
      if (template.includes(uuid)) {
        template = template.split(uuid).join(text);
      }
    }
  }

  const baseName = path.basename(filePath, '.html');
  const outPath = path.join(outDir, `${baseName}_rendered.html`);
  fs.writeFileSync(outPath, template);
  console.log(`Rendered: ${outPath} (${template.length} bytes)`);
}

const dir = 'C:\\Users\\meong\\Downloads';
const files = fs.readdirSync(dir).filter(f => f.startsWith('unpacked_') && f.endsWith('.html') && !f.endsWith('_rendered.html') && f !== 'unpacked_template.html');

for (const file of files) {
  unpackFile(path.join(dir, file), dir);
}
console.log('Deep unpack completed.');
