# Module 3.1 — Infrastructure as Code Essentials — CLI & Terraform
 
## Module Brief
 
- **Module ID**: 3.1
- **Total duration**: 1h30
- **Block breakdown**: Sentier battu 5 min · Theory 30 min · Demo 15 min · Lab 30 min · Micro-check 5 min · Wrap-up 5 min
- **Program**: OVHcloud — Public Cloud — Core Associate
- **Domain covered**: 07 — Infrastructure as Code Essentials
- **LOs covered** (13 total):
  - Knowledge: `LO-IAC-K01`, `LO-IAC-K02`, `LO-IAC-K03`, `LO-IAC-K04`
  - Skills: `LO-IAC-S01`, `LO-IAC-S02`, `LO-IAC-S03`, `LO-IAC-S04`, `LO-IAC-S05`, `LO-IAC-S06`, `LO-IAC-S07`
  - Attitudes: `LO-IAC-A01`, `LO-IAC-A02`
- **Prerequisite modules**: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4, 2.5 (mandatory in sequence; standalone delivery requires the Northwind stack with the Module 2.5 output state — IAM segmented, application credential in place on the backup job, secrets externalized, audit baseline established).
- **Red-thread step**: Northwind's staging environment is now production-shape across networking, security, and identity — but every resource was created by hand through the Manager UI and ad-hoc CLI commands. The CTO has stated the original migration constraint: "we will not manage anything that lives only in someone's browser tabs". Today the learner closes that gap. They (1) **install and validate the OpenStack CLI** on their workstation using the `openrc.sh` mechanic, and learn to read the three control planes — Manager UI for discovery, OpenStack CLI for traceable scripting, OVHcloud API for everything OVHcloud-wide — picking the right tool per context; (2) **install Terraform** and configure both the OpenStack provider (for Public Cloud project resources) and the OVHcloud provider (for the project lifecycle, Object Storage credentials, Load Balancer); (3) **write a minimal Terraform configuration** describing a subset of the Northwind staging stack — one private network, one Security Group, one Compute instance — and run the full `init` / `plan` / `apply` / `destroy` workflow against the project; (4) **observe drift detection** by manually modifying a resource through the Manager UI and re-running `terraform plan` — surfacing the divergence between declared state and actual state. By the end of the module, the learner has rebuilt a slice of Northwind from code, internalized that any non-experimental environment must be IaC-first, and understood the Associate-level boundaries: local state file, no remote backends, no modules at scale, no GitOps automation — those are Professional-level concerns. The reference Terraform repository for the full Northwind staging stack is provided as a take-home artifact for the learner to study after the certification.
### Pedagogical angle
 
This is the **declarative pivot module** of the certification. Up to this point, every module has accreted Manager clicks and ad-hoc commands on top of the Northwind stack — that was pedagogically correct because the learner needed to **see** what each resource looks like before describing it abstractly. Module 3.1 reverses the polarity: the learner stops thinking "what button do I click?" and starts thinking "what end state do I declare?". The reflex shift is the actual learning outcome — Terraform syntax is the tool, not the lesson.
 
The legacy-IT analogy is the cleanest one in the entire certification. Manager UI clicks are the equivalent of **a sysadmin SSHing into ten servers and running commands by hand** — works, leaves no trace, irreproducible. OpenStack CLI is the equivalent of **a shell script that captures those commands** — reproducible-ish, but imperative ("do this, then that") and brittle to partial failure. Terraform is the equivalent of **a Puppet or Ansible declarative manifest** — you declare the desired state, the engine computes the diff and converges. Corporate learners with a configuration-management background pick this up in seconds. The AWS cross-reference is similarly direct: OpenStack CLI corresponds to `aws ec2 ...` commands; Terraform corresponds to Terraform itself (same tool, different providers) or to CloudFormation as a declarative equivalent. The mental model transfers one-to-one.
 
The single most important slide of the module is **slide 4** — the three control planes. Once the learner understands that Manager UI, OpenStack CLI, and OVHcloud API are not three competing UIs but **three concentric scopes** (project-scoped Manager and Keystone in the middle, OVHcloud-wide API at the edge for billing/projects/vRack/IAM), they stop asking "which one should I use?" and start asking "which scope does my action belong to?". The slide also frames Terraform correctly: it is not a fourth control plane but a **client of the OpenStack and OVHcloud APIs**, calling them in a declared order.
 
A second high-leverage point is **slide 8** — the `terraform plan` output. Every learner who has used Terraform before remembers the moment they ran their first `plan` and understood that the `+` / `-` / `~` symbols are the entire mental model. For learners new to Terraform, this slide must show a real captured `plan` output (from the demo prep) with the three symbols highlighted — abstract explanation does not land here, the visual artifact does.
 
A third subtle point — and the one that earns the "Essentials" suffix — is **slide 10** — drift detection. The whole value proposition of IaC collapses if the declared state diverges silently from the actual state. The discipline that closes the loop is the habit of running `terraform plan` on a known-clean main branch and treating any non-empty output as either (a) a missing commit, or (b) an unauthorized manual change in the Manager. This is `A02` operationalized: the learner leaves the module suspicious of any change they cannot trace to a `terraform apply`.
 
What this module **does not cover**, deliberately: remote state backends (Object Storage with locking — Professional), Terraform modules at scale, workspaces, GitOps automation (Atlantis, Terraform Cloud, GitHub Actions integrations), the OVHcloud SDKs in Python or Go, MCP and SHAI agent tooling. The learner is told these exist and where they live in the broader skill ladder — the Professional certification will pick them up.
 
### Trainer demonstration
 
15-minute end-to-end **OpenStack CLI then Terraform** demo on the running Northwind staging stack. The trainer (1) sources the `northwind-staging` application credential `openrc.sh` from Module 2.5, runs `openstack server list` and `openstack network list` to confirm the CLI sees what the Manager shows, then runs `openstack server show nw-api-staging-01` and walks through the JSON-ish output as a way to read what a resource actually looks like under the hood — narrates that this is the same data Terraform consumes, (2) demonstrates a single CLI-driven creation: `openstack server create demo-cli-01 --flavor d2-2 --image "Ubuntu 24.04" --network nw-staging-private --key-name nw-key` — explains that this is **traceable but still imperative**: a script that runs this twice fails the second time because the server already exists, (3) switches to the prepared Terraform workspace `/demos/3-1-tf-demo/`, opens `main.tf` in a side-by-side editor view — walks through the three blocks: `terraform { required_providers ... }`, `provider "openstack" { ... }`, `resource "openstack_compute_instance_v2" "demo" { ... }`. Runs `terraform init` and shows the `.terraform/providers/` directory that just appeared, narrates "this is the only artifact `init` produces locally", (4) runs `terraform plan` on the exact same intent as the CLI command above — points to the `+ create` symbol, explains the resource attributes Terraform proposes, contrasts with the `openstack server create` output (which gave no preview). Runs `terraform apply` — confirms the same instance is created. Runs `terraform plan` a second time — shows the **empty plan** ("No changes. Your infrastructure matches the configuration.") and frames this as the declarative loop closing, (5) **drift demo**: opens the Manager UI, manually changes the demo instance's name from `demo-tf-01` to `demo-tf-01-CHANGED-BY-HAND` — saves. Returns to the terminal, runs `terraform plan` again — the plan now shows `~ update in-place` proposing to rename the resource back. Says aloud: "this is the audit reflex from yesterday, automated. Anything done by hand outside the Terraform workflow surfaces here." Runs `terraform apply` to converge, then `terraform destroy` to clean up — narrates that `destroy` is exactly the lab opener for "tear it down, build it back" in 10 minutes.
 
### Learner lab
 
