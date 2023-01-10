import chai from 'chai';

import index from './index';

const expect = chai.expect;

describe('Feedback > Survey > Index', () => {
  it('should have a `createRule` property', () => {
    expect(index.createRule).to.be.a('function');
  });

  it('should have a `id` property', () => {
    expect(index.id).to.equal('surveySimple');
  });

  it('should have a `title` property', () => {
    expect(index.title).to.equal('Survey: Simple');
  });

  it('should have a `labComponent` property', () => {
    expect(index.labComponent).to.be.null;
  });

  it('should have a `validations` property', () => {
    expect(index.validations).to.be.null;
  });

  it('should have a `reducer` property', () => {
    expect(index.reducer).to.be.a('function');
  });
});
