export default function cleanSubjectData(rawData) {
  const cleanData = {};
  for (const [key, value] of Object.entries(rawData)) {
    let cleanKey = key.trim();
    let cleanValue = value.trim();
    if (cleanKey.startsWith('&')) {
      cleanKey = cleanKey.slice(1);
    }
    cleanData[cleanKey] = cleanValue;
  }
  return cleanData;
}
