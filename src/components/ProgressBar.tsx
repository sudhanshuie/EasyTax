"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const STAGE_LABELS = [
  "Your Profile",
  "Personal & Family",
  "Employment & Income",
  "30% Ruling",
  "Box 3 — Assets",
  "Home & Housing",
];

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stageLabel: string;
  stage: number;
}

export function ProgressBar({ currentStep, totalSteps, stageLabel, stage }: ProgressBarProps) {
  const percent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="w-full space-y-3">
      {/* Stage pills */}
      <div className="flex gap-2 flex-wrap">
        {STAGE_LABELS.map((label, i) => (
          <Badge
            key={i}
            variant={i === stage ? "default" : i < stage ? "secondary" : "outline"}
            className="text-xs"
          >
            {i < stage ? "✓ " : ""}{label}
          </Badge>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{stageLabel}</span>
          <span>{percent}% complete</span>
        </div>
        <Progress value={percent} className="h-1.5" />
      </div>
    </div>
  );
}
