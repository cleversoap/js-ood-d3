var gulp = require('gulp');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');

gulp.task('browserify', function (callback) {
    gulp.src('lib/js-ood-d3.js')
    .pipe(browserify({
        external: 'js-ood',
        standalone: 'ood.d3'
    }))
    .pipe(gulp.dest('./build'));

    gulp.src('lib/js-ood-d3.css')
    .pipe(gulp.dest('./build'));
});
