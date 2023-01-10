import { expect } from 'chai';
import sinon from 'sinon';
import ClassificationQueue from './classification-queue';
import { FakeApiClient, FakeResource } from '../../test/fake-api-client';

describe('ClassificationQueue', () => {
  let apiClient;
  let classificationQueue;
  let classificationData = { annotations: [], metadata: {}};
  afterEach(() => {
    classificationQueue._saveQueue([]);
  });
  describe('sends classifications to the backend', () => {
    beforeEach(() => {
      apiClient = new FakeApiClient();
      classificationQueue = new ClassificationQueue(apiClient);
    });
    it('saves classifications to the API', (done) => {
      classificationQueue.add(classificationData)
        .then(() => {
          expect(apiClient.saves).to.have.lengthOf(1);
        })
        .then(() => {
          done();
        })
        .catch(done);
    });
    it('does not store saved classifications', (done) => {
      classificationQueue.add(classificationData)
        .then(() => {
          expect(classificationQueue.length()).to.equal(0);
        })
        .then(() => {
          done();
        })
        .catch(done);
    });
    it('adds saved classifications to the recents queue', (done) => {
      classificationQueue.add(classificationData)
        .then(() => {
          expect(classificationQueue.recents).to.have.lengthOf(1);
        })
        .then(() => {
          done();
        })
        .catch(done);
    });
  });

  describe('keeps classifications in localStorage if backend fails', () => {
    beforeEach(() => {
      apiClient = new FakeApiClient({ canSave: () => false });
      classificationData = { annotations: [], metadata: {}};
      classificationQueue = new ClassificationQueue(apiClient);
      sinon.stub(global, 'setTimeout').callsFake(() => 100);
      sinon.stub(global, 'clearTimeout');
    });
    afterEach(() => {
      global.setTimeout.restore();
      global.clearTimeout.restore();
    });
    it('should not save failed classifications', (done) => {
      classificationQueue.add(classificationData)
        .then(() => {
          expect(apiClient.saves).to.have.lengthOf(0);
        })
        .then(done, done);
    });
    it('should queue failed classifications to retry', (done) => {
      classificationQueue.add(classificationData)
        .then(() => {
          expect(classificationQueue.length()).to.equal(1);
        })
        .then(done, done);
    });
    it('should not add failed classifications to recents', (done) => {
      classificationQueue.add(classificationData)
        .then(() => {
          expect(classificationQueue.recents).to.have.lengthOf(0);
        })
        .then(done, done);
    });
    it('should set a timer to retry failed classifications', (done) => {
      sinon.stub(classificationQueue.flushToBackend, 'bind').callsFake(() => classificationQueue.flushToBackend);
      classificationQueue.add(classificationData)
        .then(() => {
          expect(global.setTimeout.calledWith(classificationQueue.flushToBackend)).to.be.true;
          expect(classificationQueue.flushTimeout).to.equal(100);
          classificationQueue.flushToBackend.bind.restore();
        })
        .then(done, done);
    });
    it('should cancel any existing timer before flushing the queue', () => {
      classificationQueue.flushTimeout = 100;
      classificationQueue.add(classificationData);
      expect(global.clearTimeout.calledWith(100)).to.be.true;
      expect(classificationQueue.flushTimeout).to.be.null;
    });
  });
  describe('with a slow network connection', () => {
    let apiClient;
    let saveSpy;
    before(() => {
      saveSpy = sinon.stub(FakeResource.prototype, 'save').callsFake(() => (
        // stub save so that the API call never completes.
        new Promise(((resolve, reject) => ( {}))
                                         )
          )
                               )
                                                                     ));
      apiClient = new FakeApiClient();
      classificationQueue = new ClassificationQueue(apiClient);
      classificationQueue.add({ annotations: [], metadata: {}});
      classificationQueue.add({ annotations: [], metadata: {}});
    });
    after(() => ( {
      saveSpy.restore();
    });
    it('saves each classification once', () => ( {
      expect(saveSpy.callCount).to.equal(2);
    });
  });
});
