---
# ============================================================
# Module 2.3 — Network (Part 1) — Public, Private & Security Groups
# Trainer notes — preparation deck
# ============================================================
theme: ../../theme-ovhcloud
title: Network (Part 1) — Trainer Notes
class: text-left
mdc: true
exportFilename: 'modules/module-2-3/trainer-notes'
controls: false
download: false
selectable: true
moduleId: "2.3"
moduleTitle: "Network (Part 1) — Public, Private & Security Groups"
duration: "1h30"
program: "OVHcloud — Public Cloud — Core Associate"
los: [LO-NET-K01, LO-NET-K02, LO-NET-S01, LO-NET-S02, LO-NET-S03, LO-NET-S04]
layout: trainer-cover
---

# Module 2.3 — Trainer Notes
## Network (Part 1) — Public, Private & Security Groups

Preparation deck · ~10 min read · Pair with `slides.md` in `/presenter`

---
layout: default
---

# Pre-flight

- Three Northwind instances from Modules 1.4 / 2.2 alive : `<initials>-nw-web-01`, `-nw-api-01`, `-nw-db-01`. SSH reachable on public IPs.
- `openrc.sh` sourced, scoped to GRA. `openstack token issue` returns valid.
- Placeholder API : `python3 -m http.server 8080` running in a `tmux` session on `nw-api-01`. nginx on `nw-web-01:80`.
- Trainer's laptop public IP written on a sticky for the room — used in every SG `22/tcp` rule of the lab. Must be stable for 90 min.
- Manager open in second tab on the demo project. Untouched until end of demo.
- Plan B : a private network `demo-private` and demo SGs pre-created in the demo project, in case the live CLI fails.

---
layout: default
---

# Block 1 — Sentier battu (5 min)

**Posture**: rapid check-in, not a recap.

- Show of hands on the three Northwind instances + nginx + placeholder API alive. Below half : restart of the missing services together (1 min), no redeploy.
- Trainer IP announced and noted by the room — say it twice, write it on the board.
- Preempt the two recurring confusions verbally : *"vRack is tomorrow morning."* and *"Security Groups are stateful — write the direction you mean, the return is automatic."*

**Anti-pattern**: do not re-run Modules 1.4 or 2.2 here. Fundamentally lost = 1-on-1 at the break.

---
layout: default
---

# Block 2 — Theory (30 min)

**Posture**: ~3 min/slide. High-value moments listed; routine slides follow inline `slides.md` notes.

- **S02** Ext-Net vs private : the legacy DMZ + VLAN analogy lands harder than the AWS VPC analogy with Corporate. Lead with legacy.
- **S04** port object : the mental unlock for Floating IPs. Verbalize *"the port outlives the instance"*. Anchor `K02`.
- **S07** SG default-deny + stateful : **the pivot of the module**. Slow down. Three words to leave with : "stateful", "default deny", "additive". Reframe `K02` and `S03`.
- **S09** Floating IP vs Additional IP : the piège #2. Don't go deep on Additional IP — name it, separate it, move on.

**Anti-pattern**: don't get drawn into the vRack discussion at S02. Park it for 2.4 explicitly.

---
layout: default
---

# Block 3 — Demo (15 min)

**Posture**: you are operating, not lecturing. Verbalize before pressing Enter.

<div class="text-xs">

| # | Action | Verbalize |
|---|---|---|
| 1-2 | `network create demo-private` then `subnet create --dhcp` | "Empty bag, then L3 + DHCP. `--dhcp` is the one to never forget." |
| 3-4 | `server add network demo-web-01 demo-private`, SSH, `dhclient ens4` | "Neutron creates the port. The VM still has to bring it up." |
| 5-6 | Same on `demo-api-01`, then `ping` between privates | "Default SG allows ICMP between same-SG members. The lab will lock this down." |
| 7-8 | `security group create demo-web-sg`, add `80/tcp 0.0.0.0/0` + `22/tcp <trainer-ip>/32`, swap on instance | "Default deny. We open only what we want. **Add before remove.**" |
| 9-10 | From laptop : `curl http://<public-ip>` (OK) then `ping <public-ip>` (timeout) | "ICMP wasn't opened. Default-deny in action." |
| 11-13 | `floating ip create Ext-Net`, `server add floating ip`, `curl http://<fip>` | "Same service, second public entry. To move it, one command." |

</div>

