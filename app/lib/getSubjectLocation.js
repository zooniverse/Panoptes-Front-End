const READABLE_FORMATS = {
  image: ['jpeg', 'png', 'svg+xml', 'gif'],
  video: ['mp4', 'mpeg', 'x-m4v'],
  audio: ['mp3', 'm4a', 'mpeg'],
  text: ['plain'],
  application: ['json'],
};

export default function getSubjectLocation(subject, frame = 0) {
  if (subject?.locations[frame]) {
    for (const [mimeType, src] of Object.entries(subject.locations[frame])) {
      const [type, format] = mimeType.split('/');
      if (READABLE_FORMATS[type]?.includes(format)) {
        return { type, format, src }
      }
    }
  }
  return {}
}
