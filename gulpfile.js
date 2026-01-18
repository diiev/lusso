"use strict";

const { src, dest, series, parallel, watch } = require("gulp");
const gulp = require("gulp");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const cssnano = require("gulp-cssnano");
const plumber = require("gulp-plumber");
const fileinclude = require("gulp-file-include");
const del = require("del");
const notify = require("gulp-notify");
const imagewebp = require("gulp-webp");
const browserSync = require("browser-sync").create();
const webpack = require("webpack-stream");
const postcss = require("gulp-postcss");

/* Paths */
const srcPath = "src/";
const distPath = "dist/";

const path = {
  build: {
    html: distPath,
    css: distPath + "assets/css/",
    js: distPath + "assets/js/",
    images: distPath + "assets/img/",
    fonts: distPath + "assets/fonts/",
    video: distPath + "assets/video/",
  },
  src: {
    html: srcPath + "*.html",
    css: srcPath + "assets/css/*.css",
    js: srcPath + "assets/js/*.js",
    // Исправлено: берем абсолютно всё из папки img, рекурсивно
    images: srcPath + "assets/img/**/*", 
  },
  watch: {
    html: srcPath + "**/*.html",
    js: srcPath + "assets/js/**/*.js",
    css: srcPath + "assets/css/**/*.css",
    images: srcPath + "assets/img/**/*",
  },
  clean: "./" + distPath,
};

function serve(done) {
  browserSync.init({
    server: {
      baseDir: "./" + distPath,
    },
  });
  done();
}

function html() {
  return src(path.src.html)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest(path.build.html))
    .pipe(browserSync.reload({ stream: true }));
}

function css() {
  return src(path.src.css, { base: srcPath + "assets/css/" })
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "CSS Error",
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(postcss())
    .pipe(cssbeautify())
    .pipe(dest(path.build.css))
    .pipe(
      cssnano({
        zindex: false,
        discardComments: { removeAll: true },
      })
    )
    .pipe(removeComments())
    .pipe(
      rename({
        suffix: ".min",
        extname: ".css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({ stream: true }));
}

function libs() {
  return src("src/assets/js/libs/**/*")
    .pipe(dest("dist/assets/js/libs/"))
    .pipe(browserSync.reload({ stream: true }));
}

function js() {
  return src(path.src.js, { base: srcPath + "assets/js/" })
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: "JS Error",
          message: "Error: <%= error.message %>",
        }),
      })
    )
    .pipe(
      webpack({
        mode: "production", // Можно сменить на 'development' для отладки
        entry: "./src/assets/js/script.js",
        output: {
          filename: "script.js",
        },
        module: {
          rules: [],
        },
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browserSync.reload({ stream: true }));
}

// Копирует оригинальные изображения (jpg, png, svg, json и т.д.)
function images() {
  return src(path.src.images)
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));
}


function clean() {
  return del(path.clean);
}

function watchFiles() {
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.css, css);
  gulp.watch(path.watch.js, js);
  // При изменении картинок запускаем копирование и конвертацию
  gulp.watch(path.watch.images, series(images));
}

// Сначала очистка, потом параллельно сборка ассетов, картинки - последовательно (копия -> webp)
const build = series(clean, parallel(html, css, libs, js, series(images)));
const runWatch = parallel(build, watchFiles, serve);

exports.html = html;
exports.css = css;
exports.libs = libs;
exports.js = js;
exports.images = images;

exports.clean = clean;

exports.build = build;
exports.watch = runWatch;
exports.default = runWatch;
