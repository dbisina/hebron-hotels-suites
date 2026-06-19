/**
 * Download placeholder images for gallery/facility sections.
 * Uses Unsplash direct URLs (no API key needed).
 * Run: node scripts/download-images.mjs
 */
import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { get } from "https";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const IMAGES = [
  // Gallery
  {
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85",
    dest: "public/images/gallery/pool.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=85",
    dest: "public/images/gallery/lobby.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=85",
    dest: "public/images/gallery/exterior.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85",
    dest: "public/images/gallery/dining.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=85",
    dest: "public/images/gallery/event.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=85",
    dest: "public/images/gallery/spa.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=85",
    dest: "public/images/gallery/suite-ext.jpg",
  },
  // About section
  {
    url: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=1200&q=85",
    dest: "public/images/about.jpg",
  },
  // Facilities
  {
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=85",
    dest: "public/images/gym.jpg",
  },
  {
    url: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1200&q=85",
    dest: "public/images/breakfast.jpg",
  },
];

async function download(url, dest) {
  const fullDest = join(ROOT, dest);
  await mkdir(dirname(fullDest), { recursive: true });

  return new Promise((resolve, reject) => {
    const file = createWriteStream(fullDest);
    function fetch(u) {
      get(u, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return fetch(res.headers.location);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${u}`));
          return;
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      }).on("error", reject);
    }
    fetch(url);
  });
}

console.log(`Downloading ${IMAGES.length} images…`);
for (const img of IMAGES) {
  try {
    process.stdout.write(`  ${img.dest}… `);
    await download(img.url, img.dest);
    console.log("✓");
  } catch (e) {
    console.log(`✗ ${e.message}`);
  }
}
console.log("Done.");
