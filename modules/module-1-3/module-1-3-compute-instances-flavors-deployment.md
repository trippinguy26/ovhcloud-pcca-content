# Module 1.3 — Compute (Part 1) — Instances, Flavors & Deployment
 
## Module Brief
 
- **Module ID**: 1.3
- **Total duration**: 1h30
- **Block breakdown**: Sentier battu 5 min · Theory 30 min · Demo 15 min · Lab 30 min · Micro-check 5 min · Wrap-up 5 min
- **Program**: OVHcloud — Public Cloud — Core Associate
- **Domain covered**: 03 — Compute (Part 1 of 2)
- **LOs covered** (10 total):
  - Knowledge: `LO-CMP-K01`, `LO-CMP-K02`, `LO-CMP-K03`, `LO-CMP-K04`, `LO-CMP-K05`, `LO-CMP-K06`
  - Skills: `LO-CMP-S01`, `LO-CMP-S02`, `LO-CMP-S03`, `LO-CMP-S04`
- **Prerequisite modules**: 1.1 — Cloud Foundations & OVHcloud Positioning; 1.2 — Public Cloud Project, Regions & Basic IAM (mandatory in sequence; standalone-allowed with sentier battu prerequisites communicated upfront, including a pre-existing project and a sourced `openrc.sh`).
- **Red-thread step**: The Public Cloud project bootstrapped in Module 1.2 (`<initials>-northwind-staging` in GRA) now hosts its first compute resource. The CTO's request — "spin up the web frontend, the API backend, and the self-managed PostgreSQL host" — is materialized today by deploying the **web frontend instance** end-to-end via the Manager. Hardening, lifecycle, and the remaining two hosts are addressed in Module 1.4. By the end of this module, Northwind has one running, reachable instance on the staging stack.
### Pedagogical angle
 
First "something runs" module. After 1.2 gave the learner an authenticated working environment, 1.3 introduces the **instance** — the most concrete mental anchor an operator can have. The module deliberately defers everything that is not strictly *deployment*: Security Group configuration beyond the default, cloud-init, snapshots, rescue mode, console diagnostics. Those belong to Module 1.4. Keeping 1.3 strictly about **flavor selection, image selection, key pair injection, and the three deployment channels** preserves cognitive bandwidth for the legacy → cloud mental shift, which is the actual difficulty here.
 
Three deployment channels are introduced because S01, S02, S03 demand it. Pragmatic split for delivery: the Manager UI is the **lab channel** (the deepest "feels real" path for the persona), the OpenStack CLI is the **demo channel** (visible proof that the project is the same object from a different interface), and Terraform is **conceptually introduced** as a teaser slide whose hands-on lives in Module 3.1. This protects the 30-min lab budget without violating LO coverage — the learner sees all three channels in the room, executes the most foundational one, and revisits the other two with proper instrumentation in 1.4 and 3.1.
 
### Trainer demonstration
 
15-minute end-to-end OpenStack CLI deployment of one Ubuntu 24.04 LTS instance on flavor `d2-2` in GRA, with key pair upload, public-network attachment, and SSH connection. Single channel: OpenStack CLI throughout. The Manager UI is opened in parallel in a browser tab to make visible — without commentary — that the resource created via CLI appears identically there. This is the "Manager = CLI = API" realization moment.
 
### Learner lab
 
*Deploy the Northwind web frontend* (30 min). Each learner deploys one instance via the **OVHcloud Manager** in their `<initials>-northwind-staging` project: region GRA, Ubuntu 24.04 LTS, flavor `d2-2`, named `<initials>-nw-web-01`, with their SSH key, the default Security Group, and a public IP. Validation: the learner SSHes into the instance and runs three sanity commands. Validation criteria are self-checkable via the SSH session output.
 
### Micro-check — question intents (drafted in Block 5)
 
1. IaaS compute vs legacy VM provisioning — Understand — `K01`
2. Flavor family identification for a given workload — Apply — `K02`
3. Flavor name decoding (`family-generation-size`) — Remember — `K03`
4. Ephemeral local disk vs persistent block storage — Understand — `K04`
5. OpenStack Nova object identification (instance / image / flavor / key pair) — Remember — `K05`
6. Standard vs Flex instance — what changes operationally — Understand — `K06`
7. SSH-by-key vs password authentication — Understand — `S04`
### Trainer FAQ — anticipated topics (drafted in Block 8)
 
Why no custom sizing, root password absence, Flex resize constraints, ephemeral disk size by flavor, image vs snapshot distinction (forward reference to 1.4), Windows licensing surcharge, GPU flavors for AI workloads (forward reference to AI tier), why three channels coexist, where Terraform fits.
 
---
 
## Block 1 — Sentier battu / Hors piste (5 min)
 
### Sentier battu (assumed prerequisites)
 
**Tools:**
- A working `<initials>-northwind-staging` Public Cloud project in region GRA, created in Module 1.2, with billing configured.
- A sourced `openrc.sh` for that project, scoped to GRA, with a Keystone user holding the `member` role (verified by `openstack token issue` returning a valid token).
- An SSH key pair on the workstation. If absent, generate one with `ssh-keygen -t ed25519 -C "<initials>-northwind"`. The public key (`.pub` file) is what gets uploaded to OVHcloud; the private key never leaves the workstation.
- An SSH client. On Windows, OpenSSH (built into Windows 10/11) or Git Bash; on macOS/Linux, the system `ssh` command.
**Knowledge:**
- The OVHcloud Public Cloud project as the unit of isolation, billing, and access (Module 1.2).
- The Manager vs OpenStack identity split (Module 1.2).
- General virtual machine vocabulary: vCPU, RAM, disk, NIC, OS image. Comfort with the idea that a VM is a software-emulated computer running on a hypervisor.
- SSH basics: key pair = public + private, public uploaded to the server, private stays local, port 22.
### Hors piste (remediation pointers for gaps)
 
