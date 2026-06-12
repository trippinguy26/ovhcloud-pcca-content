# Module 3.3 — Wrap-up — Pre-exam Consolidation & Q&A

## Module Brief

- **Module ID**: 3.3
- **Total duration**: 1h
- **Block breakdown**: Full arc 10 min · Domain flash review 25 min · Mock exam 15 min · Learner Q&A 5 min · Exam logistics 5 min
- **Program**: OVHcloud — Public Cloud — Core Associate
- **Nature**: Non-standard module — no new LOs, no demo, no lab. Structured review across all 11 modules + exam preparation.
- **LOs covered**: ALL program LOs across all 8 certification domains (reviewed — not introduced for the first time):
  - FND: `LO-FND-K01`–`K07`, `LO-FND-A01`–`A02`
  - PCI: `LO-PCI-K01`–`K05`, `LO-PCI-S01`–`S06`, `LO-PCI-A01`–`A02`
  - CMP: `LO-CMP-K01`–`K06`, `LO-CMP-S01`–`S03`, `LO-CMP-S05`–`S09`, `LO-CMP-A02`–`A03`
  - STO: `LO-STO-K01`–`K06`, `LO-STO-S01`–`S08`, `LO-STO-A01`–`A03`
  - NET: `LO-NET-K01`–`K07`, `LO-NET-S01`–`S07`, `LO-NET-A01`
  - SEC: `LO-SEC-K01`–`K06`, `LO-SEC-S01`–`S05`, `LO-SEC-A01`–`A02`
  - IAC: `LO-IAC-K01`–`K04`, `LO-IAC-S01`–`S07`, `LO-IAC-A01`–`A02`
  - OPS: `LO-OPS-K01`–`K04`, `LO-OPS-S01`–`S05`, `LO-OPS-A01`–`A02`
- **Prerequisite modules**: All 11 modules (1.1 through 3.2) completed.
- **Red-thread step**: Northwind Analytics is fully operational — the CTO's original constraint ("nothing managed only by browser tabs") has been met: the stack is declared as code, secured with IAM, and monitored via the Manager. The learner's role now shifts from engineer to exam candidate. This session closes the learning arc, stress-tests readiness, and sets exam-day expectations.

### Pedagogical angle

This module is structurally unlike the 11 preceding it. No new cognitive territory is covered; the purpose is **consolidation, gap-filling, and confidence calibration**. The trainer's primary task is reading the room: a group that is confident may spend most of the 25-minute review block on the domains where questions arise naturally. A group with visible anxiety in a specific domain (networking tends to generate the most) needs the trainer to slow down and anchor the key 2-3 concepts before moving on.

The **mock exam block** is intentionally designed in the same format as the certification exam (4-option single-answer MCQ) so that learners experience the cognitive mode they will enter 5 minutes after this session ends. The 10 questions span all 8 domains — no domain is exempt. After each question the trainer reveals the answer and provides the 30-second rationale. Speed and accuracy matter less here than the reasoning pattern.

The **Q&A block** is learner-driven. The trainer does not present new content — they listen, answer, and redirect to the module or domain where the uncertainty lies. The one anti-pattern to avoid: re-teaching an entire domain in 5 minutes. If a question requires a full re-teach, the answer is: "great question — that's worth reviewing in Module X.Y after the exam."

The **exam logistics slide** is the last thing the learner sees before the exam. Tone: calm and precise. It states the format, the per-question time budget, and the ground rules. It does not attempt to motivate — by this point, that is counterproductive.

What this module **does not cover** deliberately: new product content, Professional-scope topics (remote Terraform backends, Prometheus/Grafana alerting, managed databases), or certification program meta-questions (how certification levels stack, what comes after Associate). Those belong to another conversation.

---

## Block 1 — The full arc (10 min)

### Slide 1: Northwind — the 3-day arc

**Visual concept**: A two-column table: Day (1 / 2 / 3) on the left, "What Northwind built" on the right. Same data as the S18 transition slide from Module 3.2. A footer: "The self-managed PostgreSQL instance is now hardened, backed up to Object Storage, private-network-hosted, IaC-managed, and monitored — entirely on OVHcloud Public Cloud Core."

**Talking points**:
- Three days, 11 modules, 8 certification domains, one red thread.
- The Northwind arc covers the full lifecycle: project setup → compute → storage → networking → identity → automation → operations.
- Every architecture decision made for Northwind was a real decision: why private network, why application credential, why Terraform, why monthly cost review. The exam validates that the learner understands the *why*, not just the *what*.
- This is the last time we look at the map from the outside. In 5 minutes, we will be inside each domain.

