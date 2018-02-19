import assert from 'assert';
import ClassificationQueue from './classification-queue';
import FakeLocalStorage from '../../test/fake-local-storage';
import { FakeApiClient } from '../../test/fake-api-client';

describe('ClassificationQueue', function() {
    it('sends classifications to the backend', function() {
        let apiClient = new FakeApiClient();
        let storage = new FakeLocalStorage();

        let classificationData = {annotations: [], metadata: {}};
        let classificationQueue = new ClassificationQueue(storage, apiClient);
        classificationQueue.add(classificationData);

        assert.equal(apiClient.saves.length, 1);
    });

    it('keeps classifications in localStorage if backend fails', function() {
        let apiClient = new FakeApiClient({canSave: () => { return false; }});
        let storage = new FakeLocalStorage();

        let classificationData = {annotations: [], metadata: {}};
        let classificationQueue = new ClassificationQueue(storage, apiClient);
        classificationQueue.add(classificationData);

        assert.equal(apiClient.saves.length, 0);
        assert.equal(classificationQueue.length(), 1);
    });
});
