# Module 1.4 — Compute (Part 2) — Lifecycle, Security & Diagnostics
 
## Module Brief
 
- **Module ID**: 1.4
- **Total duration**: 1h30
- **Block breakdown**: Sentier battu 5 min · Theory 30 min · Demo 15 min · Lab 30 min · Micro-check 5 min · Wrap-up 5 min
- **Program**: OVHcloud — Public Cloud — Core Associate
- **Domain covered**: 03 — Compute (Part 2 of 2)
- **LOs covered** (7 total):
  - Skills: `LO-CMP-S05`, `LO-CMP-S06`, `LO-CMP-S07`, `LO-CMP-S08`, `LO-CMP-S09`
  - Attitudes: `LO-CMP-A02`, `LO-CMP-A03`
- **Prerequisite modules**: 1.1, 1.2, 1.3 (mandatory in sequence; standalone delivery requires a pre-existing reachable instance and the learner's `openrc.sh` ready in the room).
- **Red-thread step**: The Northwind web frontend deployed in Module 1.3 (`<initials>-nw-web-01`) is exposed: default Security Group, no custom firewall, no cloud-init, no snapshot, no console diagnostic ever consulted. Today the learner brings it to production-grade — Security Group tightened to the office IP, snapshot taken as the rollback point — then deploys the **API backend** (`<initials>-nw-api-01`) and the **self-managed PostgreSQL host** (`<initials>-nw-db-01`) with cloud-init injection at first boot, and finally exercises Rescue mode + console diagnostics on a deliberately broken instance. By the end of this module, the three-tier Northwind staging stack is up, hardened, and the learner has the diagnostic reflex when one of the three does not come up next time.
### Pedagogical angle
 
This is the "production-grade compute" module. Where 1.3 answered *"how do I deploy an instance"*, 1.4 answers the four questions that immediately follow in any real ops conversation: *how do I lock it down (Security Groups), how do I make it usable at first boot without SSHing in to do it (cloud-init), how do I roll back (snapshots), how do I get back in or diagnose it when it goes wrong (Rescue + console)*. These five skills (`S05`–`S09`) are what separates a learner who can spin a VM from a learner who can run a tier in staging.
 
The module is deliberately operations-heavy: more Demo and Lab time relative to Theory than 1.3, because every concept here has an immediate operational counterpart. The theory block stays under 12 slides by treating Security Groups and cloud-init as the two anchors (each gets two slides), and snapshots / Rescue / console as one slide each — they are simpler concepts that the operator just needs to know exist and when to reach for them.
 
Attitudes `A02` (security reflexes on a publicly exposed instance) and `A03` (ephemeral-storage data loss anticipation) are not taught as separate slides — they are woven into the Security Group slides (`A02`) and the snapshot slide (`A03`). This is intentional: attitudes are formed by what the trainer **rejects** during the lab, not by a dedicated slide that says "have the right attitude."
 
### Trainer demonstration
 
15-minute end-to-end OpenStack CLI demo: starting from the `demo-web-01` instance that came out of the Module 1.3 demo, the trainer (1) creates a tightened Security Group allowing SSH only from the demo workstation's public IP, attaches it to the instance, removes the default; (2) takes a snapshot of the current state; (3) demonstrates Rescue mode by triggering it on the instance, SSHing into the rescue environment, mounting the original root filesystem, fixing a deliberately broken `sshd_config`, and exiting Rescue; (4) reads the console output (`openstack console log show`) on a second instance that was deployed earlier with a malformed cloud-init file to show what a cloud-init failure looks like in the log. The Manager UI is opened in parallel for snapshot and Rescue mode to show the GUI equivalents.
 
### Learner lab
 
*Bring Northwind staging to production-grade — three instances, hardened* (30 min). Each learner: (1) creates a Security Group `<initials>-nw-ssh-office` allowing SSH only from the learner's current public IP, attaches it to the existing `<initials>-nw-web-01`, validates that SSH still works from the workstation and is now rejected from a second source (verified via a one-line `curl` from a public test endpoint); (2) takes a snapshot of `<initials>-nw-web-01` named `<initials>-nw-web-01-baseline`; (3) deploys `<initials>-nw-api-01` (flavor `d2-2`, Ubuntu 24.04, the same Security Group, a cloud-init file that installs `nginx` and writes `/etc/motd`) and confirms via SSH that the cloud-init ran (motd appears, nginx is listening); (4) deploys `<initials>-nw-db-01` with the same baseline and a different cloud-init (installs `postgresql-16`, creates a `northwind` database, no public PostgreSQL exposure — only SSH); (5) reads the console log of one of the three instances and identifies the cloud-init success marker. Validation: three running instances, all reachable via SSH from the learner's workstation only, two have cloud-init footprint visible.
 
### Micro-check — question intents (drafted in Block 5)
 
1. Security Group default behavior — Understand — `S05` / `A02`
2. Cloud-init injection mechanism (where the user-data is read from) — Remember — `S06`
3. Snapshot scope (what is and is not captured) — Understand — `S07` / `A03`
4. Rescue mode — what changes and what doesn't — Understand — `S08`
5. Console log — when to use it vs SSH — Apply — `S09`
6. Ephemeral disk data loss — anticipating risk in design — Apply — `A03`
7. Hardening reflexes on a publicly exposed instance — Apply — `A02`
### Trainer FAQ — anticipated topics (drafted in Block 8)
 
Security Group vs network ACL (and the absence of network ACLs in Core scope), stateful firewall behavior on egress, the cost-free nature of Security Groups, cloud-init log file location and reading, the difference between cloud-init at first boot and on every boot, snapshot storage billing, snapshot consistency for databases (forward reference to Module 2.1 for volume-level snapshots), Rescue image vs original image distinction, console log truncation, when console log will NOT help (post-boot freezes).
 
---
 
## Block 1 — Sentier battu / Hors piste (5 min)
 
### Sentier battu (assumed prerequisites)
 
**Tools:**
- The `<initials>-nw-web-01` instance from Module 1.3 still running and SSH-reachable from the learner's workstation.
- The same `openrc.sh` from Module 1.2, still sourced and scoped to GRA.
- The learner's public IP (the one the workstation will reach the cloud from), obtainable via `curl ifconfig.me` or equivalent. Required for tightening the Security Group.
- A text editor able to save Unix line endings (VSCode, Notepad++, vim, nano). Required for writing cloud-init files cleanly — CRLF line endings break cloud-init silently.
**Knowledge:**
- The five-object instance composition from Module 1.3 (flavor, image, key pair, network, Security Group).
- Basic firewall vocabulary: source, destination, port, protocol, ingress, egress, allow-by-default vs deny-by-default.
- The notion of a YAML file as a structured text format with indentation significance.
- Reading basic boot output in a terminal (recognizing kernel messages, systemd unit start lines).
### Hors piste (remediation pointers for gaps)
 
- **No working `<initials>-nw-web-01`** → quick redeploy via OpenStack CLI in 2 minutes using the Module 1.3 sequence, or pair with a neighbor to share their instance during the SG and snapshot exercises (cloud-init exercises require the learner's own).
- **Public IP detection blocked on the corporate network** → use `dig +short myip.opendns.com @resolver1.opendns.com` or any of the equivalent services. If the corporate egress IP changes mid-session (NAT pool rotation), explain that the SG rule will need updating — this is a normal production reality, not a bug.
- **No YAML familiarity** → the cloud-init files in the lab are provided verbatim; the learner only edits the package list. A 30-second sanity rule covers the gap: indentation is spaces (never tabs), two spaces per level, and `:` separates key from value.
- **CRLF line endings on Windows** → in VSCode, the status bar at the bottom right shows `CRLF` or `LF`. Click it once to convert to `LF`. Demonstrate this once during the Sentier battu and the issue rarely resurfaces.
---
 
## Block 2 — Theory & Concepts (30 min)
 
### Slide 1: Why this module exists — the four operational questions
 
**Visual concept**: A diagram of an instance icon at the center, surrounded by four labeled question bubbles pointing inward: "How do I lock it down?" (Security Groups), "How do I make it usable at first boot?" (cloud-init), "How do I roll back?" (snapshots), "How do I get back in / see what happened?" (Rescue + console). A small banner under the instance: "Module 1.3 deployed it. Module 1.4 operates it."
 
**Talking points**:
- 1.3 answered "how do I deploy" — 1.4 answers what comes next in every real ops conversation
- Four operational concerns, all native OpenStack, all reachable from Manager + CLI + Terraform
- Security Groups: the **stateful firewall** in front of every instance — the only thing standing between the public Internet and your SSH port
- Cloud-init: the **first-boot automation** that turns a generic image into a configured host without you SSHing in
- Snapshots: the **lightweight rollback** for instance state — your "before I touch it" insurance
- Rescue mode + console log: the **diagnostic toolbox** for when an instance does not come up or does not respond
**Trainer notes**:
- Souligner que ces quatre questions sont universelles cloud, pas spécifiques OVHcloud : un opérateur AWS ou Azure se les pose exactement de la même façon
- Anticiper "et le hardening OS ?" → on parle infra layer aujourd'hui, le hardening OS-side (CIS, ANSSI baseline) est sujet du programme Pro
- Rappeler que le module est volontairement plus opérationnel que théorique : Theory 30 min, mais Demo + Lab couvrent 45 min
- Si quelqu'un veut un mapping AWS : SG ↔ Security Group, user-data ↔ user-data, EBS snapshot ↔ snapshot, EC2 Rescue ↔ Rescue mode, console output ↔ console log
---
 
### Slide 2: Security Groups — the stateful firewall in front of every instance
 
**Visual concept**: A network diagram. Left side: public Internet (cloud icon). Right side: an instance icon. Between them: a labeled box "Security Group" containing an ingress arrow (with a list of allowed rules: `tcp/22 from <my-ip>`, `tcp/443 from 0.0.0.0/0`) and an egress arrow (with the label "allow all by default"). A second instance below shares the same Security Group, visually attached to the same box.
 
**Talking points**:
- A Security Group is a **stateful firewall ruleset** applied at the instance vNIC level — every packet in and out is filtered
- **Default-deny ingress, default-allow egress**: nothing reaches the instance unless explicitly allowed, but the instance can reach out freely (then return traffic is auto-allowed thanks to stateful tracking)
- A single Security Group can be **attached to multiple instances** — change the rule once, all attached instances inherit it
- An instance can have **multiple Security Groups attached** — rules are additive (union), not intersected
- Legacy analogy: this is the **per-VM firewall** that on-prem teams used to maintain as iptables rulesets — except now it's API-driven, centrally managed, and survives reboots
- Hyperscaler equivalence: **AWS Security Group** and **Azure NSG** map onto this 1-to-1 in concept; minor naming differences only
**Trainer notes**:
- Souligner que c'est stateful : on autorise l'ingress, le retour egress correspondant passe sans règle explicite
- Anticiper "et les ACL réseau ?" → pas dans le scope Core OVHcloud, la défense in-depth se fait via SG + IAM + private network (Module 2.3)
- Si quelqu'un évoque AWS NACL → expliquer brièvement que la fonction NACL (stateless, subnet-level) n'a pas d'équivalent direct dans le Core OVHcloud, c'est une absence à connaître
- Rappeler l'attitude A02 : sur une instance publique, ouvrir le moins possible, et jamais SSH sur 0.0.0.0/0 en production
---
 
### Slide 3: Security Group rules — anatomy of a rule
 
**Visual concept**: A single rule visualized as a labeled token: `[direction: ingress] [protocol: tcp] [port range: 22] [source: 203.0.113.42/32]`. Each field has a small label below explaining what it controls. A second example below: `[direction: ingress] [protocol: tcp] [port range: 443] [source: 0.0.0.0/0]` annotated "public web traffic". A footer reminder: "Source can be a CIDR or another Security Group ID."
 
**Talking points**:
- Every rule has four required fields: **direction** (ingress/egress), **protocol** (tcp/udp/icmp), **port range**, **source** (for ingress) or **destination** (for egress)
- **Source can be a CIDR** (`203.0.113.42/32` for a single IP, `10.0.0.0/8` for an internal range, `0.0.0.0/0` for the public Internet) **or another Security Group ID** — letting an SG reference another SG is how you build tiered architectures
- **Port range** can be a single port (`22`) or a range (`30000-32767`)
- **No DENY rules**: the default is deny, you only express what is allowed — there is no concept of an "explicit deny" rule that overrides an allow
- Rules are **commutative** within an SG: order does not matter, the engine evaluates the union of allow rules
**Trainer notes**:
- Souligner qu'on ne raisonne qu'en ALLOW : pas de DENY explicite, ça simplifie énormément le mental model
- Anticiper "et la priorité entre règles ?" → pas de priorité, c'est l'union des allows, simple à raisonner
- Si quelqu'un demande SG-referencing-SG → exemple concret : un SG "web-tier" qui autorise `tcp/8080` depuis le SG "frontend-tier", c'est ainsi qu'on enchaîne web→app→db sans CIDR codée en dur
- Vérifier la compréhension : "qu'est-ce qui passe par défaut en ingress ?" → rien, default-deny
---
 
### Slide 4: Cloud-init — turning a generic image into a configured host
 
**Visual concept**: A timeline diagram. Left: a generic Ubuntu image (cloud icon). An arrow labeled "instance create with `--user-data cloud-init.yaml`" points to a "first boot" box. Inside the box: a vertical sequence of cloud-init stages (network, users, packages, write_files, runcmd) annotated with their execution order. Right: a configured instance icon with installed packages, a custom motd, and an authorized SSH key all in place. Footer note: "Runs once at first boot. Subsequent reboots: no-op by default."
 
**Talking points**:
- Cloud-init is an **open-source agent baked into every public Linux image** on OVHcloud (and on every major cloud) — it reads a configuration document at first boot and applies it before the OS finishes coming up
- The configuration is passed as **user-data** at instance creation: a YAML file (or shell script) sent to the cloud's metadata service, which the cloud-init agent reads on the instance
- Stages run in a deterministic order: network setup → user creation → package install → file writes → arbitrary commands (`runcmd`)
- Use cases at Core Associate level: **install packages, create users, write configuration files, drop SSH keys, run a one-shot bootstrap script**
- Without cloud-init, every new instance starts as a blank slate that someone must SSH into and configure manually — cloud-init is the difference between artisanal and operational
- **Idempotence by default**: cloud-init runs once at first boot; reboots do not re-execute it unless explicitly configured otherwise
**Trainer notes**:
- Souligner que cloud-init est un standard cross-cloud : ce qu'on apprend ici fonctionne identiquement sur AWS, Azure, GCP, Scaleway
- Anticiper "et Windows ?" → cloudbase-init est l'équivalent pour Windows, même principe, fichier user-data différent ; pas dans le scope Associate
- Si quelqu'un demande "et Ansible alors ?" → cloud-init pour le bootstrap (du blanc au minimal viable), Ansible/Salt/Puppet pour le configuration management ongoing, les deux coexistent
- Rappeler que c'est ce qui rend l'IaC réelle : sans cloud-init, le `terraform apply` produit une VM nue, inutilisable sans intervention manuelle
---
 
### Slide 5: Cloud-init in practice — a minimal user-data file
 
**Visual concept**: A code listing in a styled YAML callout, with line-by-line annotations on the right side. The YAML:
```yaml
#cloud-config
package_update: true
packages:
  - nginx
write_files:
  - path: /etc/motd
    content: |
      Welcome to Northwind API host.
      Managed by Public Cloud Core team.
runcmd:
  - systemctl enable --now nginx
```
Annotations point to: `#cloud-config` (mandatory first line, the agent identifies the format), `packages:` (list of packages to install), `write_files:` (drop static files), `runcmd:` (post-install shell commands).
 
**Talking points**:
- The **first line `#cloud-config` is mandatory** — without it, the agent treats the file as a plain shell script
- The file is **YAML**: indentation is spaces (two spaces per level), tabs break the parser, dashes start list items
- **`packages:`** uses the distro's package manager under the hood — APT on Ubuntu/Debian, DNF on Rocky/Alma
- **`write_files:`** is the clean way to drop config files, certificates, motd — better than `echo "..." >> file` in `runcmd`
- **`runcmd:`** is the escape hatch for everything cloud-init does not have a native module for — used sparingly
- Log location once the instance is up: `/var/log/cloud-init.log` (verbose) and `/var/log/cloud-init-output.log` (stdout of commands)
**Trainer notes**:
- Souligner que le premier `#cloud-config` n'est PAS un commentaire, c'est un marqueur de format — sans lui, le fichier n'est pas reconnu
- Anticiper "et si l'install échoue ?" → l'instance boot quand même, cloud-init log dans `/var/log/cloud-init-output.log`, on le verra dans la slide console log
- Si quelqu'un demande la liste exhaustive des modules cloud-init → renvoyer à `cloudinit.readthedocs.io`, ne pas tenter de la réciter
- Éviter de laisser passer un fichier YAML en CRLF : démontrer une fois la conversion VSCode CRLF→LF, ça désamorce 80% des bugs du lab
---
 
### Slide 6: Snapshots — your "before I touch it" insurance
 
**Visual concept**: A timeline diagram. Left: an instance icon labeled `nw-web-01` at state T0 (with a green status). Center: a snapshot icon (camera) at time T1, labeled `nw-web-01-baseline`. Right: a forked path. Upper fork: the instance evolves (T2: changes applied, maybe broken). Lower fork: from the snapshot at T1, a new instance `nw-web-01-restored` is deployed at T3. A footer note: "A snapshot is a private image. Stored as an image in your project. Billed as Object Storage."
 
**Talking points**:
- A snapshot is a **point-in-time capture of an instance's local disk**, stored as a **private image** in your project's image catalog
- Created via Manager, CLI, or Terraform — typical use: take one **before any risky change** (upgrade, config migration, security patch)
- Restoration is **not in-place**: you do not "rollback" the existing instance — you **deploy a new instance from the snapshot**, then cut over (DNS, IP, etc.)
- The snapshot captures: OS, installed packages, files on the local disk, current process state is **NOT** captured (no live memory, no application state in RAM)
- **Volumes (Block Storage) are NOT included** in an instance snapshot — they have their own snapshot mechanism, covered in Module 2.1
- Snapshots are **billed as Object Storage** by the GB-month — typically a few cents per snapshot per month for a 25 GB Discovery instance
**Trainer notes**:
- Souligner que ce n'est pas un rollback in-place : on déploie une nouvelle instance à partir du snapshot, c'est différent d'un VMware revert
- Anticiper "et la cohérence base de données ?" → snapshot d'une instance avec une DB active = état non transactionnellement cohérent, on traitera la cohérence des volumes Module 2.1, en attendant : stopper l'instance avant snapshot ou faire un dump applicatif
- Si quelqu'un demande la politique de rétention → c'est manuel, vous gérez vos snapshots, OVHcloud ne supprime rien tout seul ; rappeler A03 : conscientiser le coût
- Rappeler que ça illustre A03 : un snapshot avant d'effacer une donnée = filet de sécurité ; ne pas en prendre = accepter la perte
---
 
### Slide 7: Rescue mode — getting back into an unreachable instance
 
**Visual concept**: A flowchart in `flowchart LR`. Node 1: "Instance unreachable (SSH fails, no console response)". Node 2: "Trigger Rescue mode (Manager / CLI)". Node 3: "Instance reboots into a fresh rescue image". Node 4: "SSH into rescue image with the displayed temporary password". Node 5: "Mount the original root disk: `mount /dev/sdb1 /mnt`". Node 6: "Fix the issue (config, password, broken file)". Node 7: "Exit Rescue mode → instance reboots into the original OS". A side note: "Rescue image is OVHcloud-maintained, separate from your instance's image."
 
**Talking points**:
- Rescue mode is the **escape hatch** when an instance is unreachable via SSH and you have no other access
- Triggered from Manager, CLI, or API — the instance **reboots into a temporary rescue Linux image** (OVHcloud-maintained, not your image)
- You SSH into the **rescue image** with a temporary password displayed at activation time
- The instance's **original root disk is attached as a secondary disk** (typically `/dev/sdb` or `/dev/vdb`) — you mount it, fix the issue, unmount
- Common Rescue use cases: **broken `sshd_config`, expired/lost SSH key, broken `/etc/fstab`, full root filesystem blocking boot**
- **Rescue mode is temporary**: exit it, and the instance reboots into the original image — the temporary password is gone, your fix on the root disk persists
**Trainer notes**:
- Souligner que le Rescue mode est OVHcloud-spécifique dans son délivrement, mais que le principe (reboot sur image alternative) existe partout, ex AWS = stop + détacher EBS + ré-attacher à une autre instance
- Anticiper "et le mot de passe Rescue ?" → affiché à l'activation, temporaire, ne fonctionne que pendant la session Rescue, pas une porte dérobée permanente
- Si quelqu'un demande "et si je perds la clé SSH originale ?" → Rescue mode permet de remettre une clé dans `~/.ssh/authorized_keys` du user par défaut sur le disque monté ; c'est le cas d'usage canonique
- Rappeler que ça illustre la résilience opérationnelle : on peut toujours rentrer dans une instance, à condition d'avoir accès au compte qui contrôle le projet (et donc à l'IAM Module 1.2)
---
 
### Slide 8: Console log — what the instance said while you were not watching
 
**Visual concept**: A side-by-side comparison. Left panel: an SSH terminal labeled "SSH access — needs network + sshd + valid key". Right panel: a console output viewer labeled "`openstack console log show` — needs only API access". An arrow from the right to a circled scenario: "Instance does not boot / does not get a public IP / cloud-init fails halfway → SSH impossible → console log is your only window."
 
**Talking points**:
- The **console log** is the **serial console output** of the instance — what you would see on a physical screen attached to a server during boot
- Captured from boot onward, accessible via API, CLI (`openstack console log show <instance>`) and Manager — **no SSH or network required**
- The right reflex when: instance status is `ACTIVE` but SSH refuses connection, instance never gets a public IP, cloud-init seems not to have run
- The log shows: **kernel boot messages, systemd unit startup, cloud-init output, network bring-up, sshd start**
- **Limits**: post-boot in-process issues (an application crash 20 minutes after boot) won't appear here — that's syslog/journalctl territory, which needs SSH
- **The log is truncated** to the last N kilobytes — for early-boot issues it's enough, for long-running issues you need an alternative (Rescue mode and read `/var/log/*` directly)
**Talking points** (continued for emphasis on cloud-init reading):
- The **cloud-init success marker** is the line `Cloud-init v. X.Y finished` at the end — its presence means cloud-init completed; its absence means it failed or never ran
**Trainer notes**:
- Souligner que console log + Rescue mode = la paire diagnostique standard, l'un lit, l'autre intervient
- Anticiper "et si le log est vide ?" → instance n'a pas vraiment booté (problème hyperviseur côté OVHcloud), c'est un cas pour le ticket support, pas pour l'opérateur
- Si quelqu'un demande "et l'équivalent AWS ?" → `aws ec2 get-console-output`, exact même mécanique
- Vérifier que tout le monde sait lire un boot log Linux : si quelqu'un n'identifie pas une ligne kernel d'un systemd unit, c'est un gap legacy à combler hors session
---
 
### Slide 9: Northwind staging — from one exposed instance to three hardened tiers
 
**Visual concept**: A three-tier architecture diagram. All three tiers are now in Masterbrand Blue (not greyed-out). Top tier: `<initials>-nw-web-01` (Ubuntu 24.04, flavor `d2-2`, nginx) — annotated "deployed 1.3, hardened today". Middle tier: `<initials>-nw-api-01` (Ubuntu 24.04, flavor `d2-2`, nginx via cloud-init) — annotated "deployed today via cloud-init". Bottom tier: `<initials>-nw-db-01` (Ubuntu 24.04, flavor `d2-2`, PostgreSQL 16 via cloud-init) — annotated "deployed today via cloud-init". A single Security Group icon labeled `<initials>-nw-ssh-office` envelops all three: SSH allowed only from the learner's public IP. A snapshot icon `<initials>-nw-web-01-baseline` points to the top tier.
 
**Talking points**:
- End state of the lab: **three running instances**, each on `d2-2` / Ubuntu 24.04, sharing one Security Group that allows SSH only from the learner's office IP
- The **web frontend** has its baseline snapshot — the rollback point if anything goes wrong from here on
- The **API host** and **DB host** are configured at first boot via cloud-init — nginx and PostgreSQL respectively, no manual SSH bootstrap
- **PostgreSQL is self-managed** on this stack — the customer owns the database lifecycle (backup, patching, replication) entirely. This is the **Core** scope.
- The **Managed Databases** product (covered in a separate DBaaS Associate certification) is the alternative for teams that do not want to operate the database themselves — same PostgreSQL engine, different operational contract
- **No public DB exposure**: the PostgreSQL host accepts only SSH from the office IP; PostgreSQL listens on localhost. Database access goes through SSH tunneling or, in production, through a private network (Module 2.3)
**Trainer notes**:
- Souligner que self-managed PostgreSQL sur Core est un choix volontaire pour le programme : c'est ce qui distingue Core (vous opérez) de Managed (OVHcloud opère)
- Anticiper "pourquoi ne pas prendre Managed Databases tout de suite ?" → parce que le persona Core Associate doit savoir opérer la couche IaaS, MKS/MDB sont au-dessus ; les choix produits viendront naturellement en formation Pro
- Si quelqu'un demande "et la backup PostgreSQL ?" → snapshot d'instance n'est pas une backup applicative cohérente, vrai backup = `pg_dump` ou réplication, Module 2.1 traitera Block Storage snapshots, et les backups DB sortent du scope Core
- Rappeler le persona Corporate : cette architecture (3 tiers, SG restrictive, cloud-init) est exactement ce qu'ils retrouvent sur AWS — la transposition mentale doit être instantanée
---
 
### Slide 10: The hardening reflexes — what we just put in place
 
**Visual concept**: A two-column layout. Left column titled "What we did today" with five rows, each with a check icon: SSH key-only auth (no password), no root SSH, SG restricted to office IP, snapshot before changes, cloud-init for repeatable config. Right column titled "What's still ahead" with three rows in grey: private network for inter-tier traffic (Module 2.3), centralized identity & MFA (already partly Module 1.2), OS-level CIS/ANSSI hardening (Pro tier). A footer line: "The Core Associate operator does the infrastructure layer; the OS hardening is the next layer up."
 
**Talking points**:
- The five reflexes installed today are the **infrastructure-layer baseline** for any publicly reachable instance
- **SSH key-only auth, no root SSH**: already there from Module 1.3 — built into the public images
- **SG restricted to office IP**: today's tightening — never `tcp/22 from 0.0.0.0/0` in production
- **Snapshot before changes**: today's rollback discipline — cheap, always worth taking
- **Cloud-init for repeatable config**: today's repeatability — no more "I SSH'd in and configured it by hand"
- The **OS-layer hardening** (CIS benchmark, ANSSI baseline, auditd, fail2ban) is **not in Core Associate scope** — that's a Pro-tier topic, but the operator should know it's the next layer up and that today's setup is the necessary precondition for it
**Trainer notes**:
- Souligner que ces 5 réflexes sont l'attitude A02 réifiée : pas un slogan, des actions concrètes
- Anticiper "et fail2ban ?" → couche OS, hors scope Associate ; on installe la couche infra propre, après quoi fail2ban et CIS deviennent pertinents
- Si quelqu'un demande "et la rotation des clés SSH ?" → process organisationnel (équipe + outillage IAM/secret store), pas une feature OVHcloud spécifique, briève mention de Vault/HCM en culture
- Rappeler le persona Digital Starter : ces 5 réflexes sont aussi pour lui, surtout SG restrictive et snapshot — un freelance compromis perd souvent une mission entière
---
 
## Block 3 — Trainer Demonstration (15 min)
 
### Demo scenario
 
End-to-end OpenStack CLI demo on the `demo-web-01` instance (from Module 1.3 demo). Starting state: instance running on `d2-2` / Ubuntu 24.04 / GRA, default Security Group, reachable from the demo workstation via SSH on its public IP. Ending state: same instance now attached to a tightened `demo-ssh-office` Security Group, a snapshot `demo-web-01-baseline` exists in the project, the instance has been entered via Rescue mode and exited cleanly, and the console log of a second pre-prepared instance (`demo-broken-cloudinit`, intentionally bootstrapped with a malformed user-data file) has been displayed and read aloud. Single channel: OpenStack CLI throughout, Manager UI opened in parallel for snapshot and Rescue (purely visual confirmation that the CLI actions appear in the GUI).
 
### Demo script
 
| Step | Action | Expected output | Trainer commentary |
|---|---|---|---|
| 1 | `openstack token issue` — confirm environment | Token block with future expiration | "Environnement Module 1.2 toujours opérationnel, on enchaîne." |
| 2 | Get the demo workstation's public IP: `curl -s ifconfig.me` | One IPv4 address, e.g. `203.0.113.42` | Souligner : c'est cette IP, et uniquement celle-ci, qu'on va autoriser en SSH. En prod, jamais `0.0.0.0/0`. |
| 3 | Create the SG: `openstack security group create --description "SSH from demo office" demo-ssh-office` | Confirmation block with the SG UUID | Anticiper : "et pourquoi un nouveau SG plutôt qu'éditer le default ?" → discipline, le default reste neutre, on attache un SG explicite. |
| 4 | Add the rule: `openstack security group rule create --proto tcp --dst-port 22 --remote-ip 203.0.113.42/32 demo-ssh-office` | Rule confirmation, ingress, tcp/22 | "Notez le `/32` : un seul IP, pas un range. Si on tape `/24` on ouvre 256 IPs voisines, en général à éviter." |
| 5 | Attach to the instance: `openstack server add security group demo-web-01 demo-ssh-office` | Silent on success | Ouvrir le Manager dans le second onglet, montrer que le SG apparaît attaché à l'instance — confirmation visuelle. |
| 6 | Remove the default SG: `openstack server remove security group demo-web-01 default` | Silent on success | "Maintenant SSH ne passe que depuis cette workstation. Vérifions." |
| 7 | From the demo workstation: `ssh ubuntu@<demo-web-01-public-ip> "uname -a"` | Kernel version line | "Toujours joignable depuis ici — l'IP source matche le `/32` autorisé." |
| 8 | Take a snapshot: `openstack server image create --name demo-web-01-baseline demo-web-01` | Image UUID, status `queued` then `active` after ~30s | Souligner : pendant la création, l'instance peut être brièvement non-réactive si on est en mode "consistent snapshot" — ici on n'arrête pas l'instance, c'est un crash-consistent snapshot. |
| 9 | Verify: `openstack image list --private \| grep baseline` | One line with `demo-web-01-baseline` status `active` | "Le snapshot est une image privée, dans le catalogue d'images du projet — exactement comme une image publique, mais qu'on a fabriquée nous." |
| 10 | Trigger Rescue mode (via Manager UI, pour montrer l'alternative GUI) | Manager: instance state changes to "Rescue", a temporary password is displayed | "Le Rescue se déclenche du Manager ou de l'API ; ici je passe par le Manager pour qu'on voie où ça vit dans l'UI." |
| 11 | SSH into the rescue environment with the temp password | A minimal Linux shell, `lsblk` shows two disks: rescue root + the original root attached as secondary | Souligner : c'est une image Rescue OVHcloud, pas votre Ubuntu. On voit votre disque d'origine en `/dev/sdb`. |
| 12 | `mount /dev/sdb1 /mnt && ls /mnt/etc/ssh/` | Listing of the original instance's `/etc/ssh/` | "On a accès au disque comme à un disque externe. À partir d'ici on corrige : sshd_config, fstab, authorized_keys, ce qu'il faut." |
| 13 | `umount /mnt` and exit Rescue from Manager | Instance reboots into the original image | "Et on sort. L'instance reboot sur son OS d'origine, vos modifications sur le disque sont conservées." |
| 14 | On a separate instance pre-prepared with a broken cloud-init: `openstack console log show demo-broken-cloudinit \| tail -50` | Boot log ending with cloud-init error messages | "Voilà à quoi ressemble un cloud-init qui échoue : on cherche les lignes `cloud-init.*FAIL` ou l'absence du marker `Cloud-init v. X.Y finished`." |
| 15 | Final mention: a 5-line Terraform snippet shown for reference, declaring an `openstack_compute_secgroup_v2` and an `openstack_compute_instance_v2` with `user_data` | (Not executed) | "Tout ce qu'on vient de faire en CLI s'écrit en HCL exactement comme ça. Hands-on en Module 3.1." |
 
### Common demo failure modes
 
- **Step 6 (remove default SG) blocks if the new SG was not actually attached** → verify with `openstack server show demo-web-01 -f value -c security_groups` before removing default; if missing, re-add. Recovery: re-add default temporarily, redo Step 5.
- **Step 7 SSH timeout after SG swap** → almost always means the workstation's public IP differs from what `ifconfig.me` returned (corporate NAT pool rotation, VPN routing). Re-check with `curl ifconfig.me`, update the SG rule.
- **Step 10 Rescue mode stuck in "transitioning"** → wait 2 minutes; if still stuck, refresh the Manager page (cosmetic refresh issue). Real failures are rare in GRA — if it happens, switch to `demo-web-01-backup` (pre-deployed) for the rest of the demo.
- **Step 14 empty console log** → instance never booted on the hypervisor side, support ticket territory. Have a screenshot of a real broken cloud-init log as a fallback.
---
 
## Block 4 — Learner Lab (30 min)
 
### Lab brief (learner-facing)
 
You will bring the Northwind staging stack to production-grade. Starting from the running `<initials>-nw-web-01` (Module 1.3), you will (1) restrict its SSH access to your own workstation's public IP, (2) snapshot it as your baseline, (3) deploy `<initials>-nw-api-01` with cloud-init that installs nginx, (4) deploy `<initials>-nw-db-01` with cloud-init that installs PostgreSQL 16, and (5) read the console log of one of your instances to identify the cloud-init success marker. Success criterion: three reachable instances, two with cloud-init footprint, all behind the same restrictive Security Group, one baseline snapshot in the project.
 
### Lab steps (learner-facing)
 
1. **Get your public IP**: in a terminal, `curl -s ifconfig.me` (or `dig +short myip.opendns.com @resolver1.opendns.com`). Note it. This is your `<my-ip>`.
2. **Create the Security Group**: in the OVHcloud Manager, *Public Cloud → your project → Network → Security Groups → Create*. Name: `<initials>-nw-ssh-office`. Add one ingress rule: protocol TCP, port 22, source `<my-ip>/32`.
3. **Attach to the web frontend, remove the default**: open `<initials>-nw-web-01`, in the Security Groups tab, attach `<initials>-nw-ssh-office`, then remove `default`. Verify SSH still works from your workstation: `ssh ubuntu@<web-public-ip>`.
4. **Snapshot the web frontend**: from the instance page, *Actions → Create snapshot*. Name: `<initials>-nw-web-01-baseline`. Wait for status `Active` in *Images → Snapshots*.
5. **Prepare two cloud-init files** on your workstation. File `nw-api-cloudinit.yaml`:
   ```yaml
   #cloud-config
   package_update: true
   packages:
     - nginx
   write_files:
     - path: /etc/motd
       content: |
         Welcome to Northwind API host.
   runcmd:
     - systemctl enable --now nginx
   ```
   File `nw-db-cloudinit.yaml`:
   ```yaml
   #cloud-config
   package_update: true
   packages:
     - postgresql-16
   write_files:
     - path: /etc/motd
       content: |
         Welcome to Northwind DB host. PostgreSQL listens on localhost only.
   runcmd:
     - systemctl enable --now postgresql
     - sudo -u postgres createdb northwind
   ```
   Save both as `LF` line endings (UTF-8, no BOM).
6. **Deploy `<initials>-nw-api-01`**: Manager → Compute → Instances → Create. Region GRA, image Ubuntu 24.04, flavor `d2-2`, your SSH key, Security Group `<initials>-nw-ssh-office`, **paste the contents of `nw-api-cloudinit.yaml` in the User-data / cloud-init field**. Submit.
7. **Deploy `<initials>-nw-db-01`** the same way, with `nw-db-cloudinit.yaml` as user-data.
8. **Wait for both to reach `ACTIVE`** (~2-3 minutes). SSH into `<initials>-nw-api-01` and confirm: motd shows "Welcome to Northwind API host", `systemctl status nginx` shows `active (running)`.
9. **Verify the DB host**: SSH into `<initials>-nw-db-01`, motd visible, `sudo -u postgres psql -l` lists the `northwind` database.
10. **Read the console log of one instance**: in the Manager, open `<initials>-nw-api-01`, *Console → View console log*, scroll to the bottom, find the line containing `Cloud-init v.` and `finished`. Note the line down — that's the success marker.
### Validation criteria
 
- **Three instances reachable via SSH from your workstation only**: `ssh ubuntu@<web-public-ip>`, same for `<api>` and `<db>`. Bonus check: from your phone hotspot (different public IP), the SSH must fail.
- **Cloud-init footprint visible on api and db**: motd shows the expected line on first SSH; on api, `curl localhost` returns the default nginx welcome page; on db, `sudo -u postgres psql -l` shows the `northwind` database.
- **Snapshot present and active**: in *Images → Snapshots*, `<initials>-nw-web-01-baseline` status `Active`.
- **Console log success marker identified**: you can show the trainer (or note in your worksheet) the line `Cloud-init v. X.Y finished` for at least one of your instances.
### Lab artifacts to produce
 
- A 5-line text note in the learner's worksheet: the four `Active` resource names (one SG, three instances, one snapshot) + the cloud-init success-marker line copied from the console log.
### Common lab support questions
 
- **"My SSH times out on the new instances"** → 90% the time the SG attached on creation is `default`, not `<initials>-nw-ssh-office`. Check the instance's SG, swap if needed. The other 10% is the workstation's public IP changed between Step 1 and Step 8 — re-check with `curl ifconfig.me`.
- **"cloud-init seems not to have run"** → SSH in, `sudo cat /var/log/cloud-init.log | tail -30`. Common causes: YAML indentation (tab instead of space), missing `#cloud-config` first line, CRLF line endings if edited on Windows without conversion.
- **"My PostgreSQL is not running"** → `sudo systemctl status postgresql` — if the cloud-init `runcmd` failed because the package installation took longer than the runcmd race, the service may not be enabled. Manual recovery: `sudo systemctl enable --now postgresql`.
- **"The snapshot is stuck in `Queued`"** → wait 60 seconds, refresh; for a `d2-2` it usually completes in under 90 seconds. If it persists, that's an infra-side delay — not a learner error.
---
 
## Block 5 — Micro-check QCM (5 min)
 
Format: 7 single-answer multiple-choice questions, formative (non-certifying).
 
### Question 1
 
- **Stem**: A learner has just created a Public Cloud instance with the default Security Group. They have not added any custom rule. What ingress traffic reaches the instance from the public Internet?
- **Correct answer**: **C.** None — Security Groups are default-deny on ingress; the default group ships with no allow rules.
- **Distractors**:
  - A. All TCP traffic, because the default group is permissive. — *Why wrong*: the default for any Security Group is default-deny on ingress.
  - B. Only ICMP (ping), to allow basic reachability checks. — *Why wrong*: nothing is allowed by default, including ICMP.
  - D. SSH (TCP/22) only, since cloud providers always allow management access. — *Why wrong*: no rule is added implicitly; the operator must explicitly allow SSH.
- **LO traced**: `LO-CMP-S05`, `LO-CMP-A02`
- **Bloom level**: Understand
### Question 2
 
- **Stem**: When you create an OVHcloud Public Cloud instance with a `user-data` cloud-init file, where does the cloud-init agent **read that file from** at first boot?
- **Correct answer**: **B.** From the cloud's metadata service, exposed at a link-local address inside the instance.
- **Distractors**:
  - A. From a file pre-baked into the OS image at OVHcloud's build time. — *Why wrong*: the user-data is provided per-instance at creation, not baked into the image.
  - C. From an SSH-mounted directory pushed by the OVHcloud control plane after first boot. — *Why wrong*: no SSH push exists; the agent reads metadata, no inbound connection.
  - D. From a parameter passed on the kernel command line at first boot. — *Why wrong*: cloud-init may read kernel cmdline for some flags, but the user-data payload is fetched from the metadata service.
- **LO traced**: `LO-CMP-S06`
- **Bloom level**: Remember
### Question 3
 
- **Stem**: A team takes a snapshot of an instance whose application data sits on an attached Block Storage volume. What does that snapshot actually capture?
- **Correct answer**: **A.** Only the instance's local disk (OS, files written there). The Block Storage volume is not included.
- **Distractors**:
  - B. The local disk and the Block Storage volume, atomically. — *Why wrong*: instance snapshots capture only the local (ephemeral) disk; volumes have their own snapshot mechanism.
  - C. The instance's running memory (RAM) and process state, in addition to the local disk. — *Why wrong*: snapshots are disk-level, not live; RAM is not captured.
  - D. Only the user-data cloud-init file and the SSH key — enough to redeploy. — *Why wrong*: a snapshot is a full disk image, not a deployment recipe.
- **LO traced**: `LO-CMP-S07`, `LO-CMP-A03`
- **Bloom level**: Understand
### Question 4
 
- **Stem**: An operator triggers Rescue mode on a Linux instance that has a broken `sshd_config` blocking SSH. After entering Rescue mode, what is the situation?
- **Correct answer**: **D.** The instance has rebooted into an OVHcloud-maintained rescue image; the operator's original root disk is attached as a **secondary** disk that they can mount to fix the broken file.
- **Distractors**:
  - A. The instance has rebooted into the operator's original OS image with `sshd` disabled, allowing key-based access only via a backdoor. — *Why wrong*: Rescue mode reboots into a different image, not the original.
  - B. The instance is paused; the operator gets a remote desktop into the running OS. — *Why wrong*: no remote desktop; Rescue is SSH into a separate Linux image.
  - C. The instance is recreated from the latest snapshot, losing all changes since that snapshot. — *Why wrong*: Rescue does not destroy or recreate the instance; the original disk is preserved.
- **LO traced**: `LO-CMP-S08`
- **Bloom level**: Understand
### Question 5
 
- **Stem**: An instance status is `ACTIVE` but SSH connections immediately time out. The operator does not know why. Which command gives them the highest-signal first look, without needing SSH or any network reachability to the instance?
- **Correct answer**: **C.** `openstack console log show <instance-name>` — reads the boot console output via the API.
- **Distractors**:
  - A. `ssh -v ubuntu@<instance-public-ip>` with verbose mode — *Why wrong*: still requires the instance's SSH to be reachable; if it's not, verbose mode adds no information.
  - B. `ping <instance-public-ip>` to confirm ICMP reachability — *Why wrong*: ICMP is usually blocked by the SG anyway, and even if it passes, it tells you nothing about what's wrong.
  - D. `openstack server reboot <instance-name>` — *Why wrong*: rebooting may or may not help, and rebooting blindly without reading the log first is poor diagnostic practice.
- **LO traced**: `LO-CMP-S09`
- **Bloom level**: Apply
### Question 6
 
- **Stem**: A developer is designing the deployment of a small log-collection daemon that writes ~1 GB/day to a directory on the instance's local disk. They expect the workload to run for months. What is the right anticipation of the storage choice?
- **Correct answer**: **B.** The local disk is ephemeral — if the instance is deleted, the logs are gone. For any data that must survive instance deletion, plan for a Block Storage volume from the start.
- **Distractors**:
  - A. The local disk is automatically backed up by OVHcloud, so deletion is recoverable. — *Why wrong*: no automatic backup exists; the local disk is destroyed with the instance.
  - C. Once the local disk is more than 80% full, OVHcloud auto-migrates the data to Block Storage. — *Why wrong*: no auto-migration; capacity management is the customer's responsibility.
  - D. The local disk size grows automatically as data accumulates, up to the flavor's hard limit. — *Why wrong*: the local disk size is fixed by the flavor and does not grow without operator action.
- **LO traced**: `LO-CMP-A03`
- **Bloom level**: Apply
### Question 7
 
- **Stem**: A learner has deployed a publicly reachable Linux instance for a customer demo. Among the following choices, which set represents the **baseline hardening reflexes** an operator should apply at the infrastructure layer (regardless of OS-level CIS or ANSSI hardening)?
- **Correct answer**: **A.** SSH key-only auth (no password), no root SSH, Security Group restricted to known source IPs, snapshot before risky changes, cloud-init for repeatable bootstrap.
- **Distractors**:
  - B. fail2ban installed, auditd running, AppArmor profile loaded, SELinux enforcing, SSH on a non-standard port. — *Why wrong*: all valid OS-layer measures, but they are above the infrastructure layer the Core Associate scope addresses — relevant at Pro tier.
  - C. Daily public-IP rotation, weekly instance recreation, randomized SSH port, certificate-pinned `apt`. — *Why wrong*: these are operational anti-patterns at this scale — recreate-by-default is wasteful and certificate-pinned apt is rare in practice.
  - D. Disable all egress traffic, allow ingress only on TCP/22, run sshd as a non-root user, encrypt the local disk at rest. — *Why wrong*: blocking egress breaks `apt update`, sshd cannot run unprivileged, and at-rest encryption is not the entry-point concern.
- **LO traced**: `LO-CMP-A02`
- **Bloom level**: Apply
---
 
## Block 6 — Wrap-up & Transition (5 min)
 
### Recap (1-2 lines)
 
You can now **configure** a Security Group to restrict ingress to a specific source IP and attach it to an instance. You can **inject** a cloud-init file at instance creation to install packages, write files, and run a bootstrap script at first boot. You can **create**, **list**, and **restore-by-redeploy** an instance snapshot. You can **enter** Rescue mode to recover an unreachable instance and fix its root disk. You can **read** the console log to diagnose a boot or cloud-init failure. You can **identify** the baseline hardening reflexes on a publicly exposed instance and **anticipate** the data loss risk associated with ephemeral storage.
 
### Transition to next module via red-thread scenario
 
The Northwind staging stack is now three running, hardened instances behind a restrictive Security Group, two of them bootstrapped automatically. But three things are still missing for the CTO to call this stack ready: the application data still sits on ephemeral local disks (one wrong `terraform destroy` and PostgreSQL is gone), the three hosts talk to each other over their public IPs (which is both costly and exposes inter-tier traffic to the Internet), and there is no place to drop the build artifacts that the API host serves. *"Tomorrow morning,"* the CTO says, *"I want the database on a real volume, I want the three hosts on a private network, and I want our build artifacts in Object Storage so the API can fetch them without bundling them into the image."* That's the rest of Day 2 — Storage & Networking, starting with Module 2.1: Block Storage volumes.
 
---
 
## Trainer FAQ (anticipated questions for this module)
 
**Q: Why do Security Groups have no DENY rules? My on-prem firewall team builds entire policies around explicit denies.**
A: Cloud Security Groups are intentionally constrained to ALLOW-only because the default is DENY — so any rule you add is an exception, and the rule set stays small and auditable. Network ACLs (which do exist on some hyperscalers, e.g., AWS NACL) cover the explicit-DENY use case at the subnet level, but Core OVHcloud does not expose this primitive in the Public Cloud catalog. The pragmatic answer for the ex-on-prem team: use IAM scoping, private networks (Module 2.3), and Security Group composition to model "this tier talks to that tier, nothing else." Explicit DENYs in a stateless ACL layer are rarely the right tool at cloud scale.
 
**Q: Cloud-init runs only at first boot — what if I want to apply a config change on the 50 already-running instances?**
A: That's the boundary where cloud-init ends and configuration management begins (Ansible, Salt, Puppet). Cloud-init's job is to take an instance from "blank image" to "minimal viable host" — once. Anything that needs to evolve over time, or apply uniformly across an existing fleet, belongs in a config-management tool that pushes (or pulls) changes on schedule. Trying to repurpose cloud-init for ongoing configuration is a well-known anti-pattern; the result is a YAML file that nobody dares change because it only runs at re-creation. Operationally: cloud-init for bootstrap, Ansible for steady state.
 
**Q: Are snapshots a backup? Can I rely on them for disaster recovery?**
A: A snapshot is **not a backup** in the disaster-recovery sense. It is a private image stored in the same project, in the same region, that captures the local disk at a point in time without application-level consistency (a running database is captured mid-flight). For a true backup you need: (1) application-consistent dumps (`pg_dump`, `mysqldump`, application-quiesce-then-snapshot), (2) storage in a separate failure domain — typically Object Storage in a different region, (3) restore tests on a schedule. Snapshots are an excellent **fast rollback** tool ("before I touch this"), and a building block in a backup strategy, but they are not the strategy by themselves.
 
**Q: When I take a snapshot, my instance hangs for 5-10 seconds. Is that normal? Can I avoid it?**
A: It depends on the size of the local disk and the IO activity at the moment of snapshot. For a small Discovery (`d2`) instance with idle IO, the visible interruption is sub-second. For an `i1` instance under heavy write load, it can be longer. There is no zero-impact snapshot in this model — even Block Storage volume snapshots have a brief IO quiesce. Mitigation patterns: take snapshots during low-traffic windows, or for stateful services (databases) move the data onto Block Storage and snapshot the volume separately, with the application briefly quiesced.
 
**Q: My Rescue mode session shows a different password each time. Is there a way to keep it the same, or use my SSH key?**
A: No — the Rescue mode temporary password is regenerated at each activation, and it does not accept SSH keys (the rescue image is minimal). This is by design: Rescue is a one-shot recovery channel, not a permanent administrative back door. The temporary password is displayed only in the Manager (or the API response that triggered Rescue), and it only works during that Rescue session. If you need a permanent emergency access mechanism, that's an architectural concern — a bastion host with hardened access, an out-of-band management network, or for the very high end, a separate dedicated VPN. None of those are in the Core Associate scope.
 
**Q: The console log shows "system halted" with no further detail. What do I do next?**
A: That's a sign the kernel panicked or the initrd failed to mount the root filesystem — both indicate a deeper issue, often a recent `apt full-upgrade` that broke the boot chain or a malformed `/etc/fstab`. The right next step: Rescue mode, mount the original root disk as secondary, inspect `/etc/fstab` and `/boot/grub/grub.cfg`, check `journalctl --boot=-1` from the rescue environment by chrooting into the original root, fix, exit Rescue. If the issue is unclear, taking a snapshot of the broken state before any change is wise — it lets you experiment without losing the evidence.
 
**Q: Can I share a cloud-init file with secrets in it (DB passwords, API tokens) — is the user-data encrypted at rest?**
A: The user-data is stored by the cloud and made available to the instance via the metadata service — which is reachable from any process on the instance. Anyone with shell access to the instance can read it via `curl http://169.254.169.254/...`. Treat user-data as **non-confidential**: never put secrets directly in cloud-init. The right pattern is to inject a minimal bootstrap that fetches secrets from a secret store (HashiCorp Vault, OVHcloud Secret Manager when available, encrypted Object Storage with IAM-restricted access) at first boot. For the Core Associate scope, the simplest acceptable pattern is: cloud-init creates the OS user and SSH key, and the engineer SSHes in once to drop the production secrets manually. Anything more advanced is a Pro-tier topic.
