# swanli — Personal Blog on Astro + Cloudflare Pages

**Date:** 2026-09-23
**Status:** Approved in conversation (approach A); pending written-spec review
**Location:** `~/dev/swanli` → deploys to `https://swanli.pages.dev`

## 1. Goal

A personal technical blog for Li Hong (math / numerical computation / Julia), built on
Astro and the AstroPaper theme, deployed to Cloudflare Pages via Git integration.

It replaces (not migrates in place) the old `~/dev/swanli-blog` repo (AstroPaper v5.5.1,
GitHub Pages). The old repo stays untouched.

## 2. Approved decisions

| Decision | Choice |
|---|---|
| Base | Fresh clone of upstream `satnaing/astro-paper` @ latest (v6.1.0, Astro 7) |
| Theme | AstroPaper (no custom layout work) |
| Features | Post list/detail, tags + archives, dark mode, RSS + sitemap, Pagefind site search, math/LaTeX (KaTeX), code highlighting |
| Content | 11 posts from old repo `src/data/blog/_2025/`, all migrated **as drafts** |
| Package manager | npm |
| Deploy | Cloudflare Pages **Git integration** (GitHub), production branch `main`, preview deploys per branch |
| Site identity | `https://swanli.pages.dev`, author "Li Hong", timezone `Asia/Shanghai`, lang `en` |

## 3. Architecture

Pure static site. No SSR, no Cloudflare adapter, no Workers. Astro builds `dist/`,
Cloudflare Pages serves it from the edge.

- **Framework:** Astro 7 (AstroPaper v6.1.0 pin), Node ≥ 22.12 (local: Node 26)
- **Styling:** Tailwind 4 via `@tailwindcss/vite` (theme default)
- **Search:** Pagefind, generated at build time (`pagefind --site dist`)
- **Fonts:** Google Sans Code via Astro font providers (theme default)
- **Markdown pipeline (extended):** remark-toc, remark-collapse, rehype-callouts (theme defaults) **+ remark-math, rehype-katex, katex** (ported from old repo)

Directory structure = upstream AstroPaper v6 layout, plus (v6 content locations
verified against upstream `src/content.config.ts`):

```
swanli/
├── astro-paper.config.ts        # site identity + feature flags (v6 config system)
├── astro.config.ts              # + math remark/rehype plugins
├── src/
│   ├── content.config.ts        # v6 collections: `posts` (src/content/posts), `pages`
│   ├── assets/images/           # migrated images (inline post images)
│   ├── content/
│   │   ├── posts/_2025/*.md     # 11 migrated posts (draft: true)
│   │   └── pages/about.md       # re-authored for Li Hong
│   └── (theme pages/layouts/components unchanged)
└── docs/superpowers/specs/      # this spec
```

## 4. Component-by-component design

### 4.1 Setup
- `git clone` upstream `satnaing/astro-paper` → rename to `~/dev/swanli`
- Drop upstream `.git`; `git init` fresh (local project; GitHub remote added at deploy time)
- `npm install` — verify clean install and that `npm run dev` boots
- Rename package `name` to `swanli`

### 4.2 Theme configuration (`astro-paper.config.ts`)
- `site.url`: `https://swanli.pages.dev`
- `site.author`: `Li Hong`; `site.title`: `swanli` (blog name)
- `site.timezone`: `Asia/Shanghai`, `lang`: `en`
- Features: archives **on**, light/dark mode **on**, search **on**, RSS **on**
- Sitemap integration stays (theme default), filtering archives per theme config
- Remove/replace upstream demo content: sample posts deleted, `src/content/pages/about.md`
  re-authored for Li Hong (short placeholder bio, user can expand later)

### 4.3 Content migration
- Copy the 11 posts (bifurcation, diff, integrate, iteration, la, learning_curves, misc,
  numerical_basic, pkg, statistics, trace-compile) into `src/content/posts/_2025/` keeping
  the `_2025/` folder: it matches the v6 glob (`**/[^_]*.md`), its `_` prefix is filtered
  out of post URLs (verified in `src/utils/getPostPaths.ts`), and inline image refs
  (`../../../assets/images/...`) still resolve to `src/assets/images/` at the new depth
