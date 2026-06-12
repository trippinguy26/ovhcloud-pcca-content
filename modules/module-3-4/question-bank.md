# OVHcloud Public Cloud Core Associate — Exam Question Bank

> **Access**: restricted — Product Enablement team only. Do not share with learners.
> **Version**: 1.0 | **LO reference**: module-3-3/slides.md frontmatter | **Questions**: 160
> **Exam draw**: 60 questions, proportional per domain — see `module-3-4-exam-final-qcm.md` for draw rules.

---

## Domain FND — Cloud Foundations (18 questions)

---

### Q-FND-001
**Domain**: FND | **LO**: LO-FND-K01 | **Bloom**: Remember

NIST identifies five essential characteristics of cloud computing. Which of the following is one of them?

- A. Dedicated hardware per customer
- B. Measured service
- C. Unlimited storage capacity
- D. Geographic data residency guarantee

**Correct**: B | Measured service (metered, pay-per-use) is one of the five NIST characteristics. A contradicts resource pooling. C: elastic ≠ unlimited. D: residency is contractual policy, not a NIST property.

---

### Q-FND-002
**Domain**: FND | **LO**: LO-FND-K01 | **Bloom**: Remember

Which pair of NIST characteristics best describes the ability to provision resources instantly without human intervention and to scale them up or down automatically?

- A. Broad network access + Resource pooling
- B. On-demand self-service + Rapid elasticity
- C. Measured service + Broad network access
- D. Resource pooling + Rapid elasticity

**Correct**: B | On-demand self-service = provision without human contact. Rapid elasticity = scale up/down quickly. The other pairs mix in characteristics that address different properties.

---

### Q-FND-003
**Domain**: FND | **LO**: LO-FND-K01 | **Bloom**: Understand

A developer team needs a managed PostgreSQL database — they do not want to manage the OS, patches, or backups. Which service model describes this offering?

- A. IaaS
- B. SaaS
- C. PaaS
- D. DaaS

**Correct**: C | Platform as a Service (PaaS) provides managed runtime environments, including managed databases. IaaS gives raw infrastructure. SaaS gives end-user applications. DaaS is not a standard NIST model.

---

### Q-FND-004
**Domain**: FND | **LO**: LO-FND-K02 | **Bloom**: Remember

OVHcloud Public Cloud Instances are classified under which service model?

- A. SaaS
- B. PaaS
- C. FaaS
- D. IaaS

**Correct**: D | Public Cloud Instances are compute resources where the customer manages the OS and above. That is IaaS. Managed services (MKS, Managed Databases) are PaaS. OVHcloud Business emails are SaaS.

---

### Q-FND-005
**Domain**: FND | **LO**: LO-FND-K02 | **Bloom**: Understand

Compared to AWS EC2, OVHcloud Public Cloud Instances differ primarily in which way?

- A. OVHcloud does not offer auto-scaling
- B. OVHcloud infrastructure is hosted exclusively in Europe
- C. OVHcloud uses a European sovereign model with no exposure to the US CLOUD Act for EU-hosted data
- D. OVHcloud does not support SSH key authentication

**Correct**: C | The key differentiator is OVHcloud's EU-sovereign posture — not subject to US CLOUD Act for European data. A: OVHcloud does offer scaling mechanisms. B: OVHcloud has regions worldwide (Canada, APAC). D: SSH keys are supported.

---

### Q-FND-006
**Domain**: FND | **LO**: LO-FND-K03 | **Bloom**: Distinguish

A company requires that its production servers be physically isolated from other customers' workloads. Which OVHcloud deployment model satisfies this requirement?

- A. Public Cloud
- B. Shared Hosting
- C. Dedicated Server
- D. Object Storage

**Correct**: C | Dedicated Servers are single-tenant physical machines. Public Cloud is multi-tenant (shared hypervisor). Shared Hosting is multi-tenant. Object Storage is a service, not a server deployment model.

---

### Q-FND-007
**Domain**: FND | **LO**: LO-FND-K03 | **Bloom**: Understand

Northwind Analytics is evaluating OVHcloud deployment options. Their primary needs are: elastic compute, pay-per-use billing, and fast provisioning. Which model is the best fit?

- A. Dedicated Server
- B. Hosted Private Cloud
- C. Public Cloud
- D. Bare Metal Cloud

**Correct**: C | Public Cloud provides elastic compute, per-hour billing, and sub-minute provisioning. Dedicated and Bare Metal require reservation and longer provisioning. Hosted Private Cloud is single-tenant but lacks the elasticity of Public Cloud.

---

### Q-FND-008
**Domain**: FND | **LO**: LO-FND-K04 | **Bloom**: Remember

Which of the following statements about OVHcloud and GDPR is correct?

- A. OVHcloud transfers EU customer data to the USA under a Standard Contractual Clause
- B. OVHcloud's EU data centers are not subject to the US CLOUD Act
- C. GDPR compliance is the sole responsibility of OVHcloud, not the customer
- D. OVHcloud stores all data only in France regardless of the region chosen

**Correct**: B | OVHcloud is a French company; its EU infrastructure is not subject to the US CLOUD Act, which is a key sovereignty argument. A: OVHcloud does not rely on SCCs for EU data. C: GDPR is a shared responsibility. D: Data stays in the chosen region, not exclusively France.

---

### Q-FND-009
**Domain**: FND | **LO**: LO-FND-K04 | **Bloom**: Understand

A customer states: "We need our data to stay in Europe for regulatory reasons, but we also need cloud elasticity." Which OVHcloud capability directly addresses this need?

- A. OVHcloud's status as a US-listed company
- B. OVHcloud's EU-based regions and sovereign data handling
- C. OVHcloud's multi-cloud interconnect with AWS
- D. OVHcloud's shared hosting infrastructure

**Correct**: B | OVHcloud's EU regions (FR, DE, PL, UK) combined with its sovereign posture directly address the European data residency + elasticity requirement. A: OVHcloud is French, not US-listed. C: multi-cloud is not the answer to sovereignty. D: irrelevant.

---

### Q-FND-010
**Domain**: FND | **LO**: LO-FND-K05 | **Bloom**: Define

In OVHcloud, what does a "region" represent?

- A. A billing zone with a distinct price list
- B. A geographic data center cluster with an independent OpenStack endpoint
- C. A logical grouping of customers by country
- D. A redundancy zone within a single data center

**Correct**: B | An OVHcloud region is a geographic location running its own OpenStack control plane (distinct API endpoint). Pricing may vary slightly but the region is fundamentally defined by geography + API autonomy, not billing. C and D are incorrect.

---

### Q-FND-011
**Domain**: FND | **LO**: LO-FND-K05 | **Bloom**: Identify

Which of the following is an example of an OVHcloud Public Cloud region identifier?

- A. EU-WEST-3
- B. GRA9
- C. FRA1
- D. EUROPE-NORTH

**Correct**: B | OVHcloud region identifiers use a short code for the city/site (GRA = Gravelines, SBG = Strasbourg, BHS = Beauharnois) followed by an index number. AWS-style identifiers (EU-WEST-3) and Azure-style (EUROPE-NORTH) are not OVHcloud conventions.

---

### Q-FND-012
**Domain**: FND | **LO**: LO-FND-K06 | **Bloom**: Describe

In the cloud shared responsibility model for IaaS, which component is OVHcloud responsible for?

- A. Operating system configuration
- B. Application security
- C. Physical infrastructure and hypervisor
- D. Customer data encryption

**Correct**: C | In IaaS, OVHcloud manages physical hardware, data center facilities, and hypervisor. The customer is responsible for OS, applications, data, and configuration above the hypervisor layer.

---

### Q-FND-013
**Domain**: FND | **LO**: LO-FND-K06 | **Bloom**: Apply

A Public Cloud Instance running Ubuntu has an unpatched kernel vulnerability. According to the shared responsibility model, who is responsible for patching it?

- A. OVHcloud, because it manages the infrastructure
- B. The customer, because they manage the OS layer
- C. Jointly OVHcloud and the customer, via automatic update
- D. The Ubuntu community, because it is open-source

**Correct**: B | In IaaS, OS patching is the customer's responsibility. OVHcloud provides the base image but does not manage what runs inside the VM after provisioning.

---

### Q-FND-014
**Domain**: FND | **LO**: LO-FND-K07 | **Bloom**: Explain

What is the default OVHcloud Public Cloud billing model for compute instances?

- A. Annual reservation with a monthly payment
- B. Per-second billing after the first minute
- C. Per-hour billing with no minimum commitment
- D. Flat monthly rate regardless of usage

**Correct**: C | OVHcloud Public Cloud Instances are billed per hour consumed, with no minimum commitment. Annual reservations exist as discounted options but are not the default. Per-second billing is not the standard model.

---

### Q-FND-015
**Domain**: FND | **LO**: LO-FND-K07 | **Bloom**: Apply

Northwind Analytics runs a batch processing instance for 3 hours and 20 minutes, then deletes it. How many hours are billed?

- A. 3 hours
- B. 3 hours and 20 minutes (fractional)
- C. 4 hours (rounded up to the next hour)
- D. 24 hours (minimum daily billing)

**Correct**: C | OVHcloud bills in full-hour increments, rounding up any partial hour. 3h20m = 4 billable hours. There is no per-minute or per-second granularity by default.

---

### Q-FND-016
**Domain**: FND | **LO**: LO-FND-A01 | **Bloom**: Evaluate

A client needs to run a regulated financial application that requires physical isolation, dedicated hardware, and no shared-tenant risk. Which deployment model should you recommend?

- A. Public Cloud with Security Groups enabled
- B. Bare Metal Cloud or Dedicated Server
- C. Shared Hosting with SSL
- D. Object Storage in a private container

**Correct**: B | Physical isolation with no shared-tenant risk requires single-tenant hardware. Bare Metal or Dedicated Servers provide this. Security Groups on Public Cloud do not eliminate multi-tenancy at the hypervisor level.

---

### Q-FND-017
**Domain**: FND | **LO**: LO-FND-A01 | **Bloom**: Analyze

A startup needs to run development workloads that start and stop frequently, with no predictable schedule. Cost optimization is the primary driver. Which model is most appropriate?

- A. Reserved instances with a 1-year commitment
- B. Pay-as-you-go Public Cloud instances
- C. Dedicated server with monthly billing
- D. Hosted Private Cloud

**Correct**: B | Pay-as-you-go Public Cloud is ideal for unpredictable, intermittent workloads. Reserved instances require commitment and are best for stable base load. Dedicated and HPC have fixed monthly costs regardless of usage.

---

### Q-FND-018
**Domain**: FND | **LO**: LO-FND-A02 | **Bloom**: Recommend

Northwind Analytics processes logistics data for European B2B customers. Their contracts require data to stay within EU jurisdiction. Which OVHcloud practice should the architect apply by reflex?

- A. Use only OVHcloud regions in France
- B. Deploy in any OVHcloud EU region and document the contractual sovereign commitment
- C. Use a multi-cloud setup with AWS eu-west-1 as backup
- D. Encrypt all data and store it in any global region

**Correct**: B | Any OVHcloud EU region satisfies the jurisdiction requirement. Restricting to France only (A) is an unnecessary constraint. Multi-cloud with AWS (C) introduces non-EU jurisdiction. Encryption alone (D) does not address jurisdiction.

---

## Domain PCI — Public Cloud Projects & Identity (15 questions)

---

### Q-PCI-001
**Domain**: PCI | **LO**: LO-PCI-K01 | **Bloom**: Define

What is an OVHcloud Public Cloud Project?

- A. A billing contract between OVHcloud and a reseller
- B. An isolated OpenStack tenant with its own resource quota and billing boundary
- C. A monitoring dashboard grouping multiple services
- D. A GitHub repository containing IaC configurations

**Correct**: B | A Public Cloud Project is the fundamental organizational unit: an OpenStack tenant with isolated resources, its own quota, and a separate billing line on the invoice. The other answers describe unrelated things.

---

### Q-PCI-002
**Domain**: PCI | **LO**: LO-PCI-K01 | **Bloom**: Understand

Northwind Analytics runs production and staging workloads. Why should these be placed in separate Public Cloud Projects?

- A. Because OVHcloud does not allow multiple instances in one project
- B. To achieve billing isolation and prevent staging resources from impacting production quotas
- C. Because networking between projects is not supported
- D. To get a discount on the second project

**Correct**: B | Separate projects provide billing isolation (separate invoices), quota isolation (staging cannot exhaust production vCPU quota), and access control separation. A, C, D are factually incorrect.

---

