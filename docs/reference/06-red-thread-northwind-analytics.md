# 06 — Red-Thread Scenario: Northwind Analytics

## 1. Why a red thread

A red-thread scenario anchors abstract cloud concepts in a concrete, evolving narrative. It serves three functions:

1. **Cognitive anchor** — learners remember "the day we deployed the Northwind frontend" better than "the day we covered `LO-CMP-S01`".
2. **Cross-module continuity** — every module ends with a transition into the next via the scenario, reinforcing that cloud architecture is built incrementally.
3. **Standalone module support** — even when a module is delivered à la carte, the scenario provides a self-contained narrative frame; the learner doesn't need to have followed the previous modules to make sense of it.

## 2. The fictional company

### Northwind Analytics

> *Northwind Analytics* is a growing European B2B SaaS company (~80 employees) building a data analytics product for the logistics industry. The platform is currently hosted on a US hyperscaler but the company has decided, under combined pressure from European customers (sovereignty), finance (cost), and engineering (delivery velocity), to migrate progressively to OVHcloud Public Cloud.
>
> The learner is hired as the **first Cloud Operations engineer** at Northwind, reporting to the CTO. Their mission across the three training days is to build, secure, automate, and operate the new OVHcloud Public Cloud foundation that will host the staging environment first, then production.

### Why this case

| Design choice | Rationale |
|---|---|
| **Scale-up (~80 employees)** | Realistic OVHcloud commercial target. Speaks to Persona A (Corporate Operator including Digital Scaler segment). |
| **Combined pressure (sovereignty + cost + velocity)** | Reflects all three major drivers of Persona A without privileging one. |
| **"First Cloud Ops engineer" role** | Identifiable by both personas: Corporate Operator sees themselves as the hired specialist; Digital Starter projects as the consultant or technical founder helping a scale-up. |
| **B2B logistics industry** | Neutral vertical — not constrained to a regulated sector (healthcare, finance, public) that would limit narrative portability. |
| **Name "Northwind"** | Cultural wink to Microsoft's classic sample database, familiar to most IT professionals. Adopted easily by learners. |

## 3. Northwind's starting state (Day 0)

This is what learners are told on the first morning of training:

- Northwind has signed an OVHcloud contract three weeks ago.
- An empty OVHcloud account exists. No Public Cloud project has been created yet.
- The platform currently hosted on a US hyperscaler consists of:
  - One web frontend (single page application, Node.js).
  - One API backend (Python service exposing REST endpoints).
  - One self-managed PostgreSQL database, running on a regular virtual machine.
  - Static assets and customer-uploaded files stored in an S3 bucket.
- The CTO wants the migration to be done in a way that supports rapid replication for future environments (staging, then production, then potentially a dedicated tenant per major customer).
- The CTO insists on documented and reproducible infrastructure ("we will not manage anything that lives only in someone's browser tabs").
- **The PostgreSQL database remains self-managed throughout the training** — Northwind's CTO will consider a managed database service later in the year, but for now wants the operations team comfortable with running PostgreSQL on top of the Core layer using OVHcloud-native security, network, and storage primitives.

## 4. The red thread across the 11 modules