**Trainer notes**:
- Demander: "without checking notes -- what was the last thing Northwind's ops engineer did in Module 3.2?" -- expected answer: established the Day-2 ops baseline (metrics, cost review, support ticket draft).
- Ce slide est l'ancrage emotionnel du debut de session. Ne pas s'y attarder -- 2 minutes maximum.
- Ton calme et confiant. La salle sort du lab 3.2 et entre dans la derniere ligne droite.

---

### Slide 2: 8 domains — the program map

**Visual concept**: A 4x2 grid of domain cards. Each card: domain code (FND, PCI, CMP, STO, NET, SEC, IAC, OPS), full domain name, module(s) it spans (e.g., "Modules 1.3-1.4"), and LO count. Cards ordered chronologically (FND top-left, OPS bottom-right). A footer line: "Exam: 60 questions · 90 min · closed-book. Distribution proportional to LO count -- no domain is skippable."

**Talking points**:
- 8 certification domains. The exam draws from all 8 — no domain is safe to skip.
- Domains are not equal in weight: Compute (16 LOs, 2 modules) and Storage (17 LOs, 2 modules) carry more questions. Network (15 LOs) is also dense.
- Every domain has K-level (recall), S-level (application), and — where applicable — A-level (judgment) outcomes. Exam questions map to these levels; A-level questions present a scenario that requires making a recommendation, not just recalling a fact.
- LO codes are the exam's vocabulary. If a question references "right-sizing," it anchors in `LO-OPS-A01`. If it references "Security Group rules," it anchors in `LO-NET-S02` or `LO-NET-S03`.

**Trainer notes**:
- Demander: "which domain do you feel least confident about right now?" -- poll by show of hands. Use the answer to calibrate Block 2 depth.
- Anticiper: "how many questions per domain?" -- not published per-domain; distribution is proportional to LO count. More LOs = more questions.
- Si plusieurs mains sur NET ou IAC: accorder 4-5 min supplementaires a ces domaines en Block 2, comprimer les domaines tres confiants.

---

## Block 2 — Domain flash review (25 min)

*7 domain review slides (FND+PCI combined). Each covers K/S/A anchors for that domain. Purpose: trigger recall, not re-teach. Pace: ~3 min per slide, ~4 min for transitions and learner responses.*

### Slide 3: FND + PCI — Cloud foundations & project setup

**Visual concept**: Two-column layout (`two-cols`). Left column header: "FND — Foundations (1.1)". Right column header: "PCI — Project, Regions & IAM (1.2)". Each column: 5 "You can now..." bullets, each carrying the LO code as a small tag. A horizontal divider line between columns. No AWS cross-reference row (it would overflow); mention verbally.

**FND key anchors**:
- **Identify** the 5 NIST characteristics and their IaaS implications -- `K01`
- **Distinguish** IaaS / PaaS / SaaS and map each to the OVHcloud portfolio -- `K02`
- **Explain** the PVDC model (datacenter → AZ → region) and data residency logic -- `K03-K04`
- **Articulate** OVHcloud's trust and sovereignty differentiator vs hyperscalers -- `K05-K07`
- **Defend** OVHcloud as the right choice for a European B2B SaaS stack -- `A01-A02`

**PCI key anchors**:
- **Explain** Public Cloud Project as a billing, IAM, and resource boundary -- `K01`
- **Identify** regional architecture; explain how quotas are region-scoped -- `K02-K03`
- **Distinguish** local users / SSO (SAML) / application credentials -- scope and lifecycle -- `K04-K05`
- **Create** a project, configure region, manage IAM users and roles -- `S01-S03`
- **Configure** billing alerts; read the Consumption view and invoice -- `S04-S06`
- **Apply** the IAM-first discipline for any new project environment -- `A01-A02`

**Trainer notes**:
- Ce slide est dense -- aller vite. L'objectif est de declencher la memoire, pas de re-enseigner.
- Demander: "what is the minimum you need before creating your first instance in a new project?" -- IAM user, region selected, project created. Ensures K01-K03 are anchored.
- Si questions sur la hierarchie datacenter/AZ/region → pointer vers Module 1.2. Ne pas re-enseigner ici.

---

### Slide 4: CMP — Compute (Modules 1.3-1.4)

