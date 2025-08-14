// Инициализация
window.addEventListener('load', updateTexts);
window.addEventListener('resize', updateTexts);

document.addEventListener('DOMContentLoaded', function () {
  const title = document.getElementById('dynamic-title');

  if (!title) {
    console.error('Элемент с id="dynamic-title" не найден!');
    return;
  }

  const mediaQuery = window.matchMedia('(max-width: 352px)');

  function updateTitle(e) {
    title.textContent = e.matches
      ? "Дилеры"
      : "Дистрибьютеры";
  }

  mediaQuery.addListener(updateTitle);
  updateTitle(mediaQuery); // Инициализация
});

document.addEventListener('DOMContentLoaded', function () {
  const sliderImage = document.querySelector('.intro__image');
  const slider = document.querySelector('.intro__slider');
  const slides = document.querySelectorAll('.intro__slide');
  const timerLine = document.querySelector('.intro__timer-line');
  const CENTER_THRESHOLD = 0.4;
  let currentIndex = 0;
  let timerAnimation = null;
  const slideDuration = 8000;
  let isSliderActive = false;
  let lastActiveTime = Date.now();

  // Проверка видимости слайдера
  function isSliderInView() {
    const rect = slider.getBoundingClientRect();
    const sliderCenter = rect.top + rect.height / 2;
    const screenCenter = window.innerHeight / 2;
    return Math.abs(sliderCenter - screenCenter) < window.innerHeight * CENTER_THRESHOLD;
  }

  // Управление состоянием слайдера
  function setSliderState(active) {
    if (active === isSliderActive) return;

    isSliderActive = active;
    const overlay = sliderImage.querySelector('::after') ||
      document.createElement('div'); // Fallback

    if (active) {
      // Активация - убираем затемнение
      slider.style.filter = 'none';
      slider.style.opacity = '1';
      sliderImage.style.setProperty('--overlay-color', 'transparent');
      const elapsed = Date.now() - lastActiveTime;
      const remainingTime = Math.max(0, slideDuration - elapsed);
      startTimer(remainingTime);
    } else {
      // Деактивация - добавляем голубой оттенок
      slider.style.filter = 'grayscale(1)';
      slider.style.opacity = '0.7';
      sliderImage.style.setProperty('--overlay-color', 'rgba(38, 41, 49, 0.6)');
      pauseTimer();
      lastActiveTime = Date.now();
    }
  }

  // Запуск таймера с учетом оставшегося времени
  function startTimer(duration = slideDuration) {
    if (timerAnimation) {
      clearTimeout(timerAnimation);
      timerAnimation = null;
    }

    timerLine.style.transition = 'none';
    timerLine.style.opacity = '1';
    timerLine.style.height = '0';

    requestAnimationFrame(() => {
      timerLine.style.transition = `height ${duration / 1000}s linear`;
      timerLine.style.height = '100%';

      timerAnimation = setTimeout(() => {
        nextSlide();
      }, duration);
    });
  }

  // Пауза таймера
  function pauseTimer() {
    if (!timerAnimation) return;

    clearTimeout(timerAnimation);
    timerAnimation = null;

    // Сохраняем текущий прогресс
    const computedStyle = getComputedStyle(timerLine);
    const currentHeight = parseFloat(computedStyle.height);
    timerLine.style.transition = 'opacity 0.4s';
    timerLine.style.height = `${currentHeight}px`;
    timerLine.style.opacity = '0';
  }

  // Переключение слайдов
  function nextSlide() {
    slides[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add('active');
    resetTimer();
  }

  // Сброс таймера
  function resetTimer() {
    if (timerAnimation) {
      clearTimeout(timerAnimation);
      timerAnimation = null;
    }

    timerLine.style.transition = 'none';
    timerLine.style.height = '0';

    setTimeout(() => {
      if (isSliderActive) {
        startTimer();
      }
    }, 10);
  }

  // Обработчик видимости вкладки
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      pauseTimer();
      lastActiveTime = Date.now();
    } else if (isSliderActive) {
      const elapsed = Date.now() - lastActiveTime;
      const remainingTime = Math.max(0, slideDuration - elapsed);
      startTimer(remainingTime);
    }
  });

  // Проверка состояния
  function checkSliderState() {
    setSliderState(isSliderInView());
  }

  // Оптимизированный обработчик скролла
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        checkSliderState();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  // Наблюдатель за видимостью
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        checkSliderState();
      }
    });
  }, { threshold: 0.4 });

  // Инициализация
  slides[0].classList.add('active');
  observer.observe(slider);
  checkSliderState();
});
