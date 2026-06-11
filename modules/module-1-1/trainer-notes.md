---
# ============================================================
# Module 1.1 — Cloud Foundations & OVHcloud Positioning
# Trainer notes — preparation deck
# ============================================================
theme: ../../theme-ovhcloud
title: Cloud Foundations & OVHcloud Positioning — Trainer Notes
class: text-left
mdc: true
exportFilename: 'modules/module-1-1/trainer-notes'
moduleId: "1.1"
moduleTitle: "Cloud Foundations & OVHcloud Positioning"
duration: "1h30"
program: "OVHcloud — Public Cloud — Core Associate"
los: [LO-FND-K01, LO-FND-K02, LO-FND-K03, LO-FND-K04, LO-FND-K05, LO-FND-K06, LO-FND-K07, LO-FND-A01, LO-FND-A02]
layout: trainer-cover
---

# Module 1.1 — Trainer Notes

## Preparation deck · Cloud Foundations & OVHcloud Positioning

> Reading time before the session: ~10 minutes. Pair with `slides.md` open in `/presenter` view.
---
layout: default
---

# Pre-flight (the day before / morning of)

- **Demo project.** Public Cloud project alive, one VM visible, not at quota zero. Backup project signed in on a second browser profile.
- **Manager pre-warmed.** Authenticated on the second monitor, session refreshed 5 minutes before the Demo block.
- **Positioning Drill deck.** Cards 1-8 printed, 1 per pair + 2 spares. Card 7 (Managed Postgres) is the trap card — hand it to the strongest pair.
- **Read the room.** Identify ex-AWS, ex-baremetal, never-public-cloud. Calibrates the tone of the whole day, not just this module.
- **Posture.** Positioning module, not technical. Reframe, do not convert. Stay factual on competitors — credibility of the 3 days depends on it.

---
layout: default
---

# Block 1 — Sentier battu (5 min) & Block 2 — Theory (30 min)

**Block 1** — rapid prerequisite check, no remediation drift.
- "Who opened the Manager this week?" hand-raise calibrates the entire day.
- If 1-2 learners have no active account, note names, fix at the break. Do not block the module.
- Resist the Manager tour reflex here. The Demo block does it 1 hour later, intentionally.

**Block 2** — anchor to legacy IT and to Northwind. No abstract definitions floating in the void.
- **S01 Northwind**: 2 minutes max. The persona returns all day, no over-investment now.
- **S02 NIST**: mini-poll "your current infra checks how many boxes?" calibrates legacy-vs-cloud literacy.
- **S04 Shared responsibility**: ex-AWS learners know the model. Just transfer the context, do not re-teach.
- **S07 OpenStack** & **S09 differentiators**: the two realization slides. Expect ex-AWS pushback on OpenStack relevance — answer with upstream contribution and User Survey adoption.
- **S10 qualification grid**: bridge to the lab. Confirm the four questions are understood before moving on.

**Anti-pattern**: turning S06 (landscape) into an OVHcloud sales pitch. Stay factual, the rest of the day depends on it.

---
layout: default
---

# Block 3 — Trainer Demonstration (15 min)

Demo · Manager UI only · no deployment · project `demo-bootstrap`

<div class="text-xs">

| # | Action | Verbalize |
|---|---|---|
| 1 | Log into `www.ovh.com/manager` | "Porte d'entree unique pour tous les produits OVHcloud." |
| 2 | Open universe selector, point to Public Cloud | "Chaque univers a son propre Manager." |
| 3 | Enter Public Cloud universe | "On va vivre ici les 3 prochains jours." |
| 4 | Open project selector, show the demo project | "Le projet est l'unite de facturation et d'isolation." |
| 5 | Click into the demo project dashboard | "Le menu de gauche est votre carte des 3 jours." |
| 6 | Open Instances (empty or with demo VMs) | "Ici on deploiera. On y revient en 1.3." |
| 7 | Open Regions / Locations | "Souverainete = vous choisissez. Detaille en 1.2." |
| 8 | Tour Object Storage, Block Storage, Network briefly | "Reconnaitre les noms, c'est l'objectif d'aujourd'hui." |
| 9 | Open Quotas & Limits under Management | "Garde-fou natif. Detaille en Operations (3.2)." |
| 10 | Back to dashboard, point to Documentation & Support | "Deux reflexes: docs.ovhcloud.com et support depuis le Manager." |

