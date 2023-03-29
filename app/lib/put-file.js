import createDOMPurify from 'dompurify';

const DOMPurify = createDOMPurify(window);
const sanitiseOptions = {
  USE_PROFILES: {
    svg: true,
    svgFilters: true
  },
  ADD_TAGS: [
    'animate',
    'use'
  ],
  ADD_ATTR: [
    'calcmode'
  ]
}

const ALLOWED_MEDIA_TYPES = ['image', 'audio', 'video'];
const ALLOWED_FILE_TYPES = ['text/plain', 'application/json', 'application/pdf'];

export default async function putFile(url, file, headers = {}) {
  const [type] = file.type.split('/');
  const allowedUpload =
    ALLOWED_MEDIA_TYPES.includes(type) ||
    ALLOWED_FILE_TYPES.includes(file.type);
  if (allowedUpload) {
    let sanitisedFile = file
    if (file.type === 'image/svg+xml') {
      sanitisedFile = await file.text();
      sanitisedFile = DOMPurify.sanitize(sanitisedFile, sanitiseOptions);
    }
    const options = {
      method: 'PUT',
      headers: {
        ...headers,
        'x-ms-blob-type': 'BlockBlob'
      },
      body: sanitisedFile
    };
    const response = await fetch(url, options);
    if (response.ok) {
      return response.blob();
    } else {
      throw new Error(`${response.status}: ${url} upload failed. ${response.statusText}`);
    }
  } else {
    throw new Error(`${file.type} files cannot be uploaded to Panoptes.`);
  }
};
