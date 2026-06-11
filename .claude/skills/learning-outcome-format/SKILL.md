---
name: learning-outcome-format
description: Use this skill whenever the user is writing, reviewing, refining, or auditing Learning Outcomes (LOs) for any training program or certification — particularly in the OVHcloud Product Enablement context. Triggers include "let's write the LOs for this domain", "review my LOs", "is this LO well written?", "how should I formulate this skill outcome?", "K, S, or A?", "which Bloom verb fits?", or any drafting of a certifiable skills matrix. Use this skill even when the user does not explicitly say "LO" or "Learning Outcome" — if the conversation involves formalizing what learners must know, be able to do, or judge by reflex at the end of training, this is the right skill.
---

# Learning Outcome Format

This skill defines the canonical format, quality criteria, and Bloom verb palette for Learning Outcomes (LOs) in OVHcloud certification programs. It was developed and validated during the *OVHcloud Public Cloud Associate* design (May 2026, 121 LOs across 9 domains) and is the canonical reference for any LO drafted afterward.

## When to invoke

Whenever you are producing, reviewing, refining, or auditing Learning Outcomes — for any certification level, any track, any domain. Also when deciding between categories (K vs S vs A) for a given outcome, when picking the right Bloom verb, or when mapping content (slides, labs, exam questions) back to LOs.

## What a Learning Outcome is

A Learning Outcome is a **discrete, measurable statement of what a certified learner can do** at the end of training. It is the atomic unit of certification: every slide, demo, lab, exercise, and exam question traces back to one or more LOs.

LOs are not learning objectives (what the trainer intends to teach). They are not topic lists (what the curriculum covers). They are outcomes — they describe the **state of the learner at exit**, not the state of the content.

## Canonical format

### ID structure

`LO-<DOMAIN_3_LETTERS>-<CATEGORY><NUMBER>`

| Component | Description | Example |
|---|---|---|
| `LO` | Fixed prefix | `LO` |
| `<DOMAIN_3_LETTERS>` | 3-letter domain code, all caps | `CMP` (Compute), `STO` (Storage), `NET` (Network), `SEC` (Security) |
| `<CATEGORY>` | Single letter: K, S, or A | `S` |
| `<NUMBER>` | Two-digit sequential number within the category for this domain | `03` |

**Full example**: `LO-CMP-S03` reads "Compute domain, Skill outcome #3".

### Three categories

| Code | Category | What it captures | Bloom level(s) |
|---|---|---|---|
| **K** | Knowledge — *savoir* | Definitions, concepts, characteristics, positioning, terminology | Remember, Understand |
| **S** | Skill — *savoir-faire* | Hands-on operational capability | Apply |
| **A** | Attitude / posture — *savoir-être* | Reflexes, judgment, recommendation maturity | Analyze, Evaluate |

The *Create* level of Bloom's taxonomy is generally reserved for Professional+ certifications (designing architectures, building novel solutions) and rarely used at Associate level.

## Bloom verb palette by category

Use verbs from these palettes. If a verb is not in any palette, it's probably too vague or at the wrong level.

### K — Knowledge verbs

`define` · `identify` · `list` · `describe` · `explain` · `distinguish` · `decode` · `recognize` · `summarize` · `classify` · `compare`

Examples in use:
- `LO-FND-K01`: Define cloud computing and the three service models (IaaS, PaaS, SaaS) with concrete OVHcloud examples for each.
- `LO-CMP-K03`: Decode the OVHcloud flavor naming convention (`family-generation-size`).

### S — Skill verbs

`deploy` · `configure` · `connect` · `create` · `use` · `read` · `restore` · `implement` · `verify` · `attach` · `mount` · `resize` · `audit` · `execute` · `apply`

Examples in use:
- `LO-CMP-S01`: Deploy an instance via the OVHcloud Manager UI (region, image, flavor, SSH key, network, security group).
- `LO-NET-S05`: Deploy a basic Public Cloud Load Balancer in front of a pool of two backend instances and verify HTTP round-robin.

### A — Attitude / posture verbs

`recommend` · `assess` · `evaluate` · `anticipate` · `justify` · `choose` · `prioritize` · `apply by reflex` · `defend` · `critique`

Examples in use:
- `LO-STO-A01`: Recommend the appropriate storage type (block vs object vs file vs cold archive) for a given workload pattern.
- `LO-NET-A02`: Anticipate the security implications of default network configurations and apply least-privilege ingress rules by reflex.

## Forbidden verbs (and what to replace them with)

These verbs sneak into LO drafts but they are **not measurable**. If you find yourself reaching for them, stop and pick a verb from the palette above.

| Forbidden verb | Why it's banned | Replace with |
|---|---|---|
| `understand` | Internal cognitive state, not observable | `define`, `explain`, `distinguish` (depending on what understanding actually means in context) |
| `know` | Same — internal state | `identify`, `list`, `describe` |
| `be familiar with` | Even weaker than "know" | `identify` at minimum, or upgrade to `describe` or `use` |
| `be aware of` | Implies passive recognition only | `identify` or `recognize` |
| `learn about` | Describes the activity, not the outcome | Rewrite to focus on the outcome state |
| `appreciate` | Affective, not measurable | `justify`, `recommend`, `assess` |
| `master` | Vague; mastery of what level? | A specific verb of the actual operational outcome |

## Quality criteria for a good LO

An LO is **valid** when all of these hold:

