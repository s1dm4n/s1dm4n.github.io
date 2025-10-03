document.addEventListener('DOMContentLoaded', function () {
  // Обрабатываем каждый аккордеон отдельно
  document.querySelectorAll('.accordion').forEach(accordion => {
    const headers = accordion.querySelectorAll('.accordion__collaps-header');
    const wrappers = accordion.querySelectorAll('.accordion__collaps-wrapper');
    const slides = accordion.querySelectorAll('.accordion__slide');

    // Добавляем data-index для связи внутри текущего аккордеона
    headers.forEach((header, index) => {
      header.dataset.index = index;
    });

    // Открываем первый слайд в текущем аккордеоне
    if (wrappers.length > 0) {
      wrappers[0].classList.add('open');
      headers[0].querySelector('.accordion__icon').classList.add('active');
      if (slides.length > 0) slides[0].classList.add('active');
    }

    // Обработчики для текущего аккордеона
    headers.forEach(button => {
      button.addEventListener('click', function () {
        const currentWrapper = this.closest('.accordion__collaps-wrapper');
        const currentIcon = this.querySelector('.accordion__icon');
        const slideIndex = parseInt(this.dataset.index);

        if (currentWrapper.classList.contains('open')) return;

        // Закрываем все слайды в текущем аккордеоне
        wrappers.forEach(wrapper => wrapper.classList.remove('open'));
        headers.forEach(header => {
          header.querySelector('.accordion__icon').classList.remove('active');
        });
        if (slides.length > 0) slides.forEach(slide => slide.classList.remove('active'));

        // Открываем текущий слайд
        currentWrapper.classList.add('open');
        currentIcon.classList.add('active');
        if (slides.length > 0) slides[slideIndex].classList.add('active');
      });
    });
  });
});