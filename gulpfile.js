var gulp = require('gulp');
var browserify = require('gulp-browserify');
var replace = require('gulp-replace');

gulp.task('browserify', function (callback) {
    gulp.src('lib/js-ood-d3.js')
    .pipe(browserify({
        external: ['js-ood', 'd3'],
        ignore: ['js-ood', 'd3'],
        exclude: ['js-ood', 'd3'],
        standalone: 'ood.d3'
    }))
    .pipe(replace(/var ood = _dereq_.*$/gm, ''))
    .pipe(gulp.dest('./build'));

    gulp.src('lib/js-ood-d3.css')
    .pipe(gulp.dest('./build'));
});
