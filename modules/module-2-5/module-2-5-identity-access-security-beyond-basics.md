# Module 2.5 — Identity, Access & Security — Beyond Basics
 
## Module Brief
 
- **Module ID**: 2.5
- **Total duration**: 1h30
- **Block breakdown**: Sentier battu 5 min · Theory 30 min · Demo 15 min · Lab 30 min · Micro-check 5 min · Wrap-up 5 min
- **Program**: OVHcloud — Public Cloud — Core Associate
- **Domain covered**: 06 — Identity, Access & Security
- **LOs covered** (13 total):
  - Knowledge: `LO-SEC-K01`, `LO-SEC-K02`, `LO-SEC-K03`, `LO-SEC-K04`, `LO-SEC-K05`, `LO-SEC-K06`
  - Skills: `LO-SEC-S01`, `LO-SEC-S02`, `LO-SEC-S03`, `LO-SEC-S04`, `LO-SEC-S05`
  - Attitudes: `LO-SEC-A01`, `LO-SEC-A02`
- **Prerequisite modules**: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4 (mandatory in sequence; standalone delivery requires the Northwind stack with the Module 2.4 output state — Gateway in place, Load Balancer fronting the web tier with HTTPS, API and DB private-only).
- **Red-thread step**: Northwind's network topology is production-shape (output of Module 2.4) but its identity and secret model is naive. The PostgreSQL password lives in the API config file in plaintext, the project's IAM is the default (everyone with project access can do everything), there is one shared SSH key for the whole team, and the nightly backup job to Object Storage uses the project owner's personal OpenStack credentials. Today the learner (1) **separates personal identities from machine identities** by creating two OVHcloud IAM users — `northwind-developer` and `northwind-auditor` — and one IAM group `northwind-devs` with a least-privilege policy that allows Public Cloud operations but blocks billing and project deletion; (2) **switches the nightly PostgreSQL backup job from personal credentials to an OpenStack application credential** scoped to Object Storage write only, so revoking the operator's account does not break the backup chain; (3) **stores the PostgreSQL password and the S3 access secret in Secret Manager**, refactoring the API to fetch them at boot via the OVHcloud API rather than reading from a file on disk; (4) **audits the project** for over-privileged users by listing IAM grants, OpenStack role assignments, and personal credentials in use, then revokes everything that is not justified. KMS is covered conceptually only (slide + FAQ), since Public Cloud customer-managed-key integration is not yet GA on every Core service and a hands-on KMS lab would push the module over budget. By the end of the module Northwind has a defensible identity story: who can do what is policy-driven, secrets do not live in version control or config files, and the backup chain survives an operator's departure.
### Pedagogical angle
 
This is the *"closing"* module of Day 2 and arguably the **single highest-leverage module of the certification** for ex-AWS and ex-Azure learners. They arrive expecting an IAM model that looks like AWS IAM (account-wide policies, JSON documents, ARNs, assume-role) — and OVHcloud has exactly that. What they don't expect, and what the module makes explicit, is that **two identity layers coexist** in Public Cloud: the **OVHcloud IAM** layer governs what a person can do in the Manager and against OVHcloud APIs at large (billing, project lifecycle, support tickets, vRack management); the **OpenStack Keystone** layer, scoped to a single Public Cloud project, governs what is done on the resources inside that project (creating instances, attaching volumes, opening Security Groups). Module 1.2 introduced the second layer; Module 2.5 introduces the first one and makes the boundary between the two unambiguous.
 
The legacy-IT analogy holds well here. OVHcloud IAM corresponds to **Active Directory at the tenant level** — the directory of who you are, which groups you belong to, and what corporate-wide entitlements you have. OpenStack Keystone corresponds to the **local groups on a single Windows server** — once you are inside that server, your effective rights are decided by the local groups, regardless of what AD says about you. The AWS cross-reference for Corporate learners is similarly direct: OVHcloud IAM ≈ AWS IAM (account-wide, JSON policy documents), application credentials ≈ AWS access keys for IAM users + STS short-lived credentials, Secret Manager ≈ AWS Secrets Manager, KMS ≈ AWS KMS. The mapping is one-to-one in spirit; the JSON syntax differs.
 
The single most important slide of the module is **slide 3** — the two-layer IAM diagram. If the learner internalizes that an OVHcloud IAM policy granting `publicCloud:resource:network:create` does *not* mean the user can create a network without also having the OpenStack `member` role on the project (and vice versa), every downstream confusion dissolves. If they don't internalize it, they will spend the rest of the certification — and the operational year after it — looking in the wrong layer for missing permissions.
 
A second high-leverage point is **slide 7** — application credentials. The default mental model from AWS is "create an IAM user, attach a policy, generate an access key, put it in the EC2 instance's environment". On OVHcloud, the equivalent pattern is **create an OpenStack application credential scoped to the OpenStack project, with a restricted role and a defined expiry**, rather than reusing a person's personal `openrc.sh`. The pedagogical insistence is that a service account is **a credential, not a person**, and that it should never share its life cycle with a human user.
 
A third subtle point — and the one that earns the "Beyond Basics" suffix in the module title — is **slide 10** — the audit reflex. Once the learner has IAM users, IAM groups, OpenStack role assignments, application credentials, and Secret Manager entries, the project has accumulated five distinct catalogs of "who can do what". The audit reflex is the habit of cross-checking those five catalogs to detect over-privilege, dangling credentials, and stale grants. This is the attitudinal posture (`A01`, `A02`) the certification commits to leave the learner with.
 
### Trainer demonstration
 
