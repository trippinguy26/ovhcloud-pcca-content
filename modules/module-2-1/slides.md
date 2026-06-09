---
# ============================================================
# Module 2.1 — Storage (Part 1) — Block & Object
# Slidev source file
# ============================================================
theme: ../../theme-ovhcloud
title: Storage (Part 1) — Block & Object
info: |
  ## OVHcloud — Public Cloud — Core Associate
  Module 2.1 — Storage (Part 1) — Block & Object.
  Duration: 1h30.
class: text-left
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: slide-left
mdc: true
exportFilename: 'modules/module-2-1/student_export'

# Hide the floating navbar / controls overlay in dev mode
controls: false
download: false
selectable: true

# Module-level metadata (consumed by trainer-notes export and CI)
moduleId: "2.1"
moduleTitle: "Storage (Part 1) — Block & Object"
duration: "1h30"
program: "OVHcloud — Public Cloud — Core Associate"
los:
  - LO-STO-K01
  - LO-STO-K02
  - LO-STO-K03
  - LO-STO-S01
  - LO-STO-S02
  - LO-STO-S03
  - LO-STO-S04
  - LO-STO-S05
# COVER SLIDE
layout: cover
---

# Storage (Part 1)
## Block & Object

<!--
Trainer notes Cover slide:
- Welcome to Day 2. Energy check after Day 1 close.
- Frame the shift : Day 1 was Compute (does the instance run, does it survive). Day 2 starts with Storage : the data must outlive the compute.
- Announce : at the end of 1h30, Northwind has a 50 GiB volume on the DB instance and an Object Storage container holding build artifacts, one public-read.
- Set expectations : Block and Object today, File + Snapshots + Backup tomorrow in 2.2.
-->

---
layout: default
moduleId: "2.1"
slideId: "Agenda"
---

# Agenda

<div class="grid grid-cols-2 gap-8 mt-8">

<div>

**Block 1 — Sentier battu** · 5 min
*Prerequisites & remediation pointers*

**Block 2 — Theory** · 30 min
*Block · Object · paradigms · OpenStack provenance*

**Block 3 — Demo** · 15 min
*Volume create / attach / mount / detach + S3 round-trip*

</div>

<div>

**Block 4 — Lab** · 30 min
*Provision Northwind's stateful and shared storage layers*

**Block 5 — Micro-check** · 5 min
*Formative QCM, 7 questions*

**Block 6 — Wrap-up** · 5 min
*Recap & transition to Module 2.2*

</div>

</div>

<!--
Trainer notes Agenda:
- Module mixte : 30 min Theory pour bien installer le mental model block-vs-object, puis 45 min Demo + Lab pour le manipuler.
- Annoncer les deux outils du module : openstack CLI pour le block, aws-cli pour l'object. Verifier rapide main levee : "qui a deja aws-cli installe ?"
- Rappeler que les 3 instances de fin de Module 1.4 doivent etre UP : si pas le cas, hors piste avant le Theory.
- Strict timing 90 min. Pause prevue apres ce module.
-->

---
# BLOCK 1 — SENTIER BATTU
layout: section
block: "Block 1"
duration: "5 min"
---

# Before we start
### Prerequisites & remediation

---
layout: two-cols
moduleId: "2.1"
slideId: "S00 — Before we start"
---

# Before we start

::left::

<div class="text-sm">

<strong style="color: var(--ovh-masterbrand-blue); font-size: 1.1rem;">You are ready if...</strong>

<div class="mt-3">
<strong>Tools</strong><br/>
&middot; <code>&lt;initials&gt;-nw-db-01</code> from Module 1.4 still UP and SSH-reachable<br/>
&middot; <code>openrc.sh</code> from Module 1.2 still sourced (scoped to GRA)<br/>
&middot; <code>aws-cli</code> v2 (or <code>rclone</code>) installed on your workstation<br/>
&middot; Basic Linux command line : <code>lsblk</code>, <code>mount</code>, <code>df -h</code>, <code>blkid</code>, editing <code>/etc/fstab</code>
</div>

<div class="mt-3">
<strong>Knowledge</strong><br/>
&middot; The five-object instance composition (Mod 1.3)<br/>
&middot; Difference between a block device, a filesystem, a mount point<br/>
&middot; Vague mental model of "buckets and keys" (S3-like)<br/>
&middot; An HTTPS URL can serve a static file, no app server needed
</div>

</div>

::right::

<div class="text-sm">

<strong style="color: var(--ovh-masterbrand-blue); font-size: 1.1rem;">If not, here's where to look</strong>

<div class="mt-3">
&middot; <strong>No <code>nw-db-01</code> running?</strong> &rarr; redeploy a <code>d2-2</code> Ubuntu in 2 min via Mod 1.3 sequence, lab proceeds identically<br/>
&middot; <strong>Never used <code>aws-cli</code>?</strong> &rarr; 60 sec teach : <code>aws configure</code> writes <code>~/.aws/credentials</code>, every command takes <code>--endpoint-url</code> to target non-AWS<br/>
&middot; <strong>Unfamiliar with <code>/etc/fstab</code>?</strong> &rarr; lab handout provides the line, you substitute the UUID from <code>blkid</code><br/>
&middot; <strong>Corporate proxy intercepts S3 HTTPS?</strong> &rarr; fall back to Manager UI for upload / download, the credential lifecycle still applies
</div>

</div>

<!--
Trainer notes S00 Before we start:
- Demander : "Qui a encore ses 3 instances de 1.4 jointes en SSH ?" Si moins de la moitie, redeploy minimal du seul nw-db-01 en 2 min avant Theory.
- Anticiper : un learner peut ne pas avoir aws-cli installe, donner 30 sec : pip install awscli ou snap install aws-cli, fallback rclone si Python KO sur le workstation.
- Si plusieurs Windows users : verifier que CRLF n'est pas un sujet ici (pas de YAML edite dans ce module), seulement le aws-cli qui fonctionne identiquement.
- Rappeler que le sentier battu est aussi le rappel : openrc.sh, keypair, projet, ce sont les invariants de Day 2.
-->

---
# BLOCK 2 — THEORY & CONCEPTS
layout: section
block: "Block 2"
duration: "30 min"
---

# Theory & Concepts
### Block paradigm, Object paradigm, choose right

---
layout: default
moduleId: "2.1"
slideId: "S01 — Data outlives compute"
los: ["LO-STO-K01"]
---

# Why this module? &mdash; data outlives compute

<div class="flex justify-center mt-2">

```mermaid {scale: 0.6}
%%{init: {'flowchart': {'nodeSpacing': 25, 'rankSpacing': 30}}}%%
flowchart LR
    INST[Instance lifetime<br/>months]:::short
    DATA[Data lifetime<br/>years]:::long
    INST -.->|must survive| DATA

    BLOCK[Block]:::primary
    OBJECT[Object]:::primary
    FILE[File<br/>Module 2.2]:::muted

    classDef short fill:#FFFFFF,stroke:#FF8B00,color:#FF8B00
    classDef long fill:#000E9C,stroke:#000E9C,color:#FFFFFF
    classDef primary fill:#DCEAFD,stroke:#000E9C,color:#000E9C
    classDef muted fill:#FFFFFF,stroke:#999999,color:#999999
```

</div>

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">

<div class="ovh-callout">
<strong>Instance is disposable by design</strong><br/>
Destroy, redeploy, autoscale, blue-green : every modern operations pattern assumes the compute is replaceable.
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Data must outlive any single instance</strong><br/>
This requires storage decoupled from instance lifecycle. Three paradigms : block, object, file.
</div>

