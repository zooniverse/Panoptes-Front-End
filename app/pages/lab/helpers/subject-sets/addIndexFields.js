export default function addIndexFields(subjectSet, data) {
  const [row] = data;
  const headers = Object.keys(row);
  const indexFields = headers
    .filter(header => header.startsWith('&'))
    .map(header => header.slice(1));
  if (indexFields.length > 0) {
    subjectSet.update({ 'metadata.indexFields': indexFields.join(',') });
    subjectSet.save();
  }
}
