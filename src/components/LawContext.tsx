"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, MapPin, Scale } from "lucide-react";
import type { Question } from "@/data/questions";

interface LawContextProps {
  question: Question;
}

export function LawContext({ question }: LawContextProps) {
  const [open, setOpen] = useState(false);
  const { lawContext } = question;

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <BookOpen className="w-4 h-4" />
        <span>Why are we asking this?</span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="mt-3 rounded-xl border border-border bg-muted/40 p-4 space-y-4 text-sm">
          {/* Plain English */}
          <div className="flex gap-3">
            <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">?</span>
            </div>
            <p className="text-foreground leading-relaxed">{lawContext.plainEnglish}</p>
          </div>

          {/* Law article */}
          <div className="flex gap-3">
            <Scale className="mt-0.5 shrink-0 w-4 h-4 text-amber-500" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Legal basis
              </p>
              <p className="text-foreground">{lawContext.lawArticle}</p>
              {lawContext.officialLink && (
                <a
                  href={lawContext.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                >
                  View official source ↗
                </a>
              )}
            </div>
          </div>

          {/* Where to find */}
          <div className="flex gap-3">
            <MapPin className="mt-0.5 shrink-0 w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Where to find it
              </p>
              <p className="text-foreground">{lawContext.whereToFind}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
