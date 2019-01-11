import { expect } from 'chai';
import sinon from 'sinon';
import ClassificationQueue from './classification-queue';
import { FakeApiClient, FakeResource } from '../../test/fake-api-client';

describe('ClassificationQueue', function() {
  let apiClient
  let classificationQueue;
  let classificationData = {annotations: [], metadata: {}};
  afterEach(function () {
    classificationQueue._saveQueue([]);
  });
  describe('sends classifications to the backend', function () {
    beforeEach(function () {
      apiClient = new FakeApiClient();
      classificationQueue = new ClassificationQueue(apiClient);
    });
    it('saves classifications to the API', function(done) {
      classificationQueue.add(classificationData)
      .then(function () {
        expect(apiClient.saves).to.have.lengthOf(1);
      })
      .then(function () {
        done();
      })
      .catch(done);
    });
    it('does not store saved classifications', function(done) {
      classificationQueue.add(classificationData)
      .then(function () {
        expect(classificationQueue.length()).to.equal(0);
      })
      .then(function () {
        done();
      })
      .catch(done);
    });
    it('adds saved classifications to the recents queue', function(done) {
      classificationQueue.add(classificationData)
      .then(function () {
        expect(classificationQueue.recents).to.have.lengthOf(1);
      })
      .then(function () {
        done();
      })
      .catch(done);
    });
  })

  describe('keeps classifications in localStorage if backend fails', function() {
    beforeEach(function () {
      apiClient = new FakeApiClient({canSave: () => { return false; }});
      classificationData = {annotations: [], metadata: {}};
      classificationQueue = new ClassificationQueue(apiClient);
      sinon.stub(global, 'setTimeout').callsFake(() => 100);
      sinon.stub(global, 'clearTimeout');
    });
    afterEach(function () {
      global.setTimeout.restore();
      global.clearTimeout.restore();
    });
    it('should not save failed classifications', function (done) {
      classificationQueue.add(classificationData)
      .then(function () {
        expect(apiClient.saves).to.have.lengthOf(0);
      })
      .then(done, done);
    });
    it('should queue failed classifications to retry', function (done) {
      classificationQueue.add(classificationData)
      .then(function () {
        expect(classificationQueue.length()).to.equal(1);
      })
      .then(done, done);
    });
    it('should not add failed classifications to recents', function (done) {
      classificationQueue.add(classificationData)
      .then(function () {
        expect(classificationQueue.recents).to.have.lengthOf(0);
      })
      .then(done, done);
    });
    it('should set a timer to retry failed classifications', function (done) {
      sinon.stub(classificationQueue.flushToBackend, 'bind').callsFake(() => classificationQueue.flushToBackend);
      classificationQueue.add(classificationData)
      .then(function () {
        expect(global.setTimeout.calledWith(classificationQueue.flushToBackend)).to.be.true;
        expect(classificationQueue.flushTimeout).to.equal(100);
        classificationQueue.flushToBackend.bind.restore();
      })
      .then(done, done);
    });
    it('should cancel any existing timer before flushing the queue', function () {
      classificationQueue.flushTimeout = 100;
      classificationQueue.add(classificationData);
      expect(global.clearTimeout.calledWith(100)).to.be.true;
      expect(classificationQueue.flushTimeout).to.be.null;
    });
  });
  describe('with a slow network connection', function () {
    let apiClient;
    let saveSpy;
    before(function () {
      saveSpy = sinon.stub(FakeResource.prototype, 'save').callsFake(function() {
        // stub save so that the API call never completes.
        return new Promise(function (resolve, reject) {});
      });
      apiClient = new FakeApiClient();
      classificationQueue = new ClassificationQueue(apiClient);
      classificationQueue.add({annotations: [], metadata: {}});
      classificationQueue.add({annotations: [], metadata: {}});
    });
    after(function () {
      saveSpy.restore();
    });
    it('saves each classification once', function () {
      expect(saveSpy.callCount).to.equal(2);
    });
  });
});
