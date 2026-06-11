---
name: module-content-production
description: Use this skill whenever the user is producing the content of a training module for an OVHcloud certification — typically during Phase 2 of a certification program. Triggers include "let's produce module 1.1", "draft the content for the Compute module", "I need to write the slides for X", "help me build the trainer notes", "let's design the lab for module Y", "produce a module on [any topic]", or any conversation where the user starts producing pedagogical content for a defined module of a known learning path. The skill imposes a Markdown-first workflow (slides as visual concepts + concise trainer notes) inside a docs-as-code pipeline (Slidev + OVHcloud Design System + Git PR workflow), explicitly NOT direct PPTX production, to keep iteration fast and content-focused. Use this skill even when the user does not explicitly say "module" or "Phase 2" — if the conversation involves producing slide content, trainer notes, lab handouts, or micro-check questions for a defined training unit, this is the right skill.
---

# Module Content Production

This skill defines the format, workflow, and writing rules for producing the content of a training module — typically a 1h30 instructor-led module of an OVHcloud certification. It is the skill used in Phase 2 of any certification program designed via the `certification-program-structure` skill.

The skill was created after observing a first Phase 2 attempt that suffered from two specific failure modes: direct PPTX production that made iteration slow and feedback shallow, and trainer notes written as verbose essays instead of action-oriented scripts. It was refined after the *OVHcloud — Public Cloud — Core Associate* POC (June 2026) that validated a docs-as-code production pipeline (Slidev + OVHcloud Design System) as a replacement for PPTX-based production.

## When to invoke

Whenever the user is producing the content of a defined training module: slide content, trainer notes, demonstration scripts, lab handouts, micro-check question sets, or the complete module package. The module must already exist as an entry in a learning path architecture (Phase 1 deliverable). If the user is still designing the path structure, the relevant skill is `certification-program-structure`, not this one.

## Two non-negotiable principles

1. **Markdown first, rendering last.** All module content is produced as Markdown structured documents with explicit slide markers. Visual rendering (HTML site, PDF) is automated downstream by the Slidev build pipeline. Never iterate on rendered output during conceptual review.
2. **Trainer notes are action scripts, not essays.** 3-7 lines per slide maximum, in bullets or short sentences, centered on what the trainer **does** during that moment of the session. Anything longer is a content development that belongs to the slide itself or to a separate reference document.

These principles are not stylistic preferences. Violating them generates rework that costs more than the production they replaced.

## Production pipeline: Slidev + ODS + Git

Module content lives in a Git repository structured as docs-as-code. The reference repository for this skill is the *OVHcloud — Public Cloud — Core Associate* repo (`ovhcloud-pcca-content`), whose architecture is the canonical pattern to replicate for any new certification program.

### Repository layout

```
.
├── modules/
│   └── module-<id>-<slug>/             # One folder per module
│       ├── slides.md                   # Slidev source file
│       ├── trainer-notes.md            # Long-form trainer FAQ (vetted answers)
│       ├── lab/                        # Lab handouts and artifacts
│       └── assets/                     # Module-specific images
├── theme-ovhcloud/                     # Shared OVHcloud theme (do NOT touch per-module)
│   ├── assets/                         # Official logos
│   ├── wallpapers/                     # Cover backgrounds (learner + trainer variants)
│   ├── fonts/                          # Source Sans Pro
│   ├── layouts/                        # cover, default, section, two-cols, trainer-cover
│   ├── components/                     # OvhNotice, OvhWarning, OvhCard, OvhStep
│   └── styles/index.css                # Imports ODS, exposes brand tokens
├── scripts/
│   └── build-index.mjs                 # Generates dist/index.html from modules.json
├── modules.json                        # Module registry consumed by CI and landing page
├── .github/workflows/                  # CI/CD pipelines (discover → build → assemble → deploy)
└── package.json
```

### Stack components

| Layer | Tool | Purpose |
|---|---|---|
| Authoring | Markdown + Slidev frontmatter | One `slides.md` per module |
| Presentation engine | Slidev (MIT, Vue-based) | Markdown-first, hot reload, presenter mode |
| Diagrams | Mermaid + Excalidraw | Versionable diagrams |
| Brand & design tokens | `@ovhcloud/ods-themes` (CSS only) | Official OVHcloud Design System |
| Typography | Source Sans Pro (OFL) | Official OVHcloud typeface, embedded locally |
| Versioning | Git + GitHub | Branches, PRs, code review |
| CI/CD | GitHub Actions | Build HTML + PDF on every merge |
| Hosting | GitHub Pages | Static site for HTML, PDF in artifacts |

### Slidev frontmatter for a module

The first slide of each `slides.md` carries the module-level metadata:

