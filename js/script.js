document.addEventListener('DOMContentLoaded', () => {
    // 1. Автопрокрутка к элементам с анимацией
    const autoScrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target.dataset.noAutoScroll) return;
            if (window.location.hash && entry.target.id === window.location.hash.slice(1)) return;

            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = true;
                const rect = entry.target.getBoundingClientRect();
                const middlePosition = entry.target.offsetTop - (window.innerHeight / 2) + (rect.height / 2);

                window.scrollTo({
                    top: middlePosition,
                    behavior: 'smooth'
                });
            }
        });
    }, { threshold: 0.1, rootMargin: '0px' });

    // 2. Инициализация слайдеров (обновленная версия)
    const initSlider = (container, startSlide = 0) => {
        if (!(container instanceof HTMLElement)) return;
        
        const slider = container.querySelector('.slider');
        if (!slider) return;

        const slides = slider.querySelectorAll('.slide');
        const controlButtons = slider.querySelectorAll('.button-radio');
        const prevBtn = slider.querySelector('.button-prev');
        const nextBtn = slider.querySelector('.button-next');
        const activeSlides = 'slide--active';
        const activeButton = 'active';
        let currentSlide = Math.min(startSlide, slides.length - 1);

        const updateSlider = () => {
            slides.forEach((slide, index) => {
                slide.classList.toggle(activeSlides, index === currentSlide);
            });

            controlButtons.forEach((button, index) => {
                button.classList.toggle(activeButton, index === currentSlide);
                prevBtn.toggleAttribute('aria-disabled', currentSlide === 0);
                nextBtn.toggleAttribute('aria-disabled', currentSlide === slides.length - 1);
            });

            prevBtn.style.opacity = currentSlide === 0 ? 0 : 1;
            nextBtn.style.opacity = currentSlide === slides.length - 1 ? 0 : 1;
        };

        controlButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
            });
        });

        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) currentSlide--;
            updateSlider();
        });

        nextBtn.addEventListener('click', () => {
            if (currentSlide < slides.length - 1) currentSlide++;
            updateSlider();
        });

        updateSlider();
    };

    // 3. Обработчики диалогов (обновленные)
    document.querySelectorAll('.openDialogBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const dialog = document.getElementById(btn.dataset.dialog);
            if (!dialog) return;

            document.querySelectorAll('dialog[open]').forEach(d => d.close());
            dialog.showModal();
            
            const startSlide = parseInt(btn.dataset.startSlide) || 0;
            initSlider(dialog, startSlide);
        });
    });

    // 4. Обработка закрытия диалогов
    document.querySelectorAll('dialog').forEach(dialog => {
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog || e.target.closest('.closeDialogBtn')) {
                dialog.close();
            }
        });
    });

    // 5. Блокировка скролла для старых браузеров
    if (!CSS.supports('selector(:has(*))')) {
        document.querySelectorAll('dialog').forEach(dialog => {
            dialog.addEventListener('open', () => {
                document.body.style.overflow = 'hidden';
            });
            dialog.addEventListener('close', () => {
                document.body.style.overflow = '';
            });
        });
    }

    // 6. Интеграция с блоком прокрутки
    const integrationSection = document.querySelector('.integration');
    const integrationImage = document.querySelector('.integration__image');
    let position = 0; // 0 - left, 1 - center, 2 - right
  
    // Настройки прокрутки
    const scrollOptions = {
      threshold: 0.5,
      rootMargin: '0px'
    };
  
    // Наблюдатель за видимостью секции
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && position < 2) {
          document.body.style.overflow = 'hidden';
          entry.target.addEventListener('wheel', handleScroll);
        } else {
          document.body.style.overflow = '';
        }
      });
    }, scrollOptions);
  
    observer.observe(integrationSection);
  
    // Обработчик прокрутки
    function handleScroll(e) {
      e.preventDefault();
      
      if (position >= 2) return;
  
      // Определяем направление прокрутки
      if (e.deltaY > 0) {
        position++;
      } else {
        position--;
      }
  
      // Ограничиваем значения
      position = Math.max(0, Math.min(2, position));
  
      // Обновляем позицию изображения
      updateImagePosition();
  
      // Если дошли до конца
      if (position === 2) {
        setTimeout(() => {
          document.body.style.overflow = '';
          integrationSection.removeEventListener('wheel', handleScroll);
        }, 500);
      }
    }
  
    // Обновление позиции изображения
    function updateImagePosition() {
      integrationImage.style.transition = 'object-position 0.5s';
      switch(position) {
        case 0:
          integrationImage.style.objectPosition = 'left';
          break;
        case 1:
          integrationImage.style.objectPosition = 'center';
          break;
        case 2:
          integrationImage.style.objectPosition = 'right';
          break;
      }
    }

});