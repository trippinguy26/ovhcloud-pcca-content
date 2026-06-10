---
# ============================================================
# Module 2.5 -- Identity, Access & Security -- Beyond Basics
# Slidev source file
# ============================================================
theme: ../../theme-ovhcloud
title: Identity, Access & Security -- Beyond Basics
info: |
  ## OVHcloud -- Public Cloud -- Core Associate
  Module 2.5 -- Identity, Access & Security -- Beyond Basics.
  Duration: 1h30.
class: text-left
highlighter: shiki
lineNumbers: false
drawings:
  persist: false
transition: slide-left
mdc: true
exportFilename: 'modules/module-2-5/student_export'

# Hide the floating navbar / controls overlay in dev mode
controls: false
download: false
selectable: true

# Module-level metadata (consumed by trainer-notes export and CI)
moduleId: "2.5"
moduleTitle: "Identity, Access & Security -- Beyond Basics"
duration: "1h30"
program: "OVHcloud -- Public Cloud -- Core Associate"
los:
  - LO-SEC-K01
  - LO-SEC-K02
  - LO-SEC-K03
  - LO-SEC-K04
  - LO-SEC-K05
  - LO-SEC-K06
  - LO-SEC-S01
  - LO-SEC-S02
  - LO-SEC-S03
  - LO-SEC-S04
  - LO-SEC-S05
  - LO-SEC-A01
  - LO-SEC-A02
# COVER SLIDE
layout: cover
---

# Identity, Access & Security
## Beyond Basics

<!--
Trainer notes Cover slide:
- Welcome to the closing module of Day 2. End of afternoon, learners are tired but the module is high-value.
- Frame the shift : 2.4 closed the network domain on a production-shape topology. 2.5 closes Day 2 on a production-shape identity model.
- Announce : at the end of 1h30, the Northwind project has separated developer identity, an application credential for the backup job, secrets externalized to Secret Manager, and one audit finding resolved.
- Set expectations : slide 4 (two gates in sequence, IAM then Keystone) is the pivot of the module. Pre-flag it.
- Anticipate confusions : OVHcloud IAM vs OpenStack Keystone (the recurring confusion), application credentials vs personal credentials (the high-leverage habit), Secret Manager vs KMS (don't conflate).
- Dense module : 13 LOs in 90 min. The audit reflex is the take-home posture, not a passing skill.
-->

---
layout: default
moduleId: "2.5"
slideId: "Agenda"
---

# Agenda

<div class="grid grid-cols-2 gap-8 mt-8">

<div>

**Block 1 -- Sentier battu** &middot; 5 min
*Prerequisites & remediation pointers*

**Block 2 -- Theory** &middot; 30 min
*Two-layer IAM &middot; Policy structure &middot; Roles &middot; App credentials &middot; Secret Manager &middot; KMS &middot; Audit reflex*

**Block 3 -- Demo** &middot; 15 min
*IAM user + group + policy &middot; Application credential &middot; Secret Manager &middot; Five-catalog audit*

</div>

<div>

**Block 4 -- Lab** &middot; 30 min
*Separate identities, scope credentials, externalize secrets, audit*

**Block 5 -- Micro-check** &middot; 5 min
*Formative QCM, 8 questions*

**Block 6 -- Wrap-up** &middot; 5 min
*Recap & transition to Module 3.1 (IaC Essentials)*

</div>

</div>

<!--
Trainer notes Agenda:
- Module hybride : Manager UI pour IAM users / groups / policies / Secret Manager, OpenStack CLI pour application credentials et role assignments.
- Verifier que la salle a un access admin sur l'organisation OVHcloud (sinon impossible de creer un IAM user). Sinon prevoir le compte demo prepare.
- Annoncer le double browser : une fenetre normale en tant que trainer, une fenetre privee en tant que <initials>-northwind-developer pour valider le scoping en temps reel.
- Strict timing 90 min. Slide la plus importante : slide 4 (les deux gates IAM puis Keystone). Pre-annoncer.
- Le module ferme Day 2. Annoncer Day 3 demarre par IaC Essentials (3.1).
-->

---
layout: section
block: "Block 1"
duration: "5 min"
---

# Before we start
### Prerequisites & remediation

---
layout: two-cols
moduleId: "2.5"
slideId: "S00a -- You are ready if..."
---

# Before we start (1/2)

::left::

<div class="text-sm">

<strong style="color: var(--ovh-masterbrand-blue); font-size: 1.1rem;">Tools</strong>

<div class="mt-3">
&middot; Northwind stack from Mod 2.4 : Gateway in place, LB with HTTPS fronting the web tier, API + DB private-only<br/>
&middot; <code>backup-pg.sh</code> deployed on <code>nw-db-01</code>, currently sourcing the operator's personal <code>openrc.sh</code><br/>
&middot; Admin-level access on the OVHcloud organization (to create IAM users, groups, policies)<br/>
&middot; A second browser, private window, to test the new IAM user without signing out<br/>
&middot; The OVHcloud API console <code>api.ovh.com/console</code> reachable
</div>

</div>

::right::

<div class="text-sm">

<strong style="color: var(--ovh-masterbrand-blue); font-size: 1.1rem;">Knowledge</strong>

<div class="mt-3">
&middot; Basic IAM concepts from Mod 1.2 : project membership, OpenStack roles <code>administrator</code> / <code>member</code> / <code>reader</code><br/>
&middot; The <code>openrc.sh</code> pattern : env vars consumed by the OpenStack CLI<br/>
&middot; Object Storage S3 access keys from Mod 2.1 (access key + secret key)<br/>
&middot; Service account notion from legacy IT : a non-human identity used by a process, separate lifecycle from any human<br/>
&middot; Discipline : never log a secret, never commit a secret to a repo
</div>

</div>

<!--
Trainer notes S00a You are ready if:
- Demander : "Votre Northwind stack avec LB + Gateway de 2.4 est toujours up ?" Si plus de 30% out, lancer recover-network-state.sh du Mod 2.4 en parallele pendant l'intro.
- Verifier que tous les learners ont l'admin OVHcloud sur leur organisation. Si pas le cas (training en entreprise, compte d'org partage) : prevenir et basculer sur le compte demo prepare.
- Souligner que le module utilise BEAUCOUP la Manager UI : verifier que la connexion fonctionne avant de demarrer.
- Confirmer que les learners savent ouvrir une fenetre privee dans leur navigateur. Ca parait trivial mais c'est un blocage frequent.
-->

---
layout: two-cols
moduleId: "2.5"
slideId: "S00b -- If not, here's where to look"
---

# Before we start (2/2)

::left::

<div class="text-sm">

<strong style="color: var(--ovh-masterbrand-blue); font-size: 1.1rem;">Stack or services missing</strong>

<div class="mt-3">
&middot; <strong>Mod 2.4 state missing ?</strong> &rarr; run <code>module-2-4/recover-network-state.sh</code>, idempotent, ~5 min<br/>
&middot; <strong>No admin access on the OVHcloud org ?</strong> &rarr; trainer provides a pre-baked sub-account with admin rights scoped to a dedicated training org<br/>
&middot; <strong><code>backup-pg.sh</code> not in place ?</strong> &rarr; lab handout includes a one-line <code>curl | bash</code> to redeploy the script and its systemd timer<br/>
&middot; <strong>Personal <code>openrc.sh</code> committed to a repo ?</strong> &rarr; flag it now, address it in the audit step of the lab
</div>

</div>

::right::

<div class="text-sm">

<strong style="color: var(--ovh-masterbrand-blue); font-size: 1.1rem;">Concept confusions to preempt</strong>

<div class="mt-3">
&middot; <strong>OVHcloud IAM vs OpenStack Keystone ?</strong> &rarr; two layers, both required. IAM = account-wide (Manager, billing, projects). Keystone = inside one project (instances, networks)<br/>
&middot; <strong>Why two IAM layers ?</strong> &rarr; OpenStack ships its own identity (Keystone). OVHcloud wraps the wider account around it. Architecture, not arbitrary<br/>
&middot; <strong>Secret Manager vs KMS ?</strong> &rarr; Secret Manager stores secrets (passwords, API keys). KMS manages encryption keys. Different jobs<br/>
&middot; <strong>Persona Digital Starter alone ?</strong> &rarr; same patterns, future-self benefits + rotation hygiene
</div>

</div>

<!--
Trainer notes S00b If not where to look:
- Anticiper la confusion IAM vs Keystone : si elle reapparait pendant la Theory, c'est qu'on n'a pas suffisamment pose le perimetre ici.
- Si plus de 30% de la salle a besoin du recover script, le lancer en parallele du Sentier battu, ne pas attendre.
- Pour le persona Digital Starter (souvent solo) : insister sur les 3 raisons de slide 11 (future-self, futur recrutement, rotation hygiene). Sinon ils zappent.
- Cloturer en confirmant : Northwind stack up, admin OVHcloud OK, backup-pg.sh present, fenetre privee testee.
-->

---
layout: section
block: "Block 2"
duration: "30 min"
---

# Theory & Concepts
### Two-layer IAM, policies, roles, app credentials, secrets, KMS, audit

---
layout: default
moduleId: "2.5"
slideId: "S01 -- Where we left off"
los: ["LO-SEC-A01"]
---

