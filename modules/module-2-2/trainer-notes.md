# Module 2.2 — Storage (Part 2) — File, Snapshots & Backup Strategy — Trainer FAQ

**Audience**: trainer, read before the session.
**Purpose**: vetted answers to questions the persona is most likely to ask during this module. Not a script for delivery — the in-slide notes (HTML comments in `slides.md`) carry the in-session action script. This file is the depth bench: when a learner asks the question, the trainer already knows the answer and its limits.

**Module covers**: `LO-STO-K04`, `LO-STO-K05`, `LO-STO-K06`, `LO-STO-S06`, `LO-STO-S07`, `LO-STO-S08`, `LO-STO-A01`, `LO-STO-A02`, `LO-STO-A03`.

---

## Q1 — Isn't NAS-HA the same thing as File Storage? They both speak NFS — why two products?

Same protocol (NFS), two distinct OVHcloud product lines, two distinct billing and operational contexts. NAS-HA belongs to the Hosted Private Cloud product family — it predates the Public Cloud offer, it is billed and managed separately, it has its own SLA, and it is provisioned outside any Public Cloud project. File Storage is the Public Cloud Manila-based service: it is part of the Public Cloud project, billed inside the project, scoped to an Availability Zone, and provisioned through the same Manager UI / OpenStack CLI as Block and Object Storage. For a workload that lives in Public Cloud, the correct primitive is File Storage — that is the answer to expect on the certification and the answer to give in customer architecture conversations. NAS-HA only enters the discussion in two cases: (1) the customer already has a Hosted Private Cloud subscription and wants to share storage across product lines, or (2) the customer has very large capacity needs that benefit from NAS-HA's pricing model. Both cases are out of scope for the Core Associate certification.

**LO traced**: `LO-STO-K04`.
**Likely asker**: Corporate persona who has skimmed the OVHcloud product catalog. This is the single most-asked clarification of the module and one of the easiest learner credibility wins for the trainer if answered crisply.

---

## Q2 — Can I take an application-consistent snapshot of a running PostgreSQL on a Block Volume?

Not at the Cinder snapshot level alone. A Cinder snapshot is crash-consistent — the storage backend captures the volume's blocks at a point in time, but it does not coordinate with PostgreSQL to flush in-flight transactions or to checkpoint the WAL. The restored volume is, from PostgreSQL's perspective, equivalent to one that survived a power cut: the database will recover via WAL replay on startup, the on-disk structure will be consistent, but transactions that were in flight at snapshot time may be lost. For application-consistent backups of PostgreSQL, the right tools are at the application layer: `pg_dump` (logical backup, slow on large DBs but very portable), `pg_basebackup` + continuous WAL archiving (physical backup with point-in-time recovery), or for some scenarios a filesystem freeze (`fsfreeze`) coordinated with PostgreSQL's `pg_start_backup()` / `pg_stop_backup()`. The pragmatic Northwind recipe (used in the lab) is `pg_dump` to Object Storage: it is application-consistent, portable, simple to script, and the restore drill is straightforward. The deeper PostgreSQL-specific patterns belong to the DBaaS Associate certification.

**LO traced**: `LO-STO-K05`, `LO-STO-S08`.
**Likely asker**: any persona with a database background. The question almost always comes up either at slide 6 or during the lab when the learner sees the `pg_dump` step and wonders why the snapshot taken earlier wasn't enough.

---

## Q3 — Why does restoring from a Cinder snapshot create a NEW volume? Why can't I just "rollback in place"?

Cinder's semantic model is that a volume's data is mutable from the moment it is attached to an instance, and that the only safe rollback is to create an immutable artifact (the snapshot) and materialize it into a new volume. An in-place rollback would require either (1) detaching the volume, restoring the snapshot's blocks over the live ones, and reattaching — a complex multi-step operation with non-trivial failure modes, especially if the source volume has grown since the snapshot — or (2) some form of copy-on-write rollback that exposes serious consistency edge cases under concurrent access. The "always restore to a new volume" rule is a safety feature: the original is preserved until the operator deliberately deletes it, leaving room for "did I really pick the right snapshot?" moments. The operational consequence is that a restore is a two-step process: create the new volume from the snapshot, then swap the attachment (detach old, attach new) — exactly the lab pattern. In practice, this also makes "compare old vs restored" trivial: both volumes are sitting there, attachable, comparable.

**LO traced**: `LO-STO-S08`.
**Likely asker**: Corporate persona, ex-VMware or ex-storage-admin background. Often phrased as "this seems like extra steps".

---

## Q4 — What is the retention model on Instance Backup, and what happens beyond it?

Instance Backup at the Associate scope exposes a daily and weekly cycle with configurable retention up to roughly 30 days — verify the current limits on `docs.ovhcloud.com` as the service evolves. The backups are stored as private Glance images in the same region as the source instance, and billed at image storage rate. Beyond the configured retention window, the oldest backup is purged by the service. If a longer retention is required (compliance, contractual), the operator's responsibility is to export critical images out of the Instance Backup retention window before they expire. The export path is `openstack image save <image-id> --file <local>`, then upload the resulting raw file to Object Storage (and from there optionally to Cold Archive for very long retention). At the Pro tier, the conversation expands to automated lifecycle policies; at Associate, the message is simply: "Instance Backup has a finite retention window — for longer retention, you orchestrate the export."

**LO traced**: `LO-STO-S07`.
**Likely asker**: Corporate persona with audit or compliance exposure. The question often surfaces after slide 7 when the learner does the mental math on regulatory retention requirements.

---

## Q5 — How does Cold Archive retrieval billing actually work? Is it cheap to store and expensive to retrieve, or is it more nuanced?

