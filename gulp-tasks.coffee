gulp = require 'gulp'
cache = require 'gulp-cached'
ect = require 'gulp-ect'
htmlFileToDirectory = require 'gulp-html-file-to-directory'

PAGES = './pages/**/*.{html,ect}'
BUILD_DIR = './build'

gulp.task 'pages', ->
  gulp.src PAGES
    .pipe cache 'pages', optimizeMemory: true
    .pipe ect()
    .pipe htmlFileToDirectory()
    .pipe gulp.dest BUILD_DIR

gulp.task 'build', ['pages']

gulp.task 'watch', ->
  gulp.watch PAGES, ['pages']

gulp.task 'default', ['build', 'watch']
