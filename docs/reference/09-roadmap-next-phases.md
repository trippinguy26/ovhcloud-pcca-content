# 09 — Roadmap & Next Phases

## 1. Phase 1 — Reference framework *(complete and updated post N+1 review, this document set)*

| Livrable | Statut |
|---|---|
| Executive summary | ✅ |
| Target persona definition (Corporate + Digital Starter) | ✅ |
| Scope statement with "Core" definition (in/out, rationale) | ✅ |
| Certifiable skills matrix (8 domains, 110 LOs) | ✅ |
| Learning path architecture (11 modules, 3 days, pre-exam wrap-up) | ✅ |
| Red-thread scenario (Northwind Analytics) | ✅ |
| Assessment strategy (micro-check + final exam) | ✅ |
| Delivery format and prerequisites (by OVHcloud segment) | ✅ |

Phase 1 sign-off opens Phase 2.

## 2. Phase 2 — Module content production

### Objectives

Produce all training content required to deliver the 11 modules, the pre-exam wrap-up, and the final exam, plus the trainer enablement material to support an instructor who is not a domain expert in every service.

### Per-module deliverables (× 11)

For each module, produce:

- **Module brief**: 1-page document stating module objectives, mapped LOs, sentier battu / hors piste prerequisites, duration breakdown, and prerequisite modules where applicable.
- **Slide deck**: PowerPoint or equivalent, ~25-35 slides. Visual identity aligned with OVHcloud brand guidelines.
- **Trainer notes**: detailed speaker notes for every slide, including anticipated questions, common misconceptions to address, and timing guidance.
- **Demo script**: step-by-step trainer demonstration script, with screenshots or recorded reference video.
- **Lab handout**: learner-facing document describing the hands-on exercise, expected outcome, and validation criteria.
- **Lab artifacts**: code (Terraform, cloud-init, scripts) hosted in a Git repository, structured so each module's artifacts are independent and reusable.
- **Micro-check question set**: 10 questions (5-7 used per session, with rotation).

### Cross-module deliverables

- **Northwind Analytics dossier**: 2-page company description for trainer reference, used as the opening of Module 1.1.
- **Northwind reference architecture diagrams**: 3 diagrams showing the state of Northwind's infrastructure at the end of each day.
- **Master Terraform repository**: the full Terraform configuration reconstructing the Northwind staging environment.
- **PostgreSQL hardening playbook** (cron-driven `pg_dump` to Object Storage, IAM/Secret Manager configuration) for module 2.2/2.5 — also a strong standalone Tech Lab candidate.
- **Final exam question bank**: 180-250 questions tagged by LO and Bloom level, from which the 55-70-question exam is drawn per session.
- **Pre-exam wrap-up deck**: consolidation slides + 1 mock micro-check covering each domain.
- **Trainer FAQ kit**: anticipated learner questions for each module, with vetted answers — critical asset for trainers who are not domain experts.
- **Glossary**: OVHcloud + OpenStack + cloud-industry terminology, consistent vocabulary across all modules.

### Gate de validation experts — mandatory before any dry-run

This is a **new requirement** introduced in the post-N+1 review.

Before any module produced in Phase 2 is dry-run with internal trainers or shown to a customer, it must pass an **expert walkthrough validation**:

- **Who**: one or more internal OVHcloud experts for the service(s) covered by the module. Experts to be identified and solicited *at production time* — they are not pre-identified at Phase 1 sign-off.
- **When**: at the end of module production (slide deck + demo + lab + micro-check question set all drafted), **before** the first internal trainer dry-run.
- **Format**: walkthrough in a synchronous meeting (in-person or video call). The trainer presents the module content end-to-end to the expert(s); the expert challenges, corrects, and validates.
- **Outcome**: written acceptance from the expert(s) before the module enters dry-run. If the expert flags issues, the module is reworked and re-presented until acceptance.

**Rationale**: the Customer Trainer producing the modules is not an expert in every service area. Expert validation before dry-run prevents the costly scenario of dry-running technically wrong content with internal trainers, then having to rework after exposure.