### Q-PCI-003
**Domain**: PCI | **LO**: LO-PCI-K02 | **Bloom**: Remember

What is the OVHcloud NIC Handle?

- A. A network interface card identifier for bare metal servers
- B. The unique identifier for an OVHcloud customer account
- C. The API token used for Terraform authentication
- D. The OpenStack user UUID

**Correct**: B | The NIC Handle (format: ab123456-ovh) is the unique identifier for an OVHcloud customer account. It is separate from OpenStack user IDs and Terraform tokens.

---

### Q-PCI-004
**Domain**: PCI | **LO**: LO-PCI-K03 | **Bloom**: Identify

A Public Cloud Project has been created in region GRA9. The team later needs to deploy resources in DE1 (Frankfurt). What must they do?

- A. Create a new Public Cloud Project for DE1
- B. Activate the DE1 region within the existing project
- C. Open a support ticket to request DE1 access
- D. Create a vRack to bridge GRA9 and DE1

**Correct**: B | Within the same Public Cloud Project, you can activate additional regions. Resources in different activated regions share the same project billing and quota. No new project or support ticket is needed.

---

### Q-PCI-005
**Domain**: PCI | **LO**: LO-PCI-K04 | **Bloom**: Remember

What is a resource quota in OVHcloud Public Cloud?

- A. A pricing ceiling that prevents billing above a set amount
- B. A per-project limit on the number of resources that can be deployed
- C. A performance limit applied to individual instances
- D. A contractual limit on the number of support tickets

**Correct**: B | Quotas are resource caps per project and per region (e.g., max vCPUs, RAM, instances, volumes). They prevent uncontrolled resource consumption. They are not billing caps or performance limits.

---

### Q-PCI-006
**Domain**: PCI | **LO**: LO-PCI-K04 | **Bloom**: Apply

The Northwind ops team tries to deploy a new instance and receives the error: "Quota exceeded: instances." What is the correct next action?

- A. Delete all existing instances to make room
- B. Open a quota increase request in the OVHcloud Manager
- C. Switch to a different OVHcloud region automatically
- D. Upgrade the OVHcloud account to Enterprise support

**Correct**: B | Quota increases are requested directly from the Manager (Project > Quota). They are reviewed by OVHcloud and typically approved quickly. Deleting instances to "make room" is disruptive. Quotas are per-region, not per-support-tier.

---

### Q-PCI-007
**Domain**: PCI | **LO**: LO-PCI-K05 | **Bloom**: Compare

What is the primary difference between OVHcloud Manager and Horizon for managing a Public Cloud Project?

- A. Horizon is OVHcloud's custom UI; Manager is the OpenStack-native UI
- B. Manager is OVHcloud's UI for all products including billing; Horizon is the OpenStack-native UI for project resources
- C. Horizon supports more regions than Manager
- D. Manager requires a VPN; Horizon is publicly accessible

**Correct**: B | Manager is OVHcloud's product portal covering billing, support, and all products. Horizon is the OpenStack-native dashboard accessible within a project for lower-level resource management. A inverts the definition.

---

### Q-PCI-008
**Domain**: PCI | **LO**: LO-PCI-S01 | **Bloom**: Apply

Which of the following is required to create a Public Cloud Project?

- A. A valid NIC Handle with payment method on file
- B. An active SSH key already uploaded
- C. A pre-existing vRack
- D. A Terraform workspace configuration

**Correct**: A | Creating a project requires an authenticated OVHcloud customer account (NIC Handle) with a registered payment method. SSH keys, vRack, and Terraform are optional and configured after project creation.

---

### Q-PCI-009
**Domain**: PCI | **LO**: LO-PCI-S02 | **Bloom**: Apply

After activating a new region in an existing project, what is automatically created in that region?

- A. A default instance with Ubuntu
- B. A default SSH key pair
- C. A default private network
- D. Nothing — resources must be created explicitly

**Correct**: D | Activating a region provisions the OpenStack endpoint quota allocation but creates no resources automatically. The user must explicitly create instances, networks, etc.

---

### Q-PCI-010
**Domain**: PCI | **LO**: LO-PCI-S03 | **Bloom**: Apply

An SSH key is uploaded to a Public Cloud Project. At which point is it injected into a new instance?

- A. When the instance is first started after creation
- B. During instance provisioning, via cloud-init
- C. After the first SSH login by the user
- D. When the key is associated with a security group rule

**Correct**: B | SSH keys are injected during instance provisioning via cloud-init (in the `authorized_keys` file of the default user). They cannot be injected post-creation through the platform. D is incorrect — SSH keys are not part of security groups.

---

### Q-PCI-011
**Domain**: PCI | **LO**: LO-PCI-S04 | **Bloom**: Apply

What distinguishes an OpenStack user from the OVHcloud NIC Handle?

- A. OpenStack users can access all OVHcloud products; NIC Handles are project-scoped
- B. OpenStack users are project-scoped with OpenStack API credentials; the NIC Handle manages the OVHcloud account globally
- C. The NIC Handle is required for OpenStack CLI; OpenStack users are only for the Manager UI
- D. They are identical — OpenStack users and NIC Handles share the same credentials

**Correct**: B | OpenStack users are per-project credentials used to authenticate to OpenStack APIs. The NIC Handle is the account-level identity for all OVHcloud products. They are separate identity systems.

---

### Q-PCI-012
**Domain**: PCI | **LO**: LO-PCI-S05 | **Bloom**: Explain

What is the purpose of sourcing the OpenStack RC file in a terminal session?

- A. To install the OpenStack CLI on the workstation
- B. To set environment variables that authenticate subsequent CLI commands against the project
- C. To download the Terraform OVH provider
- D. To configure SSH key access for the project

**Correct**: B | The RC file sets OS_AUTH_URL, OS_USERNAME, OS_PASSWORD, OS_PROJECT_ID, and related variables. Once sourced, CLI commands like `openstack server list` authenticate automatically. It does not install software.

---

### Q-PCI-013
**Domain**: PCI | **LO**: LO-PCI-S06 | **Bloom**: Apply

Which path in the OVHcloud Manager is used to request a quota increase for a Public Cloud Project?

- A. Support > Create a ticket > Quota request
- B. Public Cloud > [Project] > Quota and Regions > Increase quota
- C. Billing > Contracts > Resource allocation
- D. Manager Home > Account settings > Limits

**Correct**: B | Quota increase requests are managed directly within the project settings under "Quota and Regions." A support ticket is not required for standard quota increases.

---

### Q-PCI-014
**Domain**: PCI | **LO**: LO-PCI-A01 | **Bloom**: Recommend

Northwind Analytics has three teams: DevOps, Backend, and QA. Each team must not be able to see the other teams' resources. What is the recommended project structure?

- A. One project with security groups per team
- B. One project with separate private networks per team
- C. One project per team (three projects total)
- D. One project with RBAC roles per team

**Correct**: C | Project-level isolation is the recommended approach for full resource and billing isolation between teams. Security groups and private networks are network-level controls, not resource visibility controls. RBAC within one project still exposes all resources to account admins.

---

### Q-PCI-015
**Domain**: PCI | **LO**: LO-PCI-A02 | **Bloom**: Evaluate

A CI/CD pipeline needs to deploy infrastructure to a Public Cloud Project. Which identity type is most appropriate?

- A. The lead developer's NIC Handle password
- B. An OpenStack application credential scoped to the target project
- C. A shared OpenStack user account used by the whole team
- D. A new NIC Handle created specifically for automation

**Correct**: B | Application credentials are the best practice for automation: they are project-scoped, do not require a user password, can be revoked independently, and do not expire unless explicitly set to do so. Shared accounts and personal credentials are security anti-patterns.

---

## Domain CMP — Compute (22 questions)

---

### Q-CMP-001
**Domain**: CMP | **LO**: LO-CMP-K01 | **Bloom**: Explain

How does the OVHcloud Public Cloud compute model differ from running VMs on an on-premises VMware cluster?

- A. OVHcloud uses containers instead of VMs
- B. OVHcloud requires a minimum 3-year contract for compute resources
- C. OVHcloud provides compute as a service with per-hour billing and no hardware management
- D. OVHcloud VMs run directly on bare metal without a hypervisor

**Correct**: C | IaaS compute means the customer consumes compute without managing physical hardware, with per-hour billing and elastic provisioning. VMware on-premises requires hardware procurement and perpetual management.

---

### Q-CMP-002
**Domain**: CMP | **LO**: LO-CMP-K02 | **Bloom**: Identify

In OVHcloud's flavor naming convention, what does the letter family prefix indicate?

- A. The geographic region of the instance
- B. The compute resource profile (balanced, CPU, RAM, IOPS, GPU...)
- C. The generation of the hypervisor hardware
- D. The operating system family supported by the flavor

**Correct**: B | The family prefix encodes the resource profile: b = balanced, c = CPU-optimized, r = RAM-optimized, i = high IOPS, g = GPU. The region and OS are separate parameters.

---

### Q-CMP-003
**Domain**: CMP | **LO**: LO-CMP-K02 | **Bloom**: Apply

Northwind's PostgreSQL primary server experiences memory pressure. The ops team should migrate to which flavor family?

- A. c (CPU-optimized)
- B. b (balanced)
- C. r (RAM-optimized)
- D. i (high IOPS)

**Correct**: C | RAM-optimized flavors (r family) maximize memory per vCPU, ideal for in-memory workloads like database servers under memory pressure. CPU-optimized is for compute-intensive tasks; balanced is a general baseline.

---

### Q-CMP-004
**Domain**: CMP | **LO**: LO-CMP-K02 | **Bloom**: Remember

Which flavor family is appropriate for a machine learning training workload that requires GPU acceleration?

- A. r (RAM-optimized)
- B. b (balanced)
- C. g (GPU)
- D. c (CPU-optimized)

**Correct**: C | GPU flavors (g family) include NVIDIA GPU cards for accelerated computing. CPU and RAM families do not provide GPU resources.

---

### Q-CMP-005
**Domain**: CMP | **LO**: LO-CMP-K03 | **Bloom**: Decode

What does the flavor name `b2-15` represent?

- A. Balanced family, generation 2, 15 vCPUs
- B. Balanced family, generation 2, 15 GB of RAM
- C. Batch family, zone 2, 15 GB storage
- D. Basic family, 2 vCPUs, 15 GB storage

**Correct**: B | OVHcloud flavor naming: [family][generation]-[RAM in GB]. b2-15 = balanced, generation 2, 15 GB RAM. The number after the hyphen encodes RAM, not vCPUs or storage.

---

### Q-CMP-006
**Domain**: CMP | **LO**: LO-CMP-K03 | **Bloom**: Apply

A team needs a CPU-optimized instance with 60 GB of RAM. Based on OVHcloud naming conventions, which flavor slug would match?

- A. b2-60
- B. c2-60
- C. r2-60
- D. g2-60

**Correct**: B | c = CPU-optimized, 2 = generation, 60 = 60 GB RAM. b2-60 would be balanced. r2-60 would be RAM-optimized. g2 does not exist in that form (GPU flavors have different sizing).

---

### Q-CMP-007
**Domain**: CMP | **LO**: LO-CMP-K04 | **Bloom**: Distinguish

What is the difference between a public image and a private image in OVHcloud Public Cloud?

- A. Public images are free; private images are billed per GB stored
- B. Public images are maintained by OVHcloud; private images are snapshots or custom images created by the customer
- C. Public images can only be used in one region; private images are global
- D. Private images require a dedicated server to create

**Correct**: B | OVHcloud maintains public images (Ubuntu, Debian, Windows, etc.) and updates them. Private images are customer-created (from instance snapshots or uploaded ISOs) and scoped to the customer's project.

---

### Q-CMP-008
**Domain**: CMP | **LO**: LO-CMP-K04 | **Bloom**: Identify

Which of the following is typically available as a pre-installed OVHcloud public image?

- A. Oracle Database 19c
- B. SAP S/4HANA
- C. Ubuntu 22.04 LTS
- D. VMware ESXi 8

**Correct**: C | OVHcloud provides standard Linux distributions (Ubuntu, Debian, CentOS/Rocky, Fedora) and Windows Server as public images. Oracle DB, SAP, and VMware ESXi are not provided as pre-installed public cloud images.

---

### Q-CMP-009
**Domain**: CMP | **LO**: LO-CMP-K05 | **Bloom**: Explain

Why must an SSH key be added to a Public Cloud Project before deploying a Linux instance?

- A. SSH keys are used to encrypt the instance disk
- B. The SSH key is injected at provisioning time as the only authentication method for the default user
- C. SSH keys are required to activate the region
- D. Without an SSH key, the instance cannot connect to the private network

