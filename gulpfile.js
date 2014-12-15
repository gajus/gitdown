var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    eslint = require('gulp-eslint'),
    Gitdown = require('./src/gitdown.js');

gulp.task('lint', function () {
    return gulp
        .src(['./src/*.js', './src/helpers/*.js', './tests/*.js', './tests/helpers/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('test', ['lint'], function () {
    return gulp
        .src(['./tests/*.js', './tests/helpers/*.js'], {read: false})
        .pipe(mocha());
});

gulp.task('gitdown', function () {
    var gitdown;

    gitdown = Gitdown.read('.gitdown/README.md');

    return gitdown.write('README.md');
});

gulp.task('watch', function () {
    gulp.watch(['./src/*', './src/helpers/*', './tests/*', './tests/helpers/*'], ['default']);
    gulp.watch(['./.gitdown/*', './.gitdown/helpers/*'], ['gitdown']);
});

gulp.task('default', ['test']);
