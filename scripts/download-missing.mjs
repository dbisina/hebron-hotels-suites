import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { get } from "https";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const IMAGES = [
  // Events
  { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85", dest: "public/images/events/weddings.jpg" },
  { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85", dest: "public/images/events/conferences.jpg" },
  { url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=85", dest: "public/images/events/parties.jpg" },
  // Packages
  { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=85", dest: "public/images/packages/premium-weekend-escape.jpg" },
  { url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=85", dest: "public/images/packages/exclusive-lifestyle-voucher.jpg" },
  { url: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&q=85", dest: "public/images/packages/romantic-getaway.jpg" },
];

async function download(url, dest) {
  const fullDest = join(ROOT, dest);
  await mkdir(dirname(fullDest), { recursive: true });
  return new Promise((resolve, reject) => {
    const file = createWriteStream(fullDest);
    function fetch(u) {
      get(u, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) return fetch(res.headers.location);
        if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode} for ${u}`)); return; }
        res.pipe(file);
        file.on("finish", () => { file.close(); resolve(); });
      }).on("error", reject);
    }
    fetch(url);
  });
}

console.log(`Downloading ${IMAGES.length} images...`);
for (const img of IMAGES) {
  try {
    process.stdout.write(`  ${img.dest}... `);
    await download(img.url, img.dest);
    console.log("ok");
  } catch (e) {
    console.log(`FAIL ${e.message}`);
  }
}
console.log("Done.");