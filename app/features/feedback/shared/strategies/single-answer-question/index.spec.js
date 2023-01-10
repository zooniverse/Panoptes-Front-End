import chai from 'chai';

import index from './index';

const expect = chai.expect;

describe('Feedback > Single Answer Question > Index', () => {
  it('should have a `createRule` property', () => {
    expect(index.createRule).to.be.a('function');
  });

  it('should have a `id` property', () => {
    expect(index.id).to.equal('singleAnswerQuestion');
  });

  it('should have a `title` property', () => {
    expect(index.title).to.equal('Single Answer Question');
  });

  it('should have a `labComponent` property', () => {
    expect(index.labComponent).to.equal(null);
  });

  it('should have a `validations` property', () => {
    expect(index.validations).to.equal(null);
  });

  it('should have a `reducer` property', () => {
    expect(index.reducer).to.be.a('function');
  });
});
