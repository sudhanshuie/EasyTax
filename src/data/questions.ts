export type QuestionType =
  | "choice"
  | "date"
  | "number"
  | "text"
  | "boolean";

export interface Choice {
  value: string;
  label: string;
  description?: string;
}

export interface Question {
  id: string;
  stage: number;
  stageLabel: string;
  type: QuestionType;
  question: string;
  subtext?: string;
  choices?: Choice[];
  profileKey: string;
  // Context drawer
  lawContext: {
    plainEnglish: string;
    lawArticle: string;
    whereToFind: string;
    officialLink?: string;
  };
  // Conditional: only show if this condition is met
  showIf?: (profile: Record<string, unknown>) => boolean;
  // Follow-up question id to jump to if value matches
  skipTo?: (value: unknown) => number | null;
}

export const questions: Question[] = [
  // ─── STAGE 0: PROFILE ────────────────────────────────────────────────────
  {
    id: "taxYear",
    stage: 0,
    stageLabel: "Your Profile",
    type: "choice",
    question: "Which tax year are you filing for?",
    profileKey: "taxYear",
    choices: [
      { value: "2025", label: "2025", description: "Income earned Jan–Dec 2025" },
      { value: "2026", label: "2026", description: "Income earned Jan–Dec 2026" },
    ],
    lawContext: {
      plainEnglish:
        "The Dutch tax year runs January 1 to December 31. Tax brackets, allowances, and 30% ruling salary thresholds all change each year — so the app needs the right year to calculate correctly.",
      lawArticle: "Wet Inkomstenbelasting 2001 (IB 2001), Art. 1.1 — taxpayers assessed per calendar year.",
      whereToFind:
        "Your employer's annual salary statement (jaaropgaaf) shows the tax year. It's usually issued in January or February.",
      officialLink: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/aangifte_doen/",
    },
  },
  {
    id: "nationality",
    stage: 0,
    stageLabel: "Your Profile",
    type: "choice",
    question: "What is your nationality?",
    profileKey: "nationality",
    choices: [
      { value: "indian", label: "Indian citizen", description: "Covered by India–Netherlands Tax Treaty" },
    ],
    lawContext: {
      plainEnglish:
        "The India–Netherlands Double Tax Treaty (DTT) gives Indian citizens specific protections — treaty tie-breakers, withholding rate caps (15% on dividends, 20% on interest), and social security coordination. These only apply to Indian passport holders.",
      lawArticle:
        "India–Netherlands Tax Treaty (Tractatenblad 1988, nr. 122, amended 2012 Trb. nr. 100), Art. 1 — Persons covered.",
      whereToFind: "Your passport.",
      officialLink: "https://wetten.overheid.nl/BWBV0006088/",
    },
  },
  {
    id: "residencyStatus",
    stage: 0,
    stageLabel: "Your Profile",
    type: "choice",
    question: "What is your residency status in the Netherlands for this tax year?",
    profileKey: "residencyStatus",
    choices: [
      {
        value: "full_year",
        label: "Full-year resident",
        description: "Lived in the Netherlands the entire tax year",
      },
      {
        value: "arrived_mid",
        label: "Arrived mid-year",
        description: "Moved to NL during the tax year (immigration year)",
      },
      {
        value: "left_mid",
        label: "Left mid-year",
        description: "Left NL during the tax year (emigration year)",
      },
      {
        value: "non_resident",
        label: "Non-resident",
        description: "Work in NL but live in another country",
      },
    ],
    lawContext: {
      plainEnglish:
        "Residents are taxed on their worldwide income. Non-residents are only taxed on Dutch-source income. If you arrived or left mid-year, special 'M-form' rules apply — you're only taxed as a resident for the part of the year you actually lived here. This often significantly reduces your tax bill.",
      lawArticle:
        "IB 2001, Art. 2.1 (resident taxpayer), Art. 2.1(1)(b) (non-resident). M-form (migration year): Art. 2.6 IB 2001.",
      whereToFind:
        "Your BRP (Basisregistratie Personen) registration date from your gemeente (municipality). If you registered at a municipality, you became a resident from that date.",
    },
  },
  {
    id: "arrivalDate",
    stage: 0,
    stageLabel: "Your Profile",
    type: "date",
    question: "What was your arrival (or departure) date in the Netherlands?",
    subtext: "Enter the date you registered at your municipality.",
    profileKey: "arrivalDate",
    showIf: (p) =>
      p.residencyStatus === "arrived_mid" || p.residencyStatus === "left_mid",
    lawContext: {
      plainEnglish:
        "For immigration or emigration years, only the income earned from your arrival date to December 31 (or January 1 to your departure) is taxed in NL as a resident. This date is the exact cut-off.",
      lawArticle: "IB 2001, Art. 2.6 — qualifying foreign period and migration year provisions.",
      whereToFind:
        "Your residence permit (verblijfsvergunning) or a BRP extract from your gemeente. You can request a uittreksel (extract) from the municipality for €10–15.",
    },
  },

  // ─── STAGE 1: PERSONAL & FAMILY ──────────────────────────────────────────
  {
    id: "bsn",
    stage: 1,
    stageLabel: "Personal & Family",
    type: "text",
    question: "What is your BSN (Burgerservicenummer)?",
    subtext: "Your 9-digit Dutch citizen service number.",
    profileKey: "bsn",
    lawContext: {
      plainEnglish:
        "Your BSN is your tax ID in the Netherlands — like a PAN card in India. It's required for all Belastingdienst filings, DigiD login, and benefit applications.",
      lawArticle: "Wet Basisregistratie Personen (BRP), Art. 1.3 — BSN is the unique citizen identifier.",
      whereToFind:
        "Your DigiD welcome letter, salary slips, gemeente registration extract (uittreksel), or your health insurance card (zorgpas).",
    },
  },
  {
    id: "maritalStatus",
    stage: 1,
    stageLabel: "Personal & Family",
    type: "choice",
    question: "What is your marital or partnership status?",
    profileKey: "maritalStatus",
    choices: [
      { value: "single", label: "Single" },
      { value: "married", label: "Married" },
      { value: "registered_partner", label: "Registered partner (geregistreerd partnerschap)" },
      { value: "cohabiting", label: "Cohabiting with a contract (samenlevingscontract)" },
    ],
    lawContext: {
      plainEnglish:
        "Married couples and registered partners can split income (especially Box 3 assets) in the most tax-efficient way. This doubles the Box 3 tax-free allowance — €118,714 for couples vs. €59,357 for singles in 2026. It also affects benefit thresholds for zorgtoeslag.",
      lawArticle: "IB 2001, Art. 1.2 — fiscal partnership definition. Box 3 allowance: Art. 5.1.",
      whereToFind: "Your marriage certificate, partnership deed, or samenlevingscontract.",
    },
  },
  {
    id: "partnerInNL",
    stage: 1,
    stageLabel: "Personal & Family",
    type: "choice",
    question: "Does your partner also live in the Netherlands?",
    profileKey: "partnerInNL",
    showIf: (p) =>
      p.maritalStatus === "married" ||
      p.maritalStatus === "registered_partner" ||
      p.maritalStatus === "cohabiting",
    choices: [
      { value: "true", label: "Yes, also registered in NL" },
      { value: "false", label: "No, lives in India or elsewhere" },
    ],
    lawContext: {
      plainEnglish:
        "A partner abroad may not qualify as a fiscal partner in NL. Fiscal partnership (fiscaal partnerschap) requires both persons to be registered at the same address in the Dutch BRP. Without it, you cannot split Box 3 assets and some deductions are unavailable.",
      lawArticle: "IB 2001, Art. 1.2(4) — fiscal partnership requires same BRP address registration.",
      whereToFind:
        "BRP registration records. Both partners must be registered at the same address in the same gemeente.",
    },
  },
  {
    id: "hasChildren",
    stage: 1,
    stageLabel: "Personal & Family",
    type: "choice",
    question: "Do you have dependent children?",
    profileKey: "hasChildren",
    choices: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
    lawContext: {
      plainEnglish:
        "Children may make you eligible for kinderbijslag (child benefit via SVB) and affect zorgtoeslag thresholds. Children under 18 at an international school are also relevant for 30% ruling cost reimbursement — school fees can be included in the tax-free allowance.",
      lawArticle:
        "Algemene Kinderbijslagwet (AKW). 30% ruling school fees: Besluit uitvoering loonbelasting 1965, Art. 10ea(2).",
      whereToFind: "Birth certificates, school enrolment letters.",
    },
  },
  {
    id: "numberOfChildren",
    stage: 1,
    stageLabel: "Personal & Family",
    type: "number",
    question: "How many dependent children do you have?",
    profileKey: "numberOfChildren",
    showIf: (p) => p.hasChildren === true || p.hasChildren === "true",
    lawContext: {
      plainEnglish:
        "The number of children affects your kinderbijslag amount (paid per child per quarter by SVB) and may affect your tax credit calculations.",
      lawArticle: "Algemene Kinderbijslagwet (AKW), Art. 7 — benefit amount per child.",
      whereToFind: "Birth certificates.",
    },
  },

  // ─── STAGE 2: EMPLOYMENT ─────────────────────────────────────────────────
  {
    id: "employmentType",
    stage: 2,
    stageLabel: "Employment & Income",
    type: "choice",
    question: "What best describes your work situation in the Netherlands?",
    profileKey: "employmentType",
    choices: [
      { value: "employed", label: "Employed (in dienst)", description: "Work for a Dutch employer on a contract" },
      { value: "self_employed", label: "Self-employed (ZZP / freelance)", description: "Own business or freelance contracts" },
      { value: "both", label: "Both — employed and self-employed" },
      { value: "unemployed", label: "Unemployed / receiving WW benefit" },
      { value: "retired", label: "Retired / receiving pension" },
    ],
    lawContext: {
      plainEnglish:
        "The 30% ruling (a major expat tax benefit) is only available to employees — not the self-employed. Your employment type determines which deductions and benefits you can access. Self-employed persons can claim the zelfstandigenaftrek (self-employment deduction) and MKB-winstvrijstelling (SME profit exemption).",
      lawArticle:
        "IB 2001, Art. 3.1 — Box 1 income from work. 30% ruling restricted to employees: Wet LB 1964, Art. 31a(2)(e).",
      whereToFind:
        "Your employment contract (arbeidsovereenkomst) or KvK (Chamber of Commerce) registration number.",
    },
  },
  {
    id: "grossAnnualSalary",
    stage: 2,
    stageLabel: "Employment & Income",
    type: "number",
    question: "What is your gross annual salary from Dutch employment (in €)?",
    subtext: "Enter the total gross salary before any deductions. Include the 30% tax-free amount if it was applied.",
    profileKey: "grossAnnualSalary",
    showIf: (p) => p.employmentType === "employed" || p.employmentType === "both",
    lawContext: {
      plainEnglish:
        "This is your primary Box 1 income — the main input for calculating your tax. In 2026, tax rates are 35.75% up to €38,883, then 37.56% up to €78,426, then 49.50% above that. It also determines whether you meet the 30% ruling salary threshold (€48,013 in 2026).",
      lawArticle:
        "IB 2001, Art. 3.1 and Art. 2.10 — Box 1 tax brackets. Wet LB 1964 for wage withholding.",
      whereToFind:
        "Your jaaropgaaf (annual salary statement) issued by your employer in January/February. Look for 'Loon voor loonheffing' — wage for tax purposes. Ask HR if you haven't received it.",
    },
  },
  {
    id: "thirtyPercentRulingApplied",
    stage: 2,
    stageLabel: "Employment & Income",
    type: "choice",
    question: "Did your employer apply the 30% ruling to your salary this year?",
    profileKey: "thirtyPercentRulingApplied",
    showIf: (p) => p.employmentType === "employed" || p.employmentType === "both",
    choices: [
      { value: "true", label: "Yes — my employer applied it" },
      { value: "false", label: "No — it was not applied" },
      { value: "unknown", label: "I'm not sure" },
    ],
    lawContext: {
      plainEnglish:
        "The 30% ruling is one of the biggest tax benefits for expats in NL. If applied, 30% of your salary is paid completely tax-free by your employer. From 2026 the maximum tax-free amount is capped at €78,600/year. Your taxable income is only 70% of your gross salary — a huge saving at higher income levels.",
      lawArticle:
        "Wet LB 1964, Art. 31a(2)(e) — extraterritorial cost exemption. Cap: Besluit uitvoering loonbelasting 1965, Art. 10ei.",
      whereToFind:
        "Check your salary slips — look for 'ET-vergoeding' or '30%-regeling' as a separate untaxed line. Also visible on your jaaropgaaf as a tax-free component.",
    },
  },
  {
    id: "thirtyPercentRulingStartDate",
    stage: 2,
    stageLabel: "Employment & Income",
    type: "date",
    question: "When did your 30% ruling start?",
    subtext: "Enter the start date shown on your ruling decision letter.",
    profileKey: "thirtyPercentRulingStartDate",
    showIf: (p) =>
      p.thirtyPercentRulingApplied === true ||
      p.thirtyPercentRulingApplied === "true",
    lawContext: {
      plainEnglish:
        "The 30% ruling is valid for a maximum of 5 years from the start date. The app will check whether it's still valid and warn you if it's expiring soon. If the ruling started or ended mid-year, the €78,600 cap is applied pro-rata.",
      lawArticle: "Besluit uitvoering loonbelasting 1965, Art. 10ei — 5-year maximum duration.",
      whereToFind:
        "The 30% ruling decision letter (beschikking) issued by Belastingdienst — sent jointly to you and your employer. Your company's HR or global mobility team will have a copy.",
    },
  },
  {
    id: "hasRulingDecisionLetter",
    stage: 2,
    stageLabel: "Employment & Income",
    type: "choice",
    question: "Do you have the official 30% ruling decision letter (beschikking)?",
    profileKey: "hasRulingDecisionLetter",
    showIf: (p) =>
      p.thirtyPercentRulingApplied === true ||
      p.thirtyPercentRulingApplied === "true",
    choices: [
      { value: "true", label: "Yes, I have it" },
      { value: "false", label: "No, I don't have it" },
      { value: "pending", label: "Applied but still pending" },
    ],
    lawContext: {
      plainEnglish:
        "Without an official decision letter, your employer legally cannot apply the ruling. If the application is still pending, you may be able to claim back-payment of the tax-free amount once the decision arrives — but only within the same calendar year.",
      lawArticle:
        "Wet LB 1964, Art. 31a(9) — ruling requires a formal decision; retroactive correction allowed within the tax year.",
      whereToFind:
        "Email or physical letter from Belastingdienst, typically forwarded via your employer's HR or global mobility / relocation team.",
    },
  },
  {
    id: "multipleEmployers",
    stage: 2,
    stageLabel: "Employment & Income",
    type: "choice",
    question: "Did you work for more than one employer during this tax year?",
    profileKey: "multipleEmployers",
    showIf: (p) => p.employmentType === "employed" || p.employmentType === "both",
    choices: [
      { value: "true", label: "Yes — I changed jobs or had multiple employers" },
      { value: "false", label: "No — only one employer" },
    ],
    lawContext: {
      plainEnglish:
        "Each employer issues a separate jaaropgaaf — you must report all of them. If you had the 30% ruling with one employer and switched to another outside the same corporate group, the ruling may have terminated. You had 4 months from the new job start to re-apply.",
      lawArticle:
        "IB 2001, Art. 3.84 — all employment income aggregated. 30% ruling continuity: Besluit uitvoering loonbelasting 1965, Art. 10ej.",
      whereToFind: "Jaaropgaaf from each employer. Request from HR if not received.",
    },
  },
  {
    id: "workedDaysInIndia",
    stage: 2,
    stageLabel: "Employment & Income",
    type: "number",
    question: "How many days did you physically work in India (or another country) while employed in NL this year?",
    subtext: "Count only days you actually worked — not holidays or weekends.",
    profileKey: "workedDaysInIndia",
    showIf: (p) => p.employmentType === "employed" || p.employmentType === "both",
    lawContext: {
      plainEnglish:
        "Under Art. 15 of the India–NL Tax Treaty, salary earned for work physically performed in India is taxable in India — not the Netherlands. If your Dutch employer didn't cost your India days to an Indian entity, you may be able to exclude those days' salary from Dutch tax. This is common for expats who travel to India for business.",
      lawArticle:
        "India–NL DTT, Art. 15 — Dependent Personal Services. The 183-day rule applies in any 12-month period.",
      whereToFind:
        "Your passport stamps, business trip expense reports, and Outlook/Google calendar. Keep these records — they are your evidence for the treaty claim.",
      officialLink: "https://wetten.overheid.nl/BWBV0006088/",
    },
  },
  {
    id: "indianIncome",
    stage: 2,
    stageLabel: "Employment & Income",
    type: "choice",
    question: "Did you receive any income from India this year? (salary, freelance, rental, interest, etc.)",
    profileKey: "indianIncome",
    choices: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
    lawContext: {
      plainEnglish:
        "As a Dutch tax resident, you must report your worldwide income — including anything earned in India. However, you won't be taxed twice. Under Art. 23 of the India–NL Tax Treaty, the Netherlands gives you a credit for taxes already paid in India. The Indian income still needs to be declared so NL can apply the right tax rate to your Dutch income (the 'progression clause').",
      lawArticle:
        "IB 2001, Art. 2.1 — residents taxed on worldwide income. India–NL DTT, Art. 23 — elimination of double taxation (tax credit method).",
      whereToFind:
        "Indian bank statements, Form 16 or salary certificate from an Indian employer, or your Indian Income Tax Return (ITR) filed in India.",
    },
  },
  {
    id: "indianIncomeAmountEUR",
    stage: 2,
    stageLabel: "Employment & Income",
    type: "number",
    question: "What was the approximate total value of your Indian income in EUR?",
    subtext: "Convert INR to EUR using the RBI reference rate on January 1 of the tax year (approx. €1 = ₹90).",
    profileKey: "indianIncomeAmountEUR",
    showIf: (p) => p.indianIncome === true || p.indianIncome === "true",
    lawContext: {
      plainEnglish:
        "The Netherlands requires income reported in EUR. Use the exchange rate on the date you received the income, or the annual average rate published by the Dutch Central Bank (DNB). For simplicity, the RBI reference rate on January 1 of the tax year is a widely accepted proxy.",
      lawArticle:
        "IB 2001, Art. 2.1 — worldwide income in EUR. Uitvoeringsregeling IB 2001 — exchange rate rules.",
      whereToFind:
        "RBI reference rates: rbi.org.in. DNB annual average rate: statistics.dnb.nl.",
      officialLink: "https://www.rbi.org.in/scripts/ReferenceRateArchive.aspx",
    },
  },
  {
    id: "receivedBonus",
    stage: 2,
    stageLabel: "Employment & Income",
    type: "choice",
    question: "Did you receive a bonus, RSU/ESOP vesting, or any one-time payment this year?",
    profileKey: "receivedBonus",
    choices: [
      { value: "true", label: "Yes" },
      { value: "false", label: "No" },
    ],
    lawContext: {
      plainEnglish:
        "Bonuses and vested RSUs (Restricted Stock Units) are Box 1 income taxed in the year you receive them — even if they were for work done in prior years. If RSUs vested while you were still in India, that portion may be taxable in India under the treaty (Art. 15 DTT proportional allocation). Keep your equity plan vesting schedule.",
      lawArticle:
        "IB 2001, Art. 3.82 — bonuses taxable in year of receipt. DTT Art. 15 for cross-border allocation of equity.",
      whereToFind:
        "Your equity plan statement (from E*Trade, Morgan Stanley, etc.), HR letter, or your jaaropgaaf where the bonus may be shown separately.",
    },
  },
  {
    id: "bonusAmountEUR",
    stage: 2,
    stageLabel: "Employment & Income",
    type: "number",
    question: "What was the total value of your bonus / RSU vesting (in EUR)?",
    profileKey: "bonusAmountEUR",
    showIf: (p) => p.receivedBonus === true || p.receivedBonus === "true",
    lawContext: {
      plainEnglish:
        "For RSUs, use the share price on the vesting date multiplied by the number of shares vested. This value appears on your jaaropgaaf if your employer processed it through payroll — which they should have.",
      lawArticle: "IB 2001, Art. 3.82 — income from employment includes equity.",
      whereToFind:
        "Your equity plan portal (E*Trade, Fidelity, Morgan Stanley), or your jaaropgaaf under 'loon uit tegenwoordige dienstbetrekking'.",
    },
  },

  // ─── STAGE 3: 30% RULING ELIGIBILITY ─────────────────────────────────────
  {
    id: "recruitedFromAbroad",
    stage: 3,
    stageLabel: "30% Ruling Eligibility",
    type: "choice",
    question: "Were you recruited to your current Dutch job from outside the Netherlands?",
    profileKey: "recruitedFromAbroad",
    showIf: (p) =>
      (p.employmentType === "employed" || p.employmentType === "both") &&
      (p.thirtyPercentRulingApplied === false ||
        p.thirtyPercentRulingApplied === "false" ||
        p.thirtyPercentRulingApplied === "unknown"),
    choices: [
      {
        value: "true",
        label: "Yes — the job offer was made while I was living abroad",
      },
      {
        value: "false",
        label: "No — I was already living in NL when I got this job",
      },
    ],
    lawContext: {
      plainEnglish:
        "One of the 3 core conditions for the 30% ruling is that the employer recruited you from abroad. The key test is: where were you living when the job offer was made and accepted? If you were in India and then moved to NL for the job, you likely qualify. If you were already in NL, you likely do not.",
      lawArticle:
        "Wet LB 1964, Art. 31a(2)(e)(1) — recruitment from outside Netherlands is a core eligibility condition.",
      whereToFind:
        "Your employment contract — check the date it was signed and whether the offer was from a Dutch entity or foreign entity. Your original work visa application may also show this.",
    },
  },
  {
    id: "livedOutside150km",
    stage: 3,
    stageLabel: "30% Ruling Eligibility",
    type: "choice",
    question:
      "In the 24 months before starting your Dutch job, did you live more than 150 km from the Dutch border for at least 16 months?",
    profileKey: "livedOutside150km",
    showIf: (p) =>
      (p.employmentType === "employed" || p.employmentType === "both") &&
      (p.thirtyPercentRulingApplied === false ||
        p.thirtyPercentRulingApplied === "false" ||
        p.thirtyPercentRulingApplied === "unknown"),
    choices: [
      {
        value: "true",
        label: "Yes — I lived in India or another country far from NL",
        description: "India is ~6,000+ km away — easily meets this requirement",
      },
      {
        value: "false",
        label: "No — I lived in Belgium, Luxembourg, or near the Dutch border",
      },
    ],
    lawContext: {
      plainEnglish:
        "This is the 'distance criterion'. The Netherlands requires you to have lived far from the border to prevent people from nearby countries gaming the system. If you lived in India before moving to NL, you pass this easily — India is thousands of kilometres away.",
      lawArticle: "Wet LB 1964, Art. 31a(2)(e)(3) — distance criterion.",
      whereToFind:
        "Your previous address in India — an old lease agreement, utility bill, or Aadhaar card address will serve as evidence if ever asked.",
    },
  },
  {
    id: "salaryAtHire",
    stage: 3,
    stageLabel: "30% Ruling Eligibility",
    type: "number",
    question: "What was your gross annual salary when you started your Dutch job (in €)?",
    subtext: "Exclude the 30% tax-free portion — this is your taxable salary.",
    profileKey: "salaryAtHire",
    showIf: (p) =>
      (p.employmentType === "employed" || p.employmentType === "both") &&
      (p.thirtyPercentRulingApplied === false ||
        p.thirtyPercentRulingApplied === "false" ||
        p.thirtyPercentRulingApplied === "unknown"),
    lawContext: {
      plainEnglish:
        "The 30% ruling has a minimum salary threshold — in 2026, your taxable salary (excluding the 30% portion) must be at least €48,013. For employees under 30 with a master's degree, the lower threshold of €36,497 applies. If your salary at hire was below the threshold, you don't qualify.",
      lawArticle:
        "Wet LB 1964, Art. 31a(2)(e)(2). Updated annually in: Uitvoeringsregeling loonbelasting 2011.",
      whereToFind: "Your original employment contract or offer letter.",
    },
  },
  {
    id: "under30WithMasters",
    stage: 3,
    stageLabel: "30% Ruling Eligibility",
    type: "choice",
    question:
      "Are you under 30 years old AND do you hold a master's degree (or equivalent)?",
    profileKey: "under30WithMasters",
    showIf: (p) =>
      (p.employmentType === "employed" || p.employmentType === "both") &&
      (p.thirtyPercentRulingApplied === false ||
        p.thirtyPercentRulingApplied === "false" ||
        p.thirtyPercentRulingApplied === "unknown"),
    choices: [
      { value: "true", label: "Yes — under 30 with a master's degree (or MTech / MBA)" },
      { value: "false", label: "No" },
    ],
    lawContext: {
      plainEnglish:
        "If you are under 30 AND have a master's degree (including Indian MTech, MBA, or equivalent), you qualify for the reduced salary threshold of €36,497 (2026). This makes the 30% ruling accessible to younger expats in junior-to-mid roles.",
      lawArticle:
        "Wet LB 1964, Art. 31a(2)(e)(2)(b) — reduced threshold for under-30 masters.",
      whereToFind:
        "Your passport (date of birth) and university degree certificate. For Indian degrees, a certified English translation is recommended.",
    },
  },
];
