# 03 — Scope Statement

This document defines what *OVHcloud - Public Cloud - Core Associate* covers, what it does not cover, and the rationale for each scope decision. It is the anti-drift document: when a stakeholder later asks "can we add Kubernetes?" or "can we cover PostgreSQL Managed?", this is the reference that justifies the answer.

## 0. Definition of "Core"

The word **Core** in the certification name is operational, not decorative. It identifies a specific scope: **the IaaS layer of OVHcloud Public Cloud that customers operate themselves, end to end.**

Concretely, "Core" includes:

1. **Services natively built on OpenStack** (Compute/Nova, Network/Neutron, Block & File & Object Storage on Cinder + Manila + Swift, Identity/Keystone, KMS/Barbican). These are the foundation services that any IaaS deployment relies on.
2. **Services adjacent to the OpenStack stack that are indispensable to a working IaaS deployment**, even though they are not OpenStack-native components themselves: Object Storage S3-compatible API (exposed on top of Swift), vRack (a Layer-2 underlay that connects Public Cloud projects to other OVHcloud products), Floating IPs, the Octavia-based Load Balancer.
3. **The native operation tooling** of the Core layer: OpenStack CLI, the OVHcloud and OpenStack Terraform providers, the native observability surfaces of the Manager (instance metrics, project consumption, quotas, status page).

"Core" explicitly does **not** include managed services that run *on top of* the Core layer (Managed Kubernetes, Managed Databases, AI Endpoints/Training, Analytics-managed services). Those belong to sibling certifications.