*Build a slice of Northwind from code — and prove you can destroy it and rebuild it identically* (30 min). Each learner: (1) installs the OpenStack CLI in a fresh Python virtual environment on their workstation (`python -m venv ~/.venv/osc && source ~/.venv/osc/bin/activate && pip install python-openstackclient`), sources the application credential `openrc.sh` from Module 2.5 (`<initials>-nw-backup-cred` — they will reuse it here since it is scoped `member`), runs three sanity-check commands: `openstack catalog list` (lists the available service endpoints — explains why catalog is the first call to verify CLI health), `openstack server list`, `openstack network list`, captures the output in the lab notes, (2) installs Terraform via the provided one-liner (handout includes the Linux/macOS/Windows variants — `tfenv` recommended for version pinning), confirms the version `terraform version`, creates a working directory `~/labs/3-1/`, (3) initializes a minimal Terraform project from the provided starter `main.tf` template — the template declares the OpenStack provider with values to be filled from the application credential, plus three resources: one `openstack_networking_network_v2` named `<initials>-nw-tf-net`, one `openstack_networking_secgroup_v2` named `<initials>-nw-tf-sg` with one ingress rule for SSH from the office IP range (already known from Module 2.3), and one `openstack_compute_instance_v2` named `<initials>-nw-tf-01` using the same Ubuntu image and `d2-2` flavor as the rest of the Northwind stack. The learner replaces the `<initials>` placeholders, fills in the credential values from `openrc.sh` (or sources the env file and lets the provider read from the environment — the cleaner pattern, encouraged in the handout), (4) runs `terraform init` — confirms the OpenStack provider is downloaded under `.terraform/providers/`. Runs `terraform plan` — reads the output, identifies the three resources to be created, captures the plan in the lab notes (`terraform plan > plan-initial.txt`), (5) runs `terraform apply` — confirms with `yes`, watches the apply, captures the duration. Confirms via OpenStack CLI that the three resources now exist: `openstack network list | grep <initials>-nw-tf-net`, `openstack security group list | grep <initials>-nw-tf-sg`, `openstack server list | grep <initials>-nw-tf-01`. Confirms in the Manager UI that the same three resources appear with the correct names, (6) **drift exercise**: in the Manager UI, manually delete the Security Group rule the Terraform created. Runs `terraform plan` again — the plan must show `~ update in-place` (or `+/-` depending on provider behavior) proposing to recreate the rule. Runs `terraform apply` to converge. Captures the before/after plan output in the lab notes, (7) runs `terraform destroy` — confirms with `yes`, watches the destroy. Confirms via OpenStack CLI that the three resources are gone (`openstack server list` no longer lists `<initials>-nw-tf-01`). Captures the destroy output, (8) **the reproducibility proof**: runs `terraform apply` again — confirms the three resources come back identically. Runs `terraform destroy` once more to leave a clean state. The learner has now experienced the full IaC loop: declare → plan → apply → drift → converge → destroy → re-apply identically. Validation: the three resources can be created and destroyed twice in a row with the same Terraform configuration, the local state file `terraform.tfstate` exists in the working directory after the first apply and is empty after the final destroy, the lab notes contain the captured plan/apply/destroy outputs for the trainer to verify the workflow was followed.
 
### Micro-check — question intents (drafted in Block 5)
 
1. Definition of IaC and its benefits vs manual Manager-driven provisioning — Remember — `K01`
2. Three control planes and their respective scopes — Understand — `K02`
3. Terraform vocabulary — providers, state, plan, apply, destroy — Remember — `K03`
4. OVHcloud Terraform provider vs OpenStack Terraform provider — when to use each — Understand — `K04`
5. Reading a `terraform plan` output — `+` / `-` / `~` symbols — Apply — `S05`
6. Local state file lifecycle and the basic state hygiene rules — Apply — `S07`
7. Drift detection — what `terraform plan` returns when reality diverges from declaration — Analyze — `A02`
8. IaC-first recommendation for reproducible environments — when to apply, when to defer — Analyze — `A01`
### Trainer FAQ — anticipated topics (drafted in Block 8)
 
Why two Terraform providers and not one, when to use the OpenStack CLI vs `curl` against the OVHcloud API vs Terraform, what the local state file actually contains and what happens if it is lost, why remote state is out of scope at the Associate level, how Terraform deals with secrets that should not land in the state file, what happens if two learners run `terraform apply` in parallel against the same project (state locking and the lack of it for local state), what the OVHcloud Terraform provider versus the OpenStack provider does and does not cover, how Terraform interacts with manual changes — drift vs out-of-band changes, what the `lifecycle` block does at a high level, how to manage Terraform variables and `.tfvars` files at this level, whether learners should commit the state file to Git (no, ever), how the OpenStack CLI's `--os-cloud` mechanism works versus sourcing `openrc.sh`, what the SDK and the MCP/SHAI tooling are and why they are explicitly out of scope here.
 
---
 
## Block 1 — Sentier battu / Hors piste (5 min)
 
### Sentier battu (assumed prerequisites)
 
**Tools:**
- The Northwind staging stack from Module 2.5: instances, networks, Security Groups, Gateway, Load Balancer, IAM users, application credential `<initials>-nw-backup-cred`, secrets in Secret Manager.
- The application credential `openrc.sh` file generated in Module 2.5, scoped to the OpenStack `member` role on the Northwind project, valid for at least the duration of this module. The learner will reuse this credential — no new credential is created today.
- A workstation with Python 3.10+ available (for the OpenStack CLI install via `pip`) and a shell that can source `openrc.sh` (bash, zsh, Git Bash on Windows).
- Internet access from the workstation to `pypi.org` (OpenStack CLI), `releases.hashicorp.com` (Terraform binary), the OVHcloud Terraform provider registry, and the OpenStack provider registry.
- An editor capable of HCL syntax highlighting — VS Code with the HashiCorp Terraform extension is the recommended default in the handout.
- A working directory under version control — the lab notes and the Terraform configuration will be committed to the shared lab repo at the end of the session.
**Knowledge:**
- The notion of an `openrc.sh` from Module 1.2 and reinforced in Module 2.5: a shell script exporting `OS_*` environment variables that the OpenStack CLI and the Terraform OpenStack provider both consume automatically.
- The application credential pattern from Module 2.5: a project-scoped, role-restricted credential decoupled from any human's lifecycle — the right credential type for any non-interactive workload, including Terraform runs during a lab.
- The Northwind staging stack topology from Modules 2.3 and 2.4: private network, Security Groups, Gateway, Load Balancer — the learner knows what they are recreating in code, abstractly.
- Basic Git operations: `clone`, `add`, `commit`, `push` — the lab artifacts are committed at the end. Not needed for Terraform itself, needed for handing in the lab.
- The legacy-IT analogy reflex: at this point the learner should automatically translate cloud concepts to their on-prem equivalents — Terraform → Puppet/Ansible declarative manifest. The analogy is offered explicitly in slide 2 if the reflex is not yet ingrained.
### Hors piste (remediation pointers for gaps)
 
- **Northwind stack from Module 2.5 not in place** → run the recovery script `module-2-5/recover-iam-state.sh` from the lab repo, which rebuilds the IAM users, the application credential, the Secret Manager entries, and reattaches the network/security state from Module 2.4. Idempotent, ~5 minutes.
- **Application credential `<initials>-nw-backup-cred` expired or missing** → regenerate via Horizon → Identity → Application Credentials → Create (90 days, `member`, unrestricted off), download the new `openrc.sh`. The handout includes the exact dialog. This is a real-world recovery moment — the trainer can use it as a teaching aside about credential expiry hygiene.
- **No Python installed on the workstation** → handout provides a `pyenv` installation one-liner per OS, plus a fallback path using the OpenStack CLI standalone binaries for the few rare environments where Python install is blocked.
- **Confusion between "the cloud API I call" and "the tool I call it with"** → preempt in the Sentier battu: "There is one Public Cloud, with two API surfaces — the OpenStack API for project resources, the OVHcloud API for everything OVHcloud-wide. The Manager UI, the OpenStack CLI, `curl`, Terraform, and the SDKs are all just clients of those two API surfaces. Pick the client that fits the task, the API choice flows from the resource type."
- **Never wrote Terraform before** → no prerequisite — the module starts from "what is a provider" and builds up. The reference is the official Terraform tutorial at `developer.hashicorp.com/terraform/tutorials`, free, hands-on, complementary to this module for self-study.
- **Persona Digital Starter is allergic to "yet another tool to learn"** → 30-second framing: "Even alone with no team, IaC is the difference between a Sunday-afternoon rebuild that takes 4 hours of clicking and one that takes 10 minutes of `terraform apply`. The investment is one day of discomfort against years of reproducibility — and the same Terraform code is what makes selling your stack to a future customer or contributor possible."
---
 
## Block 2 — Theory & Concepts (30 min)
 
### Slide 1: From clicks to code — the reproducibility problem
 
**Visual concept**: A horizontal three-panel storyboard. Left panel: a sysadmin silhouette clicking through a Manager UI, with arrows labeled "click, click, click" and a thought bubble "did I do this the same way last time?". Middle panel: the same silhouette typing OpenStack CLI commands in a terminal, with a script file visible — annotation "traceable, but imperative". Right panel: the silhouette next to a `main.tf` file in an editor, with a small `+` next to the resource declaration — annotation "declared, reproducible, reviewable". A red arrow on top of the whole storyboard reads "the migration the CTO is asking for".
 
**Talking points**:
- Manual clicks work for discovery but leave no trace — "what did I do last Tuesday?" has no answer.
- A shell script captures the commands but is still imperative — re-running it on partial state usually breaks.
- Declarative IaC describes the **end state**; the engine reconciles the current state to the declared state.
- Reproducibility, peer review, drift detection, and version control are emergent properties of writing the infrastructure as code — not features of a specific tool.
- This module operationalizes the CTO's constraint from Day 1: "we will not manage anything that lives only in someone's browser tabs".
**Trainer notes**:
- Open with the Northwind reminder — point to the stack we've built over two days, ask "how would you rebuild this in another region right now?".
- Anticipate the ex-AWS learner: "this is CloudFormation/CDK territory — same idea, different tool".
- Persona Digital Starter resistance is real — explicitly call out that IaC pays off from the second deploy onward, not the first.
- Don't dive into Terraform syntax yet — this slide is about the *why*. Syntax comes from slide 5.
---
 
### Slide 2: What "Infrastructure as Code" actually means
 
