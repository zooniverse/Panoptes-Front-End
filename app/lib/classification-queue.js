/* eslint no-underscore-dangle: ["error", {"allowAfterThis": true}] */
import apiClient from 'panoptes-client/lib/api-client';

const FAILED_CLASSIFICATION_QUEUE_NAME = 'failed-classifications';
const MAX_RECENTS = 10;

class ClassificationQueue {
  constructor(storage, api, onClassificationSaved) {
    this.storage = storage || window.localStorage;
    this.apiClient = api || apiClient;
    this.recents = [];
    this.onClassificationSaved = onClassificationSaved;
  }

  add(classification) {
    const queue = this._loadQueue();
    queue.push(classification);

    try {
      this._saveQueue(queue);
      console.info('Queued classifications:', queue.length);
    } catch (error) {
      console.error('Failed to queue classification:', error);
    }

    this.flushToBackend();
  }

  length() {
    return this._loadQueue().length;
  }

  addRecent(classification) {
    if (this.recents.length > MAX_RECENTS) {
      const droppedClassification = this.recents.pop();
      droppedClassification.destroy();
    }

    this.recents.unshift(classification);
  }

  flushToBackend() {
    const queue = this._loadQueue();

    if (queue.length > 0) {
      console.log('Saving queued classifications:', queue.length);
      queue.forEach((classificationData) => {
        this.apiClient.type('classifications').create(classificationData).save().then((actualClassification) => {
          console.log('Saved classification', actualClassification.id);
          this.onClassificationSaved(actualClassification);
          this.addRecent(actualClassification);

          const indexInQueue = queue.indexOf(classificationData);
          queue.splice(indexInQueue, 1);

          try {
            this._saveQueue(queue);
            console.info('Saved a queued classification, remaining:', queue.length);
          } catch (error) {
            console.error('Failed to update classification queue:', error);
          }
        })
        .catch((error) => {
          if (process.env.BABEL_ENV !== 'test') console.error('Failed to save a queued classification:', error);

          if (error.status === 422) {
            console.error('Dropping malformed classification permanently', classificationData);
            const indexInQueue = queue.indexOf(classificationData);
            queue.splice(indexInQueue, 1);

            try {
              this._saveQueue(queue);
            } catch (saveQueueError) {
              console.error('Failed to update classification queue:', saveQueueError);
            }
          }
        });
      });
    }
  }

  _loadQueue() {
    let queue = JSON.parse(this.storage.getItem(FAILED_CLASSIFICATION_QUEUE_NAME));

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
