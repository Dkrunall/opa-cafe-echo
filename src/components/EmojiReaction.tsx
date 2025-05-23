
import React from "react";
import { EMOJI_REACTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface EmojiReactionProps {
  selectedReaction: string | undefined;
  onChange: (reaction: string) => void;
}

const EmojiReaction = ({ selectedReaction, onChange }: EmojiReactionProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 animate-fade-in">
      {EMOJI_REACTIONS.map((reaction) => (
        <button
          key={reaction.value}
          type="button"
          onClick={() => onChange(reaction.value)}
          className={cn(
            "flex flex-col items-center p-3 rounded-lg transition-all transform hover:scale-110",
            selectedReaction === reaction.value
              ? "bg-opa-green bg-opacity-20 border-2 border-opa-green"
              : "bg-white hover:bg-opa-cream border-2 border-transparent"
          )}
        >
          <span className="text-3xl mb-1">{reaction.emoji}</span>
          <span className="text-xs font-medium">{reaction.label}</span>
        </button>
      ))}
    </div>
  );
};

export default EmojiReaction;
