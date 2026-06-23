"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const shouldUseDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/10 text-white shadow-sm backdrop-blur transition hover:border-cyan-300/60"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
