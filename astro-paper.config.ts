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
