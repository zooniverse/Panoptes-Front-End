import apiClient from 'panoptes-client/lib/api-client';

class CacheClassification {
  constructor() {
    this.state = {
      cachedClassification: null,
    };
  }

  create() {
    const cachedClassification = apiClient.type('classifications').create({
      annotations: [],
      id: 'CACHED_CLASSIFICATION_DO_NOT_SAVE',
    });

    this.state = { cachedClassification };
    return this.state.cachedClassification;
  }

  update(newAnnotation) {
    let cachedClassification;
    const taskKey = newAnnotation.task;

    if (this.state.cachedClassification === null) {
      cachedClassification = this.create();
    } else {
      cachedClassification = this.state.cachedClassification;
    }
    console.log('update taskKey', taskKey);
    const cachedAnnotation = this.isAnnotationCached(taskKey);

    if (cachedAnnotation) {
      console.log('annotation is cached', cachedAnnotation);
      const index = cachedClassification.annotations.findIndex(
        (annotation) => annotation.task === taskKey);
      console.log('index', index);
      if (index > -1) {
        const newAnnotations = cachedClassification.annotations.slice(index, 1);
        cachedClassification.annotations = newAnnotations;
      }
    }
    cachedClassification.annotations.push(newAnnotation);

    cachedClassification.update('annotations');
    console.log('cachedClassification', cachedClassification);
  }

  delete() {
    this.state = { cachedClassification: null };
  }

  isAnnotationCached(taskKey) {
    let annotationToReturn = null;

    if (this.state.cachedClassification !== null) {
      const annotations = this.state.cachedClassification.annotations;
      console.log('annotations, taskKey', annotations, taskKey);
      annotations.forEach((annotation) => {
        console.log('annotation.task', annotation.task, taskKey);
        if (annotation.task === taskKey) {
          console.log('annotation task is taskkey', annotation);
          annotationToReturn = annotation;
        }
      });
    }
    console.log('annotationToReturn', annotationToReturn);

    return annotationToReturn;
  }
}


export default CacheClassification;
