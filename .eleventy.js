const { DateTime } = require("luxon");
const slugify = require("@sindresorhus/slugify").default;

module.exports = function(eleventyConfig) {
  // Копирование статики
  eleventyConfig.addPassthroughCopy("src/css");
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

  eleventyConfig.addFilter("dateLong", (dateObj) => {
    if (!dateObj) return "Дата не указана";
    return DateTime.fromJSDate(new Date(dateObj))
      .setLocale("ru")
      .toFormat("d LLLL yyyy");
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