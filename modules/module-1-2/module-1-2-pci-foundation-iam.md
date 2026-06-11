# Module 1.2 — Public Cloud Project, Regions & Basic IAM
 
## Module Brief
 
- **Module ID**: 1.2
- **Total duration**: 1h30
- **Block breakdown**: Sentier battu 5 min · Theory 30 min · Demo 15 min · Lab 30 min · Micro-check 5 min · Wrap-up 5 min
- **Program**: OVHcloud — Public Cloud — Core Associate
- **Domain covered**: 02 — PCI Foundation & Basic IAM
- **LOs covered** (13 total):
  - Knowledge: `LO-PCI-K01`, `LO-PCI-K02`, `LO-PCI-K03`, `LO-PCI-K04`, `LO-PCI-K05`
  - Skills: `LO-PCI-S01`, `LO-PCI-S02`, `LO-PCI-S03`, `LO-PCI-S04`, `LO-PCI-S05`, `LO-PCI-S06`
  - Attitudes: `LO-PCI-A01`, `LO-PCI-A02`
- **Prerequisite modules**: 1.1 — Cloud Foundations & OVHcloud Positioning (mandatory if delivered in sequence; standalone-allowed with sentier battu prerequisites communicated upfront)
- **Red-thread step**: First day as Northwind's new Cloud Ops engineer. The empty OVHcloud account exists. The learner creates the `northwind-staging` Public Cloud project, configures billing via voucher credits, picks the region, and issues the first OpenStack user credentials and API token — establishing the working environment that every subsequent module operates on.
### Pedagogical angle
 
First operational module. After 1.1 framed the "why", 1.2 answers **"where do we work, who can do what, how do we authenticate"**. Three intertwined concepts are introduced together because they are inseparable in practice: the Public Cloud project (unit of isolation, billing, access scope), the region (geographic and service-locality decision), and basic IAM (Manager identity vs OpenStack identity vs API application credentials). Making the Manager / OpenStack identity distinction explicit early prevents the most common downstream confusion for ex-AWS learners.
 
### Trainer demonstration
 
15-minute end-to-end walkthrough: create a Public Cloud project from the Manager, configure payment, create an OpenStack user, download the `openrc.sh`, run `openstack catalog list` and `openstack quota show` from the CLI to confirm the environment is operational. Single channel: Manager UI for project/user creation, then OpenStack CLI for verification. The two channels together demonstrate that the project is the same object seen from two interfaces.
 
### Learner lab
 
*Bootstrap Northwind's working environment* (30 min). Each learner creates their own Public Cloud project (`<initials>-northwind-staging`), applies a voucher credit, picks the GRA region, creates one OpenStack user, downloads and sources the `openrc.sh`, then runs three CLI verification commands. Validation criteria are self-checkable via CLI output.
 
### Micro-check — question intents (drafted in Block 5)
 
1. Definition of a Public Cloud project (isolation / billing / access boundary) — Remember — `K01`
2. Discovery vs standard project — what changes — Understand — `K04`
3. OpenStack identity components (Keystone, user, project, role, token) — Remember — `K05`
4. Region choice decision factors — Understand — `K02`
5. Manager identity vs OpenStack identity — Understand — `K05`
6. Project segmentation strategy for a corporate context — Apply — `A01`
7. Root cause of a 403 Keystone error — Apply — `A02`
### Trainer FAQ — anticipated topics (drafted in Block 8)
 
Manager NIC vs OpenStack Keystone identity, voucher credit application, Discovery mode limits and traps, region selection vs availability zone, application credentials vs user passwords, multi-project billing consolidation, why no IAM policies at this stage.
 
---
 
## Block 1 — Sentier battu / Hors piste (5 min)
 
### Sentier battu (assumed prerequisites)
 
**Tools:**
- An active OVHcloud account with Manager access. The customer code (NIC handle) has been validated and a valid payment method or a voucher code is available.
- A workstation with a modern browser and unfiltered outbound Internet access to `*.ovh.com`, `*.ovh.net`, and the OpenStack auth endpoint (`auth.cloud.ovh.net`).
- A terminal with Python 3.8+ installed (for the OpenStack CLI in the lab).
**Knowledge:**
- The OVHcloud Public Cloud positioning as covered in Module 1.1 — native OpenStack IaaS layer, the operational definition of "Core".
- General IAM vocabulary: user, role, credential, token. Comfort with the idea that authentication and authorization are two separate steps.
- Command-line basics: sourcing a shell script, setting environment variables, reading JSON output.
### Hors piste (remediation pointers for gaps)
 
