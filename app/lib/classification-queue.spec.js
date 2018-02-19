import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import ClassificationQueue from './classification-queue';

class LocalStorageMock {
    constructor() {
        this.storage = {};
    }

    getItem(key) {
        if (key in this.storage) {
            return this.storage[key];
        } else {
            return null;
        }
    }

    setItem(key, value) {
        this.storage[key] = value.toString();
    }

    removeItem(key) {
        delete this.storage[key];
    }

    get length() {
        return Object.keys(this.storage).length;
    }

    key(i) {
        let keys = Object.keys(this.storage);
        return keys[i] || null;
    }
}

describe('ClassificationQueue', function() {
    it('sends classifications to the backend', function() {
        // sinon.stub(apiClient, 'type');
        // sinon.stub(apiClient.type(''))
        // const resource = apiClient.type(type).create(options);
        // apiClient._typesCache = {};
        // sinon.stub(resource, 'save').callsFake(() => Promise.resolve(resource));
        // sinon.stub(resource, 'get');
        // sinon.stub(resource, 'delete');

        // let classificationData = {annotations: [], metadata: {}};
        // let classification = mockPanoptesResource('classification', classificationData);

        // let storage = new LocalStorageMock();
        // let classificationQueue = new ClassificationQueue(storage);
        // classificationQueue.add(classificationData);

        // sinon.assert.calledOnce(classification.save);

        fail()

    });
});
