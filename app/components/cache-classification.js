class CacheClassification {
  constructor() {
    this.state = {
      cachedClassification: null,
    };
  }

  create() {
    const cachedClassification = { annotations: [] };

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
    const cachedAnnotation = this.isAnnotationCached(taskKey);

    if (cachedAnnotation) {
      const index = cachedClassification.annotations.findIndex(
        (annotation) => annotation.task === taskKey);

      if (index > -1) {
        cachedClassification.annotations.splice(index, 1);
      }
    }
    cachedClassification.annotations.push(newAnnotation);
  }

  delete() {
    this.state = { cachedClassification: null };
  }

  isAnnotationCached(taskKey) {
    let annotationToReturn = null;

    if (this.state.cachedClassification !== null) {
      const annotations = this.state.cachedClassification.annotations;
      annotations.forEach((annotation) => {
        if (annotation.task === taskKey) {
          annotationToReturn = annotation;
        }
      });
    }

    return annotationToReturn;
  }
}

const cachedClassification = new CacheClassification;
export default cachedClassification;