# Where we left off &mdash; network is production-shape, identity is not

<div class="grid grid-cols-2 gap-6 mt-6 text-sm">

<div class="ovh-callout">
<strong>End of Module 2.4</strong>
<div class="mt-2">
&middot; LB with HTTPS in front of the web tier<br/>
&middot; Gateway retiring public IPs on API + DB<br/>
&middot; Tiered Security Groups, default-deny ingress<br/>
&middot; Anti-DDoS included at the backbone level<br/>
&middot; <em>Network looks like real production.</em>
</div>
</div>

<div class="ovh-callout ovh-callout-warn">
<strong>What the network does not solve</strong>
<div class="mt-2">
&middot; PostgreSQL password in plaintext in <code>config.yaml</code><br/>
&middot; Backup cron sources the operator's personal <code>openrc.sh</code><br/>
&middot; Every project member has <code>administrator</code> by default<br/>
&middot; One flat SSH key shared across the team<br/>
&middot; <em>The first audit finds all of this.</em>
</div>
</div>

</div>

<div class="ovh-callout mt-4 text-sm" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Module 2.5 overlays production-shape identity</strong>&nbsp;: <strong>IAM scoped per role</strong> &middot; <strong>application credentials</strong> for automation &middot; <strong>Secret Manager</strong> for secrets &middot; <strong>audit reflex</strong> across five catalogs.
</div>

<!--
Trainer notes S01 Where we left off:
- Demander : "vous deploieriez ca en prod aujourd'hui ?" Laisser le silence. La salle se positionne.
- Souligner que le reseau est OK, l'identite ne l'est pas. C'est la suite logique de la sequence pedagogique.
- Annoncer les 4 piliers du module : IAM + app credentials + Secret Manager + audit. Tous les 4 sont touches dans le lab.
- Anticiper : "pourquoi pas tout en meme temps des le debut ?" : pedagogique, on construit la stack par couches, chaque couche refait passer la precedente au crible.
-->

---
layout: default
moduleId: "2.5"
slideId: "S02 -- Two identity layers"
los: ["LO-SEC-K01"]
---

# Two identity layers coexist &mdash; both are always present

<div class="flex justify-center mt-2">

```mermaid {scale: 0.55}
%%{init: {'flowchart': {'nodeSpacing': 22, 'rankSpacing': 28}}}%%
flowchart TB
    USER[User]:::user
    IAM[OVHcloud IAM<br/>account-wide]:::iam
    KEY[OpenStack Keystone<br/>project-scoped]:::key
    BILL[Billing]:::svc
    PROJ[Project lifecycle]:::svc
    SUPP[Support]:::svc
    VRACK[vRack]:::svc
    INST[Instances]:::res
    NET[Networks]:::res
    VOL[Volumes]:::res

    USER --> IAM
    IAM --> BILL
    IAM --> PROJ
    IAM --> SUPP
    IAM --> VRACK
    IAM --> KEY
    KEY --> INST
    KEY --> NET
    KEY --> VOL

    classDef user fill:#FFFFFF,stroke:#000E9C,color:#000E9C
    classDef iam fill:#000E9C,stroke:#000E9C,color:#FFFFFF
    classDef key fill:#0050D7,stroke:#000E9C,color:#FFFFFF
    classDef svc fill:#DCEAFD,stroke:#000E9C,color:#000E9C
    classDef res fill:#F2F2F2,stroke:#000E9C,color:#000E9C
```

</div>

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">

<div class="ovh-callout">
<strong>OVHcloud IAM &middot; account-wide</strong><br/>
Sign-in to the Manager. Billing visibility. Project lifecycle. Support tickets. vRack. <strong>IAM management itself.</strong>
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">OpenStack Keystone &middot; project-scoped</strong><br/>
Inside one Public Cloud project : create instances, attach volumes, modify Security Groups, manage networks.
</div>

</div>

<!--
Trainer notes S02 Two identity layers:
- Slide structurant. Y passer 2 min pleines.
- Analogie legacy : OVHcloud IAM = AD au niveau de l'entreprise, Keystone = groupes locaux sur un serveur. La salle qui vient de legacy accroche immediatement.
- Pour ex-AWS : "AWS n'a qu'un seul IAM. OVHcloud en a deux parce que Public Cloud est OpenStack-native, Keystone fait partie de l'upstream open-source."
- Anticiper "pourquoi pas tout fusionner ?" : reponse au slide suivant + en FAQ. Hold the question.
- Demander : "ou se trouve la decision de creer un projet ?" : couche IAM. "Ou se trouve la decision de creer une instance dans le projet ?" : couche Keystone. Verifier que la salle suit.
-->

---
layout: default
moduleId: "2.5"
slideId: "S03 -- What lives in each layer"
los: ["LO-SEC-K01"]
---

# What lives in each layer

<div class="grid grid-cols-2 gap-6 mt-6 text-sm">

<div class="ovh-callout">
<strong>OVHcloud IAM</strong>
<div class="mt-2">
&middot; <strong>Users</strong> : individual identities, password + optional MFA, or federated via SAML / OIDC<br/>
&middot; <strong>Groups</strong> : containers for users, the maintainable unit for policy attachment<br/>
&middot; <strong>Policies</strong> : JSON-like documents declaring allowed and denied actions<br/>
&middot; <strong>Roles</strong> (legacy, account-level) : predefined bundles (<code>administrator</code>, <code>accounting</code>), being superseded by policies<br/>
&middot; <strong>Identity providers</strong> : SSO entry point (Pro+, awareness here)<br/>
&middot; <strong>Audit log</strong> : who did what, when
</div>
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">OpenStack Keystone</strong>
<div class="mt-2">
&middot; <strong>Projects</strong> : the OpenStack isolation unit, one OVHcloud Public Cloud project = one Keystone project<br/>
&middot; <strong>Users</strong> : the Keystone-side view of the OVHcloud identities granted access to the project<br/>
&middot; <strong>Roles</strong> : <code>administrator</code>, <code>member</code>, <code>reader</code> (per-project, not global)<br/>
&middot; <strong>Application credentials</strong> : project-scoped tokens, attached to a role, with an optional expiry<br/>
&middot; <strong>Horizon</strong> : the OpenStack UI<br/>
&middot; <strong>OpenStack CLI &middot; Terraform OpenStack</strong> : authenticate against Keystone
</div>
</div>

</div>

<!--
Trainer notes S03 What lives in each layer:
- Ne pas surinvestir sur les Roles legacy account-level cote IAM. Le pattern moderne est policy-driven, c'est ce qu'on enseigne.
- Insister sur "users in groups, policies on groups" : c'est le pattern maintenable. On le repete slide 5 et slide 7.
- Cote Keystone : les 3 roles sont stables sur toutes les regions OVHcloud, pas d'exception regionale a memoriser.
- Anticiper : "MFA obligatoire ?" : recommande fortement, peut etre enforced au niveau de l'organisation.
- Pour ex-AWS : Keystone = pas d'assume-role. C'est la principale difference avec AWS IAM, a flagger.
-->

---
layout: default
moduleId: "2.5"
slideId: "S04 -- Two gates in sequence"
los: ["LO-SEC-K01"]
---

# Every Public Cloud action passes two gates &mdash; in sequence

<div class="flex justify-center mt-1">

```mermaid {scale: 0.4}
%%{init: {'flowchart': {'nodeSpacing': 22, 'rankSpacing': 35}}}%%
flowchart LR
    U[User action<br/>create instance nw-api-01]:::user
    G1{Gate 1<br/>OVHcloud IAM<br/>policy allows ?}:::gate
    G2{Gate 2<br/>OpenStack Keystone<br/>role permits ?}:::gate
    OK[Action succeeds]:::ok
    KO[403 Forbidden]:::ko

    U --> G1
    G1 -->|yes| G2
    G1 -->|no| KO
    G2 -->|yes| OK
    G2 -->|no| KO

    classDef user fill:#DCEAFD,stroke:#000E9C,color:#000E9C
    classDef gate fill:#0050D7,stroke:#000E9C,color:#FFFFFF
    classDef ok fill:#FFFFFF,stroke:#00A86B,color:#00A86B
    classDef ko fill:#FFFFFF,stroke:#D9534F,color:#D9534F
```

</div>

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">

<div class="ovh-callout">
<strong>Gate 1 &middot; OVHcloud IAM</strong><br/>
At the OVHcloud API edge : is the caller authenticated ? Is a policy allowing this action on this resource type ? Failure &rarr; the call never reaches OpenStack.
</div>

<div class="ovh-callout">
<strong>Gate 2 &middot; OpenStack Keystone</strong><br/>
At the OpenStack API edge : does the caller have a role on this project permitting this OpenStack call ? Failure &rarr; <code>403 Forbidden</code>, classic OpenStack error.
</div>

</div>

<div class="ovh-callout mt-4 text-sm" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Reading the failure mode</strong>&nbsp;: <em>"IAM allows but the call fails"</em> = Gate 2 closed (no Keystone role). <em>"User cannot sign in at all"</em> = Gate 1 closed (no IAM access).
</div>

