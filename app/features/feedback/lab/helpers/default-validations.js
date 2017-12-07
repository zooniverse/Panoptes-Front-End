import _ from 'lodash';
import strategies from '../../shared/strategies';

function checkId(rule) {
  return _.isString(rule.id) &&
    rule.id.length > 0;
}

function checkSuccessMessage(rule) {
  if (rule.successEnabled) {
    return _.isString(rule.defaultSuccessMessage) &&
      rule.defaultSuccessMessage.length > 0;
  } else {
    return true;
  }
}

function checkFailureMessage(rule) {
  if (rule.failureEnabled) {
    return _.isString(rule.defaultFailureMessage) &&
      rule.defaultFailureMessage.length > 0;
  } else {
    return true;
  }
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
  checkSuccessMessage,
  checkFailureMessage,
  checkStrategy
];
