"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { isTrue, type TaxProfile } from "@/types/tax";

interface SummaryProps {
  profile: TaxProfile;
  onReset: () => void;
}

interface Alert {
  type: "green" | "yellow" | "red";
  message: string;
}

function buildAlerts(profile: TaxProfile): Alert[] {
  const alerts: Alert[] = [];
  const year = profile.taxYear ?? "2026";

  const salaryThreshold = year === "2026" ? 48013 : 46660;
  const reducedThreshold = year === "2026" ? 36497 : 35468;

  // 30% ruling alerts
  if (isTrue(profile.thirtyPercentRulingApplied)) {
    if (profile.thirtyPercentRulingStartDate) {
      const start = new Date(profile.thirtyPercentRulingStartDate);
      const expiry = new Date(start);
      expiry.setFullYear(expiry.getFullYear() + 5);
      const now = new Date();
      const monthsLeft =
        (expiry.getFullYear() - now.getFullYear()) * 12 +
        (expiry.getMonth() - now.getMonth());
      if (monthsLeft <= 6 && monthsLeft > 0) {
        alerts.push({
          type: "yellow",
          message: `Your 30% ruling expires in ~${monthsLeft} months (${expiry.toLocaleDateString("en-NL", { month: "long", year: "numeric" })}). Notify your employer and plan for the tax increase.`,
        });
      } else if (monthsLeft <= 0) {
        alerts.push({
          type: "red",
          message: "Your 30% ruling has expired. Your full salary is now taxable. Ask HR to update your payroll.",
        });
      } else {
        alerts.push({
          type: "green",
          message: `Your 30% ruling is active for ~${monthsLeft} more months.`,
        });
      }
    }
  }

  // Eligibility check
  if (!isTrue(profile.thirtyPercentRulingApplied)) {
    const threshold = isTrue(profile.under30WithMasters)
      ? reducedThreshold
      : salaryThreshold;

    if (
      isTrue(profile.recruitedFromAbroad) &&
      isTrue(profile.livedOutside150km) &&
      profile.salaryAtHire != null &&
      profile.salaryAtHire >= threshold
    ) {
      alerts.push({
        type: "yellow",
        message: `You appear to meet all 3 conditions for the 30% ruling. Apply with your employer — if granted, up to 30% of your salary (max €${year === "2026" ? "78,600" : "76,200"}/yr) could be tax-free.`,
      });
    }
  }

  // India work days
  if (profile.workedDaysInIndia != null && profile.workedDaysInIndia > 0) {
    alerts.push({
      type: "yellow",
      message: `You worked ${profile.workedDaysInIndia} days in India. Under Art. 15 of the India–NL Tax Treaty, that portion of your salary may be taxable in India only — not NL. Consult a tax advisor to claim this exemption.`,
    });
  }

  // Indian income
  if (isTrue(profile.indianIncome)) {
    alerts.push({
      type: "yellow",
      message: "You have Indian income. This must be declared in your Dutch tax return. You'll get a credit for taxes paid in India under Art. 23 of the DTT — so you won't pay tax twice.",
    });
  }

  return alerts;
}

const alertColors = {
  green: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  yellow: "bg-amber-500/10 border-amber-500/20 text-amber-500",
  red: "bg-rose-500/10 border-rose-500/20 text-rose-400",
};

const alertIcons = { green: "🟢", yellow: "🟡", red: "🔴" };

const docChecklist = [
  { label: "Jaaropgaaf from your employer(s)", always: true },
  { label: "30% ruling decision letter (beschikking)", key: "hasRulingDecisionLetter" },
  { label: "BSN document (DigiD letter or salary slip)", always: true },
  { label: "WOZ beschikking (property value from gemeente)", always: false },
  { label: "Indian income documents (Form 16, bank statements)", key: "indianIncome" },
  { label: "Travel records for India work days", key: "workedDaysInIndia" },
  { label: "Partner's BSN and income details (if fiscal partner)", key: "partnerInNL" },
  { label: "Children's birth certificates & school letters", key: "hasChildren" },
];

