import { captureException, withScope } from '@sentry/browser';
import getSubjectLocation from './getSubjectLocation';
import loadImage from './loadImage';

export default function preloadSubject(subject) {
  return Promise.all(subject.locations.map(function preloadLocation(location, i) {
    const { type, src } = getSubjectLocation(subject, i);
    if (type === 'image') {
      return loadImage(src).catch((error) => {
        console.error(error);
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
  }));
}
