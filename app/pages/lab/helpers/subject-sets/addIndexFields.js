import constants from './constants'

const { INDEX_FIELD_HEADER } = constants;

export default function addIndexFields(subjectSet, data) {
  const [row] = data;
  const headers = Object.keys(row);
  const indexFields = headers
    .filter(header => header.startsWith(INDEX_FIELD_HEADER))
    .map(header => header.slice(INDEX_FIELD_HEADER.length));
  if (indexFields.length > 0) {
    subjectSet.update({ 'metadata.indexFields': indexFields.join(',') });
    subjectSet.save();
  }
}
