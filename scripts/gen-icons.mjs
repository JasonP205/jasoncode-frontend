/**
 * Rasterise the app icons from `src/app/icon.svg` (the Jason Dev layers mark).
 * Run from `frontend/`: `node scripts/gen-icons.mjs`.
 *
 * - icon.png (96, transparent) and favicon.ico (16/32/48, transparent)
 * - apple-icon.png and the web-app manifest icons get a white, opaque
 *   background: iOS and Android fill transparency with black otherwise.
 */
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";

const require = createRequire(import.meta.url);
// sharp ships with Next.js; resolve it from pnpm's store.
const store = readdirSync("node_modules/.pnpm").find((d) => d.startsWith("sharp@"));
const sharp = require(`../node_modules/.pnpm/${store}/node_modules/sharp`);

const svg = readFileSync("src/app/icon.svg");

async function png(size, { background, inset = 0 } = {}) {
  const inner = Math.round(size * (1 - inset * 2));
  const mark = await sharp(svg, { density: 1200 }).resize(inner, inner).png().toBuffer();
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toBuffer();
}

/** A .ico is a tiny directory of embedded PNGs. */
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((im) => im.data)]);
}

const white = { r: 255, g: 255, b: 255, alpha: 1 };
writeFileSync("src/app/icon.png", await png(96));
writeFileSync("src/app/apple-icon.png", await png(180, { background: white, inset: 0.14 }));
writeFileSync("public/web-app-manifest-192x192.png", await png(192, { background: white, inset: 0.16 }));
writeFileSync("public/web-app-manifest-512x512.png", await png(512, { background: white, inset: 0.16 }));
const sizes = [16, 32, 48];
writeFileSync(
  "src/app/favicon.ico",
  ico(await Promise.all(sizes.map(async (size) => ({ size, data: await png(size) })))),
);
console.log("icons written");
