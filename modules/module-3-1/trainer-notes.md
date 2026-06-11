---
# ============================================================
# Module 3.1 -- Infrastructure as Code Essentials -- CLI & Terraform
# Trainer notes -- preparation deck
# ============================================================
theme: ../../theme-ovhcloud
title: Infrastructure as Code Essentials -- Trainer Notes
class: text-left
mdc: true
exportFilename: 'modules/module-3-1/trainer-notes'
controls: false
download: false
selectable: true
moduleId: "3.1"
moduleTitle: "Infrastructure as Code Essentials -- CLI & Terraform"
duration: "1h30"
program: "OVHcloud -- Public Cloud -- Core Associate"
los: [LO-IAC-K01, LO-IAC-K02, LO-IAC-K03, LO-IAC-K04, LO-IAC-S01, LO-IAC-S02, LO-IAC-S03, LO-IAC-S04, LO-IAC-S05, LO-IAC-S06, LO-IAC-S07, LO-IAC-A01, LO-IAC-A02]
layout: trainer-cover
---

# Module 3.1 -- Trainer Notes
## Infrastructure as Code Essentials -- CLI & Terraform

Preparation deck · ~10 min read · Pair with `slides.md` in `/presenter`

---
layout: default
---

# Pre-flight

- Day 3 opener. Learners return overnight. Start with energy, not admin.
- `openrc.sh` sourced in terminal **as an app credential** (not personal credentials -- model `A02` before the module starts).
- `terraform init` already run on trainer machine. Providers downloaded. Do NOT live-code `main.tf` -- it must be pre-written at `modules/module-3-1/lab/demo/main.tf`.
- Manager UI open in a separate window, Public Cloud project visible. Side-by-side with terminal during demo.
- Terminal at 16pt+, dark background. Zoom in before starting Block 3.
- Verify Terraform installed on all learner machines NOW, during Sentier battu. It is the #1 lab blocker. One-liner installer in the lab handout.

---
layout: default
---

# Block 1 -- Sentier battu (5 min)

**Posture**: diagnostic check, not a lecture.

- Hands up: *"openstack token issue returns a valid token?"* If >30% blocked, fire the recovery steps now.
- Hands up: *"terraform version returns v1.5 or above?"* If <70% yes, announce the one-liner installer and move on -- do not wait.
- Address Terraform vs Ansible immediately if someone raises it: *"Terraform creates the server. Ansible configures what runs inside it. Different layers, both useful."* Park further detail.
- Close: *"Today Northwind becomes a text file. CLI is your audit tool. Terraform is your deploy tool."*

**Anti-pattern**: do not explain HCL syntax here. One sentence max.

---
layout: default
---

# Block 2 -- Theory (30 min)

**Posture**: 3 min/slide average. High-value moments below; routine slides follow inline `slides.md` notes.

- **S01** (where we left off): ask *"how long to rebuild Northwind from scratch?"* Let the room estimate. Silence after 4h/8h answers is more effective than any slide.
- **S02** (three control planes): reach consensus before continuing. *"CLI = verify. Terraform = deploy. Both are production tools."*
- **S03** (IaC definition): on-prem analogy lands best for Corporate -- *"rack cabling diagram + runbook + change ticket, collapsed into one executable file."*
- **S08** (workflow): insist on *"plan touches nothing."* It resolves 80% of the fear of making mistakes.
- **S10** (state): the *"not a backup"* correction must be explicit. Ex-on-prem profiles assume state = snapshot. Correct it once, firmly.

**Anti-pattern**: do not enter remote state, workspaces, or Terraform modules. One *"that's Professional level"* is enough.

---
layout: default
---

# Block 3 -- Demo (15 min)

**Posture**: operating, not lecturing. Manager UI visible throughout.

<div class="text-xs">

| # | Action | Verbalize |
|---|---|---|
| 1 | `openstack server list` | *"Voila le stack Northwind construit en 2 jours."* |
| 2 | `openstack quota show` | *"On verifie la marge avant de deployer."* |
| 3 | `cat main.tf` + `providers.tf` | *"Un fichier HCL. Lisible. Comparable via git diff."* |
| 4 | `terraform init` | *"Hashicorp pulls the OpenStack provider binary."* |
| 5 | `terraform plan` | Walk the `+2 to add` output. Point to Manager -- nothing changed. |
| 6 | `terraform apply` → yes | Watch Manager UI. Resources appear in real time. |
| 7 | `openstack server show nw-demo-tf` | *"Same data, different surface. CLI = verification layer."* |
| 8 | `terraform destroy` → yes | Watch Manager. Stack gone in ~30s. |
| 9 | `terraform apply` → yes, time it | *"From nothing to running in under 3 min."* |
| 10 | `cat terraform.tfstate \| jq '.resources[].type'` | *"The state maps config names to cloud IDs. Not a backup."* |