<!--
Trainer notes S04 Two gates in sequence:
- Slide PIVOT du module. Si la salle le comprend, le reste suit. Si elle le rate, on revient ici.
- Insister : sequence, pas parallele. Gate 1 doit dire oui pour qu'on atteigne Gate 2.
- Anticiper : "et si je donne IAM mais pas Keystone, qu'est-ce que je vois ?" : le projet apparait dans la Manager mais "vide" : pas d'instances, pas de volumes. Le user crois que le projet est cassé, alors qu'il manque juste un role.
- Reformuler pour Digital Starter : "si vous etes seul, les deux gates sont grand ouvertes pour vous par defaut. Ca compte quand vous ajoutez quelqu'un."
- Demander a la fin : "ou se passe la decision quand un IAM user veut creer une instance ?" : reponse attendue, Gate 1 valide la policy IAM, Gate 2 valide le role Keystone sur le projet.
-->

---
layout: default
moduleId: "2.5"
slideId: "S05 -- IAM policy structure"
los: ["LO-SEC-K02"]
---

# IAM policy structure &mdash; four ingredients

<div class="grid grid-cols-2 gap-6 mt-6 text-sm">

<div class="ovh-callout">
<strong>Subject &middot; who</strong>
<div class="mt-2">
&middot; A user, a group, or an identity-provider role<br/>
&middot; <strong>Groups are the maintainable pattern.</strong> Users join groups<br/>
&middot; Per-user attachment : only for documented exceptions
</div>
</div>

<div class="ovh-callout">
<strong>Resource &middot; on what</strong>
<div class="mt-2">
&middot; URN syntax : <code>urn:v1:eu:resource:publicCloud:&lt;projectId&gt;</code><br/>
&middot; Identifies a service path, a project, an instance, etc.<br/>
&middot; Wildcards allowed at the segment level
</div>
</div>

</div>

<div class="grid grid-cols-2 gap-6 mt-4 text-sm">

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Action &middot; what</strong>
<div class="mt-2">
&middot; Colon-separated hierarchy : <code>publicCloud:operate:instance:create</code><br/>
&middot; Wildcards : <code>publicCloud:operate:instance:*</code>, <code>publicCloud:*</code><br/>
&middot; Use the action picker in the Manager. Hand-writing URNs &rarr; typos &rarr; silent zero-grant
</div>
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Condition &middot; when</strong>
<div class="mt-2">
&middot; Optional. Narrows the rule by context<br/>
&middot; Source IP range, MFA presence, time window<br/>
&middot; Often empty at the Associate scope
</div>
</div>

</div>

<div class="ovh-callout ovh-callout-warn mt-4 text-sm">
  <strong>Rules combine with deny overrides allow.</strong> Same as AWS IAM, same as POSIX file ACLs. Useful for guardrails (deny project deletion on top of an allow-everything-else policy).
</div>

<!--
Trainer notes S05 IAM policy structure:
- Si possible, ouvrir la Manager UI et montrer une policy predefinie en direct (Public Cloud Operator est la plus propre).
- Insister sur "use the action picker". Les URN ecrites a la main sont une source de bugs silencieux : le user croit avoir la permission, la policy ne matche pas, le call est refuse, on cherche pendant 1h.
- Anticiper Corporate : "AD ressemble. C'est la meme logique deny-overrides-allow." OK comme intuition, mais l'attachment IAM est plus flexible que AD GPO.
- Pour Digital Starter : "vous ne creerez pas de policy custom au debut. Vous utiliserez les predefined. Slide 6."
- Anticiper : "et si deux groupes du meme user ont des policies contradictoires ?" : deny gagne. Toujours.
-->

---
layout: default
moduleId: "2.5"
slideId: "S06 -- Predefined IAM policies"
los: ["LO-SEC-K02", "LO-SEC-A01"]
---

# Predefined IAM policies &mdash; start here, customize only when needed

<div class="text-sm mt-4">

<table style="width:100%; border-collapse: collapse;">
<thead>
<tr style="background: var(--ovh-masterbrand-blue); color: white;">
<th style="padding: 6px 8px; text-align: left;">Predefined policy</th>
<th style="padding: 6px 8px; text-align: left;">Scope</th>
<th style="padding: 6px 8px; text-align: left;">Typical persona</th>
</tr>
</thead>
<tbody>
<tr style="background: #F2F2F2;">
<td style="padding: 6px 8px;"><strong>Public Cloud Operator</strong></td>
<td style="padding: 6px 8px;">Read + write on Public Cloud, no billing, no project deletion</td>
<td style="padding: 6px 8px;">Developer, SRE</td>
</tr>
<tr>
<td style="padding: 6px 8px;"><strong>Public Cloud Read-only</strong></td>
<td style="padding: 6px 8px;">Read everywhere in Public Cloud, write nowhere</td>
<td style="padding: 6px 8px;">Auditor, consultant</td>
</tr>
<tr style="background: #F2F2F2;">
<td style="padding: 6px 8px;"><strong>Billing Read-only</strong></td>
<td style="padding: 6px 8px;">Billing visibility, zero on infrastructure</td>
<td style="padding: 6px 8px;">Finance, accounting</td>
</tr>
<tr>
<td style="padding: 6px 8px;"><strong>Support Operator</strong></td>
<td style="padding: 6px 8px;">Create and follow support tickets</td>
<td style="padding: 6px 8px;">Ops on-call</td>
</tr>
<tr style="background: #F2F2F2;">
<td style="padding: 6px 8px;"><strong>Administrator</strong></td>
<td style="padding: 6px 8px;">Everything, including IAM management</td>
<td style="padding: 6px 8px;">Cloud admin (one or two people)</td>
</tr>
</tbody>
</table>

</div>

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">

<div class="ovh-callout">
<strong>Production workflow</strong><br/>
<strong>Duplicate &middot; rename &middot; trim &middot; attach to a group.</strong> Never write a custom policy from scratch unless the predefined set genuinely doesn't fit.
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">A user can carry several policies</strong><br/>
Via group memberships (recommended) or direct attachments. <strong>Union of allows minus union of denies</strong> decides the effective scope.
</div>

</div>

<!--
Trainer notes S06 Predefined IAM policies:
- Insister sur "duplicate then trim" comme workflow de production. Plus rapide, moins de bugs, plus facile a reviewer.
- Anticiper Corporate : "on a 12 personas RBAC internes, on peut tout modeliser ?" : oui, IAM est assez flexible. Un groupe par persona, une policy par groupe.
- Persona Digital Starter creera rarement un IAM user au debut. La premiere policy qu'il utilisera : Public Cloud Read-only pour inviter un comptable ou un freelance.
- La table est volontairement courte : ce sont les plus utilisees. Le set evolue, ne pas memoriser une liste exhaustive.
- Anticiper : "et les permissions par projet ?" : se passe au niveau Resource de la policy (URN avec le projectId), et au niveau Keystone role. Slide 4 rappel.
-->

---
layout: default
moduleId: "2.5"
slideId: "S07 -- Application credentials"
los: ["LO-SEC-K04", "LO-SEC-A02"]
---

# Application credentials &mdash; the credential pattern for automation

<div class="grid grid-cols-2 gap-6 mt-6 text-sm">

<div class="ovh-callout ovh-callout-warn">
<strong>Personal credentials in a cron job &middot; antipattern</strong>
<div class="mt-2">
&middot; <code>openrc.sh</code> with the operator's username + password<br/>
&middot; Operator leaves the company &rarr; backup chain breaks<br/>
&middot; Credential rotation breaks the cron<br/>
&middot; Personal credentials see far more than the cron needs<br/>
&middot; <strong>Lifecycle of a human bleeds into automation.</strong>
</div>
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Application credentials &middot; the right tool</strong>
<div class="mt-2">
&middot; Issued by Keystone, scoped to <strong>one project</strong><br/>
&middot; Attached to <strong>one role</strong> (<code>member</code> recommended)<br/>
&middot; Optional expiry &rarr; rotation discipline<br/>
&middot; <strong>Decoupled from any human's lifecycle</strong><br/>
&middot; Two parts : <strong>ID</strong> (public-ish) + <strong>secret</strong> (sensitive)
</div>
</div>

</div>

<div class="ovh-callout ovh-callout-warn mt-4 text-sm">
  <strong>The reflex <code>A02</code> : any non-interactive workload uses an application credential.</strong> No exceptions. Cron jobs, Terraform, CI/CD, observability agents, backup scripts.
</div>

<!--
Trainer notes S07 Application credentials:
- Slide haute-leverage. C'est le reflex A02 qu'on veut ancrer.
- AWS cross-ref : esprit similaire aux STS short-lived credentials d'une EC2 instance role. But identique, mecanisme different.
- Anticiper : "et l'expiry, je mets combien ?" : matcher la cadence de rotation du consumer. 90 jours est un default raisonnable. 24h pour un demo.
- Le flag --unrestricted : permet de creer d'autres app credentials. Default est restricted. Ne pas activer --unrestricted sauf cas tres specifique (slide FAQ).
- Montrer le path Horizon en demo : Identity -> Application Credentials -> Create.
- Pour Digital Starter : "meme seul, vous separez ce qui tape dans la Manager (votre identite) de ce que vos scripts utilisent (l'app credential). Sinon vous rotatez tout en panique le jour ou vous changez de mot de passe."
-->

