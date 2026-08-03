function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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

export const patterns = {
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
  }
};

export const patternStyles = `
.hero-grid,
.split-grid,
.section-heading,
.cta-band {
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

@media (max-width: 960px) {
  .hero-copy,
  .hero-panel,
  .split-grid > :first-child,
  .split-body {
    grid-column: 1 / -1;
  }

  .feature-grid,
  .section-heading,
  .cta-band {
    grid-template-columns: 1fr;
  }
}
`;
