"use client";

import { Heart } from "lucide-react";
import { useCinemaStore } from "@/lib/cinema-store";

interface VoteButtonProps {
  movieId: string;
}

export function VoteButton({ movieId }: VoteButtonProps) {
  const votes = useCinemaStore((s) => s.votes[movieId] || 0);
  const hasVoted = useCinemaStore((s) => s.userVotes.includes(movieId));
  const toggleVote = useCinemaStore((s) => s.toggleVote);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleVote(movieId);
      }}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
        hasVoted
          ? "bg-primary/15 border-primary/30 text-primary"
          : "bg-secondary border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
      }`}
    >
      <Heart
        className={`w-3.5 h-3.5 transition-all duration-200 ${
          hasVoted ? "fill-primary text-primary scale-110" : ""
        }`}
      />
      <span className="font-[family-name:var(--font-mono)]">{votes}</span>
    </button>
  );
}