**Visual concept**: A four-quadrant diagram, each quadrant labeled with one IaC property and a one-line example. Top-left **Reproducibility**: same code → same infrastructure, every time. Top-right **Version control**: every change is a Git commit, reviewable, revertible. Bottom-left **Peer review**: infrastructure changes go through a Pull Request, like application code. Bottom-right **Drift detection**: `terraform plan` against a clean main branch reveals any out-of-band change. A center icon ties the four properties together.
 
**Talking points**:
- IaC is **declarative configuration** that describes the desired end state of infrastructure, plus a tool that converges actual state to declared state.
- **Reproducibility** is the headline benefit — same code, same infra, every time, every region.
- **Version control** turns infrastructure changes into reviewable, revertible Git history — the same engineering discipline that already governs application code.
- **Peer review** via Pull Requests catches mistakes before they hit production — a manual Manager click has no review gate.
- **Drift detection** is the operational reflex: any divergence between declared and actual state is surfaced by re-running the plan command — no surprises in audit.
**Trainer notes**:
- The four properties are not "Terraform features" — they are properties of any well-run IaC practice. Frame them tool-agnostically.
- Anticipate: "isn't this just Ansible/Puppet?" — yes, conceptually identical for the declarative variants; the IaC name happens to have stuck to the infrastructure-provisioning slice (vs configuration-management for inside-the-VM).
- Persona Corporate often already does this for application code — anchor the analogy: "imagine your code repository, but for infrastructure".
- AWS cross-ref: CloudFormation, CDK, AWS CLI scripts → same spectrum, different products.
---
 
### Slide 3: Where IaC pays off — and where it doesn't (yet)
 
**Visual concept**: A two-column comparison table. Left column titled **IaC-first by default** lists: Staging environments, Production environments, Multi-region duplications, Training labs, Customer-specific tenants, CI/CD ephemeral environments, Disaster recovery rebuilds. Right column titled **Manager UI acceptable** lists: One-off exploration of a new product, Quick prototype with a known throwaway lifetime, Single learner's first hour of discovery, Emergency operational fix where IaC convergence is too slow. A footer line reads: "the more times the environment will be rebuilt, the higher the IaC payoff".
 
**Talking points**:
- **Reproducible environments** justify IaC immediately: staging, production, multi-region, any environment that will be rebuilt more than once.
- **Throwaway environments** (single-use exploration, first-hour discovery) often don't — the Terraform setup cost exceeds the rebuild cost.
- **The break-even rule of thumb**: if you expect to rebuild the environment three times or more, IaC pays off; below that, the calculus is closer.
- **Emergency operations** are a legitimate exception — when a fix is needed in 5 minutes and the Terraform run takes 12, fix in the Manager and reconcile the code after. Document the exception.
- The reflex `A01` is "IaC-first by default for reproducible environments, with explicit, documented exceptions" — not "IaC for everything regardless".
**Trainer notes**:
- This is the `A01` anchor — make the boundary explicit, learners often hear "IaC for everything" and that's wrong.
- Anticipate Corporate learner: "our internal policy is IaC-mandatory for production" — perfect, that's the right policy; the Manager UI exceptions are explicit, documented, and short-lived.
- Persona Digital Starter: "I'll never rebuild this" — challenge gently: every cloud environment outlives the assumption it will be thrown away.
- Don't moralize — present this as a cost/benefit calculation, not a religious doctrine. Learners read the difference.
---
 
### Slide 4: The three control planes — Manager, OpenStack CLI, OVHcloud API
 
**Visual concept**: A concentric-circles diagram. The outer ring is **OVHcloud account** (billing, projects, vRack, IAM, support, Object Storage credentials) and is labeled "**OVHcloud API** — the OVHcloud-wide surface". The inner ring inside it is **One Public Cloud project** (instances, networks, volumes, Security Groups, application credentials) and is labeled "**OpenStack API** — the project-scoped surface". A small "**Manager UI**" badge sits at the top, with arrows pointing to both rings — labeled "the UI on top of both APIs". A small "**Terraform**" badge sits below, also with arrows pointing to both APIs — labeled "a client of both, just like the Manager".
 
**Talking points**:
- **Two API surfaces**, not three: the **OpenStack API** scoped to one Public Cloud project, and the **OVHcloud API** for everything wider than a project.
- The **Manager UI** is a client of both — it presents a unified visual layer over the two APIs.
- The **OpenStack CLI** (`openstack` command) is a client of the OpenStack API only — project-scoped resources, nothing OVHcloud-wide.
- The **OVHcloud API** is reached via HTTP calls (`curl`, the OVHcloud Python SDK, or the OVHcloud Terraform provider) — used for billing, project creation, vRack, IAM, etc.
- **Terraform** is a client of both APIs through two distinct providers — see slide 6. It is not a fourth control plane; it is automation on top of the same APIs the Manager calls.
**Trainer notes**:
- This is the single most important slide of the module — pause here, draw the concentric circles on the whiteboard if available.
- The reflex you want learners to leave with: "first ask *which scope*, then pick the client".
- Anticipate the ex-AWS confusion: "AWS has one API and one CLI" — true; the OpenStack-native heritage of OVHcloud Public Cloud is why the surface is split. Module 2.5 already prepared this with the two-layer IAM model.
- Persona Digital Starter framing: "you'll spend 90% of your time on the inner ring — the outer ring matters when you set things up or pay bills".
- Don't get drawn into a `curl` example yet — slide 5 is the CLI walkthrough.
---
 
### Slide 5: The OpenStack CLI in 90 seconds
 
**Visual concept**: A terminal window screenshot, with three commands and their abbreviated outputs visible. Command 1: `source openrc.sh` (no output, but an annotation arrow says "loads the credential into env vars"). Command 2: `openstack catalog list` (table-style output listing services: compute, network, image, volumev3, identity — annotation "what the credential can talk to"). Command 3: `openstack server list` (table with instance names from the Northwind stack — annotation "everything we built, listed by API"). A side note shows the six command verbs the learner needs at this level: `list`, `show`, `create`, `delete`, `set`, `add`.
 
**Talking points**:
- The OpenStack CLI is **one command, `openstack`**, with verbs and nouns: `openstack server list`, `openstack network show <name>`, `openstack volume create ...`.
- **Authentication is environmental** — source an `openrc.sh` (or use `--os-cloud <name>` from a `clouds.yaml`), the CLI reads `OS_*` variables and authenticates transparently.
- The six essential nouns at Associate scope: `server`, `volume`, `network`, `image`, `catalog`, `quota` — covers ~90% of day-to-day operations.
- `openstack catalog list` is the **first call to verify CLI health** — it lists the service endpoints the credential can reach, and surfaces auth or network problems immediately.
- The CLI is **imperative and traceable**: every command is one HTTP call, the output is the API response — perfect for ad-hoc operations and for understanding what Terraform will be calling on your behalf.
**Trainer notes**:
- Demo the three commands live during this slide — even 30 seconds at the terminal lands the concept faster than the screenshot.
- Anticipate: "is the CLI maintained by OVHcloud?" — no, it's the upstream OpenStack project; OVHcloud ships an OpenStack distribution, the CLI is generic.
- The `--os-cloud` mechanic exists and is cleaner than sourcing `openrc.sh` (centralized in `~/.config/openstack/clouds.yaml`) — mention it as an upgrade path, don't push it as the default for the lab.
- Don't go deep on every verb — the six listed above are enough; learners will explore the rest organically.
---
 
### Slide 6: Terraform — the declarative engine
 
**Visual concept**: A center icon of the Terraform logo. Four labeled blocks around it, each describing one core concept. Top: **Providers** ("plug-ins that translate Terraform calls into API calls — one per cloud: openstack, ovh, aws, azurerm, ..."). Right: **Configuration** ("`.tf` files declaring resources in HCL syntax — versioned, reviewed, reused"). Bottom: **State** ("a JSON file mapping declared resources to their real-world IDs — Terraform's memory between runs"). Left: **Workflow** ("`init` → `plan` → `apply` → `destroy` — four verbs, the whole loop"). A small footer reads "open-source up to v1.5, licensed under BUSL since v1.6 — OpenTofu is the OSS fork".
 
**Talking points**:
- **Terraform** is an open-source (then source-available since 2023) declarative provisioning engine — declare resources in HCL, run a tool, get infrastructure.
- **Providers** are the plug-ins translating Terraform's calls into the cloud's API calls — OVHcloud has its own, OpenStack has its own, both are installed per-project on `terraform init`.
- **Configuration** is one or more `.tf` files in HCL (HashiCorp Configuration Language) — declarative, JSON-equivalent, designed to be readable.
- **State** is the JSON file (`terraform.tfstate`) that maps each declared resource to its real-world ID — Terraform's persistent memory of "what I've already created".
- **Workflow** is four commands: `init` (download providers, set up the working directory), `plan` (compute the diff, show what would change), `apply` (execute the diff), `destroy` (delete everything declared).
**Trainer notes**:
- Insist that HCL is a syntax, not magic — anything you can write in HCL has a one-to-one mapping to a JSON document; the readability is the point.
- Mention OpenTofu briefly — the OSS fork after the license change, drop-in replacement, used by some teams. For this certification, Terraform and OpenTofu are interchangeable.
- AWS cross-ref: same Terraform, different provider (`aws` instead of `openstack` and `ovh`) — the workflow and the mental model transfer.
- Anticipate: "is there an OVHcloud-specific declarative tool?" — no, the OVHcloud Terraform provider is the recommended path; the OVHcloud documentation itself uses Terraform as the canonical IaC example.
---
 
