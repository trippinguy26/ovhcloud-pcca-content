# 02 — Target Persona

## 1. Two co-primary personas, one curriculum

This certification serves **two co-primary learner personas** sharing the same technical foundation, the same learning path, and the same red-thread scenario. They differ in their organizational context, commercial relationship with OVHcloud, and operating mode (structured IT team vs self-service).

The personas map to two of the three OVHcloud customer segments defined by the Chief Customer Office:

| OVHcloud segment | This certification covers it via | Notes |
|---|---|---|
| **Digital Starter** (<2k€ MRRR, no AM, self-service) | Persona B | SMEs, freelancers, entrepreneurs |
| **Digital Scaler** (>2k€ MRRR, no AM, single decision-maker, DevOps-equipped) | Persona A (absorbed) | Startups, tech and mid-size firms with DevOps |
| **Corporate** (dedicated AM, complex RFP) | Persona A | Large enterprises, public sector |

Digital Scaler and Corporate are merged into one persona because they share the structural prerequisites of this certification: a structured IT or DevOps team, a single (or coordinated) decision-maker capable of engaging budget for training, and a baseline familiarity with operational IT concepts. The differences (deal size, presence of an Account Manager, RFP complexity) are commercial concerns that do not affect the curriculum content or pacing.

### Persona A — The Corporate Operator

*Covers both true Corporate (large enterprises, public sector) and Digital Scaler (startups, tech and mid-size firms with DevOps) segments.*

| | |
|---|---|
| **Typical roles** | System Administrator, Senior Sysadmin, Cloud/Infrastructure Engineer, SRE, Junior DevOps, SecOps Engineer, Internal IT Project Lead, Tech Lead in a digital scale-up |
| **Experience** | 5 to 15+ years in IT operations |
| **Organization profile** | Large enterprise or public sector with hybrid IT (Corporate segment), **or** startup / tech / mid-size firm with an in-house DevOps capability (Digital Scaler segment). Common thread: structured IT or DevOps team, decision-maker available to engage training budget |
| **Commercial path** | Paid certification. For Corporate: bundled with the OVHcloud *Professional Services* engagement or allocated from the Enterprise support certification quota. For Digital Scaler: paid per-seat or via team bundle, often via direct contact with the single decision-maker |
| **Geographic context** | Primarily France and Europe |

### Persona B — The Digital Starter

*Covers the Digital Starter segment: SMEs, freelancers, entrepreneurs in self-service mode.*

| | |
|---|---|
| **Typical roles** | SME owner, freelancer, solo entrepreneur, micro-agency operator, technical founder of a very early-stage company |
| **Experience** | Variable — typically 2 to 10+ years of IT or technical experience, often built outside a formal corporate IT department (self-taught, prior agency work, prior freelance contracts) |
| **Organization profile** | < 2k€ MRRR on OVHcloud. No dedicated Account Manager. Self-service relationship with the cloud provider. No formal IT department; the learner often *is* the IT department |
| **Commercial path** | Subsidized track (free or strongly discounted certification) as part of OVHcloud's market reach strategy for the no-AM segment. Voucher credits cover lab consumption |
| **Geographic context** | Primarily France and Europe |

## 2. Shared technical baseline — entry prerequisites

Both personas are expected to arrive with:

- Linux command line and SSH (basic to intermediate).
- Server virtualization concepts (VMware, Hyper-V, Proxmox, KVM, or equivalent hands-on exposure).
- TCP/IP networking, VLANs, basic firewalling, IP addressing.
- Identity management awareness (Active Directory, LDAP, or equivalent).
- Traditional storage concepts (SAN, NAS, RAID, backup/restore principles).
- Reading basic configuration files (YAML, JSON, INI).
- Basic scripting literacy (bash or PowerShell) — not developer-grade.

Persona B (Digital Starter) typically reaches this baseline through self-directed experience (web hosting, dedicated servers, side projects, freelance work) rather than corporate training. The certification does not lower its technical floor to accommodate either persona — it relies on the *Sentier battu / Hors piste* prerequisite framing at module entry, so that learners with gaps can identify and self-remediate before sessions.

Neither persona is assumed to know OpenStack, cloud-native patterns, Infrastructure as Code in depth, or software development.

## 3. Strategic context — why they show up

### Persona A — Corporate Operator drivers

- **Cost pressure**: hyperscaler bills under finance scrutiny; need for credible European alternative.
- **Sovereignty mandate**: GDPR, NIS2, sector-specific frameworks demanding EU jurisdiction.
- **CI/CD modernization**: dev teams demand on-demand ephemeral environments that on-prem cannot deliver.
- **Migration project**: a defined workload must move within 6-18 months.
- **Career broadening**: building a third-CSP literacy on top of existing AWS/Azure exposure.
- **Existing OVHcloud customer expansion**: corporate already running Bare Metal or Hosted Private Cloud workloads, looking to add Public Cloud as an on-demand resource layer — typically for dev/test environments, CI pipelines, or ephemeral workloads.