```yaml
---
theme: ../../theme-ovhcloud
title: Cloud Foundations & OVHcloud Positioning
class: text-center
highlighter: shiki
mdc: true

# Module metadata
moduleId: "1.1"
moduleTitle: "Cloud Foundations & OVHcloud Positioning"
duration: "1h30"
program: "OVHcloud — Public Cloud — Core Associate"
los:
  - LO-FND-K01
  - LO-FND-K02

# Render controls (recommended defaults)
controls: false
download: false
selectable: true
---
```

Per-slide frontmatter assigns layout and footer metadata:

```yaml
---
layout: default          # or: cover, two-cols, section
moduleId: "1.1"
slideId: "S02 — NIST"
los: ["LO-FND-K01"]
---
```

### Available layouts

- **`cover`** — Module opening slide, blue background, white logo, module pill
- **`section`** — Block separator (e.g., "Block 2 — Theory"), pale blue background
- **`default`** — Standard content slide, white background, branded footer
- **`two-cols`** — Two-column slide via `::left::` / `::right::` slots
- **`trainer-cover`** — Opening slide for `trainer-notes.md` only. Reuses the `ovh-cover` class (so it inherits cover styling, including the dark-background inline-code fix) but loads a distinct wallpaper, signaling a trainer-facing deliverable at a glance. Never used in learner-facing `slides.md`.

### Available Vue components (theme-ovhcloud/components/)

Use these inside any `slides.md`:

| Component | Use for | Example |
|---|---|---|
| `<OvhNotice title="...">` | Info callout (blue, `i` icon) | Pedagogical tip, neutral note |
| `<OvhWarning title="...">` | Warning callout (orange, ⚠ icon) | Pitfall, deprecation, common error |
| `<OvhCard title="..." href="...">` | Clickable card with arrow | Link to external resource |
| `<OvhStep :step="1" title="...">` | Numbered step item | "How-to" sequences |

For backward compatibility, the legacy `<div class="ovh-callout">` and `<div class="ovh-callout-warn">` patterns still work, but **prefer the Vue components in new content**.

### Visual patterns validated in production

Conventions discovered during Module 1.1 production, applicable to all subsequent modules.

**Symmetric callouts in side-by-side layouts.** When two callouts sit side by side (`two-cols`, grid 2×2, comparison layouts), both must be in `<div class="ovh-callout">` containers — never one in a callout and the other in plain text. Visual asymmetry undermines pedagogical parity ("recap" vs "next step", "AWS" vs "OVHcloud", etc.).

**Bloom verbs in wrap-up recap.** The "You can now…" column of the wrap-up slide reads better when each line starts with the LO's Bloom verb (Define, Place, Articulate, Apply, Defend) in Masterbrand Blue bold. It signals the cognitive progression of the module to the learner.

**Flowchart orientation for decision grids.** Mermaid `flowchart TB` (top-bottom) overflows vertically on 16:9 slides with 4+ decision nodes. Default to `flowchart LR` (left-right) for qualification grids and decision trees. Reserve `TB` for short flows (≤3 nodes).

**Dense table on a single slide.** When a comparison table approaches 10+ rows on one slide and a footer-overflow risk appears, wrap the table in `<div class="text-sm">` and any accompanying callout in `text-xs`. Reducing both proportionally preserves visual hierarchy.

**Content density and footer overflow — preventive sizing.** On 16:9 slides, the usable height after the H1 title is approximately 480 pixels. A slide that stacks H1 + Mermaid + grid of callouts + closing line will overflow into the footer. Apply these limits preventively, not reactively:

- **Block stack budget**: at most three vertical blocks under the H1 (e.g., one Mermaid + two callouts; or one large block + one summary). A fourth block is the overflow trigger.
- **Spacing**: `mt-4` between blocks is the default. `mt-6` is acceptable once per slide. `mt-8` is excessive and accumulates.
- **Grid density**: any `grid-cols-3` or denser must be wrapped in `text-sm`; sub-text inside callouts goes to `text-xs`.
- **Bottom-of-slide grey line**: pick one — either a callout containing the final point, or a small grey reminder line. Never both.
- **Mermaid scale**: `scale: 0.65` is the ceiling for 3-node diagrams. For 4+ nodes, drop to `scale: 0.55` and strip multi-line node labels (one word per node).
- **Mermaid orientation**: `flowchart LR` is the default. Reserve `TB` for ≤3 nodes (see next bullet).

When in doubt: split the slide. Two clean slides beat one cramped slide.

**No real-world logos in slides.** Avoid embedding competitor or partner logos (AWS, Azure, OpenStack, etc.) as image assets. Use text names instead. Reasons: copyright exposure, logos change, and a logo grid implicitly suggests a ranking. If a logo is genuinely needed, deposit it under `theme-ovhcloud/assets/logos/` after legal clearance.

### Design tokens

