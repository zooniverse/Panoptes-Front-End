import { expect } from 'chai';
import pointInEllipseReducer from './reducer';

describe('feedback drawing pointInEllipseReducer reducer', () => {
  const rule = {
    hideSubjectViewer: false,
    id: '1234',
    strategy: 'pointInEllipse',
    successEnabled: true,
    successMessage: 'Success!',
    x: '200',
    y: '300',
    toleranceA: '100',
    toleranceB: '50',
    theta: '20'
  };

  const annotationSuccess = {
    x: 200,
    y: 300
  };

  const annotationFailure = {
    x: 400,
    y: 500
  };

  it('should return result with failure', () => {
    expect(pointInEllipseReducer(rule, [annotationFailure])).to.deep.equal({
      hideSubjectViewer: false,
      id: '1234',
      strategy: 'pointInEllipse',
      success: false,
      successEnabled: true,
      successMessage: 'Success!',
      successfulClassifications: [],
      x: '200',
      y: '300',
      toleranceA: '100',
      toleranceB: '50',
      theta: '20'
    });
  });

  it('should return result with success', () => {
    expect(pointInEllipseReducer(rule, [annotationSuccess])).to.deep.equal({
      hideSubjectViewer: false,
      id: '1234',
      strategy: 'pointInEllipse',
      success: true,
      successEnabled: true,
      successMessage: 'Success!',
      successfulClassifications: [annotationSuccess],
      x: '200',
      y: '300',
      toleranceA: '100',
      toleranceB: '50',
      theta: '20'
    });
  });

  it('should return result with success with successful and failed annotation', () => {
    expect(pointInEllipseReducer(rule, [annotationSuccess, annotationFailure])).to.deep.equal({
      hideSubjectViewer: false,
      id: '1234',
      strategy: 'pointInEllipse',
      success: true,
      successEnabled: true,
      successMessage: 'Success!',
      successfulClassifications: [annotationSuccess],
      x: '200',
      y: '300',
      toleranceA: '100',
      toleranceB: '50',
      theta: '20'
    });
  });
});
