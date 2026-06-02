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

## Repo layout

```
.
├── modules/                    # One folder per module
│   └── module-1-1-cloud-foundations/
│       ├── slides.md           # The presentation source (Slidev format)
│       ├── trainer-notes.md    # Long-form trainer FAQ + facilitation tips
│       ├── lab/                # Lab handouts and artefacts
│       ├── assets/             # Module-specific images
│       └── components/         # Module-specific Vue components (if any)
├── theme-ovhcloud/             # Shared OVHcloud visual theme
│   ├── layouts/                # Slide layouts (cover, two-column, etc.)
│   ├── styles/                 # CSS / tokens
│   └── package.json
├── .github/workflows/          # CI/CD pipelines
├── docs/                       # Repo documentation (contribution guide, etc.)
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

Once `npm run dev` is running, open http://localhost:3030 in your browser. Edits to `slides.md` reload instantly.

## Contribution workflow

1. Create a branch: `git checkout -b update/module-1-1-fix-typo`
2. Make your edits.
3. Test locally with `npm run dev`.
4. Open a Pull Request against `main`.
5. Request review from the module owner.
6. Once merged, CI rebuilds and redeploys automatically.

See `docs/CONTRIBUTING.md` for details.

## License

Internal OVHcloud training material. Not for external distribution.
