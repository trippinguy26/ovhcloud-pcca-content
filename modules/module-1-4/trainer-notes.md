---
# ============================================================
# Module 1.4 — Compute (Part 2) — Lifecycle, Security & Diagnostics
# Trainer notes — preparation deck
# ============================================================
theme: ../../theme-ovhcloud
title: Compute (Part 2) — Trainer Notes
class: text-left
mdc: true
exportFilename: 'modules/module-1-4/trainer-notes'
controls: false
download: false
selectable: true
moduleId: "1.4"
moduleTitle: "Compute (Part 2) — Lifecycle, Security & Diagnostics"
duration: "1h30"
program: "OVHcloud — Public Cloud — Core Associate"
los: [LO-CMP-S05, LO-CMP-S06, LO-CMP-S07, LO-CMP-S08, LO-CMP-S09, LO-CMP-A02, LO-CMP-A03]
layout: trainer-cover
---

# Module 1.4 — Trainer Notes
## Compute (Part 2) — Lifecycle, Security & Diagnostics

Preparation deck · ~10 min read · Pair with `slides.md` in `/presenter`

---
layout: default
---

# Pre-flight

- `demo-web-01` from Module 1.3 demo still running and SSH-reachable. If destroyed overnight, redeploy via the 1.3 CLI sequence (~3 min) before the session.
- `openrc.sh` re-sourced this morning, `openstack token issue` returns valid.
- Demo workstation public IP at hand: `curl -s ifconfig.me` writes to a sticky note. Used at demo step 4.
- Second instance `demo-broken-cloudinit` pre-deployed with a malformed user-data file (tab indentation). Boot it, let it fail, keep the name handy for demo step 14.
- Screenshot of a real broken cloud-init console log saved locally. Fallback for demo step 14 if the live log is empty.
- Manager open in second browser tab on the demo project, untouched until demo step 5.
- Terraform read-only snippet pre-written (5 lines HCL: `openstack_compute_secgroup_v2` + `openstack_compute_instance_v2` with `user_data`), ready to Alt-Tab at step 15.
- Room check: who still has `<initials>-nw-web-01` running, who edits on Windows (CRLF risk on cloud-init).

---
layout: default
---

# Block 1 — Sentier battu (5 min)

**Posture**: rapid check-in, not a lecture.

- Show of hands on `<initials>-nw-web-01` still SSH-reachable. Below 50%, redeploy together in 2 min via the 1.3 CLI sequence, or pair with neighbors for the SG and snapshot exercises.
- Windows + VSCode users: demonstrate **once** the CRLF → LF switch in the status bar. Disarms 80% of the cloud-init bugs in the lab.
- Public IP detection blocked on corporate network: hand out `dig +short myip.opendns.com @resolver1.opendns.com` as the fallback.
- Close: *"If anything else is missing, raise it now. Theory won't pause."*

**Anti-pattern**: do not re-run Module 1.3 here. Lost on instance basics = 1-on-1 at the break.

---
layout: default
---

# Block 2 — Theory (30 min)

**Posture**: 3 min/slide average across 10 slides. High-value moments listed; routine slides follow inline `slides.md` notes.

- **S02** Security Groups: anchor the stateful + default-deny model. *"Egress is auto-allowed for return traffic. You write ingress only."* Install attitude `A02`.
- **S05** cloud-init YAML: slow down on `#cloud-config` first line and indentation. *"Tab indentation = silent break. CRLF = silent break."* Disarms the lab.
- **S06** snapshots: hammer *"snapshot ≠ backup, snapshot ≠ in-place rollback"*. Install attitude `A03`.
- **S08** console log: the "aha" moment. *"Status ACTIVE + SSH dead = read the log, do not reboot blind."*
- **S10** five reflexes: read them aloud. *"This is what hardening means at infra layer. The OS layer is the Pro tier."*

**Anti-pattern**: don't list cloud-init modules exhaustively. Point to `cloudinit.readthedocs.io`.