</div>

<div class="mt-4 text-center text-sm" style="color: var(--ovh-gray-700);">
  Today : block + object. Module 2.2 : file + snapshots + backup strategy.
</div>

<!--
Trainer notes S01 Data outlives compute:
- Souligner le declic culturel : la VM est devenue jetable, c'est la donnee qui devient le seul actif. Le plus difficile pour un ex-VMware.
- Anticiper "et un local disk persistent comme AWS instance store ?" : pareil que Mod 1.4, local disk = ephemere, perit avec l'instance, pas une option pour de la donnee.
- Rappeler le red-thread : le CTO veut PostgreSQL sur un vrai volume et les artefacts dans un bucket, c'est l'agenda de la journee.
- Si quelqu'un demande pourquoi 3 paradigmes : 80% des workloads = block + object, file pour le cas multi-attach partage, on y vient en 2.2.
-->

---
layout: default
moduleId: "2.1"
slideId: "S02 — Two access patterns"
los: ["LO-STO-K01"]
---

# The two access patterns that drive everything

<div class="grid grid-cols-2 gap-6 mt-4">

<div>

<div class="text-center" style="color: var(--ovh-masterbrand-blue); font-weight: 700; font-size: 1.1rem;">
Block &mdash; the disk model
</div>

<div class="mt-3 ovh-callout">
<div class="text-sm">
<strong>Random read / write at byte level</strong><br/>
Read 4 KiB at offset X &middot; write 4 KiB at offset Y &middot; update in place.
</div>
</div>

<div class="mt-3 text-center text-xs" style="color: var(--ovh-gray-700);">
Workloads : database files, app working directory, OS filesystem
</div>

</div>

<div>

<div class="text-center" style="color: var(--ovh-masterbrand-blue); font-weight: 700; font-size: 1.1rem;">
Object &mdash; the key / value model
</div>

<div class="mt-3 ovh-callout">
<div class="text-sm">
<strong>Whole objects addressed by key</strong><br/>
<code>PUT artifacts/v1.0.tgz</code> &middot; <code>GET backups/2026-06-08.sql.gz</code> &middot; no in-place byte update.
</div>
</div>

<div class="mt-3 text-center text-xs" style="color: var(--ovh-gray-700);">
Workloads : build artifacts, backups, static assets, log archives
</div>

</div>

</div>

<div class="ovh-callout ovh-callout-warn mt-4">
  <strong>Not interchangeable :</strong> object as a database is painful (no in-place updates). Block to share static assets across N web servers is wasteful (single-attach). Legacy analogy : Block = SAN LUN, Object = CDN origin.
</div>

<!--
Trainer notes S02 Two access patterns:
- Souligner que le critere de choix n'est pas "performance" ou "cost", c'est le pattern d'acces, tout le reste decoule.
- Demander : "Vous voulez stocker un PDF de 50 MB que 500 personnes vont telecharger, block ou object ?" Reponse object : partage, immutable, acces HTTP.
- Anticiper "et si je veux les deux ?" : tout a fait normal, une appli typique utilise les deux, block pour la base, object pour les uploads utilisateurs.
- Rappeler le mapping AWS : Block = EBS, Object = S3, 1-to-1 conceptuellement.
-->

---
layout: default
moduleId: "2.1"
slideId: "S03 — Block Storage characteristics"
los: ["LO-STO-K02"]
---

# Block Storage &mdash; characteristics

<div class="flex justify-center mt-2">

```mermaid {scale: 0.6}
%%{init: {'flowchart': {'nodeSpacing': 25, 'rankSpacing': 25}}}%%
flowchart LR
    VOL[Block Volume<br/>50 GiB]:::vol
    VOL -->|attached as /dev/sdb| INST[Instance]:::inst

    classDef vol fill:#DCEAFD,stroke:#000E9C,color:#000E9C
    classDef inst fill:#000E9C,stroke:#000E9C,color:#FFFFFF
```

</div>

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">

<div class="ovh-callout">
<strong>AZ-scoped &middot; persistent &middot; single-attach</strong><br/>
&middot; Lives in one Availability Zone, attaches only to instances in same AZ<br/>
&middot; Lifecycle independent of instance : delete instance, volume survives<br/>
&middot; At any moment, attached to <strong>one</strong> instance only
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Performance tier &middot; resizable</strong><br/>
&middot; <code>classic</code> &middot; <code>high-speed</code> &middot; <code>high-speed-gen2</code> (HDD &middot; SSD &middot; NVMe)<br/>
&middot; Chosen at creation, no in-place tier change<br/>
&middot; Grow online, cannot shrink
</div>

</div>

<div class="mt-4 text-center text-sm" style="color: var(--ovh-gray-700);">
OpenStack <strong>Cinder</strong> under the hood &middot; AWS analogy : EBS volume, gp3 / io2 tiers
</div>

<!--
Trainer notes S03 Block Storage characteristics:
- Souligner que single-attach est LA contrainte qui differencie block du file storage : pour partager, c'est file storage, pas block.
- Anticiper "et le multi-attach Cinder qui existe sur d'autres clouds OpenStack ?" : pas expose dans le Core OVHcloud, absence a connaitre.
- Si quelqu'un demande "AZ vs region ?" : on creuse slide 5, garder le suspens 30 sec.
- Verifier la comprehension : "si je supprime mon instance, le volume disparait ?" Reponse : non, le volume survit, c'est tout le point.
-->

---
layout: default
moduleId: "2.1"
slideId: "S04 — Block Storage tiers"
los: ["LO-STO-K02"]
---

# Block Storage performance tiers

<div class="grid grid-cols-3 gap-4 mt-6 text-sm">

<div class="ovh-callout">
<strong>classic</strong> &middot; HDD<br/>
<div class="mt-2">
~250 IOPS<br/>
Lowest cost / GiB<br/>
<em>Sequential workloads : log archives, batch jobs reading large files</em>
</div>
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">high-speed</strong> &middot; SSD<br/>
<div class="mt-2">
~3 000 IOPS<br/>
Mid cost / GiB<br/>
<em>Default reasonable choice : general app data, mid-traffic databases</em>
</div>
</div>

<div class="ovh-callout">
<strong>high-speed-gen2</strong> &middot; NVMe<br/>
<div class="mt-2">
~20 000 IOPS<br/>
Top cost / GiB<br/>
<em>OLTP databases, latency-critical workloads</em>
</div>
</div>

</div>

<div class="ovh-callout ovh-callout-warn mt-4">
  <strong>Tier choice is at creation only.</strong> To change tier on an existing volume : create a new volume in the target tier and copy the data over. IOPS numbers indicative &mdash; verify on <code>docs.ovhcloud.com</code>.
</div>

<div class="mt-3 text-center text-sm" style="color: var(--ovh-gray-700);">
For Northwind staging PostgreSQL : <code>high-speed</code> is plenty. Production might warrant <code>high-speed-gen2</code>.
</div>

<!--
Trainer notes S04 Block Storage tiers:
- Souligner que le choix se fait a la creation, on ne change pas de tier sur un volume existant : recreer et copier.
- Anticiper "et les IOPS exactes ?" : renvoyer a docs.ovhcloud.com, les chiffres bougent, retenir l'ordre de grandeur HDD / SSD / NVMe.
- Si quelqu'un demande "comment je sais ce qu'il me faut ?" : commencer par high-speed, observer les metriques (IO wait dans top, latence applicative), upgrade vers gen2 si necessaire.
- Eviter le debat FinOps detaille : c'est Pro+, ici on installe le reflexe "choisir en conscience".
-->