1. **Uses a measurable Bloom verb** from the palette above. Not a forbidden verb.
2. **Specifies a clear object**: the verb is applied to something concrete, named, scoped.
3. **One cognitive level** per LO: do not mix "Apply" and "Evaluate" in the same outcome — split into two LOs.
4. **Achievable** by the target persona at the target level: an Associate-level S verb on a Professional-level object is miscalibrated.
5. **Testable**: an exam question (or lab task, or observable behavior) can be written that directly assesses this LO.
6. **Atomic**: one outcome per LO. If the LO has "and" connecting two distinct actions, split it.
7. **Calibrated for the level**: see the calibration heuristic below.

### Calibration heuristic by certification level

| Level | Default cognitive mix | What S looks like |
|---|---|---|
| **Foundation** | Heavy K, light S, no A | Recognize/identify outputs; very basic configurations |
| **Associate** | Balanced K + S, light A | Deploy, configure, operate standard scenarios |
| **Professional** | Light K (assumed), heavy S, significant A | Design, integrate, troubleshoot non-trivial scenarios |
| **Specialist** | Minimal K (assumed), focused S in depth, substantial A | Architect at scale, defend complex decisions |

## Anti-pattern examples (and their fixes)

### Anti-pattern 1: Vague verb

❌ `LO-CMP-K01`: Understand OVHcloud Compute instances.

Why it fails: "Understand" is not measurable. No specific scope. Not testable.

✅ Fixed: `LO-CMP-K01`: Explain the IaaS compute model and how it differs from legacy VM provisioning (VMware, Hyper-V, Proxmox).

### Anti-pattern 2: Two outcomes in one LO

❌ `LO-CMP-S01`: Deploy and secure and operate an instance.

Why it fails: Three distinct operational outcomes packed together. An exam can't assess one without the others.

✅ Fixed: Split into three LOs.
- `LO-CMP-S01`: Deploy an instance via the OVHcloud Manager UI...
- `LO-CMP-S05`: Configure a Security Group to restrict SSH access...
- `LO-CMP-S07`: Create, list, restore, and delete an instance snapshot.

### Anti-pattern 3: Wrong category

❌ `LO-NET-K05`: Deploy a Load Balancer in front of two backend instances.

Why it fails: This is a Skill (S) outcome — it's an Apply-level hands-on action, not a Knowledge outcome.

✅ Fixed: Re-classify as `LO-NET-S05` and verify it is removed from the K list.

### Anti-pattern 4: Miscalibrated level

❌ At Associate level: `LO-NET-A05`: Design a multi-region active-active network topology with cross-region failover and route convergence under 200ms.

Why it fails: This is Professional+ in calibration. An operator at Associate level is not expected to design HA topologies of this complexity.

✅ Fixed: Defer to Professional certification. Replace at Associate with: `LO-NET-A01`: Recommend a network topology (public-only, public+private, vRack-extended) for a given architectural need.

### Anti-pattern 5: Outcome describes activity, not state

❌ `LO-IAC-S04`: Learn about Terraform providers.

Why it fails: Describes what the learner does during training, not what they can do afterward.

✅ Fixed: `LO-IAC-S04`: Write a minimal Terraform configuration that deploys an instance, a volume, and a network.

## LO numbering and ordering within a domain

- Number LOs sequentially within each (domain, category) tuple. So `LO-CMP-K01`, `LO-CMP-K02`, etc. — the K sequence is independent of the S sequence.
- Order within a category should follow a natural pedagogical progression (simple to complex, or concept-before-application). It does **not** have to match exam question ordering or module ordering — those are downstream concerns.
- Numbers are two-digit (`01`, `02`, … `09`, `10`, `11`). This preserves alphabetical sort order even at scale.
- Domain codes are stable across certification levels: `CMP` for Compute at Associate is also `CMP` at Professional. This enables cross-level traceability.

## Audit checklist

When auditing a set of LOs (yours or someone else's), walk through this checklist:

- [ ] Every LO uses a verb from the palette (no forbidden verbs).
- [ ] Every LO has a clear, named object.
- [ ] No LO contains "and" linking two distinct outcomes.
- [ ] Each LO is testable — you can imagine a concrete question or lab task that assesses it.
- [ ] LOs are correctly categorized (K vs S vs A) — no Skill outcomes hiding in the Knowledge list.
- [ ] LOs are calibrated for the certification level (not Pro-level depth in an Associate matrix).
- [ ] No duplicates across LOs (each outcome appears exactly once).
- [ ] Coverage is complete for the domain's scope: every in-scope topic from the scope statement is reflected in at least one LO.

## Reference implementation

The *OVHcloud Public Cloud Associate* skills matrix (Cloud Core program, May 2026) is the canonical worked example: 9 domains, 121 LOs (49 K, 52 S, 20 A), all conforming to this format. Refer to the project's `04-skills-matrix/` directory for examples in every domain.

## Boundary: what this skill does NOT cover

- **Module content design** (how to teach an LO). This is Phase 2 territory and has its own skill (to be produced).
- **Exam question writing** (how to assess an LO with a multiple-choice item). This will have its own skill once the question bank is being built.
- **LO-to-content traceability matrix** (which slide / demo / lab covers which LO). This is a Phase 2 artifact, with its own format spec.

When the user asks about those topics, signal that the current skill scopes LO format and quality only, and recommend they hold off on the downstream artifacts until the LO matrix is validated.
