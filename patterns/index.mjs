function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function resolveAssetPath(src) {
  return /^(https?:|data:|\/)/.test(src) ? src : `/${src}`;
}

function renderMedia(media = {}, className = "media-block") {
  const label = escapeHtml(media.label ?? media.alt ?? "Visual");

  if (media.src) {
    return `<figure class="${className}">
      <img src="${escapeHtml(resolveAssetPath(media.src))}" alt="${escapeHtml(media.alt ?? "")}" />
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
    const eyebrowText = escapeHtml(section.eyebrow ?? "");
    const eyebrow = section.eyebrowHref
      ? `<a class="eyebrow masthead-eyebrow-link" href="${escapeHtml(section.eyebrowHref)}">${eyebrowText}</a>`
      : `<p class="eyebrow">${eyebrowText}</p>`;

    return `<header class="gradient-masthead"${sectionAttrs(section)}>
      <div class="container">
        ${eyebrow}
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
    const panel = section.panel
      ? `<aside class="surface-card hero-panel">
          <p class="hero-panel-kicker">${escapeHtml(section.panel?.kicker)}</p>
          <p class="hero-panel-title">${escapeHtml(section.panel?.title)}</p>
          <ul class="hero-panel-list">${renderList(section.panel?.items)}</ul>
        </aside>`
      : "";

    const align = section.align === "right" ? " hero-align-right" : "";

    return `<section class="section hero-section"${sectionAttrs(section)}>
      <div class="container hero-grid${section.panel ? "" : " hero-grid-solo"}${align}">
        <div class="hero-copy">
          <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
          <h1 class="display-title">${escapeHtml(section.title)}${
            section.accent ? `<span class="text-accent">${escapeHtml(section.accent)}</span>` : ""
          }</h1>
          <p class="lede">${escapeHtml(section.copy)}</p>
          ${renderButtons(section.actions)}
        </div>
        ${panel}
      </div>
    </section>`;
  },
  featureGrid(section) {
    const cards = (section.items ?? [])
      .map(
        (item) => `<article class="surface-card feature-card">
          ${item.kicker ? `<p class="feature-index">${escapeHtml(item.kicker)}</p>` : ""}
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.copy)}</p>
          ${item.href ? `<a class="preview-link" href="${escapeHtml(item.href)}">${escapeHtml(item.linkLabel ?? "Learn more")}</a>` : ""}
        </article>`
      )
      .join("");

    return `<section class="section"${sectionAttrs(section)}>
      <div class="container">
        <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
        <div class="section-heading">
          <div>
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
            <p class="section-copy">${escapeHtml(section.copy)}</p>
          </div>
          ${renderButtons(section.actions)}
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
  gallery(section) {
    const layout = section.layout === "thumbnails" ? "thumbnailGallery" : "carouselGallery";
    const items = section.items ?? section.slides ?? [];
    const normalized =
      layout === "carouselGallery" ? { ...section, slides: items } : { ...section, items };

    return patterns[layout](normalized);
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
          ${renderButtons(section.actions)}
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
  thumbnailGallery(section) {
    const items = section.items ?? [];
    const fallbackId = String(section.title ?? "gallery")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const galleryId = `${section.id ?? fallbackId}-lightbox`;

    const thumbnails = items
      .map((item, index) => {
        const src = escapeHtml(resolveAssetPath(item.media?.src ?? ""));
        const alt = escapeHtml(item.media?.alt ?? item.title ?? "");
        const caption = escapeHtml([item.title, item.copy].filter(Boolean).join(" — "));

        return `<button class="thumbnail-item" type="button" data-gallery-index="${index}" data-caption="${caption}">
          <img src="${src}" alt="${alt}" loading="lazy" />
        </button>`;
      })
      .join("");

    return `<section class="section"${sectionAttrs(section)}>
      <div class="container">
        <div class="section-heading">
          <div>
            <p class="eyebrow">${escapeHtml(section.eyebrow ?? "")}</p>
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
          </div>
          <p class="section-copy">${escapeHtml(section.copy ?? "")}</p>
          ${renderButtons(section.actions)}
        </div>
        <div class="thumbnail-grid" data-thumbnail-gallery>${thumbnails}</div>
        <dialog id="${escapeHtml(galleryId)}" class="gallery-modal" data-gallery-modal aria-label="Image viewer">
          <div class="gallery-modal-inner">
            <button class="gallery-modal-close" type="button" data-gallery-close aria-label="Close">&times;</button>
            <button class="gallery-modal-nav gallery-modal-prev" type="button" data-gallery-prev aria-label="Previous image">&larr;</button>
            <figure class="gallery-modal-figure">
              <img data-gallery-modal-img src="" alt="" />
              <figcaption data-gallery-modal-caption></figcaption>
            </figure>
            <button class="gallery-modal-nav gallery-modal-next" type="button" data-gallery-next aria-label="Next image">&rarr;</button>
          </div>
        </dialog>
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
  },
  contactForm(section) {
    const formId = section.formId ?? "contact-form";

    return `<section class="section"${sectionAttrs(section)}>
      <div class="container">
        <div class="section-heading">
          <div>
            <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
          </div>
          <p class="section-copy">${escapeHtml(section.copy)}</p>
        </div>
        <form class="contact-form surface-card" action="${escapeHtml(section.formAction ?? "#")}" method="post">
          <div class="contact-form-row">
            <label for="${escapeHtml(formId)}-name">Name</label>
            <input id="${escapeHtml(formId)}-name" type="text" name="name" placeholder="${escapeHtml(section.namePlaceholder ?? "Your name")}" required />
          </div>
          <div class="contact-form-row">
            <label for="${escapeHtml(formId)}-email">Email</label>
            <input id="${escapeHtml(formId)}-email" type="email" name="email" placeholder="${escapeHtml(section.emailPlaceholder ?? "you@example.com")}" required />
          </div>
          <div class="contact-form-row">
            <label for="${escapeHtml(formId)}-message">Message</label>
            <textarea id="${escapeHtml(formId)}-message" name="message" rows="5" placeholder="${escapeHtml(section.messagePlaceholder ?? "What are you trying to build?")}" required></textarea>
          </div>
          <button class="button button-primary" type="submit">${escapeHtml(section.buttonLabel ?? "Send Message")}</button>
        </form>
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

const chatIcons = {
  send: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M2 10 18 2l-5 16-3-6-6-2Z"/></svg>',
  // Font Awesome Free "comments" (solid), used to match ahmedia.ai's live reopen-chat icon
  comments:
    '<svg viewBox="0 0 640 512" aria-hidden="true"><path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2s0 0 0 0s0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.2-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9c0 0 0 0 0 0s0 0 0 0l-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z"/></svg>',
  close:
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 4l12 12M16 4 4 16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
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
  const scripts = [];

  if (
    sections.some(
      (section) =>
        section.pattern === "thumbnailGallery" ||
        (section.pattern === "gallery" && section.layout === "thumbnails")
    )
  ) {
    scripts.push(thumbnailGalleryScript);
  }

  return scripts.join("\n\n").trim();
}

export const utilityRegistry = {
  backToTop(config = {}) {
    const variant = config.iconVariant ?? "arrow";
    const icon = backToTopIcons[variant] ?? backToTopIcons.arrow;
    const position = config.position === "left" ? "left" : "right";

    return `<div class="back-to-top-link" data-threshold="${escapeHtml(config.threshold ?? 100)}" data-position="${position}">
      <a href="#top" aria-label="${escapeHtml(config.ariaLabel ?? "Back to top")}">
        ${icon}
      </a>
    </div>`;
  },
  chatWidget(config = {}) {
    const ariaLabel = escapeHtml(config.ariaLabel ?? "Open chat");

    return `<div class="chat-widget">
      <div class="chat-container">
        <button class="chat-close-button" type="button" aria-label="Close chat">${chatIcons.close}</button>
        <div class="chat-messages"></div>
        <div class="chat-input-row">
          <input type="text" class="chat-input" placeholder="Type your message..." />
          <button class="chat-send-button" type="button" aria-label="Send message">${chatIcons.send}</button>
        </div>
      </div>
      <button class="chat-reopen-button" type="button" aria-label="${ariaLabel}">${chatIcons.comments}</button>
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
  },
  chatWidget(config = {}) {
    const endpoint = JSON.stringify(config.endpoint ?? "/api/chat.php");

    return `(function () {
  const root = document.querySelector('.chat-widget');
  if (!root) return;

  const endpoint = ${endpoint};
  const input = root.querySelector('.chat-input');
  const sendButton = root.querySelector('.chat-send-button');
  const messages = root.querySelector('.chat-messages');
  const closeButton = root.querySelector('.chat-close-button');
  const reopenButton = root.querySelector('.chat-reopen-button');

  if (!localStorage.getItem('namespace')) {
    const namespace = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : String(Date.now());
    localStorage.setItem('namespace', namespace);
  }

  function createTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'typing-dot';
      indicator.appendChild(dot);
    }
    return indicator;
  }

  function addMessage(message, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + (isUser ? 'user-message' : 'bot-message');
    const parsed = message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\\n/g, '<br>');
    messageDiv.innerHTML = parsed;
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  function createBotMessageElement() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messages.appendChild(messageDiv);
    return messageDiv;
  }

  function updateBotMessage(messageDiv, content) {
    const escaped = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    messageDiv.textContent = '';
    const lines = escaped.split('\\n');
    lines.forEach(function (line, i) {
      messageDiv.appendChild(
        document.createTextNode(line.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'))
      );
      if (i < lines.length - 1) {
        messageDiv.appendChild(document.createElement('br'));
      }
    });
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage(message) {
    if (!message.trim()) return;

    const namespace = localStorage.getItem('namespace');

    input.disabled = true;
    sendButton.disabled = true;
    addMessage(message, true);

    const typingIndicator = createTypingIndicator();
    messages.appendChild(typingIndicator);
    messages.scrollTop = messages.scrollHeight;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ namespace: namespace, message: message })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';
        let firstChunkReceived = false;

        const botMessageDiv = createBotMessageElement();
        botMessageDiv.style.display = 'none';

        function showFirstContent() {
          if (!firstChunkReceived) {
            firstChunkReceived = true;
            if (typingIndicator && typingIndicator.parentNode) {
              messages.removeChild(typingIndicator);
            }
            botMessageDiv.style.display = '';
          }
        }

        while (true) {
          const result = await reader.read();
          if (result.done) break;

          buffer += decoder.decode(result.value, { stream: true });
          buffer = buffer.replace(/\\}\\s*\\{/g, '}\\n{');
          const lines = buffer.split('\\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.trim()) continue;

            try {
              const parsed = JSON.parse(line);
              if (parsed.type === 'item' && parsed.content) {
                fullContent += parsed.content;
                showFirstContent();
                updateBotMessage(botMessageDiv, fullContent);
              } else if (parsed.progress && parsed.progress.delta) {
                fullContent += parsed.progress.delta;
                showFirstContent();
                updateBotMessage(botMessageDiv, fullContent);
              } else if (parsed.content && !parsed.output) {
                fullContent += parsed.content;
                showFirstContent();
                updateBotMessage(botMessageDiv, fullContent);
              }
            } catch (e) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('{') && trimmed.indexOf('"output"') === -1) {
                fullContent += line;
                showFirstContent();
                updateBotMessage(botMessageDiv, fullContent);
              }
            }
          }
        }

        if (buffer.trim()) {
          const remainingLines = buffer.replace(/\\}\\s*\\{/g, '}\\n{').split('\\n');
          for (const line of remainingLines) {
            if (!line.trim()) continue;

            try {
              const parsed = JSON.parse(line);
              if (parsed.type === 'item' && parsed.content) {
                fullContent += parsed.content;
              } else if (parsed.progress && parsed.progress.delta) {
                fullContent += parsed.progress.delta;
              } else if (parsed.content && !parsed.output) {
                fullContent += parsed.content;
              }
            } catch (e) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('{') && trimmed.indexOf('"output"') === -1) {
                fullContent += line;
              }
            }
          }
          showFirstContent();
          updateBotMessage(botMessageDiv, fullContent);
        }

        const outputIndex = fullContent.indexOf('{"output"');
        if (outputIndex > 0) {
          fullContent = fullContent.substring(0, outputIndex).trim();
        }

        showFirstContent();
        updateBotMessage(botMessageDiv, fullContent.trim() ? fullContent : 'No response received.');
      } else {
        if (typingIndicator && typingIndicator.parentNode) {
          messages.removeChild(typingIndicator);
        }
        const data = await response.json();
        addMessage(data.output, false);
      }

      input.value = '';
    } catch (error) {
      if (typingIndicator && typingIndicator.parentNode) {
        messages.removeChild(typingIndicator);
      }
      addMessage('Failed to send message. Please try again.', false);
    } finally {
      input.disabled = false;
      sendButton.disabled = false;
      input.focus();
    }
  }

  closeButton.addEventListener('click', function () {
    root.classList.remove('is-open');
  });

  reopenButton.addEventListener('click', function () {
    root.classList.add('is-open');
  });

  sendButton.addEventListener('click', function () {
    sendMessage(input.value);
  });

  input.addEventListener('keypress', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input.value);
    }
  });
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

.hero-section {
  /*
   * Adjacent .section elements each carry a full --section-space of
   * padding, so two in a row (hero + whatever follows) stack into an
   * oversized gap. Trim the hero's own bottom padding so that math
   * doesn't double up.
   */
  padding-bottom: calc(var(--section-space) * 0.4);
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

.hero-grid-solo .hero-copy {
  grid-column: 1 / -1;
}

.hero-align-right .hero-copy {
  margin-left: auto;
  max-width: 40rem;
  text-align: right;
}

.hero-align-right .button-row {
  justify-content: flex-end;
}

.text-accent {
  color: var(--color-accent);
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
  margin: 1.25rem 0 0;
  padding-left: 1.2rem;
  color: var(--color-muted);
  line-height: 1.7;
}

.section-heading {
  grid-template-columns: 1.4fr 1fr;
  align-items: start;
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

.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: 1.25rem;
}

.thumbnail-item {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  padding: 0;
  border: 0;
  border-radius: var(--radius-md);
  background: var(--color-strong-surface);
  cursor: pointer;
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 220ms ease;
}

.thumbnail-item:hover img,
.thumbnail-item:focus-visible img {
  transform: scale(1.05);
}

.gallery-modal {
  position: fixed;
  inset: 0;
  max-width: 100vw;
  max-height: 100vh;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: #f5f5f7;
}

.gallery-modal::backdrop {
  background: rgba(8, 8, 10, 0.9);
}

.gallery-modal-inner {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  padding: clamp(1.5rem, 5vw, 4rem);
}

.gallery-modal-figure {
  margin: 0;
  max-width: 100%;
  text-align: center;
}

.gallery-modal-figure img {
  display: block;
  max-width: 100%;
  max-height: 78vh;
  margin: 0 auto;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.gallery-modal-figure figcaption {
  margin-top: 1rem;
  color: rgba(245, 245, 247, 0.8);
  font-size: 0.95rem;
}

.gallery-modal-close,
.gallery-modal-nav {
  position: absolute;
  border: 0;
  border-radius: 999px;
  background: rgba(245, 245, 247, 0.12);
  color: #f5f5f7;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 160ms ease;
}

.gallery-modal-close:hover,
.gallery-modal-nav:hover {
  background: rgba(245, 245, 247, 0.24);
}

.gallery-modal-close {
  top: clamp(1rem, 3vw, 2rem);
  right: clamp(1rem, 3vw, 2rem);
  width: 2.75rem;
  height: 2.75rem;
  font-size: 1.5rem;
  line-height: 1;
}

.gallery-modal-nav {
  top: 50%;
  width: 3rem;
  height: 3rem;
  font-size: 1.25rem;
  transform: translateY(-50%);
}

.gallery-modal-prev {
  left: clamp(0.5rem, 2vw, 1.5rem);
}

.gallery-modal-next {
  right: clamp(0.5rem, 2vw, 1.5rem);
}

@media (max-width: 640px) {
  .gallery-modal-nav {
    width: 2.5rem;
    height: 2.5rem;
  }
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

.contact-form {
  display: grid;
  gap: 1.25rem;
  padding: 2rem;
}

.contact-form-row {
  display: grid;
  gap: 0.5rem;
}

.contact-form-row label {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-muted);
}

.contact-form-row input,
.contact-form-row textarea {
  padding: 0.75rem 1rem;
  border: var(--border-subtle);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  resize: vertical;
}

.contact-form-row input::placeholder,
.contact-form-row textarea::placeholder {
  color: color-mix(in srgb, var(--color-text) 55%, transparent);
}

.contact-form-row input:focus,
.contact-form-row textarea:focus {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.contact-form button {
  justify-self: start;
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

.masthead-eyebrow-link {
  display: inline-block;
  text-decoration: none;
}

.masthead-eyebrow-link::before {
  content: "← ";
}

.masthead-eyebrow-link:hover {
  text-decoration: underline;
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

.back-to-top-link[data-position="left"] {
  left: 1rem;
  right: auto;
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

.chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: min(350px, calc(100vw - 2rem));
  height: min(500px, calc(100vh - 4rem));
  background: var(--color-page-bottom);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-lg, 10px);
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 20%, transparent);
  display: none;
  flex-direction: column;
  overflow: hidden;
  z-index: 2000;
}

.chat-widget.is-open .chat-container {
  display: flex;
}

.chat-widget.is-open .chat-reopen-button {
  display: none;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  padding-top: 50px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.2);
}

.chat-input-row {
  display: flex;
  padding: 15px;
  border-top: 1px solid var(--color-accent);
  background: rgba(0, 0, 0, 0.3);
}

.chat-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid var(--color-accent);
  border-radius: 20px;
  margin-right: 10px;
  font-size: 14px;
  outline: none;
  background: rgba(0, 0, 0, 0.2);
  color: var(--color-text);
}

.chat-input:focus {
  box-shadow: 0 0 10px var(--color-accent);
}

.chat-input::placeholder {
  color: color-mix(in srgb, var(--color-text) 50%, transparent);
}

.chat-send-button,
.chat-reopen-button {
  background: var(--color-accent);
  color: var(--color-page-bottom);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.chat-send-button {
  width: 40px;
  height: 40px;
}

.chat-send-button svg,
.chat-reopen-button svg,
.chat-close-button svg {
  width: 1.1rem;
  height: 1.1rem;
  fill: currentColor;
}

/*
 * The "comments" glyph's viewBox (640x512, 1.25:1) is wider than the
 * square box above, so at the shared size it gets letterboxed and
 * reads visually smaller than the other (square-viewBox) icons.
 * Size it up specifically so it fills the reopen button the same way.
 */
.chat-reopen-button svg {
  width: 1.5rem;
  height: 1.5rem;
}

.chat-send-button:hover,
.chat-reopen-button:hover {
  box-shadow: 0 0 15px var(--color-accent);
}

.chat-reopen-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  box-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 30%, transparent);
  z-index: 2000;
}

.chat-reopen-button:hover {
  transform: scale(1.1);
}

.message {
  margin-bottom: 15px;
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 80%;
  word-wrap: break-word;
}

.user-message {
  background: var(--color-accent);
  color: var(--color-page-bottom);
  margin-left: auto;
}

.bot-message {
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
  color: var(--color-text);
  border: 1px solid var(--color-accent);
}

.chat-close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: var(--color-accent);
  cursor: pointer;
  padding: 5px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 180ms ease, box-shadow 180ms ease;
}

.chat-close-button:hover {
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
  box-shadow: 0 0 10px var(--color-accent);
}

.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.chat-messages::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: 4px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 10px 15px;
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
  border: 1px solid var(--color-accent);
  border-radius: 15px;
  margin-bottom: 15px;
  max-width: 80%;
}

.typing-dot {
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
  animation: typingPulse 1.4s infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingPulse {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .chat-container {
    right: 1rem;
    left: 1rem;
    width: auto;
  }
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

const thumbnailGalleryScript = `(function () {
  const grids = document.querySelectorAll('[data-thumbnail-gallery]');
  if (!grids.length) return;

  grids.forEach(function (grid) {
    const modal = grid.parentElement.querySelector('[data-gallery-modal]');
    if (!modal || typeof modal.showModal !== 'function') return;

    const items = Array.from(grid.querySelectorAll('[data-gallery-index]'));
    const imgEl = modal.querySelector('[data-gallery-modal-img]');
    const captionEl = modal.querySelector('[data-gallery-modal-caption]');
    let activeIndex = 0;

    function show(index) {
      activeIndex = (index + items.length) % items.length;
      const item = items[activeIndex];
      const img = item.querySelector('img');
      imgEl.src = img.getAttribute('src');
      imgEl.alt = img.getAttribute('alt') || '';
      captionEl.textContent = item.dataset.caption || '';
    }

    items.forEach(function (item, index) {
      item.addEventListener('click', function () {
        show(index);
        modal.showModal();
      });
    });

    const closeButton = modal.querySelector('[data-gallery-close]');
    if (closeButton) {
      closeButton.addEventListener('click', function () {
        modal.close();
      });
    }

    const prevButton = modal.querySelector('[data-gallery-prev]');
    if (prevButton) {
      prevButton.addEventListener('click', function () {
        show(activeIndex - 1);
      });
    }

    const nextButton = modal.querySelector('[data-gallery-next]');
    if (nextButton) {
      nextButton.addEventListener('click', function () {
        show(activeIndex + 1);
      });
    }

    modal.addEventListener('click', function (event) {
      if (event.target === modal) {
        modal.close();
      }
    });

    modal.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') show(activeIndex + 1);
      if (event.key === 'ArrowLeft') show(activeIndex - 1);
    });
  });
})();`;
