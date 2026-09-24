# Swanli Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready AstroPaper v6 blog at `~/dev/swanli` with 11 migrated (draft) posts, KaTeX math, and automatic Cloudflare Pages deploys via GitHub.

**Architecture:** Fresh clone of upstream `satnaing/astro-paper` (v6.1.0, Astro 7) into the existing `~/dev/swanli` git repo (which already holds the committed spec). Site identity is set in `astro-paper.config.ts`; posts migrate to v6's `src/content/posts/_2025/` as drafts; KaTeX is ported via remark/rehype plugins + CDN CSS; deployment is static (`dist`) via Cloudflare Pages Git integration.

**Tech Stack:** Astro 7, AstroPaper v6.1.0, Tailwind CSS 4, Pagefind (search), KaTeX (math), npm, Node ≥22.12.0, GitHub + Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-09-23-swanli-blog-design.md`

## Global Constraints

- Node ≥ 22.12.0 (local: Node 26 is fine; Cloudflare Pages: set Node version `22`)
- `npm` is the ONLY package manager — never create bun/pnpm lockfiles
- `~/dev/swanli-blog` is READ-ONLY content source — never modify it
- Migrated post bodies are verbatim; the only allowed frontmatter change is inserting `draft: true` (plus temporary flips for verification, which MUST be reverted)
- All 11 posts must end this plan as `draft: true`
- `site.url` = `https://swanli.pages.dev/` (confirmed after first deploy in Task 6)
- author = `"Li Hong"`, timezone = `"Asia/Shanghai"`, lang = `"en"`, dir = `"ltr"`
- Post URL shape: `/posts/<slug>/` (v6 filters `_`-prefixed folders from slugs — verified in upstream `src/utils/getPostPaths.ts`)
- Every task ends with a git commit; `git status` must be clean before moving to the next task

## Review Focus

