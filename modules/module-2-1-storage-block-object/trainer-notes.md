# Module 2.1 — Storage (Part 1) — Block & Object — Trainer FAQ

**Audience**: trainer, read before the session.
**Purpose**: vetted answers to questions the persona is most likely to ask during this module. Not a script for delivery — the in-slide notes (HTML comments in `slides.md`) carry the in-session action script. This file is the depth bench: when a learner asks the question, the trainer already knows the answer and its limits.

**Module covers**: `LO-STO-K01`, `LO-STO-K02`, `LO-STO-K03`, `LO-STO-S01`, `LO-STO-S02`, `LO-STO-S03`, `LO-STO-S04`, `LO-STO-S05`.

---

## Q1 — How "S3-compatible" is OVHcloud Object Storage really? Can I take my AWS S3 Terraform module and point it at OVHcloud?

The S3-compatible API on OVHcloud covers all the core operations: `PUT`, `GET`, `DELETE`, `LIST`, multipart upload, basic ACLs, presigned URLs. The vast majority of S3 client libraries (boto3, AWS SDKs, `aws-cli`, `s3cmd`, `rclone`, MinIO client, Terraform's `aws_s3_bucket` resource with a custom endpoint) work out of the box. Where the API diverges is on the advanced surfaces: certain S3 lifecycle policies, some CORS edge cases, S3 Object Lock, cross-region S3 Replication, certain Server-Side Encryption modes (CMK/KMS-managed keys), S3 Select, S3 Inventory. The pragmatic recipe for a Terraform module: set `endpoint`, `skip_credentials_validation`, `skip_metadata_api_check`, `skip_requesting_account_id`, and `force_path_style` in the AWS provider, and verify on `docs.ovhcloud.com` whether the specific features your module uses are supported. The Pro tier of the certification covers the compatibility matrix in depth.

**LO traced**: `LO-STO-K03`, `LO-STO-S04`.
**Likely asker**: Corporate persona, ex-AWS developer or DevOps. This is the single most-asked question of the module.

---

## Q2 — Why is Block Storage AZ-scoped and Object Storage region-scoped? It seems arbitrary.

It reflects the underlying storage technology and consistency model. A Block Storage volume is presented to the OS as a coherent block device with strict consistency — every read sees the latest write, atomically. To deliver that at low latency, the storage backend must be physically close to the compute, in the same failure domain (the AZ). Replicating a block volume synchronously across AZs would multiply the write latency by the inter-AZ network latency, which is the wrong trade-off for a primary storage path. Object Storage, by contrast, deals with whole objects whose consistency expectations are different (no in-place byte updates), and the access path is HTTP — naturally tolerant to a few extra milliseconds. Swift replicates across AZs by design, which is what gives Object Storage its region-scoped reachability. The architectural moral: pick the storage primitive that matches both your access pattern and your acceptable consistency/latency trade-off.

**LO traced**: `LO-STO-K02`, `LO-STO-K03`.
**Likely asker**: any persona with an architecture background. Often arrives as a "design rationale" question rather than an operational one.

---

## Q3 — Can a Block Storage volume really only attach to one instance? What about clustered filesystems like OCFS2 or GFS2 that expect shared block?

Correct, OVHcloud Block Storage is strictly single-attach in the Core scope. Clustered filesystems that expect shared block access (OCFS2, GFS2, VMFS-style) cannot be built on top of OVHcloud Block Storage as-is. If the requirement is genuinely a shared filesystem, the correct primitive is File Storage (Module 2.2), which exposes NFS-style multi-attach semantics with native filesystem-level locking. If the requirement is shared block access for a non-clustered workload, the design is usually wrong — there is almost always a better pattern using either File Storage (for shared filesystems), Object Storage (for shared immutable assets), or application-level data partitioning (each instance has its own block, application coordinates). Multi-attach Cinder exists in some upstream OpenStack deployments but is not exposed in the Core OVHcloud product line.

**LO traced**: `LO-STO-K02`.
**Likely asker**: Corporate persona, ex-VMware or HPC background. Sometimes arrives via "how do I do shared SAN on cloud?"

---

## Q4 — We're moving from AWS to OVHcloud. On AWS, our staging environment has cross-region S3 replication for disaster recovery. How do we replicate that on OVHcloud?

Cross-region replication on OVHcloud Object Storage is an evolving area — verify the current state of the feature on `docs.ovhcloud.com`, as native cross-region replication may or may not be exposed depending on the offer and the moment. The pragmatic patterns in the meantime: (1) write to two regions in parallel from the application layer for new objects (dual-write pattern); (2) schedule a periodic `aws s3 sync` (or `rclone sync`) job from the primary region to a secondary region — runs from a small Compute instance or from your CI; (3) for the DR scenario specifically, write critical objects to a primary region and a Cold Archive bucket in a secondary region with `aws s3 sync` daily. The strategic question to ask the customer back: how much data loss is acceptable in a region-wide outage (RPO)? That number drives the replication frequency choice.

**LO traced**: `LO-STO-K03`, `LO-STO-S04`.
**Likely asker**: Corporate persona migrating workloads, often the lead architect.

---

## Q5 — How do I rotate S3 credentials safely without breaking the running applications that use them?

The clean rotation pattern has three steps: (1) generate a new set of credentials in the Manager for the same project — both old and new are active simultaneously; (2) update the applications to use the new credentials (gradual rollout, blue-green, whatever fits your deployment model); (3) once you have verified no application is still using the old credentials (typically by monitoring request logs on Object Storage if available, or by waiting beyond the longest possible credential cache TTL), revoke the old credentials in the Manager. The anti-pattern is to revoke the old credentials first and then update the apps — that is a self-inflicted outage. For applications that store credentials in environment variables, rotation requires a redeploy; for applications that fetch credentials at startup from a secret store, rotation is cleaner. The deeper secret-management discussion belongs to Module 2.5.

**LO traced**: `LO-STO-S05`.
**Likely asker**: developer persona or security/compliance representative. Often comes up specifically when the auditor's calendar approaches.

---

## Q6 — What's the actual durability of Object Storage? AWS S3 advertises eleven 9s — what does OVHcloud guarantee?

The durability figure is the percentage of objects expected to survive over a year, derived from the replication strategy and the storage hardware reliability model. OVHcloud's published durability for Object Storage is high (verify the exact figure on `ovhcloud.com` — typically in the same order of magnitude as hyperscalers for the region-scoped tier), but the practical answer most customers care about is not the figure, it is the scenarios it covers. Hardware failure on a single disk, a rack, a server room? Yes. Region-wide disaster (fire, flood)? No — the figure assumes a single region; cross-region DR is a separate design (see Q4). Application bug that deletes objects? No — durability does not cover deliberate deletions; versioning and backup do. The honest message to learners: durability is a number that bounds the worst case for hardware failure, it does not replace a backup strategy that covers human and application failure modes.

**LO traced**: `LO-STO-K03`.
**Likely asker**: Corporate persona, often the risk/compliance representative or a senior architect. The question is usually a probe to see if the trainer knows the difference between durability and backup.

---

## Q7 — When does `high-speed-gen2` actually make a difference compared to `high-speed`? Is the price premium worth it?

`high-speed-gen2` is NVMe-backed; `high-speed` is SSD-backed but a generation older. The performance gap matters when the workload is bound by IOPS or by tail latency at high concurrency. Practical scenarios where the gap shows: OLTP databases serving thousands of small transactions per second (`high-speed-gen2` reduces 99th-percentile latency noticeably), heavily indexed workloads with random reads across a large working set, real-time analytics workloads. Scenarios where the gap is invisible: general-purpose app servers, batch processing, low-traffic databases, anything dominated by network or CPU. The pragmatic decision rule: start with `high-speed` for production, observe latency metrics (PostgreSQL: `pg_stat_statements` for query latency; OS: `iostat -x` for `await`), upgrade to `high-speed-gen2` only if the storage layer is provably the bottleneck. Over-provisioning is a FinOps concern that belongs to the Pro tier — but the Core reflex is: measure first, upgrade second.

**LO traced**: `LO-STO-K02`, `LO-STO-S01`.
**Likely asker**: Corporate persona with database responsibility, or Digital Starter persona surprised by the bill. Comes up specifically during the tier slide (S04) or after the lab when learners look at prices.

---

## Cross-module forward references collected from this module

For convenience, the topics the trainer is most likely to be asked about that point **forward** to later modules — useful to anchor a "we'll cover this in" answer without having to re-derive the mapping live.

| Topic raised | Forward reference |
|---|---|
| Volume snapshots, application-consistent volume backup, Instance Backup service | Module 2.2 — File Storage, Snapshots & Backup Strategy |
| File Storage / shared filesystem semantics (NFS-like, multi-attach) | Module 2.2 — File Storage |
| Cold Archive for long-term retention (legal, compliance) | Module 2.2 — Cold Archive |
| Private network between instances and storage endpoints (S3 over private link) | Module 2.3 — Private Network |
| IAM scoping of S3 credentials per user, per container, role separation | Module 2.5 — Identity & Security |
| Terraform / OpenTofu for `openstack_blockstorage_volume_v3` + `openstack_objectstorage_container_v1` | Module 3.1 — IaC Essentials |
| Observability of storage IOPS, latency, error rates | Module 3.2 — Observability |
| Managed Databases as alternative to PostgreSQL self-managed on a block volume | Out of scope Core; DBaaS Associate certification |
| Advanced S3 features (Object Lock, Replication, Lifecycle policies, Inventory, Select) | Out of scope Core Associate; Pro tier |
| FinOps storage cost optimization (right-tiering, lifecycle to Cold, egress patterns) | Out of scope Core Associate; Pro tier |
| Sovereign / SecNumCloud Object Storage offers | Out of scope Core; Specialist tier |
