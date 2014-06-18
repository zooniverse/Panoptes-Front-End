eventStream = require 'event-stream'
path = require 'path'

module.exports =
  ([options]..., transformation) ->
    eventStream.map (file, callback) ->
      fileExt = path.extname file.path
      if fileExt is options?.from or not options?.from?
        transformation file, (error, result) ->
          if options?.to?
            file.path = file.path.slice(0, file.path.lastIndexOf fileExt) + options.to

          file.contents = new Buffer error?.toString() ? result

          callback error, file

      else
        # Extension didn't match, so skip it.
        callback null, file