- Copy the images the post bodies reference from old repo `src/assets/images/`
  (`bifurcation-*.png`, `la-*.png`, placeholders) to the same location in the new repo
- Set every migrated post `draft: true`. Verified v6 behavior (`src/utils/postFilter.ts`):
  drafts are excluded from list/tags/archives/OG-generation **and hidden even in dev** —
  to review a draft locally, temporarily set `draft: false` and preview, then revert.
  User flips posts to published one at a time later
- Post content is migrated **verbatim** — no prose edits (several posts share a
  placeholder description; left for the user to polish)
- Frontmatter: `title`, `description`, `pubDatetime` match the v6 schema. The old
  `heroImage` field is **not** in the v6 schema — zod strips it silently, and v6 post
  cards no longer display hero images (title + date + description only). No action
  needed beyond the strip; no error expected.
- Post URLs will be `https://swanli.pages.dev/posts/<slug>/` (e.g. `/posts/la/`)

### 4.4 KaTeX math support (ported from old repo)
- Deps: `katex`, `remark-math`, `rehype-katex`
- Wire `remarkMath` into remark plugins and `rehypeKatex` into rehype plugins of the
  unified markdown processor in `astro.config.ts`
- Import `katex/dist/katex.min.css` in the layout/head so math renders in both themes
- Verify with a migrated post containing `$…$` and `$$…$$` (e.g. `la.md`)

### 4.5 Cloudflare Pages deployment (Git integration)
- GitHub repo (private or public per user preference at deploy time), remote `origin`
- Cloudflare Pages: connect repo, production branch `main`
  - Build command: `npm run build` (runs `astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/`)
  - Build output directory: `dist`
  - Node version: 22 (Cloudflare-managed; satisfies Astro 7's ≥22.12)
  - No environment variables required (no env schema fields in use)
- Preview deploys: automatic per non-main branch
- After first production deploy: confirm live URL, final push if anything changes

## 5. Data flow

```
Markdown (src/data/blog/_2025)
  → Astro content collection (frontmatter schema)
  → Markdown pipeline: remark(toc, collapse, math) → rehype(callouts, katex) → Shiki highlight
  → AstroPaper layouts (list, post, tag, archive, about, search, 404)
  → dist/ (static HTML) + pagefind index + rss.xml + sitemap.xml + og images
  → Cloudflare Pages edge
```

## 6. Error handling & edge cases

- **Future-dated posts:** theme hides them (scheduledPostMargin); all migrated dates are past → no issue
- **Drafts:** `draft: true` posts excluded from lists/RSS/sitemap by theme logic
- **Missing heroImage:** posts without an image render without a hero (theme handles)
- **Search index:** rebuilt every build; Pagefind UI ships with the theme
- **Build failure on Cloudflare (Node version):** if CF's Node 22.x < 22.12, bump CF
  project Node version (next available major) — noted as a fallback, not anticipated

## 7. Testing & verification

1. `npm run build` passes locally (includes `astro check`)
2. `npm run lint` and `npm run format:check` pass
3. `npm run preview` manual pass:
   - Post list shows only non-draft posts; migrated drafts reachable by URL
   - Draft post renders KaTeX math + Julia code highlighting correctly
   - Tag pages, archives, about, 404 all render
   - Dark mode toggle works; Pagefind search finds migrated post content
4. RSS (`/rss.xml`) and sitemap (`/sitemap.xml`) well-formed; drafts excluded
5. Post-deploy smoke test: home, a published post, `/search`, `/rss.xml`, `/sitemap.xml`
   respond 200 on `https://swanli.pages.dev`

## 8. Out of scope (YAGNI)

- Comments system (e.g. Giscus)
- Custom domain (can be added in Cloudflare dashboard later)
- Analytics, i18n, MDX posts, multiple authors
- CI beyond Cloudflare's own build (no GitHub Actions)
- Editing/polishing migrated post prose

## 9. Open items (resolved at deploy time, not blocking)

- GitHub repo visibility (private vs public) — user decides when creating the repo
- Final URL confirmation once the first Cloudflare Pages project exists
  (expected `https://swanli.pages.dev`)
