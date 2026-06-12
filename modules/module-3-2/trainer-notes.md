---
# ============================================================
# Module 3.2 -- Operations -- Monitoring, Cost, Quotas & Support
# Trainer notes -- preparation deck
# ============================================================
theme: ../../theme-ovhcloud
title: Operations -- Monitoring, Cost, Quotas & Support -- Trainer Notes
class: text-left
mdc: true
exportFilename: 'modules/module-3-2/trainer-notes'
controls: false
download: false
selectable: true
moduleId: "3.2"
moduleTitle: "Operations -- Monitoring, Cost, Quotas & Support"
duration: "1h30"
program: "OVHcloud -- Public Cloud -- Core Associate"
los: [LO-OPS-K01, LO-OPS-K02, LO-OPS-K03, LO-OPS-K04, LO-OPS-S01, LO-OPS-S02, LO-OPS-S03, LO-OPS-S04, LO-OPS-S05, LO-OPS-A01, LO-OPS-A02]
layout: trainer-cover
---

# Module 3.2 -- Trainer Notes
## Operations -- Monitoring, Cost, Quotas & Support

Preparation deck · ~10 min read · Pair with `slides.md` in `/presenter`

---
layout: default
---

# Pre-flight

- Day 3 second module. Learners come from the Terraform lab. Energy may dip -- open with the Monday morning scenario, not admin.
- Manager UI open in a second window, Northwind Public Cloud project visible. No code editor needed this session.
- One running instance in the project required. If not: `openstack server start nwa-api-prod-01` or trainer recovery script `~/demos/3-2-recovery/terraform apply -auto-approve` (~2 min).
- `status.ovhcloud.com` pre-loaded in a browser tab. If a live incident is showing, keep it -- rare teaching opportunity.
- No pre-written code or scripts. The entire demo is browser + one CLI command.

---
layout: default
---

# Block 1 -- Sentier battu (5 min)

**Posture**: quick diagnostic, set the Day-2 mental frame.

- Opening question: *"Your Northwind production has been live since yesterday. What is the first thing you check this morning?"* Let the room answer -- do not reveal the three Manager views yet.
- Hors piste check: hands up for no running instance. Fire recovery now, not when the lab starts.
- Datadog / Grafana raised already: *"Native baseline first. Third-party integration is Professional scope."* Park it.
- Close: *"Today is about watching the system we built, not building more of it."*

**Anti-pattern**: do not start the three-views overview here. That is Block 2, slide S04.

---
layout: default
---

# Block 2 -- Theory (30 min)

**Posture**: 3 min/slide average. Conversational, not declarative. High-value moments below.

- **S03** (Day-2 shift): open with *"Terraform repo is clean. Production is live. Something breaks at 2am. What do you check first?"* Leave the three operational questions visible.
- **S04** (three views): use as a navigation card for the block. *"We visit each of these panels in the next 10 minutes."*
- **S05** (metrics): ask *"what does a CPU spike at 14:00 on a Friday tell you?"* The reflex of asking is the point. Note: hypervisor-level collection, no agent required.
- **S07** (Consumption): ask *"does anyone know what their project cost yesterday?"* -- silence is effective. Underline the 24h delay: it surprises ex-AWS profiles expecting near-real-time.
- **S08** (cost leaks): anchor the red thread -- *"that detached volume from Module 2.1 is still billing. We will see it in the demo."*
- **S11** (status page): drill the reflex -- *"status page before support ticket, every time."*
- **S13** (support ticket): exercise -- *"what is missing from 'My instance is slow'?"* Let them enumerate the five missing fields before moving on.

**Anti-pattern**: do not configure LDP (S06) live. Positioning only -- setup via rsyslog/Filebeat is Professional scope.

---
layout: default
---

# Block 3 -- Demo (15 min)

**Posture**: narrate decisions, not clicks. The Day-2 mental loop is the lesson.

<div class="text-xs">

| # | Action | Verbalize |
|---|---|---|
| 1 | Manager → Public Cloud dashboard | *"Quick project check before anything else."* |
| 2 | Instance nwa-api-prod-01 → Metrics → CPU → 24h | *"Spike at 17:30 Friday. That is the deploy. Expected."* |
| 3 | Switch to RAM → 7 days | *"Flat plateau. Stable. Right-sized for now."* |
| 4 | Switch to disk I/O | *"Write burst aligned with the deploy. Normal log flushing."* |
| 5 | Manager → Consumption | *"Compute is top contributor. Normal. But -- what is that last line?"* Point to the orphaned volume. |
| 6 | Terminal: `openstack quota show` | *"22 of 40 vCPUs free. Room for the next sprint. If we needed 25 more, we would request now."* |
| 7 | status.ovhcloud.com | *"GRA is green today. Subscribe to region updates before you need them."* |
| 8 | Manager → Support → New Ticket | Fill all 5 fields for the orphaned-volume scenario. Narrate each field. Stop before Submit. |

