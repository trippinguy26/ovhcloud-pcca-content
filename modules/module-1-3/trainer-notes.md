---
# ============================================================
# Module 1.3 — Compute (Part 1) — Instances, Flavors & Deployment
# Trainer notes — preparation deck
# ============================================================
theme: ../../theme-ovhcloud
title: Compute (Part 1) — Trainer Notes
class: text-left
mdc: true
exportFilename: 'modules/module-1-3/trainer-notes'
controls: false
download: false
selectable: true
moduleId: "1.3"
moduleTitle: "Compute (Part 1) — Instances, Flavors & Deployment"
duration: "1h30"
program: "OVHcloud — Public Cloud — Core Associate"
los: [LO-CMP-K01, LO-CMP-K02, LO-CMP-K03, LO-CMP-K04, LO-CMP-K05, LO-CMP-K06, LO-CMP-S01, LO-CMP-S02, LO-CMP-S03, LO-CMP-S04]
layout: trainer-cover
---

# Module 1.3 — Trainer Notes
## Compute (Part 1) — Instances, Flavors & Deployment

Preparation deck · ~10 min read · Pair with `slides.md` in `/presenter`

---
layout: default
---

# Pre-flight

- Module 1.2 demo project alive (`openstack token issue` returns valid). Regenerate token before the session if expired.
- Dedicated demo keypair `~/.ssh/demo_ed25519` ready. Never put a personal key on screen.
- Manager open in second browser tab on the demo project. Untouched until demo step 10.
- Terraform read-only snippet pre-written in a text editor (~10 lines HCL), ready to Alt-Tab at step 14.
- Plan B instance pre-deployed in the demo project, in case the live BUILD fails.
- Room check: who runs Windows PuTTY, who has a working `openrc.sh` from yesterday.

---
layout: default
---

# Block 1 — Sentier battu (5 min)

**Posture**: rapid check-in, not a lecture.

- Show of hands on `openrc.sh` and SSH keypair. Below 50%, run `ssh-keygen -t ed25519` together (2 min).
- PuTTY users: group the PuTTYgen conversion in parallel during the lab, not now.
- Close: "If anything else is missing, raise it now. Theory won't pause."

**Anti-pattern**: do not re-run Module 1.2 here. Fundamentally lost = 1-on-1 at the break.

---
layout: default
---

# Block 2 — Theory (30 min)

**Posture**: 3 min/slide average. High-value moments listed; routine slides follow inline `slides.md` notes.

- **S01** opener: verbalize the catalog-vs-build shift. Don't minimize ex-VMware friction.
- **S05** ephemeral disk: slow down. *"Delete the instance, the disk is gone forever."* Install reflex `A03`.
- **S07** SSH: walk Mermaid slowly. Private key never leaves the workstation. `ubuntu`, never `root`. Attitude `A02`.
- **S08** three channels: the "aha" moment. *"Manager = CLI = Terraform = API. One object, four interfaces."*

**Anti-pattern**: don't recite RAM/vCPU ratios per flavor. The doc is authority.

---
layout: default
---

# Block 3 — Demo (15 min)

**Posture**: you are operating, not lecturing. Verbalize before pressing Enter.

<div class="text-xs">

| # | Action | Verbalize |
|---|---|---|
| 1-3 | `token issue` → `keypair create` → `keypair list` + Alt-Tab Manager | "Key in project, not in instance. Same object, two angles." |
| 4-7 | `image list \| grep ubuntu 24`, capture `IMG`, `network list`, capture `NET` | "We capture UUIDs, we don't retype." |
| 8-9 | `server create --image $IMG --flavor d2-2 --key-name demo-key --network $NET demo-web-01` then poll `server show` | "BUILD. ~30 s in GRA. Wait ACTIVE + IP." |
| 10 | Refresh Manager tab | *"Manager = CLI."* |
| 11-12 | Capture `IP`, `ssh -i ~/.ssh/demo_ed25519 ubuntu@$IP` | "User `ubuntu`, never `root`." |
| 13-14 | `uname -a && cat /etc/os-release \| head -3 && df -h /`, then Alt-Tab Terraform snippet | *"This disk dies with the instance. Hands-on Module 3.1."* |