### Slide 7: Two providers, two scopes — when to use each
 
**Visual concept**: A two-column table. Left column header **OpenStack provider** (`openstack/openstack`) with a list of resource examples: `openstack_compute_instance_v2`, `openstack_networking_network_v2`, `openstack_networking_subnet_v2`, `openstack_networking_secgroup_v2`, `openstack_blockstorage_volume_v3`, `openstack_objectstorage_container_v1`. Right column header **OVHcloud provider** (`ovh/ovh`) with a list of resource examples: `ovh_cloud_project`, `ovh_cloud_project_user`, `ovh_cloud_project_kube`, `ovh_cloud_project_loadbalancer`, `ovh_iam_user`, `ovh_iam_policy`, `ovh_vrack_cloudproject`. A footer reads: "one Terraform configuration, two providers — both can co-exist in the same `.tf` files".
 
**Talking points**:
- The **OpenStack provider** covers everything **inside a Public Cloud project** — instances, networks, subnets, Security Groups, volumes, Object Storage containers — anything the OpenStack API exposes.
- The **OVHcloud provider** covers everything **OVHcloud-wide and project-lifecycle** — project creation, IAM users and policies, Load Balancer (which has an OVHcloud-managed control plane), Managed Kubernetes (sibling certification), vRack association.
- **Both providers** can — and routinely do — coexist in the same Terraform configuration: `terraform init` downloads both, the configuration files reference both, the state file tracks both.
- **Authentication is separate**: the OpenStack provider reads `OS_*` env vars (application credential), the OVHcloud provider reads `OVH_*` env vars (OVHcloud API credentials — endpoint, application key, application secret, consumer key).
- **The choice is not yours — it follows the resource**: if you want a Security Group, you call the OpenStack provider; if you want a Load Balancer, you call the OVHcloud provider. The provider documentation tells you which.
**Trainer notes**:
- The reflex you want: "which scope is the resource in?" → that picks the provider, no debate.
- Anticipate: "do I need both providers for the Northwind stack?" — yes, in a complete IaC version of Northwind you'd use both (OpenStack for instances/networks/SGs, OVHcloud for Load Balancer and IAM). The Lab today uses only the OpenStack provider to keep the surface small.
- Mention that the OVHcloud provider authentication is heavier — application key + secret + consumer key — and is generated via the OVHcloud token creation page. Don't go into the dance; reference the docs.
- Persona Digital Starter: "you'll mostly use the OpenStack provider; the OVHcloud provider becomes necessary the day you automate billing or IAM, not before".
---
 
### Slide 8: Reading a `terraform plan` — the three symbols
 
**Visual concept**: A real captured `terraform plan` output (anonymized, from the demo prep), occupying most of the slide, with three colored highlights. Green highlight on a line starting with `+ openstack_compute_instance_v2.demo` labeled "**create**". Red highlight on a line starting with `- openstack_compute_instance_v2.old` labeled "**destroy**". Yellow highlight on a line starting with `~ openstack_networking_secgroup_v2.demo will be updated in-place` labeled "**update**". A footer line reads: "**Plan: 1 to add, 1 to change, 1 to destroy** — read this line first, every time".
 
**Talking points**:
- The `terraform plan` output is **the contract**: it tells you exactly what `apply` will do — read it before every apply, every time.
- **`+ create`** (green): a new resource will be created — Terraform doesn't track it yet.
- **`- destroy`** (red): an existing tracked resource will be deleted — usually because it was removed from the configuration.
- **`~ update in-place`** (yellow): an existing tracked resource will be modified without being destroyed — depending on the attribute, the provider may also need a `+/-` replacement (destroy then create).
- The **summary line** at the bottom (`Plan: X to add, Y to change, Z to destroy`) is the headline — if any of those numbers surprises you, **stop** and read the diff before running `apply`.
**Trainer notes**:
- This is the second high-leverage slide — every Terraform incident starts with someone who didn't read the plan.
- Insist: "read the plan, every time, no exceptions" — even one-line changes. The discipline is what catches the mistakes.
- Anticipate: "what about `<= read`?" — that's data sources reading info from the cloud; not creating anything; harmless. Mention briefly.
- The `+/-` (destroy-and-create replacement) is the painful case — instances often need this on flavor or image changes, networks rarely. Tell the learners they'll see it in the lab if they change the instance image.
---
 
### Slide 9: The state file — Terraform's memory
 
**Visual concept**: A `terraform.tfstate` JSON file rendered in a code block, with key fields highlighted: `"version": 4`, `"terraform_version": "1.X.X"`, `"serial": N` (the change counter), and a `"resources"` array showing one resource with its `"type"`, `"name"`, and an `"instances"` array containing the real-world `"id"` returned by OpenStack. A side annotation lists the four rules: **(1) never edit by hand**, **(2) never commit to Git**, **(3) protect it like a credential**, **(4) at this level, keep it local — remote backends are Professional**.
 
**Talking points**:
- The **state file** is the JSON mapping between resources declared in the configuration and resources actually in the cloud — the bridge between code and reality.
- It is **rewritten on every `apply`** — the `serial` counter increments — and is the input of every `plan` (Terraform reads the state, queries the cloud, computes the diff).
- **Never edit it by hand** — Terraform has commands (`terraform state mv`, `terraform state rm`, `terraform import`) for any state operation; manual edits corrupt the JSON or break the serial.
- **Never commit it to Git** — the state file contains every attribute of every resource, including (sometimes) generated secrets, IDs, and IP addresses. Treat it as a credential.
- At the **Associate level**, state is **local** — a file in the working directory. Remote state with locking (S3 + DynamoDB on AWS, Object Storage + Consul on OVHcloud) is Professional-level and explicitly out of scope.
**Trainer notes**:
- The local-state limitation is the single biggest "but in production we..." question — head it off: "yes, real teams use remote state, that's Professional; you need to internalize local state first".
- Anticipate: "what if I lose the state file?" — Terraform thinks nothing exists, `apply` tries to create duplicates, conflicts everywhere. Either restore from backup, or use `terraform import` to reconstruct. Painful — hence the "treat it as a credential" rule.
- Persona Digital Starter alone: the local state file lives on their laptop, backed up by the laptop's normal backup discipline — fine at small scale, becomes a problem the day they switch laptops without thinking.
- The `.gitignore` reflex: handout includes a standard Terraform `.gitignore` (`*.tfstate`, `*.tfstate.backup`, `.terraform/`, `*.tfvars` — except `terraform.tfvars.example`).
---
 
### Slide 10: Drift detection — the audit reflex, automated
 
**Visual concept**: A horizontal timeline. Left: a `terraform apply` event at T=0 — green checkmark, "declared state = actual state". Middle: a clock icon at T+3 days with a thought bubble "operator clicked something in the Manager UI". Right: a `terraform plan` event at T+5 days showing a non-empty diff — the diff is highlighted with a yellow border and the caption reads "**drift detected** — apply to converge, or update the code to absorb the change". A small badge below the diff reads "if your `plan` is never empty, your IaC discipline isn't".
 
**Talking points**:
- **Drift** is the divergence between what your Terraform code declares and what the cloud actually contains — caused by manual changes, by other tools, or by services with autoscaling-like behavior.
- The **drift detection mechanic** is simple: run `terraform plan` against a known-clean main branch; the plan must be empty; any non-empty output is drift.
- **Two responses** are valid: (a) `terraform apply` to converge actual state back to declared state, or (b) update the code to absorb the legitimate change, commit it, then re-plan.
- The **wrong response** is `terraform apply` without reading the diff — you may be undoing a legitimate change someone made because they didn't trust the Terraform workflow.
- The **discipline** is to keep `terraform plan` empty on `main` — a healthy IaC project means a peaceful plan, not an exciting one. The attitude `A02` is to **distrust any change you cannot trace to a `terraform apply`**.
**Trainer notes**:
- This is the `A02` anchor — the audit reflex from Module 2.5, now applied to infrastructure declaration.
- The legacy-IT analogy lands here: this is `etckeeper` for infrastructure, this is Puppet's `--noop` mode for the whole cloud.
- Anticipate Corporate learner: "in our org we have 20 people on the project, drift is a constant" — exactly why a daily CI run of `terraform plan` is the Professional-level reflex (preview).
- Persona Digital Starter alone: drift comes from themselves clicking in the Manager because it was faster than editing code — frame it gently: "you're not bad, you're moving fast; the discipline is the plan reflex at the end of the day".
- Don't preach. Frame as a habit, not a moral stance.
---
 
## Block 3 — Trainer Demonstration (15 min)
 
### Demo scenario
 
