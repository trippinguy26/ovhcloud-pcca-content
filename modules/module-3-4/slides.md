---
# ============================================================
# Module 3.4 -- Final Exam -- Question Bank Overview
# Internal team presentation deck
# ============================================================
theme: ../../theme-ovhcloud
title: Final Exam -- OVHcloud Public Cloud Core Associate
info: |
  ## OVHcloud -- Public Cloud -- Core Associate
  Module 3.4 -- Exam question bank internal presentation.
  For the Product Enablement team only.
class: text-left
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: slide-left
mdc: true
exportFilename: 'modules/module-3-4/team-overview'

controls: false
download: false
selectable: true

moduleId: "3.4"
moduleTitle: "Final Exam -- OVHcloud Public Cloud Core Associate"
duration: "1h30"
program: "OVHcloud -- Public Cloud -- Core Associate"

layout: cover
---

# Final Exam
## OVHcloud — Public Cloud — Core Associate

Internal team review — question bank v1.0

<!--
Deck for internal team review and exam platform planning.
NOT for learners. 160 questions across 8 domains.
Key discussion point: exam platform selection + import format.
-->

---
layout: default
moduleId: "3.4"
slideId: "S01 -- Exam format"
---

# Exam Format

<div class="grid grid-cols-3 gap-6 mt-6">
<div class="ovh-callout text-center">
<div class="text-3xl font-bold" style="color: var(--ods-color-primary-700)">60</div>
<div class="text-sm mt-1">Questions per exam<br><span class="text-xs text-gray-500">drawn from a 160-question bank</span></div>
</div>
<div class="ovh-callout text-center">
<div class="text-3xl font-bold" style="color: var(--ods-color-primary-700)">90 min</div>
<div class="text-sm mt-1">Duration<br><span class="text-xs text-gray-500">~90 sec per question</span></div>
</div>
<div class="ovh-callout text-center">
<div class="text-3xl font-bold" style="color: var(--ods-color-primary-700)">70%</div>
<div class="text-sm mt-1">Passing score<br><span class="text-xs text-gray-500">42 / 60 correct</span></div>
</div>
</div>

<div class="grid grid-cols-2 gap-6 mt-4">
<div>

**Question format**
- Single correct answer (A / B / C / D)
- No negative marking
- No partial credit

</div>
<div>

**Re-take policy**
- 1 retake allowed
- 30-day minimum wait
- Different question draw for retake

</div>
</div>

<OvhNotice title="Platform TBD">Exam delivery platform not yet selected. The question bank is in portable Markdown and will be adapted to the chosen format.</OvhNotice>

<!--
Souligner que les 60 questions sont tirees aleatoirement du bank de 160, avec respect des proportions par domaine.
Le tirage pur aleatoire sans contrainte de domaine est interdit -- une session pourrait n'avoir aucune question de niveau A.
-->

---
layout: two-cols
moduleId: "3.4"
slideId: "S02 -- Domain distribution"
---

# Domain Distribution

::left::

| Domain | Code | LOs | Bank Qs | Exam draw |
|---|---|---|---|---|
| Cloud Foundations | FND | 9 | 18 | 6–7 |
| Projects & Identity | PCI | 13 | 15 | 5–6 |
| Compute | CMP | 14 | 22 | 7–8 |
| Storage | STO | 17 | 24 | 8–9 |
| **Total (4)** | | **53** | **79** | **~27** |

::right::

| Domain | Code | LOs | Bank Qs | Exam draw |
|---|---|---|---|---|
| Network | NET | 15 | 22 | 7–8 |
| Identity & Security | SEC | 13 | 18 | 6–7 |
| Infra as Code | IAC | 13 | 22 | 7–8 |
| Operations | OPS | 11 | 19 | 6–7 |
| **Total (4)** | | **52** | **81** | **~33** |

