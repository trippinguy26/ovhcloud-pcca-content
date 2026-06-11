---
# ============================================================
# Module 2.4 — Network (Part 2) — vRack, Load Balancer & Gateway
# Trainer notes — preparation deck
# ============================================================
theme: ../../theme-ovhcloud
title: Network (Part 2) — Trainer Notes
class: text-left
mdc: true
exportFilename: 'modules/module-2-4/trainer-notes'
controls: false
download: false
selectable: true
moduleId: "2.4"
moduleTitle: "Network (Part 2) — vRack, Load Balancer & Gateway"
duration: "1h30"
program: "OVHcloud — Public Cloud — Core Associate"
los: [LO-NET-K03, LO-NET-K04, LO-NET-K05, LO-NET-K06, LO-NET-K07, LO-NET-S05, LO-NET-S06, LO-NET-S07, LO-NET-A01, LO-NET-A02]
layout: trainer-cover
---

# Module 2.4 — Trainer Notes
## Network (Part 2) — vRack, Load Balancer & Gateway

Preparation deck · ~10 min read · Pair with `slides.md` in `/presenter`

---
layout: default
---

# Pre-flight

- Module 2.3 demo state alive: `demo-web-01` + `demo-api-01` dual-NIC, tiered SGs, Floating IP on web. Regenerate via `recover-network-state.sh` if needed.
- **Pre-baked DNS record**: `demo-northwind.<trainer-zone>` pointing to a placeholder LB VIP. Without this, the live HTTPS step waits 5 min on ACME propagation. Non-negotiable prep item.
- **Per-learner DNS subdomains** delegated in the trainer-controlled zone. Diffuse mapping `<initials>` to FQDN on Slack or whiteboard at lab start.
- Plan B Gateway pre-deployed in the demo project, warm standby for regional capacity glitches.
- Manager UI open in second tab. CLI in main terminal.
- Room check: who finished 2.3, who lost their stack overnight.

---
layout: default
---

# Block 1 — Sentier battu (5 min)

**Posture**: rapid stack check, not a re-teach of 2.3.

- Show of hands: stack from 2.3 still up? If <70%, launch `recover-network-state.sh` in parallel during Block 2 opener.
- Diffuse the per-learner FQDN mapping. Write at the board so it stays visible the whole module.
- Pre-empt the three-way confusion: *"Gateway = outbound. LB = inbound distribution. vRack = cross-product L2. Three different jobs."*
- Close: "If anything else is missing, raise it now."

**Anti-pattern**: do not re-explain Security Groups. If a learner genuinely lost the SG model, 1-on-1 at the break.

---
layout: default
---

# Block 2 — Theory (30 min)

**Posture**: dense module. 12 slides, 30 min, ~2.5 min/slide. Hold the pace.

- **S04** Gateway role: **the pivot slide of the module**. Slow down. Two phrases at the board: *"SNAT outbound"* and *"not inbound"*. Attitude reflex `A01`.
- **S06** Floating IP vs Additional IP: closes the suspense from 2.3. *"On Public Cloud, default Floating IP. Additional IP is the Bare Metal heritage."*
- **S09** LB sizing: do **not** cite specific throughput or pricing figures. Pricing page is authority. Pre-empt the AWS ALB auto-scaling assumption.
- **S11** Anti-DDoS scope: it protects the network, not the application. WAF is a separate product, hors scope.

**Anti-pattern**: do not improvise vRack architectural depth. Stay at the four foundational characteristics.

---
layout: default
---

# Block 3 — Demo (15 min)

**Posture**: you are operating, not lecturing. Verbalize before pressing Enter.

<div class="text-xs">

| # | Action | Verbalize |
|---|---|---|
| 1-2 | Manager: Gateway create on `demo-private`, size S, then `openstack router list` | "Managed SNAT router. Active in 30 s." |
| 3-5 | SSH api-01, `apt update` OK, then `server remove network demo-api-01 Ext-Net`, then SSH via jump host, `dhclient -r/-` + `apt update` OK | "Same instance, same apt, but the route changed. SNAT in action." |
| 6-7 | Manager: LB create, size S, attach `demo-private`, then add listener HTTP/80 + pool + member `demo-web-01` + health TCP/80 | "Octavia under the hood. One backend equals pass-through." |
| 8 | Laptop: `for i in {1..5}; do curl http://<vip>/; done` | "Five hits, one hostname. Now we add the second." |
| 9-11 | Snapshot `demo-web-01`, spawn `demo-web-02` (dual-NIC), add to pool, `curl` loop 10x | "Alternating hostnames. Round-robin." |
| 12-13 | Add HTTPS/443 listener with managed Let's Encrypt (pre-baked DNS), then `curl https://<fqdn>` | "TLS terminates here. Backends speak HTTP on the private network." |

</div>

**Failure modes**: Gateway stuck BUILDING > 2 min, use Plan B Gateway · `apt update` fail after detach, run `dhclient -r ens4 && dhclient ens4` to refresh default route · LB member OFFLINE, check SG ingress on health-check port (web-sg from Mod 2.3 already allows 0.0.0.0/0) · ACME validation fail, confirm `dig +short <fqdn>` resolves to LB VIP, retry.

---
layout: default
---

# Block 4 — Lab (30 min)

**Posture**: circulate silently. The lab is dense, intervene on real blockers, not on early reading.