A 15-minute live walkthrough on the running Northwind staging stack, in two acts. **Act 1 (5 min)**: the OpenStack CLI as the auditable shell — source the application credential `openrc.sh`, run `openstack catalog list` to verify health, `openstack server list` to confirm what the Manager shows, `openstack server show nw-api-staging-01` to read what a resource looks like under the hood. **Act 2 (10 min)**: Terraform end-to-end — open a prepared minimal `main.tf` in a side-by-side terminal/editor, run `init`, `plan`, `apply`, demonstrate drift by manually changing a resource in the Manager, re-plan, converge, then `destroy`. The trainer narrates the decision points as they happen — the goal is to make the IaC mental loop visible, not just the commands.
 
### Demo script
 
| Step | Action | Expected output | Trainer commentary |
|---|---|---|---|
| 1 | `source ~/.openrc/nw-backup.sh` then `openstack catalog list` | Table listing compute, network, image, volumev3, identity, object-store endpoints | "First call, every time. If `catalog list` works, my credential is alive and the endpoints respond. If it fails, every other CLI call would fail too — fail fast." |
| 2 | `openstack server list` then `openstack server show nw-api-staging-01 -f json \| head -40` | Server list table; then JSON-ish properties of the API instance | "Same data the Manager shows, just structured. This is also what Terraform's state file holds for this resource — same fields, same IDs." |
| 3 | `openstack server create demo-cli-01 --flavor d2-2 --image "Ubuntu 24.04" --network nw-staging-private --key-name nw-key` | Server created, instance ID returned | "Traceable but imperative. I run this twice, the second time fails — name conflict. No diffing, no rollback, no preview. This is the wall we're about to climb over." |
| 4 | `cd ~/demos/3-1-tf-demo/ && cat main.tf` | A ~25-line `main.tf` with `terraform {}`, `provider "openstack" {}`, and one `resource "openstack_compute_instance_v2" "demo"` block | "Three blocks. The `terraform` block declares the provider versions, the `provider` block authenticates, the `resource` block declares what we want. That's it for a minimal config." |
| 5 | `terraform init` | "Initializing the backend... Initializing provider plugins... Terraform has been successfully initialized!" plus a `.terraform/` directory | "First call on a fresh working directory. Downloads the OpenStack provider from the registry into `.terraform/providers/`. Run once per environment, then forget." |
| 6 | `terraform plan` | "Plan: 1 to add, 0 to change, 0 to destroy" with the `+ openstack_compute_instance_v2.demo` block and proposed attributes | "Read the plan, every time. One create, zero changes, zero destroys. Attributes look right — Ubuntu 24.04, d2-2, the right network. Now I trust it." |
| 7 | `terraform apply` (confirm with `yes`) | Apply runs, instance is created, "Apply complete! Resources: 1 added, 0 changed, 0 destroyed." | "Apply does exactly what the plan said. No surprises if I read the plan. Note the duration — about the same as the CLI call from step 3, except now it's reproducible." |
| 8 | `terraform plan` (immediately after apply) | "No changes. Your infrastructure matches the configuration." | "The declarative loop closed. Declared state equals actual state. This is what a healthy IaC project looks like — a peaceful plan." |
| 9 | Manager UI → demo project → Instances → click on `demo-tf-01` → rename to `demo-tf-01-CHANGED-BY-HAND` | Instance now displays the new name in the Manager | "Out-of-band change. The audit reflex from yesterday now applies to declarations: anything done by hand outside Terraform is a footgun." |
| 10 | Back to terminal: `terraform plan` | "Plan: 0 to add, 1 to change, 0 to destroy" with a `~ name = "demo-tf-01-CHANGED-BY-HAND" -> "demo-tf-01"` line | "Drift detected. Terraform tells me exactly what changed — and it proposes to converge it back to what the code says. I have two choices: apply to revert, or update the code to absorb the change. Today I revert." |
| 11 | `terraform apply` (confirm with `yes`) | Instance is renamed back to `demo-tf-01`, "Apply complete! Resources: 0 added, 1 changed, 0 destroyed." | "Converged. Plan is empty again. Healthy state." |
| 12 | `terraform destroy` (confirm with `yes`) | Instance is deleted, "Destroy complete! Resources: 1 destroyed." | "And the apothesis — destroy. Tear everything down with one command. Imagine doing this on the full Northwind stack: 10 minutes from `apply` to a complete environment, 5 minutes from `destroy` to a clean slate. This is the lab opener." |
 
### Common demo failure modes
 
- If `terraform init` fails with a network error → the OpenStack and OVHcloud provider registries occasionally throttle. Retry once; if still failing, check the workstation can reach `registry.terraform.io`. The handout includes a fallback to a mirror.
- If `terraform plan` fails with `Error: Authentication failed` → the application credential expired between the source and the Terraform run. Re-source the `openrc.sh` from a fresh credential, or regenerate the credential.
- If the apply hangs at "Creating..." for more than 90 seconds on the instance → likely a quota issue or a region capacity issue. Check `openstack quota show` in another terminal; the demo runs in GRA by default.
- If the drift demo doesn't show a diff after renaming in the Manager → instance names in some OpenStack versions are immutable from the CLI/API and renaming in the Manager only updates a display label, not the OpenStack-side name. If that happens, switch the drift demo to deleting the Security Group rule (which always drifts cleanly) — handout includes the backup script.
- If `terraform destroy` fails with `Error: dependency...` → there's a manually-created resource attached to the Terraform-managed one (a volume, a port). Identify with `openstack server show`, detach the dependency manually, retry destroy. This is itself a teaching moment — drift creates destroy failures.
---
 
## Block 4 — Learner Lab (30 min)
 
### Lab brief (learner-facing)
 
You will install the OpenStack CLI and Terraform on your workstation, then write a minimal Terraform configuration that creates a network, a Security Group, and an instance in your Northwind Public Cloud project. You will run the full `init` → `plan` → `apply` → `destroy` loop, and along the way you will produce a drift event manually and observe Terraform detect and converge it. By the end of the lab you will have created and destroyed the same three resources twice from the same code, leaving the project in a clean state. You will work entirely against your own Northwind staging project, reusing the application credential `<initials>-nw-backup-cred` from Module 2.5. Allowed channels: OpenStack CLI for the install and verification steps, Terraform for the declarative loop, Manager UI for the drift event only. The reference Terraform repository for the full Northwind staging stack is provided as a take-home artifact — you may study it after the lab but you will not run it today.
 
### Lab steps (learner-facing)
 
