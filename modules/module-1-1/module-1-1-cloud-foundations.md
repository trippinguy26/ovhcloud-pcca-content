# Module 1.1 — Cloud Foundations & OVHcloud Positioning
 
## Module Brief
 
- **Module ID**: 1.1
- **Total duration**: 1h30
- **Block breakdown**: Sentier battu 5 min · Theory 30 min · Demo 15 min · Lab 30 min · Micro-check 5 min · Wrap-up 5 min
- **LOs covered**: `LO-FND-K01`, `LO-FND-K02`, `LO-FND-K03`, `LO-FND-K04`, `LO-FND-K05`, `LO-FND-K06`, `LO-FND-K07`, `LO-FND-A01`, `LO-FND-A02`
- **Prerequisite modules**: none — entry module of the program
- **Red-thread step**: Northwind Analytics is introduced. The European B2B SaaS scale-up runs a self-managed PostgreSQL stack on aging bare-metal and must choose a cloud trajectory. This module sets the stage — who Northwind is, why they are evaluating cloud, what options exist — without yet touching OVHcloud Public Cloud (that starts in Module 1.2).
### Pedagogical angle
 
Positioning module, not pure technical content. The goal is to reframe an audience often coming from AWS onto what the OVHcloud Public Cloud Core actually is (native OpenStack, not an AWS clone), defuse biased comparisons from the start, and activate the two A-level LOs — *defend the OVHcloud value proposition to a stakeholder* (`A01`) and *qualify a workload as Core-eligible or not* (`A02`) — through a situational exercise rather than a lecture.
 
### Trainer demonstration
 
10-minute walkthrough of the OVHcloud Manager UI: tour of the OVHcloud organization model (account, organization, Public Cloud project), region locator, and visual scoping of what counts as "Core" versus the rest of the catalog. No deployment — IAM and Compute have not been covered yet. Objective: learners visually recognize the environment they will operate in for the next three days.
 
### Learner lab
 
*Positioning Drill* in pairs (25 min + 5 min debrief). Each pair receives a "stakeholder objection" card (e.g., *"Why not AWS, the leader?"*, *"Our CIO requires multi-cloud — is OVHcloud compatible?"*, *"Core OpenStack is outdated, isn't it?"*) and prepares a 3-point structured rebuttal grounded in module content. Cross-pair restitution. This operationalizes `LO-FND-A01` and `LO-FND-A02` through practice rather than theory.
 
### Micro-check — question intents (drafted in step 6)
 
1. Essential cloud characteristics (NIST) — Remember — `K01`
2. IaaS/PaaS/SaaS service models, placement of OVHcloud Public Cloud Core — Understand — `K02`
3. Shared responsibility model applied to IaaS — Understand — `K03`
4. Operational definition of OVHcloud "Core" — what's in, what's out — Understand — `K05`
5. OVHcloud differentiators vs hyperscalers (sovereignty, predictable pricing, native OpenStack) — Understand — `K06`
6. Qualifying a given workload as a Core candidate or not — Apply — `A02`
### Trainer FAQ — anticipated topics (drafted in step 8)
 
OVHcloud positioning vs AWS/Azure/GCP, concrete meaning of "sovereignty", why OpenStack and not a proprietary stack, multi-cloud and hybrid, pricing vs hyperscalers, place of Bare Metal in the cloud conversation.
 
---
 
## Block 1 — Sentier battu / Hors piste (5 min)
 
### Sentier battu (assumed prerequisites)
 
**Tools:**
- An active OVHcloud account (created beforehand by the training sponsor or by the learner themselves), with Manager access.
- A workstation with a modern browser and unfiltered outbound Internet access to `*.ovh.com` and `*.ovh.net`.
**Knowledge:**
- General IT vocabulary: server, VM, datacenter, IP, DNS, hypervisor.
- A general-public-level notion of "cloud" — has heard of AWS, Azure or GCP, even if never used hands-on.
- Basic intuition of the classical IT economic model (CAPEX vs OPEX).
### Hors piste (remediation pointers)
 
- **If the learner has never used the OVHcloud Manager** → pointer to the *Getting started with the OVHcloud Manager* documentation on `docs.ovhcloud.com`. The trainer covers a quick tour in the Demo block, but autonomous catch-up is expected if the gap is deep.
- **If the learner does not distinguish IaaS / PaaS / SaaS** → the concept is covered in the Theory block (dedicated slide). No prior remediation required, but flag the topic at the start of the module so the learner pays particular attention.
- **If the learner has no notion of virtualization** → pointer to a generic VMware/KVM introduction (short video, e.g., *VMware 101* on the internal portal, or public equivalent). Rare on the Corporate persona, more likely on early-stage Digital Starter.
### Single-slide format
 
**Visual concept**: Two-column slide titled *"Before we start"* — left column *"You are ready if..."* (3 tool items + 3 knowledge items), right column *"If not, here's where to look..."* (3 remediation pointers). Clean framed layout, no superfluous icons.
 
