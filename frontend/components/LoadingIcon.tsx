"use client";

import React from "react";

interface LoadingIconProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingIcon({ 
  size = "md", 
  className = "" 
}: LoadingIconProps) {
  const containerSizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  // Create 3 dots that will swirl
  const dots = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className={`relative ${containerSizes[size]} ${className}`}>
      {/* Swirling Dots Animation */}
      {dots.map((index) => {
        const delay = index * 0.2;
        const radius = size === "sm" ? 20 : size === "md" ? 28 : 40;
        
        return (
          <div
            key={index}
            className={`absolute ${dotSizes[size]} rounded-full animate-swirl`}
            style={{
              backgroundColor: "var(--main)",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              animationDelay: `${delay}s`,
              opacity: 0.7 + (index * 0.1),
              boxShadow: `0 0 ${size === "sm" ? "4px" : size === "md" ? "6px" : "8px"} var(--main)`,
              "--swirl-radius": `${radius}px`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}

