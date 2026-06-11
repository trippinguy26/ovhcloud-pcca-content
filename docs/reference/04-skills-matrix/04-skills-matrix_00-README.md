# 04 — Certifiable Skills Matrix

## Purpose

This matrix defines every skill that *OVHcloud - Public Cloud - Core Associate* validates. Each entry is a **Learning Outcome (LO)** — a discrete, measurable statement of what a certified learner can do.

LOs drive every downstream artifact: training content (slides, demos, labs) maps **to** LOs; exam questions are written **from** LOs; learners' progress is measured **against** LOs.

## Structure

The matrix is organized in **8 knowledge domains**, mirroring the Core layer of OVHcloud Public Cloud (with scope boundaries defined in [03 — Scope Statement](../03-scope-statement.md)).

Each LO is classified in one of three categories:

| Code | Category | Bloom verbs typically used |
|---|---|---|
| **K** | Knowledge — *savoir* | Define, identify, list, describe, explain, distinguish, decode |
| **S** | Skill — *savoir-faire* | Deploy, configure, connect, create, use, restore, implement, verify |
| **A** | Attitude / posture — *savoir-être* | Recommend, assess, evaluate, anticipate, justify, choose, apply by reflex |

## Quantitative summary

| # | Domain | K | S | A | Total LOs |
|---|---|---|---|---|---|
| 01 | [Cloud Foundations](./01-cloud-foundations.md) | 7 | 0 | 2 | **9** |
| 02 | [PCI Foundation & Basic IAM](./02-pci-foundation-iam.md) | 5 | 6 | 2 | **13** |
| 03 | [Compute](./03-compute.md) | 6 | 9 | 3 | **18** |
| 04 | [Storage](./04-storage.md) | 6 | 8 | 3 | **17** |
| 05 | [Network](./05-network.md) | 7 | 7 | 2 | **16** |
| 06 | [Identity, Access & Security](./06-identity-security.md) | 6 | 5 | 2 | **13** |
| 07 | [IaC Essentials](./07-iac-essentials.md) | 4 | 7 | 2 | **13** |
| 08 | [Operations](./08-operations.md) | 4 | 5 | 2 | **11** |
| | **Total** | **45** | **47** | **18** | **110** |

## How to read an LO ID

```
LO-CMP-S03
│  │   │
│  │   └──── Sequential number within the category
│  └────────  Category: K (knowledge), S (skill), A (attitude)
└──────────  Domain code (3 letters)
```

Example: `LO-CMP-S03` reads "Compute domain, Skill outcome #3" — *Deploy an equivalent instance via a basic Terraform configuration*.

### Domain codes

| Domain code | Domain |
|---|---|
| `FND` | Cloud Foundations |
| `PCI` | PCI Foundation & Basic IAM |
| `CMP` | Compute |
| `STO` | Storage |
| `NET` | Network |
| `SEC` | Identity, Access & Security |
| `IAC` | Infrastructure as Code Essentials |
| `OPS` | Operations |

*Note: the* `DBA` *domain code was reserved for Managed Database in earlier drafts; the domain has been removed from this certification per the post-N+1 scope decision and moved to the future* OVHcloud - Public Cloud - DBaaS Associate *sibling certification.*

## Calibration policy

LOs are calibrated for the **operator** profile at Associate level. This means:

- More depth than the internal SMB Bundle 8 materials (which target a sales-enablement audience).
- Less depth than *OVHcloud - Public Cloud - Core Professional* (which targets architects and senior operators).
- OpenStack visibility is **operational**: enough to read CLI output and understand error messages, not enough to design OpenStack internals.

When in doubt, the question to ask is: *"Can a Corporate Operator on day one of their PCI project, after this certification, do this independently and explain it to a peer?"* If yes, it belongs to Associate. If it requires architectural maturity or a senior reviewer, it belongs to Professional.

## Traceability

Each LO will be traced in Phase 2 to:

- The module(s) that teach it.
- The demonstration(s) and lab(s) that practice it.
- The exam question bank entries that assess it.

This traceability matrix will live alongside this folder when Phase 2 begins.
