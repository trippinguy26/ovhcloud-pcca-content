# Domain 04 — Storage

> **Domain code**: `STO`
> **Total LOs**: 17 (6 K + 8 S + 3 A)
> **Calibration**: Covers the three storage paradigms (block, object, file) and the critical snapshot-vs-backup distinction. Two modules are allocated to this domain in the learning path.

## Knowledge (savoir)

| Code | Learning Outcome |
|---|---|
| `LO-STO-K01` | Distinguish the three storage paradigms exposed by OVHcloud Public Cloud: block, object, and file storage — and identify the right tool for each use case. |
| `LO-STO-K02` | Explain block storage characteristics (AZ-scoped, persistent, attachable to a single instance, performance tiers) and identify the OpenStack Cinder concepts behind it. |
| `LO-STO-K03` | Explain object storage characteristics (region-scoped, S3-compatible API, eventual consistency, unlimited capacity model) and identify the OpenStack Swift origins. |
| `LO-STO-K04` | Explain file storage characteristics (shared filesystem semantics, NFS-style multi-attach) and typical use cases. |
| `LO-STO-K05` | **Clearly distinguish a snapshot from a backup**: scope, retention, location, and recovery semantics. |
| `LO-STO-K06` | Identify the OVHcloud Cold Archive offering and its positioning for long-term, low-cost retention. |

## Skills (savoir-faire)

| Code | Learning Outcome |
|---|---|
| `LO-STO-S01` | Create a block storage volume, attach it to a running instance, format and mount it. |
| `LO-STO-S02` | Resize a block storage volume online and extend the underlying filesystem. |
| `LO-STO-S03` | Detach a block volume cleanly and reattach it to another instance in the same AZ. |
| `LO-STO-S04` | Create an Object Storage container (S3 or Swift API), upload, list, and download objects using a standard S3 client (`aws s3`, `s3cmd`, or `rclone`). |
| `LO-STO-S05` | Set basic object storage permissions (public read, private, presigned URL). |
| `LO-STO-S06` | Mount a File Storage share on a Linux instance. |
| `LO-STO-S07` | Configure Instance Backup (automated backup service) for a deployed instance and verify the backup. |
| `LO-STO-S08` | Restore data from a backup or snapshot to a new resource. |

## Attitudes (savoir-être / posture)

| Code | Learning Outcome |
|---|---|
| `LO-STO-A01` | Recommend the appropriate storage type (block vs object vs file vs cold archive) for a given workload pattern. |
| `LO-STO-A02` | Design a basic backup strategy combining snapshots (short-term operational rollback) and backups (long-term, off-instance restore). |
| `LO-STO-A03` | Anticipate cost and performance implications of storage choices (IOPS class selection, object vs block for static assets, cold archive retrieval delay). |