**Trainer notes**:
- Ask by show of hands: *"Who has opened the OVHcloud Manager this week?"* — calibrates the audience early.
- Anticipate that 1-2 Corporate learners have never touched the Manager → reassure: the end-of-module demo covers exactly that.
- If someone arrives without an active account → note the name, get it activated during the break, do not block the module.
- Éviter de basculer en démo Manager dès maintenant — the Demo block does that one hour later.
- Rappeler: this *sentier battu* applies to all 3 days, not just this module.
---
 
## Block 2 — Theory & Concepts (30 min)
 
### Slide S01 — Northwind Analytics, in 2 minutes
 
**Visual concept**: Northwind ID card laid out as a single visual block — placeholder logo, 4 grid cartouches (Business / Size / Current stack / Current pressure), and a minimalist timeline at the bottom showing *"2019 (founded) → 2024 (3× growth) → today (cloud decision)"*.
 
**Talking points**:
- European B2B SaaS scale-up, logistics, ~80 employees
- Self-managed PostgreSQL on bare-metal, hardened in-house
- 3× growth in 18 months, infrastructure under strain
- Leadership wants cloud — vendor not yet chosen
- Our role for 3 days: guide them onto OVHcloud
**Trainer notes**:
- Souligner que Northwind sera notre cas concret pendant les 3 jours — chaque module ajoute une brique à leur infra.
- Anticiper "is this a real company?" → no, pedagogical scenario, but every technical choice is realistic.
- Demander si quelqu'un dans la salle a un profil client similaire — capter les analogies pour les réutiliser plus tard.
- Rappeler que Northwind est ex-baremetal, pas ex-AWS — détail de ton important pour le module.
- Éviter de plonger dans les détails techniques de leur stack — on les déroule au fil des modules.
---
 
### Slide S02 — Cloud, properly defined
 
**Visual concept**: Five horizontally aligned pictograms, one per NIST characteristic, each with its name and a 6-8 word phrase underneath. Discreet footer mention *"NIST SP 800-145, 2011"* for source credibility.
 
**Talking points**:
- On-demand self-service: user provisions without human intervention
- Broad network access: reachable via standard network protocols, anywhere
- Resource pooling: shared resources, dynamically allocated
- Rapid elasticity: fast scale up/down, sometimes automated
- Measured service: usage metered, billed by consumption
**Trainer notes**:
- Souligner que ces 5 critères sont le filtre de réalité : si l'un manque, ce n'est pas du cloud, c'est de l'hébergement.
- Anticiper "and serverless?" → all 5 criteria still hold, it's just a higher abstraction level.
- Vérifier par un mini-sondage : *"votre infra actuelle coche combien de ces cases ?"* — calibre la maturité de la salle.
- Rappeler que la définition NIST date de 2011 et n'a pas bougé — c'est stable, on peut s'y adosser.
- Si quelqu'un cite la définition "marketing" du cloud → recadrer poliment vers le NIST.
---
 
### Slide S03 — IaaS / PaaS / SaaS: who owns what
 
**Visual concept**: Classic 3-column stack diagram (Networking, Storage, Compute, Virtualization, OS, Middleware, Runtime, Data, Application) with a color-coded split per service model showing "you manage" vs "provider manages". A discreet badge marks where OVHcloud Public Cloud Core sits (IaaS).
 
**Talking points**:
- IaaS: provider runs infrastructure, you run everything above the OS
- PaaS: provider also runs OS and runtime, you run the app and data
- SaaS: provider runs everything, you consume the app
- OVHcloud Public Cloud Core = IaaS, with adjacent managed services off-scope here
- The frontier between models is becoming blurry (managed K8s, serverless) — labels matter less than responsibility
**Trainer notes**:
- Souligner que la frontière IaaS/PaaS n'est plus binaire — managed Kubernetes, par exemple, est entre les deux.
- Anticiper la question "Object Storage est-il IaaS ou PaaS ?" → conventionnellement IaaS dans la matrice OVHcloud, même si techniquement c'est managé.
- Si X demande "et le baremetal cloud d'OVHcloud ?" → répondre Y : c'est IaaS aussi, juste sans virtualisation — détail vu en module 1.3.
- Rappeler que sur cette certif on reste en IaaS — les services managés "au-dessus" sont d'autres certifs (MKS, DBaaS).
- Éviter de digresser sur le serverless — pas dans le scope Core Associate.
---
 
### Slide S04 — Shared responsibility applied to IaaS
 
**Visual concept**: A vertical stack diagram split down the middle into "Provider responsibility" (left) and "Customer responsibility" (right). The split line sits between Virtualization and OS. Layers above the line (OS, runtime, middleware, data, access management, application) are on the customer side; layers below (hypervisor, physical compute, storage, network, datacenter) are on the provider side. A small inset shows the same diagram for SaaS and PaaS for comparison.
 
