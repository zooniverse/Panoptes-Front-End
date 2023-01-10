import { expect } from 'chai';
import radialReducer from './reducer';

describe('feedback drawing radial reducer', () => {
  const rule = {
    hideSubjectViewer: false,
    id: '1234',
    strategy: 'radial',
    successEnabled: true,
    successMessage: 'Success!',
    tolerance: '50',
    x: '200',
    y: '300'
  };

  const annotationSuccess = {
    x: 200,
    y: 300
  };

  const annotationTolerance = {
    x: 225,
    y: 325
  };

  const annotationFailure = {
    x: 400,
    y: 500
  };

  it('should return result with failure', () => {
    expect(radialReducer(rule, [annotationFailure])).to.deep.equal({
      hideSubjectViewer: false,
      id: '1234',
      strategy: 'radial',
      success: false,
      successEnabled: true,
      successMessage: 'Success!',
      successfulClassifications: [],
      tolerance: '50',
      x: '200',
      y: '300'
    });
  });

  it('should return result with success', () => {
    expect(radialReducer(rule, [annotationSuccess])).to.deep.equal({
      hideSubjectViewer: false,
      id: '1234',
      strategy: 'radial',
      success: true,
      successEnabled: true,
      successMessage: 'Success!',
      successfulClassifications: [annotationSuccess],
      tolerance: '50',
      x: '200',
      y: '300'
    });
  });

  it('should return result within tolerance', () => {
    expect(radialReducer(rule, [annotationTolerance])).to.deep.equal({
      hideSubjectViewer: false,
      id: '1234',
      strategy: 'radial',
      success: true,
      successEnabled: true,
      successMessage: 'Success!',
      successfulClassifications: [annotationTolerance],
      tolerance: '50',
      x: '200',
      y: '300'
    });
  });

  it('should return result with success with successful and failed annotation', () => {
    expect(radialReducer(rule, [annotationSuccess, annotationTolerance, annotationFailure])).to.deep.equal({
      hideSubjectViewer: false,
      id: '1234',
      strategy: 'radial',
      success: true,
      successEnabled: true,
      successMessage: 'Success!',
      successfulClassifications: [annotationSuccess, annotationTolerance],
      tolerance: '50',
      x: '200',
      y: '300'
    });
  });
});
