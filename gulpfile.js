const {src, dest, watch, parallel, series} = require('gulp');


const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browsersync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');




function scripts() {
  return src([
/*     'node_modules/swiper/swiper-bundle.js', */
    'src/js/main.js',

    /* src(["app/js/*.{js}"], { ignore: "app/js/*.min.{js}" })   " */
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('src/js'))
    .pipe(browsersync.stream())
}

function styles() {
  return src('src/sass/style.sass')
    /* .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']})) */
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(dest('src/css'))
    
    .pipe(browsersync.stream())
}

function watcher() {
  watch(['src/sass/style.sass'], styles)
  watch(['src/js/main.js'], scripts)
  watch(['src/**/*.html']).on('change', browsersync.reload)
}


function browsersyncInit() {
  browsersync.init({
    server: {
      baseDir: "src/"
    }
  });
}

function cleanDist() {
  return src('dist/*')
  .pipe(clean())
}

function building() {
  return src([
    'src/css/style.min.css',
    'src/js/main.min.js',
    'src/**/*.html',
    'src/font/**',
    'src/img/**'
  ], {base : 'src'})
    .pipe(dest('dist'))
}




exports.styles = styles;
exports.scripts = scripts;
exports.watcher = watcher;
exports.browsersyncInit = browsersyncInit;


exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, browsersyncInit, watcher);