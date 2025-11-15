#!/usr/bin/env node
// tone-check.mjs — vérif légère du wording Parlios
import fs from "fs";
const files = process.argv.slice(2);
const bad = [];
for (const f of files) {
  const t = fs.readFileSync(f, "utf8");
  if (t.match(/\b(blockchain|synergie|paradigme|disruptif)\b/i)) bad.push(f);
}
if (bad.length) {
  console.log("::notice ::Tone check: jargon excessif détecté -> " + bad.join(", "));
}
