manipulateTags = require './manipulate-tags'
path = require 'path'

module.exports = (buildDir) ->
  manipulateTags
    '[href^="/"], [src^="/"]': (tag, file, callback) ->
      for attrName in ['href', 'src']
        attrValue = tag.attr attrName

        unless attrValue?.charAt(0) is '/'
          # A different attribute must start with "/".
          continue

        unless attrValue.charAt(1) is '/' # Skip "//..." URLs.
          fileDir = path.dirname file.path
          absolueBuildDir = path.resolve buildDir

          relativePath = path.relative fileDir, path.join absolueBuildDir, attrValue

          unless relativePath.charAt(0) is '.'
            relativePath = ".#{path.sep}#{relativePath}"

          tag.attr attrName, relativePath

      callback null