- Rollout (2 min): restate brief + success criteria. Project the Lab Steps slides for the duration.
- Top blockers: SSH session dead after Ext-Net detach (expected, use `ssh -J` jump host) · `apt update` hangs (`dhclient -r/-` to refresh) · LB member OFFLINE (nginx bound to `127.0.0.1` only) · Let's Encrypt fails (DNS not propagated, trainer zone misconfigured).
- At 20 min, if >50% of room still on step 7-8: declare step 15 (delete legacy FIP) optional homework. Protect the HTTPS finish.
- Close (3 min): announce 3-min warning at 27 min. Hard stop at 30. *"The LB and Gateway stay running. Mod 2.5 builds on this topology."*

**Anti-pattern (yours)**: don't help on the SSH jump host before the learner has read the disconnect error. 30 s of silence unblocks 70% of them.

---
layout: default
---

# Block 5 — Micro-check (5 min)

**Posture**: formative, 40 s per question average. 8 questions, watch the clock.

- **Q3** (Gateway role, `K05`) and **Q5** (HTTPS prerequisite, `S06`) are the pivotal questions. Wrong equals re-anchor with S04 and S10 immediately.
- **Q4** (LB sizing, AWS-ALB-auto-scale trap) is the calibration question for ex-AWS profiles. 3+ wrong, plan a 2-min opener at 2.5 to re-anchor `K06`.
- **Q8** (topology recommendation, `A01`): integrative, signals overall module grip. Wrong equals revisit S04, S07-S09 in wrap-up.

---
layout: default
---

# Block 6 — Wrap-up (5 min)

**Posture**: warm, conclusive. Northwind has reached production-shape network.

- Recap the 10 verbs: define / distinguish / explain / describe / identify / deploy / configure / explain / recommend / apply.
- Announce the milestone: 16 LOs of the Network domain validated (6 in 2.3 + 10 here). **Network domain closed.**
- Walk the CTO scenario to transition to Module 2.5: the network is production-shape, but identities and secrets are still naive.

**Anti-pattern**: do not start Module 2.5 here. End Day 2 on the win.

---
layout: two-cols
---

# FAQ (1/2)

::left::

**"Why a managed Gateway, I'd write iptables in 15 min?"**

Functionally equivalent SNAT. Operationally the managed path wins on HA (internal redundancy, no failover script), patching (not customer's problem), and `allowed_address_pairs` complexity (managed product sidesteps it). The hourly Gateway cost is below the all-in cost of a properly-run self-managed HA pair.

**"Can I share one Gateway between several private networks?"**

No. One Gateway per private network at creation. Architectural reason: unambiguous default routing per subnet. Workaround for multi-network projects: one Gateway per network, sized per traffic profile.

::right::

**"TCP vs HTTP health check, which do I pick?"**

TCP for staging or where "port open" reliably proxies "service works". HTTP for production with a dedicated `/health` endpoint, catches the case where the listener is up but the application is dead. Default interval, timeout, retry are reasonable starting points; tightening them is Module 3.2 territory.

**"How are managed Let's Encrypt certs renewed?"**

Automatic renewal as long as the DNS A record still points to the LB VIP. Manager surfaces cert status on the LB detail page. Failure mode: silent expiry if DNS gets repointed elsewhere. Monitoring item, not fire-and-forget.

---
layout: two-cols
---

# FAQ (2/2)

::left::

**"LB sizing cost, which tier is right?"**

Specific pricing on the OVHcloud pricing page (do not memorize figures). Heuristic: start S in staging, M for small SaaS production, upgrade in-place when monitoring shows saturation. Capacity scales faster than price across tiers, over-provisioning at S is the common mistake to avoid.

**"Is vRack like AWS VPC peering?"**

No. VPC peering is Layer-3 routed. vRack is Layer-2 underlay, broadcast, multicast, ARP all flow. Closest legacy analog: dark-fibre L2 trunk between datacenters. Multi-region is supported (GRA + BHS + SBG on one vRack), and that's the OVHcloud differentiator.

::right::

**"Anti-DDoS, does it cover HTTP flood or slow loris?"**

No. Anti-DDoS is network-layer: SYN, UDP floods, amplification, volumetric. Application-layer attacks (HTTP flood, slow loris, credential stuffing) need a WAF, separate product, hors scope Public Cloud Core. Frame to ex-AWS: OVHcloud's free baseline is broader than AWS Shield Standard on network-layer.

**"Can I terminate TLS at the backend instead of the LB?"**

Yes. Pool in `HTTPS`, cert on each backend. Trade-off: end-to-end encryption (compliance argument), CPU per backend, harder rotation. Default at Associate: terminate at the LB. End-to-end TLS is a Pro+ design decision.

---
layout: default
---

# Post-session debrief

Take 10 min after the day to reflect. Inputs for the next iteration, not a hidden assessment.

- Did the slide S04 (Gateway = SNAT outbound, not inbound) land cleanly? If still confused at micro-check Q3, re-anchor at 2.5 opener.
- Did the SSH jump host pattern surprise learners more than expected? Adjust Block 1 framing next iteration.
- Did the lab fit in 30 min for >70% of learners? If not, the HTTPS step is the cut candidate (declare it homework with a pre-baked solution).
- Parking-lot question you couldn't answer cleanly (Octavia internals, vRack overlay tech, IPv6, L7 routing)? Add to FAQ or to the cross-module table before next delivery.
