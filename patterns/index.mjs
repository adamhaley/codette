function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderMedia(media = {}, className = "media-block") {
  const label = escapeHtml(media.label ?? media.alt ?? "Visual");

  if (media.src) {
    return `<figure class="${className}">
      <img src="${escapeHtml(media.src)}" alt="${escapeHtml(media.alt ?? "")}" />
    </figure>`;
  }

  return `<figure class="${className} media-placeholder">
    <span>${label}</span>
  </figure>`;
}

function renderButtons(actions = []) {
  if (!actions.length) {
    return "";
  }

  return `<div class="button-row">${actions
    .map(
      (action) =>
        `<a class="button button-${escapeHtml(action.variant ?? "primary")}" href="${escapeHtml(action.href)}">${escapeHtml(action.label)}</a>`
    )
    .join("")}</div>`;
}

function renderList(items = []) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function sectionAttrs(section) {
  return section.id ? ` id="${escapeHtml(section.id)}"` : "";
}

function styleAttr(styleMap = {}) {
  const entries = Object.entries(styleMap).filter(([, value]) => value !== undefined && value !== null && value !== "");
  if (!entries.length) {
    return "";
  }

  const style = entries
    .map(([name, value]) => `${name}: ${String(value).replaceAll('"', "&quot;")}`)
    .join("; ");

  return ` style="${style}"`;
}

function renderCarouselSlide(slide, index) {
  const captionText = slide.copy || slide.title;
  const caption = captionText
    ? `<div class="codette-carousel-caption">
        <p>${escapeHtml(captionText)}</p>
      </div>`
    : "";

  return `<div class="carousel-item${index === 0 ? " active" : ""}">
    <figure class="carousel-slide">
      ${renderMedia(slide.media, "carousel-media")}
      ${caption}
    </figure>
  </div>`;
}