**Visual concept**: Two-column layout (`two-cols`). Left: "Module 1.3 — Deploy" with flavor families, instance lifecycle, provisioning tools. Right: "Module 1.4 — Operate" with resize, snapshot, rescue mode, diagnostics, stateless discipline. Each LO code tagged inline.

**CMP Part 1 — Deploy (Module 1.3)**:
- **Distinguish** flavor families (b3-cpu, d2-general, i1-iops, c2-compute) by workload profile -- `K01-K03`
- **Explain** instance lifecycle states (ACTIVE / SHUTOFF / RESIZE) and billing implications -- `K05-K06`
- **Provision** an instance via Manager, CLI, and API; select image and key pair -- `S01-S03`

**CMP Part 2 — Operate (Module 1.4)**:
- **Resize** an instance (stop → resize → restart); assess downtime and disk constraints -- `S05`
- **Snapshot** an instance to a reusable image; understand region and quota limits -- `S06`
- **Enter** rescue mode for root-level recovery without SSH -- `S07-S08`
- **Diagnose** an unreachable instance: console → cloud-init logs → rescue -- `S09`
- **Apply** stateless-instance discipline: no persistent data on ephemeral disk -- `A02-A03`

**Trainer notes**:
- Demander: "what is the difference between stopping and deleting an instance in terms of billing?" -- stopped = still billing for ephemeral storage; deleted = billing stops. K05 anchor.
- Anticiper: "can I resize without data loss?" -- depends on disk type and flavor family. Down-sizing fails if current disk usage exceeds target flavor limit.
- Pointer vers Module 1.3 or 1.4 specifics if questions arise. No re-teach here.

---

### Slide 5: STO — Storage (Modules 2.1-2.2)

**Visual concept**: A 3-column grid for the three primary storage types (Block Storage / Object Storage S3 / File Storage NFS), each with 2-3 anchor bullets and a "When to use" one-liner. A fourth full-width row below: "Backup strategy" covering snapshots, volume backups to Object Storage, Cold Archive, and the 3-2-1 discipline. LO codes tagged inline.

**Block Storage (Module 2.1)**:
- Attachable volumes, SSD tiers, region-scoped; not portable cross-region -- `K01, S01-S02`
- When to use: persistent data for a running instance (database, WAL files)

**Object Storage S3 (Module 2.1)**:
- Bucket model, S3-compatible API, pre-signed URLs, public read, Static Site Hosting -- `K02, S03-S05`
- When to use: backups, media files, static assets, Cold Archive source

**File Storage NFS (Module 2.2)**:
- Multi-attach read/write NFS share, stateful, per-GB pricing -- `K03, S06-S07`
- When to use: shared config, shared assets accessed by multiple instances simultaneously

**Backup strategy (Module 2.2)**:
- Snapshots: point-in-time image of instance disk, no crash-consistency for databases -- `K05, S07`
- Volume backup to Object Storage: crash-consistent with freeze/thaw; lower RPO -- `K06, S08`
- Cold Archive: tape-grade cost, S3-compatible, infrequent access (< 1x/year) -- `K04`
- 3-2-1 rule applied: 3 copies · 2 media types · 1 offsite (Object Storage bucket in another region) -- `A01-A03`

**Trainer notes**:
- Question piege a anticiper: "which storage type for Northwind PostgreSQL WALs?" -- Object Storage, because S3-compatible API for pg_basebackup / Barman, durability, not tied to instance lifecycle.
- Demander: "what happens to data on a Block volume when the instance is deleted?" -- volume survives (and keeps billing) unless explicitly deleted. STO-S01 anchor.
- Pointer vers Module 2.2 for backup strategy specifics. No re-teach.

---

### Slide 6: NET — Network (Modules 2.3-2.4)

**Visual concept**: Two-column layout (`two-cols`). Left: "Public + Private (Module 2.3)" with Ext-Net, Floating IP, VLAN, Security Groups. Right: "Advanced (Module 2.4)" with vRack, Public Gateway, Octavia Load Balancer. A small Mermaid `flowchart LR` diagram below the two columns (4 nodes max): `Ext-Net --> FloatingIP --> Instance(Private VLAN) <-- vRack --> BareMetal`. LO codes inline.

**Public + Private (Module 2.3)**:
- Ext-Net: OVHcloud-managed public internet gateway -- no config needed -- `K01`
- Floating IP: associate to instance for inbound access; decouple for HA failover -- `K01, S01-S02`
- Private VLAN: L2 broadcast domain within the project; CIDR, subnet, DHCP -- `K02, S03`
- Security Group: stateful ACL (default deny); inbound + outbound rules, IP CIDR or SG reference -- `NET-S04`