<div class="mt-4">
<OvhNotice title="Draw rule">
The exam platform must draw questions <strong>proportionally per domain</strong>, not purely randomly. Pure random draw risks zero coverage of a domain in a 60-question session.
</OvhNotice>
</div>

<!--
105 LOs totaux, 160 questions en banque, ratio ~1,5 question par LO.
Chaque LO a au minimum 1 question. Les LOs les plus complexes en ont 2 ou 3.
Verifier avec l'equipe si le ratio 1,5x est suffisant ou si on vise 2x (necessiterait ~210 questions).
-->

---
layout: default
moduleId: "3.4"
slideId: "S03 -- Cognitive distribution"
---

# Cognitive Level Distribution

<div class="grid grid-cols-3 gap-6 mt-6">
<div class="ovh-callout">
<div class="text-xl font-bold" style="color: var(--ods-color-primary-700)">~50 questions (31%)</div>
<div class="font-semibold mt-1">K — Remember / Understand</div>
<div class="text-sm mt-2">Definitions, concepts, distinctions, product positioning. Directly traceable to Knowledge LOs (LO-xxx-Knn).</div>
<div class="text-xs mt-2 text-gray-500">Example: "What does a Security Group default deny mean?"</div>
</div>
<div class="ovh-callout">
<div class="text-xl font-bold" style="color: var(--ods-color-primary-700)">~68 questions (43%)</div>
<div class="font-semibold mt-1">S — Apply</div>
<div class="text-sm mt-2">Scenario-based operations. Learner must identify the correct action given a context. Traceable to Skill LOs (LO-xxx-Snn).</div>
<div class="text-xs mt-2 text-gray-500">Example: "Northwind's instance cannot boot — which recovery method?"</div>
</div>
<div class="ovh-callout">
<div class="text-xl font-bold" style="color: var(--ods-color-primary-700)">~42 questions (26%)</div>
<div class="font-semibold mt-1">A — Analyze / Evaluate</div>
<div class="text-sm mt-2">Judgment and posture. Learner must choose the right design decision or identify a risk. Traceable to Attitude LOs (LO-xxx-Ann).</div>
<div class="text-xs mt-2 text-gray-500">Example: "Which flavor family for a memory-intensive PostgreSQL server?"</div>
</div>
</div>

<div class="mt-4 text-xs text-gray-500">Target from assessment strategy: 30–35% K · 40–45% S · 20–25% A. Current bank: 31% / 43% / 26% -- within range.</div>

<!--
La distribution cognitive doit etre respectee dans le tirage. Ne pas tirer 60 questions K -- l'examen deviendrait un quiz de memorisation.
La proportion A (26%) est legerement au-dessus de la cible haute (25%) -- intentionnel pour le niveau Associate.
-->

---
layout: default
moduleId: "3.4"
slideId: "S04 -- Question anatomy"
---

# Question Anatomy

<div class="grid grid-cols-2 gap-6 mt-4">
<div>

**Each question records 6 fields**

```markdown
### Q-FND-001
Domain: FND | LO: LO-FND-K01 | Bloom: Remember

[Stem — the question]

- A. [option]
- B. [option]
- C. [option]
- D. [option]

Correct: B | [one-sentence rationale per option]
```

</div>
<div>

**Design rules**

- Single correct answer — no "all of the above"
- 3 plausible distractors with explicit rationale
- Stem and options in present tense
- Northwind scenario used in Apply-level questions
- No trick questions — the correct answer is the professionally defensible choice
- No double negatives ("which of the following is NOT NOT...")

<OvhWarning title="Anti-pattern">Distractors that are obviously wrong (e.g., "delete all instances") produce low discrimination. Every distractor must be plausible to a learner with partial knowledge.</OvhWarning>

</div>
</div>

<!--
Souligner la regle des distracteurs plausibles. Une question ou 3 reponses sont evidemment fausses ne discrimine pas -- elle ne detecte pas les lacunes.
Les distracteurs les plus efficaces sont: (1) vrai dans un autre contexte, (2) partiellement correct, (3) confusion courant AWS vs OVHcloud.
-->

