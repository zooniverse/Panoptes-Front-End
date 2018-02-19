import apiClient from 'panoptes-client/lib/api-client';
import { Split } from 'seven-ten';

const FAILED_CLASSIFICATION_QUEUE_NAME = 'failed-classifications';
const MAX_RECENTS = 10;

class ClassificationQueue {
    constructor(storage, api) {
        this.storage = storage || window.localStorage;
        this.apiClient = api || apiClient;
        this.recents = [];
    }

    add(classification) {
        var queue = this._loadQueue();
        queue.push(classification);

        try {
            this._saveQueue(queue);
            console.info('Queued classifications:', queue.length);
        }
        catch(error) {
            console.error('Failed to queue classification:', error);
        }

        this.flushToBackend();
    }

    length() {
        return this._loadQueue().length
    }

    addRecent(classification) {
        if (this.recents.length > MAX_RECENTS) {
            let droppedClassification = this.recents.pop();
            droppedClassification.destroy();
        }

        this.recents.unshift(classification);
    }

    flushToBackend() {
        var queue = this._loadQueue();

        if (queue.length > 0) {
            console.log('Saving queued classifications:', queue.length);
            for (let classificationData of queue) {
                this.apiClient.type('classifications').create(classificationData)
                    .save()
                    .then((actualClassification) => {
                        console.log('Saved classification', actualClassification.id);
                        Split.classificationCreated(actualClassification); // Metric log needs classification id
                        this.addRecent(actualClassification);
                        let indexInQueue = queue.indexOf(classificationData);
                        queue.splice(indexInQueue, 1);
                        try {
                            this._saveQueue(queue);
                            console.info('Saved a queued classification, remaining:', queue.length);
                        }
                        catch(error) {
                            console.error('Failed to update classification queue:', error);
                        }
                    })
                    .catch(function(error) {
                        console.error('Failed to save a queued classification:', error);

                        switch(error.status) {
                        case 422:
                            console.error("Dropping malformed classification permanently", classificationData);
                            let indexInQueue = queue.indexOf(classificationData);
                            queue.splice(indexInQueue, 1);
                            try {
                                this._saveQueue(queue);
                            }
                            catch(error) {
                                console.error('Failed to update classification queue:', error);
                            }
                            break;
                        }
                    });
            }
        }
    }

    _loadQueue() {
        var queue = JSON.parse(this.storage.getItem(FAILED_CLASSIFICATION_QUEUE_NAME));

        if (queue === undefined || queue === null) {
            queue = [];
        }

        return queue;
    }

    _saveQueue(queue) {
        this.storage.setItem(FAILED_CLASSIFICATION_QUEUE_NAME, JSON.stringify(queue));
    }

}

export default ClassificationQueue;
