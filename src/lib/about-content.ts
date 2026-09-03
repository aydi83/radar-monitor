import type { Lang } from "./i18n";

/**
 * Page 2 copy. Small, self-contained map so the About page reacts to the
 * language selector without introducing a large translation system.
 */
export interface AboutCopy {
  aboutTitle: string;
  aboutParas: string[];
  founder: string;
  businessTitle: string;
  businessIntro: string;
  businessItems: string[];
  businessContact: string;
  contactTitle: string;
  contactItems: { title: string; desc: string }[];
}

export const ABOUT_COPY: Record<Lang, AboutCopy> = {
  en: {
    aboutTitle: "About RADAR",
    aboutParas: [
      "RADAR is a simple monitoring service. You choose what matters to you — a product, a market, a topic, a company, a price or any other public information — and RADAR keeps watching it for you.",
      "RADAR monitors selected products, markets, topics, companies, prices and other public information sources. It stores a snapshot of the page you choose, re-checks it, and compares the meaningful content over time.",
      "The core idea is deliberately narrow: detect meaningful change instead of overwhelming you with thousands of links. RADAR is not a search engine or a news feed. It stays quiet while nothing important happens, and speaks only when something really changed — showing what it was before, what it is now, the source and the time.",
      "The basic experience is free. Price and market information shown by RADAR is informational only and is not financial advice.",
    ],
    founder: "RADAR was founded and created by AYDI ADEL in 2026.",
    businessTitle: "RADAR for businesses and partners",
    businessIntro:
      "RADAR is free for users and will stay free: there are no subscriptions, no payment systems and no paid user plans. Commercial value is built on the business side.",
    businessItems: [
      "Business partnerships — working with retailers, publishers and platforms whose public information is worth monitoring.",
      "Market monitoring — following public market and category movements relevant to a business.",
      "Product & price intelligence — structured awareness of public price and availability changes.",
      "Future advertising opportunities — clean, non-intrusive placements once RADAR reaches scale.",
      "Referral and affiliate partnerships — sending qualified, intent-driven traffic to partners.",
      "Other commercial collaborations — data, integration and co-marketing discussions.",
    ],
    businessContact: "For any of the above, write to",
    contactTitle: "Contact RADAR",
    contactItems: [
      { title: "General inquiries", desc: "Questions about RADAR and how it works." },
      { title: "Business & Partnerships", desc: "Partnerships, referrals and commercial collaboration." },
      { title: "Feedback / Report a problem", desc: "Bugs, wrong results or suggestions." },
    ],
  },
  fr: {
    aboutTitle: "À propos de RADAR",
    aboutParas: [
      "RADAR est un service de surveillance simple. Vous choisissez ce qui compte pour vous — un produit, un marché, un sujet, une entreprise, un prix ou toute autre information publique — et RADAR le surveille pour vous.",
      "RADAR surveille des produits, marchés, sujets, entreprises, prix et autres sources d’information publiques. Il enregistre un instantané de la page choisie, la revérifie et compare le contenu utile dans le temps.",
      "L’idée est volontairement étroite : détecter un changement significatif plutôt que vous noyer sous des milliers de liens. RADAR n’est ni un moteur de recherche ni un fil d’actualité. Il reste silencieux tant que rien d’important n’arrive, et ne parle que lorsqu’un vrai changement survient — avec l’avant, l’après, la source et l’heure.",
      "L’expérience de base est gratuite. Les informations de prix et de marché affichées par RADAR sont purement informatives et ne constituent pas un conseil financier.",
    ],
    founder: "RADAR a été fondé et créé par AYDI ADEL en 2026.",
    businessTitle: "RADAR pour les entreprises et partenaires",
    businessIntro:
      "RADAR est gratuit pour les utilisateurs et le restera : pas d’abonnements, pas de paiements, pas d’offres payantes. La valeur commerciale se construit du côté entreprise.",
    businessItems: [
      "Partenariats commerciaux — avec des distributeurs, éditeurs et plateformes dont l’information publique mérite d’être suivie.",
      "Veille de marché — suivi des mouvements publics d’un marché ou d’une catégorie.",
      "Intelligence produit & prix — vision structurée des changements publics de prix et de disponibilité.",
      "Opportunités publicitaires futures — emplacements sobres et non intrusifs à l’échelle.",
      "Partenariats de référencement et d’affiliation — trafic qualifié envoyé aux partenaires.",
      "Autres collaborations commerciales — données, intégration et co-marketing.",
    ],
    businessContact: "Pour tout cela, écrivez à",
    contactTitle: "Contacter RADAR",
    contactItems: [
      { title: "Demandes générales", desc: "Questions sur RADAR et son fonctionnement." },
      { title: "Business & Partenariats", desc: "Partenariats, affiliation et collaborations commerciales." },
      { title: "Retour / Signaler un problème", desc: "Bugs, résultats erronés ou suggestions." },
    ],
  },
  ar: {
    aboutTitle: "عن RADAR",
    aboutParas: [
      "RADAR خدمة مراقبة بسيطة. تختار ما يهمّك — منتجاً أو سوقاً أو موضوعاً أو شركة أو سعراً أو أي معلومة عامة أخرى — ويتابعه RADAR نيابةً عنك.",
      "يراقب RADAR المنتجات والأسواق والمواضيع والشركات والأسعار وغيرها من مصادر المعلومات العامة. يحفظ نسخة من الصفحة التي تختارها، ثم يعيد فحصها ويقارن المحتوى المهم عبر الوقت.",
      "الفكرة الأساسية محدودة عن قصد: رصد التغيّر المهم بدل إغراقك بآلاف الروابط. RADAR ليس محرك بحث ولا موجز أخبار. يبقى صامتاً ما دام لا شيء مهم يحدث، ويتحدث فقط عند حدوث تغيّر حقيقي — مع ما كان، وما أصبح، والمصدر والوقت.",
      "التجربة الأساسية مجانية. معلومات الأسعار والأسواق في RADAR إعلامية فقط وليست نصيحة مالية.",
    ],
    founder: "تأسس RADAR وأنشأه AYDI ADEL في 2026.",
    businessTitle: "RADAR للشركات والشركاء",
    businessIntro:
      "RADAR مجاني للمستخدمين وسيبقى كذلك: لا اشتراكات ولا مدفوعات ولا خطط مدفوعة. القيمة التجارية تُبنى من جهة الأعمال.",
    businessItems: [
      "شراكات تجارية — مع المتاجر والناشرين والمنصّات التي تستحق معلوماتها العامة المتابعة.",
      "مراقبة السوق — متابعة تحركات السوق والفئات العامة ذات الصلة.",
      "ذكاء المنتجات والأسعار — وعي منظّم بتغيّرات الأسعار والتوفر العامة.",
      "فرص إعلانية مستقبلية — مساحات نظيفة وغير مزعجة عند بلوغ الحجم المناسب.",
      "شراكات الإحالة والتسويق بالعمولة — إرسال زيارات مؤهّلة إلى الشركاء.",
      "تعاونات تجارية أخرى — بيانات وتكامل وتسويق مشترك.",
    ],
    businessContact: "لأي مما سبق، راسلنا على",
    contactTitle: "تواصل مع RADAR",
    contactItems: [
      { title: "استفسارات عامة", desc: "أسئلة حول RADAR وطريقة عمله." },
      { title: "الأعمال والشراكات", desc: "الشراكات والإحالات والتعاون التجاري." },
      { title: "ملاحظات / الإبلاغ عن مشكلة", desc: "أخطاء أو نتائج غير صحيحة أو اقتراحات." },
    ],
  },
};