This definition is the **single anti-drift criterion** for scope debates. A service either fits the definition (it's in scope) or it doesn't (it goes to a sibling track).

## 1. In-scope services and topics

The Associate certification covers the **operational core of OVHcloud Public Cloud** — what an operator needs to deploy and run a standard production workload end-to-end.

### Compute *(Core: OpenStack Nova-native)*

- Instance families and flavors: Discovery (`d2`), General Purpose (`b3`), CPU-Optimized (`c3`), RAM-Optimized (`r3`), IOPS (`i1`).
- Standard and Flex instance models.
- Instance lifecycle: deploy, snapshot, resize, rescue, delete.
- Three deployment paths: Manager UI, OpenStack CLI, Terraform.
- Cloud-init / user-data customization.

### Storage *(Core: OpenStack Cinder + Swift + Manila native, plus S3-compatible API as adjacent essential)*

- Block Storage (Cinder-based).
- Object Storage with S3-compatible API (exposed on top of Swift).
- File Storage essentials.
- Instance Backup service.
- Cold Archive *(awareness only)*.
- Snapshot vs Backup conceptual distinction (a recurring teaching point).

### Network *(Core: OpenStack Neutron-native, plus vRack and Load Balancer as adjacent essentials)*

- Public Network (Ext-Net) and Private Network (Neutron).
- Floating IP and Additional IP.
- Security Groups.
- Gateway service.
- vRack (operational level — capabilities and usage as IaaS-connectivity essential, not internal architecture).
- Load Balancer (Octavia-based, essential features).
- Anti-DDoS *(awareness only)*.

### Identity, Access & Security *(Core: OpenStack Keystone + Barbican-native, plus OVHcloud IAM layer)*

- OVHcloud IAM (account-wide layer controlling Manager actions).
- OpenStack Keystone identity (project-scoped layer controlling Public Cloud resources).
- Roles: admin, member, reader.
- Application credentials.
- Secret Manager (basic usage).
- KMS *(awareness — conceptual introduction)*.

### Infrastructure as Code Essentials *(Core: native operation tooling)*

- OpenStack CLI: installation, authentication, essential commands.
- Terraform: installation, OVHcloud and OpenStack providers, basic workflow (`init`, `plan`, `apply`, `destroy`).
- Local state file *(remote state and CI integration are Professional-level)*.

### Operations *(Core: native observability and management)*

- Native observability surfaces (Manager dashboards, instance metrics, project consumption views).
- Cost tracking and consumption review.
- Quotas and limits.
- OVHcloud status page reading.
- Support ticket lifecycle (basic).
- Log Data Platform *(awareness only)*.

### Foundational concepts

- Cloud service models (IaaS, PaaS, SaaS) and deployment models (public, private, hybrid, multi-cloud).
- Shared responsibility model.
- OVHcloud strategic positioning vs US hyperscalers (sovereignty, pricing transparency, open standards, no egress fees).
- OpenStack awareness: enough to read CLI output, understand a 403 Keystone error, and navigate the service catalog. **Not** an OpenStack deep-dive.

## 2. Out-of-scope — and why

### Out of scope: separate sibling certifications

These services are valuable and used by OVHcloud Public Cloud customers, but they sit **on top of** the Core layer rather than being part of it. Each becomes its own certification track.

| Topic | Why out of scope | Sibling certification |
|---|---|---|
| Managed Kubernetes Service, Rancher, Managed Private Registry | Built on Core but require a dedicated operational mental model | *OVHcloud - Public Cloud - MKS Associate* (planned) |
| **Managed Databases** (PostgreSQL, MySQL, MongoDB, Valkey, etc.) | Run on Core but are managed services with their own operational concerns (HA, failover, version upgrades, sizing) | *OVHcloud - Public Cloud - DBaaS Associate* (planned) — will receive the Managed PostgreSQL content originally drafted in earlier Core Associate iterations |
| AI Notebooks, AI Training, AI Deploy, AI Endpoints, NVIDIA NGC | Specialty workload domain with distinct audience | *OVHcloud - Public Cloud - AI Associate* (planned) |
| Data Analytics (Kafka, OpenSearch, Data Processing Engine, Lakehouse) | Specialty market with distinct audience | *OVHcloud - Public Cloud - Analytics Associate* (planned) |
| Quantum Computing | Niche, specialty audience | Quantum specialty (future) |
| Bare Metal Cloud and Hosted Private Cloud as primary subjects | Separate product lines | Dedicated certification tracks |
| Sovereign Cloud advanced topics (S3NS, Sens, dedicated zones) | Specialty audience | Sovereign Cloud certification (future) |
| HPC | Niche audience | HPC specialty (future) |

### Out of scope: deferred to higher levels of the Public Cloud Core family

These topics build on Core Associate competencies but require operational maturity beyond entry-level.

| Topic | Where it belongs |
|---|---|
| High Availability architecture design | *OVHcloud - Public Cloud - Core Professional* |
| Disaster Recovery design and execution | *OVHcloud - Public Cloud - Core Professional* |
| Multi-region architectures | *OVHcloud - Public Cloud - Core Professional* |
| FinOps optimization | *OVHcloud - Public Cloud - Core Professional* |
| Advanced IaC patterns (remote state, CI integration, modules at scale, GitOps) | *OVHcloud - Public Cloud - Core Professional* |
| OpenStack internal architecture (Neutron overlay, leaf/spine, Geneve) | *OVHcloud - Public Cloud - Core Professional* |
| SDK and programmatic integration (Python, Go SDKs, MCP, SHAI agent) | *OVHcloud - Public Cloud - Core Professional* and developer tracks |
| GPU instances and AI-adjacent compute | AI specialty |

### Out of scope by audience definition

- **Application development**: this certification trains operators, not application developers. Code-level concerns (CI/CD pipeline implementation, application observability, performance tuning of application code) are out of scope.
- **Pre-IT fundamentals**: Linux command line, TCP/IP basics, virtualization principles, and AD/LDAP awareness are prerequisites, not training content.

## 3. Boundary cases — explicit clarifications

These are the questions that will come up; this section pre-answers them to avoid Phase 2 drift.

- **"Do we teach Managed PostgreSQL?"** No — it sits on top of Core and belongs to the future *Public Cloud - DBaaS Associate* sibling. In the curriculum, the existing PostgreSQL is self-managed on a Compute instance, and we apply Core competencies (Security Groups, IAM, Secret Manager, network isolation, Object Storage for backups) to operate it properly. The handoff to a managed service is mentioned as a recommendation, not as a hands-on exercise.
- **"Do we teach how to set up a CI pipeline on PCI?"** No. We teach how to provision the infrastructure that a CI pipeline would use. The pipeline itself belongs to a DevOps / developer track.
- **"Do we teach Kubernetes basics, even superficially?"** No. Even superficial Kubernetes coverage opens a Pandora's box of follow-up questions in class that cannot be closed in an Associate slot. We name *Managed Kubernetes Service* as a portfolio entry in the Cloud Foundations module, and stop there.
- **"Do we teach FinOps?"** No. We teach **cost awareness**: reading consumption, identifying top contributors, applying a cost-review reflex. FinOps (optimization strategies, reserved capacity, rightsizing automation) is Professional-level.
- **"Do we teach how to use the OVHcloud API directly?"** Partially. We teach how to generate API credentials and we name the API as one of the three control planes. We do not teach API call construction in depth — that belongs to IaC (Terraform) at Associate, and to SDK usage at Professional+.
- **"Do we include any GPU content?"** No. GPU is named in the flavor families table (`t1`, `t2`) as a portfolio item; we do not deploy GPU instances in labs.
- **"Do we cover Sovereign Cloud (S3NS, Sens) products?"** No. Sovereignty as a **positioning argument** for OVHcloud Public Cloud is in scope (Cloud Foundations module). Sovereign Cloud as a **product family** is out of scope — separate certification.

## 4. Scope change governance

Any proposed addition to scope after Phase 1 sign-off requires:

1. A written justification mapped to learner persona need or business value.
2. A volumetric impact assessment (which existing module shrinks to accommodate the addition?).
3. A learning outcomes update (which `LO-XXX-YYY` are added, removed, or modified?).
4. Confirmation that the addition fits the **definition of Core** stated in Section 0. If it does not, it belongs to a sibling certification, not this one.
5. Sign-off from Customer Trainer + N+1.

Scope additions made without this governance create silent drift, cognitive overload for learners, and erode the certification's signal value on the market.
