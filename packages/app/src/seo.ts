import type { ManifestOptions } from "vite-plugin-pwa";

export const APP_NAME = "Awful Todos";
export const APP_DESCRIPTION = "This is an Astro application.";
export const APP_URL = "https://www.todos.conorroberts.com";

/**
 * Defines the default SEO configuration for the website.
 */
export const seoConfig = {
  baseURL: APP_URL,
  description: APP_DESCRIPTION,
  type: "website",
  image: {
    url: "",
    alt: "",
    width: 1200,
    height: 630,
  },
  siteName: APP_NAME,
  twitter: {
    card: "",
  },
};

/**
 * Defines the configuration for PWA webmanifest.
 */
export const manifest: Partial<ManifestOptions> = {
  name: APP_NAME,
  short_name: APP_NAME,
  description: APP_DESCRIPTION,
  theme_color: "#171717",
  background_color: "#171717",
  display: "standalone",
  icons: [
    {
      src: "/favicons/favicon-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/favicons/favicon-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
    {
      src: "/favicons/favicon-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable",
    },
  ],
};