---
layout: default
---

# Block 3 — Demo (15 min)

**Posture**: you are operating, not lecturing. Verbalize before pressing Enter.

<div class="text-xs">

| # | Action | Verbalize |
|---|---|---|
| 1-2 | `token issue` → `curl -s ifconfig.me`, capture `MY_IP` | *"This IP, not a range. /32 in production."* |
| 3-4 | `security group create demo-ssh-office` → add rule `tcp/22` from `$MY_IP/32` | *"ALLOW only. There is no DENY."* |
| 5-6 | `server add security group demo-web-01 demo-ssh-office` → Alt-Tab Manager → remove `default` | *"Same object, two angles."* |
| 7 | From workstation: `ssh ubuntu@<demo-web-01-ip> "uname -a"` | *"SSH passes only from this workstation now."* |
| 8-9 | `server image create --name demo-web-01-baseline demo-web-01` → `image list --private` | *"Crash-consistent. Not application-consistent. Not a backup."* |
| 10-13 | Manager: trigger Rescue → SSH with temp password → `mount /dev/sdb1 /mnt` → fix → `umount` → exit Rescue | *"Different image. Original disk attached secondary. We mount, we fix, we exit."* |
| 14 | `openstack console log show demo-broken-cloudinit \| tail -50` | *"Look for `cloud-init.*FAIL` or absence of `Cloud-init v. X.Y finished`."* |
| 15 | Alt-Tab Terraform snippet (5 lines HCL, read-only) | *"All of this, in HCL. Hands-on Module 3.1."* |

</div>

**Failure modes**: step 6 default not removed → re-check with `server show -c security_groups` · step 7 SSH timeout → corporate NAT pool rotated, re-curl `ifconfig.me` · step 10 Rescue stuck "transitioning" > 2 min → switch to backup instance · step 14 empty log → show the saved screenshot.

---
layout: default
---

# Block 4 — Lab (30 min)

**Posture**: circulate silently. Intervene only on blockers.

- Rollout (2 min): restate brief + success criteria. Project the Lab Step-by-step slides for the duration (slide 1/2 first 10 min, slide 2/2 after).
- Top blockers: default SG not removed from `nw-web-01` (90% of SSH timeouts on the new instances) · workstation public IP changed mid-lab (NAT rotation) · YAML indentation tab vs space (silent cloud-init break) · CRLF line endings on Windows (silent cloud-init break) · PostgreSQL `runcmd` race lost (`systemctl enable --now postgresql` manual recovery).
- Silent validation while circulating: 3 instances `ACTIVE`, all on `nw-ssh-office` only, snapshot `Active`, motd visible on api+db, nginx + postgresql running.
- Close (3 min): at 27 min announce 3-min warning. At 30 min hard stop. *"The three instances stay up. They become Module 2.1's database tier and Module 2.3's private network."*

**Anti-pattern (yours)**: don't help too early. Let the learner read the error for 30 s — they unblock themselves 70% of the time.

---
layout: default
---

# Block 5 — Micro-check (5 min)

**Posture**: formative, 40 s per question average across 7 questions.

- **Q1** (default SG deny, `S05` + `A02`) and **Q7** (five hardening reflexes, `A02`) are the pivotal questions on security posture.
- **Q3** (snapshot scope, `S07` + `A03`) and **Q6** (ephemeral disk anticipation, `A03`) are the pivotal questions on data durability.
- On wrong answers, reframe immediately: Q1 → "default-deny, you write the exceptions" · Q3 → "local disk only, volumes have their own snapshots, Module 2.1" · Q6 → "ephemeral dies with the instance, plan persistence at design time."
- 3+ wrong on Q3 or Q6 → plan a 2-min reopener at Module 2.1 to re-anchor persistent storage vs ephemeral.

---
layout: default
---

# Block 6 — Wrap-up (5 min)

**Posture**: warm, conclusive. End-of-Day-1 momentum.

