import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
const svgPath = "public/og-image.svg";
const pngPath = "public/og-image.png";
const svg = await readFile(svgPath);
const png = await sharp(svg).png({ quality: 90 }).resize(1200, 630, { fit: "cover" }).toBuffer();
await writeFile(pngPath, png);
console.log("OG PNG generated:", pngPath);