The theme consumes the official OVHcloud Design System (ODS) via `@ovhcloud/ods-themes`. When writing custom CSS in a slide or component, **prefer ODS tokens over hardcoded hex values**.

Priority order:
1. **ODS token directly** — `var(--ods-color-primary-700)` for Masterbrand Blue, `var(--ods-color-information-050)` for pale info background, etc.
2. **Local `--ovh-*` alias** — `var(--ovh-masterbrand-blue)`, `var(--ovh-navy-blue)`, etc. These route to ODS internally but expose a stable local API.
3. **Hardcoded hex** — Last resort. If used, it means a new token is needed; flag this in the PR.

Most-used tokens:

| Token | Hex | Use for |
|---|---|---|
| `--ods-color-primary-700` | `#000e9c` | Masterbrand Blue (titles, accents) |
| `--ods-color-primary-500` | `#0050d7` | Links, secondary actions |
| `--ods-color-primary-050` | `#e6faff` | Pale backgrounds (callouts) |
| `--ods-color-neutral-900` | `#1a1a1a` | Body text |
| `--ods-color-neutral-700` | `#4d4d4d` | Subtitles |
| `--ods-color-neutral-050` | `#f2f2f2` | Table headers, code background |
| `--ods-border-radius-md` | 8px | Default for cards, callouts |

A full list (100 tokens) is available via:

```bash
grep -rh "^\s*--ods-" node_modules/@ovhcloud/ods-themes/dist/ | sort -u
```

## Sources OVHcloud — hierarchy of authority

When producing content that references OVHcloud products, services, naming, or technical specifications, the source of truth follows this hierarchy:

