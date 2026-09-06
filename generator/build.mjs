import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  collectPatternScripts,
  patternStyles,
  patterns,
  renderUtilities,
  utilityScripts,
  utilityStyles,
  validateUtilities
} from "../patterns/index.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sitesDir = path.join(rootDir, "sites");
const themesDir = path.join(rootDir, "themes");
const outputDir = path.join(rootDir, "output");

async function main() {
  const siteName = process.argv[2] ?? "atlas-studio";
  const siteSpecPath = path.join(sitesDir, siteName, "site.json");
  const site = JSON.parse(await readFile(siteSpecPath, "utf8"));
  const themePath = path.join(themesDir, `${site.theme}.css`);
  const themeCss = await readFile(themePath, "utf8");

  validateSite(site);

  const siteOutputDir = path.join(outputDir, site.slug);
  await rm(siteOutputDir, { recursive: true, force: true });
  await mkdir(siteOutputDir, { recursive: true });

  const css = [baseStyles, themeCss, patternStyles, utilityStyles].join("\n\n");
  await writeFile(path.join(siteOutputDir, "styles.css"), css);

  const script = renderScripts(site);
  if (script) {
    await writeFile(path.join(siteOutputDir, "scripts.js"), script);
  }

  await writeFile(path.join(siteOutputDir, "index.html"), renderDocument(site, null));

  const pages = site.pages ?? [];
  for (const page of pages) {
    const pageDir = path.join(siteOutputDir, page.slug);
    await mkdir(pageDir, { recursive: true });
    await writeFile(path.join(pageDir, "index.html"), renderDocument(site, page));
  }

  await writeFile(
    path.join(siteOutputDir, "site.json"),
    `${JSON.stringify(site, null, 2)}\n`
  );

  console.log(
    `Built ${site.slug} -> ${path.relative(rootDir, siteOutputDir)} (${1 + pages.length} page${pages.length ? "s" : ""})`
  );
}

function validateSite(site) {
  if (!site.slug || !site.title || !site.theme) {
    throw new Error("Site spec must include slug, title, and theme.");
  }

  if (!Array.isArray(site.sections) || site.sections.length === 0) {
    throw new Error("Site spec must include at least one section.");
  }

  const allSections = [...site.sections];

  for (const page of site.pages ?? []) {
    if (!page.slug || !page.title) {
      throw new Error("Each page must include a slug and title.");
    }
    if (!Array.isArray(page.sections) || page.sections.length === 0) {
      throw new Error(`Page "${page.slug}" must include at least one section.`);
    }
    allSections.push(...page.sections);
  }

  for (const section of allSections) {
    if (!patterns[section.pattern]) {
      throw new Error(`Unknown pattern: ${section.pattern}`);
    }
  }

  validateUtilities(site.utilities ?? {});
}

function renderNav(site, page) {
  const isHome = !page;

  return (site.navigation?.links ?? [])
    .map((link) => {
      const href = isHome && link.homeHref ? link.homeHref : link.href;
      const label = escapeHtml(link.label);

      if (!link.children?.length) {
        return `<a href="${escapeHtml(href)}">${label}</a>`;
      }

      const children = link.children
        .map(
          (child) =>
            `<li><a href="${escapeHtml(child.href)}">${escapeHtml(child.label)}</a></li>`
        )
        .join("");

      return `<div class="nav-item has-dropdown">
        <a href="${escapeHtml(href)}">${label}</a>
        <ul class="nav-dropdown">${children}</ul>
      </div>`;
    })
    .join("");
}

function renderDocument(site, page) {
  const sections = (page?.sections ?? site.sections)
    .map((section) => patterns[section.pattern](section))
    .join("\n");

  const footerLinks = (site.footer?.links ?? [])
    .map(
      (link) =>
        `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`
    )
    .join("");

  const utilities = renderUtilities(site.utilities ?? {});
  const hasScripts = Boolean(renderScripts(site));
  const needsBootstrapCarousel = (page?.sections ?? site.sections).some(
    (section) =>
      section.pattern === "carouselGallery" ||
      (section.pattern === "gallery" && section.layout !== "thumbnails")
  );

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(page?.title ?? site.title)}</title>
    <meta name="description" content="${escapeHtml(page?.description ?? site.description ?? "")}" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div class="site-shell">
      <header class="site-header">
        <div class="container header-inner">
          <a class="site-brand" href="/">${escapeHtml(site.brand ?? site.title)}</a>
          <nav class="site-nav" aria-label="Primary">
            ${renderNav(site, page)}
          </nav>
        </div>
      </header>
      <main>
        ${sections}
      </main>
      <footer class="site-footer">
        <div class="container footer-inner">
          <div>
            <p class="footer-brand">${escapeHtml(site.brand ?? site.title)}</p>
            <p class="footer-copy">${escapeHtml(site.footer?.blurb ?? "")}</p>
          </div>
          <div class="footer-links">
            ${footerLinks}
          </div>
        </div>
      </footer>
      ${utilities}
    </div>
    ${needsBootstrapCarousel ? '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>' : ""}
    ${hasScripts ? '<script src="/scripts.js"></script>' : ""}
  </body>
