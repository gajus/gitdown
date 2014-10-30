var gulp = require('gulp'),
    mocha = require('mocha');

gulp.task('lint', function () {
    return gulp
        .src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['default'], function () {
    return gulp
        .src('tests/*.js', {read: false})
        .pipe(mocha());
});

gulp.task('default', ['lint']);