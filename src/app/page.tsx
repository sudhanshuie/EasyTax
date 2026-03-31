"use client";

import { useMemo, useEffect, useState } from "react";
import { useTaxStore } from "@/store/taxStore";
import { questions } from "@/data/questions";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { Summary } from "@/components/Summary";
import { ShieldCheck, FileText, Bot } from "lucide-react";
import { BeamsBackground } from "@/components/ui/beams-background";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { profile, currentStep, hasStarted, updateProfile, nextStep, prevStep, reset, startReport } = useTaxStore();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null; // Avoid hydration mismatch

  if (!hasStarted) {
    return (
      <BeamsBackground intensity="strong">
        <div className="flex flex-col items-center justify-center gap-8 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-2"
          >
            <ShieldCheck className="w-10 h-10 text-[var(--primary)]" />
            <span className="font-bold text-3xl tracking-tight text-white">EasyTax</span>
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tighter max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            File your Dutch taxes <br className="hidden md:block" /> with certainty
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-white/70 tracking-tight max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The free, AI-powered tax assistant engineered for everyone—whether you're a local or an expat.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Button 
                onClick={startReport} 
                className="w-full h-14 text-lg gap-2 cursor-pointer"
                size="lg"
            >
                <FileText className="w-5 h-5" />
                Start Tax Report
            </Button>
            <Button 
                variant="outline"
                className="w-full h-14 text-lg gap-2 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white cursor-pointer"
                size="lg"
                onClick={() => alert("AI Agent integration coming soon!")}
            >
                <Bot className="w-5 h-5" />
                Ask AI Agent
            </Button>
          </motion.div>
        </div>
      </BeamsBackground>
    );
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center pt-8 pb-12">
      {/* Header */}
      <header className="w-full max-w-2xl px-4 flex items-center justify-between mb-8 sm:mb-12">
        <div className="flex items-center gap-2 text-foreground cursor-pointer" onClick={reset}>
          <ShieldCheck className="w-6 h-6 text-[var(--primary)]" />
          <span className="font-bold text-lg tracking-tight">EasyTax</span>
        </div>
        {hasStarted && (
          <button
            onClick={reset}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Start over
          </button>
        )}
      </header>

      <div className="w-full max-w-2xl px-4 space-y-8">
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
