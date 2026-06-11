# Module 2.3 — Network (Part 1) — Public, Private & Security Groups
 
## Module Brief
 
- **Module ID**: 2.3
- **Total duration**: 1h30
- **Block breakdown**: Sentier battu 5 min · Theory 30 min · Demo 15 min · Lab 30 min · Micro-check 5 min · Wrap-up 5 min
- **Program**: OVHcloud — Public Cloud — Core Associate
- **Domain covered**: 05 — Network (Part 1 of 2)
- **LOs covered** (6 total):
  - Knowledge: `LO-NET-K01`, `LO-NET-K02`
  - Skills: `LO-NET-S01`, `LO-NET-S02`, `LO-NET-S03`, `LO-NET-S04`
- **Prerequisite modules**: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2 (mandatory in sequence; standalone delivery requires a running Public Cloud project in GRA with at least two instances reachable via SSH and the learner's `openrc.sh` ready).
- **Red-thread step**: The Northwind staging stack is durable (output of Modules 2.1 and 2.2) but networking-wise it is still wide open: each of the three instances (`<initials>-nw-web-01`, `<initials>-nw-api-01`, `<initials>-nw-db-01`) carries its own public IP, no isolation exists between tiers, and the PostgreSQL database is reachable from the public Internet on TCP/5432 as long as the credentials are right. Today the learner (1) creates a private network `<initials>-nw-private` with a DHCP-enabled subnet inside the Public Cloud project, (2) attaches API and DB to that private network as a second NIC, (3) writes Security Groups that match the tier model (web exposes 80/443, API exposes 8080 only to web, DB exposes 5432 only to API, SSH restricted to the trainer's IP), and (4) detaches a **Floating IP** from one of the legacy public IPs and re-attaches it deliberately to the web tier. The learner leaves with Northwind's three tiers split between a publicly reachable web frontend and a privately reachable application+database core, with least-privilege ingress in place. The public IPs of API and DB are still present at the end of this module — their removal waits for the **Gateway** introduced in Module 2.4.
### Pedagogical angle
 
This is the *"plumbing"* module of the network domain. Module 2.4 will introduce the higher-order constructs (vRack for cross-product L2, Gateway for outbound from private-only instances, Load Balancer for horizontal scaling, Anti-DDoS). Module 2.3 stays at the level a Day-2 operator needs to be sure of before they touch any of those: **what is the Ext-Net, what is a private network in Neutron terms, what is a Security Group, what is a Floating IP, and how do these four objects compose to produce a tiered network topology**.
 
The legacy-IT analogy is direct and reusable throughout the module: the Ext-Net is the **DMZ uplink** of a legacy datacenter, the private network is a **VLAN** inside the same datacenter, the Security Group is a **stateful firewall ruleset** attached to the VM (closer to a Windows host firewall than to a perimeter firewall), the Floating IP is the **virtual IP** of a load-balanced service that you can move from one server to another without changing DNS. Persona Corporate (often ex-AWS, but with strong legacy-IT muscle memory) anchors faster on the legacy analogy than on the AWS analogy in this module.
 
The single most important slide of the module is **slide 7** — Security Group default-deny semantics. Persona Corporate frequently expects a stateless ACL model ("inbound rule for 443, outbound rule for the return packets"), which is Network ACL semantics. Security Groups are **stateful**, and the default rule set is "deny all ingress, allow all egress" (Neutron baseline). The learner who internalizes this slide will design correct ingress rules by reflex in the lab.
 
A second subtle but high-leverage point is **slide 9** — Floating IP vs Additional IP. These are two distinct OVHcloud Public Cloud objects with different lifecycles. Floating IP is a Neutron object inside the project, automatically billed inside the project, decoupled from the instance lifecycle. Additional IP is a separate OVHcloud product, ordered outside the project context, with a different billing model. For Northwind, the right tool is Floating IP (mentioned only — Additional IP is out of scope for this module). Anticipating the confusion preempts 5 minutes of unfocused discussion later.
 
### Trainer demonstration
 
15-minute end-to-end OpenStack CLI demo on the running `demo-api-01` and `demo-web-01` instances from Module 1.4: the trainer (1) creates a private network `demo-private` with a `192.168.10.0/24` DHCP-enabled subnet via `openstack network create` + `openstack subnet create`, (2) attaches the network as a second NIC on both instances via `openstack server add network`, brings the new interface up inside the instance, verifies private-to-private ping between the two instances, (3) creates a Security Group `demo-web-sg` allowing ingress 22/tcp from the trainer's IP and 80/tcp from anywhere, applies it to `demo-web-01`, demonstrates that the default web port is now reachable from outside and that ICMP is silently dropped (default-deny in action), (4) creates a Floating IP via `openstack floating ip create Ext-Net`, attaches it to `demo-web-01` as a second public IP, and shows that traffic on the Floating IP reaches the web service. The Gateway concept is introduced verbally as the missing piece for outbound-from-private-only instances but is not demoed — it belongs to Module 2.4.
 
### Learner lab
 
*Split Northwind into a public tier and a private tier, with least-privilege Security Groups and a Floating IP on the web frontend* (30 min). Each learner: (1) creates a private network `<initials>-nw-private` with a `10.50.0.0/24` DHCP-enabled subnet in GRA, (2) attaches the private network as a second NIC on `<initials>-nw-api-01` and `<initials>-nw-db-01`, brings the `ens4` (or equivalent) interface up via `dhclient` or netplan, verifies via `ping` that API and DB now reach each other on their `10.50.0.x` private IPs, (3) creates three Security Groups — `<initials>-nw-web-sg` (allow 22/tcp from the trainer-provided source IP, 80/tcp and 443/tcp from anywhere), `<initials>-nw-api-sg` (allow 22/tcp from the trainer IP, 8080/tcp only from `<initials>-nw-web-sg`), `<initials>-nw-db-sg` (allow 22/tcp from the trainer IP, 5432/tcp only from `<initials>-nw-api-sg`) — applies each to its respective instance, (4) creates a Floating IP via `openstack floating ip create Ext-Net --tag northwind-web`, associates it with the web instance's private-network port, and confirms that the new Floating IP reaches the running web service. Validation: `<initials>-nw-api-01` pings `<initials>-nw-db-01` on its `10.50.0.x` IP; `curl` from web to API on `8080/tcp` succeeds, `curl` from web to DB on `5432/tcp` fails (closed by SG); the Floating IP reaches the web service from the learner's laptop; the default ICMP ping to API and DB from the public Internet is silently dropped.
 
### Micro-check — question intents (drafted in Block 5)
 
1. Ext-Net vs private network — Remember — `K01`
2. Neutron object identification (network / subnet / port / router / security group / floating IP) — Understand — `K02`
3. Private subnet creation — Apply — `S01`
4. Dual-NIC configuration semantics — Apply — `S02`
5. Security Group default behavior — Understand — `K02` / `S03`
6. Security Group composition — Apply — `S03`
7. Floating IP lifecycle — Apply — `S04`
### Trainer FAQ — anticipated topics (drafted in Block 8)
 
Difference between Ext-Net and a vRack (vRack belongs to 2.4 — preempt the confusion), Security Group stateful vs Network ACL stateless, what "default deny ingress / default allow egress" means in practice, why a private network needs DHCP enabled at creation time, how Neutron port objects relate to NICs inside the instance, can a Security Group be applied to a port or only to an instance, Floating IP vs Additional IP product positioning, what happens to a Floating IP when the source instance is deleted, why the API and DB tiers still have a public IP at the end of this module (the Gateway answer waits for 2.4), MAC/IP spoofing prevention in Neutron and when it bites the learner.
 
---
 
## Block 1 — Sentier battu / Hors piste (5 min)
 
### Sentier battu (assumed prerequisites)
 
**Tools:**
- The three Northwind staging instances from previous modules (`<initials>-nw-web-01`, `<initials>-nw-api-01`, `<initials>-nw-db-01`) running and SSH-reachable on their existing public IPs.
- The `openrc.sh` from Module 1.2, sourced and scoped to GRA.
- A running web service on `<initials>-nw-web-01` (the simple `nginx` serving on port 80 from Module 1.3 is sufficient) and a running PostgreSQL on `<initials>-nw-db-01` (output of Module 2.2).
- A running placeholder API service on `<initials>-nw-api-01` listening on `8080/tcp` (a single-line `python3 -m http.server 8080` is enough for the lab — provided as a one-liner in the lab handout).
- The learner's laptop public IP available (announced verbally by the trainer, or self-checked via `curl ifconfig.me`).
**Knowledge:**
- The default network situation of a Public Cloud Instance from Module 1.3: one public IP, one Security Group (default), basic SSH ingress.
- Linux network basics: an interface comes up via `ip link set ... up`, an IP is obtained via DHCP or static, `ip addr` shows what is bound, `ping` and `curl` are the diagnostic primitives.
- The notion of a stateful firewall from legacy IT: connection tracking, return packets are auto-permitted.
- Basic TCP port awareness: 22 SSH, 80 HTTP, 443 HTTPS, 8080 alt-HTTP, 5432 PostgreSQL.
- The persona-Corporate analogies from Module 1.1: VLAN, DMZ, firewall ruleset, VIP — they map directly to today's objects.
### Hors piste (remediation pointers for gaps)
 
- **No public IP visible on the existing instances** → check `openstack server show <name>`; if the instance was deployed without `Ext-Net` (which is the default), re-attach by `openstack server add network <name> Ext-Net` and reboot. This is unusual for a standard Module 1.3 deployment.
- **No running web service on the web instance** → `sudo apt install -y nginx && sudo systemctl enable --now nginx` and confirm with `curl http://localhost`. The default Ubuntu nginx welcome page is sufficient.
- **No placeholder API on the API instance** → `python3 -m http.server 8080 &` inside a `tmux` session is enough for the lab. Real API code is not required; the learner only needs a TCP listener.
- **Forgotten difference between stateful and stateless firewall** → preempt in the Sentier battu itself: "stateful = you write the inbound rule, the return packets are remembered automatically; stateless = you must write both directions explicitly. Security Groups are stateful." If left until slide 7, it costs 5 minutes of "but where is the egress rule for the response" questions.
- **Confusion vRack vs private network** → flag explicitly at the entry: "vRack is a different topic, Module 2.4. Today we stay inside one Public Cloud project, one region, one set of Neutron objects."
---
 
## Block 2 — Theory & Concepts (30 min)
 
### Slide 1: Where we left off, what we tackle today
 
**Visual concept**: A diagram of the three Northwind tiers stacked vertically (web, API, DB), each with a public IP icon, all three connected directly to a cloud labelled "Internet". Three red question marks point at the diagram: "Why does the DB sit on a public IP?" "Why can my laptop SSH directly into the DB?" "How do we make web public and API+DB private?". A banner below: "Module 2.2 made the data durable. Module 2.3 makes the network sane."
 
**Talking points**:
- Today's starting point: three instances, three public IPs, zero isolation
- The default network configuration of a Public Cloud Instance is a single public NIC on Ext-Net
- We split tiers today; we close the loose ends in Module 2.4 (vRack, Gateway, Load Balancer)
- Six LOs covered: 2 knowledge, 4 skills — the plumbing of the network domain
**Trainer notes**:
- Souligner que la situation de départ est volontairement laxiste, c'est le défaut Public Cloud
- Demander: "qui exposerait sa base PostgreSQL sur une IP publique en prod ?" — laisser le silence faire la pédagogie
- Rappeler le persona Corporate ex-AWS: "VPC par défaut sur AWS aussi, mais l'inertie pousse à default-VPC partout"
- Anticiper la question vRack: "on en parle demain matin, aujourd'hui on reste dans un projet, une région, Neutron"
---
 
### Slide 2: The two network worlds — Ext-Net vs private network
 
**Visual concept**: A two-column comparison strip. Left column "Ext-Net (public)" — globe icon, label "OpenStack provider network", attributes: shared across all projects in the region, routable Internet IPs, one per instance by default, billed via instance bandwidth. Right column "Private network" — VLAN icon, label "OpenStack tenant network", attributes: created by you inside your project, RFC1918 IPs (10/8, 172.16/12, 192.168/16), invisible from outside the project, no per-IP cost. A central arrow labelled "instance can attach to one, the other, or both".
 
**Talking points**:
- Ext-Net = the public uplink, shared infrastructure, one per region (`Ext-Net` in GRA, BHS, …)
- Private network = your own L2 segment inside your project, RFC1918 IP space, billed only via instance
- An instance can be on Ext-Net only (public), private only (no Internet without a Gateway — Module 2.4), or both (dual-NIC, today's topology)
- Legacy analogy: Ext-Net is the DMZ uplink, private network is an internal VLAN
**Trainer notes**:
- Souligner: deux objets totalement distincts, l'un partagé entre projets, l'autre privé au projet
- Anticiper la question AWS: "Ext-Net ressemble au default VPC ? Non, Ext-Net est un provider network OpenStack partagé, pas un VPC isolé"
- Si quelqu'un demande "et un projet = un VPC ?" → répondre: oui, c'est l'analogie utile, mais le mécanisme OpenStack est différent
- Rappeler que le dual-NIC est la topologie qu'on construit aujourd'hui, c'est l'étape avant la Gateway
---
 
### Slide 3: Neutron — the OpenStack networking service
 
**Visual concept**: A central box labelled "Neutron" with six object-icons branching out: `network`, `subnet`, `port`, `router`, `security group`, `floating IP`. Each icon has a one-line description below. A second band shows the OpenStack CLI noun for each (`openstack network`, `openstack subnet`, …). At the bottom, a small grey reminder: "OVHcloud Public Cloud is OpenStack-native — every object you see in the Manager is a Neutron object underneath."
 
**Talking points**:
- Neutron is the OpenStack networking service — the source of truth for every network object
- Six core objects: **network** (the L2 segment), **subnet** (the L3 layer with CIDR + DHCP), **port** (the virtual NIC), **router** (the L3 routing object — not used today, comes back in 2.4), **security group** (the stateful firewall), **floating IP** (the NAT object for public exposure)
- The Manager UI exposes a curated subset; the CLI exposes everything
- Cross-reference: AWS VPC concepts map roughly — VPC = network + subnet + router, AWS Security Group = Neutron Security Group (almost identical semantics), AWS Elastic IP = Floating IP
**Trainer notes**:
- Souligner que les 6 objets sont le vocabulaire commun pour les deux modules (2.3 et 2.4)
- Demander: "qui a déjà touché à Neutron en CLI directement ?" — calibre le niveau d'aisance
- Anticiper: "et le router, on l'utilise quand ?" → répondre: pour le Gateway en 2.4, aujourd'hui les routes sortantes des instances dual-NIC passent par leur NIC publique
- Si question sur Manila / Cinder ne pas digresser, rester sur Neutron
---
 
### Slide 4: From network to instance — the port object
 
**Visual concept**: A flow diagram left-to-right. Box 1: `network` (a horizontal blue bar labelled `nw-private 10.50.0.0/24`). Box 2: `subnet` (a stacked range showing `10.50.0.10–10.50.0.254` with a small DHCP icon). Box 3: `port` (a small connector icon with MAC + IP attributes: `fa:16:3e:xx:xx:xx / 10.50.0.42`). Box 4: `instance NIC` (the actual `ens4` interface inside the VM). Arrows show the lineage: network → subnet → port → NIC. A side box: "One NIC = one port = one IP per subnet."
 
**Talking points**:
- A port is the virtual NIC managed by Neutron — it carries the MAC, the IP, the Security Group binding
- When you attach an instance to a network, Neutron creates a port and binds it to the instance's hypervisor-side NIC
- A port lives even if the instance is stopped — that's why a Floating IP can survive an instance reboot
- The DHCP server is part of the subnet; the IP allocation happens on port creation, not on instance boot
**Trainer notes**:
- Souligner que le port est l'objet qui survit aux redémarrages d'instance — c'est la clé de la portabilité de la Floating IP
- Anticiper la question: "qui assigne l'IP ?" → réponse: le port reçoit l'IP de Neutron à sa création, le DHCP la communique à l'instance au boot
- Rappeler l'analogie legacy: le port Neutron = l'entrée vNIC dans vCenter, attachée à un VLAN, avec une MAC réservée même si la VM est éteinte
- Si question "et si je veux une IP statique côté Linux ?" → répondre: possible mais inutile, l'IP est déjà fixe côté Neutron via le port
---
 
### Slide 5: Creating a private network — the three commands
 
**Visual concept**: A three-step vertical flow with the exact OpenStack CLI commands as small code boxes. Step 1 — `openstack network create nw-private` (a box labelled "L2 segment"). Step 2 — `openstack subnet create --network nw-private --subnet-range 10.50.0.0/24 --dhcp sn-private` (a box labelled "L3 + DHCP"). Step 3 — `openstack server add network <instance> nw-private` (a box labelled "attach NIC"). A side callout: "DHCP must be enabled at subnet creation time. Adding it later requires recreating the subnet."
 
**Talking points**:
- Three commands minimum to go from nothing to a usable private network
- `network create` — the L2 segment, just an empty bag
- `subnet create` with `--dhcp` — adds the L3 layer, the CIDR, and the DHCP server. **Critical: enable DHCP at creation.**
- `server add network` — attaches the instance, Neutron creates the port automatically
- Inside the instance: `dhclient ens4` (Ubuntu) or `nmcli` to pick up the new IP
**Trainer notes**:
- Souligner que `--dhcp` est facile à oublier et difficile à corriger après coup
- Anticiper "et si j'oublie le DHCP ?" → réponse: il faut supprimer et recréer le subnet, ce n'est pas modifiable
- Si question "pourquoi pas la Manager UI ?" → répondre: la Manager fait les trois étapes en une, mais en lab on garde le CLI pour la traçabilité pédagogique
- Vérifier qu'on a bien dit "le `ens4` peut s'appeler `eth1`, `ens4`, `enp0s4` selon l'image — vérifier avec `ip link`"
---
 
### Slide 6: Dual-NIC — an instance on both worlds
 
**Visual concept**: A two-instance diagram. Instance "web" has two NICs: `ens3` connected to Ext-Net (public IP `51.x.x.x`), `ens4` connected to the private network (`10.50.0.10`). Instance "api" has the same pattern (public IP, `10.50.0.20`). A dotted bidirectional arrow between the two `ens4` interfaces labelled "private L2 reachable". A small caption: "Until Module 2.4, every tier still has a public NIC for outbound apt/yum. The Gateway will retire those."
 
**Talking points**:
- Dual-NIC = one Ext-Net NIC (for inbound from Internet + outbound for package updates) + one private NIC (for inter-tier traffic)
- The two NICs are independent: separate routes, separate Security Groups potentially
- Today's topology is dual-NIC for all three tiers — pragmatic, not yet ideal
- Module 2.4 will introduce the Gateway, which lets private-only instances reach the Internet outbound without a public NIC
**Trainer notes**:
- Souligner que dual-NIC n'est pas la cible finale — c'est l'étape avant le Gateway
- Anticiper "pourquoi pas tout en privé tout de suite ?" → répondre: sans Gateway, l'instance privée ne peut pas faire `apt update`, donc on garde l'IP publique pour ce module
- Rappeler le persona Corporate: en legacy, un serveur applicatif a souvent deux pattes — frontend VLAN et backend VLAN. Le concept est identique.
- Si quelqu'un parle d'IP forwarding entre les deux NICs: hors scope, on ne fait pas du routage dans l'instance ici
---
 
### Slide 7: Security Group — default-deny ingress, stateful
 
**Visual concept**: A large box labelled "Security Group" with four sections. Top section: "Default ingress = DENY ALL." Second section: "Default egress = ALLOW ALL." Third section: "Stateful — return packets are auto-permitted (no need to write an egress rule for SSH replies)." Bottom section: a sample rule table with 3 rules (allow 22/tcp from `<laptop IP>`, allow 80/tcp from anywhere, allow 443/tcp from anywhere). A red banner: "If you can't reach the service, **check the Security Group first**."
 
**Talking points**:
- Default behavior: deny everything inbound, allow everything outbound
- Stateful: write only the ingress rule, the return packet is tracked automatically
- A Security Group is applied **per port** (per NIC of an instance) — not "per instance" strictly
- Multiple Security Groups can be applied to the same port; rules are **additive** (OR logic, never subtractive)
- Cross-reference: AWS Security Group has identical semantics. Azure NSG is closer but slightly different (5-tuple rules, priority-based).
**Trainer notes**:
- **Slide la plus importante du module — ralentir, articuler**
- Souligner: "stateful" + "default deny" + "additive" — les trois mots à retenir
- Anticiper la résistance: "où est la règle pour le retour ?" → répondre: c'est le sens de "stateful", le retour est suivi
- Demander: "si j'applique deux Security Groups, et que l'un autorise 22 et l'autre non, qu'est-ce qui se passe ?" → réponse: 22 est autorisé, les règles sont additives
- Si question Network ACL AWS: ACL = stateless, SG = stateful, ne pas mélanger
---
 
### Slide 8: Security Groups composition — the tier model
 
**Visual concept**: A three-tier diagram. Top tier "web" with `web-sg`: ingress 22/tcp from `<laptop IP>`, ingress 80/tcp + 443/tcp from `0.0.0.0/0`. Middle tier "api" with `api-sg`: ingress 22/tcp from `<laptop IP>`, ingress 8080/tcp **only from members of `web-sg`**. Bottom tier "db" with `db-sg`: ingress 22/tcp from `<laptop IP>`, ingress 5432/tcp **only from members of `api-sg`**. Arrows show the allowed traffic paths in green, default-denied paths in red dotted.
 
**Talking points**:
- Tiered Security Groups = the architectural pattern of the lab
- Source can be a CIDR (`0.0.0.0/0`, a specific IP) **or another Security Group** — the latter is the cleaner pattern
- Web tier exposes to the world; API only to web; DB only to API
- This composes least-privilege ingress by default
- Cross-reference: identical to AWS SG composition with SG-as-source
**Trainer notes**:
- Souligner que la source `<security_group_id>` est l'astuce qui rend la composition propre
- Anticiper "pourquoi pas une CIDR fixe ?" → répondre: parce que les IP privées changent à la création de l'instance, la SG-as-source est stable
- Demander: "et si l'instance API a deux NICs ?" → réponse: le SG s'applique au port, pas à l'instance, donc on peut différencier
- Rappeler `LO-NET-A02` (anticipé en 2.4): le réflexe least-privilege se forme ici
---
 
### Slide 9: Floating IP — the movable public address
 
**Visual concept**: A before/after diagram. Before: two instances, each with its own permanent public IP, the IP is tied to the instance. After: same two instances, the second one has a "Floating IP" badge that can be detached and re-attached to the first instance with one command. A side table comparing Floating IP vs Additional IP across three lines: **What it is** (Neutron object inside the project / separate OVHcloud product), **Lifecycle** (lives in the project, deleted with the project / ordered separately, billed separately), **Use case** (failover / VIP / web frontend / dedicated public address on a Bare Metal too).
 
**Talking points**:
- Floating IP = a public IPv4 that can be moved between instances without changing DNS
- Created as a Neutron object: `openstack floating ip create Ext-Net`
- Associated with a port: `openstack floating ip set --port <port> <fip>`
- Detached and re-attached in seconds — the failover primitive
- **Not the same as Additional IP** — Additional IP is an OVHcloud product outside the Public Cloud project context. For Public Cloud, use Floating IP.
**Trainer notes**:
- Souligner la différence Floating IP / Additional IP — c'est le piège #2 du module
- Demander: "qui a déjà fait un failover en bougeant un VIP entre deux serveurs ?" — l'analogie legacy est immédiate
- Anticiper "et si je supprime l'instance, la Floating IP survit ?" → réponse: oui, c'est un objet projet, pas un objet instance
- Si question sur le coût: la Floating IP est facturée à l'heure tant qu'elle existe dans le projet, même non attachée
---
 
### Slide 10: Hyperscaler cross-reference
 
**Visual concept**: A two-row mapping table. Header row: "OVHcloud Public Cloud" | "AWS" | "Azure". Rows: **Ext-Net** | Default VPC public subnet | Public IP / Default VNet, **Private network** | VPC private subnet | Virtual Network (VNet), **Security Group** | Security Group (same semantics) | Network Security Group (NSG, similar but priority-based), **Floating IP** | Elastic IP | Public IP resource. A small grey reminder: "Same primitives across hyperscalers — semantics are nearly identical for the four objects covered today."
 
**Talking points**:
- Same four primitives across the three providers
- Security Group semantics are almost identical AWS ↔ OVHcloud
- Azure NSG adds rule priorities — minor difference at the Associate scope
- Elastic IP and Floating IP behave identically
- The cross-reference exists to anchor the ex-AWS / ex-Azure profile, not to suggest equivalence in all cases
**Trainer notes**:
- Souligner que ce slide ferme le bloc Theory — ancrage pour les profils Corporate
- Anticiper "Azure NSG c'est plus puissant ?" → répondre: priorités explicites oui, mais le besoin est rare à ce niveau
- Si question sur AWS NACL: hors scope, on ne fait pas de stateless ACL en Public Cloud Core
- Rappeler que ce n'est pas un classement, c'est une cartographie
---
 
## Block 3 — Trainer Demonstration (15 min)
 
### Demo scenario
 
Starting from the two `demo-web-01` and `demo-api-01` instances (Module 1.4 output, each with a single public NIC on Ext-Net), build the dual-NIC topology, demonstrate Security Group composition, and attach a Floating IP. Channel: **OpenStack CLI** for all Neutron operations, **SSH inside the instance** for interface verification, **curl from the trainer's laptop** for end-to-end validation. The PostgreSQL tier is omitted from the demo (covered in the lab) — the demo focuses on the web ↔ API interaction.
 
### Demo script
 
| Step | Action | Expected output | Trainer commentary |
|---|---|---|---|
| 1 | `openstack network create demo-private` | Network created, status `ACTIVE` | "An empty L2 segment — nothing usable yet, no IP plan." |
| 2 | `openstack subnet create --network demo-private --subnet-range 192.168.10.0/24 --dhcp demo-subnet` | Subnet created, allocation pool shown | "Now it has a CIDR and a DHCP server — usable." |
| 3 | `openstack server add network demo-web-01 demo-private` | Server updates, second NIC appears in `openstack server show` | "Neutron created the port and bound it; the VM still needs to bring it up." |
| 4 | SSH into `demo-web-01`, `sudo dhclient ens4 && ip addr show ens4` | `ens4` shows a `192.168.10.x` address | "The DHCP we enabled in step 2 hands the IP. If we'd forgotten `--dhcp`, this hangs forever." |
| 5 | Repeat steps 3–4 for `demo-api-01` (second NIC + `dhclient`) | `demo-api-01` has both a public IP and `192.168.10.y` | "Both instances now have one foot in the private LAN." |
| 6 | From `demo-web-01`, `ping 192.168.10.y` (the API's private IP) | Replies received | "Private L2 reachable — default Security Group lets ICMP between same-SG instances." |
| 7 | `openstack security group create demo-web-sg --description 'web tier'` then `openstack security group rule create --proto tcp --dst-port 80 --remote-ip 0.0.0.0/0 demo-web-sg` and same for `--dst-port 22 --remote-ip <trainer-ip>/32` | Two rules created | "Default deny — we open only what we need. Note the `--remote-ip` for SSH restriction." |
| 8 | `openstack server add security group demo-web-01 demo-web-sg` then remove the `default` SG with `openstack server remove security group demo-web-01 default` | `demo-web-01` carries only `demo-web-sg` | "Now this instance is locked down to web + restricted SSH." |
| 9 | From the trainer's laptop, `curl http://<demo-web-01-public-ip>` | nginx default page returns | "Port 80 reachable as expected." |
| 10 | From the trainer's laptop, `ping <demo-web-01-public-ip>` | Silent timeout (no reply) | "ICMP is dropped — default-deny in action, we never added an ICMP rule." |
| 11 | `openstack floating ip create Ext-Net --tag demo-northwind-web` | Floating IP `51.x.x.x` returned | "A new public IPv4, sitting in the project, not yet attached." |
| 12 | `openstack server add floating ip demo-web-01 51.x.x.x` | Floating IP associated with the instance | "Now the web instance answers on two public IPs — its native one and this Floating IP." |
| 13 | From the trainer's laptop, `curl http://51.x.x.x` | nginx default page returns | "Same service, second public entry point. If we needed to move it to another instance, one CLI command." |
 
### Common demo failure modes
 
- **`dhclient ens4` returns no lease** → cause: forgot `--dhcp` at subnet creation, or the subnet was created without an allocation pool → recovery: `openstack subnet show demo-subnet` and check `enable_dhcp: True`. If false, the only fix is delete and recreate the subnet (and re-attach the instances). This is the single most common demo failure.
- **Second NIC not visible inside the instance** → cause: the NIC name is not `ens4` but `enp0s4` or `eth1` depending on the OS/image → recovery: `ip link show` lists all interfaces; `dhclient <correct-name>` resolves it.
- **`curl` to the public IP times out after Security Group swap** → cause: removed the `default` SG before adding the new one, leaving the instance with **zero** Security Groups, which on some Neutron versions blocks everything → recovery: add `demo-web-sg` first, then remove `default`. Order matters.
- **Floating IP association fails with "no port found"** → cause: the instance has multiple ports (dual-NIC) and the command can't pick one → recovery: pass `--fixed-ip-address <private-ip>` to specify the target port explicitly, or pass `--port <port-id>`.
---
 
## Block 4 — Learner Lab (30 min)
 
### Lab brief (learner-facing)
 
Split Northwind into a public tier (`<initials>-nw-web-01`) and a private tier (`<initials>-nw-api-01`, `<initials>-nw-db-01`) on a dedicated private network, write tiered Security Groups that enforce least-privilege ingress, and attach a Floating IP to the web frontend. Channels: OpenStack CLI for all network and SG operations, SSH for interface bring-up and validation, `curl` and `ping` for end-to-end checks. End state: API and DB reach each other privately on `10.50.0.x`, web reaches API on `8080/tcp` via the private network, DB rejects connections from anywhere except API, the Floating IP serves the web tier, and ICMP from the public Internet is silently dropped on all three tiers.
 
### Lab steps (learner-facing)
 
1. Create a private network `<initials>-nw-private` and a DHCP-enabled subnet `<initials>-nw-subnet` with CIDR `10.50.0.0/24` in the GRA region. Confirm via `openstack subnet show` that DHCP is enabled.
2. Attach the private network to `<initials>-nw-api-01` and `<initials>-nw-db-01` via `openstack server add network`. SSH into each, run `sudo dhclient ens4` (or the appropriate interface name), and confirm with `ip addr` that each has an IP in `10.50.0.0/24`. Note the two private IPs.
3. From `<initials>-nw-api-01`, `ping <db-private-ip>` and confirm replies. This validates the private L2 reachability.
4. Create three Security Groups: `<initials>-nw-web-sg`, `<initials>-nw-api-sg`, `<initials>-nw-db-sg`. Add the following rules (the trainer announces the source IP for SSH at the start of the lab):
   - **web-sg**: `22/tcp` from `<trainer-IP>/32`, `80/tcp` from `0.0.0.0/0`, `443/tcp` from `0.0.0.0/0`
   - **api-sg**: `22/tcp` from `<trainer-IP>/32`, `8080/tcp` with source = `<initials>-nw-web-sg` (use `--remote-group <sg-id>`)
   - **db-sg**: `22/tcp` from `<trainer-IP>/32`, `5432/tcp` with source = `<initials>-nw-api-sg`
5. Apply each Security Group to its target instance (`openstack server add security group ...`) and remove the `default` SG from each (`openstack server remove security group ...`).
6. On `<initials>-nw-api-01`, start the placeholder API: `python3 -m http.server 8080 &`. From `<initials>-nw-web-01`, `curl http://<api-private-ip>:8080` — it must return an HTTP 200. From `<initials>-nw-web-01`, `curl http://<db-private-ip>:5432` — it must time out (blocked by `db-sg`).
7. Create a Floating IP on Ext-Net (`openstack floating ip create Ext-Net --tag <initials>-northwind-web`) and associate it with `<initials>-nw-web-01`. From your laptop, `curl http://<floating-ip>` — it must return the nginx page.
8. From your laptop, `ping <api-public-ip>` and `ping <db-public-ip>` — both must time out (ICMP not in the SG rules). SSH from your laptop must also be denied unless your IP matches `<trainer-IP>/32`.
### Validation criteria
 
- `openstack subnet show <initials>-nw-subnet` reports `enable_dhcp: True`.
- `<initials>-nw-api-01` pings `<initials>-nw-db-01` on the `10.50.0.x` private IP and replies are received.
- From `<initials>-nw-web-01`, `curl http://<api-private-ip>:8080` returns HTTP 200; `curl http://<db-private-ip>:5432` times out.
- From the learner's laptop, `curl http://<floating-ip>` returns the nginx welcome page.
- From the learner's laptop, `ping <api-public-ip>` times out (silent drop).
### Lab artifacts to produce
 
- A text file `network-state.txt` in the learner's lab repo under `module-2-3/` containing the output of `openstack network list`, `openstack subnet list`, `openstack security group list`, and `openstack floating ip list` for the project.
- A text file `validation.txt` containing the successful `curl http://<floating-ip>` output and the timed-out `curl http://<db-private-ip>:5432` (use a `--max-time 5` to bound the wait).
### Common lab support questions
 
- **"My `dhclient` doesn't pick up an IP."** → confirm `enable_dhcp: True` on the subnet; confirm the interface name with `ip link show`; if the subnet was created without DHCP, delete and recreate it.
- **"`--remote-group` doesn't accept the SG name."** → use the SG ID instead: `openstack security group show <name> -c id -f value` then pass the UUID.
- **"After removing the default SG, my SSH to the public IP times out."** → you probably removed it before adding the new SG, leaving the instance with no SG attached. Add the new SG first, then remove `default`.
- **"The Floating IP association fails with 'multiple ports found'."** → pass `--fixed-ip-address <private-ip>` to `openstack server add floating ip` to disambiguate.
- **"Can I leave the public IP on API and DB at the end?"** → yes, for this module. They will be removed when the Gateway is introduced in Module 2.4. The Security Groups already block public ingress on the application ports — the public IP just remains for `apt update`.
---
 
## Block 5 — Micro-check QCM (5 min)
 
Format: 7 single-answer multiple-choice questions, formative (non-certifying).
 
### Question 1
 
- **Stem**: In an OVHcloud Public Cloud project, which network gives an instance an Internet-routable public IPv4 by default?
- **Correct answer**: A. Ext-Net, a provider network shared across all projects in the region.
- **Distractors**:
  - B. A private network created via `openstack network create`, which assigns a public IP automatically — *Why wrong*: private networks use RFC1918 ranges and never assign public IPs.
  - C. The vRack network, which exposes instances to the Internet via the OVHcloud backbone — *Why wrong*: vRack is a Layer-2 underlay between OVHcloud products, not an Internet uplink.
  - D. The default Security Group, which acts as both a firewall and an Internet gateway — *Why wrong*: a Security Group is not a network object, it is a firewall ruleset.
- **LO traced**: `LO-NET-K01`
- **Bloom level**: Remember
### Question 2
 
- **Stem**: Which OpenStack Neutron object represents the virtual NIC of an instance and carries the MAC address, the IP, and the Security Group binding?
- **Correct answer**: C. Port.
- **Distractors**:
  - A. Network — *Why wrong*: a network is the L2 segment, not an instance's NIC.
  - B. Subnet — *Why wrong*: a subnet adds the L3 layer (CIDR + DHCP) to a network; it does not represent a NIC.
  - D. Floating IP — *Why wrong*: a Floating IP is a NAT object attached to a port, not the NIC itself.
- **LO traced**: `LO-NET-K02`
- **Bloom level**: Understand
### Question 3
 
- **Stem**: A learner creates a private network and a subnet, then attaches an instance to it. The instance fails to obtain an IP via `dhclient`. Which is the most likely cause?
- **Correct answer**: B. The subnet was created without DHCP enabled.
- **Distractors**:
  - A. The instance is missing a Floating IP, which is required for DHCP — *Why wrong*: Floating IP and DHCP are unrelated concepts.
  - C. The Security Group default-denies DHCP traffic — *Why wrong*: DHCP works inside the L2 segment, Security Groups operate at higher layers and Neutron handles DHCP transparently.
  - D. The subnet CIDR overlaps with Ext-Net — *Why wrong*: Ext-Net uses public IP ranges; private subnets use RFC1918 and do not conflict.
- **LO traced**: `LO-NET-S01`
- **Bloom level**: Apply
### Question 4
 
- **Stem**: A Public Cloud Instance is attached to both Ext-Net and a private network. Which statement is correct?
- **Correct answer**: D. The instance has two NICs, two ports, two IPs, and traffic uses whichever NIC matches the destination route.
- **Distractors**:
  - A. The instance must choose one network; dual-attachment is impossible — *Why wrong*: dual-NIC is a standard OpenStack pattern.
  - B. The Ext-Net NIC automatically routes private traffic to the private NIC — *Why wrong*: there is no inter-NIC routing inside the instance unless the OS is configured to do so.
  - C. Security Groups apply only to the Ext-Net NIC, not to the private NIC — *Why wrong*: Security Groups apply per port, regardless of which network the port belongs to.
- **LO traced**: `LO-NET-S02`
- **Bloom level**: Apply
### Question 5
 
- **Stem**: A Security Group has a single ingress rule allowing `22/tcp` from `203.0.113.10/32`. A learner SSHs from that IP and the connection succeeds. The Security Group has **no** egress rule explicitly defined for the return packets. Why does the connection work?
- **Correct answer**: A. Security Groups are stateful — return packets of an allowed ingress connection are automatically permitted.
- **Distractors**:
  - B. The default egress rule allows all outbound traffic, including the SSH return packets — *Why wrong*: while the default egress is indeed "allow all", the real reason the return works is statefulness; even with a restrictive egress, the established connection would still return.
  - C. SSH uses a special protocol that bypasses Security Groups — *Why wrong*: no protocol bypasses Security Groups.
  - D. The trainer's IP is in an allow-list at the hypervisor level — *Why wrong*: no hypervisor-level allow-list exists outside the Security Group itself.
- **LO traced**: `LO-NET-K02`, `LO-NET-S03`
- **Bloom level**: Understand
### Question 6
 
- **Stem**: An architect wants the API tier to be reachable on `8080/tcp` **only** from the web tier, not from any other source. Which Security Group rule design is the cleanest?
- **Correct answer**: C. On `api-sg`, add an ingress rule `8080/tcp` with source = the Security Group of the web tier (`--remote-group web-sg`).
- **Distractors**:
  - A. On `api-sg`, add an ingress rule `8080/tcp` from `0.0.0.0/0`, then add a deny rule for everything else — *Why wrong*: Security Groups have no deny rules, only allow rules with default-deny baseline.
  - B. On `web-sg`, add an egress rule `8080/tcp` to the API's private IP — *Why wrong*: default egress is already "allow all"; the right control is on the receiving side.
  - D. On both `web-sg` and `api-sg`, add `8080/tcp` rules to each other's CIDR — *Why wrong*: works but is brittle (depends on IPs not changing) and not the SG-as-source idiom.
- **LO traced**: `LO-NET-S03`
- **Bloom level**: Apply
### Question 7
 
- **Stem**: A Floating IP `51.100.50.10` is associated with `web-01`. The instance is deleted. What happens to the Floating IP?
- **Correct answer**: B. The Floating IP remains in the project as a detached resource and can be re-associated with another instance.
- **Distractors**:
  - A. The Floating IP is released and returned to the OVHcloud public pool immediately — *Why wrong*: Floating IPs persist in the project until explicitly deleted.
  - C. The Floating IP is automatically deleted because it has no port to bind to — *Why wrong*: a Floating IP is a project-level object, not tied to an instance lifecycle.
  - D. The Floating IP is converted into an Additional IP for billing purposes — *Why wrong*: Floating IP and Additional IP are distinct products with no automatic conversion.
- **LO traced**: `LO-NET-S04`
- **Bloom level**: Apply
---
 
## Block 6 — Wrap-up & Transition (5 min)
 
### Recap
 
By the end of this module the learner can:
- **Distinguish** Ext-Net from a private network and identify when to use each (`K01`)
- **Explain** Neutron's role and identify its main objects: network, subnet, port, router, security group, floating IP (`K02`)
- **Create** a DHCP-enabled private subnet inside a Public Cloud project (`S01`)
- **Attach** an instance to both a public and a private network and verify connectivity (`S02`)
- **Compose** Security Groups with tiered ingress rules using SG-as-source (`S03`)
- **Create** and associate a Floating IP with an instance (`S04`)
### Transition to next module via red-thread scenario
 
Northwind now has a private tier and a public tier, with least-privilege ingress between them. The web frontend is served behind a Floating IP that the team can move in seconds if `<initials>-nw-web-01` needs to be replaced. But three loose ends remain: (1) the API and DB instances still carry a public IP, which is no longer needed for ingress but is still used for outbound `apt update` — the **Gateway** introduced in Module 2.4 retires those public IPs cleanly; (2) Northwind's analytics database in a colocation rack needs to be reachable from the Public Cloud API tier without crossing the public Internet — that's a **vRack** conversation; (3) the web tier is currently a single instance, which means a single point of failure — the **Load Balancer** turns the Floating IP into a balanced VIP across multiple backends. Module 2.4 closes all three.
 
---
 
## Trainer FAQ (anticipated questions for this module)
 
**Q: What is the difference between a private network in Public Cloud and a vRack?**
A: A private network is a Neutron tenant network — it lives **inside one Public Cloud project, one region**, and connects Public Cloud Instances only. vRack is an OVHcloud cross-product Layer-2 underlay — it connects **Public Cloud projects, Bare Metal servers, Hosted Private Cloud, and other OVHcloud products** across regions. For the Northwind topology of today, a private network is enough. vRack enters the conversation in Module 2.4 when Northwind needs to reach an external (non-Public-Cloud) resource at L2.
 
**Q: Are Security Groups stateful or stateless? And what does that mean concretely?**
A: Stateful. Concretely: if you allow SSH ingress on port 22 from a given IP, the SSH return packets to that client are automatically permitted by the connection-tracking layer — you do not need a corresponding egress rule. This contrasts with stateless ACLs (e.g., AWS Network ACL), where you must explicitly allow both directions of a connection.
 
**Q: Why must DHCP be enabled at subnet creation time? Can I add it later?**
A: Neutron treats the DHCP service as a property of the subnet, established at creation. While `openstack subnet set --dhcp` exists in newer OpenStack versions, in OVHcloud Public Cloud the cleaner and supported path is to delete and recreate the subnet with DHCP enabled. The cost of getting this right at creation is minimal compared to recreating the subnet (which requires detaching every instance attached to it).
 
**Q: How does a Neutron port relate to the NIC inside my Linux instance?**
A: Neutron creates a port — a virtual NIC object with a fixed MAC and IP — when you attach an instance to a network. The hypervisor binds this port to the instance's NIC (`ens3`, `ens4`, …). Inside Linux, the NIC sees the MAC and obtains the IP via DHCP. The port survives the instance: if you stop the instance and start it again, the same port (and IP) is reattached. Floating IPs work because they attach to the port, not to the NIC.
 
**Q: Can I apply a Security Group to a specific NIC of a multi-NIC instance, or does it apply to the whole instance?**
A: Security Groups apply **per port**, not per instance. In a dual-NIC setup, you can apply different Security Groups to the Ext-Net port and to the private network port. In practice, this is rarely done at the Associate scope — applying the same SG set to the instance is simpler and usually sufficient — but the per-port granularity is available when needed.
 
**Q: What is the difference between Floating IP and Additional IP?**
A: Floating IP is a Neutron object inside a Public Cloud project — created with `openstack floating ip create`, billed per hour as part of the project, decoupled from the instance lifecycle, ideal for failover and VIP patterns inside Public Cloud. Additional IP is a separate OVHcloud product — ordered from the dedicated section of the Manager, attached to a specific OVHcloud service (Bare Metal, VPS, Public Cloud), with its own billing line. For Public Cloud workloads, Floating IP is the right tool. Additional IP is more common on Bare Metal where the customer needs a public IP that does not depend on the OS-level configuration.
 
**Q: Why does the API still have a public IP at the end of this module if it's a private tier?**
A: Pragmatic choice. Without a Gateway, an instance attached to a private network only cannot reach the Internet for outbound traffic — no `apt update`, no `pip install`, nothing. We keep the Ext-Net NIC for outbound today and rely on Security Groups to block inbound on the application ports. Module 2.4 introduces the Gateway, which lets us detach the Ext-Net NIC from API and DB cleanly and route their outbound through a private NAT path. This is the canonical OpenStack pattern.
 
**Q: What is MAC/IP spoofing prevention in Neutron and when does it bite?**
A: Neutron enforces, by default, that packets leaving an instance must have a source MAC and IP that match the port's allowed-address-pairs. This blocks pure software solutions that need to act as routers or load balancers between instances (e.g., a software HA proxy that VRRP-shares an IP between two instances). To allow that, you must explicitly set `--allowed-address` on the port. This is out of scope for Module 2.3, but trainers should anticipate the question from advanced learners who try to build a software VIP and are surprised that it does not work.