export const patterns = {
  gradientMasthead(section) {
    return `<header class="gradient-masthead"${sectionAttrs(section)}>
      <div class="container">
        <p class="eyebrow">${escapeHtml(section.eyebrow ?? "")}</p>
        <h1 class="display-title">${escapeHtml(section.title)}</h1>
        <p class="masthead-subheading">${escapeHtml(section.subheading ?? "")}</p>
        ${renderButtons(section.actions)}
      </div>
      <div class="masthead-circle masthead-circle-1"></div>
      <div class="masthead-circle masthead-circle-2"></div>
      <div class="masthead-circle masthead-circle-3"></div>
    </header>`;
  },
  hero(section) {
    return `<section class="section hero-section"${sectionAttrs(section)}>
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
          <h1 class="display-title">${escapeHtml(section.title)}</h1>
          <p class="lede">${escapeHtml(section.copy)}</p>
          ${renderButtons(section.actions)}
        </div>
        <aside class="surface-card hero-panel">
          <p class="hero-panel-kicker">${escapeHtml(section.panel?.kicker)}</p>
          <p class="hero-panel-title">${escapeHtml(section.panel?.title)}</p>
          <ul class="hero-panel-list">${renderList(section.panel?.items)}</ul>
        </aside>
      </div>
    </section>`;
  },
  featureGrid(section) {
    const cards = (section.items ?? [])
      .map(
        (item) => `<article class="surface-card feature-card">
          <p class="feature-index">${escapeHtml(item.kicker)}</p>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.copy)}</p>
        </article>`
      )
      .join("");

    return `<section class="section"${sectionAttrs(section)}>
      <div class="container">
        <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
        <div class="section-heading">
          <h2 class="section-title">${escapeHtml(section.title)}</h2>
          <p class="section-copy">${escapeHtml(section.copy)}</p>
        </div>
        <div class="feature-grid">${cards}</div>
      </div>
    </section>`;
  },
  spotlight(section) {
    const mediaFirst = section.mediaPosition === "left";
    const mediaClass = section.mediaShape === "circle" ? "spotlight-media spotlight-media-circle" : "spotlight-media";

    return `<section class="section"${sectionAttrs(section)}>
      <div class="container spotlight-grid ${mediaFirst ? "spotlight-media-left" : ""}">
        ${renderMedia(section.media, mediaClass)}
        <div class="spotlight-copy">
          <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
          <h2 class="section-title">${escapeHtml(section.title)}</h2>
          <p class="section-copy">${escapeHtml(section.copy)}</p>
          <ul class="bullet-list">${renderList(section.points)}</ul>
          ${renderButtons(section.actions)}
        </div>
      </div>
    </section>`;
  },
  articlePreviewList(section) {
    const items = (section.items ?? [])
      .map(
        (item, index) => `<article class="preview-row">
          ${renderMedia(item.media, "preview-media")}
          <div class="preview-copy">
            <p class="feature-index">${escapeHtml(item.kicker ?? String(index + 1).padStart(2, "0"))}</p>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.copy)}</p>
            ${item.href ? `<a class="preview-link" href="${escapeHtml(item.href)}">${escapeHtml(item.linkLabel ?? "Read more")}</a>` : ""}
          </div>
        </article>`
      )
      .join("");

    return `<section class="section"${sectionAttrs(section)}>
      <div class="container">
        <div class="section-heading">
          <div>
            <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
          </div>
          <p class="section-copy">${escapeHtml(section.copy)}</p>
        </div>
        <div class="preview-list">${items}</div>
      </div>
    </section>`;
  },
  promoPair(section) {
    const items = (section.items ?? [])
      .map(
        (item) => `<article class="promo-card surface-card">
          ${renderMedia(item.media, "promo-media")}
          <div class="promo-copy">
            <p class="eyebrow">${escapeHtml(item.eyebrow ?? "")}</p>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.copy)}</p>
            ${renderButtons(item.actions)}
          </div>
        </article>`
      )
      .join("");

    return `<section class="section"${sectionAttrs(section)}>
      <div class="container">
        <div class="section-heading">
          <div>
            <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
          </div>
          <p class="section-copy">${escapeHtml(section.copy)}</p>
        </div>
        <div class="promo-pair">${items}</div>
      </div>
    </section>`;
  },
  carouselGallery(section) {
    const slides = section.slides ?? [];
    const showIndicators = section.indicators !== false;
    const showControls = section.controls !== false;
    const transition = section.transition ?? "fade";
    const imageFit = section.imageFit === "contain" ? "contain" : "cover";
    const fallbackId = String(section.title ?? "carousel")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const carouselId = `${section.id ?? fallbackId}-carousel`;
    const shellStyle = styleAttr({
      "--carousel-media-height": section.mediaHeight,
      "--carousel-image-fit": imageFit
    });

    return `<section class="section"${sectionAttrs(section)}>
      <div class="container">
        <div class="section-heading">
          <div>
            <p class="eyebrow">${escapeHtml(section.eyebrow ?? "")}</p>
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
          </div>
          <p class="section-copy">${escapeHtml(section.copy ?? "")}</p>
        </div>
        <div id="${escapeHtml(carouselId)}" class="carousel-shell surface-card carousel slide${transition === "fade" ? " carousel-fade" : ""}"${shellStyle} data-bs-touch="true" data-bs-ride="${section.autoplay ? "carousel" : "false"}" data-bs-interval="${escapeHtml(section.interval ?? 5000)}">
          <div class="carousel-viewport">
            <div class="carousel-inner carousel-track" aria-live="polite">
              ${slides.map((slide, index) => renderCarouselSlide(slide, index)).join("")}
            </div>
          ${
            showControls
              ? `<button class="carousel-control-prev codette-carousel-control" type="button" data-bs-target="#${escapeHtml(carouselId)}" data-bs-slide="prev" aria-label="Previous slide">
            <span class="codette-carousel-control-icon" aria-hidden="true">&larr;</span>
          </button>
          <button class="carousel-control-next codette-carousel-control" type="button" data-bs-target="#${escapeHtml(carouselId)}" data-bs-slide="next" aria-label="Next slide">
            <span class="codette-carousel-control-icon" aria-hidden="true">&rarr;</span>
          </button>`
              : ""
          }
          </div>
          ${
            showIndicators
              ? `<div class="carousel-indicators codette-carousel-indicators">
            ${slides
              .map(
                (_, index) =>
                  `<button class="carousel-indicator${index === 0 ? " active" : ""}" type="button" data-bs-target="#${escapeHtml(carouselId)}" data-bs-slide-to="${index}" aria-label="Go to slide ${index + 1}" ${index === 0 ? 'aria-current="true"' : ""}></button>`
              )
              .join("")}
          </div>`
              : ""
          }
        </div>
      </div>
    </section>`;
  },
  splitContent(section) {
    return `<section class="section"${sectionAttrs(section)}>
      <div class="container split-grid">
        <div>
          <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
          <h2 class="section-title">${escapeHtml(section.title)}</h2>
        </div>
        <div class="split-body">
          <p class="section-copy">${escapeHtml(section.copy)}</p>
          <ul class="bullet-list">${renderList(section.points)}</ul>
        </div>
      </div>
    </section>`;
  },
  quoteBand(section) {
    return `<section class="section"${sectionAttrs(section)}>
      <div class="container">
        <blockquote class="surface-card quote-band">
          <p class="quote-text">${escapeHtml(section.quote)}</p>
          <footer class="quote-attribution">${escapeHtml(section.attribution)}</footer>
        </blockquote>
      </div>
    </section>`;
  },
  cta(section) {
    return `<section class="section"${sectionAttrs(section)}>
      <div class="container">
        <div class="surface-card cta-band">
          <div>
            <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
            <p class="section-copy">${escapeHtml(section.copy)}</p>
          </div>
          ${renderButtons(section.actions)}
        </div>
      </div>
    </section>`;
  },
  signupBand(section) {
    return `<section class="section"${sectionAttrs(section)}>
      <div class="container">
        <div class="signup-band surface-card">
          <div>
            <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
            <p class="section-copy">${escapeHtml(section.copy)}</p>
          </div>
          <form class="signup-form" action="${escapeHtml(section.formAction ?? "#")}" method="post">
            <label class="sr-only" for="${escapeHtml(section.formId ?? "signup-email")}">Email</label>
            <input id="${escapeHtml(section.formId ?? "signup-email")}" type="email" name="email" placeholder="${escapeHtml(section.placeholder ?? "Email address")}" />
            <button class="button button-primary" type="submit">${escapeHtml(section.buttonLabel ?? "Join")}</button>
          </form>
        </div>
      </div>
    </section>`;
  },
  contactCards(section) {
    const cards = (section.items ?? [])
      .map(
        (item) => `<article class="surface-card contact-card">
          <p class="contact-kicker">${escapeHtml(item.label)}</p>
          <p class="contact-value">${item.href ? `<a href="${escapeHtml(item.href)}">${escapeHtml(item.value)}</a>` : escapeHtml(item.value)}</p>
        </article>`
      )
      .join("");

    return `<section class="section"${sectionAttrs(section)}>
      <div class="container">
        <div class="section-heading">
          <div>
            <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
          </div>
          <p class="section-copy">${escapeHtml(section.copy)}</p>
        </div>
        <div class="contact-grid">${cards}</div>
      </div>
    </section>`;
  }
};

