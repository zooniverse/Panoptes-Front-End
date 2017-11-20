import _ from 'lodash';
import strategies from '../strategies';

// Create a canonical set of feedback rules for a given combination of workflow
// rules (all feedback rules available), and subject rules (those feedback
// rules that pertain to the specific subject, and any modifications / extra
// options that apply to it)
function generateRules(subjectRules, workflowRules) {
  const canonicalRules = {};

  _.forEach(workflowRules, (rules, taskId) => {
    const taskRules = _.reduce(rules, (result, workflowRule) => {
      const matchingSubjectRule = _.find(subjectRules, subjectRule =>
        subjectRule.id === workflowRule.id);

      if (matchingSubjectRule) {
        const ruleStrategy = workflowRule.strategy;
        const ruleGenerator = strategies[ruleStrategy].createRule;
        return result.concat([ruleGenerator(matchingSubjectRule, workflowRule)]);
      } else {
        return result;
      }
    }, []);

    if (taskRules.length) {
      canonicalRules[taskId] = taskRules;
    }
  });

  return canonicalRules;
}

export default generateRules;
