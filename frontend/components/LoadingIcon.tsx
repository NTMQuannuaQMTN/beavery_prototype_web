"use client";

import React from "react";

interface LoadingIconProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function LoadingIcon({ 
  size = "md", 
  text,
  className = "" 
}: LoadingIconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const dotSizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* Animated Spinner with Gradient */}
      <div className="relative">
        {/* Outer spinning ring */}
        <div
          className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin`}
          style={{
            borderTopColor: "var(--main)",
            borderRightColor: "var(--main)",
          }}
        />
        
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`${dotSizeClasses[size]} rounded-full bg-main animate-pulse-dot`}
          />
        </div>
      </div>

      {/* Optional text */}
      {text && (
        <p className={`text-graytext ${textSizeClasses[size]} font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
}