1. **Install the OpenStack CLI.** In a fresh Python virtual environment: `python -m venv ~/.venv/osc && source ~/.venv/osc/bin/activate && pip install python-openstackclient`. Confirm the install: `openstack --version` should return a version string. Source the application credential `openrc.sh` from Module 2.5 (`source ~/.openrc/<initials>-nw-backup.sh`). Run three sanity-check commands and capture the output in `~/labs/3-1/cli-sanity.txt`: `openstack catalog list`, `openstack server list`, `openstack network list`. Confirm the catalog lists at least `compute`, `network`, `image`, `volumev3`, and that the server and network lists match what you remember from Module 2.4.
2. **Install Terraform.** Use the one-liner from the lab handout corresponding to your OS (Linux: `tfenv` install + `tfenv install latest`; macOS: `brew install tfenv && tfenv install latest`; Windows: download the binary from `releases.hashicorp.com/terraform`). Confirm: `terraform version` should return a version string (1.5.x or 1.6.x is fine). Create the working directory: `mkdir -p ~/labs/3-1/tf && cd ~/labs/3-1/tf`.
3. **Initialize the Terraform configuration from the starter.** Copy the starter `main.tf` from the lab handout into `~/labs/3-1/tf/main.tf`. The starter declares: a `terraform {}` block with the OpenStack provider pinned, a `provider "openstack" {}` block with values from environment variables (no hardcoded credentials), and three resources: `openstack_networking_network_v2.tf_net` named `<initials>-nw-tf-net`, `openstack_networking_secgroup_v2.tf_sg` named `<initials>-nw-tf-sg` with one ingress rule for SSH (port 22) from `192.0.2.0/24` (the placeholder office range — replace with your actual office range from Module 2.3 if known), and `openstack_compute_instance_v2.tf_vm` named `<initials>-nw-tf-01` using the `d2-2` flavor and the Ubuntu 24.04 image. Replace every `<initials>` placeholder with your own initials. Source your application credential `openrc.sh` in the same shell so Terraform picks up `OS_*` env vars automatically.
4. **Run the init-plan-apply loop, first pass.** Run `terraform init` and confirm the OpenStack provider is downloaded (you will see `.terraform/providers/registry.terraform.io/terraform-provider-openstack/openstack/`). Run `terraform plan` and capture the output: `terraform plan -out=plan-initial.tfplan` then `terraform show plan-initial.tfplan > plan-initial.txt`. Read the plan: there must be **3 to add, 0 to change, 0 to destroy**. Apply: `terraform apply plan-initial.tfplan` (uses the captured plan, no interactive confirmation needed). Watch the apply, note the duration in your lab notes.
5. **Verify the resources via the OpenStack CLI.** In the same shell, run the three verification commands and capture each output: `openstack network list | grep <initials>-nw-tf-net`, `openstack security group list | grep <initials>-nw-tf-sg`, `openstack server list | grep <initials>-nw-tf-01`. All three must return exactly one line. Open the Manager UI in a browser and confirm the same three resources appear with the correct names — Terraform-managed resources look identical to manually-created ones in the Manager (this is the point).
6. **Produce a drift event.** In the Manager UI, navigate to Public Cloud → Network → Security Groups → `<initials>-nw-tf-sg` → click the ingress rule for port 22 → **Delete**. Confirm. Back in the terminal, run `terraform plan` and capture the output: `terraform plan > plan-after-drift.txt`. The plan must show a non-empty diff proposing to recreate the deleted rule. Read the diff. Run `terraform apply` (without `-auto-approve`, confirm with `yes`) to converge. Verify by re-running `terraform plan` — must return "No changes. Your infrastructure matches the configuration.".
7. **Destroy and rebuild.** Run `terraform destroy` (confirm with `yes`). Watch the three resources being destroyed; verify with `openstack server list`, `openstack security group list`, `openstack network list` that none of the three `<initials>-nw-tf-*` resources remain. Capture the destroy output as `destroy-1.txt`. Then run `terraform apply` again (with `-auto-approve` this time, since you've already seen the plan twice). The three resources come back identically. Re-run the verification commands — same names, same configuration. Capture as `apply-2.txt`. Run `terraform destroy` one last time to leave the project clean. Capture as `destroy-2.txt`.
8. **Commit the lab artifacts.** Commit to the lab repo under `labs/3-1/`:
   - `main.tf` — your configuration, with `<initials>` replaced
   - `cli-sanity.txt`, `plan-initial.txt`, `plan-after-drift.txt`, `destroy-1.txt`, `apply-2.txt`, `destroy-2.txt`
   - A short `notes.md` capturing: the apply duration, your observation on the drift event (what did Terraform say, in your own words), one question you still have at the end of the lab
   - A `.gitignore` containing `*.tfstate`, `*.tfstate.backup`, `.terraform/`, `*.tfplan` — copy from the handout. **Never commit `terraform.tfstate`.**
### Validation criteria
 
- The OpenStack CLI is functional: `openstack catalog list` returns a non-empty table; the three Northwind-existing resources are visible (`server list`, `network list`).
- Terraform is functional: `terraform version` returns a version string; `terraform init` completes without error in the lab working directory.
- The initial `terraform plan` shows exactly **3 to add, 0 to change, 0 to destroy** — no surprises, no extra resources, no diff on the Security Group rule that wasn't declared.
- After the manual Security Group rule deletion, `terraform plan` returns a **non-empty diff** proposing to recreate the rule — drift detection works.
- `terraform destroy` followed by `terraform apply` recreates the same three resources successfully — reproducibility proven.
- The lab repo contains the eight expected files, and `terraform.tfstate` is **not** committed (`git ls-files | grep tfstate` returns nothing).
### Lab artifacts to produce
 
- `labs/3-1/main.tf` — the Terraform configuration with `<initials>` replaced.
- `labs/3-1/cli-sanity.txt`, `plan-initial.txt`, `plan-after-drift.txt`, `destroy-1.txt`, `apply-2.txt`, `destroy-2.txt` — captured outputs.
- `labs/3-1/notes.md` — apply duration, drift observation in the learner's own words, one open question.
- `labs/3-1/.gitignore` — standard Terraform `.gitignore` from the handout.
### Common lab support questions
 
- *`pip install python-openstackclient` fails with a permission error* → you forgot to activate the virtual environment, or the venv was created with a different Python. Recreate the venv (`python -m venv ~/.venv/osc`), source it, retry.
- *`openstack catalog list` returns `Missing value auth-url required for auth plugin password`* → the `openrc.sh` is not sourced in the current shell. Run `source ~/.openrc/<initials>-nw-backup.sh` and retry. If still failing, the credential file is missing the `OS_AUTH_TYPE=v3applicationcredential` line — add it.
- *`terraform init` fails with `Failed to query available provider packages`* → network issue reaching `registry.terraform.io`. Check connectivity; the handout has a registry mirror config for restricted networks.
- *`terraform plan` returns `Error: Insufficient ... blocks`* → typo in the HCL syntax of `main.tf`. The error message usually points to the line. Most common: missing closing `}`, or a key without a value.
- *`terraform apply` fails on the instance with `Error: Image not found`* → the Ubuntu 24.04 image ID varies by region; replace the image lookup in the configuration with `data "openstack_images_image_v2" "ubuntu" { name = "Ubuntu 24.04" most_recent = true }` and reference `data.openstack_images_image_v2.ubuntu.id` in the instance block. The handout starter already does this.
- *The plan after the drift event shows the rule as `+/-` (replace) instead of `~` (in-place)* → that's normal — Security Group rules are immutable in OpenStack, so any change is a destroy-and-create. The drift detection still works; converge with `terraform apply`.
- *I want to commit `terraform.tfstate` to share with my teammate* → don't. The right answer is remote state with locking (Professional level). At this level, exchange the Terraform code; let each environment have its own state.
- *Can I run two `terraform apply` in parallel from two terminals?* → no, with local state this corrupts the state file. State locking exists, but only with remote backends. One apply at a time per state file.
---
 
## Block 5 — Micro-check QCM (5 min)
 
Format: 8 single-answer multiple-choice questions, formative (non-certifying).
 
### Question 1
 
- **Stem**: Which of the following is the most accurate definition of Infrastructure as Code in the Public Cloud Core context?
- **Correct answer**: B. A practice in which infrastructure is described declaratively in versioned configuration files, and a tool reconciles the actual state of the cloud to the declared state — enabling reproducibility, peer review, and drift detection.
- **Distractors**:
  - A. A practice in which all cloud operations are performed exclusively via a CLI rather than a graphical Manager UI — *Why wrong*: CLI use is imperative scripting, not IaC; IaC is declarative regardless of the client.
  - C. A practice in which infrastructure changes are queued in a ticketing system and reviewed by a change advisory board before being applied manually — *Why wrong*: describes a manual change process, not IaC; the code part is missing.
  - D. A practice in which the cloud provider runs all infrastructure on the customer's behalf based on a service-level agreement — *Why wrong*: describes a managed-service model, unrelated to who declares the infrastructure.
- **LO traced**: `LO-IAC-K01`
- **Bloom level**: Remember
### Question 2
 
- **Stem**: A Northwind operator wants to view the list of all instances in the Northwind Public Cloud project from a terminal. Which control plane is the most appropriate for this action?
- **Correct answer**: A. The OpenStack CLI (`openstack server list`), because the action is project-scoped and the OpenStack API exposes Public Cloud project resources directly.
- **Distractors**:
  - B. The OVHcloud API via `curl`, because every cloud action must go through the OVHcloud-wide API — *Why wrong*: the OVHcloud API governs OVHcloud-wide actions (billing, IAM, project lifecycle, vRack); listing instances inside a project is OpenStack-scoped.
  - C. The Manager UI exclusively, because instance information is not exposed by any API — *Why wrong*: instance information is fully exposed by the OpenStack API; the Manager UI is one client among others.
  - D. The OVHcloud Python SDK, because the OpenStack CLI does not support OVHcloud-specific instances — *Why wrong*: there are no "OVHcloud-specific instances"; instances on OVHcloud Public Cloud are standard OpenStack Compute instances.
- **LO traced**: `LO-IAC-K02`
- **Bloom level**: Understand
### Question 3
 
- **Stem**: Which four commands form the core Terraform workflow at the Associate scope?
- **Correct answer**: C. `terraform init`, `terraform plan`, `terraform apply`, `terraform destroy`.
- **Distractors**:
  - A. `terraform create`, `terraform run`, `terraform delete`, `terraform reset` — *Why wrong*: invented command names; not part of the Terraform CLI.
  - B. `terraform pull`, `terraform push`, `terraform sync`, `terraform commit` — *Why wrong*: conflates Terraform with Git semantics; these are not Terraform commands at this level.
  - D. `terraform compile`, `terraform deploy`, `terraform monitor`, `terraform rollback` — *Why wrong*: invented; Terraform has no compile step (HCL is interpreted) and no built-in rollback (you re-apply a previous version of the code).
- **LO traced**: `LO-IAC-K03`
- **Bloom level**: Remember
### Question 4
 
- **Stem**: Northwind is writing a Terraform configuration that needs to (a) create a Public Cloud project from scratch, (b) within that project, create a private network, and (c) attach the project to the company's vRack. Which provider combination is correct?
- **Correct answer**: D. The OVHcloud Terraform provider for the project creation and the vRack attachment, the OpenStack Terraform provider for the private network — both providers declared in the same configuration.
- **Distractors**:
  - A. The OpenStack provider only — *Why wrong*: project creation and vRack attachment are OVHcloud-wide actions; the OpenStack provider has no resources for them.
  - B. The OVHcloud provider only — *Why wrong*: the OVHcloud provider does not expose the OpenStack-scoped resources (private networks, Security Groups); those require the OpenStack provider.
  - C. A custom provider written in Go that wraps both APIs — *Why wrong*: writing a custom provider is unnecessary; the upstream OpenStack and OVHcloud providers cover the needed resources.
- **LO traced**: `LO-IAC-K04`
- **Bloom level**: Understand
### Question 5
 
- **Stem**: A Northwind operator runs `terraform plan` and sees the following summary at the bottom of the output: `Plan: 2 to add, 1 to change, 5 to destroy`. They expected the plan to add a single new resource and change nothing else. What is the correct next action?
- **Correct answer**: A. Stop and investigate before running `apply` — read the full diff to understand which resources are about to be destroyed, since "5 to destroy" was not expected and may indicate a code mistake, a wrong workspace, or unintended deletions.
- **Distractors**:
  - B. Run `terraform apply` immediately to execute the plan, since Terraform has computed the diff correctly — *Why wrong*: Terraform computes the diff against the state and the code; if the result is surprising, the code or the state is wrong, not the math.
  - C. Run `terraform destroy` first to clean up before `apply` — *Why wrong*: `destroy` would remove everything Terraform manages, making the situation worse.
  - D. Delete the state file and re-run `terraform init` to reset — *Why wrong*: deleting the state file makes Terraform forget what it manages, causing duplicate-resource errors on the next apply.
- **LO traced**: `LO-IAC-S05` / `LO-IAC-A02`
- **Bloom level**: Apply
### Question 6
 
- **Stem**: Which statement about the local Terraform state file (`terraform.tfstate`) at the Associate scope is correct?
- **Correct answer**: B. It must never be committed to a Git repository, because it may contain resource attributes — including occasionally sensitive values — and it is treated like a credential; loss of the state file forces a recovery via `terraform import` or backup restoration.
- **Distractors**:
  - A. It should be committed to Git in every project so that teammates share the same state — *Why wrong*: committing the state file creates merge conflicts, exposes potential secrets, and breaks the locking model; the correct shared-team solution is remote state (Professional level).
  - C. It is regenerated automatically from the cloud on every `terraform plan`, so loss of the file is harmless — *Why wrong*: Terraform reads the state to know what it manages; without it, `plan` would try to recreate everything as if nothing existed.
  - D. It is encrypted at rest by Terraform using the user's OVHcloud credentials, so it can be safely committed — *Why wrong*: local state files are not encrypted at rest by Terraform; encryption is the user's responsibility, and committing remains the wrong pattern regardless.
- **LO traced**: `LO-IAC-S07`
- **Bloom level**: Apply
### Question 7
 
- **Stem**: A Northwind operator runs `terraform plan` on the main branch with no code changes since the last `apply`. The plan returns `Plan: 0 to add, 1 to change, 0 to destroy`, showing an in-place update on the `<initials>-nw-tf-sg` Security Group. What does this most likely indicate?
- **Correct answer**: C. Drift — someone or something modified the Security Group manually outside the Terraform workflow (e.g., via the Manager UI or `openstack` CLI), and Terraform is now proposing to converge the actual state back to the declared state.
- **Distractors**:
  - A. A Terraform bug — the plan should always be empty when the code has not changed — *Why wrong*: an empty plan requires both no code change *and* no out-of-band change in the cloud; the latter is not guaranteed.
  - B. The state file has been corrupted and needs to be rebuilt — *Why wrong*: corrupted state typically produces parse errors or missing-resource errors, not a clean diff against a real resource.
  - D. The OpenStack provider needs to be updated to a newer version — *Why wrong*: provider versions affect supported features but do not introduce phantom diffs on stable resources.
- **LO traced**: `LO-IAC-A02`
- **Bloom level**: Analyze
### Question 8
 
- **Stem**: A Northwind architect must decide whether to use IaC (Terraform) or Manager UI clicks for the following four use cases: (1) the production environment for the European logistics service, (2) a one-time exploration of a new product feature flagged "preview" by OVHcloud, (3) an annual disaster-recovery rebuild drill, (4) an emergency hotfix on production during a Friday-night incident, with the fix needed in under 5 minutes. Which decomposition is the most defensible at the Associate scope?
- **Correct answer**: D. (1) IaC-first — the production environment must be reproducible and reviewable; (2) Manager UI is acceptable — exploratory, short-lived, no rebuild expected; (3) IaC-first — DR rebuilds are precisely the use case IaC is built for; (4) Manager UI is acceptable as an emergency exception, with the explicit follow-up of reconciling the Terraform code to absorb the change within 24 hours.
- **Distractors**:
  - A. All four cases must use IaC, with no exceptions — *Why wrong*: ignores the cost/benefit calculus and the legitimate emergency-exception pattern; IaC dogma at the cost of operational pragmatism.
  - B. Only the production environment (1) needs IaC; the other three can be Manager UI — *Why wrong*: ignores DR rebuilds (3), which are the strongest IaC case after production itself.
  - C. None of these need IaC because they are all short-lived in scope — *Why wrong*: production (1) is not short-lived; DR rebuilds (3) are not short-lived; the framing of the question is misread.
- **LO traced**: `LO-IAC-A01`
- **Bloom level**: Analyze
---
 
## Block 6 — Wrap-up & Transition (5 min)
 
### Recap
 
By the end of this module the learner can:
- **Define** Infrastructure as Code and articulate its core benefits — reproducibility, version control, peer review, drift detection — versus manual Manager-driven provisioning (`K01`)
- **Distinguish** the three control planes of OVHcloud Public Cloud — Manager UI, OpenStack CLI, OVHcloud API — and pick the right one based on whether the action is project-scoped or OVHcloud-wide (`K02`)
- **Explain** Terraform's core mental model: providers as API translators, configuration as declarative HCL, state as the persistent memory, and the four-command workflow (`init`, `plan`, `apply`, `destroy`) (`K03`)
- **Identify** the OVHcloud Terraform provider (`ovh/ovh`) for OVHcloud-wide resources and the OpenStack Terraform provider (`openstack/openstack`) for project-scoped resources, and combine both in a single configuration when needed (`K04`)
- **Install** the OpenStack CLI in a Python virtual environment and authenticate it via an application credential `openrc.sh` (`S01`)
- **Execute** the six essential OpenStack CLI commands (`server`, `volume`, `network`, `image`, `catalog`, `quota`) and read their structured output (`S02`)
- **Install** Terraform and configure provider authentication via environment variables for both the OpenStack and OVHcloud providers (`S03`)
- **Write** a minimal Terraform configuration deploying an instance, a network, and a Security Group (`S04`)
- **Run** `terraform plan` and `terraform apply`, read the three diff symbols (`+`, `-`, `~`), and interpret the summary line before approving (`S05`)
- **Destroy** infrastructure with `terraform destroy` and verify resource cleanup via the OpenStack CLI (`S06`)
- **Manage** a local Terraform state file with basic hygiene — never commit, never edit by hand, treat as a credential (`S07`)
- **Recommend** an IaC-first approach for any reproducible environment (production, staging, multi-region, DR, training labs), with explicit documented exceptions for exploratory and emergency use cases (`A01`)
- **Anticipate** the risk of drift between declared and actual state, and apply the reflex of running `terraform plan` to detect and resolve it (`A02`)
### Transition to next module via red-thread scenario
 
Northwind has crossed the declarative threshold. The CTO's original constraint — "we will not manage anything that lives only in someone's browser tabs" — is now operationally true: the staging environment exists both in the cloud and in a versioned Terraform repository, and the same Terraform code is being adapted to bootstrap `northwind-production`. The learner has run their first `terraform destroy` followed by `terraform apply` and felt the small thrill of seeing infrastructure rebuild in minutes from text files. The remaining gap is **operations** — what happens once the production environment is live and someone has to look after it. Module 3.2 — Operations: Monitoring, Cost, Quotas & Support — picks up where IaC leaves off: how Northwind watches what is running, how it controls cost and quotas before they become a surprise, and how it interacts with OVHcloud Support when an incident or a question outgrows the team's autonomy. The reflex shift this time is from "I declare what should exist" to "I observe what is happening" — same engineering discipline, different verb. By the end of Day 3 the learner has the full operational arc: from a single Public Cloud project on Day 1 to a reproducible, secured, monitored, cost-controlled environment ready to host a real B2B SaaS in production.
 
---
 
## Trainer FAQ (anticipated questions for this module)
 
**Q: Why does OVHcloud have two Terraform providers? Couldn't there be a single unified one?**
A: The split mirrors the API split covered in slide 4. The OpenStack provider is the upstream community provider, maintained by the OpenStack community and used by every OpenStack distribution worldwide — OVHcloud benefits from this common ecosystem without forking. The OVHcloud provider covers everything that is not OpenStack-native — project lifecycle, IAM, vRack, Load Balancer, Managed Kubernetes — i.e. the OVHcloud-wide concerns. A unified provider would either duplicate the OpenStack one (maintenance burden, divergence risk) or reinvent OpenStack-native resources with OVHcloud-specific names (breaks portability). The two-provider model is the cost of being OpenStack-native, just like the two-layer IAM model is. Practically, declaring both providers in the same `terraform {}` block is one extra block — trivial overhead, large benefit.
 
**Q: When should I use the OpenStack CLI versus `curl` against the OVHcloud API versus Terraform? They seem to overlap.**
A: They don't overlap, they layer. **Terraform** is for any reproducible deployment — the declarative case. **OpenStack CLI** is for ad-hoc operations inside a project (debugging, verification, one-off inspections, recovery actions) — the imperative case at the OpenStack scope. **`curl` (or the OVHcloud SDK)** is for OVHcloud-wide actions outside the OpenStack scope — billing queries, IAM operations, project lifecycle, support tickets — when you need to script something that the OpenStack CLI doesn't cover. In practice, an experienced Northwind operator uses Terraform for 80% of the work, the OpenStack CLI for 15% of operational tasks, and `curl` against the OVHcloud API for the 5% of OVHcloud-wide automation.
 
**Q: What does the Terraform state file actually contain? Why is it so sensitive?**
A: The state file is a JSON document with three layers: (1) metadata (Terraform version, state schema version, serial counter, lineage UUID), (2) outputs declared in the configuration, (3) a `resources` array where each resource has its `type`, `name`, provider info, and one or more `instances` entries containing every attribute Terraform read from the cloud after the last apply — including IDs, IP addresses, generated passwords, key pairs, and any computed attribute. The sensitivity comes from this last point: a Compute instance state contains the SSH keypair name; an Object Storage container state may contain the S3 access key Terraform created; a Secret Manager state may contain the secret value if the consuming code is naive. Treat the state file like an `openrc.sh` or a `.aws/credentials` file — never in Git, never on shared filesystems, never in chat tools. The Professional-level answer is remote state with encryption and access control; the Associate-level answer is "keep it local, back it up, don't commit it".
 
**Q: What happens if I lose the local state file?**
A: Terraform forgets it manages anything; the next `terraform apply` tries to create everything declared in the code as if nothing existed in the cloud, which produces resource-already-exists conflicts on every line. Three recovery paths: (1) restore the state file from a workstation backup or from `terraform.tfstate.backup` (Terraform automatically writes this after every successful apply — the previous-good state); (2) `terraform import` each resource one by one, mapping the code's resource address to the real-world ID — feasible for small configurations, tedious for large ones; (3) destroy everything manually in the Manager and re-apply from scratch — last resort, possible on staging, not on production. This is the strongest argument for remote state in Professional setups: the state lives in Object Storage with versioning, never on a single laptop.
 
**Q: How does Terraform handle secrets — passwords, API keys, certificates — without leaking them in the state file?**
A: At the Associate scope, the rule is: don't put secrets in your Terraform code, and don't have Terraform generate secrets it has to store. Use Secret Manager (Module 2.5) — declare the secret manually or via the OVHcloud provider as an empty container, have your runtime fetch the value at boot. For secrets Terraform must reference (e.g., a database password it sets on a Managed Database resource), use input variables marked `sensitive = true` (suppresses display in plan/apply outputs but does *not* encrypt the state file) and fetch the variable value at runtime from Secret Manager, never from a `.tfvars` file in version control. The Professional-level answer involves Vault providers and dynamic secrets — out of scope here. The Associate-level reflex is "secrets in Secret Manager, references in code, value never in state".
 
**Q: What if two operators run `terraform apply` on the same configuration at the same time?**
A: With local state, this corrupts the state file silently or produces hard-to-recover conflicts — there is no locking mechanism between local files. With remote state (Professional level), Terraform uses a locking backend (DynamoDB on AWS, Object Storage with conditional writes on OVHcloud, etcd, Consul) to serialize applies. At the Associate scope, the operational rule is "one operator at a time per state file" — same discipline as editing a shared spreadsheet before Google Docs existed. If two people need to work on the same infrastructure, either split it into two state files (two Terraform working directories with no shared resources) or coordinate verbally — until you move to remote state.
 
**Q: What does the OVHcloud Terraform provider cover and not cover today?**
A: The provider tracks the OVHcloud API surface, which means it covers everything that has a stable REST endpoint: Cloud projects (`ovh_cloud_project`), Cloud project users, IAM users and policies (`ovh_iam_user`, `ovh_iam_policy`), vRack association (`ovh_vrack_cloudproject`), Public Cloud Load Balancer (`ovh_cloud_project_loadbalancer`), Managed Kubernetes (covered by the sibling certification), Managed Databases (sibling), Object Storage credentials (`ovh_cloud_project_user_s3_credential`), and a growing list of products. What it does *not* cover at this scope: anything still in beta or preview without a stable API contract, anything inside the OpenStack project (handled by the OpenStack provider), and the OVHcloud-specific Bare Metal, Hosted Private Cloud, and Web Hosting products (which have their own resources in the provider but are out of scope for Public Cloud Core Associate). The provider documentation at `registry.terraform.io/providers/ovh/ovh/latest/docs` is the source of truth — version it carries.
 
**Q: What is "drift" versus an "out-of-band change"? Are they the same thing?**
A: They are two names for the same phenomenon viewed from two angles. **Drift** is the noun — the divergence between declared state (Terraform code) and actual state (cloud). **Out-of-band change** is the verb — the action that caused the drift (someone clicking in the Manager, a script using the OpenStack CLI, an autoscaler adjusting, a cloud-side maintenance event). Terraform's `plan` command surfaces drift; it does not tell you which out-of-band action caused it (that's an audit log question — Manager → Identity → Logs, or the OpenStack audit log). The discipline is: detect drift via `plan`, investigate the cause via audit logs, decide whether to converge (revert the manual change) or to absorb (update the code to match the new reality).
 