- **No OVHcloud account yet** → 5-minute self-service signup at `ovhcloud.com/en/auth/signup/`. The training sponsor should pre-create accounts for in-person sessions to avoid wasting the Sentier battu window.
- **OpenStack CLI not installed** → `pip install python-openstackclient` (a fallback container image is provided in the lab folder if pip is unavailable on the workstation).
- **Module 1.1 not attended** → before the session, read the "Why OVHcloud" 5-page brief in the standalone delivery kit and skim the Core scope definition.
- **No prior CLI experience** → the demo and lab provide every command verbatim; learners only need to read terminal output, not write commands from scratch.
---
 
## Block 2 — Theory & Concepts (30 min)
 
### Slide 1: The Public Cloud Project — the boundary that matters
 
**Visual concept**: A single labeled box titled "Public Cloud Project". Three arrows enter the box, one per facet: a coin icon (billing), a padlock icon (access scope), a fence icon (resource isolation). Below the box: a small legacy analogy strip showing a VMware vCenter datacenter folder as the cognitive anchor.
 
**Talking points**:
- A Public Cloud project is the **fundamental unit** of OVHcloud Public Cloud — everything you deploy lives inside one
- It is simultaneously a **billing boundary**, an **access boundary**, and a **resource isolation boundary**
- One OVHcloud account can hold many projects, each fully independent
- Legacy analogy: like a vCenter datacenter folder with its own permissions and chargeback dimension
- Hyperscaler cross-reference: equivalent to an AWS account or an Azure subscription, not to a VPC
**Trainer notes**:
- Souligner que c'est LE concept à intégrer aujourd'hui, tout le reste de la formation s'appuie dessus
- Anticiper "c'est comme un VPC AWS ?" → non, le projet est plus large, c'est l'équivalent du compte AWS lui-même
- Rappeler que Northwind va créer son premier projet dans le lab : `northwind-staging`
- Si quelqu'un demande combien de projets max → quota souple, plusieurs dizaines sans souci, voir avec l'AM au-delà
---
 
### Slide 2: One account, many projects — the segmentation question
 
**Visual concept**: A tree diagram. Root: "OVHcloud account (NIC handle)". Three child boxes: `northwind-dev`, `northwind-staging`, `northwind-prod`. A dotted box on the side labeled `northwind-sandbox` (Discovery mode). Each project box shows three small icons inside: instances, storage, network — to signal "self-contained universe".
 
**Talking points**:
- One account = the billing entity (your OVHcloud contract); one project = an operational silo within it
- **No data, no network, no IAM crosses a project boundary** — projects are airtight by design
- The classic corporate pattern: one project per environment (Dev / Staging / Prod), sometimes one per team or product
- All projects appear on the same invoice — segmentation does not fragment billing
- This is the structural mechanism that lets you give the dev team full power on Dev without exposing Prod
**Trainer notes**:
- Souligner "airtight" : pas de peering inter-projet en Core, c'est volontaire
- Anticiper "comment on partage des ressources entre projets ?" → on ne partage pas, on duplique via IaC (Module 3.1)
- Si quelqu'un évoque AWS Organizations → c'est analogue mais OVHcloud reste plus simple, pas de hiérarchie d'OU
- Rappeler le persona Corporate : la séparation Dev/Staging/Prod est un attendu non négociable, pas une option
---
 
### Slide 3: Discovery mode — the free starting point with a ceiling
 
**Visual concept**: Two side-by-side panels in a `<OvhCard>` grid. Left card "Discovery project" with a green checkmark list (free, no payment method, instant). Right card "Standard project" with a blue arrow list (full capacity, payment validated, all regions). A red bar across the bottom of the Discovery card lists the limits.
 
**Talking points**:
- Discovery is the **free entry mode**: no payment method required, instant project creation
- Designed for learning and evaluation, not for production
- Capped on: number of instances, instance flavor sizes, region availability, no IP failover, time-limited
- A Discovery project can be **upgraded** to standard by attaching a payment method — the project keeps its ID and resources
- Trap: never plan a real workload on a Discovery project, the caps will hit you mid-deployment
**Trainer notes**:
- Souligner "upgrade in place" : pas besoin de recréer, c'est une bascule
- Anticiper "et si je dépasse les quotas Discovery ?" → blocage net, message explicite, lien d'upgrade dans le Manager
- Si un learner Digital Starter pose la question coût → Discovery + bons d'essai = ticket d'entrée à 0€, c'est le parcours self-service typique
- Éviter de détailler chaque limite Discovery (chiffres bougent), pointer la doc officielle
---
 
### Slide 4: Regions — geography meets service catalog
 