**Correct**: B | Linux instances on OVHcloud disable password authentication by default. The only way to log in to the default user is via the SSH public key injected during provisioning. Without it, remote access is impossible after creation.

---

### Q-CMP-010
**Domain**: CMP | **LO**: LO-CMP-K06 | **Bloom**: Define

What is cloud-init in the context of OVHcloud Public Cloud Instances?

- A. A network initialization protocol for floating IPs
- B. A first-boot configuration system that runs scripts and applies settings when an instance is first created
- C. OVHcloud's auto-scaling controller
- D. A tool to generate OpenStack RC files

**Correct**: B | Cloud-init is an industry-standard first-boot mechanism used by OVHcloud (and all major cloud providers) to inject SSH keys, run user-data scripts, configure hostname, and apply initial setup.

---

### Q-CMP-011
**Domain**: CMP | **LO**: LO-CMP-S01 | **Bloom**: Apply

When deploying an instance via OVHcloud Manager, which of the following parameters is NOT required?

- A. Region
- B. Flavor
- C. Image
- D. vRack ID

**Correct**: D | Region, flavor, and image are mandatory for any instance deployment. Attaching to a vRack or private network is optional — an instance can be deployed on the public network only.

---

### Q-CMP-012
**Domain**: CMP | **LO**: LO-CMP-S02 | **Bloom**: Apply

A Linux instance has just been deployed in GRA9. The ops engineer has the instance public IP and the SSH private key. Which command connects to the instance as the default user (Ubuntu image)?

- A. `ssh root@<public-ip>`
- B. `ssh admin@<public-ip> -i key.pem`
- C. `ssh ubuntu@<public-ip> -i key.pem`
- D. `ssh ovhcloud@<public-ip>`

**Correct**: C | Ubuntu images on OVHcloud use `ubuntu` as the default user. The private key must be specified with `-i`. Root login is disabled by default. `admin` and `ovhcloud` are not valid default users.

---

### Q-CMP-013
**Domain**: CMP | **LO**: LO-CMP-S03 | **Bloom**: Apply

What happens to the billing of a Public Cloud Instance when it is powered off (stopped) from within the OS but not deleted?

- A. Billing stops entirely — a stopped instance does not consume billable resources
- B. Billing continues — the compute slot (vCPU/RAM) is still reserved even when the instance is off
- C. Billing switches to a reduced standby rate
- D. The instance is automatically deleted after 24 hours with no billing

**Correct**: B | Stopping an instance from the OS or via the Manager does NOT free the compute slot. The flavor vCPU and RAM reservation continues billing. To stop compute billing, the instance must be shelved or deleted.

---

### Q-CMP-014
**Domain**: CMP | **LO**: LO-CMP-S03 | **Bloom**: Apply

Northwind's batch processing instance is needed only during business hours (8h–18h, weekdays). Which instance state minimizes cost outside of business hours without losing configuration?

- A. Power off the instance and keep it in Stopped state
- B. Shelve the instance outside business hours
- C. Delete the instance nightly and recreate it each morning from a snapshot
- D. Resize the instance to a t1 shared flavor outside business hours

**Correct**: B | Shelving serializes the instance to object storage and frees the compute slot, stopping vCPU/RAM billing. Stopped state still bills for compute. Deleting and recreating is operationally complex. Resizing still incurs compute billing.

---

### Q-CMP-015
**Domain**: CMP | **LO**: LO-CMP-S05 | **Bloom**: Apply

A newly created security group has no rules. What traffic policy does it enforce?

- A. Allow all inbound and outbound
- B. Allow all inbound, deny all outbound
- C. Deny all inbound, allow all outbound
- D. Deny all inbound and outbound

**Correct**: C | OVHcloud security groups follow a default-deny-inbound, allow-outbound posture. No inbound rule = no inbound traffic. Outbound is permitted unless explicitly restricted.

---

### Q-CMP-016
**Domain**: CMP | **LO**: LO-CMP-S05 | **Bloom**: Apply

Northwind's web API instance must accept HTTPS traffic from the internet. Which security group rule should be added?

- A. Ingress, TCP, port 443, source 0.0.0.0/0
- B. Egress, TCP, port 443, destination 0.0.0.0/0
- C. Ingress, UDP, port 443, source 0.0.0.0/0
- D. Ingress, ICMP, any port, source 0.0.0.0/0

**Correct**: A | HTTPS = TCP port 443. Accepting traffic from the internet = ingress, source 0.0.0.0/0. Egress rules control outbound traffic. UDP 443 is used by QUIC/HTTP3, not standard HTTPS. ICMP is for ping, not web traffic.

---

### Q-CMP-017
**Domain**: CMP | **LO**: LO-CMP-S06 | **Bloom**: Apply

When should an instance snapshot be preferred over a manual backup?

- A. When the goal is to reduce storage cost — snapshots are cheaper than backups
- B. When a point-in-time bootable image of the entire instance is needed for duplication or rollback
- C. When the instance disk is larger than 100 GB
- D. When the instance is in a private network with no public IP

**Correct**: B | An instance snapshot creates a bootable image stored in Glance. It is ideal for duplicating instances or rolling back to a known state. Snapshots are not necessarily cheaper than backups and have no size or network prerequisites.

---

### Q-CMP-018
**Domain**: CMP | **LO**: LO-CMP-S07 | **Bloom**: Apply

Northwind's instance has a corrupted `/etc/fstab` that prevents normal boot. What is the correct recovery method?

- A. Restore from the last snapshot, which will overwrite the current disk
- B. Boot the instance in rescue mode to mount the original disk and correct the file
- C. Delete the instance and redeploy from image
- D. Contact OVHcloud support to remotely repair the filesystem

**Correct**: B | Rescue mode boots from a separate image, mounts the original disk as a secondary device, and allows filesystem and configuration repair. Restoring from snapshot is destructive (loses changes since snapshot). Deletion is irreversible.

---

### Q-CMP-019
**Domain**: CMP | **LO**: LO-CMP-S08 | **Bloom**: Apply

When resizing an instance to a larger flavor on OVHcloud, what is a key prerequisite?

- A. The instance must be in a region with at least two availability zones
- B. The instance must be stopped or shelved before the resize operation
- C. A snapshot must be created before resizing
- D. The target flavor must be in the same family as the current flavor

**Correct**: B | OVHcloud requires the instance to be stopped before a flavor resize. Cross-family resizes are supported. Creating a snapshot beforehand is recommended practice but not a platform prerequisite. AZ count is irrelevant.

---

### Q-CMP-020
**Domain**: CMP | **LO**: LO-CMP-S09 | **Bloom**: Distinguish

What is the primary difference between stopping an instance and shelving it?

- A. Stopping is permanent; shelving is temporary
- B. Shelving offloads the instance to object storage and frees the compute slot; stopping keeps the compute slot reserved
- C. Stopping deletes attached volumes; shelving preserves them
- D. Shelving is only available for flavors with local SSD storage

**Correct**: B | Shelve: instance serialized to object storage, compute slot freed, vCPU/RAM billing stops. Stop: instance powered off, compute slot still reserved, billing continues. Neither operation deletes attached volumes.

---

### Q-CMP-021
**Domain**: CMP | **LO**: LO-CMP-A02 | **Bloom**: Recommend

Northwind's PostgreSQL primary server serves read-heavy queries with 200+ concurrent connections. The bottleneck is CPU, not memory or IOPS. Which flavor family should be recommended?

- A. r (RAM-optimized)
- B. c (CPU-optimized)
- C. i (IOPS-optimized)
- D. b (balanced)

**Correct**: B | A CPU bottleneck with many concurrent connections points to CPU-optimized (c family), which provides more vCPU headroom relative to RAM. RAM-optimized (r) is for memory pressure. IOPS-optimized is for disk-intensive workloads.

---

### Q-CMP-022
**Domain**: CMP | **LO**: LO-CMP-A03 | **Bloom**: Analyze

A nightly ETL job runs from 22:00 to 02:00 every weekday. The rest of the time the instance is idle. What lifecycle posture minimizes cost while ensuring the job starts on schedule?

- A. Keep the instance running 24/7 on a small shared flavor
- B. Shelve the instance and unshelve it at 21:45 via a scheduled script; shelve again at 02:15
- C. Delete and recreate from snapshot nightly using Terraform
- D. Resize to a t1 flavor during idle hours

**Correct**: B | Shelve/unshelve is the cleanest cost-optimization pattern for scheduled workloads: compute billing stops during shelve, the original instance (with its data and configuration) is restored at unshelve. Terraform delete/recreate adds complexity. Resizing still bills for compute.

---

## Domain STO — Storage (24 questions)

---

### Q-STO-001
**Domain**: STO | **LO**: LO-STO-K01 | **Bloom**: Define

What is OVHcloud Block Storage (Additional Volume)?

- A. A network-attached disk that can be mounted to a single instance as a persistent filesystem
- B. An object storage container accessed via HTTP API
- C. A shared NFS mount accessible by multiple instances simultaneously
- D. A local SSD directly attached to the hypervisor for temporary scratch space

**Correct**: A | Block Storage (Additional Volume) is a network-attached persistent disk, mountable to one instance at a time via the block device protocol. Object storage uses HTTP. Shared File System (NFS) is a different product. Local scratch storage is part of flavors, not a separate product.

---

### Q-STO-002
**Domain**: STO | **LO**: LO-STO-K02 | **Bloom**: Define

OVHcloud Object Storage is best described as:

- A. A high-speed block device for database files
- B. An unlimited-scale storage service accessed via HTTP/S3 API, organized in containers/buckets
- C. A POSIX-compliant filesystem mountable by Linux instances
- D. A tape archive for long-term cold data retention

**Correct**: B | Object Storage organizes data as objects in containers (buckets), accessed via OVHcloud's own API (Swift-compatible) or S3-compatible API over HTTP. It is not a block device, not POSIX, and not tape-based.

---

### Q-STO-003
**Domain**: STO | **LO**: LO-STO-K03 | **Bloom**: Compare

Which storage product should be used to provide a shared NFS filesystem accessible by multiple OVHcloud instances simultaneously?

- A. Additional Volume (Block Storage)
- B. Object Storage
- C. Shared File System (Manila)
- D. Cold Archive

**Correct**: C | Shared File System (based on OpenStack Manila) provides NFS/SMB shares mountable by multiple instances simultaneously. Block Storage is single-attachment. Object Storage uses HTTP API, not NFS. Cold Archive is for long-term offline data.

---

### Q-STO-004
**Domain**: STO | **LO**: LO-STO-K04 | **Bloom**: Identify

Which OVHcloud storage product is designed for petabyte-scale, very long-term data archival where retrieval time of several hours is acceptable?

- A. Object Storage Standard
- B. Additional Volume (Block Storage)
- C. Cold Archive
- D. Shared File System

**Correct**: C | Cold Archive is OVHcloud's long-term archival product (tape-backed), designed for data that is rarely accessed. Retrieval is delayed (hours). Object Storage Standard is immediately accessible. Block Storage and File System are live storage.

---

### Q-STO-005
**Domain**: STO | **LO**: LO-STO-K05 | **Bloom**: Distinguish

What is the key difference between an instance snapshot and an Additional Volume backup?

- A. Snapshots are incremental; volume backups are full copies
- B. An instance snapshot creates a bootable image; a volume backup copies the volume data to object storage
- C. Volume backups are faster than instance snapshots
- D. Instance snapshots are stored on local disks; volume backups are stored in the same region only

**Correct**: B | Instance snapshot = bootable image stored in Glance. Volume backup = data copy stored in Object Storage. These are stored in different subsystems and serve different recovery purposes (instance rebuild vs data restore).

---

### Q-STO-006
**Domain**: STO | **LO**: LO-STO-K06 | **Bloom**: Compare

Which Object Storage class provides the lowest latency for frequent read/write operations?

- A. Standard
- B. High Performance
- C. Cloud Archive
- D. Cold Archive

**Correct**: B | High Performance Object Storage is backed by NVMe SSDs and offers the lowest latency. Standard uses HDD/hybrid backends. Cloud Archive and Cold Archive are for infrequent or offline access.

---

### Q-STO-007
**Domain**: STO | **LO**: LO-STO-S01 | **Bloom**: Apply

An Additional Volume has been created in GRA9. What must be done before it can be used by an instance?

- A. Format it with ext4 and mount it — no attachment needed
- B. Attach it to the instance via the Manager or OpenStack API, then format and mount it inside the OS
- C. Attach it via SSH tunnel from the instance
- D. Convert it to an object storage container first

