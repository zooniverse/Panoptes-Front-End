fs = require 'fs'
path = require 'path'
gulp = require 'gulp'
cache = require 'gulp-cached'
filelog = require 'gulp-filelog'

files =
  # NOTE: The underscores here only exist so that the glob starts at the right place.
  # This keeps the output paths the way they should be.
  html: './html/**/*.ect'
  components: ['./{bower_components,_}/**/*.{html,js,css}', './{components,_}/**/*.html']
  js: ['./{js,_}/main.coffee']
  css:
    main: './{css,_}/main.styl'
    all: './{css,_}/**/*.styl'

translations = fs.readdirSync './translations'
  .filter (file) ->
    path.extname(file) of require.extensions

defaultStrings = require './translations/en-us'

buildDir = './build'

# TODO: Break this out into its own module?
eventStream = require 'event-stream'
transform = ([options]..., transformation) ->
  eventStream.map (file, callback) ->
    transformation file, (error, result) ->
      console.log error.toString() if error? # TODO: Gulp has a nice util for logging.
      file.path = file.path.replace /[^\.]+$/, options.ext if options?.ext
      file.contents = new Buffer error?.toString() ? result
      error = null if options?.squelch
      callback error, file

gulp.task 'html', ->
  ect = require 'gulp-ect'
  cheerio = require 'cheerio'
  CoffeeScript = require 'coffee-script'
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
      .pipe transform (file, callback) ->
        $ = cheerio.load file.contents.toString()
        $('script[type="text/coffeescript"]').each ->
          script = $(this)
          script.html try
            script.attr 'type', null
            CoffeeScript.compile script.html()
          catch e
            script.attr 'type', 'text/error'
            e.toString()
        callback null, $.html()
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

  gulp.src files.css.main
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
  gulp.watch files.css.all, ['css']
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
