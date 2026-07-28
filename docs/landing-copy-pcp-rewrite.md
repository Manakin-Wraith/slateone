# Landing Page Copy Rewrite — PCP Model (Problem → Consequence → Payoff)

**Status:** Draft for review
**Goal:** Replace developer-voiced copy ("structured production intelligence", "unified operating layer", "data pipeline") with copy that speaks to producers, line producers, ADs and indie filmmakers in their own language — the late nights, the spreadsheet chaos, the revision panic.

---

## Guiding Principles

- **Speak to the person, not the architecture.** Users don't buy "a production operating layer" — they buy getting their weekend back and never redoing a breakdown after a script revision.
- **PCP flow across the whole page:** the page itself should read as one PCP arc — Hero (Problem hook), IndustryReality (Problem + Consequence), OperatingLayer/SystemArchitecture (Payoff), BuiltFor/Pricing (Payoff + proof + action).
- **Cut the jargon list:** "structured data", "operating layer", "data pipeline", "operational discipline", "consolidates/transforms/centralizes", "single source of production truth" → replace with plain outcomes.
- **Keep the confident, cinematic tone.** Short sentences. Second person. Concrete numbers where possible.

---

## 1. Hero (`components/Hero.tsx`)

### Current
> **The Operating System for Modern Film Production.**
> SlateOne converts scripts into structured production intelligence and replaces fragmented workflows with a unified operating layer.

**Why it fails:** "Operating system", "structured production intelligence", "unified operating layer" — three abstractions in two lines. Nothing a producer feels.

### Suggested (PCP: lead with the problem the user lives)

**Option A — Pain-first**
> **Stop Breaking Down Scripts by Hand.**
> Upload your script. SlateOne pulls out every scene, cast member, prop and location in minutes — so your whole crew works from one live breakdown instead of five versions of a spreadsheet.

**Option B — Time-first**
> **Your Breakdown, Done Before Lunch.**
> What takes days of highlighting and data entry, SlateOne does in minutes. Breakdowns, reports and schedules that update themselves every time the script changes.

**Option C — Outcome-first**
> **From Script to Shooting Schedule. Without the Spreadsheets.**
> SlateOne reads your script, builds your breakdown, and keeps every report and schedule in sync — even when revisions drop the night before.

**CTA suggestions:**
- Primary: `View Pricing` → **"Break Down My Script"** or **"Start My First Breakdown"** (action tied to value, not to pricing)
- Secondary: keep demo mailto, relabel **"Talk to Us"** → **"See It on Your Script"**

---

## 2. Industry Reality (`components/IndustryReality.tsx`)

This is the natural **Problem + Consequence** section. The structure is right; the language should get more visceral and human.

### Current
> **The Way Productions Still Operate**
> Most productions still rely on disconnected systems — spreadsheets for breakdown, PDFs for reports, chat apps for coordination. The result is friction at every stage of production.

### Suggested

**Headline:**
> **You Know This Week.**

or

> **Sound Familiar?**

**Body (Problem):**
> A revision lands at 11pm. The breakdown spreadsheet is now wrong. The DOOD is wrong. The schedule is wrong. Someone has to fix all three by call time — and that someone is probably you.

**Pain points list — rewrite from system-speak to lived experience:**

| Current | Suggested |
|---|---|
| Manual script breakdowns — Line-by-line, page-by-page data entry | **Days lost to highlighters and data entry** — every scene, tagged by hand, again |
| Static PDF reports — Outdated the moment a revision drops | **Reports that die on arrival** — one revision and every PDF you sent is wrong |
| Excel-based scheduling — Disconnected from breakdown data | **Schedules that don't know the script changed** — you find out on set |
| Fragmented crew communication — WhatsApp threads, email chains, lost context | **"Which version are we on?"** — answers buried in WhatsApp and email chains |
| No central production data layer — Every department operates in isolation | **Every department flying blind** — five versions of the truth, none of them current |

**"The Cost" block (Consequence) — replace abstract nouns with felt costs:**
- Current: `Administrative drag, Data duplication, Version confusion, Lost time, Operational risk`
- Suggested: **`Late nights redoing work` · `Wrong props on set` · `Crew working off old versions` · `Budget leaks you can't trace` · `Mistakes that cost shoot days`**

---

## 3. Operating Layer (`components/OperatingLayer.tsx`)

This is the pivot to **Payoff**. The current positioning-statement copy is the most developer-voiced on the page.

### Current
> **A Production Operating Layer**
> SlateOne is not a script analyzer. Not a breakdown app. Not a scheduling tool. It is the production infrastructure that consolidates, transforms, and centralizes every operational workflow into a single source of production truth.

### Suggested

**Headline:**
> **What Changes When You Switch**

or

> **One System That Actually Keeps Up**

**Body (Payoff):**
> Upload the script once. SlateOne builds the breakdown, generates the reports, and connects the schedule — and when the script changes, everything updates with it. No re-typing. No re-sending. No "final_v3_FINAL.xlsx".

**Capability cards — rewrite titles/descriptions from architecture to outcomes:**

