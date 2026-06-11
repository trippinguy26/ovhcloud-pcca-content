# Module 2.4 — Network (Part 2) — vRack, Load Balancer & Gateway
 
## Module Brief
 
- **Module ID**: 2.4
- **Total duration**: 1h30
- **Block breakdown**: Sentier battu 5 min · Theory 30 min · Demo 15 min · Lab 30 min · Micro-check 5 min · Wrap-up 5 min
- **Program**: OVHcloud — Public Cloud — Core Associate
- **Domain covered**: 05 — Network (Part 2 of 2)
- **LOs covered** (9 total):
  - Knowledge: `LO-NET-K03`, `LO-NET-K04`, `LO-NET-K05`, `LO-NET-K06`, `LO-NET-K07`
  - Skills: `LO-NET-S05`, `LO-NET-S06`, `LO-NET-S07`
  - Attitudes: `LO-NET-A01`, `LO-NET-A02`
- **Prerequisite modules**: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3 (mandatory in sequence; standalone delivery requires the Northwind dual-NIC topology from Module 2.3 already in place — private network `<initials>-nw-private`, tiered Security Groups, Floating IP on the web frontend).
- **Red-thread step**: Northwind's three tiers are now isolated (output of Module 2.3) but two loose ends remain: API and DB still carry a public IP solely for outbound `apt update`, and the web frontend is a single instance behind one Floating IP — a single point of failure. Today the learner (1) deploys a **Gateway** on the private network and detaches the public NICs from `<initials>-nw-api-01` and `<initials>-nw-db-01`, validating that outbound Internet still works through the Gateway and that the public IPs are now only on the web tier, (2) deploys a **Public Cloud Load Balancer** in front of the web tier — first one backend `<initials>-nw-web-01`, then a second backend `<initials>-nw-web-02` cloned from the first — and validates HTTP round-robin, (3) configures **HTTPS termination** on the Load Balancer using a managed Let's Encrypt certificate, and (4) moves the Floating IP off the single web instance and onto the Load Balancer's public VIP. By the end of the module Northwind has a production-shape network topology: one public entry point (the LB VIP with HTTPS), one private network behind it, no public IP on application or data tiers, and outbound through the Gateway. **vRack** is covered conceptually and demonstrated by the trainer (no learner lab) since most learners have no Bare Metal to connect, but the LO `S07` is testable from the explained mechanism. **Anti-DDoS** is covered as a single theory slide (scope and limits, K07).
### Pedagogical angle
 
This is the *"closing"* module of the network domain. Module 2.3 built the tiered topology; Module 2.4 turns it into a production-shape topology that an ex-AWS operator would recognize as "we've reached parity with what they expect". Three new objects enter the picture — **Gateway**, **Load Balancer**, **vRack** — plus two background topics that round out the network knowledge: **Floating IP vs Additional IP** (carried over and clarified from 2.3) and **Anti-DDoS scope**.
 
The legacy-IT analogies remain useful but stretch thinner here. The Gateway maps to a small **NAT router on a stick** at the edge of a private VLAN, exposing private hosts to the Internet for outbound only. The Load Balancer maps to the **F5 / HAProxy appliance** placed in front of a web tier in a legacy datacenter — same primitives (VIP, backends, health checks, SSL offload). The vRack maps to a **dark-fibre L2 trunk** between two datacenters, with the OVHcloud backbone playing the role of the inter-DC fibre. Anti-DDoS maps to the **upstream scrubbing service** that legacy operators historically had to subscribe separately. Persona Corporate anchors well on F5 and dark fibre. Persona Digital Starter benefits from the AWS cross-reference more than from the legacy analogy.
 
The single most important slide of the module is **slide 5** — Gateway as the NAT router. The Gateway is the object that retires the lingering public IPs on the API and DB tiers, and it is the structural piece that makes the topology look like a real production layout. Learners who internalize "Gateway = SNAT for outbound from private-only instances" stop confusing it with vRack and stop confusing it with a Load Balancer.
 
A second high-leverage point is **slide 9** — Load Balancer sizing tiers. Public Cloud Load Balancer comes in four sizes (S, M, L, XL) with deterministic capacity profiles (LCU per size, max throughput, max connections per second). This is a calibration choice the learner makes from day one — undersized LB throttles the application, oversized LB inflates the bill — and it is a frequent exam-stem topic for ex-AWS profiles who are used to AWS NLB / ALB auto-scaling.
 
A third subtle point is **slide 11** — Floating IP vs Additional IP. This was anticipated in Module 2.3 and closed here. Additional IP is an OVHcloud product **outside the Public Cloud project context**, designed primarily for Bare Metal and dedicated services. For a Public Cloud workload, the right tool is always Floating IP. The distinction matters because learners who later open a ticket asking for an "Additional IP on my Public Cloud instance" will be redirected to Floating IP by support.
 
### Trainer demonstration
 
15-minute end-to-end **OpenStack CLI + Manager UI** demo on the running `demo-web-01` and `demo-api-01` instances from Module 2.3 (already dual-NIC, with `demo-web-sg` and `demo-api-sg` applied). The trainer (1) deploys a Gateway on `demo-private` via the Manager UI (CLI is heavier for Gateway and the Manager flow is cleaner for the demo), shows that the Gateway gets a public NIC and is the new default route for private-only outbound, (2) detaches the Ext-Net NIC from `demo-api-01` via `openstack server remove network`, validates that `apt update` from inside `demo-api-01` still works (it now goes through the Gateway), (3) deploys a Public Cloud Load Balancer in size S via the Manager UI, configures one listener `HTTP/80`, one pool with `demo-web-01` as backend, demonstrates round-robin with a `curl` loop, (4) clones `demo-web-01` into `demo-web-02` (a one-liner snapshot+spawn shown in fast-forward), adds it to the pool, demonstrates that the `curl` loop now alternates between the two backends. **vRack is shown verbally on a static slide** with a screenshot of the Manager vRack association page — no live demo of vRack since the trainer is not assumed to have a Bare Metal server attached. HTTPS termination and Anti-DDoS are covered in the Theory block only, not in the demo (time-box).
 
### Learner lab
 
*Retire the public IPs from API and DB via a Gateway, deploy a Load Balancer with two web backends, and move the Floating IP onto the LB VIP with HTTPS* (30 min). Each learner: (1) deploys a Gateway on `<initials>-nw-private` (size S) via the Manager UI in GRA, waits for it to become `ACTIVE`, confirms that the Gateway has a public NIC visible in `openstack network list`, (2) SSH into `<initials>-nw-api-01`, runs `sudo apt update` and confirms it still works (passing through the Gateway), then detaches the Ext-Net NIC: `openstack server remove network <initials>-nw-api-01 Ext-Net`, repeats `apt update` to confirm outbound still works on the private-only NIC via the Gateway, repeats the same for `<initials>-nw-db-01`, (3) clones `<initials>-nw-web-01` into `<initials>-nw-web-02` via the Manager UI (snapshot then spawn from snapshot, size `b3-8`), confirms nginx is responding on its public IP, (4) deploys a Public Cloud Load Balancer in size **S** via the Manager UI, attaches it to `<initials>-nw-private`, creates a listener on `HTTP/80` with `ROUND_ROBIN` algorithm, creates a pool with both web instances as members, configures a TCP health check on port 80, validates that the LB reports both members `ONLINE` and that `curl http://<lb-public-vip>` in a loop alternates between the two backends, (5) deletes the existing Floating IP from `<initials>-nw-web-01` and re-associates a new Floating IP (or the same one, recreated) to the Load Balancer's public VIP — for the lab this is simpler done by using the LB's own public VIP directly, (6) on the LB, add a second listener `HTTPS/443` with a managed Let's Encrypt certificate generated through the Manager UI for the domain `<initials>-northwind.<trainer-provided-zone>`, validates that `curl -k https://<lb-vip>` returns the nginx page and that the certificate chain is valid. Validation: `<initials>-nw-api-01` has no public IP, can `apt update` via the Gateway; `curl http://<lb-vip>` in a 10-iteration loop returns 5 responses from `<initials>-nw-web-01` and 5 from `<initials>-nw-web-02` (identified via hostname injected in the nginx welcome page); HTTPS termination on the LB returns a 200 with a valid certificate.
 
