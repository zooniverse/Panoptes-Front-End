fs = require 'fs'
path = require 'path'
gulp = require 'gulp'
util = require 'gulp-util'
cache = require 'gulp-cached'
filelog = require 'gulp-filelog'
transform = require './gulp-helpers/transform'
compileInlineTags = require './gulp-helpers/compile-inline-tags'

files =
  # NOTE: The underscores here only exist so that the glob starts at the right place.
  # This keeps the output paths the way they should be.
  html: './html/**/*.ect'
  components: ['./b?wer_components/**/*.{html,js,css}', './c?mponents/**/*.{html,js,css}']
  js: ['./j?/main.coffee']
  css:
    main: './cs?/main.styl'
    all: './cs?/**/*.styl'

# Get a list of all requireable files.
translations = fs.readdirSync './translations'
  .filter (file) ->
    path.extname(file) of require.extensions

# Fall back to these if a string is missing.
defaultStrings = require './translations/en-us'

buildDir = './build'
tempBuildDir = "#{buildDir}-temp"

gulp.task 'html', ->
  ect = require 'gulp-ect'
  htmlFileToDirectory = require 'gulp-html-file-to-directory'
  merge = require 'lodash.merge'
  relativizeLinks = require './gulp-helpers/relativize-links'

  translations.forEach (translation, i) ->
    strings = require "./translations/#{translation}"

    data =
      require: require # Make local require available in templates.
      t: merge {}, defaultStrings, strings

    if strings is defaultStrings
      localBuildDir = buildDir
      localTempBuildDir = tempBuildDir
    else
      translationName = translation.slice 0, translation.lastIndexOf '.'
      localBuildDir = path.join buildDir, translationName
      localTempBuildDir = path.join tempBuildDir, translationName

    gulp.src files.html
      .pipe ect {data}
      .on 'error', util.log
      .pipe compileInlineTags()
      .on 'error', util.log
      .pipe htmlFileToDirectory()
      .pipe gulp.dest localTempBuildDir
      .pipe relativizeLinks localTempBuildDir
      .on 'error', util.log
      .pipe gulp.dest localBuildDir
      .pipe filelog()
  return

gulp.task 'components', ->
  gulp.src files.components
    .pipe compileInlineTags()
    .on 'error', util.log
    .pipe gulp.dest buildDir
    .pipe filelog()
  return

gulp.task 'js', ->
  browserify = require 'browserify'
  coffeeify = require 'coffeeify'

  gulp.src files.js
    .pipe cache 'js', optimizeMemory: true
    .pipe transform from: '.coffee', to: '.js', (file, callback) ->
      b = browserify file.path, extensions: ['.coffee']
      b.transform coffeeify
      b.bundle callback
    .on 'error', util.log
    .pipe gulp.dest buildDir
    .pipe filelog()
  return

gulp.task 'css', ->
  stylus = require 'stylus'
  nib = require 'nib'

  gulp.src files.css.main
    .pipe transform from: '.styl', to: '.css', (file, callback) ->
      stylus file.contents.toString(), filename: file.path
        .use nib()
        .import 'nib'
        .render callback
    .on 'error', util.log
    .pipe gulp.dest buildDir
    .pipe filelog()
  return

gulp.task 'build', ['html', 'components', 'js', 'css']

gulp.task 'watch', ['build'], ->
  gulp.watch ['./translations/**/*'].concat(files.html), ['html']
  gulp.watch files.components, ['components']
  gulp.watch files.js, ['js']
  gulp.watch files.css.all, ['css']
  .on 'error', util.log
  return

gulp.task 'serve', (next) ->
  connect = require 'connect'
  livereload = require 'gulp-livereload'

  port = process.env.PORT || 3735

  staticServer = connect()
  staticServer.use connect.static buildDir
  staticServer.listen port, next
  util.log 'Static server listening on', port

  changeServer = livereload()
  gulp.watch "#{buildDir}/**/*"
    .on 'change', (file) ->
      changeServer.changed file.path
    .on 'error', util.log
  return

gulp.task 'default', ['watch', 'serve']
