# Domain 03 — Compute

> **Domain code**: `CMP`
> **Total LOs**: 18 (6 K + 9 S + 3 A)
> **Calibration**: Heaviest operational domain. The instance is the most concrete mental anchor for operators coming from VMware, Hyper-V, or hyperscaler backgrounds. Two modules are allocated to this domain in the learning path.

## Knowledge (savoir)

| Code | Learning Outcome |
|---|---|
| `LO-CMP-K01` | Explain the IaaS compute model and how it differs from legacy VM provisioning (VMware, Hyper-V, Proxmox). |
| `LO-CMP-K02` | List and describe the OVHcloud instance flavor families (Discovery `d2`, General Purpose `b3`, CPU-Optimized `c3`, RAM-Optimized `r3`, IOPS `i1`, GPU `t1/t2`) and identify their target use cases. |
| `LO-CMP-K03` | Decode the OVHcloud flavor naming convention (`family-generation-size`). |
| `LO-CMP-K04` | Distinguish ephemeral local disk from persistent block storage, and explain the operational implications. |
| `LO-CMP-K05` | Identify the main OpenStack Nova concepts exposed in OVHcloud (instance, image, flavor, key pair, security group, console). |
| `LO-CMP-K06` | Explain the difference between standard and "Flex" instances, and their resizing constraints. |

## Skills (savoir-faire)

| Code | Learning Outcome |
|---|---|
| `LO-CMP-S01` | Deploy an instance via the OVHcloud Manager UI (region, image, flavor, SSH key, network, security group). |
| `LO-CMP-S02` | Deploy an equivalent instance via OpenStack CLI. |
| `LO-CMP-S03` | Deploy an equivalent instance via a basic Terraform configuration. |
| `LO-CMP-S04` | Connect to a deployed instance via SSH with key-based authentication. |
| `LO-CMP-S05` | Configure a Security Group to restrict SSH access to a specific source IP range. |
| `LO-CMP-S06` | Use cloud-init / user-data to customize an instance at first boot (package install, user creation, file injection). |
| `LO-CMP-S07` | Create, list, restore, and delete an instance snapshot. |
| `LO-CMP-S08` | Enter Rescue mode to recover an unreachable instance. |
| `LO-CMP-S09` | Read the instance console output to diagnose a boot or cloud-init failure. |

## Attitudes (savoir-être / posture)

| Code | Learning Outcome |
|---|---|
| `LO-CMP-A01` | Recommend an appropriate flavor family for a given workload profile (web frontend, application server, dev/test sandbox, in-memory cache). |
| `LO-CMP-A02` | Identify the security risks of a publicly exposed instance and apply baseline hardening reflexes (no root SSH, restricted security groups, key-only auth, OS updates). |
| `LO-CMP-A03` | Anticipate the data loss risk associated with ephemeral storage when planning any workload. |
