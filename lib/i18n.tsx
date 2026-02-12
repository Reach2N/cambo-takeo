"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { translations, type TranslationKey } from "./translations";

export type Locale = "km" | "en" | "zh";

interface I18nContext {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nCtx = createContext<I18nContext>({
  locale: "km",
  setLocale: () => {},
  t: (key) => translations[key]?.en ?? key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("km");

  const t = useCallback(
    (key: TranslationKey) => {
      const entry = translations[key];
      if (!entry) return key;
      if (locale === "km") return entry.km;
      if (locale === "zh") return (entry as { zh?: string }).zh ?? entry.en;
      return entry.en;
    },
    [locale]
  );

  return (
    <I18nCtx.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nCtx.Provider>
  );
}

export function useI18n() {
  return useContext(I18nCtx);
}

export function currencySymbol(currency: "USD" | "KHR" = "USD") {
  return currency === "USD" ? "$" : "៛";
}