1. **Project knowledge** (Phase 1 deliverables, internal references uploaded to the project)
2. **docs.ovhcloud.com — MDX source files** in the public repos `ovh/ovhcloud-docs` (new, Rspress-based) and `ovh/docs` (legacy, still active). Use these for product nomenclature, taxonomy, and authoritative product descriptions. Example reference: `docs/en/guides/public-cloud/compute/create-instance-in-horizon.mdx`.
3. **Internal OVHcloud documentation** (Confluence, Trainer's Hub, etc.)
4. **ovhcloud.com (FR)** for marketing-facing positioning
5. **Web search** as a last resort, never `us.ovhcloud.com`

The MDX files in step 2 are **not to be ported as slides**. They are reference material for the trainer producing the slide content. The pedagogical slide presents the concept; the MDX provides the verified product nomenclature, the canonical feature list, and the official description.

## Naming conventions (OVHcloud products)

Product names must match `docs.ovhcloud.com` exactly. Inconsistent naming is a credibility issue for ex-AWS / ex-Azure learners who notice such details. Verify in doubt via the official docs.

| Correct | Incorrect |
|---|---|
| Public Cloud | public cloud, PublicCloud, PCI |
| Public Cloud Instance | VM, Instance (alone) |
| Object Storage | object-storage, ObjectStorage |
| Block Storage | block storage |
| Cold Archive | cold archive, ColdArchive |
| vRack | VRACK, Vrack, V-Rack |
| Load Balancer | load-balancer, LoadBalancer |
| Managed Kubernetes Service (MKS) | k8s (alone), Managed K8s |
| Managed Databases | managed DB, MDB |
| OVHcloud Manager | the Manager (alone, on first mention) |
| Horizon | horizon |

When introducing a product for the first time in a module, use the full name; subsequent mentions in the same module may use a short form if introduced parenthetically (e.g., "Managed Kubernetes Service (MKS)" first, then "MKS").

## Canonical module artifact structure

The Markdown content of a module follows this structure inside `modules/module-<id>-<slug>/slides.md`. The structure below is the **pedagogical content**; the Slidev frontmatter sits on top and is described in the previous section.

```markdown
# Module <ID> — <Title>

## Module Brief

- **Module ID**: 1.1
- **Total duration**: 1h30
- **Block breakdown**: Sentier battu 5 min · Theory 30 min · Demo 15 min · Lab 30 min · Micro-check 5 min · Wrap-up 5 min
- **LOs covered**: `LO-FND-K01`, `LO-FND-K02`, ... (explicit list from the matrix)
- **Prerequisite modules**: 1.0 if standalone-not-allowed, otherwise "none — entry module"
- **Red-thread step**: 1-2 lines describing where this module fits in the certification's red-thread narrative

---

## Block 1 — Sentier battu / Hors piste (5 min)

### Sentier battu (assumed prerequisites)
- Tool prerequisite 1 (e.g., "OVHcloud Manager access")
- Knowledge prerequisite 1 (e.g., "TCP/IP addressing basics")

### Hors piste (remediation pointers for gaps)
- For gap X → see [link or doc]

---

## Block 2 — Theory & Concepts (30 min)

### Slide 1: <Title>

**Visual concept**: One sentence describing what the slide visually represents (diagram, table, comparison, screenshot).

**Talking points**:
- Concise point 1 (one line, ~10-15 words)
- Concise point 2
- Concise point 3 (max 5-7 bullets per slide)

**Trainer notes**:
- Action verb: souligner / demander / anticiper / si X, répondre Y
- 3-7 lines maximum

---

[repeat for all slides in the Theory block — typically 8-12 slides for 30 minutes]

---

## Block 3 — Trainer Demonstration (15 min)

### Demo scenario
One paragraph: what is being demonstrated, in which delivery channel (Manager UI / OpenStack CLI / Terraform), expected end state.

### Demo script

| Step | Action | Expected output | Trainer commentary |
|---|---|---|---|
| 1 | `command or click` | What appears | What to say while waiting / clicking |

### Common demo failure modes
- If X happens, the cause is usually Y → recovery: Z

---

## Block 4 — Learner Lab (30 min)

### Lab brief (learner-facing)
One paragraph: what the learner will accomplish, in which delivery channel(s), and the success criterion.

### Lab steps (learner-facing)
1. Step one

### Validation criteria
- Concrete check 1 (self-checkable by the learner)

### Lab artifacts to produce
- File or repo to commit, format, location

### Common lab support questions
- Anticipated learner question → vetted answer

---

## Block 5 — Micro-check QCM (5 min)

Format: 5 to 7 single-answer multiple-choice questions, formative (non-certifying).

### Question 1
- **Stem**: [the question]
- **Correct answer**: A. [text]
- **Distractors**:
  - B. [text] — *Why wrong*: brief rationale
- **LO traced**: `LO-XXX-YY`
- **Bloom level**: Remember / Understand / Apply / Analyze

[repeat for 5-7 questions]

---

## Block 6 — Wrap-up & Transition (5 min)

### Recap (1-2 lines)
What the learner now knows / can do.

### Transition to next module via red-thread scenario
1-3 sentences narrating the scenario's state evolution and what comes next.

---

## Trainer FAQ (anticipated questions for this module)

Q: [anticipated question 1]
A: [vetted answer in 3-5 lines]

[3-7 anticipated questions per module]
```

The translation from this conceptual Markdown to the Slidev `slides.md` happens in production: each `### Slide N: Title` block becomes a Slidev slide separated by `---`, with the per-slide frontmatter (`layout`, `moduleId`, `slideId`, `los`) applied. The trainer notes become HTML comments (`<!-- ... -->`) immediately after the slide body, which the CI extracts into the trainer PDF.

## Canonical trainer-notes.md structure

`trainer-notes.md` is a **separate Slidev deck** rendered with the same OVHcloud theme as `slides.md`. It is consumed by Slidev (its own frontmatter, its own `exportFilename`) and exported by the CI to a dedicated PDF artifact. The trainer reads it before the session — preparation deliverable, not in-session aid.

**Length budget: ~100 lines of Markdown, hard cap at 120.** Anything longer is a sign that content from `slides.md` (inline `<!-- ... -->` notes) is being duplicated, or that the FAQ has bloated into essays. A trainer must read the document end-to-end in 10 minutes; a 250-line file fails that test. Reduction strategies when overshooting: trim Block-by-block to **high-value moments only** (3-5 bullet points per block, not slide-by-slide commentary), keep FAQ answers to **2 short paragraphs each**, drop any pacing detail that the inline `<!-- -->` of `slides.md` already carries.

```markdown
---
# ============================================================
# Module <ID> — <Title>
# Trainer notes — preparation deck
# ============================================================
theme: ../../theme-ovhcloud
title: <Module Title>
class: text-left
mdc: true
exportFilename: 'modules/module-<id>/trainer-notes'

# Module metadata (same as slides.md, used by export and CI)
moduleId: "<ID>"
moduleTitle: "<Title>"
duration: "1h30"
program: "<Certification full name>"
los: [list]

layout: default
---

# Module <ID> — Trainer Notes

> Companion preparation document for the trainer animating this module.
> Reading time before the session: ~15 minutes.
> Pair this document with `slides.md` open in `/presenter` view.

---

## Pre-flight (the day before / morning of)

Equipment, environment, and room calibration checks. Operationally specific:
- What must be sourced, signed in, pre-generated (RC files, SSH keys, demo
  projects).
- What must be open in the second monitor (Manager tab, Terraform snippet
  ready to Alt-Tab).
- What to verify with the room before starting (prior-module continuity,
  PuTTY users, blockers).
- Mental posture for the module (what kind of moment is it in the program,
  what cultural shift to expect).

---

## Block 1 — <name> (<duration>)

**Posture**: one sentence on the trainer's stance for this block.

3-5 short bullets: what to do, what to ask, what to avoid. No content
recap — the content is in slides.md. Cite a specific slide ID only
when a slide carries an unusual risk or a key realization.

**Anti-pattern**: one specific trap to avoid in this block.

[repeat for Blocks 2 through 6, keeping each block to 5-8 lines total]

---

## Block 3 — Trainer Demonstration (15 min)

Includes a structured demo script table (step / action / verbalize) and
a short failure modes list. This is the only block where the
trainer-notes.md duplicates content from slides.md intentionally —
having the script on a separate document makes the demo runnable
without leaving the trainer-notes deck.

---

## FAQ — Anticipated learner questions

4-6 questions, each followed by a vetted answer in 2 short paragraphs
maximum. Tone: ready-to-paraphrase, not citation-formal. Anticipate the
question behind the question (often a cultural friction point or a
misconception). If a question requires more than 2 paragraphs, it
belongs in the source markdown, not here.

---

## Post-session — Trainer self-debrief

3-5 reflective prompts the trainer answers after the session, feeding
into the module's evolution. Examples: which slides drew the most
clarifying questions, did the key realization moment land, did the lab
fit in the budget. Treat these as inputs for the next iteration of the
module, not a hidden assessment of the trainer.
```

The document is a **proper Slidev deck**, not a long single-page Markdown. Each section is its own slide separated by `---`: one slide for Pre-flight, one per block (1 through 6), one for FAQ, one for Post-session debrief. About 10 slides total, rendered with the OVHcloud theme, exported as a PDF artifact distinct from the learner-facing `slides.md` PDF.

Per-slide layout guidance:
- **First slide (cover)** — `layout: trainer-cover`. Distinct wallpaper marks the PDF as trainer-facing at a glance. Carries the module title, subtitle, and a one-line "Preparation deck" caption.
- **Pre-flight, Block 1, Blocks 5-6, Debrief** — `layout: default`, content-light, mostly bullets.
- **Block 2 Theory and Block 4 Lab** — `layout: default`. Use the `text-sm` wrapper if content density justifies it.
- **Block 3 Demo** — `layout: default` with the 14-step table wrapped in `<div class="text-xs">` to fit on one slide. The failure-modes list follows as a short bullet block under the table.
- **FAQ** — `layout: two-cols` works well when 4-6 short Q/A pairs need to be side-by-side. Otherwise `layout: default`.

Apply the same anti-overflow rules as `slides.md`: max 3 vertical blocks per slide, `mt-4` default spacing, dense tables in `text-sm` or `text-xs`. If a slide overflows, split it.

## Workflow for producing a module

Work through the module in this order. Each step ends with explicit user validation before proceeding. The entire production happens on a feature branch and ends with a Pull Request.

### Step 0 — Branch creation and module registration

Before any production, create a feature branch from `main`:

```bash
git checkout main && git pull
git checkout -b feat/module-<id>-<short-description>
```

Convention: `feat/module-1-2-iam-foundations`, `feat/module-2-3-block-storage`, etc.

**Common pitfall**: starting production directly on `main` without realizing it. If this happens, recovery is possible while changes are still uncommitted: `git checkout -b feat/...` carries the modifications to the new branch. If commits were made on `main`, use `git branch feat/... && git reset --hard <last-clean-sha>` to relocate them.

**Register the module in `modules.json` (status: draft).** The repository root contains a `modules.json` registry consumed by the CI matrix (`discover` job) and by the landing-page generator (`scripts/build-index.mjs`). Without an entry, the module's slides do not get built and the module does not appear on the program landing page — even after merge. Add the entry at the start of production:

```json
{
  "id": "1.3",
  "slug": "module-1-3-compute-instances-flavors-deployment",
  "title": "Compute (Part 1) — Instances, Flavors & Deployment",
  "duration": "1h30",
  "day": 1,
  "order": 3,
  "status": "draft"
}
```

`status: "draft"` lets the CI tolerate incomplete content during production without failing the build, and keeps the module hidden from `index.html`. The status flips to `"published"` at the end of production (Step 10 below). This manual registration is intentional: it prevents accidental publication of in-progress modules.

### Step 1 — Module Brief

Confirm the module ID, the LOs it covers (must be a subset of the LOs assigned to this module in the learning path architecture), the prerequisite modules, and the red-thread step. If any of these are unclear or contradict Phase 1 documentation, stop and ask the user before producing content.

### Step 2 — Sentier battu / Hors piste

List explicit prerequisites (tools the learner must have, prior knowledge assumed). For each prerequisite, provide a hors-piste remediation pointer.

### Step 3 — Theory & Concepts (the heaviest block)

Produce 8-12 slides covering the K-level (and some S/A-level) LOs assigned to this module. Follow these rules:

- **One slide = one idea.** If a slide has more than one idea, split it.
- **Visual concept first**, talking points second. The visual is the cognitive anchor; the points are the verbal scaffold.
- **Talking points are not full sentences in the slide.** Short phrases (~10-15 words) that the trainer expands on orally.
- **Trainer notes are action-oriented and concise** (see rules below).
- **Every slide mentions the persona angle or the red-thread step at least implicitly.** Otherwise the slide is decontextualized.
- **Cross-reference hyperscalers when introducing a service.** Each OVHcloud service slide carries (or contributes to) an AWS/Azure cross-reference (see the S23 pattern in the reference repo).
- **Product nomenclature follows the naming conventions section above.**

### Step 4 — Trainer Demonstration

Pick one channel (Manager UI, OpenStack CLI, or Terraform) appropriate for the module's content. Build a single end-to-end scenario, not a series of disconnected snippets. Anticipate 2-3 failure modes that commonly happen during the demo.

### Step 5 — Learner Lab

The lab must be **executable in 30 minutes** by a learner of the target persona, including reading the brief. If it feels like it needs more, simplify it.

Validation criteria must be **concrete and self-checkable** (the learner knows by themselves whether they succeeded).

### Step 6 — Micro-check QCM

5-7 questions. Distribution: roughly proportional to the K/S/A mix of the LOs covered. Each question traces back to a specific LO. Distractors expose common misconceptions, do not trick.

### Step 7 — Wrap-up & Transition

The transition to the next module is **mandatory** even for the last module of the course (in that case, transition to the exam). The red thread must continue without a gap.

### Step 8 — Trainer FAQ

Anticipate 3-7 questions that the persona is likely to ask during this module. Provide vetted answers in 3-5 lines each.

### Step 9 — Slidev rendering & local preview

Convert the validated conceptual Markdown into the Slidev `slides.md` format (frontmatter + slide separators + components + HTML-comment trainer notes). Launch locally:

```bash
npm run dev -- modules/module-<id>-<slug>/slides.md
```

Walk through each slide in the browser. Check:
- Layouts render correctly (cover, section, two-cols, default)
- Vue components display as expected (`<OvhNotice>`, `<OvhWarning>`, `<OvhCard>`, `<OvhStep>`)
- Footer shows the right module ID and slide ID
- No content overflow into the footer (especially on dense tables / Mermaid diagrams — see Limitations section)
- Presenter mode (`/presenter` URL) displays the trainer notes correctly

### Step 10 — Pull Request

**Before committing**, flip the module's status in `modules.json` from `"draft"` to `"published"`. This is what makes the module appear on the program's `index.html` after merge. Omitting this step is the single most common publication failure mode (diagnosed on Module 1.3, June 2026): the module folder exists, the CI builds the slides, the URL is live, but the landing page does not list it.

Commit, push, open a PR:

```bash
git add modules/module-<id>-<slug>/ modules.json
git commit -m "feat(module-<id>): initial content for <module title>"
git push -u origin feat/module-<id>-<short-description>
```

Open the PR on GitHub. The CI runs automatically: build HTML site + export PDF + export trainer notes PDF.

PR description must include:
- LOs covered
- Walkthrough notes for the reviewer (what to focus on)
- Known issues or trade-offs (if any)

Request review from the N+1. The N+1 reviews on GitHub directly (diff view) or via the deployed preview build. Once approved and CI is green, merge.

## Rules for writing trainer notes

Trainer notes are the single most likely source of bloat. Apply these rules ruthlessly.

### Length budget

- **3 to 7 lines per slide.** Below 3 = under-specified. Above 7 = the trainer won't read them in session, they'll be useless.
- **One line = one short bullet or one short sentence.** Not a paragraph.

### Action-oriented verbs (preferred)

| Verb | What it does |
|---|---|
| **Souligner** | Highlight a specific point the trainer must verbalize |
| **Demander** | Pose a question to the learners to engage them |
| **Anticiper** | Flag a question or objection that is likely to come up |
| **Si X, répondre Y** | Pre-scripted answer to a foreseeable specific question |
| **Rappeler** | Re-anchor a prior concept or persona detail |
| **Éviter** | Flag a digression or trap the trainer should not fall into |
| **Vérifier** | Quick check the trainer can do to gauge audience comprehension |

### Anti-patterns (do not produce)

- ❌ **The essay**: 15+ lines developing the content of the slide in prose. The slide already says it; the note doesn't repeat it.
- ❌ **The full script**: word-for-word what the trainer should say. The trainer is a professional who speaks naturally — they don't read scripts.
- ❌ **The content dump**: the note as a content reference instead of a delivery aid.
- ❌ **The decontextualized note**: a generic comment that could apply to any slide. Useless.

### Good example

> **Slide 4 — vRack: the 4 foundational characteristics**
>
> **Trainer notes**:
> - Souligner que vRack est un underlay L2, pas un service IaaS comme les autres
> - Anticiper la question "et la performance par rapport à un VPC AWS ?" → vRack passe par le backbone OVHcloud, pas internet, latence stable
> - Si quelqu'un demande s'il faut un vRack pour démarrer → non, c'est optionnel, seul utile en multi-produit OVHcloud
> - Rappeler: persona Corporate aime souvent ce composant car c'est le pont vers leur baremetal existant

### Bad example (do not produce)

> **Slide 4 — vRack: the 4 foundational characteristics**
>
> **Trainer notes**:
> - vRack is OVHcloud's proprietary technology for connecting different OVHcloud products at Layer 2. It is built on the OVHcloud backbone and provides a fully isolated network experience. The four foundational characteristics include: (1) multi-product capability, allowing vRack to connect Public Cloud projects with Bare Metal servers and Hosted Private Cloud instances; (2) multi-datacenter reach...
>
> *(continues for 30+ lines)*

The bad example is a Wikipedia-style paragraph. It belongs in the slide content or a separate reference doc, not in trainer notes.

## Red-thread reuse rules

Every module must continue the **red-thread scenario defined in the Phase 1 reference framework** of the certification being produced (e.g., *Northwind Analytics* for *OVHcloud — Public Cloud — Core Associate*). The module brief lists the red-thread step. The Theory block references it at least once. The Demo and Lab blocks operate on the scenario's infrastructure (project name, instance names, naming conventions follow the scenario's conventions). The Wrap-up transitions to the next state of the scenario.