- Recap the 7 verbs quickly: configure, inject, create, enter, read, identify, anticipate.
- Reinforce *"The three Northwind tiers stay UP. We use them again tomorrow on volumes and on private network."*
- Walk the CTO scenario to transition to Module 2.1 (Block Storage volumes for the DB tier).

**Anti-pattern**: do not start Module 2.1 here. End Day 1 on the hardening win.

---
layout: two-cols
---

# FAQ (1/2)

::left::

**"Why no DENY rules in Security Groups?"**

ALLOW-only because default is DENY. Any rule is an exception, the ruleset stays small and auditable. AWS NACL covers the explicit-DENY niche at subnet level — no equivalent in Core OVHcloud. Pragmatic answer for ex-on-prem: model tiered access via SG-referencing-SG + IAM + private networks (Module 2.3).

**"Cloud-init only at first boot — what about my 50 running instances?"**

Boundary: cloud-init for bootstrap, Ansible/Salt/Puppet for steady state. Repurposing cloud-init for ongoing config is a well-known anti-pattern — the YAML nobody dares touch because it only runs at re-creation.

::right::

**"Is a snapshot a backup?"**

No. Private image, same project, same region, no app-level consistency. Real backup = app-consistent dumps + separate failure domain (typically Object Storage cross-region) + scheduled restore tests. Snapshot is an excellent fast-rollback tool, not the strategy.

**"Why does my instance hang 5-10 s during a snapshot?"**

Depends on disk size and IO load. `d2` idle = sub-second. `i1` under heavy writes = longer. Zero-impact snapshots don't exist in this model. Mitigation: low-traffic window, or move stateful data to Block Storage and snapshot the volume with the app briefly quiesced (Module 2.1).

---
layout: two-cols
---

# FAQ (2/2)

::left::

**"Can I keep the same Rescue password, or use my SSH key?"**

No. Temp password regenerated per activation, no SSH key support (rescue image is minimal). By design: Rescue is a one-shot recovery channel, not a permanent back door. Permanent emergency access = bastion + hardened access + out-of-band network. Architecture topic, out of Associate scope.

**"Console log says `system halted`, what now?"**

Kernel panic or initrd failed to mount root. Often a recent `apt full-upgrade` that broke the boot chain or a malformed `/etc/fstab`. Next step: Rescue mode → mount original root as secondary → inspect `/etc/fstab` and `/boot/grub/grub.cfg` → chroot + `journalctl --boot=-1` → fix → exit Rescue. Snapshot the broken state first if the issue is unclear.

::right::

**"Can I put secrets in cloud-init user-data?"**

No. User-data is readable from any process on the instance via the metadata service (`curl http://169.254.169.254/...`). Treat as non-confidential. Right pattern: cloud-init creates OS user + SSH key, secrets fetched at first boot from a secret store (Vault, IAM-restricted Object Storage) — or for Associate scope, SSHed in manually once. Anything more advanced is Pro tier.

**"Can I delete the default Security Group?"**

No, it's per-project and not deletable. You only DETACH it from instances. Common confusion at lab step 3 — clarify proactively.

---
layout: default
---

# Post-session debrief

Take 10 min after the day to reflect. Inputs for the next iteration, not a hidden assessment.

- Did the "snapshot ≠ backup" reflex land on the first pass at S06, or did it need reinforcement at Q3? If reinforced, anchor earlier next time.
- Did the lab fit in 30 min for >80% of learners? If not, the cut is `nw-db-01` (declared homework, web + api still cover S05/S06/S07/S09).
- Did anyone hit a CRLF cloud-init bug despite the Block 1 demo? If yes, make the conversion a mandatory checkpoint, not a side mention.
- Did Q1 (default-deny SG) and Q7 (hardening reflexes) both land cleanly? Misses signal an `A02` anchoring gap.
- Parking-lot question you couldn't answer cleanly? Add to FAQ before next delivery.