const backToTopIcons = {
  triangle:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 3L15 11H0L7.5 3Z"/></svg>',
  arrow:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0L9.4.6.8 9.1 2 10.3l7.1-7.1V20h1.7V3.3l7.1 7.1 1.2-1.2L10.6.6 10 0Z"/></svg>',
  chevron:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 6 4 14h4v4h8v-4h4z"/></svg>',
  caret:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4 2 14h16z"/></svg>'
};

export function validateUtilities(utilities) {
  for (const name of Object.keys(utilities)) {
    if (!utilityRegistry[name]) {
      throw new Error(`Unknown utility: ${name}`);
    }
  }
}

export function renderUtilities(utilities) {
  return Object.entries(utilities)
    .map(([name, config]) => {
      const renderer = utilityRegistry[name];
      return renderer && config?.enabled !== false ? renderer(config) : "";
    })
    .join("\n");
}

export function collectPatternScripts(sections) {
  void sections;
  return "";
}

export const utilityRegistry = {
  backToTop(config = {}) {
    const variant = config.iconVariant ?? "arrow";
    const icon = backToTopIcons[variant] ?? backToTopIcons.arrow;

    return `<div class="back-to-top-link" data-threshold="${escapeHtml(config.threshold ?? 100)}">
      <a href="#top" aria-label="${escapeHtml(config.ariaLabel ?? "Back to top")}">
        ${icon}
      </a>
    </div>`;
  }
};

