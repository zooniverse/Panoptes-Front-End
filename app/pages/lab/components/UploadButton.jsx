import { useState } from 'react';
import { Link } from 'react-router';

import { createSubject, createSubjectSet } from './helpers';

export default function UploadButton({
  manifest,
  metadata,
  project,
  subjects
}) {
  const [subjectSet, setSubjectSet] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  const uploaded = [];
  let failed = [];
  const subjectSetSnapshot = {
    display_name: manifest.label,
    metadata,
    links:
      { project: project.id }
  }

  function createSnapshot(subject) {
    const { priority, ...subjectMetadata } = subject.metadata;
    const { locations } = subject;
    return {
      locations,
      metadata: {
        ['#priority']: priority,
        ...metadata,
        ...subjectMetadata
      },
      links:
        { project: project.id }
    };
  }

  async function uploadSubject(snapshot) {
    try {
      const panoptesSubject = await createSubject(snapshot);
      uploaded.push(panoptesSubject);
    } catch (error) {
      console.error(error);
      failed.push(snapshot);
    }
    setUploadCount(count => count + 1);
  }

  async function uploadSnapshots(snapshots) {
    const awaitUploads = snapshots.map(uploadSubject);
    return await Promise.all(awaitUploads)
  }

  async function createSet() {
    setUploading(true);
    const _subjectSet = await createSubjectSet(subjectSetSnapshot);
    let uploadQueue = subjects.map(createSnapshot)
    await uploadSnapshots(uploadQueue);
    if (failed.length) {
      retryQueue = failed.slice();
      failed = [];
      await uploadSnapshots(retryQueue);
    }
    _subjectSet.addLink('subjects', uploaded.map(subject => subject.id));
    setSubjectSet(_subjectSet);
  }

  return (
    <>
      {subjects && !uploading && <button onClick={createSet}>Create a subject set</button>}
      {uploading && <p>Uploading {uploadCount}/{subjects.length} subjects.</p>}
      {subjectSet?.id && <Link to={`/lab/${project.id}/subject-sets/${subjectSet.id}`}>{subjectSet.display_name}</Link>}
    </>
  )
}