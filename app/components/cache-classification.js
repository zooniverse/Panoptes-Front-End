import apiClient from 'panoptes-client/lib/api-client';

class CacheClassification {
  constructor() {
    this.state = {
      cachedClassification: null,
    };
  }

  create() {
    apiClient.type('classifications').create({
      annotations: [],
      id: 'CACHED_CLASSIFICATION_DO_NOT_SAVE',
    }).then((classification) => {
      this.state = { cachedClassification: classification };
      return this.state.cachedClassification;
    });
  }

  update(newAnnotation) {
    let cachedClassification;

    if (this.state.cachedClassification === null) {
      console.log('this.state.cachedClassification is null', this.state.cachedClassification);
      cachedClassification = this.create();
    } else {
      cachedClassification = this.state.cachedClassification;
    }
    console.log('cachedClassification', cachedClassification);

    cachedClassification.annotations[cachedClassification.annotations.length - 1] = newAnnotation;
    cachedClassification.update('annotations');
  }

  delete() {
    this.state = { cachedClassification: null };
  }

  isAnnotationCached(taskKey) {
    if (this.state.cachedClassification !== null) {
      const annotations = this.state.cachedClassification.annotations;

      annotations.forEach((annotation) => {
        if (annotation.task === taskKey) {
          return annotation;
        }

        return null;
      });
    }

    return null;
  }
}


export default CacheClassification;
