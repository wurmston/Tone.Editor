var fs = require('fs')
var del = require('del')
var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var imagemin = require('gulp-imagemin')
var sourcemaps = require('gulp-sourcemaps')
var changed = require('gulp-changed')
// var imageResize = require('gulp-image-resize');
var sass = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')

var paths = {
  scripts: 'js/*.js',
  images: 'img/*.*',
  sass: 'sass/*.sass',
  index: 'index.html',
  audio: 'audio/loops/*.mp3'
}

// first delete build directory
del.sync(['build'])

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  // with sourcemaps all the way down
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'))
})

// Copy all static images
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(changed('build/img'))
    .pipe(sourcemaps.write())
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'))
})

var autoprefixerOptions = {
  browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
}
//preprocess sass
gulp.task('sass', function() {
  return gulp.src(paths.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('build/css'))
})

//copy audio
gulp.task('audio', function() {
  return gulp.src(paths.audio)
    .pipe(changed('build/audio'))
    .pipe(gulp.dest('build/audio'))
})

gulp.task('index', function() {
  return gulp.src(paths.index)
    .pipe(gulp.dest('build'))
})

// Rerun a task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts'])
  gulp.watch(paths.images, ['images'])
  gulp.watch(paths.sass, ['sass'])
  gulp.watch(paths.audio, ['audio'])
  gulp.watch(paths.index, ['index'])
})

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts', 'images','sass','audio', 'index'])
