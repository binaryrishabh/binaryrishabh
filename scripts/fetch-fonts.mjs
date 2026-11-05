// One-off: download small Latin subsets of the portfolio landing page's fonts (Inter Tight, JetBrains Mono) from Google Fonts (OFL licensed)
// so they can be embedded in the SVGs (GitHub renders README images without external font loads).
import { writeFileSync } from 'node:fs';
const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('');
const text = ascii + '·—–→←↑↓’‘“”…×✓★●▸≈−';
const fonts = {
  'intertight-regular': 'Inter+Tight:wght@400',
  'intertight-semibold': 'Inter+Tight:wght@600',
  'intertight-extrabold': 'Inter+Tight:wght@800',
  'mono-medium': 'JetBrains+Mono:wght@500',
};
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
for (const [name, fam] of Object.entries(fonts)) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${fam}&text=${encodeURIComponent(text)}`, { headers: { 'User-Agent': UA } })).text();
  const url = css.match(/url\((https:[^)]+)\)/)?.[1];
  if (!url) throw new Error(name + ': ' + css.slice(0, 200));
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(`assets/fonts/${name}.woff2`, buf);
  console.log(name, buf.length, 'bytes');
}