---
layout: default
moduleId: "2.1"
slideId: "S05 — AZ scoping"
los: ["LO-STO-K02"]
---

# AZ scoping &mdash; what it means in practice

<div class="flex justify-center mt-2">

```mermaid {scale: 0.55}
%%{init: {'flowchart': {'nodeSpacing': 20, 'rankSpacing': 30}}}%%
flowchart LR
    subgraph REG[GRA region]
      subgraph AZA[AZ-a]
        I1[Instance A]:::inst
        V1[Volume A]:::vol
        V1 -->|attach OK| I1
      end
      subgraph AZB[AZ-b]
        I2[Instance B]:::inst
        V2[Volume B]:::vol
        V2 -->|attach OK| I2
      end
    end
    V1 -.->|attach FAIL| I2

    classDef inst fill:#000E9C,stroke:#000E9C,color:#FFFFFF
    classDef vol fill:#DCEAFD,stroke:#000E9C,color:#000E9C
```

</div>

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">

<div class="ovh-callout">
<strong>The most common attach error</strong><br/>
Volume and instance in different AZs &rarr; attach fails. Always check : <code>openstack volume show</code> and <code>openstack server show</code> for the AZ field.
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Multi-AZ status today</strong><br/>
Most OVHcloud regions today expose a single AZ. Multi-AZ is an ongoing roll-out &mdash; verify on <code>docs.ovhcloud.com</code> for the session date.
</div>

</div>

<div class="mt-4 text-center text-sm" style="color: var(--ovh-gray-700);">
Block does NOT auto-replicate across AZs &mdash; multi-AZ apps replicate at application layer (e.g., PostgreSQL streaming replication).
</div>

<!--
Trainer notes S05 AZ scoping:
- Souligner que la majorite des regions OVHcloud aujourd'hui ne sont pas multi-AZ : l'AZ est une contrainte conceptuelle a connaitre, pas une douleur quotidienne.
- Anticiper "et le multi-AZ AWS partout ?" : la maturite multi-AZ varie entre hyperscalers et entre regions OVHcloud, verifier docs avant de promettre un design.
- Si quelqu'un demande la liste a jour des regions multi-AZ : docs.ovhcloud.com section Regions and Availability Zones, source autoritaire qui bouge.
- Verifier : "j'ai un volume en GRA9-a et une instance en GRA9-b, que se passe-t-il ?" Reponse : l'attach echoue, il faut snapshot le volume et recreer dans l'autre AZ.
-->

---
layout: default
moduleId: "2.1"
slideId: "S06 — Object Storage characteristics"
los: ["LO-STO-K03"]
---

# Object Storage &mdash; characteristics

<div class="flex justify-center mt-2">

```mermaid {scale: 0.55}
%%{init: {'flowchart': {'nodeSpacing': 22, 'rankSpacing': 25}}}%%
flowchart LR
    S3[S3-compatible API]:::api
    SW[Swift API<br/>native]:::api
    UI[Manager UI]:::api
    S3 --> BUCKET[Container<br/>region-scoped]:::bucket
    SW --> BUCKET
    UI --> BUCKET
    BUCKET --> K1[artifacts/build-1.tgz]:::obj
    BUCKET --> K2[backups/db.sql.gz]:::obj
    BUCKET --> K3[images/logo.png]:::obj

    classDef api fill:#FFFFFF,stroke:#000E9C,color:#000E9C
    classDef bucket fill:#DCEAFD,stroke:#000E9C,color:#000E9C
    classDef obj fill:#000E9C,stroke:#000E9C,color:#FFFFFF
```

</div>

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">

<div class="ovh-callout">
<strong>Region-scoped &middot; two APIs</strong><br/>
&middot; A container lives in a region, reachable from any AZ in that region<br/>
&middot; <strong>S3-compatible API</strong> (industry standard) and native <strong>Swift API</strong><br/>
&middot; S3 is a translation layer ON TOP of Swift
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Capacity &middot; billing &middot; encryption</strong><br/>
&middot; No pre-provisioned size : you pay for what you store<br/>
&middot; Pay-per-use : storage GiB-month + egress + requests<br/>
&middot; Encryption at rest by default, platform-managed
</div>

</div>

<div class="mt-4 text-center text-sm" style="color: var(--ovh-gray-700);">
OpenStack <strong>Swift</strong> under the hood &middot; AWS analogy : S3 &middot; Azure analogy : Blob Storage
</div>

<!--
Trainer notes S06 Object Storage characteristics:
- Souligner explicitement que S3 sur OVHcloud est une API de compatibilite au-dessus de Swift : c'est honnete, ca gere les attentes ex-AWS qui pourraient buter sur un edge case.
- Anticiper "100% S3 compatible ?" : 95%+ pour les operations CRUD courantes, edges sur certaines fonctions avancees (multi-part lifecycle, certains CORS), verifier docs.ovhcloud.com avant de promettre.
- Si quelqu'un demande Swift vs S3 API en pratique : utiliser S3, tout le tooling moderne parle S3, Swift utile pour des outils OpenStack natifs ou cas de niche.
- Verifier : "puis-je modifier l'octet 47 d'un fichier de 100 MiB ?" Reponse : non, on PUT l'objet entier, c'est pas du block.
-->

---
layout: default
moduleId: "2.1"
slideId: "S07 — Containers, keys, permissions"
los: ["LO-STO-S04", "LO-STO-S05"]
---

# Containers, keys, and visibility patterns

<div class="grid grid-cols-3 gap-4 mt-6 text-sm">

<div class="ovh-callout">
<strong>Private</strong> (default)<br/>
<div class="mt-2">
Read / write requires valid S3 credentials matched against project IAM.<br/><br/>
<em>For : everything that is not explicitly meant to be public.</em>
</div>
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Public-read</strong><br/>
<div class="mt-2">
Any HTTPS GET on the object's URL returns it. No credentials.<br/><br/>
<em>For : static assets, public artifacts, logos.</em>
</div>
</div>

<div class="ovh-callout">
<strong>Presigned URL</strong><br/>
<div class="mt-2">
Time-limited signed URL granting read (or write) for a defined window.<br/><br/>
<em>For : sharing one object without exposing publicly.</em>
</div>
</div>

</div>

<div class="ovh-callout ovh-callout-warn mt-4">
  <strong>Anti-pattern :</strong> making an entire container public-read when only a handful of objects need public access. Narrow visibility to the objects that need it. Object-level ACL overrides container-level.
</div>

<div class="mt-3 text-center text-sm" style="color: var(--ovh-gray-700);">
IAM scoping &middot; which user can use which credentials against which container &middot; covered in Module 2.5.
</div>

<!--
Trainer notes S07 Containers keys permissions:
- Souligner que public-read sur tout un container est l'erreur classique qui finit en data leak mediatise : on autorise au niveau de l'objet quand c'est legitime.
- Anticiper "et le versioning, lifecycle policies, replication ?" : disponibles selon la maturite du service, verifier docs.ovhcloud.com, on ne couvre pas Associate.
- Si quelqu'un demande "presigned URL pour upload aussi ?" : oui, presigned PUT existe, utile pour laisser un client uploader directement vers Object Storage sans relayer par l'app.
- Rappeler le red-thread : Northwind a besoin du container nw-artifacts aujourd'hui, on l'utilise au lab.
-->

