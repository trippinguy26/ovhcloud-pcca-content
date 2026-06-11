---
# ============================================================
# Module 2.2 — Storage (Part 2) — File, Snapshots & Backup Strategy
# Trainer notes — preparation deck
# ============================================================
theme: ../../theme-ovhcloud
title: Storage (Part 2) — Trainer Notes
class: text-left
mdc: true
exportFilename: 'modules/module-2-2/trainer-notes'
controls: false
download: false
selectable: true
moduleId: "2.2"
moduleTitle: "Storage (Part 2) — File, Snapshots & Backup Strategy"
duration: "1h30"
program: "OVHcloud — Public Cloud — Core Associate"
los: [LO-STO-K04, LO-STO-K05, LO-STO-K06, LO-STO-S06, LO-STO-S07, LO-STO-S08, LO-STO-A01, LO-STO-A02, LO-STO-A03]
layout: trainer-cover
---

# Module 2.2 — Trainer Notes
## Storage (Part 2) — File, Snapshots & Backup Strategy

Preparation deck · ~10 min read · Pair with `slides.md` in `/presenter`

---
layout: default
---

# Pre-flight

- Module 2.1 outputs alive: 3 Northwind instances, block volume on `nw-db-01`, container `<initials>-nw-artifacts` + S3 credentials.
- PostgreSQL on `nw-db-01` with a populated `northwind` DB (`customers` table ≥10 rows). Fresh install = 5 min Sentier battu.
- Manager open in second tab. Backup tab visibility validated. `aws-cli` GRA profile sourced and tested with `aws s3 ls`.
- Plan B: pre-taken offline snapshot, in case live demo fails on quota.
- Mental posture: *"so it doesn't burn"* module. S04 (snapshot vs backup) = highest-value moment of the storage domain.

---
layout: default
---

# Block 1 — Sentier battu (5 min)

**Posture**: rapid invariant check, preempt NAS-HA confusion.

- Show of hands on 2.1 outputs. Below 50%, pair learners for the multi-instance mount.
- Preempt NAS-HA: *"File Storage = Public Cloud Manila. NAS-HA = Hosted Private Cloud, not in scope. Same NFS, different product."* 30 sec.
- `nfs-common` install modeled on demo instance if missing.

**Anti-pattern**: don't re-explain Block vs Object from 2.1. Fundamentally lost = 1-on-1 at the break.

---
layout: default
---

# Block 2 — Theory (30 min)

**Posture**: 3 min/slide average. S04 is the pivot — slow down deliberately.

- **S02** three paradigms: install the Block/Object/File grid. "Missing piece" framing > Manila word.
- **S04** Snapshot vs Backup: **single most important slide of storage domain.** Articulate each row, make the room repeat *"a snapshot is NOT a backup."* Attitude `A02`.
- **S07** Instance Backup: hammer *"system disk only, additional volumes NOT captured."* THE operational pitfall.
- **S09** Northwind strategy: 2 min, ask the room to find 3-2-1 in the DB row.

**Anti-pattern**: don't recite Cinder/Manila/Swift internals. OpenStack provenance installed in 2.1.

---
layout: default
---

# Block 3 — Demo (15 min)

**Posture**: you are operating, not lecturing. Verbalize before pressing Enter.

<div class="text-xs">

| # | Action | Verbalize |
|---|---|---|
| 1-3 | `share create` → `share access create` (api+web) → `share show` | "Manila, NFS v3, region-scoped. Access by IP." |
| 4-5 | SSH api, mount, write marker; SSH web, mount same share, `ls` marker | *"Multi-attach in action."* |
| 6 | `volume snapshot create --volume demo-db-data-01` | "Cinder point-in-time, same cluster." |
| 7-9 | `DROP TABLE` → `volume create --snapshot` → swap attach → `\dt` customers back | *"Restore = NEW volume, never in-place."* |
| 10 | Manager > Instances > Backup tab > Enable daily/7d | "Manager only. System disk only." |
| 11-12 | `pg_dump \| aws s3 cp -` then `aws s3 ls` | *"Independent storage = the difference vs snapshot."* |

</div>

**Failure modes**: mount hangs → access rule not propagated (wait 30 s) · snapshot in `error` → quota exhausted · `aws s3 cp` AccessDenied → endpoint typo or creds not loaded · Backup tab missing → refresh Manager, fallback `server image create` one-shot.

---
layout: default
---

# Block 4 — Lab (30 min)

**Posture**: circulate silently. Intervene only on blockers.