**Talking points**:
- In IaaS, the provider stops at the hypervisor — everything above is yours
- OS patching, hardening, backups: customer responsibility
- Identity, secrets, network ACLs at instance level: customer responsibility
- Physical security, redundancy, hypervisor patching: provider responsibility
- "Shared" doesn't mean "split 50/50" — it means clearly delineated
**Trainer notes**:
- Souligner que ce modèle est universel IaaS — AWS, Azure, OVHcloud, le même contrat de base s'applique.
- Anticiper "et les backups, c'est qui ?" → en IaaS, c'est toi sauf si tu souscris un service de backup explicite (vu en module 2.2).
- Rappeler à l'audience ex-AWS que ce modèle leur est familier — pas de surprise ici, juste un transfert de contexte.
- Si quelqu'un demande où se situent les services managés OVHcloud (Managed K8s, DBaaS) → répondre Y : la ligne remonte, le provider prend en charge plus — mais on sort du Core Associate.
- Vérifier par un mini-cas : *"vous oubliez de patcher l'OS d'une VM, qui est responsable de l'incident ?"* — réponse attendue : le client.
---
 
### Slide S05 — Public, Private, Hybrid, Multi-cloud: what these words mean
 
**Visual concept**: A 2x2 matrix with the four terms in quadrants, each illustrated by a simple icon and a one-line definition. Below the matrix, a horizontal "Northwind likely positioning" arrow points toward "Public + Hybrid" with a small footnote linking to the red thread.
 
**Talking points**:
- Public cloud: shared infrastructure operated by a third-party provider
- Private cloud: dedicated infrastructure, on-prem or hosted, single tenant
- Hybrid: deliberate combination of public + private/on-prem with bridges between them
- Multi-cloud: workloads spread across multiple cloud providers, by design or by drift
- These terms are often confused — clarify before debating
**Talking points (cont.)**:
- Northwind will be Public Cloud with hybridization toward their residual bare-metal
**Trainer notes**:
- Souligner que "multi-cloud" est souvent subi (rachats, shadow IT) plus que choisi — distinguer stratégie et réalité.
- Anticiper "Hosted Private Cloud OVHcloud, c'est quoi alors ?" → c'est du private cloud hébergé chez OVHcloud (VMware), hors scope Public Cloud Core.
- Rappeler que le baremetal OVHcloud peut faire pont vers le Public Cloud via vRack — on en reparle en module 2.4.
- Si X demande "et le souverain dans tout ça ?" → répondre Y : c'est une *propriété* du cloud (public ou privé), pas un type — on creuse en S09.
- Éviter de partir sur les architectures distribuées globales — pas pour aujourd'hui.
---
 
### Slide S06 — The cloud provider landscape
 
**Visual concept**: Three horizontal bands — top "Hyperscalers" (AWS, Azure, GCP with discreet logos), middle "European challengers" (OVHcloud, Scaleway, T-Systems / Open Telekom Cloud, IONOS), bottom "Vertical / specialized" (Outscale, NumSpot, sector-specific players). No size ranking — positioning by category, not by revenue.
 
**Talking points**:
- Hyperscalers: global reach, vast catalog, dominant market share, US/CN jurisdictions
- European challengers: European jurisdiction, sovereignty by design, narrower catalog
- Specialists: niche regulatory or vertical fit (defense, health, sovereign)
- OVHcloud sits in the European challenger band — own datacenters, own backbone, EU jurisdiction
- The honest framing: not "better than", but "different profile of value"
**Trainer notes**:
- Souligner que le marché n'est pas un classement linéaire — c'est un paysage de profils de valeur.
- Anticiper "AWS a X% de part de marché, pourquoi pas eux ?" → la part de marché n'est pas le seul critère, et certains workloads ont besoin de critères que les hyperscalers ne couvrent pas par construction.
- Rappeler la posture du programme : on réconcilie avec OVHcloud, on ne dénigre pas la concurrence — la crédibilité du trainer en dépend.
- Si quelqu'un cite Gartner ou Forrester → noter que ces analyses existent, mais qu'elles mesurent souvent la couverture catalogue, pas l'adéquation à un workload donné.
- Éviter toute affirmation type "OVHcloud est meilleur que AWS" — fausse en absolu, et casse la crédibilité.
---
 
### Slide S07 — OVHcloud Public Cloud: the native OpenStack conviction
 
**Visual concept**: Two stacked layers. Top layer shows an OpenStack logo with the names of the core projects used by OVHcloud (Nova, Neutron, Cinder, Glance, Keystone, Octavia, Swift). Bottom layer shows the OVHcloud-operated foundation (datacenters, backbone, hardware). A small comparison strip on the right shows "AWS proprietary APIs" vs "OpenStack standard APIs" to make the portability point visually.
 