### Micro-check — question intents (drafted in Block 5)
 
1. vRack — four foundational characteristics — Remember — `K03`
2. Floating IP vs Additional IP — Understand — `K04`
3. Gateway — role and direction of traffic — Understand — `K05`
4. Load Balancer sizing decision — Apply — `K06` / `S05`
5. HTTPS termination on the LB — Apply — `S06`
6. vRack reachability scenario — Apply — `S07`
7. Anti-DDoS scope — Understand — `K07`
8. Topology recommendation for a given need — Analyze — `A01`
### Trainer FAQ — anticipated topics (drafted in Block 8)
 
What is the difference between a Gateway and a NAT router, can I share one Gateway between several private networks, what happens if the Gateway fails (HA model), Load Balancer sizing decision and what LCU actually counts, how the LB health check chooses between TCP and HTTP, how Let's Encrypt managed certificates are renewed (automatic), what the four LB sizing tiers cost relatively, can I terminate TLS on the backend instead of the LB and what are the trade-offs, vRack vs VPC peering analogy, can I run vRack across regions (yes, that's its point), Anti-DDoS scope (network-layer, not application-layer WAF), Floating IP vs Additional IP final clarification, what happens to the Floating IP when I delete the Load Balancer.
 
---
 
## Block 1 — Sentier battu / Hors piste (5 min)
 
### Sentier battu (assumed prerequisites)
 
