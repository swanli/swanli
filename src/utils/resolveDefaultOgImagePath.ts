import type { ResolvedAstroPaperConfig } from "@/types/config";

/**
 * Resolves the default OG image for pages that don't provide one.
 *
 * When `features.dynamicOgImage` is enabled, returns the dynamic endpoint
 * `/api/og.png` which generates images on the edge via workers-og.
 * When disabled, delegates to the static path resolver for validation.
 */
export function resolveDefaultOgImagePath(
  config: ResolvedAstroPaperConfig
): string {
  if (config.features.dynamicOgImage) {
    return "/api/og.png";
  }

  // Fallback to the static file check when dynamic is disabled
  // This preserves the original validation behavior for non-dynamic setups.
  return `/${config.site.ogImage}`;
}
