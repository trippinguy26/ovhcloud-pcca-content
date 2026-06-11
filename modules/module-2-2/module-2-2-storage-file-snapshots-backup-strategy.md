# Module 2.2 — Storage (Part 2) — File, Snapshots & Backup Strategy
 
## Module Brief
 
- **Module ID**: 2.2
- **Total duration**: 1h30
- **Block breakdown**: Sentier battu 5 min · Theory 30 min · Demo 15 min · Lab 30 min · Micro-check 5 min · Wrap-up 5 min
- **Program**: OVHcloud — Public Cloud — Core Associate
- **Domain covered**: 04 — Storage (Part 2 of 2)
- **LOs covered** (9 total):
  - Knowledge: `LO-STO-K04`, `LO-STO-K05`, `LO-STO-K06`
  - Skills: `LO-STO-S06`, `LO-STO-S07`, `LO-STO-S08`
  - Attitudes: `LO-STO-A01`, `LO-STO-A02`, `LO-STO-A03`
- **Prerequisite modules**: 1.1, 1.2, 1.3, 1.4, 2.1 (mandatory in sequence; standalone delivery requires an existing instance with an attached additional volume, an Object Storage container reachable via S3 credentials, and the learner's `openrc.sh` ready).
- **Red-thread step**: The Northwind staging stack (web, API, PostgreSQL — `<initials>-nw-web-01`, `<initials>-nw-api-01`, `<initials>-nw-db-01`) is up, hardened, with block volumes attached and an Object Storage container holding static assets (output of Module 2.1). Today the learner addresses the question that comes next in every real ops conversation: *how do we not lose data when things go wrong*. The learner (1) mounts a **File Storage** share on both the API and the web instances to host the user-upload directory (a place where multi-attach matters), (2) takes a **volume snapshot** on the PostgreSQL data volume before a risky schema migration and rolls back from it, (3) configures **Instance Backup** on the API host, (4) implements the **PostgreSQL → Object Storage `pg_dump` backup** with a retention policy, and (5) restores the dump into a fresh database to prove the backup is real. The learner leaves with the snapshot-vs-backup distinction internalized and the Northwind data layer is durable for the first time.
### Pedagogical angle
 
This is the *"so it doesn't burn"* module. Module 2.1 introduced the storage paradigms and walked the learner through block and object storage as deployment objects. Module 2.2 closes the domain on the three concepts that separate a learner who can attach a volume from a learner who can run a stateful workload without losing customer data: **File Storage** (the third paradigm, the one operators reach for when they need shared filesystem semantics), **snapshots vs backups** (the distinction Phase 1 flagged as critical — `K05` is a domain anchor LO), and **Cold Archive** (the long-tail of any backup conversation).
 
The module is deliberately heavy on attitudes. All three storage attitude LOs (`A01`, `A02`, `A03`) are covered here, which is intentional: by the end of the storage domain the learner needs to be able to **recommend the right tool**, **design a basic backup strategy**, and **anticipate cost/performance implications**. These three reflexes are formed by the design exercises woven into the Theory block (the comparison matrices) and by the Lab itself, which forces a snapshot/backup choice on a real workload.
 
The snapshot-vs-backup slide is the **single most important slide of the storage domain**. Persona Corporate (often ex-AWS) frequently confuses EBS snapshots with backups because AWS lets you treat them as a quasi-backup product. OVHcloud is more honest about the distinction, and Public Cloud Core makes the learner think about it explicitly. The trainer must verbalize the distinction clearly and reject any "we just take snapshots" answer during the lab.
 
### Trainer demonstration
 
15-minute end-to-end OpenStack CLI + Manager demo on the running `demo-api-01` instance from Module 2.1: the trainer (1) creates a File Storage share, mounts it via NFS on `demo-api-01`, writes a file into it and verifies it appears via a `ls` from a second instance; (2) takes a volume snapshot on the data volume attached to `demo-api-01`, deliberately corrupts a file on the volume, then restores from the snapshot via a new volume created from the snapshot and attached in place of the old one; (3) configures Instance Backup on `demo-api-01` via the Manager UI (the only place this service is exposed cleanly), explains the daily/weekly cycle, and shows what is captured and what is not (system disk only — additional volumes are excluded); (4) walks through a `pg_dump` to Object Storage using `aws s3 cp` on a tiny demo PostgreSQL container, then shows the restore on a fresh database. The Cold Archive product is introduced verbally as the long-term sibling of Standard / Infrequent Access but not demoed (restore latency makes it unsuitable for a 15-minute slot).
 
### Learner lab
 
*Make Northwind's data layer durable — File Storage, snapshots, backups, restore drill* (30 min). Each learner: (1) creates a File Storage share `<initials>-nw-uploads` in GRA, mounts it on `<initials>-nw-api-01` at `/srv/uploads`, writes a marker file, mounts the same share on `<initials>-nw-web-01` and verifies the marker file is visible from there too; (2) takes a snapshot of the PostgreSQL data volume on `<initials>-nw-db-01`, names it `<initials>-nw-db-data-pre-migration`, runs a deliberately destructive SQL (`DROP TABLE northwind.customers`), then restores by creating a new volume from the snapshot, attaching it to the instance, and confirming the customers table is back; (3) configures Instance Backup on `<initials>-nw-api-01` via the Manager (daily, 7-day retention), confirms the schedule appears; (4) implements the `pg_dump` → Object Storage backup script on `<initials>-nw-db-01` (provided as a template), runs it once manually, lists the resulting object in the container; (5) restores the dump into a fresh database called `northwind_restore_test` and runs a single `SELECT COUNT(*)` against it to prove the restore is real. Validation: shared marker file visible from both instances, customers table restored, Instance Backup schedule active, dump object present in Object Storage, `northwind_restore_test` reachable.
 
### Micro-check — question intents (drafted in Block 5)
 
1. File Storage characteristics — Remember — `K04`
2. Snapshot vs Backup — Understand — `K05`
3. Cold Archive positioning — Remember — `K06`
4. File Storage mount semantics — Apply — `S06`
5. Instance Backup scope — Understand — `S07`
6. Restore strategy choice — Apply — `S08` / `A02`
7. Storage tool recommendation — Apply — `A01` / `A03`
### Trainer FAQ — anticipated topics (drafted in Block 8)
 
File Storage vs NAS-HA confusion (Public Cloud vs Hosted Private Cloud product lines), File Storage performance vs local NVMe, the consistency of a volume snapshot on a live database (filesystem-level vs application-level), Instance Backup scope (system disk only, additional volumes are excluded), snapshot billing model, Cold Archive retrieval latency and minimum retention, why `pg_dump` is preferred over volume snapshots for PostgreSQL in this module's scope, the 3-2-1 backup rule mapped to OVHcloud services, what happens to a snapshot when the source volume is deleted, S3 Object Lock and WORM compliance.
 
---
 
## Block 1 — Sentier battu / Hors piste (5 min)
 
### Sentier battu (assumed prerequisites)
 
**Tools:**
- The three Northwind staging instances from Module 1.4 (`<initials>-nw-web-01`, `<initials>-nw-api-01`, `<initials>-nw-db-01`) still running and SSH-reachable.
- The block volume attached to `<initials>-nw-db-01` (output of Module 2.1) mounted at `/var/lib/postgresql` (or equivalent).
- The Object Storage container `<initials>-nw-static` (output of Module 2.1) and the S3 credentials (access key / secret key) generated in that module, available in the learner's `~/.aws/credentials` or in the `s3cmd` config.
- The same `openrc.sh` from Module 1.2, sourced and scoped to GRA.
- `nfs-common` installable via `apt` on the instances (default Ubuntu image already ships it).
**Knowledge:**
- Module 2.1 distinctions between block (single-attach, per-instance) and object (region-scoped, S3 API) storage paradigms.
- Linux mount basics (`mount`, `/etc/fstab`, the difference between mounting a block device and mounting a network share).
- The notion of NFS as a network file protocol from the Module 1.1 legacy-IT vocabulary (NAS / SAN positioning).
- Basic PostgreSQL operations: `psql -c "DROP TABLE …"`, `pg_dump`, `psql -f restore.sql`.
- The ephemeral-storage warning from Module 1.4 (`A03`) — data that is not on a persistent volume is lost on instance termination.
### Hors piste (remediation pointers for gaps)
 
- **No working Northwind stack** → quick rebuild via the Module 1.4 sequence (10 minutes), or pair with a neighbor for the multi-instance File Storage mount step. The snapshot and Instance Backup exercises can also be done on a freshly deployed instance with an attached volume.
- **No S3 credentials at hand** → re-issue from the Manager (Public Cloud → Object Storage → Users) and reconfigure `aws` or `s3cmd`. Two-minute operation. This is also a good moment for the trainer to remind the persona that credential rotation is a security reflex (`LO-SEC-A01`, covered in Module 2.5).
- **`nfs-common` missing on the instance** → `sudo apt install -y nfs-common`. If the instance has no internet egress (no public IP, no NAT), the package can be installed via the Object Storage mirror, but this is unusual for a staging instance — typically the public IP is present.
- **Confusion between Public Cloud File Storage and NAS-HA** → preempt this in the Sentier battu itself: "today we use File Storage, which is the Public Cloud product. NAS-HA exists, it is a Hosted Private Cloud product, not in our scope. Same NFS protocol, different OVHcloud product line." If left until the Theory block, this confusion costs 5 minutes of unfocused questions.
---
 
## Block 2 — Theory & Concepts (30 min)
 
### Slide 1: Why this module exists — the durability question
 
**Visual concept**: A diagram of the three Northwind tiers (web, API, DB) stacked vertically with an attached block volume and an Object Storage bucket already in place (output of Module 2.1). On the right side, four question bubbles pointing in: "How do we share files across instances?" (File Storage), "How do we roll back fast?" (Snapshots), "How do we recover from disaster?" (Backups), "How do we keep data for 10 years?" (Cold Archive). A banner below: "Module 2.1 stored data. Module 2.2 keeps it durable."
 
**Talking points**:
- 2.1 answered "how do I persist data" — 2.2 answers "how do I not lose it"
- Four concepts close the storage domain: File Storage, snapshots, backups, Cold Archive
- The single most important slide of this module is slide 4 — snapshot vs backup
- All three storage attitude LOs are formed by this module's design exercises
**Trainer notes**:
- Annoncer le périmètre: 4 concepts, 4 slides clés
- Souligner que la confusion snapshot/backup est le piège #1 du domaine (ex-AWS surtout)
- Rappeler le persona Corporate: en legacy, le backup est un produit séparé (Veeam, NetBackup) — ici c'est intégré
- Demander: "qui a déjà perdu de la donnée parce qu'un snapshot n'était pas un backup ?" — laisser 5 secondes
---
 
### Slide 2: The third storage paradigm — File Storage (Manila / NFS)
 
**Visual concept**: A horizontal comparison strip with three cells: Block Storage (single-instance, attached, Cinder), Object Storage (region-scoped, S3 API, Swift), File Storage (multi-instance, NFS-mounted, Manila). Each cell shows an icon (a disk, a bucket, a shared folder) and a one-line use case. File Storage cell is highlighted as "the missing piece — when N instances need the same files."
 
**Talking points**:
- Three paradigms: block (single-attach), object (HTTP API), file (multi-attach NFS)
- File Storage = OpenStack Manila + NFS v3
- AZ-scoped, region-resident, mountable on multiple Public Cloud Instances simultaneously
- Use case: shared upload directory, shared static assets at filesystem level, legacy NFS-speaking apps
- **Not** NAS-HA (Hosted Private Cloud, different product line)
**Trainer notes**:
- Souligner que c'est la 3e paradigme — clôt la trilogie présentée en 2.1
- Anticiper la confusion NAS-HA vs File Storage: "même protocole NFS, mais NAS-HA n'est pas un service Public Cloud"
- Si quelqu'un demande "et SMB/CIFS ?" → répondre: NFS v3 uniquement sur File Storage Public Cloud
- Rappeler l'analogie legacy: c'est un NAS, accessible à plusieurs serveurs en même temps, contrairement au volume SAN qui est mono-attaché
---
 
### Slide 3: File Storage — when to reach for it (and when not to)
 
**Visual concept**: A decision table with two columns. Left column "Reach for File Storage when…" lists: N instances must share the same files simultaneously, a legacy app speaks NFS natively, you need POSIX semantics across instances, Kubernetes RWX persistent volumes (forward reference to MKS). Right column "Don't reach for File Storage when…" lists: a single instance owns the data (use Block Storage), the data is large unstructured blobs accessed via HTTP (use Object Storage), you need millisecond IOPS on a database (use Block Storage High Speed).
 
**Talking points**:
- Right tool for the right job — File Storage is not a universal storage
- Multi-attach is the killer feature; single-attach is Block Storage's job
- HTTP-served unstructured data is Object Storage's job
- Performance-critical databases stay on Block Storage (NFS adds latency)
**Trainer notes**:
- Souligner: File Storage = "j'ai besoin de partager des fichiers entre VM, point"
- Anticiper "pourquoi pas File Storage pour la base PostgreSQL ?" → latence NFS, IOPS plus faibles que Block Storage
- Rappeler `LO-STO-A01`: recommander le bon outil — c'est ici que ça se forme
- Si quelqu'un parle de FSx / EFS AWS: équivalent EFS côté AWS, FSx pour les autres protocoles (Windows, Lustre)
---
 
### Slide 4: Snapshot vs Backup — the single most important distinction
 
**Visual concept**: A side-by-side comparison table, 5 rows × 2 columns. Header row: "Snapshot" | "Backup". Rows: **Scope** (point-in-time copy of one volume / full instance or volume image archived independently), **Location** (stored alongside the source in the same storage cluster / stored separately, often in a different system or region), **Retention** (operational rollback, hours to days / disaster recovery, weeks to years), **Recovery time** (seconds to minutes / minutes to hours), **Survives source deletion** (no — snapshot is tied to volume lifecycle / yes — backup is independent). A red banner across the bottom: "A snapshot is NOT a backup."
 
**Talking points**:
- Snapshot = fast point-in-time, same storage, tied to source — operational rollback
- Backup = independent copy, separate storage, lives on its own — disaster recovery
- A snapshot dies with its source volume; a backup survives
- AWS confuses this; OVHcloud is explicit
- The 3-2-1 rule: 3 copies, 2 media, 1 off-site — snapshots alone violate it
**Trainer notes**:
- **Slide la plus importante du module — ralentir, articuler**
- Souligner: "un snapshot n'est PAS un backup" — le répéter, le faire répéter
- Anticiper la résistance ex-AWS: "EBS snapshot c'est presque pareil que backup" → non, EBS snapshot peut être copié S3 cross-region pour devenir un backup; OVHcloud snapshot reste local
- Demander: "si je supprime mon volume, mon snapshot survit ?" → réponse: non
- Si question sur 3-2-1: 3 copies de la donnée, 2 supports différents, 1 hors site
---
 
### Slide 5: When to take a snapshot, when to take a backup
 
**Visual concept**: A 2×2 matrix with axes "Recovery scope" (small / large) and "Recovery horizon" (short / long). Quadrants: top-left (small/short) = Snapshot ("pre-migration rollback, dev branch experiment"), top-right (large/short) = Instance Backup ("daily protection of system disk"), bottom-left (small/long) = Backup of volume ("monthly retention of a database volume"), bottom-right (large/long) = Cold Archive ("annual archive, regulatory retention"). A small caption: "Snapshots are the seatbelt. Backups are the airbag. Cold Archive is the black box."
 
**Talking points**:
- Choose tool by recovery scope and horizon
- Snapshot: short-term, fast rollback on a single resource
- Backup: medium-term, independent copy, restore to anywhere
- Cold Archive: long-term, regulatory, accept retrieval delay
**Trainer notes**:
- Souligner que c'est `LO-STO-A02` qui se forme: design d'une stratégie de backup
- Demander: "avant une migration de schéma SQL, snapshot ou backup ?" → snapshot (rollback rapide)
- Demander: "pour respecter une obligation légale de 7 ans, Cold Archive ou backup standard ?" → Cold Archive
- Rappeler: les deux ne sont pas exclusifs — on combine
---
 
### Slide 6: Volume Snapshot in OVHcloud Public Cloud
 
**Visual concept**: A flowchart in Mermaid (LR, scale 0.65): source Block Volume → snapshot creation (point-in-time copy) → snapshot stored in the same region → new Volume created from snapshot → attached to any instance in the same AZ. A side note in an `<OvhNotice>`: "Volume snapshot is taken at the storage layer — it does not freeze the filesystem. For databases, use application-level dump or freeze the filesystem first."
 
**Talking points**:
- Snapshot is a Cinder operation, point-in-time copy of the volume
- Region-scoped, stored alongside the source volume
- Restore = create a new volume from the snapshot, attach where needed
- **Crash-consistent**, not application-consistent — DBs need extra care
**Trainer notes**:
- Souligner la différence crash-consistent vs application-consistent
- Anticiper: "donc je peux faire un snapshot de ma DB live ?" → oui, mais sans garantie de cohérence applicative — d'où le `pg_dump`
- Rappeler le coût: le snapshot consomme du stockage facturé (pas gratuit)
- Si question sur la cohérence multi-volumes: snapshot est par volume, pas un point-in-time global
---
 
### Slide 7: Instance Backup — the managed backup service
 
**Visual concept**: A two-column slide. Left column "What it captures": `/dev/sda` only (system disk) — stored as a private Glance image. Right column "What it does NOT capture": attached additional volumes (`/dev/sdb`, `/dev/sdc`, …), Object Storage data, File Storage data. Below: a small `<OvhWarning>` block: "Instance Backup is system-disk only. Additional volumes must be backed up independently — via volume snapshots or application-level dumps to Object Storage."
 
**Talking points**:
- Instance Backup = automated daily/weekly backup of the system disk
- Stored as a private image in Glance (region-scoped)
- Configured per instance via the Manager
- **System disk only** — additional volumes are out of scope
**Trainer notes**:
- Souligner le scope: système uniquement, pas les volumes additionnels — c'est LE piège
- Anticiper: "ma DB est sur /dev/sdb, Instance Backup me la sauvegarde ?" → NON, il faut une stratégie séparée
- Rappeler que c'est exposé proprement via le Manager (CLI possible mais moins ergonomique)
- Si question coût: facturé au stockage de l'image, voir grille tarifaire
---
 
### Slide 8: Cold Archive — the long-tail of backup strategy
 
**Visual concept**: A horizontal timeline showing Object Storage tiers from hot to cold: Standard (immediate access, daily use) → Infrequent Access (cheaper, occasional access) → Cold Archive (cheapest, hours to retrieve). Below, an icon for Cold Archive (a tape robot) and a one-liner: "Magnetic tape, multi-DC France, S3 API, WORM-compatible." A side `<OvhNotice>`: "Cold Archive v2 = object-level granularity. Cold Archive v1 = bucket-level (legacy)."
 
**Talking points**:
- Cold Archive = the cheapest tier, magnetic tape backend
- Retrieval is slow (minutes to hours) and billed
- Use case: regulatory archiving, 7-10 year retention, accessed 1-2 times/year max
- Object Lock + WORM for compliance scenarios
- Same S3 API, different latency profile
**Trainer notes**:
- Souligner que c'est le "black box" — on y dépose, on n'y touche pas
- Anticiper: "et si je dois restaurer en urgence ?" → Cold Archive n'est pas pour ça, c'est de l'archivage froid
- Si question sur la souveraineté: Cold Archive est hébergé en France, multi-DC
- Rappeler: Cold Archive est dans le scope Associate au niveau positionnement, pas en pratique manipulation
---
 
### Slide 9: The Northwind backup strategy — putting it together
 
**Visual concept**: The three Northwind tiers (web, API, DB) on the left. For each, a backup strategy is drawn on the right: **web** → Instance Backup (system disk daily, 7-day retention) + static assets already in Object Storage (versioned), **API** → Instance Backup (daily) + `/srv/uploads` on File Storage (no separate backup needed if File Storage replication is enabled at the service level — caveat verbalized by trainer), **DB** → volume snapshot before risky operations + `pg_dump` to Object Storage every night with 30-day retention + monthly copy to Cold Archive. A small annotation: "Three tiers, three strategies — same tools, different recipes."
 
**Talking points**:
- One backup strategy per tier, depending on data criticality and change rate
- Stateless tiers (web, API): Instance Backup is enough
- Stateful tier (DB): snapshot + dump + cold copy
- This is what `LO-STO-A02` looks like in practice
**Trainer notes**:
- Souligner que c'est la synthèse — c'est le slide qui prépare le lab
- Rappeler la règle 3-2-1: la stratégie DB respecte 3 copies (volume + dump S3 + Cold Archive), 2 supports, 1 hors site (Cold Archive)
- Anticiper: "pourquoi pas un snapshot quotidien de la DB ?" → cohérence crash-only, on préfère `pg_dump` pour la cohérence applicative
- Demander aux apprenants de réfléchir au tier dont ils ont la responsabilité dans leur quotidien
---
 
### Slide 10: Hyperscaler cross-reference
 
**Visual concept**: A 4×3 table. Rows = OVHcloud services covered in this module (File Storage, Volume Snapshot, Instance Backup, Cold Archive). Columns = OVHcloud / AWS / Azure. Cells: File Storage → Amazon EFS / Azure Files; Volume Snapshot → EBS Snapshot / Managed Disk Snapshot; Instance Backup → AWS Backup (partial equivalent) / Azure Backup; Cold Archive → S3 Glacier Deep Archive / Azure Archive Storage.
 
**Talking points**:
- Same primitives across hyperscalers — naming differs, concepts match
- Snapshot/Backup distinction is universal (and universally misunderstood)
- AWS Backup is a closer match to Instance Backup than EBS Snapshot
- Glacier Deep Archive is the closest analog to Cold Archive
**Trainer notes**:
- Souligner que c'est un slide d'ancrage pour les profils ex-AWS / ex-Azure
- Anticiper "AWS Backup couvre plus que le disque système, et OVHcloud Instance Backup non" → confirmer, c'est une différence de périmètre
- Si question sur Glacier Instant Retrieval: pas d'équivalent direct OVHcloud, on reste sur Standard / Infrequent Access / Cold Archive
- Rappeler: ce n'est pas un classement, c'est une cartographie
---
 
## Block 3 — Trainer Demonstration (15 min)
 
### Demo scenario
 
Starting from the `demo-api-01` instance (Module 2.1 output, Block Volume attached at `/var/lib/data`) and the running `demo-db-01` PostgreSQL instance, demonstrate the four storage durability primitives in sequence: (1) create and multi-mount a File Storage share, (2) take and restore from a volume snapshot, (3) configure Instance Backup, (4) implement and execute a `pg_dump` to Object Storage. Channel: **OpenStack CLI** for snapshot and File Storage operations, **Manager UI** for Instance Backup (the only place it is cleanly exposed), **shell + aws CLI** for the `pg_dump` to Object Storage.
 
### Demo script
 
| Step | Action | Expected output | Trainer commentary |
|---|---|---|---|
| 1 | `openstack share create --share-type default --share-network <net-id> nfs 10 --name demo-uploads` | Share created, status `creating` then `available` | "Manila provisions an NFS share, 10 GB capacity, region-scoped" |
| 2 | `openstack share access create demo-uploads ip <demo-api-01-IP>` | Access rule added | "Access control by IP — only this instance can mount" |
| 3 | `openstack share show demo-uploads` (read the `path` field) | Output shows `<server-ip>:/share-<uuid>` | "This is the NFS path we'll use to mount" |
| 4 | SSH into `demo-api-01`, `sudo mount -t nfs <path> /mnt/uploads` | Share mounted, `df -h` shows the new mount | "NFS v3, mounted like any network share" |
| 5 | `sudo touch /mnt/uploads/marker-from-api.txt` | File created on the share | "This file lives on the shared filesystem, not on the local disk" |
| 6 | On `demo-web-01`, mount the same share at `/mnt/uploads`, `ls /mnt/uploads` | `marker-from-api.txt` visible | "Multi-attach in action — that's File Storage's killer feature" |
| 7 | `openstack volume snapshot create --volume demo-data-volume demo-data-snap-01` | Snapshot created, status `available` | "Cinder takes a point-in-time copy of the volume" |
| 8 | On the instance: `sudo rm -f /var/lib/data/important-file.txt` (deliberate corruption) | File gone | "Now we restore — this is the rollback drill" |
| 9 | `openstack volume create --snapshot demo-data-snap-01 --size 10 demo-data-restored` then detach old, attach restored | Volume restored, file present | "We never restored *into* the source — we built a new volume from the snapshot" |
| 10 | Manager UI → Public Cloud → Instances → demo-api-01 → Backup tab → Enable daily, 7-day retention | Schedule appears, next run timestamp shown | "Manager only — this is the right channel for Instance Backup" |
| 11 | `pg_dump northwind \| aws s3 cp - s3://demo-northwind-backups/db-$(date +%Y%m%d).sql --endpoint-url=https://s3.gra.io.cloud.ovh.net` | Object uploaded to the container | "Stream piped directly to S3 — no intermediate disk needed" |
| 12 | `aws s3 ls s3://demo-northwind-backups/ --endpoint-url=…` | The new dump object visible | "The backup is now on independent storage — that's the snapshot/backup distinction in practice" |
 
### Common demo failure modes
 
- **File Storage mount hangs** → cause: access rule not yet propagated, or the share network is wrong → recovery: `openstack share access list demo-uploads` to confirm rule is `active`, then retry. Wait time can be 30 seconds.
- **Snapshot creation in `error` state** → cause: the source volume is detached and was already deleted, or quotas are exhausted → recovery: check `openstack volume show <vol>` status and `openstack quota show` for the project.
- **`aws s3 cp` returns AccessDenied** → cause: endpoint URL typo (region mismatch), or credentials not loaded → recovery: verify `~/.aws/credentials` and the `--endpoint-url` matches the container's region (GRA / SBG / …).
- **Instance Backup tab not visible** → cause: the instance was just created and the tab is delayed → recovery: refresh the Manager page, or use the OpenStack CLI fallback `openstack server image create` to take a one-shot manual image as the equivalent.
---
 
## Block 4 — Learner Lab (30 min)
 
### Lab brief (learner-facing)
 
Make Northwind's data layer durable. You will (1) provision a File Storage share and mount it on both the web and the API instance, (2) take a volume snapshot on the PostgreSQL data volume and restore from it after a destructive operation, (3) configure Instance Backup on the API instance, (4) implement a `pg_dump` backup to Object Storage, and (5) restore the dump into a fresh database to prove the backup is real. Channels: OpenStack CLI for File Storage and snapshot, Manager UI for Instance Backup, shell + `aws s3` for the dump. End state: shared marker file visible on both instances, PostgreSQL customers table restored, Instance Backup scheduled, dump object present in Object Storage, restore database queryable.
 
### Lab steps (learner-facing)
 
1. Create a File Storage share named `<initials>-nw-uploads` of 10 GB in GRA, set an access rule for the public IP of `<initials>-nw-api-01`, mount it at `/srv/uploads` on the API instance, write a file `marker-api.txt` into it.
2. Add an access rule for `<initials>-nw-web-01`, mount the same share at `/srv/uploads` on the web instance, list the contents — `marker-api.txt` must be visible. Persist both mounts in `/etc/fstab` (so they survive a reboot).
3. Take a snapshot of the PostgreSQL data volume on `<initials>-nw-db-01`, name it `<initials>-nw-db-data-pre-migration`.
4. SSH into `<initials>-nw-db-01`, run `psql -U postgres -d northwind -c "DROP TABLE customers;"` (deliberate destruction). Confirm with `\dt` that the table is gone.
5. Restore: create a new volume from the snapshot named `<initials>-nw-db-data-restored`, stop PostgreSQL, detach the old volume, attach the restored one in its place, restart PostgreSQL. Confirm with `\dt` that the customers table is back.
6. In the Manager UI, enable Instance Backup on `<initials>-nw-api-01` with daily frequency and 7-day retention. Confirm the next run timestamp is shown.
7. Copy the provided `pg_dump_to_s3.sh` template into `<initials>-nw-db-01:/usr/local/bin/`, edit the bucket name and credentials, run it once manually. Confirm the dump object appears in `<initials>-nw-static` (or a dedicated `<initials>-nw-backups` container if you created one).
8. On a fresh PostgreSQL database (`CREATE DATABASE northwind_restore_test`), restore the dump via `psql -U postgres -d northwind_restore_test -f <local-dump>`. Run `SELECT COUNT(*) FROM customers;` — it must return a non-zero count.
### Validation criteria
 
- `marker-api.txt` visible from both `<initials>-nw-api-01` and `<initials>-nw-web-01` at `/srv/uploads/`.
- `customers` table present in the live `northwind` database after restore (`\dt` in `psql`).
- Instance Backup schedule visible in the Manager on `<initials>-nw-api-01` with a non-empty "next run" field.
- One object matching `db-*.sql` present in the Object Storage container, listed via `aws s3 ls`.
- `northwind_restore_test` database queryable with `SELECT COUNT(*) FROM customers;` returning a non-zero count.
### Lab artifacts to produce
 
- The `pg_dump_to_s3.sh` script (provided as a template, completed by the learner) — committed to the learner's lab repo under `module-2-2/`.
- A one-line text file `restore-proof.txt` containing the output of `SELECT COUNT(*) FROM customers;` from the restored database.
### Common lab support questions
 
- **"Can I mount File Storage on more than 2 instances?"** → Yes, add an access rule per instance IP. The killer feature is multi-attach, not 2-attach.
- **"Why does the snapshot restore require a new volume instead of overwriting the old one?"** → Cinder semantics: snapshots are restored *to* a new volume, never *in place*. This is a safety feature — the original is preserved until the learner decides to delete it.
- **"Instance Backup didn't run yet because the schedule is for tomorrow — how do I verify it works?"** → Two options: (1) trust the schedule (the timestamp confirms the service is active), (2) take a one-shot manual `openstack server image create <instance> <image-name>` to validate the underlying mechanism.
- **"The `aws s3 cp` is slow — is this normal?"** → For small dumps (< 100 MB) on a fresh project, yes — first-write latency on Object Storage. Subsequent writes are faster.
- **"Should I delete the snapshot after the lab?"** → For a real project: keep it as long as you might need the rollback (hours to days). For this lab: yes, to clean quotas — `openstack volume snapshot delete <name>`.
---
 
## Block 5 — Micro-check QCM (5 min)
 
Format: 7 single-answer multiple-choice questions, formative (non-certifying).
 
### Question 1
 
- **Stem**: Which OVHcloud Public Cloud service exposes a shared filesystem accessible from multiple Public Cloud Instances simultaneously?
- **Correct answer**: B. File Storage (based on OpenStack Manila, NFS v3)
- **Distractors**:
  - A. NAS-HA — *Why wrong*: NAS-HA is a Hosted Private Cloud product, not Public Cloud.
  - C. Block Storage with multi-attach mode — *Why wrong*: Block Storage in Public Cloud is single-attach.
  - D. Object Storage with FUSE mount — *Why wrong*: possible via `s3fs` but not a Public Cloud filesystem service, and not POSIX-compliant.
- **LO traced**: `LO-STO-K04`
- **Bloom level**: Remember
### Question 2
 
- **Stem**: A volume snapshot is taken on a Block Storage volume. The source volume is then deleted. What happens to the snapshot?
- **Correct answer**: C. The snapshot is also deleted, because it is tied to the source volume's lifecycle.
- **Distractors**:
  - A. The snapshot is preserved and can be restored to a new volume at any time — *Why wrong*: that would be a backup, not a snapshot.
  - B. The snapshot is automatically converted to an Object Storage object — *Why wrong*: no automatic conversion exists.
  - D. The snapshot can still be restored for 30 days after the source volume deletion — *Why wrong*: no such grace period in Cinder semantics.
- **LO traced**: `LO-STO-K05`
- **Bloom level**: Understand
### Question 3
 
- **Stem**: Cold Archive is the appropriate choice for which of the following workloads?
- **Correct answer**: A. Regulatory archiving of historical records, accessed once or twice per year, with 10-year retention.
- **Distractors**:
  - B. Daily backups of a production database with a 24-hour RPO — *Why wrong*: Cold Archive retrieval latency (minutes to hours) violates the RPO.
  - C. Hot static assets served on a public website — *Why wrong*: use Object Storage Standard.
  - D. Shared filesystem for a Kubernetes cluster — *Why wrong*: that is File Storage, and Cold Archive is not a filesystem.
- **LO traced**: `LO-STO-K06`
- **Bloom level**: Remember
### Question 4
 
- **Stem**: A learner has just provisioned a File Storage share. Which step is required *before* mounting it from a Public Cloud Instance?
- **Correct answer**: B. Create an access rule authorizing the instance's IP on the share.
- **Distractors**:
  - A. Format the share with `mkfs.ext4` — *Why wrong*: File Storage exposes a pre-formatted NFS share, no client-side formatting.
  - C. Generate S3 credentials and configure the AWS CLI — *Why wrong*: that is Object Storage, not File Storage.
  - D. Attach the share to the instance via `openstack server add volume` — *Why wrong*: that is the Block Storage attach command, not applicable to File Storage.
- **LO traced**: `LO-STO-S06`
- **Bloom level**: Apply
### Question 5
 
- **Stem**: An OVHcloud Public Cloud Instance has Instance Backup enabled. The instance has its root filesystem on `/dev/sda` and an attached Block Volume mounted at `/var/lib/data` on `/dev/sdb`. After a corruption on `/var/lib/data`, which statement is true?
- **Correct answer**: D. Instance Backup does not protect `/var/lib/data`; the additional volume must be backed up independently.
- **Distractors**:
  - A. The Instance Backup includes both `/dev/sda` and `/dev/sdb` by default — *Why wrong*: Instance Backup captures the system disk only.
  - B. Instance Backup can be configured to include attached volumes via an option in the Manager — *Why wrong*: no such option exists at the Associate scope.
  - C. The attached volume is auto-snapshotted whenever Instance Backup runs — *Why wrong*: no automatic snapshot of attached volumes.
- **LO traced**: `LO-STO-S07`
- **Bloom level**: Understand
### Question 6
 
- **Stem**: Before a risky PostgreSQL schema migration on a Public Cloud Instance with its data on a dedicated Block Volume, which short-term protection is the most appropriate?
- **Correct answer**: A. A volume snapshot of the data volume, kept for the duration of the migration window.
- **Distractors**:
  - B. A copy of the data folder into `/tmp` on the same instance — *Why wrong*: `/tmp` lives on the system disk and disappears with the instance.
  - C. A Cold Archive copy of the data folder — *Why wrong*: retrieval latency makes Cold Archive unsuitable for a same-day rollback.
  - D. An Instance Backup triggered manually before the migration — *Why wrong*: Instance Backup is system-disk only, the data on `/dev/sdb` is not captured.
- **LO traced**: `LO-STO-S08`, `LO-STO-A02`
- **Bloom level**: Apply
### Question 7
 
- **Stem**: A web application stores user uploads. The application is deployed across three Public Cloud Instances behind a Load Balancer. Which storage service is the right choice for the uploaded files?
- **Correct answer**: C. File Storage (Manila / NFS), mounted on all three instances.
- **Distractors**:
  - A. A Block Storage volume attached to the first instance, exported via NFS from that instance to the other two — *Why wrong*: works but introduces a single point of failure and is not the native Public Cloud answer.
  - B. Object Storage with an `s3fs` mount on each instance — *Why wrong*: possible but not POSIX-compliant, and not the intended use of Object Storage.
  - D. A separate Block Storage volume per instance, with rsync between them — *Why wrong*: re-implements shared filesystem at the application level, fragile.
- **LO traced**: `LO-STO-A01`, `LO-STO-A03`
- **Bloom level**: Apply
---
 
## Block 6 — Wrap-up & Transition (5 min)
 
### Recap
 
By the end of this module the learner can:
- **Distinguish** the three storage paradigms and identify when File Storage is the right tool (`K04`)
- **Articulate** the snapshot-vs-backup distinction without confusion (`K05`)
- **Identify** Cold Archive's positioning in a tiered storage strategy (`K06`)
- **Mount** a File Storage share on multiple instances (`S06`)
- **Configure** Instance Backup and know its scope limitations (`S07`)
- **Restore** data from snapshots and backups, with a working restore drill (`S08`)
- **Recommend** the right storage tool per workload (`A01`)
- **Design** a basic snapshot + backup + archive strategy (`A02`)
- **Anticipate** cost and performance implications of storage choices (`A03`)
### Transition to next module via red-thread scenario
 
Northwind's data layer is now durable: snapshots on the database volume, Instance Backups on the application tiers, `pg_dump` to Object Storage with a verified restore, File Storage hosting the multi-tier upload directory. The storage domain is closed. But Northwind's three-tier stack is still connected by default Public Cloud networking — a single public IP per instance, no isolation between tiers, the database directly reachable from any tier with the right credentials, and no internal traffic plan for when the API frontend grows beyond a single instance. Tomorrow morning (Module 2.3) the network conversation starts: public vs private IPs, the subnet model, Security Groups beyond the basics seen in Module 1.4, and the first design choice — splitting Northwind into a public tier (web) and a private tier (API + DB).
 
---
 
## Trainer FAQ (anticipated questions for this module)
 
**Q: Isn't NAS-HA the same as File Storage? They both speak NFS.**
A: Same protocol (NFS), different OVHcloud product lines. NAS-HA is a Hosted Private Cloud product, billed and managed separately, with a different SLA. File Storage is the Public Cloud Manila-based service, billed inside the Public Cloud project, scoped to the AZ. For a Public Cloud workload, use File Storage. NAS-HA only enters the conversation if the customer already has a Hosted Private Cloud subscription and wants to share storage across product lines.
 
**Q: Can I take an application-consistent snapshot of a running PostgreSQL on a Block Volume?**
A: Not at the Cinder snapshot level alone. Cinder snapshots are crash-consistent — the equivalent of pulling the power on the disk. PostgreSQL will recover via its WAL on the restored volume, but you may lose in-flight transactions. For application-consistent backups, use `pg_dump` (logical) or `pg_basebackup` + WAL archiving (physical, with point-in-time recovery). For the Northwind scope, `pg_dump` to Object Storage is sufficient.
 
**Q: What is the retention model on Instance Backup?**
A: Daily and weekly cycles, configurable retention up to 30 days at the Associate scope. The backups are stored as private Glance images in the same region. They are billed at image storage rate. Beyond 30 days, the right pattern is to copy critical images to Object Storage (manual `openstack image save`) and from there to Cold Archive if needed.
 
**Q: How does Cold Archive retrieval billing work?**
A: Two cost components: storage (very low, per GB-month) and retrieval (per GB retrieved, billed at retrieval time). The retrieval also takes time — minutes to hours depending on the volume. Cold Archive is the right tool when the retrieval event is rare and predictable. If the retrieval pattern becomes monthly or more, Infrequent Access is usually cheaper overall.
 
**Q: What is the 3-2-1 rule and how does it map to OVHcloud Public Cloud Core?**
A: 3 copies of the data, 2 different storage media, 1 off-site. Mapped: copy 1 = the live volume on the instance, copy 2 = a `pg_dump` on Object Storage (different storage class), copy 3 = a copy of that dump on Cold Archive (different physical media — tape — and different DC). For Northwind, this is exactly the strategy in slide 9.
 
**Q: What happens if I delete the Block Volume but want to keep the snapshot for later?**
A: You cannot. In Cinder, a snapshot's lifecycle is tied to its source volume. The Manager prevents deletion of a volume that has dependent snapshots; you must delete the snapshots first. If you want the snapshot data to survive volume deletion, convert it to a backup by creating an independent volume from the snapshot first, then export that to Object Storage via `openstack image create --volume`.
 
**Q: Why use `pg_dump` instead of a Cinder snapshot for PostgreSQL backups?**
A: Three reasons: (1) **consistency** — `pg_dump` is application-aware and produces a logically consistent backup; Cinder snapshots are crash-consistent only; (2) **portability** — a `pg_dump` is a SQL file restorable to any PostgreSQL version (within compatibility), a snapshot is tied to the exact volume/instance topology; (3) **storage independence** — `pg_dump` on Object Storage survives the source instance and volume deletion; a snapshot does not.
