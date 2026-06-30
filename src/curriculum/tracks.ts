import type { Track } from "./types";

// AI-drafted, pending expert review (§3b). Track content beyond the flagship
// Foundation topic is intentionally scaffolded as stubs — see step 6 / docs.

export const tracks: Track[] = [
  {
    id: "audit",
    title: "Firm / Audit",
    tagline: "The credential and experience route",
    goal: "Land a training contract at a Pakistani audit firm and build real, recognised experience.",
    description:
      "You join a firm, work on real audits, and earn the experience that makes you a credible ‘auditor’. Harder to get in, but it opens the most doors.",
    branches: [
      {
        id: "external-audit",
        title: "External / Statutory audit",
        description:
          "The audit most people mean: an independent check of a company’s financial statements. This is the classic training-contract path.",
        modules: [
          {
            slug: "ea-audit-process",
            title: "The audit process",
            summary: "From accepting a client to signing the opinion — the shape of an audit.",
            topics: [
              {
                slug: "ea-audit-overview",
                title: "What an audit actually is",
                status: "stub",
                intro:
                  "An audit gives users reasonable assurance that financial statements are free from material misstatement. Knowing the why and the shape of it sets up everything else.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "The big picture",
                    points: [
                      "Audit gives reasonable — not absolute — assurance.",
                      "It’s about material misstatement, not catching every tiny error.",
                      "Independence is the whole value: the auditor must be objective.",
                    ],
                  },
                  {
                    kind: "verify",
                    heading: "Standards and specifics",
                    note: "Specific auditing-standard references and any thresholds change and are jurisdiction-specific — confirm against the official source rather than memorising a number.",
                    link: { label: "ACCA (official)", url: "https://www.accaglobal.com" },
                  },
                ],
                resourceSlotHints: ["An overview of the audit process", "A glossary of audit terms"],
              },
              {
                slug: "ea-risk-and-materiality",
                title: "Risk and materiality (concepts)",
                status: "stub",
                intro:
                  "Auditors focus effort where things are most likely to go materially wrong. Understanding risk and materiality as ideas — not formulas — is what’s tested.",
                cheatsheet: [
                  {
                    kind: "terms",
                    heading: "Core ideas",
                    terms: [
                      { term: "Inherent risk", def: "Susceptibility to misstatement before controls." },
                      { term: "Control risk", def: "Risk controls won’t catch a misstatement." },
                      { term: "Detection risk", def: "Risk the auditor’s work misses it." },
                      { term: "Materiality", def: "The size of misstatement that would change a user’s decision." },
                    ],
                  },
                  {
                    kind: "verify",
                    heading: "Materiality figures",
                    note: "Any specific materiality benchmark or percentage is a judgement and firm/standard specific — don’t treat a number as a rule.",
                    link: { label: "ACCA (official)", url: "https://www.accaglobal.com" },
                  },
                ],
                resourceSlotHints: ["A note on audit risk", "A scenario to practise spotting risks"],
                skillSpec: {
                  concepts: ["Identifying risks of material misstatement in a scenario and explaining why"],
                  taskTypes: ["risk_identification", "technical_viva"],
                  difficulty: { min: 2, max: 5 },
                  rubric: [
                    "Risks identified are real and relevant to the scenario.",
                    "Each risk is explained (why it could cause misstatement).",
                    "Covers a sensible spread, not one idea repeated.",
                  ],
                  generatorNotes:
                    "Invent a Pakistani company scenario. No specific standard numbers or materiality figures (§3.2).",
                },
              },
              {
                slug: "ea-evidence-and-procedures",
                title: "Evidence, assertions, and procedures",
                status: "stub",
                intro:
                  "Audit work is gathering evidence that the numbers say what they should. Linking assertions to procedures is a skill juniors use daily.",
                cheatsheet: [
                  {
                    kind: "terms",
                    heading: "Assertions (what we’re proving)",
                    terms: [
                      { term: "Existence", def: "The asset/transaction is real." },
                      { term: "Completeness", def: "Nothing is missing." },
                      { term: "Valuation", def: "Recorded at the right amount." },
                      { term: "Rights & obligations", def: "The entity actually owns/owes it." },
                    ],
                  },
                ],
                resourceSlotHints: ["A list of common audit procedures", "Assertion-to-procedure examples"],
                skillSpec: {
                  concepts: ["Designing audit procedures for a given assertion"],
                  taskTypes: ["audit_procedures", "technical_viva"],
                  difficulty: { min: 3, max: 5 },
                  rubric: [
                    "Procedures genuinely test the named assertion.",
                    "Procedures are specific and doable, not vague.",
                    "Reasoning is sound.",
                  ],
                  generatorNotes: "Invent a balance/transaction and an assertion. No standard numbers (§3.2).",
                },
              },
              {
                slug: "ea-working-papers",
                title: "Documentation and working papers",
                status: "stub",
                intro:
                  "If it isn’t documented, it didn’t happen. Clear working papers are most of a junior’s actual output.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "A good working paper",
                    points: [
                      "States the objective and the work done.",
                      "Shows the evidence and the source.",
                      "Reaches a clear conclusion.",
                      "Is reviewable by someone else without you explaining it.",
                    ],
                  },
                ],
                resourceSlotHints: ["A working-paper template", "An example you can model"],
                skillSpec: {
                  concepts: ["Writing a clear, correct working-paper note"],
                  taskTypes: ["working_paper_note", "explain_to_client"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Correct content", "Clear structure", "A defensible conclusion"],
                  generatorNotes: "Invent a small testing scenario. No standard numbers (§3.2).",
                },
              },
            ],
          },
          {
            slug: "ea-firm-interview-prep",
            title: "Firm interview & training-contract prep",
            summary: "Getting through a Pakistani firm’s interview and into a training contract.",
            topics: [
              {
                slug: "ea-technical-interview",
                title: "Technical interview questions",
                status: "stub",
                intro:
                  "Firms test whether you can think on your feet about accounts and audit. Practising spoken-style answers is the best preparation.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Frequent themes",
                    points: [
                      "Walk through how the three statements connect.",
                      "Statutory vs internal audit.",
                      "Going concern, materiality, types of audit opinion (in plain terms).",
                      "Provision vs reserve; accrual vs cash basis.",
                    ],
                  },
                ],
                resourceSlotHints: ["A list of common technical questions", "Your own answer notes"],
                skillSpec: {
                  concepts: ["Answering technical viva questions with correct, structured reasoning"],
                  taskTypes: ["technical_viva"],
                  difficulty: { min: 2, max: 5 },
                  rubric: [
                    "Technically correct.",
                    "Structured and complete enough.",
                    "Would read well to an interviewer.",
                  ],
                  generatorNotes:
                    "Pick a common technical question. Avoid questions hinging on specific standard numbers/rates, or mark them verify (§3.2).",
                },
              },
              {
                slug: "ea-hr-interview",
                title: "HR and behavioural questions",
                status: "stub",
                intro:
                  "Why audit? Strengths and weaknesses? Firms care how you handle pressure and deadlines. Structure beats waffle.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Use STAR",
                    points: [
                      "Situation — set the scene briefly.",
                      "Task — what you needed to do.",
                      "Action — what you actually did.",
                      "Result — the outcome, ideally measurable.",
                    ],
                  },
                ],
                resourceSlotHints: ["A list of common HR questions", "Your STAR stories"],
                skillSpec: {
                  concepts: ["Answering HR/behavioural questions with structure and specifics"],
                  taskTypes: ["hr_behavioural"],
                  difficulty: { min: 1, max: 4 },
                  rubric: ["Clear structure (e.g. STAR)", "Specific, not generic", "Confident tone"],
                  generatorNotes: "Pick a common HR question relevant to an audit fresher.",
                },
              },
            ],
          },
        ],
      },
      {
        id: "internal-audit",
        title: "Internal audit",
        description:
          "Looking inward: testing a company’s own controls and reporting to its management, rather than giving an external opinion.",
        modules: [
          {
            slug: "ia-governance-risk-controls",
            title: "Governance, risk, and controls",
            summary: "What internal audit does and how it differs from external audit.",
            topics: [
              {
                slug: "ia-vs-external",
                title: "How internal audit differs from external",
                status: "stub",
                intro:
                  "Same toolkit, different purpose: internal audit serves management and is ongoing; external audit serves shareholders and gives a yearly opinion.",
                cheatsheet: [
                  {
                    kind: "terms",
                    heading: "Key differences",
                    terms: [
                      { term: "Reports to", def: "Internal: management/board. External: shareholders." },
                      { term: "Focus", def: "Internal: controls & efficiency. External: true & fair view." },
                      { term: "Timing", def: "Internal: continuous. External: periodic." },
                    ],
                  },
                ],
                resourceSlotHints: ["An internal-audit primer", "A comparison you found clear"],
              },
              {
                slug: "ia-control-testing",
                title: "Testing controls and reporting deficiencies",
                status: "stub",
                intro:
                  "Internal auditors find weak controls and recommend fixes. The deficiency → implication → recommendation table is the bread and butter.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "The three columns",
                    points: [
                      "Deficiency: what’s weak or missing.",
                      "Implication: what could go wrong because of it.",
                      "Recommendation: a practical fix.",
                    ],
                  },
                ],
                resourceSlotHints: ["A controls checklist", "An example deficiencies report"],
                skillSpec: {
                  concepts: ["Analysing a control deficiency: implication and recommendation"],
                  taskTypes: ["control_deficiency", "case_analysis"],
                  difficulty: { min: 3, max: 5 },
                  rubric: [
                    "Deficiency correctly identified.",
                    "Implication is realistic.",
                    "Recommendation is practical and addresses the deficiency.",
                  ],
                  generatorNotes: "Invent a process scenario with a real control weakness (PKR where relevant).",
                },
              },
            ],
          },
        ],
      },
      {
        id: "it-audit",
        title: "IT / Information-systems audit",
        advanced: true,
        description:
          "An advanced specialism: auditing controls in computerised systems — access, data integrity, change management.",
        modules: [
          {
            slug: "ita-foundations",
            title: "IT audit foundations",
            summary: "Controls in a computerised environment.",
            topics: [
              {
                slug: "ita-general-controls",
                title: "General IT controls",
                status: "stub",
                intro:
                  "Before testing the numbers, you test the systems that produce them: who can access what, and whether data stays intact.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Areas to know",
                    points: [
                      "Access controls — least privilege, segregation of duties.",
                      "Change management — controlled, tested changes.",
                      "Data integrity and backups.",
                    ],
                  },
                ],
                resourceSlotHints: ["An IT general controls overview"],
              },
            ],
          },
        ],
      },
      {
        id: "forensic-audit",
        title: "Forensic / investigative audit",
        advanced: true,
        description:
          "An advanced specialism: investigating suspected fraud — indicators, approach, and handling evidence carefully.",
        modules: [
          {
            slug: "fa-foundations",
            title: "Forensic foundations",
            summary: "Fraud indicators and the investigative mindset (high level).",
            topics: [
              {
                slug: "fa-fraud-indicators",
                title: "Fraud indicators (red flags)",
                status: "stub",
                intro:
                  "Forensic work starts with noticing what doesn’t add up. Knowing common red flags and handling evidence properly is the core idea.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Common red flags",
                    points: [
                      "Lifestyle out of step with salary.",
                      "Reluctance to take leave or share duties.",
                      "Round-sum or just-under-approval-limit transactions.",
                      "Missing or altered documentation.",
                    ],
                  },
                ],
                resourceSlotHints: ["A primer on fraud red flags"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "freelance",
    title: "Freelance / Accounting",
    tagline: "The income and flexibility route",
    goal: "Earn by doing bookkeeping and accounts for clients — locally and on platforms like Upwork.",
    description:
      "You build practical bookkeeping skills and a portfolio, then find clients. Faster to income, more flexible, but you build credibility yourself.",
    branches: [
      {
        id: "bookkeeping-services",
        title: "Bookkeeping & accounts for clients",
        description:
          "Master the tools and the month-end routine clients pay for, then package it into a profile and proposals that win work.",
        modules: [
          {
            slug: "fl-cloud-tools",
            title: "Cloud bookkeeping tools",
            summary: "QuickBooks Online and Xero — the two platforms most clients use.",
            topics: [
              {
                slug: "fl-quickbooks",
                title: "QuickBooks Online basics",
                status: "stub",
                intro:
                  "Most small-business clients are on QuickBooks Online. Knowing the day-to-day flow — invoices, bills, bank feeds, reconciliation — is what they hire for.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "The daily flow",
                    points: [
                      "Connect the bank feed; categorise transactions.",
                      "Raise invoices and record bills.",
                      "Reconcile accounts regularly.",
                      "Run the basic reports the client wants.",
                    ],
                  },
                ],
                resourceSlotHints: ["An official QuickBooks tutorial", "A practice company file"],
              },
              {
                slug: "fl-xero",
                title: "Xero basics",
                status: "stub",
                intro:
                  "Xero is the other major platform. The concepts carry over from QuickBooks; the buttons move.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "What transfers",
                    points: [
                      "Same core flow: bank feeds, invoices, bills, reconciliation.",
                      "Learn where reconciliation and reporting live.",
                      "Being comfortable in both is a selling point.",
                    ],
                  },
                ],
                resourceSlotHints: ["An official Xero tutorial", "A practice file"],
              },
            ],
          },
          {
            slug: "fl-month-end",
            title: "Month-end and management accounts",
            summary: "Closing the books and producing useful monthly numbers for an owner.",
            topics: [
              {
                slug: "fl-month-end-close",
                title: "The month-end close",
                status: "stub",
                intro:
                  "A reliable monthly close is what separates a bookkeeper a client trusts from one they don’t. It’s a checklist done consistently.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "A close checklist",
                    points: [
                      "Reconcile every bank and card account.",
                      "Post accruals, prepayments, depreciation.",
                      "Review the trial balance for oddities.",
                      "Produce the management report.",
                    ],
                  },
                ],
                resourceSlotHints: ["A month-end checklist", "A management-accounts example"],
              },
            ],
          },
          {
            slug: "fl-fbr",
            title: "FBR IRIS basics (Pakistan)",
            summary: "Where Pakistani tax filing happens — without inventing any rates.",
            topics: [
              {
                slug: "fl-fbr-iris",
                title: "FBR IRIS: the basics",
                status: "stub",
                intro:
                  "Clients will ask about filing. Know your way around the official FBR IRIS portal and always check current rates and deadlines at the source.",
                cheatsheet: [
                  {
                    kind: "verify",
                    heading: "Rates, deadlines, and rules",
                    note: "Every Pakistan tax rate, FBR rule, and filing deadline changes and is official — never memorise or quote a number here. Always confirm on the FBR site for the client’s situation.",
                    link: { label: "FBR (official)", url: "https://www.fbr.gov.pk" },
                  },
                  {
                    kind: "points",
                    heading: "Safe, stable basics",
                    points: [
                      "IRIS is the online portal for registration and returns.",
                      "Keep client records organised and reconciled before filing.",
                      "Know what you can do vs when to refer to a tax specialist.",
                    ],
                  },
                ],
                resourceSlotHints: ["The official FBR IRIS guide", "A reputable walkthrough"],
              },
            ],
          },
          {
            slug: "fl-getting-clients",
            title: "Portfolio, profile & client communication",
            summary: "Turning skills into paid work on Upwork/LinkedIn and keeping clients happy.",
            topics: [
              {
                slug: "fl-upwork-profile",
                title: "Setting up an Upwork / LinkedIn profile",
                status: "stub",
                intro:
                  "Clients hire a clear, credible profile. A focused niche and proof of skill beat a long list of everything.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "A profile that wins work",
                    points: [
                      "Pick a clear niche (e.g. ‘QuickBooks bookkeeping for small UK/US firms’).",
                      "Show proof: sample work, a portfolio piece, a certification.",
                      "Write the headline around the client’s problem, not your titles.",
                    ],
                  },
                ],
                resourceSlotHints: ["A profile example you admire", "A proposal template"],
              },
              {
                slug: "fl-client-communication",
                title: "Explaining numbers to clients",
                status: "stub",
                intro:
                  "Freelancing rewards clear communication. Clients aren’t accountants — explaining plainly builds trust and repeat work.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Communicate well",
                    points: [
                      "Lead with the answer, then the detail.",
                      "Avoid jargon; use the client’s words.",
                      "Set expectations on timing and scope early.",
                    ],
                  },
                ],
                resourceSlotHints: ["A guide to client communication"],
                skillSpec: {
                  concepts: ["Explaining an accounting concept simply and correctly to a non-accountant"],
                  taskTypes: ["explain_to_client"],
                  difficulty: { min: 1, max: 4 },
                  rubric: ["Accurate", "Genuinely simple and clear", "No unexplained jargon"],
                  generatorNotes: "Pick a concept a small-business owner would ask about.",
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