- Rollout (2 min): restate brief + success criteria. Project Lab Steps 1/2, switch to 2/2 around min 15.
- Top blockers: NFS mount hangs (access rule timing) · snapshot-before-DROP order · `pg_dump` AccessDenied · fstab without `nofail`.
- Close (3 min): at min 27 announce 3-min warning. *"Snapshot, share and restored DB stay in place — reused in 2.3 and 2.5."*

**Anti-pattern (yours)**: don't help too early on the `pg_dump` step. The S3 error message is readable — 70% unblock themselves.

---
layout: default
---

# Block 5 — Micro-check (5 min)

**Posture**: formative, 40 s per question average.

- **Q2** (snapshot survives source deletion, `K05`) and **Q5** (Instance Backup scope, `S07`) = pivotal questions.
- Wrong Q2 → reframe with S04: *"snapshot tied to volume lifecycle, backup independent."*
- 3+ wrong on Q5 → 2-min opener tomorrow on the scope limitation.

---
layout: default
---

# Block 6 — Wrap-up (5 min)

**Posture**: warm, conclusive. Storage domain closes here.

- Recap the 9 verbs: distinguish, articulate, identify, mount, configure, restore, recommend, design, anticipate.
- Reinforce *"snapshot = seatbelt, backup = airbag, Cold Archive = black box."*
- Walk the CTO transition: data durable but tiers still talk over public IPs → Module 2.3.

**Anti-pattern**: do not start 2.3 here. End on the storage-domain-closed win.

---
layout: two-cols
---

# FAQ (1/2)

::left::

**"Isn't NAS-HA the same as File Storage?"**

Same NFS protocol, two product lines. NAS-HA = Hosted Private Cloud (separate billing/SLA). File Storage = Public Cloud Manila, inside the project. For Public Cloud workloads, File Storage is the answer. NAS-HA only enters if the customer already runs Hosted Private Cloud.

**"App-consistent snapshot of running PostgreSQL?"**

Not at Cinder level — snapshots are crash-consistent only. PostgreSQL recovers via WAL but in-flight transactions may be lost. App-consistent options: `pg_dump`, `pg_basebackup` + WAL archiving, or `fsfreeze` + `pg_start_backup`. The lab uses `pg_dump` to Object Storage — app-consistent and portable.

::right::

**"Why does restore create a NEW volume?"**

Cinder semantic: rollback always materializes a new volume from the immutable snapshot. Original stays attached until deliberate delete. Restore = two steps (create-from-snapshot, swap attach). Side benefit: old and restored sit side by side, comparable.

**"Instance Backup retention?"**

Daily/weekly cycle, ~30 days max at Associate scope (verify on `docs.ovhcloud.com`). Backups = private Glance images, same region. Beyond the window: `openstack image save` then upload to Object Storage. Message: "finite retention, longer = you orchestrate the export."

---
layout: two-cols
---

# FAQ (2/2)

::left::

**"How does Cold Archive billing work?"**

Two components: storage (very cheap/GB-month) + retrieval (per GB at restore, minutes-to-hours latency). Rare retrievals = cheaper than Standard overall. Frequent retrievals = Infrequent Access wins. Decision rule: estimate retrieval frequency over data's full life *before* picking the tier.

**"3-2-1 mapped to OVHcloud?"**

3 copies, 2 media, 1 off-site. Northwind DB: live block volume + `pg_dump` on Object + monthly Cold Archive copy. The rule says *what shape*, not *what tools*. Apply as a checklist — catches most "we only have snapshots" anti-patterns.

::right::

**"Snapshot survives volume deletion?"**

No — Cinder blocks volume deletion when dependent snapshots exist. To survive: materialize the snapshot into a new volume *before* deleting the source, then keep it or export via `openstack image create --volume`. *"Snapshot is not a backup"* operationalized — if you want it to outlive the source, you copy out.

---
layout: default
---

# Post-session debrief

Take 10 min after the day. Inputs for the next iteration, not a hidden assessment.

- Did S04 (snapshot vs backup) land? Hesitation on Q2 → refresh the framing at Module 2.5 opener.
- Did the multi-attach moment at demo step 5 produce the "aha"? If not, reinforce at Module 3.1 (RWX PVCs reference).
- Did the lab fit in 30 min for >80% of learners? Step 8 (restore drill) is the most likely overrun — consider declaring it homework if recurring.
- Parking-lot question you couldn't answer cleanly? Add to FAQ before next delivery.
