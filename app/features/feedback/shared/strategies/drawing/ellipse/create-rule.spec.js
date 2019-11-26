import { expect } from 'chai';
import createRule from './create-rule';

describe('feedback drawing ellipse create-rule', function () {
  const subjectRule = {
    id: "1234",
    x: "200",
    y: "300",
  }

  const workflowRule = {
    defaultFailureMessage: "=( Fail",
    defaultSuccessMessage: "Success!",
    defaultTolerance: "20",
    failureEnabled: true,
    id: "1234",
    strategy: "ellipse",
    successEnabled: true
  }

  it('should return a valid rule without custom subject-specifics', function () {
    const rule = createRule(subjectRule, workflowRule);
    expect(rule).to.deep.equal({
      failureEnabled: true,
      failureMessage: "=( Fail",
      hideSubjectViewer: false,
      id: "1234",
      strategy: "ellipse",
      successEnabled: true,
      successMessage: "Success!",
      x: "200",
      y: "300",
      tolerance_a: "20",
      tolerance_b: "20",
      theta : "0"
    });
  })

  it('should return a valid rule with subject-specific settings', function () {
    subjectRule.failureMessage = "Subject-specific failure message";
    subjectRule.successMessage = "Subject-specific success message";
    subjectRule.tolerance_a = "30";
    subjectRule.tolerance_b = "60";
    subjectRule.theta = "60";

    const rule = createRule(subjectRule, workflowRule);
    expect(rule).to.deep.equal({
      failureEnabled: true,
      failureMessage: "Subject-specific failure message",
      hideSubjectViewer: false,
      id: "1234",
      strategy: "ellipse",
      successEnabled: true,
      successMessage: "Subject-specific success message",
      x: "200",
      y: "300",
      tolerance_a: "30",
      tolerance_b: "60",
      theta : "60"
    });
  })
});
