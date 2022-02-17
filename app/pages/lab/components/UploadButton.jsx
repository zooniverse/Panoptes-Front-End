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
  const failed = [];

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

  async function createSet() {
    setUploading(true);
    const _subjectSet = await createSubjectSet({
      display_name: manifest.label,
      metadata,
      links:
        { project: project.id }
    });

    const uploadQueue = subjects.map(createSnapshot)
    await Promise.all(uploadQueue.map(uploadSubject));
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