---
layout: default
moduleId: "2.1"
slideId: "S08 — OpenStack provenance"
los: ["LO-STO-K02", "LO-STO-K03"]
---

# OpenStack provenance &mdash; Cinder, Swift, and what it means

<div class="grid grid-cols-2 gap-6 mt-6">

<div class="ovh-callout">
<strong style="color: var(--ovh-masterbrand-blue);">Block Storage</strong>
<div class="mt-3 text-sm">
Storage hardware<br/>
&darr;<br/>
OpenStack <strong>Cinder</strong><br/>
&darr;<br/>
OVHcloud Block Storage<br/>
&darr;<br/>
<code>openstack volume</code> CLI &middot; Manager UI<br/>
</div>
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Object Storage</strong>
<div class="mt-3 text-sm">
Storage hardware<br/>
&darr;<br/>
OpenStack <strong>Swift</strong><br/>
&darr;<br/>
OVHcloud Object Storage<br/>
&darr;<br/>
<code>aws s3</code> (S3 API) &middot; <code>openstack object</code> (Swift API) &middot; Manager UI<br/>
</div>
</div>

</div>

<div class="mt-4 text-center text-sm" style="color: var(--ovh-gray-700);">
Knowing the OpenStack project names is not folklore : it lets you search upstream docs when the OVHcloud doc stops short.
</div>

<!--
Trainer notes S08 OpenStack provenance:
- Souligner que connaitre les noms OpenStack n'est pas du folklore : c'est ce qui permet de chercher de la doc upstream quand le besoin sort de la doc OVHcloud.
- Anticiper "alors je peux suivre les tutos OpenStack a la lettre ?" : conceptuellement oui, operationnellement il peut y avoir des specificites OVHcloud (endpoints, auth) qui passent par docs.ovhcloud.com.
- Si quelqu'un demande Manila (file storage OpenStack) : c'est ce qui est derriere File Storage, on le verra en 2.2.
- Rappeler : la connaissance OpenStack est un asset durable, transferable a tout cloud OpenStack-based (sovereign clouds, on-prem privatif).
-->

---
layout: default
moduleId: "2.1"
slideId: "S09 — Block or Object decision"
los: ["LO-STO-K01"]
---

# Block or Object? &mdash; the decision in one diagram

<div class="flex justify-center mt-2">

```mermaid {scale: 0.55}
%%{init: {'flowchart': {'nodeSpacing': 22, 'rankSpacing': 28}}}%%
flowchart LR
    Q[What's the data?]:::root
    Q --> M[Mutable<br/>random-access state]:::path
    Q --> F[Whole files<br/>read-mostly or shared]:::path
    Q -.-> SH[Shared filesystem<br/>multi-reader writer]:::muted
    M --> BLOCK[Block Storage<br/>DB files, app state]:::block
    F --> OBJECT[Object Storage<br/>artifacts, backups, static]:::object
    SH -.-> FILE[File Storage<br/>Module 2.2]:::muted

    classDef root fill:#FFFFFF,stroke:#000E9C,color:#000E9C
    classDef path fill:#DCEAFD,stroke:#000E9C,color:#000E9C
    classDef block fill:#000E9C,stroke:#000E9C,color:#FFFFFF
    classDef object fill:#000E9C,stroke:#000E9C,color:#FFFFFF
    classDef muted fill:#FFFFFF,stroke:#999999,color:#999999
```

</div>

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">

<div class="ovh-callout">
<strong>Common mistakes</strong><br/>
&middot; User uploads on Block on a single instance &rarr; doesn't survive instance deletion, doesn't scale to N app instances<br/>
&middot; Database on Object &rarr; whole-file read / write per transaction = catastrophic latency
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Northwind today</strong><br/>
&middot; PostgreSQL data &rarr; Block (<code>nw-db-data-01</code>)<br/>
&middot; Build artifacts &rarr; Object (<code>nw-artifacts</code>)<br/>
&middot; Both happen in the lab
</div>

</div>

<!--
Trainer notes S09 Block or Object decision:
- Souligner que le diagramme est volontairement simple : 80% des decisions de stockage se reglent avec ces deux questions.
- Anticiper "et pour les images Docker ?" : registry container privee Object-backed pour les artefacts, filesystem ephemere du host pour le cache local des layers Docker, cas hybride normal.
- Si quelqu'un demande "les logs vont ou ?" : logs applicatifs temps reel sur filesystem (block), archives long-terme exportees en Object.
- Rappeler que la 3eme option (file storage) existe et qu'on la verra en 2.2 pour le cas filesystem partage multi-reader writer.
- Slide cle du module : prendre 2 min pour le faire vivre, demander a 2 learners de placer un workload dans le diagramme.
-->

---
layout: default
moduleId: "2.1"
slideId: "S10 — Northwind storage architecture"
los: ["LO-STO-S01", "LO-STO-S04"]
---

# Northwind today &mdash; where storage lands

<div class="flex justify-center mt-2">

```mermaid {scale: 0.55}
%%{init: {'flowchart': {'nodeSpacing': 22, 'rankSpacing': 28}}}%%
flowchart LR
    WEB[nw-web-01]:::inst
    API[nw-api-01]:::inst
    DB[nw-db-01]:::inst
    VOL[Block Volume<br/>50 GiB<br/>/mnt/pgdata]:::add
    OBJ[Container<br/>nw-artifacts]:::add
    VOL ==>|attached| DB
    OBJ -.->|fetched by| API
    OBJ -.->|public-read URL| EXT[External GET]:::ext

    classDef inst fill:#000E9C,stroke:#000E9C,color:#FFFFFF
    classDef add fill:#DCEAFD,stroke:#000E9C,color:#000E9C,stroke-dasharray: 4 2
    classDef ext fill:#FFFFFF,stroke:#4D4D4D,color:#4D4D4D
```

</div>

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">

<div class="ovh-callout">
<strong>Two of three CTO demands &mdash; today</strong><br/>
&middot; Block volume on <code>nw-db-01</code> &rarr; PostgreSQL data dir lands here in Mod 2.2<br/>
&middot; Object container <code>nw-artifacts</code> &rarr; build artifacts + one public-read static
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Third demand &mdash; tomorrow</strong><br/>
Private network between the three tiers : <strong>Module 2.3</strong>. Inter-tier traffic still goes via public IPs today &mdash; costly and exposed.
</div>

</div>

<!--
Trainer notes S10 Northwind storage architecture:
- Souligner que le module ne fait pas encore tout : la base PostgreSQL n'est pas encore migree, le reseau prive n'est pas encore la, c'est le rythme de la journee.
- Rappeler le red-thread : trois exigences du CTO en fin de 1.4 : "real volume", "private network", "object storage for artifacts". On en regle deux aujourd'hui (volume + object), le reseau prive demain matin (2.3).
- Anticiper "pourquoi on ne migre pas PostgreSQL aujourd'hui ?" : la migration applicative (dump / restore, downtime, validation) est un sujet a part, on prepare le volume aujourd'hui, on charge PostgreSQL dessus en 2.2 ou en post-formation.
- Verifier que tout le monde a nw-db-01 qui tourne, sinon c'est l'heure du hors piste.
-->

---
# BLOCK 3 — TRAINER DEMONSTRATION
layout: section
block: "Block 3"
duration: "15 min"
---

# Volume lifecycle + S3 round-trip
### Two storage primitives, end-to-end

