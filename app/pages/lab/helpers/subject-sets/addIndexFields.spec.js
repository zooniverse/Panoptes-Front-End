import { expect } from 'chai';
import sinon from 'sinon';
import addIndexFields from './addIndexFields';

describe('addIndexFields', function () {
  let subjectSet;

  beforeEach(function () {
    subjectSet = {
      metadata: {},
      update(data) {
        subjectSet.metadata.indexFields = data['metadata.indexFields'];
      },
      save: sinon.stub()
    };
  });

  describe('with marked headers in the manifest', function () {
    beforeEach(function () {
      const data = [{
        '%title': 'test thing',
        description: 'ignore me',
        '%creator': 'someone'
      }];
      addIndexFields(subjectSet, data);
    });

    it('should set subject set index fields', function () {
      expect(subjectSet.metadata.indexFields).to.equal('title,creator');
    });

    it('should save the subject set', function () {
      expect(subjectSet.save).to.have.been.calledOnce;
    });
  });

  describe('without marked headers in the manifest', function () {
    beforeEach(function () {
      const data = [{
        title: 'test thing',
        description: 'ignore me',
        creator: 'someone'
      }];
      addIndexFields(subjectSet, data);
    });

    it('should not set subject set index fields', function () {
      expect(subjectSet.metadata.indexFields).to.be.undefined;
    });

    it('should not save the subject set', function () {
      expect(subjectSet.save).to.not.have.been.called;
    });
  });
});
