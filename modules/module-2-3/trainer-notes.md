# Module 2.3 — Network (Part 1) — Public, Private & Security Groups — Trainer FAQ

**Audience**: trainer, read before the session.
**Purpose**: vetted answers to questions the persona is most likely to ask during this module. Not a script for delivery — the in-slide notes (HTML comments in `slides.md`) carry the in-session action script. This file is the depth bench: when a learner asks the question, the trainer already knows the answer and its limits.

**Module covers**: `LO-NET-K01`, `LO-NET-K02`, `LO-NET-S01`, `LO-NET-S02`, `LO-NET-S03`, `LO-NET-S04`.

---

## Q1 — What is the difference between a private network in Public Cloud and a vRack? They both sound like "private networking" at OVHcloud.

Two distinct OVHcloud products, with overlapping vocabulary but different scopes and underlying technology. A Public Cloud private network is a Neutron tenant network: it lives inside one Public Cloud project, it is scoped to a region (and within a region, to one or more Availability Zones depending on the topology), and it connects Public Cloud Instances of that project only. It is created, managed, and deleted from inside the project, with Neutron objects (`openstack network`, `openstack subnet`). vRack is a cross-product Layer-2 underlay that OVHcloud operates: it can connect Public Cloud projects, Bare Metal servers, Hosted Private Cloud, VPS, and other product lines, and it can span regions. vRack is provisioned outside any Public Cloud project (it has its own section in the Manager), it is billed and managed at the OVHcloud account level, and integration of a Public Cloud private network into a vRack is an explicit operation. The decision rule is operational scope: if everything that needs to talk lives inside one Public Cloud project, a private network is enough. If the conversation crosses product lines (a Public Cloud Instance needs to reach a Bare Metal server, or two Public Cloud projects need an L2 trunk, or a region must extend to another region), vRack enters. Module 2.4 covers vRack as the cross-product extension of the private-networking story introduced here. The certification at Associate scope expects the learner to know the distinction and to reach for private network first; vRack is a Pro-tier and Specialist topic in depth.

**LO traced**: `LO-NET-K01`, `LO-NET-K02`.
**Likely asker**: Corporate persona who has skimmed the OVHcloud product catalog or who has heard of vRack from a colleague's Bare Metal setup. This is the single most-asked clarification of the module — get it right at the Sentier battu (slide S00b) or it returns at slide 2 with a 5-minute cost.

---

## Q2 — "Stateful Security Group" — what does that actually mean in operational terms, and how is it different from a stateless ACL?

A stateful firewall maintains a connection-tracking table: when an inbound packet is allowed by a rule and starts a connection, the firewall remembers the 5-tuple (source IP, source port, destination IP, destination port, protocol) and automatically permits all subsequent packets of that connection in both directions. A stateless firewall has no such memory: each packet is evaluated independently against the ruleset, and if you want the return packets of a TCP connection to be allowed, you must write an explicit egress rule matching the response packets. In Neutron — and therefore in OVHcloud Public Cloud Security Groups — the firewall is stateful. The operational consequence is that you write only the rule for the direction you want to open: an ingress rule for `22/tcp` from a given source CIDR is enough to make SSH work, the return packets are automatic, and you do not need to add an egress rule for the response. AWS Security Group has identical semantics. AWS Network ACL is stateless and is the source of most "but where is the rule for the return?" confusion in mixed-AWS conversations — but Network ACL is a different object than Security Group, and there is no equivalent in OVHcloud Public Cloud (no stateless layer between Ext-Net and the instance). Azure Network Security Group is stateful too, with the added complication of explicit rule priorities, but the statefulness is the same as Neutron's. The most useful trainer-side framing: "stateful = write the direction you mean, the return is on the house". The learner who internalizes this will not waste lab time writing useless egress rules for SSH responses.

**LO traced**: `LO-NET-K02`, `LO-NET-S03`.
**Likely asker**: any learner with prior AWS Network ACL exposure, or persona Corporate ex-firewall-admin from the iptables / pf era where the stateful vs stateless distinction was the architectural choice. The question almost always arrives at slide 7, and is the pivot of the module — if it is not crisp, slide 8 (composition) lands badly.

---

## Q3 — Why does DHCP have to be enabled when the subnet is created? Why can't I just toggle it later?

Neutron treats `enable_dhcp` as a property attached to the subnet at creation time, and changing it on an existing subnet is not a clean operation in practice. The mechanical reason is that the DHCP agent (a network namespace running `dnsmasq` on the controller side) is provisioned for a subnet that declares DHCP enabled at creation; if the flag is flipped later, the agent has to be reconfigured and ports already created on the subnet may end up in inconsistent states regarding their `dhcp` lease. While `openstack subnet set --dhcp` exists in newer OpenStack versions and works on some deployments, the supported and safe path on OVHcloud Public Cloud is to delete the subnet and recreate it with DHCP enabled — which requires first detaching every instance attached to that subnet, recreating the subnet, and reattaching the instances (the ports get fresh IPs in the process, so any application that pinned an IP must be updated). The operational lesson is to get the flag right at creation, every time, and to never trust a memorized command without an explicit `--dhcp` flag. The protective measure on the lab side is to make `openstack subnet show ... -c enable_dhcp -f value` a deliberate verification step before learners attach instances — catching the missing flag at step 2 of the lab instead of at step 4 saves 10 minutes per affected learner.