15-minute end-to-end **Manager UI + OpenStack CLI** demo on the running Northwind stack. The trainer (1) creates an OVHcloud IAM user `demo-developer` via the Manager UI, sets a temporary password, and attaches a least-privilege policy from a starter template (`Public Cloud Operator` predefined policy, then duplicated and trimmed to remove project deletion), explains the four ingredients of a policy (subject, resource, action, condition) on a real example, (2) creates an IAM group `demo-devs`, attaches the same policy to the group, removes the policy from the user, adds the user to the group — illustrates that group-attached policies are the maintainable pattern, (3) generates an OpenStack application credential via the Horizon UI on the demo project, scoped to the `member` role with a 24h expiry, downloads the `openrc.sh`, sources it in a second terminal, runs `openstack server list` to confirm it works, then `openstack image create --public test.img` to confirm that the `member` role does not authorize public image creation (denied), (4) creates a secret `demo-postgres-password` in Secret Manager via the Manager UI, retrieves it from the Northwind API instance via a `curl` to the OVHcloud API using an application credential, demonstrates that the secret value never appears in the instance filesystem or in any config file, (5) runs a quick audit on the demo project: `openstack role assignment list --project demo --names`, lists IAM users in the organization via the Manager UI, and identifies one over-privileged grant introduced earlier in the day (the trainer's personal account has `administrator` on the demo project — should be `member`).
 
### Learner lab
 
*Separate identities, scope credentials, externalize secrets, and audit the result* (30 min). Each learner: (1) creates an OVHcloud IAM user `<initials>-northwind-developer` via the Manager UI and an IAM group `<initials>-northwind-devs`, attaches the predefined `Public Cloud Operator` policy to the group, adds the user to the group, signs in to a private browser window with the new user and confirms they can list the Northwind project resources but cannot delete the project, cannot see billing, cannot create a new project, (2) on the Northwind OpenStack project, generates an application credential `<initials>-nw-backup-cred` scoped to the `member` role with `--unrestricted` disabled, downloads the `openrc.sh`, SSHes into `<initials>-nw-db-01`, replaces the existing `openrc.sh` (which currently sources personal credentials) with the application credential, runs the nightly backup script `backup-pg.sh` manually to confirm it still works, (3) creates two secrets in the OVHcloud Secret Manager: `<initials>-nw-pg-password` with the PostgreSQL password and `<initials>-nw-s3-secret` with the Object Storage S3 secret key, updates the API service on `<initials>-nw-api-01` so that at boot the systemd unit calls a small fetch script (provided in the lab handout) that retrieves the secret via the OVHcloud API and exports it as an environment variable, restarts the API service, confirms the API still connects to PostgreSQL and still reaches the S3 backup bucket, then SSHes into `<initials>-nw-api-01` and confirms that the password is no longer present in `/etc/northwind-api/config.yaml`, (4) runs the audit checklist provided in the handout: `openstack role assignment list --project northwind --names` and identifies any user with `administrator` that should be `member`, lists IAM users in the organization and identifies any user who is in no group (orphans), lists active application credentials and revokes any that are older than 30 days, lists Secret Manager entries and confirms each is referenced by at least one service (the lab handout provides a one-line `grep` command across the API repo to spot unused secrets). Validation: `<initials>-northwind-developer` can list but not delete the Northwind project; `backup-pg.sh` runs successfully using the application credential and not the operator's personal `openrc.sh`; the API config file no longer contains the PostgreSQL password as plaintext; the audit checklist surfaces and resolves at least one over-privileged grant.
 
### Micro-check — question intents (drafted in Block 5)
 
1. OVHcloud IAM vs OpenStack Keystone — layer responsibility — Understand — `K01`
2. IAM policy structure — four ingredients — Remember — `K02`
3. Standard OpenStack roles in OVHcloud Public Cloud — Remember — `K03`
4. Application credential vs personal credential — when and why — Understand — `K04`
5. Secret Manager use case — Apply — `K05` / `S04`
6. KMS responsibility model — Understand — `K06`
7. IAM segmentation strategy for a corporate team — Analyze — `A01`
8. Audit reflex — detecting over-privilege — Apply — `S05`
### Trainer FAQ — anticipated topics (drafted in Block 8)
 
Why two IAM layers and not one unified IAM, what happens if I grant OVHcloud IAM but no OpenStack role (the user can see the project in the Manager but cannot do anything inside it), what happens conversely if I have the OpenStack role but no IAM grant (the user cannot authenticate to the Manager at all), how policies attach to users vs groups (group is always the maintainable pattern), what predefined IAM policies exist out of the box, how to write a custom policy and how the action wildcards work, what `--unrestricted` means on an application credential, what is the lifespan of an application credential and how to rotate one without breaking the consumer, how Secret Manager handles secret versions and rotation, what KMS integration exists today on OVHcloud Public Cloud (limited at the Associate scope — covered conceptually), how to audit dangling credentials, what happens to application credentials and Secret Manager entries when the OpenStack project is deleted, how to give a third-party (auditor, consultant) read-only access without exposing billing, how to handle service accounts when an operator leaves the company.
 
---
 
## Block 1 — Sentier battu / Hors piste (5 min)
 
### Sentier battu (assumed prerequisites)
 
**Tools:**
- The Northwind staging stack from Module 2.4: `<initials>-nw-web-01`, `<initials>-nw-web-02`, `<initials>-nw-api-01`, `<initials>-nw-db-01`, Gateway in place on `<initials>-nw-private`, Load Balancer fronting the web tier with HTTPS termination.
- The `openrc.sh` from Module 1.2, sourced and scoped to GRA, still using the operator's personal Public Cloud credentials.
- A nightly backup script `backup-pg.sh` deployed on `<initials>-nw-db-01` that today sources the operator's personal `openrc.sh` to push a `pg_dump` to the Object Storage bucket `<initials>-nw-backups` (Module 2.1 output).
- The Manager UI open in a browser tab, with administrator-level access to the OVHcloud account so that IAM users, groups, and policies can be created.
- A second private browser window available, so that the new IAM user can be tested without signing out of the trainer account.
- The OVHcloud API console (`api.ovh.com/console`) reachable, for the Secret Manager interactions and policy validation calls.
**Knowledge:**
- The basic IAM concepts from Module 1.2: a Public Cloud project has users and roles, the predefined OpenStack roles include `administrator`, `member`, `reader`, the project owner is implicitly an administrator.
- The OpenStack `openrc.sh` pattern: it exports `OS_AUTH_URL`, `OS_USERNAME`, `OS_PROJECT_ID`, `OS_PASSWORD` (or equivalent), and any OpenStack CLI command picks them up from the environment.
- The Object Storage S3 access pattern from Module 2.1: an Access Key and a Secret Key, generated per-user, used by S3-compatible clients to read and write objects.
- The notion of a service account from legacy IT: a non-human identity used by a process (cron job, daemon, application) to authenticate to a system, ideally with a scoped permission and a clear lifecycle separate from any human's lifecycle.
- TLS basics from Module 2.4 are not needed today, but the discipline of "never log a secret" carries over.
### Hors piste (remediation pointers for gaps)
 
- **Northwind stack from Module 2.4 not in place** → run the recovery script `module-2-4/recover-network-state.sh` from the lab repo, which rebuilds the Gateway, the Load Balancer, the dual-NIC tiers, and the Floating IP redirection. The recovery is idempotent and takes ~5 minutes.
- **`backup-pg.sh` not deployed on `<initials>-nw-db-01`** → the lab handout includes a one-line `curl | bash` to redeploy the script and its systemd timer.
- **Confusion between the two IAM layers** → preempt in the Sentier battu: "OVHcloud IAM controls the Manager and OVHcloud-wide actions (billing, project lifecycle, support). OpenStack Keystone controls what happens inside a single Public Cloud project (instances, networks, volumes). Two layers, both required to do anything meaningful."
- **Never created a Secret Manager entry before** → 30-second framing: "Secret Manager is a vault, scoped to your organization, accessed via the OVHcloud API. You put a secret in, you grant an identity the right to read it, you fetch it at runtime. Same pattern as AWS Secrets Manager or HashiCorp Vault."
- **Operator's personal credentials are still in version control** → flag it now, address it in the audit step of the lab. This is the kind of finding the audit is built to surface.
- **Persona Digital Starter is not used to "service accounts"** → 30-second framing: "In self-service you may be one operator with one identity. The application credential pattern still applies: even alone, you separate what your scripts use from what you type into a Manager window, because the credentials your scripts use should be rotatable without locking yourself out of the Manager."
---
 
## Block 2 — Theory & Concepts (30 min)
 
### Slide 1: The two-layer identity model (overview)
 
**Visual concept**: A two-layer block diagram. Top layer is **OVHcloud IAM** (account-wide, blue box) containing icons for Billing, Support, Project lifecycle, vRack, IAM management itself. Bottom layer is **OpenStack Keystone** (project-scoped, lighter blue box, one per project) containing icons for Instances, Networks, Volumes, Security Groups, Application credentials. An arrow from a user silhouette enters the OVHcloud IAM layer first; a second arrow descends from there into one specific project in the Keystone layer.
 
**Talking points**:
- Two distinct identity layers govern Public Cloud — both are always present, both are required.
- OVHcloud IAM is account-wide: who can sign in to the Manager, who can see billing, who can create or delete projects, who can manage vRack.
- OpenStack Keystone is project-scoped: who can do what *inside* a given Public Cloud project — create an instance, attach a volume, modify a Security Group.
- Granting OVHcloud IAM without an OpenStack role lets the user see the project exists, but they cannot operate it.
- Granting an OpenStack role without OVHcloud IAM is impossible — there is no way in without authenticating to the OVHcloud account first.
**Trainer notes**:
- This slide sets the entire module — spend a full 2 minutes on it.
- Anticipate: "why two layers?" — answer at slide 3, hold it.
- Use the AD analogy: OVHcloud IAM = AD at corporate level, Keystone = local groups on a server.
- For ex-AWS learners: "AWS only has one IAM. OVHcloud has two because Public Cloud is built on OpenStack — Keystone is part of the open-source upstream, OVHcloud IAM wraps the wider account around it."
---
 
### Slide 2: OVHcloud IAM — what lives there
 
**Visual concept**: Center, the OVHcloud IAM logo / icon. Around it, six labeled tiles: **Users**, **Groups**, **Policies**, **Roles** (legacy, account-level), **Identity providers** (SSO/SAML, for awareness only at Associate), **Audit log**. Each tile has a one-line description underneath.
 
**Talking points**:
- **Users**: individual identities with credentials (password + optional MFA), or federated via SSO.
- **Groups**: containers for users — the maintainable unit for policy attachment.
- **Policies**: JSON documents declaring allowed and denied actions on OVHcloud resources.
- **Roles** (account-level, legacy): predefined coarse-grained bundles (`administrator`, `accounting`, etc.) — being progressively superseded by policies, still in use.
- **Identity providers**: SAML or OIDC for federated sign-in (out of scope at Associate, mentioned for completeness).
- **Audit log**: who did what, when — Manager → Identity and Access → Logs.
**Trainer notes**:
- Don't overinvest on the legacy account-level roles — modern OVHcloud guidance is policy-driven.
- Anticipate: "is MFA mandatory?" — strongly recommended, can be enforced organization-wide via the Manager.
- Mention that the audit log is in the Manager but with limited retention at the Associate scope; long-term retention is an Ops concern (Module 3.2).
---
 
### Slide 3: OpenStack Keystone — what lives there
 
**Visual concept**: Center, the OpenStack logo. Around it, four labeled tiles: **Projects** (the unit of resource isolation), **Users** (project members), **Roles** (`administrator`, `member`, `reader`), **Application credentials** (project-scoped tokens). One sentence under each tile.
 
**Talking points**:
- **Projects** are the OpenStack isolation unit — one OVHcloud Public Cloud project equals one Keystone project.
- **Users** here are the OpenStack-side view of the OVHcloud identities that have been granted access to the project.
- **Roles** are the three standard OpenStack roles: `administrator` (everything in the project), `member` (operate resources, no IAM changes inside the project), `reader` (read-only).
- **Application credentials** are credentials issued by Keystone, scoped to one project, attached to one role, with an optional expiry. Not bound to a human user lifecycle.
- The OpenStack API and the Horizon UI both authenticate against Keystone — `openstack` CLI, Terraform OpenStack provider, custom scripts.
**Trainer notes**:
- Insist: a user can be a `member` of project A and `reader` of project B in the same OpenStack identity — roles are per-project, not global.
- Anticipate from ex-AWS: "this is like an IAM role in an AWS account but scoped tighter." Acceptable shorthand, but the analogy breaks at the assume-role mechanic — Keystone has no assume-role.
- The three roles are stable across all OVHcloud regions — no region-specific exceptions to remember.
---
 
### Slide 4: How a request is authorized — the two checks
 
**Visual concept**: A horizontal flow diagram. Left: a user issues an action ("create instance `nw-api-01` in project `northwind`"). Middle: two sequential gates labeled **Gate 1 — OVHcloud IAM** ("does the user have the `publicCloud:operate` policy on this project?") and **Gate 2 — OpenStack Keystone** ("does the user have a role on this project that allows server creation?"). Right: the action succeeds only if both gates return allow. A red X marks any path where either gate denies.
 
**Talking points**:
- Every Public Cloud operation passes through both gates — in sequence, not in parallel.
- Gate 1 happens at the OVHcloud API edge: is the caller authenticated, and is the policy allowing the action on this resource type?
- Gate 2 happens at the OpenStack API edge: does the caller have a Keystone role on the target project that permits the specific OpenStack call?
- An IAM-allowed but Keystone-denied call returns a 403 from OpenStack — confusing for newcomers who see "IAM allows but nothing works".
- A Keystone-allowed but IAM-denied call never reaches Keystone — the OVHcloud IAM layer rejects it first.
**Trainer notes**:
- This is the single slide most learners come back to during the lab — make it sticky.
- Anticipate: "what's a typical error message when Gate 2 denies?" — `403 Forbidden`, OpenStack-style with a `RoleNotFound` or `PolicyNotAuthorized` hint.
- Reframe for Digital Starter: "if you are the project owner, both gates are wide open by default — you'll see this matter when you start adding other people."
---
 
### Slide 5: IAM policy structure — subject, resource, action, condition
 
**Visual concept**: A four-quadrant layout with a small JSON-style snippet in the center. Each quadrant labeled with one of the four ingredients: **Subject** (who — user or group), **Resource** (on what — service path, project ID, instance ID), **Action** (what — `publicCloud:network:*`, `publicCloud:instance:create`), **Condition** (optional — IP range, MFA required, time window).
 
**Talking points**:
- Every OVHcloud IAM policy is one or more rules, each composed of these four ingredients.
- **Subject** attaches the policy to a user, a group, or an identity provider role.
- **Resource** identifies what the policy applies to — uses URN syntax (e.g., `urn:v1:eu:resource:publicCloud:projectId`).
- **Action** is the operation — wildcards allowed (`publicCloud:operate:*` for all operate actions on Public Cloud).
- **Condition** narrows the rule by context (source IP, MFA presence, time of day). Often empty at the Associate scope.
- Rules combine with **deny overrides allow**: if any matching rule denies, the action is denied.
**Trainer notes**:
- Show one real predefined policy in the Manager during this slide if time permits — `Public Cloud Operator` is the cleanest example.
- The deny-overrides-allow rule is the same as AWS IAM and as POSIX file ACLs — Corporate learners pick it up immediately.
- Anticipate: "where do I find the list of action verbs?" — Manager → Identity and Access → Policies → action picker; also documented at `docs.ovhcloud.com`.
---
 
### Slide 6: Predefined IAM policies — start here
 
**Visual concept**: A two-column table. Left column lists the most-used predefined policies: `Public Cloud Operator`, `Public Cloud Read-only`, `Public Cloud Network`, `Public Cloud Storage`, `Billing Read-only`, `Support Operator`. Right column gives a one-line scope description for each.
 
**Talking points**:
- OVHcloud ships predefined policies covering the common segmentation needs — start with these, customize only when needed.
- `Public Cloud Operator` is the policy for "developer who deploys and operates resources" — read and write on Public Cloud objects, no billing, no project deletion.
- `Public Cloud Read-only` is the policy for "auditor or consultant who needs visibility" — read everywhere, write nowhere.
- `Billing Read-only` is the policy for "finance person who reads invoices" — billing visibility, zero on infrastructure.
- Custom policies are duplicates of a predefined one, then trimmed or extended — never write from scratch unless the predefined set genuinely doesn't fit.
- A user can have multiple policies attached (via their groups, or directly) — the union of allows minus the union of denies decides.
**Trainer notes**:
- Insist on "duplicate then trim" as the production workflow — it's faster, less error-prone, and easier to review.
- Anticipate Corporate learners: "we have an internal RBAC convention with 12 personas, can we model them all?" — yes, IAM is flexible enough; the path is one group per persona, one policy per group.
- Persona Digital Starter rarely creates IAM users at all — the predefined `Public Cloud Read-only` policy is the one they'll use first to invite an accountant or a freelance consultant.
---
 
### Slide 7: Application credentials — the credential pattern for automation
 
**Visual concept**: Side-by-side comparison. Left, **Personal credentials**: a person silhouette holding an `openrc.sh` that contains their username and password — arrow pointing to a cron job, with a red warning sign labeled "credential tied to a human's lifecycle". Right, **Application credentials**: a robot icon holding a `openrc.sh` containing an application credential ID and secret — arrow pointing to the same cron job, with a green checkmark labeled "credential scoped to a role, with an expiry".
 
**Talking points**:
- An **application credential** is an OpenStack-issued credential, scoped to one project, attached to one role, with an optional expiry.
- It is **decoupled from any human user's lifecycle** — when the operator who created it leaves, the application credential continues to work until it is explicitly revoked.
- The credential has two parts: an **ID** (public-ish) and a **secret** (sensitive) — distributed together in an `openrc.sh` or equivalent.
- Application credentials replace personal credentials in **any non-interactive workload**: cron jobs, Terraform, CI/CD pipelines, observability agents, backup scripts.
- The `--unrestricted` flag exists but is dangerous — it grants the credential the ability to create new application credentials. Default is restricted.
**Trainer notes**:
- This is the second high-leverage slide — anchor the reflex `A02`: any non-interactive workload uses an application credential, by default, no exceptions.
- AWS cross-ref: similar in spirit to STS short-lived credentials issued to an EC2 instance role — same goal, different mechanism.
- Anticipate: "how long should the expiry be?" — match the rotation cadence of the consuming system; 90 days is a reasonable default if no policy mandates shorter.
- Show the Horizon UI path during the demo: Identity → Application Credentials → Create.
---
 
### Slide 8: Secret Manager — where credentials and secrets actually live
 
**Visual concept**: A vault icon in the center. Three arrows go in (from a developer typing a secret via the Manager, from Terraform pushing a secret via API, from a CI pipeline rotating a secret). Three arrows go out (to a Public Cloud instance reading at boot, to a Managed Database receiving its initial password, to a runtime application fetching on demand). A small badge "encrypted at rest" on the vault.
 
**Talking points**:
- **Secret Manager** is OVHcloud's managed secret store — secrets are written, read, and rotated through the OVHcloud API.
- A secret has a name, a value, optional versions, and an access policy via OVHcloud IAM — same policy mechanic as any other OVHcloud resource.
- Secrets are **encrypted at rest** — the customer does not handle the encryption keys at the Associate scope (KMS integration is a Professional-level concern).
- The typical pattern: store the secret once; configure the consumer (an instance, a service, a pipeline) to fetch the secret at boot or on demand via the OVHcloud API using an application credential or an IAM-authenticated identity.
- Secret rotation: write a new version of the secret; the consumer fetches the latest version at the next boot or refresh — no in-place mutation of the old version.
**Trainer notes**:
- Insist on the principle: "if your config file contains a password, your config file is a secret. Externalize."
- The pedagogical antipattern to highlight: hardcoding passwords in Terraform state files — Terraform state is not encrypted at rest by default, and treating it as a secret store fails audit.
- Anticipate: "what is the latency of a Secret Manager fetch?" — sub-second on the same region; the typical usage is read-once-at-boot, not read-on-every-request.
- Mention that Secret Manager is currently a relatively young product on OVHcloud — feature parity with AWS Secrets Manager evolves; defer specifics to docs.ovhcloud.com.
---
 
### Slide 9: KMS — what the Associate level needs to know
 
**Visual concept**: A simplified shared-responsibility diagram. Three columns: **You manage the key** (Customer-Managed Keys, top-tier control, available on selected services), **OVHcloud manages the key** (Service-Managed Keys, default for most encrypted services), **No key visible** (encrypted-at-rest by default, key never exposed to the customer). A footer line clarifies that on Public Cloud Core today, the dominant pattern is service-managed encryption, with customer-managed-key integration progressively appearing.
 
**Talking points**:
- **Key Management Service** governs the lifecycle of encryption keys — create, rotate, revoke, audit.
- At the Associate scope, the key question is who controls the key, not how the cryptography works.
- **Service-Managed Keys**: OVHcloud generates, stores, and rotates the key; the customer sees nothing — applies to Object Storage encryption-at-rest, Block Storage encryption, Secret Manager.
- **Customer-Managed Keys** (KMS-backed): the customer creates the key in OVHcloud's KMS, grants the consuming service the right to use it, retains the ability to revoke and audit — available on a growing list of services, not exhaustive at Associate scope.
- The audit-friendly pattern, when available: customer-managed keys for compliance workloads, service-managed for everything else.
**Trainer notes**:
- Be honest with learners: this slide is **awareness, not skill**. There is no lab on KMS — feature availability is moving.
- Anticipate the regulated-industry learner: "what about HSM-backed keys?" — exists on Hosted Private Cloud and on certain Bare Metal offerings, out of scope for Public Cloud Core Associate.
- AWS cross-ref: AWS KMS with customer-managed CMKs is the mental model — same shared-responsibility split, similar audit primitives.
- Defer specifics to docs.ovhcloud.com — say so explicitly; learners appreciate the calibration honesty more than fake authority.
---
 
### Slide 10: The audit reflex — five catalogs to cross-check
 
**Visual concept**: A circular diagram with five segments, each labeled with one catalog: **IAM users and groups**, **IAM policy attachments**, **OpenStack role assignments**, **Application credentials**, **Secret Manager entries**. In the center, a magnifying glass icon and the caption "who can do what — verify monthly".
 
**Talking points**:
- Once a project has grown beyond a single operator, "who can do what" lives in **five distinct catalogs** — none of them tells the full story alone.
- **IAM users and groups**: the identity directory — who exists, who is in which group.
- **IAM policy attachments**: which policies apply to which users or groups — the authorization rules.
- **OpenStack role assignments**: who has which role on which project — `openstack role assignment list --project <name> --names`.
- **Application credentials**: which non-human credentials exist, what they can do, when they expire — `openstack application credential list`.
- **Secret Manager entries**: which secrets exist, when they were last rotated, which identities can read them.
- The audit reflex: monthly walk through the five catalogs and answer "is each entry still justified?" — anything not justified is revoked.
**Trainer notes**:
- This slide anchors the attitude `A01` (segmentation strategy) and `S05` (audit skill) — both come back in the lab.
- Frame the discipline pragmatically: "the goal is not zero findings, the goal is to know where the findings are."
- For Digital Starter persona: "even alone, run this once a quarter — orphan credentials are the most common foothold in self-service incidents."
---
 
### Slide 11: IAM segmentation — a corporate template
 
**Visual concept**: A table with four corporate personas as rows and the relevant access scope as columns. Personas: **Admin** (full IAM + full Public Cloud + billing), **Developer** (Public Cloud Operator, no billing, no project deletion), **Auditor** (read-only everywhere including billing), **Billing** (billing read/write, zero on infrastructure). Columns: IAM groups, OVHcloud IAM policies attached, OpenStack roles on production project, OpenStack roles on dev project.
 
**Talking points**:
- A defensible IAM segmentation maps to **how the company actually works** — not to OVHcloud-specific abstractions.
- Four corporate personas cover most cases at the Associate scope: Admin, Developer, Auditor, Billing.
- Each persona is one IAM group, with one set of policy attachments — predefined policies suffice for three of the four.
- Production and non-production projects often deserve different role assignments — Developers as `member` on dev, `reader` on production for most teams; only a smaller subset gets `member` on production.
- The mapping is the deliverable to defend in front of the auditor — write it down once, link it from the team's onboarding doc.
**Trainer notes**:
- This slide is the Attitude `A01` anchor — let it land.
- Anticipate the persona Corporate question: "we have role inheritance from AD via SSO, can we keep it?" — yes, IAM supports SAML, the AD group becomes the IAM group source.
- Persona Digital Starter rarely has four personas — but the principle "scope by role, not by person" applies even at one operator: one group `me-as-operator`, one group `me-as-billing`, attach them to the same identity, deactivate one when context shifts.
---
 
## Block 3 — Trainer Demonstration (15 min)
 
### Demo scenario
 
A 15-minute walkthrough on the running Northwind demo stack covering: (1) creating an OVHcloud IAM user and group with a least-privilege policy, (2) generating an OpenStack application credential and validating its restricted scope, (3) creating a Secret Manager entry and fetching it from an instance, (4) running a 60-second audit across the five catalogs to surface one planted over-privilege. The trainer narrates the decision points as they happen — the goal is to make the reasoning visible, not just the clicks.
 
### Demo script
 
| Step | Action | Expected output | Trainer commentary |
|---|---|---|---|
| 1 | Manager UI → Identity and Access → Users → **Add user** `demo-developer`, set a temporary password | User created, listed in Users tab | "Temporary password — they'll rotate on first sign-in. MFA enforcement is set at the organization level — already on here." |
| 2 | Manager UI → Identity and Access → Policies → **Public Cloud Operator** → **Duplicate** → rename `demo-developer-policy` → trim the `publicCloud:projects:delete` action | New policy listed, with the delete action removed | "Duplicate-and-trim — never write from scratch. The deny on project deletion is the one guardrail we always add for Developers." |
| 3 | Manager UI → Identity and Access → Groups → **Add group** `demo-devs` → attach `demo-developer-policy` → add `demo-developer` to the group | Group created, policy attached, user is a member | "Groups own policies, users join groups. If we ever need to fire-revoke this developer, we remove the user from the group — the credential dies in one click." |
| 4 | Open a private browser window, sign in as `demo-developer`, navigate to Public Cloud → demo project | Project visible, instances visible, no Delete button on project actions | "The IAM gate passed — they can see the project. Try to delete — blocked. Try to view billing — blocked. Two minutes of validation saves an audit finding." |
| 5 | Back to the trainer browser, Horizon UI on demo project → Identity → Application Credentials → **Create**, name `demo-backup-cred`, role `member`, expiry `24h`, unrestricted **off** | Application credential created, ID and secret displayed once | "Read the secret now — it never comes back. Restricted is the safe default. 24h expiry for a demo, 90 days for production with rotation discipline." |
| 6 | In a second terminal, source the downloaded `openrc.sh`, run `openstack server list` | Server list returned | "Application credential works. Same role as `member` — anything `member` can do, it can do." |
| 7 | Same terminal, run `openstack image create --public test.img` | `403 Forbidden — admin required` | "Restricted scope confirmed — `member` cannot create a public image. If our backup script tries this, it fails fast — which is what we want." |
| 8 | Manager UI → Secret Manager → **Add secret** `demo-postgres-password` with a sample value | Secret listed, value hidden | "Stored encrypted at rest. From here we grant read access to the consumer — in this case the API instance via its application credential." |
| 9 | SSH into `demo-api-01`, run the provided fetch script `fetch-secret.sh demo-postgres-password` (uses the application credential to call the OVHcloud API) | Secret value retrieved, printed to stdout (demo only, never logged in production) | "In the lab you'll wire this into the systemd unit so the password loads at boot and disappears from disk after." |
| 10 | Back on the trainer terminal: `openstack role assignment list --project demo --names` | Table listing all role assignments in the demo project | "Five rows. The trainer account has `administrator` — should be `member`. Audit finding #1, surfaced in 5 seconds." |
| 11 | Manager UI → Identity and Access → Users → filter for users not in any group | One orphan listed (planted by the trainer before the demo) | "Orphan users — exist but no policy attached. Either delete them or assign them to a group. Audit finding #2." |
| 12 | OpenStack CLI: `openstack application credential list` | Three credentials listed, one with an expiry in the past | "Expired credential still in the list — clean it up. Audit finding #3 in 45 seconds total." |
 
### Common demo failure modes
 
- If the new IAM user can't sign in immediately after creation → propagation latency, usually < 30 seconds. Refresh the private window after a pause.
- If `openstack server list` fails after sourcing the application credential `openrc.sh` → typically a missing `OS_AUTH_TYPE=v3applicationcredential` line in the `openrc.sh`. The Horizon UI download includes it; manual edits often miss it.
- If the Secret Manager fetch returns `403` → the calling identity (the application credential, in the demo) lacks the read policy on the secret. The lab handout walks through attaching the read policy explicitly; if it happens in the demo, surface it as a teaching moment — "the audit reflex applies to Secret Manager too".
- If `openstack role assignment list` returns no rows for the project name → use `--project-domain default` explicitly; on OVHcloud Public Cloud the project domain is `default` but the CLI occasionally requires the flag depending on version.
---
 
## Block 4 — Learner Lab (30 min)
 
### Lab brief (learner-facing)
 
You will turn Northwind's identity and secret model from naive to production-shape. By the end of the lab the Northwind Public Cloud project has: a separate IAM developer identity scoped via a group and a least-privilege policy, an OpenStack application credential dedicated to the nightly PostgreSQL backup job and decoupled from any human's `openrc.sh`, two secrets (the PostgreSQL password and the S3 backup secret key) stored in Secret Manager and fetched at boot by the API instance, and one audit-finding fix logged in your lab notes. You will work entirely against your own Northwind stack from Module 2.4. Allowed channels: OVHcloud Manager UI for IAM operations and Secret Manager, OpenStack CLI for application credentials and role assignments. No Terraform in this lab — IaC integration is treated in Module 3.1.
 
### Lab steps (learner-facing)
 
1. **Create the developer identity and group.** In the Manager UI, create an IAM user `<initials>-northwind-developer` with a temporary password. Create an IAM group `<initials>-northwind-devs`. Duplicate the predefined `Public Cloud Operator` policy, rename your copy `<initials>-northwind-dev-policy`, and trim out the action `publicCloud:projects:delete`. Attach your custom policy to the `<initials>-northwind-devs` group. Add the user to the group. Sign in to the Manager in a private browser window as the new user — confirm you see the Northwind project, you can list resources, you cannot delete the project, and you cannot see billing.
2. **Generate the backup application credential.** Source your personal `openrc.sh` on your workstation. Via Horizon → Identity → Application Credentials → Create, generate an application credential named `<initials>-nw-backup-cred`, role `member`, expiry 90 days, **unrestricted disabled**. Download the resulting `openrc.sh` and save it as `~/.openrc/<initials>-nw-backup.sh`. Source it in a fresh terminal and run `openstack server list` — confirm the application credential authenticates and can see the Northwind instances.
3. **Switch the backup job to the application credential.** SSH into `<initials>-nw-db-01`. Replace the contents of `/etc/northwind/backup-openrc.sh` (currently sourced by the cron job and pointing at the operator's personal credentials) with the contents of `<initials>-nw-backup.sh`. Run the backup script manually: `sudo /usr/local/bin/backup-pg.sh`. Confirm the script completes successfully and that a new object lands in the `<initials>-nw-backups` Object Storage bucket (`openstack object list <initials>-nw-backups | tail -5`).
4. **Externalize the PostgreSQL password into Secret Manager.** In the Manager UI → Secret Manager, create a secret named `<initials>-nw-pg-password` with the current PostgreSQL password as value (copy it from `/etc/northwind-api/config.yaml` on `<initials>-nw-api-01`). On `<initials>-nw-api-01`, run the provided one-liner `curl -O <handout-url>/fetch-secret.sh && chmod +x fetch-secret.sh && sudo mv fetch-secret.sh /usr/local/bin/`. Edit the systemd unit `/etc/systemd/system/northwind-api.service` to add an `ExecStartPre=/usr/local/bin/fetch-secret.sh <initials>-nw-pg-password POSTGRES_PASSWORD` directive that fetches the secret and exports it as an environment variable into the service environment file. Remove the `postgres_password:` line from `/etc/northwind-api/config.yaml`. Reload systemd and restart the service: `sudo systemctl daemon-reload && sudo systemctl restart northwind-api`. Validate that the API still talks to PostgreSQL (`curl http://localhost:8080/health`).
5. **Externalize the S3 backup secret key.** Same pattern as step 4, on `<initials>-nw-db-01`, for the S3 secret key used by the backup script. Create the Secret Manager entry `<initials>-nw-s3-secret`, modify the backup script to source the value via `fetch-secret.sh` instead of reading it from the openrc-style file, run the backup once more to confirm.
6. **Audit the project.** Run the following five-step audit and log the findings in a Markdown file `<initials>-nw-audit-2.5.md` in the lab repo:
   - `openstack role assignment list --project northwind --names` → list every user-role pair, flag anyone with `administrator` who shouldn't have it.
   - In the Manager → Identity → Users, filter for users not in any group — flag any orphan.
   - `openstack application credential list` → flag any credential older than 60 days or with no expiry.
   - In the Manager → Secret Manager, list all secrets — for each, grep the lab repo for its name (`grep -r <secret-name> .`) and flag any secret that no script or service references.
   - Optional but recommended: rotate one of the two secrets you just created (write a v2 of the value in Secret Manager, restart the consuming service, confirm it picks up the new value).
7. **Hand off the developer credentials to the trainer.** Share the username `<initials>-northwind-developer` and a screenshot of the private-browser session showing access to the Northwind project. The trainer signs in to validate the scoping in real time as your lab validation.
### Validation criteria
 
- The IAM user `<initials>-northwind-developer` can list Northwind resources, **cannot** delete the project, **cannot** view billing.
- The nightly PostgreSQL backup runs successfully using the application credential `<initials>-nw-backup-cred` — verified by an object timestamp in `<initials>-nw-backups` that postdates the start of the lab.
- The PostgreSQL password is **no longer present** in `/etc/northwind-api/config.yaml` (`grep postgres_password /etc/northwind-api/config.yaml` returns nothing).
- The Northwind API still responds 200 on `/health` after the secret externalization.
- The audit Markdown file `<initials>-nw-audit-2.5.md` contains at least one resolved finding (with the before/after state documented).
### Lab artifacts to produce
 
- A Markdown file `<initials>-nw-audit-2.5.md` committed to the lab repo under `labs/2-5/`.
- The updated `northwind-api.service` systemd unit, copied into the lab repo under `labs/2-5/artifacts/`.
- The updated `backup-pg.sh` script, copied into the lab repo under `labs/2-5/artifacts/`.
### Common lab support questions
 
- *The IAM user I just created cannot sign in immediately* → IAM propagation can take up to a minute. If after two minutes it still fails, double-check the temporary password and the MFA enforcement policy at the organization level (the trainer's account may be enforcing MFA on first sign-in, which requires an authenticator app setup).
- *`fetch-secret.sh` returns `403`* → the application credential running the fetch lacks read permission on the secret. Check the Secret Manager entry's access policy in the Manager — by default, only the creator's identity has read. Grant the consuming application credential's identity read access on the secret.
- *The backup script complains about `keystoneauth1` after switching credentials* → most often a missing `OS_AUTH_TYPE=v3applicationcredential` line in the application credential `openrc.sh`. The downloaded file should include it; if you handcrafted the file, add the line explicitly.
- *I want to test what happens when the application credential expires* → set the expiry to 5 minutes when creating it, wait, retry — the call should fail with `401`. Then create a fresh credential and confirm the rotation. Do this only if you finish the core lab early.
- *I accidentally deleted the predefined `Public Cloud Operator` policy* → predefined policies cannot be deleted, only customized copies can. You probably deleted your custom duplicate — recreate it.
- *Can I store the PostgreSQL password in the systemd unit file instead of fetching it at boot?* → that would defeat the externalization. The whole point is that the secret value never lives on disk in the instance; `ExecStartPre` fetches into the systemd environment, which is process-scoped, not file-scoped.
---
 
## Block 5 — Micro-check QCM (5 min)
 
Format: 8 single-answer multiple-choice questions, formative (non-certifying).
 
### Question 1
 
- **Stem**: An operator can sign in to the OVHcloud Manager and sees the Northwind Public Cloud project listed, but when they click into it they cannot see the instances, networks, or volumes. What is the most likely cause?
- **Correct answer**: B. The operator has been granted an OVHcloud IAM policy that authorizes Public Cloud visibility at the account level, but no OpenStack role on the Northwind project at the Keystone level.
- **Distractors**:
  - A. The Northwind project has been deleted — *Why wrong*: the project would not be listed at all if deleted; it shows up in the Manager precisely because it exists.
  - C. The operator's MFA token has expired and the OpenStack API silently downgraded their access — *Why wrong*: MFA expiry triggers a re-authentication flow, not a silent partial access.
  - D. The Northwind project is in a different OVHcloud region than the operator's account — *Why wrong*: Public Cloud projects are region-agnostic at the IAM layer; access does not depend on the operator's "region".
- **LO traced**: `LO-SEC-K01`
- **Bloom level**: Understand
### Question 2
 
- **Stem**: Which four ingredients are required to fully describe a rule in an OVHcloud IAM policy?
- **Correct answer**: A. Subject, Resource, Action, Condition.
- **Distractors**:
  - B. User, Role, Service, Expiry — *Why wrong*: confuses the policy grammar with the user-role-credential trio; expiry is a property of credentials, not policy rules.
  - C. Group, Project, Permission, Region — *Why wrong*: these are attributes of an IAM grant in some hyperscaler models, not the OVHcloud IAM policy structure.
  - D. Identity, Endpoint, Method, MFA — *Why wrong*: MFA is a possible condition value, not a policy ingredient.
- **LO traced**: `LO-SEC-K02`
- **Bloom level**: Remember
### Question 3
 
- **Stem**: Which three standard OpenStack roles are available on every OVHcloud Public Cloud project?
- **Correct answer**: C. `administrator`, `member`, `reader`.
- **Distractors**:
  - A. `owner`, `operator`, `viewer` — *Why wrong*: not the OpenStack standard naming; these resemble Azure RBAC roles.
  - B. `root`, `developer`, `guest` — *Why wrong*: invented naming; not part of any OpenStack standard.
  - D. `superuser`, `power_user`, `read_only` — *Why wrong*: invented naming.
- **LO traced**: `LO-SEC-K03`
- **Bloom level**: Remember
### Question 4
 
- **Stem**: A team's nightly backup job currently authenticates to OpenStack using a `openrc.sh` containing the personal credentials of an operator who has just left the company. Which is the correct corrective action?
- **Correct answer**: D. Generate an OpenStack application credential scoped to the role needed by the backup (typically `member`), with a defined expiry, and reconfigure the backup job to source the application credential `openrc.sh` instead of any personal credentials.
- **Distractors**:
  - A. Keep the personal credentials of the departed operator active and add a comment in the script noting they should not be removed — *Why wrong*: ties an automated workload to a human's lifecycle, which is the antipattern the lesson exists to prevent.
  - B. Convert the operator's account into a "service account" by renaming it `backup-bot` — *Why wrong*: renaming does not change the credential type; the credential remains tied to a human user account with full personal permissions.
  - C. Distribute the operator's password to the team and rotate it monthly — *Why wrong*: shared passwords are an audit failure and still tie the credential to a human user lifecycle.
- **LO traced**: `LO-SEC-K04` / `LO-SEC-S03`
- **Bloom level**: Apply
### Question 5
 
- **Stem**: A Northwind API instance needs the PostgreSQL password at boot to connect to the database. Which approach respects the Secret Manager pattern recommended at the Associate scope?
- **Correct answer**: B. Store the password in OVHcloud Secret Manager; configure the instance's service to fetch it at boot via the OVHcloud API using an application credential, and inject it as an environment variable into the service.
- **Distractors**:
  - A. Hardcode the password in the instance's user-data and rely on the user-data only being readable by root — *Why wrong*: user-data persists in instance metadata and is recoverable by anyone with metadata access; it is not a secret store.
  - C. Commit the password in a `.env` file alongside the application code in the Git repository, protected by a `.gitignore` entry — *Why wrong*: `.gitignore` prevents committing the file but does not prevent accidental disclosure; secrets must not live in repos at all.
  - D. Store the password in a Block Storage volume mounted only on the API instance — *Why wrong*: Block Storage is not a secret store; it is unencrypted at the application layer, and the volume could be detached and attached elsewhere.
- **LO traced**: `LO-SEC-K05` / `LO-SEC-S04`
- **Bloom level**: Apply
### Question 6
 
- **Stem**: At the Associate scope, what is the correct characterization of a Key Management Service in the OVHcloud Public Cloud context?
- **Correct answer**: A. KMS governs the lifecycle of encryption keys (create, rotate, revoke, audit); at the Associate scope, the dominant pattern on Public Cloud Core is service-managed encryption, with customer-managed-key integration available on a growing list of services.
- **Distractors**:
  - B. KMS is a Public Cloud project component installed by default in every project — *Why wrong*: KMS is an OVHcloud-wide service, not a per-project component.
  - C. KMS replaces Secret Manager — they are alternative implementations of the same feature — *Why wrong*: they solve different problems — Secret Manager stores secrets, KMS manages the keys that may encrypt those secrets.
  - D. KMS is only relevant for Hosted Private Cloud and Bare Metal; it does not apply to Public Cloud — *Why wrong*: KMS is available on Public Cloud; the service-coverage is what is still expanding.
- **LO traced**: `LO-SEC-K06`
- **Bloom level**: Understand
### Question 7
 
- **Stem**: A Northwind operator runs an audit of the Public Cloud project and finds: (a) one IAM user not in any group with no policy attached, (b) three OpenStack application credentials with no expiry that are over a year old, (c) two operators with the `administrator` OpenStack role on the production project who only need `member`, (d) one Secret Manager entry not referenced by any service. Which corrective set best applies the principle of least privilege?
- **Correct answer**: C. Delete the orphan IAM user, revoke the three expiry-less application credentials and recreate them with explicit expiries if still needed, downgrade the two operators from `administrator` to `member` on the production project, and delete the unused Secret Manager entry.
- **Distractors**:
  - A. Leave (a) and (d) alone because they cause no immediate harm; only correct (b) and (c) — *Why wrong*: dangling identities and dangling secrets are precisely the audit findings that mature into incidents; least-privilege addresses them all.
  - B. Convert all four findings into a single ticket "review next quarter" — *Why wrong*: deferring identity findings without remediation is the antipattern the audit reflex exists to prevent.
  - D. Add a deny-all policy on top of each finding to neutralize them — *Why wrong*: deny-all policies do not remove orphan credentials or unused secrets; they add complexity without resolving the root cause.
- **LO traced**: `LO-SEC-S05` / `LO-SEC-A02`
- **Bloom level**: Apply
### Question 8
 
- **Stem**: A Northwind architect is designing the IAM segmentation for a team of 8 people: 1 cloud admin, 4 developers, 1 finance/billing person, 1 external auditor for an annual compliance review, 1 SRE on call for production. Which segmentation is the most defensible at the Associate scope?
- **Correct answer**: B. Four IAM groups (`admin`, `developers`, `billing`, `auditors`, `sre`) — each user in exactly one group; policies attached to groups using predefined templates (`Public Cloud Operator` for developers and SRE, `Billing Read-only` for billing, `Public Cloud Read-only` for auditors, full IAM and Public Cloud for admin); OpenStack roles assigned per project (developers `member` on dev, `reader` on production; SRE `member` on production; auditor `reader` everywhere; admin `administrator` only on the admin project).
- **Distractors**:
  - A. One IAM group `team` containing all 8 users, with the `Public Cloud Operator` policy attached — *Why wrong*: ignores the role differentiation; gives the auditor and the billing person infrastructure write access.
  - C. Eight individual IAM users with policies attached directly to each user — *Why wrong*: policies attached to users are unmaintainable at any team size beyond 2; the lesson is groups own policies.
  - D. The external auditor gets a shared `auditor` account with a known password rotated annually — *Why wrong*: shared accounts violate the per-identity audit trail; the auditor gets their own user with a read-only group membership, deactivated after the engagement.
- **LO traced**: `LO-SEC-A01`
- **Bloom level**: Analyze
---
 
## Block 6 — Wrap-up & Transition (5 min)
 
### Recap
 
By the end of this module the learner can:
- **Distinguish** OVHcloud IAM (account-wide, governs Manager and OVHcloud-wide actions) from OpenStack Keystone (project-scoped, governs Public Cloud resources inside one project), and know that both gates must allow for any action to succeed (`K01`)
- **Explain** the IAM policy model — Subject, Resource, Action, Condition — and the deny-overrides-allow rule for policy combination (`K02`)
- **Identify** the three standard OpenStack roles available on every Public Cloud project — `administrator`, `member`, `reader` — and what each can do (`K03`)
- **Describe** application credentials and the reflex of using them for any non-interactive workload instead of personal credentials (`K04`)
- **Identify** Secret Manager as the right tool to externalize secrets from config files and code, with encryption at rest and versioned secrets (`K05`)
- **Explain** the role of a Key Management Service at the awareness level — who manages the key matters more than how the cryptography works (`K06`)
- **Create** an IAM user, attach a least-privilege policy via a group, and validate the effective permissions in a private browser session (`S01`, `S02`)
- **Generate** and revoke OpenStack application credentials, scope them to a specific role with a defined expiry (`S03`)
- **Store** a secret in Secret Manager and retrieve it from an instance at boot using an application credential (`S04`)
- **Audit** a project across the five catalogs — IAM users, IAM policy attachments, OpenStack roles, application credentials, Secret Manager entries — and apply the principle of least privilege (`S05`)
- **Recommend** an IAM segmentation strategy aligned with corporate roles (admin, developer, auditor, billing, SRE) (`A01`)
- **Justify** the reflex of application-credential-over-personal-credential for any non-interactive workload (`A02`)
### Transition to next module via red-thread scenario
 
Northwind has now closed Day 2 with a defensible identity story. The IAM layer separates the cloud admin, the developers, the finance person, and the (eventual) external auditor — each in a group, each with a policy that maps to their corporate role. The nightly PostgreSQL backup runs under an application credential scoped to `member`, decoupled from any operator's personal `openrc.sh` — if a developer leaves the company tomorrow, the backup chain keeps running until it is explicitly rotated. The PostgreSQL password and the S3 backup secret live in Secret Manager, fetched at boot by the API and the backup job, no longer present in any config file or in any Git repository. The audit checklist surfaced one over-privileged grant and resolved it on the spot. Northwind's network looks production-shape, and so does its identity model. The remaining gap is **reproducibility**: everything we have built so far — projects, networks, instances, Security Groups, IAM users, policies, secrets — has been built by hand, through the Manager UI and ad-hoc CLI commands. On Day 3 we close this gap. Module 3.1 — Infrastructure as Code Essentials — introduces the OpenStack CLI as a first-class deployment tool and Terraform as the declarative engine that reproduces the Northwind stack in any region, on demand, from a versioned source repository. By the end of Day 3 the trainer should be able to delete the entire Northwind staging stack and rebuild it in 10 minutes from `terraform apply`.
 
---
 
## Trainer FAQ (anticipated questions for this module)
 
**Q: Why do we have two IAM layers? Isn't this just complexity for the sake of complexity?**
A: It reflects the architecture. OpenStack ships with its own identity service (Keystone) that is project-scoped and bound to the OpenStack APIs. OVHcloud wraps the wider account (billing, support, multi-product, project lifecycle) around the OpenStack projects, and that wrapper needs its own identity layer. Trying to collapse the two layers would either limit what OVHcloud IAM can govern (everything OpenStack-native would still need Keystone) or break the OpenStack-upstream compatibility. The two-layer model is the cost of being OpenStack-native at the Core layer. Practically, once learners internalize "OVHcloud IAM = AD at corporate level, Keystone = local groups on a server", it stops feeling like complexity.
 
**Q: What happens if I grant an OVHcloud IAM policy on a Public Cloud project but no OpenStack role?**
A: The user sees the project in the Manager — it is listed in the navigation, the project ID is visible, billing-related views may work depending on the policy — but any action that hits the OpenStack API returns `403 Forbidden`. Instance list returns empty, instance creation fails, volume list returns empty. From the user's perspective, "the project is empty". From the trainer's perspective, the Gate 2 from slide 4 is closed.
 
**Q: And conversely — what if a user has an OpenStack role on a project but no OVHcloud IAM access?**
A: They cannot authenticate to the Manager at all — they have no account-wide identity. In theory, if they already possess an `openrc.sh` with valid OpenStack credentials, the OpenStack APIs may still work directly (depending on how OVHcloud's edge enforces IAM ahead of Keystone). In practice, this scenario does not happen — without OVHcloud IAM access, they have no way to obtain credentials in the first place. Treat it as a theoretical curiosity, not a configuration to design.
 
**Q: How do policies attach — to users or to groups? Both?**
A: Both are possible technically; only one is maintainable at scale. Attach policies to groups, put users in groups. When the user's role changes, move them between groups. When the role itself evolves, edit the group's policy and all members inherit the change. Per-user policy attachment is acceptable only for one-off exceptions explicitly documented; in any team larger than 2, it becomes unmanageable within months.
 
**Q: What predefined IAM policies are available out of the box?**
A: The set evolves — refer learners to the Manager → Identity and Access → Policies → Predefined tab for the current list. As of mid-2026 the most-used predefined policies are `Public Cloud Operator` (read-write on Public Cloud, no billing, no project deletion), `Public Cloud Read-only` (read everywhere in Public Cloud), `Billing Read-only` (billing visibility, no infrastructure), `Support Operator` (create and follow support tickets), `Administrator` (everything). Predefined policies are the always-correct starting point — duplicate, trim, attach.
 
**Q: How do action wildcards work in custom policies?**
A: Actions follow a colon-separated hierarchy: `publicCloud:operate:instance:create`, `publicCloud:operate:network:list`, etc. Wildcards work at each level: `publicCloud:operate:instance:*` covers all instance actions, `publicCloud:operate:*` covers all Public Cloud operate actions, `publicCloud:*` covers all Public Cloud actions including read and write. The Manager's policy editor exposes the action picker — use it rather than handwriting URNs; handwritten URNs are a frequent source of typos that silently grant nothing.
 
**Q: What does `--unrestricted` mean on an application credential, and when should I use it?**
A: An `--unrestricted` application credential can be used to create new application credentials. Without the flag, the credential cannot recurse — it can do what its role allows, but it cannot mint successors. Default is restricted, which is what you want 99% of the time. The rare use case is an automation system that itself provisions credentials for downstream services — and even then, prefer a dedicated identity with IAM-level control rather than `--unrestricted`.
 
**Q: How long should an application credential live, and how do I rotate one without breaking the consumer?**
A: Match the expiry to the rotation cadence of the consuming system. 90 days is a reasonable default for backup jobs and CI/CD pipelines if no policy mandates shorter. The rotation pattern is **create-then-swap-then-revoke**: create a new credential, deploy the new `openrc.sh` to the consumer, validate it works, then revoke the old credential. Never delete-then-create — that creates a window of broken automation.
 
**Q: How does Secret Manager handle versioning and rotation?**
A: A secret has a name and one or more versions. Writing a new value creates a new version; previous versions remain accessible until explicitly deleted. The consumer typically fetches "the latest version" — rotation is then a matter of writing version N+1 and triggering a refresh on the consumer (a service restart, a deployment, a cron-driven refresh). For applications that cannot tolerate a fetch failure during rotation, fetch version N and N-1 in parallel and prefer N — the dual-fetch pattern.
 
**Q: What is the realistic state of KMS integration on OVHcloud Public Cloud at the Associate scope?**
A: Service-managed encryption is the default and is in place across the Core surface (Object Storage encryption at rest, Block Storage encryption, Secret Manager encryption). Customer-managed-key integration is being rolled out service by service — the list is documented on docs.ovhcloud.com and changes. At the Associate scope the message is "you should know KMS exists and what it does; for the specific services you care about, check the current docs". Don't memorize a service list — it will be outdated by the time the learner sits the exam.
 
**Q: I want to give an external auditor read-only access for a one-month engagement. What's the right pattern?**
A: Create a dedicated IAM user `<company>-auditor-<initials>-<YYYYMM>` (the date in the name reminds you to deactivate it), put them in an IAM group `auditors` with the `Public Cloud Read-only` policy attached, grant them the OpenStack `reader` role on every project they need to audit. Set a calendar reminder for the end of the engagement to deactivate the user (or delete it). MFA enforced. No application credentials. The audit reflex at the end of the engagement: verify the user is deactivated and no application credentials were created in their name.
 
**Q: What happens to application credentials and Secret Manager entries when an OpenStack project is deleted?**
A: Application credentials are project-scoped — they die with the project. Secret Manager entries live at the OVHcloud organization level, not at the project level — they persist after project deletion. This asymmetry is a real audit footgun: an operator who deletes a stale project may leave behind orphan secrets in Secret Manager that still reference the deleted project's identifiers. The audit step at the end of every project teardown is to delete the corresponding secrets.
 
**Q: How do I handle service accounts when the operator who set them up leaves the company?**
A: The whole point of the application-credential pattern is that this question has no operational impact — the credential is decoupled from the operator's lifecycle. The procedural impact is documentation: the operator's offboarding checklist includes "list the application credentials I created, list the secrets I own, hand them over to my successor". If that documentation does not exist, the audit reflex catches it eventually — but documentation upfront is cheaper than discovery.
 
**Q: Persona Digital Starter — I am alone, why should I bother with IAM groups and application credentials?**
A: Three reasons. First, your future self in 6 months has forgotten which credentials are tied to which scripts — explicit naming and scoping save you from rotating everything when you panic. Second, when you eventually invite a contractor, an accountant, or a freelance developer, the IAM segmentation is already in place — five minutes of work today, hours saved later. Third, application credentials with expiry act as a forcing function for rotation hygiene — credentials with no expiry never get rotated and end up in incident postmortems.