**Talking points**:
- OpenStack is an open-source IaaS framework, governed by the Open Infrastructure Foundation
- OVHcloud Public Cloud is built on native OpenStack — not a wrapper, not a clone
- Consequence: standard APIs, portability, no vendor lock-in at the API layer
- AWS/Azure expose proprietary APIs — leaving them means rewriting integrations
- Trade-off: OpenStack catalog is narrower than AWS — by design
**Trainer notes**:
- Souligner que "natif OpenStack" est une *conviction technologique* d'OVHcloud, pas un détail d'implémentation.
- Anticiper "OpenStack n'est-il pas en perte de vitesse ?" → répondre Y : la couverture média a baissé, l'adoption en production reste forte (CERN, Workday, opérateurs telco). Citer la dernière User Survey si dispo.
- Rappeler aux ex-AWS : leur Terraform AWS ne marchera pas ici, mais leur Terraform peut viser OpenStack avec un provider standard — on le verra en module 3.1.
- Si X demande "et la roadmap, vous suivez OpenStack upstream ?" → répondre Y : OVHcloud contribue upstream et suit les releases, pas un fork divergent.
- Éviter de dénigrer les API propriétaires — c'est un choix légitime, juste différent.
---
 
### Slide S08 — What we call "Core" in this training
 
**Visual concept**: Concentric circles diagram. Inner circle "Core (this certification)" lists Compute (instances, flavors, images), Storage (Block, Object S3, File), Network (Public, Private, vRack, Load Balancer Octavia), Identity & access (basic IAM), Operating tools (Manager, CLI, Terraform). Outer ring "Built on Core, not Core" lists Managed Kubernetes, Managed Databases, AI Endpoints, Analytics, Data Platform. Annotation: "Outer ring → sibling certifications".
 
**Talking points**:
- Core = native IaaS layer + indispensable adjacents (Object S3, vRack, Octavia LB)
- Core also includes the native operating tools: Manager UI, OpenStack CLI, Terraform
- Managed services that *run on* Core (MKS, Managed DB, AI, Analytics) are out of scope here
- They are not "less than" — they are the subject of sibling certifications
- For 3 days, we stay strictly in the inner circle
**Trainer notes**:
- Souligner que le périmètre Core est un choix pédagogique, pas une hiérarchie de valeur — MKS et DBaaS sont essentiels en production, juste pas ici.
- Anticiper "alors comment Northwind hébergera son PostgreSQL ?" → répondre Y : en self-managed sur des instances Core, hardened — c'est exactement ce qu'on construit ensemble.
- Rappeler que les certifs sœurs (MKS Associate, DBaaS Associate) viendront couvrir l'anneau extérieur — pas ce programme.
- Si quelqu'un demande pourquoi pas tout couvrir en une seule certif → répondre Y : profondeur vs largeur, on a choisi la profondeur sur le Core.
- Vérifier la compréhension : *"je veux déployer Postgres managé, je suis dans le scope ?"* — réponse attendue : non.
---
 
### Slide S09 — OVHcloud differentiators, seen from the buyer
 
**Visual concept**: Four quadrants, each headed by a one-word axis (Sovereignty / Predictability / Openness / Integration), each containing 2-3 bullet evidence points. Below the grid, a single line: *"A value profile, not a claim of superiority."*
 
**Talking points**:
- Sovereignty: European jurisdiction, GDPR-native, SecNumCloud-qualified offers available
- Predictability: flat pricing, no egress fees on Public Cloud, transparent quotas
- Openness: native OpenStack APIs, S3-compatible object storage, no API lock-in
- Integration: seamless bridge between Bare Metal, Hosted Private Cloud and Public Cloud via vRack
- These four axes are how Northwind's CIO will defend the choice internally
**Trainer notes**:
- Souligner que ces 4 axes sont l'argumentaire à mobiliser dans le Positioning Drill du lab — c'est la slide la plus opérationnelle du module.
- Anticiper "et la performance brute ?" → répondre Y : compétitive, mais ce n'est pas un différenciateur — les hyperscalers font bien aussi. Le différentiel est sur les 4 axes ci-dessus.
- Rappeler que "pas d'egress fees sur Public Cloud" est un argument économique majeur — Northwind serait pénalisée chez un hyperscaler si elle exporte ses analytics.
- Si X demande "SecNumCloud, c'est quoi ?" → répondre Y : qualification ANSSI niveau le plus exigeant pour cloud — on en reparle en module 2.5.
- Éviter de transformer la slide en pitch commercial — rester factuel, l'audience est technique.
---
 
### Slide S10 — Qualifying a workload for the Core: the grid
 
**Visual concept**: A decision-grid laid out as four questions stacked vertically, each with two branching outcomes (Yes / No) drawn as a discreet flowchart. At the bottom, a single decision band: "Core candidate" / "Not a Core candidate (consider sibling offers)". Footer note: *"Used as the framing for the Positioning Drill that follows."*
 