export const utilityScripts = {
  backToTop(config = {}) {
    return `(function () {
  const root = document.querySelector('.back-to-top-link');
  if (!root) return;

  const threshold = ${Number(config.threshold ?? 100)};
  const link = root.querySelector('a');
  let hideTimer;

  function syncBackToTop() {
    if (window.scrollY > threshold) {
      root.classList.add('in');
      clearTimeout(hideTimer);
      requestAnimationFrame(() => root.classList.add('visible'));
      return;
    }

    root.classList.remove('visible');
    hideTimer = window.setTimeout(() => root.classList.remove('in'), 180);
  }

  link.addEventListener('click', function (event) {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', syncBackToTop, { passive: true });
  syncBackToTop();
})();`;
  }
};

export const patternStyles = `
.hero-grid,
.split-grid,
.section-heading,
.cta-band,
.spotlight-grid,
.signup-band {
  display: grid;
  gap: 2rem;
}

.hero-grid,
.split-grid {
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: start;
}

.hero-copy {
  grid-column: span 7;
}

.hero-copy .lede {
  max-width: 40rem;
  margin: 1.5rem 0 2rem;
}

.hero-panel {
  grid-column: 9 / span 4;
  padding: 1.5rem;
  margin-top: 1rem;
}

.hero-panel-kicker,
.feature-index {
  margin: 0 0 0.75rem;
  color: var(--color-accent);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-panel-title {
  margin: 0 0 1rem;
  font-family: var(--font-heading);
  font-size: 1.35rem;
}

.hero-panel-list,
.bullet-list {
  margin: 0;
  padding-left: 1.2rem;
  color: var(--color-muted);
  line-height: 1.7;
}

.section-heading {
  grid-template-columns: 1.4fr 1fr;
  margin-bottom: 2rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.spotlight-grid {
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: center;
}

.spotlight-media,
.spotlight-copy {
  grid-column: span 6;
}

.spotlight-media {
  order: 2;
}

.spotlight-copy {
  order: 1;
}

.spotlight-media-left .spotlight-media {
  order: 1;
}

.spotlight-media-left .spotlight-copy {
  order: 2;
}

.media-placeholder {
  min-height: 25rem;
  border: var(--border-subtle);
  border-radius: var(--radius-lg);
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.6), transparent 35%),
    linear-gradient(135deg, var(--color-strong-surface), var(--color-surface));
  display: grid;
  place-items: end start;
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
}

.media-placeholder span {
  display: inline-block;
  padding: 0.55rem 0.8rem;
  border-radius: 0;
  background: rgba(255, 255, 255, 0.72);
  color: var(--color-text);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.feature-card {
  padding: 1.5rem;
}

.feature-card h3 {
  margin: 0 0 0.75rem;
  font-family: var(--font-heading);
  font-size: 1.4rem;
}

.feature-card p {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.7;
}

.split-grid > :first-child {
  grid-column: span 5;
}

.split-body {
  grid-column: 7 / span 5;
}

.preview-list {
  display: grid;
  gap: 1.5rem;
}

.preview-row,
.promo-card {
  display: grid;
  grid-template-columns: minmax(0, 18rem) minmax(0, 1fr);
  gap: 1.25rem;
  align-items: stretch;
}

.preview-row {
  padding-bottom: 1.5rem;
  border-bottom: var(--border-subtle);
}

.preview-media,
.promo-media {
  min-height: 14rem;
}

.preview-copy,
.promo-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.preview-copy h3,
.promo-copy h3 {
  margin: 0 0 0.75rem;
  font-family: var(--font-heading);
  font-size: 1.7rem;
}

.preview-copy p,
.promo-copy p {
  color: var(--color-muted);
  line-height: 1.7;
}

.preview-link {
  font-weight: 700;
  text-decoration: none;
}

.promo-pair,
.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
}

.carousel-shell {
  --carousel-media-height: clamp(18rem, 42vw, 26rem);
  position: relative;
  overflow: hidden;
  padding: 1.5rem 1.5rem 3.75rem;
}

.carousel-viewport {
  position: relative;
}

.carousel-track {
  position: relative;
  overflow: hidden;
}

.carousel-slide {
  display: grid;
  gap: 1.25rem;
  margin: 0;
}

.carousel-item {
  position: relative;
  display: none;
  float: left;
  width: 100%;
  margin-right: -100%;
  backface-visibility: hidden;
  transition: transform 0.6s ease-in-out;
}

.carousel-item.active,
.carousel-item-next,
.carousel-item-prev {
  display: block;
}

.carousel-item-next:not(.carousel-item-start),
.active.carousel-item-end {
  transform: translateX(100%);
}

.carousel-item-prev:not(.carousel-item-end),
.active.carousel-item-start {
  transform: translateX(-100%);
}

.carousel-fade .carousel-item {
  opacity: 0;
  transition-property: opacity;
  transform: none;
}

.carousel-fade .carousel-item.active,
.carousel-fade .carousel-item-next.carousel-item-start,
.carousel-fade .carousel-item-prev.carousel-item-end {
  z-index: 1;
  opacity: 1;
}

.carousel-fade .active.carousel-item-start,
.carousel-fade .active.carousel-item-end {
  z-index: 0;
  opacity: 0;
}

.carousel-media {
  margin: 0;
  min-height: var(--carousel-media-height);
  height: var(--carousel-media-height);
}

.carousel-media img,
.carousel-media.media-placeholder {
  width: 100%;
  min-height: var(--carousel-media-height);
  height: var(--carousel-media-height);
  object-fit: var(--carousel-image-fit, cover);
  border-radius: var(--radius-md);
}

.codette-carousel-caption {
  max-width: 38rem;
  min-height: 3.5rem;
  margin: 0 auto;
  text-align: center;
}

.codette-carousel-caption p {
  margin: 0;
  color: var(--color-muted);
  line-height: 1.7;
}

.carousel-indicator,
.codette-carousel-control {
  border: 0;
  cursor: pointer;
}

.codette-carousel-control {
  position: absolute;
  top: calc(var(--carousel-media-height) / 2);
  transform: translateY(-50%);
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-text) 88%, transparent);
  color: var(--color-surface);
  display: grid;
  place-items: center;
  z-index: 2;
  opacity: 1;
}

.carousel-control-prev.codette-carousel-control {
  left: 1rem;
}

.carousel-control-next.codette-carousel-control {
  right: 1rem;
}

.codette-carousel-control:focus,
.codette-carousel-control:active {
  color: var(--color-surface);
}

.codette-carousel-control:hover {
  color: var(--color-accent);
}

.codette-carousel-control-icon {
  font-size: 1rem;
  line-height: 1;
}

.codette-carousel-indicators {
  position: absolute;
  left: 50%;
  bottom: 1rem;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.carousel-indicator {
  width: 2rem;
  height: 0.8rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-text) 18%, transparent);
  opacity: 1;
}

.carousel-indicator.active,
.carousel-indicator.is-active {
  background: var(--color-accent);
}

.promo-card {
  overflow: hidden;
}

.promo-media {
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
}

.promo-copy {
  padding: 1.5rem 1.5rem 1.5rem 0;
}

.quote-band {
  padding: 2.5rem;
}

.quote-text {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 4vw, 3rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
}

.quote-attribution {
  margin-top: 1.5rem;
  color: var(--color-muted);
}

.cta-band {
  grid-template-columns: 1.6fr auto;
  align-items: end;
  padding: 2rem;
}

.signup-band {
  grid-template-columns: 1.3fr 1fr;
  align-items: center;
  padding: 2rem;
}

.signup-form {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.75rem;
}

.signup-form input {
  min-height: 3rem;
  padding: 0.85rem 1rem;
  border: var(--border-subtle);
  border-radius: 0;
  background: rgba(255, 255, 255, 0.72);
  color: var(--color-text);
}

.contact-card {
  padding: 1.5rem;
}

.contact-kicker {
  margin: 0 0 0.8rem;
  color: var(--color-accent);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.contact-value,
.contact-value a {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: 1.3rem;
  text-decoration: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.gradient-masthead {
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: calc(var(--section-space) * 1.5) 0 var(--section-space);
  background: linear-gradient(0deg, var(--color-accent-2, var(--color-accent)) 0%, var(--color-accent) 100%);
  color: #fff;
}

.gradient-masthead .container {
  position: relative;
  z-index: 1;
}

.gradient-masthead .eyebrow {
  color: rgba(255, 255, 255, 0.85);
}

.gradient-masthead .display-title {
  color: inherit;
}

.gradient-masthead .masthead-subheading {
  margin: 0.5rem 0 2rem;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: clamp(1.4rem, 3.5vw, 2.5rem);
  color: rgba(255, 255, 255, 0.92);
}

.gradient-masthead .button-row {
  justify-content: center;
}

.gradient-masthead .button-primary {
  background: #fff;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.masthead-circle {
  position: absolute;
  z-index: 0;
  border-radius: 50%;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.04) 100%);
}

.masthead-circle-1 {
  width: 70rem;
  height: 70rem;
  left: -30rem;
  bottom: -42rem;
}

.masthead-circle-2 {
  width: 38rem;
  height: 38rem;
  right: -14rem;
  top: -18rem;
}

.masthead-circle-3 {
  width: 18rem;
  height: 18rem;
  right: 8%;
  bottom: -6rem;
}

.spotlight-media-circle {
  width: min(100%, 26rem);
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  min-height: 0;
}

.spotlight-media-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 960px) {
  .masthead-circle-1 {
    width: 40rem;
    height: 40rem;
    left: -18rem;
    bottom: -24rem;
  }

  .masthead-circle-2,
  .masthead-circle-3 {
    display: none;
  }


  .hero-copy,
  .hero-panel,
  .spotlight-media,
  .spotlight-copy,
  .split-grid > :first-child,
  .split-body {
    grid-column: 1 / -1;
  }

  .feature-grid,
  .section-heading,
  .cta-band,
  .signup-band,
  .promo-pair,
  .contact-grid,
  .signup-form,
  .preview-row,
  .promo-card {
    grid-template-columns: 1fr;
  }

  .promo-media {
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }

  .promo-copy {
    padding: 0 1.5rem 1.5rem;
  }

  .codette-carousel-control {
    top: calc(var(--carousel-media-height) / 2);
  }
}
`;

