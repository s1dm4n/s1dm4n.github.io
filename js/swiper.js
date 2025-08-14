function normalizeCardsHeight() {
  const cards = document.querySelectorAll('.card');
  let maxHeight = 0;

  // Сброс высоты
  cards.forEach(card => card.style.height = 'auto');

  // Находим максимальную высоту
  cards.forEach(card => {
    maxHeight = Math.max(maxHeight, card.offsetHeight);
  });

  // Устанавливаем единую высоту
  cards.forEach(card => {
    card.style.height = `${maxHeight}px`;
  });
}

// Вызов функций
window.addEventListener('load', normalizeCardsHeight);
window.addEventListener('resize', normalizeCardsHeight);

document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: -1,
    freeMode: false,       // Отключаем свободное перетаскивание
    grabCursor: true,      // Курсор "рука" при наведении
    resistance: false,     // Отключаем "упругость" при перетаскивании
    watchSlidesProgress: true,
    touchReleaseOnEdges: true, // Резкое завершение свайпа на границах
    speed: 400,
    freeMode: false,
    // followFinger: false,   // Не следует за пальцем при свайпе
    touchRatio: 1.2,       // Чувствительность свайпа
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      1024: {
        slidesPerView: 2,
      }
    },
    on: {
      init: function () {
        updateCardsOpacity(this);
      },
      slideChange: function () {
        updateCardsOpacity(this);
      },
      resize: function () {
        updateCardsOpacity(this);
      }
    }
  });

  function updateCardsOpacity(swiperInstance) {
    const slides = swiperInstance.slides;
    const isDesktop = window.innerWidth >= 1024;

    // Сначала всем карточкам устанавливаем прозрачность
    document.querySelectorAll('.news-card').forEach(card => {
      card.classList.remove('active');
      card.style.opacity = '0.2';
    });

    // Активная карточка
    slides[swiperInstance.activeIndex].querySelector('.news-card').classList.add('active');
    slides[swiperInstance.activeIndex].querySelector('.news-card').style.opacity = '1';

    // В десктопном режиме активируем и следующую карточку
    if (isDesktop) {
      const nextSlideIndex = swiperInstance.activeIndex + 1;
      if (nextSlideIndex < slides.length) {
        slides[nextSlideIndex].querySelector('.news-card').classList.add('active');
        slides[nextSlideIndex].querySelector('.news-card').style.opacity = '1';
      }
    }
  }
});