- **No SSH key pair on the workstation** → `ssh-keygen -t ed25519 -C "<initials>-northwind"` accepts all defaults, produces `~/.ssh/id_ed25519` (private) and `~/.ssh/id_ed25519.pub` (public). On Windows without OpenSSH, install Git for Windows (includes ssh-keygen and ssh).
- **Module 1.2 not attended (standalone delivery)** → the trainer pre-creates the project, pre-uploads a shared SSH key, and provides a working `openrc.sh` at the start of the session. Sentier battu becomes 10 min instead of 5 to absorb the setup.
- **No prior SSH experience** → the lab provides every command verbatim. The learner only needs to read terminal output, not write commands from scratch.
- **PuTTY user (Windows legacy workflow)** → PuTTY accepts only `.ppk` keys. Convert the OpenSSH private key via PuTTYgen (`File → Load private key → Save private key`). The lab references the standard OpenSSH client; PuTTY users adapt the command syntax but the parameters are identical.
---
 
## Block 2 — Theory & Concepts (30 min)
 
### Slide 1: From a VM you built to a VM you ordered
 
**Visual concept**: A two-row comparison. Top row labeled "Legacy / VMware": a vSphere host icon, an admin manually setting vCPU, RAM, disk size, OS install ISO, network adapter — six sliders the admin tunes. Bottom row labeled "OVHcloud Public Cloud Instance": the same admin picks one tile from a flavor catalog, one tile from an image catalog, one SSH key from a list, one network from a list. Five clicks instead of fifteen knobs.
 
**Talking points**:
- An OVHcloud Public Cloud Instance **is a VM** — same fundamentals: vCPU, RAM, disk, NIC, OS
- What changes is **how you order it**: you pick from a pre-defined catalog of resource templates (flavors) and pre-built OS templates (images)
- **No custom sizing**: you cannot ask for "2.5 vCPUs and 7 GB RAM" — you pick the closest flavor in the catalog
- This is the **first cultural shift** for legacy ops: you stop building VMs, you start ordering them
- Trade-off: less flexibility per instance, **dramatically faster** provisioning (seconds vs hours) and predictable cost
**Trainer notes**:
- Souligner que c'est le premier vrai changement de mental model du programme : le catalog-based provisioning
- Anticiper "et si j'ai besoin d'une taille intermédiaire ?" → on prend le palier au-dessus, le delta de coût est négligeable face au coût d'ingénierie d'une exception
- Si quelqu'un évoque AWS EC2 → mêmes principes, AWS appelle ça "instance type", OVHcloud appelle ça "flavor"
- Rappeler le persona Corporate ex-VMware : la friction du "pas de custom sizing" est réelle, à expliciter calmement, pas à minimiser
---
 
### Slide 2: Anatomy of an instance — five things you choose
 
**Visual concept**: A central instance icon. Five labeled arrows pointing into it, each from a labeled box: **Flavor** (the hardware template), **Image** (the OS), **Key Pair** (the SSH credentials), **Network** (where it lives), **Security Group** (what reaches it). Each box carries the OpenStack Nova object name in small caps below.
 
**Talking points**:
- Deploying an instance = combining five pre-existing objects from your project
- **Flavor**: the hardware template (vCPU, RAM, disk) — picked from OVHcloud's catalog
- **Image**: the OS to boot — public (Ubuntu, Debian, Rocky, Windows Server), marketplace, or your own snapshot
- **Key Pair**: the SSH public key pre-uploaded to your project — injected into the instance at first boot
- **Network**: the network the instance is attached to — `Ext-Net` (public IP) by default in Core, private networks come in Module 2.3
- **Security Group**: the firewall ruleset attached to the vNIC — the default Security Group is enough today, custom ones in Module 1.4
**Trainer notes**:
- Souligner que ces cinq objets pré-existent dans le projet : déployer = composer, pas créer
- Anticiper "et l'IP, on la choisit ?" → non, elle est attribuée automatiquement, on en parlera Module 2.3
- Si quelqu'un demande la liste des objets Nova → instance, image, flavor, keypair, security group, plus le port et le volume qu'on verra Module 1.4 et 2.1
- Vérifier la compréhension : "le SSH key pair, il vit où ?" → dans le projet, pas sur l'instance
---
 
### Slide 3: Flavor families — what you pick depends on what you run
 
**Visual concept**: A 2-column table styled as a workload-to-family decision aid. Left column: flavor family code and category name (`d2`, `b3`, `c3`, `r3`, `i1`, `t1/t2`). Right column: one-line workload signature. A small icon per family (chalkboard for `d2`, scale for `b3`, sprinter for `c3`, brain for `r3`, lightning bolt for `i1`, neural network for `t1/t2`). Footer note: "All families share the same management surface — only the underlying hardware mix changes."
 
**Talking points**:
- **`d2` — Discovery**: the lab / dev family. Smallest, cheapest, capped capacity. Used for all training labs in this course
- **`b3` — General Purpose**: balanced vCPU/RAM ratio. Web frontends, app servers, most workloads start here
- **`c3` — CPU Optimized**: high vCPU-to-RAM ratio. Compute-bound jobs: encoding, build agents, CPU-bound APIs
- **`r3` — RAM Optimized**: high RAM-to-vCPU ratio. In-memory caches (Redis, Memcached), analytical hot data
- **`i1` — IOPS**: local NVMe storage. Latency-sensitive databases, high-throughput logging, message brokers
- **`t1/t2` — GPU**: AI/ML training, 3D rendering, inference. Hourly cost is significant; size carefully
**Trainer notes**:
- Souligner que la famille se choisit d'après le profil I/O et CPU/RAM, pas d'après le prix
- Anticiper "et le GPU, c'est dans le scope Associate ?" → on le mentionne pour la culture, le déploiement GPU sérieux est sujet tier supérieur
- Si quelqu'un demande pour Northwind PostgreSQL → réponse mécanique : `b3` ou `r3` selon la pression mémoire, on tranchera Module 1.4
- Rappeler le persona Digital Starter : `d2` ou `b3` couvrent 95% de leurs besoins, inutile de surcomplexifier
---
 
