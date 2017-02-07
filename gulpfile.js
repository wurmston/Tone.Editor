var fs = require('fs')
var del = require('del')
var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var changed = require('gulp-changed')

// first delete build directory
del.sync(['build'])

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down 
  return gulp.src('js/*.js')
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('Tone-Editor.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build'))
})

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/*.sass', ['sass']);
});

// Rerun a task when a file changes
gulp.task('watch', function() {
  gulp.watch('js/*.js', ['scripts'])
})

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['sass','sass:watch','watch', 'scripts'])

process.on('uncaughtException', function(error) {
    console.log(error.cause);
    process.exit(1)
})
