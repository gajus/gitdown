var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    jshint = require('gulp-jshint'),
    Gitdown = require('./src/gitdown.js');

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
    var gitdown;

    gitdown = Gitdown.read('.gitdown/README.md');

    return gitdown.write('README.md');
});

gulp.task('watch', function () {
    gulp.watch(['./src/*', './src/helpers/*', './tests/*'], ['default']);
    gulp.watch(['./.gitdown/*', './.gitdown/helpers/*'], ['gitdown']);
});

gulp.task('default', ['test']);