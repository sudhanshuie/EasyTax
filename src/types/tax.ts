export type TaxYear = "2025" | "2026";
export type ResidencyStatus = "full_year" | "arrived_mid" | "left_mid" | "non_resident";
export type EmploymentType = "employed" | "self_employed" | "both" | "unemployed" | "retired";
export type MaritalStatus = "single" | "married" | "registered_partner" | "cohabiting";

// All boolean fields stored as string ("true"/"false") since they come from radio choices
export type BoolStr = "true" | "false" | null;

export interface TaxProfile {
  // Stage 0 — Profile
  taxYear: TaxYear | null;
  nationality: "indian" | null;
  residencyStatus: ResidencyStatus | null;
  arrivalDate: string | null;

  // Stage 1 — Personal & Family
  bsn: string | null;
  maritalStatus: MaritalStatus | null;
  partnerInNL: BoolStr;
  hasChildren: BoolStr;
  numberOfChildren: number | null;

  // Stage 2 — Employment
  employmentType: EmploymentType | null;
  grossAnnualSalary: number | null;
  thirtyPercentRulingApplied: "true" | "false" | "unknown" | null;
  thirtyPercentRulingStartDate: string | null;
  hasRulingDecisionLetter: "true" | "false" | "pending" | null;
  multipleEmployers: BoolStr;
  workedDaysInIndia: number | null;
  indianIncome: BoolStr;
  indianIncomeType: string | null;
  indianIncomeAmountEUR: number | null;
  receivedBonus: BoolStr;
  bonusAmountEUR: number | null;

  // Stage 3 — 30% Ruling Eligibility
  recruitedFromAbroad: BoolStr;
  livedOutside150km: BoolStr;
  salaryAtHire: number | null;
  under30WithMasters: BoolStr;
}

export const emptyProfile: TaxProfile = {
  taxYear: null,
  nationality: null,
  residencyStatus: null,
  arrivalDate: null,
  bsn: null,
  maritalStatus: null,
  partnerInNL: null,
  hasChildren: null,
  numberOfChildren: null,
  employmentType: null,
  grossAnnualSalary: null,
  thirtyPercentRulingApplied: null,
  thirtyPercentRulingStartDate: null,
  hasRulingDecisionLetter: null,
  multipleEmployers: null,
  workedDaysInIndia: null,
  indianIncome: null,
  indianIncomeType: null,
  indianIncomeAmountEUR: null,
  receivedBonus: null,
  bonusAmountEUR: null,
  recruitedFromAbroad: null,
  livedOutside150km: null,
  salaryAtHire: null,
  under30WithMasters: null,
};

// Helper to check a BoolStr or string as truthy
export const isTrue = (v: unknown): boolean => v === "true" || v === true;
