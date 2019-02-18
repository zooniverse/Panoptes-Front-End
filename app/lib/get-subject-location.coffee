READABLE_FORMATS =
  image: ['jpeg', 'png', 'svg+xml', 'gif']
  video: ['mp4', 'mpeg', 'x-m4v']
  audio: ['mp3', 'm4a', 'mpeg']
  text: ['plain']
  application: ['json']

module.exports = (subject, frame = 0) ->
  for mimeType, src of subject.locations[frame]
    [type, format] = mimeType.split '/'
    if type of READABLE_FORMATS and format in READABLE_FORMATS[type]
      break

  {type, format, src}
