const { src, series, parallel, dest, watch } = require('gulp');
const broswerSync = require('browser-sync').create();
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const cssMinify = require('gulp-clean-css');
const sass = require('gulp-sass')(require('node-sass'));
const autoprefixer = require('autoprefixer');
const imagemin = require('gulp-imagemin');

//source file or folder path
const jsPath = 'src/js/**/*.js';
const scssPath = 'src/scss/**/*.scss';
const htmlPath = 'src/**/*.html';

//dist file or folder path
const minCss = 'dist/assets/css/*.css';

//copy html from src to dist
function copyHtml() {
  return src('src/*.html').pipe(dest('dist'));
}

//copy image from src to dist
function imgTask() {
  return src('src/images/*').pipe(imagemin()).pipe(dest('dist/images'));
}

//scss task
function scssTask() {
  return src(scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(cssMinify())
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/assets/css'))
    .pipe(broswerSync.stream());
}

// //minify css task
// function cssMinify() {
//   return src(minCss)
//     .pipe(sourcemaps.init({ loadMaps: true, largeFile: true }))
//     .pipe(concat('style.min.css'))
//     .pipe(minifyCss())
//     .pipe(sourcemaps.write('./maps/'))
//     .pipe(dest('dist/assets/css'))
//     .pipe(broswerSync.stream());
// }

//js  tasks
function jsTask() {
  return src(jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('script.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/assets/js'))
    .pipe(broswerSync.stream());
}

// watch task for quick broswer reload
function watchTask() {
  broswerSync.init({
    server: {
      baseDir: 'dist',
    },
  });
  watch(scssPath, scssTask).on('change', broswerSync.reload);
  watch(jsPath, jsTask).on('change', broswerSync.reload);
  watch(htmlPath, copyHtml).on('change', broswerSync.reload);
}

// run individual function task
exports.copyHtml = copyHtml;
exports.imgTask = imgTask;
exports.jsTask = jsTask;
exports.scssTask = scssTask;
exports.cssMinify = cssMinify;
exports.watchTask = watchTask;

//run all functions with just gulp
//series is to run the whole tasks
//parallel run certain tasks that are put together in parenthensis
exports.default = series(copyHtml, imgTask, jsTask, scssTask, watchTask);