If the module is being delivered standalone (à la carte, outside the full learning path), the scenario reference is preserved but the trainer is given a brief context-setting note at the top of the Sentier battu block.

## Calibration heuristics

| Block | Slides / content units | Practical limit |
|---|---|---|
| Cover + Agenda | 2 slides | Strictly bounded |
| Section separators | 1 per block (5-6 per module) | Strictly bounded, no trainer notes needed |
| Sentier battu | 1 slide max (often verbal only) | If >1 slide, prerequisite is too heavy |
| Theory | 8-12 slides | More than 12 = block overstuffed |
| Demo | 1 scenario, 8-15 numbered steps | More than 15 = too complex for 15 min |
| Lab | 1 exercise, 5-10 numbered steps | More than 10 = too long for 30 min |
| Micro-check | 5-7 questions | Strictly bounded |
| Wrap-up | 1 slide | Strictly bounded |

If a block exceeds its budget, **shrink the block before extending the duration**. Module duration is a hard constraint.

## Known limitations (Slidev + Mermaid + ODS)

These limitations were identified during the POC and are documented to avoid wasting time during production.

### Mermaid diagrams — limited control over visual matrices

Mermaid is excellent for flowcharts, sequence diagrams, and state machines. It is **inadequate for visual matrices** (e.g., the IaaS/PaaS/SaaS responsibility split, where uniform cell sizes and tight pixel-control matter). When a slide requires a strict visual grid:

