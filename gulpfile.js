var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    clean = require('gulp-clean'),
    jshint = require('gulp-jshint'),
    header = require('gulp-header'),
    regenerator = require('gulp-regenerator'),
    jsonfile = require('jsonfile'),
    pkg = jsonfile.readFileSync('package.json');

gulp.task('lint', function () {
    return gulp
        .src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', ['lint'], function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('regenerate', ['lint'], function () {
    return gulp.src('src/' + pkg.name + '.js')
        //.pipe(regenerator({includeRuntime: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('version', ['regenerate'], function () {
    return gulp
        .src('./dist/' + pkg.name + '.js')
        .pipe(header('/**\n * @version <%= version %>\n * @link https://github.com/gajus/<%= name %> for the canonical source repository\n * @license https://github.com/gajus/<%= name %>/blob/master/LICENSE BSD 3-Clause\n */\n', {version: pkg.version, name: pkg.name}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('test', ['version'], function () {
    return gulp
        .src('./tests/*.js', {read: false})
        .pipe(mocha());
});

gulp.task('watch', function () {
    gulp.watch(['./src/*', './src/util/*', './tests/*'], ['default']);
});

gulp.task('default', ['test']);