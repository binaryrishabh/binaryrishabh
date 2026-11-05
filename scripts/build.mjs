// Builds every image in assets/ (light + dark) for the profile README.
//   node scripts/build.mjs            static art + live panel (fetches live data if GITHUB_TOKEN is set)
// No dependencies. Live data falls back to data/stats.json whenever a source is unreachable.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const USER = 'binaryrishabh';
const LEETCODE = 'binaryrishabh';
const ATCODER = 'binaryrishabh';

// Light = the tokens of the portfolio landing page (whoami/src/landing/landing.css).
// Dark = a warm-dark counterpart for GitHub's dark theme (the landing page itself is light-only).
const THEMES = {
  light: { bg: '#efece4', panel: '#fbf8f1', ink: '#1a1714', soft: '#6a6253', line: '#e0d7c4', grid: '#ebe5d8', accent: '#3a51f0', warn: '#d2452f', add: '#2f9e62', del: '#d2452f', node: '#fffdf8', stitch: '#5a4e3a2e', shadow: '#2d2820', shadowOp: 0.16 },
  dark: { bg: '#131210', panel: '#1c1a17', ink: '#f3efe6', soft: '#a39b8b', line: '#34302a', grid: '#24221e', accent: '#8191ff', warn: '#ef6a52', add: '#4cc184', del: '#ef6a52', node: '#131210', stitch: '#f3efe62a', shadow: '#000000', shadowOp: 0.5 },
};

// ---------- helpers ----------
// Class names are historical: .serif = Inter Tight 800 display, .sans = Inter Tight text, .mono = JetBrains Mono.
const FONT_FILES = {
  serif: [['IT', 'intertight-extrabold', 'normal', 800]],
  serifItalic: [],
  sans: [['IT', 'intertight-regular', 'normal', 400]],
  sansBold: [['IT', 'intertight-semibold', 'normal', 600]],
  mono: [['JM', 'mono-medium', 'normal', 500]],
};
const fontCache = {};
const b64 = (f) => (fontCache[f] ??= readFileSync(`assets/fonts/${f}.woff2`).toString('base64'));
const faces = (keys) => keys.flatMap((k) => FONT_FILES[k]).map(([fam, file, style, weight]) =>
  `@font-face{font-family:${fam};src:url(data:font/woff2;base64,${b64(file)}) format('woff2');font-style:${style};font-weight:${weight}}`).join('');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const trunc = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