**Correct**: B | The workflow is: create volume → attach to instance (via Manager/API) → format inside the OS → mount. The volume appears as a block device (e.g., /dev/sdb) only after attachment.

---

### Q-STO-008
**Domain**: STO | **LO**: LO-STO-S02 | **Bloom**: Apply

After attaching a brand-new 50 GB Additional Volume to a Linux instance, which sequence of commands makes it usable?

- A. `mount /dev/sdb /data`
- B. `fdisk /dev/sdb` → `mkfs.ext4 /dev/sdb1` → `mount /dev/sdb1 /data`
- C. `openstack volume attach` → `mount`
- D. `dd if=/dev/zero of=/dev/sdb` → `mount /dev/sdb /data`

**Correct**: B | A new volume has no partition table or filesystem. The correct sequence: partition (fdisk), format (mkfs), then mount. Option A skips formatting. C mixes OpenStack CLI with OS commands incorrectly. D would zero-fill the device unnecessarily.

---

### Q-STO-009
**Domain**: STO | **LO**: LO-STO-S03 | **Bloom**: Apply

Before detaching an Additional Volume from a running instance, what must be done inside the OS?

- A. Nothing — OVHcloud handles the detach safely
- B. The volume must be unmounted with `umount` to prevent filesystem corruption
- C. The instance must be powered off before detaching
- D. The volume must be converted to a snapshot before detaching

**Correct**: B | Detaching a mounted volume without unmounting it first risks filesystem corruption. The OS must release all file handles and flush buffers (umount) before the block device is disconnected. The instance does not need to be powered off.

---

### Q-STO-010
**Domain**: STO | **LO**: LO-STO-S04 | **Bloom**: Apply

Northwind needs to store processed logistics reports as static files accessible via HTTP from a web application. Which storage product and operation should they use?

- A. Create an Additional Volume, format it, and expose it via Apache
- B. Create an Object Storage container and upload files using the S3 API
- C. Create a Cold Archive bucket for public access
- D. Use a Shared File System and expose it via NFS over the internet

**Correct**: B | Object Storage with S3-compatible API is designed for serving static files over HTTP at scale. Block Storage requires a running instance to serve files. Cold Archive is not for frequent access. NFS over the internet is a security anti-pattern.

---

### Q-STO-011
**Domain**: STO | **LO**: LO-STO-S05 | **Bloom**: Apply

Which tool can be used to interact with OVHcloud S3-compatible Object Storage from the command line?

- A. `openstack server list`
- B. `aws s3 cp` (configured with OVHcloud S3 endpoint and credentials)
- C. `terraform apply`
- D. `curl -X POST` to the OpenStack Nova API

**Correct**: B | OVHcloud Object Storage supports the S3 API. The AWS CLI (`aws s3`) can be used with the OVHcloud S3 endpoint and compatible credentials. `openstack server list` queries compute. Terraform manages infrastructure, not file uploads. Nova API handles compute.

---

### Q-STO-012
**Domain**: STO | **LO**: LO-STO-S06 | **Bloom**: Apply

Northwind wants Object Storage replication across two regions for disaster recovery. Which feature achieves this?

- A. Volume backup to a second region
- B. Cross-Region Replication (CRR) on the Object Storage container
- C. Automatic snapshots on all instances
- D. vRack peering between regions

**Correct**: B | Cross-Region Replication replicates object storage data automatically to a second region. Volume backup replicates block volumes, not objects. Instance snapshots are compute-level. vRack is networking, not storage replication.

---

### Q-STO-013
**Domain**: STO | **LO**: LO-STO-S07 | **Bloom**: Apply

What is created when you take a snapshot of a Public Cloud Instance?

- A. A compressed archive of the instance's root volume, stored in Object Storage
- B. A bootable image stored in Glance, usable to deploy new instances
- C. A full backup of all attached volumes and the instance configuration
- D. A read-only clone of the instance accessible via SSH

**Correct**: B | An instance snapshot creates a Glance image — a bootable copy of the instance's root disk. It is NOT a backup of attached Additional Volumes. It is not stored in Object Storage (it is in Glance/image service).

---

### Q-STO-014
**Domain**: STO | **LO**: LO-STO-S08 | **Bloom**: Apply

Northwind's PostgreSQL volume has been accidentally corrupted. A volume backup was taken 6 hours ago. What is the correct restore procedure?

- A. Attach the backup directly to the instance as a second disk
- B. Create a new volume from the backup, detach the corrupted volume, attach and mount the restored volume
- C. Delete the instance and redeploy from the instance snapshot
- D. Use `openstack volume transfer` to overwrite the corrupted volume

**Correct**: B | The correct workflow: create a new volume from the backup → detach the corrupted volume → attach the new volume → mount. This preserves the running instance. A: backups cannot be attached directly. C: restoring from an instance snapshot would not include the additional volume data.

---

### Q-STO-015
**Domain**: STO | **LO**: LO-STO-A01 | **Bloom**: Recommend

Northwind's batch job produces 500 GB of JSON result files that must be queryable by a downstream analytics pipeline via HTTP. Which storage type is recommended?

- A. Additional Volume (Block Storage)
- B. Shared File System
- C. Object Storage
- D. Cold Archive

**Correct**: C | Object Storage is the correct fit: HTTP-native access, scales to petabytes, no capacity management needed, S3-compatible for analytics tools. Block storage requires an instance as intermediary. Cold Archive is for infrequent access. NFS is not HTTP-native.

---

### Q-STO-016
**Domain**: STO | **LO**: LO-STO-A01 | **Bloom**: Recommend

A team shares a large dataset across four instances simultaneously. The data must be writable by all four at the same time. Which storage product is required?

- A. Object Storage (S3)
- B. Additional Volume — attach to all four instances
- C. Shared File System (Manila)
- D. Four separate Additional Volumes, one per instance

**Correct**: C | Shared File System provides concurrent multi-instance read/write access via NFS/SMB. Object Storage is not a filesystem (no POSIX locking). Additional Volumes can only be attached to ONE instance at a time.

---

### Q-STO-017
**Domain**: STO | **LO**: LO-STO-A02 | **Bloom**: Evaluate

Which backup strategy provides the best balance of recovery speed and cost for Northwind's production PostgreSQL server?

- A. Daily instance snapshots, 7-day retention, no volume backup
- B. Daily volume backups to Object Storage + weekly instance snapshots, 30-day retention
- C. No backup — rely on RAID for availability
- D. Real-time replication to a Cold Archive bucket

**Correct**: B | Volume backups cover the data volume (critical for PostgreSQL); instance snapshots cover the server configuration. Layered retention matches the 30-day policy. Instance snapshots alone (A) miss the data on attached volumes. RAID (C) is not a backup. Cold Archive (D) has delayed retrieval.

---

### Q-STO-018
**Domain**: STO | **LO**: LO-STO-A03 | **Bloom**: Analyze

Northwind's SLA requires an RTO of 1 hour for the PostgreSQL server. Which backup approach supports this RTO?

- A. Cold Archive with a 4-hour retrieval SLA
- B. Daily volume backups in the same region, restorable to a new volume in minutes
- C. Weekly instance snapshots in a different region
- D. Manual database dumps stored on the instance's root disk

**Correct**: B | Volume backups in the same region can be restored to a new volume in minutes — well within a 1-hour RTO. Cold Archive retrieval takes hours. Weekly snapshots miss the RPO. Dumps on the root disk are lost if the instance is deleted.

---

### Q-STO-019
**Domain**: STO | **LO**: LO-STO-A01 | **Bloom**: Recommend

Northwind's PostgreSQL WAL (write-ahead log) files are written continuously at high throughput. Which storage type is most appropriate?

- A. Object Storage Standard
- B. Additional Volume (Block Storage) — High IOPS flavor
- C. Cold Archive
- D. Shared File System

**Correct**: B | WAL files require fast sequential block I/O with low latency. Additional Volume on a high-IOPS instance or backed by high-performance volumes is the correct choice. Object Storage has HTTP overhead. Cold Archive is offline. NFS adds network latency.

---

### Q-STO-020
**Domain**: STO | **LO**: LO-STO-K04 | **Bloom**: Apply

Which OVHcloud feature automates the lifecycle transition of objects from Standard to Cold Archive after a configurable retention period?

- A. Automatic instance snapshots
- B. Object Storage lifecycle policy rules
- C. Volume backup scheduling
- D. Terraform `time_sleep` resource

**Correct**: B | Object Storage lifecycle policies allow configuring rules to transition objects to lower-cost storage classes or delete them after a defined number of days. This is an S3-compatible feature (similar to AWS S3 Lifecycle Rules).

---

### Q-STO-021
**Domain**: STO | **LO**: LO-STO-K05 | **Bloom**: Distinguish

How does a volume snapshot differ from an instance snapshot?

- A. Volume snapshots capture the full VM state including RAM; instance snapshots only capture the disk
- B. Volume snapshots are point-in-time copies of one Additional Volume; instance snapshots create a bootable image of the root disk
- C. Volume snapshots are stored in Glance; instance snapshots are stored in Cinder
- D. They are identical — both create the same artifact

**Correct**: B | Volume snapshot = point-in-time copy of an Additional Volume, stored in Cinder. Instance snapshot = bootable Glance image of the root disk. They are stored in different subsystems and have different use cases.

---

### Q-STO-022
**Domain**: STO | **LO**: LO-STO-K03 | **Bloom**: Distinguish

An application needs to read and write files using standard POSIX filesystem calls (open, read, write, close). Object Storage is not suitable because:

- A. Object Storage cannot store more than 5 GB per file
- B. Object Storage uses an HTTP API, not POSIX filesystem calls — it is not mountable as a filesystem
- C. Object Storage requires a Dedicated Server
- D. Object Storage is read-only

**Correct**: B | Object Storage operates via an HTTP/S3 API. It does not expose a POSIX interface. Applications that use standard file system calls (fopen, fwrite) need block storage or a POSIX-compatible file system (Shared File System).

---

### Q-STO-023
**Domain**: STO | **LO**: LO-STO-K06 | **Bloom**: Apply

Northwind needs to store compliance audit logs that must be immutable for 7 years. Which Object Storage feature enforces this?

- A. Container-level encryption
- B. Object locking (WORM — Write Once, Read Many)
- C. Cross-Region Replication
- D. High Performance storage class

**Correct**: B | Object locking (WORM) prevents modification or deletion of objects for a defined retention period. This is the correct feature for regulatory immutability requirements. Encryption protects confidentiality, not immutability. CRR is for redundancy. HP is for performance.

---

### Q-STO-024
**Domain**: STO | **LO**: LO-STO-A02 | **Bloom**: Apply

The 3-2-1 backup rule states: 3 copies of data, 2 different storage media, 1 copy offsite. Which OVHcloud practice satisfies this rule for a PostgreSQL database?

- A. Two volume snapshots in the same region
- B. Daily volume backup to Object Storage in region A + one cross-region backup to Object Storage in region B
- C. Three instance snapshots in GRA9
- D. One volume backup and one manual dump file stored on the root disk

**Correct**: B | Three copies: original volume + Object Storage backup in A + Object Storage backup in B. Two media: block (volume) + object (two buckets). One offsite: different region. Options A and C lack media diversity and offsite. D keeps both copies on the same instance.

---

## Domain NET — Network (22 questions)

---

### Q-NET-001
**Domain**: NET | **LO**: LO-NET-K01 | **Bloom**: Define

What is the purpose of the Ext-Net network in an OVHcloud Public Cloud region?

- A. A private management network accessible only by OVHcloud operators
- B. The public network that provides internet-routable IPv4 addresses to instances
- C. A dedicated network for vRack connectivity
- D. An isolated network for Object Storage access

**Correct**: B | Ext-Net is the public internet-facing network in each OVHcloud region. Instances attached to Ext-Net receive a public IPv4 address. It is not private, not vRack, and not storage-specific.

---

### Q-NET-002
**Domain**: NET | **LO**: LO-NET-K02 | **Bloom**: Define

What does creating a "Private Network" in a Public Cloud Project provide?

- A. Internet connectivity without a public IP
- B. An isolated Layer 2 segment within the project, accessible only by instances attached to it
- C. A dedicated fiber link to the customer's on-premises network
- D. Automatic encryption of all traffic between instances

**Correct**: B | A Private Network creates an isolated L2 segment (VLAN) within the project. Instances communicate on private IP addresses without traversing the internet. It does not provide internet connectivity, dedicated fiber, or automatic encryption.

---