**Q: What does the `lifecycle` block do at a high level? Should I use it now?**
A: The `lifecycle` block inside a resource declaration lets you override Terraform's default behavior: `prevent_destroy = true` blocks accidental `destroy` of a critical resource (useful on production databases, vetoes a destroy with an error); `ignore_changes = [tags]` tells Terraform to stop tracking changes to a specific attribute (useful when an external tool legitimately manages a tag); `create_before_destroy = true` reverses the default order for resources whose replacement would cause downtime. At Associate scope, you should know it exists and what each variant does, but you don't need to use it in your first Terraform configurations. Reach for `prevent_destroy` the first time you have a stateful production resource (a database, a stateful instance) where an accidental destroy would be catastrophic.
 
**Q: How do I manage Terraform variables and `.tfvars` files at this level?**
A: Variables (`variable "name" { type = string }`) are the parameterization mechanism — the same Terraform code with different variable values produces different environments (staging vs production, region A vs region B). Values come from, in order of precedence: command line (`-var "key=value"`), variable files (`.tfvars`), environment variables (`TF_VAR_name`), and default values in the variable declaration. At the Associate scope, the pattern is: declare your variables, put non-sensitive values in a `terraform.tfvars` file (committed to Git), put sensitive values in environment variables (never committed), and document the expected variables in a `variables.tf` or a README. The `.tfvars.example` pattern (an example file committed, real values local-only) is the standard discipline.
 