function svg({ w, h, t, fonts, title, css = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>${faces(fonts)}
.serif{font-family:IT,'Helvetica Neue',Arial,sans-serif;font-weight:800;letter-spacing:-.04em}
.sans{font-family:IT,'Helvetica Neue',Arial,sans-serif}
.mono{font-family:JM,ui-monospace,Consolas,monospace}
.ink{fill:${t.ink}}.soft{fill:${t.soft}}.acc{fill:${t.accent}}
.lbl{font-family:JM,ui-monospace,Consolas,monospace;font-size:12px;letter-spacing:.14em;fill:${t.soft}}
${css}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<defs><filter id="puff" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="${t.shadow}" flood-opacity="${t.shadowOp}"/></filter></defs>
<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="24" fill="${t.bg}" stroke="${t.line}"/>
${body}
</svg>`;
}

// ---------- hero ----------
function hero(t) {
  const rows = [
    { label: 'lapwork app start-up', before: '3.4 s', after: '1.2 s', ratio: 1.2 / 3.4, note: '−65% · code splitting, lazy loading' },
    { label: 'lapwork SQLite query', before: '150 ms', after: '20 ms', ratio: 20 / 150, note: '−87% · prepared statements' },
    { label: 'Doors in a CAD plan set', before: '168 found', after: '95 real', ratio: 95 / 168, note: 'each door counted once · ~23 s' },
  ];
  const X = 732, W = 380;
  let css = `.bar{transform-box:fill-box;transform-origin:left center}
.vb{opacity:0;animation:vb 9s infinite}.va{animation:va 9s infinite}
@keyframes vb{0%,14%{opacity:1}24%,90%{opacity:0}100%{opacity:1}}
@keyframes va{0%,16%{opacity:0}28%,88%{opacity:1}98%,100%{opacity:0}}
.pulse{animation:pulse 2.4s ease-in-out infinite}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}`;
  let body = `
<text x="64" y="86" class="lbl">RISHABH SRIVASTAVA · FULL-STACK ENGINEER</text>
<text x="60" y="190" class="serif ink" font-size="84">I make slow</text>
<text x="60" y="282" class="serif ink" font-size="84">software <tspan class="acc">fast.</tspan></text>
<text x="64" y="348" class="sans soft" font-size="20">Backends, LLM pipelines and the apps on top of them.</text>
<text x="64" y="378" class="sans soft" font-size="20">I measure first, then I fix it, and I keep the numbers.</text>
<text x="64" y="440" class="lbl" font-size="11.5">TYPESCRIPT · BUN · POSTGRESQL · REDIS · ELECTRON · PYTHON</text>
<rect x="700" y="52" width="444" height="400" rx="20" fill="${t.panel}" filter="url(#puff)"/>
<rect x="708" y="60" width="428" height="384" rx="15" fill="none" stroke="${t.stitch}" stroke-width="1.5" stroke-dasharray="5 4"/>
<circle cx="737" cy="94" r="4" fill="${t.accent}" class="pulse"/>
<text x="752" y="98" class="lbl">MEASURED, THEN FIXED</text>`;
  rows.forEach((r, i) => {
    const y = 158 + i * 100, d = (i * 0.35).toFixed(2);
    css += `
.b${i}{transform:scaleX(${r.ratio.toFixed(3)});fill:${t.accent};animation:b${i} 9s cubic-bezier(.22,.8,.26,1) ${d}s infinite}
@keyframes b${i}{0%,14%{transform:scaleX(1);fill:${t.warn}}34%,90%{transform:scaleX(${r.ratio.toFixed(3)});fill:${t.accent}}100%{transform:scaleX(1);fill:${t.warn}}}
.r${i} .vb,.r${i} .va{animation-delay:${d}s}`;
    body += `
<g class="r${i}">
  <text x="${X}" y="${y}" class="sans ink" font-size="17" font-weight="600">${esc(r.label)}</text>
  <text x="${X + W}" y="${y}" text-anchor="end" class="mono vb" font-size="16" fill="${t.warn}">${esc(r.before)}</text>
  <text x="${X + W}" y="${y}" text-anchor="end" class="mono va acc" font-size="16">${esc(r.after)}</text>
  <rect x="${X}" y="${y + 16}" width="${W}" height="8" rx="4" fill="${t.line}"/>
  <rect x="${X}" y="${y + 16}" width="${W}" height="8" rx="4" class="bar b${i}"/>
  <text x="${X}" y="${y + 50}" class="mono soft" font-size="12">${esc(r.note)}</text>
</g>`;
  });
  return svg({ w: 1200, h: 500, t, fonts: ['serif', 'sans', 'sansBold', 'mono'], title: 'Rishabh Srivastava: I make slow software fast. Start-up 3.4 s to 1.2 s, SQLite query 150 ms to 20 ms, 168 door detections to 95 real doors.', css, body });
}

// ---------- project cards ----------
function card(t, { title, desc, stack, tag, art, alt }) {
  const { css, body } = art(t);
  return svg({
    w: 600, h: 380, t, fonts: ['serif', 'sans', 'mono'], title: alt, css,
    body: `<rect x="20" y="20" width="560" height="214" rx="16" fill="${t.panel}" filter="url(#puff)"/>
<rect x="26" y="26" width="548" height="202" rx="12" fill="none" stroke="${t.stitch}" stroke-width="1.5" stroke-dasharray="5 4"/>
${body}
<text x="32" y="286" class="serif ink" font-size="30">${esc(title)}</text>
${desc.map((l, i) => `<text x="32" y="${314 + i * 22}" class="sans soft" font-size="15">${esc(l)}</text>`).join('\n')}
<text x="32" y="${362}" class="mono acc" font-size="11" letter-spacing=".1em">${esc(stack)}</text>
<text x="568" y="284" text-anchor="end" class="mono soft" font-size="10.5" letter-spacing=".1em">${esc(tag)}</text>`,
  });
}

function artInfra(t) {
  const N = { users: [86, 128], lb: [206, 128], a1: [346, 70], a2: [346, 128], a3: [346, 186], db: [496, 128] };
  const node = (k, label) => `<g class="n-${k}"><rect x="${N[k][0] - 38}" y="${N[k][1] - 15}" width="76" height="30" rx="8" fill="${t.node}" stroke="${t.line}" stroke-width="1.5" class="box"/><text x="${N[k][0]}" y="${N[k][1] + 4}" text-anchor="middle" class="mono ink" font-size="11">${label}</text></g>`;
  const seg = (a, b) => { const [x1, y1] = N[a], [x2, y2] = N[b]; const s = x1 + 38, e = x2 - 38, m = (s + e) / 2; return `M${s} ${y1} C${m} ${y1} ${m} ${y2} ${e} ${y2}`; };
  const route = (k) => `${seg('users', 'lb')} ${seg('lb', k).replace(/^M/, 'L').replace(/^L[\d. ]+C/, (m) => m)} ${seg(k, 'db')}`;
  const routes = { a1: [seg('users', 'lb'), seg('lb', 'a1'), seg('a1', 'db')], a2: [seg('users', 'lb'), seg('lb', 'a2'), seg('a2', 'db')], a3: [seg('users', 'lb'), seg('lb', 'a3'), seg('a3', 'db')] };
  const join = (parts) => parts.map((p, i) => (i ? p.replace(/^M/, 'L') : p)).join(' ');
  void route;
  const edges = ['a1', 'a2', 'a3'].flatMap((k) => [seg('lb', k), seg(k, 'db')].map((p, i) => `<path d="${p}" fill="none" stroke="${t.line}" stroke-width="2" class="${k === 'a2' ? 'e2' : ''}"/>`)).join('');
  const packets = ['a1', 'a2', 'a3'].map((k, ri) => [0, 1].map((j) => `<circle r="3.6" fill="${t.accent}"><animateMotion dur="2.4s" begin="${(ri * 0.8 + j * 1.2).toFixed(1)}s" repeatCount="indefinite" path="${join(routes[k])}"/></circle>`).join('')).map((g, i) => `<g class="${i === 1 ? 'f2' : ''}">${g}</g>`).join('');
  return {
    css: `.n-a2 .box{animation:down 8s infinite}@keyframes down{0%,30%{stroke:${t.line}}36%,70%{stroke:${t.warn}}76%,100%{stroke:${t.line}}}
.e2{animation:edge 8s infinite}@keyframes edge{0%,30%{stroke:${t.line};opacity:1}36%,70%{stroke:${t.warn};opacity:.35}76%,100%{stroke:${t.line};opacity:1}}
.f2{animation:f2 8s infinite}@keyframes f2{0%,31%{opacity:1}33%,72%{opacity:0}75%,100%{opacity:1}}
.dn{opacity:0;animation:dn 8s infinite}@keyframes dn{0%,32%{opacity:0}36%,70%{opacity:1}74%,100%{opacity:0}}`,
    body: `<text x="40" y="48" class="mono soft" font-size="10.5" letter-spacing=".1em">LOAD BALANCER ROUTES AROUND A FAILED NODE</text>
<path d="${seg('users', 'lb')}" fill="none" stroke="${t.line}" stroke-width="2"/>${edges}${packets}
${node('users', 'users')}${node('lb', 'lb')}${node('a1', 'api-1')}${node('a2', 'api-2')}${node('a3', 'api-3')}${node('db', 'postgres')}
<text x="346" y="${128 + 31}" text-anchor="middle" class="mono dn" font-size="10" fill="${t.warn}" letter-spacing=".1em">DOWN</text>`,
  };
}

function artDiff(t) {
  const states = [
    [[' ', '2 cups all-purpose flour'], [' ', '1 cup white sugar'], [' ', '3 ripe bananas, mashed'], [' ', '1/2 cup butter, melted']],
    [[' ', '2 cups all-purpose flour'], ['-', '1 cup white sugar'], ['+', '3/4 cup brown sugar'], [' ', '3 ripe bananas, mashed'], ['+', '1 tsp cinnamon']],
    [[' ', '2 cups all-purpose flour'], [' ', '1 cup white sugar'], ['-', '3 ripe bananas, mashed'], ['+', '4 very ripe bananas, mashed'], ['+', '1/2 cup chopped walnuts']],
  ];
  const tabs = ['Original', 'Tweak 1', 'Tweak 2'], tx = [40, 128, 210], tw = [80, 74, 74];
  let css = '', body = `<text x="568" y="49" text-anchor="end" class="mono soft" font-size="10.5" letter-spacing=".1em">GEMINI · VERIFIED</text>`;
  states.forEach((lines, s) => {
    const a = s * 33.33, b = a + 31, c = a + 33.33;
    css += `.s${s}{opacity:${s === 1 ? 1 : 0};animation:s${s} 9s infinite}@keyframes s${s}{${s === 0 ? '0%,31%{opacity:1}33.33%,98%{opacity:0}100%{opacity:1}' : `0%,${(a - 0.01).toFixed(2)}%{opacity:0}${(a + 2).toFixed(2)}%,${b.toFixed(2)}%{opacity:1}${Math.min(c, 100).toFixed(2)}%,100%{opacity:0}`}}\n`;
    body += `<rect x="${tx[s]}" y="34" width="${tw[s]}" height="22" rx="11" fill="${t.accent}" fill-opacity=".14" stroke="${t.accent}" stroke-opacity=".35" class="s${s}"/>`;
    body += `<g class="s${s}">` + lines.map(([m, txt], i) => {
      const y = 82 + i * 28, col = m === '+' ? t.add : m === '-' ? t.del : null;
      return (col ? `<rect x="32" y="${y - 16}" width="536" height="23" rx="4" fill="${col}" opacity=".14"/>` : '') +
        `<text x="44" y="${y}" class="mono" font-size="13" fill="${col || t.soft}">${m}</text><text x="66" y="${y}" class="mono" font-size="13" fill="${col || t.ink}"${m === '-' ? ' text-decoration="line-through"' : ''}>${esc(txt)}</text>`;
    }).join('') + '</g>';
  });
  body = tabs.map((n, i) => `<text x="${tx[i] + tw[i] / 2}" y="49" text-anchor="middle" class="mono ink" font-size="11">${n}</text>`).join('') + body;
  return { css: css.replace(/opacity:(\d)/, 'opacity:$1'), body };
}

function artPlan(t) {
  const walls = ['M40 40 H400 V210 H40 Z', 'M170 40 V210', 'M290 125 V210', 'M170 125 H400'];
  const doors = [{ h: [170, 62], a: 0 }, { h: [205, 125], a: -90 }, { h: [80, 210], a: -90 }, { h: [290, 150], a: 180 }, { h: [340, 125], a: 90 }, { h: [400, 170], a: 180 }];
  const r = 22, rad = (d) => (d * Math.PI) / 180, P = (h, d) => [h[0] + r * Math.cos(rad(d)), h[1] + r * Math.sin(rad(d))].map((v) => +v.toFixed(1));
  let css = `.scan{animation:scan 6s linear infinite}@keyframes scan{0%{transform:translateX(0);opacity:.9}60%{transform:translateX(360px);opacity:.9}62%,100%{transform:translateX(360px);opacity:0}}`;
  let grid = '';
  for (let x = 40; x <= 560; x += 20) grid += `<path d="M${x} 28 V226" stroke="${t.grid}" stroke-width="1"/>`;
  for (let y = 40; y <= 220; y += 20) grid += `<path d="M28 ${y} H572" stroke="${t.grid}" stroke-width="1"/>`;
  let body = grid + walls.map((d) => `<path d="${d}" fill="none" stroke="${t.ink}" stroke-width="3.2" stroke-linejoin="round"/>`).join('');
  doors.forEach((dr, i) => {
    const L = P(dr.h, dr.a), A = P(dr.h, dr.a + 90), g = P(dr.h, dr.a + 90);
    const p = (((Math.min(L[0], A[0], dr.h[0]) - 40) / 360) * 60).toFixed(1), q = (+p + 6).toFixed(1);
    css += `.d${i}{stroke-dasharray:1;stroke-dashoffset:0;animation:d${i} 6s infinite}@keyframes d${i}{0%,${p}%{stroke-dashoffset:1}${q}%,92%{stroke-dashoffset:0}98%,100%{stroke-dashoffset:1}}
.k${i}{animation:k${i} 6s infinite}@keyframes k${i}{0%,${p}%{opacity:0}${q}%,92%{opacity:1}98%,100%{opacity:0}}`;
    const cx = (dr.h[0] + L[0] + A[0]) / 3, cy = (dr.h[1] + L[1] + A[1]) / 3;
    body += `<path d="M${dr.h[0]} ${dr.h[1]} L${g[0]} ${g[1]}" stroke="${t.panel}" stroke-width="6"/>
<path d="M${dr.h[0]} ${dr.h[1]} L${L[0]} ${L[1]} A${r} ${r} 0 0 1 ${A[0]} ${A[1]}" pathLength="1" fill="none" stroke="${t.accent}" stroke-width="2.6" stroke-linecap="round" class="d${i}"/>
<rect x="${(cx - 19).toFixed(1)}" y="${(cy - 19).toFixed(1)}" width="38" height="38" rx="4" fill="none" stroke="${t.accent}" stroke-dasharray="3 3" class="k${i}"/>`;
  });
  body += `<g class="scan"><rect x="38" y="30" width="3" height="194" fill="${t.accent}" opacity=".7"/></g>
<text x="436" y="62" class="mono soft" font-size="10" letter-spacing=".1em">SHEET DETECTIONS</text>
<text x="434" y="104" class="serif ink" font-size="40">168</text>
<text x="436" y="140" class="mono soft" font-size="10" letter-spacing=".1em">PROJECT DOORS</text>
<text x="434" y="182" class="serif acc" font-size="40">95</text>
<text x="436" y="210" class="mono soft" font-size="10" letter-spacing=".1em">~23 S · NO OCR</text>`;
  return { css, body };
}

function artTimer(t) {
  const cx = 112, cy = 128, R = 64, fs = 22, cw = fs * 0.6, start = cx - (cw * 8) / 2;
  let css = `.ring{animation:ring 10s linear infinite}@keyframes ring{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.dg{opacity:0;animation:dg 10s infinite}@keyframes dg{0%,9.9%{opacity:1}10%,100%{opacity:0}}
.dz{animation:dz 3s ease-in-out infinite}@keyframes dz{0%,100%{opacity:1}50%{opacity:.45}}`;
  let digits = '';
  for (let i = 0; i < 10; i++) { css += `.g${i}{animation-delay:${i - 10}s}`; digits += `<text x="${(start + cw * 7).toFixed(1)}" y="${cy + 8}" class="mono ink dg g${i}" font-size="${fs}">${i}</text>`; }
  const laps = [['LAP 1', '18:22', ''], ['LAP 2', '11:47', '★'], ['LAP 3', '12:04', '']];
  let body = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${t.line}" stroke-width="8"/>
<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${t.accent}" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1" class="ring" transform="rotate(-90 ${cx} ${cy})"/>
<text x="${start.toFixed(1)}" y="${cy + 8}" class="mono ink" font-size="${fs}">00:42:1</text>${digits}
<text x="${cx}" y="${cy + 30}" text-anchor="middle" class="mono soft" font-size="10" letter-spacing=".14em">FOCUS</text>`;
  laps.forEach(([a, b, c], i) => {
    const y = 64 + i * 30;
    body += `<text x="214" y="${y}" class="mono soft" font-size="12">${a}</text><text x="290" y="${y}" class="mono ink" font-size="12">${b}</text><text x="350" y="${y}" class="mono acc" font-size="12">${c}</text><path d="M214 ${y + 10} H370" stroke="${t.line}"/>`;
  });
  body += `<g class="dz"><rect x="212" y="148" width="158" height="24" rx="12" fill="${t.warn}" opacity=".16"/><text x="291" y="164" text-anchor="middle" class="mono" font-size="11" fill="${t.warn}" letter-spacing=".06em">DISTRACTED 04:10</text></g>`;
  const keys = ['SPACE', 'L', 'F', 'D'];
  let kx = 212;
  keys.forEach((k) => { const w = k.length * 7.2 + 16; body += `<rect x="${kx}" y="188" width="${w}" height="22" rx="5" fill="none" stroke="${t.line}" stroke-width="1.5"/><text x="${kx + w / 2}" y="203" text-anchor="middle" class="mono soft" font-size="10.5">${k}</text>`; kx += w + 8; });
  // deterministic heatmap
  let seed = 7; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  body += `<text x="412" y="48" class="mono soft" font-size="10" letter-spacing=".1em">LAST 12 WEEKS</text>`;
  for (let c = 0; c < 10; c++) for (let r = 0; r < 7; r++) {
    const v = rnd(), lvl = c > 7 ? Math.ceil(v * 4) : Math.floor(v * 5);
    body += `<rect x="${412 + c * 15}" y="${62 + r * 15}" width="12" height="12" rx="2.5" fill="${lvl ? t.accent : t.line}" opacity="${lvl ? [0, 0.3, 0.5, 0.75, 1][lvl] : 0.7}"/>`;
  }
  body += `<text x="412" y="190" class="mono soft" font-size="10" letter-spacing=".1em">STREAK</text><text x="412" y="212" class="serif ink" font-size="22">19 days</text>`;
  return { css, body };
}

const CARDS = {
  infraforge: { title: 'InfraForge', desc: ['Design a system, run it under load and faults,', 'and watch where (and why) it breaks.'], stack: 'REACT · BUN · POSTGRESQL · REDIS · BULLMQ · WEBSOCKETS', tag: 'LIVE · INFRAFORGE.LAPWORK.IN', art: artInfra, alt: 'InfraForge: a load balancer routing traffic around a failed API node. A system-design simulator built with React, Bun, PostgreSQL and Redis.' },
  allrecipes: { title: 'Allrecipes Tweaks', desc: ["Every reviewer's change to a recipe as a", 'GitHub-style diff. Invented edits are dropped.'], stack: 'REACT · BUN · PRISMA · POSTGRESQL · GEMINI', tag: 'BUILT IN 12 HOURS', art: artDiff, alt: 'Allrecipes Tweaks: recipe changes from reviews shown as GitHub-style diffs, extracted with Gemini.' },
  floorplan: { title: 'Door detector', desc: ['Counts doors in CAD floor plans straight from', 'vector PDFs, with arc fitting instead of OCR.'], stack: 'PYTHON · PYMUPDF · NUMPY · GEOMETRY', tag: 'VECTOR PDF · NO OCR', art: artPlan, alt: 'Door detector: a floor plan being scanned, door swings detected; 168 sheet detections reconciled to 95 project doors.' },
  lapwork: { title: 'lapwork for Windows', desc: ['A keyboard-driven focus timer with distraction', 'tracking, a floating mini window and analytics.'], stack: 'ELECTRON · REACT · SQLITE · OFFLINE-FIRST', tag: 'START-UP 3.4 S → 1.2 S', art: artTimer, alt: 'lapwork for Windows: a focus stopwatch with laps, distraction tracking, keyboard shortcuts and a heatmap.' },
};
// The lapwork card's heatmap and streak are illustrative UI, like a screenshot of the app.

// ---------- live data ----------
const cachePath = 'data/stats.json';
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, 'utf8')) : {};
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

