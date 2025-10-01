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

const Image = require("@11ty/eleventy-img");
const path = require("path");

async function imageShortcode(src, alt, sizes = "100vw") {
  if (!alt) {
    throw new Error(`Missing \`alt\` on image: ${src}`);
  }

  let metadata = await Image(src, {
    widths: [null, 2 * 600], // оригинальный размер + @2x
    formats: ["avif", "webp", "jpeg"],
    urlPath: "/img/",
    outputDir: "./_site/img/",
  });

  // Генерация <picture>
  return Image.generateHTML(metadata, {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  });
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode("picture", imageShortcode);
  eleventyConfig.addLiquidShortcode("picture", imageShortcode);
  eleventyConfig.addJavaScriptFunction("picture", imageShortcode);
};
