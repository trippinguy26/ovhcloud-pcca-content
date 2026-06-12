# Module 3.2 — Operations — Monitoring, Cost, Quotas & Support

## Module Brief

- **Module ID**: 3.2
- **Total duration**: 1h30
- **Block breakdown**: Sentier battu 5 min · Theory 30 min · Demo 15 min · Lab 30 min · Micro-check 5 min · Wrap-up 5 min
- **Program**: OVHcloud — Public Cloud — Core Associate
- **Domain covered**: 08 — Operations
- **LOs covered** (11 total):
  - Knowledge: `LO-OPS-K01`, `LO-OPS-K02`, `LO-OPS-K03`, `LO-OPS-K04`
  - Skills: `LO-OPS-S01`, `LO-OPS-S02`, `LO-OPS-S03`, `LO-OPS-S04`, `LO-OPS-S05`
  - Attitudes: `LO-OPS-A01`, `LO-OPS-A02`
- **Prerequisite modules**: 3.1 (the Northwind production stack is deployed via Terraform; the OpenStack CLI and application credential are functional; all infrastructure from Modules 1.2 through 3.1 is in place).
- **Red-thread step**: Production is live. The Northwind production environment has been running for a week. The learner, as the Cloud Ops engineer, sets up the recurring cost-review reflex, investigates a CPU anomaly on the API instance, checks quotas before the next environment spin-up, and opens their first support ticket — a billing question about a detached volume that continued to bill after staging cleanup.

### Pedagogical angle

This is the **operational maturity module** — the capstone of the Day-2 arc. Every previous module was about building the stack; this one is about watching it, controlling it, and knowing when to ask for help. The reflex shift is from "I declare what should exist" (Module 3.1) to "I observe what is happening" — same engineering discipline, different verb.

The legacy-IT analogy is strong here. Monitoring in the data center meant SNMP traps, Nagios, and a phone call when a fan failed. On OVHcloud Public Cloud Core, the native equivalent is built into the Manager — no agent, no SNMP, no separate monitoring appliance. The conceptual distance for a legacy-IT learner is short; the behavioral shift (checking the Manager regularly, not just when something breaks) is the actual learning.

The AWS cross-references are direct and will land well with Corporate learners:
- Instance metrics → CloudWatch metrics
- Consumption view → Cost Explorer / AWS Cost and Usage Report
- Quotas → Service Quotas (formerly Trusted Advisor limits)
- Status page → AWS Health Dashboard (formerly Service Health Dashboard)
- Support tiers → AWS Support plans (Basic / Developer / Business / Enterprise)

What this module **does not cover**, deliberately: Log Data Platform in depth (log streams, Graylog configuration, custom dashboards — Professional scope), Prometheus/Grafana integration with OVHcloud metrics, FinOps optimization strategies (Reserved Instances equivalent, Savings Plans — not an OVHcloud concept at this scope), and advanced alerting pipelines. The learner leaves knowing the native toolset and the behavioral reflexes; the Professional certification takes the observability depth further.

The final micro-check and wrap-up close the certification arc, so the trainer should leave space in the last 5 minutes for learner-driven Q&A before transitioning to the pre-exam wrap-up session.

### Trainer demonstration

15-minute end-to-end **Manager UI walkthrough** simulating a Monday morning Day-2 ops check on the Northwind production project. The trainer plays the role of the Cloud Ops engineer on their first week after go-live: (1) opens the Manager, navigates to the Northwind production project dashboard, orients the learners to the project overview panel; (2) opens `nwa-api-prod-01` → Metrics tab, points to the CPU graph and calls out a spike from the previous Friday (narrated as "a batch job ran longer than expected"), reads the RAM graph (no anomaly), reads the disk I/O graph, narrates what each metric implies operationally; (3) switches to the project-level Consumption view, reads the daily cost bar chart for the last 30 days, identifies Compute as the top contributor (three production instances + three staging instances still running), calls out a detached volume visible in the cost breakdown as a "forgotten resource" billing at €0.04/h; (4) opens a terminal tab and runs `openstack quota show` against the production project — reads the quota for instances, vCPUs, RAM, volumes, identifies the current usage vs ceiling, narrates that the next environment (the second production tenant the CTO wants to spin up for a major customer) would hit the vCPU ceiling and a quota increase ticket is needed before the sprint; (5) navigates to status.ovhcloud.com in a browser, shows the current status of the GRA region, reads a maintenance banner (pre-staged or live if one exists), explains the incident lifecycle states; (6) opens Manager → Support → New Ticket, selects "Billing" category, walks through filling in the five-field structure (project ID, resource ID of the detached volume, timestamp, description of the issue, what has been checked already) — stops at the Submit button and narrates why each field matters.

### Learner lab

*Establish the Day-2 ops baseline for the Northwind project — metrics, cost, quotas, and your first support draft* (30 min). Each learner: (1) opens the Manager and navigates to their Northwind project (staging or production); for the metric step, at least one instance must be running — if not, starts `nwa-api-staging-01` first (from Module 3.1 or by running `openstack server start <id>`); opens the Metrics tab for that instance, reads the CPU and RAM graphs over the last 24h and 7 days, captures a screenshot, and writes one sentence in their lab notes: "this instance is / is not right-sized for its current workload because..."; (2) opens the Consumption view for the project; identifies the top cost contributor; exports the current month's consumption to CSV (Manager → Consumption → Export); opens the CSV and locates the most expensive line item; enters the daily cost in their lab notes; (3) runs `openstack quota show` in the terminal with the staging application credential sourced; saves the output to `~/labs/3-2/quota-output.txt`; manually computes the headroom for each resource: `available = default - current`; notes which resource has the smallest headroom; (4) navigates to status.ovhcloud.com and captures the current status of the GRA and SBG regions as a screenshot; (5) drafts (without submitting) a support ticket for the following scenario: "the detached volume `nwa-pgsql-staging-data` from Module 2.1 is still billing even though it is not attached to any instance. I deleted the instance in Module 3.1 but forgot to delete the volume. I want to confirm the volume is now deleted and request that the billing for the last 7 days be reviewed." The draft must include all five fields; save it as `~/labs/3-2/ticket-draft.md`; (6) writes a one-page Markdown document (`~/labs/3-2/observability-posture.md`) defining the baseline observability posture for the Northwind production project: three metrics to watch (with proposed alert thresholds), one log stream to configure (syslog or access log, channel to LDP), one cost-review calendar entry (day of month, duration, checklist). This document is the `A02` deliverable.

---

## Block 1 — Sentier battu / Hors piste (5 min)

### Sentier battu (assumed prerequisites)