**Advanced (Module 2.4)**:
- vRack: L2 isolation across OVHcloud products (Public Cloud + Bare Metal + HPC); multi-region -- `K03-K05, S05`
- Public Gateway: outbound NAT for private-network-only instances (no Floating IP needed) -- `K06, S06`
- Octavia Load Balancer: L4/L7, listeners, backend pools, health checks; no public IP on instances required -- `K07, S07, A01`

**Trainer notes**:
- Demander: "in the Northwind production topology, how does the API instance reach the internet without a Floating IP?" -- via the Public Gateway. This is the key NET architecture decision.
- Anticiper confusion vRack / Private Network: vRack = L2 multi-product underlay. Private VLAN = L2 within one Public Cloud project. vRack connects the two worlds.
- NET generates the most consolidation questions historically. Take 1-2 extra minutes if hands go up.

---

### Slide 7: SEC — Identity, Access & Security (Module 2.5)

**Visual concept**: A three-section horizontal diagram on a `default` layout. Section 1 "Identities" (local users, SAML SSO, Keystone service accounts). Section 2 "Application access" (application credentials -- scope, validity, rotation). Section 3 "Secret management" (Secret Manager -- store, retrieve, audit). Below: a full-width row "Audit posture" (activity log, least-privilege attestation). LO codes inline.

**Identities**:
- Local IAM user: Manager account, role assignment, human lifecycle -- `K01`
- SAML federation: external IdP (Okta, Azure AD), no OVHcloud password -- `K02`
- Application credential: Keystone-issued, project-scoped, no admin-plane access -- `K03-K04`

**Application access**:
- Scope = one project + one role; rotate independently from user accounts -- `K04, S01-S02`
- Principle of least privilege: read-only / operator / admin role mapping -- `K05, S03`

**Secret management**:
- Secret Manager: store credentials at rest, inject at instance boot, audit access -- `K06, S04-S05`

**Audit posture**:
- Activity log: who did what, when, on which resource -- `A01-A02`
- Reflex: check the activity log before concluding a resource was "accidentally" deleted

**Trainer notes**:
- Demander: "why does the Northwind backup job use an application credential and not a user login?" -- batch jobs must not depend on a human identity; rotation, no admin-plane access, scoped to backup operation only.
- Anticiper: "difference between application credential and API token?" -- app credential = Keystone, project-scoped. API token = OVHcloud-wide access (billing, projects, vRack). Different planes, different scope.
- Si confusion on SSO → Module 2.5 S06. Don't re-teach.

---

### Slide 8: IAC — Infrastructure as Code (Module 3.1)

**Visual concept**: Two-column layout (`two-cols`). Left: "Three control planes" showing Manager UI / OpenStack CLI / Terraform+providers with their respective scopes. Right: "Terraform workflow" showing the four commands (init / plan / apply / destroy) with a one-line description each, plus the drift detection reflex. A footer `<OvhWarning title="Drift detection">`: "terraform plan on main must return empty. Any delta = a manual change outside the workflow."

**Three control planes (Left)**:
- Manager UI: project-scoped + account admin; discovery and one-off operations -- `K01-K02`
- OpenStack CLI: project-scoped IaaS; scripting, traceable, imperative -- `K02, S01-S02`
- OVHcloud API: account-wide (billing, projects, vRack, IAM); Terraform's second provider -- `K02, S03`
- Terraform: client of OpenStack + OVHcloud APIs; declarative, state-tracked -- `K03-K04`

**Terraform workflow (Right)**:
- `terraform init` -- downloads providers into `.terraform/providers/` -- `S04`
- `terraform plan` -- computes diff: `+` create · `-` destroy · `~` update-in-place -- `S05`
- `terraform apply` -- converges actual to declared; updates state file -- `S06`
- `terraform destroy` -- removes all resources tracked in state file -- `S06`
- Drift detection: manual Manager change → non-empty plan → investigate + apply -- `A01-A02`

**Trainer notes**:
- Demander: "what does a non-empty terraform plan on a clean main branch mean?" -- either uncommitted Terraform work OR a manual change in the Manager. Both require action.
- Anticiper: "what if the state file is lost?" -- resources are orphaned; recovery via terraform import or full re-create. Local state = no locking = single-operator only. Remote state is Professional scope.
- Ce slide est souvent de clarification rapide -- la plupart des learners ont eu leur moment de comprehension pendant le lab 3.1.