</div>

**Failures**: no metrics data → instance stopped, `openstack server start nwa-api-prod-01`, wait 5 min · Consumption empty → project too recent, use S07 slide screenshot · status.ovhcloud.com unreachable → cached screenshot at `~/demos/3-2/status-page.png`.

---
layout: default
---

# Block 4 -- Lab (30 min)

**Posture**: read-only session. No infrastructure changes. Circulate and prompt interpretation, not screenshots.

- Remind at the start: all output goes to files, nothing is submitted, nothing is modified in the stack.
- Top blockers: Metrics tab empty (instance stopped -- start it, wait 5 min) · Consumption CSV slow to generate (normal, 10-15 s).
- Step 3 (`quota show`): push learners to compute headroom themselves, not just copy the raw output.
- At 20 min: anyone not yet at Step 5 should skip Step 4 and move forward.
- Step 6 (`observability-posture.md`) is the A02 deliverable -- the most important step. Reserve at least 8 min. Steps 4-5 can be abbreviated if time is short.
- Close: *"If you have a posture file with three metrics and a cost cadence, you finished the module."*

**Anti-pattern**: do not let any learner submit the support ticket in Step 5. Remind verbally before they reach it.

---
layout: default
---

# Block 5 -- Micro-check (5 min)

**Posture**: formative, ~40 s per question.

- **Q2** (`K01`, Consumption delay): common miss for ex-AWS profiles expecting near-real-time. If missed, restate the 24h delay in one sentence.
- **Q4** (`S04`, status page reflex): wrong answer means S11 did not land. Replay in 30 s: *"Status page before ticket. Every time."*
- **Q5** (`S05`, ticket quality): wrong answer means the 5-field rule is not memorised. It will appear on the exam. Replay S13.
- **Q7** (`A02`, minimum posture): wrong answer means Step 6 of the lab was not internalised. Ask the learner to name their three chosen metrics aloud.

---
layout: default
---

# Block 6 -- Wrap-up (5 min)

**Posture**: closure. This is the last content module.

- Let learners read the "You can now" list silently for 30 s. It covers all 11 LOs in scope.
- Final anchor: *"Northwind is provisioned, automated, monitored, and cost-controlled. Entirely on OVHcloud Public Cloud Core. No managed services."*
- Transition to pre-exam: *"Next is a one-hour consolidation session across all 11 modules. Then the final exam: 60 questions, 90 minutes, closed-book. You have what you need."*
- Leave S18 (arc table: Day 1 / Day 2 / Day 3) visible for a few seconds -- it is a good exam mental model.

**Anti-pattern**: do not start reviewing content from earlier modules here. That is the consolidation session's job.

---
layout: two-cols
---

# FAQ

::left::

<div class="-mt-8">

**"Can I set up alerts on instance metrics in the Manager?"**

Not at Associate scope. The Metrics tab is read-only -- no native threshold alerting on instance-level graphs. The Professional path is Prometheus with the OVHcloud metrics exporter and Grafana. At Associate scope, the compensating control is the monthly cost-review reflex (A01) and the status-page subscription. For spend-cap alerts, Manager → Billing → Budget Alerts sends a notification when spend crosses a threshold -- that is in scope.

**"What is the difference between a quota and a budget alert?"**

A quota blocks creation at the API level. If your vCPU quota is 40 and you request the 41st, the API returns an error and no resource is created. A budget alert does not block anything -- it sends a notification when spend crosses a threshold. Both are useful; they answer different questions.

</div>

::right::

<div class="-mt-8">

**"Is Standard SLA enough for a production database?"**

Technically yes by contract. In practice: a 24-48h best-effort response window means your PostgreSQL could be unavailable for two business days before OVHcloud responds. The recommendation is Premium before any customer-facing production workload. The annual Premium contract cost is typically less than one day of production incident impact.

**"Should logs go to LDP or to Object Storage?"**

LDP is searchable, retained, and accessible from the Manager UI. Object Storage is a dump -- cheaper per GB, but you cannot search it without building a pipeline. For Northwind's self-managed PostgreSQL logs at Associate scope, LDP is the correct answer. S3-compatible log archival as a cost optimisation at scale is Professional scope.

</div>

---
layout: default
---

# Post-session debrief

- Did the orphaned-volume moment land in the Consumption demo? If learners did not surface it in their own projects during the lab, add a call-out annotation to Step 2.
- Q7 (observability posture) wrong rate above 30%? Step 6 of the lab did not produce a concrete file. Add a 2-minute share-out round before the micro-check in the next delivery.
- Any questions about Datadog, Prometheus, or Grafana? Log them for the Professional-level module outline.
- Did any learner submit the support ticket in Step 5? Debrief privately -- a real ticket creates operational noise at OVHcloud.
- Parking-lot question you could not answer cleanly? Add it to the FAQ before next delivery.
