const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');

async function convert(file) {
  const ext = path.extname(file).toLowerCase();
  const full = path.join(publicDir, file);
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;
  const name = file.replace(ext, '');
  try {
    await sharp(full).toFile(path.join(publicDir, `${name}.webp`));
    await sharp(full).toFile(path.join(publicDir, `${name}.avif`));
    console.log('Converted', file);
  } catch (e) {
    console.error('Failed', file, e.message);
  }
}

function walk(dir, base = ''){
  const files = fs.readdirSync(dir);
  files.forEach(f =>{
    const full = path.join(dir, f);
    const rel = path.join(base, f);
    if (fs.statSync(full).isDirectory()) walk(full, rel);
    else convert(rel);
  })
}

walk(publicDir);
