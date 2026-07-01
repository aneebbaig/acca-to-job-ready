import type { Module } from "./types";

// Shared Foundation — both tracks (§13). AI-drafted, pending expert review.
// Stable fundamentals only; no invented standard numbers/rates/URLs.

export const foundation: Module[] = [
  {
    slug: "foundation-bookkeeping",
    title: "Bookkeeping foundations",
    summary:
      "The double-entry engine underneath every set of accounts: debits, credits, journals, and the trial balance.",
    topics: [
      {
        slug: "double-entry-and-the-accounting-equation",
        title: "Double-entry and the accounting equation",
        status: "ready",
        intro:
          "Every transaction touches at least two accounts, and the books only stay honest if the two sides always agree. Get this idea solid and the rest of bookkeeping follows from it.",
        cheatsheet: [
          {
            kind: "formula",
            heading: "The one equation everything rests on",
            formulas: [
              {
                name: "Accounting equation",
                expr: "Assets = Liabilities + Equity",
                means:
                  "What the business controls equals who funded it — lenders plus owners. It must always balance.",
              },
              {
                name: "Expanded",
                expr: "Assets = Liabilities + Equity + Income − Expenses",
                means:
                  "Income grows equity, expenses shrink it. This is why the income statement feeds the balance sheet.",
              },
            ],
          },
          {
            kind: "points",
            heading: "Debits and credits (the rule that never changes)",
            points: [
              "Debit increases: assets and expenses.",
              "Credit increases: liabilities, equity, and income.",
              "Every entry: total debits = total credits. No exceptions.",
              "‘Debit’ and ‘credit’ are just left and right — not good and bad.",
            ],
          },
          {
            kind: "terms",
            heading: "Words people use loosely",
            terms: [
              { term: "Journal", def: "The first record of a transaction as debits and credits." },
              { term: "Ledger", def: "All entries grouped by account (e.g. the cash account)." },
              { term: "Trial balance", def: "A list of every ledger balance; debits should equal credits." },
            ],
          },
        ],
        resourceSlotHints: [
          "A short video that explains debits and credits",
          "A worked example you found helpful",
          "A practice question set",
        ],
        skillSpec: {
          concepts: [
            "Applying the debit/credit rules to everyday business transactions",
            "Keeping total debits equal to total credits",
          ],
          taskTypes: ["warmup_mcq", "journal_entries"],
          difficulty: { min: 1, max: 3 },
          rubric: [
            "Each transaction is recorded with the correct accounts.",
            "Debit and credit amounts are correct and the entry balances.",
            "Account names are sensible and consistent.",
          ],
          generatorNotes:
            "Use a small Pakistani business (PKR). Invent simple, self-consistent amounts. 3–6 everyday transactions (sales, purchases, paying rent, owner capital, taking a loan).",
        },
      },
      {
        slug: "recording-journal-entries",
        title: "Recording journal entries from transactions",
        status: "ready",
        intro:
          "This is the day-one task in almost every accounts job: read what happened in the business and turn it into correct journal entries. It is the single most useful skill to drill.",
        cheatsheet: [
          {
            kind: "points",
            heading: "A reliable method",
            points: [
              "Name the two (or more) accounts the transaction touches.",
              "Decide which goes up and which goes down.",
              "Apply the rule: debit increases assets/expenses, credit increases liabilities/equity/income.",
              "Check the entry balances before moving on.",
            ],
          },
          {
            kind: "terms",
            heading: "Common accounts",
            terms: [
              { term: "Cash / Bank", def: "Money on hand or in the account (an asset)." },
              { term: "Accounts receivable", def: "Money customers owe you (an asset)." },
              { term: "Accounts payable", def: "Money you owe suppliers (a liability)." },
              { term: "Capital", def: "What the owner has put in (equity)." },
            ],
          },
        ],
        resourceSlotHints: [
          "A worked set of journal examples",
          "A drill or quiz on journals",
          "Your own notes on tricky entries",
        ],
        skillSpec: {
          concepts: [
            "Translating business events into balanced journal entries",
            "Choosing the correct accounts and direction",
          ],
          taskTypes: ["journal_entries", "trial_balance_correction", "warmup_mcq"],
          difficulty: { min: 1, max: 4 },
          rubric: [
            "Correct accounts chosen for each event.",
            "Correct debit/credit direction and amounts.",
            "Every entry balances; the batch ties to the totals in the key.",
            "Handles at least one slightly tricky event (e.g. a credit purchase, an owner drawing).",
          ],
          generatorNotes:
            "Use a named Pakistani small business and PKR. Invent self-consistent numbers. Mix cash and credit transactions. The hidden key must list each entry with account, debit, credit so code can check it balances and ties.",
        },
      },
      {
        slug: "the-trial-balance",
        title: "Building and correcting a trial balance",
        status: "ready",
        intro:
          "Once everything is posted, the trial balance is your first health check. When it doesn’t balance, knowing how to hunt down the error is exactly what employers test.",
        cheatsheet: [
          {
            kind: "points",
            heading: "When it won’t balance",
            points: [
              "Find the difference. If it’s divisible by 9, suspect transposed digits (e.g. 540 vs 450).",
              "Half the difference can reveal an entry posted to the wrong side.",
              "Check a figure was not entered once instead of twice (one-sided entry).",
              "Re-add each column before assuming a posting error.",
            ],
          },
          {
            kind: "terms",
            heading: "Error types that still balance",
            terms: [
              { term: "Error of omission", def: "A transaction left out entirely." },
              { term: "Error of commission", def: "Right amount, wrong account of the same type." },
              { term: "Error of principle", def: "Posted to the wrong type of account (e.g. asset as expense)." },
              { term: "Compensating error", def: "Two errors that happen to cancel out." },
            ],
          },
        ],
        resourceSlotHints: [
          "A guide to finding trial-balance errors",
          "A practice trial balance to fix",
        ],
        skillSpec: {
          concepts: [
            "Assembling a trial balance from ledger balances",
            "Locating and correcting posting errors so it balances",
          ],
          taskTypes: ["trial_balance_correction", "error_spotting", "warmup_mcq"],
          difficulty: { min: 2, max: 5 },
          rubric: [
            "All corrections identified.",
            "Corrected trial balance actually balances (debits = credits).",
            "Corrected figures match the worked key.",
          ],
          generatorNotes:
            "Generate a trial balance of ~8–10 accounts in PKR with one or two deliberate, self-consistent errors. The hidden key holds the corrected balances; code must confirm the corrected TB balances.",
        },
      },
    ],
  },
  {
    slug: "foundation-financial-statements",
    title: "Financial statements",
    summary:
      "Reading and building the income statement, balance sheet, and cash flow from a trial balance — and seeing how the three connect.",
    topics: [
      {
        slug: "how-the-three-statements-link",
        title: "How the three statements link",
        status: "ready",
        intro:
          "Interviewers love this because it proves you understand accounts as a system, not three separate reports. Profit flows into the balance sheet; cash ties them together.",
        cheatsheet: [
          {
            kind: "points",
            heading: "The links to remember",
            points: [
              "Net profit from the income statement increases retained earnings on the balance sheet.",
              "The cash flow statement explains the change in the cash line on the balance sheet.",
              "Balance sheet always balances: assets = liabilities + equity.",
              "Depreciation reduces profit but is added back in the cash flow (it isn’t a cash outflow).",
            ],
          },
        ],
        resourceSlotHints: [
          "A visual of the three-statement links",
          "A walkthrough you can rewatch before interviews",
        ],
        skillSpec: {
          concepts: ["Explaining how income statement, balance sheet, and cash flow connect"],
          taskTypes: ["technical_viva", "explain_to_client"],
          difficulty: { min: 2, max: 5 },
          rubric: [
            "Mentions profit → retained earnings.",
            "Mentions cash flow explaining the cash movement.",
            "Notes a non-cash item such as depreciation.",
            "Clear, structured answer an interviewer would rate well.",
          ],
          generatorNotes:
            "Interview-style. Avoid any specific standard numbers or rates (§3.2).",
        },
      },
      {
        slug: "building-statements-from-a-trial-balance",
        title: "Building statements from a trial balance",
        status: "ready",
        intro:
          "Turning a trial balance into a tidy income statement and balance sheet is core month-end work. It’s mechanical once you know which line goes where.",
        cheatsheet: [
          {
            kind: "points",
            heading: "Where each balance goes",
            points: [
              "Income and expenses → income statement.",
              "Assets, liabilities, and equity → balance sheet.",
              "Profit from the income statement is carried into equity.",
              "Watch for adjustments (accruals, prepayments, depreciation) before you finalise.",
            ],
          },
        ],
        resourceSlotHints: ["A template you like", "A practice TB-to-statements exercise"],
        skillSpec: {
          concepts: ["Producing key income statement and balance sheet lines from a trial balance"],
          taskTypes: ["financial_statement_prep", "warmup_mcq"],
          difficulty: { min: 2, max: 5 },
          rubric: [
            "Correct classification of each balance.",
            "Income statement subtotal (profit) is arithmetically correct.",
            "Balance sheet balances.",
          ],
          generatorNotes:
            "Provide a small trial balance (PKR, invented numbers). Key holds the expected line items and subtotals so code can re-check the arithmetic.",
        },
      },
      {
        slug: "financial-ratios",
        title: "Reading the business with ratios",
        status: "ready",
        intro:
          "Ratios turn raw figures into a story about liquidity, profitability, and risk. Employers want both the number and a sentence on what it means.",
        cheatsheet: [
          {
            kind: "formula",
            heading: "Ratios worth knowing cold",
            formulas: [
              { name: "Current ratio", expr: "Current assets ÷ Current liabilities", means: "Can it pay short-term bills? Around 1.5–2 is often comfortable." },
              { name: "Gross margin", expr: "Gross profit ÷ Revenue", means: "How much of each sale is left after cost of sales." },
              { name: "Net margin", expr: "Net profit ÷ Revenue", means: "Profit left after all expenses." },
              { name: "Gearing", expr: "Debt ÷ Equity", means: "How reliant the business is on borrowing." },
            ],
          },
          {
            kind: "points",
            heading: "Interpreting, not just computing",
            points: [
              "Always compare: prior year, a competitor, or an industry norm.",
              "A ‘good’ ratio depends on the industry — context first.",
              "One ratio rarely tells the whole story; read them together.",
            ],
          },
        ],
        resourceSlotHints: ["A ratio reference sheet", "A set of ratio practice questions"],
        skillSpec: {
          concepts: ["Computing standard ratios", "Interpreting what they say about the business"],
          taskTypes: ["ratio_analysis", "warmup_mcq"],
          difficulty: { min: 2, max: 5 },
          rubric: [
            "Ratios computed correctly from the figures given.",
            "Interpretation is sensible and tied to context.",
            "No overreach from a single ratio.",
          ],
          generatorNotes:
            "Give summarised figures (PKR, invented). Code checks the ratio arithmetic; AI grades the interpretation. Use only the universal ratio formulas above.",
        },
      },
    ],
  },
  {
    slug: "foundation-adjustments",
    title: "Adjustments and reconciliations",
    summary:
      "The month-end adjustments that turn raw bookkeeping into true accounts: accruals, prepayments, depreciation, bad debts, and bank reconciliation.",
    topics: [
      {
        slug: "accruals-and-prepayments",
        title: "Accruals and prepayments",
        status: "ready",
        intro:
          "Accounts should reflect the period they belong to, not just when cash moved. Accruals and prepayments are how you get expenses and income into the right month.",
        cheatsheet: [
          {
            kind: "terms",
            heading: "The four cases",
            terms: [
              { term: "Accrued expense", def: "Used it, not yet paid — recognise the expense and a liability." },
              { term: "Prepaid expense", def: "Paid ahead — hold it as an asset until used." },
              { term: "Accrued income", def: "Earned, not yet received — recognise income and a receivable." },
              { term: "Deferred income", def: "Received in advance — hold as a liability until earned." },
            ],
          },
        ],
        resourceSlotHints: ["A worked accruals/prepayments example", "A practice set"],
        skillSpec: {
          concepts: ["Recording period-end accruals and prepayments correctly"],
          taskTypes: ["adjusting_entries", "warmup_mcq"],
          difficulty: { min: 2, max: 5 },
          rubric: [
            "Correct adjustment type identified.",
            "Correct accounts and amounts; entry balances.",
            "Effect on profit and on the balance sheet is right.",
          ],
          generatorNotes:
            "Invent self-consistent amounts (PKR). Code re-checks arithmetic; AI checks accounts and direction.",
        },
      },
      {
        slug: "depreciation",
        title: "Depreciation",
        status: "ready",
        intro:
          "Big assets are used up over years, so their cost is spread over time rather than expensed at once. Two methods cover most of what you’ll meet.",
        cheatsheet: [
          {
            kind: "formula",
            heading: "The two common methods",
            formulas: [
              { name: "Straight-line", expr: "(Cost − Residual value) ÷ Useful life", means: "Same charge every year." },
              { name: "Reducing balance", expr: "Rate × Carrying amount", means: "Higher charge early, falling over time." },
            ],
          },
          {
            kind: "points",
            heading: "Watch for",
            points: [
              "Depreciation is a non-cash expense.",
              "Accumulated depreciation reduces the asset’s carrying amount on the balance sheet.",
              "Useful life and residual value are estimates — they can change.",
            ],
          },
        ],
        resourceSlotHints: ["A depreciation worked example", "A practice question set"],
        skillSpec: {
          concepts: ["Calculating depreciation and recording the charge"],
          taskTypes: ["adjusting_entries", "warmup_mcq"],
          difficulty: { min: 2, max: 5 },
          rubric: [
            "Correct method applied.",
            "Arithmetic correct (code re-checked).",
            "Charge and accumulated depreciation recorded correctly.",
          ],
          generatorNotes:
            "Invent cost, life, residual, rate (PKR, self-consistent). Avoid quoting any tax-allowed rates — those are §3.2 facts.",
        },
      },
      {
        slug: "bank-reconciliation",
        title: "Bank reconciliation",
        status: "ready",
        intro:
          "The bank’s record and your cash book rarely match to the penny on any given day. Reconciling them is a routine control that catches errors and fraud — and a classic test task.",
        cheatsheet: [
          {
            kind: "points",
            heading: "Why they differ",
            points: [
              "Unpresented cheques: you recorded them, the bank hasn’t cleared them yet.",
              "Outstanding lodgements: you banked it, it hasn’t hit the statement.",
              "Bank charges/interest: on the statement, not yet in your cash book.",
              "Errors: on either side.",
            ],
          },
          {
            kind: "points",
            heading: "Method",
            points: [
              "Start from the cash book balance.",
              "Adjust the cash book for items you missed (charges, direct debits, interest).",
              "Then reconcile to the statement using timing items (unpresented cheques, outstanding lodgements).",
              "The adjusted figures should agree.",
            ],
          },
        ],
        resourceSlotHints: ["A reconciliation walkthrough", "A messy statement to reconcile"],
        skillSpec: {
          concepts: ["Reconciling a cash book to a bank statement", "Classifying reconciling items"],
          taskTypes: ["bank_reconciliation", "warmup_mcq"],
          difficulty: { min: 2, max: 5 },
          rubric: [
            "Reconciling items correctly identified and classified.",
            "Adjusted cash book and statement balances agree (code-checked).",
            "Working is clear and ordered.",
          ],
          generatorNotes:
            "Generate a cash book balance, a statement balance, and a set of self-consistent reconciling items (PKR) that genuinely reconcile. The hidden key must let code confirm the reconciliation ties.",
        },
      },
    ],
  },
  {
    slug: "foundation-excel",
    title: "Excel for accountants",
    summary:
      "The spreadsheet skills every finance job assumes: lookups, pivot tables, conditional logic, clean data, and simple models.",
    topics: [
      {
        slug: "excel-lookups",
        title: "Lookup functions",
        status: "ready",
        intro:
          "Pulling a value from another table is the workhorse of finance spreadsheets. Knowing the modern lookup functions makes you noticeably faster.",
        cheatsheet: [
          {
            kind: "formula",
            heading: "Lookups",
            formulas: [
              { name: "XLOOKUP", expr: "XLOOKUP(lookup, lookup_range, return_range)", means: "The modern default — looks left or right, returns a match." },
              { name: "VLOOKUP", expr: "VLOOKUP(lookup, table, col_index, FALSE)", means: "Older but everywhere; always use FALSE for an exact match." },
              { name: "INDEX/MATCH", expr: "INDEX(return_range, MATCH(lookup, lookup_range, 0))", means: "Flexible classic combo when XLOOKUP isn’t available." },
            ],
          },
        ],
        resourceSlotHints: ["A lookup functions tutorial", "A practice workbook"],
        skillSpec: {
          concepts: ["Choosing and writing the right lookup formula for a task"],
          taskTypes: ["excel_task", "warmup_mcq"],
          difficulty: { min: 1, max: 4 },
          rubric: [
            "Formula would return the correct value.",
            "Exact-match handled correctly.",
            "Approach is sound and explained.",
          ],
          generatorNotes:
            "Describe a small dataset and a lookup goal; the user submits the formula/approach as text. AI grades the logic.",
        },
      },
      {
        slug: "excel-pivot-tables",
        title: "Pivot tables",
        status: "ready",
        intro:
          "Pivot tables summarise thousands of rows into an answer in seconds. Employers expect you to build one without thinking about it.",
        cheatsheet: [
          {
            kind: "points",
            heading: "The mental model",
            points: [
              "Rows = what you group by (e.g. customer, month).",
              "Values = what you measure (e.g. sum of sales).",
              "Columns = an optional second split.",
              "Filters = narrow the whole table.",
            ],
          },
        ],
        resourceSlotHints: ["A pivot table tutorial", "A dataset to summarise"],
        skillSpec: {
          concepts: ["Designing a pivot table to answer a question"],
          taskTypes: ["excel_task", "warmup_mcq"],
          difficulty: { min: 1, max: 4 },
          rubric: [
            "Correct fields placed in rows/values/filters.",
            "Would produce the requested summary.",
            "Approach explained clearly.",
          ],
          generatorNotes: "Describe a dataset and a summarising goal; user explains the pivot setup. AI grades.",
        },
      },
      {
        slug: "excel-conditional-logic",
        title: "Conditional logic",
        status: "ready",
        intro:
          "Real spreadsheets make decisions: flag overdue invoices, band customers, total only what matches. IF and its friends are how you encode those rules.",
        cheatsheet: [
          {
            kind: "formula",
            heading: "The decision functions",
            formulas: [
              { name: "IF", expr: "IF(test, value_if_true, value_if_false)", means: "One yes/no decision." },
              { name: "IFS", expr: "IFS(test1, val1, test2, val2, …)", means: "Several conditions without nesting IFs." },
              { name: "SUMIFS", expr: "SUMIFS(sum_range, crit_range1, crit1, …)", means: "Total rows that meet all the criteria." },
              { name: "COUNTIFS", expr: "COUNTIFS(crit_range1, crit1, …)", means: "Count rows that meet all the criteria." },
            ],
          },
          {
            kind: "points",
            heading: "Watch for",
            points: [
              "Deeply nested IFs get unreadable — reach for IFS or a lookup table.",
              "Criteria are text like \">1000\" or \"Overdue\".",
              "SUMIFS puts the sum range first; SUMIF puts it last — don't mix them up.",
            ],
          },
        ],
        resourceSlotHints: ["A guide to IF/IFS/SUMIFS", "A practice workbook"],
        skillSpec: {
          concepts: ["Writing conditional formulas to flag, band, or total data"],
          taskTypes: ["excel_task", "warmup_mcq"],
          difficulty: { min: 1, max: 4 },
          rubric: ["Formula logic is correct", "Handles the criteria properly", "Explained clearly"],
          generatorNotes: "Describe a dataset and a conditional goal; the user submits the formula/approach as text. AI grades.",
        },
      },
      {
        slug: "excel-data-validation",
        title: "Data validation and clean data",
        status: "ready",
        intro:
          "Garbage in, garbage out. Data validation stops bad entries at the door, and a few cleaning habits keep a workbook trustworthy.",
        cheatsheet: [
          {
            kind: "points",
            heading: "Validation basics",
            points: [
              "Data → Data Validation restricts a cell to a list, a number range, or a date.",
              "A dropdown list prevents typos and inconsistent categories.",
              "Use it on input cells so downstream formulas can trust the data.",
            ],
          },
          {
            kind: "points",
            heading: "Cleaning habits",
            points: [
              "TRIM removes stray spaces; CLEAN removes non-printing characters.",
              "Convert text-numbers with VALUE (or a paste-special multiply by 1).",
              "Keep one fact per column; don't merge cells in data ranges.",
            ],
          },
        ],
        resourceSlotHints: ["A data-validation tutorial", "A messy dataset to clean"],
        skillSpec: {
          concepts: ["Setting up data validation and cleaning a messy range"],
          taskTypes: ["excel_task", "warmup_mcq"],
          difficulty: { min: 1, max: 3 },
          rubric: ["Correct validation rule", "Sensible cleaning approach", "Explained clearly"],
          generatorNotes: "Describe a messy dataset and a validation/cleaning goal; the user submits their approach as text. AI grades.",
        },
      },
      {
        slug: "excel-power-query",
        title: "Power Query concepts",
        status: "ready",
        intro:
          "When you find yourself re-doing the same copy-paste-clean every month, Power Query records the steps once and replays them on next month's file. It's the biggest time-saver most bookkeepers never learn.",
        cheatsheet: [
          {
            kind: "points",
            heading: "The idea",
            points: [
              "Get & Transform (Power Query) imports data and records each cleaning step.",
              "Re-run the query on new data and every step re-applies automatically.",
              "Great for combining files, unpivoting, and repeatable month-end imports.",
            ],
          },
          {
            kind: "points",
            heading: "Common steps",
            points: [
              "Remove columns, filter rows, split columns, change types.",
              "Merge (join) and Append (stack) queries.",
              "Load the cleaned result back to a table or the data model.",
            ],
          },
        ],
        resourceSlotHints: ["An intro to Power Query", "A repeatable-import example"],
        skillSpec: {
          concepts: ["Explaining how Power Query automates a repeatable clean/import"],
          taskTypes: ["excel_task", "explain_to_client", "warmup_mcq"],
          difficulty: { min: 2, max: 4 },
          rubric: ["Correct understanding of the query-steps model", "Sensible steps for the goal", "Clear explanation"],
          generatorNotes: "Describe a repetitive monthly import/clean; the user explains how Power Query would handle it. AI grades.",
        },
      },
      {
        slug: "excel-modeling",
        title: "Simple financial modelling",
        status: "ready",
        intro:
          "A small, clean model — assumptions in one place, calculations that flow, an answer at the end — is a skill clients pay well for. Structure matters as much as formulas.",
        cheatsheet: [
          {
            kind: "points",
            heading: "How to structure a model",
            points: [
              "Separate inputs (assumptions), calculations, and outputs.",
              "Never hard-code a number inside a formula — reference an input cell.",
              "Colour-code inputs so they're obvious; keep one calculation per row.",
              "Build in checks (totals that must tie) so errors show themselves.",
            ],
          },
        ],
        resourceSlotHints: ["A modelling best-practices guide", "A simple model to rebuild"],
        skillSpec: {
          concepts: ["Structuring a simple, auditable spreadsheet model"],
          taskTypes: ["excel_task", "explain_to_client", "warmup_mcq"],
          difficulty: { min: 2, max: 5 },
          rubric: ["Inputs separated from calculations", "No hard-coded numbers in formulas", "Includes a check"],
          generatorNotes: "Describe a small modelling goal (e.g. a 12-month cash projection); the user explains their structure. AI grades.",
        },
      },
    ],
  },
  {
    slug: "foundation-management",
    title: "Costing and management basics",
    summary:
      "The management-accounting numbers owners actually ask for: variances, breakeven, and simple budgets.",
    topics: [
      {
        slug: "costing-basics",
        title: "Costing: variance, breakeven, and budgets",
        status: "ready",
        intro:
          "Beyond recording the past, businesses want help planning. Knowing whether you beat budget, how many units cover your costs, and how to build a simple budget makes you useful to an owner.",
        cheatsheet: [
          {
            kind: "formula",
            heading: "The core calculations",
            formulas: [
              { name: "Contribution", expr: "Selling price − Variable cost (per unit)", means: "What each sale contributes toward fixed costs and profit." },
              { name: "Breakeven (units)", expr: "Fixed costs ÷ Contribution per unit", means: "Units you must sell to cover all costs." },
              { name: "Variance", expr: "Actual − Budget", means: "How far you landed from plan; label it favourable or adverse." },
            ],
          },
          {
            kind: "points",
            heading: "Reading the numbers",
            points: [
              "A favourable variance isn't always good — investigate why.",
              "Fixed costs stay put in the short run; variable costs move with volume.",
              "A budget is a plan, not a promise — compare and learn.",
            ],
          },
        ],
        resourceSlotHints: ["A costing/breakeven walkthrough", "A budget-vs-actual example"],
        skillSpec: {
          concepts: [
            "Computing contribution, breakeven, and simple variances",
            "Explaining what the numbers mean",
          ],
          taskTypes: ["costing", "warmup_mcq", "explain_to_client"],
          difficulty: { min: 2, max: 5 },
          rubric: [
            "Figures are arithmetically correct (code-checked).",
            "Correct method for the question.",
            "Sensible interpretation.",
          ],
          generatorNotes:
            "Invent cost/volume/budget data (PKR, self-consistent). Provide the data in 'given'; the learner computes values the code re-checks.",
        },
      },
    ],
  },
];
