import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import { createSubjectSet } from './helpers';
import { useSubjectUploads } from './hooks'

function subjectSetSnapshot(manifest, metadata, project) {
  return {
    display_name: manifest.label,
    metadata,
    links:
      { project: project.id }
  }
}

function subjectSnapshot(metadata, project, subject) {
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

export default function UploadButton({
  manifest,
  metadata,
  onLoad = () => true,
  project,
  subjects
}) {
  const [error, setError] = useState(null);
  const [subjectSet, setSubjectSet] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const { loaded, uploadCount } = useSubjectUploads(uploadQueue, subjectSet);

  useEffect(() => {
    if (loaded) {
      onLoad()
    }
  }, [loaded])

  async function createSet() {
    try {
      setUploading(true);
      const _subjectSet = await createSubjectSet(subjectSetSnapshot(manifest, metadata, project));
      setSubjectSet(_subjectSet);
      const _uploadQueue = subjects.map(subject => subjectSnapshot(metadata, project, subject));
      setUploadQueue(_uploadQueue);
    } catch (error) {
      setError(error)
    }
  }

  return (
    <>
      {subjects && !uploading && <button className="standard-button" onClick={createSet}>Create a subject set</button>}
      {uploading && <p>Uploading {uploadCount}/{subjects.length} subjects.</p>}
      {error && <p><strong>{error.message}</strong></p>}
      {loaded && <Link to={`/lab/${project.id}/subject-sets/${subjectSet.id}`}>{subjectSet.display_name}</Link>}
    </>
  )
}