| Current | Suggested |
|---|---|
| **Script → Structured Data** — "Scripts are converted into structured production data…" | **Breakdown in Minutes, Not Days** — Upload the PDF. Scenes, cast, props, wardrobe, vehicles and locations tagged automatically. You review and refine instead of typing from scratch. |
| **Breakdown → Dynamic Reports** — "Reports generated dynamically… Revisions propagate instantly…" | **Reports That Stay Current** — DOODs, element lists and one-liners built live from your breakdown. When a revision drops, every report is already updated. |
| **Visualization → Kanban Control** — "Production elements visualized by story day…" | **See Your Whole Production at a Glance** — Boards by story day, location or character. Every department sees exactly what they need — no digging through email. |
| **Scheduling → Connected Intelligence** — "Scheduling connected directly to breakdown data…" | **A Schedule That Knows the Script** — Your stripboard is built on the breakdown itself. Cut a scene, and the schedule already knows. |

---

## 4. System Architecture (`components/SystemArchitecture.tsx`)

### Current
> **From Script to Production Control**
> One continuous data pipeline. Every stage connected. No fragmentation.
> Footer line: *One System. Complete Visibility. Operational Control.*

### Suggested

**Headline:**
> **From First Read to Final Schedule**

**Sub:**
> Upload once. Everything downstream — breakdown, reports, boards, schedule — flows from the same source and stays in sync.

**Flow step labels (soften the jargon):**
- `Script` → keep (sublabel: *"Just upload the PDF"*)
- `Structured Production Data` → **Your Breakdown** (*"Scenes, cast, props, locations — tagged automatically"*)
- `Reports / Kanban / Scheduling` → **Reports, Boards & Schedule** (*"Always current, always connected"*)
- `Production Execution` → **Shoot Day** (*"Everyone working off the same page"*)

**Reinforcement line:**
- Current: `One System. Complete Visibility. Operational Control.`
- Suggested: **`One upload. One breakdown. One version of the truth.`**

---

## 5. Built For (`components/BuiltFor.tsx`)

### Current
> **Built for Serious Production Teams**
> SlateOne is designed for production companies that treat filmmaking as an operational discipline — not a collection of disconnected tools.

**Why it fails:** "Operational discipline" is consultant-speak, and it subtly gatekeeps indie filmmakers — a core paying segment (see Solo tier).

### Suggested

**Headline:**
> **Built for the People Who Actually Run the Show**

**Body:**
> Whether you're a one-person indie or a production company juggling three shows, SlateOne handles the grunt work so you can spend your time producing — not typing.

**Role descriptions — outcome-per-role instead of system features:**

| Role | Current | Suggested |
|---|---|---|
| Production Companies | "Centralized operational control across all active productions." | See every active production in one place — and stop paying per-seat for the privilege. |
| Producers | "System-level visibility from script to scheduling to execution." | Know where your production stands without asking three people first. |
| Line Producers | "Structured breakdown data connected directly to budget and schedule." | Breakdown numbers you can actually budget against — accurate and always current. |
| UPMs | "Dynamic reporting and resource allocation from a single data source." | Reports on demand, not reports rebuilt every time the script moves. |
| First ADs | "Connected scheduling intelligence built on real breakdown data." | Build a stripboard on the real breakdown — not a copy-paste of a copy. |

**Testimonial:** Keep the Dan Jawitz quote — it's the strongest human copy on the page. Consider moving it **up** (into or right after IndustryReality) as early proof.

---

## 6. Pricing (`components/Pricing.tsx`)

Mostly good — this section already speaks human ("No more emailing spreadsheets"). Minor tightening:

- Header sub: keep, but lead with the free part:
  > **"Upload and edit scripts free, forever. You only pay when you run a breakdown — or license the whole crew for the year."**
- Solo tagline: `For individual filmmakers. Pay only when you run a breakdown.` → **"Making it on your own? Pay per breakdown, own everything it produces."**
- Closing "Who This Is For" lines: keep — `If your production runs on spreadsheets and fragmented tools, SlateOne replaces that system.` is already strong. Optionally sharpen: **"Still running your production on spreadsheets? SlateOne is the upgrade."**

---

## 7. Page-Level PCP Map (recommended narrative order)

| Stage | Section | Job |
|---|---|---|
| **Problem** (hook) | Hero | Name the pain in the headline; promise the fix in one sentence |
| **Problem** (depth) | IndustryReality | Make them nod: "that's my Tuesday" |
| **Consequence** | IndustryReality "The Cost" block | Late nights, wrong props, lost shoot days |
| **Payoff** | OperatingLayer | What life looks like after: minutes not days, everything in sync |
| **Payoff** (how) | SystemArchitecture | Simple visual: upload once → everything flows |
| **Payoff** (proof) | BuiltFor + testimonial | Real producer, real film, real saved time/money |
| **Action** | Pricing | Low-friction entry (free upload, pay per breakdown) |

---

## 8. Words to Retire / Words to Use

| Retire | Use instead |
|---|---|
| structured production intelligence | your breakdown, done for you |
| unified operating layer / operating system | one system / one place |
| data pipeline | everything stays in sync |
| consolidates, transforms, centralizes | replaces the spreadsheets |
| single source of production truth | one version of the truth |
| operational discipline / operational control | run the show / stay on top of it |
| production infrastructure | the tool your whole crew works from |

---

## Next Steps

1. Pick a Hero option (A/B/C) — this sets the voice for everything downstream.
2. Approve/edit the section rewrites above.
3. Implement in components (`Hero.tsx`, `IndustryReality.tsx`, `OperatingLayer.tsx`, `SystemArchitecture.tsx`, `BuiltFor.tsx`, `Pricing.tsx`).
4. Update `docs/marketing-reference.md` to match the new voice so ads/social stay consistent.
