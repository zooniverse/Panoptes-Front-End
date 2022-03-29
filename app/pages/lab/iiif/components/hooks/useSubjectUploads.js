import { useEffect, useState } from 'react'

import { createSubject } from '../helpers'

export default function useSubjectUploads(snapshots = [], subjectSet) {
  const [uploaded, setUploaded] = useState([])
  const [error, setError] = useState(null)
  const [failed, setFailed] = useState([])
  const [finished, setFinished] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [uploadCount, setUploadCount] = useState(0)

  async function uploadSubject(snapshot) {
    try {
      const panoptesSubject = await createSubject(snapshot)
      setUploaded(subjects => [...subjects, panoptesSubject])
      setUploadCount(count => count + 1)
    } catch (error) {
      if (error.status) {
        setError(error)
      } else {
        setFailed(subjects => [...subjects, snapshot])
      }
    }
  }

  async function uploadQueue(_snapshots) {
    setFinished(false)
    setFailed([])
    const awaitUploads = _snapshots.map(uploadSubject)
    await Promise.all(awaitUploads)
    setFinished(true)
  }

  useEffect(() => {
    if (uploadCount === 0 && subjectSet && snapshots.length) {
      setUploaded([])
      uploadQueue(snapshots)
    }
  }, [subjectSet, snapshots, uploadCount])

  useEffect(() => {
    if (finished && failed.length > 0) {
      const retryQueue = failed.slice()
      uploadQueue(retryQueue)
    }
    if (finished && failed.length === 0) {
      subjectSet.addLink('subjects', uploaded.map(subject => subject.id))
      setLoaded(true)
    }
  }, [failed, finished, uploaded])

  return { error, loaded, uploadCount }
}
