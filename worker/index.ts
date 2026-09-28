/**
 * Cloudflare Worker for dynamic OG image generation.
 *
 * Deployed alongside the Astro site on Cloudflare Pages.
 * Handles requests to /api/og.png and generates images using workers-og.
 *
 * Query parameters:
 *   - title     (required)   — Post title
 *   - description (optional) — Post description, truncated to 120 chars
 */
import { ImageResponse } from "workers-og";

// Default values when no query params are provided (homepage)
const DEFAULT_TITLE = "swanli";
const DEFAULT_DESCRIPTION =
  "Notes on numerical computation, mathematics, and Julia.";

export default {
  async fetch(request: Request): Promise<Response> {
    let url: URL;
    try {
      url = new URL(request.url);
    } catch {
      return new Response("Invalid request URL", { status: 400 });
    }
    const title = url.searchParams.get("title") || DEFAULT_TITLE;
    const description =
      url.searchParams.get("description") || DEFAULT_DESCRIPTION;

    // Truncate description to fit within the OG image
    const truncatedDesc =
      description.length > 120 ? description.slice(0, 117) + "..." : description;

    const html = `
      <div
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background-color: #1a1a2e;
          color: #eaeaea;
          font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
          padding: 60px 80px;
          box-sizing: border-box;
        "
      >
        <div
          style="
            font-size: 28px;
            font-weight: 600;
            color: #a78bfa;
            letter-spacing: 2px;
            margin-bottom: 40px;
          "
        >
          ${escapeHtml(title.slice(0, 40))}
        </div>
        <div
          style="
            font-size: 56px;
            font-weight: 700;
            line-height: 1.2;
            text-align: center;
            max-width: 960px;
            word-wrap: break-word;
            overflow-wrap: break-word;
          "
        >
          ${escapeHtml(title)}
        </div>
        ${
          truncatedDesc
            ? `<div
                style="
                  font-size: 28px;
                  color: #9ca3af;
                  margin-top: 32px;
                  text-align: center;
                  max-width: 960px;
                  line-height: 1.5;
                "
              >
                ${escapeHtml(truncatedDesc)}
              </div>`
            : ""
        }
        <div
          style="
            position: absolute;
            bottom: 40px;
            font-size: 20px;
            color: #6b7280;
            letter-spacing: 1px;
          "
        >
          swanli
        </div>
      </div>
    `;

    return new ImageResponse(html, {
      width: 1200,
      height: 630,
      format: "png",
    });
  },
};

/**
 * Escape HTML entities to prevent XSS in the OG image HTML.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