---

### Slide 9: OPS — Operations (Module 3.2)

**Visual concept**: A 2x2 grid on a `default` layout. Top-left: "Metrics" (instance tab, 4 graphs, AWS → CloudWatch). Top-right: "Cost" (Consumption view, orphaned resources, right-sizing reflex). Bottom-left: "Quotas" (headroom, 70% rule, increase process). Bottom-right: "Support" (4 tiers, 5-field ticket rule). A full-width footer: "Observability posture = 3 metrics with thresholds + 1 LDP log stream + monthly cost-review cadence."

**Metrics (K01, S01)**:
- 4 hypervisor-level metrics: CPU % · RAM MB · disk I/O MB/s · network Mbps
- Time ranges: 1h / 24h / 7d / 30d -- select based on troubleshoot vs review context
- AWS equivalent: CloudWatch basic metrics for EC2

**Cost (K01, S02, A01)**:
- Consumption view: hourly data, ~24h delay, top contributors, CSV export
- Cost leaks: detached volumes · unassociated Floating IPs · aged snapshots
- Right-sizing opportunity: sustained 4% CPU on a large flavor = resize candidate
- Monthly cost-review ritual: first Monday, 30 min, Manager + spreadsheet

**Quotas (K03, S03)**:
- Default ceilings per resource type, per region, per project
- 70% usage → open increase ticket before the sprint, not at 100%
- `openstack quota show` = same data as Manager, machine-readable

**Support (K04, S05)**:
- 4 tiers: Community / Standard / Premium / Dedicated
- Digital Starter default: Standard (ticket only, best-effort)
- 5-field ticket rule: category · project ID · resource ID · UTC timestamp · symptom + prior checks

**Trainer notes**:
- Demander: "first check when a batch job fails overnight?" -- status.ovhcloud.com before opening a ticket. OPS-S04 anchor.
- Si questions sur LDP setup ou budget alerts: pointer vers Module 3.2. No re-teach.
- Les 30 dernieres secondes de ce slide: "That is all 8 domains. In 15 minutes you will answer 10 exam-format questions. Let us see where you stand."

---

## Block 3 — Mock exam (15 min)

*10 exam-style questions. Same format as the certification exam: 4-option single-answer MCQ. Trainer reveals correct answer + 30-second rationale after each question. Pace: ~1 min 30 sec per question.*

### Question 1 — FND

- **Stem**: Which NIST cloud characteristic allows a Northwind engineer to provision 5 new instances in 3 minutes without calling OVHcloud support?
- **Correct answer**: A. On-demand self-service -- resources are provisioned without requiring human interaction on the provider side.
- **Distractors**:
  - B. Broad network access -- describes access method (any device, any network), not provisioning without human involvement. *Why wrong*: this characteristic addresses how you connect, not whether a human is needed.
  - C. Resource pooling -- describes the multi-tenant model of provider-side infrastructure. *Why wrong*: pooling is a supply-side design choice; it does not remove the need for human approval at provisioning time.
  - D. Rapid elasticity -- describes the appearance of unlimited capacity and fast scaling. *Why wrong*: elasticity is about scaling speed and apparent infinite capacity; on-demand self-service is specifically about no human interaction required on the provider side.
- **LO traced**: `LO-FND-K01`
- **Bloom level**: Understand

### Question 2 — PCI

- **Stem**: Northwind's CTO wants to add an external DevOps consultant (no existing OVHcloud account) to the project with read-only rights for 30 days. Which IAM mechanism is most appropriate?
- **Correct answer**: C. Create a local IAM user for the consultant with observer role on the Northwind project and set a 30-day validity on the account.
- **Distractors**:
  - A. Share the CTO's Manager credentials temporarily -- *Why wrong*: sharing credentials eliminates auditability; all activity log entries record under the CTO's identity, not the consultant's.
  - B. Issue the consultant an application credential from the Northwind project -- *Why wrong*: application credentials are for service/automation accounts, not human logins; they provide OpenStack API access only, no Manager UI.
  - D. Configure SAML federation with the consultant's company IdP -- *Why wrong*: SAML federation integrates a corporate IdP at scale; for a single external user for 30 days, it is disproportionate and requires IdP administrator access.
- **LO traced**: `LO-PCI-K04` / `LO-PCI-S03`
- **Bloom level**: Apply

### Question 3 — CMP

