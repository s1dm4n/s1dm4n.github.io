$('.integration__slider').slick({
    dots: true,
    speed: 600, // Уменьшить скорость для плавности
    slidesToShow: 1,
    slidesToScroll: 1,
    touchThreshold: 30,
    edgeFriction: 0.2, // Увеличить для лучшего скролла
    draggable: true,
    swipe: true,
    swipeToSlide: true,
    touchMove: true,
    arrows: false
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

document.addEventListener('DOMContentLoaded', function () {
    const dialogs = document.querySelectorAll('dialog');

    dialogs.forEach(dialog => {
        const sliderLine = dialog.querySelector('.slider-line');
        const nextBtn = dialog.querySelector('.button-next');
        const prevBtn = dialog.querySelector('.button-prev');

        let startX = 0;
        let endX = 0;

        sliderLine.addEventListener('touchstart', function (e) {
            startX = e.touches[0].clientX;
        });

        sliderLine.addEventListener('touchend', function (e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        function handleSwipe() {
            const deltaX = endX - startX;
            const threshold = 50;

            if (Math.abs(deltaX) > threshold) {
                if (deltaX < 0) {
                    nextBtn.click();
                } else {
                    prevBtn.click();
                }
            }
        }
    });
});