**Visual concept**: A simplified world map highlighting OVHcloud Public Cloud regions (Europe cluster: GRA, SBG, DE, UK, WAW; North America: BHS, US-East-VA; Asia-Pacific: SGP, SYD). Each region marker is a colored dot. A legend distinguishes "EU sovereign regions" from "non-EU regions". A side note: "Not all services exist in all regions."
 
**Talking points**:
- A region is a **geographic OVHcloud cloud location** with its own datacenter footprint
- Region choice drives three things: latency to your users, regulatory residency, and **which services are available**
- Service availability is **not uniform across regions** — the Core services exist almost everywhere, some adjacent services are region-restricted
- Some regions expose **availability zones** (logical sub-regions for higher availability); most regions are single-zone today
- For Northwind (EU B2B): GRA, SBG, or DE — EU residency, full Core catalog, low latency to European customers
**Trainer notes**:
- Souligner que le service catalog par région se vérifie dans le Manager au moment du choix
- Anticiper "AZ disponibles ?" → 3-AZ regions existent (notamment LON et certaines régions EU), à vérifier au cas par cas dans la doc
- Si quelqu'un compare avec AWS regions/AZ → modèle proche mais pas identique, AZ pas généralisées chez OVHcloud
- Rappeler la souveraineté : régions EU = données sous droit européen, argument majeur pour le persona Corporate
---
 
### Slide 5: Billing model — predictable, granular, no egress trap
 
**Visual concept**: A 3-column comparison table. Columns: "OVHcloud Public Cloud", "AWS", "Azure". Rows: pricing granularity (hourly / monthly), included egress traffic, billing currency display, invoice frequency, instance reservation discount model. OVHcloud column highlights two cells in pale blue: "included egress" and "no surprise billing".
 
**Talking points**:
- Billing is **resource-based and granular**: each instance, volume, IP, snapshot is billed individually
- Two modes per resource: **hourly** (pay-as-you-go) or **monthly** (commit for the calendar month, lower unit price)
- **Egress traffic is included** within the publicly committed bandwidth — this is the structural cost differentiator vs hyperscalers
- One invoice per month consolidating all projects of the account, in the account's billing currency
- No "surprise reservation overage" — pricing is published, no proprietary commitment family to learn
**Trainer notes**:
- Souligner "egress included" : c'est l'argument financier numéro un face à AWS, à ne pas survendre mais à mentionner clairement
- Anticiper "c'est vraiment illimité ?" → non, traffic bandwidth is what's committed, sustained abuse triggers a conversation, voir la doc Fair Use
- Si quelqu'un demande pour des réservations longues durées → modèle mensuel et engagement annuel possible, voir avec l'AM pour Corporate
- Rappeler que le persona Digital Starter peut prédire son budget au centime près — argument self-service décisif
---
 
### Slide 6: Two identities, one project — the Manager / OpenStack split
 
**Visual concept**: A horizontal split diagram. Top half labeled "OVHcloud Manager" with a single user silhouette and a key icon ("NIC handle"). Bottom half labeled "OpenStack / Keystone" with multiple user silhouettes inside a project box. An arrow connects the Manager identity to the project box labeled "owns / pays for". Inside the OpenStack box, arrows from users to the project labeled "operates within".
 
**Talking points**:
- **Two completely separate identity systems** coexist for the same project
- **Manager identity (NIC handle)**: the OVHcloud account itself — owns the contract, pays the bill, creates projects, can do anything administratively
- **OpenStack identity (Keystone)**: users scoped inside a specific project — deploy and operate resources via the API or CLI
- A Manager user can exist without any OpenStack user; an OpenStack user has no visibility on billing or other projects
- This split is **deliberate**: it lets you delegate operations to engineers without exposing the OVHcloud account itself
**Trainer notes**:
- Souligner que c'est la confusion numéro un pour les ex-AWS : chez AWS, IAM est unifié, ici non
- Anticiper "et la SSO entre les deux ?" → pas de fédération native Manager-OpenStack en Core Associate, sujet Module 2.5 et tier Professional
- Si quelqu'un demande pourquoi cette séparation → héritage OpenStack + isolation forte entre billing et runtime, c'est un choix architectural
- Vérifier la compréhension par une question : "qui crée l'utilisateur OpenStack ?" → réponse : un Manager user, depuis le Manager
---
 
### Slide 7: OpenStack identity — the five concepts you'll encounter daily
 
**Visual concept**: A pentagon, one concept per vertex, with a short definition next to each: **Keystone** (the identity service), **User** (an actor — human or service), **Project** (the scope), **Role** (the permission level inside a project), **Token** (a time-bounded credential issued at login). In the center: **Service Catalog** (what the user is allowed to talk to once authenticated).
 
