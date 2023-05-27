import { useState } from 'react'
import apiClient from 'panoptes-client/lib/api-client';

import ClassificationData from './user-settings/ClassificationData';

export default function SubjectAdmin({ params }) {
  const [subject, setSubject] = useState(null);
  const [classifications, setClassifications] = useState([]);
  const [fetching, setFetching] = useState(false);
  
  async function getSubject() {
    const subject = await apiClient.type('subjects').get(params.id);
    setSubject(subject);
  }

  async function getClassifications() {
    const classifications = await apiClient.type('classifications').get({ subject_id: params.id });
    setClassifications(classifications);
  }

  if (!fetching) {
    getSubject();
    getClassifications();
    setFetching(true);
  }

  return(
    <div>
      <h1>Subject {params.id}</h1>
      <h2>Classifications</h2>
      <ol>
      {classifications.map(classification => (
        <li key={classification.id}>
          <ClassificationData classification={classification} />
        </li>
      ))}
      </ol>
    </div>
  );
}