### Q-NET-003
**Domain**: NET | **LO**: LO-NET-K03 | **Bloom**: Distinguish

How does an OVHcloud Security Group differ from a traditional network firewall?

- A. Security Groups operate at the network perimeter; firewalls operate at the instance level
- B. Security Groups are stateful rules applied at the instance's virtual network port; a traditional firewall is a perimeter device for the whole network
- C. Security Groups are cheaper but less configurable than a traditional firewall
- D. Security Groups only support IPv6; firewalls support IPv4

**Correct**: B | Security Groups are stateful rules enforced at each instance's vNIC. A traditional firewall is typically a single perimeter device. Security Groups are per-instance; perimeter firewalls are per-network. Both can be configurable.

---

### Q-NET-004
**Domain**: NET | **LO**: LO-NET-K04 | **Bloom**: Define

What is the role of a Floating IP in OVHcloud?

- A. An IP address that migrates automatically between regions for redundancy
- B. A public IP address that can be associated with a specific instance in a private network, enabling inbound connectivity
- C. A static IP reserved for outbound-only NAT
- D. An anycast IP for load balancing across multiple instances

**Correct**: B | A Floating IP is a public IP that can be associated (DNAT) with a specific instance in a private network, enabling both inbound and outbound internet connectivity via that instance. It is not a NAT gateway (outbound only) and is not anycast.

---

### Q-NET-005
**Domain**: NET | **LO**: LO-NET-K05 | **Bloom**: Define

What does the OVHcloud Public Cloud Gateway provide?

- A. Inbound internet access for instances in a private network
- B. Outbound NAT (SNAT) for instances in a private network to reach the internet without a public IP
- C. L2 connectivity between a Public Cloud project and a Dedicated Server
- D. Encrypted VPN tunnels between OVHcloud regions

**Correct**: B | The Gateway is a managed NAT service for outbound-only internet access. Instances in a private network route outbound traffic through the Gateway without needing individual Floating IPs. It does NOT allow inbound connections from the internet.

---

### Q-NET-006
**Domain**: NET | **LO**: LO-NET-K06 | **Bloom**: Define

What is the OVHcloud Public Cloud Load Balancer (Octavia)?

- A. A DNS round-robin service for distributing queries across instances
- B. A managed L4/L7 load balancing service that distributes incoming traffic across a pool of backend instances
- C. A hardware appliance deployed in the customer's rack
- D. A software firewall with traffic shaping capabilities

**Correct**: B | The OVHcloud Load Balancer is based on OpenStack Octavia. It is a managed L4 (TCP) and L7 (HTTP/HTTPS) load balancer that distributes traffic across backend instances in a pool. It is software-based and managed, not hardware.

---

### Q-NET-007
**Domain**: NET | **LO**: LO-NET-K07 | **Bloom**: Explain

What makes vRack different from a standard Public Cloud Private Network?

- A. vRack is faster because it uses 100 Gbps uplinks
- B. vRack is an OVHcloud-wide L2 network that can span multiple products (Dedicated Servers, Bare Metal, Public Cloud projects) across regions
- C. vRack is created automatically when a Public Cloud project is created
- D. vRack replaces the Public Cloud Private Network inside a project

**Correct**: B | vRack is OVHcloud's L2 product designed for cross-product connectivity (Public Cloud + Bare Metal + Dedicated Servers) across regions. A standard Private Network is scoped within a single project. vRack is not automatic and does not replace Private Networks.

---

### Q-NET-008
**Domain**: NET | **LO**: LO-NET-S01 | **Bloom**: Apply

When creating a Private Network in a Public Cloud Project, which parameter defines the IP address range for instances on that network?

- A. The VLAN ID
- B. The subnet CIDR
- C. The Gateway IP
- D. The DNS server address

**Correct**: B | The subnet CIDR (e.g., 192.168.1.0/24) defines the IP range for the private network. The VLAN ID is an internal tag. The Gateway and DNS are optional settings within the subnet configuration.

---

### Q-NET-009
**Domain**: NET | **LO**: LO-NET-S02 | **Bloom**: Apply

An instance was deployed with only a public IP (Ext-Net). How can it be added to a private network without redeploying it?

- A. It cannot — network interfaces must be defined at instance creation
- B. Attach a new private network interface to the instance via the Manager or OpenStack API
- C. Create a vRack and bridge the instance automatically
- D. Assign a Floating IP, which creates a private network interface

**Correct**: B | OVHcloud allows adding network interfaces to existing instances post-creation. The new interface can be added via the Manager (Networking > Private Networks) or via OpenStack API (`openstack server add network`). vRack and Floating IPs do not automatically create private interfaces.

---

### Q-NET-010
**Domain**: NET | **LO**: LO-NET-S03 | **Bloom**: Apply

A Security Group rule must allow SSH from the ops team's office (IP: 203.0.113.50) only. Which rule correctly expresses this?

- A. Ingress, TCP, port 22, source 203.0.113.50/32
- B. Egress, TCP, port 22, destination 0.0.0.0/0
- C. Ingress, UDP, port 22, source 0.0.0.0/0
- D. Ingress, TCP, port 22, source 0.0.0.0/0

**Correct**: A | Ingress (inbound), TCP, port 22 (SSH), /32 mask (single IP). Egress rule (B) would restrict outbound, not inbound. UDP port 22 (C) is not SSH. 0.0.0.0/0 (D) allows all internet, not just the ops office.

---

### Q-NET-011
**Domain**: NET | **LO**: LO-NET-S04 | **Bloom**: Apply

Northwind's web server is in a private network. It needs to be reachable from the internet on port 443. What must be done?

- A. Add a Security Group rule for port 443 only — no IP change needed
- B. Assign a Floating IP to the instance and add a Security Group rule allowing TCP 443
- C. Add the instance to a vRack
- D. Deploy a Gateway and forward port 443

**Correct**: B | An instance in a private network has no public IP. A Floating IP provides the public address. The Security Group must then permit inbound TCP 443. A Gateway provides outbound NAT only, not inbound access. vRack is for L2 interconnect, not internet exposure.

---

### Q-NET-012
**Domain**: NET | **LO**: LO-NET-S05 | **Bloom**: Apply

To deploy an OVHcloud Load Balancer in front of two backend instances, what must be configured?

- A. A vRack and an external DNS record
- B. A listener (frontend) defining the incoming protocol and port, and a pool (backend) containing the two instances
- C. A Security Group allowing all traffic between the two instances
- D. A Floating IP per backend instance

**Correct**: B | OVHcloud Load Balancer requires: a listener (protocol, port on the LB side) and a pool (backend members). vRack is optional. DNS is external. Floating IPs on backends are not required when using a Load Balancer.

---

### Q-NET-013
**Domain**: NET | **LO**: LO-NET-S06 | **Bloom**: Apply

Northwind deploys a database instance in a private network with no Floating IP. It needs to download OS updates from the internet. What component must be deployed?

- A. A Floating IP on the database instance
- B. A Public Cloud Gateway in the private network
- C. A Load Balancer listener on port 80
- D. A vRack peering to the public network

**Correct**: B | The Gateway provides outbound NAT for instances with no public IP. The database instance routes outbound traffic through the Gateway without being directly reachable from the internet — correct security posture. A Floating IP would also expose it to inbound traffic.

---

### Q-NET-014
**Domain**: NET | **LO**: LO-NET-S07 | **Bloom**: Apply

To connect a Public Cloud project's private network to an OVHcloud Dedicated Server, which product must be configured?

- A. A Floating IP
- B. A Gateway
- C. A vRack
- D. A Load Balancer

**Correct**: C | vRack bridges OVHcloud products including Public Cloud private networks and Dedicated Servers at L2. Floating IPs, Gateways, and Load Balancers are all within the Public Cloud perimeter and do not interconnect with Dedicated Servers.

---

### Q-NET-015
**Domain**: NET | **LO**: LO-NET-A01 | **Bloom**: Recommend

Northwind's API backend instances must reach the internet for outbound calls (e.g., payment API) but must NOT be reachable from the internet. Which network topology is recommended?

- A. Attach all instances to Ext-Net only
- B. Private network + Gateway for outbound; no Floating IP; Security Group denies all inbound
- C. Private network + Floating IP on each instance; Security Group allows only outbound
- D. vRack only — vRack has built-in internet access

**Correct**: B | Private network + Gateway is the canonical zero-inbound-exposure topology. The Gateway provides outbound NAT without exposing instances. Floating IPs would add inbound reachability. vRack alone has no internet access.

---

### Q-NET-016
**Domain**: NET | **LO**: LO-NET-K04 | **Bloom**: Distinguish

What is the decisive factor when choosing between a Floating IP and a Gateway for an instance's internet connectivity?

- A. The number of instances — Gateway is for more than 5; Floating IP for fewer
- B. Whether inbound internet access is needed (Floating IP) or outbound-only (Gateway)
- C. The region — some regions support only Gateway
- D. The flavor family — GPU instances require Floating IPs

**Correct**: B | This is the fundamental architectural distinction: Floating IP enables bidirectional (inbound + outbound) connectivity for a specific instance. Gateway provides shared outbound-only NAT for a whole private network. The choice is driven by the traffic direction requirement.

---

### Q-NET-017
**Domain**: NET | **LO**: LO-NET-K03 | **Bloom**: Apply

Security Groups are described as "stateful." What does this mean in practice?

- A. Security Group rules are saved permanently and survive instance reboots
- B. Return traffic for an allowed connection is automatically permitted without a separate egress rule
- C. Security Groups track CPU and memory state of the instance
- D. Stateful means rules are evaluated in order, with the first match winning

**Correct**: B | Stateful means connection tracking: if an inbound TCP connection is allowed, the return traffic (outbound TCP on the same connection) is automatically permitted. You do not need a separate egress rule for each allowed inbound connection.

---

### Q-NET-018
**Domain**: NET | **LO**: LO-NET-K02 | **Bloom**: Apply

Two instances (A and B) are attached to the same Private Network in the same project and region. Instance A has IP 192.168.1.10 and instance B has 192.168.1.20. How does A reach B?

- A. Via the public internet through Ext-Net
- B. Directly over the private network at L2/L3, without leaving the project
- C. Through a vRack
- D. Through a Load Balancer

**Correct**: B | Instances on the same Private Network communicate directly at L2/L3 (east-west traffic) without touching the internet. No vRack or Load Balancer is needed for intra-project, same-network communication.

---

### Q-NET-019
**Domain**: NET | **LO**: LO-NET-K06 | **Bloom**: Analyze

Northwind deploys two web server instances. Should they use a Load Balancer or assign a Floating IP to one instance for high availability?

- A. Floating IP — it automatically distributes traffic across both instances
- B. Load Balancer — it distributes traffic across both instances and detects backend health
- C. Either — they offer identical functionality
- D. Neither — two instances always balance traffic automatically

**Correct**: B | The Load Balancer distributes traffic across a pool and performs health checks (removing unhealthy backends). A Floating IP can only be assigned to ONE instance at a time — it does not distribute traffic. There is no automatic traffic balancing without a LB.

---

### Q-NET-020
**Domain**: NET | **LO**: LO-NET-K07 | **Bloom**: Distinguish

A Public Cloud private network and a vRack-attached network both use VLAN tagging. What is the key operational difference?

- A. Private networks support IPv6; vRack does not
- B. A Private Network is scoped to one project; vRack spans multiple products and can cross projects and regions
- C. vRack requires dedicated hardware; Private Networks use shared infrastructure
- D. Private Networks are free; vRack is always billed per GB transferred

**Correct**: B | The fundamental difference is scope: Private Networks are isolated within a single project. vRack creates an L2 domain that spans Public Cloud projects, Dedicated Servers, and Bare Metal across OVHcloud products and regions.

---

### Q-NET-021
**Domain**: NET | **LO**: LO-NET-K03 | **Bloom**: Explain

An instance has an inbound Security Group rule allowing TCP 443 from 0.0.0.0/0. The instance initiates an outbound connection to an external API on TCP 443. Is this connection allowed?

- A. No — there is no egress rule permitting outbound TCP 443
- B. Yes — default Security Group policy allows all outbound traffic unless explicitly restricted
- C. No — outbound traffic always requires a Floating IP
- D. Yes — the existing inbound rule automatically creates a matching egress rule

**Correct**: B | Security Groups default to allow-all-egress. The absence of an egress rule means outbound traffic is permitted. The inbound rule for TCP 443 is for incoming connections, not outbound ones.

---

### Q-NET-022
**Domain**: NET | **LO**: LO-NET-A01 | **Bloom**: Analyze

