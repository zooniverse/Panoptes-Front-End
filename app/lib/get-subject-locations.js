const READABLE_FORMATS = {
  image: [
    'jpeg', 'png', 'svg+xml', 'gif'
  ],
  video: ['mp4', 'mpeg'],
  audio: ['mp3', 'm4a', 'mpeg']
};

const getSubjectLocations = (subjects) => {
  var subjectLocations = {};
  subjects.locations.map((locationData) => {
    for (const mimeType of Object.keys(locationData)) {
      let src = locationData[mimeType];
      let [type,
        format] = mimeType.split('/');
      if (READABLE_FORMATS.hasOwnProperty(type) && READABLE_FORMATS[type].includes(format)) {
        subjectLocations[type] = [format, src];
      }
    }
  });
  return subjectLocations;
};

export default getSubjectLocations;
