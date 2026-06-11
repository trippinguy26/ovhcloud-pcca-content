---
# ============================================================
# Module 2.1 — Storage (Part 1) — Block & Object
# Trainer notes — preparation deck
# ============================================================
theme: ../../theme-ovhcloud
title: Storage (Part 1) — Trainer Notes
class: text-left
mdc: true
exportFilename: 'modules/module-2-1/trainer-notes'
controls: false
download: false
selectable: true
moduleId: "2.1"
moduleTitle: "Storage (Part 1) — Block & Object"
duration: "1h30"
program: "OVHcloud — Public Cloud — Core Associate"
los: [LO-STO-K01, LO-STO-K02, LO-STO-K03, LO-STO-S01, LO-STO-S02, LO-STO-S03, LO-STO-S04, LO-STO-S05]
layout: trainer-cover
---

# Module 2.1 — Trainer Notes
## Storage (Part 1) — Block & Object

Preparation deck · ~10 min read · Pair with `slides.md` in `/presenter`

---
layout: default
---

# Pre-flight

- `openrc.sh` from Module 1.2 still valid. Regenerate if expired.
- `demo-db-01` and `demo-web-01` from Module 1.4 demo project alive, both in the same AZ. Same SSH key as 1.4.
- `aws-cli` v2 on the demo workstation. Profile `ovh-gra` ready with the endpoint URL pre-filled — credentials generated **live** in the demo for pedagogy.
- Manager open in a second tab on the demo project, Users & Roles page one click away.
- Test files ready on the workstation: `sample-artifact.tgz` (~5 MiB) and a tiny `README.txt`.
- Plan B: a volume already attached to `demo-web-01` in case step 8 hangs.
- Room check: who has `nw-db-01` running from Day 1, who needs the hors piste redeploy.

---
layout: default
---

# Block 1 — Sentier battu (5 min)

**Posture**: quick continuity check, not a recap of Day 1.

- Show of hands on `<initials>-nw-db-01` running. Below 50% → run hors piste redeploy (Mod 1.3 sequence) in parallel during Theory opener.
- `aws-cli` installed? Below 50% → 30 sec install (`pip install awscli` or `snap install aws-cli`) before Theory.
- Close: *"If anything else is missing, raise it now. Theory won't pause."*

**Anti-pattern**: do not re-explain instance lifecycle here. Day 2 starts moving forward.

---
layout: default
---

# Block 2 — Theory (30 min)

**Posture**: 3 min/slide average. The block-vs-object mental model is the whole module.

- **S01** opener: verbalize the cultural shift. *"Compute is disposable. Data is the only asset."* Day 1 set this up; today we install the reflex.
- **S02** access patterns: this is the slide that frames everything. Ask one learner to place a workload before moving on.
- **S06** S3-as-translation-layer: be honest. *"95%+ compat, edges exist."* Ex-AWS learners reward honesty here, punish overclaim.
- **S09** decision diagram: the "aha" of the module. 2 min of interaction — get 2 learners to place a workload in the tree.

**Anti-pattern**: do not recite IOPS numbers per tier. The doc is authority.

---
layout: default
---

# Block 3 — Demo (15 min)

**Posture**: you are operating, not lecturing. Verbalize the choice before pressing Enter.

<div class="text-xs">

| # | Action | Verbalize |
|---|---|---|
| 1-2 | `openstack volume create --size 20 --type classic demo-db-data-01` then `volume list` | *"`--type classic` = tier choice. Exists, attached to nothing."* |
| 3-4 | `server add volume demo-db-01 ...`, SSH in, `lsblk` | *"Linux sees a new block device. Empty disk."* |
| 5-6 | `mkfs.ext4`, mount, write MARKER | *"UUID for fstab. MARKER proves the write."* |
| 7-9 | umount, detach, re-attach to `demo-web-01`, SSH, mount, `cat MARKER` | *"The data traveled with the volume. Single-attach: was free, is owned again."* |
| 10-11 | Manager → Users & Roles → generate S3 user. `aws configure --profile ovh-gra` | *"Secret shown once. `--endpoint-url` is the only difference from AWS."* |
| 12-13 | `aws s3 mb`, `cp`, `ls` with `--endpoint-url https://s3.gra.io.cloud.ovh.net` | *"`app/` is just a key prefix, not a real folder."* |
| 14 | `put-object-acl --acl public-read`, `curl` the public URL | *"No `aws-cli` needed to fetch. URL = the bucket DNS."* |

</div>

**Failure modes**: lsblk shows nothing → wait 10 s, then suspect AZ mismatch · mount fails "wrong fs type" → not formatted yet · `s3 mb` returns 403 → creds not propagated (30-60 s) or endpoint typo · `curl` 403 → wrong URL format (use virtual-hosted style).

