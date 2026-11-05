### Hi, I'm Rishabh. I make slow software fast.

I'm a full-stack engineer at [lapwork](https://lapwork.in), where I build an offline-first Windows app with Electron, React and SQLite. I work across backends, LLM pipelines and the apps on top of them, mostly in TypeScript, Bun, PostgreSQL and Redis. I measure before I change anything, and I keep the numbers.

**Now:** launching **[InfraForge](https://infraforge.lapwork.in)** on 6 November 2026. You design a system, run it under load and faults, and watch where and why it breaks.

<samp>
<a href="https://whoami-seven-phi.vercel.app">portfolio</a> ·
<a href="https://whoami-seven-phi.vercel.app/world/">3d world</a> ·
<a href="https://www.linkedin.com/in/binaryrishabh">linkedin</a> ·
<a href="https://leetcode.com/u/binaryrishabh/">leetcode</a> ·
<a href="mailto:srivastavarishabh2001@gmail.com">email</a>
</samp>

#### Before → after

| What | Before | After | How |
|---|---|---|---|
| lapwork app start-up | 3.4 s | **1.2 s** | code splitting, lazy loading |
| lapwork SQLite query | 150 ms | **20 ms** | prepared statements, data-layer rework |
| Doors in a CAD plan set | 168 detections | **95 real doors** | cross-sheet reconciliation, ~23 s per set |

#### Things I've built

- **[InfraForge](https://github.com/binaryrishabh/InfraForge)**: a system-design simulator. A deterministic engine models capacity, cost and failure for 11 cloud resource types. The browser runs each simulation live and the server replays it to produce the official result. Built with React, Bun, PostgreSQL, Redis, BullMQ and WebSockets.
- **[Allrecipes Tweaks](https://github.com/binaryrishabh/PlankRecipe)**: paste a recipe link and see every reviewer's change as a GitHub-style diff. Gemini extracts the edits, and any edit that doesn't match a real line of the recipe is dropped. It went from start to production in 12 hours. [Live →](https://allrecipes.lapwork.in)
- **[Floor-plan door detector](https://github.com/binaryrishabh/floorplan_cv)**: counts doors in CAD floor plans by reading the vector PDF directly, with no OCR. It fits door-swing arcs, scales geometry to the drawing, and makes sure each door is counted only once across sheets.
- **[lapwork for Windows](https://github.com/binaryrishabh/lapwork_Windows)**: a keyboard-driven focus timer that tracks distractions, has an always-on-top mini window and shows analytics. Built with Electron and SQLite.
- **[whoami](https://github.com/binaryrishabh/whoami)**: my portfolio, built two ways. One is an editorial page with a live load-balancer toy you can break. The other is a 3D world of floating islands built with React Three Fiber.

#### Elsewhere

LeetCode 1655+ (785 solved) · AtCoder 1239+ · 400+ Codeforces problems · daily C++ practice in [C-4-DSA](https://github.com/binaryrishabh/C-4-DSA) · B.Tech IT, KIIT
