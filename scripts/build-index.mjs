#!/usr/bin/env node
// scripts/build-index.mjs
// Generate dist/index.html (program landing page) from modules.json.
//
// Usage:
//   node scripts/build-index.mjs --out dist
//
// Behavior:
//   - Reads ./modules.json
//   - Lists only modules with status === "published"
//   - Groups them by day and orders them by `order`
//   - Outputs <out>/index.html

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");

// --- CLI args ---------------------------------------------------------------
const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
if (outIdx === -1 || !args[outIdx + 1]) {
  console.error("Usage: build-index.mjs --out <dist-dir>");
  process.exit(1);
}
const outDir = resolve(repoRoot, args[outIdx + 1]);

// --- Load modules.json ------------------------------------------------------
const manifestPath = resolve(repoRoot, "modules.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

const { program, modules } = manifest;
const published = modules
  .filter((m) => m.status === "published")
  .sort((a, b) => a.day - b.day || a.order - b.order);

// --- Group by day -----------------------------------------------------------
const byDay = new Map();
for (const m of published) {
  if (!byDay.has(m.day)) byDay.set(m.day, []);
  byDay.get(m.day).push(m);
}

// --- Render -----------------------------------------------------------------
const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);

const moduleHref = (m) => `module-${m.id.replace(".", "-")}/`;

const dayBlocks = [...byDay.entries()]
  .map(([day, mods]) => {
    const items = mods
      .map(
        (m) => `
        <li>
          <a href="${escape(moduleHref(m))}">
            <span class="badge">${escape(m.id)}</span>
            <span class="title">${escape(m.title)}</span>
            <span class="meta">${escape(m.duration)}</span>
          </a>
        </li>`
      )
      .join("");
    return `
      <section class="day">
        <h2>Day ${day}</h2>
        <ul>${items}
        </ul>
      </section>`;
  })
  .join("");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escape(program.name)}</title>
  <style>
    :root {
      --ovh-masterbrand-blue: #000E9C;
      --ovh-link-blue: #0050D7;
      --ovh-text: #1A1A1A;
      --ovh-muted: #8A8A8A;
      --ovh-border: #E5E5E5;
      --ovh-bg-soft: #F7F8FB;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 820px;
      margin: 3rem auto;
      padding: 0 1.5rem;
      color: var(--ovh-text);
      line-height: 1.55;
    }
    header { margin-bottom: 2.5rem; }
    h1 {
      color: var(--ovh-masterbrand-blue);
      border-bottom: 4px solid var(--ovh-masterbrand-blue);
      padding-bottom: 0.5rem;
      margin-bottom: 0.3rem;
      font-size: 1.9rem;
    }
    header p.tagline {
      color: var(--ovh-muted);
      margin: 0;
      font-size: 0.95rem;
    }
    section.day { margin-bottom: 2rem; }
    section.day h2 {
      color: var(--ovh-masterbrand-blue);
      font-size: 1.1rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 0.7rem;
    }
    ul { list-style: none; padding: 0; margin: 0; }
    li { border-bottom: 1px solid var(--ovh-border); }
    li:first-child { border-top: 1px solid var(--ovh-border); }
    li a {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.9rem 0.4rem;
      text-decoration: none;
      color: var(--ovh-text);
      transition: background-color 0.15s ease;
    }
    li a:hover { background-color: var(--ovh-bg-soft); }
    .badge {
      background: var(--ovh-masterbrand-blue);
      color: #fff;
      padding: 0.2rem 0.7rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
      flex: 0 0 auto;
    }
    .title {
      flex: 1 1 auto;
      color: var(--ovh-link-blue);
      font-weight: 600;
    }
    li a:hover .title { text-decoration: underline; }
    .meta {
      flex: 0 0 auto;
      color: var(--ovh-muted);
      font-size: 0.85rem;
    }
    footer {
      margin-top: 3.5rem;
      padding-top: 1.2rem;
      border-top: 1px solid var(--ovh-border);
      font-size: 0.8rem;
      color: var(--ovh-muted);
    }
  </style>
</head>
<body>
  <header>
    <h1>${escape(program.name)}</h1>
    <p class="tagline">${escape(program.tagline)}</p>
  </header>

  <main>${dayBlocks}
  </main>

  <footer>
    Generated build · ${new Date().toISOString().slice(0, 10)} · ${published.length} module${published.length > 1 ? "s" : ""} published
  </footer>
</body>
</html>
`;

mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, "index.html");
writeFileSync(outPath, html, "utf-8");
console.log(`✓ Generated ${outPath} with ${published.length} published module(s)`);
