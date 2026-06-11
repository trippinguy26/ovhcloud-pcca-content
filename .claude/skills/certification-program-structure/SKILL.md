---
name: certification-program-structure
description: Use this skill whenever the user wants to start designing a new certification program, learning path, or training curriculum — particularly in the OVHcloud Product Enablement context. Triggers include "let's design Public Cloud - Core Professional", "new certification for [topic]", "start a new program", "build a reference framework", "set up a learning path", "define a certifiable skills matrix", "Phase 1 deliverable for a new certif", or any conversation that begins to scope a training deliverable. Use this skill even when the user does not explicitly ask for "the template" or "Phase 1" — the trigger is the intent to design a certification, not an explicit mention of the structure.
---

# Certification Program Structure (Phase 1 Reference Framework)

This skill captures the documentary structure used to design the Phase 1 reference framework of an OVHcloud certification program. It applies to any certification at any level (Foundation, Associate, Professional, Specialist) and across any track (Cloud Core, Containers, AI, Analytics, Sovereign, Quantum, etc.). The structure was developed and validated for *OVHcloud - Public Cloud - Core Associate* in May 2026 and is the canonical template for all future certifications produced by the Product Enablement team.

## When to invoke

Invoke this skill at the very start of any new certification design effort, **before any content production**. The Phase 1 reference framework must exist and be signed off before any module content, slide deck, lab, or QCM is produced. If the user is already past Phase 1 (content production, pilot delivery, ongoing maintenance), this skill is not the right one — consult the relevant Phase 2+ skills instead (to be produced after pilot delivery).

## What the skill produces

A folder of 19 numbered Markdown files structured for direct import into Confluence (Atlassian) as a hierarchical page tree. The structure is reusable across formats (GitHub, PDF, DOCX).

```
<certification-folder>/
├── 00-README.md                            ← Index + table of contents
├── 01-executive-summary.md                 ← One-page management summary
├── 02-target-persona.md                    ← Learner persona(s) detailed
├── 03-scope-statement.md                   ← In/out scope with rationale
├── 04-skills-matrix/
│   ├── 00-README.md                        ← Overview + quantitative summary
│   ├── 01-<domain>.md
│   ├── 02-<domain>.md
│   └── …                                   ← One file per knowledge domain
├── 05-learning-path-architecture.md        ← Modules, sequencing, durations
├── 06-red-thread-<scenario-name>.md        ← Narrative case running through modules
├── 07-assessment-strategy.md               ← Formative + certifying assessment
├── 08-delivery-format-prerequisites.md     ← Delivery format + learner prerequisites
└── 09-roadmap-next-phases.md               ← Phases 2-3-4 production plan
```

## Workflow — do not skip steps

Each step is validated by the user before producing the next artifact. Producing later artifacts before earlier ones are validated leads to scope drift and rework. Validate persona before scope, scope before matrix, matrix before architecture, and so on.

### Step 1 — Persona definition

Define one or two co-primary personas. For each persona, cover:

- Typical job titles, experience range, company profile
- Technical baseline (entry prerequisites the learner is expected to have)
- Strategic drivers (why this learner shows up to training)
- Common learning motivations (what they want to be able to do at exit)
- Key concerns and objections to address explicitly
- Out-of-scope profiles (anti-personas — who this certification is NOT for)

If two co-primary personas, identify what they share (technical baseline, learning outcomes) and what differs (commercial path, strategic drivers, specific concerns). One curriculum and one red thread should serve both.

### Step 2 — Scope statement

Define explicitly what is in scope and out of scope, with rationale for every exclusion. Categorize out-of-scope items into three buckets:

- **Separate certification tracks** (Kubernetes, AI, Analytics, etc. — defer to a sibling certification)
- **Deferred to a higher level** (HA design, DR, FinOps — defer to Professional level of the same certification family)
- **Out by audience definition** (application development for an operator certification, pre-IT fundamentals, etc.)

Include a **Boundary Cases** subsection that pre-answers predictable questions the user (or future stakeholders) will ask: "do we teach Kubernetes basics?", "do we cover FinOps?", "do we include any GPU content?", etc.

The scope statement is the anti-drift document. It must be precise enough that, six months later, a stakeholder request to add new content can be answered with a clear yes/no by reference to this document.

### Step 3 — Certifiable skills matrix

