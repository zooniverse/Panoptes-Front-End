import { captureException, withScope } from '@sentry/browser';
import getSubjectLocation from './getSubjectLocation';
import loadImage from './loadImage';

function preloadLocation(subject, type, src) {
  if (type === 'image') {
    return loadImage(src).catch((errorEvent) => {
      console.error(errorEvent);
      const error = new Error('Subject Image: loading failed.');
      withScope((scope) => {
        scope.setExtra('subjectID', subject.id);
        scope.setExtra('type', type);
        scope.setExtra('location', src);
        captureException(error);
      });
    })
  } else {
    console.warn(`Not sure how to load subject ${subject.id} location of type ${type} (${src})`)
  }
}

export default async function preloadSubject(subject) {
  await Promise.all(subject.locations.map((loc, i) => {
    const { type, src } = getSubjectLocation(subject, i);
    return preloadLocation(subject, type, src);
  }));
  return subject;
}
