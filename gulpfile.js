var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var header = require('gulp-header');
var browserify = require('gulp-browserify');
var eslint = require('gulp-eslint');
var exec = require('gulp-exec');
const fs = require('fs-extra');
const htmlmin = require('gulp-htmlmin');
var packageJSON = null;
var banner = [
    '/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @author <%= pkg.author.name %> - <%= pkg.author.url %>',
    ' * @license <%= pkg.license %>',
    ' */',
    '',
].join('\n');

/**
 * Process HTML files.
 */
function libMarkup() {
    return gulp.src('./src/html/component.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(rename('./src/html/component-min.html'))
        .pipe(gulp.dest('./'));
}

/**
 * Process library CSS files.
 */
function libStyles() {
    return gulp.src('./src/css/component.css')
        .pipe(
            autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false,
            })
        )
        .pipe(cleanCSS())
        .pipe(rename('./src/css/component-min.css'))
        .pipe(gulp.dest('./'));
}

/**
 * Lint library JavaScript files.
 */
function libScriptsLint() {
    return gulp.src('./src/js/mailtoui.js')
        .pipe(eslint())
        .pipe(eslint.format());
}

/**
 * Process library JavaScript files.
 */
function libScripts() {
    return gulp.src('./src/js/mailtoui.js')
        .pipe(minify({ noSource: true }))
        .pipe(header(banner, { pkg: packageJSON }))
        .pipe(gulp.dest('dist'));
}

/**
 * Process docs CSS files.
 */
function docsStyles() {
    return gulp.src('./docs/source/css/mailtoui-docs.css')
        .pipe(cleanCSS())
        .pipe(rename('./docs/assets/css/mailtoui-docs-min.css'))
        .pipe(gulp.dest('./'));
}

/**
 * Lint docs JavaScript files.
 */
function docsScriptsLint() {
    return gulp.src('./docs/source/js/mailtoui-docs.js')
        .pipe(eslint())
        .pipe(eslint.format());
}

/**
 * Process docs JavaScript files.
 */
function docsScripts() {
    return gulp.src('./docs/source/js/mailtoui-docs.js')
        .pipe(minify({ noSource: true }))
        .pipe(browserify())
        .pipe(gulp.dest('./docs/assets/js'));
}

/**
 * Read package.json and update version.js. Both are needed
 * to update the library header and version shown in docs.
 */
function getPackageJSON() {
    packageJSON = fs.readJsonSync('./package.json');

    return gulp.src('./package.json').pipe(exec('genversion version.js'));
}

/**
 * The all seeing eye...
 */
function watchFiles() {
    gulp.watch('./package.json', getPackageJSON);
    gulp.watch('./src/css/mailtoui.css', libStyles);
    gulp.watch(['./src/js/mailtoui.js', './version.js'], gulp.series(libScriptsLint, libScripts));
    gulp.watch('./docs/source/css/mailtoui-docs.css', docsStyles);
    gulp.watch(['./docs/source/js/mailtoui-docs.js', './version.js'], gulp.series(docsScriptsLint, docsScripts))
}

/**
 * Define complex tasks.
 */
const libJS = gulp.series(libScriptsLint, libScripts);
const docsJS = gulp.series(docsScriptsLint, docsScripts);
const build = gulp.series(getPackageJSON, libMarkup, gulp.parallel(libStyles, libScripts), gulp.parallel(docsStyles, docsScripts));
const watch = gulp.series(build, watchFiles);

/**
 * Make tasks available to the outside world.
 */
exports.libHTML = libMarkup;
exports.libCSS = libStyles;
exports.libJSLint = libScriptsLint;
exports.libJS = libJS;
exports.docsCSS = docsStyles;
exports.docsJSLint = docsScriptsLint;
exports.docsJS = docsJS;
exports.watch = watch;
exports.default = build;
