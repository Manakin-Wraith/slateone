# SlateOne — Frequently Asked Questions

> Draft for the landing page. Copy is written for prospective customers (filmmakers, line producers, ADs, production coordinators). Items marked **⚠️ Confirm** contain a claim that isn't settled in the codebase — verify before publishing.

---

## Getting started

### What is SlateOne?

SlateOne is an AI-powered screenplay breakdown and production management tool. Upload your script as a PDF and SlateOne reads it scene by scene, automatically pulling out everything a production needs to track — cast, props, wardrobe, locations, and more — then helps you turn that into a shooting schedule, share it with your team, and generate production reports.

Think of it as a first assistant director's prep pass, done in the background in minutes instead of days.

### Who is SlateOne for?

Filmmakers, line producers, assistant directors, production coordinators, and anyone responsible for prepping a shoot — from indie shorts to features. If you'd normally break down a script by hand with a highlighter and a stack of sides, SlateOne is built for you.

### How do I get started?

Create an account, upload your script as a PDF or Final Draft file, and SlateOne begins analyzing it right away. You'll get a scene-by-scene breakdown you can review, edit, schedule, and share.

### What do I need to upload?

Your screenplay as a **PDF** or a **Final Draft (`.fdx`) file** (max 10MB). SlateOne reads the text directly from the document — scene headings, action, and dialogue — to build your breakdown. Fountain and other formats aren't supported yet.

---

## How the AI works

### What does the AI actually do?

For **every scene**, the AI identifies the production elements you'd normally break down by hand:

- **Cast** — speaking and non-speaking characters, plus background extras
- **Props**
- **Wardrobe, makeup, and hair**
- **Special effects, stunts, vehicles, and animals**
- **Sound and location details**

Beyond individual scenes, it also builds the bigger picture: a summary of your **story arc**, **character profiles** (where each character appears and how they develop), and a consolidated view of your **locations**. It even flags **flashbacks, dreams, and story-day changes** so your schedule reflects the real shooting timeline, not just page order.

### Can I trust what the AI produces? Does it make things up?

SlateOne is specifically built to avoid guessing:

- **It works from your actual script.** Scene numbers and structure come straight from your document — the AI enriches what's already there. It doesn't invent scenes or renumber them.
- **It only reports what's on the page.** If an element isn't written into a scene, it won't appear in your breakdown.
- **You stay in control.** The AI gives you a fast, complete first pass — everything is fully editable, so you're reviewing and refining rather than starting from a blank page.

### How long does the analysis take?

The breakdown runs **in the background** after you upload, processing scene by scene. You can keep working while it runs, and results fill in as each scene is analyzed.

As a reference point, a 100-page, 120-scene script typically takes **10–15 minutes** to fully analyze. Processing is paced to respect AI provider rate limits, so timing scales with script length.

### Is the AI a replacement for a person?

No — it's a head start. SlateOne handles the tedious first pass so your team can spend its time on judgment calls, creative decisions, and the details that need a human eye. You review and adjust everything.

---

## Features & workflow

### What can I do after the breakdown is ready?

- **Review and edit** every scene's breakdown elements
- **Build a shooting schedule** on a stripboard
- **Collaborate** with your team
- **Generate production reports** as PDFs to share or print

### Can I work with my team?

Yes. You can invite team members to collaborate on a production, so your AD, coordinator, and department heads are working from the same breakdown and schedule.

Every teammate is assigned one of four roles, each with more access than the last:

- **Viewer** — read-only access to the breakdown and schedule
- **Member** — can edit breakdown elements and the schedule
- **Admin** — can also invite/remove teammates and change their roles
- **Owner** — the production's creator; full control, including admin management

Admins and owners can invite people and set their role at invite time (defaulting to Member); no one can grant a role higher than their own.

### Can I export or print my breakdown and reports?

Yes — SlateOne generates production reports as PDFs you can download, print, or share.

---

