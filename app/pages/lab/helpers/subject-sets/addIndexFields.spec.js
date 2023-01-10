import { expect } from 'chai';
import sinon from 'sinon';
import addIndexFields from './addIndexFields';

describe('addIndexFields', () => {
  let subjectSet;

  beforeEach(() => {
    subjectSet = {
      metadata: {},
      update(data) {
        subjectSet.metadata.indexFields = data['metadata.indexFields'];
      },
      save: sinon.stub()
    };
  });

  describe('with marked headers in the manifest', () => {
    beforeEach(() => {
      const data = [{
        '%title': 'test thing',
        description: 'ignore me',
        '%creator': 'someone'
      }];
      addIndexFields(subjectSet, data);
    });

    it('should set subject set index fields', () => {
      expect(subjectSet.metadata.indexFields).to.equal('title,creator');
    });

    it('should save the subject set', () => {
      expect(subjectSet.save).to.have.been.calledOnce;
    });
  });

  describe('without marked headers in the manifest', () => {
    beforeEach(() => {
      const data = [{
        title: 'test thing',
        description: 'ignore me',
        creator: 'someone'
      }];
      addIndexFields(subjectSet, data);
    });

    it('should not set subject set index fields', () => {
      expect(subjectSet.metadata.indexFields).to.be.undefined;
    });

    it('should not save the subject set', () => {
      expect(subjectSet.save).to.not.have.been.called;
    });
  });
});