---
layout: default
moduleId: "2.1"
slideId: "Demo — Storage end-to-end"
los: ["LO-STO-S01", "LO-STO-S03", "LO-STO-S04", "LO-STO-S05"]
---

# Demo &mdash; Volume lifecycle + S3 round-trip on `demo-db-01`

<div class="grid grid-cols-2 gap-6 mt-6">

<div class="ovh-callout">
<strong style="color: var(--ovh-masterbrand-blue);">What you'll see</strong>
<div class="mt-2 text-sm">
&middot; Create a 20 GiB <code>classic</code> volume, attach, format, mount<br/>
&middot; Write a MARKER file, unmount, detach<br/>
&middot; Re-attach to a second instance, the MARKER is still there<br/>
&middot; Generate S3 credentials in the Manager<br/>
&middot; Create a container, upload, list, download<br/>
&middot; Public-read on one object, verify with <code>curl</code> no auth
</div>
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Why this matters</strong>
<div class="mt-2 text-sm">
By the end of the demo, you've manipulated both primitives end-to-end. Two channels : <code>openstack</code> for block, <code>aws s3</code> for object. Same project, two storage paradigms.
</div>
</div>

</div>

<div class="mt-6 text-center" style="color: var(--ovh-masterbrand-blue); font-weight: 600;">
  Instance : <code>demo-db-01</code> &middot; Region : GRA &middot; Channels : OpenStack CLI + aws-cli + Manager UI
</div>

<div class="mt-2 text-center text-sm" style="color: var(--ovh-gray-700);">
  14 steps &middot; ~12 min walkthrough &middot; 3 min Q&amp;A
</div>

<!--
Trainer notes Demo Storage end-to-end:

PRE-FLIGHT (do BEFORE the block):
- openrc.sh pre-sourced, openstack token issue must succeed.
- demo-db-01 from Module 1.4 demo still running and SSH-reachable.
- A second instance demo-web-01 also running, same AZ as demo-db-01.
- aws-cli v2 installed on the demo workstation. Profile ovh-gra pre-configured EXCEPT for the credentials (which we generate live for pedagogy).
- A small test file ready : sample-artifact.tgz (~5 MiB) and a tiny README.txt.
- Manager open in a second browser tab, signed in on the demo project.
- Terminal at 16pt+, dark background.

DEMO SCRIPT (14 steps, ~12 min):
1. openstack volume create --size 20 --type classic demo-db-data-01. Souligner --type classic = tier choice du slide S04.
2. openstack volume list. Status available. "Le volume existe, attache a personne."
3. openstack server add volume demo-db-01 demo-db-data-01. Status in-use. "Maintenant attache. Cote OS, Linux a vu un nouveau block device."
4. SSH demo-db-01, lsblk. Voir sdb (ou vdb) 20G no partition no fs. "Disque vide. Il faut un filesystem avant utilisation."
5. sudo mkfs.ext4 /dev/sdb. Note l'UUID a la fin. "C'est cet UUID qu'on mettra dans fstab pour persistence."
6. sudo mkdir -p /mnt/data && sudo mount /dev/sdb /mnt/data && echo "northwind-demo" | sudo tee /mnt/data/MARKER. "MARKER prouve qu'on a ecrit. On le retrouvera apres detach / reattach."
7. sudo umount /mnt/data, puis openstack server remove volume demo-db-01 demo-db-data-01. Status available. "Toujours umount avant detach. Detacher un fs monte = corruption."
8. openstack server add volume demo-web-01 demo-db-data-01. "Meme volume, autre instance. Single-attach : etait libre, est repris."
9. SSH demo-web-01, sudo mount /dev/sdb /mnt/data && cat /mnt/data/MARKER. Voir northwind-demo. "La donnee a voyage avec le volume, independante des deux instances."
10. Manager > Public Cloud > Project > Users & Roles > Add user S3, copier acces + secret. "Le secret s'affiche une fois. Sauve ou regenere."
11. aws configure --profile ovh-gra : keys + region gra + json. ~/.aws/credentials updated. "L'endpoint URL est ce qui pointe vers OVHcloud au lieu d'AWS. Seule difference."
12. aws s3 mb s3://demo-northwind-artifacts --endpoint-url https://s3.gra.io.cloud.ovh.net --profile ovh-gra. Bucket cree. "mb = make bucket. Dans notre vocabulaire : container cree en region GRA."
13. aws s3 cp sample-artifact.tgz s3://demo-northwind-artifacts/app/build-1.0.tgz, puis aws s3 ls s3://demo-northwind-artifacts/app/. "Le app/ est juste une convention de naming, pas un vrai dossier."
14. aws s3api put-object-acl --bucket demo-northwind-artifacts --key app/build-1.0.tgz --acl public-read, puis curl -sI https://demo-northwind-artifacts.s3.gra.io.cloud.ovh.net/app/build-1.0.tgz. HTTP/2 200. "Public-read sur un objet. Pas besoin de aws-cli pour le recuperer, l'URL HTTPS suffit."

FAILURE MODES:
- Step 4 lsblk ne voit rien : attendre 5-10 sec, le kernel doit enumerer. Si toujours rien, AZ mismatch entre volume et instance. openstack volume show et openstack server show, comparer.
- Step 6 mount fails "wrong fs type" : volume pas formate, refaire mkfs.ext4.
- Step 12 mb returns 403 : credentials pas encore propages (30-60 sec apres generation), ou typo endpoint URL.
- Step 14 curl returns 403 : URL format faux. Le virtual-hosted-style est https://<bucket>.s3.gra.io.cloud.ovh.net/<key>. Path-style aussi fonctionne : https://s3.gra.io.cloud.ovh.net/<bucket>/<key>.

Q&A (3 min) : focus sur le mental model block-vs-object et le AZ scoping. Parking pour 2.2 : snapshots de volumes et coherence applicative.
-->

---
# BLOCK 4 — LEARNER LAB
layout: section
block: "Block 4"
duration: "30 min"
---

# Provision Northwind's storage layers
### Your turn. Solo. 30 minutes. Block + Object.

---
layout: default
moduleId: "2.1"
slideId: "Lab — Brief"
los: ["LO-STO-S01", "LO-STO-S02", "LO-STO-S04", "LO-STO-S05"]
---

# Lab &mdash; Provision Northwind's stateful + shared storage

<div class="ovh-callout mt-4">
You are Northwind's Cloud Ops engineer. The CTO wants the database off the ephemeral local disk and the build artifacts in a shared store. Today you : (1) create a 50 GiB Block volume, attach it to <code>&lt;initials&gt;-nw-db-01</code>, format, mount, persist across reboot, (2) generate S3 credentials, create a container <code>&lt;initials&gt;-nw-artifacts</code>, round-trip a file, (3) expose one file as public-read and verify with <code>curl</code>.
</div>

<div class="grid grid-cols-2 gap-4 mt-6">

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Channels</strong>
<div class="mt-2 text-sm">
&middot; <code>openstack</code> CLI for block (volume + attach)<br/>
&middot; <code>aws-cli</code> for object (S3 API)<br/>
&middot; Manager UI for S3 credential generation
</div>
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Success criteria</strong>
<div class="mt-2 text-sm">
Volume survives reboot, OWNER file intact &middot; round-trip MD5 matches &middot; public-read URL returns the file unauthenticated
</div>
</div>

</div>

