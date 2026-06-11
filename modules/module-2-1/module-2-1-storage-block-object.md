# Module 2.1 — Storage (Part 1) — Block & Object
 
## Module Brief
 
- **Module ID**: 2.1
- **Total duration**: 1h30
- **Block breakdown**: Sentier battu 5 min · Theory 30 min · Demo 15 min · Lab 30 min · Micro-check 5 min · Wrap-up 5 min
- **Program**: OVHcloud — Public Cloud — Core Associate
- **Domain covered**: 04 — Storage (Part 1 of 2)
- **LOs covered** (8 total):
  - Knowledge: `LO-STO-K01`, `LO-STO-K02`, `LO-STO-K03`
  - Skills: `LO-STO-S01`, `LO-STO-S02`, `LO-STO-S03`, `LO-STO-S04`, `LO-STO-S05`
- **Prerequisite modules**: 1.1, 1.2, 1.3, 1.4 (standalone delivery requires the learner's `openrc.sh` ready, at least one running instance in GRA the learner can attach a volume to, and an S3-capable client installed locally — `aws-cli` or `rclone`).
- **Red-thread step**: The CTO's morning brief from the close of Module 1.4 lands on the learner's desk. Two of the three demands target storage: *(1) the PostgreSQL data on `<initials>-nw-db-01` must move off the ephemeral local disk onto a real volume that survives instance deletion, (2) the API host needs to fetch build artifacts at first boot from a place that is not the OS image.* Today the learner provisions a 50 GiB Block Storage volume attached to `<initials>-nw-db-01` and prepares it to receive the PostgreSQL data directory in Module 2.2, and creates an Object Storage container holding a sample build artifact that any of the three instances can download with credentials. By the end of this module, Northwind's storage layer has two of its three pillars in place — block for stateful data, object for shared static assets — and the learner has internalized which one to reach for in which situation.
### Pedagogical angle
 
This is the **"data outlives the compute"** module. Compute taught the learner that an instance is a disposable execution unit; storage is what makes that disposability acceptable. Block and Object are the two storage primitives that cover roughly 90 % of any real workload — block for "this instance's data" (databases, filesystems, app state), object for "data that many things share" (artifacts, backups, static assets, logs). File Storage, snapshots, and backup strategy are the remaining 10 % and they go to Module 2.2; this module deliberately keeps the scope tight to give Theory enough room to install a clean mental model.
 
The pedagogical hook is the **block-vs-object distinction**, which Corporate ex-AWS learners often blur and Digital Starter learners often haven't met. The trap is to teach the two paradigms as a list of features; the win is to teach them as **two answers to two different access patterns** — random read/write of mutable bytes addressed by offset (block) versus immutable read/write of whole objects addressed by key (object). Once that frame is clear, every other characteristic (AZ-scoping, single-attach, performance tiers for block; region-scoping, eventual consistency, S3 API for object) falls out as a consequence.
 
The module also introduces the **OpenStack provenance**: Cinder behind Block Storage, Swift behind Object Storage (with the S3-compatible API layered on top). This is not academic. Ex-AWS learners ask about S3 reflexes that work or don't work on OVHcloud, and the honest answer requires knowing that the S3 API on OVHcloud is a translation layer in front of Swift — most read/write operations map, some advanced features (multi-part lifecycle, certain CORS edges) may not. Acknowledging this up front is more credible than pretending the API is 100 % identical.
 
### Trainer demonstration
 
15-minute end-to-end OpenStack CLI + `aws-cli` demo. Starting from the `demo-db-01` instance (a placeholder running in the trainer's project, equivalent to the learner's `<initials>-nw-db-01`): (1) the trainer creates a 20 GiB `classic` Block Storage volume in GRA9, lists it, attaches it to `demo-db-01`, SSHes in to identify the new block device with `lsblk`, formats it `ext4`, mounts it on `/mnt/data`, writes a marker file; (2) the trainer detaches the volume cleanly (unmount + `openstack server remove volume`), re-attaches it to a second instance `demo-web-01`, mounts it, verifies the marker file is still there — demonstrating that the volume carried its data independently of the original instance; (3) the trainer generates S3 credentials in the Manager (or via `openstack ec2 credentials create`), configures `aws s3` with the OVHcloud Public Cloud GRA endpoint, creates a container `demo-northwind-artifacts`, uploads a sample tarball, lists, downloads to verify, then sets a public-read ACL on a single file to expose it via HTTPS — demonstrating presigned/public-read access. The Manager UI is shown briefly for the volume creation and the credential generation to give the GUI/CLI parity reference.
 
### Learner lab
 
*Prepare Northwind's stateful and shared storage layers* (30 min). Each learner: (1) creates a 50 GiB `classic` Block Storage volume in GRA9 named `<initials>-nw-db-data-01`, attaches it to `<initials>-nw-db-01`, formats it `ext4`, mounts it on `/mnt/pgdata`, persists the mount in `/etc/fstab` so it survives reboot, writes an `OWNER` file containing the learner's initials and the date; (2) reboots the instance, SSHes back in, verifies `/mnt/pgdata` is still mounted with the `OWNER` file intact; (3) generates S3 credentials in the Manager, installs and configures `aws-cli` locally (or uses `rclone`) against the GRA Object Storage endpoint; (4) creates a container `<initials>-nw-artifacts`, uploads any local file > 1 MiB (a tarball, a screenshot, anything), lists the container, downloads the file back under a different name to verify integrity (`md5sum` matches); (5) sets a single object to public-read and verifies the public HTTPS URL returns the file from an incognito browser window or via `curl` without credentials. Validation: the volume survives instance reboot with data intact; the Object Storage container exists with at least one file uploaded and at least one file publicly accessible by URL.
 
### Micro-check — question intents (drafted in Block 5)
 
1. Block vs Object — which one is right for which access pattern — Understand — `K01`
2. Block Storage AZ scoping (and the "single-attach, same-AZ" consequence) — Remember — `K02`
3. Object Storage region scoping and S3 API origins — Remember — `K03`
4. Cinder vs Swift — what OpenStack project sits behind which OVHcloud product — Remember — `K02` / `K03`
5. Resizing a Block Storage volume — what the volume operation gives you, what the filesystem still needs — Apply — `S02`
6. Detaching a volume cleanly — what must happen at the OS level first — Apply — `S03`
7. Object Storage permissions — three common visibility patterns and when to use which — Apply — `S05`
### Trainer FAQ — anticipated topics (drafted in Block 8)
 
The S3-compatible API surface vs native AWS S3 features, the high-performance volume tier and when it matters, why a Block Storage volume can only attach to one instance, the AZ vs region distinction (and why Block is AZ-scoped while Object is region-scoped), online resize gotchas at the filesystem level, S3 credentials lifecycle and rotation, Object Storage pricing model basics (storage + egress + requests) without descending into FinOps, encryption at rest defaults, and the strong-vs-eventual consistency question on the new S3-compatible offer.
 
---
 
## Block 1 — Sentier battu / Hors piste (5 min)
 
### Sentier battu (assumed prerequisites)
 
**Tools:**
- The `<initials>-nw-db-01` instance from Module 1.4 still running and SSH-reachable.
- The same `openrc.sh` from Module 1.2, sourced and scoped to GRA.
- An S3-capable client installed on the workstation: `aws-cli` (v2 preferred) or `rclone`. `aws-cli` is the reference in the demo and lab.
- Basic Linux command-line literacy: `lsblk`, `mount`, `df -h`, `mkfs.ext4`, editing `/etc/fstab`.
**Knowledge:**
- The five-object instance composition from Module 1.3 (flavor, image, key pair, network, Security Group).
- The notion of an OS-level mount point and the difference between a block device, a filesystem, and a directory.
- Awareness that AWS S3 exists conceptually — at least a vague mental model of "buckets and keys" is enough; learners coming from pure on-prem get a refresher in Slide 6.
- Awareness that an HTTPS URL can serve a static file (no application server needed) — the building block behind Object Storage public-read mode.
### Hors piste (remediation pointers for gaps)
 
- **No `<initials>-nw-db-01` instance available** → redeploy a `d2-2` Ubuntu instance in GRA in 2 minutes using the Module 1.3 sequence. The data volume work proceeds identically; only the `OWNER` filename changes.
- **Never used `aws-cli` before** → 60-second teach: `aws configure` writes credentials to `~/.aws/credentials`, every command takes `--endpoint-url` to target a non-AWS endpoint. The lab handout includes the exact `~/.aws/config` profile to drop in.
- **Unfamiliar with `/etc/fstab` and mount persistence** → the lab handout includes a copy-paste `fstab` line with the correct UUID syntax; the learner only needs to substitute the UUID from `blkid`. A 30-second `fstab` field walkthrough during the demo covers it: device, mountpoint, fstype, options, dump, pass.
- **The corporate proxy intercepts `aws s3` HTTPS** → fall back to the Manager UI for the upload/download steps of the lab. The S3 API exercise is then partially demonstrative; the credential lifecycle (Step 3) still applies.
---
 
## Block 2 — Theory & Concepts (30 min)
 
### Slide 1: Why this module exists — data outlives compute
 
**Visual concept**: Two stacked horizontal lanes labeled "Instance lifetime" (a short blue bar with start/end markers, ~12 months) and "Data lifetime" (a long blue bar extending far beyond, labeled "years"). An arrow from the short bar to the long bar with the caption "the data must survive". Below, three icons side by side: a cylinder (Block), a cube-grid (Object), a folder (File — greyed out and labeled "Module 2.2"). A small banner: "1.3/1.4 deployed and operated the instance. 2.1 makes the data outlive it."
 
**Talking points**:
- The instance is **disposable by design** in cloud — you destroy, you redeploy, that's a feature, not a bug
- Data, by contrast, **must outlive** any single instance — that requires storage that is **decoupled from instance lifecycle**
- OVHcloud Public Cloud exposes **three storage paradigms**: block, object, file — each one solves a specific class of access pattern
- This module covers **block and object**; file storage and backup strategy come in Module 2.2
- The decoupling is what enables every modern operations pattern: blue-green deploys, immutable infrastructure, autoscaling — all assume "data lives elsewhere"
**Trainer notes**:
- Souligner que c'est exactement le déclic culturel le plus difficile pour un ex-VMware : la VM est devenue jetable, c'est la donnée qui devient le seul actif
- Anticiper "et un local disk persistent comme sur AWS instance store ?" : pareil que Module 1.4, local disk = éphémère, périt avec l'instance, pas une option pour de la donnée
- Rappeler le red-thread : le CTO veut PostgreSQL sur un vrai volume et les artefacts dans un bucket, c'est l'agenda de la journée
- Si quelqu'un demande pourquoi le file storage est mis de côté : trois paradigmes c'est trop pour 30 min, file storage est moins utilisé que block/object, donc 2.2
---
 
### Slide 2: The two access patterns that drive everything
 
**Visual concept**: Two side-by-side panels. Left panel "Random byte-level access", with a horizontal byte stream labeled `[byte 0 ... byte 50000000000]` and three arrows pointing at different offsets, labeled "read 4 KiB at offset X", "write 4 KiB at offset Y", "update in place". Caption underneath: "Block Storage — the disk model." Right panel "Whole-object key-addressed access", with a list of keys (`artifacts/v1.0.tgz`, `images/logo.png`, `backups/2026-06-08.sql.gz`) each pointing to a complete file blob. Caption underneath: "Object Storage — the key/value model." Between the two panels, a small note: "Pick the model that matches the workload."
 
**Talking points**:
- **Block** = a virtual disk you mount on **one** instance, indistinguishable from a physical disk from the OS perspective — formatted, partitioned, written to byte by byte
- **Object** = an HTTP-addressable store: you `PUT` a whole object under a key, you `GET` it back, you don't update bytes in place
- Block is the right tool when you need **random read/write of mutable state**: a database, a filesystem, an app's working directory
- Object is the right tool when you need **immutable read/write of complete files**, often **shared across many consumers**: artifacts, backups, static assets, logs
- The two are **not interchangeable** — using object as a database is painful, using block to share static assets across 10 web servers is wasteful
- Legacy analogy: block is a **SAN LUN**, object is a **CDN origin / file repository**
**Trainer notes**:
- Souligner que le critère n'est pas "performance" ou "cost", c'est le **pattern d'accès**, tout le reste découle
- Demander aux apprenants : "Vous voulez stocker un PDF de 50 MB que 500 personnes vont télécharger — block ou object ?" → object, parce que partage, immutable, accès HTTP
- Anticiper "et si je veux les deux ?" : tout à fait normal, une appli typique utilise les deux — block pour la base, object pour les uploads utilisateurs
- Si quelqu'un évoque NFS/file storage → on y vient en 2.2, c'est le troisième paradigme pour le cas "plusieurs instances partagent un filesystem"
- Rappeler analogie ex-AWS : Block = EBS, Object = S3 — le mapping est 1-to-1 conceptuellement
---
 
### Slide 3: Block Storage — characteristics
 
**Visual concept**: An instance icon in the center. To its left, a cylinder labeled "Block Volume 50 GiB" connected by a thick line labeled `/dev/sdb`. Around the diagram, four labeled tags pointing at it: **AZ-scoped** (with a small region/AZ box around the pair), **persistent** (a checkmark on a clock), **single-attach** (a "1:1" badge), **performance tier** (a small dial: classic / high-speed / high-speed-gen2). At the bottom: a banner "OpenStack Cinder under the hood."
 
**Talking points**:
- **AZ-scoped**: a volume lives in a single Availability Zone — it can only attach to an instance in the same AZ
- **Persistent**: a volume's lifecycle is independent of the instance — deleting the instance does not delete the volume (you delete the volume explicitly)
- **Single-attach**: at any given moment, a volume is attached to **at most one** instance — no shared block volumes in this model
- **Performance tiers**: `classic` (HDD-backed, lower cost, default), `high-speed` (SSD-backed, higher IOPS), `high-speed-gen2` (NVMe-backed, top tier) — you choose at creation, you can recreate to change
- **Resizable**: you can grow a volume online; you cannot shrink it
- **OpenStack Cinder** is the project name: the API, the CLI verbs (`openstack volume create`), and most behavior come from there
**Trainer notes**:
- Souligner que single-attach est **la** contrainte qui différencie block du file storage : si on veut partager, c'est file storage, pas block
- Anticiper "et le multi-attach Cinder qui existe sur d'autres clouds OpenStack ?" : pas exposé dans le Core OVHcloud, c'est une absence à connaître, pas un bug
- Si quelqu'un demande "AZ vs region ?" : on creuse en slide 5, garder le suspens 30 secondes
- Vérifier la compréhension : "si je supprime mon instance, le volume disparaît ?" → non, le volume survit, c'est tout le point
- Rappeler analogie AWS : EBS volume, AZ-scoped, single-attach, gp3/io2, exactement le même modèle mental
---
 
### Slide 4: Block Storage performance tiers — choosing between classic, high-speed, high-speed-gen2
 
**Visual concept**: A horizontal bar with three segments left-to-right: `classic` (HDD icon, label "≈ 250 IOPS, ~lowest €"), `high-speed` (SSD icon, label "≈ 3 000 IOPS, ~mid €"), `high-speed-gen2` (NVMe icon, label "≈ 20 000 IOPS, ~top €"). Below each tier, a short workload example: classic — "archives, batch logs, cold-ish data"; high-speed — "general app data, mid-traffic databases"; high-speed-gen2 — "high-traffic OLTP, latency-sensitive workloads". Footer reminder: "IOPS numbers are indicative — verify on docs.ovhcloud.com."
 
**Talking points**:
- Three tiers, **chosen at volume creation**, not changeable on an existing volume — to switch tier you create a new volume in the target tier and copy the data over
- **`classic`** is HDD-backed: lowest cost per GiB, IOPS suited to sequential workloads (log archives, batch jobs reading large files)
- **`high-speed`** is SSD-backed: the **default reasonable choice** for general-purpose application data and mid-traffic databases
- **`high-speed-gen2`** is NVMe-backed: top-tier IOPS and lowest latency, for OLTP databases and latency-critical workloads
- The choice is **a cost-vs-performance trade-off** — overprovisioning is wasteful, underprovisioning is operational pain (slow database, complaints)
- Default reflex for Northwind's PostgreSQL: `high-speed` is plenty for staging; production might warrant `high-speed-gen2`
**Trainer notes**:
- Souligner que le choix se fait à la création et qu'on ne change pas de tier sur un volume existant : il faut recréer et copier
- Anticiper "et les IOPS exactes ?" : renvoyer à docs.ovhcloud.com, les chiffres bougent, retenir l'ordre de grandeur et le mapping HDD/SSD/NVMe
- Si quelqu'un demande "comment je sais ce qu'il me faut ?" : commencer par `high-speed`, observer les métriques (IO wait dans `top`, latence applicative), upgrade vers `high-speed-gen2` si nécessaire
- Rappeler analogie AWS : classic ≈ `st1`/`sc1`, high-speed ≈ `gp3`, high-speed-gen2 ≈ `io2`/`io2 Block Express`
- Éviter le débat FinOps détaillé : c'est Pro+, ici on installe le réflexe "choisir le tier en conscience"
---
 
### Slide 5: AZ scoping — what it means in practice
 
**Visual concept**: A region box (labeled "GRA — Gravelines, FR") containing two smaller AZ boxes side by side: "AZ-a" with an instance icon and a volume attached to it, and "AZ-b" with another instance and another volume. A red dashed arrow between AZ-a and AZ-b labeled "❌ cannot attach across AZs". Below the region box, a callout: "Region selection still happens at project level (Module 1.2). AZ selection happens at resource creation."
 
**Talking points**:
- A region (`GRA`, `SBG`, `BHS`, …) is a geographic location with its own infrastructure
- Inside a region, **Availability Zones** (AZs) are isolated failure domains: separate power, separate cooling, separate network paths
- A Block Storage volume is **created in a specific AZ** — it can only attach to an instance in that **same AZ**
- This is **the most common cause** of "I cannot attach my volume" tickets — the volume and the instance are not in the same AZ
- For the Core Associate scope on OVHcloud Public Cloud, most regions today expose a **single AZ** — the multi-AZ regions are a recent and ongoing roll-out (verify on docs.ovhcloud.com which regions are multi-AZ at the time of the session)
- The **architectural consequence**: when you build a multi-AZ application, each tier's stateful data must replicate at the application layer (e.g., PostgreSQL streaming replication) — block volumes do not auto-replicate across AZs
**Trainer notes**:
- Souligner que la majorité des régions OVHcloud aujourd'hui ne sont pas multi-AZ : l'AZ est une contrainte conceptuelle à connaître, pas une douleur opérationnelle quotidienne
- Anticiper "et le multi-AZ AWS où c'est partout ?" : la maturité multi-AZ varie entre hyperscalers et entre régions OVHcloud, vérifier sur docs avant de promettre un design
- Si quelqu'un demande la liste à jour des régions multi-AZ : docs.ovhcloud.com section "Regions and Availability Zones", source autoritaire qui bouge
- Rappeler que la portée AZ est exactement la même qu'AWS EBS : c'est un mental model transférable
- Vérifier compréhension : "j'ai un volume en GRA9-a et je veux l'attacher à une instance en GRA9-b, que se passe-t-il ?" → l'opération échoue, il faut snapshot le volume, recréer dans l'autre AZ
---
 
### Slide 6: Object Storage — characteristics
 
**Visual concept**: A region box (labeled "GRA") containing a single large container icon labeled "container / bucket". Inside the container, three object keys listed vertically: `artifacts/build-1.2.tgz`, `images/logo.png`, `backups/db-2026-06-08.sql.gz`. To the right of the container, three arrow-icons pointing inward, each labeled with an API surface: **S3 API** (large), **Swift API** (smaller), **Manager UI**. Below: a banner "OpenStack Swift under the hood, S3-compatible API on top."
 
**Talking points**:
- **Region-scoped** (not AZ-scoped): a container lives in a region and is reachable identically from any AZ in that region
- **Two API surfaces**: the **S3-compatible API** (the de-facto industry standard, what `aws-cli`, `s3cmd`, `rclone`, every SDK speaks) and the **native Swift API** (OpenStack-native, less common in client tooling)
- **OpenStack Swift** is the underlying storage engine; the **S3-compatible API is a translation layer** on top of Swift — most operations map, some advanced S3 features may behave subtly differently
- **Practically unlimited capacity** for the customer: you don't pre-provision a size, you upload and pay for what you store
- **Pay-per-use**: storage (GiB-month) + egress traffic (GiB out) + sometimes requests (per 1000 API calls) — exact pricing on ovhcloud.com
- **Encryption at rest** by default, managed by the platform
**Talking points (continued)**:
- Legacy analogy: Object Storage is the **file repository / asset server** pattern, but exposed as an API instead of an FTP — and replicated for durability behind the scenes
- Hyperscaler equivalence: **AWS S3** and **Azure Blob Storage** map onto this very closely; the S3 API surface is **the** lingua franca
**Trainer notes**:
- Souligner explicitly que S3 sur OVHcloud est une **API de compatibilité** au-dessus de Swift : c'est honnête, ça gère les attentes ex-AWS qui pourraient buter sur un edge case
- Anticiper "100 % S3 compatible ?" : 95 %+ pour les opérations CRUD courantes, edges sur certaines fonctions avancées (multi-part lifecycle, certains CORS), vérifier sur docs.ovhcloud.com avant de promettre
- Si quelqu'un demande Swift vs S3 API en pratique : utiliser l'API S3, tout le tooling moderne parle S3, Swift API utile uniquement pour des outils OpenStack natifs ou des cas de niche
- Rappeler que region-scoped signifie : aucun problème AZ comme pour le block, mais une migration cross-region nécessite de re-copier les données
- Vérifier compréhension : "puis-je modifier l'octet 47 d'un fichier de 100 MiB ?" → non, on `PUT` l'objet entier, c'est pas du block
---
 
### Slide 7: Object Storage — containers, keys, and permissions
 
**Visual concept**: A container icon at the top labeled `nw-artifacts` with a "private" lock badge. Three objects inside listed with their keys and visibility states: `app/build-1.2.tgz` (lock, label "private — credentials required"), `public/logo.png` (open eye, label "public-read — any HTTPS GET works"), `temp/preview.pdf` (clock icon, label "presigned URL — time-limited"). Below: a small table summarizing the three modes.
 
**Talking points**:
- A **container** (S3 calls it a "bucket") holds objects; an **object** is addressed by its **key**, which can include slashes (`app/build-1.2.tgz`) — slashes are part of the key, not real directories
- **Three common visibility patterns**:
  - **Private (default)**: read/write requires valid S3 credentials matched against the project's IAM
  - **Public-read**: any HTTPS GET against the object's URL returns it, no credentials needed — for static assets, public artifacts
  - **Presigned URL**: a time-limited, signed URL that grants read (or write) access to one object for a defined window — for sharing without exposing publicly
- **Permissions are set at the object level or the container level**, with object-level overriding container-level — same model as S3
- **Anti-pattern**: making a whole container public-read when only a handful of objects need public access — narrow the visibility to the objects that need it
- **IAM scoping** (Module 2.5) determines which users / applications can use which S3 credentials against which containers — out of scope here, mentioned for awareness
**Trainer notes**:
- Souligner que public-read sur tout un container est l'erreur classique qui finit en data leak médiatisé : on autorise au niveau de l'objet quand c'est légitime
- Anticiper "et le versioning, lifecycle policies, replication ?" : disponibles selon la maturité du service, vérifier docs.ovhcloud.com, on ne couvre pas dans Associate
- Si quelqu'un demande "presigned URL ça marche pour upload aussi ?" : oui, presigned PUT existe, utile pour laisser un client uploader directement vers Object Storage sans relayer par l'app
- Rappeler le red-thread : Northwind a besoin du container `<initials>-nw-artifacts` aujourd'hui, on l'utilise dès le lab
- Éviter le piège du versioning détaillé : c'est Pro tier, ici on installe les trois patterns de visibilité
---
 
### Slide 8: The OpenStack provenance — Cinder, Swift, and what it means for you
 
**Visual concept**: Two columns side by side. Left column titled "Block Storage" with a stack from bottom to top: "Storage hardware → OpenStack Cinder → OVHcloud Block Storage product → `openstack volume` CLI / Manager UI". Right column titled "Object Storage" with a stack: "Storage hardware → OpenStack Swift → OVHcloud Object Storage product → two API surfaces (S3-compatible, native Swift) → `aws s3` / `openstack object` CLI / Manager UI". Between the two columns, a small caption: "Two different OpenStack projects, one consistent product line."
 
**Talking points**:
- **Cinder** is the OpenStack project name for block storage; everywhere you'd see "Cinder" in the OpenStack ecosystem, that's what's behind OVHcloud Block Storage
- **Swift** is the OpenStack project name for object storage; the S3-compatible API is **layered on top of Swift**, not a replacement
- **Why this matters in practice**: when you Google "OpenStack Cinder volume attach issue" or read OpenStack documentation, the concepts and CLI verbs apply directly to OVHcloud
- **The `openstack` CLI** speaks Cinder and Swift natively — same binary, same syntax patterns, just a different sub-command tree (`openstack volume ...`, `openstack object ...`)
- **The `aws` CLI** speaks the S3-compatible API for Object Storage only — for Block Storage, there is no AWS-compatibility layer, you use `openstack volume`
- The product names (Block Storage, Object Storage) are stable OVHcloud-facing names; the OpenStack project names (Cinder, Swift) are useful when you read upstream OpenStack docs or troubleshoot
**Trainer notes**:
- Souligner que connaître les noms OpenStack n'est pas du folklore : c'est ce qui permet de chercher de la doc upstream quand le besoin sort de la doc OVHcloud
- Anticiper "alors je peux suivre les tutos OpenStack à la lettre ?" : conceptuellement oui, opérationnellement il peut y avoir des spécificités OVHcloud (endpoints, auth) qui passent par docs.ovhcloud.com
- Si quelqu'un demande Manila (file storage OpenStack) : c'est ce qui est derrière File Storage, on le verra en 2.2
- Rappeler que la connaissance OpenStack est un asset durable, transférable à tout cloud OpenStack-based (sovereign clouds, on-prem privatif)
---
 
### Slide 9: Block or Object? — the decision in one diagram
 
**Visual concept**: A Mermaid `flowchart LR` decision tree starting at "What's the data?" branching into "Mutable / random-access state" → "Block Storage" (with examples: database files, app working dir, OS filesystem); and "Whole files, read mostly, shared or static" → "Object Storage" (with examples: build artifacts, backups, static assets, logs archive). A small dotted branch from the root: "Shared filesystem semantics?" → "File Storage (Module 2.2)" (greyed out).
 
**Talking points**:
- **Question to ask**: do I need to modify the data in place at byte level, or do I read/write whole files?
  - In place → **Block**
  - Whole files → **Object**
- **Second question**: is the data accessed by one workload or many?
  - One workload, stateful → confirms **Block** (single-attach is fine)
  - Many workloads sharing the same files → confirms **Object** (region-scoped, multi-reader)
- **Common mistakes**:
  - Storing user uploads in Block Storage on a single instance — survives the instance reboot but does not survive instance deletion, does not scale to multiple app instances
  - Trying to host a database on Object Storage — read/write whole files at every transaction is catastrophic for latency
- **Northwind's current state**: PostgreSQL data goes on Block (`<initials>-nw-db-data-01`), build artifacts go in Object (`<initials>-nw-artifacts`) — both happen today
**Trainer notes**:
- Souligner que le diagramme est volontairement simple : 80 % des décisions de stockage se règlent avec ces deux questions
- Anticiper "et pour les images Docker ?" : registry container privé Object-backed pour les artefacts, le filesystem éphémère du host pour le cache local des layers Docker — c'est un cas hybride normal
- Si quelqu'un demande "les logs vont où ?" : selon le pattern — logs applicatifs en temps réel sur le filesystem (block), archives long-terme exportées en Object
- Rappeler que la 3ème option (file storage) existe et qu'on la verra en 2.2 pour le cas spécifique du filesystem partagé multi-reader/writer
<!-- Pédagogie : ce slide est le moment "ah" du module. Prendre 2 min pour le faire vivre, demander à 2 apprenants de placer un workload dans le diagramme. -->
 
---
 
### Slide 10: Northwind today — where storage lands in the architecture
 
**Visual concept**: An architecture diagram. Three instance icons in a row (`<initials>-nw-web-01`, `<initials>-nw-api-01`, `<initials>-nw-db-01`) — already on screen since Module 1.4. Below the db instance, a cylinder labeled "Block Volume 50 GiB → /mnt/pgdata" attached. To the right of the three instances, a container icon labeled "Object container `<initials>-nw-artifacts`" with two arrows: one from the API instance ("downloads build artifacts"), one annotated "public-read for static assets". Above the diagram, banner: "Today's additions in dotted green."
 
**Talking points**:
- The three instances from Module 1.4 are unchanged; what we're adding is the **storage layer attached to them**
- The **Block volume** on `<initials>-nw-db-01` is where PostgreSQL's data directory will live in Module 2.2 — today we just provision and mount it, blank
- The **Object container** holds Northwind's build artifacts — versioned tarballs that the API instance fetches at first boot (cloud-init pattern from Module 1.4) or on demand
- One **public-read object** is exposed for static assets (e.g., the company logo served on the public marketing pages)
- Networking between the instances and the storage layer still goes over the **public IPs** for now — that's costly and exposes inter-tier traffic; Module 2.3 fixes it with private networks and Security Group composition
- **The CTO's two storage demands are addressed today**: stateful data on a real volume, artifacts in Object Storage
**Trainer notes**:
- Souligner que le module ne fait pas encore tout : la base PostgreSQL n'est pas encore migrée, le réseau privé n'est pas encore là — c'est le rythme de la journée
- Rappeler le red-thread : trois exigences du CTO en fin de 1.4 — "real volume", "private network", "object storage for artifacts" — on en règle deux aujourd'hui (volume + object), le réseau privé c'est demain matin
- Anticiper "et pourquoi on ne fait pas la migration PostgreSQL aujourd'hui ?" : la migration de la donnée applicative est un sujet à part (dump/restore, downtime, validation), on prépare le volume aujourd'hui, on charge PostgreSQL dessus en 2.2 si on a le temps ou en post-formation
- Vérifier que tout le monde a `<initials>-nw-db-01` qui tourne — sinon, c'est l'heure du Hors piste
---
 
## Block 3 — Trainer Demonstration (15 min)
 
### Demo scenario
 
Starting from the `demo-db-01` Ubuntu instance (a placeholder running in the trainer's project, equivalent to the learner's `<initials>-nw-db-01`), the trainer takes a 20 GiB `classic` Block Storage volume from creation through attach-format-mount, then detaches it cleanly and reattaches it to a second instance to demonstrate that the data carries with the volume. Then the trainer switches to Object Storage: generates S3 credentials, configures `aws-cli`, creates a container, uploads/lists/downloads a sample artifact, and exposes a single file as public-read. Delivery channel: OpenStack CLI for block, `aws-cli` for object — the Manager UI is opened in parallel for the credential generation step (no CLI shortcut) and briefly for the volume creation to show GUI parity.
 
### Demo script
 
| Step | Action | Expected output | Trainer commentary |
|---|---|---|---|
| 1 | `openstack volume create --size 20 --type classic demo-db-data-01` | Volume in `creating` then `available` state | "Note the `--type classic` — that's the perf tier choice from slide 4. The volume exists but is attached to nothing yet." |
| 2 | `openstack volume list` | The new volume appears with status `available` | "Available means: ready to attach, no instance owns it." |
| 3 | `openstack server add volume demo-db-01 demo-db-data-01` | Command returns; volume status becomes `in-use` | "The volume is now attached. On the OS side, Linux just saw a new block device appear." |
| 4 | SSH into `demo-db-01`, run `lsblk` | A new `sdb` or `vdb` device appears, 20 GiB, no partitions, no filesystem | "Empty disk. We need to put a filesystem on it before we can use it." |
| 5 | `sudo mkfs.ext4 /dev/sdb` (or `vdb`) | mkfs output, UUID printed at the end | "Note the UUID — that's what we'll put in `fstab` for persistent mount." |
| 6 | `sudo mkdir -p /mnt/data && sudo mount /dev/sdb /mnt/data && echo "northwind-demo" \| sudo tee /mnt/data/MARKER` | Mount succeeds, MARKER file created | "Marker file proves we wrote to the volume — we'll look for it again after detach/reattach." |
| 7 | `sudo umount /mnt/data` then `openstack server remove volume demo-db-01 demo-db-data-01` | Volume status returns to `available` | "Always unmount before detach. Detaching a mounted volume corrupts filesystem state." |
| 8 | `openstack server add volume demo-web-01 demo-db-data-01` | Volume now attached to a different instance | "Same volume, different instance. Single-attach: it was free, now it's owned again." |
| 9 | SSH into `demo-web-01`, `sudo mount /dev/sdb /mnt/data && cat /mnt/data/MARKER` | Outputs `northwind-demo` | "The data traveled with the volume, independently of either instance." |
| 10 | In the OVHcloud Manager → Public Cloud → Project → Users & Roles → generate an S3 user, copy access key + secret | Credentials displayed once | "Note: the secret is displayed **once**. Save it now or regenerate later. This is the IAM principal that owns the S3 calls." |
| 11 | Configure `aws-cli`: `aws configure --profile ovh-gra` with the credentials and the OVH endpoint URL | `~/.aws/credentials` updated | "Endpoint URL is what tells `aws-cli` to hit OVHcloud instead of AWS. It's the only difference." |
| 12 | `aws s3 mb s3://demo-northwind-artifacts --endpoint-url https://s3.gra.io.cloud.ovh.net --profile ovh-gra` | Bucket created | "`mb` = make bucket. In our vocabulary: container created in the GRA region." |
| 13 | `aws s3 cp sample-artifact.tgz s3://demo-northwind-artifacts/app/build-1.0.tgz --endpoint-url ... --profile ovh-gra` then `aws s3 ls s3://demo-northwind-artifacts/app/ --endpoint-url ... --profile ovh-gra` | Upload succeeds, ls shows the object | "Note the `app/` prefix — that's just a key naming convention, not a real folder." |
| 14 | `aws s3api put-object-acl --bucket demo-northwind-artifacts --key app/build-1.0.tgz --acl public-read --endpoint-url ... --profile ovh-gra` then `curl -sI https://demo-northwind-artifacts.s3.gra.io.cloud.ovh.net/app/build-1.0.tgz` | `HTTP/2 200` returned without credentials | "Public-read on a single object. No `aws-cli` needed to fetch it — anyone with the URL gets it." |
 
### Common demo failure modes
 
- **Volume attaches but `lsblk` shows nothing new** → wait 5-10 seconds and retry, the kernel needs to enumerate the new device. If still nothing, check that the instance and volume are in the same AZ (`openstack volume show <vol>` and compare to `openstack server show <inst>`).
- **`mount` fails with "wrong fs type, bad option"** → the volume was attached but not formatted yet; run `mkfs.ext4` first.
- **`aws s3 mb` returns 403** → S3 credentials not yet active (they sometimes need 30-60 seconds after generation to propagate) or endpoint URL typo (`s3.gra.io.cloud.ovh.net`, not `s3.gra.cloud.ovh.com`).
- **`aws s3 ls` returns empty when it should list the bucket** → the bucket was created in a different region's endpoint than the one being queried. Verify the endpoint URL matches the bucket's region.
- **`curl` against the public-read URL returns 403** → the ACL was applied but the URL format is wrong; the correct virtual-hosted-style URL is `https://<bucket>.s3.<region>.io.cloud.ovh.net/<key>`. Alternative path-style URL works too on most S3 clients.
---
 
## Block 4 — Learner Lab (30 min)
 
### Lab brief (learner-facing)
 
You will provision Northwind's stateful and shared storage layers, then validate they work as expected. Two storage objects are created today: a 50 GiB Block Storage volume attached to your `<initials>-nw-db-01` instance and mounted on `/mnt/pgdata` (where PostgreSQL data will land in Module 2.2), and an Object Storage container `<initials>-nw-artifacts` populated with a sample file accessible privately, plus a second file exposed as public-read. The delivery channel is OpenStack CLI for the block work and `aws-cli` for the object work. Success criterion: the volume survives an instance reboot with its mount and data intact, and at least one file in your container is reachable via a public HTTPS URL without credentials.
 
### Lab steps (learner-facing)
 
1. **Create the Block volume.** Run `openstack volume create --size 50 --type classic <initials>-nw-db-data-01` in the AZ matching your `<initials>-nw-db-01` instance. Verify with `openstack volume list` that it appears in `available` state.
2. **Attach and prepare the filesystem.** Attach the volume to your DB instance with `openstack server add volume <initials>-nw-db-01 <initials>-nw-db-data-01`. SSH into the instance, run `lsblk` to identify the new device (typically `/dev/sdb` or `/dev/vdb`), format it with `sudo mkfs.ext4 /dev/<device>`, create the mount point `sudo mkdir -p /mnt/pgdata`, mount it `sudo mount /dev/<device> /mnt/pgdata`, then write an owner marker: `echo "<initials> $(date -I)" | sudo tee /mnt/pgdata/OWNER`.
3. **Persist the mount across reboots.** Run `sudo blkid /dev/<device>` to get the UUID. Append the following line to `/etc/fstab` (substituting your UUID): `UUID=<your-uuid> /mnt/pgdata ext4 defaults,nofail 0 2`. Test the fstab entry without rebooting: `sudo umount /mnt/pgdata && sudo mount -a && ls /mnt/pgdata` should show the `OWNER` file.
4. **Reboot and verify persistence.** Run `sudo reboot` and wait for the instance to come back. SSH in again, run `df -h | grep /mnt/pgdata` (the mount should be there) and `cat /mnt/pgdata/OWNER` (your marker should be intact). If the mount is missing, check `journalctl -b | grep -i mount` for clues — most likely the fstab line has a typo.
5. **Generate S3 credentials.** In the OVHcloud Manager, navigate to your Public Cloud project → Users & Roles → "Add user" (or use an existing one) → generate S3 credentials. Copy the access key and the secret key immediately — the secret is shown only once.
6. **Configure `aws-cli`.** On your workstation: `aws configure --profile ovh-gra` and enter the credentials. Set region to `gra` and output format to `json`. For each `aws s3` command in the steps below, add `--profile ovh-gra --endpoint-url https://s3.gra.io.cloud.ovh.net`.
7. **Create the container and upload a file.** `aws s3 mb s3://<initials>-nw-artifacts` (+ profile/endpoint). Pick any local file > 1 MiB (a tarball, a screenshot — anything non-trivial), upload it: `aws s3 cp <localfile> s3://<initials>-nw-artifacts/app/sample-artifact.tgz`. Verify: `aws s3 ls s3://<initials>-nw-artifacts/app/`.
8. **Validate download integrity.** Download the object back under a different name: `aws s3 cp s3://<initials>-nw-artifacts/app/sample-artifact.tgz ./downloaded.tgz`. Verify `md5sum <originalfile>` and `md5sum downloaded.tgz` produce the same hash.
9. **Expose one file as public-read.** Upload a second small file (e.g., a `README.txt`): `aws s3 cp README.txt s3://<initials>-nw-artifacts/public/README.txt`. Set its ACL: `aws s3api put-object-acl --bucket <initials>-nw-artifacts --key public/README.txt --acl public-read`. Test from an incognito browser window or `curl`: `https://<initials>-nw-artifacts.s3.gra.io.cloud.ovh.net/public/README.txt` should return the file content without any auth prompt.
10. **Capture proofs.** Take a screenshot of the `df -h` output showing `/mnt/pgdata`, the `OWNER` file content, and the `curl` returning the public-read file. These go into your lab artifact folder.
### Validation criteria
 
- **Volume persistence**: after the reboot in Step 4, `/mnt/pgdata` is mounted automatically and the `OWNER` file is intact.
- **Object Storage round-trip**: the file uploaded in Step 7 can be re-downloaded in Step 8 and the MD5 matches.
- **Public-read works**: the URL in Step 9 returns the file from an unauthenticated client (incognito browser or curl).
### Lab artifacts to produce
 
In your local lab repo, a folder `module-2-1/` containing: a screenshot of `df -h | grep pgdata` after reboot, a screenshot of the `OWNER` file content, a copy of the public-read object's `curl` response, and the `aws-cli` profile name used (no credentials — just the profile name).
 
### Common lab support questions
 
- **"My volume is `available` but `openstack server add volume` fails with `not in the same AZ`"** → verify both with `openstack volume show <vol>` and `openstack server show <inst>` and compare. If your instance was created in `GRA9-a` you must create the volume in `GRA9-a` too. Solution: delete the volume, recreate in the right AZ.
- **"`mkfs.ext4` says the device is busy"** → check `lsblk` — sometimes the device shows nested partitions from a prior format. `sudo wipefs -a /dev/<device>` clears the signature, then mkfs proceeds.
- **"After reboot the mount is gone"** → `cat /etc/fstab` and verify the UUID matches `sudo blkid /dev/<device>`. The most common cause is copying the UUID with surrounding quotes (which break fstab parsing) or a typo. The `nofail` option prevents the system from refusing to boot on fstab failures — keep it in.
- **"`aws s3 mb` returns `Bucket already exists`"** → bucket names are globally unique within the OVHcloud S3 namespace per region. Prefix with your initials and a date stamp if needed.
- **"My public-read URL returns 403"** → either the ACL didn't apply (re-run the `put-object-acl` and re-test) or the URL format is wrong. The correct format is `https://<bucket>.s3.gra.io.cloud.ovh.net/<key>` (virtual-hosted style). The path style `https://s3.gra.io.cloud.ovh.net/<bucket>/<key>` also works.
- **"Can I share my credentials with my neighbor for the lab?"** → no, generate your own. The S3 credentials are tied to a specific user in your project and represent that user's authority — sharing them obscures the audit trail and is a Pro-tier anti-pattern that we don't introduce here.
---
 
## Block 5 — Micro-check QCM (5 min)
 
Format: 7 single-answer multiple-choice questions, formative (non-certifying).
 
### Question 1
 
- **Stem**: A learner needs to store a PostgreSQL database's data files for an application running on a single Public Cloud Instance. Which OVHcloud storage paradigm is the correct primary choice?
- **Correct answer**: **A.** Block Storage — because the workload requires random read/write at byte level on mutable state, attached to a single instance.
- **Distractors**:
  - B. Object Storage — because PostgreSQL files are large and Object Storage has practically unlimited capacity. — *Why wrong*: Object Storage stores immutable whole objects addressed by key; updating bytes in place at every transaction is not a workable access pattern for a database.
  - C. File Storage — because PostgreSQL is often deployed on NFS in the OVHcloud documentation. — *Why wrong*: the documentation does not recommend NFS for PostgreSQL data files (NFS adds latency and locking issues that PostgreSQL is not designed for); File Storage targets shared filesystem use cases.
  - D. Cold Archive — because the data must be retained long-term. — *Why wrong*: Cold Archive is for long-term, infrequent retrieval; PostgreSQL's data files are read and written constantly during normal operations.
- **LO traced**: `LO-STO-K01`
- **Bloom level**: Understand
### Question 2
 
- **Stem**: An operator has a Block Storage volume in `GRA9-a` that they would like to attach to an instance running in `GRA9-b`. What is the correct procedure?
- **Correct answer**: **B.** It is not possible to attach a volume across Availability Zones. The operator must create a new volume in `GRA9-b` and copy the data over (typically via a snapshot + restore, or instance-level copy).
- **Distractors**:
  - A. Use `openstack server add volume --force-cross-az` to override the AZ check. — *Why wrong*: no such flag exists; the AZ scoping is enforced by the storage backend, not by a CLI flag.
  - C. Create a vRack between the two AZs to bridge the volume attach. — *Why wrong*: vRack is a Layer-2 network primitive between OVHcloud products, not a Block Storage bridge; AZ scoping is independent of network topology.
  - D. Move the volume's metadata to `GRA9-b` via `openstack volume migrate`. — *Why wrong*: live migration between AZs is not exposed in the Core OVHcloud Block Storage product; snapshot/restore is the operational pattern.
- **LO traced**: `LO-STO-K02`
- **Bloom level**: Remember
### Question 3
 
- **Stem**: Which statement about OVHcloud Object Storage is correct?
- **Correct answer**: **C.** Object Storage is region-scoped, exposes both an S3-compatible API and a native Swift API, and is backed by OpenStack Swift.
- **Distractors**:
  - A. Object Storage is AZ-scoped and supports single-instance attach, similar to Block Storage. — *Why wrong*: confuses Object with Block; Object is region-scoped and accessed via HTTP API, not "attached" to instances.
  - B. Object Storage on OVHcloud exposes only the Swift API; the S3 API is not supported on this platform. — *Why wrong*: the S3-compatible API is the primary surface for Object Storage, layered on top of Swift.
  - D. Object Storage is built on OpenStack Cinder, the same project that powers Block Storage. — *Why wrong*: Cinder is the block storage project; Swift is the object storage project; they are distinct OpenStack projects.
- **LO traced**: `LO-STO-K03`
- **Bloom level**: Remember
### Question 4
 
- **Stem**: A learner reads in an OpenStack tutorial that they should use the `openstack volume` and `openstack object` commands. Which underlying OpenStack projects do these two commands correspond to?
- **Correct answer**: **A.** `openstack volume` ↔ **Cinder** (block storage) ; `openstack object` ↔ **Swift** (object storage).
- **Distractors**:
  - B. `openstack volume` ↔ Manila ; `openstack object` ↔ Cinder. — *Why wrong*: Manila is the file storage project (covered in Module 2.2); the mapping is inverted.
  - C. `openstack volume` ↔ Nova ; `openstack object` ↔ Keystone. — *Why wrong*: Nova is compute, Keystone is identity; both are unrelated to storage.
  - D. Both commands are part of the **Glance** project (image storage). — *Why wrong*: Glance is the image storage project (used for Compute images); it powers neither block nor object storage products.
- **LO traced**: `LO-STO-K02` / `LO-STO-K03`
- **Bloom level**: Remember
### Question 5
 
- **Stem**: An operator has resized a Block Storage volume from 20 GiB to 50 GiB using `openstack volume set --size 50`. SSH-ing into the instance, `lsblk` shows the device is now 50 GiB but `df -h` still shows the filesystem as 20 GiB. What is the missing step?
- **Correct answer**: **D.** The filesystem itself must be extended online to consume the new space — e.g., `sudo resize2fs /dev/<device>` for ext4, `sudo xfs_growfs /mnt/<mountpoint>` for XFS.
- **Distractors**:
  - A. Reboot the instance — `df -h` reflects the new size after a fresh boot. — *Why wrong*: a reboot does not extend a filesystem; the filesystem itself is unaware that the underlying device grew.
  - B. Detach and reattach the volume to force the kernel to re-read the size. — *Why wrong*: the kernel already saw the new size (as confirmed by `lsblk`); the filesystem layer is what's behind.
  - C. Run `openstack volume set --refresh-mount` to push the new size down to the instance. — *Why wrong*: no such command exists; the OS-level filesystem grow operation is the operator's responsibility.
- **LO traced**: `LO-STO-S02`
- **Bloom level**: Apply
### Question 6
 
- **Stem**: A learner wants to move a Block Storage volume from `<initials>-nw-db-01` to `<initials>-nw-web-01` without losing data. Both instances are in the same Availability Zone. What is the correct sequence of operations?
- **Correct answer**: **B.** Inside the instance, unmount the filesystem (`sudo umount`); on the cloud side, detach the volume from `<initials>-nw-db-01` (`openstack server remove volume`); attach the volume to `<initials>-nw-web-01`; inside the new instance, mount the filesystem.
- **Distractors**:
  - A. Detach with `--force` while the filesystem is mounted; the cloud handles the unmount for you. — *Why wrong*: detaching a mounted filesystem from below causes filesystem corruption; the unmount must happen at the OS level first.
  - C. Stop both instances, swap the volume attachment, restart both instances. — *Why wrong*: instance stop is not required for volume detach/attach; the operations are online and the unnecessary downtime is wasteful.
  - D. Take a snapshot, create a new volume from the snapshot in `<initials>-nw-web-01`, leave the original attached. — *Why wrong*: that produces a *copy* of the data, not a *move* — both volumes now exist and the question asked for a move.
- **LO traced**: `LO-STO-S03`
- **Bloom level**: Apply
### Question 7
 
- **Stem**: A learner needs to share a 10 MiB PDF file with an external customer for a 48-hour review window, without exposing the file publicly long-term and without creating an external IAM principal for the customer. Which Object Storage permission pattern fits this need?
- **Correct answer**: **A.** Generate a **presigned URL** with a 48-hour validity targeting the specific object — the URL itself encodes a time-limited signature granting read access.
- **Distractors**:
  - B. Set the entire container to public-read for 48 hours, then set it back to private. — *Why wrong*: exposes every object in the container during the window, even those unrelated to the request; window enforcement is also manual and error-prone.
  - C. Email the file directly from the instance hosting the data; Object Storage is not needed for one-off sharing. — *Why wrong*: bypasses the question, does not exercise Object Storage permissions, and email attachments break for files of significant size.
  - D. Create a private container and share your own S3 credentials with the customer for the window. — *Why wrong*: sharing credentials grants access to every container you can reach, not just this one object, and produces an unauditable trail.
- **LO traced**: `LO-STO-S05`
- **Bloom level**: Apply
---
 
## Block 6 — Wrap-up & Transition (5 min)
 
### Recap (1-2 lines)
 
You can now **distinguish** the three storage paradigms in OVHcloud Public Cloud and **identify** when block, object, or file is the right tool. You can **explain** Block Storage's AZ-scoped, single-attach, persistent nature and **identify** OpenStack Cinder behind it. You can **explain** Object Storage's region-scoped, S3-compatible API, and **identify** OpenStack Swift behind it. You can **create**, **attach**, **format**, **mount**, and **persist** a Block Storage volume; you can **resize** it online and extend the filesystem; you can **detach** it cleanly and **reattach** it to another instance. You can **create** an Object Storage container, **upload**, **list**, and **download** objects via the S3-compatible API, and **set** the three common visibility patterns: private, public-read, and presigned URL.
 
### Transition to next module via red-thread scenario
 
Northwind's storage layer is taking shape. The 50 GiB volume is mounted on `<initials>-nw-db-01` waiting for PostgreSQL's data directory, and the artifacts container is up with a public-read sample served over HTTPS. But the CTO walks into the room with three follow-ups: *"What about the four old PDFs the legal team needs to keep for ten years — they don't need fast access but they cannot disappear. What about a shared filesystem the API and web instances both need to read configuration from? And, by the way, the volume we just provisioned — what's our backup story if someone runs `DELETE FROM` on the wrong table at 3am?"* These three questions — **cold long-term retention**, **shared filesystem semantics**, and **snapshot-versus-backup** — are exactly the agenda of Module 2.2: File Storage, Snapshots, Instance Backup, Cold Archive, and the design of a real backup strategy combining short-term rollback and long-term restore.
 
---
 
## Trainer FAQ (anticipated questions for this module)
 
**Q: How "S3-compatible" is OVHcloud Object Storage really? Can I take my existing AWS S3 Terraform module and point it at OVHcloud?**
A: The S3-compatible API on OVHcloud covers all the core operations: `PUT`, `GET`, `DELETE`, `LIST`, multipart upload, basic ACLs, presigned URLs. The vast majority of S3 client libraries (boto3, AWS SDKs, `aws-cli`, `s3cmd`, `rclone`, MinIO client, Terraform's `aws_s3_bucket` resource with a custom endpoint) work out of the box. Where the API diverges is on the advanced surfaces: certain S3 lifecycle policies, some CORS edge cases, S3 Object Lock, S3 Replication across regions, certain Server-Side Encryption modes (CMK/KMS-managed keys), S3 Select, S3 Inventory. For a pragmatic Terraform module, the recipe is: set the `endpoint`, `skip_credentials_validation`, `skip_metadata_api_check`, `skip_requesting_account_id`, and `force_path_style` flags in the AWS provider, and verify on docs.ovhcloud.com whether the specific features your module uses are supported. The Pro tier of the certification goes deeper into the compatibility matrix.
 
**Q: Why is Block Storage AZ-scoped and Object Storage region-scoped? It seems arbitrary.**
A: It reflects the underlying storage technology and consistency model. A Block Storage volume is presented to the OS as a coherent block device with strict consistency — every read sees the latest write, atomically. To deliver that at low latency, the storage backend has to be physically close to the compute, in the same failure domain (the AZ). Replicating a block volume synchronously across AZs would multiply the write latency by the inter-AZ network latency, which is the wrong trade-off for a primary storage path. Object Storage, by contrast, deals with whole objects whose consistency expectations are different (no in-place byte updates), and the access path is HTTP — naturally tolerant to a few extra milliseconds. So Swift replicates across AZs by design, which is what gives Object Storage its region-scoped reachability. The architectural moral: pick the storage primitive that matches both your access pattern *and* your acceptable consistency/latency trade-off.
 
**Q: Can a Block Storage volume really only attach to one instance? What about clustered filesystems like OCFS2 or GFS2 that expect shared block?**
A: Correct, OVHcloud Block Storage is strictly single-attach in the Core scope. Clustered filesystems that expect shared block access (OCFS2, GFS2, VMFS-style) cannot be built on top of OVHcloud Block Storage as-is. If the requirement is genuinely a shared filesystem, the correct primitive is File Storage (Module 2.2), which exposes NFS-style multi-attach semantics with native filesystem-level locking. If the requirement is shared block access for a non-clustered workload, the design is usually wrong — there's almost always a better pattern using either File Storage (for shared filesystems), Object Storage (for shared immutable assets), or application-level data partitioning (each instance has its own block, application coordinates).
 
**Q: We're moving from AWS to OVHcloud. On AWS, our staging environment has cross-region S3 replication for disaster recovery. How do we replicate that on OVHcloud?**
A: Cross-region replication on OVHcloud Object Storage is an evolving area — verify the current state of the feature on docs.ovhcloud.com, as native cross-region replication may or may not be available depending on the offer and the moment. The pragmatic patterns in the meantime: (1) write to two regions in parallel from the application layer for new objects (dual-write pattern); (2) schedule a periodic `aws s3 sync` (or `rclone sync`) job from the primary region to a secondary region — runs from a small Compute instance or from your CI; (3) for the DR scenario specifically, write critical objects to a primary region and a Cold Archive bucket in a secondary region with `aws s3 sync` daily. The strategic question for the customer: how much data loss is acceptable in a region-wide outage (RPO)? That number drives the replication frequency choice.
 
**Q: How do I rotate S3 credentials safely without breaking the running applications that use them?**
A: The clean rotation pattern: (1) generate a *new* set of credentials in the Manager for the same project — both old and new credentials are active simultaneously; (2) update the applications to use the new credentials (gradual rollout, blue-green, whatever fits your deployment model); (3) once you've verified no app is using the old credentials (typically by monitoring the request logs on Object Storage if available, or by waiting a safe window beyond the longest possible credential cache TTL), revoke the old credentials in the Manager. The anti-pattern is to revoke the old credentials first and then update the apps — that's a self-inflicted outage. For applications that store the credentials in environment variables, rotation requires a redeploy; for applications that fetch credentials at startup from a secret store, rotation is cleaner. The deeper secret-management discussion belongs to Module 2.5.
 
**Q: What's the actual durability of Object Storage? AWS S3 advertises eleven 9s — what does OVHcloud guarantee?**
A: The durability figure is the percentage of objects expected to survive over a year, derived from the replication strategy and the storage hardware reliability model. OVHcloud's published durability for Object Storage is high (verify the exact figure on ovhcloud.com — it's typically in the same order of magnitude as hyperscalers for the region-scoped tier), but the practical answer most customers care about is not the figure, it's the **scenarios it covers**: hardware failure on a single disk, a rack, a server room? Yes. Region-wide disaster (fire, flood)? No, the figure assumes a single region; cross-region DR is a separate design (see the previous question). Application bug that deletes objects? No, durability does not cover deliberate deletions — versioning and backup do. The honest message to learners: durability is a number that bounds the worst case for *hardware* failure, it does not replace a backup strategy that covers *human* and *application* failure modes.
 
**Q: When does `high-speed-gen2` actually make a difference compared to `high-speed`? Is the price premium worth it?**
A: `high-speed-gen2` is NVMe-backed; `high-speed` is SSD-backed but a generation older. The performance gap matters when the workload is bound by IOPS or by tail latency at high concurrency. Practical scenarios where the gap shows: OLTP databases serving thousands of small transactions per second (`high-speed-gen2` reduces 99th-percentile latency noticeably), heavily indexed workloads with random reads across a large working set, real-time analytics workloads. Scenarios where the gap is invisible: general-purpose app servers, batch processing, low-traffic databases, anything dominated by network or CPU. The pragmatic decision rule: start with `high-speed` for production, observe latency metrics (PostgreSQL: `pg_stat_statements` for query latency; OS: `iostat -x` for `await`), upgrade to `high-speed-gen2` only if the storage layer is provably the bottleneck. Over-provisioning is a FinOps concern, which is Pro tier — but the Core reflex is: measure first, upgrade second.
