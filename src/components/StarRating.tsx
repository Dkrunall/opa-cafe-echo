
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onChange: (rating: number) => void;
  readOnly?: boolean;
  size?: "small" | "medium" | "large";
}

const StarRating = ({ 
  rating, 
  onChange, 
  readOnly = false, 
  size = "medium" 
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-3xl"
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onChange(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          disabled={readOnly}
          className={cn(
            sizeClasses[size],
            "focus:outline-none transition-colors duration-200",
            { "cursor-default": readOnly, "cursor-pointer": !readOnly }
          )}
          aria-label={`Rate ${star} stars`}
        >
          <span className={`${(hoverRating || rating) >= star ? "text-opa-gold" : "text-gray-300"}`}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

export default StarRating;
