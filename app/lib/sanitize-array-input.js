import createDOMPurify from 'dompurify';

const DOMPurify = createDOMPurify(window);

export default function sanitizeArrayInput(array) {
  const sanitizedArray = array.map(string => DOMPurify.sanitize(string));
  return sanitizedArray.filter(string => string !== '');
}
