# Domain 02 — PCI Foundation & Basic IAM

> **Domain code**: `PCI`
> **Total LOs**: 13 (5 K + 6 S + 2 A)
> **Calibration**: First operational domain. Establishes the OVHcloud Public Cloud project as the foundational unit and introduces OpenStack identity at a usable level. Sets up the working environment that every subsequent module relies on.

## Knowledge (savoir)

| Code | Learning Outcome |
|---|---|
| `LO-PCI-K01` | Define a Public Cloud Project and its role as the fundamental unit of isolation, billing, and access control in OVHcloud. |
| `LO-PCI-K02` | Identify the OVHcloud regions, their geographical distribution, and the notion of availability zone where applicable. |
| `LO-PCI-K03` | Explain the OVHcloud Public Cloud billing model (hourly vs monthly, resource-based, included traffic, free egress) and contrast it with hyperscaler models. |
| `LO-PCI-K04` | Distinguish the "Discovery" project mode from a standard project and identify its limitations. |
| `LO-PCI-K05` | Identify the main OpenStack identity concepts in use (Keystone, user, project, role, token, service catalog). |

## Skills (savoir-faire)

| Code | Learning Outcome |
|---|---|
| `LO-PCI-S01` | Create a new Public Cloud project from the OVHcloud Manager, configure payment (or apply voucher credit), and verify access. |
| `LO-PCI-S02` | Create and manage OpenStack users within a project, assign appropriate roles, and rotate credentials. |
| `LO-PCI-S03` | Download and configure an OpenStack RC file (`openrc.sh`) to authenticate the OpenStack CLI against an OVHcloud project. |
| `LO-PCI-S04` | List a project's service catalog, quotas, and currently consumed resources via the OpenStack CLI. |
| `LO-PCI-S05` | Generate and use an OVHcloud API token (application credentials) for programmatic access. |
| `LO-PCI-S06` | Read and interpret a project's invoice and consumption details from the Manager. |

## Attitudes (savoir-être / posture)

| Code | Learning Outcome |
|---|---|
| `LO-PCI-A01` | Recommend a project segmentation strategy aligned with corporate environments (Dev, Staging, Production isolated as separate projects). |
| `LO-PCI-A02` | Anticipate the consequences of a 403 Keystone error and identify the root cause (role insufficient, scope mismatch, expired token). |
