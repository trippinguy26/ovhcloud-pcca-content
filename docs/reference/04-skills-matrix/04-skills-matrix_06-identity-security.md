# Domain 06 — Identity, Access & Security

> **Domain code**: `SEC`
> **Total LOs**: 13 (6 K + 5 S + 2 A)
> **Calibration**: Extends the basic IAM introduced in Domain 02 with policy-driven access control, application credentials, secret management, and KMS awareness. The key distinction OVHcloud IAM (account-wide) vs OpenStack Keystone (project-scoped) is a critical clarity point.

## Knowledge (savoir)

| Code | Learning Outcome |
|---|---|
| `LO-SEC-K01` | Distinguish the OVHcloud IAM layer (account-wide, controlling access to OVHcloud services and Manager actions) from the OpenStack Keystone layer (project-scoped, controlling Public Cloud resources). |
| `LO-SEC-K02` | Explain the IAM policy model (subject, resource, action, condition) and how policies attach to identities or groups. |
| `LO-SEC-K03` | Identify the standard OpenStack roles available in OVHcloud (admin, member, reader) and what each role can do. |
| `LO-SEC-K04` | Describe application credentials and explain why they are preferred over personal credentials for automation. |
| `LO-SEC-K05` | Identify the OVHcloud secret management options (Secret Manager) and their typical use cases. |
| `LO-SEC-K06` | Explain at a high level the role of a Key Management Service (KMS) and how encryption keys are managed for OVHcloud services. |

## Skills (savoir-faire)

| Code | Learning Outcome |
|---|---|
| `LO-SEC-S01` | Create an IAM user, assign a policy, and validate the effective permissions. |
| `LO-SEC-S02` | Create a group, attach a policy, and assign users to the group. |
| `LO-SEC-S03` | Generate and revoke OpenStack application credentials for a service account. |
| `LO-SEC-S04` | Store a secret in Secret Manager and retrieve it from an instance using API credentials. |
| `LO-SEC-S05` | Audit a project for over-privileged users and apply principle of least privilege. |

## Attitudes (savoir-être / posture)

| Code | Learning Outcome |
|---|---|
| `LO-SEC-A01` | Recommend an IAM segmentation strategy aligned with corporate roles (admin, developer, auditor, billing). |
| `LO-SEC-A02` | Justify the use of application credentials over personal credentials for any non-interactive workload by reflex. |