**Failure modes**: `dhclient` no lease → `--dhcp` forgotten at step 2 · NIC name not `ens4` → check `ip link` · SG swap blocks SSH → removed `default` before adding new · FIP "no port found" → multi-NIC, add `--fixed-ip-address`.

---
layout: default
---

# Block 4 — Lab (30 min)

**Posture**: circulate silently. Intervene only on blockers.

- Rollout (2 min) : restate brief + success criteria. Project the 3 Lab Step-by-step slides cyclically.
- Top blockers : `dhclient` no lease (90% : `--dhcp` forgotten) · `--remote-group` rejects SG name (use UUID, command on the slide) · SSH timeout after SG swap (removed default first) · FIP "multiple ports found" (pass `--fixed-ip-address`).
- At 22 min cumulative, the slow half should be at step 9. If under, drop validation step 10 to homework.
- Close (3 min) : verify each learner has `network-state.txt`. *"API and DB still have a public IP. That's tomorrow's first slide."*

**Anti-pattern (yours)**: don't help too early. Let the learner read the timeout for 30 s — they unblock themselves 70% of the time.

---
layout: default
---

# Block 5 — Micro-check (5 min)

**Posture**: formative, 40 s per question average.

- **Q3** (DHCP missing) and **Q5** (stateful) are the pivotal questions. Q3 anchors the lab's main piège, Q5 anchors slide 7.
- On Q5 wrong, reframe immediately : *"stateful = the return packet is on the house"*. Re-walk the SSH example.
- 3+ wrong on Q5 → plan a 2-min opener tomorrow to re-anchor `K02` before introducing the Gateway.

---
layout: default
---

# Block 6 — Wrap-up (5 min)

**Posture**: warm, conclusive. End on the architectural win.

- Recap the 6 verbs quickly : distinguish, explain, create (subnet), attach (dual-NIC), compose (SG), create (FIP).
- Reinforce *"Security Groups are stateful, default-deny, applied per port, additive"* one final time.
- Walk the three loose ends (public IPs on private tiers, cross-product L2, single-frontend SPOF) to transition to Module 2.4.

**Anti-pattern**: do not start Module 2.4 here. End the block on the topology win.

---
layout: two-cols
---

# FAQ (1/2)

::left::

**"vRack vs private network ?"**

Private network = Neutron tenant network, scoped to one Public Cloud project, one region. Today's tool. vRack = cross-product L2 underlay, connects Bare Metal / VPS / other PC projects / cross-region. Provisioned outside any project, billed at account level.

Decision rule : everything inside one PC project → private network. Crosses product lines → vRack (Module 2.4).

::right::

**"DHCP — why so rigid at creation ?"**

The DHCP agent is provisioned for the subnet at creation. Flipping `enable_dhcp` later is not a clean operation : ports may end up in inconsistent lease state. Supported path is delete + recreate, which means detaching every instance first.

Operational lesson : verify `enable_dhcp: True` at step 2 of the lab, before learners attach instances. Catches the bug 10 minutes earlier.

---
layout: two-cols
---

# FAQ (2/2)

::left::

**"Floating IP vs Additional IP ?"**

Floating IP = Neutron object inside a PC project, billed hourly, decoupled from instance lifecycle, ideal for failover/VIP. Always the right answer for Public Cloud-internal needs.

Additional IP = separate OVHcloud product, ordered outside PC project, attached to Bare Metal / VPS / specific PC instance. Enters the conversation only on cross-product setups.

::right::

**"Software VRRP / shared VIP doesn't work ?"**

Neutron blocks packets whose source IP is not on the port's `allowed_address_pairs`. A keepalived virtual IP, an HA proxy, a software router — all hit this.

Fix : `openstack port set --allowed-address ip-address=<vip> <port>` on each candidate port. Document the security tradeoff. At Associate scope : awareness only ; canonical OVHcloud answer is managed Load Balancer (Module 2.4) + Floating IP.

---
layout: default
---

# Post-session debrief

Take 10 min after the day to reflect. Inputs for the next iteration, not a hidden assessment.

- Did the "Security Groups are stateful" moment land at S07 ? If not, the lab will show it (learners writing useless egress rules).
- Did the 3 Lab Step-by-step slides cycle well, or did learners get stuck on 2/3 ? Adjust timing markers.
- Was the trainer IP stable for 90 min ? If not, plan a fallback (allow `0.0.0.0/0` on `22/tcp` with a "remove after class" reminder).
- Parking-lot question you couldn't answer cleanly ? Add to FAQ before next delivery.