async function gql(query, variables) {
  const r = await fetch('https://api.github.com/graphql', { method: 'POST', headers: { Authorization: `bearer ${TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': USER }, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(JSON.stringify(j.errors)); return j.data;
}
async function tryIt(name, fn) { try { return await fn(); } catch (e) { console.warn(`[${name}] using cached value: ${e.message.slice(0, 160)}`); return undefined; } }

async function liveData() {
  const d = { ...cache };
  if (TOKEN) {
    const gh = await tryIt('github', () => gql(`query($u:String!){user(login:$u){
      contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount}}}}
      repositories(first:12,ownerAffiliations:OWNER,privacy:PUBLIC,orderBy:{field:PUSHED_AT,direction:DESC}){nodes{name isArchived
        defaultBranchRef{target{... on Commit{history(first:1){nodes{messageHeadline committedDate}}}}}}}}}`, { u: USER }));
    if (gh) {
      const cal = gh.user.contributionsCollection.contributionCalendar;
      d.total = cal.totalContributions;
      d.days = cal.weeks.flatMap((w) => w.contributionDays.map((x) => [x.date, x.contributionCount]));
      d.recent = gh.user.repositories.nodes.filter((r) => !r.isArchived && r.name.toLowerCase() !== USER)
        .map((r) => ({ repo: r.name, ...(r.defaultBranchRef?.target?.history?.nodes?.[0] ?? {}) })).filter((r) => r.committedDate).slice(0, 4);
    }
  } else console.warn('[github] no GITHUB_TOKEN; using cached contribution data');
  const lc = await tryIt('leetcode', async () => {
    const r = await fetch('https://leetcode.com/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com', 'User-Agent': 'Mozilla/5.0' },
      body: JSON.stringify({ query: 'query($u:String!){matchedUser(username:$u){submitStatsGlobal{acSubmissionNum{difficulty count}}} userContestRanking(username:$u){rating topPercentage attendedContestsCount} userContestRankingHistory(username:$u){attended rating contest{startTime}}}', variables: { u: LEETCODE } }) });
    const j = (await r.json()).data, by = (k) => j.matchedUser.submitStatsGlobal.acSubmissionNum.find((x) => x.difficulty === k).count;
    return {
      solved: by('All'), easy: by('Easy'), medium: by('Medium'), hard: by('Hard'),
      rating: Math.round(j.userContestRanking?.rating ?? 0), top: j.userContestRanking?.topPercentage, contests: j.userContestRanking?.attendedContestsCount,
      history: (j.userContestRankingHistory ?? []).filter((x) => x.attended).map((x) => [new Date(x.contest.startTime * 1000).toISOString().slice(0, 10), Math.round(x.rating)]),
    };
  });
  if (lc?.solved) d.leetcode = lc;
  const ac = await tryIt('atcoder', async () => {
    const h = (await (await fetch(`https://atcoder.jp/users/${ATCODER}/history/json`)).json()).filter((x) => x.IsRated);
    return h.length ? { rating: h[h.length - 1].NewRating, history: h.map((x) => [x.EndTime.slice(0, 10), x.NewRating]) } : undefined;
  });
  if (ac) { d.atcoder = ac.rating; d.atcoderHistory = ac.history; }
  delete d.codeforces;
  d.leetcode ??= { solved: 785, rating: 1655 }; d.atcoder ??= 1239;
  d.updated = new Date().toISOString().slice(0, 10);
  return d;
}

