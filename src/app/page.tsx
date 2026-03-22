"use client";

import { useMemo } from "react";
import { useTaxStore } from "@/store/taxStore";
import { questions } from "@/data/questions";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { Summary } from "@/components/Summary";

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
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <span className="font-bold text-foreground text-lg">EasyTax</span>
            <span className="text-muted-foreground text-sm ml-2">for Indian expats in NL</span>
          </div>
          {currentStep > 0 && !isDone && (
            <button
              onClick={reset}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Start over
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Intro headline on first question */}
        {currentStep === 0 && !isDone && (
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              File your Dutch taxes with confidence
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              A guided interview built specifically for Indian expats in the Netherlands.
              Every question comes with the relevant Dutch law, explained in plain English.
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
          <p className="text-center text-xs text-muted-foreground pb-4">
            Your answers are saved locally in your browser. Nothing is sent to any server.
          </p>
        )}
      </div>
    </main>
  );
}
