export type OptimizedImageOptions = {
  anim?: boolean;
  background?: string;
  blur?: number;
  brightness?: number;
  compression?: "fast"; // faster compression = larger file size
  contrast?: number;
  dpr?: number;
  fit?: "scale-down" | "contain" | "cover" | "crop" | "pad";
  format?: "webp" | "avif" | "json";
  gamma?: number;
  width?: number;
  height?: number;
  metadata?: "keep" | "copyright" | "none";
  quality?: number;
  rotate?: number;
  sharpen?: number;
};

export const cloudflareImageUrlRegex = new RegExp(/https:\/\/imagedelivery\.net\/Fxj2hPAkUf2rzT--029-kQ.+\/public/);

/**
 * Will only operate on images that have been uploaded via cloudflare images
 */
export const getOptimizedImageUrl = (imageUrl: string, options: OptimizedImageOptions) => {
  if (!cloudflareImageUrlRegex.test(imageUrl)) {
    return imageUrl;
  }

  const params = new Map<string, string>();

  Object.entries(options).forEach(([key, val]) => {
    // Coerce all options to string
    if (typeof val === "number") {
      params.set(key, String(val));
    } else if (typeof val === "boolean") {
      params.set(key, val ? "true" : "false");
    } else if (typeof val === "string") {
      params.set(key, val);
    }
  });

  // Final format should look similar to: https://imagedelivery.net/<ACCOUNT_HASH>/<IMAGE_ID>/w=400,sharpen=3
  return imageUrl.replace(
    "public",
    Array.from(params.entries())
      .map(([key, val]) => `${key}=${val}`)
      .join(","),
  );
};
