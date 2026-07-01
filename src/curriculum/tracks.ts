import type { Track } from "./types";

// AI-drafted, pending expert review (§3b). Track content beyond the flagship
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
            ],
          },
        ],
      },
    ],
  },
];