### Persona B — Digital Starter drivers

- **Operational autonomy**: small business owner or freelancer needing to host services (website, application backend, client deliverables) without depending on a hosting provider's opaque managed offering.
- **Cost control at small scale**: predictable cloud spending matters when monthly revenue is below 2k€. OVHcloud's transparent and egress-free billing aligns with the segment's economics.
- **Direct client delivery**: freelancers and micro-agencies deploying client projects on OVHcloud and needing to operate them credibly.
- **Sovereignty by value alignment**: many Digital Starters in Europe prefer European cloud infrastructure on principle, not just by mandate.
- **Existing OVHcloud user expansion**: existing customer on shared hosting, dedicated servers, or web hosting plans discovering Public Cloud as a logical next step.

## 4. Common learning motivations — what they want to be able to do

Despite different starting points, both personas converge on the same operational outcomes:

- Confidently provision a production-grade stack on the Core layer of OVHcloud Public Cloud (compute, storage, network, identity).
- Translate prior mental models (legacy on-prem for Persona A; self-built infrastructure or other CSP exposure for Persona B) into OVHcloud equivalents.
- Understand the OVHcloud billing model and avoid bill surprises.
- Secure a Public Cloud project to professional standards.
- Automate basic provisioning via OpenStack CLI and Terraform.
- Identify when OVHcloud Public Cloud Core is the right fit for a workload, and when a sibling certification's services (Managed Kubernetes, Managed Databases, AI, Analytics) would be more appropriate.

## 5. Key concerns and objections to address explicitly

### Shared across both personas

1. **OpenStack opacity** — fear of an unfamiliar platform. *Defused by*: progressive OpenStack reveal with legacy and hyperscaler analogies.
2. **Shared tenancy and isolation** — concern about data and resource isolation. *Defused by*: explicit treatment of project boundaries, vRack isolation, and IAM scoping.
3. **SLA clarity** — perceived information asymmetry vs hyperscalers. *Defused by*: a direct, factual SLA comparison section.
4. **Service parity anxiety** — "I can't find the AWS service I rely on". *Defused by*: recurring "OVHcloud vs hyperscaler" cross-reference for each service.
5. **Lock-in fear** — exit reversibility. *Defused by*: emphasis on OpenStack open APIs, S3-compatible storage, and explicit reversibility patterns.

### Specific to Persona A — Corporate Operator

- **Procurement and compliance**: how does this fit purchase processes, audit, and contractual obligations?
- **Skills transfer to team**: how do I make this knowledge propagate internally?

### Specific to Persona B — Digital Starter

- **Cost predictability at small scale**: "Will I get a surprise bill if I leave a resource running?" *Defused by*: explicit treatment of cost discovery, alerts, and project deletion best practices.
- **Onboarding friction**: "How do I even start without a corporate account team behind me?" *Defused by*: a dedicated onboarding section in the first module (Manager UI, billing setup, support channels available without an Account Manager).
- **Solo operational risk**: no colleague to call when something breaks. *Defused by*: explicit treatment of the OVHcloud status page, community resources, and the structured support channels available to no-AM customers.

## 6. Learning outcomes — what success looks like at exit

Upon completion of the certification, the learner — regardless of persona — can independently:

- Design and deploy a small-to-medium architecture combining instances, persistent block and object storage, private and public networking, and IAM scoping on the Core layer of OVHcloud Public Cloud.
- Apply OVHcloud-native security baselines (IAM policies, project isolation, secret management essentials, security groups).
- Operate basic day-2 actions: snapshots *and backups* (distinguishing the two), scaling, monitoring alerts, cost review, and restore procedures.
- Reproduce a deployment from scratch using OpenStack CLI and a basic Terraform configuration.
- Identify which workloads are good candidates for OVHcloud Public Cloud Core, and which require a sibling specialty certification's services (Kubernetes, managed databases, AI, analytics).

## 7. Out-of-scope profiles (anti-personas)

This certification is **not** designed for:

- Pure cloud-native developers with no infrastructure background.
- Senior cloud architects already certified at AWS Professional / Azure Expert level (they should target *OVHcloud - Public Cloud - Core Professional* directly).
- Total IT beginners without Linux or virtualization exposure (foundation-level prep required first).
- Specialists in AI/ML, data analytics, HPC, quantum computing, Kubernetes, or managed databases (separate Specialty / DBaaS tracks).