- **Stem**: The `nwa-api-prod-01` instance (flavor `d2-4`) shows 6% average CPU over 3 consecutive months. The CTO asks for a cost reduction. What is the correct first step?
- **Correct answer**: B. Review all four instance metrics (CPU, RAM, disk I/O, network) over the 30-day period before deciding to resize -- a CPU plateau alone does not confirm the instance is right-sized for memory or I/O.
- **Distractors**:
  - A. Immediately resize `d2-4` to `d2-2` to halve the compute cost -- *Why wrong*: right-sizing requires validating all four metrics. The instance may be memory- or I/O-bound despite low CPU; an immediate downsize without evidence risks a production incident.
  - C. Delete the instance and redeploy on a smaller flavor via Terraform -- *Why wrong*: technically possible but destructive and unnecessary; resize is in-place. More importantly, it does not address the need to validate metrics first.
  - D. Move the API workload to Object Storage to eliminate the compute tier -- *Why wrong*: Object Storage is a data store, not a compute runtime; an API workload requires a running instance.
- **LO traced**: `LO-CMP-K01` / `LO-OPS-S01`
- **Bloom level**: Analyze

### Question 4 — STO

- **Stem**: Northwind must retain PostgreSQL base backups for 12 months. Backups will be accessed at most once per year. Which OVHcloud storage type provides the lowest cost per GB?
- **Correct answer**: D. Cold Archive -- tape-grade cost, designed for long-term infrequently accessed data, S3-compatible access via the Object Storage API.
- **Distractors**:
  - A. Block Storage (ceph-ssd tier) -- *Why wrong*: Block Storage is designed for instance-attached active workloads; it is expensive per GB and requires attachment to a running instance.
  - B. Standard Object Storage (Hot tier) -- *Why wrong*: Hot tier is cost-optimized for frequently accessed data. For once-a-year access over 12 months, Cold Archive is the appropriate and significantly cheaper choice.
  - C. File Storage NFS -- *Why wrong*: NFS File Storage is a multi-attach shared filesystem for active concurrent access; not a cost-efficient archival mechanism and priced for active workloads.
- **LO traced**: `LO-STO-K04` / `LO-STO-A01`
- **Bloom level**: Apply

### Question 5 — NET

- **Stem**: A Northwind instance in a private VLAN needs to pull OS updates from the internet but must NOT be directly reachable from the internet. Which OVHcloud component enables this pattern?
- **Correct answer**: B. Public Gateway -- provides outbound NAT for private-network-only instances without exposing them via a Floating IP.
- **Distractors**:
  - A. Floating IP -- *Why wrong*: a Floating IP makes the instance reachable FROM the internet; it does not provide outbound-only access. It solves the opposite requirement.
  - C. Octavia Load Balancer -- *Why wrong*: the Load Balancer distributes inbound traffic TO instances; it does not provide outbound internet access for private instances.
  - D. vRack -- *Why wrong*: vRack is a Layer 2 inter-product fabric for private OVHcloud network interconnect; it does not route internet traffic.
- **LO traced**: `LO-NET-K06` / `LO-NET-S06`
- **Bloom level**: Apply

### Question 6 — NET

- **Stem**: vRack is described as a Layer 2 isolation fabric. What does this enable for the Northwind stack?
- **Correct answer**: A. Instances in the Northwind Public Cloud project and a future OVHcloud Bare Metal server can communicate on the same private broadcast domain without IP routing.
- **Distractors**:
  - B. vRack encrypts all traffic between OVHcloud products end-to-end -- *Why wrong*: vRack provides L2 isolation, not encryption. Traffic within the vRack is private but not automatically encrypted.
  - C. vRack replaces Security Groups within the Northwind Public Cloud project -- *Why wrong*: Security Groups are intra-project stateful ACLs; vRack is an inter-product L2 underlay. Different layers, different scopes; both are needed.
  - D. vRack provides a guaranteed dedicated-bandwidth link between regions -- *Why wrong*: vRack uses the OVHcloud backbone, but dedicated bandwidth guarantees (QoS) are not a standard vRack feature.
- **LO traced**: `LO-NET-K03` / `LO-NET-K04`
- **Bloom level**: Understand

### Question 7 — SEC

