# Module 1.1 — Trainer FAQ

> Vetted long-form answers to anticipated learner questions for *Module 1.1 — Cloud Foundations & OVHcloud Positioning*.
>
> **How to use this document.** Read it **before** the session, not during. The slide trainer notes (extracted from `slides.md`) carry the in-session action script (souligner, anticiper, rappeler). This file is the back-pocket reference for the longer questions that may come during Theory or, more likely, during the Positioning Drill of Block 4 — where stakeholder objections often surface the exact topics below.

---

## Q1 — "Concretely, OVHcloud vs AWS — when do I choose which?"

The honest answer is workload-dependent, not vendor-dependent. AWS wins when the workload needs an extensive managed-service catalog (Lambda, DynamoDB, SageMaker) or a global edge presence beyond what OVHcloud regions cover. OVHcloud wins when EU jurisdiction is a hard requirement, when bandwidth-heavy workloads make egress fees painful, or when integration with existing bare-metal is a structural need. The qualification grid in S10 is the conversation tool — do not turn this into a religious debate.

---

## Q2 — "What does 'sovereignty' actually mean for OVHcloud?"

Three concrete layers.

First, **jurisdictional**: OVHcloud is a French company subject to EU law, with no US-law extraterritorial exposure (no CLOUD Act, no FISA).

Second, **operational**: OVHcloud owns its datacenters, designs its hardware, runs its own backbone — no dependency on a hyperscaler underneath.

Third, **certifications**: SecNumCloud-qualified offers exist for the most demanding sovereignty needs.

"Sovereignty" is not a marketing word here — it has verifiable technical and legal substance. Detailed treatment in Module 2.5.

---

## Q3 — "Why OpenStack and not a proprietary stack like AWS?"

Strategic conviction. OpenStack is open-source, governed by a foundation, with standard APIs reusable across compatible providers. Choosing OpenStack means OVHcloud customers are not locked into proprietary APIs — their Terraform code, their automation, their tooling remain portable. The trade-off is a narrower service catalog than hyperscalers, which is accepted by design. OVHcloud contributes upstream and tracks OpenStack releases — not a divergent fork.

---

## Q4 — "Is multi-cloud or hybrid supported well?"

**Hybrid: yes, structurally.** The vRack allows L2 connectivity between OVHcloud Public Cloud, Bare Metal, and Hosted Private Cloud, which makes hybrid architectures clean to build (covered in Module 2.4).

**Multi-cloud: yes in the sense that OVHcloud uses standard APIs** (OpenStack, S3), so customers running tools like Terraform or Kubernetes can target OVHcloud alongside other providers.

OVHcloud does not, however, sell a multi-cloud control plane — it sells a sovereign public cloud that plays well with others.

---

## Q5 — "How does pricing compare to hyperscalers?"

Three structural points to communicate, not detailed numbers (which change).

First, **no egress fees** on Public Cloud bandwidth — this is the single biggest cost differentiator for data-intensive workloads.

Second, **flat pricing** with published rates, no tiered surprises.

Third, **predictable monthly invoices**.

Hyperscalers may be cheaper on raw compute hours for specific instance types, but total cost of ownership including egress, support and reserved-instance complexity often tilts in OVHcloud's favor. Refer technical buyers to the public pricing pages, refer commercial buyers to their Account Manager.

---

## Q6 — "Where does Bare Metal fit in the cloud conversation?"

Bare Metal is OVHcloud's historical core business and still represents a major part of the offer. It is **not Public Cloud** (no hypervisor, no on-demand elasticity in the cloud-native sense), but it sits within the same OVHcloud universe and integrates via vRack.

For customers like Northwind who already operate bare-metal, the right narrative is *complementarity*, not *replacement* — keep bare-metal for what it does well (predictable heavy workloads, specialized hardware) and use Public Cloud for what bare-metal cannot do (elasticity, ephemeral environments, managed adjacents).

Bare Metal is out of scope for this certification but a frequent source of audience questions.

---

## Q7 — "Does Module 1.1 get re-used if delivered standalone?"

Yes, with one adjustment. In standalone delivery (à la carte training, Tech Lab), the trainer adds a 2-minute opener clarifying that Northwind Analytics is a scenario used as the red thread for the full certification, and that the Positioning Drill exercise stands on its own value (transferable skill: defending a cloud choice to a stakeholder).

The rest of the module needs no modification. The *Sentier battu / Hors piste* block already declares prerequisites explicitly, which is what enables standalone delivery.

---

## Cross-references to module slides

| Topic | Primary slide(s) |
|---|---|
| NIST 5 characteristics | S02 |
| IaaS / PaaS / SaaS placement | S03 |
| Shared responsibility | S04 |
| Public / Private / Hybrid / Multi-cloud | S05 |
| Provider landscape | S06 |
| Native OpenStack | S07 |
| Core scope | S08 |
| 4 differentiators (Sovereignty · Predictability · Openness · Integration) | S09 |
| Core qualification grid | S10 |
| Hyperscaler cross-reference | S23 |
