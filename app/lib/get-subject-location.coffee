READABLE_FORMATS =
  image: ['jpeg', 'png', 'svg+xml', 'gif']
  video: ['mp4']
  audio: ['mpeg']

module.exports = (subject, frame = 0) ->
  for mimeType, src of subject.locations[frame]
    [type, format] = mimeType.split '/'
    if type of READABLE_FORMATS and format in READABLE_FORMATS[type]
      break

  {type, format, src}
