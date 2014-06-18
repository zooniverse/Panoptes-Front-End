manipulateTags = require './manipulate-tags'
CoffeeScript = require 'coffee-script'
stylus = require 'stylus'
nib = require 'nib'

module.exports = ->
  manipulateTags
    'script[type="text/coffeescript"]': (tag, file, callback) ->
      tag.attr 'type', null
      tag.html try
        CoffeeScript.compile tag.html()
      catch e
        e.toString()
      callback null

    'style[type="text/stylus"]': (tag, file, callback) ->
      tag.attr 'type', null
      stylus tag.html()
        .use nib()
        .import 'nib'
        .render (error, content) ->
          tag.html content
          callback error