**Talking points**:
- **Keystone** is the OpenStack identity service — every API call hits Keystone first
- A **user** authenticates with credentials; the user is **scoped** to one or more projects
- A **role** assigned to a user-in-a-project tells what they can do (the main roles in OVHcloud: `member`, `admin`, plus a few read-only variants)
- A **token** is what Keystone returns after authentication — short-lived, attached to every subsequent API call
- The **service catalog** is the list of endpoints the user can reach once authenticated — different per region
**Trainer notes**:
- Souligner que le token est éphémère (typiquement quelques heures) — c'est ce qui expire et déclenche les 403
- Anticiper "où je vois la liste des rôles ?" → `openstack role list`, on le verra en démo
- Si quelqu'un confond user et project → utiliser l'analogie : user = employé, project = bureau, role = badge d'accès au bureau
- Éviter d'entrer dans les détails de Keystone v3 (domains, federation), hors scope Associate
---
 
### Slide 8: Three ways to authenticate — pick the right one
 
**Visual concept**: Three vertical lanes labeled at the top "Manager login", "OpenStack RC + password", "Application Credentials". Each lane shows: who uses it (icon — human / script / CI), how it's stored (password vault / `openrc.sh` file / JSON with secret), and what it grants (full Manager / scoped OpenStack user / scoped automated access). The right-most lane is highlighted as "recommended for automation".
 
**Talking points**:
- **Manager login**: a human in a browser, full account control — never share, never script
- **OpenStack RC + password**: an OpenStack user's credentials in an environment file (`openrc.sh`), sourced by the CLI — fine for interactive use, awkward for automation
- **Application Credentials** (API tokens): scoped, revocable, rotatable credentials designed for scripts and CI — **the right choice for any non-interactive workflow**
- Rule of thumb: a human uses a password, a script uses an application credential
- All three authenticate against Keystone in the end — only the credential type differs
**Trainer notes**:
- Souligner que les Application Credentials sont la bonne pratique 2026, à privilégier dès qu'on quitte le terminal d'un humain
- Anticiper "et la rotation ?" → app creds peuvent être créées avec une date d'expiration, à scripter dans la CI
- Si quelqu'un demande "et les access keys S3 ?" → existent pour Object Storage S3-compatible, on en parlera Module 2.1
- Rappeler le persona Digital Starter : pour un freelance qui automatise, app credential dès le premier script Terraform
---
 
### Slide 9: Project segmentation — the corporate playbook
 
**Visual concept**: A two-row comparison. Top row labeled "Anti-pattern": one giant box "all-in-one" with Dev, Staging, Prod resources mingled inside, a red cross overlay. Bottom row labeled "Recommended": three clean boxes `acme-dev`, `acme-staging`, `acme-prod` with explicit role assignments per box (Dev: `dev-team:member` + `ops:admin`; Staging: `dev-team:read` + `ops:admin`; Prod: `ops:admin` only).
 
**Talking points**:
- **One project per environment** is the default recommendation for corporate setups
- Benefits: blast radius contained (a misclick on Dev cannot touch Prod), per-environment cost visibility, per-environment access policies
- The Northwind pattern we'll follow: `northwind-staging` first (this module), then `northwind-production` (Module 3.1 via Terraform)
- For very large organizations: also one project per team or per product line — but keep the model legible, not every micro-team needs its own project
- Counter-pattern: don't mirror your org chart into projects mechanically
**Trainer notes**:
- Souligner que la décision est faite tôt et coûte cher à défaire — d'où l'A-level LO
- Anticiper "et si on veut partager une base de données entre Dev et Staging ?" → on ne fait pas, on duplique, c'est le principe
- Si quelqu'un demande "et le coût additionnel ?" → zéro, les projets vides ne coûtent rien
- Rappeler que c'est l'attendu N+1 pour le persona Corporate : pas de raccourci sur ce point
---
 
### Slide 10: The 403 Keystone error — three root causes, one diagnostic flow
 
**Visual concept**: A `flowchart LR` Mermaid decision tree. Start: "403 Keystone error received". Three branches: (1) "Role insufficient" → "Check `openstack role assignment list --user X`"; (2) "Scope mismatch" → "Check `OS_PROJECT_NAME` in environment vs project you target"; (3) "Token expired" → "Re-source `openrc.sh` or refresh app credential". End: "If none of the above, check service catalog for the region".
 
