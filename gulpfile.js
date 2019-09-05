const { src, dest, parallel, series, watch } = require('gulp');
const csslint = require('gulp-csslint');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const header = require('gulp-header');
const eslint = require('gulp-eslint');
const fs = require('fs-extra');
const htmlMin = require('gulp-htmlmin');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sass = require('gulp-sass');

var packageJson = null;
var banner = [
    '/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @author <%= pkg.author.name %> - <%= pkg.author.url %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''
].join('\n');

/**
 * Process HTML files.
 */
function html() {
    return src('./src/html/component.html')
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(rename('./src/html/component-min.html'))
        .pipe(dest('./'));
}

/**
 * Process CSS file.
 */
function css() {
    return src('./src/scss/component.scss')
        .pipe(sass())
        .pipe(csslint())
        .pipe(csslint.formatter())
        .pipe(
            autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            })
        )
        .pipe(cleanCss())
        .pipe(rename('./src/css/component-min.css'))
        .pipe(dest('./'));
}

/**
 * Process the JavaScript library file.
 */
function js() {
    packageJson = fs.readJsonSync('./package.json');

    return src('./src/js/mailtoui.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(minify({ noSource: true }))
        .pipe(header(banner, { pkg: packageJson }))
        .pipe(dest('dist'));
}

/**
 * Lint JavaScript file used on demo page.
 */
function lintDemoJs() {
    return src('./demo/demo.js')
        .pipe(eslint())
        .pipe(eslint.format());
}

/**
 * Process JavaScript file used on demo page.
 */
function processDemoJs() {
    return browserify('./demo/demo.js')
        .bundle()
        .pipe(source('./demo/demo.js'))
        .pipe(buffer())
        .pipe(minify({ noSource: true }))
        .pipe(dest('./'));
}

/**
 * Process CSS file used on demo page.
 */
function demoCss() {
    return src('./demo/demo.scss')
        .pipe(sass())
        .pipe(csslint())
        .pipe(csslint.formatter())
        .pipe(
            autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            })
        )
        .pipe(cleanCss())
        .pipe(rename('./demo/demo-min.css'))
        .pipe(dest('./'));
}

/**
 * The all seeing eye...
 */
function watchFiles() {
    watch('./src/html/component.html', html);
    watch('./src/scss/component.scss', css);
    watch(['./src/js/mailtoui.js', './package.json'], series(js, lintDemoJs, processDemoJs));
    watch('./demo/demo.scss', demoCss);
    watch('./demo/demo.js', demoJs);
}

/**
 * Define complex tasks.
 */
const demoJs = series(lintDemoJs, processDemoJs);
const build = series(parallel(html, css), js, demoJs, demoCss);
const watching = series(build, watchFiles);

/**
 * Make tasks available to the outside world.
 */
exports.html = html;
exports.css = css;
exports.js = js;
exports.demoJs = demoJs;
exports.demoCss = demoCss;
exports.watch = watching;
exports.default = build;