**Tools:**
- OVHcloud Manager access with admin or member rights on the Northwind project (staging or production).
- At least one running instance in the Northwind project (from Modules 1.3 onward; if all instances were destroyed in Module 3.1, the trainer provides a recovery `terraform apply` to restart the minimal stack).
- OpenStack CLI installed and the application credential `openrc.sh` sourced (from Module 3.1).
- A browser pointing to the Manager (manager.ovhcloud.com) and to status.ovhcloud.com.

**Knowledge:**
- Familiarity with the Manager UI project dashboard, the instance list, and the Consumption/Billing section (introduced in Module 1.2 and used throughout).
- The concept of hourly billing — resources cost by the hour, regardless of usage within that hour (Module 1.2).
- Basic knowledge that quotas exist on a project (mentioned but not dwelt on in Module 1.2 when creating the project).
- The Northwind stack topology after Module 3.1: production project with three instances (web, API, PostgreSQL), storage volumes, private network, Load Balancer — all deployed via Terraform.

### Hors piste (remediation pointers for gaps)

- **No instance running in the project** → run `openstack server list` to check; if all are stopped, `openstack server start nwa-api-staging-01` takes ~30 seconds; if destroyed, the trainer provides the one-command recovery: `cd ~/demos/3-2-recovery && terraform apply -auto-approve`.
- **Manager billing tab not visible** → the learner's account may not have Billing viewer rights; the trainer shares screen for the Cost/Consumption step, or the learner uses the backup exported CSV from the trainer's demo prep.
- **Never used the OVHcloud status page** → 30-second intro: "status.ovhcloud.com is the single source of truth for OVHcloud-side incidents. Bookmark it now. It will save you from opening unnecessary tickets during an incident already acknowledged."
- **Learner from AWS background confused about support tiers** → frame immediately: "same model as AWS Support — free community, paid tiers for SLA guarantees. The big difference: with OVHcloud Standard you get ticket support included, no credit-card-required upgrade to 'get someone to read your ticket'."

---

## Block 2 — Theory & Concepts (30 min)

### Slide 1: From "build it" to "run it" — the Day-2 shift

**Visual concept**: A horizontal two-panel layout. Left panel labeled "Day 1 — Provision" lists: create · configure · secure · automate; each verb in Masterbrand Blue bold. Right panel labeled "Day 2 — Operate" lists: watch · measure · control · respond; each verb in ODS neutral dark. A dividing line between the panels carries the label "go-live". A footer line: "the discipline that prevents a Sunday night phone call."

**Talking points**:
- Everything in Modules 1.1 through 3.1 was Day 1 — building the stack, securing it, making it reproducible.
- Day 2 starts the moment production goes live: now the question is "what is happening?" not "what should exist?".
- The three operational questions every ops team asks: Is the system healthy? Am I controlling cost? Am I prepared to scale?
- Day-2 tools on OVHcloud Public Cloud Core are built into the Manager — no external monitoring stack required to get started.
- Legacy-IT analogy: monitoring in the data center meant SNMP traps and a NOC watching a Nagios wall — here the equivalent is a browser tab open on the Manager, and the reflex of checking it regularly.

**Trainer notes**:
- Open with the Northwind transition from Module 3.1: "production is live, the Terraform repository is clean — what happens when something goes wrong at 2am?"
- Anticipate the Corporate learner: "we have Datadog / New Relic already" — acknowledge that, frame this module as the native baseline before adding third-party tools.
- Keep this slide short — the "why" is clear, move to the "how" quickly.

---

### Slide 2: Native observability surfaces — three Manager views

**Visual concept**: A three-section horizontal diagram. Each section is a simplified Manager UI panel: (a) "Instance Metrics" — a small time-series graph icon, labeled "per-instance CPU/RAM/disk/network · no agent required"; (b) "Consumption" — a bar chart icon, labeled "hourly billing data · top contributors · CSV export"; (c) "Quota overview" — a row of colored progress bars, labeled "resource ceilings · headroom at a glance". An AWS cross-reference badge in the corner: "CloudWatch · Cost Explorer · Service Quotas".

**Talking points**:
- Three distinct views in the Manager cover the three operational questions: health (metrics), cost (consumption), capacity (quotas).
- All three are **agentless** — OVHcloud collects metrics from the hypervisor layer; no daemon to install, no credential to rotate.
- The metrics are **native to the platform** — no third-party account, no API key exchange.
- AWS cross-reference: CloudWatch (metrics), Cost Explorer (billing breakdown), Service Quotas (limit tracking) — same three concerns, same three tools, different branding.
- The Log Data Platform is the fourth surface — covered on slide 4 — but it is one level above the other three in setup complexity.

**Trainer notes**:
- Souligner that this is the "what the Manager gives you for free" framing — the learner doesn't need to configure anything to see metrics and costs.
- Anticipate the ex-AWS learner: "CloudWatch is way more configurable" — true; OVHcloud native metrics are simpler but sufficient for the Associate scope; the Professional level adds Prometheus/Grafana integration.
- Use this slide as a navigation map for the block — "we'll cover each of these three panels in the next four slides".

---

### Slide 3: Instance metrics — CPU, RAM, disk, network

**Visual concept**: A four-graph mockup of the Manager Metrics tab for `nwa-api-prod-01`. Top-left: CPU % over 24h — a line graph showing a spike to 94% at 14:00 labeled "batch job". Top-right: RAM MB over 24h — a flat line at 72% labeled "stable". Bottom-left: disk I/O MB/s over 24h — a short burst labeled "write spike". Bottom-right: network in/out Mbps over 24h — a burst labeled "ingress peak". Two annotation callouts: one pointing to the CPU spike ("investigate — sustained or one-time?"), one pointing to the RAM flatline ("no pressure — right-sized for RAM").

**Talking points**:
- Four metrics visible per instance: **CPU utilization** (%), **RAM usage** (MB/%), **disk I/O** (read/write MB/s), **network** (in/out Mbps).
- Time ranges: 1-hour, 12-hour, 24-hour, 7-day, 30-day — select based on what you're investigating vs what you're reviewing.
- **Interpreting CPU**: sustained >80% for hours = the workload is CPU-bound, consider a larger flavor or horizontal scaling; a spike at a known time = a batch job or a deploy event — expected.
- **Interpreting RAM**: a rising line toward 100% over days = memory leak or growing dataset — investigate; a flat plateau = stable, the flavor is right-sized for RAM.
- **Interpreting network**: a large ingress spike = data load or backup; a large egress spike = delivery traffic or data export — may generate billing (egress pricing from OVHcloud differs by region).

