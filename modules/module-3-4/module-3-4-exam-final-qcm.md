# Module 3.4 — Final Exam — OVHcloud Public Cloud Core Associate

## Module Brief

- **Module ID**: 3.4
- **Type**: Certifying assessment (not an instructor-led module)
- **Exam duration**: 1h30
- **Passing score**: 70% (42/60)
- **Format**: Single-answer multiple-choice, 60 questions drawn randomly from this bank
- **Re-take policy**: One retake allowed; minimum 30-day delay; different question draw
- **Red-thread step**: End state — learner demonstrates mastery of the full Northwind Analytics deployment, from IaaS foundations to Day-2 operations

---

## Question Bank Summary

| Domain | Code | LOs | Questions in bank | Target per 60-Q exam |
|---|---|---|---|---|
| Cloud Foundations | FND | 9 | 18 | 6–7 |
| PCI Projects & Identity | PCI | 13 | 15 | 5–6 |
| Compute | CMP | 14 | 22 | 7–8 |
| Storage | STO | 17 | 24 | 8–9 |
| Network | NET | 15 | 22 | 7–8 |
| Identity & Security | SEC | 13 | 18 | 6–7 |
| Infrastructure as Code | IAC | 13 | 22 | 7–8 |
| Operations | OPS | 11 | 19 | 6–7 |
| **Total** | | **105** | **160** | **60** |

---

## Cognitive Level Distribution (full bank)

| Level | Category | Target % | Questions |
|---|---|---|---|
| Remember / Understand | K | 30–35% | ~50 |
| Apply | S | 40–45% | ~68 |
| Analyze / Evaluate | A | 20–25% | ~42 |

---

## Question ID Format

`Q-<DOMAIN>-<NNN>` — e.g., `Q-FND-001`.

Each question records:
- **Domain** code
- **LO** traced (one primary LO per question)
- **Bloom** level (Remember / Understand / Apply / Analyze / Evaluate)
- **Stem** (the question)
- **Options** A–D (single correct answer)
- **Correct** answer letter
- **Rationale** (one sentence per option explaining why right or wrong)

---

## Deliverables

| File | Purpose |
|---|---|
| `question-bank.md` | Human-readable source of truth — 160 questions, all metadata |
| `slides.md` | Internal team presentation deck — exam format overview + annotated sample questions |

---

## Governance

- **Access**: restricted to the Product Enablement team. Do not share with learners.
- **Versioning**: Git-managed. Any question edit = new commit with rationale in message.
- **Annual refresh**: review all questions for product accuracy after each major OVHcloud release cycle.
- **Exam platform import**: format TBD pending platform selection. The `question-bank.md` is the portable source; import scripts will be written once the platform is confirmed.
- **Randomization**: the 60-question draw must respect domain proportions (column "Target per 60-Q exam" above). Pure random draw across all 160 questions is not acceptable — it can produce exam sets with zero A-level questions.