<div class="mt-6 text-center" style="color: var(--ovh-masterbrand-blue); font-weight: 600;">
  Volume : <code>&lt;initials&gt;-nw-db-data-01</code> &middot; Container : <code>&lt;initials&gt;-nw-artifacts</code> &middot; Time : 30 min
</div>

<!--
Trainer notes Lab Brief:
- Souligner que le volume reste attache a la fin du lab : utilise Module 2.2 pour le data directory PostgreSQL et 2.3 pour les flux prives.
- Annoncer les criteres de succes : auto-verifiables, l'apprenant n'a pas besoin du formateur pour savoir.
- Lab dense pour 30 min : surveiller le timing, si plus de la moitie de la salle est en retard a 20 min, couper le public-read et le declarer homework.
- Circuler discretement, ne pas intervenir sauf blocage. Cibler les 2-3 learners en avance pour soutenir les voisins.

VALIDATION CRITERIA (silent check by trainer):
- Volume nw-db-data-01 visible openstack volume list, status in-use, attache a nw-db-01
- Sur l'instance, df -h montre /mnt/pgdata 50G, fichier OWNER present
- Apres reboot, df -h | grep pgdata toujours present (fstab OK)
- Container nw-artifacts visible aws s3 ls, au moins 1 objet uploade
- curl public-read URL retourne 200 et le contenu, depuis un terminal incognito (no profile loaded)
-->

---
layout: default
moduleId: "2.1"
slideId: "Lab — Steps (1/2) Block Storage"
---

# Lab &mdash; Step-by-step (1/2) &middot; Block Storage
<div class="text-sm mt-4">
<strong style="color: var(--ovh-masterbrand-blue);">Block Storage (openstack CLI)</strong>
<div class="mt-3">
<strong>1.</strong> <code>openstack volume create --size 50 --type classic &lt;initials&gt;-nw-db-data-01</code><br/>
&nbsp;&nbsp;&nbsp;&nbsp;Verify <code>available</code> with <code>openstack volume list</code><br/>
<strong>2.</strong> <code>openstack server add volume &lt;initials&gt;-nw-db-01 &lt;initials&gt;-nw-db-data-01</code><br/>
<strong>3.</strong> SSH into nw-db-01, <code>lsblk</code>, note device (typically <code>/dev/sdb</code>)<br/>
<strong>4.</strong> <code>sudo mkfs.ext4 /dev/sdb</code><br/>
<strong>5.</strong> <code>sudo mkdir -p /mnt/pgdata && sudo mount /dev/sdb /mnt/pgdata</code><br/>
<strong>6.</strong> <code>echo "&lt;initials&gt; $(date -I)" | sudo tee /mnt/pgdata/OWNER</code><br/>
<strong>7.</strong> <code>sudo blkid /dev/sdb</code> &rarr; copy UUID<br/>
&nbsp;&nbsp;&nbsp;&nbsp;Append to <code>/etc/fstab</code> :<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<code>UUID=&lt;uuid&gt; /mnt/pgdata ext4 defaults,nofail 0 2</code><br/>
<strong>8.</strong> <code>sudo umount /mnt/pgdata && sudo mount -a && ls /mnt/pgdata</code> &rarr; OWNER visible<br/>
<strong>9.</strong> <code>sudo reboot</code>, wait, SSH back in, <code>df -h | grep pgdata</code> &rarr; mount persists
</div>
</div>
<!--
Trainer notes Lab Steps 1/2 Block:
- Slide de reference pour la premiere moitie du lab : laisser projete pendant les steps 1 a 9.
- Insister oralement en debut : "creez le volume dans LA MEME AZ que nw-db-01, sinon l'attach echoue."
- Si plusieurs learners bloquent sur lsblk qui ne voit rien : 90% du temps c'est l'AZ mismatch, le reste c'est attendre 5-10 sec.
- Si fstab fait crasher le reboot : nofail dans les options est ce qui sauve, verifier que c'est bien dans la ligne fstab. Sinon Rescue mode (Mod 1.4) pour reparer fstab.

SUPPORT FAQ (anticipated learner questions):
- "Volume available mais attach refuse not in same AZ" : openstack volume show et server show, comparer la zone. Recreer le volume dans la bonne AZ.
- "lsblk ne voit pas le nouveau device" : attendre 10 sec et retry. Sinon AZ mismatch.
- "mkfs dit que le device est busy" : sudo wipefs -a /dev/sdb pour clear, puis remkfs.
- "Apres reboot le mount est parti" : cat /etc/fstab, verifier que l'UUID matche sudo blkid. Cause classique : guillemets autour de l'UUID ou typo.
-->

---
layout: default
moduleId: "2.1"
slideId: "Lab — Steps (2/2) Object Storage"
---

# Lab &mdash; Step-by-step (2/2) &middot; Object Storage
<div class="text-sm mt-4">
<strong style="color: var(--ovh-masterbrand-blue);">Object Storage (Manager + aws-cli)</strong>
<div class="mt-3">
<strong>10.</strong> Manager &gt; Public Cloud &gt; project &gt; Users & Roles &gt; Add user S3 &rarr; copy access key + secret (shown once)<br/>
<strong>11.</strong> <code>aws configure --profile ovh-gra</code> &rarr; keys + region <code>gra</code> + format <code>json</code><br/>
&nbsp;&nbsp;&nbsp;&nbsp;Every <code>aws s3</code> command below : add<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<code>--profile ovh-gra --endpoint-url https://s3.gra.io.cloud.ovh.net</code><br/>
<strong>12.</strong> <code>aws s3 mb s3://&lt;initials&gt;-nw-artifacts</code><br/>
<strong>13.</strong> <code>aws s3 cp &lt;localfile&gt; s3://&lt;initials&gt;-nw-artifacts/app/sample.tgz</code><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<code>aws s3 ls s3://&lt;initials&gt;-nw-artifacts/app/</code><br/>
<strong>14.</strong> <code>aws s3 cp s3://&lt;initials&gt;-nw-artifacts/app/sample.tgz ./downloaded.tgz</code><br/>
&nbsp;&nbsp;&nbsp;&nbsp;Verify <code>md5sum</code> matches original<br/>
<strong>15.</strong> <code>aws s3 cp README.txt s3://&lt;initials&gt;-nw-artifacts/public/README.txt</code><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<code>aws s3api put-object-acl --bucket &lt;initials&gt;-nw-artifacts --key public/README.txt --acl public-read</code><br/>
<strong>16.</strong> Incognito browser or <code>curl</code> :<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<code>https://&lt;initials&gt;-nw-artifacts.s3.gra.io.cloud.ovh.net/public/README.txt</code> &rarr; 200 + content
</div>
<div class="mt-4 ovh-callout">
<strong>Artifact</strong> (do NOT commit)<br/>
<code>&lt;initials&gt;-northwind-staging/storage-notes.txt</code><br/>
volume UUID + container name + public URL + md5 round-trip
</div>
</div>
<!--
Trainer notes Lab Steps 2/2 Object:
- Slide de reference pour la seconde moitie du lab : laisser projete pendant les steps 10 a 16.
- Eviter d'aider trop tot sur les erreurs aws-cli : laisser le learner lire le message, 70% se debloque seul.
- Si plusieurs learners n'ont pas aws-cli installe : fallback rclone ou Manager UI pour upload / download (le credential lifecycle reste enseigne).

