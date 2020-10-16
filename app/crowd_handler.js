/*
  WHERE THE 1715 LABS MAGIC HAPPENS

  This is where we determine which crowd provider we're using based on the available query
  parameters, provide the relevant metadata to add on to the classification, and provide a way of
  triggering the appropriate callback.

  We currently work with two providers: Clickworker and MTurk. Clickworker requires an external API
  call, and MTurk just needs a form submitting.

  The crowd handler is required in two places:
  - classify.jsx
    We instantiate the handler class here, hook it into the `onClassificationSaved` event to
    trigger the callback, and pass it as a prop to...
  - classifier.jsx
    We use the handler to provide the additional metadata on the classification from the crowd
    provider.
 */
import qs from 'qs'

class NoopHandler {
  constructor(queryParams) {
    this._queryParams = queryParams
    this.previewMode = false
    console.group('1715 Labs Crowd Handler config')
    console.info('CLICKWORKER_POSTBACK_URL', process.env.CLICKWORKER_POSTBACK_URL)
    console.info('MTURK_POSTBACK_URL', process.env.MTURK_POSTBACK_URL)
    console.groupEnd()
  }

  // Extract the keys passed via the arguments from the queryParams property, and return as
  // an object.
  constructMetadata() {
    const metadata = {}
    for (const targetParam of arguments) {
      const value = this._queryParams[targetParam]
      if (!!value) {
        metadata[targetParam] = value
      }
    }
    return metadata
  }

  // Provide the crowd platform metadata for the classification.
  getMetadata() {
    console.info('NoopHandler, so no additional metadata')
    return {}
  }

  // Trigger the postback process for completing a task on the crowd platform.
  triggerCallback(classification) {
    console.info('NoopHandler, so nothing to do here')
    console.info('Classification:', classification)
    return
  }
}

class ClickworkerHandler extends NoopHandler {
  getMetadata() {
    const metadata = this.constructMetadata('job_id', 'user_id', 'task_id')
    return {
      clickworker: {...metadata}
    }
  }

  triggerCallback(classification) {
    const redirectQueryParams = {
      'classification_id': classification.id,
      'job_id': this._queryParams['job_id'],
      'task_id': this._queryParams['task_id'],
      'user_id': this._queryParams['user_id'],
    }

    const newUrl = process.env.CLICKWORKER_POSTBACK_URL + '?' + qs.stringify(redirectQueryParams)
    window.location = newUrl
  }
}

class MTurkHandler extends NoopHandler {
  constructor(queryParams) {
    super(queryParams)
    this.previewMode = this.determinePreviewMode()
  }

  // MTurk has a preview mode which should be set when the `assignmentId` query param is set to
  // `'ASSIGNMENT_ID_NOT_AVAILABLE'`. In preview mode, interaction with the underlying iFrame needs
  // needs to be prevented.
  determinePreviewMode() {
    return this._queryParams.assignmentId &&
      this._queryParams.assignmentId === 'ASSIGNMENT_ID_NOT_AVAILABLE'
  }

  getMetadata() {
    const metadata = this.constructMetadata('assignmentId', 'hitId', 'turkSubmitTo', 'workerId')
    return {
      mturk: {...metadata}
    }
  }

  // MTurk likes us to submit the callback via form submission, so we create a hidden one, append it
  // to the DOM, and trigger submit.
  createFormAndPost(path, params, method='post') {
    const form = document.createElement('form');
    form.method = method;
    form.action = path;

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = params[key];

        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
  }

  triggerCallback(classification) {
    const assignmentId = this._queryParams['assignmentId']
    const classificationId = classification.id

    if (!assignmentId) {
      console.error('MTurk `assignmentId` not found, skipping postback')
      return false;
    }

    const path = process.env.MTURK_POSTBACK_URL
    this.createFormAndPost(path, { assignmentId, classificationId });
  }
}

export function getCrowdHandler() {
  const queryParams = qs.parse(window.location.search.slice(1));

  if (queryParams.hitId) {
    console.info('Detected crowd provider: MTurk')
    return new MTurkHandler(queryParams)
  }

  if (queryParams.user_id) {
    console.info('Detected crowd provider: Clickworker')
    return new ClickworkerHandler(queryParams)
  }

  console.info('No crowd provider detected')
  return new NoopHandler(queryParams)
}
