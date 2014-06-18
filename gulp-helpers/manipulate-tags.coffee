eventStream = require 'event-stream'
cheerio = require 'cheerio'

module.exports =
  (selectors) ->
    eventStream.map (file, callback) ->
      $ = cheerio.load file.contents.toString()
      for selector, manipulation of selectors
        tags = $(selector)
        if tags.length is 0
          callback null, file
        else
          tagsToGo = tags.length
          tags.each ->
            manipulation $(this), file, (error) ->
              tagsToGo -= 1
              if tagsToGo is 0
                file.contents = new Buffer $.html()
                callback error, file