---
layout: default
moduleId: "3.4"
slideId: "S05 -- Sample K level"
---

# Sample Question — K Level (Remember)

**Q-FND-014** | Domain: FND | LO: LO-FND-K07 | Bloom: Remember

<div class="mt-2 p-3 rounded-lg text-sm" style="background: var(--ods-color-neutral-050)">

**What is the default OVHcloud Public Cloud billing model for compute instances?**

</div>

<div class="grid grid-cols-1 gap-2 mt-2">
<div class="py-1 px-3 rounded text-xs" style="background: var(--ods-color-neutral-050)">A. Annual reservation with a monthly payment</div>
<div class="py-1 px-3 rounded text-xs" style="background: var(--ods-color-neutral-050)">B. Per-second billing after the first minute</div>
<div class="py-1 px-3 rounded text-xs font-semibold" style="background: var(--ods-color-primary-050); border-left: 3px solid var(--ods-color-primary-700)">C. Per-hour billing with no minimum commitment ✓</div>
<div class="py-1 px-3 rounded text-xs" style="background: var(--ods-color-neutral-050)">D. Flat monthly rate regardless of usage</div>
</div>

<OvhNotice title="Rationale">C is correct — per-hour, no commitment. A and D imply reservation/commitment. B is AWS Lambda granularity, not OVHcloud's compute model. Distractor A traps ex-AWS Reserved Instance users; D traps on-prem mindset.</OvhNotice>

<!--
Ce type de question teste la memorisation directe d'un fait produit. Distractor B piege les ex-AWS (Lambda billing). Distractor A piege les used a la reservation.
Bloom level Remember = connaitre le fait, pas l'appliquer.
-->

---
layout: default
moduleId: "3.4"
slideId: "S06 -- Sample S level"
---

# Sample Question — S Level (Apply, scenario-based)

**Q-CMP-013** | Domain: CMP | LO: LO-CMP-S03 | Bloom: Apply

<div class="mt-2 p-3 rounded-lg text-sm" style="background: var(--ods-color-neutral-050)">

**What happens to the billing of a Public Cloud Instance when it is powered off (stopped) from within the OS but not deleted?**

</div>

<div class="grid grid-cols-1 gap-2 mt-2">
<div class="py-1 px-3 rounded text-xs font-semibold" style="background: var(--ods-color-information-050); border-left: 3px solid var(--ods-color-warning-500)">A. Billing stops entirely — a stopped instance does not consume billable resources</div>
<div class="py-1 px-3 rounded text-xs font-semibold" style="background: var(--ods-color-primary-050); border-left: 3px solid var(--ods-color-primary-700)">B. Billing continues — the compute slot (vCPU/RAM) is still reserved even when the instance is off ✓</div>
<div class="py-1 px-3 rounded text-xs" style="background: var(--ods-color-neutral-050)">C. Billing switches to a reduced standby rate</div>
<div class="py-1 px-3 rounded text-xs" style="background: var(--ods-color-neutral-050)">D. The instance is automatically deleted after 24 hours</div>
</div>

<OvhWarning title="Most common wrong answer: A">Stopping ≠ billing stop. Shelve or Delete to stop compute billing.</OvhWarning>

<!--
Question a fort enjeu operationnel -- les gens font cette erreur en production et decouvrent le probleme sur leur facture.
Distractor A est la reponse "logique" pour quelqu'un qui transpose le comportement AWS EC2 stopped state.
Insister sur la distinction Stop / Shelve / Delete -- c'est unique a OVHcloud par rapport aux hyperscalers.
-->

---
layout: default
moduleId: "3.4"
slideId: "S07 -- Sample S level NET"
---

# Sample Question — S Level (Apply, architecture decision)

**Q-NET-016** | Domain: NET | LO: LO-NET-K04 | Bloom: Distinguish

<div class="mt-2 p-3 rounded-lg text-sm" style="background: var(--ods-color-neutral-050)">