Organize the certification in **7 to 12 knowledge domains**. Each domain typically maps to either a service family (Compute, Storage, Network) or a transverse concern (Identity & Security, Operations, IaC).

For each domain, define Learning Outcomes (LOs) in three categories:

- **K — Knowledge** (savoir): definitions, concepts, characteristics, positioning
- **S — Skill** (savoir-faire): operational hands-on capability
- **A — Attitude / posture** (savoir-être): reflexes, judgment, recommendation maturity

#### LO ID format

`LO-<DOMAIN_3_LETTERS>-<CATEGORY><NUMBER>` (e.g., `LO-CMP-S03` reads "Compute domain, Skill outcome #3").

#### Bloom verb palette by category

| Category | Typical verbs |
|---|---|
| K | define, identify, list, describe, explain, distinguish, decode |
| S | deploy, configure, connect, create, use, read, restore, implement, verify |
| A | recommend, assess, evaluate, anticipate, justify, choose, apply by reflex |

Every LO must use a measurable verb. Avoid vague verbs like "understand", "know", "be familiar with".

#### Target LO volumes by certification level (rough heuristics)

| Level | Total LOs (target range) |
|---|---|
| Foundation | 50–80 |
| Associate | 80–150 |
| Professional | 150–250 |
| Specialist | 100–200 (depth over breadth) |

Adjust based on the depth-vs-breadth profile of the specific certification.

### Step 4 — Learning path architecture

Define:

