# 08 — Delivery Format & Prerequisites

## 1. Delivery format

### Primary format

- **Instructor-Led, in-person**, delivered by a certified OVHcloud Customer Trainer.
- **3 consecutive days**, typically Tuesday-Wednesday-Thursday or Wednesday-Thursday-Friday to leave Friday/Monday for travel and customer follow-up activities.
- **Group size**: 6 to 12 learners per session. Below 6, the dynamic suffers (limited peer exchange); above 12, hands-on labs are no longer effectively supervisable by a single trainer.
- **Location**: customer site, OVHcloud office, or partner training center, depending on commercial arrangement.

### Self-paced or e-learning variants

E-learning adaptation is **out of scope** of this Phase 1 reference, but the curriculum has been designed to remain adaptable to such a format later. Specifically:

- Each module is modular and self-contained.
- The "Sentier battu / Hors piste" pattern transfers cleanly to e-learning prerequisites.
- The lab artifacts (code, environments) are independent of the trainer's presence and can be self-served with adequate written guidance.

E-learning adaptation, if undertaken, will be the responsibility of a separate team member and will not modify this reference.

## 2. Commercial path by OVHcloud segment

Pricing and access depend on the OVHcloud commercial segment of the learner's organization.

### Persona A — Corporate Operator (Corporate or Digital Scaler segments)

| Audience | Path | Cost to learner |
|---|---|---|
| Corporate customer with Professional Services bundle (dedicated AM) | Bundled in the engagement | Covered by the bundle |
| Corporate customer with Enterprise support contract | Allocated from the included certification quota (typically 3 certifications per support tier) | Free up to the quota |
| Corporate customer outside the above | Paid per-seat, list price (Y€ per learner — final pricing TBD) | Paid by customer |
| Digital Scaler customer (no dedicated AM, >2k€ MRRR) | Paid per-seat or team bundle, contracted with the single decision-maker | Paid by customer |
| Team bundle (3+ learners from the same customer) | Discounted pricing | Discounted |

### Persona B — Digital Starter (Digital Starter segment, no AM, <2k€ MRRR)

| Audience | Path | Cost to learner |
|---|---|---|
| Eligible Digital Starter (SME, freelancer, entrepreneur) | Subsidized track (free or strongly discounted) as part of OVHcloud's market reach strategy for the no-AM segment | Free or strongly discounted, eligibility window applies |
| Freelancer not eligible for the subsidized track | Paid per-seat, list price | Paid by individual |

### Training credits

For every paid or subsidized session, learners receive **OVHcloud training credits as vouchers**. These credits cover the cloud resource consumption during the labs. **No personal payment method is required from the learner.** The voucher amount is sized to cover lab consumption + a safety margin for post-training experimentation (~7 days).

## 3. Prerequisites for the learner

### Technical prerequisites (auto-declarative at registration)

The learner is expected to be able to honestly answer "yes" to all of the following before enrolling:

- I am comfortable with the Linux command line and SSH (intermediate level: file manipulation, process management, basic system administration).
- I understand server virtualization concepts (VMware, Hyper-V, Proxmox, KVM, or equivalent hands-on exposure).
- I understand TCP/IP networking fundamentals: IP addressing, subnets, VLANs, basic firewalling, routing concepts.
- I am familiar with identity management concepts (Active Directory, LDAP, or equivalent).
- I understand traditional storage concepts: SAN, NAS, RAID, backup and restore principles.
- I can read basic configuration files in YAML, JSON, and INI formats.
- I have basic scripting literacy (bash or PowerShell) — I can read and modify simple scripts, but I am not a developer.

Learners who cannot honestly tick all the boxes are directed toward a foundation-level preparation track (out of scope of this certification).

### Logistical prerequisites

The following must be in place **before the first session**:

1. **An active OVHcloud NIC Handle (customer identifier).** Training credits will be provided as vouchers by the organizer — no personal payment method is required from the learner.
2. **A personal workstation** with:
   - An SSH client.
   - A modern terminal (Windows Terminal, iTerm2, GNOME Terminal, or equivalent).
   - A modern web browser (Firefox, Chrome, Edge — latest stable).
   - Terraform installed (instructions provided 7 days before the session).
3. **A personal SSH key pair** generated and ready to upload. *Optional at registration: learners without an existing key pair will be guided through generation during the first session as a side activity.*

### Welcome email (sent 7 days before session)

A welcome email is sent 7 days before the session, containing:

- Detailed installation instructions for Terraform and the OpenStack CLI.
- A pre-session checklist (NIC Handle, SSH key, workstation requirements).
- A link to the optional pre-reading (a short primer on OVHcloud terminology, ~30 minutes of reading).
- Logistical information (location, schedule, dress code if any, meals).

## 4. Trainer prerequisites

A trainer delivering this session must:

- Hold the certification themselves (or have its formal equivalent established by Product Enablement team during the pre-launch phase).
- Have completed an internal *train-the-trainer* session covering the module content, the Northwind narrative, and the FAQ anticipation kit (Phase 2 deliverable).
- Possess working hands-on competence with the labs (have personally executed each lab end-to-end at least once outside a customer setting).
- Maintain current awareness of OVHcloud Public Cloud service evolutions (a quarterly trainer sync will be set up in Phase 3).

## 5. Logistical configuration of the training room

For an in-person session, the room must provide:

- Stable, reasonably fast internet connectivity (minimum 50 Mbps shared, with each learner able to maintain SSH sessions and Manager access concurrently).
- A projection screen visible from all learner positions, large enough to read terminal output and Manager UI screens at normal font size.
- A whiteboard or equivalent for ad-hoc architecture sketches (the trainer will often draw the Northwind state evolution by hand).
- Power outlets reachable from every learner position.
- A configuration that supports peer collaboration on labs (table arrangements that allow side-by-side work where useful).
