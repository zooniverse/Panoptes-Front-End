import apiClient from 'panoptes-client/lib/api-client';

function getCollectionCovers(collections) {
  const subjectIDs = collections.reduce(((ids, collection) => {
    if (collection.links.subjects) {
      ids.push(collection.links.subjects[0]);
    }
    return ids;
  }), []);
  return apiClient.type('subjects').get({ id: subjectIDs })
    .then((subjects) => {
      const subjectSrcs = subjects.reduce(((ids, subject) => {
        const firstKey = Object.keys(subject.locations[0])[0];
        ids[subject.id] = subject.locations[0][firstKey];
        return ids;
      }), {});
      return collections.reduce(((covers, collection) => {
        if (collection.links.subjects) {
          covers[collection.id] = subjectSrcs[collection.links.subjects[0]];
        }
        return covers;
      }), {});
    });
}

export default getCollectionCovers;