**Talking points**:
- Q1: Does the workload tolerate self-managed IaaS (OS, runtime, data on you)?
- Q2: Does it need managed services beyond Core (MKS, DBaaS, AI)?
- Q3: Is sovereignty or EU data residency a hard requirement?
- Q4: Is the cost profile favorable (steady or predictable, not extreme burst)?
- A "yes-yes-no-yes" pattern is a clear Core fit; mixed answers warrant sibling offers
**Trainer notes**:
- Souligner que la grille est un *outil de conversation*, pas un référentiel commercial — elle sert à structurer la pensée.
- Anticiper "et si je réponds 'oui' à Q2 ?" → répondre Y : il existe sans doute une offre sœur (MKS, DBaaS) — pas un échec, juste un autre périmètre.
- Rappeler que cette grille sera mobilisée dans le Positioning Drill juste après — les apprenants doivent la garder en tête.
- Si quelqu'un veut une grille plus exhaustive → répondre Y : il en existe en interne (Solution Architect), mais pour Associate cette grille à 4 axes suffit.
- Demander avant de basculer en démo : *"un workload de votre boîte qui passerait cette grille ?"* — capter 1-2 exemples concrets pour le Positioning Drill.
---
 
## Block 3 — Trainer Demonstration (15 min)
 
### Demo scenario
 
Guided walkthrough of the OVHcloud Manager UI (10 min of demo + 5 min Q&A) to visually anchor where learners will operate for the next 3 days. **No deployment is performed** — IAM and Compute have not been covered yet. The end state is purely cognitive: the learner can navigate the Manager, locate a Public Cloud project, identify the available regions, and visually distinguish what falls inside Core scope from what doesn't.
 
Delivery channel: **Manager UI only** (no CLI, no Terraform — those come in Module 3.1).
 
### Demo script
 
| Step | Action | Expected output | Trainer commentary |
|---|---|---|---|
| 1 | Log into `www.ovh.com/manager` with the trainer demo account | Manager landing page, universe selector visible top-left | "Voilà la porte d'entrée unique pour tous les produits OVHcloud — Web, Bare Metal, Public Cloud, Hosted Private Cloud." |
| 2 | Open the universe selector, point to *Public Cloud* | Universe menu with all OVHcloud product families | "Chaque univers a son propre Manager. Nous allons vivre dans celui-ci." |
| 3 | Enter the *Public Cloud* universe | Public Cloud Manager landing, project selector top-left | "L'unité de facturation et d'isolation logique, c'est le **projet Public Cloud** — équivalent d'un compte AWS ou d'une subscription Azure." |
| 4 | Open the project selector, show the demo project | List of projects accessible to the account | "On peut avoir plusieurs projets. Northwind aura le sien — on le créera ensemble en 1.2." |
| 5 | Click into the demo project, land on the project dashboard | Project dashboard with left-hand navigation menu (Compute, Storage, Network, Management, Operations) | "Le menu de gauche est votre carte des 3 jours. Compute, Storage, Network — un module chacun ou presque." |
| 6 | Open *Instances* (empty or with demo VMs) | Instances list view | "Ici on déploiera nos VMs. On y revient en 1.3." |
| 7 | Open *Regions* (or *Locations* depending on UI version) | Region map / list, EU + global regions visible | "Chaque ressource vit dans une région. Souveraineté = vous choisissez. On creuse en 1.2." |
| 8 | Navigate to *Object Storage*, then *Block Storage*, then *Network* | Each section's empty/landing view, briefly | "Tour rapide — chaque section sera son propre module. L'objectif aujourd'hui : reconnaître les noms." |
| 9 | Open *Quotas & Limits* under Management | Quotas page showing default limits | "Garde-fou natif. On y reviendra en Operations (3.2) — pour l'instant, sachez juste que ça existe." |
| 10 | Back to dashboard, point to the *Documentation* and *Support* shortcuts | Header shortcuts visible | "Deux réflexes à acquérir : la doc est sur `docs.ovhcloud.com`, le support se déclenche depuis le Manager lui-même." |
 
### Common demo failure modes
 
- **Manager session expired mid-demo** → re-authenticate via the SSO popup. Trainer should pre-warm the session 5 min before the block.
- **Demo project quota at 0 or project frozen** → switch to a backup demo project (have a second one ready). Mention to the audience that quota-zero projects exist by design (cost protection) and that we'll handle quotas in Module 3.2.
- **UI shows a feature flag or version different from learner UI** → acknowledge the discrepancy ("the Manager evolves continuously, your view may differ slightly"), focus on concepts not pixel-perfect parity.
---
 
## Block 4 — Learner Lab (30 min)
 
### Lab brief (learner-facing)
 