| Module | Northwind step |
|---|---|
| **1.1 — Cloud Foundations** | The CTO of Northwind presents the migration decision. Why OVHcloud Public Cloud Core, why not the incumbent hyperscaler. Learners challenge or validate the choice. |
| **1.2 — PCI Foundation & Basic IAM** | First day as the new Cloud Ops engineer. We create the project `northwind-staging`, configure billing (voucher credits), issue first credentials. |
| **1.3 — Compute (Part 1)** | First three instances deployed: `nwa-web-staging-01`, `nwa-api-staging-01`, `nwa-pgsql-staging-01` (the self-managed PostgreSQL instance). Discovery flavors for cost, Ubuntu LTS image. |
| **1.4 — Compute (Part 2)** | Instances hardened: SSH key-only, security groups restricting SSH to the office IP, snapshots before any change, console diagnostics on the first failed cloud-init. |
| **2.1 — Storage (Part 1)** | Persistent block volumes attached to the API and PostgreSQL instances. Object Storage bucket created for static assets and user uploads. |
| **2.2 — Storage (Part 2)** | Instance Backup configured on the API instance. **Backup strategy designed for the PostgreSQL self-managed instance: scheduled `pg_dump` to Object Storage with retention policy.** Restore drill on the API instance. |
| **2.3 — Network (Part 1)** | Private network for the staging environment. API and PostgreSQL instances moved to dual-NIC (public bastion temporarily, private for backend traffic). PostgreSQL becomes private-only. |
| **2.4 — Network (Part 2)** | Public Cloud Load Balancer in front of the web frontend with HTTPS termination. Public Cloud private network connected to vRack to anticipate a future Bare Metal connection for log retention. |
| **2.5 — Identity, Access & Security** | Security audit before staging opens. IAM segmentation per team: Ops (full access), Devs (read + restart on staging), Auditors (read-only). **PostgreSQL credentials moved to Secret Manager and rotated. The self-managed PostgreSQL is now fully hardened using only Core capabilities: private network endpoint, IAM-scoped access to the host, Secret Manager for credentials, Object Storage for backups.** |
| **3.1 — IaC Essentials** | "Never by hand again": the entire staging stack is terraformed, then the same Terraform spins up `northwind-production`. The learner discovers the joy of `terraform destroy` followed by `terraform apply`. |
| **3.2 — Operations** | Production is live. The learner sets up the monthly cost-review reflex, opens the first support ticket about a billing question, watches the OVHcloud status page during the first incident. |

## 5. About PostgreSQL Managed (handoff to a sibling certification)

Northwind's CTO mentions, in module 1.1 and again in the wrap-up of day 3, that the company will eventually consider moving the self-managed PostgreSQL to OVHcloud's **Managed PostgreSQL** service to offload the day-2 burden (patching, HA, automated backups). That topic is **not covered in this certification**: it belongs to *OVHcloud - Public Cloud - DBaaS Associate* (sibling certification, future).

The learner leaves the Core Associate certification with the operational maturity required to run a self-managed PostgreSQL credibly on the Core layer — and the awareness that a managed alternative exists when operational simplification becomes worth its premium.

## 6. Production-side artifacts implied by the red thread

To support this red thread, Phase 2 will need to produce the following companion artifacts:

- A **Northwind dossier** for trainers (1-2 pages) describing the company, the CTO's personality, the existing stack, and the migration constraints — used as the opening slide of Module 1.1 and as a referenceable narrative throughout.
- A **Terraform repository** that mirrors the final state of the Northwind staging environment, used as the reference deliverable in Module 3.1.
- A set of **architecture diagrams** representing Northwind's state at the end of each day (3 diagrams).
- **Cloud-init / user-data templates** for the Northwind instances (web frontend, API backend, PostgreSQL host).
- A **PostgreSQL backup automation playbook** (cron + `pg_dump` + Object Storage) used in module 2.2 — this artifact is also a strong candidate for a standalone Tech Lab.

These artifacts are listed in [09 — Roadmap & Next Phases](./09-roadmap-next-phases.md) as Phase 2 deliverables.

## 7. Adaptation guidance for the trainer

The Northwind narrative is the **default**. A trainer may adapt the case study to a customer-specific context when delivering a private session to a single corporate customer (for example, replacing the logistics analytics framing with a healthcare SaaS or a fintech context). The adaptation must respect:

- The same architectural complexity (a web frontend + an API backend + a self-managed database on Core + static assets).
- The same scale-up framing (~80 employees, no enterprise-grade compliance requirements).
- The same migration narrative (existing hyperscaler footprint, motivated migration to OVHcloud Public Cloud Core).
- The "first Cloud Ops engineer" learner role.

Any deviation from these invariants must be discussed with the program owner first, to preserve the certification's signal value.