---
layout: default
moduleId: "2.5"
slideId: "S08 -- Secret Manager"
los: ["LO-SEC-K05"]
---

# Secret Manager &mdash; where credentials and secrets actually live

<div class="flex justify-center mt-2">

```mermaid {scale: 0.55}
%%{init: {'flowchart': {'nodeSpacing': 22, 'rankSpacing': 28}}}%%
flowchart LR
    DEV[Developer<br/>writes secret]:::src
    TF[Terraform<br/>pushes secret]:::src
    CI[CI pipeline<br/>rotates secret]:::src
    VAULT[Secret Manager<br/>encrypted at rest]:::vault
    INST[Instance<br/>fetches at boot]:::cons
    DB[Managed DB<br/>initial password]:::cons
    APP[Runtime app<br/>fetches on demand]:::cons

    DEV --> VAULT
    TF --> VAULT
    CI --> VAULT
    VAULT --> INST
    VAULT --> DB
    VAULT --> APP

    classDef src fill:#DCEAFD,stroke:#000E9C,color:#000E9C
    classDef vault fill:#000E9C,stroke:#000E9C,color:#FFFFFF
    classDef cons fill:#F2F2F2,stroke:#000E9C,color:#000E9C
```

</div>

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">

<div class="ovh-callout">
<strong>What it is</strong><br/>
A managed secret store. Secrets are written, read, and rotated through the OVHcloud API. Access controlled via OVHcloud IAM &mdash; <strong>same policy mechanic</strong> as any other OVHcloud resource.
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Typical pattern</strong><br/>
Store once. Configure the consumer to <strong>fetch at boot</strong> or on demand via the OVHcloud API using an application credential. Rotation = write a new version, consumer fetches latest at next refresh.
</div>

</div>

<div class="ovh-callout ovh-callout-warn mt-4 text-sm">
  <strong>Principle</strong>&nbsp;: if your config file contains a password, your config file is a secret. <strong>Externalize.</strong> AWS analogy = AWS Secrets Manager. Same pattern.
</div>

<!--
Trainer notes S08 Secret Manager:
- Insister sur le principe : un fichier de config avec un password = un secret. Pas autorise dans un repo, pas autorise dans une VM image.
- Anti-pattern a souligner : hardcoder un password dans un fichier Terraform state. Le state n'est pas chiffre at rest par defaut, c'est un audit fail.
- Anticiper : "latence d'un fetch Secret Manager ?" : sub-seconde en same-region. Usage typique = read-once-at-boot, pas read-on-every-request.
- Secret Manager est un produit relativement jeune sur OVHcloud. La parite avec AWS Secrets Manager evolue. Renvoyer vers docs.ovhcloud.com pour les specifics.
- Pour Digital Starter : "meme si vous n'avez qu'une instance, mettre le password en Secret Manager vous evite de le commiter par accident le jour ou vous publiez votre Terraform sur GitHub."
-->

---
layout: default
moduleId: "2.5"
slideId: "S09 -- KMS awareness"
los: ["LO-SEC-K06"]
---

# KMS &mdash; what the Associate level needs to know

<div class="text-sm mt-4">

<table style="width:100%; border-collapse: collapse;">
<thead>
<tr style="background: var(--ovh-masterbrand-blue); color: white;">
<th style="padding: 6px 8px; text-align: left;">Pattern</th>
<th style="padding: 6px 8px; text-align: left;">Who controls the key</th>
<th style="padding: 6px 8px; text-align: left;">Where you see it today on Core</th>
</tr>
</thead>
<tbody>
<tr style="background: #F2F2F2;">
<td style="padding: 6px 8px;"><strong>Service-Managed Keys</strong></td>
<td style="padding: 6px 8px;">OVHcloud generates, stores, rotates &mdash; transparent to the customer</td>
<td style="padding: 6px 8px;">Object Storage at rest &middot; Block Storage &middot; Secret Manager (default)</td>
</tr>
<tr>
<td style="padding: 6px 8px;"><strong>Customer-Managed Keys</strong></td>
<td style="padding: 6px 8px;">Customer creates the key in OVHcloud KMS, grants the service the right to use it, can revoke</td>
<td style="padding: 6px 8px;">Selected services, list evolving &mdash; check <code>docs.ovhcloud.com</code></td>
</tr>
<tr style="background: #F2F2F2;">
<td style="padding: 6px 8px;"><strong>No key visible</strong></td>
<td style="padding: 6px 8px;">Encrypted at rest, key never exposed</td>
<td style="padding: 6px 8px;">Some platform-internal stores</td>
</tr>
</tbody>
</table>

</div>

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">

<div class="ovh-callout">
<strong>At the Associate scope</strong><br/>
Awareness, not skill. Know that <strong>who controls the key</strong> matters more than how the cryptography works. AWS analogy = AWS KMS with customer-managed CMKs.
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Audit-friendly pattern</strong><br/>
Customer-managed keys for compliance workloads (when available on the service). Service-managed for everything else.
</div>

</div>

<!--
Trainer notes S09 KMS awareness:
- Honnete avec la salle : ce slide est awareness, pas skill. Pas de lab KMS, pas de QCM lourd.
- L'integration customer-managed-keys est en cours de deploiement service par service. Ne pas memoriser une liste, elle sera obsolete avant l'examen.
- Anticiper le profil regulated-industry : "HSM-backed keys ?" : existe sur Hosted Private Cloud et certains Bare Metal, hors scope Public Cloud Core Associate.
- AWS cross-ref : AWS KMS avec customer-managed CMKs. Meme split de responsabilite, meme primitives d'audit.
- Renvoi explicite vers docs.ovhcloud.com pour les details. La calibration honnete est mieux recue qu'une fausse autorite.
-->

---
layout: default
moduleId: "2.5"
slideId: "S10 -- The audit reflex"
los: ["LO-SEC-S05", "LO-SEC-A01"]
---

# The audit reflex &mdash; five catalogs to cross-check

<div class="flex justify-center mt-2">

```mermaid {scale: 0.6}
%%{init: {'flowchart': {'nodeSpacing': 22, 'rankSpacing': 80}}}%%
flowchart BR
    AUDIT((Audit<br/>monthly)):::audit
    C1[IAM users<br/>and groups]:::cat
    C2[IAM policy<br/>attachments]:::cat
    C3[OpenStack<br/>role assignments]:::cat
    C4[Application<br/>credentials]:::cat
    C5[Secret Manager<br/>entries]:::cat
    AUDIT --- C1
    AUDIT --- C2
    AUDIT --- C3
    AUDIT --- C4
    AUDIT --- C5

    classDef audit fill:#000E9C,stroke:#000E9C,color:#FFFFFF
    classDef cat fill:#DCEAFD,stroke:#000E9C,color:#000E9C
```

</div>

<div class="grid grid-cols-2 gap-4 mt-4 text-sm">

<div class="ovh-callout">
<strong>What each catalog tells you</strong><br/>
&middot; <strong>IAM users &amp; groups</strong> &mdash; who exists, who belongs where<br/>
&middot; <strong>Policy attachments</strong> &mdash; the authorization rules in effect<br/>
&middot; <strong>OpenStack roles</strong> &mdash; <code>openstack role assignment list --project &lt;name&gt; --names</code><br/>
&middot; <strong>App credentials</strong> &mdash; <code>openstack application credential list</code><br/>
&middot; <strong>Secret Manager</strong> &mdash; secrets, ages, references
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">The reflex itself</strong><br/>
Walk the five catalogs <strong>monthly</strong>. For each entry, ask : <em>is this still justified ?</em> Anything not justified &rarr; revoke. <strong>The goal is not zero findings &mdash; the goal is to know where findings are.</strong>
</div>

</div>

<!--
Trainer notes S10 The audit reflex:
- Slide qui ancre A01 (segmentation) et S05 (audit). Les deux reviennent au lab.
- Cadrer pragmatiquement : "le but n'est pas zero findings, le but est de savoir ou sont les findings." Les operations matures ont toujours des findings : la difference est qu'ils sont connus.
- Pour Digital Starter solo : "meme seul, faites cet audit une fois par trimestre. Les credentials orphelins sont le footing #1 des incidents en self-service."
- Demander : "lequel des 5 catalogues va trahir un developer parti depuis 6 mois ?" : reponse : tous les 5 potentiellement. C'est pourquoi on les croise.
- Anticiper : "comment automatiser cet audit ?" : a la main au niveau Associate. Industrialisation = sujet Module 3.2 Operations + IaC Module 3.1.
-->

---
layout: default
moduleId: "2.5"
slideId: "S11 -- Corporate IAM segmentation"
los: ["LO-SEC-A01"]
---

# Corporate IAM segmentation &mdash; a defensible template

<div class="text-xs mt-2">

