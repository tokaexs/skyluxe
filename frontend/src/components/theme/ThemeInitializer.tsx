"use client";

import { useEffect } from "react";
import { useSkyLuxeStore } from "@/store/skyluxeStore";

export default function ThemeInitializer() {
  const { setTheme } = useSkyLuxeStore();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("skyluxe-theme") as "dark" | "light" | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
      }
    }
  }, [setTheme]);

  return null;
}
