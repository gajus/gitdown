var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    eslint = require('gulp-eslint'),
    Gitdown = require('./src/');

gulp.task('lint', function () {
    return gulp
        .src(['./src/**/*.js', './tests/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('test', ['lint'], function () {
    return gulp
        .src(['./tests/**/*.js'], {
            read: false
        })
        .pipe(mocha());
});

gulp.task('gitdown', function () {
    var gitdown;

    gitdown = Gitdown.read('./README/README.md');

    return gitdown.write('./README.md');
});

gulp.task('watch', function () {
    gulp.watch(['./src/**/*', './tests/**/*'], ['default']);
    gulp.watch(['./.gitdown/**/*'], ['gitdown']);
});

gulp.task('default', ['test']);
