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
function html() {
    return src('./src/html/component.html')
        .pipe(htmlMin({ collapseWhitespace: true }))
        .pipe(rename('./src/html/component-min.html'))
        .pipe(dest('./'));
}

/**
 * Process CSS files.
 */
function css() {
    return src('./src/css/component.css')
        .pipe(csslint())
        .pipe(csslint.formatter())
        .pipe(
            autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false,
            })
        )
        .pipe(cleanCss())
        .pipe(rename('./src/css/component-min.css'))
        .pipe(dest('./'));
}

/**
 * Process JavaScript files.
 */
function js() {
    return src('./src/js/mailtoui.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(minify({ noSource: true }))
        .pipe(header(banner, { pkg: packageJson }))
        .pipe(dest('dist'));
}

/**
 * Process test JavaScript file.
 */
function indexJs() {
    return browserify({
            entries: './index.js',
            debug: true
        })
        .bundle()
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(minify({ noSource: true }))
        .pipe(dest('./'));
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
    watch('./package.json', getPackageJson);
    watch('./src/html/component.html', html);
    watch('./src/css/component.css', css);
    watch(['./src/js/mailtoui.js', './package.json'], series(js, indexJs));
    watch('./index.js', indexJs);
}

/**
 * Define complex tasks.
 */
const build = series(getPackageJson, parallel(html, css), js, indexJs);
const watching = series(build, watchFiles);

/**
 * Make tasks available to the outside world.
 */
exports.html = html;
exports.css = css;
exports.js = js;
exports.indexJs = indexJs;
exports.watch = watching;
exports.default = build;
