# 07 — Assessment Strategy

## 1. Two-tier assessment model

The certification uses two distinct assessment tiers, with different purposes:

| Tier | Quand | Forme | Statut |
|---|---|---|---|
| **Micro-check** | End of every module (5 minutes) | 5 to 7 multiple-choice questions | **Formative** — not certifying, not graded toward the final result |
| **Final exam** | End of day 3 (1h30) | Comprehensive multiple-choice | **Certifying** — passing required to obtain the credential |

A **1-hour pre-exam wrap-up session** sits between the last content module and the final exam on day 3. This session is consolidation, not assessment — see [05 — Learning Path Architecture](./05-learning-path-architecture.md).

## 2. Micro-check (formative)

### Purpose

The micro-check is **diagnostic, not selective**. Its goal is to validate that the module's key learning outcomes have been acquired by every learner before moving on, and to surface gaps in real time for the trainer to address.

### Format

- **5 to 7 multiple-choice questions** drawn from the LOs of the module just delivered.
- Mix of recall (`K`-level), application (`S`-level), and judgment (`A`-level) questions, in roughly the same proportion as the LOs of the module.
- **Single correct answer per question** (no "multiple correct answers" patterns at this tier — keeps cognitive load low).
- Distractors written to expose common misconceptions, not to trick.

### Delivery and feedback

- Delivered on paper or on a simple polling tool (final tooling decision deferred to Phase 2).
- Trainer reveals the correct answers immediately at the end of the 5-minute window.
- Trainer briefly comments on questions where more than 30% of the room got the answer wrong — this is the trigger to revisit a concept before moving on.
- Individual learner scores are **not** recorded or used in the final certification decision.

## 3. Final exam (certifying)

### Format

- **Duration**: 1h30.
- **Question count**: between 55 and 70 questions.
- **Format**: multiple-choice, with mostly single-answer questions and a minority of multiple-answer questions (clearly flagged).
- **Coverage**: proportional to LO weight across the 8 domains (see distribution below).
- **Passing score**: **70%** — aligned with the industry standard (AWS Cloud Practitioner, Azure Fundamentals, Google Cloud Associate).
- **Delivery channel**: in-person, on the third day of the training; final tooling (paper, in-house platform, third-party testing platform) deferred to Phase 2.

### Question distribution per domain

The 8 domains contain 110 LOs in total. The exam covers approximately one question per two LOs for high-density operational domains, one question per two-to-three LOs for lighter conceptual domains. The resulting indicative distribution (~63 questions):

| Domain | LOs | Indicative exam questions |
|---|---|---|
| 01 — Cloud Foundations | 9 | 4 |
| 02 — PCI Foundation & Basic IAM | 13 | 7 |
| 03 — Compute | 18 | 11 |
| 04 — Storage | 17 | 10 |
| 05 — Network | 16 | 10 |
| 06 — Identity, Access & Security | 13 | 7 |
| 07 — IaC Essentials | 13 | 8 |
| 08 — Operations | 11 | 6 |
| **Total** | **110** | **~63** |

The exact final count will be set after the question bank is written in Phase 2.

### Cognitive level distribution

Each exam question is tagged by Bloom level:

| Cognitive level | Target share of exam |
|---|---|
| Remember / Understand (K-driven) | 30-35% |
| Apply (S-driven) | 40-45% |
| Analyze / Evaluate (A-driven) | 20-25% |

The dominance of *Apply* questions reflects the operator profile of the Associate: the certification validates **what the learner can do**, not what they can recite.

### Passing score rationale

A 70% threshold:

- Matches the cloud industry baseline (AWS, Microsoft, Google Associate certifications).
- Allows for legitimate gaps (~30% of LOs may not be perfectly mastered) without disqualifying a learner who has genuine operational capability.
- Is high enough to preserve the certification's signal value on a CV.

This threshold is set as the **initial calibration** and will be reviewed after the first three pilot sessions, based on pass rates and post-training operational feedback from customers and employers.

## 4. Re-take policy (initial proposal)

- A learner who fails the final exam can re-take it once, with a delay of 30 days minimum to encourage targeted re-preparation.
- No more than two re-takes total within a 12-month window.
- The re-take exam is drawn from the same question bank but with a different question set; identical question delivery is avoided.

This policy is the initial proposal and may be refined after the first sessions.

## 5. Question bank governance

The exam question bank is a controlled asset:

- **Source of truth**: a structured repository (Markdown or dedicated tool, to be chosen in Phase 2), versioned, with every question traced to one or more LOs.
- **Refresh cadence**: the bank is reviewed at least once per year, with retirement of overused questions and addition of new questions covering new service features.
- **Access control**: only trainers and program owners have read access; the bank is never shared with learners outside of the formal exam delivery.

## 6. Certification deliverable

A learner who passes the exam receives:

- A digital credential (issuing mechanism to be determined in Phase 2 — internal certificate vs Credly/Accredible-style verifiable badge).
- A clear statement of the LOs validated (the matrix is the substance of what the credential attests to).
- A validity duration (initial proposal: **2 years**, after which a re-certification may be required to account for service portfolio evolution).
