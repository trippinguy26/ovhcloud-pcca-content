# OVHcloud — Public Cloud — Core Associate

Source-of-truth repository for the **OVHcloud — Public Cloud — Core Associate** certification training content.

> **Status:** POC (Phase 2 — Module Content Production). Module 1.1 only.

---

## What this repo is

A docs-as-code training content platform: every slide, every trainer note, every lab artefact is plain Markdown, version-controlled, peer-reviewed via Pull Requests, and continuously built into the deliverables (HTML presentation, learner PDF, trainer PDF).

The pedagogical content lives under `modules/`, the visual identity (OVHcloud theme) lives under `theme-ovhcloud/`, and the build/deploy pipeline lives under `.github/workflows/`.

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
| Brand & design tokens | [@ovhcloud/ods-themes](https://ovh.github.io/design-system/) | Official OVHcloud Design System (CSS layer only — no React dependency) |
| Brand typography | Source Sans Pro (OFL) | Official OVHcloud typeface, embedded locally |
| Versioning | Git + GitHub | Branches, PRs, code review |
| CI/CD | GitHub Actions | Build HTML + PDF on every merge |
| Hosting | GitHub Pages | Static site hosting for the HTML version |
| PDF generation | Playwright Chromium | Headless render to PDF |

## Repo layout

```
.
├── modules/                              # One folder per module
│   └── module-1-1-cloud-foundations/
│       ├── slides.md                     # The presentation source (Slidev format)
│       ├── trainer-notes.md              # Long-form trainer FAQ
│       ├── lab/                          # Lab handouts and artefacts
│       ├── assets/                       # Module-specific images
│       └── components/                   # Module-specific Vue components (if any)
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
├── .github/workflows/                    # CI/CD pipelines
├── docs/                                 # Repo documentation (contribution guide, etc.)
├── package.json
└── README.md
```

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
```

Once `npm run dev` is running, open `http://localhost:3030` in your browser. Edits to `slides.md` reload instantly. For presenter mode with trainer notes side-by-side, open `http://localhost:3030/presenter`.

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

## Brand integration

The theme is built on top of the official **OVHcloud Design System** (ODS) CSS layer. We consume `@ovhcloud/ods-themes/default/css` to inherit the official color tokens, spacing scale, and typography rules. Our slide-specific patterns (cover, footer, callouts inspired by docs.ovhcloud.com) sit as overrides on top.

The brand kit also includes:
- The official Source Sans Pro typeface (embedded under `theme-ovhcloud/fonts/`)
- The OVHcloud master logo in two variants (fullcolor for white backgrounds, white for blue backgrounds) under `theme-ovhcloud/assets/`

## Contribution workflow

1. Create a branch: `git checkout -b update/module-1-1-fix-typo`
2. Make your edits.
3. Test locally with `npm run dev`.
4. Open a Pull Request against `main`.
5. Request review from the module owner.
6. Once merged, CI rebuilds and redeploys automatically.

See `docs/CONTRIBUTING.md` for details on conventions (frontmatter, LO traceability, brand compliance).

## License

Internal OVHcloud training material. Not for external distribution. The OVHcloud Design System and logos are property of OVH SAS and used under the brand guidelines for legitimate OVHcloud product enablement.
