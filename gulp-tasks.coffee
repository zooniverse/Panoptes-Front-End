fs = require 'fs'
path = require 'path'
gulp = require 'gulp'
cache = require 'gulp-cached'
filelog = require 'gulp-filelog'

files =
  # NOTE: The underscores here only exist so that the glob starts at the right place.
  # This keeps the output paths the way they should be.
  html: './html/**/*.ect'
  components: './{components,_}/**/*.html'
  js: ['./{js,_}/main.coffee', './{js,_}/project.coffee']
  css: ['./{css,_}/main.styl']

translations = fs.readdirSync './translations'
  .filter (file) ->
    path.extname(file) of require.extensions

defaultStrings = require './translations/en-us'

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
  merge = require 'lodash.merge'

  translations.forEach (translation, i) ->
    strings = require "./translations/#{translation}"

    data =
      require: require # Make local require available in templates.
      t: merge {}, defaultStrings, strings

    unless strings is defaultStrings
      localBuildDir = path.join buildDir, translation.split('.')[0]

    gulp.src files.html
      .pipe ect({data}).on 'error', console.log
      .pipe htmlFileToDirectory()
      .pipe gulp.dest localBuildDir ? buildDir
      .pipe filelog()
  return

gulp.task 'components', ->
  gulp.src files.components
    .pipe gulp.dest buildDir
    .pipe filelog()
  return

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
  gulp.watch ['./translations/**/*'].concat(files.html), ['html']
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