1. **Migrated frontmatter quirks** — a post with malformed YAML (e.g. unquoted colon in description) fails collection load or silently drops fields. Owned by Task 3: build must load all 11 entries, and one spot-checked post's title/description must appear in generated HTML.
2. **All-draft site must not 500** — with zero published posts, `/rss.xml`, `/sitemap.xml`, `/archives/`, `/tags/`, `/search/` must still return 200 and valid content. Owned by Task 5.
3. **KaTeX CDN reachability** — `cdn.jsdelivr.net` can be slow/blocked in mainland China, leaving math unstyled. Kept as-is (it is the user's proven existing setup from `swanli-blog`); fallback if it misbehaves for the user: replace the CDN `<link>` with a local `import "katex/dist/katex.min.css"` in `src/layouts/Layout.astro`.
4. **Cloudflare Node version floor** — if Pages' Node 22.x runtime is below 22.12.0, the build fails on `engines`. Fallback: bump the Node version in Pages settings (24 if available on CF).
5. **Draft preview must not leak to production** — the temporary `draft: false` flip used in Tasks 3/4 must never be committed or pushed; final `git status` + a grep for `draft: true` count (11) gates this.

---

### Task 1: Scaffold the project from upstream AstroPaper v6

**Files:**
- Create: entire `~/dev/swanli` tree from upstream (astro.config.ts, src/, public/, package.json, ...)
- Modify: `package.json` (name only)

**Interfaces:**
- Consumes: existing git repo at `~/dev/swanli` (branch `main`, contains `docs/superpowers/specs/`)
- Produces: buildable pristine upstream theme; `npm run dev|build|preview|lint|format:check` scripts available

- [ ] **Step 1: Clone upstream and merge into the existing repo**

```bash
cd /tmp && rm -rf swanli-upstream
git clone --depth 1 https://github.com/satnaing/astro-paper swanli-upstream
cd /tmp/swanli-upstream
tar cf - --exclude=.git . | (cd /home/hli/dev/swanli && tar xf -)
cd /home/hli/dev/swanli
rm -f pnpm-lock.yaml pnpm-workspace.yaml   # spec: npm only — upstream ships pnpm artifacts; npm install will create package-lock.json
ls astro-paper.config.ts astro.config.ts package.json src/content.config.ts   # all must exist
ls docs/superpowers/specs/                                                     # spec must survive
```

- [ ] **Step 2: Rename the package**

In `package.json`, change `"name": "astro-paper-v6"` to `"name": "swanli"`.

- [ ] **Step 3: Install dependencies**

```bash
cd /home/hli/dev/swanli && npm install
```

Expected: completes with a `package-lock.json` created; no engine warnings (Node 26 satisfies `>=22.12.0`).

- [ ] **Step 4: Verify the pristine theme builds**

```bash
cd /home/hli/dev/swanli && npm run build
```

Expected: `astro check` clean, `astro build` succeeds, `pagefind` index written. (Build = `astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/` — keep this script UNCHANGED.)

- [ ] **Step 5: Verify the pristine theme serves**

```bash
cd /home/hli/dev/swanli && (npm run preview -- --port 4321 &>/tmp/preview.log & echo $! > /tmp/preview.pid)
sleep 4
curl -sf -o /dev/null -w "%{http_code}\n" http://localhost:4321/          # 200
curl -sf http://localhost:4321/ | grep -o "<title>[^<]*" | head -1        # contains "AstroPaper"
kill $(cat /tmp/preview.pid)
```

Expected: `200` and a title containing `AstroPaper`.

- [ ] **Step 6: Commit**

```bash
cd /home/hli/dev/swanli && git add -A && git status --short | head   # sanity: no bun.lock / pnpm-lock.yaml
git commit -m "feat: scaffold AstroPaper v6.1.0 base for swanli blog"
```

---

### Task 2: Set site identity and author content

**Files:**
- Modify: `astro-paper.config.ts` (full rewrite of the default export)
- Create: `src/content/pages/about.md` (overwrite upstream version)

**Interfaces:**
- Consumes: upstream v6 config system (`defineAstroPaperConfig` from `./src/types/config`; defaults resolved in `src/config.ts` — `socials`/`shareLinks` are optional)
- Produces: `config.site.*` values used by all pages, RSS, sitemap, OG images

- [ ] **Step 1: Rewrite `astro-paper.config.ts`**

Replace the entire file content with:

```ts
import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://swanli.pages.dev/",
    title: "swanli",
    description: "Notes on numerical computation, mathematics, and Julia.",
    author: "Li Hong",
    profile: "https://swanli.pages.dev/",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Asia/Shanghai",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [{ name: "github", url: "https://github.com/swanli" }],
});
```

Notes: `shareLinks` omitted (theme defaults to `[]` — `src/config.ts` resolves `userConfig.shareLinks ?? []`). `editPost` is disabled until the GitHub repo exists (enabled in Task 6 if desired). Upstream `public/default-og.jpg` stays as the fallback OG image.

- [ ] **Step 2: Rewrite `src/content/pages/about.md`**

```md
---
title: "About"
description: "About Li Hong and this blog."
---

Hi, I'm Li Hong. This is my personal blog — notes on numerical computation, mathematics, and Julia.
```

- [ ] **Step 3: Verify build + identity**

```bash
cd /home/hli/dev/swanli && npm run build
(npm run preview -- --port 4321 &>/tmp/preview.log & echo $! > /tmp/preview.pid); sleep 4
curl -sf http://localhost:4321/ | grep -c "swanli"                      # >= 1 (site title)
curl -sf http://localhost:4321/about/ | grep -o "Hi, I'm Li Hong"       # found
curl -sf http://localhost:4321/rss.xml | grep -o "<title>[^<]*" | head -1   # swanli (channel title)
curl -sf http://localhost:4321/rss.xml | grep -o "<description>[^<]*" | head -1   # new site description
kill $(cat /tmp/preview.pid)
```

Expected: build passes; title shows `swanli`; about page shows the new bio; the RSS channel title/description reflect the new identity (v6's `rss.xml.ts` renders channel `title`/`description`/`site` plus items — no `<author>` element). (Upstream sample posts are still present at this stage — that is fine; Task 3 replaces them.)

- [ ] **Step 4: Commit**

```bash
cd /home/hli/dev/swanli && git add -A && git commit -m "feat: set swanli site identity, author, and features"
```

---

### Task 3: Migrate the 11 posts and their images as drafts

**Files:**
- Delete: `src/content/posts/*` (all upstream sample posts: 13 top-level + `examples/`, `_releases/`, `_color-schemes/`)
- Create: `src/content/posts/_2025/{bifurcation,diff,integrate,iteration,la,learning_curves,misc,numerical_basic,pkg,statistics,trace-compile}.md`
- Create: `src/assets/images/{bifurcation-5,la-4,la-10,la-12}.png` (the only images referenced in post bodies)

**Interfaces:**
- Consumes: read-only source `~/dev/swanli-blog/src/data/blog/_2025/*.md` and `~/dev/swanli-blog/src/assets/images/`; v6 `posts` collection (`src/content.config.ts`, glob `**/[^_]*.{md,mdx}`, base `./src/content/posts`)
- Produces: 11 draft posts at URLs `/posts/<slug>/` (hidden from all listings while drafts)

- [ ] **Step 1: Remove upstream sample posts**

```bash
cd /home/hli/dev/swanli && rm -rf src/content/posts && mkdir -p src/content/posts/_2025
```

- [ ] **Step 2: Copy the 11 posts verbatim**

```bash
cp /home/hli/dev/swanli-blog/src/data/blog/_2025/*.md /home/hli/dev/swanli/src/content/posts/_2025/
ls /home/hli/dev/swanli/src/content/posts/_2025/ | wc -l     # 11
```

- [ ] **Step 3: Mark every post a draft**

Insert `draft: true` directly after the `pubDatetime:` line in each file (all 11 have it at top level):

```bash
cd /home/hli/dev/swanli
sed -i '/^pubDatetime:/a draft: true' src/content/posts/_2025/*.md
grep -l "^draft: true" src/content/posts/_2025/*.md | wc -l   # 11
head -8 src/content/posts/_2025/la.md                         # sanity: frontmatter shape
```

Expected: 11 files contain `draft: true`; frontmatter looks like:

```yaml
---
title: Linear Algebra
description: ...
pubDatetime: 2026-01-14T05:17:19Z
draft: true
heroImage: '../../../assets/images/blog-placeholder-3.jpg'
...
---
```

(`heroImage` is intentionally left in place — v6's schema strips it silently; v6 post cards don't render hero images. No action needed.)

- [ ] **Step 4: Copy the body-referenced images**

Verified complete list of body image references (all other images in the old repo are unreferenced by `_2025` bodies): `bifurcation-5.png`, `la-4.png`, `la-10.png`, `la-12.png`.

```bash
cd /home/hli/dev/swanli
cp /home/hli/dev/swanli-blog/src/assets/images/bifurcation-5.png \
   /home/hli/dev/swanli-blog/src/assets/images/la-4.png \
   /home/hli/dev/swanli-blog/src/assets/images/la-10.png \
   /home/hli/dev/swanli-blog/src/assets/images/la-12.png \
   src/assets/images/
ls src/assets/images/ | grep -E "bifurcation-5|la-4|la-10|la-12"   # 4 lines
```

- [ ] **Step 5: Verify all-draft build (no published posts)**

```bash
cd /home/hli/dev/swanli && npm run build
(npm run preview -- --port 4321 &>/tmp/preview.log & echo $! > /tmp/preview.pid); sleep 4
curl -sf -o /dev/null -w "%{http_code}\n" http://localhost:4321/            # 200
curl -sf http://localhost:4321/ | grep -c "la\b" || true                    # 0 — no post titles on home
curl -sf -o /dev/null -w "%{http_code}\n" http://localhost:4321/posts/la/   # 404 — draft not generated
kill $(cat /tmp/preview.pid)
```

Expected: build succeeds with zero published posts (Astro may warn about empty routes — acceptable); home page 200 but lists no posts; `/posts/la/` returns 404 because `postFilter.ts` excludes drafts from `getStaticPaths`.

- [ ] **Step 6: Verify a draft renders correctly when published (then revert)**

```bash
cd /home/hli/dev/swanli
sed -i 's/^draft: true$/draft: false/' src/content/posts/_2025/la.md
npm run build
test -f dist/posts/la/index.html && echo "POST PAGE OK"
grep -q "Linear Algebra" dist/posts/la/index.html && echo "TITLE OK"
grep -c "<img" dist/posts/la/index.html                       # >= 3 (la-4, la-10, la-12 body images)
# revert the flip — mandatory
sed -i 's/^draft: false$/draft: true/' src/content/posts/_2025/la.md
grep -l "^draft: true" src/content/posts/_2025/*.md | wc -l     # 11 again
git status --short | grep -v "^??"                               # only expected changes
```

Expected: `POST PAGE OK` and `TITLE OK` printed, and the `<img` count is at least 3 (Astro rewrites relative markdown image refs to hashed `/@_images/` or `/_images/` paths at build time, so grep for `<img`, not the original filename). If the count is 0, open `dist/posts/la/index.html` and inspect the `<img>` tags before proceeding. **Revert verified: exactly 11 files have `draft: true`.**

- [ ] **Step 7: Commit**

```bash
cd /home/hli/dev/swanli && git add -A && git commit -m "feat: migrate 11 swanli-blog posts as drafts with body images"
```

---

### Task 4: Add KaTeX math support

**Files:**
- Modify: `astro.config.ts` (imports + markdown processor plugins)
- Modify: `src/layouts/Layout.astro` (KaTeX CSS link in `<head>`)
- Modify: `src/styles/typography.css` (`.katex-display` text color)
- Modify: `package.json` / `package-lock.json` (via npm install)

**Interfaces:**
- Consumes: v6 markdown processor — `markdown: { processor: unified({ remarkPlugins: [...], rehypePlugins: [...] }) }` in `astro.config.ts`; recipe from upstream `src/content/posts/how-to-add-latex-equations-in-blog-posts.md` (deleted in Task 3 — the recipe is preserved in this plan)
- Produces: `$...$` and `$$...$$` render as KaTeX in all posts

- [ ] **Step 1: Install math packages**

```bash
cd /home/hli/dev/swanli && npm install katex remark-math rehype-katex
```

Expected: 3 packages in `dependencies`.

- [ ] **Step 2: Wire plugins into `astro.config.ts`**

Add imports (next to the other remark/rehype imports):

```ts
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
```

Change the markdown processor block from:

```ts
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts],
    }),
```

to:

```ts
    processor: unified({
      remarkPlugins: [
        remarkMath,
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeKatex, rehypeCallouts],
    }),
```

- [ ] **Step 3: Import KaTeX CSS in `src/layouts/Layout.astro`**

In the `<head>` section, directly after the line `<meta property="og:image" content={socialImageURL} />`, insert:

```html
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex@0.16.38/dist/katex.min.css"
    />
```

(Version 0.16.38 matches the user's existing proven setup in `swanli-blog`.)

- [ ] **Step 4: Add math text color to `src/styles/typography.css`**

Inside the existing `@layer base` block, immediately after the `.app-prose { @apply prose; }` rule, add:

```css
  /* KaTeX display math inherits the theme foreground color (light/dark) */
  .prose .katex-display {
    @apply text-foreground;
  }
```

- [ ] **Step 5: Verify math renders (temporarily publish la.md, then revert)**

`la.md` (Linear Algebra) contains LaTeX.

```bash
cd /home/hli/dev/swanli
sed -i 's/^draft: true$/draft: false/' src/content/posts/_2025/la.md
npm run build
grep -q 'class="katex' dist/posts/la/index.html && echo "KATEX OK"
sed -i 's/^draft: false$/draft: true/' src/content/posts/_2025/la.md   # revert — mandatory
grep -l "^draft: true" src/content/posts/_2025/*.md | wc -l     # 11 again
```

Expected: `KATEX OK` printed (server-rendered KaTeX spans in the built HTML). If the grep fails, open `dist/posts/la/index.html` and confirm the cause before proceeding — a silently broken math pipeline is the top risk of this task.

- [ ] **Step 6: Commit**

```bash
cd /home/hli/dev/swanli && git add -A && git commit -m "feat: add KaTeX math support (remark-math + rehype-katex + CDN css)"
```

---

### Task 5: Full local verification gate

**Files:**
- Modify: any file with lint/format violations (expected: possibly `src/content/posts/_2025/*.md` formatting)

**Interfaces:**
- Consumes: theme scripts `lint` (`eslint .`), `format:check` (`prettier --check .`), `build`, `preview`
- Produces: the spec's §7 local verification list satisfied; a clean, lint/format-green tree

- [ ] **Step 1: Format check; fix only migrated content if needed**

```bash
cd /home/hli/dev/swanli && npm run format:check
```

Expected: passes. If it fails ONLY on `src/content/posts/_2025/*` files (migrated content wasn't formatted with this repo's Prettier config), fix scoped to those files:

```bash
npx prettier --write "src/content/posts/_2025/*.md" && npm run format:check
```

Do NOT run repo-wide `npm run format` on theme files.

- [ ] **Step 2: Lint**

```bash
cd /home/hli/dev/swanli && npm run lint
```

Expected: no errors. Fix any that appear (expect none — theme is lint-clean upstream).

- [ ] **Step 3: Production build + full preview pass**

```bash
cd /home/hli/dev/swanli && npm run build
(npm run preview -- --port 4321 &>/tmp/preview.log & echo $! > /tmp/preview.pid); sleep 4
for p in / /about/ /archives/ /tags/ /search/ /rss.xml /sitemap.xml /pagefind/ui/; do
  printf "%s %s\n" "$(curl -sf -o /dev/null -w '%{http_code}' http://localhost:4321$p)" "$p"
done
curl -sf http://localhost:4321/sitemap.xml | head -5
kill $(cat /tmp/preview.pid)
```

Expected: all paths return `200` (spec Review Focus #2). `/rss.xml` is well-formed with zero `<item>` entries (all drafts). `/sitemap.xml` lists site pages (no post URLs — drafts are excluded). `/search/` serves the Pagefind UI shell.

- [ ] **Step 4: Dark mode + search sanity (visual, manual)**

Run `npm run preview` and open `http://localhost:4321/` in a browser: header shows the light/dark toggle (dark mode works), footer/header shows the socials GitHub icon, search box present on `/search/`. (No published posts yet — search returning 0 results is correct.)

- [ ] **Step 5: Commit (if any fixes were made) and confirm clean state**

```bash
cd /home/hli/dev/swanli
[ -n "$(git status --short)" ] && git add -A && git commit -m "chore: fix lint/format issues in migrated content"
git status --short && grep -l "^draft: true" src/content/posts/_2025/*.md | wc -l   # clean tree, 11 drafts
```

---

### Task 6: Deploy via GitHub + Cloudflare Pages

**Files:**
- Modify: `astro-paper.config.ts` (only if the live URL differs from `https://swanli.pages.dev/`)

**Interfaces:**
- Consumes: clean git repo at `~/dev/swanli` (all commits), GitHub account (gh CLI), Cloudflare account
- Produces: live production site at `https://swanli.pages.dev` with preview deploys per branch

- [ ] **Step 1: Push to GitHub**

```bash
cd /home/hli/dev/swanli
gh auth status                                   # must be authenticated
gh api user --jq .login                          # note the login (expected: swanli)
gh repo create swanli --private --source=. --remote=origin --push
```

If the user wants the repo public, use `--public` instead (ask before choosing). If the GitHub login is not `swanli`, update the `socials` github URL in `astro-paper.config.ts` to match and commit before pushing.

- [ ] **Step 2: Connect Cloudflare Pages**

In the Cloudflare dashboard (user action — narrate these exact settings):

1. Workers & Pages → **Create** → **Pages** → **Connect to Git** → GitHub → select repo `swanli`
2. Build settings:
   - Project name: `swanli`
   - Production branch: `main`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: `22`
3. Save and Deploy. (Preview deploys per non-main branch are automatic.)

Alternative if the user prefers CLI and `wrangler` is authenticated (`wrangler whoami`): `wrangler pages project create swanli --production-branch=main` — then link the repo in the dashboard (CLI cannot create the Git link).

- [ ] **Step 3: Watch the first production deploy**

Wait for the deploy to complete (dashboard, or `wrangler pages deployment list --project-name=swanli --json` if wrangler is authenticated). Expected: build succeeds on CF with Node 22. If it fails on `engines` (Node 22.x < 22.12.0), raise the Node.js version in Pages settings (e.g. 24 if offered) and redeploy.

- [ ] **Step 4: Post-deploy smoke test**

```bash
for p in / /about/ /archives/ /tags/ /search/ /rss.xml /sitemap.xml /pagefind/ui/; do
  printf "%s %s\n" "$(curl -sf -o /dev/null -w '%{http_code}' https://swanli.pages.dev$p)" "$p"
done
curl -sf https://swanli.pages.dev/rss.xml | grep -c "<item>"    # 0 (all drafts)
```

Expected: all `200`, RSS has 0 items. Open `https://swanli.pages.dev` in a browser and confirm title `swanli`, dark-mode toggle, search page.

- [ ] **Step 5: Reconcile site.url, enable edit links, final push**

If the live URL is exactly `https://swanli.pages.dev` (or `https://swanli.pages.dev/`), no change is needed. If it differs, update `site.url` and `profile` in `astro-paper.config.ts`.

Optionally enable edit links now that the repo exists (user's call):

```ts
    editPost: {
      enabled: true,
      url: "https://github.com/swanli/swanli/edit/main/",
    },
```

```bash
cd /home/hli/dev/swanli && git add -A && git commit -m "chore: reconcile post-deploy site config" && git push
```

The push triggers a final production deploy — confirm it succeeds and re-run the smoke test once.

- [ ] **Step 6: Hand-off notes to the user**

Report: live URL, how to publish a post (set `draft: false` in `src/content/posts/_2025/<post>.md`, commit, push), preview deploys per branch, where to expand the About page, and that placeholder post descriptions are untouched for the user to polish.
