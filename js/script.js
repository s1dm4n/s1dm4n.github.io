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
    
    const textBlocks = document.querySelectorAll(".module__content");
    const mediaElements = document.querySelectorAll(".media");

    function changeMedia(index) {
        mediaElements.forEach(media => {
            media.classList.remove("active");
            if (media.dataset.index == index) {
                media.classList.add("active");
            }
        });
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                changeMedia(entry.target.dataset.index);
            }
        });
    }, { threshold: 0.9 });

    textBlocks.forEach(block => observer.observe(block));
});
  
  document.addEventListener('DOMContentLoaded', function() {
    // Инициализация слайдера для casesDialog
    function initCasesSlider(dialog, startSlide = 0) {
        const slider = dialog.querySelector('.slider');
        if (!slider) return;

        const slides = slider.querySelectorAll('.slide');
        const slidesContainer = slider.querySelector('.slides');
        const controlButtons = slider.querySelectorAll('.button-radio');
        const prevButton = slider.querySelector('.button-prev');
        const nextButton = slider.querySelector('.button-next');
        
        let currentSlide = Math.min(startSlide, slides.length - 1);
        const slideWidth = slides[0].offsetWidth + 88; // Add 88px gap to slide width
        const totalSlides = slides.length;

        // Установка начальной позиции
        slidesContainer.style.transition = 'transform 0.6s';
        updateSliderPosition();

        function updateSliderPosition() {
            slidesContainer.style.transform = `translateX(calc(-${currentSlide * slideWidth}px))`; // Add half gap offset
            
            // Обновление активных кнопок
            controlButtons.forEach((button, index) => {
                button.classList.toggle('active', index === currentSlide);
            });

            // Обновление состояния кнопок навигации
            prevButton.disabled = currentSlide === 0;
            nextButton.disabled = currentSlide === totalSlides - 1;
        }

        // Обработчики для кнопок управления
        controlButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                currentSlide = index;
                updateSliderPosition();
            });
        });

        prevButton.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSliderPosition();
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                updateSliderPosition();
            }
        });
    }

    // Обработчик для открытия диалога casesDialog
    const caseButtons = document.querySelectorAll('[data-dialog="casesDialog"]');
    caseButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const dialog = document.getElementById('casesDialog');
            if (!dialog) return;

            dialog.showModal();
            
            // Инициализация слайдера с указанным начальным слайдом
            const startSlide = parseInt(this.dataset.startSlide) || 0;
            initCasesSlider(dialog, startSlide);
        });
    });

    // Закрытие диалога при клике вне контента
    document.querySelectorAll('dialog').forEach(dialog => {
        dialog.addEventListener('click', function(e) {
            if (e.target === dialog) {
                dialog.close();
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Общая функция инициализации слайдера
    // Общая инициализация для всех слайдеров
function initSlider(dialog, startSlide = 0) {
    const slider = dialog.querySelector('.slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');
    const slidesContainer = slider.querySelector('.slides');
    const prevButton = slider.querySelector('.button-prev');
    const nextButton = slider.querySelector('.button-next');
    
    let currentSlide = Math.min(startSlide, slides.length - 1);
    const slideWidth = slides[0].offsetWidth + 88; // Учитываем gap между слайдами
    const totalSlides = slides.length;

    // Инициализация позиции
    slidesContainer.style.transition = 'transform 0.6s';
    updateSliderPosition();

    function updateSliderPosition() {
        slidesContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        prevButton.disabled = currentSlide === 0;
        nextButton.disabled = currentSlide === totalSlides - 1;
    }

    prevButton.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSliderPosition();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSliderPosition();
        }
    });

    // Реинициализация при изменении размера окна
    window.addEventListener('resize', () => {
        slideWidth = slides[0].offsetWidth + 88;
        updateSliderPosition();
    });
}

    // Обработчики для securitySlider
    const securityButtons = document.querySelectorAll('[data-dialog="securitySlider"]');
    securityButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const dialog = document.getElementById('securitySlider');
            if (!dialog) return;

            dialog.showModal();
            const startSlide = parseInt(this.dataset.startSlide) || 0;
            initSlider(dialog, startSlide);
        });
    });

    // Обработчики для partnersDialog
    const partnerButtons = document.querySelectorAll('[data-dialog="partnersDialog"]');
    partnerButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const dialog = document.getElementById('partnersDialog');
            if (dialog) {
                dialog.showModal();
            }
        });
    });

    // Общая логика закрытия диалогов
    document.querySelectorAll('dialog').forEach(dialog => {
        dialog.addEventListener('click', function(e) {
            if (e.target === dialog) {
                dialog.close();
            }
        });
    });
});