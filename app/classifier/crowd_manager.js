/*
 WHERE THE MAGIC HAPPENS

 This is where we determine which crowd provider we're using based on the available query
 parameters, provide the relevant metadata to add on to the classification, and provide a way of
 triggering the appropriate callback.

 We currently work with two providers: Clickworker and MTurk. Clickworker requires an external API
 call, and MTurk just needs a form submitting.
 */
import qs from 'qs'

class NoopHandler {
  constructor(queryParams) {
    this._queryParams = queryParams
    this.previewMode = false
  }

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

  getMetadata() {
    console.info('NoopHandler, so no additional metadata')
    return {}
  }

  triggerCallback() {
    console.info('NoopHandler, so nothing to do here')
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
}

class MTurkHandler extends NoopHandler {
  constructor(queryParams) {
    super(queryParams)
    this.previewMode = this.determinePreviewMode()
  }

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
