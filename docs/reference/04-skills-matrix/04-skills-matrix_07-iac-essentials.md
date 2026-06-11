# Domain 08 — Infrastructure as Code Essentials

> **Domain code**: `IAC`
> **Total LOs**: 13 (4 K + 7 S + 2 A)
> **Calibration**: Covers OpenStack CLI and Terraform at essentials level. The goal is to make the learner capable of reproducing a deployment programmatically, not to make them a platform engineer. Advanced topics (remote state, GitOps, CI integration, custom providers, modules at scale) are explicitly Professional-level. SDKs and MCP/SHAI agent tooling are out of scope at this level.

## Knowledge (savoir)

| Code | Learning Outcome |
|---|---|
| `LO-IAC-K01` | Define Infrastructure as Code and explain its benefits (reproducibility, version control, peer review, drift detection) compared to manual Manager-driven provisioning. |
| `LO-IAC-K02` | Distinguish the three primary control planes exposed by OVHcloud Public Cloud (Manager UI, OpenStack CLI, OVHcloud API) and identify the right tool for each context. |
| `LO-IAC-K03` | Explain at a high level what Terraform is, the role of providers, state, and the basic workflow (`init`, `plan`, `apply`, `destroy`). |
| `LO-IAC-K04` | Identify the OVHcloud Terraform provider and the OpenStack Terraform provider, and explain when each is used. |

## Skills (savoir-faire)

| Code | Learning Outcome |
|---|---|
| `LO-IAC-S01` | Install and configure the OpenStack CLI on a workstation using an `openrc.sh` file. |
| `LO-IAC-S02` | Execute and read the output of the essential OpenStack CLI commands (`server`, `volume`, `network`, `image`, `catalog`, `quota`). |
| `LO-IAC-S03` | Install Terraform and configure provider authentication for OpenStack and OVHcloud. |
| `LO-IAC-S04` | Write a minimal Terraform configuration that deploys an instance, a volume, and a network. |
| `LO-IAC-S05` | Run `terraform plan` and `terraform apply` and interpret the output. |
| `LO-IAC-S06` | Destroy infrastructure with `terraform destroy` and verify resource cleanup. |
| `LO-IAC-S07` | Store and manage a basic Terraform state file (local state at this level; remote state is Professional-level). |

## Attitudes (savoir-être / posture)

| Code | Learning Outcome |
|---|---|
| `LO-IAC-A01` | Recommend an IaC-first approach for any environment intended to be reproducible (dev/test, multi-region, training labs). |
| `LO-IAC-A02` | Anticipate the risk of manual changes that desynchronize the actual state from the declared state. |
