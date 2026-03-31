"use client";

import { useMemo } from "react";
import { useTaxStore } from "@/store/taxStore";
import { questions } from "@/data/questions";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { Summary } from "@/components/Summary";
import { ShieldCheck } from "lucide-react";

export default function Home() {
  const { profile, currentStep, updateProfile, nextStep, prevStep, reset } =
    useTaxStore();

  // Filter to only questions that should be shown given current profile state
  const visibleQuestions = useMemo(
    () =>
      questions.filter((q) =>
        q.showIf ? q.showIf(profile as unknown as Record<string, unknown>) : true
      ),
    [profile]
  );

  const isDone = currentStep >= visibleQuestions.length;
  const currentQuestion = visibleQuestions[currentStep];

  const handleAnswer = (value: unknown) => {
    if (!currentQuestion) return;
    updateProfile({ [currentQuestion.profileKey]: value });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center pt-8 pb-12">
      {/* Header */}
      <header className="w-full max-w-2xl px-4 flex items-center justify-between mb-8 sm:mb-12">
        <div className="flex items-center gap-2 text-foreground">
          <ShieldCheck className="w-6 h-6 text-[var(--primary)]" />
          <span className="font-bold text-lg tracking-tight">EasyTax</span>
        </div>
        {currentStep > 0 && !isDone && (
          <button
            onClick={reset}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Start over
          </button>
        )}
      </header>

      <div className="w-full max-w-2xl px-4 space-y-8">
        {/* Intro headline on first question */}
        {currentStep === 0 && !isDone && (
          <div className="text-center space-y-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              File your Dutch taxes with certainty
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto">
              The smart, guided tax assistant engineered specifically for Indian expats in the Netherlands.
            </p>
          </div>
        )}

        {/* Progress bar */}
        {!isDone && currentQuestion && (
          <ProgressBar
            currentStep={currentStep}
            totalSteps={visibleQuestions.length}
            stageLabel={currentQuestion.stageLabel}
            stage={currentQuestion.stage}
          />
        )}

        {/* Main content */}
        {isDone ? (
          <Summary profile={profile} onReset={reset} />
        ) : currentQuestion ? (
          <QuestionCard
            question={currentQuestion}
            value={profile[currentQuestion.profileKey as keyof typeof profile]}
            onAnswer={handleAnswer}
            onNext={nextStep}
            onBack={prevStep}
            isFirst={currentStep === 0}
            isLast={currentStep === visibleQuestions.length - 1}
          />
        ) : null}

        {/* Privacy note */}
        {!isDone && (
          <p className="text-center text-xs text-muted-foreground/60 pt-4 cursor-default">
            Your data never leaves your device. We use local storage to save your progress.
          </p>
        )}
      </div>
    </main>
  );
}
