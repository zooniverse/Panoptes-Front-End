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

  async function uploadSubject(subject) {
    const { priority, ...subjectMetadata } = subject.metadata;
    const { locations } = subject;
    const panoptesSubject = await createSubject({
      locations,
      metadata: {
        ['#priority']: priority,
        ...metadata,
        ...subjectMetadata
      },
      links:
        { project: project.id }
    });
    setUploadCount(count => count + 1);
    return panoptesSubject;
  }

  async function createSet() {
    setUploading(true);
    const _subjectSet = await createSubjectSet({
      display_name: manifest.label,
      metadata,
      links:
        { project: project.id }
    });

    const _subjects = await Promise.all(subjects.map(uploadSubject));
    _subjectSet.addLink('subjects', _subjects.map(subject => subject.id));
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