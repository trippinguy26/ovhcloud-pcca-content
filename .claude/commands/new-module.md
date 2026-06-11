---
description: Generate a new training module end-to-end with review gates
---

You are producing a new module for the PCCA program. Execute these steps in order, stopping at each review gate.

1. Ask which module (ID + title) if not provided as argument.
2. Create and checkout branch `feat/module-X-Y-<slug>`.
3. Generate `modules/module-X-Y-<slug>.md` following the module-content-production skill.
4. Generate the Slidev `slides.md` for this module.
5. STOP. Present what was produced and wait for review before continuing.
6. After validation, generate `trainer-notes.md`.
7. Add `Published` status for this module in `modules.json`.
8. Export slides.md to PDF via `slidev export`.
9. Export trainer-notes.md to PDF.
10. Run `git add`, commit with message `feat(module-X-Y): add <title>`, push, and open PR via `gh pr create`.
11. After PR is merged (ask user to confirm), checkout main, pull, delete the feature branch.