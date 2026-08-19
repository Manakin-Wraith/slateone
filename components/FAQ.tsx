import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';

interface FAQProps {
  onBack: () => void;
}

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const categories: FAQCategory[] = [
  {
    title: 'Getting started',
    items: [
      {
        question: 'What is SlateOne?',
        answer: (
          <>
            <p className="mb-4">
              SlateOne is an AI-powered screenplay breakdown and production management tool.
              Upload your script as a PDF or Final Draft (.fdx) file and SlateOne reads it scene
              by scene, automatically pulling out everything a production needs to track — cast,
              props, wardrobe, locations, and more — then helps you turn that into a shooting
              schedule, share it with your team, and generate production reports. For TV
              projects, you can organize scripts by series and season, so multi-episode
              productions stay structured as they grow.
            </p>
            <p>
              Think of it as a first assistant director's prep pass, done in the background in
              minutes instead of days.
            </p>
          </>
        ),
      },
      {
        question: 'Who is SlateOne for?',
        answer: (
          <p>
            Filmmakers, line producers, assistant directors, production coordinators, and anyone
            responsible for prepping a shoot — from indie shorts to features. If you'd normally
            break down a script by hand with a highlighter and a stack of sides, SlateOne is
            built for you.
          </p>
        ),
      },
      {
        question: 'How do I get started?',
        answer: (
          <p>
            Create an account, upload your script as a PDF or Final Draft file, and SlateOne
            begins analyzing it right away. You'll get a scene-by-scene breakdown you can review,
            edit, schedule, and share.
          </p>
        ),
      },
      {
        question: 'What do I need to upload?',
        answer: (
          <p>
            Your screenplay as a <strong className="text-slate-50 font-semibold">PDF</strong> or a{' '}
            <strong className="text-slate-50 font-semibold">Final Draft (.fdx) file</strong> (max
            10MB). SlateOne reads the text directly from the document — scene headings, action,
            and dialogue — to build your breakdown. Fountain and other formats aren't supported
            yet.
          </p>
        ),
      },
    ],
  },
  {
    title: 'How the AI works',
    items: [
      {
        question: 'What does the AI actually do?',
        answer: (
          <>
            <p className="mb-4">For every scene, the AI identifies the production elements you'd normally break down by hand:</p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Cast — speaking and non-speaking characters, plus background extras</li>
              <li>Props</li>
              <li>Wardrobe, makeup, and hair</li>
              <li>Special effects, stunts, vehicles, and animals</li>
              <li>Sound and location details</li>
            </ul>
            <p>
              Beyond individual scenes, it also builds the bigger picture: a summary of your
              story arc, character profiles (where each character appears and how they develop),
              and a consolidated view of your locations. It even flags flashbacks, dreams, and
              story-day changes so your schedule reflects the real shooting timeline, not just
              page order.
            </p>
          </>
        ),
      },
      {
        question: 'Can I trust what the AI produces? Does it make things up?',
        answer: (
          <>
            <p className="mb-4">SlateOne is specifically built to avoid guessing:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                It works from your actual script. Scene numbers and structure come straight from
                your document — the AI enriches what's already there. It doesn't invent scenes or
                renumber them.
              </li>
              <li>It only reports what's on the page. If an element isn't written into a scene, it won't appear in your breakdown.</li>
              <li>
                You stay in control. The AI gives you a fast, complete first pass — everything is
                fully editable, so you're reviewing and refining rather than starting from a blank
                page.
              </li>
            </ul>
          </>
        ),
      },
      {
        question: 'How long does the analysis take?',
        answer: (
          <>
            <p className="mb-4">
              The breakdown runs in the background after you upload, processing scene by scene.
              You can keep working while it runs, and results fill in as each scene is analyzed.
            </p>
            <p>
              As a reference point, a 100-page, 120-scene script typically takes 10–15 minutes to
              fully analyze. Processing is paced to respect AI provider rate limits, so timing
              scales with script length.
            </p>
          </>
        ),
      },
      {
        question: 'Is the AI a replacement for a person?',
        answer: (
          <p>
            No — it's a head start. SlateOne handles the tedious first pass so your team can
            spend its time on judgment calls, creative decisions, and the details that need a
            human eye. You review and adjust everything.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Features & workflow',
    items: [
      {
        question: 'What can I do after the breakdown is ready?',
        answer: (
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Review and edit every scene's breakdown elements</li>
            <li>Build a shooting schedule on a stripboard</li>
            <li>Organize TV scripts by series and season</li>
            <li>Collaborate with your team</li>
            <li>Generate production reports as PDFs to share or print</li>
          </ul>
        ),
      },
      {
        question: 'Can I work with my team?',
        answer: (
          <>
            <p className="mb-4">
              Yes. You can invite team members to collaborate on a production, so your AD,
              coordinator, and department heads are working from the same breakdown and schedule.
            </p>
            <p className="mb-4">Every teammate is assigned one of four roles, each with more access than the last:</p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Viewer — read-only access to the breakdown and schedule</li>
              <li>Member — can edit breakdown elements and the schedule</li>
              <li>Admin — can also invite/remove teammates and change their roles</li>
              <li>Owner — the production's creator; full control, including admin management</li>
            </ul>
            <p>
              Admins and owners can invite people and set their role at invite time (defaulting
              to Member); no one can grant a role higher than their own.
            </p>
          </>
        ),
      },
      {
        question: 'Can I export or print my breakdown and reports?',
        answer: <p>Yes — SlateOne generates production reports as PDFs you can download, print, or share.</p>,
      },
    ],
  },
  {
    title: 'Pricing & account',
    items: [
      {
        question: 'How much does SlateOne cost?',
        answer: (
          <>
            <p className="mb-4">
              Uploading and editing scripts is always free — you only pay when you run a
              breakdown. Two ways to pay for that, priced in ZAR:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Project — R2,250 per breakdown. For individual filmmakers working solo; no crew collaboration.</li>
              <li>Studio — unlimited breakdowns for your whole crew, on a fixed-term commitment:</li>
            </ul>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-2 pr-4 text-slate-50 font-semibold">Plan</th>
                    <th className="py-2 pr-4 text-slate-50 font-semibold">Price</th>
                    <th className="py-2 pr-4 text-slate-50 font-semibold">Seats included</th>
                    <th className="py-2 text-slate-50 font-semibold">Extra seat</th>
                  </tr>
                </thead>
                <tbody className="text-slate-200">
                  <tr className="border-b border-slate-800">
                    <td className="py-2 pr-4">Studio 3</td>
                    <td className="py-2 pr-4">R5,500 / 3 months</td>
                    <td className="py-2 pr-4">1</td>
                    <td className="py-2">R750 flat</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-2 pr-4">Studio 6</td>
                    <td className="py-2 pr-4">R9,500 / 6 months</td>
                    <td className="py-2 pr-4">2</td>
                    <td className="py-2">R1,500 flat</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Studio 12</td>
                    <td className="py-2 pr-4">R18,500 / year</td>
                    <td className="py-2 pr-4">3</td>
                    <td className="py-2">R3,000 flat</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Studio includes crew invites, department workspaces, cross-department
              threads, item tracking, and team access control on top of everything in
              Project.
            </p>
          </>
        ),
      },
      {
        question: 'How do I pay?',
        answer: (
          <>
            <p className="mb-4">
              The landing page doesn't take payment directly. You enter your email, choose a plan
              and (for Studio) a commitment length, and we redirect you to
              app.slateone.studio to create your account and complete signup.
            </p>
            <p>
              Billing itself runs through PayFast, South Africa's payment gateway, in ZAR. PayFast
              supports Visa/Mastercard credit and debit cards, Instant EFT, and local wallets/QR
              methods like SnapScan and Zapper.
            </p>
          </>
        ),
      },
      {
        question: 'Is there a free trial?',
        answer: (
          <p>
            No — SlateOne is paid-only. Uploading and editing scripts is free with no account
            limits; you only pay when you actually run a breakdown (Project) or take out
            a Studio plan.
          </p>
        ),
      },
      {
        question: 'Can I cancel anytime?',
        answer: (
          <>
            <p className="mb-4">
              Project has nothing to cancel — it's a one-off charge per breakdown, not a
              subscription.
            </p>
            <p>
              Every Studio plan (3, 6, or 12 months) is a prepaid term: you pay upfront and
              have full access for that whole period. You can cancel at any time to stop the
              next renewal, but — standard practice for prepaid terms — the current term
              itself is non-refundable and runs to its end date; there's no partial refund
              for unused time.
            </p>
          </>
        ),
      },
    ],
  },
  {
    title: 'Data & security',
    items: [
      {
        question: 'Who can see my script?',
        answer: (
          <p>
            Your script and its breakdown are private to your account and the team members you
            explicitly invite — access is scoped per-production by role (Viewer/Member/Admin/Owner),
            so nobody outside a production's invited crew can see it. We don't share your script
            content with any third party beyond the infrastructure providers required to run the
            service (our database provider and our AI analysis provider — see below).
          </p>
        ),
      },
      {
        question: 'How is my data stored and protected?',
        answer: (
          <p>
            Your data lives in a managed Supabase (Postgres) database. Access from the app is
            authenticated per-user, and cross-production access is blocked by the role-based model
            described above. Supabase does not sell customer data, and shares it only with the
            sub-processors needed to operate its platform, under contractual confidentiality terms
            (see{' '}
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-500 underline transition-colors"
            >
              Supabase's Privacy Policy
            </a>{' '}
            and{' '}
            <a
              href="https://supabase.com/legal/customer-resources/data-processing-addendum"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-500 underline transition-colors"
            >
              Data Processing Addendum
            </a>
            ).
          </p>
        ),
      },
      {
        question: 'Is my script used to train AI models?',
        answer: (
          <p>
            No. SlateOne runs script analysis through the paid tier of the Google Gemini API, not
            the free tier and not the consumer Gemini app. Under Google's terms for paid Gemini
            API usage, prompts and responses are not used to train or improve their models — Google
            only retains them briefly for abuse/safety monitoring and legal compliance, not model
            training. (Source:{' '}
            <a
              href="https://ai.google.dev/gemini-api/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-500 underline transition-colors"
            >
              Gemini API Additional Terms of Service
            </a>
            .)
          </p>
        ),
      },
    ],
  },
];

const AccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({
  item,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="border-b border-slate-800">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-lg font-medium text-slate-50 group-hover:text-amber-500 transition-colors">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 flex-shrink-0 text-slate-400 group-hover:text-amber-500 transition-all ${
            isOpen ? 'rotate-180 text-amber-500' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="pb-6 text-slate-300 leading-relaxed">{item.answer}</div>
      )}
    </div>
  );
};

export const FAQ: React.FC<FAQProps> = ({ onBack }) => {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-slate-300 hover:text-amber-500 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-50 mb-4">
            Frequently Asked Questions
          </h1>
          <div className="h-1 w-20 bg-amber-500"></div>
        </div>

        {categories.map((category) => (
          <div key={category.title} className="mb-12">
            <h2 className="text-2xl font-bold text-slate-50 mb-2">{category.title}</h2>
            <div>
              {category.items.map((item) => {
                const key = `${category.title}::${item.question}`;
                return (
                  <AccordionItem
                    key={key}
                    item={item}
                    isOpen={openKey === key}
                    onToggle={() => toggle(key)}
                  />
                );
              })}
            </div>
          </div>
        ))}

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-50 mb-4">Support</h2>
          <p className="text-slate-300 leading-relaxed">
            Have a question that isn't answered here? Email us at{' '}
            <a
              href="mailto:hello@slateone.studio"
              className="text-amber-500 hover:text-amber-500 underline transition-colors"
            >
              hello@slateone.studio
            </a>{' '}
            and we'll get back to you.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-slate-400 hover:text-amber-500 transition-colors text-sm"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </div>
  );
};
