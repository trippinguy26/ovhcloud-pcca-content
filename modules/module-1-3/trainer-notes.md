# Trainer Notes — Module 1.3 — Compute (Part 1) — Instances, Flavors & Deployment

> Companion script for the trainer animating this module. Reading time before the session: 15 minutes. Pair this document with `slides.md` open in `/presenter` view.

---

## Pre-flight (the day before / morning of)

**Environment**

- Confirm your Module 1.2 demo project is still alive. Source the `openrc.sh`, run `openstack token issue` — must return a valid token. If expired, regenerate the token in the Manager before the session, not during.
- Have a **dedicated demo SSH keypair** ready: `~/.ssh/demo_ed25519` + `.pub`. Do **not** put a personal key on screen — learners screenshot.
- Open the Manager in a second browser tab, signed in, on the demo project. Keep it untouched until step 10 of the demo.
- Terminal at 16pt minimum, dark background, one tab only. Hide notifications.
- Pre-write the Terraform read-only snippet in a text editor (about 10 lines of HCL — `provider "openstack"`, `resource "openstack_compute_instance_v2"`, the same image / flavor / keypair / network arguments as the demo). Ready to Alt-Tab to at step 14.

**Room calibration**

- Check that all learners completed Module 1.2 and still have their `<initials>-northwind-staging` project alive. If 2+ don't, allocate 5 extra minutes to the *Sentier battu* block to re-source the RC file together.
- Ask before starting: "Who is running Windows with PuTTY?" If 2+, plan to handle the PuTTYgen key conversion in parallel during the lab.
- Anticipate: ex-VMware learners will mentally compare every choice to vSphere. That's healthy — give them the legacy → cloud bridge each time, don't fight it.

**Mental posture for the module**

This is the **first "something runs"** module of the program. After 1.2 gave the learner an authenticated working environment, today's deliverable is a host with an IP. The emotional reward at the end of the lab matters — protect the 30 minutes, don't let theory creep in.

The hardest mental shift is **catalog-based provisioning** (no custom sizing). Explain it calmly, don't minimize the friction. The ex-VMware reaction is legitimate.

---

## Block 1 — Sentier battu / Hors piste (5 min)

**Posture**: rapid check-in, not a lecture. Use the slide as a screen-share reference, don't read it aloud.