## Pricing & account

### How much does SlateOne cost?

Uploading and editing scripts is always free — you only pay when you run a breakdown. Two ways to pay for that, priced in **ZAR**:

- **Project** — **R2,250 per breakdown**. For individual filmmakers working solo; no crew collaboration.
- **Studio** — unlimited breakdowns for your whole crew, on a fixed-term commitment:

  | Plan | Price | Seats included | Extra seat |
  |---|---|---|---|
  | Studio 3 | R5,500 / 3 months | 1 | R750 flat |
  | Studio 6 | R9,500 / 6 months | 2 | R1,500 flat |
  | Studio 12 | R18,500 / year | 3 | R3,000 flat |

Studio includes crew invites, department workspaces, cross-department threads, item tracking, and team access control on top of everything in Project.

*(Figures verified against `components/Pricing.tsx` as of this draft — recheck before publishing if pricing changes.)*

### How do I pay?

The landing page doesn't take payment directly. You enter your email, choose a plan and (for Studio) a commitment length, and we redirect you to `app.slateone.studio` to create your account and complete signup.

Billing itself runs through **PayFast**, South Africa's payment gateway, in ZAR. PayFast supports Visa/Mastercard credit and debit cards, Instant EFT, and local wallets/QR methods like SnapScan and Zapper.

### Is there a free trial?

No — SlateOne is paid-only. Uploading and editing scripts is free with no account limits; you only pay when you actually run a breakdown (Project) or take out a Studio plan.

### Can I cancel anytime?

Project has nothing to cancel — it's a one-off charge per breakdown, not a subscription.

Every Studio plan (3, 6, or 12 months) is a **prepaid term**: you pay upfront and have full access for that whole period. You can cancel at any time to stop the *next* renewal, but — standard practice for prepaid terms — the current term itself is non-refundable and runs to its end date; there's no partial refund for unused time.

> **⚠️ Confirm:** This follows standard prepaid-subscription practice, but it's still a policy decision your team should formally sign off on (and the app doesn't yet have a self-serve "cancel" action wired up in the code as of this draft — renewals are charged manually via PayFast's Recurring Billing API using a stored token, not on an automatic timer). Confirm the actual cancellation mechanics with your team before publishing.

---

## Data & security

### Who can see my script?

Your script and its breakdown are private to your account and the team members you explicitly invite — access is scoped per-production by role (Viewer/Member/Admin/Owner), so nobody outside a production's invited crew can see it. We don't share your script content with any third party beyond the infrastructure providers required to run the service (our database provider and our AI analysis provider — see below).

### How is my data stored and protected?

Your data lives in a managed Supabase (Postgres) database. Access from the app is authenticated per-user, and cross-production access is blocked by the role-based model described above. Supabase does not sell customer data, and shares it only with the sub-processors needed to operate its platform, under contractual confidentiality terms (see [Supabase's Privacy Policy](https://supabase.com/privacy) and [Data Processing Addendum](https://supabase.com/legal/customer-resources/data-processing-addendum)).

> **⚠️ Confirm:** Do not publish specific compliance claims (encryption at rest/in transit specifics, backup/retention windows, certifications like SOC 2) beyond what's stated above without verifying them against your actual infrastructure config and any vendor agreements.

### Is my script used to train AI models?

No. SlateOne runs script analysis through the **paid tier** of the Google Gemini API, not the free tier and not the consumer Gemini app. Under Google's terms for paid Gemini API usage, prompts and responses are **not used to train or improve their models** — Google only retains them briefly for abuse/safety monitoring and legal compliance, not model training. (Source: [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms).)

> **⚠️ Confirm:** Re-check Google's terms periodically since provider policies can change.

---

## Support

### I have a question that isn't answered here.

Email us at **hello@slateone.studio** and we'll get back to you.

---

*This is a working draft. Sections marked ⚠️ Confirm need a decision or verification before this page goes live.*