function streaks(days) {
  const today = new Date().toISOString().slice(0, 10);
  const counts = days.filter(([dt]) => dt <= today).map(([, c]) => c);
  let longest = 0, run = 0; for (const c of counts) { run = c ? run + 1 : 0; longest = Math.max(longest, run); }
  let cur = 0, i = counts.length - 1; if (i >= 0 && counts[i] === 0) i--; // today not done yet is fine
  for (; i >= 0 && counts[i] > 0; i--) cur++;
  const best = days.reduce((a, b) => (b[1] > a[1] ? b : a), ['', 0]);
  return { longest, cur, best };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDate = (iso) => { const d = new Date(iso); return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`; };

function live(t, d) {
  const days = d.days ?? [], weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  const max = Math.max(1, ...days.map((x) => x[1]));
  const lvl = (c) => (c === 0 ? 0 : Math.min(4, Math.ceil((c / max) * 4)));
  const X0 = 48, Y0 = 96, S = 14;
  let body = `<text x="48" y="58" class="lbl">LIVE · LAST 12 MONTHS ON GITHUB</text>
<text x="1152" y="58" text-anchor="end" class="lbl">REFRESHED DAILY · ${esc(d.updated ?? '')}</text>`;
  let lastMonth = -1;
  weeks.forEach((w, wi) => {
    w.forEach(([dt, c], di) => {
      const l = lvl(c);
      body += `<rect x="${X0 + wi * S}" y="${Y0 + di * S}" width="11" height="11" rx="2.5" fill="${l ? t.accent : t.line}" opacity="${l ? [0, 0.32, 0.55, 0.78, 1][l] : 0.65}"><title>${dt}: ${c}</title></rect>`;
    });
    const m = new Date(w[0][0]).getUTCMonth();
    if (m !== lastMonth && w[0][0].slice(8) <= '07') { if (wi < weeks.length - 2) body += `<text x="${X0 + wi * S}" y="${Y0 + 7 * S + 14}" class="mono soft" font-size="10">${MONTHS[m]}</text>`; lastMonth = m; }
  });
  const s = streaks(days);
  const stats = [[(d.total ?? 0).toLocaleString('en-US'), 'CONTRIBUTIONS'], [`${s.cur}d`, 'CURRENT STREAK'], [`${s.longest}d`, 'LONGEST STREAK'], [s.best[1] ? `${s.best[1]}` : '–', s.best[1] ? `BUSIEST DAY · ${fmtDate(s.best[0]).toUpperCase()}` : 'BUSIEST DAY']];
  stats.forEach(([v, l], i) => { body += `<text x="${48 + i * 186}" y="268" class="serif ink" font-size="38">${esc(v)}</text><text x="${50 + i * 186}" y="290" class="mono soft" font-size="10" letter-spacing=".1em">${esc(l)}</text>`; });
  body += `<path d="M818 84 V300" stroke="${t.line}"/><text x="846" y="100" class="lbl">RECENTLY PUSHED</text>`;
  (d.recent ?? []).forEach((r, i) => {
    const y = 134 + i * 46;
    body += `<text x="846" y="${y}" class="sans ink" font-size="15" font-weight="600">${esc(trunc(r.repo, 26))}</text>
<text x="1152" y="${y}" text-anchor="end" class="mono soft" font-size="11">${esc(fmtDate(r.committedDate))}</text>
<text x="846" y="${y + 19}" class="sans soft" font-size="13">${esc(trunc(r.messageHeadline ?? '', 44))}</text>`;
  });
  body += `<path d="M48 322 H1152" stroke="${t.line}"/>
<text x="48" y="352" class="mono soft" font-size="12" letter-spacing=".06em">LEETCODE <tspan class="ink">${d.leetcode.rating}</tspan> · <tspan class="ink">${d.leetcode.solved}</tspan> SOLVED<tspan dx="28">ATCODER </tspan><tspan class="ink">${d.atcoder}</tspan></text>
<text x="1152" y="352" text-anchor="end" class="mono soft" font-size="11">built by scripts/build.mjs</text>`;
  return svg({ w: 1200, h: 380, t, fonts: ['serif', 'sans', 'sansBold', 'mono'], title: `GitHub activity: ${d.total ?? 0} contributions in the last 12 months, current streak ${s.cur} days, longest ${s.longest} days. LeetCode ${d.leetcode.rating}, AtCoder ${d.atcoder}.`, body });
}

// ---------- shared pieces for the deeper sections ----------
const panel = (t, x, y, w, h, r = 18) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${t.panel}" filter="url(#puff)"/>
<rect x="${x + 7}" y="${y + 7}" width="${w - 14}" height="${h - 14}" rx="${r - 5}" fill="none" stroke="${t.stitch}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
const badge = (t, x, y, n) => `<circle cx="${x}" cy="${y}" r="10" fill="${t.accent}"/><text x="${x}" y="${y + 4}" text-anchor="middle" class="mono" font-size="11" fill="${t.panel}">${n}</text>`;
const nbox = (t, x, y, w, title, sub, hot = false) => `<rect x="${x}" y="${y}" width="${w}" height="60" rx="12" fill="${t.node}" stroke="${hot ? t.accent : t.line}" stroke-width="${hot ? 2 : 1.5}"/>
<text x="${x + 16}" y="${y + 26}" class="sans ink" font-size="15" font-weight="600">${esc(title)}</text>
<text x="${x + 16}" y="${y + 45}" class="mono soft" font-size="10.5">${esc(sub)}</text>`;
const MON = (iso) => `${MONTHS[+iso.slice(5, 7) - 1]} ${iso.slice(0, 4)}`;

// ---------- InfraForge architecture ----------
function architecture(t) {
  const W = 1200, H = 600;
  const edge = (d) => `<path d="${d}" fill="none" stroke="${t.line}" stroke-width="2"/>`;
  const flow = (path, dur, n, r = 3.8) => Array.from({ length: n }, (_, i) => `<circle r="${r}" fill="${t.accent}"><animateMotion dur="${dur}s" begin="${((dur / n) * i).toFixed(2)}s" repeatCount="indefinite" path="${path}"/></circle>`).join('');
  const steps = [
    'Design on the canvas. Model 2 runs in a Web Worker, so you watch it live.',
    'The API validates the run with Zod; run and outbox row share one transaction.',
    'BullMQ drives a 9-stage pipeline; a worker replays the run on the same engine.',
    'Snapshots reach the canvas through Redis Pub/Sub and WebSockets at 1 Hz.',
    "Only the server's replay is stored and scored, so a browser can't change it.",
    'Deterministic: same design, workload, seed and actions give the same result.',
  ];
  const body = `
<text x="48" y="60" class="lbl">INSIDE INFRAFORGE</text>
<text x="1152" y="60" text-anchor="end" class="lbl">HOW A RUN BECOMES AN OFFICIAL RESULT</text>
<text x="46" y="104" class="serif ink" font-size="30">The browser runs it live. The server replays it. <tspan class="acc">Only the replay counts.</tspan></text>
${panel(t, 48, 136, 262, 316)}
<text x="70" y="168" class="lbl" font-size="11">BROWSER</text>
${panel(t, 346, 136, 806, 316)}
<text x="368" y="168" class="lbl" font-size="11">SERVER · BUN + EXPRESS · 4 SERVICES</text>
${edge('M178 244 V264')}${edge('M178 324 V344')}
${edge('M288 214 C330 214 330 222 372 222')}${edge('M542 222 H574')}${edge('M744 222 H776')}${edge('M946 222 H978')}
${edge('M1053 252 V344')}${edge('M1010 252 C1010 300 870 296 861 344')}${edge('M776 374 H744')}${edge('M574 374 H288')}
<text x="430" y="366" class="mono soft" font-size="10" letter-spacing=".08em">1 HZ SNAPSHOTS</text>
${flow('M288 214 L372 222 L1053 222 L1053 374', 4.5, 3)}
${flow('M1053 222 L861 374 L288 374', 3.6, 3)}
${flow('M178 214 L178 374', 2.4, 2, 3.2)}
${nbox(t, 68, 184, 222, 'Canvas', 'React · dnd-kit · undo/redo')}
${nbox(t, 68, 264, 222, 'Model 2 engine', 'Web Worker · runs live')}
${nbox(t, 68, 344, 222, 'Live view', 'Zustand · per-node updates')}
${nbox(t, 372, 192, 170, 'API', 'Zod-validated runs')}
${nbox(t, 574, 192, 170, 'PostgreSQL', 'run + outbox, 1 txn')}
${nbox(t, 776, 192, 170, 'BullMQ', '9-stage pipeline')}
${nbox(t, 978, 192, 150, 'Worker', 'same engine, replay')}
${nbox(t, 574, 344, 170, 'WebSocket server', 'pushes to the canvas')}
${nbox(t, 776, 344, 170, 'Redis Pub/Sub', 'progress snapshots')}
${nbox(t, 978, 344, 150, 'Official record', 'the only score', true)}
${badge(t, 284, 186, 1)}${badge(t, 536, 194, 2)}${badge(t, 940, 194, 3)}${badge(t, 940, 346, 4)}${badge(t, 1122, 346, 5)}${badge(t, 284, 266, 6)}
${steps.map((s, i) => { const col = i < 3 ? 0 : 1, row = i % 3, x = col ? 620 : 48, y = 498 + row * 30; return `${badge(t, x + 10, y - 5, i + 1)}<text x="${x + 30}" y="${y}" class="sans soft" font-size="14">${esc(s)}</text>`; }).join('\n')}`;
  return svg({ w: W, h: H, t, fonts: ['serif', 'sans', 'sansBold', 'mono'], title: 'InfraForge architecture: the browser runs the simulation live in a Web Worker; the API stores the run with a transactional outbox; BullMQ drives a 9-stage pipeline where a worker replays the run on the same deterministic engine; snapshots stream back through Redis Pub/Sub and WebSockets at 1 Hz; only the server replay is the official score.', body });
}

// ---------- competitive programming ----------
function chart(t, { x, y, w, h, series, lo, hi, step, bands = [] }) {
  const cx = x + 24, cw = w - 48, cy = y + 74, ch = h - 118;
  const t0 = Date.parse(series[0][0]), t1 = Math.max(Date.parse(series[series.length - 1][0]), t0 + 1);
  const X = (d) => cx + ((Date.parse(d) - t0) / (t1 - t0)) * cw, Y = (v) => cy + ch - ((v - lo) / (hi - lo)) * ch;
  let g = '';
  bands.forEach(([a, b, col, name]) => {
    const ya = Y(Math.min(b, hi)), yb = Y(Math.max(a, lo));
    if (yb <= ya) return;
    g += `<rect x="${cx}" y="${ya.toFixed(1)}" width="${cw}" height="${(yb - ya).toFixed(1)}" fill="${col}" opacity="${t.bg === '#efece4' ? 0.09 : 0.14}"/><text x="${b > series[series.length - 1][1] && a <= series[series.length - 1][1] ? cx + 44 : cx + cw - 6}" y="${(yb - 6).toFixed(1)}"${b > series[series.length - 1][1] && a <= series[series.length - 1][1] ? '' : ' text-anchor="end"'} class="mono" font-size="9" letter-spacing=".1em" fill="${col}" opacity=".9">${name}</text>`;
  });
  for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) g += `<path d="M${cx} ${Y(v).toFixed(1)} H${cx + cw}" stroke="${t.line}" stroke-dasharray="2 4"/><text x="${cx}" y="${(Y(v) - 4).toFixed(1)}" class="mono soft" font-size="9.5">${v}</text>`;
  const pts = series.map(([d, v]) => [X(d), Y(v)]);
  const line = pts.map(([a, b], i) => `${i ? 'L' : 'M'}${a.toFixed(1)} ${b.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${cy + ch} L${pts[0][0].toFixed(1)} ${cy + ch} Z`;
  const [lx, ly] = pts[pts.length - 1];
  g += `<path d="${area}" fill="${t.accent}" fill-opacity=".12" class="cpa"/>
<path d="${line}" pathLength="1" fill="none" stroke="${t.accent}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="1" class="cpl"/>
${pts.map(([a, b]) => `<circle cx="${a.toFixed(1)}" cy="${b.toFixed(1)}" r="2.2" fill="${t.accent}" class="cpa"/>`).join('')}
<circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="9" fill="${t.accent}" opacity=".2" class="pulse"/><circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="4.5" fill="${t.accent}"/>
<text x="${cx}" y="${cy + ch + 20}" class="mono soft" font-size="10">${MON(series[0][0]).toUpperCase()}</text>
<text x="${cx + cw}" y="${cy + ch + 20}" text-anchor="end" class="mono soft" font-size="10">${MON(series[series.length - 1][0]).toUpperCase()}</text>`;
  return g;
}

function cp(t, d) {
  const lc = d.leetcode, lcH = lc.history?.length ? lc.history : [[d.updated, lc.rating]];
  const acH = d.atcoderHistory?.length ? d.atcoderHistory : [[d.updated, d.atcoder]];
  const tier = (r) => (r >= 1600 ? 'BLUE' : r >= 1200 ? 'CYAN' : r >= 800 ? 'GREEN' : r >= 400 ? 'BROWN' : 'GRAY');
  const lcVals = lcH.map((x) => x[1]), lcLo = Math.floor((Math.min(...lcVals) - 60) / 100) * 100, lcHi = Math.ceil((Math.max(...lcVals) + 60) / 100) * 100;
  const acHi = Math.max(1400, Math.ceil((Math.max(...acH.map((x) => x[1])) + 150) / 400) * 400);
  const head = (x, name, rating, sub) => `<text x="${x + 24}" y="${126}" class="sans ink" font-size="17" font-weight="600">${name}</text>
<text x="${x + 508}" y="${130}" text-anchor="end" class="serif ink" font-size="38">${rating}</text>
<text x="${x + 508}" y="${150}" text-anchor="end" class="mono soft" font-size="10" letter-spacing=".1em">${esc(sub)}</text>`;
  const tot = lc.easy + lc.medium + lc.hard || 1, bw = 532, segs = [[lc.easy, t.add, 'EASY'], [lc.medium, '#e0a53a', 'MEDIUM'], [lc.hard, t.warn, 'HARD']];
  let bx = 48, bar = '';
  segs.forEach(([n, c]) => { const w = (n / tot) * bw; bar += `<rect x="${bx.toFixed(1)}" y="486" width="${Math.max(w - 2, 1).toFixed(1)}" height="10" rx="5" fill="${c}"/>`; bx += w; });
  const body = `
<text x="48" y="60" class="lbl">COMPETITIVE PROGRAMMING · RATING HISTORY</text>
<text x="1152" y="60" text-anchor="end" class="lbl">REFRESHED DAILY · ${esc(d.updated)}</text>
${panel(t, 48, 88, 532, 340)}${panel(t, 620, 88, 532, 340)}
${head(48, 'LeetCode', lc.rating, `${lc.top ? `TOP ${lc.top}% · ` : ''}${lc.contests ?? lcH.length} CONTESTS`)}
${head(620, 'AtCoder', d.atcoder, `${tier(d.atcoder)} · ${acH.length} RATED CONTESTS`)}
${chart(t, { x: 48, y: 120, w: 532, h: 300, series: lcH, lo: lcLo, hi: lcHi, step: 100 })}
${chart(t, { x: 620, y: 120, w: 532, h: 300, series: acH, lo: 0, hi: acHi, step: 400, bands: [[0, 400, '#808080', 'GRAY'], [400, 800, '#804000', 'BROWN'], [800, 1200, '#008000', 'GREEN'], [1200, 1600, '#00c0c0', 'CYAN'], [1600, 2000, '#0000ff', 'BLUE']] })}
<text x="48" y="472" class="mono soft" font-size="11" letter-spacing=".08em"><tspan class="ink">${lc.solved}</tspan> LEETCODE PROBLEMS SOLVED</text>
${bar}
<text x="48" y="520" class="mono soft" font-size="10.5" letter-spacing=".06em">${segs.map(([n, c, l]) => `<tspan fill="${c}">●</tspan> ${n} ${l}`).join('   ')}</text>
<text x="620" y="472" class="mono soft" font-size="11" letter-spacing=".08em">DAILY PRACTICE</text>
<text x="620" y="500" class="sans ink" font-size="15">Contest problems in C++, solved and kept in</text>
<text x="620" y="521" class="sans acc" font-size="15" font-weight="600">github.com/binaryrishabh/C-4-DSA</text>`;
  return svg({ w: 1200, h: 556, t, fonts: ['serif', 'sans', 'sansBold', 'mono'], title: `Competitive programming: LeetCode rating ${lc.rating}${lc.top ? `, top ${lc.top}%` : ''}, ${lc.solved} problems solved; AtCoder rating ${d.atcoder} (${tier(d.atcoder).toLowerCase()}) over ${acH.length} rated contests.`,
    css: `.cpl{stroke-dashoffset:0;animation:cpl 10s cubic-bezier(.22,1,.36,1) infinite}@keyframes cpl{0%{stroke-dashoffset:1}30%,92%{stroke-dashoffset:0}100%{stroke-dashoffset:0}}
.cpa{animation:cpa 10s infinite}@keyframes cpa{0%,12%{opacity:0}32%,100%{opacity:1}}
.pulse{animation:pulse 2.4s ease-in-out infinite}@keyframes pulse{0%,100%{opacity:.25}50%{opacity:.05}}`, body });
}

// ---------- toolbox ----------
function toolbox(t) {
  const core = new Set(['TypeScript', 'Bun', 'PostgreSQL', 'Redis', 'React']);
  const groups = [
    ['LANGUAGES', ['TypeScript', 'JavaScript', 'Python', 'SQL', 'C++', 'Java', 'Rust']],
    ['BACKEND', ['Node.js', 'Bun', 'Express', 'WebSockets', 'BullMQ', 'Zod', 'Prisma']],
    ['FRONTEND & DESKTOP', ['React', 'Next.js', 'Electron', 'Zustand', 'Tailwind', 'Vite']],
    ['DATA', ['PostgreSQL', 'SQLite', 'Redis', 'PyMuPDF', 'NumPy']],
    ['INFRA', ['Docker', 'Nginx', 'AWS EC2', 'GitHub Actions', 'Vercel', 'Cloudflare']],
  ];
  let y = 104, body = `<text x="32" y="56" class="lbl">TOOLBOX</text><text x="568" y="56" text-anchor="end" class="mono soft" font-size="10.5" letter-spacing=".1em"><tspan class="acc">●</tspan> DAILY DRIVERS</text>`;
  for (const [name, items] of groups) {
    body += `<text x="32" y="${y}" class="mono soft" font-size="10" letter-spacing=".12em">${esc(name)}</text>`;
    let x = 32; y += 12;
    for (const it of items) {
      const w = Math.round(it.length * 7.1 + 24);
      if (x + w > 568) { x = 32; y += 34; }
      const hot = core.has(it);
      body += `<rect x="${x}" y="${y}" width="${w}" height="26" rx="13" fill="${hot ? t.accent : t.node}" stroke="${hot ? t.accent : t.line}" stroke-width="1.5"/><text x="${x + w / 2}" y="${y + 17.5}" text-anchor="middle" class="sans" font-size="13" font-weight="${hot ? 600 : 400}" fill="${hot ? t.panel : t.ink}">${esc(it)}</text>`;
      x += w + 8;
    }
    y += 58;
  }
  if (y - 30 > 480) throw new Error(`toolbox overflows: ${y}`);
  return svg({ w: 600, h: 500, t, fonts: ['sans', 'sansBold', 'mono'], title: 'Toolbox: TypeScript, Bun, PostgreSQL, Redis and React daily; also JavaScript, Python, SQL, C++, Java, Rust, Node.js, Express, WebSockets, BullMQ, Zod, Prisma, Next.js, Electron, Zustand, Tailwind, Vite, SQLite, PyMuPDF, NumPy, Docker, Nginx, AWS EC2, GitHub Actions, Vercel, Cloudflare.', body });
}

// ---------- timeline ----------
function timeline(t, d) {
  const items = [
    [new Date().toISOString().slice(0, 10) < '2026-11-06' ? 'NEXT · 6 NOV 2026' : '6 NOV 2026', 'InfraForge public launch', 'The system-design simulator, built since August.', new Date().toISOString().slice(0, 10) < '2026-12-06'],
    ['SEP 2026', 'Door detector · work trial', 'For a US construction-tech startup.'],
    ['SEP 2026', 'Allrecipes Tweaks', 'From idea to production in 12 hours.'],
    ['JUN 2026', 'Started rated contests', `AtCoder ${d.atcoder} · LeetCode ${d.leetcode.rating} so far.`],
    ['JAN 2026', 'Software Engineer, lapwork', 'Offline-first Windows app. Start-up 65% faster.'],
    ['EDUCATION', 'B.Tech, Information Technology', 'Kalinga Institute of Industrial Technology (KIIT)'],
  ];
  let body = `<text x="32" y="56" class="lbl">TIMELINE</text><path d="M44 86 V448" stroke="${t.line}" stroke-width="2"/>`;
  items.forEach(([date, title, sub, now], i) => {
    const y = 94 + i * 66;
    body += (now ? `<circle cx="44" cy="${y}" r="11" fill="${t.accent}" opacity=".22" class="pulse"/>` : '') +
      `<circle cx="44" cy="${y}" r="5.5" fill="${now ? t.accent : t.panel}" stroke="${now ? t.accent : t.soft}" stroke-width="2"/>
<text x="70" y="${y + 4}" class="mono ${now ? 'acc' : 'soft'}" font-size="10.5" letter-spacing=".1em">${esc(date)}</text>
<text x="70" y="${y + 26}" class="sans ink" font-size="16" font-weight="600">${esc(title)}</text>
<text x="70" y="${y + 45}" class="sans soft" font-size="13.5">${esc(sub)}</text>`;
  });
  return svg({ w: 600, h: 500, t, fonts: ['sans', 'sansBold', 'mono'], title: 'Timeline: InfraForge launches 6 Nov 2026; Sep 2026 door detector work trial and Allrecipes Tweaks; Jun 2026 started rated contests; Jan 2026 joined lapwork as a software engineer; B.Tech IT at KIIT.',
    css: `.pulse{animation:pulse 2.4s ease-in-out infinite}@keyframes pulse{0%,100%{opacity:.25}50%{opacity:.04}}`, body });
}

// ---------- footer ----------
function footer(t) {
  const body = `
<text x="48" y="64" class="lbl">CONTACT</text>
<text x="44" y="138" class="serif ink" font-size="64">Got something <tspan class="acc">slow?</tspan></text>
<text x="48" y="178" class="sans soft" font-size="18">The quickest way to reach me is email.</text>
<rect x="716" y="92" width="436" height="56" rx="28" fill="${t.accent}" filter="url(#puff)"/>
<text x="912" y="126" text-anchor="middle" class="mono" font-size="15.5" fill="${t.panel}">srivastavarishabh2001@gmail.com</text>
<text x="1118" y="127" text-anchor="middle" class="sans nudge" font-size="20" fill="${t.panel}">→</text>
<text x="1152" y="182" text-anchor="end" class="mono soft" font-size="10.5" letter-spacing=".1em">INDIA (IST) · OPEN TO REMOTE, OR ONSITE ANYWHERE IN INDIA</text>`;
  return svg({ w: 1200, h: 230, t, fonts: ['serif', 'sans', 'mono'], title: 'Got something slow? Email srivastavarishabh2001@gmail.com. India (IST), open to remote or onsite anywhere in India.',
    css: `.nudge{animation:nudge 1.8s ease-in-out infinite}@keyframes nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}`, body });
}

// ---------- write ----------
mkdirSync('assets/cards', { recursive: true });
mkdirSync('data', { recursive: true });
const data = await liveData();
writeFileSync(cachePath, JSON.stringify(data, null, 1) + '\n');
for (const [name, t] of Object.entries(THEMES)) {
  writeFileSync(`assets/hero-${name}.svg`, hero(t));
  for (const [k, c] of Object.entries(CARDS)) writeFileSync(`assets/cards/${k}-${name}.svg`, card(t, c));
  writeFileSync(`assets/live-${name}.svg`, live(t, data));
  writeFileSync(`assets/architecture-${name}.svg`, architecture(t));
  writeFileSync(`assets/cp-${name}.svg`, cp(t, data));
  writeFileSync(`assets/toolbox-${name}.svg`, toolbox(t));
  writeFileSync(`assets/timeline-${name}.svg`, timeline(t, data));
  writeFileSync(`assets/footer-${name}.svg`, footer(t));
}
console.log('built', Object.keys(CARDS).length * 2 + 14, 'images; live data from', data.updated);
