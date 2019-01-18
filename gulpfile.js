const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const header = require('gulp-header');
const eslint = require('gulp-eslint');
const fs = require('fs-extra');
const htmlMin = require('gulp-htmlmin');

var packageJson = null;
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
function markup() {
    return gulp.src('./src/html/component.html')
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(rename('./src/html/component-min.html'))
        .pipe(gulp.dest('./'));
}

/**
 * Process CSS files.
 */
function styles() {
    return gulp.src('./src/css/component.css')
        .pipe(
            autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false,
            })
        )
        .pipe(cleanCss())
        .pipe(rename('./src/css/component-min.css'))
        .pipe(gulp.dest('./'));
}

/**
 * Lint JavaScript files.
 */
function lintScripts() {
    return gulp.src('./src/js/mailtoui.js')
        .pipe(eslint())
        .pipe(eslint.format());
}

/**
 * Process JavaScript files.
 */
function scripts() {
    return gulp.src('./src/js/mailtoui.js')
        .pipe(minify({ noSource: true }))
        .pipe(header(banner, { pkg: packageJson }))
        .pipe(gulp.dest('dist'));
}

/**
 * Read package.json and update version.js. This is needed
 * to update the library header info automatically.
 */
function getPackageJson(done) {
    packageJson = fs.readJsonSync('./package.json');
    done();
}

/**
 * The all seeing eye...
 */
function watchFiles() {
    gulp.watch('./package.json', getPackageJson);
    gulp.watch('./src/html/component.html', markup);
    gulp.watch('./src/css/component.css', styles);
    gulp.watch(['./src/js/mailtoui.js', './package.json'], gulp.series(lintScripts, scripts));
}

/**
 * Define complex tasks.
 */
const js = gulp.series(lintScripts, scripts);
const build = gulp.series(getPackageJson, gulp.parallel(markup, styles), js);
const watch = gulp.series(build, watchFiles);

/**
 * Make tasks available to the outside world.
 */
exports.html = markup;
exports.css = styles;
exports.lintJs = lintScripts;
exports.js = js;
exports.watch = watch;
exports.default = build;
