"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center p-2 justify-center rounded-lg transition-all dark:hover:bg-graytext/50"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <ion-icon name="sunny" style={{ fontSize: "20px", display: "block" }}></ion-icon>
      ) : (
        <ion-icon name="moon" style={{ fontSize: "20px", display: "block" }}></ion-icon>
      )}
    </button>
  );
}

