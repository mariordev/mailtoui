const { series, src, dest, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const header = require('gulp-header');
const browserify = require('gulp-browserify');
const exec = require('gulp-exec');
const package = require('./package.json');
const banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @author <%= pkg.author.name %> - <%= pkg.author.url %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

function packageCSS() {
    return src('./src/mailtoui.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename('src/mailtoui-prefixed.css'))
        .pipe(dest('./'));
}

function packageJS() {
    return src('./src/mailtoui.js')
        .pipe(minify({noSource: true}))
        .pipe(header(banner, { pkg : package } ))
        .pipe(dest('dist'));
}

function docsCSS() {
    return src(['./_assets/css/mailtoui-docs.css'])
        .pipe(cleanCSS())
        .pipe(rename('assets/css/mailtoui-docs-min.css'))
        .pipe(dest('./'));
}

function docsJS() {
    return src('./_assets/js/mailtoui-docs.js')
        .pipe(minify({noSource: true}))
        .pipe(browserify())
        .pipe(dest('assets/js'))
}

function packageJSON() {
    return src('./package.json')
        .pipe(exec('genversion version.js'))
}

function watching() {
    watch('src/css/*.css', packageCSS);
    watch('src/js/*.js', packageJS);

    watch('_assets/css/*.css', docsCSS);
    watch('_assets/js/*.js', docsJS);  

    watch('./package.json', series(packageJSON, docsJS));
}

exports.default = series(packageJSON, packageCSS, packageJS, docsCSS, docsJS, watching);