- **Stem**: The Northwind PostgreSQL backup job runs nightly via cron. Why does it authenticate with an application credential rather than the CTO's user login?
- **Correct answer**: C. Application credentials are project-scoped, have no admin-plane access, and can be rotated independently from any user account -- the principle of least privilege for automated batch processes.
- **Distractors**:
  - A. Application credentials are free; user accounts require a paid upgrade -- *Why wrong*: both are included in OVHcloud accounts at no additional cost. The distinction is scoping and security posture, not pricing.
  - B. User tokens expire after 24 hours while application credentials do not expire -- *Why wrong*: application credentials also have configurable expiry. The primary distinction is scope (project-scoped vs account-wide) and lack of admin-plane access, not just token duration.
  - D. User logins require interactive 2FA that cannot be bypassed for unattended batch jobs -- *Why wrong*: user tokens can be obtained non-interactively via the OVHcloud API; the key reason for using application credentials is scope and least privilege, not 2FA mechanics.
- **LO traced**: `LO-SEC-K04` / `LO-SEC-S02`
- **Bloom level**: Understand

### Question 8 — SEC

- **Stem**: A Northwind storage volume was deleted on Tuesday. On Friday the CTO asks who deleted it and at what time. Which OVHcloud tool provides this information?
- **Correct answer**: A. Manager Activity Log -- records all user-initiated API calls with timestamp, user identity, and affected resource ID.
- **Distractors**:
  - B. OVHcloud status page -- *Why wrong*: the status page reports OVHcloud-side service incidents affecting infrastructure availability; it does not record customer-initiated operations.
  - C. Instance Metrics tab -- *Why wrong*: Instance Metrics shows performance time-series data for running instances; it provides no information about account-level operations.
  - D. Log Data Platform -- *Why wrong*: LDP centralizes application and OS logs forwarded from instances; it does not capture Manager API calls or account-level resource operations.
- **LO traced**: `LO-SEC-A01` / `LO-PCI-K05`
- **Bloom level**: Apply

### Question 9 — IAC

- **Stem**: On Monday morning the team runs `terraform plan` on the main branch and sees `~ update in-place (1 change)`. No Terraform commit was made over the weekend. What is the most likely cause and the correct next step?
- **Correct answer**: B. A team member made a manual change via the Manager or CLI over the weekend. The correct step is to identify the change, decide whether it should be permanent, update the Terraform configuration if needed, and run `terraform apply` to converge state.
- **Distractors**:
  - A. The Terraform provider released an update that changed the resource schema -- *Why wrong*: provider updates affect newly planned resources or deprecate attributes; they do not cause existing resources to show drift on a pinned provider version.
  - C. The state file is corrupted and must be deleted before re-applying -- *Why wrong*: deleting the state file orphans all tracked resources; this is a destructive action not warranted by a single-field drift detection.
  - D. OVHcloud performed maintenance that automatically modified the resource attribute -- *Why wrong*: OVHcloud maintenance operations do not modify customer-managed resource attributes (names, network assignments, security group rules). If infrastructure was affected by maintenance, it would surface as a service incident on the status page, not as a Terraform drift.
- **LO traced**: `LO-IAC-A02` / `LO-IAC-S05`
- **Bloom level**: Analyze

### Question 10 — OPS

- **Stem**: On Tuesday morning, Northwind's scheduled batch export job failed overnight with a connection timeout. What should the ops engineer check FIRST before opening a support ticket?
- **Correct answer**: D. status.ovhcloud.com -- to determine whether a known OVHcloud-side incident in the relevant region or service accounts for the timeout before assuming a code or configuration issue.
- **Distractors**:
  - A. The Terraform state file for the batch job's infrastructure -- *Why wrong*: the Terraform state file records declared infrastructure; it provides no insight into a runtime job failure or network connectivity issue.
  - B. The instance RAM metrics for the last 24 hours -- *Why wrong*: checking instance metrics is a valid step, but it comes after ruling out a cloud-side incident. If the status page shows a known outage, metrics inspection is premature.
  - C. Open a support ticket with the timeout error message immediately -- *Why wrong*: if an OVHcloud incident is already in progress and acknowledged on the status page, adding a ticket creates noise and delays the team working on the incident. Wait for the incident to resolve, then open a ticket if the issue persists.
- **LO traced**: `LO-OPS-S04` / `LO-OPS-A01`
- **Bloom level**: Apply

---

## Block 4 — Learner-driven Q&A (5 min)

### Slide 20: Your questions

