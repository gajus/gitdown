var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    jshint = require('gulp-jshint'),
    gitdown = require('./src/gitdown.js');

gulp.task('lint', function () {
    return gulp
        .src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['lint'], function () {
    return gulp
        .src('./tests/*.js', {read: false})
        .pipe(mocha());
});

gulp.task('gitdown', function (cb) {

});

gulp.task('watch', function () {
    gulp.watch(['./src/*', './src/helpers/*', './tests/*'], ['default']);
    gulp.watch(['./.gitdown/*', './.gitdown/helpers/*'], ['gitdown']);
});

gulp.task('default', ['test']);