**Talking points**:
- A 403 is **not a credentials problem** — it means Keystone authenticated you but the action is refused
- Three dominant root causes: insufficient role on the project, wrong project in scope, expired token
- The diagnostic flow is mechanical: check role assignment → check scope variables → re-authenticate → check service availability in the region
- Mastering this flow is a baseline Cloud Ops engineer skill — it removes 80% of "ticket support" reflexes
- 401 vs 403: 401 = "I don't know who you are" (bad credentials); 403 = "I know who you are, you can't do that"
**Trainer notes**:
- Souligner le 401/403 split — c'est la première discrimination à faire dans tout diagnostic
- Anticiper "et le token, comment je vois qu'il a expiré ?" → en CLI le message d'erreur est explicite, sinon `openstack token issue` pour en générer un frais
- Si quelqu'un demande "et les logs Keystone côté serveur ?" → pas accessibles en Core, on diagnostique côté client, c'est la philosophie SaaS-cloud
- Vérifier en posant : "tu reçois un 403, premier réflexe ?" → réponse attendue : `openstack role assignment list`
---
 
## Block 3 — Trainer Demonstration (15 min)
 
### Demo scenario
 
End-to-end bootstrap of an OVHcloud Public Cloud working environment. Starting state: a freshly created OVHcloud account with no project. Ending state: one Public Cloud project named `demo-bootstrap`, billing configured, one OpenStack user `ops-demo` created with `member` role, an `openrc.sh` downloaded and sourced in a terminal, and three CLI commands successfully run against the project. The demo uses two channels — the OVHcloud Manager UI for project and user creation, the OpenStack CLI for verification — to make visible that the project is the same object viewed from two interfaces.
 
### Demo script
 
| Step | Action | Expected output | Trainer commentary |
|---|---|---|---|
| 1 | Open the OVHcloud Manager, navigate to "Public Cloud" in the top bar | Public Cloud landing page, "Create a new project" CTA visible | "Voilà l'entrée du Public Cloud. Si vous voyez ça, vous êtes au bon endroit." |
| 2 | Click "Create a new project", name it `demo-bootstrap`, attach a payment method or apply a voucher | Project creation form, billing step validated, "Discovery" toggle visible | Souligner : si on coche Discovery, on a un projet gratuit immédiat ; sinon on entre en mode standard. Today: standard. |
| 3 | Confirm — wait for project provisioning (~30 sec) | New project tile appears with a unique project ID (UUID-style) | "Notez l'ID du projet — c'est lui qui apparaît dans toutes les commandes CLI, le nom est juste cosmétique." |
| 4 | Navigate to "Project Management > Users & Roles", click "Add user" | User creation modal, role dropdown shows `member`, `admin`, etc. | Anticiper la question : pourquoi pas SSO ? → c'est un user local OpenStack, pas un user Manager. |
| 5 | Create user `ops-demo` with role `member`, copy the auto-generated password | Confirmation banner, password shown once | "Le mot de passe est affiché UNE FOIS. Copiez-le maintenant ou il faudra le régénérer." |
| 6 | Click the user, then "Download OpenStack RC file" | A file `openrc.sh` downloads, prompting for region selection (pick GRA) | Souligner que le RC file embarque la région : un RC = une région. Pour multi-région, plusieurs fichiers. |
| 7 | In a terminal, run `source openrc.sh`, paste the password when prompted | Environment variables set silently | "Aucune sortie = succès. Le mot de passe ne s'affiche jamais à l'écran, c'est attendu." |
| 8 | Run `openstack token issue` | A token block prints with expiration time | Vérifier la durée du token — généralement quelques heures. C'est ça qui expire et cause les 403. |
| 9 | Run `openstack catalog list` | Service catalog table: compute, network, image, volume, identity endpoints listed | "Voici tout ce que ce user peut atteindre dans cette région. Si un service manque ici, il manque dans la région." |
| 10 | Run `openstack quota show` | Quota table: instances max, cores, RAM, volumes, floating IPs | Souligner que les quotas sont par projet et par région — pas globaux. |
| 11 | Back in the Manager, navigate to "API & Credentials" → create an Application Credential named `demo-app-cred` | JSON blob with `id` and `secret`, shown once | "Pareil que le mot de passe : affiché UNE fois. Pour la CI, on stocke ça en secret de pipeline." |
| 12 | Show the credential is revocable: highlight the "Revoke" button without clicking | Manager shows the credential in a list with revoke action | Rappeler : c'est ce qui distingue une app cred d'un mot de passe utilisateur — rotation et révocation natives. |
 
### Common demo failure modes
 
- **`openstack: command not found`** → the OpenStack CLI isn't installed in the demo terminal. Recovery: `pip install python-openstackclient` (or the prepared container). Have a pre-tested terminal as a fallback.
- **`source openrc.sh` prompts for password but every command then returns "Authentication failed"** → the password was copied with a trailing space, or the user was created with the wrong role. Recovery: paste the password in a scratch buffer first to inspect it, then re-source.
- **`openstack catalog list` returns empty** → the RC file was downloaded for a region where the user has no role assignment, or `OS_PROJECT_NAME` is unset. Recovery: re-download the RC file, picking the region where the user was created.
---
 
