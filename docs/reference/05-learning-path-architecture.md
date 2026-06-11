# 05 — Learning Path Architecture

## 1. Volumetric overview

The certification is delivered as a **3-day Instructor-Led, in-person training**, covering 11 modules of 1h30 each, followed by a pre-exam wrap-up session and the final 1h30 multiple-choice exam.

| | Volume |
|---|---|
| Training modules | 11 × 1h30 = **16h30** |
| Pre-exam wrap-up & Q&A | **1h** |
| Final exam (multiple-choice) | **1h30** |
| Programme introduction + wrap-up + feedback | **~1h30** |
| **Total formation time** | **~20h30 over 3 days** |

Effective contact time after pauses and logistics: approximately 18–19 hours.

## 2. Programme — chapter and module breakdown

Each **chapter** corresponds to a domain of the skills matrix. Heavy domains (Compute, Storage, Network) are split into two modules.

### Day 1 — Foundations & Compute *(4 modules — 6h)*

| Module | Title | Domains covered | LOs ciblés |
|---|---|---|---|
| **1.1** | Cloud Foundations & OVHcloud Positioning | 01 | `LO-FND-K01..07`, `LO-FND-A01..02` |
| **1.2** | Public Cloud Project, Regions & Basic IAM | 02 | `LO-PCI-K01..05`, `LO-PCI-S01..06`, `LO-PCI-A01..02` |
| **1.3** | Compute (Part 1) — Instances, Flavors & Deployment | 03 | `LO-CMP-K01..06`, `LO-CMP-S01..04` |
| **1.4** | Compute (Part 2) — Lifecycle, Security & Diagnostics | 03 | `LO-CMP-S05..09`, `LO-CMP-A01..03` |

### Day 2 — Storage, Network & Security *(5 modules — 7h30)*

| Module | Title | Domains covered | LOs ciblés |
|---|---|---|---|
| **2.1** | Storage (Part 1) — Block & Object | 04 | `LO-STO-K01..03`, `LO-STO-S01..05` |
| **2.2** | Storage (Part 2) — File, Snapshots & Backup Strategy | 04 | `LO-STO-K04..06`, `LO-STO-S06..08`, `LO-STO-A01..03` |
| **2.3** | Network (Part 1) — Public, Private & Security Groups | 05 | `LO-NET-K01..02`, `LO-NET-S01..04` |
| **2.4** | Network (Part 2) — vRack, Load Balancer & Gateway | 05 | `LO-NET-K03..07`, `LO-NET-S05..07`, `LO-NET-A01..02` |
| **2.5** | Identity, Access & Security — Beyond Basics | 06 | `LO-SEC-K01..06`, `LO-SEC-S01..05`, `LO-SEC-A01..02` |

*Module 2.5 explicitly applies its outcomes to the hardening of the self-managed PostgreSQL instance running on Northwind's stack (Secret Manager for credentials, IAM for access scoping, network isolation via Security Groups and private network endpoints, Object Storage for backups). This treatment uses Core competencies to operate a database properly without leaving Core scope.*

### Day 3 — IaC, Operations, Wrap-up & Certification *(2 modules + wrap-up + exam — 5h)*

| Module | Title | Domains covered | LOs ciblés |
|---|---|---|---|
| **3.1** | Infrastructure as Code Essentials — CLI & Terraform | 07 | `LO-IAC-K01..04`, `LO-IAC-S01..07`, `LO-IAC-A01..02` |
| **3.2** | Operations — Monitoring, Cost, Quotas & Support | 08 | `LO-OPS-K01..04`, `LO-OPS-S01..05`, `LO-OPS-A01..02` |
| **Wrap-up** | Pre-exam consolidation & Q&A | All domains | Review, mock micro-checks, learner-driven Q&A |
| **Exam** | OVHcloud - Public Cloud - Core Associate — Final QCM | All domains | Proportional coverage |

The 1-hour wrap-up before the exam is a deliberate pacing choice: it consolidates concepts across the 11 modules, lets learners surface remaining doubts, and improves the pass rate without inflating the curriculum.

## 3. Standard module canvas

Every module follows the same 1h30 structure. This canvas is one of the program's anti-fragility assets: it allows any module to be delivered standalone (à la carte) without restructuring the content.

| Bloc | Durée | Contenu |
|---|---|---|
| **Sentier battu / Hors piste** *(known path / off-path)* | 5 min | Prérequis stack + connaissances assumés *(sentier battu)*. Pointeurs de remédiation rapide si gap *(hors piste)*. |
| **Theory & concepts** | 30 min | Slides + legacy-IT analogies + hyperscaler cross-references. Includes the Northwind Analytics red-thread step for the module. |
| **Trainer demonstration** | 15 min | Live execution by the trainer (Manager UI, CLI, or Terraform depending on subject). |
| **Learner lab** | 30 min | Individual or pair hands-on: learner reproduces or extends the demo. |
| **Micro-check QCM** | 5 min | 5-7 questions formatives (pas certifiantes). Validation rapide de l'acquisition. |
| **Wrap-up & questions** | 5 min | Recap and transition to the next module within the Northwind narrative. |

### Why the "Sentier battu / Hors piste" block matters commercially

This block enables **à la carte module sales**: a customer who orders only *Storage Part 2* knows from the module entry which prerequisites are assumed and has remediation pointers to close any gap before the session. This is the structural mechanism that allows modules to live both inside the full learning path **and** as standalone deliverables (single Tech Lab or thematic short).

## 4. Sequencing rationale

The module order follows the **natural mental model of an operator deploying a stack on the Core layer**:

1. **Why are we here?** *(Cloud Foundations)*
2. **Where do we operate?** *(PCI Foundation: project, regions, billing, identity)*
3. **What do we deploy first?** *(Compute: instances)*
4. **How do we persist data?** *(Storage)*
5. **How do we connect things?** *(Network)*
6. **How do we secure the whole thing?** *(Identity, Access & Security, applied to the self-managed PostgreSQL)*
7. **How do we make this reproducible?** *(IaC Essentials)*
8. **How do we run it in production?** *(Operations)*

This sequence is cognitively natural for learners coming from legacy or hyperscaler backgrounds, and it lets the [Northwind Analytics red-thread scenario](./06-red-thread-northwind-analytics.md) progress as a coherent build-out narrative across the three days.

## 5. Module standalone deliverability

The architecture is designed so each module can be delivered **standalone** as part of à la carte training requests or as a Tech Lab. The conditions for standalone delivery are:

- The module's "Sentier battu" prerequisites must be communicated to the customer at order time.
- The "Hors piste" remediation pointers must be available to the learner before the session.
- The lab artifact (code, environment) must work without dependency on artifacts produced in earlier modules of the full path. Where dependencies exist, the standalone version of the lab includes a one-command setup script that reproduces the upstream state.

The Tech Lab catalog (to be produced in Phase 2) will identify which modules and which combinations of modules are eligible for standalone Tech Lab packaging, based on commercial demand and pedagogical coherence.
