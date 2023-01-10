import chai from 'chai';

import reducer from './reducer';

const { expect } = chai;

describe('Feedback > Survey > Reducer', () => {
  it('should not mutate the original object', () => {
    const original = { choiceIds: 'AARDVARK,HONEYBADGER' };
    const reduced = reducer(original);
    expect(reduced).to.not.equal(original);
  });

  it('should handle correct choiceIds', () => {
    const rule = { choiceIds: 'AARDVARK,HONEYBADGER' };
    const result = reducer(rule, [
      {
        choice: 'AARDVARK'
      },
      {
        choice: 'HONEYBADGER'
      }
    ]);
    expect(result.success).to.be.true;
  });

  it('should handle an incorrect choiceIds', () => {
    const rule = { choiceIds: 'AARDVARK,HONEYBADGER' };
    const result = reducer(rule, [
      {
        choice: 'BUSHPIG'
      }
    ]);
    expect(result.success).to.be.false;
  });

  it('should handle a partial match of choiceIds', () => {
    const rule = { choiceIds: 'AARDVARK,HONEYBADGER' };
    const result = reducer(rule, [
      {
        choice: 'HONEYBADGER'
      }
    ]);
    expect(result.success).to.be.false;
  });

  it('should handle a correct empty choiceIds', () => {
    const rule = { choiceIds: '' };
    const result = reducer(rule, []);
    expect(result.success).to.be.true;
  });

  it('should handle an incorrect empty choiceIds', () => {
    const rule = { choiceIds: 'AARDVARK,HONEYBADGER' };
    const result = reducer(rule, []);
    expect(result.success).to.be.false;
  });
});