</html>`;
}

function renderScripts(site) {
  const scripts = [];

  const allSections = [
    ...(site.sections ?? []),
    ...(site.pages ?? []).flatMap((page) => page.sections ?? [])
  ];

  const patternScript = collectPatternScripts(allSections);
  if (patternScript) {
    scripts.push(patternScript);
  }

  for (const [name, config] of Object.entries(site.utilities ?? {})) {
    const renderer = utilityScripts[name];
    if (renderer && config?.enabled !== false) {
      scripts.push(renderer(config));
    }
  }

  return scripts.join("\n\n").trim();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const baseStyles = `
:root {
  --container-width: 72rem;
  --gutter: clamp(1rem, 2vw, 1.5rem);
  --section-space: clamp(4rem, 8vw, 8rem);
  --radius-sm: 0;
  --radius-md: 0;
  --radius-lg: 0;
  --shadow-soft: none;
  --border-subtle: 1px solid var(--border-color);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-body);
  color: var(--color-text);
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.75), transparent 38%),
    linear-gradient(180deg, var(--color-page-top), var(--color-page-bottom));
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
}

.container {
  width: min(100% - 2 * var(--gutter), var(--container-width));
  margin: 0 auto;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(18px);
  background: color-mix(in srgb, var(--color-surface) 82%, transparent);
  border-bottom: var(--border-subtle);
}

.header-inner,
.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1rem 0;
}

.site-brand,
.footer-brand {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
}

.site-nav,
.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.site-nav a,
.footer-links a {
  text-decoration: none;
  color: var(--color-muted);
}

.site-nav a:hover,
.footer-links a:hover {
  color: var(--color-text);
}

.nav-item.has-dropdown {
  position: relative;
}

.nav-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 20;
  margin: 0.5rem 0 0;
  padding: 0.5rem;
  min-width: 14rem;
  list-style: none;
  background: var(--color-surface);
  border: var(--border-subtle);
  box-shadow: var(--shadow-soft);
  opacity: 0;
  visibility: hidden;
  transform: translateY(0.25rem);
  transition: opacity 160ms ease, transform 160ms ease, visibility 160ms ease;
}

.nav-item.has-dropdown:hover .nav-dropdown,
.nav-item.has-dropdown:focus-within .nav-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.nav-dropdown li + li {
  margin-top: 0.15rem;
}

.nav-dropdown a {
  display: block;
  padding: 0.5rem 0.6rem;
  white-space: nowrap;
  text-decoration: none;
  color: var(--color-muted);
}

.nav-dropdown a:hover {
  color: var(--color-text);
  background: var(--color-strong-surface);
}

.site-footer {
  padding: 1rem 0 3rem;
}

.footer-copy {
  max-width: 32rem;
  color: var(--color-muted);
}

.section {
  padding: var(--section-space) 0;
}

.eyebrow {
  margin: 0 0 1rem;
  color: var(--color-accent);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.section-title,
.display-title {
  margin: 0;
  font-family: var(--font-heading);
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.section-title {
  font-size: clamp(2.2rem, 5vw, 4rem);
}

.display-title {
  font-size: clamp(3rem, 8vw, 6.5rem);
}

.lede,
.section-copy {
  color: var(--color-muted);
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  line-height: 1.7;
}

.button-row {
  margin-top: 1.75rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 0.8rem 1.25rem;
  border-radius: 0;
  border: 0;
  text-decoration: none;
  font-weight: 700;
  transition: transform 180ms ease, background-color 180ms ease, border-color 180ms ease;
}

.button:hover {
  transform: translateY(-1px);
}

.button-primary {
  background: var(--color-text);
  color: var(--color-surface);
}

.button-secondary {
  background: var(--color-strong-surface);
  color: var(--color-text);
}

.surface-card {
  background: var(--color-surface);
  border: var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}

@media (max-width: 760px) {
  .header-inner,
  .footer-inner {
    align-items: flex-start;
    flex-direction: column;
  }
}
`;

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