export function Summary({ profile, onReset }: SummaryProps) {
  const alerts = buildAlerts(profile);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Your Tax Filing Summary</h1>
        <p className="text-muted-foreground text-sm">
          Based on your answers — tax year {profile.taxYear}
        </p>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="p-6 space-y-4 card-premium border-0">
          <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
            Alerts & Flags
          </h2>
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`rounded-xl border px-4 py-3 text-sm flex gap-3 ${alertColors[a.type]}`}
            >
              <span className="shrink-0">{alertIcons[a.type]}</span>
              <p>{a.message}</p>
            </div>
          ))}
        </Card>
      )}

      {/* Profile summary */}
      <Card className="p-6 space-y-5 card-premium border-0">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Your Answers
        </h2>
        <div className="space-y-2 text-sm">
          {[
            ["Tax year", profile.taxYear],
            ["Residency", profile.residencyStatus?.replace("_", " ")],
            ["Arrival date", profile.arrivalDate],
            ["BSN", profile.bsn ? `${profile.bsn.slice(0, 3)}••••••` : null],
            ["Marital status", profile.maritalStatus?.replace("_", " ")],
            ["Partner in NL", profile.partnerInNL != null ? (isTrue(profile.partnerInNL) ? "Yes" : "No") : null],
            ["Children", profile.hasChildren != null ? (isTrue(profile.hasChildren) ? `Yes (${profile.numberOfChildren ?? "?"})` : "No") : null],
            ["Employment type", profile.employmentType?.replace("_", " ")],
            ["Gross salary", profile.grossAnnualSalary ? `€${profile.grossAnnualSalary.toLocaleString()}` : null],
            ["30% ruling applied", profile.thirtyPercentRulingApplied != null ? String(profile.thirtyPercentRulingApplied) : null],
            ["India work days", profile.workedDaysInIndia != null ? String(profile.workedDaysInIndia) : null],
            ["Indian income", profile.indianIncome != null ? (isTrue(profile.indianIncome) ? `Yes — ~€${profile.indianIncomeAmountEUR?.toLocaleString() ?? "?"}` : "No") : null],
            ["Bonus/RSU", profile.receivedBonus != null ? (isTrue(profile.receivedBonus) ? `Yes — €${profile.bonusAmountEUR?.toLocaleString() ?? "?"}` : "No") : null],
          ]
            .filter(([, v]) => v != null)
            .map(([label, val]) => (
              <div key={String(label)} className="flex justify-between gap-4">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium text-right capitalize">{String(val)}</span>
              </div>
            ))}
        </div>
      </Card>

      {/* Document checklist */}
      <Card className="p-6 space-y-5 card-premium border-0">
        <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Document Checklist
        </h2>
        <p className="text-xs text-muted-foreground">
          Gather these before opening your Belastingdienst filing.
        </p>
        <ul className="space-y-2">
          {docChecklist.map((item) => {
            const relevant =
              item.always ||
              (item.key === "hasRulingDecisionLetter" && isTrue(profile.thirtyPercentRulingApplied)) ||
              (item.key === "indianIncome" && isTrue(profile.indianIncome)) ||
              (item.key === "workedDaysInIndia" && profile.workedDaysInIndia != null && Number(profile.workedDaysInIndia) > 0) ||
              (item.key === "partnerInNL" && isTrue(profile.partnerInNL)) ||
              (item.key === "hasChildren" && isTrue(profile.hasChildren));

            if (!relevant) return null;
            return (
              <li key={item.label} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 w-4 h-4 rounded border-2 border-muted-foreground shrink-0" />
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      <Separator />

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <p>
          Next step: Log in to{" "}
          <a
            href="https://mijn.belastingdienst.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-[var(--primary)] hover:underline"
          >
            Mijn Belastingdienst ↗
          </a>{" "}
          with DigiD and file your return.
        </p>
        <button className="btn-secondary text-sm px-4 py-2" onClick={onReset}>
          Start over
        </button>
      </div>
    </div>
  );
}
