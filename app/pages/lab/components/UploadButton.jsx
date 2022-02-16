import { useState } from 'react'

import { createSubject, createSubjectSet } from './helpers'

export default function UploadButton({
  manifest,
  metadata,
  project,
  subjects
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  async function createSet() {
    setUploading(true);
    const subjectSet = await createSubjectSet({
      display_name: manifest.label,
      metadata,
      links:
        { project: project.id }
    });

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

    const _subjects = await Promise.all(subjects.map(uploadSubject));
    subjectSet.addLink('subjects', _subjects.map(subject => subject.id));
  }

  return (
    <>
      {subjects && !uploading && <button onClick={createSet}>Create a subject set</button>}
      {uploading && <p>Uploading {uploadCount}/{subjects.length} subjects.</p>}
    </>
  )
}