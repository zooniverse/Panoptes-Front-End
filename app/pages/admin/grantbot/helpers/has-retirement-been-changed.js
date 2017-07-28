const DEFAULT_RETIREMENT_LIMIT = 15;
const DEFAULT_RETIREMENT_CRITERIA = 'classification_count';

function _testRetirementCriteria({ retirement }) {
  let result = false;
  const defaultCriteriaChanged = (retirement.criteria !== DEFAULT_RETIREMENT_CRITERIA);
  const defaultLimitChanged = (retirement.options.count !== DEFAULT_RETIREMENT_LIMIT);

  if (defaultCriteriaChanged) {
    result = true;
  }

  if (!defaultCriteriaChanged && defaultLimitChanged) {
    result = true;
  }

  return result;
}

function hasRetirementBeenChanged(project) {
  return new Promise((resolve, reject) => {
    project.get('workflows')
      .then(workflows => {
        if (!workflows.length) {
          return resolve([]);
        }

        const result = workflows.map(workflow => ({
          id: workflow.id,
          name: workflow.display_name,
          retirementHasBeenChanged: _testRetirementCriteria(workflow),
          type: 'workflow',
        }));

        resolve(result);
      })
      .catch(error => reject(error));
  });
}

export default hasRetirementBeenChanged;
