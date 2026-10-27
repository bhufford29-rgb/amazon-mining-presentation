(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const currentLabel = document.getElementById('currentSlide');
  const progressBar = document.getElementById('progressBar');
  const previousButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const fullscreenButton = document.getElementById('fullscreenButton');
  let index = 0;
  let touchStartX = null;

  const clamp = (value) => Math.max(0, Math.min(slides.length - 1, value));

  function render(nextIndex, updateHash = true) {
    const target = clamp(nextIndex);
    if (target === index && slides[target].classList.contains('active')) {
      updateChrome();
      return;
    }

    const previous = slides[index];
    const next = slides[target];
    previous.classList.remove('active');
    previous.classList.add('leaving');
    window.setTimeout(() => previous.classList.remove('leaving'), 700);
    next.classList.add('active');
    index = target;
    updateChrome();

    if (updateHash) history.replaceState(null, '', `#${index + 1}`);
  }

  function updateChrome() {
    currentLabel.textContent = String(index + 1).padStart(2, '0');
    progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
    document.title = `${index + 1}/14 · Illegal Gold Mining in the Amazon`;
    document.body.classList.toggle('light-chrome', [2, 6, 8, 14].includes(index + 1));
  }

  function next() { render(index + 1); }
  function previous() { render(index - 1); }

  document.addEventListener('keydown', (event) => {
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
      event.preventDefault();
      next();
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      previous();
    } else if (event.key === 'Home') {
      event.preventDefault();
      render(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      render(slides.length - 1);
    } else if (event.key.toLowerCase() === 'f') {
      toggleFullscreen();
    }
  });

  document.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 55) distance < 0 ? next() : previous();
    touchStartX = null;
  }, { passive: true });

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (error) {
      console.warn('Fullscreen is unavailable in this browser.', error);
    }
  }

  previousButton.addEventListener('click', previous);
  nextButton.addEventListener('click', next);
  fullscreenButton.addEventListener('click', toggleFullscreen);

  window.addEventListener('hashchange', () => {
    const requested = Number.parseInt(location.hash.slice(1), 10);
    if (Number.isFinite(requested)) render(requested - 1, false);
  });

  const hashSlide = Number.parseInt(location.hash.slice(1), 10);
  index = Number.isFinite(hashSlide) ? clamp(hashSlide - 1) : 0;
  slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === index));
  updateChrome();
})();