### Slide 4: Decoding a flavor name — `family-generation-size`
 
**Visual concept**: A large, highlighted flavor name `b3-8` displayed as a dissection diagram. Three labeled callouts: `b3` (family + generation: balanced, generation 3), `-` (separator), `8` (size, here in vCPU count). Below: a small table showing 4–5 examples: `d2-2`, `b3-8`, `c3-16`, `r3-32`, `i1-15`. Each row shows the decoded meaning.
 
**Talking points**:
- Flavor naming is **strictly mechanical**: `family + generation` then `-` then `size`
- **Family + generation**: `d2`, `b3`, `c3`, `r3`, `i1`, `t1`, `t2` — the family letter, the generation digit
- **Size**: roughly correlated to vCPU count (with proportional RAM); higher number = larger flavor
- Generation matters: `b3` is the current generation of General Purpose; an older `b2` may exist but is being phased out — **prefer the latest generation** unless there's a specific reason
- Why this matters: once you know the convention, you read any flavor name at a glance — no lookup needed
**Trainer notes**:
- Souligner que c'est une convention publique, pas un secret OVHcloud — n'importe qui peut décoder
- Anticiper "et le RAM, ça suit quelle règle ?" → ratio standard par famille, à vérifier dans la doc au moment du choix, ne pas mémoriser les chiffres
- Si quelqu'un demande la doc officielle → `docs.ovhcloud.com` > Public Cloud > Compute > Instances, fiche par famille
- Éviter de réciter tous les ratios RAM/vCPU — la doc est l'autorité, le but est de savoir LIRE le nom, pas de le mémoriser
---
 
### Slide 5: Ephemeral local disk — the cloud-native gotcha
 
**Visual concept**: Two side-by-side panels in an `<OvhCard>` grid. Left card titled "Local disk (ephemeral)" with a clock icon and three bullets: lives with the instance, dies with the instance, size fixed by flavor. Right card titled "Block Storage volume (persistent)" with an anchor icon and three bullets: independent lifecycle, portable between instances, resizable. A red bar between the two cards: "Delete the instance → local disk gone forever. No recovery."
 
**Talking points**:
- Every instance ships with a **local disk** sized by the flavor (e.g., `d2-2` = 25 GB local)
- This local disk is **ephemeral**: it is destroyed when the instance is deleted — no recovery, no undo
- For any data you cannot afford to lose, use a **Block Storage volume** (Cinder), covered in Module 2.1
- Legacy analogy: the local disk is like a scratch SSD soldered to the motherboard; a Block Storage volume is like a SAN LUN that survives the server
- The reflex to install: **OS and temporary files on local, application data on a volume** — always
**Trainer notes**:
- Souligner que c'est LE point où les ex-VMware se font piéger : un disque de VM survit chez VMware, ici non
- Anticiper "et si je stoppe l'instance (sans la supprimer) ?" → le local disk survit à un stop, il ne meurt qu'à la suppression de l'instance
- Si quelqu'un demande la taille du local disk par flavor → c'est dans la doc, varie par famille, à vérifier au moment du choix
- Rappeler que c'est l'attitude `A03` du référentiel : anticiper la perte de données liée à l'éphémère est un réflexe Associate
---
 
### Slide 6: The OVHcloud image catalog — what you can boot
 
**Visual concept**: Three vertical lanes in a `<OvhCard>` grid. Lane 1 "OVHcloud Public Images" with logos-by-text: Ubuntu 22.04/24.04 LTS, Debian 12, Rocky Linux 9, AlmaLinux 9, Windows Server 2022. Lane 2 "Marketplace Images" with examples: Docker, Plesk, LAMP, Nextcloud. Lane 3 "Private Images (snapshots)" with a small camera icon and the label "your own golden images — covered in Module 1.4".
 
**Talking points**:
- An **image** is a bootable OS template — the equivalent of a vSphere VM template or a Sysprep golden image
- **Public images** are maintained by OVHcloud: kept up-to-date, security-patched, immediately usable. For the lab today: Ubuntu 24.04 LTS
- **Marketplace images** layer common applications on top of public images: useful for fast-start scenarios, not strategic for Corporate
- **Private images** are snapshots of your own instances — your own golden image strategy, covered in Module 1.4
- **Windows Server images** carry a Microsoft licensing surcharge on top of the instance price — relevant for Corporate sizing
**Trainer notes**:
- Souligner qu'on n'installe jamais un OS manuellement en IaaS — on boote sur une image
- Anticiper "et BYOL Windows ?" → existe pour les Corporate sous SPLA, à voir avec l'AM, hors scope Associate
- Si quelqu'un demande comment trouver l'UUID d'une image en CLI → `openstack image list --public | grep -i "ubuntu 24"`, on le fera en démo
- Éviter d'entrer dans la stratégie golden image privée — c'est le sujet snapshots du Module 1.4
---
 
### Slide 7: SSH key authentication — no root password by default
 
