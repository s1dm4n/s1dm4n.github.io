document.addEventListener('DOMContentLoaded', () => {
    const parallaxImage = document.querySelector('.parallax-image');
    const container = document.querySelector('.integration__cover');
    const parentWidth = 1080; // Ширина родительского контейнера
    let lastScrollTop = 0;
    let animationFrame = null;
    let currentStage = 0; // Текущая стадия: 0 - лево, 1 - центр, 2 - право
  
    const resetImagePosition = () => {
      parallaxImage.style.transform = 'translateX(0)';
      currentStage = 0;
    };
  
    const initializeImagePosition = () => {
      // Начальная фиксация слева
      parallaxImage.style.transform = 'translateX(0)';
      currentStage = 0;
    };
  
    const parallaxScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      const direction = st > lastScrollTop ? 'down' : 'up';
      lastScrollTop = st <= 0 ? 0 : st;
  
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const imageWidth = parallaxImage.offsetWidth;
      const maxScroll = Math.max(0, imageWidth - parentWidth);
  
      // Проверка видимости контейнера
      if (containerRect.bottom < 0 || containerRect.top > viewportHeight) {
        resetImagePosition();
        return;
      }
  
      const containerCenter = containerRect.top + containerRect.height / 2;
      const viewportCenter = viewportHeight / 2;
  
      // Адаптация активной зоны для маленькой высоты контейнера
      const activeZoneStart = viewportCenter - containerRect.height;
      const activeZoneEnd = viewportCenter + containerRect.height;
  
      // Ограничение progress в диапазоне [0, 1]
      const progress = Math.max(0, Math.min(1, (containerCenter - activeZoneStart) / (activeZoneEnd - activeZoneStart)));
  
      console.log('Progress:', progress.toFixed(2), 'Current Stage:', currentStage);
  
      // Логика с учетом направления прокрутки
      if (direction === 'down') {
        // Прокрутка вниз
        if ( progress <= 0.75 && progress >= 0.6 && currentStage === 0) {
          // Переход от левой части к центральной
          const centerOffset = (imageWidth - parentWidth) / 2;
          parallaxImage.style.transform = `translateX(-${centerOffset}px)`;
          currentStage = 1;
        } else if (progress <= 0.45 && currentStage === 1) {
          // Переход от центральной части к правой
          parallaxImage.style.transform = `translateX(-${maxScroll}px)`;
          currentStage = 2;
        }
      } else if (direction === 'up') {
        // Прокрутка вверх
        if (progress <= 0.65 && progress >= 0.35  && currentStage === 2) {
          // Переход от правой части к центральной
          const centerOffset = (imageWidth - parentWidth) / 2;
          parallaxImage.style.transform = `translateX(-${centerOffset}px)`;
          currentStage = 1;
        } else if (progress >= 0.55 && progress <= 0.75 && currentStage === 1) {
          // Переход от центральной части к левой
          parallaxImage.style.transform = 'translateX(0)';
          currentStage = 0;
        }
      }
    };
  
    window.addEventListener('scroll', () => {
      if (!animationFrame) {
        animationFrame = requestAnimationFrame(() => {
          parallaxScroll();
          animationFrame = null;
        });
      }
    }, { passive: true });
  
    // Инициализация начального положения
    initializeImagePosition();
  });
  
  // Инициализация слайдеров
  document.addEventListener('DOMContentLoaded', function () {
    function initSlider(container, startSlide = 0) {
      if (!(container instanceof HTMLElement)) {
        console.error('Container is not a valid DOM element:', container);
        return;
      }
  
      const slider = container.querySelector('.slider');
      if (!slider) {
        console.error('Slider element not found in container:', container);
        return;
      }
  
      const slides = slider.querySelectorAll('.slide');
      const controlButtons = slider.querySelectorAll('.button-radio');
      const prevButton = slider.querySelector('.button-prev');
      const nextButton = slider.querySelector('.button-next');
      const activeSlides = 'slide--active';
      const activeButton = 'active';
  
      let currentSlide = Math.min(startSlide, slides.length - 1);
  
      function updateSlider() {
        slides.forEach((slide, index) => {
          slide.classList.toggle(activeSlides, index === currentSlide);
        });
  
        controlButtons.forEach((button, index) => {
          button.classList.toggle(activeButton, index === currentSlide);
          prevButton.toggleAttribute('aria-disabled', currentSlide === 0);
          nextButton.toggleAttribute('aria-disabled', currentSlide === slides.length - 1);
        });
  
        // Прозрачность для стрелок
        prevButton.style.opacity = currentSlide === 0 ? '0' : '1';
        nextButton.style.opacity = currentSlide === slides.length - 1 ? '0' : '1';
      }
  
      controlButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
          currentSlide = index;
          updateSlider();
        });
      });
  
      prevButton.addEventListener('click', () => {
        if (currentSlide > 0) currentSlide--;
        updateSlider();
      });
  
      nextButton.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) currentSlide++;
        updateSlider();
      });
  
      updateSlider();
    }
  
    // Обработчики для диалогов
    document.querySelectorAll('.openDialogBtn').forEach(btn => {
      btn.addEventListener('click', function () {
        const dialogId = this.dataset.dialog;
        const dialog = document.getElementById(dialogId);
  
        if (!dialog) {
          console.error(`Dialog with id ${dialogId} not found!`);
          return;
        }
  
        // Закрываем все диалоги
        document.querySelectorAll('dialog').forEach(d => d.close());
  
        // Показываем текущий диалог
        dialog.showModal();
  
        // Инициализация слайдера
        const startSlide = parseInt(this.dataset.startSlide) || 0;
        initSlider(dialog, startSlide); // Передаем DOM-элемент
      });
    });
  
    // Закрытие диалогов
    document.querySelectorAll('dialog').forEach(dialog => {
      dialog.addEventListener('click', function (e) {
        if (e.target === dialog || e.target.closest('.closeDialogBtn')) {
          dialog.close();
        }
      });
    });
  });
  
  // Поддержка CSS :has()
  if (!CSS.supports('selector(:has(*))')) {
    document.addEventListener('DOMContentLoaded', function () {
      const dialogs = document.querySelectorAll('dialog');
  
      dialogs.forEach(dialog => {
        dialog.addEventListener('open', () => {
          document.body.style.overflow = 'hidden';
        });
  
        dialog.addEventListener('close', () => {
          document.body.style.overflow = '';
        });
      });
    });
  }