**Trainer notes**:
- Demander aux learners: "what does a CPU spike at 14:00 on a Friday tell you?" — let them answer (batch job, deploy, traffic spike). The answer is not the point; the reflex of asking the question is.
- Souligner that these are hypervisor-level metrics — they reflect what the VM *sees*, not what the application measures. An application with a memory leak may show stable RAM at the VM level if the OS swaps.
- Anticiper: "can I set an alert on these metrics?" — no native alerting from the Manager at this scope; Prometheus + Grafana with the OVHcloud metrics exporter is the Professional path. Mention briefly.
- AWS cross-ref: this is CloudWatch basic metrics for EC2 — same four dimensions (CPU, network, disk), same pattern.

---

### Slide 4: OVHcloud Log Data Platform — positioning

**Visual concept**: A two-box diagram. Left box: "Your OVHcloud instances" — icons for web server, API, PostgreSQL host, each with a log file icon. Arrow pointing right labeled "log stream (syslog / GELF / HTTP)". Right box: "Log Data Platform" — a stacked icon of a search interface, with labels: "centralized · searchable · retained". Below the arrow, a one-line setup note: "configure rsyslog or Filebeat on each instance → one stream per service". An AWS cross-reference badge: "equivalent: CloudWatch Logs + OpenSearch". A "scope boundary" marker on the right: "depth configuration → Professional".

**Talking points**:
- The **Log Data Platform (LDP)** is OVHcloud's managed centralized log collection and retention service — logs from all your instances in one searchable place.
- Free tier included on OVHcloud accounts; the Manager entry point is Manager → Logs Data Platform.
- Associate scope: **know it exists, know why you'd use it** (a self-managed PostgreSQL on a single instance with no centralized logs is a blind spot for any incident), **know where to enable it**.
- Setup requires configuring a log shipper on the instance side — rsyslog, Filebeat (Elastic), or OVHcloud's SDK. Not a zero-config tool.
- AWS cross-reference: CloudWatch Logs + a log insights engine (OpenSearch Service) — same positioning.

**Trainer notes**:
- Ce slide est de positionnement, pas d'implémentation. Ne pas aller dans la configuration de rsyslog.
- Souligner the Northwind relevance: "your self-managed PostgreSQL has logs. Right now they're only on that one VM's disk. If the VM disappears, so do the logs. LDP solves that."
- Anticiper: "how much does it cost?" — free tier is generous for most starting setups; pricing depends on retention and volume. Point to docs for current pricing.
- Persona Digital Starter: may find LDP setup overhead heavy for a single-person operation — acknowledge; frame it as a Day-2 investment that pays off the first time you debug a 3am issue with no logs to read.

---

### Slide 5: Cost tracking — reading the Consumption view

**Visual concept**: A Manager UI Consumption tab mockup. Top section: a bar chart labeled "Daily spend — last 30 days" with a horizontal "budget target" line at €4/day. Bottom section: a table showing top cost contributors: row 1 "Compute — northwind-production" €0.38/h; row 2 "Compute — northwind-staging" €0.19/h; row 3 "Block Storage — volumes" €0.02/h; row 4 "Networking — Load Balancer" €0.02/h; row 5 "Block Storage — orphaned volume" €0.01/h. The last row has a warning icon.

**Talking points**:
- The **Consumption view** shows **hourly-granularity billing data aggregated by day** — costs are visible with a ~24h delay, not at month-end.
- Three components: daily spend chart (trend), resource breakdown by type (what is costing the most), and per-resource line items (exactly what is billing).
- **Top cost contributor** for a typical Northwind-like setup: Compute — instances bill as long as they are in `ACTIVE` state, regardless of load.
- The **orphaned volume** row (a volume detached and forgotten, billing at €0.01/h → ~€7.20/month) is the canonical "cost leak" to find in this view.
- **Export to CSV**: the Consumption view offers a CSV download — useful for feeding into a spreadsheet for month-over-month comparison or sharing with the finance team.

**Trainer notes**:
- Demander: "without looking, who here knows what their OVHcloud project cost yesterday?" — the point is not to embarrass, it's to make the reflex concrete.
- Souligner that hourly billing means staging environments left running over the weekend cost real money — the "forgot to destroy" pattern from Module 3.1's drift section applies here too.
- Anticiper: "can I set a budget alert?" — yes, OVHcloud has budget alerts in the Manager (Manager → Billing → Budget Alerts); mention briefly, don't demo.
- AWS cross-ref: Cost Explorer with daily granularity, service-level breakdown. Same model.

---

### Slide 6: Cost leaks — two patterns every operator must know

**Visual concept**: Two-panel layout using `two-cols`. Left panel "Forgotten resources": three icons vertically — a detached volume (€0.04/h), an unassociated floating IP (€0.004/h), a snapshot aged 90 days (€0.002/h per GB). Below: "they bill even if nothing uses them." Right panel "Right-sizing opportunity": a CPU graph at 4% plateau on a flavor labeled `b3-16` (€0.25/h). An arrow points to a smaller flavor `b3-4` (€0.06/h). A cost comparison: "€0.25 − €0.06 = €0.19/h saved = €136/month per instance." A footer: "Monthly Cost Review surfaces both. No tooling required — 30 minutes, the Manager, and a spreadsheet."

**Talking points**:
- **Pattern 1 — Forgotten resources**: detached volumes, unassociated floating IPs, and aged snapshots are the most common. They appear in the Consumption view line-item table. Audit once a month.
- **Pattern 2 — Right-sizing**: an instance sized for peak load at launch but running at 4% CPU for months is an opportunity. The metric from slide 3 surfaces it; the action is a flavor resize (Manager or CLI).
- Right-sizing on OVHcloud: resize requires a stop → resize → restart cycle; downtime is typically under 60 seconds for a live migration to a smaller flavor.
- The **Monthly Cost Review** is the ritual: once a month, open the Consumption view, list all resources with non-zero cost, check for forgotten resources, check CPU/RAM trends for right-sizing candidates, act.
- This is the `A01` reflex made operational: not "I'll check the bill when it arrives," but "I check the consumption every first Monday."

**Trainer notes**:
- Souligner that right-sizing is not a one-time event — workloads change. The quarterly performance review is the professional variant.
- Rappeler the Northwind red thread: "that detached volume from Module 2.1 is still billing. We'll find it in the lab."
- Persona Digital Starter: for a single-person operation, the cost impact of right-sizing one instance may be €20-50/month — not trivial at a €500/month total bill.
- Éviter: going into OVHcloud Reserved Instances or billing negotiation — that's a sales/commercial conversation, not a certification scope.

---

### Slide 7: Quotas and limits — what they are and where they live

**Visual concept**: A table with three columns and six rows. Column headers: "Resource" / "Default quota" / "Current usage". Rows: Compute instances (20 / 3), vCPUs (40 / 18), RAM GB (100 / 36), Floating IPs (10 / 2), Volumes (40 / 8), Volume storage GB (10000 / 280). One row — vCPUs — is highlighted in orange with a "62% used" label and a warning note: "plan for the next environment now." A tab switcher at the top: "Manager view | `openstack quota show`".

