"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "bn";
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "en",
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("bn");
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
