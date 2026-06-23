"use client";

import { Languages } from "lucide-react";

type LanguageToggleProps = {
  locale: "en" | "vi";
  onChange: (locale: "en" | "vi") => void;
};

export function LanguageToggle({ locale, onChange }: LanguageToggleProps) {
  return (
    <div className="flex h-9 items-center gap-1 rounded-full border border-white/10 bg-white/10 px-1 text-xs font-semibold text-white shadow-sm backdrop-blur">
      <Languages size={15} className="ml-2 text-cyan-300" />
      {(["en", "vi"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`h-8 rounded-full px-3 transition ${
            locale === item
              ? "bg-cyan-300 text-slate-950"
              : "text-white/60 hover:text-white"
          }`}
          aria-pressed={locale === item}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
