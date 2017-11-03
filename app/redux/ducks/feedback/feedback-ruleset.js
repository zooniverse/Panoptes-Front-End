/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  no-underscore-dangle: ["error", { "allowAfterThis": true }],
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

export default class FeedbackRuleSet {
  constructor(subject, task) {
    this._subject = subject;
    this._task = task;
    const activeTypes = this._getActiveTypes();
    this.rules = this._generateRules(activeTypes);
  }

  _generateRules(activeTypes) {
    return Object.keys(activeTypes).reduce((ruleset, key) => {
      const defaults = this._getDefaultsForType(activeTypes[key]);
      const subj = this._getMetadataFieldsForType(key);
      const newRule = Object.assign({}, defaults, subj, { _defaults: defaults });
      return ruleset.concat(newRule);
    }, []);
  }

  _getActiveTypes() {
    // Find the feedback types required in the subject metadata and check for valid active rules in the task definition.
    const { metadata } = this._subject;
    const { feedback } = this._task;
    if (metadata && feedback) {
      return Object.keys(metadata).reduce((types, key) => {
        const newTypes = Object.assign({}, types);
        const match = key.match(/#feedback_(\d*?)_type/);
        if (match) {
          const index = match[1];
          const type = metadata[key];
          const typeInTaskDefinition = feedback.types.find(feedbackItem => feedbackItem.id === type);
          if (typeInTaskDefinition && typeInTaskDefinition.valid) {
            newTypes[`feedback_${index}`] = metadata[key];
          }
        }
        return newTypes;
      }, {});
    } else {
      return {};
    }
  }

  _getDefaultsForType(type) {
    const typeFromTask = this._task.feedback.types.find(feedbackType => feedbackType.id === type);
    return Object.keys(typeFromTask).reduce((obj, key) => {
      const newObj = Object.assign({}, obj);
      if (!['id', 'valid'].includes(key)) {
        if (key.slice(0, 7) === 'default') {
          const renamedKey = key.charAt(7).toLowerCase() + key.slice(8);
          newObj[renamedKey] = typeFromTask[key];
        } else {
          newObj[key] = typeFromTask[key];
        }
      }
      return newObj;
    }, {});
  }

  _getMetadataFieldsForType(prefix) {
    const { metadata } = this._subject;
    const fieldPrefix = `#${prefix}_`;
    return Object.keys(metadata).reduce((typeFields, key) => {
      const newTypeFields = Object.assign({}, typeFields);
      if (key.includes(fieldPrefix) && metadata[key]) {
        newTypeFields[key.substr(fieldPrefix.length)] = metadata[key];
      }
      return newTypeFields;
    }, {});
  }
}
