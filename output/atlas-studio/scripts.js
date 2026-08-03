(function () {
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
})();

(function () {
  const root = document.querySelector('.back-to-top-link');
  if (!root) return;

  const threshold = 120;
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
})();