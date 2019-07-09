import _ from 'lodash';

// Converts a subject metadata object into an array of feedback objects
function metadataToRules(metadata) {
  const rulesObject = _.reduce(metadata, (result, value, key) => {
    const [prefix, ruleKey, propKey] = key.split('_');
    const stringValue = value.toString()

    if (prefix === '#feedback' && stringValue) {
      _.set(result, `${ruleKey}.${propKey}`, value);
    }

    return result;
  }, {});
  return _.toArray(rulesObject);
}

export default metadataToRules;
