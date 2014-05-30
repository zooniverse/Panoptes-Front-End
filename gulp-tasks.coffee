gulp = require 'gulp'
cache = require 'gulp-cached'
filelog = require 'gulp-filelog'
ect = require 'gulp-ect'
htmlFileToDirectory = require 'gulp-html-file-to-directory'

files =
  html: './html/**/*.{html,ect}'
  js: ['./js/main.coffee', './js/project.coffee']
  css: ['./css/main.styl']

buildDir = './build'

# TODO: Break this out into its own module?
eventStream = require 'event-stream'
transform = ([options]..., transformation) ->
  eventStream.map (file, callback) ->
    transformation file, (error, css) ->
      console.log error.toString() if error? # TODO: Gulp has a nice util for logging.
      file.path = file.path.replace /[^\.]+$/, options.ext if options?.ext
      file.base = file.cwd if options?.baseCwd
      file.contents = new Buffer error?.toString() ? css
      error = null if options?.squelch
      callback error, file

gulp.task 'html', ->
  gulp.src files.html
    .pipe cache 'html', optimizeMemory: true
    .pipe ect()
    .pipe htmlFileToDirectory()
    .pipe gulp.dest buildDir
    .pipe filelog()
  return

gulp.task 'js', ->
  browserify = require 'browserify'
  coffeeify = require 'coffeeify'

  gulp.src files.js
    .pipe cache 'js', optimizeMemory: true
    .pipe transform ext: 'js', baseCwd: true, squelch: true, (file, callback) ->
      b = browserify file.path, extensions: ['.coffee']
      b.transform coffeeify
      b.bundle callback
    .pipe gulp.dest buildDir
    .pipe filelog()
  return

gulp.task 'css', ->
  stylus = require 'stylus'
  nib = require 'nib'

  gulp.src files.css
    .pipe cache 'css', optimizeMemory: true
    .pipe transform ext: 'css', baseCwd: true, squelch: true, (file, callback) ->
      stylus file.contents.toString(), filename: file.path
        .use nib()
        .import 'nib'
        .render callback
    .pipe gulp.dest buildDir
    .pipe filelog()
  return

gulp.task 'build', ['html', 'js', 'css']

gulp.task 'watch', ['build'], ->
  gulp.watch files.html, ['html']
  gulp.watch files.js, ['js']
  gulp.watch files.css, ['css']
  return

gulp.task 'serve', (next) ->
  connect = require 'connect'
  livereload = require 'gulp-livereload'

  port = process.env.PORT || 3735

  staticServer = connect()
  staticServer.use connect.static buildDir
  staticServer.listen port, next

  changeServer = livereload()
  gulp.watch "#{buildDir}/**/*"
    .on 'change', (file) ->
      changeServer.changed file.path
  return

gulp.task 'default', ['watch', 'serve']