---
layout: default
---

# Block 4 — Lab (30 min)

**Posture**: circulate silently. Intervene only on blockers.

- Rollout (2 min): restate brief + success criteria. Project Lab Steps (1/2) then (2/2) as the room progresses.
- Top blockers: AZ mismatch on attach · fstab UUID typo causes reboot to lose mount (`nofail` saves it) · `aws-cli` not pointed at the OVHcloud endpoint · public-read URL format wrong.
- Mid-block check at 15 min: room should be on step 10. If <50% are, cut the public-read step (step 15-16) and declare it homework.
- Close (3 min): at 27 min announce 3-min warning. *"Volume stays attached, container stays up. Both reused in Module 2.2."*

**Anti-pattern (yours)**: don't help too early on aws-cli errors. The message is usually self-explanatory.

---
layout: default
---

# Block 5 — Micro-check (5 min)

**Posture**: formative, 40 s per question average.

- **Q1** (Block vs Object for PostgreSQL) and **Q3** (Object Storage facts) anchor `K01` and `K03`. Wrong on either → reframe with S02 access patterns immediately.
- **Q5** (resize + filesystem extend) is the trap. Wrong here is a sign the OS/cloud boundary is not yet internalized — flag for Module 2.2.
- 3+ wrong on Q1 → plan a 2-min opener tomorrow to re-anchor `K01`.

---
layout: default
---

# Block 6 — Wrap-up (5 min)

**Posture**: warm, conclusive. Set up Module 2.2 without starting it.

- Recap the verbs: distinguish, explain, create, attach, resize, detach, manipulate, set.
- Reinforce *"Block for state, Object for shared, File coming next."*
- Walk the CTO scenario for 2.2: legal PDFs (Cold Archive), shared filesystem (File Storage), backup story (Snapshots + Instance Backup).

**Anti-pattern**: do not start Module 2.2. Let the day breathe.

---
layout: two-cols
---

# FAQ (1/2)

::left::

**"How S3-compatible really?"**

95%+ for CRUD: PUT, GET, DELETE, LIST, multipart, ACLs, presigned. Edges on lifecycle policies, Object Lock, cross-region Replication, KMS-managed encryption, S3 Select. Terraform pattern: AWS provider with `endpoint`, `force_path_style`, the three `skip_*` flags. Verify on `docs.ovhcloud.com` per feature.

**"Block AZ vs Object region — why?"**

Strict consistency at low latency requires the storage close to the compute = same AZ. Object's HTTP / whole-object model tolerates inter-AZ latency = Swift replicates across AZs. Pick the primitive that matches access pattern + consistency need.

::right::

**"Single-attach — what about OCFS2 / GFS2?"**

Not supported on Core OVHcloud Block. If genuinely shared filesystem needed → File Storage (Module 2.2). If shared block for non-clustered workload → design is usually wrong, partition at app layer.

**"Cross-region replication for DR?"**

Native may or may not be exposed — verify on docs. Patterns: dual-write from app layer, scheduled `aws s3 sync` from a small instance, or daily sync to Cold Archive in secondary region. The RPO question drives the choice.

---
layout: two-cols
---

# FAQ (2/2)

::left::

**"How to rotate S3 credentials safely?"**

Three steps: (1) generate new creds — both old and new active. (2) Update apps gradually. (3) Once no app uses old creds, revoke. Anti-pattern: revoke first, update second = self-inflicted outage.

**"Object Storage durability — eleven 9s?"**

Verify exact figure on `ovhcloud.com`. The honest message: durability bounds hardware failure worst case, it does NOT cover region disaster (cross-region DR is a separate design) nor human deletion (versioning + backup do).

::right::

**"high-speed vs high-speed-gen2 — worth it?"**

`gen2` is NVMe. Matters for OLTP, high-concurrency, latency-sensitive. Invisible for general app servers, batch, low-traffic DBs. Decision rule: start with `high-speed`, measure (`iostat -x` await, `pg_stat_statements`), upgrade only if storage is provably the bottleneck.

---
layout: default
---

# Post-session debrief

Take 10 min after the day to reflect. Inputs for the next iteration, not a hidden assessment.

- Did the block-vs-object mental model land at S02 + S09? If not, plan a 2-min re-anchor at Module 2.2 opener.
- Did the lab fit in 30 min for >80% of learners? AZ mismatch and fstab typos are the time sinks — both deserve a sharper rollout next time.
- Did the S3-compat honesty in S06 land well or generate confusion? Calibrate for next delivery.
- Parking-lot question you couldn't answer cleanly? Add to FAQ before next delivery.
