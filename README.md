# OVHcloud — Public Cloud — Core Associate

Source-of-truth repository for the **OVHcloud — Public Cloud — Core Associate** certification training content.

> **Status:** Phase 2 — Module Content Production in progress. Module roster managed in [`modules.json`](./modules.json).

---

## What this repo is

A docs-as-code training content platform: every slide, every trainer note, every lab artefact is plain Markdown, version-controlled, peer-reviewed via Pull Requests, and continuously built into the deliverables (HTML presentation, learner PDF, trainer PDF).

The pedagogical content lives under `modules/`, the visual identity (OVHcloud theme) lives under `theme-ovhcloud/`, the build/deploy pipeline lives under `.github/workflows/`, and the module registry (which modules to build & publish) is declared in `modules.json` at the repo root.

## Why this approach

Traditional PowerPoint-based training content becomes stale the moment a service evolves — and OVHcloud ships new services every week. With docs-as-code:

- **Single source of truth.** No more "which version of the deck is the right one?".
- **Reviewable changes.** A typo fix, a price update, a new service addition — all go through a PR with a clear diff.
- **Automatic regeneration.** Merge to `main` → fresh PDF + HTML deployed within minutes.
- **AI-ready.** Clean Markdown with structured frontmatter is the ideal substrate for RAG-based on-demand content generation later.

## Tech stack