- **First try** Mermaid with `scale`, `nodeSpacing`, `rankSpacing` directives — works for simple cases.
- **If unsatisfactory**, fall back to **HTML/CSS Grid** for that single slide. The control is total and the rendering is deterministic.

### Slidev Goto component (bug #2519)

The `g` keyboard shortcut opens a Goto dialog that does not dismiss properly under some conditions (notably Firefox/Edge). The theme includes a CSS workaround that hides the dialog entirely (`#slidev-goto-dialog { display: none !important }`). Side effect: the `g` keyboard navigation is unavailable; use arrows or `Space` instead.

### Footer overflow on dense slides

Dense tables and large Mermaid diagrams can visually push into the footer region. When designing such a slide, leave a vertical safety margin or move the dense element to a dedicated slide.

### Trainer notes mechanic — last HTML comment wins

Slidev's official rule (verified in `docs/guide/syntax.md`): **the last `<!-- ... -->` block in a slide is treated as the presenter note. Anything before the last comment is ignored.** Comments placed *between* two slide separators belong to the *previous* slide. This has three operational consequences:

- **No banner comments between slides.** Decorative HTML banners like `<!-- ==== BLOCK 2 — THEORY ==== -->` placed between slide blocks are interpreted by Slidev as the trainer note of the preceding slide, overwriting the actual note. The presenter mode then displays `===========` instead of the intended text. This was diagnosed during Module 1.3 production (June 2026) after appearing in Modules 1.1 and 1.2 silently.
- **One HTML comment per slide, placed last.** The trainer note `<!-- ... -->` must be the final element of the slide block, immediately before the next `---` separator. No further comments after it.
- **For file-source navigation** (marking where a block starts in the `slides.md` source), use a YAML comment (`# Block 2 — Theory & Concepts`) inside the frontmatter of the section-opening slide. YAML comments are invisible to Slidev and safe.

