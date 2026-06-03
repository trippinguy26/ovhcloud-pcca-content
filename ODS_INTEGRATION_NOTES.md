# ODS integration update

This update aligns the theme with the official **OVHcloud Design System (ODS)** via its CSS package, and introduces 4 new Vue components inspired by `docs.ovhcloud.com`.

## What changed

1. **`package.json`** — added `@ovhcloud/ods-themes` as a runtime dependency. ODS provides the official CSS tokens (colors, spacing, typography) that align with what's used on docs.ovhcloud.com.
2. **`theme-ovhcloud/styles/index.css`** — now imports `@ovhcloud/ods-themes/default/css` at the top, keeping our `--ovh-*` tokens as a fallback layer until the exact ODS token names are confirmed (see "Next step" below).
3. **`theme-ovhcloud/components/`** — new folder with 4 Vue components:
   - `OvhNotice.vue` — info callout (blue + `i` icon)
   - `OvhWarning.vue` — warning callout (amber + triangle icon)
   - `OvhCard.vue` — clickable card with arrow, inspired by "Essential guides" on docs.ovhcloud.com
   - `OvhStep.vue` — numbered step item (for "how-to" sequences)
4. **`.ovh-xref-table`** — restyled to match `docs.ovhcloud.com` table aesthetic (light gray header instead of full-blue marketing header, rounded border, more breathing room).
5. **`README.md`** — fully rewritten to reflect the new stack, repo layout, and component usage.

## How to apply

```bash
# 1. Unzip on top of the existing repo
unzip -o ods-integration-update.zip -d ovhcloud-pcca-poc/

# 2. Install the new npm dependency
cd ovhcloud-pcca-poc
npm install

# 3. Restart dev server
# (Ctrl+C if it's running, then:)
npm run dev -- modules/module-1-1-cloud-foundations/slides.md
```

## Next step — confirm ODS tokens

After `npm install` completes, please run this command in Git Bash:

```bash
grep -rh "^\s*--ods-" node_modules/@ovhcloud/ods-themes/dist/ 2>/dev/null | sort -u | head -50
```

Paste the result in the chat. With the exact list of ODS variables, I can remap our `--ovh-*` tokens to consume ODS tokens directly (e.g. `--ovh-masterbrand-blue: var(--ods-color-primary-500);`). Until then, the theme uses our local fallback values, which are visually identical but not technically wired to ODS.

## Using the components in slides

Once the migration is applied, you can use the components directly in any `slides.md`:

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

The legacy `.ovh-callout` and `.ovh-callout-warn` classes still work for existing slides, but new content should prefer the Vue components.