**What is the decisive factor when choosing between a Floating IP and a Gateway for an instance's internet connectivity?**

</div>

<div class="grid grid-cols-1 gap-2 mt-2">
<div class="py-1 px-3 rounded text-xs" style="background: var(--ods-color-neutral-050)">A. The number of instances — Gateway for more than 5; Floating IP for fewer</div>
<div class="py-1 px-3 rounded text-xs font-semibold" style="background: var(--ods-color-primary-050); border-left: 3px solid var(--ods-color-primary-700)">B. Whether inbound internet access is needed (Floating IP) or outbound-only (Gateway) ✓</div>
<div class="py-1 px-3 rounded text-xs" style="background: var(--ods-color-neutral-050)">C. The region — some regions support only Gateway</div>
<div class="py-1 px-3 rounded text-xs" style="background: var(--ods-color-neutral-050)">D. The flavor family — GPU instances require Floating IPs</div>
</div>

<OvhNotice title="Why distractors work">A sounds reasonable (many instances = shared NAT). C and D add plausible but false technical constraints. B requires knowing the inbound vs outbound direction — the core distinction.</OvhNotice>

<!--
Ce couple Floating IP / Gateway est systematiquement mal compris. La cle est la direction du flux.
Gateway = SNAT outbound only. Floating IP = DNAT inbound + SNAT outbound.
Un learner qui a fait le lab 2.3 devrait repondre B immediatement.
-->

---
layout: default
moduleId: "3.4"
slideId: "S08 -- Sample A level"
---

# Sample Question — A Level (Analyze)

**Q-IAC-014** | Domain: IAC | LO: LO-IAC-S07 | Bloom: Apply

<div class="mt-2 p-3 rounded-lg text-sm" style="background: var(--ods-color-neutral-050)">

**Northwind runs `terraform plan` on their production infrastructure with no changes to the .tf files. The plan shows 2 resources to update. What does this indicate?**

</div>

<div class="grid grid-cols-1 gap-2 mt-2">
<div class="py-1 px-3 rounded text-xs" style="background: var(--ods-color-neutral-050)">A. A Terraform provider update has changed the resource schema</div>
<div class="py-1 px-3 rounded text-xs font-semibold" style="background: var(--ods-color-primary-050); border-left: 3px solid var(--ods-color-primary-700)">B. Infrastructure drift — someone modified production resources outside of Terraform ✓</div>
<div class="py-1 px-3 rounded text-xs" style="background: var(--ods-color-neutral-050)">C. The Terraform state file is corrupt and must be deleted</div>
<div class="py-1 px-3 rounded text-xs" style="background: var(--ods-color-neutral-050)">D. The Object Storage backend is not synchronized</div>
</div>

<OvhNotice title="Distractor analysis">A is plausible (provider updates do cause schema diffs). C is the panic response. D is a real issue but an unrelated symptom. B requires knowing what drift means operationally.</OvhNotice>

<!--
Question de niveau Analyse -- le learner doit faire le lien entre "plan non vide sans changement de config" et "drift".
Distractor A est particulierement trompeur car les mises a jour de provider causent effectivement des changements de schema.
La difference: un changement de provider est reproductible; la derive ne l'est pas.
-->

---
layout: default
moduleId: "3.4"
slideId: "S09 -- Sample A level posture"
---

# Sample Question — A Level (Recommend / Posture)

**Q-STO-017** | Domain: STO | LO: LO-STO-A02 | Bloom: Evaluate

<div class="mt-2 p-3 rounded-lg text-sm" style="background: var(--ods-color-neutral-050)">

**Which backup strategy provides the best balance of recovery speed and cost for Northwind's production PostgreSQL server?**

</div>