<table style="width:100%; border-collapse: collapse;">
<thead>
<tr style="background: var(--ovh-masterbrand-blue); color: white;">
<th style="padding: 5px 7px; text-align: left;">Persona</th>
<th style="padding: 5px 7px; text-align: left;">IAM group</th>
<th style="padding: 5px 7px; text-align: left;">IAM policy attached</th>
<th style="padding: 5px 7px; text-align: left;">Role on production</th>
<th style="padding: 5px 7px; text-align: left;">Role on dev</th>
</tr>
</thead>
<tbody>
<tr style="background: #F2F2F2;">
<td style="padding: 5px 7px;"><strong>Cloud Admin</strong></td>
<td style="padding: 5px 7px;"><code>admins</code></td>
<td style="padding: 5px 7px;"><code>Administrator</code></td>
<td style="padding: 5px 7px;"><code>administrator</code> (2 pax max)</td>
<td style="padding: 5px 7px;"><code>administrator</code></td>
</tr>
<tr>
<td style="padding: 5px 7px;"><strong>Developer</strong></td>
<td style="padding: 5px 7px;"><code>developers</code></td>
<td style="padding: 5px 7px;"><code>Public Cloud Operator</code></td>
<td style="padding: 5px 7px;"><code>reader</code></td>
<td style="padding: 5px 7px;"><code>member</code></td>
</tr>
<tr style="background: #F2F2F2;">
<td style="padding: 5px 7px;"><strong>SRE on-call</strong></td>
<td style="padding: 5px 7px;"><code>sre</code></td>
<td style="padding: 5px 7px;"><code>Public Cloud Operator</code></td>
<td style="padding: 5px 7px;"><code>member</code></td>
<td style="padding: 5px 7px;"><code>member</code></td>
</tr>
<tr>
<td style="padding: 5px 7px;"><strong>Auditor</strong> (annual)</td>
<td style="padding: 5px 7px;"><code>auditors</code></td>
<td style="padding: 5px 7px;"><code>Public Cloud Read-only</code></td>
<td style="padding: 5px 7px;"><code>reader</code></td>
<td style="padding: 5px 7px;"><code>reader</code></td>
</tr>
<tr style="background: #F2F2F2;">
<td style="padding: 5px 7px;"><strong>Billing</strong></td>
<td style="padding: 5px 7px;"><code>billing</code></td>
<td style="padding: 5px 7px;"><code>Billing Read-only</code></td>
<td style="padding: 5px 7px;">&mdash;</td>
<td style="padding: 5px 7px;">&mdash;</td>
</tr>
</tbody>
</table>

</div>

<div class="ovh-callout mt-4 text-sm" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
  <strong style="color: var(--ovh-masterbrand-blue);">Principle</strong>&nbsp;: map to <strong>how the company actually works</strong>, not to OVHcloud-specific abstractions. Write the mapping once, link it from the team onboarding doc. This is the deliverable you defend to the auditor.
</div>

<!--
Trainer notes S11 Corporate IAM segmentation:
- Slide qui ancre A01. Laisser respirer 1 min.
- Anticiper Corporate : "on a un AD avec SSO, on peut le brancher ?" : oui, IAM supporte SAML. Le groupe AD devient la source du groupe IAM via federation.
- Pour Digital Starter (rarement 4 personas) : "le principe scope-by-role-not-by-person tient meme a 1 operator. Un groupe me-as-operator, un groupe me-as-billing, attaches a la meme identite. On desactive l'un quand on change de contexte."
- L'auditeur annuel est l'exemple typique de IAM lifecycle : creer pour la mission, deactiver a la fin. Une regle simple : la date de fin dans le nom du user (auditor-2026-Q4).
- Eviter d'entrer dans les nuances par-environnement. Si la salle pousse : "production = read seulement pour les devs, member pour le SRE on-call, c'est la regle de base."
-->

---
layout: section
block: "Block 3"
duration: "15 min"
---

# Trainer demonstration
### Production-shape identity overlay on the Northwind project

---
layout: default
moduleId: "2.5"
slideId: "Demo -- Overview"
los: ["LO-SEC-S01", "LO-SEC-S02", "LO-SEC-S03", "LO-SEC-S04", "LO-SEC-S05"]
---

# Demo &mdash; the four moves, on the running Northwind project

<div class="grid grid-cols-2 gap-6 mt-6">

<div class="ovh-callout">
<strong>What you will see</strong>
<div class="mt-2 text-sm">
&middot; Create an IAM user <code>demo-developer</code><br/>
&middot; Create a group <code>demo-devs</code> with a trimmed <code>Public Cloud Operator</code> policy<br/>
&middot; Validate in a private browser : the user sees but cannot delete the project<br/>
&middot; Generate an OpenStack application credential, role <code>member</code>, 24h expiry, restricted<br/>
&middot; Confirm the credential works and is properly scoped<br/>
&middot; Create a Secret Manager entry, fetch it from <code>demo-api-01</code><br/>
&middot; 60-second audit across the five catalogs &rarr; surface a planted over-privilege
</div>
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Why this matters</strong>
<div class="mt-2 text-sm">
At the end of the demo, you've seen the four moves in action on a real project. Channels : <strong>Manager UI</strong> for IAM and Secret Manager, <strong>Horizon</strong> for the application credential, <strong>OpenStack CLI</strong> for verification and audit, <strong>SSH</strong> for the in-instance fetch.
</div>
</div>

</div>

<div class="mt-6 text-center" style="color: var(--ovh-masterbrand-blue); font-weight: 600;">
  Starting from : Northwind demo project &middot; Trainer = admin on the org &middot; Mod 2.4 state still in place
</div>

<div class="mt-2 text-center text-sm" style="color: var(--ovh-gray-700);">
  12 steps &middot; ~12 min walkthrough &middot; 3 min Q&amp;A
</div>

<!--
Trainer notes Demo Production-shape identity:

PRE-FLIGHT (do BEFORE the block):
- Two browsers open : one trainer (admin), one private window (will sign in as demo-developer at step 4).
- Demo Northwind project still in place with the Mod 2.4 output state.
- Pre-plant the over-privilege : the trainer's own account has administrator on the demo project. Slide 10 audit will surface it.
- One orphan IAM user created earlier (no group, no policy) for the audit step.
- fetch-secret.sh deployed on demo-api-01 at /usr/local/bin/ (one-liner from the lab handout).
- Terminal at 16pt+, dark background.

DEMO SCRIPT (12 steps, ~12 min):
1. Manager UI -> Identity and Access -> Users -> Add user demo-developer, temporary password. "MFA enforced au niveau org, ils auront a setup a la premiere connexion."
2. Identity -> Policies -> Public Cloud Operator -> Duplicate -> rename demo-developer-policy -> trim publicCloud:projects:delete. "Duplicate-and-trim. Le deny sur project deletion est le guardrail standard pour les devs."
3. Identity -> Groups -> Add group demo-devs -> attach demo-developer-policy -> add demo-developer to the group. "Les groups owns les policies. Les users join les groups. Pattern maintenable."
4. Open private browser window, sign in as demo-developer, navigate to Public Cloud -> demo project. "Le projet est visible. Try to delete -> bloque. Try to view billing -> bloque. Two minutes de validation epargnent un audit finding."
5. Horizon UI (trainer browser) -> demo project -> Identity -> Application Credentials -> Create demo-backup-cred, role member, 24h expiry, unrestricted OFF. "Lire le secret maintenant, il ne reviendra pas. Restricted est le default safe."
6. Source l'app credential openrc.sh dans un terminal frais, openstack server list. "App credential marche, scope member."
7. Tenter openstack image create --public test.img. 403 Forbidden, admin required. "Scope restreint confirme. Si notre script tente ca, il echoue fast. C'est ce qu'on veut."
8. Manager UI -> Secret Manager -> Add secret demo-postgres-password avec valeur sample. "Stocke chiffre at rest. On grant l'acces a l'identite consommatrice."
9. SSH demo-api-01, fetch-secret.sh demo-postgres-password. Valeur retournee sur stdout (demo only, jamais loggee en prod). "Au lab vous le piperez dans le service environment via systemd ExecStartPre."
10. Trainer terminal : openstack role assignment list --project demo --names. "Cinq lignes. Mon compte trainer a administrator -> devrait etre member. Audit finding #1 en 5 secondes."
11. Manager UI -> Identity -> filtre users not in any group. Un orphan apparait (planted). "Audit finding #2 : orphan user, soit on supprime, soit on assigne a un group."
12. openstack application credential list. Trois credentials listes, un avec expiry dans le passe. "Audit finding #3 : credential expire encore liste. Cleanup."

FAILURE MODES:
- Step 4 sign-in fail : propagation IAM, jusqu'a 30s. Refresh le private window apres une pause.
- Step 6 openstack server list fail : ligne OS_AUTH_TYPE=v3applicationcredential manquante dans l'openrc.sh. Le download Horizon l'inclut, les edits manuels la perdent souvent.
- Step 9 fetch-secret.sh 403 : l'app credential n'a pas la policy read sur le secret. Le lab handout walk-through l'explique ; ici si ca arrive, le presenter comme un audit reflex en direct.
- Step 10 openstack role assignment list retourne rien : ajouter --project-domain default. Sur OVHcloud le domain est default mais le CLI le demande parfois selon la version.

Q&A (3 min) : focus sur la difference IAM vs Keystone et le concept d'application credential. Parking pour le lab : everything else.
-->

---
layout: section
block: "Block 4"
duration: "30 min"
---

# Separate identities, scope credentials, externalize secrets
### Your turn. Solo. 30 minutes.

---
layout: default
moduleId: "2.5"
slideId: "Lab -- Brief"
los: ["LO-SEC-S01", "LO-SEC-S02", "LO-SEC-S03", "LO-SEC-S04", "LO-SEC-S05"]
---