**Visual concept**: A horizontal flow diagram. Left: a workstation icon with two stacked files labeled `id_ed25519` (private, padlock) and `id_ed25519.pub` (public, key icon). An arrow from the `.pub` file to a central "OVHcloud Project — Key Pairs" box. From that box, another arrow into a server icon labeled "Instance at first boot → `~/.ssh/authorized_keys`". A red dotted line through the private key with the label "never leaves the workstation".
 
**Talking points**:
- OVHcloud Linux instances have **no root password by default** — there is nothing to brute-force
- Access is exclusively via **SSH key-based authentication**: you upload your **public** key, the private one stays on your workstation
- At first boot, the public key is injected into the default user's `~/.ssh/authorized_keys` automatically (via cloud-init — covered in Module 1.4)
- **Default user per image**: `ubuntu` (Ubuntu), `debian` (Debian), `rocky` (Rocky), `almalinux` (Alma), `centos` (CentOS variants). **Never** `root`
- The private key is a **secret**: it never gets committed to Git, never uploaded to a shared drive, never copied between teams. Each engineer has their own pair
**Trainer notes**:
- Souligner que c'est l'attitude `A02` (sécurité): no root SSH, key-only — c'est non négociable
- Anticiper "et si je perds ma clé privée ?" → l'instance devient inaccessible par SSH, recovery via Rescue mode (Module 1.4) ou via cloud-init reset au redéploiement
- Si quelqu'un demande "et le user root, on en fait quoi ?" → on l'élève via `sudo` depuis le user par défaut, jamais d'accès direct
- Vérifier la compréhension : "qui voit la clé privée ?" → personne d'autre que la workstation qui l'a générée
---
 
### Slide 8: Three deployment channels — same instance, three doors
 
**Visual concept**: Three vertical lanes converging into one instance icon at the bottom. Lane 1: "OVHcloud Manager (UI)" with a browser window icon and the caption "first instance, exploration, one-shot". Lane 2: "OpenStack CLI" with a terminal icon and the caption "scripted, repeatable, interactive ops". Lane 3: "Terraform" with a code file icon and the caption "declarative IaC, version-controlled, team-shared". Below the converged instance: a small note "Same OpenStack Nova API behind all three".
 
**Talking points**:
- The same instance can be deployed via three channels — all three call the **same OpenStack Nova API** in the end
- **Manager UI**: the entry door — interactive, visual, no install required. Best for first instances, exploration, and ad-hoc operations
- **OpenStack CLI**: the operator's daily tool — scriptable, fast, the right channel for repeatable manual ops
- **Terraform**: the team's tool — declarative, version-controlled, the only channel for reproducible infrastructure at scale. Dedicated module 3.1
- **Choice rule of thumb**: one-shot → Manager; scripted ops → CLI; reproducible / team / production → Terraform
- Critical realization: a resource created in one channel **appears in all three**. The Manager is just a face on the API
**Trainer notes**:
- Souligner "Manager = CLI = API = Terraform" — c'est le moment "aha" du module
- Anticiper "et lequel est le plus rapide ?" → CLI pour un humain seul, Terraform pour reproduire, Manager pour découvrir
- Si quelqu'un demande pourquoi on garde le Manager → la réponse honnête : entry point, debug visuel, opérations one-shot, lecture rapide d'état
- Rappeler le lien avec Module 3.1 : Terraform sera vu là-bas pour de vrai, aujourd'hui c'est un teaser conceptuel
---
 
### Slide 9: Standard vs Flex instances — resize constraints
 
**Visual concept**: A two-column comparison table. Columns: "Standard instance", "Flex instance". Rows: vCPU/RAM coupling, local disk size, resize-up policy, resize-down policy, target use case. One cell highlighted in pale blue (Standard "fixed disk by flavor") and one in pale orange (Flex "decoupled local disk, resizable").
 