- **Total volume**: days × hours (typically 2–5 days for in-person Instructor-Led at Associate level)
- **Module count and duration**: 1h30 default duration; 8–15 modules typical at Associate; more at Professional
- **Module breakdown by domain**: each module covers one or two consecutive sub-domains of the matrix
- **Sequencing rationale**: explicit reasoning for the order chosen (typically follows the operator's mental model of building a stack)
- **Standard module canvas**: the internal structure of every 1h30 module, including the "Sentier battu / Hors piste" prerequisite framing at module entry
- **Standalone deliverability rules**: how a single module can be delivered à la carte, independent of the full path

#### Standard module canvas (default — 1h30)

| Block | Duration | Content |
|---|---|---|
| Sentier battu / Hors piste | 5 min | Assumed prerequisites + remediation pointers for gaps |
| Theory & concepts | 30 min | Slides + legacy/hyperscaler analogies + red-thread step |
| Trainer demonstration | 15 min | Live execution (Manager UI / CLI / IaC) |
| Learner lab | 30 min | Individual or pair hands-on |
| Micro-check QCM | 5 min | 5–7 formative questions (non-certifying) |
| Wrap-up & questions | 5 min | Recap + transition to next module via red thread |

### Step 5 — Red thread scenario

Define a fictional case study that runs across all modules. The case must:

- Have a memorable name (cultural references help: "Northwind", "Contoso", etc.)
- Be realistic in scale (not a Fortune 500, not a 3-person startup — pick a credible mid-market)
- Provide a learner role that all personas can identify with (e.g., "first Cloud Ops engineer at NorthwindCo")
- Progress incrementally as modules are delivered (early modules set up, later modules build, final modules operate)
- Adaptable to customer verticals while preserving core architectural complexity

Document the red thread as a standalone document explaining the company, the starting state (day 0), the per-module progression, and adaptation rules for trainers delivering customized sessions.

### Step 6 — Assessment strategy

Two-tier model by default:

- **Micro-checks** (formative, end of each module, 5–7 QCM questions, 5 minutes, diagnostic only — not part of certification score)
- **Final exam** (certifying, 60–80 QCM questions, 1h30, 70% passing score by default — aligned with AWS Cloud Practitioner and Azure Fundamentals industry standards)

Question distribution proportional to LO weight per domain. Cognitive level distribution typically: 30–35% Remember/Understand (K-driven), 40–45% Apply (S-driven), 20–25% Analyze/Evaluate (A-driven).

Define re-take policy (default: one retake allowed, 30 days minimum delay, different question set drawn from the bank).

Define question bank governance (versioned source of truth, annual refresh, restricted access).

### Step 7 — Delivery format and prerequisites

Define:

- **Primary format**: Instructor-Led / e-learning / hybrid (Associate default: Instructor-Led, in-person)
- **Duration and group size**: typically 6–12 learners for effective lab supervision
- **Commercial channels**: which OVHcloud channels distribute this certification (Professional Services bundle, Enterprise support quota, free tracks for specific audiences)
- **Learner technical prerequisites**: self-declarative checklist at registration
- **Learner logistical prerequisites**: NIC Handle, workstation requirements, tooling installed beforehand
- **Trainer prerequisites**: certification ownership or formal equivalent, train-the-trainer completion, hands-on lab competence
- **Logistical room configuration** (for in-person): connectivity, projection, whiteboard, peer collaboration capability

### Step 8 — Roadmap and next phases

Define what comes after Phase 1:

- **Phase 2 — Module content production**: per-module deliverables (slide deck, trainer notes, demo script, lab handout, lab artifacts, micro-check question set) + cross-module deliverables (red-thread dossier, reference architecture diagrams, master IaC repository, final exam question bank, trainer FAQ kit, glossary). Production typically organized in 2–3 waves.
- **Phase 3 — Pilot delivery and go-live**: at least 2 pilot sessions (one internal, one external) before public launch; pilot feedback report; content adjustments; public-launch readiness checklist.
- **Phase 4 — Ongoing maintenance**: quarterly content review, annual question bank refresh, quarterly trainer sync sessions, customer feedback loop.

#### Mandatory expert validation gate in Phase 2

Every module produced in Phase 2 must pass an **expert walkthrough validation** before any dry-run with internal trainers or customer exposure:

- **Who**: one or more internal experts for the service(s) covered by the module, identified at production time.
- **When**: at the end of module production (slide deck + demo + lab + micro-check question set drafted), **before** the first internal trainer dry-run.
- **Format**: walkthrough in a synchronous meeting (in-person or video). The trainer presents the module end-to-end; the expert challenges, corrects, validates.
- **Outcome**: written acceptance before the module is declared production-complete. Issues flagged → rework → re-present until acceptance.

**Rationale**: the Customer Trainer producing modules is not usually an expert in every service. Expert validation before dry-run prevents the costly path of dry-running technically incorrect content and reworking after exposure.

Include a section listing **open decisions for sign-off** (program parent naming, pricing, free track eligibility rules, credential issuance mechanism, validity duration, pilot timing) — items that require explicit confirmation by the program owner (typically N+1 of the Customer Trainer) before Phase 2 launches.

## Conventions to apply throughout

- **Language**: English US for all artifacts.
- **Format**: Markdown source documents; direct import into Confluence is the primary delivery channel.
- **File naming**: numbered prefixes (`00-`, `01-`, …) enforce display order in Confluence and on the filesystem.
- **Module ID format**: `<DAY>.<MODULE_INDEX>` (e.g., `2.3` = day 2, third module).
- **LO ID format**: `LO-<DOMAIN_3_LETTERS>-<CATEGORY><NUMBER>`.
- **Anti-drift governance**: any scope addition after Phase 1 sign-off requires written justification mapped to learner need, volumetric impact assessment (which module shrinks to accommodate?), explicit LO updates, and N+1 approval.

## Reference implementation

First instance of this template: *OVHcloud - Public Cloud - Core Associate* (Public Cloud Core program, May 2026, updated post-N+1 review).

- 8 knowledge domains
- 110 Learning Outcomes (45 K + 47 S + 18 A)
- 11 modules + pre-exam wrap-up over 3 days, plus a 1h30 final exam
- Red thread: *Northwind Analytics* (European B2B SaaS scale-up, logistics analytics, ~80 employees)
- Two co-primary personas: *Corporate Operator* (Corporate + Digital Scaler OVHcloud segments) and *Digital Starter* (SMEs, freelancers, entrepreneurs)

Use that program's Phase 1 deliverable as the canonical worked example when designing the next certification.

## What this skill does NOT cover

This skill scopes the Phase 1 reference framework only. It does NOT cover:

- Module content production (slides, demos, labs, exercises) — that's Phase 2 and will have its own skill once the first module pilot has validated the production pattern.
- Tech Lab standalone packaging — to be specified in Phase 2.
- Trainer enablement material (FAQ kit, anti-difficulty playbook) — to be specified in Phase 2.
- QUALIOPI compliance checklist — out of immediate scope of the current Product Enablement engagement.

When the user asks about any of those topics, recommend they remain inside this skill for Phase 1 work but signal that a dedicated Phase 2 skill is the right tool once Phase 2 starts.