# Lab &mdash; Production-shape Northwind identity

<div class="ovh-callout mt-4">
You are Northwind's Cloud Ops engineer. The CTO walks back in : <em>"The PostgreSQL password is in a config file. The backup script uses your personal openrc. Everyone in the project is admin. The auditor arrives in three weeks. Fix it."</em> Today you : (1) create a developer IAM identity scoped via a group, (2) generate a backup application credential decoupled from your personal credentials, (3) externalize the PostgreSQL password and the S3 backup secret to Secret Manager, (4) run a five-catalog audit and resolve at least one finding.
</div>

<div class="grid grid-cols-2 gap-4 mt-6">

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Channels</strong>
<div class="mt-2 text-sm">
&middot; <strong>Manager UI</strong> for IAM users / groups / policies and Secret Manager<br/>
&middot; <strong>Horizon UI</strong> for the application credential generation<br/>
&middot; <code>openstack</code> CLI for verification and audit<br/>
&middot; <strong>SSH</strong> for in-instance secret fetch wiring<br/>
&middot; No Terraform today &mdash; IaC integration is Module 3.1
</div>
</div>

<div class="ovh-callout" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Success criteria</strong>
<div class="mt-2 text-sm">
New IAM user can list but not delete the project &middot; <code>backup-pg.sh</code> runs with the app credential &middot; <code>grep postgres_password /etc/northwind-api/config.yaml</code> returns nothing &middot; the API still responds 200 on <code>/health</code> &middot; audit notes commit at least one resolved finding
</div>
</div>

</div>

<div class="mt-6 text-center" style="color: var(--ovh-masterbrand-blue); font-weight: 600;">
  Identity : <code>&lt;initials&gt;-northwind-developer</code> &middot; Group : <code>&lt;initials&gt;-northwind-devs</code> &middot; App credential expiry : <strong>90 days</strong> &middot; Time : 30 min
</div>

<!--
Trainer notes Lab Brief:
- Souligner les criteres de succes auto-verifiables : l'apprenant sait s'il a reussi sans demander.
- Lab tres dense pour 30 min : 6 etapes, plusieurs sous-etapes. Surveiller le timing. Si plus de la moitie de la salle est en retard a 20 min, declarer l'etape 5 (S3 secret) optionnelle et la garder en homework.
- Verifier que tous les learners ont admin sur leur org OVHcloud. Si pas le cas, basculer sur le compte demo prepare AVANT le demarrage du lab.
- Annoncer oralement la commande grep finale qui valide l'externalisation du password. Sinon les learners ne savent pas comment auto-valider.

VALIDATION CRITERIA (silent check by trainer):
- Manager UI : <initials>-northwind-developer existe, dans le group <initials>-northwind-devs, policy attachee au group
- Sign-in en private window comme cet user : projet visible, delete bouton absent, billing non accessible
- ssh nw-db-01 : grep -v personal /etc/northwind/backup-openrc.sh confirme app credential
- backup-pg.sh manuel : nouveau objet dans <initials>-nw-backups (openstack object list ... | tail -5)
- ssh nw-api-01 : grep postgres_password /etc/northwind-api/config.yaml retourne nothing
- curl http://localhost:8080/health sur nw-api-01 retourne 200
- <initials>-nw-audit-2.5.md present dans le lab repo avec au moins un finding before/after
-->

---
layout: default
moduleId: "2.5"
slideId: "Lab -- Steps 1/3"
---

# Lab &mdash; Step-by-step (1/3)
### IAM user + group + scoped policy &middot; Manager UI

<div class="text-xs mt-1">

<strong>1.</strong> Manager UI &rarr; Identity and Access &rarr; Users &rarr; Add user<br/>
&nbsp;&nbsp;Login : <code>&lt;initials&gt;-northwind-developer</code>, temporary password<br/>
<strong>2.</strong> Identity &rarr; Groups &rarr; Add group <code>&lt;initials&gt;-northwind-devs</code><br/>
<strong>3.</strong> Identity &rarr; Policies &rarr; Public Cloud Operator &rarr; Duplicate<br/>
&nbsp;&nbsp;Rename : <code>&lt;initials&gt;-northwind-dev-policy</code><br/>
&nbsp;&nbsp;Trim : remove the action <code>publicCloud:projects:delete</code><br/>
<strong>4.</strong> Attach the custom policy to the <code>&lt;initials&gt;-northwind-devs</code> group<br/>
<strong>5.</strong> Add <code>&lt;initials&gt;-northwind-developer</code> to the group<br/>
<strong>6.</strong> Open a <strong>private browser window</strong>, sign in as <code>&lt;initials&gt;-northwind-developer</code><br/>
&nbsp;&nbsp;Confirm : Northwind project visible, resources listed<br/>
&nbsp;&nbsp;Confirm : <strong>no Delete button</strong> on the project, billing not accessible<br/>
&nbsp;&nbsp;Close the private window and return to your admin session

</div>

<!--
Trainer notes Lab Steps 1/3:
- Slide de reference pour la premiere phase. Laisser projete jusqu'a l'etape 6.
- Insister sur le private window : sans ca, le test fait via le meme browser hesite (cache, cookies). Vrai private window obligatoire.
- A l'etape 3, si la salle veut comprendre la liste exacte des actions dans publicCloud:projects:*, ouvrir le picker au tableau. Sinon ne pas s'attarder.
- A l'etape 6, attention propagation IAM peut prendre 30s. Si sign-in echoue immediatement, attendre puis retry.
- Passer a la slide 2/3 quand la majorite a fini l'etape 6, ou apres 10 min.
-->

---
layout: default
moduleId: "2.5"
slideId: "Lab -- Steps 2/3"
---

# Lab &mdash; Step-by-step (2/3)
### Application credential + secret externalization

<div class="text-xs mt-1">

<strong>7.</strong> Horizon UI &rarr; Identity &rarr; Application Credentials &rarr; Create<br/>
&nbsp;&nbsp;Name : <code>&lt;initials&gt;-nw-backup-cred</code>, role <code>member</code>, expiry <strong>90 days</strong>, unrestricted <strong>OFF</strong><br/>
&nbsp;&nbsp;Download the <code>openrc.sh</code>, save as <code>~/.openrc/&lt;initials&gt;-nw-backup.sh</code><br/>
<strong>8.</strong> Source the new <code>openrc.sh</code> in a fresh terminal, run <code>openstack server list</code> &mdash; verify it works<br/>
<strong>9.</strong> SSH <code>&lt;initials&gt;-nw-db-01</code> (via jump host through the web tier)<br/>
&nbsp;&nbsp;Replace <code>/etc/northwind/backup-openrc.sh</code> with the content of the new app credential <code>openrc.sh</code><br/>
&nbsp;&nbsp;Run <code>sudo /usr/local/bin/backup-pg.sh</code> manually &mdash; confirm a new object lands in <code>&lt;initials&gt;-nw-backups</code><br/>
<strong>10.</strong> Manager UI &rarr; Secret Manager &rarr; Add secret <code>&lt;initials&gt;-nw-pg-password</code><br/>
&nbsp;&nbsp;Value : copy from <code>/etc/northwind-api/config.yaml</code> on <code>&lt;initials&gt;-nw-api-01</code><br/>
<strong>11.</strong> SSH <code>&lt;initials&gt;-nw-api-01</code>. Edit <code>/etc/systemd/system/northwind-api.service</code> :<br/>
&nbsp;&nbsp;Add <code>ExecStartPre=/usr/local/bin/fetch-secret.sh &lt;initials&gt;-nw-pg-password POSTGRES_PASSWORD</code><br/>
&nbsp;&nbsp;Remove the <code>postgres_password:</code> line from <code>config.yaml</code><br/>
&nbsp;&nbsp;<code>sudo systemctl daemon-reload && sudo systemctl restart northwind-api</code><br/>
&nbsp;&nbsp;Confirm : <code>curl http://localhost:8080/health</code> returns 200

</div>

<!--
Trainer notes Lab Steps 2/3:
- A l'etape 7, insister sur "unrestricted OFF". C'est facile a louper et c'est exactement le scope qu'on veut.
- A l'etape 9, beaucoup de learners vont essayer SSH direct sur nw-db-01 qui n'a plus de public IP. Jump host obligatoire. Si pas evident, expliquer au tableau.
- A l'etape 10, le copy-paste du password de config.yaml dans Secret Manager doit etre fait dans la Manager UI (pas dans un terminal). Pas de password en clair dans le shell history.
- A l'etape 11, ExecStartPre est le mecanisme cle : fetch-secret.sh ecrit POSTGRES_PASSWORD dans /run/northwind-api/env qui est ensuite source par EnvironmentFile dans le service. Le password ne touche jamais le disque persistent.
- Passer a la slide 3/3 quand la majorite a fini l'etape 11, ou apres 10 min de plus.
-->

---
layout: default
moduleId: "2.5"
slideId: "Lab -- Steps 3/3"
---

# Lab &mdash; Step-by-step (3/3)
### S3 secret + five-catalog audit

<div class="text-xs mt-1">

