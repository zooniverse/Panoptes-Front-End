import constants from './constants';

const { INDEX_FIELD_HEADER } = constants;

export default function cleanSubjectData(rawData) {
  const cleanData = {};
  for (const [key, value] of Object.entries(rawData)) {
    let cleanKey = key.trim();
    const cleanValue = value.trim ? value.trim() : value;
    if (cleanKey.startsWith(INDEX_FIELD_HEADER)) {
      cleanKey = cleanKey.slice(INDEX_FIELD_HEADER.length);
    }
    cleanData[cleanKey] = cleanValue;
  }
  return cleanData;
}
