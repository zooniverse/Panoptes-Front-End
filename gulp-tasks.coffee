gulp = require 'gulp'
cache = require 'gulp-cached'
filelog = require 'gulp-filelog'

files =
  html: './html/**/*.ect'
  components: './{components,}/**/*.html'
  js: ['./{js,}/main.coffee', './{js,}/project.coffee']
  css: ['./{css,}/main.styl']

translations = ['en-us', 'es-mx']

buildDir = './build'

# TODO: Break this out into its own module?
eventStream = require 'event-stream'
transform = ([options]..., transformation) ->
  eventStream.map (file, callback) ->
    transformation file, (error, css) ->
      console.log error.toString() if error? # TODO: Gulp has a nice util for logging.
      file.path = file.path.replace /[^\.]+$/, options.ext if options?.ext
      file.contents = new Buffer error?.toString() ? css
      error = null if options?.squelch
      callback error, file

gulp.task 'html', ->
  ect = require 'gulp-ect'
  htmlFileToDirectory = require 'gulp-html-file-to-directory'
  eventStream = require 'event-stream'
  path = require 'path'

  translations.forEach (translation, i) ->
    data =
      require: require # Make local require available in templates.
      t: require "./translations/#{translation}" # Translated strings

    gulp.src files.html
      .pipe ect({data}).on 'error', console.log
      .pipe htmlFileToDirectory()
      .pipe eventStream.map (file, callback) ->
        unless i is 0
          # TODO: This feels pretty hacky.
          file.path = file.path.replace file.base, path.join(file.base, translation) + path.sep
        callback null, file
      .pipe gulp.dest buildDir
      .pipe filelog()
  return

gulp.task 'components', ->
  gulp.src files.components
    .pipe gulp.dest buildDir
    .pipe filelog()

gulp.task 'js', ->
  browserify = require 'browserify'
  coffeeify = require 'coffeeify'

  gulp.src files.js
    .pipe cache 'js', optimizeMemory: true
    .pipe transform ext: 'js', squelch: true, (file, callback) ->
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
    .pipe transform ext: 'css', squelch: true, (file, callback) ->
      stylus file.contents.toString(), filename: file.path
        .use nib()
        .import 'nib'
        .render callback
    .pipe gulp.dest buildDir
    .pipe filelog()
  return

gulp.task 'build', ['html', 'components', 'js', 'css']

gulp.task 'watch', ['build'], ->
  gulp.watch files.html, ['html']
  gulp.watch files.components, ['components']
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
  console.log "Static server listening on: #{port}"

  changeServer = livereload()
  gulp.watch "#{buildDir}/**/*"
    .on 'change', (file) ->
      changeServer.changed file.path
  return

gulp.task 'default', ['watch', 'serve']
