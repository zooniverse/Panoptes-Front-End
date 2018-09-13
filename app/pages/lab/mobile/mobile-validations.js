const ValidationValue = {
  pass: 'pass',
  fail: 'fail',
  warning: 'warning'
};

export const convertBooleanToValidation = (bool, asWarning = false) => {
  const failValidation = asWarning ? ValidationValue.warning : ValidationValue.fail;
  return bool ? ValidationValue.pass : failValidation;
};

export default ValidationValue;
