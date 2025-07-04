
import React from "react";

const Logo = ({ size = "medium" }: { size?: "small" | "medium" | "large" | "xlarge" }) => {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24", 
    large: "w-32 h-32",
    xlarge: "w-40 h-40"
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
