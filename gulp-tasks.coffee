gulp = require 'gulp'
cache = require 'gulp-cached'
filelog = require 'gulp-filelog'
ect = require 'gulp-ect'
htmlFileToDirectory = require 'gulp-html-file-to-directory'
tap = require 'gulp-tap'
vinylSourceStream = require 'vinyl-source-stream'
browserify = require 'browserify'
coffeeify = require 'coffeeify'
stylus = require 'stylus'
nib = require 'nib'
connect = require 'connect'
livereload = require 'gulp-livereload'

files =
  html: './html/**/*.{html,ect}'
  js: ['./js/main.coffee', './js/project.coffee']
  css: ['./css/main.styl']

buildDir = './build'

gulp.task 'html', ->
  gulp.src files.html
    .pipe cache 'html', optimizeMemory: true
    .pipe filelog()
    .pipe ect()
    .pipe htmlFileToDirectory()
    .pipe gulp.dest buildDir
  return

gulp.task 'js', ->
  gulp.src files.js
    .pipe cache 'js', optimizeMemory: true
    .pipe filelog()
    .pipe tap (file) ->
      b = browserify file.path, extensions: ['.coffee']
      b.transform coffeeify
      b.bundle()
        .pipe vinylSourceStream file.path.replace /.coffee$/, '.js'
        .pipe filelog()
        .pipe gulp.dest buildDir
      return
  return

gulp.task 'css', ->
  gulp.src files.css
    .pipe cache 'css', optimizeMemory: true
    .pipe tap (file) ->
      file.base = file.cwd # Not sure if this is wrong or vinyl-source-stream is wrong.
      file.path = file.path.replace /.styl$/, '.css'
      file.contents = new Buffer stylus.render file.contents.toString()
      return
    .pipe filelog()
    .pipe gulp.dest buildDir
  return

gulp.task 'build', ['html', 'js', 'css']

gulp.task 'watch', ['build'], ->
  gulp.watch files.html, ['html']
  gulp.watch files.js, ['js']
  gulp.watch files.css, ['css']
  return

gulp.task 'serve', (next) ->
  port = process.env.PORT || 9735

  staticServer = connect()
  staticServer.use connect.static buildDir
  staticServer.listen port, next

  changeServer = livereload()
  gulp.watch "#{buildDir}/**/*"
    .on 'change', (file) ->
      changeServer.changed file.path

gulp.task 'default', ['watch', 'serve']
