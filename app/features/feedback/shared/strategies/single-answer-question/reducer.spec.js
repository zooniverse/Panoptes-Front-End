import chai from 'chai';

import reducer from './reducer';

const expect = chai.expect;

describe('Feedback > Single Answer Question > Reducer', () => {
  it('should not mutate the original object', () => {
    const original = { answer: '0' };
    const reduced = reducer(original);
    expect(reduced).to.not.equal(original);
  });

  it('should handle a correct answer', () => {
    const rule = { answer: '0' };
    const result = reducer(rule, 0);
    expect(result.success).to.be.true;
  });

  it('should handle an incorrect answer', () => {
    const rule = { answer: '1' };
    const result = reducer(rule, 2);
    expect(result.success).to.be.false;
  });

  it('should handle a correct undefined answer', () => {
    const rule = { answer: '-1' };
    const result = reducer(rule, undefined);
    expect(result.success).to.be.true;
  });

  it('should handle an incorrect undefined answer', () => {
    const rule = { answer: '0' };
    const result = reducer(rule, undefined);
    expect(result.success).to.be.false;
  });

  it('should handle a correct null answer', () => {
    const rule = { answer: '-1' };
    const result = reducer(rule, null);
    expect(result.success).to.be.true;
  });

  it('should handle an incorrect null answer', () => {
    const rule = { answer: '0' };
    const result = reducer(rule, null);
    expect(result.success).to.be.false;
  });
});
