/* eslint no-underscore-dangle: ["error", {"allowAfterThis": true}] */
import apiClient from 'panoptes-client/lib/api-client';

const FAILED_CLASSIFICATION_QUEUE_NAME = 'failed-classifications';
const MAX_RECENTS = 10;
const RETRY_INTERVAL = 5 * 60 * 1000;

class ClassificationQueue {
  constructor(api, onClassificationSaved) {
    this.storage = window.localStorage;
    this.apiClient = api || apiClient;
    this.recents = [];
    this.flushTimeout = null;
    this.onClassificationSaved = onClassificationSaved || function () { return true; };
  }

  add(classification) {
    this.store(classification);
    return this.flushToBackend();
  }

  store(classification) {
    const queue = this._loadQueue();
    queue.push(classification);

    try {
      this._saveQueue(queue);
      if (process.env.BABEL_ENV !== 'test') console.info('Queued classifications:', queue.length);
    } catch (error) {
      if (process.env.BABEL_ENV !== 'test') console.error('Failed to queue classification:', error);
    }
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
    const pendingClassifications = this._loadQueue();
    const failedClassifications = [];
    this._saveQueue(failedClassifications);
    if (this.flushTimeout) {
      clearTimeout(this.flushTimeout);
      this.flushTimeout = null;
    }

    if (process.env.BABEL_ENV !== 'test') console.log('Saving queued classifications:', pendingClassifications.length);
    return Promise.all(pendingClassifications.map((classificationData) => {
      return this.apiClient.type('classifications').create(classificationData).save()
      .then((actualClassification) => {
        console.log('Saved classification', actualClassification.id);
        this.onClassificationSaved(actualClassification);
        this.addRecent(actualClassification);
      })
      .catch((error) => {
        if (process.env.BABEL_ENV !== 'test') console.error('Failed to save a queued classification:', error);

        if (error.status !== 422) {
          try {
            this.store(classificationData);
            if (!this.flushTimeout) {
              this.flushTimeout = setTimeout(this.flushToBackend.bind(this), RETRY_INTERVAL);
            }
          } catch (saveQueueError) {
            console.error('Failed to update classification queue:', saveQueueError);
          }
        } else {
          console.error('Dropping malformed classification permanently', classificationData);
        }
      });
    }));
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
