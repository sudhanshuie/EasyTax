"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LawContext } from "@/components/LawContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Question } from "@/data/questions";

interface QuestionCardProps {
  question: Question;
  value: unknown;
  onAnswer: (value: unknown) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function QuestionCard({
  question,
  value,
  onAnswer,
  onNext,
  onBack,
  isFirst,
  isLast,
}: QuestionCardProps) {
  const [localValue, setLocalValue] = useState<string>(
    value != null ? String(value) : ""
  );

  const handleChoice = (choiceValue: string) => {
    setLocalValue(choiceValue);
    onAnswer(choiceValue);
  };

  const handleTextChange = (v: string) => {
    setLocalValue(v);
    onAnswer(v);
  };

  const canProceed = localValue !== "" && localValue !== null;

  return (
    <Card className="w-full max-w-2xl mx-auto p-8 card-premium border-0">
      {/* Question */}
      <div className="space-y-2 mb-8">
        <h2 className="text-xl font-semibold leading-snug text-foreground">
          {question.question}
        </h2>
        {question.subtext && (
          <p className="text-sm text-muted-foreground">{question.subtext}</p>
        )}
      </div>

      {/* Input area */}
      <div className="space-y-3">
        {question.type === "choice" && question.choices && (
          <div className="space-y-2">
            {question.choices.map((choice) => (
              <button
                key={choice.value}
                onClick={() => handleChoice(choice.value)}
                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all cursor-pointer ${
                  localValue === choice.value
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-foreground shadow-[0_0_0_1px_var(--primary)]"
                    : "border-border bg-background hover:border-[var(--primary)]/50 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 shrink-0 transition-all flex items-center justify-center ${
                      localValue === choice.value
                        ? "border-[var(--primary)] bg-[var(--primary)]"
                        : "border-muted-foreground/50"
                    }`}
                  >
                    {localValue === choice.value && (
                      <div className="w-2 h-2 bg-background rounded-full" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{choice.label}</p>
                    {choice.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {choice.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {question.type === "boolean" && (
          <div className="flex gap-3">
            {["Yes", "No"].map((opt) => {
              const v = opt === "Yes" ? "true" : "false";
              return (
                <button
                  key={v}
                  onClick={() => handleChoice(v)}
                  className={`flex-1 py-4 rounded-xl border-2 font-semibold text-[15px] transition-all cursor-pointer ${
                    localValue === v
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-foreground shadow-[0_0_0_1px_var(--primary)]"
                      : "border-border hover:border-[var(--primary)]/50 bg-background"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {(question.type === "number" || question.type === "text") && (
          <input
            type={question.type === "number" ? "number" : "text"}
            value={localValue}
            onChange={(e) => handleTextChange(e.target.value)}
            className="input-premium w-full"
            placeholder={
              question.type === "number" ? "Enter amount in €" : "Type your answer"
            }
          />
        )}

        {question.type === "date" && (
          <input
            type="date"
            value={localValue}
            onChange={(e) => handleTextChange(e.target.value)}
            className="input-premium w-full text-foreground/80"
          />
        )}
      </div>

      {/* Law context drawer */}
      <LawContext question={question} />

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-8 border-t border-border">
        <button
          onClick={onBack}
          disabled={isFirst}
          className={`btn-secondary flex items-center justify-center gap-2 ${isFirst ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`btn-primary flex items-center justify-center gap-2 ${!canProceed ? 'opacity-50 cursor-not-allowed pointer-events-none hover:-translate-y-0' : ''}`}
        >
          {isLast ? "Review" : "Continue"}
          {!isLast && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </Card>
  );
}
