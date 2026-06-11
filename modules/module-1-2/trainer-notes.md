---
# ============================================================
# Module 1.2 — Public Cloud Project, Regions & Basic IAM
# Trainer notes — preparation deck
# ============================================================
theme: ../../theme-ovhcloud
title: Public Cloud Project, Regions & Basic IAM — Trainer Notes
class: text-left
mdc: true
exportFilename: 'modules/module-1-2/trainer-notes'
moduleId: "1.2"
moduleTitle: "Public Cloud Project, Regions & Basic IAM"
duration: "1h30"
program: "OVHcloud — Public Cloud — Core Associate"
los: [LO-PCI-K01, LO-PCI-K02, LO-PCI-K03, LO-PCI-K04, LO-PCI-K05, LO-PCI-S01, LO-PCI-S02, LO-PCI-S03, LO-PCI-S04, LO-PCI-S05, LO-PCI-S06, LO-PCI-A01, LO-PCI-A02]
layout: trainer-cover
---

# Module 1.2 — Trainer Notes

## Preparation deck · Public Cloud Project, Regions & Basic IAM

> Reading time before the session: ~15 minutes. Pair with `slides.md` open in `/presenter` view.
---
layout: default
---

# Pre-flight (the day before / morning of)

- **Accounts & vouchers.** Manager access confirmed for everyone, accounts pre-created for shared tenants, vouchers distributed at session start, 2-3 backups in hand.
- **CLI installed.** `openstack` available, fallback container `ovhcloud/openstack-cli:latest` prepped and announced at Block 1.
- **Demo project on a throwaway sub-account**, not your production training tenant — it lingers.
- **Setup.** Manager open on Public Cloud universe, terminal 16pt+ dark background, RC file ready.
- **Posture.** First operational module. Energy shifts from conviction to execution. The lab produces a reusable `openrc.sh` — not a school exercise.

---
layout: default
---

# Block 1 — Sentier battu (5 min) & Block 2 — Theory (30 min)

**Block 1** — rapid prerequisite check, no remediation drift.
- "Who has installed the OpenStack CLI?" If under half: signal the fallback container now.
- Don't replay 1.1 for absentees. Point to the 5-page brief, move on.

**Block 2** — three intertwined concepts learners want to separate but cannot.
- **S01-S03**: project = billing + access + isolation. The ex-AWS reflex is "it's a VPC". Recadrer fermement.
- **S04**: if asked about AZ availability, answer cautiously — a few regions multi-AZ, verified case by case. Don't improvise a list.
- **S06-S07**: highest-friction slides. Verify live: "Who creates an OpenStack user?" Expected: a Manager user, from the Manager.
- **S10**: drill 401 vs 403 explicitly. It returns at every subsequent module.

**Anti-pattern**: speeding through S06 because "it's obvious". It is never obvious for ex-AWS learners. Slow down here.

---
layout: default
---

# Block 3 — Trainer Demonstration (15 min)

Demo · Manager + CLI · project `demo-bootstrap` · region GRA

<div class="text-xs">

| # | Action | Verbalize |
|---|---|---|
| 1 | Manager > Create new project `demo-bootstrap` | "Voila l'entree." |
| 2 | Attach payment method or voucher | "Discovery toggle visible. Today: standard." |
| 3 | Confirm, wait ~30 sec | "L'UUID est ce qui compte, pas le nom." |
| 4-5 | Users & Roles > Add `ops-demo`, role `member` | "User OpenStack local. Mot de passe affiche UNE FOIS." |
| 6 | Download OpenStack RC, pick GRA | "Un RC = une region." |
| 7 | `source openrc.sh`, paste password | "Aucune sortie = succes." |
| 8 | `openstack token issue` | "Token expire. C'est ca qui cause les 403." |
| 9-10 | `openstack catalog list`, `quota show --compute` | "Service catalog et quotas par projet et par region." |
| 11-12 | Create App Credential `demo-app-cred`, show Revoke | "Affiche UNE fois. Rotation et revocation natives." |

</div>

**Failure modes**: command not found → fallback container · trailing space in password → 401 not 403 · empty catalog → wrong region in RC.

---
layout: default
---

# Block 4 — Lab (30 min) · Block 5 — Micro-check (5 min) · Block 6 — Wrap-up (5 min)

**Block 4** — circulate quietly, do not over-help.
- *Lab — Steps* slide stays projected the entire lab.
- Identify 2-3 fast learners early, promote them to peer support.
- Bulk-switch to fallback container on multiple CLI install failures.
- Password with trailing space → 401 not 403, paste in scratch buffer first.
- **Anti-pattern**: jumping at the first hand raised. 70% unblock themselves in 90 seconds.

**Block 5 — Micro-check**: strict 5 min.
- Q5 (Manager vs OpenStack identity): ex-AWS reflex picks A. Take time to recadrer.
- Q7 (403 diagnostic): reinforce 401 vs 403 distinction one more time.

**Block 6 — Wrap-up**:
- Each learner leaves with a working `openrc.sh` — reused from Module 1.3. Make this explicit.
- Park federation questions for Module 2.5. Bridge to 1.3: *"L'environnement est pret. Le CTO debarque: allume-moi les 3 premieres instances."*
- **Anti-pattern**: starting 1.3 here. Let the module breathe.

---
layout: two-cols
---

# FAQ — Anticipated questions

::left::

**Q: Why the Manager / OpenStack identity split?**

Deliberate architecture from OpenStack. Manager owns contract and bill; OpenStack operates the runtime. Lets you delegate operations without exposing the billing account. Trade-off: no built-in SSO in Core (covered in 2.5). Highest-friction concept for ex-AWS learners.

**Q: Application Credential vs user password — when?**

Password for interactive CLI by a human. App Credential for everything else: scripts, CI, Terraform. Scoped, revocable, expirable, decoupled from human users. Rule of thumb: if it runs unattended, it's an Application Credential.

::right::

**Q: What happens when I delete a project?**

All resources deleted, irreversible. Billing stops at deletion, prorated. ID not immediately reusable. Never delete to "clean up" before exporting — Discovery projects evolved into semi-real workloads are the typical trap.

**Q: Region vs availability zone in OVHcloud?**

Region = geographic location with own datacenter and service catalog. AZ = HA sub-region. Most OVHcloud regions are single-zone; a few EU regions are multi-AZ. Verify in the Manager, do not assume. Multi-AZ patterns are Pro-tier.

---
layout: default
---

# Post-session — Trainer self-debrief

Answer after the session. Inputs for the next iteration, not a hidden assessment of the trainer.

- **Identity model landing.** Did the Manager / OpenStack split land at S06, or only during the lab on the first 403? Lab-only means S06 needs harder drilling next time.
- **Lab timing.** Did everyone finish in 25-30 min? Consistently longer = CLI install or password handling bottleneck, not the OVHcloud steps.
- **401 / 403 distinction.** Did Q7 land cleanly? If premature, drill harder at S10 next time, do not remove the question.
- **Segmentation pushback.** Did anyone challenge "one project per environment"? Pushback is healthy. Silence may signal an audience too junior for the corporate framing.
- **Parking lot.** Note questions parked for Module 2.5 (federation, advanced IAM). Feeds the 2.5 trainer notes loop.
