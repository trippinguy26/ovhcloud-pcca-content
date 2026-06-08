# Module 1.2 — Trainer FAQ

> Vetted long-form answers to anticipated learner questions for *Module 1.2 — Public Cloud Project, Regions & Basic IAM*.
>
> **How to use this document.** Read it **before** the session, not during. The slide trainer notes (extracted from `slides.md`) carry the in-session action script (souligner, anticiper, rappeler). This file is the back-pocket reference for the longer questions that may come during Theory — particularly on the identity model — or during the Lab debrief, where authentication and segmentation questions surface as learners run their first CLI commands.

---

## Q1 — "Why does OVHcloud separate the Manager identity (NIC handle) from the OpenStack identity? Other clouds unify them."

It is a deliberate architectural choice inherited from OpenStack and reinforced by the operational logic. The Manager identity owns the contract and the bill; the OpenStack identity operates the runtime. Separating them lets a customer delegate full operational power to engineers (via OpenStack users) without ever exposing the billing-owning account.

Hyperscalers achieve similar isolation differently: AWS uses IAM policies layered on top of a unified root account; Azure uses RBAC on top of an Entra ID tenant. OVHcloud achieves the isolation structurally rather than through policy. The trade-off is real: there is no built-in SSO between Manager and OpenStack in the Core scope. Federation comes in higher tiers and is covered in Module 2.5.

This question is the single most common source of confusion for ex-AWS learners — recognize the symptom (a 403 because the learner expected the Manager session to "carry over" to the CLI) and answer the structural question directly rather than just fixing the immediate error.

---

## Q2 — "Can I use my OVHcloud SSO (Google, Microsoft) to log in to OpenStack directly?"

Not in the Core Associate scope. OVHcloud SSO authenticates you to the Manager only. OpenStack users are local Keystone users with their own passwords and application credentials, completely disconnected from the Manager's authentication chain.

Federated identity to OpenStack — Keystone domains, SAML/OIDC federation, group mapping — is a Professional-tier topic. For Associate-level learners, the practical answer is: yes, you SSO into the Manager; from there you create OpenStack users with their own credentials; those credentials are what your scripts and CLI use.

---

## Q3 — "When should I use an Application Credential vs an OpenStack user password?"

Use a password for interactive CLI work by a human. Use an Application Credential for everything else: scripts, CI pipelines, Terraform runs, monitoring agents, anything that runs unattended.

Three reasons Application Credentials are the right pattern for automation. First, **scope**: they inherit the role of the issuing user but can be revoked independently without touching the user. Second, **lifecycle**: they can carry an expiration date, which forces rotation discipline. Third, **decoupling from humans**: when an engineer leaves the company and their OpenStack user is deleted, automation tied to their password breaks; automation tied to an Application Credential keeps working if the credential was scoped properly.

The rule of thumb to give learners: *if it runs unattended, it's an Application Credential*. Reinforce it during the Lab when learners create their `<initials>-northwind-tf` credential — that credential will be used by Terraform in Module 3.1, not by a human.

---

## Q4 — "What happens to my resources if I delete a Public Cloud project?"

All resources inside the project are deleted: instances, volumes, snapshots, networks, IPs, application credentials. The deletion is irreversible — no soft-delete, no grace period for resource recovery. Billing stops at the moment of deletion, prorated to the hour for hourly resources and to the day for monthly resources.

The project ID itself is freed and not immediately reusable. The project name can be reused after deletion completes.

Practical implication for the audience: never delete a project to "clean up" before exporting what you need. The frequent mistake — especially on Discovery projects evolved into something semi-real — is to delete on impulse and lose configuration, secrets, and snapshots that had not been documented elsewhere.

---

## Q5 — "How is a region different from an availability zone in OVHcloud?"

A **region** is a geographic OVHcloud cloud location with its own datacenter footprint and service catalog (GRA, SBG, BHS, DE, UK, WAW, SGP, SYD, etc.). An **availability zone (AZ)** is a logical sub-region with independent power and network within the same region, used to deploy high-availability workloads across failure domains.

Most OVHcloud regions are currently single-zone, meaning the region itself is the deployment unit. A few regions expose multiple AZs (notably some EU regions); availability is verified in the Manager or in the docs at the moment of deployment, not assumed.

