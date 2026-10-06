const configured = process.env.NEXT_PUBLIC_SITE_URL;

// A live build must know its public address — otherwise the sitemap, canonical links and share images
// would all point at localhost. Fail loudly instead of publishing that.
if (process.env.NODE_ENV === "production" && process.env.ALLOW_LOCALHOST_SITE_URL !== "1" && (!configured || /localhost|127\.0\.0\.1/.test(configured))) {
  throw new Error(`NEXT_PUBLIC_SITE_URL must be the live address (e.g. https://www.yegtextile.com), got "${configured ?? ""}". See YAYIN.md.`);
}

export const SITE_URL = (configured || "http://localhost:3000").replace(/\/$/, "");

export const BRAND = {
  name: "YEG Textile",
  short: "YEG",
  red: "#D80000",
} as const;
