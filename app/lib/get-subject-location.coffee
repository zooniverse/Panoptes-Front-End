READABLE_FORMATS =
  image: ['jpeg', 'png', 'svg+xml', 'gif']

module.exports = (subject, frame) ->
  frame ?= Math.floor Object.keys(subject.locations).length / 2

  for mimeType, src of subject.locations[frame]
    [type, format] = mimeType.split '/'
    if type of READABLE_FORMATS and format in READABLE_FORMATS[type]
      break

  {type, format, src}