Multi-AZ deployment patterns — placement groups, spread vs pack policies, AZ-aware load balancers — are a Professional-tier topic. In Core Associate, we deploy in one region without assuming AZ separation. If a learner asks specifically about an AZ-aware HA pattern, park it ("excellent question for Module 3.5 in the Professional tier") rather than improvising.

---

## Q6 — "Can I have multiple billing entities under one OVHcloud account, or do I need one account per business unit?"

One OVHcloud account = one billing entity = one contract = one invoice stream. If your organization needs separate invoices per business unit, you create separate OVHcloud accounts.

Projects within one account always roll up to the same invoice — segmentation by project is for **access and resource isolation**, not for billing fragmentation. This is a recurring confusion: corporate stakeholders sometimes assume that "one project per cost center" will produce separate invoices. It does not. What it produces is line-item granularity on a single invoice, which is usually what finance actually wants anyway.

The Account Manager is the right interlocutor when the customer genuinely needs multiple billing entities — it touches contracting and legal terms beyond the technical Manager.

---

## Q7 — "Why aren't we writing IAM policies like in AWS today?"

In the Core Associate scope, OVHcloud OpenStack IAM is intentionally simpler: pre-defined roles (`member`, `admin`, plus a few read-only variants) assigned per user per project. There are no fine-grained policy documents, no condition keys, no resource-level statements.

Fine-grained custom policies exist at a higher level — OVHcloud IAM applied to the Manager itself — and are covered in Module 2.5. They control what Manager users can do across the OVHcloud account: who can create projects, who can invoice, who can manage SSL certificates, and so on. They do not extend into the OpenStack layer.

The Core layer's identity model is intentionally minimal: it covers 90% of operational needs and avoids the policy-debugging tax that AWS IAM is known for. Customers who have suffered through AWS IAM permission boundaries tend to appreciate the simplicity once it is framed this way; customers who have not, tend to look for the missing complexity. Anticipate both reactions.

---

## Q8 — "Can two OpenStack users in different projects share the same name?"

Yes. OpenStack user names are scoped to a domain (in OVHcloud, the default domain), but the typical OVHcloud customer never interacts with domain concepts. In practice, learners will see that user names are unique within a project but can be reused across projects belonging to different accounts.

This rarely matters in Associate-level operation, but it occasionally surfaces during the Lab if learners share a tenant for training and pick obvious names like `ops` or `admin`. The lab convention `<initials>-ops` is there precisely to prevent collisions during shared training sessions.

---

## Q9 — "How do I migrate from a Discovery project to a Standard one without recreating everything?"

The upgrade is in-place. From the Manager, in the project's billing section, attach a payment method. The project transitions to Standard mode: the project ID is preserved, all resources remain intact, all credentials continue to work, and the quota caps lift.

What does change: pricing applies retroactively from the moment of upgrade (not from the project's creation), and full Core catalog services become available in the region.

There is no equivalent downgrade path — once a project is Standard, it cannot be reverted to Discovery. The right model is: use Discovery for evaluation, upgrade when the workload becomes real, never plan to alternate.

---

## Q10 — "The Lab asks us to pick GRA. What if a learner picks a different region?"

Acceptable, as long as the region supports the full Core catalog. The Northwind narrative is set in GRA for EU jurisdiction reasons, but for the bootstrap exercise itself, any standard Public Cloud region works. The learner outcomes are identical.

What is not acceptable: picking a region where part of the Core catalog is unavailable, because the subsequent modules will then fail to deploy. If a learner has picked an exotic region for personal reasons (latency from their home country, existing OVHcloud footprint), gently steer them back to a fully-equipped region for the duration of the training, while acknowledging that their real-world choice may differ.

The validation criterion in the lab is the CLI output (`openstack catalog list` showing compute/network/volume/image/identity), not the region name. Trust the criterion.

---

## Cross-references to module slides

| Topic | Primary slide(s) |
|---|---|
| Public Cloud project as boundary | S01 |
| One account, many projects | S02 |
| Discovery vs Standard | S03 |
| Regions, residency, service catalog | S04 |
| Billing model | S05 |
| Manager identity vs OpenStack identity | S06 |
| OpenStack identity concepts (Keystone, user, project, role, token) | S07 |
| Authentication methods | S08 |
| Project segmentation playbook | S09 |
| 403 Keystone diagnostic flow | S10 |
| Demo bootstrap end-to-end | Demo block |
| Lab bootstrap Northwind | Lab block |