- Ask out loud: *"Who has a working `openrc.sh` from yesterday?"* Hands up. If less than 80%, walk the room through `source openrc.sh` + `openstack token issue` together.
- Ask: *"Who has an SSH keypair on their workstation?"* If less than 50%, run `ssh-keygen -t ed25519` together — 2 minutes, all defaults, done.
- Mention the PuTTY case briefly if relevant (you've spotted them during the pre-flight check). Don't run the PuTTYgen conversion during this block — that happens in parallel during the lab.
- Close the block: *"If anything else is missing, raise it now — once we move to theory, I won't pause."*

**Anti-pattern**: do not start a live Module 1.2 demo to "refresh memories". This is a 5-minute block, not a remediation block. Anyone fundamentally lost on 1.2 needs a 1-on-1 at the break.

---

## Block 2 — Theory & Concepts (30 min)

**Pacing rule**: 10 slides in 30 minutes = 3 minutes per slide on average, including transitions. Some slides earn more (S05 ephemeral disk, S07 SSH, S08 three channels). Some earn less (S04 flavor naming, mechanical once decoded).

### S01 — From a VM you built to a VM you ordered (3 min)

The opener and the most important slide of the block. Verbalize the mental shift explicitly: *"You stop building VMs. You start ordering them. That's the first cultural shift."*

- Acknowledge the friction directly, especially to ex-VMware: *"Yes, no custom sizing. Yes, that feels constraining. The trade-off is speed and predictable cost."*
- If an ex-AWS learner is in the room, drop the AWS bridge: *"AWS calls this an instance type. Azure calls it a VM size. Same mechanic, different word."*

**Anticipate**: *"And if I really need 2.5 vCPUs?"* → Take the next flavor up. The cost delta is negligible compared to the engineering cost of an exception.

### S02 — Anatomy of an instance — five things you choose (3 min)

The "deploying = composing" realization. Walk the Mermaid diagram left to right, naming each object. Stop after each name.

- Verbalize: *"The five objects already exist in the project. We don't create them at instance time. We reference them."*
- Mention the Nova vocabulary (Flavor, Image, Keypair, Network, Security Group) so they recognize it later in CLI output.

**Quick check**: *"The SSH keypair — where does it live? In the project, or in the instance?"* Correct answer: in the project.

### S03 — Flavor families (4 min)

Walk the six families one by one. For each, give a workload signature in one sentence.

- For Northwind PostgreSQL host (coming in Module 1.4): *"`b3` or `r3` depending on memory pressure. We'll decide tomorrow."* Plant the seed.
- For Digital Starter learners: *"In practice, `d2` and `b3` cover 95% of your needs. Resist the urge to over-engineer."*

**Anticipate**: *"Is GPU (`t1` / `t2`) in scope for Associate?"* → For awareness yes, for hands-on no — that's the AI tier of certifications.

**Anti-pattern**: do not recite every RAM-to-vCPU ratio. The doc is the authority. The skill here is to know **which family fits which workload**, not memorized numbers.

### S04 — Decoding a flavor name (2 min)

Mechanical once explained. Use the `b3-8` typography and the legend to dissect it once, then run through the examples (`d2-2`, `r3-32`, `i1-15`) quickly.

- Verbalize the reflex: *"Prefer the latest generation. Older ones get phased out."*
- If asked for full RAM ratios: redirect to the official doc. *"It's in the catalog at the time you pick."*

### S05 — Ephemeral local disk — the cloud-native gotcha (4 min)

**This is the slide where ex-VMware learners get caught.** Slow down.

- Verbalize: *"A VMware VM's disk survives the VM. Here, it doesn't. Delete the instance, the local disk is gone forever. No recycle bin, no support ticket recovery, no undo."*
- Install the reflex out loud: *"OS on local. Application data on a Block Storage volume. Always."*
- Use the SAN LUN analogy explicitly — it lands with the persona.

**Anticipate**: *"What about a stop, not a delete?"* → The local disk survives a stop. It only dies on delete.

**Anti-pattern**: don't hand-wave this slide. The reflex it installs (`A03` attitude — anticipate data loss) is what differentiates a Core Associate from someone who learned cloud by copy-paste.

### S06 — Image catalog (2 min)

Quick, factual. Three lanes: public (maintained by OVHcloud), Marketplace (third-party apps layered on top), Private (your own snapshots, Module 1.4).

- Mention the Windows surcharge explicitly — it matters for Corporate sizing conversations.
- If asked about BYOL: exists under SPLA for Corporate, talk to the AM, out of scope here.

**Anti-pattern**: don't get into private image strategy. That's the snapshots topic of Module 1.4.

### S07 — SSH key authentication (4 min)

**Second high-value slide of the block.** The "no root password" posture is non-negotiable; it's attitude `A02` of the framework.

- Walk the Mermaid: workstation generates the pair, public key uploaded to the project, injected into the instance at first boot via cloud-init.
- Verbalize: *"The private key never leaves your workstation. Not in Git, not in a shared drive, not between teammates. Each engineer, their own pair."*
- Reinforce: *"You SSH as `ubuntu` (or `debian`, `rocky`...), never as `root`. You elevate with `sudo` if you need to."*

**Anticipate**: *"What if I lose my private key?"* → The instance becomes inaccessible by SSH. Recovery via Rescue mode (Module 1.4) or by redeployment. Plant the seed for tomorrow.

### S08 — Three deployment channels (4 min)

**Third high-value slide. This is the "aha" moment.**

- Verbalize the realization explicitly, slowly: *"Manager. CLI. Terraform. All three call the same OpenStack Nova API. A resource you create in one appears in all the others. The Manager is not a separate tool — it's a face on the API."*
- Give the rule of thumb plainly: *"One-shot exploration: Manager. Scripted manual ops: CLI. Reproducible team infrastructure: Terraform."*
- Mention Module 3.1 as the dedicated Terraform module. Today is a teaser.

**Anticipate**: *"Then why do we still use the Manager?"* → Honest answer: entry point, visual debugging, one-shot operations, fast state reading.

### S09 — Standard vs Flex (3 min)

Table-based, factual. Walk the table top to bottom.

- Key point to land: *"Resize up = supported on both, usually with a short reboot. Resize down = never. Plan upward."*
- Standard vs Flex is decided at deployment and frozen — no migration path.

**Anticipate**: *"What if I really need to shrink?"* → Honest answer: deploy a new smaller instance, migrate the data, retire the larger one. Common cloud constraint, not OVHcloud-specific.

### S10 — Northwind staging stack (1 min)

Closing slide of the block. The grayed-out Mermaid (API + PostgreSQL hosts greyed for Module 1.4) tells the learner exactly what's about to happen.

- Verbalize: *"Today we deploy one host. The web frontend. Minimal setup — no hardening, no cloud-init, no snapshot. The CTO walks in tomorrow and says 'now make it production-grade'. That's Module 1.4."*
- Announce the lab specs out loud one final time: region GRA, image Ubuntu 24.04 LTS, flavor `d2-2`, name `<initials>-nw-web-01`.

**Transition out of theory**: *"Now I'll do it once in front of you, via the CLI. Then it's your turn, via the Manager."*

---

## Block 3 — Trainer Demonstration (15 min)

**Posture**: you are not lecturing now — you are **operating**. Talk like an operator on a Friday afternoon ticket. Verbalize what you type **before** you press Enter, so learners can predict.

### Setup (do before the block)

Already done in pre-flight. Confirm one last time:
- Terminal sourced, `openstack token issue` works
- Manager open in browser tab #2, on the demo project
- Terraform snippet ready to Alt-Tab to

### Demo script (14 steps)

| # | Action | Verbalize |
|---|---|---|
| 1 | `openstack token issue` | "Module 1.2 environment still valid." |
| 2 | `openstack keypair create --public-key ~/.ssh/demo_ed25519.pub demo-key` | "The public key lives in the project, not in the instance." |
| 3 | `openstack keypair list` | Alt-Tab to Manager > SSH Keys: same entry visible. *"Same object, two angles."* |
| 4 | `openstack image list --public \| grep -i "ubuntu 24"` | "Multiple matches — variants for cloud, server, minimal. We pick Ubuntu 24.04." |
| 5 | `IMG=$(openstack image list --public -f value -c ID -c Name \| grep "Ubuntu 24.04" \| head -1 \| awk '{print $1}')` | "Operator style: we capture, we don't re-type UUIDs." |
| 6 | `openstack network list` | Point to `Ext-Net`. "Public network by default. Deep dive in Module 2.3." |
| 7 | `NET=$(openstack network list -f value -c ID -c Name \| grep "Ext-Net$" \| awk '{print $1}')` | Same capture reflex. |
| 8 | `openstack server create --image $IMG --flavor d2-2 --key-name demo-key --network $NET demo-web-01` | "Status: BUILD. We wait for ACTIVE — about 30 seconds in GRA." |
| 9 | `openstack server show demo-web-01 -c status -c addresses` (run twice) | Wait until status flips BUILD → ACTIVE with an IP. |
| 10 | Refresh Manager browser tab | *"Manager = CLI. One object, two interfaces. No additions on the Manager side, just a different angle of view."* |
| 11 | `IP=$(openstack server show demo-web-01 -f value -c addresses \| sed 's/.*=//' \| awk '{print $1}')` then `echo $IP` | "Mixed v4/v6 in the addresses column, we extract the first v4." |
| 12 | `ssh -i ~/.ssh/demo_ed25519 ubuntu@$IP` (accept host key) | "User is `ubuntu`. Never `root`. We are in." |
| 13 | `uname -a && cat /etc/os-release \| head -3 && df -h /` | Point to `df -h /`: "This disk dies with the instance. Local. Ephemeral." |
| 14 | `exit`, Alt-Tab to Terraform snippet | "And here's what Terraform would write for the same result. Hands-on in Module 3.1." |

### Failure modes (anticipate, don't panic)

- **`keypair create` returns "Public key file not found"**: wrong path. `ls ~/.ssh/`. Regenerate if needed. *Out loud*: "Demo bug, give me 20 seconds." Don't apologize at length, the learner doesn't care.
- **Instance stays in BUILD > 2 minutes**: `openstack server show demo-web-01 -c fault`. Likely quota or region issue. If it doesn't resolve in 30 seconds, **skip to step 10** with a pre-deployed instance you'd staged. Always have a Plan B instance ready in the demo project.
- **SSH times out 90+ seconds after ACTIVE**: cloud-init not done, or default Security Group altered. `openstack security group rule list default`. Verify SSH inbound allowed. Most common cause: cloud-init delay. Wait 30 more seconds.
- **`flavor not allowed`**: project still in Discovery mode. Switch to a Discovery-compatible flavor (`d2-2` is fine) or use an upgraded demo project.

### Closing the demo (2 min Q&A)

Take questions on **the API-behind-everything realization**. Park questions on:
- Cloud-init details → "Module 1.4"
- Security Group hardening → "Module 1.4"
- Terraform syntax → "Module 3.1"
- IPv6 specifics → "Module 2.3"

Write the parked items on a board if you have one. Don't lose them.

---

## Block 4 — Learner Lab (30 min)

**Posture**: you are no longer the protagonist. Circulate silently. Intervene only on blockers.

### Rollout (first 2 min)

- Re-state the brief out loud: *"Deploy one Ubuntu 24.04 LTS instance via the Manager, in your `<initials>-northwind-staging` project, in GRA, flavor `d2-2`, with your SSH key. SSH in, run the three sanity commands. 30 minutes."*
- Restate success criteria once: instance ACTIVE, SSH succeeds with key auth, `/etc/os-release` confirms Ubuntu 24.04.
- Show the Lab — Step-by-step slide and leave it projected for the duration of the lab.
- Set the rules: *"Raise your hand if stuck. Don't help your neighbor unless you've finished and they've raised their hand."*

### During the lab (25 min, circulating)

**Common blockers** (in order of frequency):

1. **`Permission denied (publickey)`** → Wrong user (must be `ubuntu`, not `root`) or wrong `-i` path. *Out loud*: "What user did you type after the `@`?"
2. **`Connection timed out`** → Cloud-init not done (wait 30 more seconds) **or** workstation network blocks outbound port 22. If you suspect corporate network, suggest tethering on a phone hotspot to confirm.
3. **`Flavor d2-2 unavailable`** → Project still in Discovery mode with flavor restrictions. Confirm in the Manager: project details → service offer. If genuinely blocked, escalate to the trainer to swap the learner to a pre-prepared standard project.
4. **Manager shows ACTIVE but no public IP** → Refresh the page once. If still empty after 60 seconds, `Ext-Net` was likely not selected during creation. Delete the instance and redeploy with `Ext-Net` explicitly checked.

**Anti-pattern (yours, not the learner's)**: do not help too early. Let the learner read the error message for 30 seconds first. 70% of the time they unblock themselves. Your role is to validate that the learner reads error output — that's a Core Associate skill.

### Identify pace setters (around minute 15)

Spot the 2-3 learners who've finished by minute 15. Two options:

- Ask them to help neighbors discreetly (peer support is fine once they've succeeded)
- Or ask them a stretch question: *"Can you find your instance via the OpenStack CLI? `openstack server list`. Does it match the Manager view?"*

### Closing the lab (3 min)

- At 27 minutes, announce: *"Three minutes. If you haven't SSHed in yet, raise your hand."*
- At 30 minutes, hard stop. *"The instance stays running. We'll use it tomorrow."*
- Confirm out loud: *"Your `<initials>-nw-web-01` is up. Northwind has its first staging host. We deploy the other two tomorrow, properly."*

---

## Block 5 — Micro-check QCM (5 min)

**Posture**: formative, not certification. Each question is a verification that the LO landed. Show the question, give 30 seconds, ask for a show of hands per option (A/B/C/D), reveal, explain why each distractor is wrong.

**Pacing**: 40 seconds per question on average. 7 questions in 5 minutes is tight but doable if you cut the explanation short on questions everyone gets right.

### Per-question facilitation

**Q1 — IaaS sizing**: Correct = C. Trap = B (ex-VMware reflex: "ask support"). Reframe gently: *"Support won't change the catalog. The catalog is the product."*

**Q2 — Flavor family for Redis**: Correct = B (`r3`). Should be quick. If anyone picks `c3`, walk them through CPU-to-RAM ratio reasoning.

**Q3 — Decoding `b3-16`**: Correct = A. Pure recall. Should be 100% correct. If not, S04 didn't land — flag for repetition tomorrow.

**Q4 — Deleted instance recovery**: Correct = D. The pivotal ephemeral-disk question. If anyone picks A or B, gently reframe with the SAN LUN analogy from S05. This is the `A03` attitude check.

**Q5 — Nova object holding SSH key**: Correct = B (keypair). Should be quick.

**Q6 — Standard vs Flex**: Correct = A (Flex). If anyone picks B, reframe: *"On Standard, the disk is fixed by the flavor. To grow, you change the flavor. Flex is what decouples."*

**Q7 — Root SSH**: Correct = C. The `A02` attitude check. Anyone picking A, B, or D needs gentle but firm correction — no root SSH is non-negotiable.

### After the QCM

If learners flagged systematic gaps (e.g., 3+ wrong on Q4), note them. Plan a 2-minute opener tomorrow morning to re-anchor that LO.

---

## Block 6 — Wrap-up & Transition (5 min)

**Posture**: warm, conclusive, future-oriented. The learner just deployed their first instance — that emotion is real, capitalize on it.

### Recap (90 s)

Walk the seven verbs slowly: define, identify, decode, distinguish, explain, deploy, connect. Pause briefly on each. Don't elaborate — they did it, they know it.

### The "Manager = CLI = API" verbalization (60 s)

Reinforce once more: *"Every channel calls the same API. The Manager isn't a separate product — it's a window into Nova. Everything you saw today, in any channel, you can do in any other. That equivalence is what makes IaaS portable."*

### Transition (90 s)

Walk through the CTO scenario from the slide: *"Web frontend is up. Now the CTO walks back in: 'Nice. Now make it production-grade — restrict SSH to my office IP, inject hardening at first boot, snapshot before anyone touches it, and show me you can read the console if it doesn't come up next time.' That's Module 1.4: lifecycle, security, diagnostics."*

### Logistical close (30 s)

- Confirm break timing.
- Remind: the instance stays running. *"Don't delete it. We use it tomorrow."*
- If anything ended in the parking lot during this module (cloud-init questions, SG hardening, etc.), confirm it'll be answered tomorrow in Module 1.4 — first thing after the morning sentier battu.

**Do not start Module 1.4 here.** Let the day end on the win.

---

## FAQ — Anticipated learner questions (with trainer answers)

These map to the FAQ section of the source markdown but framed as **what to say when asked**, not what to write.

### "Why can't I get custom sizing in OVHcloud Public Cloud?"

> The IaaS model trades per-instance flexibility for catalog speed and predictable cost. Pre-defined flavors let OVHcloud provision in seconds at a known unit price and publish capacity ahead of time. Pick the closest flavor up; the over-provisioning cost is negligible compared to the operational gain. If a workload genuinely needs an exotic CPU/RAM ratio, that's a signal to look at Bare Metal or Hosted Private Cloud, not to fight the catalog.

### "Why is there no root password on a Linux instance? My security team wants one as a fallback."

> Password-based root access is the dominant attack vector against Internet-exposed Linux hosts. Removing the password removes the attack surface. The fallback isn't a password — it's the SSH keypair the customer fully controls, plus Rescue mode (Module 1.4) if the key is lost. CIS and ANSSI baselines recommend exactly this posture: no password, key-only, no root SSH. Explaining it proactively to security teams usually defuses the request.

### "My Flex instance is on a 50 GB local disk. Can I shrink it back to 25 GB?"

> No. Resize-down isn't supported on Flex. Growth is one-way. If you genuinely need less, deploy a new instance with a smaller Flex disk, migrate the data, retire the larger one. This isn't OVHcloud-specific — it's how block-level resize works across most cloud providers. Practical implication: at initial sizing, slightly under-provision and grow as needed, rather than over-provisioning to "be safe".

### "Marketplace images for Plesk / Docker / Nextcloud — should I use them for Corporate?"

> Generally no for Corporate. Marketplace images bundle a third-party app on top of a public OS image — convenient for a one-off setup, but the application lifecycle becomes owned by a third party, and the image is a black box from a hardening perspective. Corporate IT typically wants a clean public OS image plus their own configuration via Ansible, Salt, or custom user-data. Marketplace is a fine fit for self-service Digital Starter learners on a small project, not for a Corporate staging stack.

### "GPU for an internal ML PoC — is that Core Associate scope?"

> GPU flavors (`t1`, `t2`) exist and are mentioned at Associate level for awareness. Actual GPU operations — CUDA, drivers, NVIDIA toolkit version management — are AI tier of the OVHcloud certifications, not the Core program. For a one-off PoC, you deploy a GPU instance with exactly the procedure from today's lab, just a different flavor name. The complexity is in the OS-layer GPU setup, which is the customer's responsibility on Public Cloud Core.

### "How is a snapshot different from a Marketplace image or a public image?"

> A snapshot is a **private image** captured from one of your own running instances. Public images are OVHcloud-maintained (Ubuntu, Debian, Rocky...). Marketplace images are third-party-maintained. All three live in the same Glance object catalog with different visibility scopes. Snapshots are covered in Module 1.4 because they're part of the lifecycle workflow, not the deployment workflow.

### "Why bother showing three channels if the lab only uses one?"

> Because the operator must know which channel to reach for in which situation, even before having executed all three. The Manager is the entry point — today. The CLI is the daily operator tool — leaned on by Module 2.x. Terraform is the team and production tool — written in Module 3.1. Showing all three in the same room prevents the wrong reflex (scripting bash around the Manager). Executing only one per module respects cognitive budget; the others get their own hands-on later.

---

## Post-session — Trainer self-debrief

Take 10 minutes at the end of the day to write down:

- Which slides drew the most clarifying questions? (Candidate for refinement.)
- Did any learner stay stuck on SSH despite all the support? (Candidate for Sentier battu reinforcement in Module 1.4.)
- Did the "Manager = CLI = API" moment land? (Look for the body language at S08 and the demo step 10.) If not, repeat the verbalization at the start of Module 1.4.
- Did the lab fit in 30 minutes for >80% of learners? If not, the brief or the steps slide may need tightening.

Feed observations back into the module source if changes are warranted — open a `fix/module-1-3-*` branch, don't patch in place.
