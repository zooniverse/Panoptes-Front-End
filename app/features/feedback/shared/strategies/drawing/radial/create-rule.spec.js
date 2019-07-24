import { expect } from 'chai';
import createRule from './create-rule';

describe('feedback drawing radial create-rule', function () {
  const subjectRule = {
    id: "1234",
    x: "200",
    y: "300"
  }

  const workflowRule = {
    defaultFailureMessage: "=( Fail",
    defaultSuccessMessage: "Success!",
    defaultTolerance: "10",
    failureEnabled: true,
    id: "1234",
    strategy: "radial",
    successEnabled: true,
    pluralSuccessMessagesEnabled: false,
    pluralFailureMessagesEnabled: false,
    colorizeUniqueMessagesEnabled: false,
    defaultPluralFailureMessage: "",
    defaultPluralSuccessMessage: "",
    successFailureShapesEnabled: false,
    allowedSuccessFeedbackMarkerColors: ["green", "blue"],
    allowedFailureFeedbackMarkerColors: ["yellow", "red"],
    defaultOpacity : 0.1
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
      tolerance: "10",
      x: "200",
      y: "300",
      pluralSuccessMessagesEnabled: false,
      pluralFailureMessagesEnabled: false,
      colorizeUniqueMessagesEnabled: false,
      successFailureShapesEnabled: false,
      allowedSuccessFeedbackMarkerColors: ["green", "blue"],
      allowedFailureFeedbackMarkerColors: ["yellow", "red"],
      opacity : 0.1
    });
  })

  it('should return a valid rule with subject-specific settings, but no plurality', function () {
    subjectRule.tolerance = "50";
    subjectRule.opacity = 0.3;
    subjectRule.failureMessage = "Subject-specific failure message";
    subjectRule.successMessage = "Subject-specific success message";

    const rule = createRule(subjectRule, workflowRule);
    expect(rule).to.deep.equal({
      failureEnabled: true,
      failureMessage: "Subject-specific failure message",
      hideSubjectViewer: false,
      id: "1234",
      strategy: "radial",
      successEnabled: true,
      successMessage: "Subject-specific success message",
      tolerance: "50",
      x: "200",
      y: "300",
      pluralSuccessMessagesEnabled: false,
      pluralFailureMessagesEnabled: false,
      colorizeUniqueMessagesEnabled: false,
      successFailureShapesEnabled: false,
      allowedSuccessFeedbackMarkerColors: ["green", "blue"],
      allowedFailureFeedbackMarkerColors: ["yellow", "red"],
      opacity : 0.3
    });
  })

  it('should return a valid rule with subject-specific settings, with plurality', function () {
    subjectRule.tolerance = "50";
    subjectRule.opacity = 0.3;
    subjectRule.failureMessage = "Subject-specific failure message";
    subjectRule.successMessage = "Subject-specific success message";
    subjectRule.pluralFailureMessage = "Subject-specific failure message for ${count} failures";
    subjectRule.pluralSuccessMessage = "Subject-specific success message for ${count} successes";

    workflowRule.pluralSuccessMessagesEnabled = true;
    workflowRule.pluralFailureMessagesEnabled = true;
    workflowRule.colorizeUniqueMessagesEnabled = true;
    workflowRule.successFailureShapesEnabled = true;

    const rule = createRule(subjectRule, workflowRule);
    expect(rule).to.deep.equal({
      failureEnabled: true,
      failureMessage: "Subject-specific failure message",
      hideSubjectViewer: false,
      id: "1234",
      strategy: "radial",
      successEnabled: true,
      successMessage: "Subject-specific success message",
      tolerance: "50",
      x: "200",
      y: "300",
      pluralSuccessMessagesEnabled: true,
      pluralFailureMessagesEnabled: true,
      colorizeUniqueMessagesEnabled: true,
      pluralFailureMessage: "Subject-specific failure message for ${count} failures",
      pluralSuccessMessage: "Subject-specific success message for ${count} successes",
      successFailureShapesEnabled: true,
      allowedSuccessFeedbackMarkerColors: ["green", "blue"],
      allowedFailureFeedbackMarkerColors: ["yellow", "red"],
      opacity : 0.3
    });
  })
});
