'use strict'

var gulp = require('gulp');
var concat = require('gulp-concat');
var sass = require('gulp-sass');

gulp.task('sass', function () ***REMOVED***
  return gulp.src('./scss/style.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('style.css'))
  .pipe(gulp.dest('./public/css'))
  .pipe(sass(***REMOVED***outputStyle: 'compressed'***REMOVED***))
  .pipe(concat('style.min.css'))
  .pipe(gulp.dest('./public/css'));
***REMOVED***);

// Watching SCSS files
gulp.task('sass:watch', function () ***REMOVED***
  gulp.watch('./scss/**/*.scss', ['sass']);
***REMOVED***);

gulp.task('default', ['sass:watch']);