</div>

**Failures**: Image not found → `openstack image list --public | grep Ubuntu`, update `image_name` · Auth fail → openrc not sourced or `TF_VAR_` not set · 409 Conflict → quota, run `openstack quota show` · State corrupted → `terraform init -reconfigure`.

---
layout: default
---

# Block 4 -- Lab (30 min)

**Posture**: circulate silently. IaC errors are readable -- let learners diagnose.

- Rollout: five steps -- CLI audit, Terraform init+plan, apply+verify, destroy+apply again, commit. Project the Step-by-step slide.
- Top blockers: Terraform not installed (caught in B1) · image ID stale (step 2c: `openstack image list --public | grep Ubuntu`) · `terraform.tfstate` accidentally `git add`-ed.
- The destroy+apply cycle (steps 7-8) is the pedagogical peak. Encourage learners to time it and write it down.
- >50% behind at 20 min → step 9 (state inspection) becomes optional. The reproducibility proof (step 8) is non-negotiable.
- Close: 5-min warning at 25. Hard stop at 30. *"If you committed the .tf files, you finished the module."*

**Anti-pattern**: do not show learners how to fix their Terraform errors before they have read the error message themselves.

---
layout: default
---

# Block 5 -- Micro-check (5 min)

**Posture**: formative, 40 s per question.

- **Q1** (`K01`, four IaC benefits) is recall. If rate <70% → the four words are exam material, repeat them.
- **Q5** (`S07`, state file) tests the *"not a backup"* correction. Missed here = will cause prod incidents.
- **Q6** (`A02`, manual change trap) and **Q7** (`A01`, IaC-first posture) are the attitude questions. Wrong Q6 → the learner will keep making manual changes in prod. Replay S10.
- Wrong Q3 (provider selection) → the Horizon rule from S07 did not land. Restate in one line.

---
layout: default
---

# Block 6 -- Wrap-up (5 min)

**Posture**: conclusive, Day 3 morning closed.

- Let learners read the "You can now" list silently for 30 s. It is their exam aide-memoire.
- Final anchor: *"IaC-first. Update the .tf file before touching the infrastructure. No exception."*
- Transition to 3.2: *"Northwind is now a file. It is reproducible. Production is live. The next question is: what is it doing right now? That is Module 3.2."*

**Anti-pattern**: do not open remote state, Terraform Cloud, or workspaces. One *"Professional level"* dismissal is enough.

---
layout: two-cols
---

# FAQ

::left::

<div class="-mt-8">

**"Terraform vs Ansible -- do I need both?"**

Yes, at scale. Terraform provisions the server (create, resize, destroy). Ansible configures what runs inside it (packages, config files, services). They operate at different layers. For Northwind at Associate scope, Terraform alone is enough -- there is no configuration management yet.

**"What if `terraform apply` fails halfway?"**

Terraform updates the state for every resource that succeeded before the failure. On the next `apply` it only retries the remaining resources. Partial state is normal, not corrupting. The rare exception: a resource that is partially created and not importable may require `terraform state rm` and a manual delete.

</div>

::right::

<div class="-mt-8">

**"The IDs changed after destroy+apply -- is that normal?"**

Yes. Destroy deletes the cloud resources. Apply creates new ones. The cloud assigns new UUIDs. This is why you should never hardcode resource IDs in downstream configs -- use Terraform outputs or openstack CLI lookups instead.

**"Do we need remote state right now?"**

No. Local state is correct for a solo operator or a small team where one person applies at a time. Remote state (S3 backend, Terraform Cloud) prevents concurrent-apply conflicts and stores the state securely. That is the first Professional-level Terraform topic.

</div>

---
layout: default
---

# Post-session debrief

- Did the `destroy` + `apply` reproducibility proof land as the key moment? If learners did not time step 8, the impact was missed -- add a *"time it"* callout to the step slide.
- Any Terraform install blockers that the pre-flight check missed? If yes, move the install verification earlier (Mod 2.5 wrap-up or morning email).
- Q6 (manual change trap) wrong rate? If >30%, the S10 *"not a backup / not idempotent after manual edits"* framing needs a concrete demo scenario added.
- Did any learner commit `terraform.tfstate`? Add a Git pre-commit hook reminder to the lab handout for next delivery.
- Parking-lot question you could not answer cleanly? Add to FAQ before next delivery.