<strong>12.</strong> Same pattern as steps 10-11, on <code>&lt;initials&gt;-nw-db-01</code>, for the S3 secret key<br/>
&nbsp;&nbsp;Secret name : <code>&lt;initials&gt;-nw-s3-secret</code><br/>
&nbsp;&nbsp;Modify <code>backup-pg.sh</code> to source the S3 secret via <code>fetch-secret.sh</code> instead of the openrc file<br/>
&nbsp;&nbsp;Run the backup once more to confirm<br/>
<strong>13.</strong> Audit checklist &mdash; commit findings to <code>labs/2-5/&lt;initials&gt;-nw-audit-2.5.md</code> :<br/>
&nbsp;&nbsp;a. <code>openstack role assignment list --project northwind --names</code> &rarr; flag any unjustified <code>administrator</code><br/>
&nbsp;&nbsp;b. Manager &rarr; Identity &rarr; Users, filter <em>not in any group</em> &rarr; flag orphans<br/>
&nbsp;&nbsp;c. <code>openstack application credential list</code> &rarr; flag credentials &gt;60 days or with no expiry<br/>
&nbsp;&nbsp;d. Manager &rarr; Secret Manager &rarr; for each secret <code>grep -r &lt;name&gt; .</code> &rarr; flag unused secrets<br/>
&nbsp;&nbsp;e. <em>(Optional)</em> Rotate one secret : write v2, restart consumer, confirm new value picked up<br/>
<strong>14.</strong> Hand off : share <code>&lt;initials&gt;-northwind-developer</code> username + screenshot of the private-browser session to the trainer

</div>

<!--
Trainer notes Lab Steps 3/3:
- L'etape 12 reproduit le pattern de 10-11. Si la salle est en retard, la declarer optionnelle et la garder en homework. Le pattern Secret Manager est ancre.
- L'etape 13 est l'audit reflex. Insister : chaque finding doit etre LOG (before-after) dans le markdown. Un finding non documente = pas de finding.
- A l'etape 13c, la regle ">60 days" est arbitraire mais raisonnable. La vraie regle est "tout credential avec no expiry est suspect" : si c'est encore necessaire, le re-creer avec une expiry explicite.
- A l'etape 13d, le grep peut etre fastidieux. Si le repo est gros, suggere d'utiliser ripgrep (rg <name>) qui est plus rapide.
- L'etape 14 est la validation par le trainer. C'est aussi un exercice pour les learners de demontrer leur travail.
- Annoncer la fin de lab a 5 min avant le timer pour que les learners aient le temps de commiter leurs findings.
-->

---
layout: section
block: "Block 5"
duration: "5 min"
---

# Micro-check
### 8 formative questions, no points

---
layout: default
moduleId: "2.5"
slideId: "MC -- Q1 IAM vs Keystone"
los: ["LO-SEC-K01"]
---

# Q1 &mdash; A user sees the project but it appears empty

An operator signs in to the OVHcloud Manager and sees the Northwind Public Cloud project listed. When they click into it, they cannot see the instances, networks, or volumes. <strong>Most likely cause ?</strong>

<div class="grid grid-cols-1 gap-3 mt-6">

<div class="ovh-callout"><strong>A.</strong> The Northwind project has been deleted</div>
<div class="ovh-callout"><strong>B.</strong> The user has an OVHcloud IAM grant on the project but no OpenStack role on it</div>
<div class="ovh-callout"><strong>C.</strong> The user's MFA token expired and the OpenStack API silently downgraded their access</div>
<div class="ovh-callout"><strong>D.</strong> The Northwind project is in a different OVHcloud region than the user's account</div>

</div>

<!--
Trainer notes Q1:
- Correct answer: B. Gate 1 IAM passe (le projet est visible), Gate 2 Keystone bloque (pas de role) -> projet "vide" cote OpenStack.
- A wrong : un projet supprime n'apparait pas du tout dans la Manager.
- C wrong : expiration MFA declenche une re-authentification, pas un acces partiel silencieux.
- D wrong : les projets Public Cloud ne sont pas region-specifiques au niveau IAM.
- LO: LO-SEC-K01. Bloom: Understand.
- Question PIVOT : si rate, le learner ira chercher dans la mauvaise couche pendant des heures. Renvoyer slide 4.
-->

---
layout: default
moduleId: "2.5"
slideId: "MC -- Q2 policy structure"
los: ["LO-SEC-K02"]
---

# Q2 &mdash; Ingredients of an IAM policy rule

Which four ingredients fully describe a rule in an OVHcloud IAM policy ?

<div class="grid grid-cols-1 gap-3 mt-6">

<div class="ovh-callout"><strong>A.</strong> Subject, Resource, Action, Condition</div>
<div class="ovh-callout"><strong>B.</strong> User, Role, Service, Expiry</div>
<div class="ovh-callout"><strong>C.</strong> Group, Project, Permission, Region</div>
<div class="ovh-callout"><strong>D.</strong> Identity, Endpoint, Method, MFA</div>

</div>

<!--
Trainer notes Q2:
- Correct answer: A. Subject (qui) - Resource (sur quoi) - Action (quoi) - Condition (quand).
- B wrong : confond le grammar policy avec le trio user-role-credential. Expiry est une propriete des credentials, pas des rules.
- C wrong : ressemble a un modele RBAC, pas a l'IAM policy OVHcloud.
- D wrong : MFA est une valeur possible de Condition, pas un ingredient.
- LO: LO-SEC-K02. Bloom: Remember.
- Question de memoire pure. Si rate, retour slide 5.
-->

---
layout: default
moduleId: "2.5"
slideId: "MC -- Q3 OpenStack roles"
los: ["LO-SEC-K03"]
---

# Q3 &mdash; The three standard OpenStack roles

Which three roles are available out of the box on every OVHcloud Public Cloud project ?

<div class="grid grid-cols-1 gap-3 mt-6">

<div class="ovh-callout"><strong>A.</strong> <code>owner</code>, <code>operator</code>, <code>viewer</code></div>
<div class="ovh-callout"><strong>B.</strong> <code>root</code>, <code>developer</code>, <code>guest</code></div>
<div class="ovh-callout"><strong>C.</strong> <code>administrator</code>, <code>member</code>, <code>reader</code></div>
<div class="ovh-callout"><strong>D.</strong> <code>superuser</code>, <code>power_user</code>, <code>read_only</code></div>

</div>

<!--
Trainer notes Q3:
- Correct answer: C. Trio standard OpenStack stable sur toutes les regions.
- A wrong : ressemble a Azure RBAC, pas a OpenStack.
- B wrong : nommage invente.
- D wrong : nommage invente.
- LO: LO-SEC-K03. Bloom: Remember.
- Question de memoire pure. Trio a retenir par coeur, c'est dans toutes les commandes openstack role assignment list.
-->

---
layout: default
moduleId: "2.5"
slideId: "MC -- Q4 app credential pattern"
los: ["LO-SEC-K04", "LO-SEC-S03"]
---

# Q4 &mdash; Backup job using a departed operator's credentials

A team's nightly backup currently uses an <code>openrc.sh</code> with the personal credentials of an operator who just left the company. <strong>Correct fix ?</strong>

<div class="grid grid-cols-1 gap-3 mt-6 text-sm">

<div class="ovh-callout"><strong>A.</strong> Keep the departed operator's credentials active and add a comment noting they should not be removed</div>
<div class="ovh-callout"><strong>B.</strong> Convert the operator's account into a "service account" by renaming it <code>backup-bot</code></div>
<div class="ovh-callout"><strong>C.</strong> Distribute the operator's password to the team and rotate it monthly</div>
<div class="ovh-callout"><strong>D.</strong> Generate an OpenStack application credential scoped to <code>member</code> with a defined expiry, and reconfigure the backup to source it</div>

</div>

<!--
Trainer notes Q4:
- Correct answer: D. C'est exactement le reflex A02 ancre au slide 7.
- A wrong : antipattern. Workflow auto attache a un cycle de vie humain.
- B wrong : renommer ne change pas le type de credential. Toujours rattache au compte humain.
- C wrong : password partages = audit fail. Toujours rattache a un cycle de vie humain.
- LO: LO-SEC-K04, LO-SEC-S03. Bloom: Apply.
- Question reflex. Si rate, le learner reproduira le bug en prod.
-->

---
layout: default
moduleId: "2.5"
slideId: "MC -- Q5 Secret Manager pattern"
los: ["LO-SEC-K05", "LO-SEC-S04"]
---

# Q5 &mdash; PostgreSQL password at boot

A Northwind API instance needs the PostgreSQL password at boot. Which approach respects the Secret Manager pattern at the Associate scope ?

<div class="grid grid-cols-1 gap-3 mt-6 text-sm">

<div class="ovh-callout"><strong>A.</strong> Hardcode the password in user-data and rely on user-data being root-readable only</div>
<div class="ovh-callout"><strong>B.</strong> Store the password in Secret Manager, fetch at boot via the OVHcloud API using an application credential, inject as env var</div>
<div class="ovh-callout"><strong>C.</strong> Commit the password in a <code>.env</code> file alongside the app code, protected by a <code>.gitignore</code> entry</div>
<div class="ovh-callout"><strong>D.</strong> Store the password in a Block Storage volume mounted only on the API instance</div>

</div>

