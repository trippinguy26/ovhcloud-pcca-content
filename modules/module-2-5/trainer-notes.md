---
# ============================================================
# Module 2.5 — Identity, Access & Security — Beyond Basics
# Trainer notes — preparation deck
# ============================================================
theme: ../../theme-ovhcloud
title: Identity, Access & Security — Trainer Notes
class: text-left
mdc: true
exportFilename: 'modules/module-2-5/trainer-notes'
controls: false
download: false
selectable: true
moduleId: "2.5"
moduleTitle: "Identity, Access & Security — Beyond Basics"
duration: "1h30"
program: "OVHcloud — Public Cloud — Core Associate"
los: [LO-SEC-K01, LO-SEC-K02, LO-SEC-K03, LO-SEC-K04, LO-SEC-K05, LO-SEC-K06, LO-SEC-S01, LO-SEC-S02, LO-SEC-S03, LO-SEC-S04, LO-SEC-S05, LO-SEC-A01, LO-SEC-A02]
layout: trainer-cover
---

# Module 2.5 — Trainer Notes
## Identity, Access & Security — Beyond Basics

Preparation deck · ~10 min read · Pair with `slides.md` in `/presenter`

---
layout: default
---

# Pre-flight

- Northwind 2.4 stack alive (LB+HTTPS, Gateway, API/DB private-only). If down, `module-2-4/recover-network-state.sh` (~5 min).
- Trainer = admin on the OVHcloud organization. Customer-org training → switch to the prepared sub-account before the session.
- Second browser ready for private-window sign-in as `demo-developer` at demo step 4.
- Two findings pre-planted on the demo project: trainer = `administrator` (should be `member`) + one orphan IAM user. Surface at demo steps 10-11.
- `fetch-secret.sh` deployed on `demo-api-01` at `/usr/local/bin/`.
- Closing module of Day 2, end of afternoon. High-leverage — anchor S04 (two gates) and S07 (app credentials) above all else.

---
layout: default
---

# Block 1 — Sentier battu (5 min)

**Posture**: rapid check-in, not a lecture.

- Hands up on OVHcloud org admin access. <80% → switch to the sub-account now, not at demo step 1.
- Northwind 2.4 up? If >30% out, fire `recover-network-state.sh` during this block.
- Test private-window sign-in: not trivial for everyone, surfacing now saves 10 min at the lab.
- Close: *"OVHcloud IAM = account-wide, Keystone = inside one project. Both required. Proven slide 4."*

**Anti-pattern**: do not start explaining the two-layer model here. Calibration only.

---
layout: default
---

# Block 2 — Theory (30 min)

**Posture**: 2.5 min/slide average. High-value moments; routine slides follow `slides.md` inline notes.

- **S02** two-layer model: 2 full min. AD analogy for legacy profiles. Ex-AWS: *"AWS has one IAM; OVHcloud has two because Public Cloud is OpenStack-native."*
- **S04** two gates: *pivot slide*. Demand the room recites *"IAM allows but call fails = no Keystone role"*. If not, redo.
- **S07** app credentials: anchor reflex `A02`. *"Non-interactive workload = app credential, no exception."*
- **S09** KMS: stay honest. Awareness, not skill. *"List evolves, check docs."*
- **S10** audit reflex: *"Goal is not zero findings, goal is to know where they are."*

**Anti-pattern**: don't recite the predefined policy list. Manager UI is authority, the set evolves.

---
layout: default
---

# Block 3 — Demo (15 min)

**Posture**: operating, not lecturing. Two browsers visible.

<div class="text-xs">

| # | Action | Verbalize |
|---|---|---|
| 1-3 | IAM user `demo-developer` + policy duplicate-trim + group `demo-devs` | *"Groups own policies, users join groups."* |
| 4 | Private browser as `demo-developer`, demo project | *"Visible. Delete — blocked. Billing — blocked."* |
| 5-7 | App credential `member` 24h restricted **off** → `server list` OK → `image create --public` 403 | *"Scope confirmed. Backup tries this → fails fast."* |
| 8-9 | Secret Manager → `demo-postgres-password` → SSH `demo-api-01` → `fetch-secret.sh` | *"Encrypted. Lab wires this into systemd ExecStartPre."* |
| 10-12 | `role assignment list` over-priv · orphan filter · `app credential list` expired | *"Three findings, five seconds. Reflex `S05`."* |

</div>