Verification: `grep -c "^<!-- =" slides.md` must return `0` for any `slides.md` produced under this skill.

Corollary on layouts: `cover.vue` and `section.vue` are visual transitions, not content-bearing slides. Trainer notes on those layouts are usually unnecessary; if present, they still follow the "last comment wins" rule and are subject to the same banner trap.

### YAML pitfall in inline comments — em-dash and double-colon

Some Vue/Vite versions fail to parse HTML comments (`<!-- ... -->`) containing double em-dash (`—`) sequences, raising "Unexpected EOF in comment" errors. Inside trainer notes, prefer ASCII punctuation (`:`, `,`) or a single em-dash. Reserve em-dash for slide-visible content, not inside comments.

### Inline code on dark-background layouts

The global theme styles `<code>` with a light grey background (`--ovh-gray-50`). On dark-background layouts (`cover`, `section`, and `trainer-cover` which reuses the `ovh-cover` class), that grey rectangle plus the layout's white text produces white-on-near-white — invisible inline code. The theme corrects this in `theme-ovhcloud/styles/index.css`:

```css
.ovh-cover.slidev-layout code,
.ovh-section.slidev-layout code {
  background-color: rgba(255, 255, 255, 0.18);
  color: var(--ovh-white);
  border: 1px solid rgba(255, 255, 255, 0.25);
}
```