**LO traced**: `LO-NET-S01`.
**Likely asker**: operator-profile persona who tries to "fix" a forgotten flag during the lab and discovers the irreversibility. Often asked as "ok I forgot, how do I patch this?" — answer is "you don't patch, you redo, and verify next time".

---

## Q4 — What exactly is a port? Is it the same thing as the Linux NIC inside my instance?

A port is the Neutron-managed virtual NIC object — it exists as a project-level resource in Neutron, with a fixed MAC address, one or more fixed IPs (one per subnet of the parent network), security group bindings, and an admin state. It is the source of truth for the network identity of an instance's network interface. The Linux NIC inside the instance — `ens3`, `ens4`, or whatever the kernel decides to name it — is a hypervisor-side construct that the instance sees: the hypervisor binds the Neutron port to the instance's NIC through the libvirt configuration, the instance receives a NIC with the MAC declared on the port, and from inside the instance the IP arrives via DHCP (the DHCP server being part of the subnet, populated from the port's fixed IP). The crucial property is that the port outlives the instance state: stop the instance and the port stays, restart and the same port (same MAC, same IP) is reattached. This is why Floating IPs work: the Floating IP is attached to the port, not to the NIC inside Linux, and surviving an instance reboot or even a re-creation (if the port is preserved or recreated identically) is straightforward. The legacy analogy that lands well with Corporate persona: a Neutron port is the entry in vCenter for a virtual NIC — it has a MAC reservation, it is attached to a port group (network), and it persists when the VM is powered off. The instance-side `ens4` is just where that port surfaces inside the guest OS.

**LO traced**: `LO-NET-K02`.
**Likely asker**: persona Corporate with virtualization background (VMware, KVM admin) — they recognize the pattern but want the vocabulary nailed down. Also often asked by network-engineer profiles who want to understand where the MAC is "decided".

---

## Q5 — Can I apply a Security Group to a specific NIC of a multi-NIC instance, or does it always cover the whole instance?

Security Groups apply per port, not per instance — this is the fundamental Neutron model and a notable difference from how the question is often phrased. The Manager UI and the high-level commands like `openstack server add security group <instance> <sg>` apply the SG to all ports of the instance, which creates the impression that the binding is at instance scope. But mechanically, the SG is bound to each port individually, and it is fully possible to differentiate the Security Groups of the Ext-Net port and the private network port of a dual-NIC instance via the lower-level `openstack port set --security-group <sg>` and `openstack port unset --security-group <sg>` commands. In practice, at the Associate scope, this granularity is rarely needed: the typical pattern is to apply the same tier-appropriate SG set to all ports of an instance. The case where the granularity matters is when an instance straddles two security postures — for example, an instance with an Ext-Net port that should accept HTTPS from the world and a private port that should accept administrative SSH only from a bastion — in which case differentiating the two ports' SGs is the clean design. Worth mentioning to learners as an unlock for later, without dwelling on it in the module: the design principle is "applied per port", the day-to-day operation is "applied per instance via the helper command".

**LO traced**: `LO-NET-S03`.
**Likely asker**: senior network or security profile, often arriving at slide 8 with "what if I want the SSH rules of the public NIC to be tighter than the private NIC?" — legitimate question, signal of an operator who is thinking ahead.

---

## Q6 — Floating IP vs Additional IP — when do I reach for which? And why are these two products even separate?

The two products exist because they solve different problems and predate each other in the OVHcloud catalog. Floating IP is a Neutron object inside a Public Cloud project: created with `openstack floating ip create Ext-Net`, billed at an hourly rate as part of the project, decoupled from any specific instance (it lives in the project until explicitly deleted), and it can be associated to and dissociated from instances in seconds via the API. Its native use case is failover and movable VIPs inside Public Cloud — the web frontend pattern from today's lab is the textbook example. Additional IP is a separate OVHcloud product, ordered from the dedicated section of the Manager, attached to a specific OVHcloud service (most commonly Bare Metal or VPS, sometimes a specific Public Cloud Instance for legacy reasons), billed as a one-shot or monthly line item, and it is provisioned and routed via different mechanisms than Floating IP. Its native use case is "I need a stable public IP attached to my Bare Metal server that does not depend on the server's primary IP" — a long-standing OVHcloud pattern that predates the Public Cloud offer. For pure Public Cloud workloads, Floating IP is always the right answer and Additional IP should not enter the design. Additional IP becomes relevant in cross-product setups: a customer with a Bare Metal database and a Public Cloud frontend who wants a stable IP on the Bare Metal side that survives the underlying server replacement, for instance. The pricing structures are different and worth verifying on `docs.ovhcloud.com` at the time of a customer conversation — they evolve. The trainer-side framing that works: "if everything you're doing is inside a Public Cloud project, use Floating IP. The day you cross the product line into Bare Metal or VPS, Additional IP becomes a conversation".

**LO traced**: `LO-NET-S04`.
**Likely asker**: Corporate persona with cross-product OVHcloud exposure, often the customer who has already a Bare Metal contract and is migrating workloads to Public Cloud. The question almost always comes up at slide 9 if it has not been preempted, and is the second-most-common piège of the module after the vRack confusion.

---

## Q7 — I tried to set up a software HA proxy on two instances sharing a virtual IP via VRRP, and it does not work. Why?

This is Neutron's MAC/IP spoofing prevention biting. By default, Neutron enforces on every port that outgoing packets must have a source MAC and source IP that match the port's declared MAC and one of its `allowed_address_pairs` (which by default contains only the port's own fixed IPs). When a software HA solution like keepalived/VRRP makes two instances share a third "virtual" IP — typically by having the active member advertise itself via gratuitous ARP with the virtual IP and the port's own MAC — the outgoing packets carry a source IP that is not on the port's allowed list, and Neutron silently drops them. The fix is to declare the virtual IP as an allowed address on the relevant ports: `openstack port set --allowed-address ip-address=<vrrp-ip> <port>` on each candidate port. This must be done deliberately, on each port, and the configuration is part of the security posture — you are loosening Neutron's spoofing protection on these specific ports, and that is a tradeoff worth documenting. The protection exists for good reasons: it prevents a compromised instance from sending packets with an arbitrary source IP and impersonating another instance on the segment. The MAC spoofing equivalent (an instance trying to send packets with a different source MAC) has a similar mechanism via `port_security_enabled` and `allowed_address_pairs` MAC entries. At Associate scope, the message is awareness: "if your software HA / load balancer / router needs to send packets with non-fixed IPs, Neutron will block it unless you explicitly allow it on the port". Deep configuration is Pro-tier territory. For a typical Northwind-style failover need, the canonical OVHcloud Public Cloud answer is the managed Load Balancer (Module 2.4) plus Floating IP (today's module) — both of which sidestep the MAC/IP spoofing concern entirely.

**LO traced**: `LO-NET-K02`, `LO-NET-S03`.
**Likely asker**: senior network or systems profile, often someone who has built keepalived clusters on Bare Metal in the past and is trying to replicate the pattern in Public Cloud. The question may not arrive in every session — but when it does, the trainer who can answer it crisply has earned the room.

---

## Cross-module forward references collected from this module

For convenience, the topics the trainer is most likely to be asked about that point **forward** to later modules — useful to anchor a "we'll cover this in" answer without having to re-derive the mapping live.

| Topic raised | Forward reference |
|---|---|
| Gateway service to give private-only instances outbound Internet access (retire the public NIC on API and DB) | Module 2.4 — Network (Part 2) — Gateway |
| vRack to extend L2 across product lines (Bare Metal, other Public Cloud projects, cross-region) | Module 2.4 — Network (Part 2) — vRack |
| Load Balancer (Octavia) to turn the Floating IP into a balanced VIP across multiple backend instances | Module 2.4 — Network (Part 2) — Load Balancer |
| Anti-DDoS protection on Ext-Net ingress | Module 2.4 — Network (Part 2) — Anti-DDoS |
| IAM scoping of network operations (least privilege on who can modify Security Groups, create Floating IPs, attach networks) | Module 2.5 — Identity & Security |
| Secret Manager for the API and DB credentials that are no longer flying over public IPs | Module 2.5 — Identity & Security |
| Terraform for `openstack_networking_network_v2`, `openstack_networking_subnet_v2`, `openstack_networking_secgroup_v2`, `openstack_networking_floatingip_v2` | Module 3.1 — IaC Essentials |
| cloud-init bringing up the second NIC at boot instead of `dhclient ens4` by hand | Module 3.1 — IaC Essentials (cloud-init was introduced in Module 1.4) |
| Observability of network state, dropped packets at SG level, flow logs | Module 3.2 — Operations & Monitoring |
| Quotas on networks, subnets, ports, Floating IPs per project | Module 3.2 — Operations & Quotas |
| Managed Kubernetes networking model (CNI, ingress controllers, service load balancers) | Out of scope Core; MKS Associate certification |
| Detailed `allowed_address_pairs` configuration for software VIP / VRRP / software load balancers | Out of scope Core Associate; Pro tier |
| BGP / Geneve / OVN internals of the Public Cloud network fabric | Out of scope Core Associate; Specialist tier |
| IPv6 in OVHcloud Public Cloud (provisioning, dual-stack, routing) | Out of scope Core Associate; Pro tier |
| Cross-region private networking (private network spanning multiple regions) | Out of scope Core Associate; Pro tier |
| Sovereign / SecNumCloud constraints on network egress and traffic isolation | Out of scope Core; Specialist tier |