SUPPORT FAQ (anticipated learner questions):
- "aws s3 mb returns 403" : credentials pas encore actives (30-60 sec apres generation), ou endpoint URL typo.
- "Le bucket name est deja pris" : les noms sont uniques par region dans le namespace S3 OVHcloud, prefixer initiales + date.
- "curl public-read returns 403" : refaire put-object-acl, ou URL format faux. Le virtual-hosted-style est https://<bucket>.s3.gra.io.cloud.ovh.net/<key>.
- "Je peux partager mes credentials S3 avec mon voisin ?" : non, generer les siennes. Partager des credentials obscurcit l'audit trail, Pro tier antipattern.
-->

---
# BLOCK 5 — MICRO-CHECK QCM
layout: section
block: "Block 5"
duration: "5 min"
---

# Micro-check
### Seven formative questions

---
layout: default
moduleId: "2.1"
slideId: "MC — Q1 Block vs Object choice"
los: ["LO-STO-K01"]
---

# Q1 &mdash; Which paradigm for which workload

A learner needs to store a PostgreSQL database's data files for an application running on a single Public Cloud Instance. Which OVHcloud storage paradigm is the correct primary choice?

<div class="grid grid-cols-1 gap-3 mt-6">

<div class="ovh-callout"><strong>A.</strong> Block Storage &mdash; the workload needs random read / write at byte level on mutable state, attached to a single instance</div>
<div class="ovh-callout"><strong>B.</strong> Object Storage &mdash; PostgreSQL files can be large and Object has practically unlimited capacity</div>
<div class="ovh-callout"><strong>C.</strong> File Storage &mdash; PostgreSQL is often deployed on NFS in the OVHcloud documentation</div>
<div class="ovh-callout"><strong>D.</strong> Cold Archive &mdash; the data must be retained long-term</div>

</div>

<!--
Trainer notes Q1:
- Correct answer: A. Random read / write at byte level on mutable state = block.
- B wrong : object stores immutable whole objects, updating bytes in place at every transaction is not workable for a database.
- C wrong : NFS for PostgreSQL data files adds latency and locking issues, not recommended.
- D wrong : Cold Archive is for infrequent retrieval, PostgreSQL reads and writes constantly.
- LO: LO-STO-K01. Bloom: Understand.
- Piege : un ex-S3-heavy peut etre tente par B, recadrer sur le pattern d'acces.
-->

---
layout: default
moduleId: "2.1"
slideId: "MC — Q2 AZ scoping"
los: ["LO-STO-K02"]
---

# Q2 &mdash; Attaching a volume across AZs

An operator has a Block Storage volume in `GRA9-a` that they would like to attach to an instance running in `GRA9-b`. What is the correct procedure?

<div class="grid grid-cols-1 gap-3 mt-6">

<div class="ovh-callout"><strong>A.</strong> <code>openstack server add volume --force-cross-az</code> overrides the AZ check</div>
<div class="ovh-callout"><strong>B.</strong> It is not possible &mdash; AZ scoping is enforced. Create a new volume in <code>GRA9-b</code> and copy the data over (typically via snapshot + restore)</div>
<div class="ovh-callout"><strong>C.</strong> Create a vRack between the two AZs to bridge the volume attach</div>
<div class="ovh-callout"><strong>D.</strong> Use <code>openstack volume migrate</code> to relocate the volume's metadata to <code>GRA9-b</code></div>

</div>

<!--
Trainer notes Q2:
- Correct answer: B. AZ scoping is enforced by the storage backend.
- A wrong : pas de --force-cross-az, l'AZ scoping vient du backend, pas du CLI.
- C wrong : vRack est un primitif reseau L2 entre produits OVHcloud, pas un pont Block Storage. AZ scoping est independant du reseau.
- D wrong : pas de live migration cross-AZ expose dans Core Block Storage. Snapshot / restore est le pattern.
- LO: LO-STO-K02. Bloom: Remember.
- Recadrer un ex-AWS sur le fait que c'est exactement le meme comportement qu'EBS : AZ-scoped, pas de cross-AZ attach.
-->

---
layout: default
moduleId: "2.1"
slideId: "MC — Q3 Object Storage facts"
los: ["LO-STO-K03"]
---

# Q3 &mdash; Object Storage on OVHcloud

Which statement about OVHcloud Object Storage is correct?

<div class="grid grid-cols-1 gap-3 mt-6">

<div class="ovh-callout"><strong>A.</strong> Object Storage is AZ-scoped and supports single-instance attach, similar to Block Storage</div>
<div class="ovh-callout"><strong>B.</strong> Object Storage on OVHcloud exposes only the Swift API; S3 is not supported</div>
<div class="ovh-callout"><strong>C.</strong> Object Storage is region-scoped, exposes both an S3-compatible API and a native Swift API, and is backed by OpenStack Swift</div>
<div class="ovh-callout"><strong>D.</strong> Object Storage is built on OpenStack Cinder, the same project that powers Block Storage</div>

</div>

<!--
Trainer notes Q3:
- Correct answer: C. Region-scoped, two APIs, Swift backend.
- A wrong : confond Object et Block. Object est region-scoped, accede via HTTP API, pas attache aux instances.
- B wrong : S3-compatible API est la surface primaire pour Object Storage, layered sur Swift.
- D wrong : Cinder = block, Swift = object, projets OpenStack distincts.
- LO: LO-STO-K03. Bloom: Remember.
- Bonne question pour piocher les fondamentaux : 3 faits importants en une.
-->

---
layout: default
moduleId: "2.1"
slideId: "MC — Q4 OpenStack mapping"
los: ["LO-STO-K02", "LO-STO-K03"]
---

# Q4 &mdash; OpenStack project mapping

A learner reads in an OpenStack tutorial that they should use the `openstack volume` and `openstack object` commands. Which underlying OpenStack projects do these two commands correspond to?

<div class="grid grid-cols-1 gap-3 mt-6">

<div class="ovh-callout"><strong>A.</strong> <code>openstack volume</code> &rarr; <strong>Cinder</strong> (block) &middot; <code>openstack object</code> &rarr; <strong>Swift</strong> (object)</div>
<div class="ovh-callout"><strong>B.</strong> <code>openstack volume</code> &rarr; <strong>Manila</strong> &middot; <code>openstack object</code> &rarr; <strong>Cinder</strong></div>
<div class="ovh-callout"><strong>C.</strong> <code>openstack volume</code> &rarr; <strong>Nova</strong> &middot; <code>openstack object</code> &rarr; <strong>Keystone</strong></div>
<div class="ovh-callout"><strong>D.</strong> Both commands are part of the <strong>Glance</strong> project (image storage)</div>

</div>

<!--
Trainer notes Q4:
- Correct answer: A. Cinder block, Swift object.
- B wrong : Manila est file storage (Mod 2.2), mapping inverse.
- C wrong : Nova compute, Keystone identity, sans rapport avec stockage.
- D wrong : Glance est image storage pour les images Compute, pas block / object products.
- LO: LO-STO-K02, LO-STO-K03. Bloom: Remember.
- C'est aussi le moment de mentionner Manila en preview : on le verra 2.2 pour File Storage.
-->

---
layout: default
moduleId: "2.1"
slideId: "MC — Q5 Volume resize"
los: ["LO-STO-S02"]
---

# Q5 &mdash; Volume resize and filesystem extend

An operator has resized a Block Storage volume from 20 GiB to 50 GiB using `openstack volume set --size 50`. SSH-ing into the instance, `lsblk` shows the device is now 50 GiB but `df -h` still shows the filesystem as 20 GiB. What is the missing step?

<div class="grid grid-cols-1 gap-3 mt-6">