Northwind plans to expand to region DE1 while keeping production in GRA9. The PostgreSQL replica in DE1 must replicate from the primary in GRA9 over a private network. Which component enables this?

- A. A Floating IP on both instances
- B. Cross-region Private Network (not supported — Private Networks are region-scoped)
- C. A vRack spanning both regions
- D. Object Storage Cross-Region Replication

**Correct**: C | vRack is the only OVHcloud component that provides L2 private connectivity across regions. Private Networks are region-scoped and cannot span GRA9 and DE1. Floating IPs are public (not private). CRR is for object storage.

---

## Domain SEC — Identity & Security (18 questions)

---

### Q-SEC-001
**Domain**: SEC | **LO**: LO-SEC-K01 | **Bloom**: Define

What does OVHcloud IAM (Identity and Access Management) control?

- A. Authentication to OpenStack project APIs
- B. Access permissions to OVHcloud products and operations at the account level, managed in the OVHcloud Manager
- C. SSH key distribution to instances
- D. Network access control lists for Private Networks

**Correct**: B | OVHcloud IAM manages who can do what at the OVHcloud Manager level (create projects, manage billing, manage products). It is separate from OpenStack RBAC, which controls access within a project.

---

### Q-SEC-002
**Domain**: SEC | **LO**: LO-SEC-K02 | **Bloom**: Identify

Which OpenStack role grants full administrative control within a Public Cloud Project?

- A. `member`
- B. `reader`
- C. `admin`
- D. `operator`

**Correct**: C | The `admin` role grants full control within an OpenStack project. `member` grants standard read/write access. `reader` grants read-only. `operator` is not a standard OpenStack role.

---

### Q-SEC-003
**Domain**: SEC | **LO**: LO-SEC-K03 | **Bloom**: Distinguish

How does an OpenStack Application Credential differ from a standard OpenStack user account?

- A. Application credentials can access multiple projects; user accounts are single-project
- B. Application credentials are project-scoped secrets that do not require a user password and can be revoked independently
- C. Application credentials require MFA; user accounts do not
- D. Application credentials expire after 24 hours by default

**Correct**: B | Application credentials are project-scoped, independent of the user's password. Revoking them does not affect the user account. They do not require MFA. Expiration is optional, not default 24h. They are NOT cross-project.

---

### Q-SEC-004
**Domain**: SEC | **LO**: LO-SEC-K04 | **Bloom**: Define

What is the OVHcloud Key Management Service (KMS)?

- A. A password manager for storing SSH keys
- B. A managed service for creating, storing, and controlling cryptographic keys used for data encryption
- C. An identity provider for SSO federation
- D. A monitoring service for detecting leaked credentials

**Correct**: B | The KMS manages cryptographic keys for encryption operations. It enables Bring Your Own Key (BYOK) scenarios where customers control the keys used to encrypt their data. It is not a password manager, SSO provider, or security monitoring tool.

---

### Q-SEC-005
**Domain**: SEC | **LO**: LO-SEC-K04 | **Bloom**: Explain

What does "BYOK" (Bring Your Own Key) mean in the context of OVHcloud?

- A. The customer generates and manages their encryption keys using the OVHcloud KMS, instead of using OVHcloud-managed keys
- B. The customer brings a physical USB key to the OVHcloud data center
- C. OVHcloud uses the customer's existing Active Directory for authentication
- D. The customer imports their own TLS certificate for HTTPS traffic

**Correct**: A | BYOK means the customer controls the encryption keys — generated and managed via the KMS — rather than accepting OVHcloud-managed default keys. This provides cryptographic sovereignty. The other options describe different technologies.

---

### Q-SEC-006
**Domain**: SEC | **LO**: LO-SEC-K05 | **Bloom**: Define

Which of the following describes a secret management best practice for a Terraform deployment?

- A. Store database passwords in Terraform .tfvars files committed to Git
- B. Store secrets in a dedicated vault (e.g., HashiCorp Vault) and reference them via dynamic secrets injection
- C. Hardcode credentials in the Terraform provider block for reproducibility
- D. Use environment variables that are printed in CI/CD logs for auditability

**Correct**: B | Secrets should never be stored in Git or hardcoded. Dynamic injection from a vault (fetched at runtime) keeps secrets out of code, config files, and logs. Environment variables can be acceptable but not if they're logged.

---

### Q-SEC-007
**Domain**: SEC | **LO**: LO-SEC-K06 | **Bloom**: Explain

Why are audit logs important in a cloud environment?

- A. They improve instance performance by caching recent operations
- B. They provide a tamper-evident record of who performed which action and when, enabling compliance and incident investigation
- C. They automatically remediate security misconfigurations
- D. They replace the need for security group rules

**Correct**: B | Audit logs record API calls, Manager operations, and user actions with timestamps and identities. They are essential for GDPR compliance, security investigations, and forensic analysis. They are passive observers, not active remediation tools.

---

### Q-SEC-008
**Domain**: SEC | **LO**: LO-SEC-S01 | **Bloom**: Apply

Northwind's ops team needs read-only access to the production project. Which action achieves the principle of least privilege?

- A. Assign the `admin` role so they can see everything without restrictions
- B. Create an OpenStack user with the `reader` role on the production project
- C. Share the lead engineer's application credential with the ops team
- D. Give the ops team the OpenStack RC file with admin credentials

**Correct**: B | The `reader` role grants read-only access, satisfying least privilege. `admin` grants full control — excessive. Sharing another user's credential violates individual accountability. Sharing admin RC files is a major security risk.

---

### Q-SEC-009
**Domain**: SEC | **LO**: LO-SEC-S02 | **Bloom**: Apply

A new team member joins Northwind and needs access to the staging project only. What is the correct access provisioning sequence?

- A. Share the project admin password with the new member
- B. Create an OpenStack user, set a password, and assign the appropriate role on the staging project only
- C. Add the member to the production project and restrict them with Security Group rules
- D. Generate a Floating IP and send the credentials via email

**Correct**: B | Access provisioning: create a dedicated OpenStack user → assign it to the correct project with the appropriate role (e.g., member). This ensures individual accountability and project isolation. Sharing passwords and using security groups for access control are anti-patterns.

---

### Q-SEC-010
**Domain**: SEC | **LO**: LO-SEC-S03 | **Bloom**: Apply

A Terraform pipeline needs to manage resources in a Public Cloud project. Which credential type should be created and why?

- A. A new NIC Handle — because Terraform needs full account access
- B. An OpenStack application credential — because it is project-scoped and does not require a user password
- C. An OpenStack user with admin role — because Terraform needs to manage all resources
- D. A shared team user account — because it is simpler to manage

**Correct**: B | Application credentials are the recommended credential for automation: project-scoped, password-independent, revocable. NIC Handles have account-level scope (excessive). Admin role is more permissions than needed for most IaC scenarios. Shared accounts violate individual accountability.

---

### Q-SEC-011
**Domain**: SEC | **LO**: LO-SEC-S04 | **Bloom**: Apply

An application credential used by a CI/CD pipeline has been potentially compromised. What is the immediate correct action?

- A. Change the OpenStack user's password
- B. Revoke the application credential in the OVHcloud Manager / OpenStack Keystone
- C. Delete the affected project
- D. Rotate the instance SSH keys

**Correct**: B | Application credentials can be revoked independently without affecting the underlying user account or other credentials. This is precisely why they exist — targeted revocation without collateral damage. Changing the user password does not revoke application credentials.

---

### Q-SEC-012
**Domain**: SEC | **LO**: LO-SEC-S05 | **Bloom**: Apply

Northwind must demonstrate to an auditor that all Manager API calls over the last 30 days are traceable to specific users. Where is this information found?

- A. The instance console log
- B. The OVHcloud Manager audit logs (Activity log)
- C. The Grafana monitoring dashboard
- D. The Terraform state file

**Correct**: B | The OVHcloud Manager Activity log records all API-level operations (create, delete, modify) with user, timestamp, and resource. Instance console logs record OS-level events. Grafana records metrics. Terraform state records resource configuration.

---

### Q-SEC-013
**Domain**: SEC | **LO**: LO-SEC-A01 | **Bloom**: Apply

Which of the following reflects the principle of least privilege when setting up access for a backup script?

- A. Create an application credential with `admin` role to ensure the script can handle all scenarios
- B. Create an application credential with `objectstore_operator` role, scoped to the backup bucket only
- C. Use the lead engineer's personal NIC Handle for the backup script
- D. Grant `member` role to the script user and manually remove permissions after the backup

**Correct**: B | Least privilege = only the permissions needed to do the job. A backup script writing to object storage needs objectstore_operator on the target container, nothing more. Admin is excessive. Personal credentials violate accountability. Temporary grants add operational complexity.

---

### Q-SEC-014
**Domain**: SEC | **LO**: LO-SEC-A01 | **Bloom**: Evaluate

Which authentication method is recommended for a production automation pipeline?

- A. A user account with a static password stored in an environment variable
- B. An application credential stored in a secret manager, injected at runtime
- C. The developer's personal NIC Handle with MFA disabled for automation
- D. A shared "automation" OpenStack user with password in the CI/CD config file

**Correct**: B | Application credentials stored in a secret manager and injected at runtime are the most secure automation pattern: no human password, project-scoped, individually revocable, not stored in code or config files.

---

### Q-SEC-015
**Domain**: SEC | **LO**: LO-SEC-A02 | **Bloom**: Anticipate

A new developer accidentally commits an application credential to a public GitHub repository. What should the Northwind security team do first?

- A. Set the GitHub repository to private
- B. Immediately revoke the application credential in OVHcloud
- C. Change the OpenStack user's password
- D. Delete all instances in the affected project

**Correct**: B | The first action is credential revocation. Setting the repo to private does not invalidate already-crawled credentials (bots scrape GitHub in seconds). Changing the user password does not revoke application credentials. Deleting instances is disproportionate.

---

### Q-SEC-016
**Domain**: SEC | **LO**: LO-SEC-K02 | **Bloom**: Evaluate

A team member has been assigned the `admin` role on a production Public Cloud project. What risk does this introduce?

- A. The team member can access other customers' projects
- B. The team member can perform all operations including deleting all instances and volumes in the project
- C. The team member can modify OVHcloud's hypervisor configuration
- D. The team member can see billing information for all OVHcloud customers

**Correct**: B | The OpenStack `admin` role within a project grants full operational control: create, delete, modify all resources. This includes destructive operations (delete all instances, purge all volumes). Admin scope is project-level, not cross-customer or hypervisor.

---

### Q-SEC-017
**Domain**: SEC | **LO**: LO-SEC-K03 | **Bloom**: Apply

An application credential has been created without an explicit expiration date. What is the consequence?

- A. It expires automatically after 90 days
- B. It remains valid indefinitely until explicitly revoked
- C. It expires when the OpenStack user's password is changed
- D. It expires at the end of the billing month

**Correct**: B | Application credentials without an expiration are valid indefinitely. This is why credential rotation and revocation are important operational practices. Changing the user's password does not invalidate associated application credentials.

---

### Q-SEC-018
**Domain**: SEC | **LO**: LO-SEC-A02 | **Bloom**: Recommend

Northwind has three teams (Backend, DevOps, QA) all working on the same Public Cloud project. Each team should only access resources they own. Which approach is recommended?

- A. One shared OpenStack user per team, with passwords documented in the team wiki
- B. Individual OpenStack users per team member, with project roles assigned per team's required access level
- C. One admin user for all teams — simplifies credential management
- D. Application credentials for all teams, stored in the same shared vault

**Correct**: B | Individual users with role-based access ensures accountability (each action is traceable to a person) and enforces least privilege per team. Shared accounts cannot trace individual actions. A single admin for all is a major blast-radius risk.

---

## Domain IAC — Infrastructure as Code (22 questions)

---

### Q-IAC-001
**Domain**: IAC | **LO**: LO-IAC-K01 | **Bloom**: Distinguish

What is the primary advantage of using the OVHcloud CLI or Terraform over the Manager UI for infrastructure management?

- A. CLI and Terraform are faster to render in the browser
- B. They enable repeatable, version-controlled infrastructure definitions that can be reviewed and automated
- C. The Manager UI does not support creating instances
- D. CLI and Terraform are free; Manager UI requires a paid subscription

**Correct**: B | The value of IaC tooling is reproducibility, version control (Git), peer review (PR), and automation (CI/CD). The Manager UI is visual and manual — adequate for exploration but not for production infrastructure management at scale.

---

### Q-IAC-002
**Domain**: IAC | **LO**: LO-IAC-K01 | **Bloom**: Explain

