"use strict"

const { src, dest, series, parallel } = require("gulp")
const gulp = require("gulp")
const autoprefixer = require("gulp-autoprefixer")
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require('gulp-strip-css-comments');
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require('sass'));
const cssnano = require("gulp-cssnano");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const panini = require("panini");
const fileinclude = require('gulp-file-include');
const imagemin = require("gulp-imagemin");
const del = require("del");
const notify = require("gulp-notify")
const imagewebp = require("gulp-webp")
const browserSync = require("browser-sync").create();
const webpack = require("webpack-stream");

/* Paths */
const srcPath = "src/"
const distPath = "dist/"

const path = {
    build: {
        html: distPath,
        css: distPath + "assets/css/",
        js: distPath + "assets/js/",
        images: distPath + "assets/img/",
        fonts: distPath + "assets/fonts/",
        video: distPath + "assets/video/"
    },
    src: {
        html: srcPath + "*.html",
        css: srcPath + "assets/css/*.css",  
        js: srcPath + "assets/js/*.js",
        images: srcPath + "assets/img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}"
    },
    watch: {
        html: srcPath + "**/*.html",
        js: srcPath + "assets/js/**/*.js",
        css: srcPath + "assets/css/**/*.css", 
        images: srcPath + "assets/img/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}"
    },
    clean: "./" + distPath
}

function serve(done) {  // ← добавлен done callback
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    });
    done();  // ← сигнализируем завершение
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest(path.build.html))
    .pipe(browserSync.stream());
}
function css() {
    return src(path.src.css, { base: srcPath + "assets/css/" })
        .pipe(plumber({
            errorHandler: notify.onError({
                title: "CSS Error",
                message: "Error: <%= error.message %>"
            })
        }))
        // здесь уже чистый CSS, ничего не компилируем
        .pipe(autoprefixer())
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false,
            discardComments: { removeAll: true }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: ".min",
            extname: ".css"
        }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.stream());
}



function libs() {
   
    return src("src/assets/js/libs/**/*") 
        .pipe(dest("dist/assets/js/libs/"))
        .pipe(browserSync.reload({ stream: true }));
}

function js() {
    return src(path.src.js, { base: srcPath + "assets/js/" })
        .pipe(webpack({
            mode: 'production',
            entry: './src/assets/js/script.js',
            output: {
                filename: 'script.js',
                path: __dirname + '/dist/assets/' + '/js'
            },
            watch: false,

            //devtool: "source-map",

            module: {
                rules: [

                ]
            }
        }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({ stream: true }));
}


function images() {
    return src(path.src.images, { base: srcPath + "assets/img/" })
        .pipe(dest(path.build.images))
        .pipe(browserSync.stream());
}

function webpImages() {
    return src(path.src.images, { base: srcPath + "assets/img/" })
        .pipe(imagewebp())
        .pipe(dest(path.build.images));
}

function clean() {
    return del(path.clean);
}

function watchFiles(done) {  // ← добавлен done callback
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.css, css);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.images, parallel(images, webpImages));
    done();  // ← сигнализируем завершение
}

const build = series(clean, parallel(html, css, libs, js, images, webpImages));
const watch = series(build, parallel(watchFiles, serve));  // исправлено: series вместо parallel

exports.html = html;
exports.css = css;
exports.libs = libs
exports.js = js;
exports.images = images;
exports.webpImages = webpImages;
exports.clean = clean; 

exports.build = build;
exports.watch = watch;
exports.default = watch;