**Talking points**:
- **Standard instances** ship with a **fixed local disk** sized by the flavor — to change disk size, you change the flavor
- **Flex instances** decouple the local disk from the flavor — you choose the disk size independently, and **resize the disk up** later without changing the flavor
- Resizing up is supported on both types; **resize-down** (shrinking) is generally **not supported** — plan upward
- Flex is useful when the workload's compute needs are stable but the storage footprint grows over time (logs, growing dataset on local disk)
- For most Core Associate workloads, **Standard** is the default. Flex is a known option, not the default reflex
**Trainer notes**:
- Souligner que le choix Standard vs Flex se fait au déploiement et est figé après — on ne migre pas Standard → Flex
- Anticiper "et pour resize-up sur Standard ?" → on change la flavor (resize de l'instance), procédure standard avec un court downtime
- Si quelqu'un demande "et si je veux shrink ?" → réponse honnête : non, on déploie une nouvelle instance plus petite et on migre la donnée
- Éviter de promettre des resize sans downtime — il y a un reboot dans la majorité des cas, à vérifier dans la doc
---
 
### Slide 10: The Northwind staging stack — first instance today
 
**Visual concept**: A three-tier architecture diagram, semi-greyed-out. Top tier "Web frontend" (highlighted in Masterbrand Blue, one instance icon labeled `<initials>-nw-web-01`, flavor `d2-2`, image Ubuntu 24.04). Middle tier "API backend" (greyed, label "Module 1.4"). Bottom tier "PostgreSQL self-managed" (greyed, label "Module 1.4"). A footer arrow from this slide pointing to the lab.
 
**Talking points**:
- Today's lab materializes the **web frontend** of the Northwind staging stack — one instance, deployed via Manager
- Specs: region GRA, image Ubuntu 24.04 LTS, flavor `d2-2`, default Security Group, public IP, the learner's SSH key
- Why `d2-2`: Discovery family is the right calibration for a lab — minimal cost, full feature parity for the deployment workflow
- Why Ubuntu 24.04 LTS: most current LTS, broad familiarity, the reference for the rest of the program
- The other two tiers (API, PostgreSQL) are deployed in Module 1.4, with cloud-init customization and Security Group hardening
- Validation goal of the lab: the learner SSHes into the instance and confirms it is alive — that's it, that's the Core Associate "Hello World"
**Trainer notes**:
- Souligner que c'est volontairement minimal : on valide le réflexe de déploiement et la connexion SSH, pas le hardening
- Anticiper "et le hardening alors ?" → demain (Module 1.4), aujourd'hui on prouve qu'on sait déployer et joindre
- Rappeler que Northwind est notre fil rouge : chaque module fait progresser cette stack, pas un autre exemple à chaque fois
- Vérifier que tous ont l'`openrc.sh` du Module 1.2 fonctionnel — sinon, retour rapide sur la Hors piste avant de lancer le lab
---
 
## Block 3 — Trainer Demonstration (15 min)
 
### Demo scenario
 
End-to-end deployment of one Ubuntu 24.04 LTS instance via the OpenStack CLI, from key pair upload to a working SSH session. Starting state: a working `openrc.sh` sourced in a terminal, scoped to the `demo-bootstrap` project in GRA (the project from the Module 1.2 demo). Ending state: one running instance `demo-web-01` on flavor `d2-2`, reachable via SSH on its public IP, demonstrating that the user can run `uname -a` inside it. The OVHcloud Manager is opened in a parallel browser tab — without commentary — to make visible that the CLI-created instance appears identically there. The Terraform channel is **mentioned** at the end (a 10-line snippet shown for reference) but not executed; the hands-on Terraform deployment happens in Module 3.1.
 
### Demo script
 
| Step | Action | Expected output | Trainer commentary |
|---|---|---|---|
| 1 | In the demo terminal, confirm the environment: `openstack token issue` | Token block with future expiration | "On confirme que l'environnement Module 1.2 est encore opérationnel — sinon on rejoue `source openrc.sh`." |
| 2 | Upload the demo SSH public key: `openstack keypair create --public-key ~/.ssh/demo_ed25519.pub demo-key` | Confirmation line with fingerprint | Souligner : la clé publique vit dans le projet, pas dans l'instance. Toutes les futures instances pourront l'utiliser. |
| 3 | `openstack keypair list` | Table with `demo-key` and its fingerprint | "C'est la même liste qu'on verrait dans le Manager — montrez l'onglet SSH Keys côté navigateur." |
| 4 | List available images: `openstack image list --public \| grep -i "ubuntu 24"` | One or more matches, each with a UUID | Anticiper : "pourquoi cette commande retourne beaucoup de lignes ?" → variantes (cloud, server, minimal), prendre celle marquée `Ubuntu 24.04`. |
| 5 | Capture the image UUID into a variable: `IMG=$(openstack image list --public -f value -c ID -c Name \| grep "Ubuntu 24.04" \| head -1 \| awk '{print $1}')` | No output (variable set) | "On capture le UUID pour éviter de le retaper. Style opérateur : on script, on ne copie-colle pas des UUID à la main." |
| 6 | List available networks: `openstack network list` | Table with `Ext-Net` and possibly `Ext-Net-IPv6` | Souligner : `Ext-Net` est le réseau public par défaut, on en parlera en profondeur Module 2.3. |
| 7 | Capture Ext-Net UUID: `NET=$(openstack network list -f value -c ID -c Name \| grep "^.* Ext-Net$" \| awk '{print $1}')` | No output | Pareil que pour l'image — on capture pour scripter. |
| 8 | Deploy the instance: `openstack server create --image $IMG --flavor d2-2 --key-name demo-key --network $NET demo-web-01` | YAML-like output block with status `BUILD` | "L'instance est en cours de création. On va attendre l'état ACTIVE — environ 30 secondes en GRA." |
| 9 | Poll status: `openstack server show demo-web-01 -c status -c addresses` (run 2–3 times) | Status transitions `BUILD` → `ACTIVE`, addresses field populated with a public IP | Souligner : on attend `ACTIVE` puis 30 secondes de plus pour que SSH soit prêt — cloud-init termine son job. |
| 10 | Show the Manager browser tab: refresh, point to `demo-web-01` appearing in the instance list with the same IP | Same instance, same IP, same status | "Manager = CLI = API. Aucun ajout côté Manager, c'est juste un autre angle de vue." |
| 11 | Extract the public IP: `IP=$(openstack server show demo-web-01 -f value -c addresses \| sed 's/.*=//' \| awk '{print $1}')` and `echo $IP` | The public IPv4 address | Anticiper : "pourquoi ce sed/awk ?" → la colonne `addresses` mixe v4/v6 et nom de réseau, on extrait le premier IPv4. |
| 12 | SSH in: `ssh -i ~/.ssh/demo_ed25519 ubuntu@$IP` (accept host key on first connection) | Ubuntu welcome banner, prompt `ubuntu@demo-web-01:~$` | "Premier contact. Le user est `ubuntu`, jamais `root`. On est dedans." |
| 13 | Inside the instance: `uname -a && cat /etc/os-release \| head -3 && df -h /` | Kernel info, Ubuntu 24.04 lines, root filesystem usage | Souligner la taille du `/` : c'est le local ephemeral disk de la flavor `d2-2`. Cette donnée meurt avec l'instance. |
| 14 | Exit SSH: `exit`. Optionally show the Terraform equivalent (read-only, not executed) — display the `main.tf` snippet on screen | A short HCL block with `provider`, `resource "openstack_compute_instance_v2"`, the same flavor / image / key / network arguments | "Voilà ce que Terraform écrirait pour le même résultat. On le re-fera de vrai en Module 3.1." |
 
### Common demo failure modes
 
- **`openstack keypair create` returns "Public key file not found"** → the public key path is wrong or the file doesn't exist. Recovery: `ls ~/.ssh/` to confirm the path, regenerate if needed with `ssh-keygen -t ed25519`.
- **Instance stays in `BUILD` more than 2 minutes** → quota exhaustion on the project, image not found in the region, or rare regional incident. Recovery: `openstack server show demo-web-01 -c fault` for the explicit error message; check `openstack quota show --compute` for instance count.
- **SSH connection times out after `ACTIVE` for 90+ seconds** → either the workstation's outbound network blocks port 22, or the default Security Group has been altered in the project. Recovery: `openstack security group rule list default` and verify SSH inbound is allowed from anywhere (or from the workstation IP). For Core Associate scope, the default Security Group's default rules are sufficient.
- **`openstack server create` rejects the flavor name** → the project is in Discovery mode, restricting flavor availability. Recovery: switch to a Discovery-allowed flavor (`d2-2` is allowed), or upgrade the project to standard (Module 1.2 content).
---
 
## Block 4 — Learner Lab (30 min)
 
### Lab brief (learner-facing)
 
You are Northwind's Cloud Ops engineer. The CTO has asked for the staging stack to come up; today you deliver the **web frontend host**. Your mission: in your `<initials>-northwind-staging` project, deploy one Ubuntu 24.04 LTS instance named `<initials>-nw-web-01` on flavor `d2-2` in region GRA, attach your SSH key, and prove it is reachable by SSHing into it and running three sanity commands. By the end of the lab, the first Northwind staging host is up.
 
**Delivery channel**: OVHcloud Manager (web UI) for the deployment; OpenStack CLI or system SSH client for verification. Estimated time: 30 minutes including reading the brief.
 
### Lab steps (learner-facing)
 
1. From your workstation, confirm you have an SSH key pair: `ls ~/.ssh/`. You should see `id_ed25519` and `id_ed25519.pub` (or an equivalent pair). If not, generate one: `ssh-keygen -t ed25519 -C "<initials>-northwind"`.
2. Display the **public** key contents (you'll need to copy-paste it next): `cat ~/.ssh/id_ed25519.pub`. Copy the entire single line (starts with `ssh-ed25519`).
3. Log in to the OVHcloud Manager at `https://www.ovh.com/manager/`. Navigate to **Public Cloud** and open your `<initials>-northwind-staging` project.
4. In the left menu, go to **Compute > SSH Keys**. Click **Add an SSH key**. Name it `<initials>-key`, paste your public key, save. Confirm it appears in the list.
5. In the left menu, click **Instances**. Click **Create an instance**.
6. Fill the creation form:
   - **Region**: GRA (your Northwind region)
   - **Image**: Ubuntu 24.04 LTS (Linux distribution)
   - **Flavor**: `d2-2` (Discovery family, generation 2, size 2)
   - **Network**: keep `Ext-Net` (public network) — default
   - **SSH key**: select `<initials>-key`
   - **Security Group**: keep `default` — default
   - **Name**: `<initials>-nw-web-01`
7. Validate and confirm creation. Wait until the instance status reaches **ACTIVE** (typically 30–60 seconds). Note the public IPv4 address shown in the instance detail page.
8. Open a terminal on your workstation. Wait an additional 30 seconds after `ACTIVE` to let cloud-init complete, then SSH in:
   `ssh -i ~/.ssh/id_ed25519 ubuntu@<public-ip>` (accept the host key fingerprint on first connection).
9. Once connected (prompt shows `ubuntu@<initials>-nw-web-01:~$`), run the three verification commands:
   - `uname -a` (kernel and architecture)
   - `cat /etc/os-release | head -3` (OS confirmation)
   - `df -h /` (root filesystem size — note this is the ephemeral local disk)
10. Exit the SSH session: `exit`. Back in the Manager, verify the instance still shows status **ACTIVE** and the same public IP.
### Validation criteria
 
- The instance `<initials>-nw-web-01` is listed in the Manager's Public Cloud instances view with status **ACTIVE**.
- Its image is **Ubuntu 24.04 LTS**, its flavor is **`d2-2`**, its region is **GRA**.
- `ssh ubuntu@<public-ip>` succeeds without prompting for a password (key-based authentication).
- Inside the SSH session, `cat /etc/os-release | head -3` confirms **Ubuntu 24.04**.
- `df -h /` returns a non-empty filesystem listing (the local ephemeral disk).
### Lab artifacts to produce
 
- An update to the local folder `<initials>-northwind-staging/` from Module 1.2, adding:
  - `instance-web-01.txt` (the captured output of the three SSH verification commands plus the public IP and the instance UUID from the Manager)
- The instance itself **stays running** for use in Module 1.4 (hardening, lifecycle operations).
### Common lab support questions
 
- **"`ssh` returns 'Permission denied (publickey)'"** → either the private key path passed to `-i` is wrong, the public key in the Manager doesn't match this private key, or the SSH user is not `ubuntu`. Re-check the user (`ubuntu` for Ubuntu images, never `root`) and the `-i` path.
- **"SSH times out (no response)"** → cloud-init hasn't finished yet (wait 30 more seconds) or your workstation's network blocks outbound port 22. Test from a phone hotspot if you suspect the corporate network. The default Security Group allows inbound SSH from anywhere, so the cloud side is open.
- **"My Manager shows my flavor as unavailable"** → the project may still be in Discovery mode with restricted flavors. `d2-2` is Discovery-compatible; if it's blocked, the project was misconfigured in Module 1.2 — flag the trainer.
- **"The instance is `ACTIVE` but the Manager shows no public IP"** → refresh the page; if still empty after one minute, the network `Ext-Net` may not have been selected. Delete the instance and redeploy with `Ext-Net` explicitly checked.
- **"Can I SSH as root?"** → no. Root SSH is disabled by default. From the `ubuntu` user, you can `sudo -i` to elevate.
---
 
## Block 5 — Micro-check QCM (5 min)
 
### Question 1
 
- **Stem**: A learner from a VMware background asks why they cannot configure a Public Cloud instance with exactly 3 vCPUs and 5 GB of RAM. What is the correct explanation?
- **Correct answer**: **C.** OVHcloud Public Cloud instances use pre-defined resource templates called *flavors*. Custom per-instance sizing does not exist; the operator picks the closest flavor from the catalog, accepting a small over-provisioning when needed.
- **Distractors**:
  - A. The OpenStack Nova engine does not support odd-numbered vCPU counts. — *Why wrong*: vCPU counts are not restricted by parity; the constraint is the catalog itself, not Nova internals.
  - B. The customer can request custom sizing via an OVHcloud support ticket. — *Why wrong*: custom sizing is not a support option in the IaaS catalog model.
  - D. Custom sizing requires upgrading to a Professional-tier subscription. — *Why wrong*: flavors are the standard provisioning unit at all tiers.
- **LO traced**: `LO-CMP-K01`
- **Bloom level**: Understand
### Question 2
 
- **Stem**: A team is sizing an instance for an in-memory Redis cache with 60 GB of working set. Which OVHcloud flavor family is the correct first candidate?
- **Correct answer**: **B.** `r3` — RAM Optimized
- **Distractors**:
  - A. `d2` — Discovery — *Why wrong*: Discovery is the lab/dev family with capped capacity, inappropriate for a 60 GB workload.
  - C. `c3` — CPU Optimized — *Why wrong*: CPU-Optimized has a higher vCPU-to-RAM ratio, the opposite of what's needed.
  - D. `i1` — IOPS-Optimized — *Why wrong*: IOPS-Optimized targets disk-latency workloads, not memory-bound caches.
- **LO traced**: `LO-CMP-K02`
- **Bloom level**: Apply
### Question 3
 
- **Stem**: An OVHcloud flavor is named `b3-16`. What does each part of the name represent?
- **Correct answer**: **A.** `b3` is the family (General Purpose, generation 3); `16` is the size, roughly correlated to the vCPU count.
- **Distractors**:
  - B. `b3` is the region code; `16` is the RAM amount in GB. — *Why wrong*: regions have their own codes (GRA, SBG…); the flavor name does not encode the region.
  - C. `b3` is the OS image; `16` is the disk size in GB. — *Why wrong*: image and disk size are not encoded in the flavor name.
  - D. `b3` is the price tier; `16` is the maximum number of instances allowed. — *Why wrong*: flavor names encode hardware shape, not pricing tier or quotas.
- **LO traced**: `LO-CMP-K03`
- **Bloom level**: Remember
### Question 4
 
- **Stem**: A junior engineer deletes a Public Cloud instance to "clean up resources" and later asks how to recover the data that was on the instance's local disk. What is the correct answer?
- **Correct answer**: **D.** The local disk on a Public Cloud instance is ephemeral; deleting the instance destroys its local disk irreversibly. For persistent data, a Block Storage volume should have been attached and used.
- **Distractors**:
  - A. The data is preserved for 30 days in a recycle bin, accessible via the Manager. — *Why wrong*: no recycle bin or grace period exists for ephemeral local disks.
  - B. The data is automatically backed up to Object Storage by OVHcloud. — *Why wrong*: backups are not enabled by default; in IaaS, backup is the customer's responsibility.
  - C. The data can be restored by re-creating the instance with the same name. — *Why wrong*: instance names are not tied to disk content; a new instance is a blank slate.
- **LO traced**: `LO-CMP-K04`
- **Bloom level**: Understand
### Question 5
 
- **Stem**: When deploying an instance in OVHcloud Public Cloud, which OpenStack Nova object holds the SSH **public** key that will be injected into the instance at first boot?
- **Correct answer**: **B.** Key pair
- **Distractors**:
  - A. Image — *Why wrong*: the image is the OS template; it does not carry user-specific credentials.
  - C. Security Group — *Why wrong*: a Security Group is a firewall ruleset; it does not store credentials.
  - D. Flavor — *Why wrong*: a flavor is a hardware template; it does not carry credentials.
- **LO traced**: `LO-CMP-K05`
- **Bloom level**: Remember
### Question 6
 
- **Stem**: A Cloud Ops engineer is told an existing workload will outgrow its local disk in three months and wants to be able to grow the disk later without rebuilding the instance. Which instance variant should they deploy?
- **Correct answer**: **A.** A Flex instance, which decouples the local disk size from the flavor and allows the disk to be resized up later.
- **Distractors**:
  - B. A Standard instance — *Why wrong*: on a Standard instance, the local disk size is fixed by the flavor; growing it requires changing the flavor.
  - C. A Discovery (`d2`) instance — *Why wrong*: Discovery is a flavor family, not a resize-policy variant.
  - D. An IOPS (`i1`) instance — *Why wrong*: `i1` targets disk performance, not disk-size flexibility.
- **LO traced**: `LO-CMP-K06`
- **Bloom level**: Understand
### Question 7
 
- **Stem**: A learner deploys a Public Cloud instance and asks how to log in as `root` via SSH using the password they "saw flashing on the screen" during creation. What is the correct guidance?
- **Correct answer**: **C.** OVHcloud Linux instances have no root password and do not allow root SSH by default. The learner must SSH as the image's default user (e.g., `ubuntu` for Ubuntu) using key-based authentication, and elevate via `sudo` if needed.
- **Distractors**:
  - A. The root password is sent by email after deployment; check the spam folder. — *Why wrong*: no password is generated or emailed; access is key-based.
  - B. Set a root password from the OVHcloud Manager under "Instance > Reset Password". — *Why wrong*: this option does not exist for Linux instances in the Core scope.
  - D. SSH as `root` with the SSH key — root login is enabled by default. — *Why wrong*: the default is to disable root SSH; access is via the default user.
- **LO traced**: `LO-CMP-S04`
- **Bloom level**: Understand
---
 
## Block 6 — Wrap-up & Transition (5 min)
 
### Recap (1-2 lines)
 
You can now **define** an OVHcloud Public Cloud instance and **place** it as the unit of compute in the IaaS catalog model. You can **identify** the six flavor families and decode any flavor name on sight. You can **distinguish** ephemeral local disk from persistent block storage and **articulate** why this matters operationally. You can **explain** the Standard vs Flex distinction. You can **deploy** an instance via the Manager UI and via the OpenStack CLI, **inject** an SSH key at creation, and **connect** to the running instance with key-based authentication.
 
### Transition to next module via red-thread scenario
 
The Northwind web frontend host is now up, running, and reachable. But it's *exposed* — default Security Group, no custom firewall, no cloud-init customization, no snapshot, no console diagnostic ever consulted. The CTO walks back in: *"Nice. Now make it production-grade — and bring up the other two hosts the same way, but properly. Tighten SSH access to my office IP, inject the standard hardening config at first boot, take a snapshot before anyone touches it, and show me you know how to read the console if it doesn't come up next time."* That's Module 1.4 — Compute (Part 2): lifecycle, security, and diagnostics.
 
---
 
## Trainer FAQ (anticipated questions for this module)
 
**Q: Why can't I get custom sizing in OVHcloud Public Cloud? My VMware admins want exactly 6 vCPUs and 14 GB.**
A: The IaaS model trades per-instance flexibility for catalog speed and predictable cost. Pre-defined flavors allow OVHcloud to provision in seconds at a known unit price, and to publish capacity ahead of time. Custom sizing exists in some adjacent product lines (Bare Metal, Hosted Private Cloud) but not in Public Cloud Core. The pragmatic answer for the ex-VMware team: pick the closest flavor up, the over-provisioning cost is negligible compared to the operational gain of catalog provisioning. If a workload genuinely needs an exotic CPU/RAM ratio, that's a signal to look at a different product line, not to fight the catalog.
 
**Q: Why is there no root password on a Linux instance? My security team wants one as a fallback.**
A: Password-based root access is the dominant attack vector against Internet-exposed Linux hosts; removing the password removes the attack surface. The fallback is not a password — it's the SSH key pair (which the customer fully controls) and, if the key is lost, Rescue mode (Module 1.4) which gives temporary access without the original key. Modern security baselines (CIS, ANSSI) recommend exactly this posture: no password, key-only, no root SSH. Explaining this proactively to security teams usually defuses the request.
 
**Q: My Flex instance is on a 50 GB local disk. Can I shrink it back to 25 GB after deleting some data?**
A: No. Resize-down of the local disk on Flex is not supported. The growth direction is one-way. If the workload genuinely needs less disk, the path is: deploy a new instance with a smaller Flex disk, migrate the application data, retire the larger one. This constraint is shared by most cloud providers and is rooted in how block-level resize works; it's not specific to OVHcloud. Practical implication: when sizing a Flex disk initially, slightly under-provision and grow as needed rather than over-provisioning.
 
**Q: I see Marketplace images for Plesk, Docker, Nextcloud, etc. — should I be using those for Corporate?**
A: Generally no for Corporate. Marketplace images bundle an application on top of a public OS image, which is convenient for a one-off setup but creates two operational problems: the application lifecycle (patches, upgrades) is owned by a third party, and the image becomes a black box from a hardening perspective. Corporate IT typically wants to deploy a clean public OS image and layer their own configuration (Ansible, Salt, custom user-data). Marketplace is a good fit for self-service learners on a small project (Digital Starter), not for a Corporate staging stack.
 
**Q: We need a GPU for an internal ML proof-of-concept. Is GPU in the Core Associate scope?**
A: GPU flavors (`t1`, `t2`) exist in Public Cloud and are mentioned at Core Associate level for awareness — operators should know they exist and roughly what they cost. Actual GPU operations (CUDA, drivers, NVIDIA toolkit version management) are subject matter for the AI tier of the OVHcloud certifications, not the Core program. For a one-off PoC, the team can deploy a GPU instance using exactly the same procedure as today's lab, just with a different flavor name; the operational complexity is in the OS-layer GPU setup, which is the team's responsibility on Public Cloud Core.
 
**Q: How is a snapshot different from a Marketplace image or a public image?**
A: A snapshot is a **private image** captured from one of your own running instances — it freezes the OS, the configuration, and the data on the local disk at the moment of capture, and you can re-deploy a new instance from it. A public image is OVHcloud-maintained (Ubuntu, Debian, etc.); a Marketplace image is third-party-maintained. The three live in the same Glance object catalog with different visibility scopes (private vs public). Snapshots are covered in Module 1.4 because they are part of the lifecycle workflow, not the deployment workflow.
 
**Q: Why bother showing three deployment channels if the lab only uses one?**
A: Because the persona must know which channel to reach for in which situation, even before they've executed all three. The Manager is the entry point — what they'll use today. The CLI is the daily operator tool — what they'll lean on for repeatable manual ops, often by Module 2.x. Terraform is the team and production tool — what they'll write in Module 3.1. Showing all three in the same room, in the same module, prevents the wrong reflex (e.g., scripting bash around the Manager). Executing only one channel per module respects the cognitive budget; the others get their own hands-on later.