<div class="ovh-callout"><strong>A.</strong> Reboot the instance &mdash; <code>df -h</code> reflects the new size after a fresh boot</div>
<div class="ovh-callout"><strong>B.</strong> Detach and reattach the volume to force the kernel to re-read the size</div>
<div class="ovh-callout"><strong>C.</strong> Run <code>openstack volume set --refresh-mount</code> to push the new size to the instance</div>
<div class="ovh-callout"><strong>D.</strong> Extend the filesystem online : <code>sudo resize2fs /dev/&lt;device&gt;</code> for ext4, <code>sudo xfs_growfs /mnt/&lt;mountpoint&gt;</code> for XFS</div>

</div>

<!--
Trainer notes Q5:
- Correct answer: D. Le filesystem doit etre etendu, le device l'a deja ete.
- A wrong : reboot n'etend pas un filesystem, le filesystem ignore que le device a grandi.
- B wrong : le kernel a deja vu la nouvelle taille (confirme par lsblk), c'est le fs au-dessus qui manque.
- C wrong : commande inexistante. L'extension fs est responsabilite operateur.
- LO: LO-STO-S02. Bloom: Apply.
- Forward reference : pareil sur AWS gp3 / io2, le couple block + filesystem est universel.
-->

---
layout: default
moduleId: "2.1"
slideId: "MC — Q6 Volume move"
los: ["LO-STO-S03"]
---

# Q6 &mdash; Moving a volume to another instance

A learner wants to move a Block Storage volume from `nw-db-01` to `nw-web-01` without losing data. Both instances are in the same AZ. What is the correct sequence?

<div class="grid grid-cols-1 gap-3 mt-6">

<div class="ovh-callout"><strong>A.</strong> Detach with <code>--force</code> while the filesystem is mounted &mdash; the cloud handles the unmount for you</div>
<div class="ovh-callout"><strong>B.</strong> Inside <code>nw-db-01</code>, <code>sudo umount</code>; on cloud side, <code>openstack server remove volume nw-db-01 &lt;vol&gt;</code>; <code>openstack server add volume nw-web-01 &lt;vol&gt;</code>; inside <code>nw-web-01</code>, mount</div>
<div class="ovh-callout"><strong>C.</strong> Stop both instances, swap the volume attachment, restart both instances</div>
<div class="ovh-callout"><strong>D.</strong> Take a snapshot, create a new volume from the snapshot in <code>nw-web-01</code>, leave the original attached</div>

</div>

<!--
Trainer notes Q6:
- Correct answer: B. Unmount au niveau OS d'abord, puis detach / attach, puis mount.
- A wrong : detacher un fs monte cause corruption fs, l'unmount doit etre cote OS.
- C wrong : pas besoin d'arreter, les operations attach / detach sont online.
- D wrong : ca produit une COPIE, pas un MOVE. La question demandait un move.
- LO: LO-STO-S03. Bloom: Apply.
- Bon distracteur D : un ex-Cinder peut etre tente par le snapshot, recadrer sur la difference move / copy.
-->

---
layout: default
moduleId: "2.1"
slideId: "MC — Q7 Permissions"
los: ["LO-STO-S05"]
---

# Q7 &mdash; Time-limited external sharing

A learner needs to share a 10 MiB PDF with an external customer for a 48-hour review window. The file must not be publicly accessible after that window, and creating an external IAM principal for the customer is not desired. Which Object Storage permission pattern fits?

<div class="grid grid-cols-1 gap-3 mt-6">

<div class="ovh-callout"><strong>A.</strong> Generate a <strong>presigned URL</strong> with a 48-hour validity targeting the specific object</div>
<div class="ovh-callout"><strong>B.</strong> Set the entire container to public-read for 48 hours, then revert to private</div>
<div class="ovh-callout"><strong>C.</strong> Email the file directly from the instance &mdash; Object Storage is overkill for one-off sharing</div>
<div class="ovh-callout"><strong>D.</strong> Create a private container and share your own S3 credentials with the customer for the window</div>

</div>

<!--
Trainer notes Q7:
- Correct answer: A. Presigned URL, time-limited, scope a un objet specifique.
- B wrong : expose TOUS les objets du container, et la fenetre temporelle est manuelle, error-prone.
- C wrong : contourne la question et ne teste pas Object Storage, et l'email casse pour les gros fichiers.
- D wrong : partager des credentials = acces a tout ce que ces credentials peuvent atteindre, audit trail casse.
- LO: LO-STO-S05. Bloom: Apply.
- Bon distracteur D : reverbaliser que partager des credentials est l'antipattern classique cloud.
-->

---
# BLOCK 6 — WRAP-UP & TRANSITION
layout: section
block: "Block 6"
duration: "5 min"
---

# Wrap-up
### Recap & transition to Module 2.2

---
layout: two-cols
moduleId: "2.1"
slideId: "Wrap-up — Recap & next stop"
los: ["LO-STO-K01", "LO-STO-K02", "LO-STO-K03", "LO-STO-S01", "LO-STO-S02", "LO-STO-S03", "LO-STO-S04", "LO-STO-S05"]
---

# Wrap-up

::left::

## You can now...

<div class="ovh-callout mt-4">
<div class="text-sm leading-relaxed">
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Distinguish</strong> the three storage paradigms and pick the right one<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Explain</strong> Block Storage : AZ-scoped, single-attach, persistent, with Cinder behind<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Explain</strong> Object Storage : region-scoped, S3 + Swift APIs, with Swift behind<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Create</strong>, attach, format, mount, persist a Block volume across reboot<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Resize</strong> a volume online and extend the filesystem<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Detach</strong> cleanly and reattach to another instance in the same AZ<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Manipulate</strong> Object Storage via the S3 API : create, upload, list, download<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Set</strong> private / public-read / presigned URL visibility
</div>
</div>

::right::

## Next stop &mdash; Module 2.2

<div class="ovh-callout mt-4" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">File Storage, Snapshots & Backup Strategy</strong>
<div class="mt-3 text-sm">
Northwind's CTO walks back in with three follow-ups :<br/><br/>
<em>"What about the four old PDFs the legal team needs to keep for ten years? What about a shared filesystem the API and web instances both need to read configuration from? And what's our backup story if someone runs DELETE FROM on the wrong table at 3am?"</em><br/><br/>
That's Module 2.2 : File Storage, Snapshots, Instance Backup, Cold Archive, and the design of a real backup strategy.
</div>
</div>

<div class="mt-6 text-center text-sm" style="color: var(--ovh-gray-700);">
Module 5 / 11 &middot; Storage domain in progress &middot; Block and Object done, File and backups next
</div>

<!--
Trainer notes Wrap-up:
- Rappeler que le volume nw-db-data-01 reste attache et que le container nw-artifacts reste actif : reutilises Module 2.2 (snapshots de volume + backup strategy) et Module 2.3 (private network).
- Souligner que les 2 paradigmes vus aujourd'hui couvrent 80% des workloads : File en 2.2 sert le cas multi-attach partage.
- Anticiper la fatigue : on est au milieu de Day 2, annoncer la pause, timing precis du retour.
- Si question parking non resolue (snapshot de volumes, lifecycle policies, replication cross-region) : noter "parking 2.2".
- Transition narrative : "Block sous PostgreSQL, Object pour les artefacts. CTO revient : 'Et mes vieux PDF legal ? Et le partage entre instances ? Et le backup ?' Module 2.2."
- Eviter de demarrer 2.2 maintenant : laisser respirer.
-->