**Visual concept**: A single-panel slide. Center: "Your questions." Three prompt lines displayed as `<OvhNotice>` callouts: (1) "A concept that did not fully click -- tell me the domain and the LO code." (2) "A scenario you want to reason through before the exam." (3) "An AWS / Azure cross-reference you want confirmed." The slide is intentionally sparse -- the white space signals that this is an open-floor conversation, not a content presentation.

**Talking points**:
- This block is not a re-teach. Answers are 2-3 sentences + a pointer to the source module.
- If a question requires a full domain re-teach: "great question -- Module X.Y covers that in depth. It is in the handout; review it after the exam."

**Trainer notes**:
- Rester debout, face a la salle. Ne pas avancer de slides. Ecouter.
- Si silence: "which mock exam question made you hesitate?" -- triggers a domain discussion almost every time.
- Eviter: re-enseigner un module entier. Repondre en 2-3 phrases, pointer vers le module de reference.
- Timer strict: 5 minutes. Transition neutre: "let's confirm the exam format before you go in."

---

## Block 5 — Exam logistics (5 min)

### Slide 21: Exam format & logistics

**Visual concept**: A clean three-section default slide. Section 1 "The exam": 60 questions · 90 minutes · closed-book (no notes, no browser, no Manager). Section 2 "The format": 4-option single-answer MCQ · no partial credit · no negative marking. Section 3 "Your strategy": 90 sec per question average · answer every question (no blank counts as wrong) · flag uncertain questions for a second pass. An `<OvhNotice title="Certification delivery">` callout: "Your certification ID arrives by email within 5 business days if the pass threshold is met."

**Talking points**:
- 60 questions, 90 minutes: 1 minute 30 seconds average per question. Most will take under 60 seconds; a few scenario questions will take more. The budget exists.
- No negative marking. If unsure, answer. A blank is zero. An educated guess from 4 options has a 25% floor.
- Closed-book: no notes, no browser, no Manager access. You are using the mental model built over three days.
- Strategy: answer what you know first, flag what you are uncertain about, return with remaining time.

**Trainer notes**:
- Ton: calme et factuel. Eviter le langage de motivation force -- "you've got this!" sonne creux a 5 minutes de l'examen.
- Si des learners ont l'air anxieux: souligner que le format MCQ n'est pas ambigu -- une seule bonne reponse, pas de redaction, pas de piege de formulation.
- Ne pas depasser 5 minutes. La salle doit entrer dans l'examen avec de l'energie mentale, pas de la fatigue.
- Clore avec une phrase de transition pratique: "Your exam interface will be ready in [X] minutes. Clear your workspace, take a short break, come back focused."

---

## Trainer FAQ (anticipated questions for this module)

**Q: A learner asks a very specific question during the Q&A block -- should I answer in depth?**
A: Not during the Q&A block. The correct answer is 2-3 sentences + a pointer to the specific module. "That is LO-NET-K04 -- the vRack positioning slide from Module 2.4 has the exact comparison you need. It is in the handout." Attempting a full re-teach in 2 minutes produces a shallow answer that may create more confusion. The learner has the slides and the exam is in 5 minutes.

**Q: What if the mock exam reveals a domain the whole group does not know?**
A: If 3 or more people miss the same question, pause after revealing the answer and spend 90 seconds on the rationale -- one sentence that explains the principle. "The keyword here is outbound-only from a private instance -- that is always the Gateway, never the Floating IP." Then move on. Do not compress remaining questions to make up time; reduce the Q&A block to 3 minutes instead.

**Q: Can the consolidation session be extended if the group is clearly not ready?**
A: No -- if the exam is already scheduled, extending consolidation pushes the group in with less time and more anxiety. The session calibrates confidence, it does not replace pre-work. If the group shows major gaps, call them out explicitly ("Network will be heavy on the exam -- you have 5 minutes after this to review Module 2.4") and give targeted pointers. The exam schedule should not move.

**Q: Should I skip the mock exam if the group feels very confident?**
A: No. The mock exam puts the group in exam-cognitive-mode -- the shift from "discussing concepts" to "answering under time pressure" is itself a preparation step. Even a confident group benefits from 15 minutes in that mode. If everyone answers all 10 correctly, use the remaining time for bonus Q&A on any domain.

**Q: What if a learner who struggles asks directly whether they will pass?**
A: Do not predict and do not reassure blindly. The honest answer: "I cannot tell you your score. What I can say is that you have done the labs, you have seen the full Northwind arc, and the exam tests exactly what we covered. Go in, answer what you know first, flag what you are uncertain about, and use the remaining time." A direct answer without false comfort is more useful than vague encouragement.