**Failures**: Step 4 → IAM propagation up to 30s · Step 6 → `OS_AUTH_TYPE=v3applicationcredential` missing · Step 9 403 → credential lacks secret read, surface live · Step 10 empty → add `--project-domain default`.

---
layout: default
---

# Block 4 — Lab (30 min)

**Posture**: circulate silently. Identity bugs are subtle; let learners read errors.

- Rollout: four moves — IAM identity, app credential, secret externalization, audit. Project the Step-by-step slide.
- Top blockers: IAM propagation 30-60s · missing `OS_AUTH_TYPE` line · `fetch-secret.sh` 403 (secret policy not granted) · `config.yaml` edited *before* `ExecStartPre` wired.
- >50% in retard at 20 min → declare step 12 (S3 secret) optional. PostgreSQL pattern anchored, S3 is repetition.
- Close: 5-min warning at 25, hard stop at 30. *"Findings stay in your repo. We look at them Day 3."*

**Anti-pattern**: do not pre-validate scoping for the learner. They must open the private window themselves and *see* the absent Delete button.

---
layout: default
---

# Block 5 — Micro-check (5 min)

**Posture**: formative, 40 s per question.

- **Q1** (IAM vs Keystone, `K01`) and **Q4** (app credential pattern, `K04`/`S03`) are pivotal.
- 3+ wrong Q1 → plan a 2-min opener at Module 3.1 (IaC hits the same two-gate model).
- Wrong Q4 → replay S07. *"Lifecycle of a human bleeds into automation."*
- **Q7** (audit, `S05`/`A02`) and **Q8** (segmentation, `A01`) test attitude — signal whether learner internalized *posture* or just *facts*.

---
layout: default
---

# Block 6 — Wrap-up (5 min)

**Posture**: warm, conclusive. Day 2 closes here.

- Recap the verbs: distinguish, explain, identify, create, generate, store, audit, recommend, justify.
- Final anchor: *"Application credentials over personal credentials. No exception. Even alone."*
- Transition to 3.1: *"Network production-shape. Identity production-shape. But everything by hand. Tomorrow we rebuild it in 10 min from `terraform apply`."*

**Anti-pattern**: do not start Module 3.1 here. End Day 2 on the audit-reflex win.

---
layout: two-cols
---

# FAQ (1/2)

::left::

<div class="-mt-8">

**"Why two IAM layers — AWS-style complexity?"**

OpenStack ships Keystone (project-scoped, native). OVHcloud wraps the account around it (billing, support, lifecycle, vRack), and that wrapper needs its own identity. Collapsing breaks OpenStack-native compatibility. Frame as clean separation: IAM = corporate AD, Keystone = local groups on a server.

**"IAM allows but my call fails?"**

Gate 2 closed: no Keystone role. One-line diagnostic: `openstack role assignment list --user <u> --project <p> --names`. Empty → grant the role. Highest-recurrence support case in the field.

</div>

::right::

<div class="-mt-8">

**"Policies on users or groups?"**

Always groups. Direct user attachment loses maintainability, auditability, one-click revocation. Test: *"Explain to your security officer in 30s who has admin on prod."* With groups: "everyone in `admins`." Per-user: an investigation.

</div>

---
layout: two-cols
---

# FAQ (2/2)

::left::

<div class="-mt-8">

**"`--unrestricted` on an app credential?"**

The credential can mint *other* credentials. Restricted (default) is right 99% of the time. Legitimate case = enterprise IAM-automation, and even there a dedicated IAM identity is usually better. Lab rule: leave it off.

**"App credential expiry — rotation?"**

90 days default. Never *no expiry*. Pattern **create → swap → revoke**, in that order. Reverse = guaranteed broken-automation window.

</div>

::right::

<div class="-mt-8">

**"Digital Starter alone — overkill?"**

No. Future-self forgets which credentials belong where. You won't stay alone forever. Expiries force rotation hygiene no calendar delivers. Digital Starter suffers *most* when skipped, not least.

</div>

---
layout: default
---

# Post-session debrief

- Did S04 (two gates) land? Confused questions persisting into the lab → reframe the slide.
- Audit checklist actually surfaced findings, or empty notes? Empty → pre-planted findings too subtle.
- Was `fetch-secret.sh` (step 11) a blocker for >2-3 learners? If yes, `ExecStartPre` deserves its own slide.
- `A02` (app credential over personal) landed? Next-day test: *"Yesterday's backup — what credential does it use?"*
- Parking-lot question you couldn't answer cleanly? Add to FAQ before next delivery.
