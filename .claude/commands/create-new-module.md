---
description: Generate a new training module end-to-end with review gates
---

You are producing a new module for the PCCA program. Execute these steps i>

1. Ask which module (ID + title) if not provided as argument.
2. Create and checkout branch `feat/module-X-Y-<slug>`.
3. Generate `modules/module-X-Y-<slug>.md` following the module-content-pr>
4. Generate the Slidev `slides.md` for this module.
5. STOP. Present what was produced and wait for review before continuing v>
6. After validation, generate `trainer-notes.md`.
7. Export slides.md to PDF via `npm run export`.
8. Export trainer-notes.md to PDF via `npm run export`.
9. Run `git add`, commit with message `feat(module-X-Y): add <title>`, pus>
10. After PR is merged (ask user to confirm), checkout main, pull, delete >
