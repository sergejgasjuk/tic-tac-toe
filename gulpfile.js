var gulp = require('gulp'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    plumber = require('gulp-plumber'),
    runSequence = require('run-sequence'),
    source = require('vinyl-source-stream'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    autoprefixer = require('gulp-autoprefixer');

var DEST_FOLDER = './dest/';
var SRC_FOLDER = './src/';
var handleError = function(err) {
  console.log(err.message);
  this.emit('end');
}

gulp.task('clean', function(){
  return gulp.src(DEST_FOLDER, {read: false})
    .pipe(clean());
});

gulp.task('process-js', function() {
  return browserify({entries: SRC_FOLDER + 'js/main.js', debug: true})
    .transform('babelify', {presets: ['es2015', 'react']})
    .bundle()
    .on('error', handleError)
    .pipe(source('main.js'))
    .pipe(gulp.dest(DEST_FOLDER + 'js/'));
});

gulp.task('process-html', function() {
  return gulp.src(SRC_FOLDER + 'index.html')
    .pipe(gulp.dest(DEST_FOLDER))
});

gulp.task('process-sass', function() {
  return gulp.src(SRC_FOLDER + 'style/main.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .on('error', handleError)
    .pipe(gulp.dest(DEST_FOLDER + 'style/'))
});

gulp.task('watch', function(){
  gulp.watch(SRC_FOLDER + 'js/**/*.js', ['process-js']);
  gulp.watch(SRC_FOLDER + 'style/**/*.scss', ['process-sass']);
  gulp.watch(SRC_FOLDER + 'index.html', ['process-html']);
});

gulp.task('default', ['clean'], function(){
  runSequence(
    ['process-html', 'process-js', 'process-sass'],
    ['watch']
  )
});
