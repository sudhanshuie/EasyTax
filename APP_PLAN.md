# NL Tax Filing App — Plan for Indian Expats
**Scope:** Indian citizens living and working in the Netherlands, filing 2025 / 2026 taxes.
**Philosophy:** Ask one question at a time. For every question, explain the law, why we ask, and where the user can find the answer.

---

## App Architecture: Question Flow

The app is a **guided interview** structured in 8 stages. Each stage unlocks based on prior answers (conditional logic). At the end, the app produces:
- A filled-in summary of all inputs
- A checklist of documents to gather
- A pre-fill guide for the Belastingdienst online form
- A set of alerts (e.g. "You may qualify for the 30% ruling")

---

## Stage 0: Your Profile (One-time Setup)

These questions establish who you are and don't change year to year.

---

### Q0.1 — What is your tax year?
- **Options:** 2025 / 2026
- **Why:** Tax brackets, Box 3 allowances, and 30% ruling salary thresholds differ by year. The app needs to use the right numbers.
- **Law:** Wet Inkomstenbelasting 2001 (IB 2001), Art. 1.1 — taxpayers are assessed per calendar year.
- **Where to find it:** Your employer's annual salary statement (jaaropgaaf) will show the tax year.

---

### Q0.2 — What is your nationality?
- **Options:** Indian citizen / Other (out of scope)
- **Why:** The India–Netherlands Double Tax Treaty (DTT) provides specific protections — treaty tie-breakers, withholding rate caps, and social security rules — only available to Indian citizens. This also determines which DTT articles apply.
- **Law:** India–Netherlands Tax Treaty (Tractatenblad 1988, nr. 122), as amended in 2012 (Trb. 2012, nr. 100), Art. 1 — Persons covered.
- **Where to find it:** Your passport.

---

### Q0.3 — What is your tax residency status in the Netherlands?
- **Options:**
  - A) Full-year resident (lived in NL all of 2025/2026)
  - B) Arrived mid-year (immigration year — "M-form")
  - C) Left mid-year (emigration year)
  - D) Non-resident (working in NL but living elsewhere)
- **Why:** Residents are taxed on worldwide income. Non-residents are taxed only on Dutch-source income (Box 1 employment, Box 2, Box 3 NL assets). The M-form applies special part-year rules that significantly reduce your tax liability.
- **Law:** IB 2001, Art. 2.1 (resident taxpayer) and Art. 2.1(1)(b) (non-resident taxpayer). For M-form: Art. 2.6 IB 2001.
- **Where to find it:** Your BRP (Basisregistratie Personen) registration date from your gemeente. If you registered at a municipality, you're a resident from that date.

---

### Q0.4 — What was your arrival date in the Netherlands? *(only if B or C above)*
- **Format:** DD/MM/YYYY
- **Why:** For immigration/emigration years, only income earned from arrival to Dec 31 (or Jan 1 to departure) is taxed in NL as a resident. This date is the cut-off.
- **Law:** IB 2001, Art. 2.6 — qualifying foreign period and migration year provisions.
- **Where to find it:** Your residence permit (verblijfsvergunning) or BRP extract from your gemeente.

---

## Stage 1: Personal & Family Situation

### Q1.1 — What is your BSN (Burgerservicenummer)?
- **Why:** The BSN is your tax ID in NL. Required for all Belastingdienst filings, DigiD login, and benefit applications. The app needs this to pre-fill forms and cross-reference employer data.
- **Law:** Wet Basisregistratie Personen (BRP), Art. 1.3 — BSN is the unique citizen identifier.
- **Where to find it:** Your DigiD letter, salary slips, municipality registration extract (uittreksel), or zorgpas (health insurance card).

---

### Q1.2 — Are you married or do you have a registered partner (geregistreerd partnerschap)?
- **Options:** Single / Married / Registered partner / Cohabiting (with cohabitation contract)
- **Why:** Married couples and registered partners can split income (especially Box 3 assets) in the most tax-efficient way. This doubles the Box 3 tax-free allowance (€118,714 in 2026 vs. €59,357 for singles). Fiscal partnership also affects benefit thresholds (zorgtoeslag, huurtoeslag).
- **Law:** IB 2001, Art. 1.2 — fiscal partnership definition. Box 3: Art. 5.1 IB 2001.
- **Where to find it:** Your marriage certificate, partnership deed, or cohabitation agreement.

