---
# ============================================================
# Module 3.3 -- Wrap-up -- Pre-exam Consolidation & Q&A
# Trainer notes -- preparation deck
# ============================================================
theme: ../../theme-ovhcloud
title: Wrap-up -- Pre-exam Consolidation & Q&A -- Trainer Notes
class: text-left
mdc: true
exportFilename: 'modules/module-3-3/trainer-notes'

moduleId: "3.3"
moduleTitle: "Wrap-up -- Pre-exam Consolidation & Q&A"
duration: "1h"
program: "OVHcloud -- Public Cloud -- Core Associate"
los:
  - LO-FND-K01
  - LO-PCI-K01
  - LO-CMP-K01
  - LO-STO-K01
  - LO-NET-K01
  - LO-SEC-K01
  - LO-IAC-K01
  - LO-OPS-K01

layout: trainer-cover
---

# Module 3.3 -- Trainer Notes
## Wrap-up -- Pre-exam Consolidation & Q&A

> Preparation deck -- read before the session, not during it.
> Reading time: ~10 minutes. Pair with `slides.md` open in `/presenter` view.

---
layout: default
---

## Pre-flight

**No environment to prepare.** This session is slides + conversation only. No terminal, no Manager, no Terraform.

- Have open on a second screen: the 8-domain LO matrix from Phase 1. Use it if a Q&A question requires a specific LO pointer.
- Confirm the exam start time and platform setup before the session begins -- learners will ask during Block 5.
- Mentally flag Q05 (Gateway vs Floating IP) and Q09 (drift detection) -- these two mock exam questions generate the most follow-up. Know the one-sentence rationale cold.

**Mental posture:** your job is calibration, not coverage. A tense group needs slowing down in Block 2. A confident group can move faster and save more time for Block 3. Read the room from the first minute.

---
layout: default
---

## Block 1 -- The full arc (10 min)

**Posture**: grounding, not content. Open from a position of closure.

- S02 (arc table): do not walk through each row. Ask the opening question ("what was the last thing Northwind did?") and let the answer land before advancing. Two minutes maximum on this slide.
- S03 (8 domains): this is the calibration gate. Show-of-hands "which domain do you feel least confident about?" -- record mentally which domains to slow down in Block 2. Do not announce which domain is "most feared."
- Keep Block 1 under 10 min. Spending 15 min here eats the mock exam.

**Anti-pattern**: do not use this block to add content you feel was thin in earlier modules. That belongs in Block 2.

---
layout: default
---

## Block 2 -- Domain flash review (25 min)

**Posture**: trigger memory, do not re-teach. One sentence per bullet is the ceiling.

Default pace: 3 min per domain slide. If the S03 show-of-hands flagged NET or IAC as weak: take 4-5 min on those, compress FND or PCI to 2 min (most intuitive domains for the Corporate persona).

**Suggested opening question per domain** (these map directly to the mock exam):
- FND: "name one NIST characteristic and what it means for a cloud ops engineer"
- PCI: "what is a Public Cloud Project as a billing boundary?"
- CMP: "difference between stopping and deleting an instance in terms of billing?"
- STO: "which storage type for Northwind PostgreSQL WAL files and why?"
- NET: "how does the API instance reach the internet without a Floating IP?"
- SEC: "why does the backup job use an application credential, not a user login?"
- IAC: "what does a non-empty terraform plan on a clean main branch mean?"
- OPS: "first check when a batch job fails overnight?"

For each: read the header, ask the question, let the group answer, confirm or correct in one sentence, advance.

**Anti-pattern**: a learner gives a partial answer and you spend 3 minutes expanding it. Say "exactly -- and that is LO-XXX-YYY in Module X.Y" and move on.

---
layout: default
---

## Block 3 -- Mock exam (15 min)

**Posture**: exam mode. Announce the rules before Q01, then be silent while learners think.

Opening announcement: "10 questions, same format as the exam. I will read each question, give you 20 seconds, then reveal the answer and explain in 30 seconds. No discussion during the question."

Read the stem and all four options aloud -- learners in exam mode benefit from hearing the question, not just reading it.

**Reveal cadence**: name the correct answer letter, state the one-sentence rationale, move on. Example: "B -- the Gateway is for outbound-only NAT; the Floating IP is for inbound access. Different direction, different component."

**If 3+ people answer incorrectly**: extend the rationale to 90 seconds. One sentence on why the correct answer is correct, one sentence on why the most common wrong answer fails. Do not re-teach the full domain.

**Budget**: if Block 3 runs long, compress Block 4 by 2 minutes. Never compress Block 5.

---
layout: two-cols
---

## Block 4 -- Q&A (5 min) &amp; Block 5 -- Exam logistics (5 min)

::left::

**Block 4 -- Q&A**

Answer formula: 2-3 sentences + one module pointer. "That is the vRack positioning slide in Module 2.4. The key distinction is L2 inter-product vs L2 within a project."

If no questions arise within 30 seconds: "which mock exam question made you hesitate?" -- reliably starts a domain discussion.

If a question needs a full module re-teach: "great question -- Module X.Y covers that in depth. You have 5 minutes after this session to review it."

Do not extend past 5 minutes.

::right::

**Block 5 -- Exam logistics**

Read S22 as a checklist, not a pep talk. The numbers are reassuring on their own.

Closing sentence: "Your exam interface will be ready in [X] minutes. Clear your workspace, take a short break, come back focused."

Do not say "you've got this" or equivalent. It sounds hollow at this moment.

If learners ask whether they will pass: "I cannot predict your score. You have done the labs, you have seen the full arc, and the exam tests exactly what we covered. Answer what you know first, use remaining time for uncertain questions."

---
layout: default
---

## Post-session -- Trainer self-debrief

Answer these after the session. Feed into the next iteration of Module 3.3.

- Which domain generated the most Block 2 questions? Was it the one flagged by the show-of-hands, or a surprise?
- Which mock exam question had the highest wrong-answer rate? Distractor quality issue or a genuine knowledge gap from earlier modules?
- Did the Q&A block feel too short, too long, or right? Most common question type: concept / scenario / AWS cross-reference?
- Did S22 land as calm and factual? Any learner reaction that suggests a different tone for a future cohort?
- Any domain or LO that should be added to the flash review slides for the next delivery?
