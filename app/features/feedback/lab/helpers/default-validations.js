import _ from 'lodash';
import strategies from '../../shared/strategies';

function checkId(rule) {
  return _.isString(rule.id) &&
    rule.id.length > 0;
}

function checkMessages(rule) {
  const validSuccessMessage = rule.successEnabled &&
    _.isString(rule.defaultSuccessMessage) &&
    rule.defaultSuccessMessage.length > 0;

  const validFailureMessage = rule.failureEnabled &&
    _.isString(rule.defaultFailureMessage) &&
    rule.defaultFailureMessage.length > 0;

  return validSuccessMessage || validFailureMessage || false;
}

function checkStrategy(rule) {
  if (!rule.strategy) {
    return false;
  } else {
    return Object.keys(strategies).includes(rule.strategy);
  }
}

export default [
  checkId,
  checkMessages,
  checkStrategy
];