export const utilityStyles = `
.back-to-top-link {
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  display: none;
  z-index: 30;
  opacity: 0;
  transform: translateY(0.35rem);
  transition: opacity 180ms ease, transform 180ms ease;
}

.back-to-top-link.in {
  display: block;
}

.back-to-top-link.visible {
  opacity: 1;
  transform: translateY(0);
}

.back-to-top-link a {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-text) 86%, transparent);
  box-shadow: var(--shadow-soft);
}

.back-to-top-link svg {
  width: 1rem;
  height: 1rem;
}

.back-to-top-link path {
  fill: var(--color-surface);
  transition: fill 180ms ease;
}

.back-to-top-link:hover path {
  fill: var(--color-accent);
}
`;

const carouselScript = `(function () {
  const carousels = document.querySelectorAll('[data-carousel]');
  if (!carousels.length) return;

  carousels.forEach(function (root) {
    const slides = Array.from(root.querySelectorAll('.carousel-slide'));
    if (!slides.length) return;
    const indicators = Array.from(root.querySelectorAll('[data-carousel-indicator]'));
    const nextButton = root.querySelector('[data-carousel-next]');
    const prevButton = root.querySelector('[data-carousel-prev]');
    const autoplay = root.dataset.autoplay === 'true';
    const interval = Number(root.dataset.interval || 5000);
    let activeIndex = 0;
    let timerId = null;

    function render(index) {
      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        const isActive = slideIndex === activeIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      indicators.forEach(function (indicator, indicatorIndex) {
        const isActive = indicatorIndex === activeIndex;
        indicator.classList.toggle('is-active', isActive);
        indicator.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    function stopAutoplay() {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    function startAutoplay() {
      if (!autoplay || slides.length < 2) return;
      stopAutoplay();
      timerId = window.setInterval(function () {
        render(activeIndex + 1);
      }, interval);
    }

    indicators.forEach(function (indicator) {
      indicator.addEventListener('click', function () {
        render(Number(indicator.dataset.carouselIndicator));
        startAutoplay();
      });
    });

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        render(activeIndex + 1);
        startAutoplay();
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        render(activeIndex - 1);
        startAutoplay();
      });
    }

    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);

    render(0);
    startAutoplay();
  });
})();`;
