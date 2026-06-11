# Domain 05 — Network

> **Domain code**: `NET`
> **Total LOs**: 16 (7 K + 7 S + 2 A)
> **Calibration**: Covers Public Cloud networking at operational level: public and private networks, security groups, floating IPs, vRack basics, Gateway, and Load Balancer. Two modules are allocated to this domain in the learning path. vRack internals (overlay tech, leaf/spine) are explicitly deferred to Professional.

## Knowledge (savoir)

| Code | Learning Outcome |
|---|---|
| `LO-NET-K01` | Distinguish public network (Ext-Net) from private network in OVHcloud Public Cloud and identify when to use each. |
| `LO-NET-K02` | Explain the role of the OpenStack Neutron service and the main objects it exposes (network, subnet, port, router, security group, floating IP). |
| `LO-NET-K03` | Define vRack and explain its four foundational characteristics (multi-product, multi-DC, true Layer-2, VLAN capable) at an operational level. |
| `LO-NET-K04` | Distinguish a Floating IP from an Additional IP and identify the use cases for each. |
| `LO-NET-K05` | Explain the role of a Gateway in connecting private networks to the Internet. |
| `LO-NET-K06` | Describe the Public Cloud Load Balancer (Octavia-based) and its main features (HTTPS termination, anti-DDoS, four sizing tiers). |
| `LO-NET-K07` | Identify the OVHcloud Anti-DDoS protection scope and what it does and does not cover. |

## Skills (savoir-faire)

| Code | Learning Outcome |
|---|---|
| `LO-NET-S01` | Create a private network with DHCP-enabled subnet inside a Public Cloud project. |
| `LO-NET-S02` | Attach an instance to both a public and a private network (dual-NIC configuration) and verify connectivity. |
| `LO-NET-S03` | Configure a Security Group with multiple ingress and egress rules and apply it to one or more instances. |
| `LO-NET-S04` | Create a Floating IP and associate it with an instance. |
| `LO-NET-S05` | Deploy a basic Public Cloud Load Balancer in front of a pool of two backend instances and verify HTTP round-robin. |
| `LO-NET-S06` | Configure HTTPS termination on the Load Balancer using a managed certificate. |
| `LO-NET-S07` | Connect a Public Cloud private network to a vRack and verify Layer-2 reachability with a Bare Metal or Hosted Private Cloud resource. |

## Attitudes (savoir-être / posture)

| Code | Learning Outcome |
|---|---|
| `LO-NET-A01` | Recommend a network topology (public-only, public+private, vRack-extended) for a given architectural need. |
| `LO-NET-A02` | Anticipate the security implications of default network configurations and apply least-privilege ingress rules by reflex. |