This relies on layout root classes being `ovh-cover` and `ovh-section`. If a future layout introduces a new dark background under a different class name, add it to this selector. Do **not** remove this rule when refactoring the theme — it is load-bearing for any cover or section slide that contains inline code (the trainer-notes cover caption does).

### GitHub Pages and visibility

GitHub Pages requires a **public** repository unless the GitHub organization has a Pages-enabled Enterprise plan. For training content with sensitivity constraints, deployed previews of PRs may require a different hosting strategy (e.g., Cloudflare Pages with access control, or OVHcloud Web Hosting with the content served from an Object Storage bucket).

### Windows + Nextcloud + Vite — EPERM on dev startup

When the repository is checked out under a Nextcloud-synced folder on Windows, `npm run dev` periodically fails with `EPERM: operation not permitted, rename 'node_modules/.vite/deps_temp_*' -> 'node_modules/.vite/deps'`. Cause: the Nextcloud desktop client scans `node_modules/` in real time for synchronization, holding a file handle that prevents Vite from completing its cache rename atomically.

**Recommended fix**: exclude `node_modules`, `.vite`, and `dist` from the Nextcloud client's ignored-files list (Nextcloud settings → sync settings → Edit Ignored Files). These directories are regenerable and should never sync.

**Alternative fix**: move the repository out of the Nextcloud-synced tree (e.g., `C:\dev\<repo>`). Git provides the versioning; Nextcloud adds no value on a Git-managed working tree.

**Immediate workaround if dev refuses to start**: `rm -rf node_modules/.vite && npm run dev`.

## Output format

For each module produced, the deliverable is a **branch + PR** on the certification's content repository:

- One Markdown file (`modules/module-<id>-<slug>/slides.md`) in Slidev format — the learner-facing presentation.
- A `trainer-notes.md` alongside `slides.md` in the same module folder. **Consumed by Slidev** as a separate deck (its own Slidev frontmatter, its own `exportFilename`), rendered with the OVHcloud theme so that the trainer reads it in the same visual language as the slides. Read by the trainer **before** the session, in addition to (not instead of) the inline `<!-- ... -->` notes in `slides.md` which carry the in-session action script. Structure detailed in the canonical structure section below.
- A `lab/` folder for lab handouts and reference solutions
- Module-specific assets under `assets/`
- A PR with a description that lists LOs covered and walkthrough notes for the reviewer

The CI handles HTML site generation, PDF export (learner version), and PDF export (with trainer notes) on every merge to `main`. The deployed HTML site is the **learner-facing handout** post-session. The PDF artifacts are the **archived deliverables** of each certification version.

## Boundary: what this skill does NOT cover

- **Learning path architecture decisions** (which modules exist, their LO mapping, sequencing). That's `certification-program-structure`.
- **LO writing or auditing**. That's `learning-outcome-format`.
- **PPTX rendering** from the Markdown. Deprecated — the docs-as-code pipeline replaces PPTX entirely. If a PPTX deliverable is explicitly required (e.g., for a stakeholder who cannot consume HTML/PDF), it is a one-off export via the `pptx` skill, triggered after module merge.
- **Expert validation gate logistics** (identifying experts, scheduling walkthroughs). That's a project management concern; this skill produces the artifact that gets reviewed via the PR workflow, but doesn't manage the scheduling.
- **Theme or component modifications** to `theme-ovhcloud/`. Theme changes are a separate workstream with their own review process, since they affect every module.

When the user asks about any of those topics, stay inside this skill for the module content production, and signal which other skill or process owns the boundary topic.