**Talking points**:
- **Quotas** are soft ceilings per resource type, per region, per project — set by OVHcloud to prevent runaway spend and protect shared capacity.
- **Default quotas** are conservative — they assume a first project for testing. As the project grows, requests are expected and routinely approved.
- **Where to find them**: Manager → Public Cloud → Quotas and Regions, or `openstack quota show` for the programmatic view (same data, machine-readable).
- **The growth signal**: when you approach 70-80% of a quota, request an increase before you need it — the process takes up to 24-48h for Standard support.
- **Quota ≠ billing limit** — hitting a quota blocks resource creation, it does not cap your bill. Billing is a separate control (budget alerts).

**Trainer notes**:
- Demander: "which resource is most likely to be the first ceiling you hit at Northwind?" — answer varies, but vCPUs is usually first for most teams deploying multi-instance stacks.
- Souligner que les quotas sont par région — si on veut déployer en SBG et en GRA, les quotas sont indépendants pour chaque région.
- Anticiper: "can I set my own lower limit to prevent accidental overspend?" — no, quotas are OVHcloud-set floors (minimum 0) and ceilings. Budget alerts are the tool for self-imposed spend caps.
- AWS cross-ref: Service Quotas, same concept, same increase process via the console or API.

---

### Slide 8: Requesting a quota increase

**Visual concept**: A three-step numbered flow using `<OvhStep>` components. Step 1: "Check current quota" — Manager → Public Cloud → Quotas, or `openstack quota show`; identify the resource and the gap. Step 2: "Open a support ticket" — category: Quota Increase; required fields: resource type, target value, business justification, region; expected format: "I need X vCPUs in GRA to deploy environment Y by date Z". Step 3: "OVHcloud review & grant" — Standard SLA: up to 24-48h; Premium SLA: faster; justified requests are rarely rejected. An `<OvhWarning title="Plan ahead">` callout: "Do not wait until you hit the limit in production. Request at 70% usage, not at 100%."

**Talking points**:
- The process is **asynchronous** — submit the ticket, wait for the grant, then deploy. Plan 3-5 business days of buffer for Standard support.
- **The justification is not bureaucratic** — it enables OVHcloud to allocate physical capacity in the region. A vague justification ("I need more") takes longer than a specific one ("I need 20 more vCPUs in GRA to deploy a second production tenant for customer X by March 1").
- **Quota increases are per region** — if you want to expand in both GRA and SBG, open one ticket per region.
- Once granted, the new quota is visible immediately in the Manager and the OpenStack quota API.
- There is no quota increase fee — it is a capacity reservation, not a billing event.