Which tool is used to interact with OpenStack APIs directly from the command line?

- A. `terraform`
- B. `openstack` (OpenStack CLI)
- C. `ovh` (OVHcloud CLI)
- D. `kubectl`

**Correct**: B | The `openstack` CLI is the standard client for OpenStack APIs (compute, storage, network, identity). Terraform manages state declaratively. The OVH CLI manages OVHcloud-specific resources. kubectl is for Kubernetes.

---

### Q-IAC-003
**Domain**: IAC | **LO**: LO-IAC-K02 | **Bloom**: Define

What is the declarative model in Terraform?

- A. You write scripts that execute commands step by step to build infrastructure
- B. You describe the desired end state in .tf files; Terraform figures out the steps to reach that state
- C. Terraform listens for events and reacts to infrastructure changes automatically
- D. You declare variables and Terraform generates the Manager UI configuration

**Correct**: B | Declarative: describe WHAT you want, not HOW to get there. Terraform computes the action plan to converge from the current state to the desired state. Imperative scripting (step-by-step) is the opposite model.

---

### Q-IAC-004
**Domain**: IAC | **LO**: LO-IAC-K03 | **Bloom**: Explain

What is the purpose of the Terraform state file (`terraform.tfstate`)?

- A. To store the Terraform provider credentials securely
- B. To record the current known state of deployed resources so Terraform can compute diffs for future plans
- C. To log all `terraform apply` executions for audit purposes
- D. To define the target state of the infrastructure

**Correct**: B | The state file is Terraform's memory of what it has deployed. It maps resource definitions in .tf files to real resource IDs. Without it, Terraform cannot compute what needs to change. It does not store credentials or define desired state (that is the .tf files).

---

### Q-IAC-005
**Domain**: IAC | **LO**: LO-IAC-K04 | **Bloom**: Identify

Which Terraform provider is used to manage OVHcloud Public Cloud Instances?

- A. The `ovh` provider only
- B. The `openstack` provider (for compute, network, storage) and optionally the `ovh` provider (for OVHcloud-specific resources)
- C. The `aws` provider with OVHcloud endpoint override
- D. The `kubernetes` provider

**Correct**: B | OVHcloud Public Cloud is OpenStack-based. Compute, network, and storage are managed via the `openstack` Terraform provider. The `ovh` provider manages OVHcloud-specific resources (vRack, domains, Managed Kubernetes, etc.).

---

### Q-IAC-006
**Domain**: IAC | **LO**: LO-IAC-K04 | **Bloom**: Distinguish

When should you use the `ovh` Terraform provider instead of the `openstack` provider?

- A. Always — the `ovh` provider replaces the `openstack` provider completely
- B. When managing OVHcloud-specific resources (vRack, DNS zones, OVH Managed Kubernetes) that are not in the OpenStack API
- C. When deploying instances in EU regions only
- D. When the `openstack` provider version is outdated

**Correct**: B | The `ovh` provider wraps OVHcloud's proprietary API for resources that don't exist in the OpenStack API: vRack, DNS, Managed Kubernetes clusters, OVHcloud IAM, etc. OpenStack resources (instances, volumes, networks) use the `openstack` provider.

---

### Q-IAC-007
**Domain**: IAC | **LO**: LO-IAC-S01 | **Bloom**: Apply

Which command lists all running instances in a Public Cloud project using the OpenStack CLI?

- A. `openstack project list`
- B. `openstack server list`
- C. `openstack compute show`
- D. `openstack flavor list`

**Correct**: B | `openstack server list` queries the Nova (Compute) API and returns all instances in the current project. `project list` lists projects. `compute show` is not a valid subcommand. `flavor list` lists available flavors.

---

### Q-IAC-008
**Domain**: IAC | **LO**: LO-IAC-S02 | **Bloom**: Apply

What is the effect of running `source openrc.sh` in a terminal?

- A. It installs the OpenStack CLI package
- B. It sets environment variables (OS_AUTH_URL, OS_USERNAME, OS_PASSWORD, etc.) that authenticate subsequent CLI commands
- C. It generates a new application credential
- D. It initializes a Terraform workspace

**Correct**: B | Sourcing the RC file exports OpenStack authentication environment variables into the current shell session. All subsequent `openstack` CLI commands use these variables to authenticate. It does not install software or generate credentials.

---

### Q-IAC-009
**Domain**: IAC | **LO**: LO-IAC-S03 | **Bloom**: Apply

What does `terraform init` do?

- A. Creates the first resources defined in .tf files
- B. Downloads the required provider plugins and initializes the backend configuration
- C. Shows a plan of changes without applying them
- D. Destroys all resources managed by the current configuration

**Correct**: B | `terraform init` initializes the working directory: downloads provider plugins from the registry and sets up the backend (local or remote state). It does NOT create resources, show a plan, or destroy anything.

---

### Q-IAC-010
**Domain**: IAC | **LO**: LO-IAC-S04 | **Bloom**: Apply

A `terraform plan` output contains lines starting with `+`. What does this indicate?

- A. Resources that will be destroyed
- B. Resources that will be updated in-place
- C. Resources that will be created
- D. Resources that are already up to date

**Correct**: C | In Terraform plan output: `+` = will be created, `-` = will be destroyed, `~` = will be updated in-place. No symbol (or `.`) = no change.

---

### Q-IAC-011
**Domain**: IAC | **LO**: LO-IAC-S05 | **Bloom**: Apply

After reviewing a `terraform plan` output and confirming it is correct, what command applies the changes?

- A. `terraform deploy`
- B. `terraform commit`
- C. `terraform apply`
- D. `terraform push`

**Correct**: C | `terraform apply` executes the plan and provisions/modifies/destroys resources as shown. `deploy`, `commit`, and `push` are not Terraform commands.

---

### Q-IAC-012
**Domain**: IAC | **LO**: LO-IAC-S05 | **Bloom**: Apply

Which command removes all resources managed by a Terraform configuration from the cloud provider?

- A. `terraform apply -destroy`
- B. `terraform delete`
- C. `terraform clean`
- D. `terraform rollback`

**Correct**: A | `terraform apply -destroy` (or `terraform destroy`) removes all resources tracked in the state. `delete`, `clean`, and `rollback` are not valid Terraform commands.

---

### Q-IAC-013
**Domain**: IAC | **LO**: LO-IAC-S06 | **Bloom**: Apply

Why should a production team use a remote Terraform state backend instead of a local `terraform.tfstate` file?

- A. Remote state is faster to read because it is cached on OVHcloud servers
- B. Remote state allows multiple team members to collaborate without state conflicts, and survives developer machine failures
- C. Local state is encrypted by default; remote state is not
- D. Remote state is required by the `ovh` Terraform provider

**Correct**: B | Remote state (stored in Object Storage, Terraform Cloud, etc.) enables team collaboration (state locking prevents concurrent applies) and persists state independently of any developer's workstation. Local state is not encrypted by default.

---

### Q-IAC-014
**Domain**: IAC | **LO**: LO-IAC-S07 | **Bloom**: Apply

Northwind runs `terraform plan` on their production infrastructure with no changes to the .tf files. The plan shows 2 resources to update. What does this indicate?

- A. A Terraform provider update has changed the resource schema
- B. Infrastructure drift — someone modified the production resources outside of Terraform
- C. The Terraform state file is corrupt and must be deleted
- D. The Object Storage backend is not synchronized

**Correct**: B | A non-empty plan with no .tf changes = drift. Resources were modified outside Terraform (via Manager UI, CLI, or API). Terraform detected the difference between desired state (.tf) and actual state (detected via API). The state file is not corrupt — it correctly reflects what Terraform last applied.

---

### Q-IAC-015
**Domain**: IAC | **LO**: LO-IAC-A01 | **Bloom**: Recommend

When should the OpenStack CLI be preferred over Terraform for a cloud operation?

- A. When deploying a production environment for the first time
- B. For one-off investigative operations (listing resources, reading logs) that should not be tracked in state
- C. When the team has no Git repository
- D. When deploying more than 10 instances

**Correct**: B | CLI is the right tool for read-only, exploratory, or one-off operations that don't need to be version-controlled or tracked in state. Terraform is appropriate for provisioning and managing resources whose lifecycle should be tracked and reproducible.

---

### Q-IAC-016
**Domain**: IAC | **LO**: LO-IAC-A01 | **Bloom**: Evaluate

What is the main risk of managing production infrastructure exclusively through the OVHcloud Manager UI?

- A. The Manager UI does not support all resources
- B. No audit trail, no version history, no peer review — changes are immediate and irreversible without a rollback mechanism
- C. The Manager UI charges extra per operation
- D. The Manager UI is slower than Terraform

**Correct**: B | Manual UI changes leave no code artifact, no Git history, no diff, and no PR review gate. Any change made manually cannot be rolled back by rerunning a Terraform plan (the state would show drift). This is the core argument for IaC in production.

---

### Q-IAC-017
**Domain**: IAC | **LO**: LO-IAC-K03 | **Bloom**: Apply

Northwind's team uses Terraform workspaces. What does a workspace change (`terraform workspace select staging`) achieve?

- A. It changes the target region of the OpenStack provider
- B. It switches the active state file, allowing the same .tf configuration to manage separate environments (staging vs production)
- C. It deletes all resources in the current workspace
- D. It merges the staging state with the production state

**Correct**: B | Terraform workspaces maintain separate state files per workspace. The same configuration can deploy to staging or production environments without state collision. Switching workspaces does not change provider configuration or delete resources.

---

### Q-IAC-018
**Domain**: IAC | **LO**: LO-IAC-K04 | **Bloom**: Apply

In a Terraform configuration, where should sensitive values (passwords, application credential secrets) be stored?

- A. Directly in `main.tf` for clarity
- B. In `terraform.tfvars`, committed to the Git repository
- C. In environment variables or a secret manager, never in committed files
- D. In the Terraform state file, which is automatically encrypted

**Correct**: C | Sensitive values must stay out of committed files. Environment variables (OS_PASSWORD, etc.) or dynamic injection from a vault are the correct patterns. tfvars files committed to Git expose secrets. Terraform state is not encrypted by default.

---

### Q-IAC-019
**Domain**: IAC | **LO**: LO-IAC-K02 | **Bloom**: Explain

What does "idempotency" mean in the context of Terraform?

- A. Running `terraform apply` multiple times on an already-converged configuration produces no changes
- B. Terraform applies changes in alphabetical order of resource names
- C. Terraform always destroys and recreates resources on each apply
- D. Terraform parallelizes all resource creation automatically

**Correct**: A | Idempotency: applying the same configuration repeatedly produces the same result — if the infrastructure already matches the desired state, Terraform makes no changes. This is a core safety property of declarative IaC.

---

### Q-IAC-020
**Domain**: IAC | **LO**: LO-IAC-S07 | **Bloom**: Analyze

A Northwind engineer manually resizes an instance via the Manager UI, without updating the Terraform .tf file. What happens when a teammate runs `terraform apply` next?

- A. Nothing — Terraform only acts on .tf file changes
- B. Terraform detects the drift and reverts the instance to the flavor defined in the .tf file
- C. Terraform adds the new flavor to the .tf file automatically
- D. Terraform deletes the instance and recreates it with the original flavor

**Correct**: B | Terraform compares desired state (.tf) with actual state (live API). The manual resize created drift. On the next apply, Terraform will revert the instance to the flavor defined in the .tf file. This is the "Terraform wins" behavior and why all changes must go through IaC.

---

### Q-IAC-021
**Domain**: IAC | **LO**: LO-IAC-A02 | **Bloom**: Apply

Northwind has an existing instance deployed via the Manager that is not in any Terraform state. They want to bring it under Terraform management without destroying and recreating it. Which command is used?

- A. `terraform import`
- B. `terraform refresh`
- C. `terraform taint`
- D. `terraform state push`

**Correct**: A | `terraform import` imports an existing resource's current state into Terraform management. After import, the resource appears in the state file and must have a matching resource block in the .tf file. `refresh` updates state from live infra. `taint` marks a resource for recreation.

---

### Q-IAC-022
**Domain**: IAC | **LO**: LO-IAC-A02 | **Bloom**: Evaluate

Before merging a Terraform PR to the main branch in a production environment, which review step is most critical?

- A. Verify that the `terraform init` completes without errors
- B. Review the `terraform plan` output to confirm only the intended changes are included
- C. Ensure the provider version pins are updated
- D. Confirm the number of resources is increasing

