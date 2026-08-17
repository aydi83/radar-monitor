import type { Lang } from "./i18n";

export type RadarKind = "price" | "company" | "topic";

export interface RadarPlan {
  raw: string;
  kind: RadarKind;
  subject: string;
  target: string;
  condition: string;
  sources: string[];
  detectedLang: Lang;
}

const priceWords = ["price", "prix", "cost", "coût", "سعر", "أسعار", "تخفيض", "deal", "promo"];
const companyWords = [
  "company",
  "entreprise",
  "société",
  "startup",
  "شركة",
  "مؤسسة",
  "brand",
  "marque",
];

function detectLang(text: string): Lang {
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  if (/\b(prix|surveiller|entreprise|société|marque|actualité|baisse)\b/i.test(text)) return "fr";
  return "en";
}

function hasWord(text: string, words: string[]) {
  const lower = text.toLowerCase();
  return words.some((w) => lower.includes(w));
}

function extractSubject(text: string): string {
  const cleaned = text
    .replace(/^(monitor|watch|track|surveille[rz]?|suivre|راقب|تابع)\s+/i, "")
    .replace(/\b(the|le|la|les|de|du|des|a|an)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > 0 ? cleaned : text.trim();
}

const copy: Record<
  Lang,
  Record<RadarKind, { target: (s: string) => string; condition: string; sources: string[] }>
> = {
  en: {
    price: {
      target: (s) => `Price of “${s}”`,
      condition: "Alert me when the price drops by 5% or more, or goes back in stock.",
      sources: ["Official product page", "Major retailers", "Price history feeds"],
    },
    company: {
      target: (s) => `Public activity of “${s}”`,
      condition: "Alert me on announcements, funding, hiring or leadership changes.",
      sources: ["Company website & newsroom", "Business registries", "Reputable news outlets"],
    },
    topic: {
      target: (s) => `Updates about “${s}”`,
      condition: "Alert me when something significantly new or contradictory appears.",
      sources: ["Reference websites", "Specialised publications", "Official statements"],
    },
  },
  fr: {
    price: {
      target: (s) => `Le prix de « ${s} »`,
      condition: "Alertez-moi si le prix baisse de 5 % ou plus, ou revient en stock.",
      sources: ["Page produit officielle", "Grands revendeurs", "Historiques de prix"],
    },
    company: {
      target: (s) => `L'activité publique de « ${s} »`,
      condition: "Alertez-moi en cas d'annonce, de levée de fonds ou de changement de direction.",
      sources: ["Site & salle de presse", "Registres d'entreprises", "Médias fiables"],
    },
    topic: {
      target: (s) => `Les nouveautés sur « ${s} »`,
      condition: "Alertez-moi lorsqu'une information vraiment nouvelle apparaît.",
      sources: ["Sites de référence", "Publications spécialisées", "Communications officielles"],
    },
  },
  ar: {
    price: {
      target: (s) => `سعر «${s}»`,
      condition: "نبّهني إذا انخفض السعر بنسبة 5٪ أو أكثر، أو عاد المنتج للتوفر.",
      sources: ["صفحة المنتج الرسمية", "كبار المتاجر", "سجلات تاريخ الأسعار"],
    },
    company: {
      target: (s) => `نشاط «${s}» العلني`,
      condition: "نبّهني عند أي إعلان أو تمويل أو تغيير في الإدارة.",
      sources: ["الموقع الرسمي والأخبار", "السجلات التجارية", "وسائل إعلام موثوقة"],
    },
    topic: {
      target: (s) => `المستجدات حول «${s}»`,
      condition: "نبّهني عند ظهور معلومة جديدة أو مناقضة بشكل واضح.",
      sources: ["مواقع مرجعية", "منشورات متخصصة", "بيانات رسمية"],
    },
  },
};

export function parseRequest(raw: string, uiLang: Lang): RadarPlan {
  const detectedLang = detectLang(raw);
  const kind: RadarKind = hasWord(raw, priceWords)
    ? "price"
    : hasWord(raw, companyWords)
      ? "company"
      : "topic";
  const subject = extractSubject(raw);
  const c = copy[uiLang][kind];
  return {
    raw,
    kind,
    subject,
    target: c.target(subject.length > 60 ? subject.slice(0, 60) + "…" : subject),
    condition: c.condition,
    sources: c.sources,
    detectedLang,
  };
}
