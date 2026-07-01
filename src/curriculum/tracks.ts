import type { Track } from "./types";

// Initial draft, pending expert review (§3b). Track content beyond the flagship
// Foundation topic is intentionally scaffolded as stubs, see step 6 / docs.

export const tracks: Track[] = [
  {
    id: "audit",
    title: "Firm / Audit",
    tagline: "The credential and experience route",
    goal: "Land a training contract at a Pakistani audit firm and build real, recognised experience.",
    description:
      "You join a firm, work on real audits, and earn the experience that makes you a credible 'auditor'. Harder to get in, but it opens the most doors.",
    tools: [
      { name: "Microsoft Excel", note: "Non-negotiable. Lookups, pivots, clean data." },
      { name: "Audit file software", note: "Firm-specific (e.g. CaseWare). You learn it on the job." },
      { name: "Data analytics basics", note: "The ideas behind tools like IDEA/ACL: sampling, filtering, testing whole populations." },
      { name: "Word / PowerPoint", note: "Working papers, memos, client presentations." },
    ],
    branches: [
      {
        id: "external-audit",
        title: "External / Statutory audit",
        description:
          "The audit most people mean: an independent check of a company's financial statements. This is the classic training-contract path.",
        modules: [
          {
            slug: "ea-audit-process",
            title: "The audit process",
            summary: "From accepting a client to signing the opinion, the shape of an audit.",
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
                      "Audit gives reasonable, not absolute, assurance.",
                      "It's about material misstatement, not catching every tiny error.",
                      "Independence is the whole value: the auditor must be objective.",
                    ],
                  },
                  {
                    kind: "verify",
                    heading: "Standards and specifics",
                    note: "Specific auditing-standard references and any thresholds change and are jurisdiction-specific, confirm against the official source rather than memorising a number.",
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
                  "Auditors focus effort where things are most likely to go materially wrong. Understanding risk and materiality as ideas, not formulas, is what's tested.",
                cheatsheet: [
                  {
                    kind: "terms",
                    heading: "Core ideas",
                    terms: [
                      { term: "Inherent risk", def: "Susceptibility to misstatement before controls." },
                      { term: "Control risk", def: "Risk controls won't catch a misstatement." },
                      { term: "Detection risk", def: "Risk the auditor's work misses it." },
                      { term: "Materiality", def: "The size of misstatement that would change a user's decision." },
                    ],
                  },
                  {
                    kind: "verify",
                    heading: "Materiality figures",
                    note: "Any specific materiality benchmark or percentage is a judgement and firm/standard specific, don't treat a number as a rule.",
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
                    heading: "Assertions (what we're proving)",
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
                  concepts: [
                    "Designing audit procedures for a given assertion",
                    "Justifying an evidence and sampling approach",
                  ],
                  taskTypes: ["audit_procedures", "evidence_sampling", "technical_viva"],
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
                  "If it isn't documented, it didn't happen. Clear working papers are most of a junior's actual output.",
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
            slug: "ea-planning-risk",
            title: "Planning and risk assessment",
            summary: "How auditors decide where the danger is and plan effort around it.",
            topics: [
              {
                slug: "ea-understanding-entity",
                title: "Understanding the entity",
                status: "stub",
                intro:
                  "You can't audit what you don't understand. Learning the business, its industry, and how it makes money is the first real planning step.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "What to understand",
                    points: [
                      "The industry, regulation, and how the business earns and spends.",
                      "Its accounting policies and any judgemental areas.",
                      "Who runs it and how they're incentivised (fraud risk).",
                    ],
                  },
                ],
                resourceSlotHints: ["An overview of business understanding in audit"],
                skillSpec: {
                  concepts: ["Explaining why and how auditors understand a business before auditing it"],
                  taskTypes: ["technical_viva", "explain_to_client"],
                  difficulty: { min: 2, max: 4 },
                  rubric: ["Covers business, industry, and risk", "Clear reasoning"],
                  generatorNotes: "Invent a Pakistani business. No standard numbers (§3.2).",
                },
              },
              {
                slug: "ea-materiality-concepts",
                title: "Materiality (as a concept)",
                status: "stub",
                intro:
                  "Auditors don't chase every rupee. Materiality is the size of error that would change a user's decision, and it shapes the whole audit.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "The idea",
                    points: [
                      "Material = big enough to influence a user's decision.",
                      "Set for the accounts as a whole, and lower for testing (performance materiality).",
                      "It's a judgement, revisited as the audit progresses.",
                    ],
                  },
                  {
                    kind: "verify",
                    heading: "Benchmarks and figures",
                    note: "Any specific materiality percentage or benchmark is a firm/standard judgement, not a rule. Don't memorise a number.",
                    link: { label: "ACCA (official)", url: "https://www.accaglobal.com" },
                  },
                ],
                resourceSlotHints: ["A plain explainer on materiality"],
                skillSpec: {
                  concepts: ["Explaining materiality and performance materiality conceptually"],
                  taskTypes: ["technical_viva"],
                  difficulty: { min: 2, max: 5 },
                  rubric: ["Correct concept", "Distinguishes overall vs performance materiality", "No invented figures"],
                  generatorNotes: "Conceptual only. No specific percentages (§3.2).",
                },
              },
              {
                slug: "ea-risk-of-misstatement",
                title: "Risks of material misstatement",
                status: "stub",
                intro:
                  "The heart of planning: spot where the accounts are most likely to be wrong, and why, so testing goes there.",
                cheatsheet: [
                  {
                    kind: "terms",
                    heading: "The risk model",
                    terms: [
                      { term: "Inherent risk", def: "Susceptibility to misstatement before controls." },
                      { term: "Control risk", def: "Risk controls won't prevent or catch it." },
                      { term: "Detection risk", def: "Risk the auditor's own work misses it." },
                    ],
                  },
                ],
                resourceSlotHints: ["A worked risk-assessment example"],
                skillSpec: {
                  concepts: ["Identifying risks of material misstatement in a scenario and why they arise"],
                  taskTypes: ["risk_identification", "technical_viva"],
                  difficulty: { min: 2, max: 5 },
                  rubric: ["Real, relevant risks", "Each explained", "Sensible spread"],
                  generatorNotes: "Invent a Pakistani company scenario. No standard numbers (§3.2).",
                },
              },
              {
                slug: "ea-analytical-procedures",
                title: "Analytical procedures",
                status: "stub",
                intro:
                  "Comparing numbers to what you'd expect, ratios, trends, relationships, flags where something looks off. Used at planning and throughout.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "How they work",
                    points: [
                      "Form an expectation, compare to the actual, investigate differences.",
                      "Compare to prior year, budget, industry, and related figures.",
                      "Cheap and powerful for spotting risk areas.",
                    ],
                  },
                ],
                resourceSlotHints: ["A guide to analytical procedures"],
                skillSpec: {
                  concepts: ["Designing and interpreting analytical procedures"],
                  taskTypes: ["audit_procedures", "evidence_sampling"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Sensible expectation formed", "Right comparisons", "Follows up differences"],
                  generatorNotes: "Invent figures (PKR, self-consistent). No standard numbers (§3.2).",
                },
              },
            ],
          },
          {
            slug: "ea-internal-control",
            title: "Internal control",
            summary: "Understanding and testing the controls the numbers depend on.",
            topics: [
              {
                slug: "ea-control-environment",
                title: "The control environment",
                status: "stub",
                intro:
                  "Controls only work if the tone at the top supports them. The control environment is the culture the rest of the controls sit inside.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Signs of a strong environment",
                    points: [
                      "Clear responsibilities and segregation of duties.",
                      "Management that takes controls seriously.",
                      "Competent, supervised staff.",
                    ],
                  },
                ],
                resourceSlotHints: ["An overview of the control environment"],
              },
              {
                slug: "ea-tests-of-controls",
                title: "Tests of controls",
                status: "stub",
                intro:
                  "If you plan to rely on a control, you have to prove it actually worked all year, not just that it exists on paper.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Common tests",
                    points: [
                      "Inspect evidence the control ran (signatures, reviews, reconciliations).",
                      "Reperform the control on a sample.",
                      "Observe it happening; enquire and corroborate.",
                    ],
                  },
                ],
                resourceSlotHints: ["Examples of control tests"],
                skillSpec: {
                  concepts: ["Designing tests of controls for a stated control"],
                  taskTypes: ["audit_procedures", "technical_viva"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Test actually proves the control operated", "Specific and doable"],
                  generatorNotes: "Invent a control and process. No standard numbers (§3.2).",
                },
              },
              {
                slug: "ea-control-deficiencies",
                title: "Control deficiencies",
                status: "stub",
                intro:
                  "When a control is missing or weak, you report it the same way every time: what's wrong, what could go wrong, and what to do about it.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Deficiency, implication, recommendation",
                    points: [
                      "Deficiency: the weakness or missing control.",
                      "Implication: what could go wrong because of it.",
                      "Recommendation: a practical, proportionate fix.",
                    ],
                  },
                ],
                resourceSlotHints: ["An example deficiencies letter"],
                skillSpec: {
                  concepts: ["Analysing a control deficiency: implication and recommendation"],
                  taskTypes: ["control_deficiency", "case_analysis"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Deficiency identified", "Realistic implication", "Practical recommendation"],
                  generatorNotes: "Invent a process with a real weakness (PKR where relevant).",
                },
              },
            ],
          },
          {
            slug: "ea-specific-areas",
            title: "Auditing specific areas",
            summary: "How you actually test the big balances in a set of accounts.",
            topics: [
              {
                slug: "ea-audit-receivables",
                title: "Auditing receivables",
                status: "stub",
                intro:
                  "Are the amounts customers owe real, complete, and collectable? Receivables testing is a rite of passage for juniors.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Key procedures",
                    points: [
                      "Confirmations to customers (existence, rights).",
                      "After-date cash: did they pay after year-end?",
                      "Review the aged listing for old, doubtful balances (valuation).",
                    ],
                  },
                ],
                resourceSlotHints: ["A receivables audit programme"],
                skillSpec: {
                  concepts: ["Designing procedures for receivables assertions"],
                  taskTypes: ["audit_procedures", "working_paper_note"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Procedures match the assertion", "Specific and practical"],
                  generatorNotes: "Invent balances (PKR). No standard numbers (§3.2).",
                },
              },
              {
                slug: "ea-audit-payables",
                title: "Auditing payables",
                status: "stub",
                intro:
                  "With payables the worry is understatement, missing liabilities. Completeness is the assertion that keeps auditors up at night.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Key procedures",
                    points: [
                      "Search for unrecorded liabilities (post year-end invoices/payments).",
                      "Supplier statement reconciliations.",
                      "Cut-off around the year-end.",
                    ],
                  },
                ],
                resourceSlotHints: ["A payables audit programme"],
                skillSpec: {
                  concepts: ["Designing procedures for payables, focusing on completeness"],
                  taskTypes: ["audit_procedures"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Targets completeness", "Specific procedures"],
                  generatorNotes: "Invent balances (PKR). No standard numbers (§3.2).",
                },
              },
              {
                slug: "ea-audit-inventory",
                title: "Auditing inventory",
                status: "stub",
                intro:
                  "Inventory is physical, valued with judgement, and easy to get wrong, which is why auditors attend the count.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Key procedures",
                    points: [
                      "Attend the count: observe, test-count both ways.",
                      "Valuation: lower of cost and net realisable value.",
                      "Cut-off: last goods in/out before year-end.",
                    ],
                  },
                ],
                resourceSlotHints: ["An inventory count guide"],
                skillSpec: {
                  concepts: ["Designing inventory procedures, count and valuation"],
                  taskTypes: ["audit_procedures", "technical_viva"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Covers existence and valuation", "Count attendance understood"],
                  generatorNotes: "Invent a scenario. No standard numbers (§3.2).",
                },
              },
              {
                slug: "ea-audit-cash",
                title: "Auditing cash and bank",
                status: "stub",
                intro:
                  "Cash is small in value but high in risk, easy to steal, easy to manipulate at year-end. Confirmations and reconciliations do the heavy lifting.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Key procedures",
                    points: [
                      "Bank confirmations direct from the bank.",
                      "Review the year-end bank reconciliation.",
                      "Watch for window-dressing around the cut-off.",
                    ],
                  },
                ],
                resourceSlotHints: ["A cash and bank audit programme"],
                skillSpec: {
                  concepts: ["Designing procedures for cash and bank"],
                  taskTypes: ["audit_procedures"],
                  difficulty: { min: 2, max: 4 },
                  rubric: ["Confirmation + reconciliation covered", "Cut-off considered"],
                  generatorNotes: "Invent balances (PKR). No standard numbers (§3.2).",
                },
              },
              {
                slug: "ea-audit-nca",
                title: "Auditing non-current assets",
                status: "stub",
                intro:
                  "Big, long-lived assets: do they exist, are they owned, and are they carried at a sensible amount after depreciation?",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Key procedures",
                    points: [
                      "Physically verify a sample; inspect ownership documents.",
                      "Recompute depreciation; assess useful lives.",
                      "Check additions and disposals are real and complete.",
                    ],
                  },
                ],
                resourceSlotHints: ["A non-current assets audit programme"],
                skillSpec: {
                  concepts: ["Designing procedures for non-current assets"],
                  taskTypes: ["audit_procedures", "working_paper_note"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Existence, rights, valuation covered", "Depreciation checked"],
                  generatorNotes: "Invent figures (PKR). No standard numbers (§3.2).",
                },
              },
              {
                slug: "ea-audit-revenue",
                title: "Auditing revenue",
                status: "stub",
                intro:
                  "Revenue is where the pressure to look good bites hardest, so it usually carries a presumed fraud risk. Cut-off and occurrence matter most.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Key procedures",
                    points: [
                      "Cut-off: sales recorded in the right period.",
                      "Occurrence: the sales are real (trace to dispatch/cash).",
                      "Analytical review of margins and trends.",
                    ],
                  },
                ],
                resourceSlotHints: ["A revenue audit approach"],
                skillSpec: {
                  concepts: ["Identifying revenue risks and designing procedures"],
                  taskTypes: ["risk_identification", "audit_procedures"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Cut-off and occurrence addressed", "Fraud risk understood"],
                  generatorNotes: "Invent a business (PKR). No standard numbers (§3.2).",
                },
              },
            ],
          },
          {
            slug: "ea-completion-reporting",
            title: "Completion and reporting",
            summary: "Wrapping up the audit and forming the opinion, the part everyone reads.",
            topics: [
              {
                slug: "ea-going-concern",
                title: "Going concern",
                status: "stub",
                intro:
                  "Can the business keep trading for the foreseeable future? If that's in doubt, the accounts, and the audit report, change.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Indicators to watch",
                    points: [
                      "Losses, negative cash flow, breached loan terms.",
                      "Suppliers on cash-only, key customers lost.",
                      "Consider management's plans and their realism.",
                    ],
                  },
                ],
                resourceSlotHints: ["A going-concern explainer"],
                skillSpec: {
                  concepts: ["Spotting going-concern indicators and the audit response"],
                  taskTypes: ["risk_identification", "technical_viva"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Relevant indicators", "Sensible response"],
                  generatorNotes: "Invent a struggling business (PKR). No standard numbers (§3.2).",
                },
              },
              {
                slug: "ea-subsequent-events",
                title: "Subsequent events",
                status: "stub",
                intro:
                  "Things that happen after year-end but before the report can still change the accounts. Auditors keep looking right up to signing.",
                cheatsheet: [
                  {
                    kind: "terms",
                    heading: "Two kinds",
                    terms: [
                      { term: "Adjusting", def: "Confirms a condition that existed at year-end, adjust the accounts." },
                      { term: "Non-adjusting", def: "New condition after year-end, disclose if material." },
                    ],
                  },
                ],
                resourceSlotHints: ["A subsequent-events explainer"],
                skillSpec: {
                  concepts: ["Classifying subsequent events and the response"],
                  taskTypes: ["technical_viva", "case_analysis"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Correct classification", "Right accounting response"],
                  generatorNotes: "Invent events. No standard numbers (§3.2).",
                },
              },
              {
                slug: "ea-written-representations",
                title: "Written representations",
                status: "stub",
                intro:
                  "A signed letter from management confirming things only they can, that they've told you everything, judgements are reasonable, and so on.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "What they are and aren't",
                    points: [
                      "Audit evidence, but weak on its own.",
                      "Used where other evidence can't reasonably exist.",
                      "Never a substitute for testing.",
                    ],
                  },
                ],
                resourceSlotHints: ["An example representation letter"],
              },
              {
                slug: "ea-audit-opinions",
                title: "Types of audit opinion",
                status: "stub",
                intro:
                  "The opinion is the whole point. Know the difference between a clean report and the ways it can be modified, in plain terms.",
                cheatsheet: [
                  {
                    kind: "terms",
                    heading: "The opinions",
                    terms: [
                      { term: "Unmodified", def: "Clean, accounts give a true and fair view." },
                      { term: "Qualified", def: "'Except for' a specific issue." },
                      { term: "Adverse", def: "Accounts as a whole do not give a true and fair view." },
                      { term: "Disclaimer", def: "Couldn't get enough evidence to form an opinion." },
                    ],
                  },
                  {
                    kind: "verify",
                    heading: "Report wording and standards",
                    note: "Exact report wording and the standards behind it are prescribed and updated. Confirm current wording rather than memorising it.",
                    link: { label: "ACCA (official)", url: "https://www.accaglobal.com" },
                  },
                ],
                resourceSlotHints: ["A plain guide to audit opinions"],
                skillSpec: {
                  concepts: ["Choosing the right opinion for a situation and explaining why"],
                  taskTypes: ["technical_viva", "case_analysis"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Correct opinion", "Sound reasoning (material vs pervasive)"],
                  generatorNotes: "Invent a scenario (misstatement or evidence limitation). No exact report wording (§3.2).",
                },
              },
            ],
          },
          {
            slug: "ea-firm-interview-prep",
            title: "Firm interview & training-contract prep",
            summary: "Getting through a Pakistani firm's interview and into a training contract.",
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
                      "Situation, set the scene briefly.",
                      "Task, what you needed to do.",
                      "Action, what you actually did.",
                      "Result, the outcome, ideally measurable.",
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
          "Looking inward: testing a company's own controls and reporting to its management, rather than giving an external opinion.",
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
                      "Deficiency: what's weak or missing.",
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
              {
                slug: "ia-governance",
                title: "Corporate governance basics",
                status: "stub",
                intro:
                  "Internal audit exists to serve good governance. Knowing what governance is, and who internal audit answers to, frames the whole role.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "The essentials",
                    points: [
                      "Governance is how an organisation is directed and held to account.",
                      "Internal audit reports to the audit committee, not just management.",
                      "That reporting line protects its independence.",
                    ],
                  },
                ],
                resourceSlotHints: ["A plain intro to corporate governance"],
              },
              {
                slug: "ia-three-lines",
                title: "The three lines model",
                status: "stub",
                intro:
                  "A simple map of who owns risk. It shows where internal audit sits and why it stays independent of the work it reviews.",
                cheatsheet: [
                  {
                    kind: "terms",
                    heading: "The three lines",
                    terms: [
                      { term: "First line", def: "Management, who own and manage risk day to day." },
                      { term: "Second line", def: "Risk and compliance functions that support and monitor." },
                      { term: "Third line", def: "Internal audit, independent assurance to the board." },
                    ],
                  },
                ],
                resourceSlotHints: ["An overview of the three lines model"],
              },
              {
                slug: "ia-risk-management",
                title: "Risk management",
                status: "stub",
                intro:
                  "Internal audit checks that risks are identified and managed. Understanding the risk cycle lets you judge whether that's happening.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "The risk cycle",
                    points: [
                      "Identify risks, assess likelihood and impact.",
                      "Respond: accept, reduce, transfer, or avoid.",
                      "Monitor and review as things change.",
                    ],
                  },
                ],
                resourceSlotHints: ["An intro to enterprise risk management"],
                skillSpec: {
                  concepts: ["Identifying business risks and sensible responses"],
                  taskTypes: ["risk_identification", "case_analysis"],
                  difficulty: { min: 2, max: 5 },
                  rubric: ["Real, relevant risks", "Sensible responses", "Clear reasoning"],
                  generatorNotes: "Invent a business scenario (PKR where relevant). No standard numbers (§3.2).",
                },
              },
              {
                slug: "ia-planning",
                title: "Planning an internal audit",
                status: "stub",
                intro:
                  "Internal audit works to a plan driven by risk, and each review has its own scope and objectives. Planning is where the value is set.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "How a review is scoped",
                    points: [
                      "Pick areas by risk, not by habit.",
                      "Set clear objectives and scope for each assignment.",
                      "Agree what good looks like before you start testing.",
                    ],
                  },
                ],
                resourceSlotHints: ["An internal-audit planning guide"],
              },
              {
                slug: "ia-reporting",
                title: "Reporting to management",
                status: "stub",
                intro:
                  "Findings only matter if they land. A good internal audit report is clear, fair, and drives action, not defensiveness.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "A report that gets acted on",
                    points: [
                      "Rank findings by risk so attention goes to what matters.",
                      "Be factual and balanced; agree facts with management first.",
                      "Every finding has an owner and a date.",
                    ],
                  },
                ],
                resourceSlotHints: ["An example internal-audit report"],
                skillSpec: {
                  concepts: ["Writing a clear internal-audit finding"],
                  taskTypes: ["working_paper_note", "control_deficiency"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Factual and fair", "Ranked by risk", "Actionable recommendation"],
                  generatorNotes: "Invent a control finding. No standard numbers (§3.2).",
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
          "An advanced specialism: auditing controls in computerised systems, access, data integrity, change management.",
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
                      "Access controls, least privilege, segregation of duties.",
                      "Change management, controlled, tested changes.",
                      "Data integrity and backups.",
                    ],
                  },
                ],
                resourceSlotHints: ["An IT general controls overview"],
              },
              {
                slug: "ita-application-controls",
                title: "Application controls",
                status: "stub",
                intro:
                  "Controls built into a specific system: the checks that stop bad data going in and catch it if it does.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Types to know",
                    points: [
                      "Input controls: validation, range checks, mandatory fields.",
                      "Processing controls: totals that must reconcile.",
                      "Output controls: reviews of what the system produced.",
                    ],
                  },
                ],
                resourceSlotHints: ["An application-controls overview"],
              },
              {
                slug: "ita-access-management",
                title: "Access and segregation of duties",
                status: "stub",
                intro:
                  "Who can do what in a system is a top risk. The goal is least privilege and no one person controlling a whole transaction.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "What to check",
                    points: [
                      "Users have only the access their job needs.",
                      "Incompatible duties are split across people.",
                      "Leavers lose access promptly; access is reviewed.",
                    ],
                  },
                ],
                resourceSlotHints: ["A guide to access controls and SoD"],
                skillSpec: {
                  concepts: ["Spotting access and segregation weaknesses"],
                  taskTypes: ["control_deficiency", "risk_identification"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Real weakness identified", "Sensible fix"],
                  generatorNotes: "Invent a system-access scenario. No standard numbers (§3.2).",
                },
              },
              {
                slug: "ita-change-management",
                title: "Change management",
                status: "stub",
                intro:
                  "When systems change, uncontrolled changes break things or hide fraud. Changes should be requested, tested, approved, and logged.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "A controlled change",
                    points: [
                      "Requested and approved before it happens.",
                      "Tested away from live data.",
                      "Logged, so you can see who changed what and when.",
                    ],
                  },
                ],
                resourceSlotHints: ["A change-management overview"],
              },
              {
                slug: "ita-caats",
                title: "Computer-assisted audit techniques",
                status: "stub",
                intro:
                  "Instead of testing a sample, tools let you test whole populations: every transaction, checked by rule. This is where audit is heading.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "What CAATs let you do",
                    points: [
                      "Test 100% of transactions against rules, not just a sample.",
                      "Spot duplicates, gaps, and outliers automatically.",
                      "Re-run the same tests next year in seconds.",
                    ],
                  },
                ],
                resourceSlotHints: ["An intro to CAATs and data analytics in audit"],
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
          "An advanced specialism: investigating suspected fraud, indicators, approach, and handling evidence carefully.",
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
                  "Forensic work starts with noticing what doesn't add up. Knowing common red flags and handling evidence properly is the core idea.",
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
              {
                slug: "fa-fraud-triangle",
                title: "The fraud triangle",
                status: "stub",
                intro:
                  "A simple model for why people commit fraud. It helps you see where risk builds up and where to look.",
                cheatsheet: [
                  {
                    kind: "terms",
                    heading: "Three conditions",
                    terms: [
                      { term: "Pressure", def: "A financial or personal need driving the person." },
                      { term: "Opportunity", def: "Weak controls that make fraud possible." },
                      { term: "Rationalisation", def: "The story they tell themselves to justify it." },
                    ],
                  },
                ],
                resourceSlotHints: ["An explainer on the fraud triangle"],
                skillSpec: {
                  concepts: ["Applying the fraud triangle to a scenario"],
                  taskTypes: ["case_analysis", "risk_identification"],
                  difficulty: { min: 3, max: 5 },
                  rubric: ["Identifies pressure, opportunity, rationalisation", "Tied to the scenario"],
                  generatorNotes: "Invent a workplace fraud scenario. No standard numbers (§3.2).",
                },
              },
              {
                slug: "fa-investigation-approach",
                title: "The investigative approach",
                status: "stub",
                intro:
                  "A forensic investigation is careful and planned, not a witch-hunt. You gather facts quietly, keep an open mind, and protect the evidence.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "How to work",
                    points: [
                      "Plan the scope before you start.",
                      "Stay objective; follow the evidence, not a hunch.",
                      "Keep it confidential to protect people and the case.",
                    ],
                  },
                ],
                resourceSlotHints: ["A high-level guide to fraud investigation"],
              },
              {
                slug: "fa-evidence-handling",
                title: "Handling evidence",
                status: "stub",
                intro:
                  "If evidence might be used in a dispute or court, how you handle it matters as much as what it says. Sloppy handling can sink a case.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Protecting evidence",
                    points: [
                      "Keep an unbroken chain of custody: who held it, when.",
                      "Preserve originals; work from copies.",
                      "Document everything you do to it.",
                    ],
                  },
                ],
                resourceSlotHints: ["An overview of evidence and chain of custody"],
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
    goal: "Earn by doing bookkeeping and accounts for clients, locally and on platforms like Upwork.",
    description:
      "You build practical bookkeeping skills and a portfolio, then find clients. Faster to income, more flexible, but you build credibility yourself.",
    tools: [
      { name: "QuickBooks Online", note: "The platform most small-business clients use." },
      { name: "Xero", note: "The other major cloud platform. Concepts carry over from QuickBooks." },
      { name: "Excel / Google Sheets", note: "For clean-up, reconciliations, and reports." },
      { name: "FBR IRIS", note: "Pakistan's official tax portal. Always check current rates and deadlines at the source." },
      { name: "Upwork / LinkedIn", note: "Where you set up a profile and find clients." },
    ],
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
            summary: "QuickBooks Online and Xero, the two platforms most clients use.",
            topics: [
              {
                slug: "fl-quickbooks",
                title: "QuickBooks Online basics",
                status: "stub",
                intro:
                  "Most small-business clients are on QuickBooks Online. Knowing the day-to-day flow, invoices, bills, bank feeds, reconciliation, is what they hire for.",
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
              {
                slug: "fl-bank-feeds",
                title: "Bank feeds and reconciliation",
                status: "stub",
                intro:
                  "Most day-to-day bookkeeping is categorising bank transactions and reconciling. Get fast and accurate at this and clients keep you.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "The routine",
                    points: [
                      "Connect the bank feed so transactions import automatically.",
                      "Categorise each transaction to the right account.",
                      "Match payments to invoices and bills.",
                      "Reconcile so the software balance ties to the bank statement.",
                    ],
                  },
                ],
                resourceSlotHints: ["A bank-reconciliation walkthrough in QuickBooks or Xero"],
              },
              {
                slug: "fl-chart-of-accounts",
                title: "Setting up a chart of accounts",
                status: "stub",
                intro:
                  "The chart of accounts is the list of categories everything gets sorted into. A clean one makes every report readable.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Keep it usable",
                    points: [
                      "Group by type: income, cost of sales, expenses, assets, liabilities, equity.",
                      "Enough detail to be useful, not so much it's noise.",
                      "Match it to how the owner thinks about the business.",
                    ],
                  },
                ],
                resourceSlotHints: ["A chart-of-accounts template"],
              },
            ],
          },
          {
            slug: "fl-bookkeeping-core",
            title: "Core bookkeeping for clients",
            summary: "The everyday work clients pay for, done right.",
            topics: [
              {
                slug: "fl-recording-transactions",
                title: "Recording transactions cleanly",
                status: "stub",
                intro:
                  "Sales, purchases, expenses, and payments recorded consistently, with the right dates and categories. Boring done well is the job.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Habits that keep books clean",
                    points: [
                      "One consistent method for each transaction type.",
                      "Attach the receipt or invoice where you can.",
                      "Never guess a category, ask the client if unsure.",
                    ],
                  },
                ],
                resourceSlotHints: ["A bookkeeping basics course"],
                skillSpec: {
                  concepts: ["Recording everyday business transactions correctly"],
                  taskTypes: ["journal_entries", "warmup_mcq"],
                  difficulty: { min: 1, max: 3 },
                  rubric: ["Correct accounts", "Balanced entries", "Consistent method"],
                  generatorNotes: "Use a small Pakistani business (PKR). Invent simple transactions.",
                },
              },
              {
                slug: "fl-ap-ar",
                title: "Managing bills and invoices",
                status: "stub",
                intro:
                  "Keeping track of what the client owes and what they're owed, and chasing the gaps, is a service owners value highly.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "What good looks like",
                    points: [
                      "Raise and send invoices promptly; record bills when they arrive.",
                      "Keep the aged receivables and payables lists current.",
                      "Flag overdue amounts so nothing slips.",
                    ],
                  },
                ],
                resourceSlotHints: ["A guide to accounts payable and receivable"],
              },
              {
                slug: "fl-sales-tax-basics",
                title: "Sales tax basics (Pakistan)",
                status: "stub",
                intro:
                  "Some clients are registered for sales tax. Know the mechanics of recording it, and always confirm current rates and rules at the source.",
                cheatsheet: [
                  {
                    kind: "verify",
                    heading: "Rates, thresholds, and rules",
                    note: "Sales tax rates, registration thresholds, and filing rules change and are official. Never memorise or quote a figure, confirm on the FBR site for the client's situation.",
                    link: { label: "FBR (official)", url: "https://www.fbr.gov.pk" },
                  },
                  {
                    kind: "points",
                    heading: "Stable basics",
                    points: [
                      "Track input tax (on purchases) and output tax (on sales) separately.",
                      "Keep clean records so a return is quick to prepare.",
                      "Know when to bring in a tax specialist.",
                    ],
                  },
                ],
                resourceSlotHints: ["The official FBR sales tax guide"],
              },
              {
                slug: "fl-bookkeeping-cleanup",
                title: "Cleaning up messy books",
                status: "stub",
                intro:
                  "New clients often arrive with a year of muddled records. Fixing them is a common, well-paid first job.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "A clean-up approach",
                    points: [
                      "Reconcile every account to a known-correct balance first.",
                      "Fix miscategorised and duplicated transactions.",
                      "Document what you changed and why.",
                    ],
                  },
                ],
                resourceSlotHints: ["A bookkeeping clean-up checklist"],
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
                  "A reliable monthly close is what separates a bookkeeper a client trusts from one they don't. It's a checklist done consistently.",
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
              {
                slug: "fl-management-accounts",
                title: "Management accounts owners actually use",
                status: "stub",
                intro:
                  "Owners want a short monthly read on how the business is doing, not a pile of numbers. Turning the books into a clear summary is a premium service.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "A useful monthly pack",
                    points: [
                      "Profit and loss vs last month and vs plan.",
                      "Cash position and what's owed both ways.",
                      "A few plain-language notes on what changed.",
                    ],
                  },
                ],
                resourceSlotHints: ["A management-accounts template"],
                skillSpec: {
                  concepts: ["Explaining monthly numbers to a business owner clearly"],
                  taskTypes: ["explain_to_client"],
                  difficulty: { min: 2, max: 4 },
                  rubric: ["Leads with the answer", "Plain language", "Highlights what matters"],
                  generatorNotes: "Invent monthly figures for a small business (PKR).",
                },
              },
              {
                slug: "fl-cash-flow-forecast",
                title: "Simple cash flow forecasting",
                status: "stub",
                intro:
                  "Profit is not cash. A short forecast of money in and out over the coming weeks is often the most valued thing you can give an owner.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Building a rolling forecast",
                    points: [
                      "Start with the opening cash balance.",
                      "Add expected receipts, subtract expected payments, week by week.",
                      "Update it as reality comes in.",
                    ],
                  },
                ],
                resourceSlotHints: ["A cash-flow forecast template"],
                skillSpec: {
                  concepts: ["Building and reading a simple cash flow forecast"],
                  taskTypes: ["costing", "explain_to_client"],
                  difficulty: { min: 2, max: 4 },
                  rubric: ["Correct arithmetic (code-checked)", "Sensible read of the result"],
                  generatorNotes: "Invent receipts/payments (PKR, self-consistent).",
                },
              },
            ],
          },
          {
            slug: "fl-fbr",
            title: "FBR IRIS basics (Pakistan)",
            summary: "Where Pakistani tax filing happens, without inventing any rates.",
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
                    note: "Every Pakistan tax rate, FBR rule, and filing deadline changes and is official, never memorise or quote a number here. Always confirm on the FBR site for the client's situation.",
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
                      "Pick a clear niche (e.g. 'QuickBooks bookkeeping for small UK/US firms').",
                      "Show proof: sample work, a portfolio piece, a certification.",
                      "Write the headline around the client's problem, not your titles.",
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
                  "Freelancing rewards clear communication. Clients aren't accountants, explaining plainly builds trust and repeat work.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Communicate well",
                    points: [
                      "Lead with the answer, then the detail.",
                      "Avoid jargon; use the client's words.",
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
              {
                slug: "fl-pricing",
                title: "Pricing your services",
                status: "stub",
                intro:
                  "Charging too little is the most common mistake new freelancers make. Price for the value and the time, not just the hour.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "Ways to price",
                    points: [
                      "Fixed monthly fee for a defined scope (owners like predictability).",
                      "Per-project for one-off jobs like a clean-up.",
                      "Raise your rate as your proof and speed grow.",
                    ],
                  },
                ],
                resourceSlotHints: ["A guide to pricing bookkeeping services"],
              },
              {
                slug: "fl-proposals",
                title: "Writing proposals that win",
                status: "stub",
                intro:
                  "A good proposal shows you understood the client's problem and can solve it. Most freelancers write about themselves instead.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "A proposal that lands",
                    points: [
                      "Open with the client's problem in their words.",
                      "Say exactly what you'll do and what they get.",
                      "Show one piece of proof, then a clear next step.",
                    ],
                  },
                ],
                resourceSlotHints: ["A proposal template you can adapt"],
                skillSpec: {
                  concepts: ["Writing a short, client-focused proposal"],
                  taskTypes: ["explain_to_client", "case_analysis"],
                  difficulty: { min: 2, max: 4 },
                  rubric: ["Leads with the client's problem", "Clear scope and next step", "Not all about you"],
                  generatorNotes: "Invent a small-business client and a bookkeeping need.",
                },
              },
              {
                slug: "fl-client-onboarding",
                title: "Onboarding a new client",
                status: "stub",
                intro:
                  "A smooth start sets the tone. Agreeing scope, getting access, and setting expectations early prevents most later problems.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "First-week checklist",
                    points: [
                      "Agree scope and fee in writing.",
                      "Get access to the accounting software and bank feeds.",
                      "Set how and when you'll communicate and report.",
                    ],
                  },
                ],
                resourceSlotHints: ["A client-onboarding checklist"],
              },
              {
                slug: "fl-portfolio",
                title: "Building a portfolio",
                status: "stub",
                intro:
                  "With no job history, proof of work is what wins clients. A small portfolio of clean sample work does the job.",
                cheatsheet: [
                  {
                    kind: "points",
                    heading: "What to include",
                    points: [
                      "A sample month-end pack (with made-up figures).",
                      "A before-and-after of a books clean-up.",
                      "A short note on the tools you use.",
                    ],
                  },
                ],
                resourceSlotHints: ["Examples of freelance bookkeeping portfolios"],
              },
            ],
          },
        ],
      },
    ],
  },
];