**Positioning Drill** — In pairs, you receive a *stakeholder objection card*. Your stakeholder is a real decision-maker (CIO, CFO, architect, procurement lead) raising a real-world objection to choosing OVHcloud Public Cloud for Northwind Analytics. In 20 minutes, prepare a structured 3-point rebuttal grounded in the module content. In the remaining 10 minutes, each pair presents to one other pair, who plays the stakeholder and pushes back. Cross-restitution, no plenary debrief.
 
This lab is not technical — it is the practical activation of `LO-FND-A01` (defend the value proposition) and `LO-FND-A02` (qualify a workload). The success criterion is your ability to defend the choice, not to recite the slides.
 
### Lab steps (learner-facing)
 
1. Form pairs (trainer assigns or self-organized depending on group size).
2. Draw one objection card from the deck (trainer-managed, see card list below).
3. (20 min) Prepare a 3-point structured response. Each point must:
   - Reference a concrete OVHcloud differentiator (Sovereignty / Predictability / Openness / Integration).
   - Cite either a Northwind context element or the qualification grid (S10).
   - Anticipate one counter-objection and address it.
4. Pair with another pair. One pair plays Northwind's advocate, the other plays the stakeholder.
5. (5 min per pair) Defend your position. Stakeholder pair pushes back at least once.
6. Swap roles for the second round (5 min).
7. No plenary debrief — the cross-restitution is the debrief.
### Objection card deck
 
The trainer brings a printed deck (one card per pair + 2 spares). Suggested objections, calibrated to the persona:
 
- **Card 1 — "Why not AWS, the market leader?"** *(CIO, ex-hyperscaler)*
- **Card 2 — "Our compliance team requires EU data residency end-to-end."** *(DPO)*
- **Card 3 — "We need predictable monthly costs, no surprise egress fees."** *(CFO)*
- **Card 4 — "Our DevOps team standardized on Terraform — will it work here?"** *(Lead Engineer)*
- **Card 5 — "We want to keep our existing bare-metal — can we bridge?"** *(Infra Manager)*
- **Card 6 — "OpenStack feels outdated — is OVHcloud betting on a dying horse?"** *(Architect)*
- **Card 7 — "We need a managed Postgres — does OVHcloud have it?"** *(Application Owner)*
- **Card 8 — "Multi-cloud is mandatory in our group policy."** *(Group CTO)*
Card 7 is the *trap card*: the correct answer is partially "yes, but DBaaS is not Core — for Associate scope, Northwind self-manages on Core instances." Use it for the strongest pair to surface the Core/non-Core distinction live.
 
### Validation criteria
 
- The pair can articulate their 3 points without reading their notes.
- Each of the 3 points references a concrete OVHcloud differentiator and at least one element from S08-S10.
- The pair handles at least one counter-objection from the stakeholder pair without collapsing into "I don't know".
- The trainer hears at least one mention of the qualification grid (S10) across the pair's defense.
### Lab artifacts to produce
 
