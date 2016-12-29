let gulp = require('gulp');
let concat = require('gulp-concat');
let sourcemaps = require('gulp-sourcemaps');
let browserSync = require('browser-sync').create();

gulp.task('scripts', () => {
    gulp.src([
        // App
        "./js/src/app.js",

        // Libs
        "./js/src/var/dom.js",

        // Modules
        "./js/src/modules/TaskList.js",

        // Core/Engine
        "./js/src/core/core.js"
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./js/dist/'));
});

gulp.task('serve', ['scripts'], () => {
    browserSync.init({
        server: './'
    });

    gulp.watch('js/src/**/*.js', ['scripts']);
    gulp.watch('./js/src/**/*js').on('change', browserSync.reload);
    gulp.watch('./*html').on('change', browserSync.reload);
});

// gulp.task('watch', function() {
// });

gulp.task('default', ['serve']);
