"use client";

import { useEffect, useState, useRef } from "react";

type ToastType = "error" | "success" | "warning" | "info";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
  type?: ToastType;
}

export default function Toast({
  message,
  isVisible,
  onClose,
  duration = 2000,
  type = "error",
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only start timer when toast becomes visible
    if (!isVisible) {
      return;
    }

    // Reset any existing timeouts
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    // Start exit animation after duration
    exitTimeoutRef.current = setTimeout(() => {
      setIsExiting(true);
      // Wait for exit animation to complete before calling onClose
      closeTimeoutRef.current = setTimeout(() => {
        onClose();
      }, 300); // Match animation duration
    }, duration);

    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, [isVisible, duration, onClose]);

  if (!isVisible && !isExiting) return null;

  const getIcon = () => {
    switch (type) {
      case "error":
        return (
          <ion-icon 
            name="close-circle" 
            style={{ fontSize: "18px", display: "block", color: "#ef4444" }}
          ></ion-icon>
        );
      case "success":
        return (
          <ion-icon 
            name="checkmark-circle" 
            style={{ fontSize: "18px", display: "block", color: "#10b981" }}
          ></ion-icon>
        );
      case "warning":
        return (
          <ion-icon 
            name="warning" 
            style={{ fontSize: "18px", display: "block", color: "#f59e0b" }}
          ></ion-icon>
        );
      case "info":
        return (
          <ion-icon 
            name="information-circle" 
            style={{ fontSize: "18px", display: "block", color: "#3b82f6" }}
          ></ion-icon>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed top-4 left-1/2 z-50 ${
        isExiting ? "animate-slide-up" : "animate-slide-down"
      }`}
    >
      <div className="rounded-full bg-slate-900 border border-red-200 px-4 py-3 text-[14px] font-medium text-white shadow-lg flex items-center gap-2">
        {getIcon()}
        {message}
      </div>
    </div>
  );
}

