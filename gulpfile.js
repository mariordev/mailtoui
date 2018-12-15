var gulp = require('gulp');
// var watch = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');
var minify = require('gulp-minify');
var header = require('gulp-header');
var package = require('./package.json');
var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @author <%= pkg.author.name %> - <%= pkg.author.url %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');

gulp.task('default', function(done) {

    gulp.src('./src/modal.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'));

    gulp.src(['./src/mailtoui.js'])
        .pipe(minify())
        .pipe(header(banner, { pkg : package } ))
        .pipe(gulp.dest('dist'));

    done();
});
