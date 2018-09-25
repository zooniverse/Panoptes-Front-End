import { expect } from 'chai';
import sinon from 'sinon';
import ClassificationQueue from './classification-queue';
import FakeLocalStorage from '../../test/fake-local-storage';
import { FakeApiClient, FakeResource } from '../../test/fake-api-client';

describe('ClassificationQueue', function() {
  it('sends classifications to the backend', function(done) {
    let apiClient = new FakeApiClient();
    let storage = new FakeLocalStorage();

    let classificationData = {annotations: [], metadata: {}};
    let classificationQueue = new ClassificationQueue(storage, apiClient);
    classificationQueue.add(classificationData)
    .then(function () {
      expect(apiClient.saves).to.have.lengthOf(1);
      expect(classificationQueue.length()).to.equal(0);
    })
    .then(function () {
      done();
    });
  });

  it('keeps classifications in localStorage if backend fails', function(done) {
    let apiClient = new FakeApiClient({canSave: () => { return false; }});
    let storage = new FakeLocalStorage();

    let classificationData = {annotations: [], metadata: {}};
    let classificationQueue = new ClassificationQueue(storage, apiClient);
    classificationQueue.add(classificationData)
    .catch(function () {
      expect(apiClient.saves).to.have.lengthOf(0);
      expect(classificationQueue.length()).to.equal(1);
    })
    .then(function () {
      done();
    });
  });
  describe('with a slow network connection', function () {
    let apiClient;
    let classificationQueue;
    let saveSpy;
    before(function () {
      saveSpy = sinon.stub(FakeResource.prototype, 'save').callsFake(function() {
        // stub save so that the API call never completes.
        return new Promise(function (resolve, reject) {});
      });
      apiClient = new FakeApiClient();
      classificationQueue = new ClassificationQueue(window.localStorage, apiClient);
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