<div class="grid grid-cols-1 gap-2 mt-2">
<div class="py-1 px-3 rounded text-xs" style="background: var(--ods-color-neutral-050)">A. Daily instance snapshots, 7-day retention, no volume backup</div>
<div class="py-1 px-3 rounded text-xs font-semibold" style="background: var(--ods-color-primary-050); border-left: 3px solid var(--ods-color-primary-700)">B. Daily volume backups to Object Storage + weekly instance snapshots, 30-day retention ✓</div>
<div class="py-1 px-3 rounded text-xs" style="background: var(--ods-color-neutral-050)">C. No backup — rely on RAID for availability</div>
<div class="py-1 px-3 rounded text-xs" style="background: var(--ods-color-neutral-050)">D. Real-time replication to a Cold Archive bucket</div>
</div>

<OvhNotice title="Why A fails">Instance snapshots do NOT include Additional Volume data. B is correct. C confuses availability (RAID) with recoverability. D is impossible — Cold Archive is not real-time.</OvhNotice>

<!--
Question de jugement professionnel -- pas de formule magique, il faut comprendre ce que chaque type de backup couvre.
La distinction instance snapshot vs volume backup est un piege frequent et a fort impact operationnel.
C est un anti-pattern classique qu'on entend en salle.
-->

---
layout: two-cols
moduleId: "3.4"
slideId: "S10 -- Governance"
---

# Question Bank Governance

::left::

**Version control**

- Source of truth: `modules/module-3-4/question-bank.md`
- Every question edit = dedicated commit with rationale in message
- Format: `fix(exam): Q-NET-016 distractor A — correct Gateway count claim`
- PRs reviewed by at least 2 team members before merge

**Access control**

- Repository: private (GitHub)
- Learner-facing materials: never include this file
- Platform import: TBD — scripts to be written once platform is confirmed

::right::

**Annual refresh cadence**

- Review all questions after each major OVHcloud product update
- Flag deprecated-feature questions for removal or rewrite
- Add questions when new LOs are added to the program
- Current bank/exam ratio: 160/60 = 2.67x (comfortable minimum is 2x)

**Discrimination review (after first cohort)**

- Flag questions where >90% correct (too easy) or <30% (ambiguous)
- Review flagged items for distractor quality or LO mis-alignment

<!--
Le ratio actuel 2,67x est genereux. AWS Cloud Practitioner tire 65 questions sur un bank de ~600+.
Pour le premier passage on peut se contenter de 160 -- augmenter apres le retour des premiers examens.
La discrimination review est la mesure qualite la plus importante post-go-live.
-->

---
layout: default
moduleId: "3.4"
slideId: "S11 -- Next steps"
---

# Next Steps — Exam Platform & Import

<div class="grid grid-cols-2 gap-6 mt-6">
<div>

**Platform selection (open decision)**

The question bank is in portable Markdown. Once the platform is selected, an import script will be written to convert to the required format.

Common formats:
- QTI (IMS Question and Test Interoperability)
- CSV/Excel with column mapping
- Proprietary JSON/YAML (platform-specific)
- GIFT format (Moodle-compatible)

<OvhNotice title="Recommendation">
Favor a platform that supports S3-compatible import, question tagging by domain/LO, and a weighted random draw algorithm.
</OvhNotice>

</div>
<div>

**Items to validate with N+1 before go-live**

- [ ] Platform selected and license acquired
- [ ] Import script written and tested
- [ ] Expert validation: at least 1 domain expert per domain reviews questions in their domain
- [ ] 1 internal pilot exam (team members sit the exam blind)
- [ ] Passing score confirmed at 70% (recalibrate if pilot cohort average is <50% or >85%)
- [ ] Retake platform configured (30-day lockout + different draw)
- [ ] Question bank marked as confidential in the repository

</div>
</div>

<!--
Ne pas lancer l'examen sans validation experte. Les questions ont ete produites par le Customer Trainer -- pas par des experts produit.
Chaque domaine doit avoir au moins une relecture par un expert (PM, SE, ou technicien certifie).
Le pilot interne est non-neociable avant toute exposition externe.
-->