### Production sequencing

Phase 2 will produce modules in waves, not all at once. The proposed sequence:

| Wave | Modules | Rationale |
|---|---|---|
| Wave 1 (pilot wave) | 1.1, 1.2, 1.3, 1.4 | Validates the module template end-to-end on the most foundational content. Outputs from this wave inform any adjustments to the production process before scaling. |
| Wave 2 | 2.1, 2.2, 2.3, 2.4, 2.5 | Storage, Network, Security — the operational core. |
| Wave 3 | 3.1, 3.2, plus pre-exam wrap-up and exam question bank finalization | IaC, Operations, and certification readiness. |

A short retrospective at the end of each wave is planned to refine the process before the next. Each module within a wave passes the **expert validation gate** before being declared production-complete.

## 3. Phase 3 — Pilot delivery and certification go-live

### Objectives

Deliver the certification in real conditions, measure pass rates and learner satisfaction, refine the content and assessment based on observed gaps, and reach a stable go-live state.

### Deliverables

- **Pilot session(s)**: at least 2 pilot deliveries (one internal, one with a willing external customer or partner) before public launch.
- **Pilot feedback report**: pass rate analysis, learner feedback, trainer debrief, identified content gaps and adjustments.
- **Adjusted v1 content**: module material updated based on pilot outcomes.
- **Public-launch readiness checklist**: marketing material handoff, registration flow, certificate issuance mechanism, post-certification follow-up.

### Success criteria for Phase 3 sign-off

- At least 70% pass rate on pilot sessions (consistent with the threshold defined in [07 — Assessment Strategy](./07-assessment-strategy.md)).
- Learner satisfaction NPS or equivalent score above an agreed threshold (target to be set in early Phase 3).
- Trainer confidence: every trainer who delivered the pilot reports being able to teach the curriculum end-to-end without falling back on external expertise. This metric directly addresses the Customer Trainer's onboarding concern and is non-negotiable.

## 4. Phase 4 — Ongoing maintenance *(post-go-live)*

Once the certification is live, recurring activities:

- **Quarterly content review**: catch service portfolio evolutions (new flavors, new services, deprecations) and update affected modules.
- **Annual question bank refresh**: retire overused questions, introduce new ones reflecting service evolution.
- **Trainer sync sessions** (quarterly): align all certified trainers on recent updates and shared challenges.
- **Customer feedback loop**: post-training survey + 3-month follow-up to measure operational adoption.

## 5. Related and dependent work streams

This certification is not the only work stream of the Product Enablement team. Adjacent efforts that interact with this program:

- **Tech Labs catalog**: standalone Tech Labs derived from this curriculum's lab artifacts, packaged for lead generation.
- **OVHcloud - Public Cloud - Core Professional certification**: the next certification in the Public Cloud Core family. Reuses this Phase 1 template structure, picks up where Associate stops (HA, DR, multi-region, FinOps, advanced IaC, OpenStack internals).
- **OVHcloud - Public Cloud - DBaaS Associate**: the sibling certification that will receive the Managed PostgreSQL content originally drafted under earlier Core Associate iterations. Same Phase 1 template structure.
- **Other sibling certifications** (MKS, AI, Analytics, Sovereign, Quantum): each follows the same documentary structure.

## 6. Open decisions to confirm

Items requiring explicit confirmation before or during Phase 2:

- **Pricing**: confirm the list price tier for paid seats (Y€ for Persona A, Z€ if applicable for Persona B).
- **Digital Starter eligibility**: confirm the eligibility rules for the subsidized track (MRRR threshold, time-limited window, NIC Handle status).
- **Expert identification**: as Phase 2 starts each module, identify the expert(s) to solicit for the validation gate.
- **Credential issuance**: choose between internal certificate, third-party verifiable badge platform (Credly, Accredible), or both.
- **Validity duration**: confirm the proposed 2-year validity before potential re-certification.
- **Pilot delivery timing**: agree on a target month for the first pilot session, to back-plan Phase 2 production.
