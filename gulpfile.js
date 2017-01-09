var fs = require('fs')
var del = require('del')
var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')
var changed = require('gulp-changed')

var paths = {
  scripts: 'js/*.js',
}

// first delete build directory
del.sync(['build'])

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('Tone.Editor.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build'))
})

// Rerun a task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts'])
})

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts'])

process.on('uncaughtException', function(error) {
    console.log(error.cause);
    process.exit(1)
})
