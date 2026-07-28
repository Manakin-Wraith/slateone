# FAQ Page — Design

## Context

`docs/landing-faq.md` is a content draft for a customer-facing FAQ, written for prospective customers (filmmakers, line producers, ADs, production coordinators). Several answers were marked `⚠️ Confirm` — business decisions not determinable from the codebase. Those have now been resolved (see Content below) and this spec turns the draft into a real page on the landing site.

## Placement

Standalone page, not a landing-page section. The content is deep enough (6 categories, ~20 Q&As) that it follows the same pattern as `PrivacyPolicy` / `TermsOfService`: a full page reached via a footer link, not embedded inline like `Pricing`.

## Architecture

**No router in this codebase** — `App.tsx` switches between views via the `AppState` enum in `types.ts` (`LANDING` / `PRIVACY_POLICY` / `TERMS_OF_SERVICE`). Add `FAQ = 'FAQ'` to that enum.

New component: `components/FAQ.tsx`.

- Does **not** reuse `LegalDocument` (the shared markdown-prose renderer used by Privacy/Terms). FAQ content is scan-heavy Q&A, not prose — an all-expanded wall of text is worse UX here than a collapsible accordion.
- Gets its own page shell, matching `LegalDocument`'s header conventions for visual consistency: back button, title + amber underline, "Back to Top" link.
- Content is colocated inline in `FAQ.tsx` as a typed array — same pattern `PrivacyPolicy.tsx` uses for its content string:

```ts
interface FAQItem {
  q: string;
  a: string; // may contain a mailto: link, rendered as plain text with an <a> for the email
}
interface FAQCategory {
  category: string;
  items: FAQItem[];
}
const FAQ_CONTENT: FAQCategory[] = [ ... ];
```

- Accordion state: `useState<Set<string>>` of open item keys (e.g. `` `${categoryIndex}-${itemIndex}` ``). Clicking a question toggles its membership in the set. Items are independent — no single-open-per-category auto-collapse behavior.
- No search or filter UI. Six categories and ~20 items is small enough to scroll; adding search/filter now would be unused complexity (YAGNI).

## Wiring into App.tsx

- `types.ts`: add `FAQ = 'FAQ'` to `AppState`.
- `App.tsx`:
  - Import `FAQ` component.
  - Add `handleFAQClick` (mirrors `handlePrivacyPolicyClick` / `handleTermsOfServiceClick`: sets `appState` to `AppState.FAQ`, scrolls to top).
  - Add a branch in the `appState` conditional rendering the `<FAQ onBack={handleBackToHome} />` component.
  - Add a "FAQ" button in the legal footer bar, alongside "Privacy Policy" and "Terms of Service" — same styling (`hover:text-slate-300 transition-colors`), same click-to-`setAppState` wiring.
  - **Not** added to the top nav (which currently has only Pricing + Login) — footer only, matching where Privacy/Terms live.

## Visual style

Matches the existing slate/amber design system defined in `index.html`'s inline Tailwind config:

- Page shell: `bg-slate-900`, `pt-24 pb-16`, `max-w-4xl mx-auto px-4 sm:px-6 lg:px-8` — identical to `LegalDocument`.
- Back button, `<h1>` title, and amber underline bar: identical markup/classes to `LegalDocument`'s header block.
- Each category: a `text-sm font-mono uppercase tracking-wider text-amber-500` label, followed by its items in a `border border-slate-800 rounded-xl divide-y divide-slate-800` container (echoes the card borders in `Pricing.tsx`).
- Each accordion row:
  - A full-width `<button>`: question text (`text-slate-50 font-medium`) left-aligned, a `ChevronDown` icon (from `lucide-react`, already a project dependency) right-aligned that rotates 180° via `transition-transform` when the item is open.
  - Answer (`text-slate-400 text-sm leading-relaxed`) revealed below on expand with a simple max-height/opacity transition.
- "Back to Top" link at the bottom, identical to `LegalDocument`'s.

## Content

Final copy for the previously-unresolved items (replacing every `⚠️ Confirm` in `docs/landing-faq.md`):

| Topic | Resolution |
|---|---|
| Free trial | No trial. Paid from signup — R450/breakdown or the Annual Team License. |
| Cancellation/refunds | Cancel anytime; pro-rated refund for unused time in the current billing period. |
| Support contact | `hello@slateone.studio` (same address already used in `Footer.tsx`). |
| Upload formats | PDF and Final Draft (`.fdx`). |
| Team roles | Owner manages billing/production settings; invited teammates work within their own department (props, wardrobe, etc.) rather than having full access to everything. |
| Data/security | Kept deliberately minimal and true: script + breakdown are private to the account and explicitly invited teammates; script content is never used to train AI models. No claims about encryption standards, retention periods, or certifications — those remain unverified and are the highest-risk thing to overstate. |
| Analysis turnaround | Left unquantified, as the original draft itself suggested: processing runs in the background, scene by scene, and scales with script length. No specific "X minutes" claim. |

All other Q&As carry over from `docs/landing-faq.md` essentially as-is (What is SlateOne, Who it's for, How the AI works, Can I trust the AI, What can I do after the breakdown is ready, Can I export/print, How much does it cost, How do I pay, Can I work with my team, Who can see my script), with the `⚠️ Confirm` framing stripped since those were already solid claims.

Categories (unchanged from the draft): **Getting started · How the AI works · Features & workflow · Pricing & account · Data & security · Support**.

## Out of scope

- No changes to `docs/landing-faq.md` itself (source draft stays as historical reference).
- No search/filter, no analytics/tracking on FAQ interactions, no CMS-driven content — plain static array, matching how Privacy/Terms content is hardcoded.
- No top-nav link.