**Correct**: B | The `terraform plan` output is the diff to review: it shows exactly what will be created, updated, or destroyed. This is the gate against unintended destructive changes. `init` errors are caught earlier. Provider pins and resource counts are secondary concerns.

---

## Domain OPS — Operations (19 questions)

---

### Q-OPS-001
**Domain**: OPS | **LO**: LO-OPS-K01 | **Bloom**: Identify

Which built-in metrics does the OVHcloud Manager provide for Public Cloud Instances?

- A. Application performance metrics (response time, error rate)
- B. Infrastructure-level metrics: CPU usage, RAM usage, disk I/O, and network throughput
- C. Database query performance and slow query logs
- D. Container-level metrics for pods and deployments

**Correct**: B | The Manager's instance monitoring shows infrastructure metrics at the hypervisor level: CPU %, RAM %, network in/out, disk I/O. Application-level, database, and container metrics require separate tooling (Prometheus, Grafana, etc.).

---

### Q-OPS-002
**Domain**: OPS | **LO**: LO-OPS-K01 | **Bloom**: Remember

What platform does OVHcloud provide for advanced time-series metrics collection and querying?

- A. CloudWatch
- B. Metrics Data Platform (based on Warp10)
- C. Azure Monitor
- D. Prometheus as a managed service

**Correct**: B | OVHcloud's Metrics Data Platform (MDP) is based on Warp10, a time-series platform. It can be used with Grafana via a Warp10 datasource or with Prometheus remote write. It is not AWS CloudWatch or Azure Monitor.

---

### Q-OPS-003
**Domain**: OPS | **LO**: LO-OPS-K02 | **Bloom**: Explain

Where in the OVHcloud Manager can you view the projected monthly cost for a Public Cloud project?

- A. In the instance console
- B. In the Billing section of the Public Cloud project
- C. In the Quota and Regions panel
- D. In the OVHcloud status page

**Correct**: B | The Billing section of a Public Cloud project shows current spending, daily estimates, and monthly projections. Quota panels show resource limits. The status page shows incidents. Instance console shows system output.

---

### Q-OPS-004
**Domain**: OPS | **LO**: LO-OPS-K02 | **Bloom**: Apply

Northwind wants to cap their monthly cloud spending and receive an alert before the budget is exceeded. Which feature should they configure?

- A. A Security Group rule blocking new instance creation
- B. A billing alert in the OVHcloud Manager set to their monthly budget threshold
- C. A quota set to zero for unused resource types
- D. A terraform `lifecycle` block with a cost constraint

**Correct**: B | OVHcloud Manager provides billing alerts (spending notifications) that send an email or notification when costs exceed a defined threshold. Security Groups control network traffic, not spending. Zero quotas would block provisioning entirely. Terraform does not enforce cost limits natively.

---

### Q-OPS-005
**Domain**: OPS | **LO**: LO-OPS-K03 | **Bloom**: Identify

Which of the following is controlled by OVHcloud Public Cloud quotas?

- A. The number of API calls per second from a NIC Handle
- B. The maximum number of vCPUs, instances, and GB of RAM deployable in a project per region
- C. The bandwidth limit per instance
- D. The maximum number of users in a project

**Correct**: B | Quotas cap infrastructure resource consumption: vCPUs, instances, RAM, volumes, Floating IPs, etc., per project per region. API rate limits and bandwidth caps are separate mechanisms. User count is not quota-controlled.

---

### Q-OPS-006
**Domain**: OPS | **LO**: LO-OPS-K03 | **Bloom**: Distinguish

What is the difference between a hard quota and a soft quota in OVHcloud?

- A. Hard quotas can be overridden by paying extra; soft quotas cannot
- B. Hard quotas block resource creation when reached; soft quotas trigger an alert but allow continued provisioning temporarily
- C. Hard quotas apply to all regions; soft quotas are per-region
- D. They are the same — OVHcloud uses only one type of quota

**Correct**: B | Hard quotas are enforced limits (the API returns an error when reached). Soft quotas are advisory warnings. In OVHcloud, most resource quotas are hard limits. Understanding the distinction helps explain to users why a deployment fails.

---

### Q-OPS-007
**Domain**: OPS | **LO**: LO-OPS-K04 | **Bloom**: Compare

Which OVHcloud support tier provides a dedicated Technical Account Manager (TAM) and guaranteed response SLAs for critical incidents?

- A. Standard (free)
- B. Business
- C. Enterprise
- D. Developer

**Correct**: C | Enterprise support includes a dedicated TAM, highest SLA response times, and proactive guidance. Business support provides faster SLAs than Standard but without a dedicated TAM. Standard support is free but has no guaranteed response time.

---

### Q-OPS-008
**Domain**: OPS | **LO**: LO-OPS-S01 | **Bloom**: Apply

Where in the OVHcloud Manager should an ops engineer look first when investigating high CPU usage on a production instance?

- A. The billing projection chart
- B. The instance monitoring graphs (CPU, RAM, disk) in the instance detail view
- C. The OpenStack Horizon quota panel
- D. The GitHub Actions CI/CD logs

**Correct**: B | The instance detail view in Manager shows real-time and historical CPU, RAM, disk, and network graphs. This is the first diagnostic stop for infrastructure-level issues. Billing charts show costs. Horizon quota shows resource limits.

---

### Q-OPS-009
**Domain**: OPS | **LO**: LO-OPS-S02 | **Bloom**: Apply

Northwind's ops manager wants to receive an email alert when the project's monthly spending exceeds €500. Where is this configured?

- A. Public Cloud project > Billing > Alerts
- B. Public Cloud project > Quota and Regions > Limit settings
- C. OVHcloud Manager > Support > Create a request
- D. Instance settings > Notifications

**Correct**: A | Billing alerts are configured in the Billing section of the Public Cloud project. They are independent of quotas. Support tickets and instance settings do not manage billing notifications.

---

### Q-OPS-010
**Domain**: OPS | **LO**: LO-OPS-S03 | **Bloom**: Apply

Northwind's project quota for instances is reached. The deployment pipeline cannot create new instances. What is the correct procedure?

- A. Delete production instances to free up quota
- B. Submit a quota increase request via Public Cloud > Quota and Regions > Increase quota
- C. Contact OVHcloud sales to upgrade the account tier
- D. Deploy instances in a different project and link them via vRack

**Correct**: B | Quota increase requests are self-service via the Manager. OVHcloud typically approves standard increases quickly. Deleting production instances is disruptive. Sales account tiers don't directly control quotas. Cross-project deployment is a workaround, not the solution.

---

### Q-OPS-011
**Domain**: OPS | **LO**: LO-OPS-S04 | **Bloom**: Apply

Northwind's production instance became unreachable at 03:00. After ruling out network issues, where should the ops engineer open a support ticket?

- A. Via the public OVHcloud community forum
- B. Via the OVHcloud Manager > Help Center > Create a ticket, selecting the affected product
- C. Via email to the general OVHcloud contact address
- D. Via GitHub Issues on the OVHcloud Terraform provider

**Correct**: B | Support tickets for production incidents are opened via the Manager's Help Center, with the affected product selected to route to the correct team and apply the contracted SLA. Community forums and GitHub are not appropriate channels for production incidents.

---

### Q-OPS-012
**Domain**: OPS | **LO**: LO-OPS-S05 | **Bloom**: Apply

On the OVHcloud invoice, how are Public Cloud Instances typically itemized?

- A. One line for the whole project per month
- B. Per resource type, per region, showing hours consumed and unit price
- C. Per developer who created each resource
- D. As a flat daily rate regardless of resources used

**Correct**: B | Public Cloud invoices break down charges by resource type (instance flavor, volume GB, Floating IP hours, etc.) per region, showing hours consumed and unit price. This enables cost attribution per resource or service.

---

### Q-OPS-013
**Domain**: OPS | **LO**: LO-OPS-A01 | **Bloom**: Apply

Northwind's batch job fails overnight. What is the first check in the ops runbook?

- A. Reboot the instance immediately
- B. Check instance metrics (CPU, disk I/O) and the batch job logs on the instance
- C. Open a severity-1 support ticket
- D. Roll back to last week's instance snapshot

**Correct**: B | The first step is always investigation before action: check metrics to understand resource state, check application logs to identify the failure cause. Rebooting before diagnosis destroys evidence. A severity-1 ticket is for outages confirmed to be infrastructure. Rolling back is destructive and premature.

---

### Q-OPS-014
**Domain**: OPS | **LO**: LO-OPS-A01 | **Bloom**: Evaluate

Which of the following is the most effective cost optimization action for a staging environment that is only used during business hours?

- A. Use smaller flavors permanently
- B. Shelve all instances outside business hours using a scheduled automation script
- C. Delete and recreate the entire environment daily
- D. Move staging to a cheaper region

**Correct**: B | Shelving stops compute billing during off-hours while preserving instance configuration. Smaller flavors reduce cost per hour but don't eliminate idle hours. Delete/recreate is complex and risky. Region changes may not be significant savings and adds operational complexity.

---

### Q-OPS-015
**Domain**: OPS | **LO**: LO-OPS-A02 | **Bloom**: Recommend

Northwind is about to put a new Public Cloud application into production with a 4-hour RTO SLA for P1 incidents. Which support tier should be recommended?

- A. Standard — free tier is sufficient for most incidents
- B. Business — provides faster response SLA appropriate for production workloads
- C. Enterprise — required for any cloud application
- D. Developer — designed for production environments

**Correct**: B | Business support provides a guaranteed response SLA and dedicated channels for production incidents — appropriate for a 4-hour RTO SLA. Standard (free) has no guaranteed response. Enterprise is for highest-criticality workloads (likely overkill for this case). Developer is not a real tier name.

---

### Q-OPS-016
**Domain**: OPS | **LO**: LO-OPS-K01 | **Bloom**: Apply

Northwind wants to integrate OVHcloud instance metrics into their existing Grafana deployment. Which OVHcloud feature enables this?

- A. Exporting Manager screenshots to Grafana
- B. OVHcloud Metrics Data Platform with Prometheus remote write or Warp10 Grafana datasource
- C. A vRack connection between Grafana and the Manager
- D. The OVHcloud Terraform provider exports metrics as state outputs

**Correct**: B | The Metrics Data Platform supports Prometheus remote write (instances push metrics to MDP, which Grafana scrapes via Prometheus) or direct Warp10 datasource integration. Grafana integrates via standard API, not screenshots, vRack, or Terraform outputs.

---

### Q-OPS-017
**Domain**: OPS | **LO**: LO-OPS-S01 | **Bloom**: Apply

An instance runs a Prometheus node_exporter on port 9100. How should Northwind scrape these metrics into their central Prometheus server?

- A. Configure the Manager to forward metrics automatically
- B. Add the instance's private IP and port 9100 to the Prometheus `scrape_configs`, ensuring network connectivity
- C. Use `openstack server metrics show` to stream metrics
- D. Configure a Security Group to push metrics to Prometheus

**Correct**: B | Prometheus scraping requires network reachability between the Prometheus server and the exporter. Add the target to `scrape_configs`. Security Groups must allow TCP 9100 inbound on the exporter instance. The Manager does not forward Prometheus metrics. `openstack server metrics show` is not a valid command.

---

### Q-OPS-018
**Domain**: OPS | **LO**: LO-OPS-A02 | **Bloom**: Anticipate

Northwind's monthly cloud cost doubles unexpectedly between July and August. Which operational practice would have detected this anomaly earlier?

- A. Daily manual review of the Manager billing page
- B. Configuring a billing alert at 110% of the previous month's spend
- C. Reducing all instance flavors to the smallest available
- D. Opening a support ticket on the first day of each month

**Correct**: B | A billing alert set slightly above the baseline (e.g., 110% of last month) provides early warning of cost anomalies before they compound. Manual daily review is operationally unsustainable. Reducing flavors impacts performance. Support tickets are for incidents, not cost monitoring.

---

### Q-OPS-019
**Domain**: OPS | **LO**: LO-OPS-K03 | **Bloom**: Analyze

Northwind plans to scale their application from 5 to 50 instances in GRA9 over the next quarter. What operational step must be taken proactively?

- A. Purchase a dedicated server to host the 50 instances
- B. Request a vCPU and instance quota increase well before the scaling event
- C. Create 50 new Public Cloud projects — one per instance
- D. Switch all instances to the t1 shared flavor to stay within quota

**Correct**: B | Quota increases require a request and OVHcloud approval — they do not happen instantly. Proactive quota planning before a known scaling event prevents deployment failures at the critical moment. One project per instance is unnecessary. Shared flavors would reduce performance.

---

*End of question bank — 160 questions, 8 domains.*
