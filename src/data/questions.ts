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

  // ── Stage 5: Home & Housing ──────────────────────────────────────────────

  {
    id: "ownsHomeInNL",
    stage: 5,
    stageLabel: "Home & Housing",
    type: "choice",
    question: "Do you own your home in the Netherlands (eigen woning)?",
    profileKey: "ownsHomeInNL",
    choices: [
      {
        value: "true",
        label: "Yes — I own my Dutch home (with or without a mortgage)",
        description: "Owner-occupied property is in Box 1. Mortgage interest is deductible.",
      },
      {
        value: "false",
        label: "No — I rent my home",
        description: "Rented property is not in Box 1. You may be eligible for huurtoeslag.",
      },
    ],
    lawContext: {
      plainEnglish:
        "In the Netherlands, your own home (eigen woning) is treated as Box 1 income — not Box 3. This means you add a small notional rental income (eigenwoningforfait) to your taxable income, but in return you can deduct all mortgage interest you paid. For most homeowners with a mortgage, the deduction significantly outweighs the eigenwoningforfait. Renters do not have this deduction, but may qualify for huurtoeslag (rent subsidy) if their income is below ~€34,678 (2026).",
      lawArticle:
        "IB 2001, Art. 3.110–3.123 — own home provisions (eigen woning regime). Eigenwoningforfait: Art. 3.112.",
      whereToFind:
        "Your mortgage statement (hypotheekopgaaf) from your bank — issued annually in January/February. Your purchase deed (leveringsakte) from the notary confirms ownership.",
    },
  },
  {
    id: "wozValueEUR",
    stage: 5,
    stageLabel: "Home & Housing",
    type: "number",
    question: "What is the WOZ value of your Dutch home (in €)?",
    subtext:
      "Use the WOZ value from the beschikking you received this year — it reflects the value on January 1 of the reference year.",
    profileKey: "wozValueEUR",
    showIf: (p) => p.ownsHomeInNL === "true",
    lawContext: {
      plainEnglish:
        "The WOZ (Wet waardering onroerende zaken) value is the municipality's assessed value of your home. It is used to calculate the eigenwoningforfait — the notional rental income added to your Box 1 taxable income. In 2026, this is 0.35% of the WOZ value for homes up to €1,330,000. For a home worth €400,000, the eigenwoningforfait is €1,400/year — modest compared to the mortgage interest deduction.",
      lawArticle:
        "IB 2001, Art. 3.112 — eigenwoningforfait rates. Wet WOZ — municipal property valuation.",
      whereToFind:
        "The WOZ beschikking is a letter sent by your gemeente (municipality) every year in February/March. You can also look it up online at WOZ-waardeloket.nl — search by your home address.",
    },
  },
  {
    id: "mortgageInterestEUR",
    stage: 5,
    stageLabel: "Home & Housing",
    type: "number",
    question: "What was your total mortgage interest paid this year (in €)?",
    subtext:
      "Enter the total interest component only — not the capital repayments (aflossing).",
    profileKey: "mortgageInterestEUR",
    showIf: (p) => p.ownsHomeInNL === "true",
    lawContext: {
      plainEnglish:
        "Mortgage interest on your main Dutch home is deductible from Box 1 income — this is called hypotheekrenteaftrek. However, since 2023 the deduction is capped at the second tax bracket rate of 37.48%, even if you're in the 49.50% bracket. Example: if you paid €10,000 in interest and you're in the 49.50% bracket, you only save 37.48% × €10,000 = €3,748 (not €4,950). The deduction is only available for mortgages that are fully repaid within 30 years (annuity or linear repayment).",
      lawArticle:
        "IB 2001, Art. 3.120 — hypotheekrenteaftrek (mortgage interest deduction). Art. 3.123 — maximum deduction rate capped at 37.48% (since 2023).",
      whereToFind:
        "The jaaropgave hypotheek — an annual statement from your mortgage lender (ING, ABN AMRO, Rabobank, Nationale Nederlanden, etc.) showing total interest paid in the calendar year. Usually sent in January.",
    },
  },

  // ── Stage 4: Box 3 — Savings, Investments & Assets ──────────────────────

  {
    id: "hasBoxThreeAssets",
    stage: 4,
    stageLabel: "Box 3 — Assets",
    type: "choice",
    question:
      "On January 1 of this tax year, did you hold any bank accounts, savings, or investments — in the Netherlands or abroad?",
    subtext:
      "Box 3 taxes your net wealth above the tax-free allowance (€59,357 for singles, €118,714 for partners in 2026). The reference date is always January 1.",
    profileKey: "hasBoxThreeAssets",
    choices: [
      { value: "true", label: "Yes — I held savings, investments, or other assets" },
      { value: "false", label: "No — I had no savings or investments on January 1" },
    ],
    lawContext: {
      plainEnglish:
        "Box 3 is the Dutch wealth tax. Every year on January 1, the tax authority takes a snapshot of all your assets worldwide. If your total net assets exceed €59,357 (single) or €118,714 (fiscal partners), the excess is taxed at a notional rate. Even assets you sold on January 2 count — the cut-off is midnight on January 1.",
      lawArticle:
        "IB 2001, Art. 5.1–5.3 — Box 3 savings and investments. Reference date: Art. 5.2.",
      whereToFind:
        "Bank statements dated January 1, brokerage account summaries (DEGIRO, Trading 212), and investment platform annual overviews.",
    },
  },
  {
    id: "dutchBankBalanceEUR",
    stage: 4,
    stageLabel: "Box 3 — Assets",
    type: "number",
    question: "What was the total balance of your Dutch bank accounts on January 1 (in €)?",
    subtext: "Include all Dutch current accounts, savings accounts, and deposit accounts.",
    profileKey: "dutchBankBalanceEUR",
    showIf: (p) => p.hasBoxThreeAssets === "true",
    lawContext: {
      plainEnglish:
        "Dutch banks (ING, ABN AMRO, Rabobank, etc.) automatically report your January 1 balance to Belastingdienst. Your return will often be pre-filled with this figure — but you must verify it. Errors do occur, especially for newly opened or closed accounts.",
      lawArticle:
        "IB 2001, Art. 5.3(2)(f) — bank deposits are Box 3 assets.",
      whereToFind:
        "Your Dutch bank's January 1 balance statement or annual Box 3 overview, usually available in the bank's app or sent by post in January.",
    },
  },
  {
    id: "hasIndianAssets",
    stage: 4,
    stageLabel: "Box 3 — Assets",
    type: "choice",
    question:
      "Do you hold savings or investments in India? (NRE/NRO accounts, mutual funds, shares, PPF, EPF, etc.)",
    profileKey: "hasIndianAssets",
    showIf: (p) => p.hasBoxThreeAssets === "true",
    choices: [
      { value: "true", label: "Yes — I have Indian savings, funds, or investment accounts" },
      { value: "false", label: "No — all my assets are in the Netherlands" },
    ],
    lawContext: {
      plainEnglish:
        "As a Dutch tax resident you must declare worldwide assets in Box 3 — including NRE/NRO accounts, mutual funds (SIP/Zerodha/Groww), EPF/PPF balances, and unlisted shares. Indian EPF may be exempt under the India–NL Tax Treaty, but this needs case-by-case analysis. Failing to declare foreign assets can result in a 12-year re-assessment period instead of the normal 5 years.",
      lawArticle:
        "IB 2001, Art. 5.3 — worldwide assets. India–NL DTT, Art. 22 (other income) may provide relief for certain Indian funds.",
      whereToFind:
        "NRE/NRO: Bank statements from Indian bank on January 1. Mutual funds / demat: CDSL/NSDL statement or Zerodha/Groww annual report. EPF: EPFO passbook at epfindia.gov.in. PPF: Bank or post-office PPF statement.",
    },
  },
  {
    id: "indianAssetsValueEUR",
    stage: 4,
    stageLabel: "Box 3 — Assets",
    type: "number",
    question:
      "What is the total value of your Indian assets on January 1 (converted to €)?",
    subtext:
      "Use the RBI reference rate on January 1 of the tax year. Approximate values are fine at this stage.",
    profileKey: "indianAssetsValueEUR",
    showIf: (p) => p.hasIndianAssets === "true",
    lawContext: {
      plainEnglish:
        "You need to convert Indian asset values to euros using the exchange rate on January 1 (not the rate when you bought them). The official rate to use is the ECB or RBI reference rate on that date. For the 2026 filing: the EUR/INR rate on 1 Jan 2026 was approximately ₹90 per €1 — so ₹9,00,000 = €10,000.",
      lawArticle:
        "IB 2001, Art. 5.3 — foreign assets included at fair market value in euros.",
      whereToFind:
        "Sum up: NRE/NRO account balance + mutual fund NAV × units + EPF balance + PPF balance + demat portfolio value on January 1. Convert to EUR using RBI/ECB rate on that date.",
    },
  },
  {
    id: "ownsPropertyInIndia",
    stage: 4,
    stageLabel: "Box 3 — Assets",
    type: "choice",
    question: "Do you own property in India?",
    profileKey: "ownsPropertyInIndia",
    choices: [
      { value: "true", label: "Yes — I own property in India" },
      { value: "false", label: "No" },
    ],
    lawContext: {
      plainEnglish:
        "Foreign property (other than your primary home abroad in certain treaty situations) is a Box 3 asset. You must include its fair market value — typically estimated using the circle rate (stamp duty value) published by the local authority. Rental income from Indian property may also be subject to Dutch reporting, though India usually has the primary taxing right.",
      lawArticle:
        "IB 2001, Art. 5.3(2)(a) — real estate is a Box 3 asset. India–NL DTT, Art. 6 — both countries may tax income from immovable property.",
      whereToFind:
        "Property registration documents (sale deed), municipal corporation valuation certificate, or circle rate × area as a proxy for market value.",
    },
  },
  {
    id: "indianPropertyUse",
    stage: 4,
    stageLabel: "Box 3 — Assets",
    type: "choice",
    question: "How is your Indian property used?",
    profileKey: "indianPropertyUse",
    showIf: (p) => p.ownsPropertyInIndia === "true",
    choices: [
      {
        value: "primary_residence",
        label: "Primary residence — family lives there (not rented out)",
        description: "Still a Box 3 asset unless a treaty exemption applies.",
      },
      {
        value: "rented",
        label: "Rented out — I receive rental income",
        description: "Both the property value and rental income must be reported.",
      },
      {
        value: "vacant",
        label: "Vacant / under construction",
        description: "Box 3 asset based on market value; no rental income to report.",
      },
    ],
    lawContext: {
      plainEnglish:
        "How the property is used changes what you need to report. Rented property: declare both the Box 3 asset value AND the rental income (India has primary taxation right under Art. 6 DTT, but NL must be informed). Family home: declare as Box 3 asset; you may receive credit if India has already taxed any deemed income. Vacant: declare at market value — no rental income to report.",
      lawArticle:
        "IB 2001, Art. 5.3(2)(a). India–NL DTT, Art. 6 (immovable property) and Art. 23 (elimination of double taxation).",
      whereToFind:
        "Your rental agreement (if rented) or a statement from the property manager. For vacant/family-use: circle rate certificate from the sub-registrar office.",
    },
  },
  {
    id: "useActualReturnMethod",
    stage: 4,
    stageLabel: "Box 3 — Assets",
    type: "choice",
    question:
      "Do you want to use the Actual Return Method (werkelijk rendement) for Box 3?",
    subtext:
      "Available from 2025. Instead of the notional rates, you're taxed only on what your assets actually earned.",
    profileKey: "useActualReturnMethod",
    showIf: (p) => p.hasBoxThreeAssets === "true",
    choices: [
      {
        value: "yes",
        label: "Yes — I want to use actual returns",
        description: "Good if your actual return is lower than the notional rate (e.g. cash savings with low interest).",
      },
      {
        value: "no",
        label: "No — use the standard notional rate method",
        description: "Simpler; often better if your investments performed well.",
      },
      {
        value: "help",
        label: "Help me decide",
        description: "I'm not sure which method results in lower tax.",
      },
    ],
    lawContext: {
      plainEnglish:
        "From 2025, you can choose between two Box 3 calculation methods: (1) Notional return method — tax is based on assumed returns (approx. 1.03% for savings, 5.88% for investments in 2026), regardless of actual performance. (2) Actual return method (OWR) — tax is based on real interest, dividends, and capital gains. Note: the €59,357 tax-free allowance does NOT apply under the OWR method. The OWR tends to save tax if you held mostly cash savings with low interest rates.",
      lawArticle:
        "IB 2001, Art. 5.1 amended — OWR option introduced following Supreme Court ruling: ECLI:NL:HR:2021:1963 (December 2021).",
      whereToFind:
        "To use OWR, you need actual annual interest certificates from your bank, dividend statements, and capital gains records for the full year.",
    },
  },
  {
    id: "receivedDividends",
    stage: 4,
    stageLabel: "Box 3 — Assets",
    type: "choice",
    question: "Did you receive dividends from Dutch or foreign stocks this year?",
    profileKey: "receivedDividends",
    choices: [
      { value: "true", label: "Yes — I received dividends" },
      { value: "false", label: "No" },
    ],
    lawContext: {
      plainEnglish:
        "Dutch dividends have 15% withholding tax (dividendbelasting) deducted at source. You can credit this against your Box 3 income tax — so you only pay the difference. Indian dividends may have up to 15% Indian withholding under Art. 10 of the DTT. Both are reportable in Box 3 as part of the actual return method, or simply as assets under the notional method.",
      lawArticle:
        "Wet DB 1965 — dividend withholding tax. India–NL DTT, Art. 10 — maximum 15% withholding on dividends.",
      whereToFind:
        "Your broker's annual dividend statement (DEGIRO annual report, Trading 212 statement, Zerodha P&L). Dutch companies also send a dividend tax certificate (dividendnota).",
    },
  },
  {
    id: "dividendAmountEUR",
    stage: 4,
    stageLabel: "Box 3 — Assets",
    type: "number",
    question: "What is the total gross dividend amount you received this year (in €)?",
    subtext:
      "Enter the gross amount before any withholding tax was deducted. Include both Dutch and foreign dividends.",
    profileKey: "dividendAmountEUR",
    showIf: (p) => p.receivedDividends === "true",
    lawContext: {
      plainEnglish:
        "Use the gross dividend (before withholding). For Dutch stocks, the gross amount is on your dividendnota. For foreign stocks, it's the amount before the foreign country deducted its withholding tax. The withheld tax (Dutch or foreign) is separately creditable when filing.",
      lawArticle:
        "IB 2001, Art. 9.2 — tax credits for withheld dividendbelasting. India–NL DTT, Art. 10 and Art. 23 — credit for Indian withholding.",
      whereToFind:
        "DEGIRO annual report (Jaaroverzicht), broker statements, or individual dividend certificates from Dutch companies.",
    },
  },
];
