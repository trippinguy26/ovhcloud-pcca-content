# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Background

This project encompasses the design and delivery of the “OVHcloud - Public Cloud - Core Associate” certification program—the first level of the broader “Public Cloud Core” program. Format: Instructor-led, 3 days, culminating in a final multiple-choice certification exam. Two primary personas: Corporate (encompassing the OVHcloud Corporate + Digital Scaler segments) and Digital Starter (OVHcloud segment for SMEs/freelancers/self-service entrepreneurs).

## Status at the start of each phase

- Phase 1 (reference repository): FIXED post-N+1 — Markdown files available in the project knowledge base.
- Phase 2 (module production): not yet started.

## Reference documents included in the project

- Complete Phase 1 repository (18 Markdown files organized in a Confluence tree structure).
- SMB Bundle 8 materials (PDF) — foundational content.
- SMB Bundle 9/10 Advanced materials (PDF) — Pro+ content, to be set aside for Associate.
- Trainer’s personal HTML notes — calibrated one level above the internal fundamentals.
- “Customers Product Enablement Strat Vision” document — team mission framework.
- “Strategy customer segments” slide — CCO segmentation into three units (Digital Starter, Digital Scaler, Corporate).

## Program conventions (fixed)

- Full commercial name: “OVHcloud - Public Cloud - Core Associate”.
- Parent program: “Public Cloud Core” (Associate, Professional, Specialist coming soon).
- Operational definition of “Core”: native OpenStack IaaS layer + essential adjacent components (Object S3, vRack, Octavia Load Balancer) + native operational tools (CLI, Terraform, Manager observability). Any managed service that relies on Core but is not part of it is out of scope (Kubernetes, Managed Databases, AI, Analytics).
- Deliverable language: US English.
- Document format: Structured Markdown for Confluence import.
- LO format: LO-<DOMAIN_3_LETTERS>-<CATEGORY><NUMBER>, categories K/S/A, measurable Bloom verbs.
- Module ID format: <DAY>.<MODULE_INDEX> (e.g., 2.3).
- Narrative thread: Northwind Analytics (European B2B SaaS scale-up, logistics, ~80 employees, self-managed hardened PostgreSQL on Core).

## Educational approach

- Target audience: Non-cloud-native corporate users, often former AWS customers. Approach: reconcile with OVHcloud Public Cloud Core, not convert religiously.
- Self-service Digital Starter persona, without an Account Manager, operating on < €2k MRRR.
- Always start with legacy analogies before introducing the cloud concept.
- Always compare each OVHcloud service with its AWS/Azure equivalents.
- Depth calibration: one level above the internal SMB Bundle 8, one level below Pro+.

## Expected workflow

- For all production work: propose via chat; I’ll approve or make changes, then deliver the final file.
- For PPTX, use the official OVHcloud template (POTX provided in conversation).
- Prefer the file_creation and computer_use tools over requesting manual copy-and-paste.
- OVHcloud source hierarchy: project knowledge > internal documentation > ovhcloud.com (FR) > web search. Never us.ovhcloud.com.
- Gate Phase 2: every production module undergoes expert validation (walkthrough in a meeting) BEFORE any internal dry run.

## Outside the scope of this project

- Professional and Specialist levels of the Public Cloud Core program (coming soon).
- Sister certifications: MKS Associate, AI Associate, DBaaS Associate (which incorporates managed PostgreSQL content), Analytics, Quantum, Sovereign.
- Production of eLearning content (handled by another team member).

## Project Purpose

Docs-as-code training content for the OVHcloud Public Cloud Core Associate (PCI-CA) certification program. Each module is a Slidev presentation (Markdown → HTML/PDF), version-controlled and built via GitHub Actions.

## Commands

```bash
npm install                                                        # Node ≥20.12 required
npm run dev -- modules/<module-slug>/slides.md                    # Hot-reload dev server → http://localhost:3030
npm run build -- modules/<module-slug>/slides.md                  # Build static HTML
npm run export:pdf -- modules/<module-slug>/slides.md             # Export learner PDF
npm run export:notes -- modules/<module-slug>/slides.md           # Export trainer-notes PDF
node scripts/build-index.mjs --out dist                           # Regenerate landing page
```

Presenter mode (trainer notes): `http://localhost:3030/presenter`

## Architecture

```
modules/
  module-X-Y/
    slides.md          ← Slidev source (the canonical content file)
    trainer-notes.md   ← Separate Slidev file with layout: trainer-cover
    dist/              ← Built HTML (gitignored locally, produced by CI)
theme-ovhcloud/
  components/          ← OvhNotice, OvhWarning, OvhCard, OvhStep (global Vue components)
  layouts/             ← cover, default, two-cols, section, trainer-cover
  styles/index.css     ← ODS tokens + brand overrides
  fonts/               ← Source Sans Pro .otf (offline, deterministic builds)
scripts/
  build-index.mjs      ← Generates dist/index.html from modules.json
modules.json           ← Module registry — single source of truth for build/publish
```

### Module Registry (modules.json)

Only modules with `"status": "published"` are built by CI and appear on the landing page. Use `"draft"` while authoring a new module. The `slug` must match the folder name under `modules/`.

### CI/CD

Four-job GitHub Actions pipeline:
1. **discover** — reads modules.json, emits a matrix of published modules
2. **build-module** — parallel per-module: HTML + learner PDF + trainer-notes PDF → artifacts
3. **assemble** (main only) — merges artifacts, generates root index.html
4. **deploy** (main only) — publishes to GitHub Pages

PRs trigger jobs 1–2 only; artifacts are downloadable from the PR.

## Authoring Conventions

### Slide frontmatter

Every content slide must have:
```yaml
---
layout: default        # cover | default | two-cols | section | trainer-cover
moduleId: "1.1"
slideId: "S02 — NIST"
los: ["LO-FND-K01"]   # at least one LO; cover/section layouts are exempt
---
```

### Vue components (use these, not legacy divs)

```markdown
<OvhNotice title="Pro tip">Info callout (blue)</OvhNotice>
<OvhWarning title="Heads up">Warning callout (orange)</OvhWarning>
<OvhCard title="Title" href="https://...">Clickable card</OvhCard>
<OvhStep :step="1" title="Title">Numbered step</OvhStep>
```

Modules 1.1–1.2 use legacy `<div class="ovh-callout">` — do not reproduce this pattern in new content.

### Trainer notes

Written as HTML comments directly after slide body content:

```markdown
<!--
Trainer note text here.
ASCII-only: no em-dashes or curly quotes. Use plain hyphens and straight quotes.
-->
```

### Design tokens

Prefer ODS tokens. Key tokens:
- `--ods-color-primary-700` (#000e9c) — headings
- `--ods-color-primary-500` (#0050d7) — links
- `--ods-color-neutral-900` (#1a1a1a) — body text

Avoid hardcoded hex values. Local `--ovh-*` aliases exist for backward compatibility but new code should use ODS directly.

### Diagrams

- **Mermaid** for architecture/flow diagrams (use `LR` orientation to avoid overflow on 16:9)
- **Excalidraw** for free-form schematics (commit the `.excalidraw` source file alongside)

## Branch & PR Conventions

Branch naming: `<type>/<module>-<short-description>` — types: `fix/`, `update/`, `feat/`, `chore/`

Commit format: `fix(module-1-1): correct S02 wording`

PR review checklist:
- Frontmatter complete (moduleId, slideId, los on every content slide)
- Trainer notes present and ASCII-only
- Vue components used (not legacy divs)
- ODS tokens preferred over hardcoded hex
- No third-party logo image assets
- CI green
