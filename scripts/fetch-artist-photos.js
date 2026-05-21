const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const lineup = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/lineup.json'), 'utf-8'));
const outDir = path.join(ROOT, 'public', 'artists');
fs.mkdirSync(outDir, { recursive: true });

const searchOverrides = {
  'ame': 'Frank Wiedemann',
  'konstantin': 'Konstantin',
  'dj-tennis': 'DJ Tennis',
  'fred-again': 'Fred again..',
  'sama-abdulhadi': "Sama' Abdulhadi",
  'tale-of-us': 'Tale Of Us',
  'floating-points': 'Floating Points',
  'four-tet': 'Four Tet',
  'jamie-xx': 'Jamie xx',
  'bicep': 'Bicep',
  'moderat': 'Moderat',
  'objekt': 'Objekt',
  'eris-drew': 'Eris Drew',
  'anfisa-letyaga': 'Anfisa Letyago',
};

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'lovebeat/1.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location).then(resolve, reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        resolve(buf);
      });
    }).on('error', reject);
  });
}

async function fetchArtistImage(name, slug) {
  const q = encodeURIComponent(searchOverrides[slug] || name);
  const json = JSON.parse((await get(`https://api.deezer.com/search/artist?q=${q}&limit=1`)).toString());
  const pic = json?.data?.[0]?.picture_xl || json?.data?.[0]?.picture_big;
  if (!pic) throw new Error('no image in Deezer');
  return get(pic);
}

async function main() {
  for (const a of lineup.artists) {
    const dest = path.join(outDir, `${a.slug}.jpg`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 5000) {
      console.log(`skip  ${a.slug}`);
      continue;
    }
    try {
      const buf = await fetchArtistImage(a.name, a.slug);
      fs.writeFileSync(dest, buf);
      console.log(`ok    ${a.slug} (${buf.length} bytes)`);
    } catch (e) {
      console.log(`fail  ${a.slug}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 250));
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
