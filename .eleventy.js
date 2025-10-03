const { DateTime } = require("luxon");
const slugify = require("@sindresorhus/slugify").default;

module.exports = function(eleventyConfig) {
  // Копирование статики
  eleventyConfig.addPassthroughCopy("src/css/style.css");
  eleventyConfig.addPassthroughCopy("src/css/swiper-bundle.min.css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/img");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/modules");
  eleventyConfig.addPassthroughCopy("src/vid");

  // Коллекция новостей
  eleventyConfig.addCollection("news", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/news/*.md");
  });

  // Фильтры
  eleventyConfig.addFilter("date", (dateObj, format = "dd.MM.yyyy") => {
    if (!dateObj) return "Дата не указана";
    return DateTime.fromJSDate(new Date(dateObj)).toFormat(format);
  });

  const { DateTime } = require("luxon");

  eleventyConfig.addFilter("dateLong", (dateObj) => {
    if (!dateObj) return "Дата не указана";

    // Массив месяцев в родительном падеже
    const monthsGenitive = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];

    const dt = DateTime.fromJSDate(new Date(dateObj)).setLocale("ru");
    const day = dt.toFormat("d"); // День
    const month = monthsGenitive[dt.month - 1]; // Месяц в родительном падеже (dt.month начинается с 1)
    const year = dt.toFormat("yyyy"); // Год

    return `${day} ${month} ${year}`;
  });

  eleventyConfig.addFilter("wrapParagraphs", (content) => {
    if (!content) return "";
    return content.replace(/<p>(.*?)<\/p>/g, '<p class="media__paragraph font-main">$1</p>');
  });

  eleventyConfig.addFilter("slug", (str) => slugify(str));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site"
    }
  };
};