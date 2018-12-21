var { series, src, dest, watch } = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var header = require('gulp-header');
var browserify = require('gulp-browserify');
var eslint = require('gulp-eslint');
var exec = require('gulp-exec');
var packageJSONFile = require('./package.json');
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

function packageCSS() {
    return src('./src/css/mailtoui.css')
        .pipe(
            autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false,
            })
        )
        .pipe(rename('src/css/mailtoui-prefixed.css'))
        .pipe(dest('./'));
}

function packageJS() {
    return src('./src/js/mailtoui.js')
        .pipe(minify({ noSource: true }))
        .pipe(header(banner, { pkg: packageJSONFile }))
        .pipe(dest('dist'));
}

function docsCSS() {
    return src(['./docs/source/css/mailtoui-docs.css'])
        .pipe(cleanCSS())
        .pipe(rename('docs/assets/css/mailtoui-docs-min.css'))
        .pipe(dest('./'));
}

function docsJS() {
    return src('./docs/source/js/mailtoui-docs.js')
        .pipe(minify({ noSource: true }))
        .pipe(browserify())
        .pipe(dest('docs/assets/js'));
}

function getVersionFromPackage() {
    return src('./package.json').pipe(exec('genversion version.js'));
}

function lintJS() {
    return src(['src/js/*.js', 'docs/source/js/*.js'])
        .pipe(eslint())
        .pipe(eslint.format());
}

function watching() {
    watch('src/css/*.css', packageCSS);
    watch(['src/js/*.js', './package.json'], series(getVersionFromPackage, packageJS));

    watch('docs/source/css/*.css', docsCSS);
    watch(['docs/source/js/*.js', './package.json'], series(getVersionFromPackage, docsJS));

    watch(['src/js/*.js', 'docs/source/js/*.js'], lintJS);
}

exports.default = series(packageCSS, packageJS, docsCSS, docsJS, lintJS, watching);
