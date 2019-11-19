import { expect } from 'chai';
import radialReducer from './reducer';

describe('feedback drawing ellipse reducer', function () {
  const rule = {
    hideSubjectViewer: false,
    id: "1234",
    strategy: "ellipse",
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

  const annotationFailure = {
    x: 400,
    y: 500
  };

  it('should return result with failure', function () {
    expect(radialReducer(rule, [annotationFailure])).to.deep.equal({
      hideSubjectViewer: false,
      id: "1234",
      strategy: "ellipse",
      success: false,
      successEnabled: true,
      successMessage: "Success!",
      successfulClassifications: [],
      x: "200",
      y: "300",
      a: "100",
      b: "50",
      theta: "20"
    });
  });

  it('should return result with success', function () {
    expect(radialReducer(rule, [annotationSuccess])).to.deep.equal({
      hideSubjectViewer: false,
      id: "1234",
      strategy: "ellipse",
      success: true,
      successEnabled: true,
      successMessage: "Success!",
      successfulClassifications: [annotationSuccess],
      x: "200",
      y: "300",
      a: "100",
      b: "50",
      theta: "20"
    });
  });

  it('should return result with success with successful and failed annotation', function () {
    expect(radialReducer(rule, [annotationSuccess, annotationFailure])).to.deep.equal({
      hideSubjectViewer: false,
      id: "1234",
      strategy: "ellipse",
      success: true,
      successEnabled: true,
      successMessage: "Success!",
      successfulClassifications: [annotationSuccess],
      x: "200",
      y: "300",
      a: "100",
      b: "50",
      theta: "20"
    });
  });
});