| Layer | Tool | Purpose |
|---|---|---|
| Authoring | Markdown + frontmatter | One file per module |
| Presentation engine | [Slidev](https://sli.dev) | MIT, Vue-based, Markdown-first |
| Diagrams | Mermaid (built-in) + Excalidraw | Versionable diagrams |
| Brand & design tokens | [@ovhcloud/ods-themes](https://ovh.github.io/design-system/latest/?path=/docs/ovhcloud-design-system-get-started--docs) | Official OVHcloud Design System (CSS layer only — no React dependency) |
| Brand typography | Source Sans Pro (OFL) | Official OVHcloud typeface, embedded locally |
| Module registry | `modules.json` | Declares which modules are built & listed on the landing page |
| Versioning | Git + GitHub | Branches, PRs, code review |
| CI/CD | GitHub Actions (matrix build per module) | Build HTML + PDF on every merge |
| Hosting | GitHub Pages | Static site hosting for the HTML version |
| PDF generation | Playwright Chromium | Headless render to PDF |

## Repo layout

```
.
├── modules.json                          # Module registry (consumed by CI & landing)
├── modules/                              # One folder per module
│   ├── module-1-1-cloud-foundations/
│   │   ├── slides.md                     # The presentation source (Slidev format)
│   │   ├── trainer-notes.md              # Long-form trainer FAQ
│   │   ├── lab/                          # Lab handouts and artefacts
│   │   ├── assets/                       # Module-specific images
│   │   └── components/                   # Module-specific Vue components (if any)
│   └── module-1-2-pci-foundation-iam/
│       └── slides.md
├── theme-ovhcloud/                       # Shared OVHcloud visual theme
│   ├── assets/                           # Logos (master logo color + white)
│   ├── fonts/                            # Source Sans Pro .otf files
│   ├── layouts/                          # Slide layouts (cover, two-cols, section, default)
│   ├── components/                       # Vue components
│   │   ├── OvhNotice.vue                 # Info callout (blue, "i" icon)
│   │   ├── OvhWarning.vue                # Warning callout (amber, triangle icon)
│   │   ├── OvhCard.vue                   # Card link with arrow
│   │   └── OvhStep.vue                   # Numbered step item
│   ├── styles/index.css                  # Imports ODS + custom overrides
│   └── package.json
├── scripts/
│   └── build-index.mjs                   # Generates dist/index.html from modules.json
├── .github/workflows/
│   └── build-deploy.yml                  # Matrix build per module + Pages deploy
├── docs/                                 # Repo documentation
├── package.json
└── README.md
```

## Module registry: `modules.json`

`modules.json` is the single declarative source for which modules the CI builds and which appear on the landing page. Each module has a `status` of either `draft` or `published`:

- `draft` — slides may exist on a branch but the module is **not built** by CI and **not listed** on the landing page. Use this while content is being authored or reviewed.
- `published` — the module is built, exported to PDF, and listed on the landing page on every merge to `main`.

Adding a new module to the build is a two-line edit:

```json
{
  "id": "1.3",
  "slug": "module-1-3-compute-instances",
  "title": "Compute (Part 1) — Instances, Flavors & Deployment",
  "day": 1,
  "order": 3,
  "duration": "1h30",
  "status": "draft"
}
```

Flip `"status"` to `"published"` when the module is ready to ship.

## Local development

Prerequisites: **Node.js ≥ 20.12**, npm.

```bash
# Install dependencies (once)
npm install

# Launch a module in dev mode (hot reload)
npm run dev -- modules/module-1-1-cloud-foundations/slides.md

# Build the static HTML site for a module
npm run build -- modules/module-1-1-cloud-foundations/slides.md

# Export to PDF
npm run export -- modules/module-1-1-cloud-foundations/slides.md

# Generate the root landing page locally (for visual check)
node scripts/build-index.mjs --out dist
```

Once `npm run dev` is running, open `http://localhost:3030` in your browser. Edits to `slides.md` reload instantly. For presenter mode with trainer notes side-by-side, open `http://localhost:3030/presenter`.

## CI pipeline

The GitHub Actions workflow `build-deploy.yml` runs four jobs:

1. **`discover`** — reads `modules.json` and emits the list of `published` modules as a build matrix.
2. **`build-module`** — one parallel job per published module: HTML site build + learner PDF + trainer-notes PDF. Each module's output is uploaded as a separate artifact, downloadable from the PR / run page.
3. **`assemble`** (main branch only) — downloads every module artifact, generates the root `index.html` from `modules.json`, prepares the final `dist/` for Pages.
4. **`deploy`** (main branch only) — publishes `dist/` to GitHub Pages.

On a feature branch / PR: only `discover` and `build-module` run, producing downloadable artifacts. `assemble` and `deploy` are skipped — that is intentional, Pages is only updated on merge to `main`.

## Using the OVHcloud components in slides

The custom Vue components are available globally in any `slides.md`:

```markdown
<OvhNotice title="Pro tip">
This is an informational callout, styled like docs.ovhcloud.com.
</OvhNotice>

<OvhWarning title="Heads up">
This is a warning callout — use it for pitfalls or breaking changes.
</OvhWarning>

<OvhCard title="Getting started" href="https://...">
Click to read the introduction guide.
</OvhCard>

<OvhStep :step="1" title="Create the project">
Open the OVHcloud Manager and navigate to the Public Cloud universe.
</OvhStep>
```

> **Legacy pattern:** Modules 1.1 and 1.2 use `<div class="ovh-callout">` and `<div class="ovh-callout ovh-callout-warn">` instead of the Vue components above. This is an early-iteration carry-over and **must not be reproduced** in new modules. The Vue components are the supported pattern going forward.

## Brand integration

The theme is built on top of the official **OVHcloud Design System** (ODS) CSS layer. We consume `@ovhcloud/ods-themes/default/css` to inherit the official color tokens, spacing scale, and typography rules. Our slide-specific patterns (cover, footer, callouts inspired by docs.ovhcloud.com) sit as overrides on top.

The brand kit also includes:
- The official Source Sans Pro typeface (embedded under `theme-ovhcloud/fonts/`)
- The OVHcloud master logo in two variants (fullcolor for white backgrounds, white for blue backgrounds) under `theme-ovhcloud/assets/`

## Contributing

See [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md) for the authoring conventions, frontmatter rules, LO traceability requirements, brand compliance checklist, and the full PR workflow.

## License

Internal OVHcloud training material. Not for external distribution. The OVHcloud Design System and logos are property of OVH SAS and used under the brand guidelines for legitimate OVHcloud product enablement.
