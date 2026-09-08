import type { TKey } from "./i18n";

export interface StarterItem {
  /** Stable slug, also used for the public discovery pages. */
  slug: string;
  label: string;
  /** Natural-language request pre-filled for the user. */
  request: string;
  /** Suggested public page to watch. The user can always change it. */
  url: string;
}

export interface StarterCategory {
  id: string;
  labelKey: TKey;
  items: StarterItem[];
}

export const STARTER_CATEGORIES: StarterCategory[] = [
  {
    id: "technology",
    labelKey: "catTech",
    items: [
      {
        slug: "iphone",
        label: "iPhone",
        request: "Monitor iPhone price",
        url: "https://www.apple.com/shop/buy-iphone",
      },
      {
        slug: "samsung-galaxy",
        label: "Samsung Galaxy",
        request: "Monitor Samsung Galaxy price",
        url: "https://www.samsung.com/us/smartphones/",
      },
      {
        slug: "google-pixel",
        label: "Google Pixel",
        request: "Monitor Google Pixel price",
        url: "https://store.google.com/category/phones",
      },
      {
        slug: "microsoft-surface",
        label: "Microsoft Surface",
        request: "Monitor Microsoft Surface price",
        url: "https://www.microsoft.com/en-us/surface",
      },
    ],
  },
  {
    id: "metals",
    labelKey: "catMetals",
    items: [
      { slug: "gold", label: "Gold", request: "Monitor gold price", url: "https://www.kitco.com/price/precious-metals" },
      { slug: "silver", label: "Silver", request: "Monitor silver price", url: "https://www.kitco.com/price/precious-metals" },
      { slug: "platinum", label: "Platinum", request: "Monitor platinum price", url: "https://www.kitco.com/price/precious-metals" },
      { slug: "copper", label: "Copper", request: "Monitor copper price", url: "https://www.kitco.com/price/base-metals" },
    ],
  },
  {
    id: "cars",
    labelKey: "catCars",
    items: [
      { slug: "tesla", label: "Tesla", request: "Monitor Tesla prices", url: "https://www.tesla.com/models/design" },
      { slug: "toyota", label: "Toyota", request: "Monitor Toyota prices", url: "https://www.toyota.com/all-vehicles/" },
      { slug: "bmw", label: "BMW", request: "Monitor BMW prices", url: "https://www.bmwusa.com/all-vehicles.html" },
      { slug: "mercedes-benz", label: "Mercedes-Benz", request: "Monitor Mercedes-Benz prices", url: "https://www.mbusa.com/en/all-vehicles" },
    ],
  },
  {
    id: "currencies",
    labelKey: "catCurrencies",
    items: [
      { slug: "usd", label: "USD", request: "Monitor the US dollar rate", url: "https://www.x-rates.com/table/?from=USD" },
      { slug: "eur", label: "EUR", request: "Monitor the euro rate", url: "https://www.x-rates.com/table/?from=EUR" },
      { slug: "gbp", label: "GBP", request: "Monitor the British pound rate", url: "https://www.x-rates.com/table/?from=GBP" },
      { slug: "jpy", label: "JPY", request: "Monitor the Japanese yen rate", url: "https://www.x-rates.com/table/?from=JPY" },
      { slug: "cad", label: "CAD", request: "Monitor the Canadian dollar rate", url: "https://www.x-rates.com/table/?from=CAD" },
      { slug: "aud", label: "AUD", request: "Monitor the Australian dollar rate", url: "https://www.x-rates.com/table/?from=AUD" },
    ],
  },
  {
    id: "crypto",
    labelKey: "catCrypto",
    items: [
      { slug: "bitcoin", label: "Bitcoin (BTC)", request: "Monitor Bitcoin price", url: "https://www.coindesk.com/price/bitcoin" },
      { slug: "ethereum", label: "Ethereum (ETH)", request: "Monitor Ethereum price", url: "https://www.coindesk.com/price/ethereum" },
      { slug: "solana", label: "Solana (SOL)", request: "Monitor Solana price", url: "https://www.coindesk.com/price/solana" },
    ],
  },
  {
    id: "brands",
    labelKey: "catBrands",
    items: [
      { slug: "nike", label: "Nike", request: "Monitor Nike offers", url: "https://www.nike.com/w/sale-3yaep" },
      { slug: "adidas", label: "Adidas", request: "Monitor Adidas offers", url: "https://www.adidas.com/us/sale" },
      { slug: "amazon", label: "Amazon", request: "Monitor Amazon deals", url: "https://www.amazon.com/gp/goldbox" },
      { slug: "apple", label: "Apple", request: "Monitor Apple offers", url: "https://www.apple.com/shop/refurbished" },
      { slug: "samsung", label: "Samsung", request: "Monitor Samsung offers", url: "https://www.samsung.com/us/offers/" },
    ],
  },
];

export const ALL_STARTER_ITEMS: StarterItem[] = STARTER_CATEGORIES.flatMap((c) => c.items);

export function findStarter(slug: string): StarterItem | undefined {
  return ALL_STARTER_ITEMS.find((i) => i.slug === slug);
}

/** The small set of genuinely useful public discovery pages we ship in 1.0. */
export const DISCOVERY_SLUGS = ["iphone", "gold", "bitcoin", "tesla", "brent-crude", "usd"] as const;