<!--
Trainer notes Q5:
- Correct answer: B. Fetch-at-boot via app credential, injection env. C'est le pattern du lab.
- A wrong : user-data persiste dans les metadonnees instance, recuperable. Pas un secret store.
- C wrong : .gitignore empeche le commit mais pas la divulgation accidentelle. Les secrets ne vivent jamais dans un repo.
- D wrong : Block Storage n'est pas un secret store. Le volume peut etre detache et attache ailleurs.
- LO: LO-SEC-K05, LO-SEC-S04. Bloom: Apply.
- Question d'application directe du lab. Si rate, retour slide 8.
-->

---
layout: default
moduleId: "2.5"
slideId: "MC -- Q6 KMS scope"
los: ["LO-SEC-K06"]
---

# Q6 &mdash; KMS at the Associate scope

What is the correct characterization of a Key Management Service in the OVHcloud Public Cloud context at the Associate scope ?

<div class="grid grid-cols-1 gap-3 mt-6 text-sm">

<div class="ovh-callout"><strong>A.</strong> KMS governs the lifecycle of encryption keys; the dominant pattern on Core today is service-managed, with customer-managed-key integration available on a growing list of services</div>
<div class="ovh-callout"><strong>B.</strong> KMS is a Public Cloud project component installed by default in every project</div>
<div class="ovh-callout"><strong>C.</strong> KMS replaces Secret Manager &mdash; they are alternative implementations of the same feature</div>
<div class="ovh-callout"><strong>D.</strong> KMS is only relevant for Hosted Private Cloud and Bare Metal &mdash; not applicable on Public Cloud</div>

</div>

<!--
Trainer notes Q6:
- Correct answer: A. Calibration exacte du slide 9.
- B wrong : KMS est OVHcloud-wide, pas per-project.
- C wrong : Secret Manager stocke des secrets, KMS gere les cles qui peuvent chiffrer ces secrets. Deux jobs differents.
- D wrong : KMS est disponible sur Public Cloud. C'est la couverture par service qui s'etend encore.
- LO: LO-SEC-K06. Bloom: Understand.
- Question awareness. Si rate, repreciser le slide 9.
-->

---
layout: default
moduleId: "2.5"
slideId: "MC -- Q7 audit reflex"
los: ["LO-SEC-S05", "LO-SEC-A02"]
---

# Q7 &mdash; Audit findings to act on

An audit surfaces : (a) one orphan IAM user, (b) three app credentials &gt;1 year old with no expiry, (c) two operators with <code>administrator</code> on production who only need <code>member</code>, (d) one Secret Manager entry not referenced by any service. <strong>Best corrective set ?</strong>

<div class="grid grid-cols-1 gap-3 mt-6 text-xs">

<div class="ovh-callout"><strong>A.</strong> Leave (a) and (d) alone &mdash; no immediate harm. Only correct (b) and (c)</div>
<div class="ovh-callout"><strong>B.</strong> Convert all findings to a single ticket "review next quarter"</div>
<div class="ovh-callout"><strong>C.</strong> Delete the orphan, revoke and recreate the credentials with explicit expiries, downgrade the operators, delete the unused secret</div>
<div class="ovh-callout"><strong>D.</strong> Add a deny-all policy on top of each finding to neutralize them</div>

</div>

<!--
Trainer notes Q7:
- Correct answer: C. Application directe du principe least-privilege sur les 4 findings.
- A wrong : les identites et secrets pendants sont precisement ce qui mature en incident.
- B wrong : differer les findings d'identite sans remediation est l'antipattern que l'audit reflex cherche a empecher.
- D wrong : les deny-all policies n'enlevent pas les credentials orphelins ni les secrets non utilises. Complexite ajoutee sans resolution.
- LO: LO-SEC-S05, LO-SEC-A02. Bloom: Apply.
- Question integrative du module. C'est la question qui valide le reflex audit.
-->

---
layout: default
moduleId: "2.5"
slideId: "MC -- Q8 corporate segmentation"
los: ["LO-SEC-A01"]
---

# Q8 &mdash; Defensible IAM segmentation for a team of 8

A team : 1 cloud admin, 4 developers, 1 finance / billing, 1 external auditor (annual), 1 SRE on-call. <strong>Most defensible IAM segmentation ?</strong>

<div class="grid grid-cols-1 gap-3 mt-6 text-xs">

<div class="ovh-callout"><strong>A.</strong> One group <code>team</code> containing all 8 users, with <code>Public Cloud Operator</code> attached</div>
<div class="ovh-callout"><strong>B.</strong> Five groups (<code>admins</code>, <code>developers</code>, <code>sre</code>, <code>auditors</code>, <code>billing</code>) &mdash; each user in one group, predefined policies, OpenStack roles per project (devs <code>member</code> on dev / <code>reader</code> on prod, SRE <code>member</code> on prod, auditor <code>reader</code> everywhere)</div>
<div class="ovh-callout"><strong>C.</strong> Eight individual users with policies attached directly to each user</div>
<div class="ovh-callout"><strong>D.</strong> External auditor shares a <code>auditor</code> account with a password rotated annually</div>

</div>

<!--
Trainer notes Q8:
- Correct answer: B. Application directe du template slide 11.
- A wrong : ignore la differenciation de role. Donne write infra a l'auditeur et au finance.
- C wrong : policies attached to users = inmaintenable au-dela de 2 personnes. La lecon est groups own policies.
- D wrong : shared accounts violent l'audit trail per-identite. Auditeur = son propre user.
- LO: LO-SEC-A01. Bloom: Analyze.
- Question integrative attitudinale. C'est l'examen reduit du module sur A01. Si ratee, retour slide 11.
-->

---
layout: section
block: "Block 6"
duration: "5 min"
---

# Wrap-up
### Recap & transition to Module 3.1

---
layout: two-cols
moduleId: "2.5"
slideId: "Wrap-up -- Recap & next stop"
los: ["LO-SEC-K01", "LO-SEC-K02", "LO-SEC-K03", "LO-SEC-K04", "LO-SEC-K05", "LO-SEC-K06", "LO-SEC-S01", "LO-SEC-S02", "LO-SEC-S03", "LO-SEC-S04", "LO-SEC-S05", "LO-SEC-A01", "LO-SEC-A02"]
---

# Wrap-up

::left::

## You can now...

<div class="ovh-callout mt-4">
<div class="mt-1 text-xs">
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Distinguish</strong> OVHcloud IAM (account-wide) from OpenStack Keystone (project-scoped)<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Explain</strong> the four-ingredient IAM policy structure and deny-overrides-allow<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Identify</strong> the three OpenStack roles : <code>administrator</code>, <code>member</code>, <code>reader</code><br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Describe</strong> application credentials and pick them over personal credentials by reflex<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Identify</strong> Secret Manager as the right tool to externalize secrets<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Explain</strong> KMS at awareness level &mdash; who controls the key matters<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Create</strong> an IAM user, a group, attach a least-privilege policy, validate in a private window<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Generate</strong> and revoke OpenStack application credentials with scoped role and expiry<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Store</strong> a secret in Secret Manager and fetch it at boot from an instance<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Audit</strong> a project across the five catalogs and apply least-privilege<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Recommend</strong> an IAM segmentation aligned with corporate roles<br/>
&middot; <strong style="color: var(--ovh-masterbrand-blue);">Justify</strong> the application-credential-over-personal-credential reflex
</div>
</div>

::right::

## Next stop &mdash; Module 3.1

<div class="ovh-callout mt-4" style="border-left-color: var(--ovh-masterbrand-blue); border-left-width: 4px;">
<strong style="color: var(--ovh-masterbrand-blue);">Infrastructure as Code Essentials &mdash; CLI & Terraform</strong>
<div class="mt-3 text-xs">
Northwind's network is production-shape. Its identity is production-shape. <strong>But everything has been built by hand.</strong><br/><br/>
<em>"Projects, networks, instances, Security Groups, IAM users, policies, secrets &mdash; all through the Manager UI and ad-hoc CLI. If I delete this stack, I rebuild from memory."</em><br/><br/>
Module 3.1 introduces the <strong>OpenStack CLI</strong> as a first-class deployment tool and <strong>Terraform</strong> as the declarative engine. By the end of Day 3, deleting Northwind and rebuilding from <code>terraform apply</code> takes 10 minutes.
</div>
</div>

<div class="mt-6 text-center text-sm" style="color: var(--ovh-gray-700);">
Module 9 / 11 &middot; Identity, Access & Security &mdash; closing Day 2 &middot; Domain closed
</div>

<!--
Trainer notes Wrap-up:
- Rappeler que Day 2 est ferme. 9 modules sur 11 acquis. Day 3 demain : IaC + Operations + wrap-up + exam.
- Souligner : le reflex A02 (app credential over personal) est probablement la prise de conscience la plus utile du module au quotidien.
- Anticiper la fatigue : Day 2 fin d'apres-midi. Annoncer la pause de fin de journee.
- Si question parking non resolue (KMS detaille, SSO/SAML federation, IAM API REST endpoint) : noter "parking Pro+".
- Transition narrative : "Reseau OK. Identite OK. Mais tout fait main. C'est le sujet de Day 3 matin, Module 3.1."
- Eviter de demarrer 3.1 maintenant : laisser respirer, c'est demain.
-->
