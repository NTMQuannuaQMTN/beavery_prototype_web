"use client";

import React from "react";

interface LoadingIconProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function LoadingIcon({ 
  size = "sm", 
  className = "" 
}: LoadingIconProps) {
  const containerSizes = {
    sm: "w-12 h-4",
    md: "w-16 h-5",
    lg: "w-20 h-6",
  };

  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  // Create 3 dots
  const dots = Array.from({ length: 3 }, (_, i) => i);

  return (
    <div className={`flex items-center justify-center gap-1.5 ${containerSizes[size]} ${className}`}>
      {dots.map((index) => (
        <div
          key={index}
          className={`${dotSizes[size]} rounded-full bg-main animate-bounce`}
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: "0.7s",
          }}
        />
      ))}
    </div>
  );
}

