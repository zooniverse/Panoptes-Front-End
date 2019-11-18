import { expect } from 'chai';
import createRule from './create-rule';

describe('feedback drawing radial create-rule', function () {
  const subjectRule = {
    id: "1234",
    x: "200",
    y: "300",
    a: "10",
    b: "10",
    theta : "0"
  }

  const workflowRule = {
    defaultFailureMessage: "=( Fail",
    defaultSuccessMessage: "Success!",
    failureEnabled: true,
    id: "1234",
    strategy: "radial",
    successEnabled: true
  }

  it('should return a valid rule without custom subject-specifics', function () {
    const rule = createRule(subjectRule, workflowRule);
    expect(rule).to.deep.equal({
      failureEnabled: true,
      failureMessage: "=( Fail",
      hideSubjectViewer: false,
      id: "1234",
      strategy: "radial",
      successEnabled: true,
      successMessage: "Success!",
      x: "200",
      y: "300",
      a: "10",
      b: "10",
      theta : "0"
    });
  })

  it('should return a valid rule with subject-specific settings', function () {
    subjectRule.failureMessage = "Subject-specific failure message";
    subjectRule.successMessage = "Subject-specific success message";
    subjectRule.a = "30";
    subjectRule.b = "60";
    subjectRule.theta = "60";

    const rule = createRule(subjectRule, workflowRule);
    expect(rule).to.deep.equal({
      failureEnabled: true,
      failureMessage: "Subject-specific failure message",
      hideSubjectViewer: false,
      id: "1234",
      strategy: "radial",
      successEnabled: true,
      successMessage: "Subject-specific success message",
      x: "200",
      y: "300",
      a: "30",
      b: "60",
      theta : "60"
    });
  })
});
