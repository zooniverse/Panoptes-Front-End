import { expect } from 'chai';
import radialReducer from './reducer';

describe('feedback drawing radial reducer', function () {
  const rule = {
    hideSubjectViewer: false,
    id: "1234",
    strategy: "radial",
    successEnabled: true,
    successMessage: "Success!",
    x: "200",
    y: "300",
    a: "100",
    b: "50",
    theta: "20"
  };

  const annotationSuccess = {
    x: 200,
    y: 300,
  };

  const annotationTolerance = {
    x: 225,
    y: 325
  };

  const annotationFailure = {
    x: 400,
    y: 500
  };

  it('should return result with failure', function () {
    expect(radialReducer(rule, [annotationFailure])).to.deep.equal({
      hideSubjectViewer: false,
      id: "1234",
      strategy: "radial",
      success: false,
      successEnabled: true,
      successMessage: "Success!",
      successfulClassifications: [],
      x: "200",
      y: "300"
    });
  });

  it('should return result with success', function () {
    expect(radialReducer(rule, [annotationSuccess])).to.deep.equal({
      hideSubjectViewer: false,
      id: "1234",
      strategy: "radial",
      success: true,
      successEnabled: true,
      successMessage: "Success!",
      successfulClassifications: [annotationSuccess],
      x: "200",
      y: "300"
    });
  });

  it('should return result within tolerance', function () {
    expect(radialReducer(rule, [annotationTolerance])).to.deep.equal({
      hideSubjectViewer: false,
      id: "1234",
      strategy: "radial",
      success: true,
      successEnabled: true,
      successMessage: "Success!",
      successfulClassifications: [annotationTolerance],
      x: "200",
      y: "300"
    });
  });

  it('should return result with success with successful and failed annotation', function () {
    expect(radialReducer(rule, [annotationSuccess, annotationTolerance, annotationFailure])).to.deep.equal({
      hideSubjectViewer: false,
      id: "1234",
      strategy: "radial",
      success: true,
      successEnabled: true,
      successMessage: "Success!",
      successfulClassifications: [annotationSuccess, annotationTolerance],
      x: "200",
      y: "300"
    });
  });
});