**Trainer notes**:
- Souligner the "plan ahead" message — the most common learner mistake is discovering the quota wall during a production deployment sprint.
- If learners ask: "can I automate a quota increase via the OVHcloud API?" — yes, but the endpoint requires manual review on OVHcloud's side regardless; the API just routes the ticket programmatically. Not worth automating at this scope.
- Vérifier que les learners comprennent la différence quota / budget: one is a resource ceiling (blocks creation), the other is a spend alert (doesn't block anything).

---

### Slide 9: The OVHcloud status page — reading an incident

**Visual concept**: A status.ovhcloud.com mockup showing three rows. Row 1: a green "Operational" dot labeled "Public Cloud — Global — Object Storage". Row 2: an orange "Degraded performance" dot labeled "Public Cloud — GRA — Compute" with a sub-note "Investigating since 09:42 UTC". Row 3: a yellow "Scheduled maintenance" dot labeled "Public Cloud — SBG — Network — 2026-06-15 02:00-04:00 UTC". Below, an expanded incident panel showing five lifecycle states: Investigating → Identified → Monitoring → Fix deployed → Resolved. The current state "Investigating" is highlighted.

**Talking points**:
- **status.ovhcloud.com** is the source of truth for any OVHcloud-side issue — check it before opening a support ticket.
- **Five incident lifecycle states**: Investigating (we know something is wrong), Identified (root cause known), Monitoring (fix applied, watching), Fix deployed (resolved at service level), Resolved (confirmed and closed).
- **Subscribe to status updates** for your regions via email or Atom/RSS — the Manager also surfaces active incidents on the project dashboard banner.
- If the status page shows your service as degraded: wait, monitor, and check the ticket updates — adding another ticket about the same incident delays the team.
- After a major incident, OVHcloud publishes a **Post-Incident Report (PIR)** with root cause and remediation — the status page links to it.

**Trainer notes**:
- Demander aux learners: "you open the Manager Monday morning and a batch job failed overnight. First reflex?" — expected answer: check the status page before assuming it's a code or config issue.
- Anticiper: "does OVHcloud notify by email automatically?" — not by default; the learner must subscribe on the status page or set up Manager → Alerts.
- Souligner que status.ovhcloud.com couvre tous les produits OVHcloud, pas seulement Public Cloud — utile pour repérer un incident Storage ou Network qui affecte le stack indirectement.
- Si un incident est en cours pendant la session → utiliser comme enseignement en temps réel; c'est une opportunité rare.

---

### Slide 10: Support channels and SLA tiers

**Visual concept**: A four-row comparison table. Column headers: "Level" / "Included with" / "Response SLA" / "Access channel". Rows: Community (all accounts; best-effort; docs.ovhcloud.com + community forum), Standard (all OVHcloud contracts; best-effort; Manager ticket only), Premium (business contracts; guaranteed response time; Manager ticket + phone priority), Dedicated (enterprise; named Technical Account Manager; dedicated queue + direct contact). An `<OvhNotice title="Digital Starter default">` callout: "Standard is the included tier for pay-as-you-go accounts. No phone. Ticket response in business hours."

**Talking points**:
- **Community**: docs, forum, community Slack — free, unlimited, asynchronous. First stop for known issues.
- **Standard**: ticket support via the Manager — included in all OVHcloud accounts, no upgrade required. Best-effort SLA (typically 24-48h business hours). Adequate for non-urgent questions.
- **Premium**: contracted business SLA — guaranteed first response, phone access, priority queue. Northwind would want this before production go-live.
- **Dedicated**: a named TAM who knows your architecture — enterprise accounts. Not relevant at Associate scope, but worth knowing it exists.
- **The Manager is the primary channel** for Standard and Premium: Manager → Support → New Ticket. Do not use the community forum for security issues or billing disputes — those require a ticket.

**Trainer notes**:
- Rappeler la persona: Persona Digital Starter (pay-as-you-go, <€2k/month MRR) has Standard by default — that means no phone, ticket only, best-effort. Frame expectations.
- Persona Corporate (Northwind in our scenario) should have or negotiate Premium before production go-live — this is a procurement conversation, not a certification one.
- Anticiper: "can I call OVHcloud directly?" — Standard: no. Premium: yes. Dedicated: yes, with a named contact.
- Vérifier que les learners ont trouvé le menu Support dans leur Manager avant de passer au slide suivant.

---

### Slide 11: Opening a good support ticket — the five-field rule

**Visual concept**: A ticket form mockup with five numbered fields, each highlighted in sequence. Field 1: Category (dropdown selected: "Billing — Subscription question"). Field 2: Project ID (pre-filled: `a1b2c3d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx`). Field 3: Affected resource(s) (text: "Volume ID: `vol-xxxxxxxx` — last seen attached to `nwa-pgsql-staging-01`"). Field 4: Timestamps (text: "Volume detached on 2026-06-05 ~14:00 UTC. Billing anomaly noticed on 2026-06-09."). Field 5: Symptom + what was already checked (text: "Volume appears in Consumption view as billing at €0.04/h since detach. Confirmed the volume is now deleted. Request review of billing for 2026-06-05 to 2026-06-09."). An `<OvhWarning title="Without these 5 fields">` callout: "The first reply will be a request for this information. That adds 24-48h. Submit complete."

**Talking points**:
- A complete ticket is faster to resolve — the support agent starts investigating immediately, with no clarification loop.
- **Field 1 — Category**: pick the most specific category available — billing questions and technical incidents route to different teams; mislabeling delays.
- **Field 2 — Project ID**: always include — it is the primary lookup key for the support agent. Found in Manager → Public Cloud → Project settings.
- **Field 3 — Affected resource(s)**: instance ID, volume ID, IP address — whichever is relevant. Found in Manager or via `openstack <resource> list`.
- **Field 4 — Timestamps in UTC**: "it was slow" is useless; "CPU exceeded 80% from 14:05 to 14:23 UTC on 2026-06-11" is actionable.
- **Field 5 — Symptom + what you already tried**: include a screenshot of the metrics or the Consumption anomaly; describe the impact on the business ("production API latency increased from 50ms to 3s").

**Trainer notes**:
- This is the `S05` anchor — the learner should leave able to write this ticket for any issue.
- Demander aux learners: "what's missing from this ticket: 'My instance is slow, please fix'?" — let them enumerate the five missing fields.
- Souligner the UTC requirement — OVHcloud support operates across time zones; local time without timezone is ambiguous.
- Éviter de digresser sur la gestion des incidents complexes (RCA, post-mortems) — ce n'est pas dans le scope Associate.

---

## Block 3 — Trainer Demonstration (15 min)

### Demo scenario

A Monday morning ops check on the Northwind production project in the Manager UI — "what happened over the weekend, and am I set up for next week's sprint?" The trainer plays the Cloud Ops engineer role end-to-end, narrating each decision as they make it. The demo closes with a partial ticket draft (not submitted) for the orphaned volume billing question.

### Demo script

| Step | Action | Expected output | Trainer commentary |
|---|---|---|---|
| 1 | Open Manager → Public Cloud → `northwind-production` | Project dashboard with resource count, active regions, consumption summary | "First thing every Monday: the project overview. I want to see if anything unexpected appeared over the weekend — a resource I didn't create, a cost spike I didn't authorize." |
| 2 | Click on `nwa-api-prod-01` → Metrics tab → CPU → last 24h | Time-series graph showing normal 20-40% CPU with a spike at Friday 17:30 | "There's the Friday spike. A batch report job kicked off at end of week — expected, but worth noting the duration. 45 minutes at 90% CPU on a d2-4 means the job barely fits. I'll flag this for the next right-sizing review." |
| 3 | Switch to RAM graph → last 24h | Flat line at ~55% | "RAM is stable. This instance is not memory-pressured. Good." |
| 4 | Switch to disk I/O → last 24h | Short write burst corresponding to the CPU spike | "Write burst aligns with the batch job — log writes. Nothing unexpected." |
| 5 | Navigate back to project level → Consumption tab | Daily bar chart, last 30 days. Table showing top line items including an "orphaned volume" line | "Here it is — a volume still billing at €0.04/h. It's been there for 7 days. That's ~€6.72 of forgotten billing. The name matches a volume from the staging teardown." |
| 6 | Open terminal, source `openrc.sh` for the production project, run `openstack quota show` | Table of quota resources and current/max values. vCPU: 18/40, RAM: 36/100, Instances: 3/20 | "We're at 45% vCPU usage. The CTO wants to spin up a customer-dedicated tenant next sprint — that's another 10 vCPUs minimum. Still within the 40 ceiling, but I'll request 60 now, not when we hit the wall." |
| 7 | Open `status.ovhcloud.com` in browser | Current status page — walk through what's shown (all green, or point out any active maintenance) | "I check this every morning. If I see an orange badge on GRA Compute, I don't open a ticket yet — I wait, subscribe to updates, and confirm whether it affects Northwind before escalating." |
| 8 | Open Manager → Support → New Ticket → select "Billing" category | Ticket form with fields | "Now I'm going to draft the ticket for this orphaned volume. Category: Billing — Subscription. Project ID: copy-paste. Resource ID: the volume from `openstack volume list`." |
| 9 | Fill in Fields 1-5 on the ticket form (narrate each one) | Form fills progressively | "Timestamps in UTC. What I observed. What I've already done — confirmed the volume is now deleted. I'm asking them to review the billing for 2026-06-05 to 2026-06-11. Complete, ready to submit." |
| 10 | Stop at Submit button | Form complete, not submitted | "I don't submit during the demo — that would create a real ticket. But you now have the five-field muscle memory. In the lab, you'll draft yours in a Markdown file." |

### Common demo failure modes

- If `openstack quota show` fails with `Authentication failed` → re-source the `openrc.sh` for the production project. The application credential used in Module 3.1 may have expired; use the staging one as fallback.
- If the Consumption view shows no orphaned volume (all volumes were correctly deleted in Module 3.1) → use a pre-captured screenshot from the demo prep as the reference. Point to the screenshot and explain what the learner should look for.
- If status.ovhcloud.com shows an active incident → use it live as a teaching moment. Walk through the incident lifecycle states using the real page rather than the mockup.

---

## Block 4 — Learner Lab (30 min)

### Lab brief (learner-facing)

You will spend 30 minutes establishing the Day-2 operational baseline for your Northwind project. You will read and interpret instance metrics, analyze your project's cost breakdown, check quotas from both the Manager and the CLI, and produce two deliverables: a support ticket draft (not submitted) and a one-page observability posture document. Allowed channels: Manager UI for metrics, consumption, and the ticket form; OpenStack CLI for quota inspection; any text editor for the written deliverables. You will not make any configuration changes to the stack — this is a read-only + write-to-Markdown session.

### Lab steps (learner-facing)

1. **Read instance metrics.** Open the Manager and navigate to your Northwind project (staging or production — whichever has at least one running instance). Open the Metrics tab for one instance. Select the last 24-hour window. Examine all four graphs (CPU, RAM, disk I/O, network). In your lab notes (`~/labs/3-2/notes.md`), write two sentences: one describing what you observe (e.g., "CPU averaged 12% over the last 24h with no spike"), and one assessing fit (e.g., "this instance is under-utilized for its flavor and could be downsized to the next tier").
2. **Analyze consumption.** Navigate to the project Consumption view. Read the last 30 days of daily spend. Identify the top cost contributor. Export the current month's consumption to CSV (the download button is in the top-right of the Consumption tab). Open the CSV and locate the single most expensive resource line. Add to `~/labs/3-2/notes.md`: the resource name, its hourly cost, its total cost this month. Note any resource that looks like a "forgotten" billing line (detached volume, unused IP, aged snapshot).
3. **Check quotas.** Run `openstack quota show` in a terminal with your application credential sourced. Save the full output to `~/labs/3-2/quota-output.txt`. For each resource type listed, manually compute the headroom: `headroom = max_value - in_use`. Add to `~/labs/3-2/notes.md`: which resource has the smallest headroom, and what you would do if you needed to deploy three more instances.
4. **Consult the status page.** Navigate to status.ovhcloud.com in your browser. Capture a screenshot of the current status for the GRA region (or your working region). Save it as `~/labs/3-2/status-screenshot.png`. In `~/labs/3-2/notes.md`, write one sentence: "At the time of the lab, the GRA Compute status was: [Operational / Degraded / Maintenance]."
5. **Draft a support ticket.** Using any text editor, create `~/labs/3-2/ticket-draft.md`. The scenario: "A block volume named `<initials>-nwa-pgsql-staging-data` was detached from instance `nwa-pgsql-staging-01` on [today's date] but continues to appear in the Consumption view. I have since deleted the volume. I am requesting a review of the billing for this volume for the last 7 days." Fill in all five fields: category, project ID (copy from Manager), resource description (volume name and approximate deletion date), timestamps (UTC), observed symptom and what you have already checked. Do not submit the ticket.
6. **Define your observability posture.** Create `~/labs/3-2/observability-posture.md`. This is the `A02` deliverable. It must contain three sections: (a) **Metrics to watch**: list three specific metrics for the Northwind production project (e.g., `nwa-api-prod-01` CPU should not exceed 80% sustained for more than 15 minutes) with proposed thresholds; (b) **Log retention target**: one sentence describing which logs from which service you would send to Log Data Platform first and why; (c) **Cost review cadence**: define the ritual — day of month, duration (e.g., 30 minutes), checklist (what to check in the Consumption view, which quota to verify, what to do if a forgotten resource appears).

### Validation criteria

- `~/labs/3-2/notes.md` contains at least: one metric observation + assessment sentence, top cost contributor with amount, smallest headroom resource.
- `~/labs/3-2/quota-output.txt` contains the raw output of `openstack quota show`.
- `~/labs/3-2/status-screenshot.png` exists and shows the GRA region (or the working region) status at the time of the lab.
- `~/labs/3-2/ticket-draft.md` contains all five fields, with no field left blank or placeholder.
- `~/labs/3-2/observability-posture.md` contains the three sections (metrics with thresholds, log retention target, cost review cadence) and is actionable — not a list of generic statements.

### Lab artifacts to produce

- `~/labs/3-2/notes.md` — metric observation, cost analysis, quota headroom.
- `~/labs/3-2/quota-output.txt` — raw `openstack quota show` output.
- `~/labs/3-2/status-screenshot.png` — status page capture.
- `~/labs/3-2/ticket-draft.md` — support ticket draft with all five fields.
- `~/labs/3-2/observability-posture.md` — baseline observability posture for the Northwind production project.

### Common lab support questions

- *The Manager Metrics tab shows "No data available" for the last 24h* → the instance may have been stopped. Start it first: `openstack server start <instance-name>`. Metrics populate within 5 minutes of the instance running. Alternatively, use the 7-day view if the instance was running earlier this week.
- *The Consumption view is empty or shows €0.00* → either the project is very new (less than 24h old, data is not yet aggregated) or voucher credits are covering all costs (the view shows net cost after credits). Check the "credits applied" line in the billing section of the Manager for confirmation.
- *`openstack quota show` fails with "Quota not found"* → some regions do not expose all quota types via the OpenStack API at this time. Run `openstack quota show --detail` for a more verbose output, or use the Manager UI Quotas tab as the reference.
- *I cannot find the Export button in the Consumption view* → the export feature is available in Manager → Public Cloud → Billing (not in the Consumption sub-tab in all UI versions). Use the billing section's export instead.
- *My ticket draft doesn't have a project ID* → it's in Manager → Public Cloud → (select your project) → settings or appears in the URL bar as a UUID after `cloud/pci/`.

---

## Block 5 — Micro-check QCM (5 min)

Format: 7 single-answer multiple-choice questions, formative (non-certifying).

### Question 1

- **Stem**: A Northwind operator wants to check whether the API instance's RAM usage has been increasing steadily over the last 7 days. Which Manager view should they use?
- **Correct answer**: B. The Metrics tab of the instance, selecting the "7 days" time range and the RAM graph.
- **Distractors**:
  - A. The project Consumption view, filtering by resource type "Compute" — *Why wrong*: the Consumption view shows cost data, not performance metrics; RAM usage is in the instance Metrics tab.
  - C. The OVHcloud status page, checking for a known memory-related service issue in the GRA region — *Why wrong*: the status page tracks OVHcloud-side service health, not per-instance resource utilization.
  - D. The OVHcloud Log Data Platform, running a log query for memory-related events — *Why wrong*: LDP stores log data if configured; RAM utilization over time is a metric, not a log event, and requires the Metrics tab.
- **LO traced**: `LO-OPS-S01`
- **Bloom level**: Apply

### Question 2

- **Stem**: Which of the following correctly identifies what the OVHcloud Manager Consumption view shows?
- **Correct answer**: C. Hourly billing data aggregated by day, broken down by resource type and individual resource, with a ~24h delay — allowing identification of top cost contributors without waiting for the month-end invoice.
- **Distractors**:
  - A. Real-time billing data updated every minute for all active resources in the project — *Why wrong*: OVHcloud Consumption data has a ~24h delay, not real-time granularity.
  - B. A list of all resource configuration changes made in the last 30 days, including who made them and when — *Why wrong*: that is an audit log function, not a billing view.
  - D. The monthly invoice issued by OVHcloud, showing net amounts after applicable credits and promotions — *Why wrong*: the Consumption view shows raw hourly consumption data; the finalized invoice is a separate document available under Manager → Billing.
- **LO traced**: `LO-OPS-K01` / `LO-OPS-S02`
- **Bloom level**: Remember / Understand

### Question 3

- **Stem**: The Northwind production project's vCPU quota is 40, and current usage is 32 vCPUs. The CTO wants to add a second customer tenant next sprint (estimated 10 additional vCPUs in the same region). What is the correct next action?
- **Correct answer**: A. Open a quota increase support ticket now, requesting at least 50 vCPUs in the region, with a business justification and target date — before the sprint begins.
- **Distractors**:
  - B. Wait until the sprint starts and attempt to deploy — if a quota error appears, open the ticket then — *Why wrong*: the increase process takes up to 24-48h; waiting until the wall is hit risks blocking the deployment mid-sprint.
  - C. Delete existing staging instances to free vCPU quota before adding production resources — *Why wrong*: deleting staging resources is a last resort and does not address the root issue; requesting an increase is the correct path.
  - D. Switch to a region with higher default quotas, such as SBG, to avoid the increase request — *Why wrong*: quotas are per-region and independent; deploying in a different region requires its own quota check, and may not align with the customer's data residency requirements.
- **LO traced**: `LO-OPS-K03` / `LO-OPS-S03`
- **Bloom level**: Apply

### Question 4

- **Stem**: A Northwind operator opens the Manager on Monday morning and sees a banner: "Public Cloud — GRA — Compute: Degraded performance since 07:23 UTC." A batch job failed overnight. What is the correct first action?
- **Correct answer**: D. Check status.ovhcloud.com for the incident details and subscribe to updates — do not open a new support ticket for the same incident while it is already being investigated.
- **Distractors**:
  - A. Immediately open a Priority support ticket describing the batch job failure and attaching logs — *Why wrong*: if the issue is already acknowledged on the status page, an additional ticket adds noise and delays the team already working on the incident.
  - B. Migrate the production instances to a different region (SBG) to restore service — *Why wrong*: a live cross-region migration is not a first response; wait for incident resolution unless you have a pre-built DR environment.
  - C. Restart all instances in the project to clear any transient cloud-side issue — *Why wrong*: restarting instances during a cloud-side degraded-performance incident may worsen the situation; follow the status page for guidance.
- **LO traced**: `LO-OPS-S04`
- **Bloom level**: Apply

### Question 5

- **Stem**: A Northwind operator opens a support ticket with the following description: "My instance is not responding." Which statement best describes why this ticket will be slow to resolve?
- **Correct answer**: B. The ticket is missing the instance ID, the timestamps of when the issue started, and a description of what has already been checked — the support agent's first reply will be a request for these details, adding 24-48h to the resolution.
- **Distractors**:
  - A. The ticket was submitted in the wrong category and will be automatically closed by the routing system — *Why wrong*: OVHcloud support re-routes mislabeled tickets rather than closing them; the bigger issue is missing information, not wrong category.
  - C. The ticket lacks a Premium SLA, which means it will never be investigated under Standard support — *Why wrong*: Standard support does investigate tickets; the SLA affects response time, not whether the ticket is worked.
  - D. The instance ID cannot be provided in a ticket — it must be gathered by the support team from the project — *Why wrong*: the instance ID is expected from the customer; providing it speeds up the investigation.
- **LO traced**: `LO-OPS-S05`
- **Bloom level**: Apply

### Question 6

- **Stem**: A Northwind Cloud Ops engineer sets a recurring calendar event for the first Monday of every month labeled "OVHcloud cost review — 30 min". During each session, they open the Consumption view, identify the top cost contributor, check for forgotten resources, and verify quota headroom. Which attitude does this practice most directly embody?
- **Correct answer**: A. `LO-OPS-A01` — applying a cost-review reflex at regular intervals on any production project, before cost anomalies accumulate into a large unexpected invoice.
- **Distractors**:
  - B. `LO-OPS-A02` — recommending a baseline observability posture for any new project — *Why wrong*: A02 is about defining the observability framework (metrics, logs, alerts) for a new project, not about a recurring cost-review ritual.
  - C. `LO-OPS-S02` — tracking project consumption and identifying top cost contributors — *Why wrong*: S02 is the skill of reading the Consumption view; A01 is the attitude of doing so regularly and proactively.
  - D. `LO-OPS-K03` — defining quotas and limits and how to request increases — *Why wrong*: quota awareness is part of the review, but the attitude described is cost-review regularity (A01), not quota knowledge (K03).
- **LO traced**: `LO-OPS-A01`
- **Bloom level**: Analyze

### Question 7

- **Stem**: A Northwind architect is setting up a new Public Cloud project for a second customer tenant. Which of the following most closely describes a baseline observability posture at the Associate level?
- **Correct answer**: C. Define three metrics to watch per critical instance with thresholds (CPU, RAM, disk), configure syslog forwarding to Log Data Platform for the application and database hosts, set a monthly cost-review calendar entry, and document the quota headroom before the first production deployment.
- **Distractors**:
  - A. Install Datadog agents on all instances, configure custom dashboards for each service, and set up PagerDuty alerting with on-call rotations — *Why wrong*: third-party APM and on-call tooling are valid operational choices but above the Associate scope; the baseline uses native OVHcloud tools.
  - B. Enable automated weekly snapshots of all instances and rely on the snapshot history as the sole observability record — *Why wrong*: snapshots are a backup/restore mechanism, not a monitoring tool; they provide no metric or log visibility.
  - D. Wait until the first production incident occurs, then configure monitoring based on what the incident reveals — *Why wrong*: reactive observability setup is the anti-pattern the module explicitly addresses; the posture must be defined before go-live.
- **LO traced**: `LO-OPS-A02`
- **Bloom level**: Analyze

---

## Block 6 — Wrap-up & Transition (5 min)

### Recap

By the end of this module the learner can:
- **Identify** the three native observability surfaces in OVHcloud Manager (instance metrics, consumption view, quota dashboard) and their AWS equivalents (`K01`)
- **Identify** the Log Data Platform and explain why centralized log collection matters for a self-managed stack like Northwind's PostgreSQL host (`K02`)
- **Define** quotas and limits on a Public Cloud project, interpret the headroom for each resource type, and explain the increase request process (`K03`)
- **Identify** the four OVHcloud support tiers and the SLA and access-channel differences relevant to the Digital Starter and Corporate personas (`K04`)
- **Read and interpret** the four instance-level metrics — CPU, RAM, disk I/O, network — from the Manager and draw operational conclusions (right-sizing, anomaly detection) (`S01`)
- **Track** project consumption over a billing period, identify top cost contributors, and surface forgotten resources in the daily spend breakdown (`S02`)
- **Check** current quotas via the Manager UI and `openstack quota show`, compute headroom per resource type, and open a quota increase ticket with a justified request (`S03`)
- **Consult** status.ovhcloud.com, read the five incident lifecycle states, and apply the correct response (subscribe, wait, correlate) to an ongoing OVHcloud-side incident (`S04`)
- **Open** a support ticket with all five required fields — category, project ID, resource ID(s), timestamps in UTC, and symptom with what was already checked (`S05`)
- **Apply** a cost-review reflex — a recurring calendar ritual to audit forgotten resources, right-sizing opportunities, and quota headroom before they become production surprises (`A01`)
- **Recommend** a baseline observability posture for any new project: three metrics with thresholds, one log stream to LDP, and a documented cost-review cadence (`A02`)

### Transition to next module via red-thread scenario

Northwind Analytics is now fully operational on OVHcloud Public Cloud Core. The learner, as the Cloud Ops engineer, has: provisioned the entire stack from scratch, secured it with IAM and Secret Manager, made it reproducible with Terraform, and established the Day-2 operational habits — metrics checks, monthly cost reviews, quota headroom awareness, and the support ticket discipline. The self-managed PostgreSQL instance that the CTO was unwilling to migrate at the start of the training is now hardened, backed up to Object Storage, running on a private network, and monitored via the Manager. The certification arc is complete.

What comes next is the **pre-exam consolidation session** — 1 hour of structured review across all 11 modules, learner-driven Q&A, and a mock micro-check set covering all nine domains. The exam itself — 60 multiple-choice questions, 90 minutes, closed-book — follows immediately after. The learner who leaves this module has the operational vocabulary, the hands-on muscle memory, and the attitude posture to pass that exam and — more importantly — to walk into their first day as an OVHcloud-certified Cloud Ops engineer and know what to do.

---

## Trainer FAQ (anticipated questions for this module)

**Q: Can I set up automatic alerts when CPU exceeds a threshold in OVHcloud Manager?**
A: Not directly from the native Manager metrics view at this scope. OVHcloud does offer budget alerts (Manager → Billing → Budget Alerts) for cost thresholds, and the status page has email/RSS subscriptions for service-level events. For metric-level alerting on instances, the path is to expose OVHcloud metrics via the Prometheus-compatible endpoint (available via the OVHcloud API) and connect it to Grafana + Alertmanager — that is the Professional-level observability setup. At Associate scope, the equivalent is the Monday morning metrics review reflex on the Manager. The learner is not under-equipped — they just build the habit first, then the automation.

**Q: Is the Log Data Platform difficult to configure? Can I set it up in an afternoon?**
A: For a basic syslog stream from one instance, configuration is about 30-45 minutes: create a Log Data Platform stream in the Manager (Manager → Logs Data Platform → Create stream), note the GELF input endpoint, configure rsyslog on the instance to forward to that endpoint (`/etc/rsyslog.d/ovh-ldp.conf`, 5 lines), restart rsyslog, verify logs appear in the Graylog web UI. The documentation at docs.ovhcloud.com has a step-by-step guide with the exact rsyslog syntax. Filebeat is the alternative for structured JSON logs — heavier setup, richer filtering. The "afternoon" estimate is accurate for a single instance; scaling to 5 instances with structured application logs is 2-3 hours more.

**Q: What happens if I exceed a quota — does OVHcloud automatically shut down my instances?**
A: No. Quotas are creation ceilings, not runtime limits. Exceeding a quota means you cannot create additional resources of that type — existing resources keep running. If you attempt to create a new instance and hit the instance count quota, the OpenStack API returns an error (HTTP 403, "Quota exceeded for instances") and the creation fails. No existing resource is affected. The risk is operational: if you hit the ceiling during a production scaling event (e.g., manual scale-up during a traffic spike), you cannot add capacity until the increase is granted. This is why the "request at 70% usage" rule exists.

**Q: What is the difference between the Consumption view and the monthly invoice?**
A: The **Consumption view** shows raw, hourly-granularity billing data for the current month — it is a running tally, updated with approximately a 24-hour delay. It is the operational tool for day-to-day cost monitoring and anomaly detection. The **monthly invoice** is the finalized billing document issued at the end of the billing period (usually the first business day of the following month), showing net amounts after applying credits, vouchers, and discounts. The invoice is a legal/accounting document; the Consumption view is an operational dashboard. For cost control, use the Consumption view — do not wait for the invoice.

**Q: Can I automate the cost-review check? For example, run a script that emails me if my daily spend exceeds a threshold?**
A: Yes, via the OVHcloud API. The `/me/consumption` and `/cloud/project/{serviceName}/usage/current` endpoints expose the same data the Manager Consumption view shows, in JSON. A simple Python script polling these endpoints daily and emailing an alert is a straightforward automation. OVHcloud also offers native budget alerts in Manager → Billing → Budget Alerts, which send an email when a monthly spend threshold is reached — simpler to configure but less granular. At Associate scope, the native budget alert is the recommended starting point; the API-based automation is a Professional-level exercise.

**Q: Why doesn't OVHcloud offer a phone support hotline for all customers, like some hyperscalers do?**
A: This is a commercial model choice. OVHcloud's pricing is built on operational efficiency — the Standard support tier is included in all contracts at no additional cost, but phone access is a Premium (contracted) feature. AWS, Azure, and GCP follow the same model: phone support requires a paid plan (AWS Business, Azure Pro Direct, GCP Enhanced). The difference is that OVHcloud Standard includes ticket support, whereas AWS Basic (free) includes no direct human contact at all. For Northwind's Corporate persona, the recommendation is to contract Premium support before production go-live — the cost of one serious production incident without a guaranteed SLA typically exceeds the annual Premium contract cost.

**Q: How do I know if an incident on the OVHcloud status page affects MY specific project and resources?**
A: The status page is region- and product-granular but not project-granular — it tells you "GRA Compute is degraded," not "your specific instance `nwa-api-prod-01` is affected." To verify if your specific resources are impacted: (1) check if your instances respond (SSH, HTTP, or `openstack server show <id>`); (2) if the status page says "Degraded performance — GRA Compute," assume any instance in GRA Compute may be affected until the incident is resolved; (3) if your instances respond normally despite the banner, you are likely outside the affected scope (some incidents affect a subset of physical servers); (4) open a support ticket referencing the incident only if your instance is visibly impaired — include the incident reference number shown on the status page.