---

### Q1.3 — Does your partner also live in the Netherlands?
- **Options:** Yes / No (partner lives in India or elsewhere)
- **Why:** A partner abroad may not qualify as a fiscal partner. This affects whether you can split Box 3 assets and claim partner-linked deductions.
- **Law:** IB 2001, Art. 1.2(4) — fiscal partnership requires both persons to be registered at the same address in the BRP.
- **Where to find it:** BRP registration records (both partners' gemeente registrations).

---

### Q1.4 — Do you have dependent children?
- **Options:** Yes / No. If yes: how many, and their ages.
- **Why:** Children trigger potential eligibility for kinderbijslag (child benefit) and affect certain deductions. Children under 18 attending an international school are relevant for the 30% ruling cost reimbursement.
- **Law:** Algemene Kinderbijslagwet (AKW) — child benefit law. 30% ruling: Besluit uitvoering loonbelasting 1965, Art. 10ea(2).
- **Where to find it:** Birth certificates, school enrolment letters.

---

## Stage 2: Employment & Income

### Q2.1 — Are you employed, self-employed, or both?
- **Options:** Employed (in dienst) / Self-employed (ZZP/freelance) / Both / Unemployed / Retired
- **Why:** The 30% ruling is only available to employees. Self-employed income is also Box 1 but handled differently (zelfstandigenaftrek, MKB-winstvrijstelling). Different questions follow based on this answer.
- **Law:** IB 2001, Art. 3.1 — Box 1 taxable income from work and home. 30% ruling: Wet LB 1964, Art. 31a(2)(e).
- **Where to find it:** Your employment contract or KvK (Chamber of Commerce) registration.

---

### Q2.2 — What is your gross annual salary from Dutch employment? *(employees)*
- **Format:** €______
- **Why:** This is your primary Box 1 income. It determines which tax bracket applies (35.75% / 37.56% / 49.50% in 2026) and whether you meet the 30% ruling salary threshold (€48,013 in 2026).
- **Law:** IB 2001, Art. 3.1, Art. 2.10 (tax brackets). Wet LB 1964 for wage withholding.
- **Where to find it:** Your jaaropgaaf (annual salary statement) from your employer, usually issued in January/February. It shows Loon voor loonheffing (wage for tax purposes).

---

### Q2.3 — Did your employer apply the 30% ruling to your salary in this tax year?
- **Options:** Yes / No / I don't know
- **Why:** If yes, 30% of your salary was paid tax-free. This changes how your taxable income is calculated — the taxable base is only 70% of your gross salary. We need this to accurately compute your Box 1 liability.
- **Law:** Wet LB 1964, Art. 31a(2)(e) — extraterritorial cost exemption. Cap from 2026: max €78,600/year tax-free.
- **Where to find it:** Your salary slips — look for "ET-vergoeding" or "30%-regeling" as a separate untaxed line. Also on your jaaropgaaf.

---

### Q2.4 — When did the 30% ruling start? *(if yes above)*
- **Format:** MM/YYYY
- **Why:** The ruling is valid for a maximum of 5 years. The app needs to check whether it's still valid and flag if it's expiring soon. The ruling cap (€78,600) is applied pro-rata if it started or ended mid-year.
- **Law:** Besluit uitvoering loonbelasting 1965, Art. 10ei — 5-year maximum duration.
- **Where to find it:** The 30% ruling decision letter (beschikking) from Belastingdienst, issued jointly to you and your employer.

---

### Q2.5 — Do you have a 30% ruling decision letter from Belastingdienst?
- **Options:** Yes / No / Applied but pending
- **Why:** Without an official decision (beschikking), the employer cannot apply the ruling. If pending, we flag that back-payment may be possible once granted.
- **Law:** Wet LB 1964, Art. 31a(9) — ruling requires formal decision; retroactive correction allowed within the tax year.
- **Where to find it:** Email or post from Belastingdienst, forwarded via your employer's HR or global mobility team.

---

### Q2.6 — Did you work for more than one employer in this tax year?
- **Options:** Yes / No
- **Why:** Each employer issues a separate jaaropgaaf. Multiple jaaropgaven must all be reported. If the 30% ruling was with one employer and you switched, the ruling may need reapplication within 4 months.
- **Law:** IB 2001, Art. 3.84 — all employment income aggregated. 30% ruling continuity: Besluit uitvoering loonbelasting 1965, Art. 10ej.
- **Where to find it:** Jaaropgaaf from each employer.

---

### Q2.7 — Did you work any days in India (or another country) while employed in the Netherlands?
- **Options:** Yes / No. If yes: how many days?
- **Why:** Under Art. 15 of the India–NL Tax Treaty, income earned for work physically performed in India is taxable in India, not NL. You may be able to exclude those days' salary from Dutch tax and claim a treaty exemption. Critical for frequent travelers.
- **Law:** India–NL DTT, Art. 15 — Dependent Personal Services. The 183-day rule in any 12-month period.
- **Where to find it:** Travel records, passport stamps, business trip expense reports, Outlook calendar.

---

### Q2.8 — Did you receive any income in India during this tax year? (salary, freelance, rental, etc.)
- **Options:** Yes / No. If yes: what type and approximate amount in INR / EUR?
- **Why:** As a Dutch tax resident, you must report worldwide income. Indian income is included in Box 1 (employment) or as foreign income, but relief is given for taxes already paid in India under Art. 23 of the DTT (tax credit method).
- **Law:** IB 2001, Art. 2.1 — residents taxed on worldwide income. India–NL DTT, Art. 23 — elimination of double taxation.
- **Where to find it:** Indian bank statements, Form 16 / ITR (Indian Tax Return), salary certificates from Indian employer.

---

### Q2.9 — Did you receive a bonus, stock options (RSU/ESOP), or one-time payments?
- **Options:** Yes / No. If yes: type and amount.
- **Why:** Bonuses and RSU vestings are Box 1 income taxed in the year received. RSUs have specific rules — the vesting date determines the taxable event. If RSUs vested while you were in India, that portion may be taxable in India under the DTT.
- **Law:** IB 2001, Art. 3.82 — bonuses taxable in year of receipt. DTT Art. 15 for cross-border allocation.
- **Where to find it:** Your equity plan statement, HR letter, jaaropgaaf (bonus shown separately).

---

## Stage 3: The 30% Ruling Deep-Dive

*(Only shown if Q2.3 = No or Q2.5 = No — checking eligibility)*

### Q3.1 — Were you recruited from outside the Netherlands?
- **Options:** Yes / No
- **Why:** The 30% ruling requires the employer to have recruited you from abroad. If you moved to NL on your own and then found a job, you may still qualify if the employer's offer was made while you were abroad.
- **Law:** Wet LB 1964, Art. 31a(2)(e)(1) — recruitment from abroad is a core condition.
- **Where to find it:** Your employment contract — check the signing date and location, and whether the company's Dutch entity or foreign entity issued the offer.

---

### Q3.2 — Where did you live in the 24 months before starting your Dutch job?
- **Options:** India / Other country outside 150km from Dutch border / Belgium/Luxembourg/parts of Germany or France
- **Why:** You must have lived more than 150 km from the Dutch border for at least 16 of the 24 months before starting. Most Indian expats easily meet this (India is thousands of km away). But if you were previously in Belgium or nearby, you may not qualify.
- **Law:** Wet LB 1964, Art. 31a(2)(e)(3) — the distance criterion.
- **Where to find it:** Previous address history, old lease agreements, Indian Aadhaar/utility bills.

---

### Q3.3 — What was your annual salary when you started your Dutch job?
- **Format:** €______
- **Why:** The salary threshold for 2026 is €48,013 (excluding 30% tax-free portion). For under-30s with a master's degree, the lower threshold of €36,497 applies. If your salary was below threshold at hire, you don't qualify.
- **Law:** Wet LB 1964, Art. 31a(2)(e)(2), updated annually in the Uitvoeringsregeling loonbelasting.
- **Where to find it:** Your original employment contract or offer letter.

---

### Q3.4 — Are you under 30 years old AND do you hold a master's degree (or equivalent)?
- **Options:** Yes / No
- **Why:** If both are true, the reduced salary threshold (€36,497 in 2026) applies. This makes the ruling accessible to junior-level expats with advanced degrees.
- **Law:** Wet LB 1964, Art. 31a(2)(e)(2)(b) — reduced threshold for under-30 masters.
- **Where to find it:** Your passport (date of birth), university degree certificate.

---

## Stage 4: Box 3 — Savings, Investments & Global Assets

### Q4.1 — On January 1 of this tax year, did you hold bank accounts, savings, or investments?
- **Options:** Yes / No. If yes: list them (Dutch / Indian / other country).
- **Why:** Box 3 taxes your net wealth above the tax-free allowance (€59,357 single / €118,714 partners in 2026). The reference date is always January 1. Assets held that day are taxable — even if you sold them on January 2.
- **Law:** IB 2001, Art. 5.1-5.3 — Box 3 savings and investments. Reference date: Art. 5.2.
- **Where to find it:** Bank statements dated January 1, brokerage account summaries, investment platform annual overviews.

---

### Q4.2 — What is the total value of your Dutch bank accounts on January 1?
- **Format:** €______
- **Why:** Dutch bank accounts are the most common Box 3 asset. Belastingdienst often pre-fills this from Dutch bank data, but you must verify and correct if wrong.
- **Law:** IB 2001, Art. 5.3(2)(f) — bank deposits are Box 3 assets.
- **Where to find it:** Your Dutch bank's January 1 balance statement (ING, ABN AMRO, Rabobank, etc. send annual Box 3 overviews).

---

### Q4.3 — Do you hold savings or investments in India? (NRE/NRO accounts, mutual funds, shares, PPF, EPF, property)?
- **Options:** Yes / No. If yes: type and value in EUR on January 1.
- **Why:** As a Dutch tax resident, you must declare worldwide assets in Box 3. Indian NRE accounts, mutual funds (SIP), EPF balances, and property must all be declared. Indian EPF may be exempt under the DTT — this needs specific analysis.
- **Law:** IB 2001, Art. 5.3 — worldwide assets included in Box 3. India–NL DTT, Art. 22 (other income) may provide relief for certain Indian assets.
- **Where to find it:**
  - NRE/NRO: Bank statements from Indian bank on January 1
  - Mutual funds/demat: CDSL/NSDL statement or broker app (Zerodha, Groww)
  - EPF: EPF passbook / EPFO portal (epfindia.gov.in)
  - PPF: Bank/post office PPF statement
  - Property: Stamp duty value (circle rate × area) as proxy for market value

---

### Q4.4 — Do you own property in India?
- **Options:** Yes / No. If yes: is it your primary residence in India / rented out / vacant?
- **Why:** Foreign property (except your primary home in the other country under certain treaties) is a Box 3 asset. You must include the fair market value. Rental income from Indian property may also flow into Box 3 as actual return. The DTT limits Dutch taxation if India also taxes the rental.
- **Law:** IB 2001, Art. 5.3(2)(a) — real estate is a Box 3 asset. India–NL DTT, Art. 6 (income from immovable property) — both countries can tax.
- **Where to find it:** Property registration documents, municipal valuation certificate (circle rate), rental agreement.

---

### Q4.5 — Do you want to use the Actual Return Method (OWR) for Box 3? *(available from 2025)*
- **Options:** Yes / No / Help me decide
- **Why:** From 2025, you can choose to be taxed on actual returns (real interest, dividends, capital gains) instead of the notional rates. This is beneficial if your actual return is lower than notional — common for large cash savings with low interest. Note: the €59,357 tax-free allowance does NOT apply under the OWR method.
- **Law:** IB 2001, Art. 5.1 amended — OWR option introduced following Supreme Court (Hoge Raad) ruling, December 2021, ECLI:NL:HR:2021:1963.
- **Where to find it:** Your actual bank interest statements, dividend statements, and capital gains records for the full year.

---

### Q4.6 — Did you receive dividends from Dutch or foreign stocks this year?
- **Options:** Yes / No. If yes: amount and country of paying company.
- **Why:** Dutch dividends have 15% withholding tax (dividendbelasting) deducted at source, which is creditable against your income tax. Indian dividends may have 15% treaty withholding under Art. 10 of the DTT. Both are reportable Box 3 actual returns.
- **Law:** Wet DB 1965 (dividend tax). India–NL DTT, Art. 10 — 15% maximum withholding on dividends.
- **Where to find it:** Your broker's annual dividend statement, DEGIRO/Trading212/Zerodha annual report.

---

## Stage 5: Home & Housing

### Q5.1 — Do you own a home in the Netherlands (eigen woning)?
- **Options:** Yes / No (renting)
- **Why:** Owner-occupied property is in Box 1, not Box 3. Mortgage interest is deductible from Box 1 income (hypotheekrenteaftrek) — a significant deduction. The notional rental value (eigenwoningforfait) is added back as income.
- **Law:** IB 2001, Art. 3.110-3.123 — own home provisions. Eigenwoningforfait: Art. 3.112.
- **Where to find it:** Your mortgage statement (hypotheekopgaaf) from your bank — they send it in January, showing total interest paid.

---

### Q5.2 — What is the WOZ value of your Dutch home? *(only if owner)*
- **Format:** €______
- **Why:** The eigenwoningforfait (notional rental income added to Box 1) is 0.35% of the WOZ value for homes up to €1.33M (2026). This is taxable income that partially offsets the mortgage deduction.
- **Law:** IB 2001, Art. 3.112 — eigenwoningforfait rates.
- **Where to find it:** WOZ beschikking — a letter from your gemeente sent in February/March, or via WOZ-waardeloket.nl.

---

### Q5.3 — What was your total mortgage interest paid this year? *(only if owner)*
- **Format:** €______
- **Why:** Mortgage interest on your main Dutch residence is deductible at your marginal tax rate, but limited to 37.48% (Box 1 bracket 2) maximum since 2023 — the aftrekbeperking. This can significantly reduce your tax bill.
- **Law:** IB 2001, Art. 3.120 — mortgage interest deduction. Art. 3.123 — deduction limit 37.48%.
- **Where to find it:** Jaaropgave hypotheek from your mortgage lender (ING, ABN, Nationale Nederlanden, etc.).

---

## Stage 6: Social Security & Healthcare

### Q6.1 — Are you covered by the Dutch social security system (verzekerd in Nederland)?
- **Options:** Yes / No / On a secondment certificate (A1) from India
- **Why:** If you hold an A1 certificate (secondment), you remain insured in India and pay NO Dutch national insurance contributions (volksverzekeringen: AOW, Anw, Wlz). This reduces your effective tax rate. Without it, you contribute to Dutch state pension (AOW) which you may never collect.
- **Law:** India–NL Social Security Convention (1989). Wet financiering sociale verzekeringen (Wfsv) — contribution rules.
- **Where to find it:** A1 certificate issued by your Indian employer / EPFO. Or check your salary slip — if you see AOW/Anw/Wlz deductions, you're in Dutch system.

---

### Q6.2 — Do you have Dutch health insurance (zorgverzekering)?
- **Options:** Yes / No (covered by Indian or employer insurance)
- **Why:** Dutch health insurance is mandatory for all residents. If you have it, you may be eligible for healthcare allowance (zorgtoeslag) if your income is under €40,857 (2026). You also pay the income-dependent healthcare contribution (inkomensafhankelijke bijdrage Zvw) via your employer.
- **Law:** Zorgverzekeringswet (Zvw) — mandatory health insurance law. Zorgtoeslag: Wet op de zorgtoeslag.
- **Where to find it:** Your health insurance policy (CZ, VGZ, Menzis, Zilveren Kruis, etc.).

---

### Q6.3 — What is your total health insurance premium paid this year?
- **Format:** €______/month
- **Why:** The zorgtoeslag subsidy partially offsets your premium. The app will calculate whether you're eligible and estimate the subsidy amount based on your income.
- **Law:** Wet op de zorgtoeslag, Art. 2 — income and premium thresholds.
- **Where to find it:** Your monthly health insurance payment or annual overview from insurer.

---

## Stage 7: Deductions & Tax Credits

### Q7.1 — Did you make any charitable donations (giften) to registered Dutch or international charities?
- **Options:** Yes / No. If yes: total amount.
- **Why:** Donations to ANBI (Algemeen Nut Beogende Instellingen) registered charities are deductible from Box 1 income. A periodic gift agreement (periodieke gift) makes 100% deductible; one-off gifts must exceed 1% of income (minimum €60).
- **Law:** IB 2001, Art. 6.33-6.38 — giftenaftrek (gift deduction).
- **Where to find it:** Donation receipts, bank transfer records, ANBI confirmation letters.

---

### Q7.2 — Did you pay alimony or other maintenance payments?
- **Options:** Yes / No. If yes: amount paid and to whom (ex-spouse in NL / in India).
- **Why:** Alimony paid to a former spouse is deductible (persoonsgebonden aftrek). Payments to family in India may not qualify — the recipient must be legally entitled under Dutch or treaty rules.
- **Law:** IB 2001, Art. 6.3 — alimentatie deduction. India–NL DTT, Art. 22 for cross-border payments.
- **Where to find it:** Divorce agreement (echtscheidingsconvenant), bank transfer records.

---

### Q7.3 — Did you have significant medical costs not covered by insurance?
- **Options:** Yes / No. If yes: total amount.
- **Why:** Specific medical costs above a threshold (drempel) are deductible. Costs must be for prescribed treatments, and the deduction has been significantly restricted since 2019. Still relevant for disability aids, specific therapies.
- **Law:** IB 2001, Art. 6.17-6.27 — aftrek specifieke zorgkosten.
- **Where to find it:** Medical receipts, out-of-pocket payment records, health insurer's eigen risico statement.

---

### Q7.4 — Did you pay for education or professional training?
- **Options:** Yes / No. If yes: amount.
- **Why:** Study costs for your own professional development (studiekosten) used to be deductible but were removed from 2022. Replaced by the STAP budget scheme (also now discontinued). Employer reimbursement under the 30% ruling may cover this instead.
- **Law:** IB 2001, Art. 6.27 — studiekosten aftrek removed per 2022.
- **Where to find it:** Training invoices (for records even if no longer deductible).

---

## Stage 8: India-Specific Tax Credits & Treaty Claims

### Q8.1 — Did you file (or will you file) an Indian Income Tax Return for this year?
- **Options:** Yes / No / Not sure
- **Why:** To claim the double tax relief (tax credit) in the Netherlands for taxes paid in India, you need to know the Indian tax paid or payable. Under Art. 23 of the DTT, NL grants a credit for Indian taxes on income also taxable in NL.
- **Law:** India–NL DTT, Art. 23 — elimination of double taxation. IB 2001, Art. 2.1, Besluit Voorkoming Dubbele Belasting 2001 (BVDB 2001).
- **Where to find it:** Your Indian ITR (Income Tax Return), Form 16 from Indian employer, India tax payment challan.

---

### Q8.2 — Did you receive any pension income from India?
- **Options:** Yes / No. If yes: is it from the Indian government / private employer?
- **Why:** Government pensions (from the Indian Government or state governments) are taxable ONLY in India under Art. 18(2) of the DTT — completely exempt in NL. Private sector pensions are taxable in the country of residence (NL). This is an important exclusion that many miss.
- **Law:** India–NL DTT, Art. 18 — Pensions. Art. 19 — Government service (pensions taxable only in paying state).
- **Where to find it:** Pension certificate from EPFO or employer, pension slip.

---

### Q8.3 — Did you receive income from Indian investments — interest, dividends, or capital gains?
- **Options:** Yes / No. If yes: type and amount.
- **Why:**
  - Interest: Taxable in both countries; India can withhold max 20% (Art. 11 DTT). NL gives a credit.
  - Dividends: Both can tax; max 15% Indian withholding (Art. 10 DTT).
  - Capital gains: Generally taxable only in India (Art. 13 DTT) unless it's a substantial interest (>25% of company).
- **Law:** India–NL DTT, Art. 10 (dividends), Art. 11 (interest), Art. 13 (capital gains).
- **Where to find it:** Indian bank annual interest certificate, CDSL/broker P&L statement, Form 26AS from Indian income tax portal (incometax.gov.in).

---

### Q8.4 — Do you receive any rental income from property in India?
- **Options:** Yes / No. If yes: gross annual rent received.
- **Why:** Rental income from Indian property is taxable in India under Art. 6 of the DTT. The Netherlands must also be informed (worldwide income), but NL gives full relief via the exemption method — you won't pay Dutch tax on it, but it may push your other NL income into a higher bracket (progression clause).
- **Law:** India–NL DTT, Art. 6 — immovable property income taxable in country where property is situated. IB 2001 — progression rule (vrijstelling met progressievoorbehoud).
- **Where to find it:** Rental agreement, bank statements showing rent deposits, Indian ITR Schedule HP.

---

### Q8.5 — Have you made any transfers to India (remittances) this year?
- **Options:** Yes / No. If yes: total amount.
- **Why:** Remittances themselves are not taxable, but they're often confused with income. This question is asked to reassure the user that remittances don't create a tax event — and to check if there's underlying income (like Indian gifts from parents) that might technically be reportable.
- **Law:** IB 2001 — no specific remittance tax. RBI/FEMA rules (India side) govern the reporting of outward remittances, not Dutch law.
- **Where to find it:** Bank transfer records, Wise/Western Union statements.

---

## App Output: What the App Produces

After the interview is complete, the app generates:

### 1. Tax Summary Report
- Estimated Box 1 taxable income
- Box 3 net wealth and estimated tax
- Estimated total tax liability
- Estimated refund or payment due

### 2. Document Checklist
A personalized list of documents to gather before filing:
- [ ] Jaaropgaaf from employer(s)
- [ ] 30% ruling decision letter
- [ ] Box 3 January 1 balance statements (Dutch banks)
- [ ] Indian asset valuations (NRE/NRO, EPF, mutual funds)
- [ ] Property documents if applicable
- [ ] Mortgage interest statement (hypotheekopgaaf)
- [ ] WOZ beschikking
- [ ] Indian ITR / Form 26AS for tax credit claim
- [ ] A1 certificate (if applicable)
- [ ] Health insurance annual statement

### 3. Belastingdienst Filing Guide
Step-by-step instructions for entering each answer into the official Mijn Belastingdienst online form, with the exact field names in Dutch.

### 4. Alerts & Flags
- 🟡 "You may be eligible for the 30% ruling — apply before [date]"
- 🔴 "Your 30% ruling expires in [month] — notify your employer"
- 🟢 "You qualify for zorgtoeslag — apply via Mijn Toeslagen"
- 🔴 "You have Indian assets above Box 3 allowance — these must be declared"
- 🟡 "Working days in India may reduce your Dutch tax — keep travel records"

---

## Technology Stack (Recommended)

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js 14 (App Router) | Fast, SEO-friendly, great for multi-step forms |
| UI | shadcn/ui + Tailwind | Clean, accessible, quick to build |
| State | Zustand or React Hook Form | Manage multi-step form state |
| Backend | Next.js API routes | Keep it simple, serverless |
| Database | Supabase | Store user sessions, answers (already have MCP) |
| Auth | Supabase Auth | Email/magic link, no password friction |
| Hosting | Vercel | One-click deploy (already have MCP) |
| Base repo | ui-ux-pro-max-skill | As per CLAUDE.md |

---

## Key Design Principles

1. **Trust & Authority UI** — Minimal Single Column pattern with a cohesive dark theme (#0F172A), amber highlights, and IBM Plex Sans typography to exude professionalism and safety.
2. **One question per screen** — reduces cognitive load
2. **Progress bar** — show which stage the user is in (1 of 8)
3. **Context drawer** — each question has a "Why are we asking?" expandable panel with:
   - Plain English explanation
   - The relevant law/article
   - Where to find the document
   - A link to the official source
4. **Save & resume** — users don't finish in one sitting; Supabase saves progress
5. **Plain language first, legal detail on demand** — don't overwhelm
6. **Currency handling** — auto-convert INR to EUR using a fixed reference rate (RBI rate on Jan 1 of tax year)
7. **Non-judgmental** — "Many Indian expats miss declaring Indian assets — here's how to do it correctly" not "You must..."

---

## Phases

| Phase | Scope |
|---|---|
| **v1 (MVP)** | Stages 0–3 (Profile, Employment, 30% Ruling), document checklist, alerts |
| **v2** | Stages 4–5 (Box 3, Housing), tax estimate |
| **v3** | Stages 6–8 (Social Security, Deductions, India DTT), full filing guide |
| **v4** | PDF export, Belastingdienst form pre-fill, multi-year support |

---

*Last updated: March 2026. Based on: IB 2001, Wet LB 1964, India–NL DTT (Trb. 1988/122, Trb. 2012/100), IB 2001 Box 3 amendments, Zorgtoeslag wet, India–NL Social Security Convention.*
