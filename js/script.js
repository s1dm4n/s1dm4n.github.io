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
        if ( progress <= 0.7 && progress >= 0.6 && currentStage === 0) {
          // Переход от левой части к центральной
          const centerOffset = (imageWidth - parentWidth) / 2;
          parallaxImage.style.transform = `translateX(-${centerOffset}px)`;
          currentStage = 1;
        } else if (progress <= 0.51 && currentStage === 1) {
          // Переход от центральной части к правой
          parallaxImage.style.transform = `translateX(-${maxScroll}px)`;
          currentStage = 2;
        }
      } else if (direction === 'up') {
        // Прокрутка вверх
        if (progress >= 0.52  && currentStage === 2) {
          // Переход от правой части к центральной
          const centerOffset = (imageWidth - parentWidth) / 2;
          parallaxImage.style.transform = `translateX(-${centerOffset}px)`;
          currentStage = 1;
        } else if (progress >= 0.75 && currentStage === 1) {
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
    // Общая функция для любого диалога‑слайдера
    function initSlider(dialog, startSlide = 0) {
      const slider = dialog.querySelector('.slider');
      if (!slider) return;
      const slides         = slider.querySelectorAll('.slide');
      const slidesContainer= slider.querySelector('.slides');
      const prevButton     = slider.querySelector('.button-prev');
      const nextButton     = slider.querySelector('.button-next');
      let currentSlide     = Math.min(startSlide, slides.length - 1);
      let slideWidth       = slides[0].offsetWidth + 88; // gap
  
      function updateSliderPosition() {
        slidesContainer.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        prevButton.disabled = currentSlide === 0;
        nextButton.disabled = currentSlide === slides.length - 1;
      }
  
      slidesContainer.style.transition = 'transform 0.6s';
      updateSliderPosition();
  
      prevButton.addEventListener('click', () => {
        if (currentSlide > 0) {
          currentSlide--;
          updateSliderPosition();
        }
      });
      nextButton.addEventListener('click', () => {
        if (currentSlide < slides.length - 1) {
          currentSlide++;
          updateSliderPosition();
        }
      });
      window.addEventListener('resize', () => {
        slideWidth = slides[0].offsetWidth + 88;
        updateSliderPosition();
      });
    }
  
    // Открытие securityDialog
    document.querySelectorAll('[data-dialog="securitySlider"]').forEach(btn => {
      btn.addEventListener('click', function() {
        const dlg = document.getElementById('securitySlider');
        if (!dlg) return;
        dlg.showModal();
        initSlider(dlg, parseInt(this.dataset.startSlide) || 0);
      });
    });
  
    // Открытие casesDialog
    document.querySelectorAll('[data-dialog="casesDialog"]').forEach(btn => {
      btn.addEventListener('click', function() {
        const dlg = document.getElementById('casesDialog');
        if (!dlg) return;
        dlg.showModal();
        initSlider(dlg, parseInt(this.dataset.startSlide) || 0);
      });
    });
  
    // Закрытие по клику на фон
    document.querySelectorAll('dialog').forEach(dlg => {
      dlg.addEventListener('click', e => {
        if (e.target === dlg) dlg.close();
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

document.addEventListener('DOMContentLoaded', function () {
    const moduleContents = document.querySelectorAll('.module__content[data-index]');
    const moduleConnections = document.querySelectorAll('.module-connection');
    const centralLogo = document.querySelector('.central-logo');
    const modulesBlock = document.querySelector('.modules__videos');

    let lastActiveIndex = null; // Запоминаем последний активный модуль

    function getActiveModuleIndex() {
        let activeIndex = null;
        if (!modulesBlock) return activeIndex;

        const modulesRect = modulesBlock.getBoundingClientRect();
        const moduleCenter = modulesRect.top + modulesRect.height / 2;

        moduleContents.forEach(content => {
            const rect = content.getBoundingClientRect();

            if (rect.top <= moduleCenter && rect.bottom >= moduleCenter) {
                activeIndex = parseInt(content.getAttribute('data-index'));
            }
        });

        return activeIndex;
    }

    function updateActiveModule() {
        let activeIndex = getActiveModuleIndex();

        // Если индекс не изменился, не обновляем состояние
        if (activeIndex === lastActiveIndex || activeIndex === null) return;

        lastActiveIndex = activeIndex;

        moduleConnections.forEach(conn => {
            conn.classList.remove('active', 'inactive', 'reconfigure', 'returning');
        });

        if (activeIndex === 1) {
            return; // На первом блоке все модули в обычном состоянии
        }

        if (activeIndex === 10) {
            moduleConnections.forEach(conn => conn.classList.add('reconfigure'));
            centralLogo.classList.add('active');
            return;
        }

        const targetModule = document.querySelector(`.module-connection[data-index="${activeIndex - 1}"]`);
        if (targetModule) {
            targetModule.classList.add('active');
        }

        centralLogo.classList.remove('active');

        moduleConnections.forEach(conn => {
            if (conn !== targetModule) {
                conn.classList.add('inactive');
            }
        });
    }

    window.addEventListener('scroll', updateActiveModule);
    window.addEventListener('resize', updateActiveModule);
    updateActiveModule();
});

document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('navBurger');
    const side = document.getElementById('sideMenu');
    const close = document.getElementById('sideMenuClose');

    burger.addEventListener('click', () => {
      side.classList.add('active');
      side.setAttribute('aria-hidden', 'false');
    });
    close.addEventListener('click', () => {
      side.classList.remove('active');
      side.setAttribute('aria-hidden', 'true');
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('navBurger');
    const menu = document.getElementById('mobileMenu');

    function updateScrollLock() {
        if (menu.classList.contains('active')) {
            if (window.innerWidth <= 768) {
                document.body.style.overflow = 'hidden'; // Блокируем прокрутку на мобильном
            } else {
                document.body.style.overflow = ''; // Разрешаем прокрутку на планшете и выше
            }
        } else {
            document.body.style.overflow = ''; // Разрешаем в любом случае, если меню закрыто
        }
    }

    function closeMenu() {
        menu.classList.remove('active');
        burger.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Обработка изменения ширины окна
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && menu.classList.contains('active')) {
            closeMenu(); // Закрываем меню при переходе на десктоп
        } else {
            updateScrollLock(); // Синхронизируем скролл
        }
    });

    // Обработка клика по бургеру
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        menu.classList.toggle('active');
        updateScrollLock();
    });

    // Закрытие меню при клике по ссылке в мобильном меню
    document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            burger.classList.remove('open');
            document.body.style.overflow = ''; // или document.documentElement.classList.remove('lock-scroll');
        });
    });
});