- One handwritten or typed *3-point rebuttal sheet* per pair (kept by the pair, not collected — it's a personal asset for future commercial conversations).
### Common lab support questions
 
- *"My objection is too easy / too hard — can we swap cards?"* → No. The constraint is part of the exercise. The trainer may, in extreme mismatch, allow one swap mid-prep.
- *"Can we use information from outside the module?"* → Yes, you may use your prior experience, but every point must connect to something from this module.
- *"What if the stakeholder's objection is actually valid?"* → Acknowledge it. Defending honestly includes recognizing trade-offs. The grid (S10) explicitly accepts "not a Core fit" as a legitimate outcome.
- *"We disagree inside the pair on the answer."* → Good. Resolve the disagreement before facing the other pair. The exercise is also about internal alignment.
- *"Do we get a 'right answer' sheet at the end?"* → No, this is not a quiz. The wrap-up will surface common patterns the trainer noticed across pairs, but there is no canonical answer.
---
 
## Block 5 — Micro-check QCM (5 min)
 
Format: 6 single-answer multiple-choice questions, formative (non-certifying). Learners answer individually on paper or in the LMS. Trainer reveals correct answers and rationales at the end of the 5 minutes — no in-depth debrief, questions parked for the wrap-up if needed.
 
### Question 1
 
- **Stem**: Among the following, which is **NOT** one of the five essential characteristics of cloud computing as defined by NIST?
- **Correct answer**: C. Guaranteed uptime SLA
- **Distractors**:
  - A. On-demand self-service — *Why wrong*: this IS one of the five characteristics
  - B. Rapid elasticity — *Why wrong*: this IS one of the five characteristics
  - D. Measured service — *Why wrong*: this IS one of the five characteristics
- **LO traced**: `LO-FND-K01`
- **Bloom level**: Remember
### Question 2
 
- **Stem**: A customer deploys a virtual machine on OVHcloud Public Cloud, installs their own operating system image, and runs their own application on it. Which service model best describes what they are consuming?
- **Correct answer**: B. IaaS — the provider operates the infrastructure layer, the customer manages everything from the OS upward
- **Distractors**:
  - A. PaaS — *Why wrong*: PaaS implies the provider also manages OS and runtime; here the customer manages the OS themselves
  - C. SaaS — *Why wrong*: SaaS is a turnkey application consumed by end users, not a virtual machine
  - D. On-premise — *Why wrong*: the infrastructure is operated by OVHcloud in a shared cloud environment, not by the customer in their own datacenter
- **LO traced**: `LO-FND-K02`
- **Bloom level**: Understand
### Question 3
 
- **Stem**: In the IaaS shared responsibility model, which of the following is the **customer's** responsibility?
- **Correct answer**: A. Patching the guest operating system on a Public Cloud instance
- **Distractors**:
  - B. Patching the hypervisor — *Why wrong*: hypervisor patching is on the provider side of the line in IaaS
  - C. Physical security of the datacenter — *Why wrong*: physical security is always on the provider side
  - D. Redundancy of the storage backend — *Why wrong*: backend redundancy of the IaaS storage service is provided by OVHcloud
- **LO traced**: `LO-FND-K03`
- **Bloom level**: Understand
### Question 4
 
- **Stem**: Northwind Analytics keeps part of its workload on bare-metal servers and plans to deploy new workloads on OVHcloud Public Cloud, with network connectivity between the two. Which cloud deployment model best describes the target architecture?
- **Correct answer**: C. Hybrid cloud — a deliberate combination of public cloud and dedicated/on-premise infrastructure with bridges between them
- **Distractors**:
  - A. Public cloud only — *Why wrong*: the bare-metal component is not part of the shared public cloud — it's dedicated infrastructure that remains in use
  - B. Private cloud — *Why wrong*: private cloud means single-tenant dedicated infrastructure; the new workloads will run on shared Public Cloud
  - D. Multi-cloud — *Why wrong*: multi-cloud means workloads spread across **multiple public cloud providers**; here a single provider is involved
- **LO traced**: `LO-FND-K04`
- **Bloom level**: Understand
### Question 5
 
- **Stem**: Which of the following is a **structural differentiator** of OVHcloud Public Cloud compared to the major hyperscalers?
- **Correct answer**: D. No egress fees on Public Cloud bandwidth
- **Distractors**:
  - A. Largest service catalog on the market — *Why wrong*: OVHcloud's catalog is narrower than hyperscalers — by design, not by accident
  - B. Proprietary IaaS APIs — *Why wrong*: OVHcloud uses native OpenStack APIs, exactly the opposite of proprietary
  - C. US-based jurisdiction — *Why wrong*: OVHcloud is headquartered in France with EU jurisdiction — a key sovereignty point
- **LO traced**: `LO-FND-K06`
- **Bloom level**: Understand
### Question 6
 
- **Stem**: Northwind Analytics wants to migrate a workload to OVHcloud Public Cloud. The workload requires a **managed PostgreSQL service with automatic failover and managed backups**. Using the Core qualification grid, what is the right conclusion?
- **Correct answer**: C. Not a Core candidate — the managed PostgreSQL need points to DBaaS, which is a sibling offer outside Core Associate scope
- **Distractors**:
  - A. Core candidate — deploy PostgreSQL on a Public Cloud instance — *Why wrong*: self-managed on instances IS Core, but the requirement explicitly asks for a *managed* service with automatic failover — that's not Core
  - B. Core candidate — use Object Storage to back up the database — *Why wrong*: backup target is a detail; the core requirement (managed DB with failover) is what disqualifies Core scope
  - D. Not a Core candidate — OVHcloud has no PostgreSQL offering — *Why wrong*: OVHcloud does have Managed Databases, but it sits *outside* Core Associate
- **LO traced**: `LO-FND-A02`
- **Bloom level**: Apply
---
 
## Block 6 — Wrap-up & Transition (5 min)
 
### Recap (1-2 lines)
 
The learner can now define cloud computing rigorously, place OVHcloud Public Cloud on the IaaS/PaaS/SaaS map, articulate OVHcloud's value profile across four axes (sovereignty, predictability, openness, integration), and apply a 4-question grid to qualify a workload as a candidate or not for the scope covered by this certification.
 
### Transition to Module 1.2 via the red-thread scenario
 
Northwind Analytics has been introduced, and the team is convinced the OVHcloud Public Cloud value profile fits. Decision made — now the operational questions arrive: *Where do we open an account? How do we structure projects? Which regions do we pick? Who in the team gets which permissions?* These are exactly the foundations covered in **Module 1.2 — Public Cloud Project, Regions & Basic IAM**, which we attack right after the break.
 
### Single-slide format
 
**Visual concept**: Split slide. Left side: a tight 5-bullet recap of what the learner now knows/can do (mirroring the recap above). Right side: a "Next stop" preview block featuring Northwind's logo and the title of Module 1.2 with three teaser questions ("Where? How? Who?"). A discreet timeline at the bottom reminds learners they are at 1/11 of the journey.
 
**Trainer notes**:
- Rappeler que le Positioning Drill vient de leur donner un outil utilisable demain en clientèle — pas juste un exercice scolaire.
- Souligner qu'on quitte la conviction (pourquoi OVHcloud ?) pour entrer dans l'opération (comment on commence ?).
- Anticiper la fatigue cognitive du premier module — annoncer la pause et le timing précis du retour.
- Si quelqu'un a une question parking issue du Positioning Drill non résolue → noter sur un flipchart "parking", reprendre au wrap-up de fin de jour.
- Éviter de débuter Module 1.2 pendant les 5 dernières minutes — laisser respirer.
---
 
## Block 7 — Trainer FAQ
 
Anticipated questions the persona is likely to raise during this module. Vetted answers, 3-5 lines each. The trainer reads this section before the session, not during.
 
### Q1 — "Concretely, OVHcloud vs AWS — when do I choose which?"
 
The honest answer is workload-dependent, not vendor-dependent. AWS wins when the workload needs an extensive managed-service catalog (Lambda, DynamoDB, SageMaker) or a global edge presence beyond what OVHcloud regions cover. OVHcloud wins when EU jurisdiction is a hard requirement, when bandwidth-heavy workloads make egress fees painful, or when integration with existing bare-metal is a structural need. The qualification grid in S10 is the conversation tool — do not turn this into a religious debate.
 
### Q2 — "What does 'sovereignty' actually mean for OVHcloud?"
 
Three concrete layers. First, **jurisdictional**: OVHcloud is a French company subject to EU law, with no US-law extraterritorial exposure (no CLOUD Act, no FISA). Second, **operational**: OVHcloud owns its datacenters, designs its hardware, runs its own backbone — no dependency on a hyperscaler underneath. Third, **certifications**: SecNumCloud-qualified offers exist for the most demanding sovereignty needs. "Sovereignty" is not a marketing word here — it has a verifiable technical and legal substance. Detailed treatment in Module 2.5.
 
### Q3 — "Why OpenStack and not a proprietary stack like AWS?"
 
Strategic conviction. OpenStack is open-source, governed by a foundation, with standard APIs reusable across compatible providers. Choosing OpenStack means OVHcloud customers are not locked into proprietary APIs — their Terraform code, their automation, their tooling remain portable. The trade-off is a narrower service catalog than hyperscalers, which is accepted by design. OVHcloud contributes upstream and tracks OpenStack releases — not a divergent fork.
 
### Q4 — "Is multi-cloud or hybrid supported well?"
 
Hybrid: yes, structurally. The **vRack** allows L2 connectivity between OVHcloud Public Cloud, Bare Metal, and Hosted Private Cloud, which makes hybrid architectures clean to build (covered in Module 2.4). Multi-cloud: yes in the sense that OVHcloud uses standard APIs (OpenStack, S3), so customers running tools like Terraform or Kubernetes can target OVHcloud alongside other providers. OVHcloud does not, however, sell a multi-cloud control plane — it sells a sovereign public cloud that plays well with others.
 
### Q5 — "How does pricing compare to hyperscalers?"
 
Three structural points to communicate, not detailed numbers (which change). First, **no egress fees** on Public Cloud bandwidth — this is the single biggest cost differentiator for data-intensive workloads. Second, **flat pricing** with published rates, no tiered surprises. Third, **predictable monthly invoices**. Hyperscalers may be cheaper on raw compute hours for specific instance types, but total cost of ownership including egress, support and reserved-instance complexity often tilts in OVHcloud's favor. Refer technical buyers to the public pricing pages, refer commercial buyers to their Account Manager.
 
### Q6 — "Where does Bare Metal fit in the cloud conversation?"
 
Bare Metal is OVHcloud's historical core business and still represents a major part of the offer. It is **not Public Cloud** (no hypervisor, no on-demand elasticity in the cloud-native sense), but it sits within the same OVHcloud universe and integrates via vRack. For customers like Northwind who already operate bare-metal, the right narrative is *complementarity*, not *replacement* — keep bare-metal for what it does well (predictable heavy workloads, specialized hardware) and use Public Cloud for what bare-metal cannot do (elasticity, ephemeral environments, managed adjacents). Bare Metal is out of scope for this certification but a frequent source of audience questions.
 
### Q7 — "Does Module 1.1 get re-used if delivered standalone?"
 
Yes, with one adjustment. In standalone delivery (à la carte training, Tech Lab), the trainer adds a 2-minute opener clarifying that Northwind Analytics is a scenario used as the red thread for the full certification, and that the Positioning Drill exercise stands on its own value (transferable skill: defending a cloud choice to a stakeholder). The rest of the module needs no modification. The *Sentier battu / Hors piste* block already declares prerequisites explicitly, which is what enables standalone delivery.
 
---
