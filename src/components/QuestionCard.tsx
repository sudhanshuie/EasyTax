"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card className="w-full max-w-2xl mx-auto p-8 shadow-sm">
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
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                  localValue === choice.value
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-background hover:border-primary/40 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all ${
                      localValue === choice.value
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  />
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
                  className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm transition-all ${
                    localValue === v
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border hover:border-primary/40"
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
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none text-foreground text-sm transition-colors"
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
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none text-foreground text-sm transition-colors"
          />
        )}
      </div>

      {/* Law context drawer */}
      <LawContext question={question} />

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-border">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={isFirst}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="gap-2"
        >
          {isLast ? "Finish" : "Continue"}
          {!isLast && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </Card>
  );
}
