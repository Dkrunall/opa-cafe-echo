
import React from "react";

const Logo = ({ size = "medium" }: { size?: "small" | "medium" | "large" }) => {
  const sizeClasses = {
    small: "text-xl md:text-2xl",
    medium: "text-2xl md:text-3xl",
    large: "text-3xl md:text-4xl"
  };

  return (
    <div className="flex items-center justify-center">
      <h1 className={`${sizeClasses[size]} font-playfair font-bold text-opa-brown inline-flex items-center`}>
        <span className="text-opa-gold">OPA</span>
        <span className="mx-1">Bar & Cafe</span>
      </h1>
    </div>
  );
};

export default Logo;
