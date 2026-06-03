# Contributing to OVHcloud PCCA content

## Workflow at a glance

1. **Open an issue** describing the change (typo, content update, new module, etc.).
2. **Create a branch** from `main`: `git checkout -b <type>/<module>-<short-description>`
   - Types: `fix/` (typo, factual error), `update/` (content refresh), `feat/` (new slide, new lab), `chore/` (theme, tooling).
   - Example: `fix/module-1-1-typo-s02`, `update/module-1-1-pricing-2026Q4`.
3. **Edit locally** with `npm run dev -- modules/<module>/slides.md` to see the live result.
4. **Commit** with a clear message: `fix(module-1-1): correct NIST publication year on S02`.
5. **Push** and open a Pull Request targeting `main`.
6. **Request review** from the module owner.
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

Each content slide must reference at least one LO from the program's skills matrix. Add it in the frontmatter:

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

## Visual identity & design tokens

The theme is built on top of the **OVHcloud Design System (ODS)**, consumed as a CSS-only dependency via `@ovhcloud/ods-themes`. Our local `--ovh-*` aliases route to ODS tokens internally, so you can use either family — but **prefer the ODS token directly** when you write new components, since it's the canonical source.

### How to use a design token in CSS

A CSS variable `var(--ods-…)` is used wherever you would write a color, spacing, or font-family value:

```css
.my-element {
  color: var(--ods-color-information-700);     /* Masterbrand Blue */
  background: var(--ods-color-information-050); /* Pale info background */
  border-radius: var(--ods-border-radius-md);  /* 8px */
  font-family: var(--ods-font-family-default); /* Source Sans Pro */
}
```

Inside Vue `<style scoped>` blocks the syntax is identical.

### Token catalogue (most useful subset)

**Brand & primary blues**

| Token | Hex | Use for |
|---|---|---|
| `--ods-color-primary-700` | `#000e9c` | Masterbrand Blue — main headings, accents |
| `--ods-color-primary-500` | `#0050d7` | Links, secondary actions, table column emphasis |
| `--ods-color-primary-400` | `#157eea` | Hover/active states |
| `--ods-color-primary-300` | `#4bb2f6` | Soft accents |
| `--ods-color-primary-050` | `#e6faff` | Pale backgrounds (callouts, sections) |

**Neutrals (grays)**

| Token | Hex | Use for |
|---|---|---|
| `--ods-color-neutral-900` | `#1a1a1a` | Body text |
| `--ods-color-neutral-700` | `#4d4d4d` | Subtitles, secondary text |
| `--ods-color-neutral-500` | `#808080` | Page numbers, meta info |
| `--ods-color-neutral-200` | `#cccccc` | Borders |
| `--ods-color-neutral-100` | `#e6e6e6` | Light separator backgrounds |
| `--ods-color-neutral-050` | `#f2f2f2` | Table headers, code background |
| `--ods-color-neutral-000` | `#ffffff` | Pure white |

**Semantic colors**

| Token | Hex | Use for |
|---|---|---|
| `--ods-color-information-*` | shades of blue | Info notices (`OvhNotice` component) |
| `--ods-color-warning-*` | shades of orange | Warnings (`OvhWarning` component) |
| `--ods-color-critical-*` | shades of red | Critical/error states |
| `--ods-color-success-*` | shades of green | Success / confirmation |

**Border radii**

| Token | Value |
|---|---|
| `--ods-border-radius-xs` | 2px |
| `--ods-border-radius-sm` | 4px |
| `--ods-border-radius-md` | 8px (default for cards, callouts, tables) |
| `--ods-border-radius-lg` | 16px (large surfaces) |

**Typography**

| Token | Value |
|---|---|
| `--ods-font-family-default` | Source Sans Pro, fallback to system fonts |
| `--ods-font-family-code` | Source Code Pro, fallback to monospace |

A full list (100 tokens) is available by running:

```bash
grep -rh "^\s*--ods-" node_modules/@ovhcloud/ods-themes/dist/ | sort -u
```

### Using OVHcloud components in slides

Four Vue components are available globally in every `slides.md`:

```markdown
<OvhNotice title="Pro tip">
Public Cloud bills you only for what you use — no upfront cost.
</OvhNotice>

<OvhWarning title="Heads up">
Do not share your private PGP key with anyone.
</OvhWarning>

<OvhCard title="Getting started" href="https://docs.ovhcloud.com/...">
Click to read the introduction guide.
</OvhCard>

<OvhStep :step="1" title="Create the project">
Open the OVHcloud Manager and navigate to the Public Cloud universe.
</OvhStep>
```

### Brand assets

- **Logos**: `theme-ovhcloud/assets/ovhcloud-logo-color.png` and `ovhcloud-logo-white.png`. Master logo, fullcolor on white backgrounds, white on blue backgrounds.
- **Fonts**: Source Sans Pro `.otf` files under `theme-ovhcloud/fonts/`, embedded locally for offline-deterministic builds.
- **Icons**: Selection from the OVHcloud iconography (Solid_Icons_Blue, Outlined, Layered) is to be added to `theme-ovhcloud/icons/` on a per-need basis. Do not embed the entire 909-file iconography set.

### Brand & ODS layering

When choosing where a styling rule belongs:

1. **First** — try to use an ODS token directly. If the value exists in the ODS catalogue, use it.
2. **Second** — if the design pattern is OVHcloud-brand-specific but not in ODS (e.g. brand yellow `#FFD124` for the official accent), use the `--ovh-brand-*` aliases.
3. **Last resort** — hardcoded hex value. This is a smell — it means we need a new token. Open an issue.

## Review checklist (for PR reviewers)

- [ ] LO traceability present
- [ ] Trainer notes present and useful (not just a copy of talking points)
- [ ] ODS tokens used wherever possible (no hardcoded hex unless justified)
- [ ] AWS/Azure cross-reference present if the slide introduces a service
- [ ] Legacy analogy present before any cloud-native concept
- [ ] Builds without warning locally (`npm run build`)