document.addEventListener('DOMContentLoaded', function() {
  // Инициализация всех слайдеров
  function initSlider(container, startSlide = 0) {
      // Проверка, что container - это DOM-элемент
      if (!(container instanceof HTMLElement)) {
          console.error('Container is not a valid DOM element:', container);
          return;
      }

      const slider = container.querySelector('.slider');
      if (!slider) {
          console.error('Slider element not found in container:', container);
          return;
      }

      const slides = slider.querySelectorAll('.slide');
      const controlButtons = slider.querySelectorAll('.button-radio');
      const prevButton = slider.querySelector('.button-prev');
      const nextButton = slider.querySelector('.button-next');
      const activeSlides = 'slide--active';
      const activeButton = 'active';
      let currentSlide = Math.min(startSlide, slides.length - 1);

      function updateSlider() {
          slides.forEach((slide, index) => {
              slide.classList.toggle(activфeSlides, index === currentSlide);
          });

          controlButtons.forEach((button, index) => {
              button.classList.toggle(activeButton, index === currentSlide);
              prevButton.toggleAttribute('aria-disabled', currentSlide === 0);
              nextButton.toggleAttribute('aria-disabled', currentSlide === slides.length - 1);
          });

          // Прозрачность для стрелок
          prevButton.style.opacity = currentSlide === 0 ? '0' : '1';
          nextButton.style.opacity = currentSlide === slides.length - 1 ? '0' : '1';
      }

      controlButtons.forEach((button, index) => {
          button.addEventListener('click', () => {
              currentSlide = index;
              updateSlider();
          });
      });

      prevButton.addEventListener('click', () => {
          if (currentSlide > 0) currentSlide--;
          updateSlider();
      });

      nextButton.addEventListener('click', () => {
          if (currentSlide < slides.length - 1) currentSlide++;
          updateSlider();
      });

      updateSlider();
  }

  // Обработчики для диалогов
  document.querySelectorAll('.openDialogBtn').forEach(btn => {
      btn.addEventListener('click', function() {
          const dialogId = this.dataset.dialog;
          const dialog = document.getElementById(dialogId);
          
          if (!dialog) {
              console.error(`Dialog with id ${dialogId} not found!`);
              return;
          }

          // Закрываем все диалоги
          document.querySelectorAll('dialog').forEach(d => d.close());
          
          // Показываем текущий диалог
          dialog.showModal();
          
          // Инициализация слайдера
          const startSlide = parseInt(this.dataset.startSlide) || 0;
          initSlider(dialog, startSlide); // Передаем DOM-элемент
      });
  });

  // Закрытие диалогов
  document.querySelectorAll('dialog').forEach(dialog => {
      dialog.addEventListener('click', function(e) {
          if (e.target === dialog || e.target.closest('.closeDialogBtn')) {
              dialog.close();
          }
      });
  });
});

if (!CSS.supports('selector(:has(*))')) {
    document.addEventListener('DOMContentLoaded', function() {
        const dialogs = document.querySelectorAll('dialog');
        
        dialogs.forEach(dialog => {
            dialog.addEventListener('open', () => {
                document.body.style.overflow = 'hidden';
            });
            
            dialog.addEventListener('close', () => {
                document.body.style.overflow = '';
            });
        });
    });
}
