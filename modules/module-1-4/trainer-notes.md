# Module 1.4 — Compute (Part 2) — Trainer FAQ

**Audience**: trainer, read before the session.
**Purpose**: vetted answers to questions the persona is most likely to ask during this module. Not a script for delivery — the in-slide notes (HTML comments in `slides.md`) carry the in-session action script. This file is the depth bench: when a learner asks the question, the trainer already knows the answer and its limits.

**Module covers**: `LO-CMP-S05`, `LO-CMP-S06`, `LO-CMP-S07`, `LO-CMP-S08`, `LO-CMP-S09`, `LO-CMP-A02`, `LO-CMP-A03`.

---

## Q1 — Why do Security Groups have no DENY rules? My on-prem firewall team builds entire policies around explicit denies.

Cloud Security Groups are intentionally constrained to ALLOW-only because the default is DENY — so any rule you add is an exception, and the rule set stays small and auditable. Network ACLs (which do exist on some hyperscalers, e.g., AWS NACL) cover the explicit-DENY use case at the subnet level, but Core OVHcloud does not expose this primitive in the Public Cloud catalog. The pragmatic answer for the ex-on-prem team: use IAM scoping, private networks (Module 2.3), and Security Group composition to model "this tier talks to that tier, nothing else." Explicit DENYs in a stateless ACL layer are rarely the right tool at cloud scale.

**LO traced**: `LO-CMP-S05`, `LO-CMP-A02`.
**Likely asker**: Corporate persona, network/security background.

---

## Q2 — Cloud-init runs only at first boot — what if I want to apply a config change on the 50 already-running instances?

That's the boundary where cloud-init ends and configuration management begins (Ansible, Salt, Puppet). Cloud-init's job is to take an instance from "blank image" to "minimal viable host" — once. Anything that needs to evolve over time, or apply uniformly across an existing fleet, belongs in a config-management tool that pushes (or pulls) changes on schedule. Trying to repurpose cloud-init for ongoing configuration is a well-known anti-pattern; the result is a YAML file that nobody dares change because it only runs at re-creation. Operationally: cloud-init for bootstrap, Ansible for steady state.

**LO traced**: `LO-CMP-S06`.
**Likely asker**: Corporate persona, ex-VMware or ex-on-prem moving from manual config to IaC.

---

## Q3 — Are snapshots a backup? Can I rely on them for disaster recovery?

A snapshot is **not a backup** in the disaster-recovery sense. It is a private image stored in the same project, in the same region, that captures the local disk at a point in time without application-level consistency (a running database is captured mid-flight). For a true backup you need: (1) application-consistent dumps (`pg_dump`, `mysqldump`, application-quiesce-then-snapshot), (2) storage in a separate failure domain — typically Object Storage in a different region, (3) restore tests on a schedule. Snapshots are an excellent **fast rollback** tool ("before I touch this"), and a building block in a backup strategy, but they are not the strategy by themselves.

**LO traced**: `LO-CMP-S07`, `LO-CMP-A03`.
**Likely asker**: any persona with production responsibility. This is the single most-asked question of the module.

---

## Q4 — When I take a snapshot, my instance hangs for 5-10 seconds. Is that normal? Can I avoid it?

It depends on the size of the local disk and the IO activity at the moment of snapshot. For a small Discovery (`d2`) instance with idle IO, the visible interruption is sub-second. For an `i1` instance under heavy write load, it can be longer. There is no zero-impact snapshot in this model — even Block Storage volume snapshots have a brief IO quiesce. Mitigation patterns: take snapshots during low-traffic windows, or for stateful services (databases) move the data onto Block Storage and snapshot the volume separately, with the application briefly quiesced.

**LO traced**: `LO-CMP-S07`.
**Likely asker**: Corporate persona with latency-sensitive workloads. Often arrives as a complaint, not a question.

---

## Q5 — My Rescue mode session shows a different password each time. Is there a way to keep it the same, or use my SSH key?

No — the Rescue mode temporary password is regenerated at each activation, and it does not accept SSH keys (the rescue image is minimal). This is by design: Rescue is a one-shot recovery channel, not a permanent administrative back door. The temporary password is displayed only in the Manager (or the API response that triggered Rescue), and it only works during that Rescue session. If you need a permanent emergency access mechanism, that's an architectural concern — a bastion host with hardened access, an out-of-band management network, or for the very high end, a separate dedicated VPN. None of those are in the Core Associate scope.

**LO traced**: `LO-CMP-S08`.
**Likely asker**: Corporate persona, security team representative. Sometimes framed as a compliance concern.

---

## Q6 — The console log shows "system halted" with no further detail. What do I do next?

That's a sign the kernel panicked or the initrd failed to mount the root filesystem — both indicate a deeper issue, often a recent `apt full-upgrade` that broke the boot chain or a malformed `/etc/fstab`. The right next step: Rescue mode, mount the original root disk as secondary, inspect `/etc/fstab` and `/boot/grub/grub.cfg`, check `journalctl --boot=-1` from the rescue environment by chrooting into the original root, fix, exit Rescue. If the issue is unclear, taking a snapshot of the broken state before any change is wise — it lets you experiment without losing the evidence.

**LO traced**: `LO-CMP-S08`, `LO-CMP-S09`.
**Likely asker**: experienced operator persona during the Demo or after the Lab when something has actually broken on their own instance.

---

## Q7 — Can I share a cloud-init file with secrets in it (DB passwords, API tokens) — is the user-data encrypted at rest?

The user-data is stored by the cloud and made available to the instance via the metadata service — which is reachable from any process on the instance. Anyone with shell access to the instance can read it via `curl http://169.254.169.254/...`. Treat user-data as **non-confidential**: never put secrets directly in cloud-init. The right pattern is to inject a minimal bootstrap that fetches secrets from a secret store (HashiCorp Vault, OVHcloud Secret Manager when available, encrypted Object Storage with IAM-restricted access) at first boot. For the Core Associate scope, the simplest acceptable pattern is: cloud-init creates the OS user and SSH key, and the engineer SSHes in once to drop the production secrets manually. Anything more advanced is a Pro-tier topic.

**LO traced**: `LO-CMP-S06`, `LO-CMP-A02`.
**Likely asker**: developer persona or security team representative. Comes up specifically during the cloud-init theory slides or the lab.

---

## Cross-module forward references collected from this module

For convenience, the topics the trainer is most likely to be asked about that **point forward** to later modules — useful to anchor a "we'll cover this in" answer without having to re-derive the mapping live:

| Topic raised | Forward reference |
|---|---|
| Volume snapshots, consistent DB backup, persistent storage for the DB tier | Module 2.1 — Block Storage |
| Private network between the 3 Northwind tiers, inter-tier traffic off the public Internet | Module 2.3 — Private Network |
| Object Storage for build artifacts, backups, snapshots stored cross-region | Module 2.2 — Object Storage |
| Terraform hands-on for SG + instance + user_data | Module 3.1 — IaC Essentials |
| Centralized identity, MFA, role separation | Already in Module 1.2; deepened in the Pro tier |
| OS-layer hardening (CIS, ANSSI, fail2ban, auditd, SELinux) | Out of scope Core Associate; Pro tier |
| GPU operations (CUDA, drivers) | Out of scope Core; AI Associate certification |
| Managed Databases as alternative to self-managed PostgreSQL | Out of scope Core; DBaaS Associate certification |
| Windows-specific cloud-init (cloudbase-init) | Out of scope Core Associate |
