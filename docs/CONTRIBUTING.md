# Contributing to OVHcloud PCCA content

## Workflow at a glance

1. **Open an issue** describing the change (typo, content update, new module, etc.).
2. **Create a branch** from `main`: `git checkout -b <type>/<module>-<short-description>`
   - Types: `fix/` (typo, factual error), `update/` (content refresh), `feat/` (new slide, new lab), `chore/` (theme, tooling).
   - Example: `fix/module-1-1-typo-s02`, `update/module-1-1-pricing-2026Q4`.
3. **Edit locally** with `npm run dev -- modules/<module>/slides.md` to see the live result.
4. **Commit** with a clear message: `fix(module-1-1): correct NIST publication year on S02`.
5. **Push** and open a Pull Request targeting `main`.
6. **Request review** from the module owner (see CODEOWNERS).
7. Once approved and CI green → merge. The pipeline rebuilds and redeploys automatically.

## Authoring conventions

### Slide structure

Each slide in `slides.md` is separated by `---` and starts with a YAML frontmatter block:

```yaml
---
layout: default          # or: cover, two-cols, section
moduleId: "1.1"
slideId: "S02 — NIST"
---
```

### Trainer notes

Trainer notes live in HTML comments **directly after** the slide content:

```markdown
<!--
Trainer notes — S02 NIST:
- Talking point 1
- Anticipated question: ...
-->
```

The export pipeline harvests these comments into the trainer PDF.

### LO traceability

Each content slide must reference at least one LO from the program's skills matrix. Add it as a discreet badge or in the frontmatter:

```yaml
los: ["LO-FND-K01", "LO-FND-K02"]
```

### Mermaid diagrams

Use Mermaid for any architecture / flow / sequence diagram. It's text-based, versionable, and renders natively in Slidev:

````markdown
```mermaid
flowchart LR
  A --> B
```
````

For free-form schematics, use Excalidraw and commit the `.excalidraw` file alongside the slide.

## Visual identity

The OVHcloud theme is in `theme-ovhcloud/`. **Do not override its CSS inline in slides** — if a layout is missing, propose it as a PR on the theme itself. This keeps the brand consistent across all modules.

Color tokens available:
- `var(--ovh-masterbrand-blue)` — primary, use heavily
- `var(--ovh-white)` — background, use heavily
- `var(--ovh-neon-blue)`, `var(--ovh-neon-green)`, `var(--ovh-neon-yellow)` — accents, use sparingly
- `var(--ovh-sky-blue)`, `var(--ovh-light-blue)` — soft backgrounds

Utility classes available:
- `.ovh-callout` — highlighted info box
- `.ovh-callout-warn` — warning variant
- `.ovh-pill` — small inline badge

## Review checklist (for PR reviewers)

- [ ] LO traceability present
- [ ] Trainer notes present and useful (not just a copy of talking points)
- [ ] OVHcloud brand colors only — no off-brand colors introduced
- [ ] AWS/Azure cross-reference present if the slide introduces a service
- [ ] Legacy analogy present before any cloud-native concept
- [ ] Builds without warning locally (`npm run build`)