## Block 4 — Learner Lab (30 min)
 
### Lab brief (learner-facing)
 
You are Northwind's new Cloud Ops engineer. The CTO has handed you the OVHcloud account credentials and a voucher code. Your mission: bootstrap a fully working Public Cloud environment named `<your-initials>-northwind-staging`, create one OpenStack user for yourself, set up your local CLI access, and prove the environment is operational by listing the service catalog and your quotas. By the end of this lab, you have a working `openrc.sh` and an application credential ready for the next modules.
 
**Delivery channels**: OVHcloud Manager (web UI) for project and user creation; OpenStack CLI (terminal) for verification. Estimated time: 30 minutes including reading the brief.
 
### Lab steps (learner-facing)
 
1. Log in to the OVHcloud Manager at `https://www.ovh.com/manager/` with the credentials provided.
2. Navigate to **Public Cloud** in the top bar and click **Create a new project**.
3. Name the project `<your-initials>-northwind-staging` (e.g., `jd-northwind-staging`). Choose **standard mode** (not Discovery — we want the full catalog).
4. Apply the voucher code provided by the trainer to set up billing. Confirm and wait for provisioning.
5. In the project, go to **Project Management > Users & Roles** and create a user named `<your-initials>-ops` with role `member`. Save the auto-generated password in a local password manager or a scratch file — it is shown only once.
6. Click the user, then **Download OpenStack RC file**, picking region **GRA** (Northwind's chosen region — France, EU residency).
7. Open a terminal in the directory where the file was downloaded. Run `source openrc.sh` and paste the password when prompted.
8. Run the three verification commands and capture the output:
   - `openstack token issue`
   - `openstack catalog list`
   - `openstack quota show --compute`
9. From the Manager, create one **Application Credential** named `<your-initials>-northwind-tf` (we'll use it for Terraform later in Module 3.1). Save the `id` and `secret` securely.
10. Final check: from the same terminal, run `openstack user list` — your `<your-initials>-ops` user should appear.
### Validation criteria
 
- The project `<your-initials>-northwind-staging` is visible in your Public Cloud dashboard with a project ID (UUID).
- `openstack token issue` returns a token with a future expiration date.
- `openstack catalog list` returns at least the `compute`, `network`, `volume`, `image`, and `identity` services.
- `openstack quota show --compute` returns a non-empty table.
- The application credential `<your-initials>-northwind-tf` is visible in the Manager's API & Credentials list.
- `openstack user list` includes your `<your-initials>-ops` user.
### Lab artifacts to produce
 
- A local folder named `<your-initials>-northwind-staging/` containing:
  - `openrc.sh` (the downloaded RC file — **do not commit, it contains your project ID and username**)
  - `app-cred.json` (a JSON file with the application credential `id` and `secret` — **do not commit**)
  - `verification.txt` (the captured output of the three CLI verification commands)
- The folder structure will be reused in Module 1.3 to deploy the first instances.
### Common lab support questions
 
- **"My password from step 5 doesn't work anymore"** → the password is shown only once; if missed, regenerate it from the user's detail page (no recovery of the original is possible).
- **"`openstack` command not found"** → run `pip install python-openstackclient`. If pip is unavailable, use the prepared container image `ovhcloud/openstack-cli:latest`.
- **"My voucher says 'invalid'"** → verify it hasn't already been redeemed on another account; the trainer holds backup vouchers if needed.
- **"`openstack catalog list` shows no entries"** → the RC file was downloaded for a region where the user has no role, or the password was mistyped. Re-download the RC file for region GRA and re-source.
- **"Can I name my project differently?"** → keep the suffix `-northwind-staging` for narrative consistency; the prefix can be your initials, a nickname, or anything that disambiguates you in the shared training tenant.
---
 
## Block 5 — Micro-check QCM (5 min)
 
### Question 1
 
- **Stem**: In OVHcloud Public Cloud, what is the primary role of a Public Cloud project?
- **Correct answer**: **A.** It is the fundamental unit of resource isolation, billing scope, and access control.
- **Distractors**:
  - B. It is a network boundary equivalent to an AWS VPC. — *Why wrong*: a project contains networks but is broader than a single network; it groups all resources, not just networking.
  - C. It is a regional construct — one project exists per region. — *Why wrong*: one project spans regions; resources within it are region-scoped, not the project itself.
  - D. It is a billing aggregator that holds no resources directly. — *Why wrong*: projects do hold resources (instances, volumes, networks); billing is one of three roles, not the only one.
- **LO traced**: `LO-PCI-K01`
- **Bloom level**: Remember
### Question 2
 
- **Stem**: A learner creates a Discovery project to try OVHcloud Public Cloud. Which of the following statements is correct?
- **Correct answer**: **B.** A Discovery project has capped quotas and limited flavor sizes; it can be upgraded to a standard project by attaching a payment method, keeping the same project ID.
- **Distractors**:
  - A. A Discovery project is free forever and can host production workloads at small scale. — *Why wrong*: Discovery is not designed for production; quota caps and time limits will block scaling.
  - C. A Discovery project must be deleted and recreated as a standard project to remove the limits. — *Why wrong*: the upgrade is in-place, no recreation needed.
  - D. A Discovery project is available only in the GRA region. — *Why wrong*: Discovery is available across the standard Public Cloud regions, not GRA-exclusive.
- **LO traced**: `LO-PCI-K04`
- **Bloom level**: Understand
### Question 3
 
- **Stem**: Match the OpenStack identity concept to its definition: which concept is "a time-bounded credential issued by Keystone after a successful authentication, attached to every subsequent API call"?
- **Correct answer**: **C.** Token.
- **Distractors**:
  - A. Role. — *Why wrong*: a role defines permission level within a project, not an authentication artifact.
  - B. Service catalog. — *Why wrong*: the catalog lists reachable endpoints, it is not a credential.
  - D. Project. — *Why wrong*: a project is a scope, not a credential.
- **LO traced**: `LO-PCI-K05`
- **Bloom level**: Remember
### Question 4
 
- **Stem**: Northwind operates in Europe and must keep customer data under EU jurisdiction while minimizing latency to French users. Which region is the most appropriate first choice for the `northwind-staging` project?
- **Correct answer**: **A.** GRA (Gravelines, France) — EU residency, full Core catalog, low latency to French customers.
- **Distractors**:
  - B. BHS (Beauharnois, Canada) — *Why wrong*: outside EU jurisdiction, latency penalty to European users.
  - C. SGP (Singapore) — *Why wrong*: outside EU, high latency.
  - D. US-EAST-VA — *Why wrong*: outside EU, breaks the residency requirement.
- **LO traced**: `LO-PCI-K02`
- **Bloom level**: Understand
### Question 5
 
- **Stem**: In OVHcloud Public Cloud, which statement correctly describes the relationship between the Manager identity (NIC handle) and an OpenStack identity (Keystone user)?
- **Correct answer**: **D.** They are two separate identity systems; a Manager user creates and manages OpenStack users, but the two identities have distinct credentials and scopes.
- **Distractors**:
  - A. They are the same identity — the NIC handle is automatically the OpenStack admin. — *Why wrong*: the two are deliberately separated.
  - B. The OpenStack user inherits the Manager user's billing privileges. — *Why wrong*: OpenStack users have no billing visibility.
  - C. SSO is enabled by default between Manager and OpenStack. — *Why wrong*: no native federation in the Core Associate scope.
- **LO traced**: `LO-PCI-K05`
- **Bloom level**: Understand
### Question 6
 
- **Stem**: A corporate customer is planning to migrate to OVHcloud Public Cloud and asks how to organize projects for their Dev, Staging, and Production environments, with separate teams operating each. Which recommendation aligns with the OVHcloud Public Cloud segmentation pattern?
- **Correct answer**: **B.** Create one Public Cloud project per environment (`acme-dev`, `acme-staging`, `acme-prod`), assign per-project roles to each team, and rely on the consolidated invoice for cost visibility.
- **Distractors**:
  - A. Create a single project containing all environments and use OpenStack roles to separate access. — *Why wrong*: a single project cannot fully isolate resources and blast radius across environments.
  - C. Create one project per team regardless of environment. — *Why wrong*: misses the environment isolation that matters most for blast radius and lifecycle.
  - D. Create one OVHcloud account per environment. — *Why wrong*: fragments billing and contract management unnecessarily; segmentation belongs at the project level.
- **LO traced**: `LO-PCI-A01`
- **Bloom level**: Apply
### Question 7
 
- **Stem**: A learner runs `openstack server list` and receives an HTTP 403 error. The credentials in `openrc.sh` were working ten minutes ago. What is the most likely root cause and the first diagnostic step?
- **Correct answer**: **A.** The Keystone token has expired; re-source the `openrc.sh` to obtain a fresh token, then retry.
- **Distractors**:
  - B. The user's password has been reset; reset it again in the Manager. — *Why wrong*: a password reset would surface as a 401 (authentication failure), not a 403.
  - C. The region is down; check the OVHcloud status page. — *Why wrong*: a regional outage would manifest as connection errors or 5xx, not a 403.
  - D. The project has been deleted; re-create it. — *Why wrong*: a deleted project would prevent authentication entirely and produce different error patterns.
- **LO traced**: `LO-PCI-A02`
- **Bloom level**: Apply
---
 
## Block 6 — Wrap-up & Transition (5 min)
 
### Recap (1-2 lines)
 
You can now **define** what a Public Cloud project is and **place** it as the foundational unit of OVHcloud Public Cloud. You can **identify** OVHcloud regions, the Discovery vs standard distinction, and the OpenStack identity model. You can **operate** a project end-to-end: create it, configure billing, create OpenStack users, download and use an `openrc.sh`, generate application credentials, and diagnose the most common 403 errors. You can **defend** a Dev / Staging / Prod segmentation strategy with a corporate stakeholder.
 
### Transition to next module via red-thread scenario
 
Northwind's working environment is now operational: `<your-initials>-northwind-staging` exists in GRA, billing is set up, the Ops user is authenticated, and the application credential is ready for later automation. The CTO walks in: *"Great, the lights are on. Now I want to see something running. Spin up the first three instances of the staging stack — the web frontend, the API backend, and the self-managed PostgreSQL host. We'll talk about hardening tomorrow; today, I just want to know it boots."* That's Module 1.3 — Compute (Part 1): instances, flavors, and deployment.
 
---
 
## Trainer FAQ (anticipated questions for this module)
 
**Q: Why does OVHcloud separate the Manager identity (NIC handle) from the OpenStack identity (Keystone user)? Other clouds unify them.**
A: It is a deliberate architectural choice inherited from OpenStack and reinforced by the operational logic. The Manager identity owns the contract and the bill; the OpenStack identity operates the runtime. Separating them lets a customer delegate full operational power to engineers (via OpenStack users) without ever exposing the billing-owning account. Hyperscalers achieve similar isolation via IAM policies layered on top of a unified identity; OVHcloud achieves it structurally. Trade-off: no built-in SSO between the two layers in the Core scope. Federation comes in higher tiers and is covered in Module 2.5.
 
**Q: Can I use my OVHcloud SSO (e.g., Google, Microsoft) to log in to OpenStack directly?**
A: Not in the Core Associate scope. OVHcloud SSO authenticates you to the Manager only. OpenStack users are local Keystone users with their own passwords and application credentials. Federated identity to OpenStack is a Professional-tier topic.
 
**Q: When should I use an Application Credential vs an OpenStack user password?**
A: Use a password for interactive CLI work by a human. Use an Application Credential for everything else: scripts, CI pipelines, Terraform, monitoring agents. Application Credentials are scoped, revocable, can carry an expiration date, and don't tie automation to a human user (which is critical when the human leaves the company). The rule of thumb: if it's running unattended, it's an application credential.
 
**Q: What happens to my resources if I delete a Public Cloud project?**
A: All resources inside the project are deleted: instances, volumes, snapshots, networks, IPs. The deletion is irreversible. The project ID is freed and reusable only after a delay. Billing stops at the moment of deletion (prorated to the hour for hourly resources). Practical implication: never delete a project to "clean up" without exporting the data you need first.
 
**Q: How is a region different from an availability zone in OVHcloud?**
A: A region is a geographic OVHcloud cloud location with its own datacenter footprint and service catalog (GRA, SBG, BHS, etc.). An availability zone is a logical sub-region with independent power and network within the same region, used to deploy HA workloads. Most OVHcloud regions are currently single-zone — meaning the region itself is the deployment unit. A few regions expose multiple AZs (notably some EU regions); availability is verified in the Manager or docs at the moment of deployment. Multi-AZ patterns are a Professional-tier topic; in Core Associate, we deploy in one region without assuming AZ separation.
 
**Q: Can I have multiple billing entities under one OVHcloud account, or do I need one account per business unit?**
A: One OVHcloud account = one billing entity (one contract, one invoice). If your organization needs separate invoices per business unit, you create separate OVHcloud accounts. Projects within one account always roll up to the same invoice. The Public Cloud project segmentation we discussed is about access and resource isolation, not billing fragmentation.
 
**Q: A learner asks "why aren't we writing IAM policies like in AWS today?" — what's the answer?**
A: In the Core Associate scope, OVHcloud OpenStack IAM is intentionally simpler: pre-defined roles (`member`, `admin`, plus a few read variants) assigned per user per project. Fine-grained custom policies and condition-based access exist at a higher level (OVHcloud IAM applied to the Manager) and are covered in Module 2.5. The Core layer's identity model is "good enough for 90% of operational needs" and avoids the policy-debugging tax that AWS IAM is known for.
