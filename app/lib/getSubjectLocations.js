const READABLE_FORMATS = {
  image: [
    'jpeg', 'png', 'svg+xml', 'gif'
  ],
  video: ['mp4', 'mpeg', 'x-m4v'],
  audio: ['mp3', 'm4a', 'mpeg'],
  application: ['json']
};

const getSubjectLocations = (subjects) => {
  const subjectLocations = {};
  subjects.locations.map((locationData) => {
    for (const mimeType of Object.keys(locationData)) {
      const src = locationData[mimeType];
      let [type, format] = mimeType.split('/');
      if (!subjectLocations[type] && READABLE_FORMATS.hasOwnProperty(type) && READABLE_FORMATS[type].includes(format)) {
        subjectLocations[type] = [format, src];
      }
    }
  });
  return subjectLocations;
};

export default getSubjectLocations;