</div>

**Failure modes**: keypair file not found → wrong path · BUILD > 2 min → fall back to Plan B instance · SSH timeout post-ACTIVE → cloud-init delay (wait 30 s) or default SG altered · flavor not allowed → Discovery project, swap.

---
layout: default
---

# Block 4 — Lab (30 min)

**Posture**: circulate silently. Intervene only on blockers.

- Rollout (2 min): restate brief + success criteria. Project the Lab Step-by-step slide for the duration.
- Top blockers: Permission denied (wrong user/key) · Connection timed out (cloud-init or workstation outbound 22) · flavor unavailable (Discovery project) · no public IP (`Ext-Net` not checked).
- Close (3 min): at 27 min announce 3-min warning. At 30 min hard stop. *"The instance stays running. We use it tomorrow."*

**Anti-pattern (yours)**: don't help too early. Let the learner read the error for 30 s — they unblock themselves 70% of the time.

---
layout: default
---

# Block 5 — Micro-check (5 min)

**Posture**: formative, 40 s per question average.

- **Q4** (ephemeral disk, attitude `A03`) and **Q7** (root SSH, attitude `A02`) are the pivotal questions.
- On wrong answers, reframe immediately with S05 SAN-LUN analogy and S07 non-negotiable posture.
- 3+ wrong on Q4 → plan a 2-min opener tomorrow to re-anchor `K04`.

---
layout: default
---

# Block 6 — Wrap-up (5 min)

**Posture**: warm, conclusive. Capitalize on the lab win.

- Recap the 7 verbs quickly: define, identify, decode, distinguish, explain, deploy, connect.
- Reinforce *"Manager = CLI = API"* one final time.
- Walk the CTO scenario to transition to Module 1.4 (hardening, lifecycle, diagnostics).

**Anti-pattern**: do not start Module 1.4 here. End the day on the win.

---
layout: two-cols
---

# FAQ (1/2)

::left::

**"Why no custom sizing?"**

IaaS trades per-instance flexibility for catalog speed and predictable cost. Pick the closest flavor up, the over-provisioning cost is negligible. Exotic ratio = signal for Bare Metal or Hosted Private Cloud, not a fight with the catalog.

**"Why no root password?"**

Password-based root is the dominant attack vector on Internet-exposed Linux. Fallback is the SSH keypair plus Rescue mode (Module 1.4). CIS and ANSSI baselines recommend exactly this posture by default.

::right::

**"Can I shrink a Flex disk?"**

No, growth is one-way. Deploy smaller, migrate, retire. Shared constraint across most cloud providers. Practical: under-provision initially, grow as needed.

**"Marketplace images for Corporate?"**

Generally no. Third-party app lifecycle, black box for hardening. Corporate pattern: clean public OS image + internal config via Ansible/cloud-init. Marketplace fits self-service Digital Starter.

---
layout: two-cols
---

# FAQ (2/2)

::left::

**"GPU in scope?"**

Awareness only at Associate. Deployment procedure identical to today's lab; complexity is in the OS-layer GPU stack which the customer owns. AI tier of certifications for hands-on.

::right::

**"Stop vs delete?"**

Stopped instance keeps disk/IP/volumes and still bills hypervisor capacity (same as EC2). Deleted is gone, billing stops. Indefinite pause pattern: snapshot, delete, redeploy when needed (Module 1.4).

---
layout: default
---

# Post-session debrief

Take 10 min after the day to reflect. Inputs for the next iteration, not a hidden assessment.

- Which slides drew the most clarifying questions? Candidate for refinement.
- Did the "Manager = CLI = API" moment land at S08 and demo step 10? If not, repeat at Module 1.4 opener.
- Did the lab fit in 30 min for >80% of learners? If not, tighten brief or steps slide.
- Parking-lot question you couldn't answer cleanly? Add to FAQ before next delivery.