**Q: Should learners commit the state file to share with the team?**
A: No. Never. The state file is not designed for Git — it has merge conflicts on every apply, contains potentially sensitive data, and produces races when multiple operators apply at the same time without locking. The correct answer for team scenarios is remote state (Professional level). At Associate scope, if a team genuinely needs to share work on infrastructure, the right pattern is to split the Terraform configuration into independent modules with separate state files, each owned by one operator at a time, communicating via Terraform `remote_state` data sources or hard-coded resource IDs — until they can adopt a proper remote backend.
 
**Q: How does the OpenStack CLI's `--os-cloud` mechanism work versus sourcing `openrc.sh`?**
A: `--os-cloud <name>` is a cleaner replacement for `source openrc.sh`. Instead of multiple `openrc.sh` files (one per credential or per project) cluttering your home directory, you maintain a single `~/.config/openstack/clouds.yaml` containing named clouds with their credentials. Then `openstack --os-cloud northwind-staging server list` uses the `northwind-staging` entry without any shell-level export. The same `clouds.yaml` is read by the Terraform OpenStack provider if you set `cloud = "northwind-staging"` in the provider block. The mechanism is the recommended OpenStack-native discipline; the `openrc.sh` source-pattern persists because the Horizon UI downloads `openrc.sh` files by default, not `clouds.yaml` snippets. The Lab handout offers a one-time conversion script for learners who want to adopt `clouds.yaml` after the certification.
 
**Q: What about the OVHcloud SDKs and the MCP / SHAI agent tooling — why are they explicitly out of scope?**
A: The OVHcloud SDKs (Python, Go, Node.js) are clients of the OVHcloud API written in a programming language — they exist, they are useful, and they are the right tool when you need to embed OVHcloud calls inside a custom application. They are out of scope at Associate because (a) the certification's audience is operators, not developers; (b) the same goals are achievable with Terraform and `curl` without writing code. The MCP (Model Context Protocol) and SHAI (Sustainable Headquarters AI) agent tooling are recent experimental interfaces letting AI agents drive OVHcloud operations on a user's behalf — they are evolving fast and are not yet stable enough to be a certified competency. Mention they exist if a learner asks, point them to the OVHcloud labs or documentation for self-study, but don't include them in the Associate scope.