</div>

**Failure modes**: session expired → re-auth via SSO · quota zero on demo project → switch to backup, frame it as a 3.2 teaser · UI feature flag diverges from learner UI → acknowledge, focus on concepts.

---
layout: default
---

# Block 4 — Lab (30 min) · Block 5 — Micro-check (5 min) · Block 6 — Wrap-up (5 min)

**Block 4 — Positioning Drill**: coach, do not solve. The pairs must own their rebuttals.
- Walk between pairs. Listen for S10 (qualification grid) being cited — if no pair cites it, plant a question.
- Card 7 (Managed Postgres) is the trap card. Hand it to the strongest pair to surface Core vs non-Core live for the room.
- If a pair collapses against a counter-objection, intervene minimally: "what does the grid say?". Do not give the answer.
- No plenary debrief. The cross-restitution between pairs is the debrief.
- **Anti-pattern**: stepping in to "save" a pair under pressure. Discomfort is part of the learning here.

**Block 5 — Micro-check**: strict 5 min, formative not certifying.
- Reveal correct answers in one pass at the end. No deep debrief.
- **Q6** (workload qualification) reuses the Card 7 scenario — bridges the lab and the Day 2-3 operational mindset.
- Park consistently-failed questions for the end-of-day wrap-up.

**Block 6 — Wrap-up**:
- Underline that the Positioning Drill produced a customer-usable deliverable, not a school exercise.
- Bridge to 1.2: *"Decision prise — maintenant ou ouvre-t-on le compte, comment structure-t-on les projets, qui a quels droits?"*
- **Anti-pattern**: starting 1.2 in the last 2 minutes. Let the module breathe.

---
layout: two-cols
---

# FAQ — Anticipated questions

::left::

**Q: OVHcloud vs AWS — when do I choose which?**

Workload-dependent, not vendor-dependent. AWS wins on catalog breadth and global edge presence. OVHcloud wins on EU jurisdiction, bandwidth-heavy workloads (no egress fees), and bare-metal integration. The S10 grid is the conversation tool, not a religious debate.

**Q: What does sovereignty actually mean?**

Three concrete layers. Jurisdictional: French company, EU law, no US extraterritorial exposure (CLOUD Act, FISA). Operational: own datacenters, own hardware, own backbone — no hyperscaler underneath. Certifications: SecNumCloud-qualified offers exist. Detailed in Module 2.5.

::right::

**Q: Why OpenStack, not a proprietary stack?**

Strategic conviction. Standard APIs, portability, no API lock-in. Trade-off: narrower catalog than hyperscalers, accepted by design. OVHcloud contributes upstream and tracks releases — not a divergent fork. The User Survey shows steady production adoption (CERN, Workday, telcos).

**Q: Pricing vs hyperscalers?**

Three structural points. No egress fees on Public Cloud bandwidth. Flat published rates. Predictable monthly invoices. Raw compute hours may be cheaper at hyperscalers on specific instance types, but TCO including egress, support and reserved-instance complexity often tilts to OVHcloud.

---
layout: default
---

# Post-session — Trainer self-debrief

Answer after the session. Inputs for the next iteration, not a hidden assessment of the trainer.

- **OpenStack pushback.** Did S07 land cleanly, or did ex-AWS learners challenge OpenStack's relevance? Heavy pushback = strengthen S07 narrative next time, do not soften.
- **Grid adoption.** Was S10 cited spontaneously during the Positioning Drill, or did it need prompting? Prompting needed = make the bridge from Theory to Lab more explicit.
- **Card 7 effect.** Did the Managed Postgres trap card surface the Core vs non-Core distinction for the whole room, or just for the pair that got it? If isolated, surface it explicitly in the wrap-up next time.
- **Day-1 energy.** Room energy at the end? Day-1 fatigue starts here, calibrate Module 1.2 pacing accordingly.
- **One change.** Write it in the module's evolution log before leaving the room.
