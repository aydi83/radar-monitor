import { createFileRoute } from "@tanstack/react-router";

const BASE = "https://radar.lovable.app";
const PATHS = [
  "/",
  "/about",
  "/privacy",
  "/terms",
  "/auth",
  "/monitor/iphone-price",
  "/monitor/gold-price",
  "/monitor/bitcoin",
  "/monitor/tesla",
  
  "/monitor/usd",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PATHS.map(
          (p) => `  <url><loc>${BASE}${p}</loc></url>`,
        ).join("\n")}\n</urlset>\n`;
        return new Response(body, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
