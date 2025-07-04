
import React from "react";

const Logo = ({ size = "medium" }: { size?: "small" | "medium" | "large" }) => {
  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-16 h-16", 
    large: "w-20 h-20"
  };

  return (
    <div className="flex items-center justify-center">
      <img 
        src="/lovable-uploads/7f7969c5-784b-4fc5-b457-2b7b2d559f9f.png" 
        alt="Logo" 
        className={`${sizeClasses[size]} object-contain`}
      />
    </div>
  );
};

export default Logo;
