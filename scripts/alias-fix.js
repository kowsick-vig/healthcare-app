const fs = require('fs');
const path = require('path');

function walk(dir, out=[]) {
  for (const d of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(d.name)) out.push(p);
  }
  return out;
}

const files = walk('src');
const rxAuth = /from\s+['"](?:\.\.\/)+lib\/auth['"]/g;
const rxDb   = /from\s+['"](?:\.\.\/)+lib\/db['"]/g;

let count = 0;
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  const t = s.replace(rxAuth, 'from "@/lib/auth"').replace(rxDb, 'from "@/lib/db"');
  if (t !== s) {
    fs.writeFileSync(f, t);
    console.log('updated', f);
    count++;
  }
}
console.log('done, updated', count, 'files');