**Tools:**
- The Northwind staging stack from Module 2.3: `<initials>-nw-web-01`, `<initials>-nw-api-01`, `<initials>-nw-db-01`, all attached to `<initials>-nw-private` (CIDR `10.50.0.0/24`), tiered Security Groups applied, a Floating IP on `<initials>-nw-web-01`.
- The `openrc.sh` from Module 1.2, sourced and scoped to GRA.
- A running nginx on `<initials>-nw-web-01` serving on port 80 with the hostname injected into the default page (one-liner provided in the lab handout: `echo "served by $(hostname)" | sudo tee /var/www/html/index.nginx-debian.html`).
- The Manager UI open in a browser tab, with the learner's Public Cloud project selected.
- A DNS zone delegation under the trainer-provided domain (for the HTTPS Let's Encrypt step): the trainer announces the per-learner subdomain at the start of the lab.
**Knowledge:**
- The dual-NIC topology of Module 2.3: API and DB carry one public NIC (Ext-Net) plus one private NIC (`10.50.0.x`), web carries one public NIC plus one private NIC, all three are inside the same private network.
- Security Group semantics from Module 2.3: stateful, default-deny ingress, default-allow egress, additive rules. Today's lab does not change SG rules, only the network attachments and the front-end.
- The Floating IP concept from Module 2.3: a Neutron object inside the project, movable between ports.
- The notion of an HTTP load balancer from legacy IT: a VIP in front of a pool of backends, round-robin or other algorithms, health checks.
- TLS basics: the certificate is presented by the server, the chain is validated by the client. HTTPS termination means the LB presents the certificate and forwards plain HTTP to the backends.
### Hors piste (remediation pointers for gaps)
 
- **Northwind stack from Module 2.3 not in place** → run the recovery script `module-2-3/recover-network-state.sh` from the lab repo, which rebuilds the private network, SGs, and Floating IP. The recovery is idempotent and takes ~3 minutes.
- **No DNS zone available for HTTPS Let's Encrypt** → the trainer provides a fallback: use the LB's `*.lb.ovh.net` automatically-assigned domain for the HTTPS test, which has a wildcard Let's Encrypt cert already attached. The pedagogical point of HTTPS termination is preserved.
- **Confusion between Gateway, Load Balancer, vRack** → preempt in the Sentier battu: "Gateway = outbound from private-only instances, Load Balancer = inbound distribution to a pool of backends, vRack = L2 underlay to non-Public-Cloud OVHcloud resources. Three different jobs."
- **Forgotten that Security Groups are stateful** → if the learner reopens the question at any point, redirect to slide 7 of Module 2.3 and move on. The lab does not change SG rules.
- **No idea what "round-robin" means in an LB context** → 30-second explanation: the LB cycles requests across the pool members in order, so two requests in a row to the same VIP land on two different backends. Stickiness is a separate concern, out of scope today.
---
 
## Block 2 — Theory & Concepts (30 min)
 
### Slide 1: Where we left off, what we tackle today
 
**Visual concept**: The Northwind topology from Module 2.3 on the left (three instances, two with public IPs and a private network connecting them, one Floating IP on the web tier). On the right, the same topology after Module 2.4: one Load Balancer at the top with a public VIP and HTTPS, two web backends, no public IP on API and DB, a Gateway box on the private network providing outbound. A central arrow labelled "today's work". Below: "Three new objects: Gateway, Load Balancer, vRack."
 
**Talking points**:
- Starting point: the dual-NIC topology with tiered SGs is functional but not yet production-shape
- Today closes three loose ends: outbound from private-only (Gateway), front-end scaling and HTTPS (Load Balancer), cross-product L2 (vRack)
- Plus two background topics: Floating IP vs Additional IP (carried over from 2.3), Anti-DDoS scope
- Nine LOs covered: 5 knowledge, 3 skills, 2 attitudes — the closing module of the network domain
**Trainer notes**:
- Souligner que c'est la dernière étape avant que la topologie ressemble à de la prod
- Demander: "qui a déjà mis un Load Balancer devant un service web ?" — calibre le niveau
- Anticiper la question vRack en ouverture: "on le voit en théorie + démo, pas en lab, parce que vous n'avez pas de Bare Metal à brancher"
- Rappeler le persona Corporate: cette topologie finale est ce qu'ils attendent par défaut en venant d'AWS
---
 
### Slide 2: vRack — the cross-product L2 underlay
 
**Visual concept**: A horizontal diagram showing four OVHcloud products stacked vertically on the left (Public Cloud, Bare Metal, Hosted Private Cloud, Dedicated Servers) and on the right a single horizontal blue bar labelled "vRack — Layer-2 underlay". Each product connects to the vRack bar via a "VLAN tag" line. Below the vRack bar: "OVHcloud backbone, not Internet". A side caption: "Same L2 broadcast domain across products, across datacenters."
 
**Talking points**:
- vRack = OVHcloud's proprietary Layer-2 underlay connecting **different OVHcloud products** at L2
- Four foundational characteristics: **multi-product** (Public Cloud + Bare Metal + Hosted Private Cloud + Dedicated Server), **multi-DC** (a vRack can span GRA + BHS + SBG), **true Layer-2** (broadcast, multicast, ARP work — not a VPN tunnel), **VLAN-capable** (you can carve sub-segments via VLAN tags inside one vRack)
- Built on the OVHcloud backbone, not on the public Internet — predictable latency, no ingress/egress billing across the vRack
- Cross-reference: AWS Direct Connect / Transit Gateway is *not* a direct analog (those are routed L3 services). vRack is closer to a **dark-fibre L2 trunk** between locations, with VLAN trunking on top.
**Trainer notes**:
- Souligner que vRack n'est pas un service IaaS comme les autres, c'est un underlay L2
- Anticiper "et la performance par rapport à un VPC peering AWS ?" → vRack passe par le backbone OVHcloud, latence stable, pas de coût de transit
- Si quelqu'un demande "j'ai besoin de vRack pour démarrer ?" → non, optionnel, utile seulement en multi-produit OVHcloud
- Rappeler: persona Corporate aime ce composant, c'est le pont vers leur Bare Metal ou HPC existant
---
 
### Slide 3: vRack — how it attaches to a Public Cloud project
 
**Visual concept**: A two-step diagram. Step 1: the vRack association — a Public Cloud project is associated with a vRack via the Manager UI (a screenshot-like rectangle showing the "vRack association" page). Step 2: inside the project, a private network is created and **attached to a vRack VLAN tag** (e.g., VLAN 42), making this private network reachable from any other product attached to the same vRack on the same VLAN. A side callout: "Without the VLAN tag, the private network stays project-local. With the VLAN tag, it joins the vRack underlay."
 
**Talking points**:
- Step 1: associate the Public Cloud project with a vRack (Manager UI, irreversible without support intervention — choose deliberately)
- Step 2: when creating a private network, optionally tag it with a vRack VLAN ID; the network now bridges to the vRack underlay
- A Bare Metal server on the same vRack with the same VLAN tag on its private interface sees the Public Cloud instances at Layer-2
- **vRack is a feature of the project, not of the instance** — once the project is associated, every private network in it can opt into a VLAN
- Cross-reference: ex-AWS profiles think "VPC peering" → wrong analog; vRack is closer to **VPN gateway + transit + bridge** as a single L2 fabric
**Trainer notes**:
- Souligner l'association projet-vRack est faite une fois pour toutes, c'est un choix structurel
- Anticiper "est-ce qu'il y a un coût ?" → le vRack est inclus dans la plupart des offres OVHcloud, pas de coût additionnel pour l'attacher
- Si question "et si je veux migrer une VM Bare Metal vers Public Cloud sans changer son IP ?" → vRack permet le L2 bridge, donc oui, le scénario fonctionne
- Rappeler que `LO-NET-S07` est testé en démo (slide 4), pas en lab learner
---
 
### Slide 4: Gateway — what it does and where it sits
 
**Visual concept**: A diagram of the Northwind private network as a horizontal bar (`10.50.0.0/24`), three instances attached (web, api, db) with their private IPs visible. On the left of the bar, a new box labelled "Gateway" with two NICs: one in the private network (`10.50.0.1`, the default route for the subnet), one in Ext-Net (a public IP). Arrows show outbound traffic from api/db going to the Gateway, being SNAT'd, and reaching the Internet. Inbound traffic from the Internet does **not** cross the Gateway (red X labelled "no inbound — for inbound use a Floating IP or a Load Balancer"). A side caption: "SNAT for outbound. Not a NAT for inbound."
 
**Talking points**:
- Gateway = a managed OpenStack router providing **SNAT for outbound** from a private network to the Internet
- Sits as the **default route** of the private subnet — every packet to a destination outside the subnet leaves via the Gateway
- **Not for inbound**: a Gateway does not expose private instances to the Internet. Inbound to a private instance requires a Floating IP on a dual-NIC instance or a Load Balancer in front.
- Lifecycle: deploy via Manager UI, becomes `ACTIVE` in ~30 seconds, attaches automatically to the chosen private network
- Once deployed, instances on the private network can drop their Ext-Net NIC and still reach the Internet for `apt update`, `pip install`, etc.
**Trainer notes**:
- **Slide la plus importante du module — ralentir, articuler**
- Souligner les deux mots-clés: "SNAT outbound" et "not inbound"
- Anticiper la question: "et si je veux exposer mon API ?" → réponse: ce n'est pas le rôle du Gateway, c'est le rôle du Load Balancer ou d'une Floating IP sur l'instance
- Demander: "qu'est-ce qui se passe pour les paquets de retour des connexions sortantes ?" → réponse: le Gateway maintient la table de connexions, les retours passent par le même chemin
- Rappeler l'analogie legacy: c'est un routeur sur un stick avec NAT, classique sur les VLANs internes des datacenters
---
 
### Slide 5: Gateway — sizing and HA model
 
**Visual concept**: A two-column table. Left column "Sizing tiers": S (small, light workload), M (medium), L (large). Each tier has a throughput indicator (bandwidth, sessions/s) shown as a horizontal bar of increasing length. Right column "HA model": a single diagram showing two Gateway instances in active/passive mode behind a virtual IP, with a label "Managed by OVHcloud — no learner action required". A side callout: "Sizing changeable in-place. No HA configuration to do — it's already HA."
 
**Talking points**:
- Three sizing tiers: **S**, **M**, **L** — chosen at creation, changeable in-place from the Manager
- Sizing drives the **outbound throughput cap and the session count** — pick S for staging, M+ for production
- **High Availability is managed by OVHcloud**: the Gateway is internally redundant, no failover script to write
- Pricing is per-hour, per-tier — visible in the Manager pricing page
- Cross-reference: AWS NAT Gateway has identical positioning (managed SNAT, per-hour billing, no HA to configure)
**Trainer notes**:
- Souligner que le sizing est modifiable à chaud, donc on peut démarrer en S
- Anticiper "quel est le surcoût ?" → c'est facturé à l'heure, l'ordre de grandeur est documenté dans la Manager (ne pas citer un prix exact en formation)
- Si question "et si la Gateway tombe ?" → répondre: HA interne, on n'a rien à faire côté client
- Rappeler que c'est exactement le pattern AWS NAT Gateway, transparent pour les ex-AWS
---
 
### Slide 6: Floating IP vs Additional IP — closed and clarified
 
**Visual concept**: A two-column comparison strip. Left column "Floating IP" — label "Public Cloud / Neutron object", attributes: created inside a Public Cloud project, attached to a Neutron port, lifecycle = project, billed per hour, ideal for failover VIPs and exposure of private-tier instances. Right column "Additional IP" — label "OVHcloud product, outside the project", attributes: ordered separately from the dedicated services section of the Manager, attached to a Bare Metal / VPS / Public Cloud Instance at the OS level, lifecycle = product order, billed per IP per month, ideal for Bare Metal failover and license-bound IPs. A bottom banner: "On Public Cloud, default to Floating IP. Additional IP is the cross-product story."
 
**Talking points**:
- Floating IP = inside a Public Cloud project, Neutron object, hourly billing, the default for Public Cloud workloads
- Additional IP = an OVHcloud product ordered outside the project, monthly billing, designed primarily for Bare Metal
- Both deliver "a public IP you can move" — the difference is the **lifecycle and the product context**
- For Public Cloud Core, **always Floating IP** unless a very specific cross-product or license-binding need pushes you to Additional IP
- Cross-reference: AWS Elastic IP = Floating IP. AWS does not have an equivalent of Additional IP (that's an OVHcloud-specific construct rooted in the Bare Metal heritage).
**Trainer notes**:
- Souligner que ce slide ferme le suspense laissé en 2.3
- Anticiper "et si je vois Additional IP dans la Manager, je dois m'en méfier ?" → répondre: non, c'est juste un autre produit pour un autre contexte
- Demander: "pour Northwind aujourd'hui, on prend quoi ?" → réponse attendue: Floating IP, parce que tout est sur Public Cloud
- Rappeler que cette confusion est dans le top des questions du support OVHcloud — savoir la dissiper en amont sauve du temps
---
 
### Slide 7: Public Cloud Load Balancer — what it is
 
**Visual concept**: A central box labelled "Public Cloud Load Balancer" with three input-side attributes (listener, certificate, public VIP) and three output-side attributes (pool, member, health check). Below: "Built on OpenStack Octavia." Arrows from the public VIP entering the LB, being distributed across two backend instances on the private network. A side callout: "One LB = one or more listeners = one or more pools = many members."
 
**Talking points**:
- Public Cloud Load Balancer = a managed Layer-4/Layer-7 load balancer built on **OpenStack Octavia**
- Public VIP on the Internet side, pool of backends on the private network side
- **One listener per protocol/port** (HTTP/80, HTTPS/443, TCP/3306, …); each listener forwards to one pool
- Pool members are referenced by their **private IP** — the LB lives inside the project's network
- Health checks (TCP, HTTP, HTTPS) detect unhealthy backends and exclude them from rotation
- Cross-reference: AWS ALB ≈ LB with HTTP/HTTPS listeners. AWS NLB ≈ LB with TCP listener. The OVHcloud LB does both in one product.
**Trainer notes**:
- Souligner que c'est du Octavia upstream, donc c'est de l'OpenStack standard
- Anticiper "est-ce que c'est managé ou est-ce que je dois faire le patching ?" → répondre: managé, on ne voit pas les VMs sous-jacentes
- Si question Layer 7: "oui, HTTP routing par path, par host, possible — mais pas couvert au niveau Associate"
- Rappeler que le LB est inside le projet, donc il prend ses membres sur les IPs privées, pas publiques
---
 
### Slide 8: Load Balancer — anatomy of a configuration
 
**Visual concept**: A vertical anatomy diagram with four labelled layers. Layer 1 (top): **Listener** — protocol + port (e.g., HTTPS/443) + certificate reference. Layer 2: **Pool** — name + algorithm (`ROUND_ROBIN`, `LEAST_CONNECTIONS`, `SOURCE_IP`). Layer 3: **Members** — list of `instance / private-IP / weight`. Layer 4 (bottom): **Health monitor** — type (TCP, HTTP), URL path if HTTP, expected status code, interval, timeout, retries. Arrows show the path from a client request through each layer.
 
**Talking points**:
- **Listener** owns the public-facing side: protocol, port, certificate (for TLS termination)
- **Pool** owns the distribution logic: algorithm (`ROUND_ROBIN` is the default and the sane choice at the Associate scope)
- **Member** = one backend, referenced by `instance + private IP + listening port + weight`
- **Health monitor** is mandatory for a useful LB — without it, the LB sends traffic to dead backends
- A common pattern: one listener HTTP/80 redirecting to HTTPS/443, one listener HTTPS/443 with the certificate, one pool, two or more members
**Trainer notes**:
- Souligner que le health monitor est obligatoire pour une config saine — pas un détail
- Anticiper "quelle algo prendre ?" → ROUND_ROBIN par défaut, LEAST_CONNECTIONS si les requêtes ont des durées très variables, SOURCE_IP si on a besoin de stickiness IP
- Demander: "si un backend tombe, qu'est-ce qui se passe ?" → réponse: le health monitor le détecte, l'exclut du pool, les nouvelles requêtes vont sur les survivants
- Rappeler que tout ça se configure via la Manager UI au niveau Associate, le CLI Octavia est Professional+
---
 
### Slide 9: Load Balancer sizing — the four tiers
 
**Visual concept**: A four-column table sized as a comparison strip. Columns: **S**, **M**, **L**, **XL**. Rows: **Throughput** (relative bar), **New connections/s** (relative bar), **Concurrent connections** (relative bar), **Typical use case** (text: staging or low-traffic site / production small site / production e-commerce / high-volume API or media). At the bottom: "All tiers include: HTTPS termination, anti-DDoS protection, automatic certificate renewal." A side callout: "Sizing changeable in-place. Start small, upgrade when monitoring justifies it."
 
**Talking points**:
- Four tiers: **S, M, L, XL** — chosen at creation, **changeable in-place** with a short interruption
- Sizing drives **throughput cap, new connections per second, concurrent connections** — pick based on observed or expected traffic
- All tiers include the same features: HTTPS termination, anti-DDoS, managed Let's Encrypt, health checks
- Pricing is per-hour, per-tier — billable from the moment the LB exists, not from when it has traffic
- **Default heuristic**: start with **S** in staging, **M** in production for a small SaaS, **L+** when monitoring shows sustained saturation of M
**Trainer notes**:
- Souligner que sizing changeable in-place est un argument de tranquillité, on n'est pas figé
- Anticiper "comment je sais que je dois upgrader ?" → répondre: les métriques Octavia sont exposées dans le Manager, on en parle au module 3.2 Operations
- Si question "et l'auto-scaling comme AWS ALB ?" → répondre: pas en automatique au niveau Associate, c'est un upgrade manuel mais rapide
- Rappeler que la calibration des coûts entre les 4 sizes est documentée dans la page produit OVHcloud, ne pas inventer de chiffres en formation
---
 
### Slide 10: HTTPS termination on the Load Balancer
 
**Visual concept**: A flow diagram. Left: a client laptop. Middle: the Load Balancer with a green padlock icon labelled "HTTPS/443 + certificate". Right: two backend instances on the private network, the link from LB to backends shown in plain (no padlock) labelled "HTTP/80, private network". A side box: "Certificate options: (1) Managed Let's Encrypt — auto-renewed, (2) Customer-provided certificate — uploaded via Manager." A small grey reminder: "TLS terminates at the LB. The backends speak plain HTTP on the private network — fine, since the private network is isolated."
 
**Talking points**:
- HTTPS termination = the LB presents the TLS certificate, decrypts, and forwards plain HTTP to the backends on the private network
- Two certificate sources: **managed Let's Encrypt** (automatic, renewed by OVHcloud) or **customer-provided** (paste PEM in the Manager)
- Managed Let's Encrypt requires a **DNS record pointing to the LB VIP** for the ACME validation — the DNS layer is your responsibility
- Why terminate at the LB and not at the backend: simpler certificate management (one place), CPU offload, easier rotation. The private network protects the LB-to-backend leg.
- **End-to-end TLS** (re-encrypting LB → backend) is possible but out of scope at the Associate level
**Trainer notes**:
- Souligner que terminer le TLS au LB est la pratique courante, pas un compromis
- Anticiper "et si je veux du end-to-end TLS pour la conformité ?" → réponse: possible, configurer le pool en `HTTPS` côté backend avec un cert sur chaque backend, mais c'est Professional+
- Demander: "qui gère le renouvellement Let's Encrypt ?" → réponse: OVHcloud le fait automatiquement tant que le DNS pointe encore vers le LB
- Si question "le LB voit les requêtes en clair ?" → oui, c'est le sens même de la terminaison TLS
---
 
### Slide 11: Anti-DDoS — what it does, what it doesn't
 
**Visual concept**: A vertical scope diagram. Top section "OVHcloud Anti-DDoS — included for free, always on" with a green shield icon. Three covered layers: **Network-layer floods** (SYN flood, UDP flood, amplification attacks), **Volumetric attacks** (Tbps-scale traffic absorbed by the OVHcloud backbone), **Protocol anomalies** (malformed packets, fragmentation attacks). Below, a red separator. Bottom section "Not covered by Anti-DDoS — out of scope": **Application-layer attacks** (HTTP flood, slow loris), **WAF concerns** (SQL injection, XSS), **Credential-stuffing or bot abuse**. A bottom banner: "Free, always on, network-layer only. For L7, use a dedicated WAF."
 
**Talking points**:
- OVHcloud Anti-DDoS is **always on, included by default**, on every public IP of every OVHcloud service
- Covers **network-layer attacks**: SYN flood, UDP flood, amplification (DNS, NTP), volumetric Tbps-scale traffic
- **Does not cover** application-layer attacks (HTTP flood, slow attacks, WAF concerns) — for those, a dedicated WAF product is needed
- Operates upstream of the customer infrastructure: malicious traffic is absorbed by the OVHcloud backbone before reaching the project
- No configuration to do — it's part of the network fabric, not a service the customer activates
**Trainer notes**:
- Souligner: gratuit, toujours actif, sur toutes les IPs publiques OVHcloud — pas seulement Public Cloud
- Anticiper "c'est vraiment efficace ?" → répondre: c'est l'un des arguments historiques d'OVHcloud, capacité d'absorption multi-Tbps, documentée publiquement
- Si question "et le WAF ?" → répondre: hors scope Public Cloud Core Associate, c'est un produit séparé
- Rappeler que le persona Corporate ex-AWS s'attend à un service séparé et payant — c'est différent ici
---
 
### Slide 12: Hyperscaler cross-reference
 
**Visual concept**: A three-column mapping table. Header: "OVHcloud Public Cloud" | "AWS" | "Azure". Rows: **Gateway** | NAT Gateway | NAT Gateway (similar), **Load Balancer** | ALB / NLB (combined in one product) | Azure Load Balancer / Application Gateway, **vRack** | (no direct equivalent — closest: Direct Connect + Transit Gateway for L3 routing) | ExpressRoute (L3, not L2), **Anti-DDoS** | AWS Shield Standard (free) + Advanced (paid) | Azure DDoS Protection Basic (free) + Standard (paid). A small grey reminder: "vRack is the OVHcloud-specific differentiator — no exact equivalent at the other hyperscalers."
 
**Talking points**:
- Gateway and Load Balancer map cleanly to hyperscaler equivalents — same primitives, similar billing model
- vRack is **OVHcloud-specific** — closest hyperscaler concepts are L3 routed (Direct Connect, ExpressRoute), not L2
- Anti-DDoS positioning differs: OVHcloud includes high-grade protection by default; AWS and Azure split free vs paid tiers
- This cross-reference helps Corporate ex-AWS profiles re-map their mental model
**Trainer notes**:
- Souligner que vRack est la spécificité OVHcloud, pas d'équivalent direct ailleurs
- Anticiper "et AWS Shield Advanced, ça apporte quoi ?" → répondre: WAF intégration, attaque attribution, support DRT — c'est un service à valeur ajoutée, pas la protection volumétrique de base
- Si question sur Application Gateway Azure: "c'est Layer 7 avec WAF inclus, donc plus proche d'un LB + WAF combiné — pas équivalent strict au LB OVHcloud"
- Rappeler que ce slide ferme le bloc Theory, transition vers la démo
---
 
## Block 3 — Trainer Demonstration (15 min)
 
### Demo scenario
 
Starting from the Module 2.3 demo end-state (`demo-web-01` and `demo-api-01` dual-NIC on `demo-private`, tiered SGs, a Floating IP on `demo-web-01`), deploy a Gateway, retire the public NIC from `demo-api-01`, then deploy a Load Balancer in front of the web tier and add a second web backend. Channels: **Manager UI** for Gateway and Load Balancer deployment (cleaner than CLI for these objects at the Associate scope), **OpenStack CLI** for the NIC detach operation, **SSH** for validation from inside the instance, **`curl` loop** from the trainer's laptop for end-to-end LB validation. HTTPS termination is shown via a pre-baked DNS record (the trainer prepares the demo DNS pointing to a placeholder LB before the session — this saves the 5-minute Let's Encrypt wait during the live demo).
 
### Demo script
 
| Step | Action | Expected output | Trainer commentary |
|---|---|---|---|
| 1 | Manager UI → Public Cloud → Network → Gateway → Create a Gateway, attach to `demo-private`, size `S` | Gateway deployment starts, status `BUILDING` then `ACTIVE` in ~30s | "Managed router, SNAT for outbound. We attach it to the private network we already have." |
| 2 | `openstack network list` and `openstack router list` | The Gateway appears as a router with one port on Ext-Net and one port on `demo-private` | "Under the hood it's an OpenStack router — Neutron `router` object, finally used." |
| 3 | SSH into `demo-api-01`, `sudo apt update` | Apt fetches package lists successfully | "Apt update works because the API still has its Ext-Net NIC — no surprise yet." |
| 4 | `openstack server remove network demo-api-01 Ext-Net` | The Ext-Net NIC is detached, public IP is gone | "Now `demo-api-01` is private-only. Without the Gateway, this would break apt update." |
| 5 | SSH into `demo-api-01` (now from `demo-web-01` via private IP since no public IP), `sudo apt update` | Apt fetches package lists successfully through the Gateway | "Outbound still works. Same instance, same apt update, same internet, but the route goes through the Gateway now." |
| 6 | Manager UI → Public Cloud → Network → Load Balancers → Create a Load Balancer, size `S`, attached to `demo-private`, region GRA | LB deployment starts, status `BUILDING` then `ACTIVE` in ~2 minutes, a public VIP is assigned | "Octavia under the hood. Wait for ACTIVE before configuring listeners." |
| 7 | In the same Manager flow: add listener `HTTP/80`, algorithm `ROUND_ROBIN`, pool with `demo-web-01` (port 80) as the single member, health monitor `TCP/80` | Listener and pool created, member status `ONLINE` after health check pass | "One backend so far — round-robin on a single member is just pass-through." |
| 8 | From trainer's laptop, `for i in {1..5}; do curl http://<lb-vip>/; done` | nginx page returns 5 times, all from `demo-web-01` (hostname visible in the page) | "One backend, five hits, same hostname every time. Now let's add a second." |
| 9 | Manager UI → snapshot `demo-web-01` → spawn a new instance `demo-web-02` from the snapshot, same flavor, dual-NIC (Ext-Net + `demo-private`), same SGs as `demo-web-01` | `demo-web-02` is `ACTIVE`, nginx responding on its public IP | "Snapshot-based cloning, no manual configuration. The hostname is `demo-web-02` because the snapshot was taken after I set the hostname." |
| 10 | In the LB pool, add `demo-web-02` (its private IP, port 80) as a second member | Pool now has 2 members, both `ONLINE` after health check pass | "Two backends now in the pool. The LB will round-robin between them on the next request." |
| 11 | From trainer's laptop, `for i in {1..10}; do curl http://<lb-vip>/; done | grep "served by"` | 10 lines, alternating between `served by demo-web-01` and `served by demo-web-02` | "Round-robin in action. The LB has zero state between requests — each one is dispatched independently." |
| 12 | Manager UI → Load Balancer → listener → add a second listener `HTTPS/443` with a managed Let's Encrypt certificate using the pre-baked DNS record `demo-northwind.<trainer-zone>` | HTTPS listener `ACTIVE`, certificate `VALID` | "TLS terminates here. The backends still speak HTTP on the private network — fine, since the private network is isolated." |
| 13 | From trainer's laptop, `curl https://demo-northwind.<trainer-zone>/` | nginx page returns with a valid TLS chain, hostname alternates as in step 11 | "Production-shape pattern: HTTPS at the edge, plain HTTP behind. The LB is doing all the certificate work." |
 
### Common demo failure modes
 
- **Gateway deployment stuck in `BUILDING` for more than 2 minutes** → cause: regional capacity issue, rare → recovery: cancel and retry, or use the backup pre-deployed Gateway the trainer prepared before the session. The trainer should have one warm Gateway on standby.
- **`apt update` after Ext-Net NIC removal fails** → cause: the Gateway was not selected as default route by `dhclient` because the private network's DHCP did not advertise it yet → recovery: `sudo dhclient -r ens4 && sudo dhclient ens4` inside the instance forces a DHCP refresh, the new default route appears.
- **LB member stays in `OFFLINE` status** → cause: health monitor failing, usually because the Security Group on the backend does not allow ingress from the LB's source range → recovery: check that `<backend>-sg` allows ingress on the health-check port; the LB sources from the private network so `--remote-ip 10.50.0.0/24` is the typical fix. Document this carefully — it is the most frequent LB issue.
- **HTTPS listener creation fails with "DNS validation failed"** → cause: the DNS record does not yet point to the LB VIP, or the DNS TTL has not propagated → recovery: confirm the A record resolves to the LB VIP from outside the cluster (`dig +short <fqdn>`); if it does, retry the listener creation. The pre-baked DNS approach avoids this in the demo.
---
 
## Block 4 — Learner Lab (30 min)
 
### Lab brief (learner-facing)
 
Retire the public IPs from API and DB by deploying a Gateway on `<initials>-nw-private`, deploy a Public Cloud Load Balancer in front of the web tier with two backends, configure HTTPS termination using a managed Let's Encrypt certificate, and confirm that round-robin works across both web backends. Channels: Manager UI for Gateway, LB deployment, and HTTPS certificate; OpenStack CLI for NIC detach and validation queries; SSH for inside-instance validation; `curl` from the learner's laptop for end-to-end checks. End state: API and DB have no public IP, can run `apt update` via the Gateway; LB serves HTTPS on a managed Let's Encrypt cert; round-robin alternates between `<initials>-nw-web-01` and `<initials>-nw-web-02`; the previous Floating IP on the web tier is either deleted or unused (the LB VIP replaces it).
 
### Lab steps (learner-facing)
 
1. Manager UI → Public Cloud → Network → Gateway → create a Gateway attached to `<initials>-nw-private`, size **S**, region GRA. Wait until status is `ACTIVE`. Confirm via `openstack router list` that a router object now exists in the project with one Ext-Net interface and one `<initials>-nw-private` interface.
2. SSH into `<initials>-nw-api-01` (use the public IP for now), run `sudo apt update` to confirm baseline outbound. Then from your laptop or any other terminal, `openstack server remove network <initials>-nw-api-01 Ext-Net`. The public IP is now released. SSH back in — but this time, you have to go through `<initials>-nw-web-01` as a jump host (since API no longer has a public IP). Use `ssh -J ubuntu@<web-public-ip> ubuntu@<api-private-ip>`.
3. From inside `<initials>-nw-api-01`, run `sudo dhclient -r ens4 && sudo dhclient ens4` to refresh the DHCP lease and pick up the Gateway as default route. Then `sudo apt update` — confirm it still works. Outbound is now via the Gateway.
4. Repeat steps 2–3 for `<initials>-nw-db-01`.
5. Add a hostname-injecting line to `<initials>-nw-web-01`'s nginx welcome page: `echo "served by $(hostname)" | sudo tee /var/www/html/index.nginx-debian.html`. Confirm with `curl http://<web-public-ip>`.
6. Snapshot `<initials>-nw-web-01` via the Manager UI (`Snapshots` tab) and wait for the snapshot to reach `ACTIVE`. Then create a new instance `<initials>-nw-web-02` from this snapshot, same flavor (`b3-8`), region GRA, dual-NIC (Ext-Net + `<initials>-nw-private`), same Security Group `<initials>-nw-web-sg`. SSH into `<initials>-nw-web-02`, bring up `ens4` with DHCP, edit the welcome page to inject the new hostname (it should already be different since it was set from the cloud-init hostname).
7. Manager UI → Public Cloud → Network → Load Balancers → create a Load Balancer, size **S**, attached to `<initials>-nw-private`, region GRA. Wait until `ACTIVE` and note the public VIP.
8. Configure the LB: one listener `HTTP/80`, algorithm `ROUND_ROBIN`, one pool containing both web instances as members (private IPs, port 80), health monitor `TCP/80`. Wait until both members show `ONLINE`. **Important**: confirm that `<initials>-nw-web-sg` allows ingress on `80/tcp` from the LB's source range (it already does from `0.0.0.0/0` per Module 2.3, so no change needed).
9. From your laptop, run a 10-iteration `curl` loop against `http://<lb-vip>/` and confirm that responses alternate between `served by <initials>-nw-web-01` and `served by <initials>-nw-web-02`.
10. Manager UI → LB → add a second listener `HTTPS/443`, certificate type **Managed Let's Encrypt**, FQDN `<initials>-northwind.<trainer-provided-zone>` (the trainer provides each learner a delegated subdomain at the start of the lab). Wait for the certificate to validate and the listener to become `ACTIVE`.
11. From your laptop, `curl https://<initials>-northwind.<trainer-zone>/` and confirm that the response is a valid HTTPS page with no TLS chain warning, alternating between the two backends.
12. (Optional, time permitting) Delete the legacy Floating IP from Module 2.3 from the project (`openstack floating ip delete <fip-id>`). The LB VIP is now the only public entry point to Northwind.
### Validation criteria
 
- `openstack server show <initials>-nw-api-01 -c addresses -f value` shows only the `10.50.0.x` private IP (no Ext-Net entry).
- From inside `<initials>-nw-api-01` (via SSH jump from web), `sudo apt update` completes successfully.
- LB members both show `ONLINE` in the Manager UI; `openstack loadbalancer member list <pool-id>` confirms 2 active members.
- A 10-iteration `curl http://<lb-vip>/` loop yields approximately 5 responses from each backend (perfect 5/5 is rare; 4/6 or 6/4 is acceptable due to keepalive).
- `curl https://<initials>-northwind.<trainer-zone>/` returns a 200 with `Server: nginx` and a valid TLS chain (no `-k` flag needed).
### Lab artifacts to produce
 
- A text file `gateway-state.txt` in the learner's lab repo under `module-2-4/` containing the output of `openstack router list`, `openstack router show <gateway-router-id>`, and `openstack server show <initials>-nw-api-01 -c addresses` (proving API is private-only).
- A text file `lb-state.txt` containing `openstack loadbalancer list`, `openstack loadbalancer pool list`, `openstack loadbalancer member list <pool-id>`, and `openstack loadbalancer listener list`.
- A text file `validation.txt` containing the 10-iteration `curl` loop output with both hostnames visible, and the `curl -v https://<fqdn>` output showing the TLS handshake completing successfully.
### Common lab support questions
 
- **"After removing the Ext-Net NIC, my SSH session into the API is dead."** → Expected. Reach the API via SSH jump host: `ssh -J ubuntu@<web-public-ip> ubuntu@<api-private-ip>`. This is the production pattern — bastion / jump host through the web tier.
- **"`sudo apt update` from inside the API instance hangs after I removed Ext-Net."** → DHCP did not refresh the default route. Run `sudo dhclient -r ens4 && sudo dhclient ens4`, then `ip route` to confirm a default via the Gateway's IP, then retry `apt update`.
- **"LB member stays `OFFLINE` even though my nginx is running."** → Two common causes: (1) the Security Group on the backend does not allow ingress from the LB on port 80 — but `<initials>-nw-web-sg` allows from `0.0.0.0/0` already, so this is rare; (2) nginx is bound to `127.0.0.1` only — check `ss -ltn` inside the instance and confirm `0.0.0.0:80` or `*:80`.
- **"Round-robin isn't alternating cleanly, I see 7/3 instead of 5/5."** → HTTP keepalive can cause clumping. Add `--no-keepalive` to `curl` or use `curl -H 'Connection: close'`. Acceptable for the lab — the point is to see both hostnames, not perfect alternation.
- **"Let's Encrypt validation fails — 'DNS record not found'."** → the trainer-provided DNS record must already exist and point to the LB VIP. Confirm with `dig +short <fqdn>`. If the record is missing, ask the trainer (the DNS zone is owned by the trainer, not the learner).
- **"Can I delete the original Floating IP from the web instance?"** → Yes, recommended. The LB VIP replaces it. The web instance only needs its Ext-Net NIC for outbound (`apt update`) — keep that.
---
 
## Block 5 — Micro-check QCM (5 min)
 
Format: 8 single-answer multiple-choice questions, formative (non-certifying).
 
### Question 1
 
- **Stem**: Which of the following is **not** a foundational characteristic of vRack?
- **Correct answer**: C. Provides automatic IPSec encryption between connected products.
- **Distractors**:
  - A. Connects multiple OVHcloud products (Public Cloud, Bare Metal, Hosted Private Cloud) at Layer 2 — *Why wrong*: this is a true characteristic of vRack.
  - B. Can span multiple datacenters (GRA, BHS, SBG) — *Why wrong*: multi-DC is a true characteristic.
  - D. Supports VLAN tagging to carve sub-segments — *Why wrong*: VLAN-capable is a true characteristic.
- **LO traced**: `LO-NET-K03`
- **Bloom level**: Remember
### Question 2
 
- **Stem**: An operator running a Public Cloud Instance needs a public IPv4 that can be reassigned between two Public Cloud Instances in seconds, for failover purposes. Which OVHcloud product is the right tool?
- **Correct answer**: A. Floating IP, created via `openstack floating ip create Ext-Net`.
- **Distractors**:
  - B. Additional IP, ordered from the dedicated services section of the Manager — *Why wrong*: Additional IP is designed for cross-product scenarios (mainly Bare Metal); for Public Cloud workloads, Floating IP is the right tool.
  - C. A second Public Cloud Instance running keepalived to share an IP — *Why wrong*: technically possible but requires disabling Neutron's MAC/IP spoofing prevention; not the canonical tool.
  - D. A vRack VLAN with a dedicated IP range — *Why wrong*: vRack is L2, not an IP allocation service; misuses the product.
- **LO traced**: `LO-NET-K04`
- **Bloom level**: Apply
### Question 3
 
- **Stem**: A learner deploys a Gateway on a private network and expects to expose a private-only instance to the Internet via the Gateway. What actually happens?
- **Correct answer**: B. The Gateway only provides SNAT for outbound traffic from the private instance to the Internet; inbound from the Internet to the private instance still requires a Floating IP or a Load Balancer.
- **Distractors**:
  - A. The Gateway automatically exposes every instance on the private network with a public IP — *Why wrong*: the Gateway is SNAT-outbound only, not a DNAT inbound mapper.
  - C. The Gateway forwards all inbound TCP traffic on standard ports to the first instance on the private network — *Why wrong*: no such automatic port forwarding behaviour exists.
  - D. The Gateway acts as a transparent bridge between the public Internet and the private network — *Why wrong*: a Gateway is a SNAT router, not an L2 bridge.
- **LO traced**: `LO-NET-K05`
- **Bloom level**: Understand
### Question 4
 
- **Stem**: A Northwind operator is sizing a Public Cloud Load Balancer for a staging environment with low traffic (~50 requests per second, two web backends). Which sizing tier is the most appropriate first pick?
- **Correct answer**: A. Size **S**, with the option to upgrade in-place to **M** later if monitoring shows saturation.
- **Distractors**:
  - B. Size **L**, because staging environments should be over-provisioned to anticipate growth — *Why wrong*: oversizing inflates cost without operational benefit; LB tiers are changeable in-place.
  - C. Size **XL**, because anti-DDoS protection scales with the LB size — *Why wrong*: anti-DDoS is a backbone-level service, not tier-dependent.
  - D. No size selection needed — the LB auto-scales based on traffic — *Why wrong*: the OVHcloud LB is fixed-tier, not auto-scaling at the Associate scope.
- **LO traced**: `LO-NET-K06`, `LO-NET-S05`
- **Bloom level**: Apply
### Question 5
 
- **Stem**: An operator configures HTTPS termination on a Public Cloud Load Balancer using a managed Let's Encrypt certificate. What is the prerequisite step that must happen **before** creating the HTTPS listener?
- **Correct answer**: D. A DNS A record pointing the chosen FQDN to the Load Balancer's public VIP must already exist and resolve, so the ACME validation can succeed.
- **Distractors**:
  - A. The certificate must be uploaded manually as a PEM file via the Manager — *Why wrong*: that's the customer-provided certificate path, not the managed Let's Encrypt path.
  - B. Each backend instance must have a copy of the certificate installed locally — *Why wrong*: TLS terminates at the LB; backends speak plain HTTP on the private network.
  - C. The Load Balancer must be in size L or higher to support managed certificates — *Why wrong*: all four sizing tiers include managed Let's Encrypt.
- **LO traced**: `LO-NET-S06`
- **Bloom level**: Apply
### Question 6
 
- **Stem**: A Northwind operator has a Bare Metal server running a legacy analytics database in colocation, and a Public Cloud Instance that needs to reach it without crossing the public Internet. Which OVHcloud network primitive enables this?
- **Correct answer**: C. A vRack with both the Bare Metal server and the Public Cloud project attached on the same VLAN tag, with a private network in the Public Cloud project bridged into the vRack.
- **Distractors**:
  - A. A Floating IP shared between the Bare Metal and the Public Cloud Instance — *Why wrong*: Floating IPs are Public Cloud project objects, not cross-product.
  - B. A Public Cloud Gateway with a route added to the Bare Metal's public IP — *Why wrong*: that goes through the public Internet, not OVHcloud's private backbone.
  - D. A second NIC on the Public Cloud Instance attached to the Bare Metal's IP range — *Why wrong*: Neutron does not let an instance attach to a network it doesn't own; vRack is the bridging mechanism.
- **LO traced**: `LO-NET-S07`
- **Bloom level**: Apply
### Question 7
 
- **Stem**: OVHcloud Anti-DDoS protects against which of the following attack categories?
- **Correct answer**: A. Volumetric network-layer attacks (SYN flood, UDP flood, amplification), absorbed upstream at the OVHcloud backbone level, included for free on every public IP.
- **Distractors**:
  - B. Application-layer attacks such as SQL injection and cross-site scripting — *Why wrong*: those are WAF concerns, not Anti-DDoS scope.
  - C. Credential-stuffing and brute-force login attempts on the application — *Why wrong*: application-layer abuse, out of Anti-DDoS scope.
  - D. Slow HTTP attacks (slow loris) targeting the application layer — *Why wrong*: application-layer attack, mitigated by WAFs or rate-limiting, not by Anti-DDoS.
- **LO traced**: `LO-NET-K07`
- **Bloom level**: Understand
### Question 8
 
- **Stem**: A Northwind architect is designing the network topology for the production environment. The app has one public-facing web tier (needs HTTPS, redundancy, and DDoS protection), one private API tier, one private database tier, and must reach a legacy on-premises payroll system over an OVHcloud Bare Metal in colocation. Which topology is the most appropriate?
- **Correct answer**: B. A Public Cloud project with one private network, two web backends behind a Load Balancer (HTTPS termination, anti-DDoS included), API and DB private-only with a Gateway for outbound, and a vRack bridging the private network to the Bare Metal payroll server.
- **Distractors**:
  - A. A Public Cloud project with three Floating IPs (one per tier), tiered Security Groups, and an IPSec VPN to the on-premises payroll system — *Why wrong*: misses redundancy on the web tier (single FIP, no LB), and IPSec over public Internet is inferior to vRack for OVHcloud-to-OVHcloud connectivity.
  - C. A Public Cloud project with a Load Balancer in front of all three tiers, vRack on the API tier only, no Gateway — *Why wrong*: LB on DB makes no sense (DB is not a load-balanced service); vRack on API only doesn't help the payroll bridge.
  - D. A Bare Metal-only architecture, with the web tier hosted on Bare Metal and a vRack to the colocation site — *Why wrong*: abandons Public Cloud entirely, doesn't fit the certification scope (Public Cloud Core).
- **LO traced**: `LO-NET-A01`
- **Bloom level**: Analyze
---
 
## Block 6 — Wrap-up & Transition (5 min)
 
### Recap
 
By the end of this module the learner can:
- **Define** vRack and its four foundational characteristics — multi-product, multi-DC, true Layer-2, VLAN-capable (`K03`)
- **Distinguish** Floating IP (Public Cloud project object) from Additional IP (cross-product OVHcloud product) and pick the right tool (`K04`)
- **Explain** the role of a Gateway: SNAT for outbound from private-only instances, not an inbound exposure mechanism (`K05`)
- **Describe** the Public Cloud Load Balancer — Octavia-based, listeners/pools/members/health-monitors, four sizing tiers, HTTPS termination, anti-DDoS included (`K06`)
- **Identify** the OVHcloud Anti-DDoS scope: network-layer volumetric protection, included for free, not a WAF (`K07`)
- **Deploy** a Public Cloud Load Balancer with two backend instances and verify round-robin (`S05`)
- **Configure** HTTPS termination on the Load Balancer with a managed Let's Encrypt certificate (`S06`)
- **Explain** how a Public Cloud private network can join a vRack to reach a Bare Metal at Layer-2 (`S07`)
- **Recommend** a network topology (public-only, public+private, vRack-extended) for a given architectural need (`A01`)
- **Apply** least-privilege ingress by reflex when designing network access (`A02`, anchored in 2.3 and reinforced today)
### Transition to next module via red-thread scenario
 
Northwind has now reached a production-shape network topology. The Load Balancer terminates HTTPS on a managed certificate that auto-renews; behind it, two web backends serve traffic alternately, and a Security Group composition keeps each tier reachable only from the tier above it. The API and DB tiers no longer carry public IPs — outbound traffic flows through the Gateway, inbound traffic is impossible from the public Internet. The network looks right. But the **identities and the secrets** are still naive: the PostgreSQL password is hardcoded in the API configuration file, the project's IAM is the default (everyone in the project sees everything), the SSH keys to the instances are the same flat key shared by the whole team, and the trainer's IP is hardcoded in every Security Group. Module 2.5 — Identity, Access & Security — Beyond Basics — takes this production-shape network and overlays the production-shape identity and secret management it needs to actually be deployable. We will introduce IAM policies scoped to specific operators, store credentials in the Secret Manager, scope SSH key distribution, and revisit the Security Group sources to use IAM-rooted identities instead of bare CIDRs where applicable.
 
---
 
## Trainer FAQ (anticipated questions for this module)
 
**Q: What is the difference between a Gateway and a NAT router I'd configure on a Linux instance myself?**
A: Functionally identical for SNAT-outbound (both rewrite the source IP and maintain a connection table). Operationally very different: the OVHcloud Gateway is managed (HA, monitored, patched, scaled by OVHcloud), billed per hour per tier, deployed in 30 seconds via the Manager. A self-managed NAT instance on Public Cloud requires an instance, an Ext-Net NIC, disabling Neutron MAC/IP spoofing prevention on its port (`--allowed-address-pairs`), iptables MASQUERADE rules, monitoring, patching, and an HA pair if redundancy matters. The Gateway is the right choice 95% of the time at the Associate scope.
 
**Q: Can I share one Gateway between several private networks in the same Public Cloud project?**
A: No. A Gateway is attached to **one private network** at creation. If you have multiple private networks needing outbound, deploy one Gateway per network. This is occasionally raised as a feature request; the current scoping is one-to-one, and it keeps the routing decision unambiguous.
 
**Q: What happens if the Gateway fails or needs maintenance?**
A: OVHcloud manages the Gateway as a redundant pair internally. From the customer's perspective there is no single Gateway VM to fail — the public IP, the SNAT table, and the default route on the private subnet are maintained across maintenance. There is no failover script for the customer to write. In rare cases (regional incident), Gateway outages do happen and are reported on the OVHcloud status page like any other managed service.
 
**Q: How does the Load Balancer health check decide between TCP and HTTP, and which should I pick?**
A: TCP health checks open a connection on the target port and consider the member healthy if the TCP handshake completes. HTTP health checks open a connection, send an HTTP request to a configured path (e.g., `/health`), and consider the member healthy if the response is 200 (configurable). TCP is sufficient for catching dead instances; HTTP catches dead applications (instance up but nginx crashed). The pragmatic default: TCP for staging, HTTP for production with a dedicated `/health` endpoint.
 
**Q: How are Let's Encrypt managed certificates renewed?**
A: OVHcloud renews them automatically before expiry as long as the DNS record still points to the LB's public VIP. If the DNS record is removed or repointed elsewhere, the renewal fails silently and the certificate eventually expires. The Manager surfaces certificate status in the LB detail page — monitoring this is part of the operations module (3.2).
 
**Q: What is the cost difference between the four LB sizing tiers?**
A: The four tiers (S, M, L, XL) have a roughly linear cost progression — each step doubles capacity for less than double the price, but the actual ratios are documented on the OVHcloud Public Cloud pricing page and change over time. In training, avoid quoting exact figures — refer learners to the official pricing page. The pedagogical point is that sizing is changeable in-place, so starting at S is the safe default.
 
**Q: Can I terminate TLS on the backend instead of the LB, and what are the trade-offs?**
A: Yes. Configure the LB pool with the `HTTPS` protocol pointing to backends speaking HTTPS, and install a certificate on each backend. Pros: end-to-end encryption (sometimes a compliance requirement). Cons: certificate distribution across backends (operational burden), CPU cost on backends instead of the LB, no central renewal. The default at the Associate scope is terminate at the LB; end-to-end is a Professional-level discussion.
 
**Q: Is vRack analogous to AWS VPC peering?**
A: No. VPC peering is a Layer-3 routed connection between two VPCs with route table entries. vRack is a Layer-2 underlay — same broadcast domain, ARP works, multicast works. The closest hyperscaler analogy is **AWS Direct Connect terminating into a Transit Gateway with Layer-2 extensions**, but even that is a stretch. The cleanest legacy analogy is a dark-fibre L2 trunk between two physical datacenters.
 
**Q: Can vRack span across regions, for example GRA to BHS?**
A: Yes — multi-DC is one of vRack's four foundational characteristics. A vRack can attach a Public Cloud project in GRA, a Bare Metal in BHS, and a Hosted Private Cloud in SBG, with all of them on the same Layer-2 underlay. Latency follows the OVHcloud backbone topology, not the public Internet.
 
**Q: Does Anti-DDoS protect against HTTP-layer attacks like slowloris or HTTP flood?**
A: No. Anti-DDoS is a **network-layer** protection: SYN floods, UDP floods, amplification attacks, volumetric traffic absorbed upstream. Application-layer attacks (HTTP flood, slow attacks, credential stuffing) require a WAF and rate-limiting at the application layer — separate products, not covered at the Associate scope.
 
**Q: What happens to the Floating IP when I delete the Load Balancer?**
A: The LB's public VIP is **not** a Floating IP — it is a managed IP allocated by the LB lifecycle. When the LB is deleted, the VIP returns to the pool. If you had a separate Floating IP attached to an instance (as in Module 2.3), it is unaffected by LB lifecycle. In this module's lab, we recommend deleting the legacy Floating IP from Module 2.3 since the LB VIP replaces it as the public entry point.
 
**Q: I see "Octavia" mentioned. Is this OVHcloud's product or OpenStack's?**
A: Octavia is the **upstream OpenStack project** for load balancing — open-source, community-maintained, on Layer-4 and Layer-7. OVHcloud Public Cloud Load Balancer is built on Octavia (with managed lifecycle, HTTPS termination, anti-DDoS integration on top). This is the same pattern as the rest of OVHcloud Public Cloud: open-source upstream foundation, managed delivery, additional features around it. Worth mentioning to learners coming from hyperscaler backgrounds — it grounds the product in a known open-source codebase.
