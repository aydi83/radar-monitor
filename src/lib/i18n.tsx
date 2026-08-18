import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "en" | "fr" | "ar";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
];

const dict = {
  en: {
    tagline: "Tell me what you want to monitor, and I'll tell you when it changes.",
    placeholder: "What do you want me to monitor?",
    start: "Start monitoring",
  en: {
    tagline: "Tell me what you want to monitor, and I'll tell you when it changes.",
    placeholder: "What do you want me to monitor?",
    start: "Start monitoring",
    examples: "Try an example",
    ex1: "Monitor iPhone 16 price",
    ex2: "Monitor Tesla",
    ex3: "Monitor electric car prices",

    exTopic: "Topic",
    understood: "I understood your request",
    whatMonitor: "What I will monitor",
    condition: "Alert condition",
    sources: "Sources to watch",
    edit: "Edit request",
    active: "Monitoring active",
    checkedAgo: "Last check: just now",
    noChange: "No important change",
    noChangeSub: "Everything looks stable. I'll keep watching.",
    changeTitle: "Important change detected",
    before: "Before",
    after: "After",
    whatChanged: "What changed",
    source: "Source",
    useful: "Was this useful?",
    yes: "Useful",
    no: "Not useful",
    thanks: "Thanks — noted.",
    demo: "Demo state",
    demoStable: "Stable",
    demoChange: "Change",
    newRequest: "New request",
    language: "Language",
    priceDrop: "Price dropped by 15%",
  },
  fr: {
    tagline: "Dites-moi ce que vous voulez surveiller, je vous préviens quand ça change.",
    placeholder: "Que voulez-vous que je surveille ?",
    start: "Démarrer la surveillance",
    examples: "Exemples",
    exProduct: "Prix d'un produit",
    exCompany: "Entreprise",
    exTopic: "Sujet",
    understood: "J'ai compris votre demande",
    whatMonitor: "Ce que je vais surveiller",
    condition: "Condition d'alerte",
    sources: "Sources surveillées",
    edit: "Modifier la demande",
    active: "Surveillance active",
    checkedAgo: "Dernière vérification : à l'instant",
    noChange: "Aucun changement important",
    noChangeSub: "Tout est stable. Je continue à surveiller.",
    changeTitle: "Changement important détecté",
    before: "Avant",
    after: "Après",
    whatChanged: "Ce qui a changé",
    source: "Source",
    useful: "Était-ce utile ?",
    yes: "Utile",
    no: "Pas utile",
    thanks: "Merci — c'est noté.",
    demo: "État de démo",
    demoStable: "Stable",
    demoChange: "Changement",
    newRequest: "Nouvelle demande",
    language: "Langue",
    priceDrop: "Le prix a baissé de 15 %",
  },
  ar: {
    tagline: "أخبرني بما تريد مراقبته، وسأخبرك عندما يتغيّر.",
    placeholder: "ما الذي تريد مني مراقبته؟",
    start: "ابدأ المراقبة",
    examples: "أمثلة",
    exProduct: "سعر منتج",
    exCompany: "شركة",
    exTopic: "موضوع",
    understood: "لقد فهمت طلبك",
    whatMonitor: "ما سأراقبه",
    condition: "شرط التنبيه",
    sources: "المصادر المراقَبة",
    edit: "تعديل الطلب",
    active: "المراقبة نشطة",
    checkedAgo: "آخر فحص: الآن",
    noChange: "لا يوجد تغيير مهم",
    noChangeSub: "كل شيء مستقر. سأواصل المراقبة.",
    changeTitle: "تم رصد تغيير مهم",
    before: "قبل",
    after: "بعد",
    whatChanged: "ما الذي تغيّر",
    source: "المصدر",
    useful: "هل كان هذا مفيدًا؟",
    yes: "مفيد",
    no: "غير مفيد",
    thanks: "شكرًا — تم التسجيل.",
    demo: "حالة العرض",
    demoStable: "مستقر",
    demoChange: "تغيير",
    newRequest: "طلب جديد",
    language: "اللغة",
    priceDrop: "انخفض السعر بنسبة 15٪",
  },
} as const;

export type TKey = keyof (typeof dict)["en"];

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: TKey) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => dict.en[k],
});

const STORAGE_KEY = "radar.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always default to English, ignoring browser/device locale.
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved === "en" || saved === "fr" || saved === "ar") setLangState(saved);
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ lang, setLang, t: (k: TKey) => dict[lang][k] as string }),
    [lang, setLang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