Two cost components, both billed independently. Storage is very cheap on a per-GB-month basis — that is the headline pricing advantage and the reason customers reach for Cold Archive in the first place. Retrieval is where the cost story changes: there is a per-GB retrieval fee billed at the moment of restore, and the retrieval also takes time (minutes to hours depending on volume and the OVHcloud-side queue state). For very rare retrievals (legal discovery, regulatory audit, one-shot data recovery), the total cost is still lower than keeping the same data on Standard or Infrequent Access for 10 years. For frequent retrievals (monthly DR drills, regular re-access), the retrieval costs accumulate quickly and Infrequent Access becomes the better economic choice. The decision rule: estimate the retrieval frequency over the data's full retention life, then compare scenarios on the OVHcloud pricing page. The Cold Archive economics question is often the entry point to a broader FinOps conversation, which is Pro-tier territory.

**LO traced**: `LO-STO-K06`, `LO-STO-A03`.
**Likely asker**: Corporate persona with finance/FinOps exposure, or Digital Starter persona surprised by an unexpected retrieval bill. Often arrives alongside Q6 below.

---

## Q6 — What is the 3-2-1 rule, and how does it map cleanly to OVHcloud Public Cloud Core?

3-2-1 is the durable industry rule of thumb: **3** copies of the data, on **2** different storage media, with **1** off-site. It predates cloud computing — it comes from on-premise tape-era backup discipline — but it maps cleanly to cloud primitives. For Northwind's PostgreSQL data, the mapping is exactly the strategy in slide 9: copy 1 = the live data on the Block Volume attached to `nw-db-01`, copy 2 = a `pg_dump` written to Object Storage (different storage class, different physical infrastructure than the block cluster), copy 3 = a monthly copy of that dump to Cold Archive (different physical medium — magnetic tape — and stored in different DCs than the Object Storage primary). The "off-site" condition is satisfied by Cold Archive's physical separation. The 3-2-1 rule does not say *what* tools to use; it says *what shape* the strategy must have. Any backup conversation with a customer should start by checking that 3-2-1 is satisfied (or deliberately not, with documented acceptance of the residual risk) — that single check catches most "we only have snapshots" anti-patterns.

**LO traced**: `LO-STO-K05`, `LO-STO-A02`.
**Likely asker**: Corporate persona with operational maturity, often a senior ops or SRE-style profile. Sometimes arrives via "what does a good backup strategy look like?"

---

## Q7 — What happens to my snapshot if I delete the Block Volume? Can I keep the snapshot data alive separately?

You cannot delete a Block Volume that has dependent snapshots — the Manager and the OpenStack API both block the operation explicitly, and the snapshots must be deleted (or detached from their parent volume by being materialized into independent artifacts) first. The protective implication is that snapshots cannot be accidentally orphaned. The operational implication is that if you genuinely want the snapshot's data to survive the source volume's deletion, you must convert it into a longer-lived artifact *before* deleting the source: create a new volume from the snapshot, then either keep that new volume around (it has its own independent lifecycle from that point), or export it to Object Storage as a raw image via `openstack image create --volume <new-vol>` (the image is now independent from any volume). This is the "snapshot is not a backup" rule operationalized: if you want a thing that survives the source, you don't just snapshot, you copy out.

**LO traced**: `LO-STO-K05`, `LO-STO-S08`.
**Likely asker**: any operator-profile persona. Often asked as a tactical question during the lab when the learner contemplates cleanup.

---

## Cross-module forward references collected from this module

For convenience, the topics the trainer is most likely to be asked about that point **forward** to later modules — useful to anchor a "we'll cover this in" answer without having to re-derive the mapping live.

| Topic raised | Forward reference |
|---|---|
| Private network endpoints for File Storage / Object Storage (no public traversal) | Module 2.3 — Network (Part 1) — Private Network |
| Security Groups around the NFS port (2049) for File Storage hardening | Module 2.3 — Network (Part 1) — Security Groups |
| IAM scoping of S3 credentials for backup-only access (least privilege) | Module 2.5 — Identity & Security |
| Secret Manager for storing PostgreSQL credentials used by the backup script | Module 2.5 — Identity & Security |
| Hardening the self-managed PostgreSQL using only Core capabilities (the synthesis) | Module 2.5 — Identity & Security |
| Terraform for `openstack_sharedfilesystem_share_v2`, `openstack_blockstorage_volume_v3` snapshot, scheduled backup jobs | Module 3.1 — IaC Essentials |
| Cron + script orchestration for nightly `pg_dump` to Object Storage | Module 3.1 — IaC Essentials (orchestration) and Module 3.2 (operational reliability) |
| Observability of backup job success/failure, alerting on missed runs | Module 3.2 — Operations & Monitoring |
| Quota management for snapshot storage, backup image storage | Module 3.2 — Operations & Quotas |
| Managed Databases (with built-in backup) as alternative to self-managed + custom backup | Out of scope Core; DBaaS Associate certification |
| Managed Kubernetes ReadWriteMany PVCs backed by File Storage | Out of scope Core; MKS Associate certification |
| Advanced S3 features (Object Lock for WORM compliance, Versioning, Lifecycle policies) | Out of scope Core Associate; Pro tier |
| Cross-region backup replication, multi-region DR strategy | Out of scope Core Associate; Pro tier |
| Application-consistent multi-volume snapshots (consistency groups) | Out of scope Core Associate; Pro tier |
| FinOps tier optimization (Standard / Infrequent Access / Cold Archive lifecycle automation) | Out of scope Core Associate; Pro tier |
| Sovereign / SecNumCloud constraints on backup storage location | Out of scope Core; Specialist tier |
