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
