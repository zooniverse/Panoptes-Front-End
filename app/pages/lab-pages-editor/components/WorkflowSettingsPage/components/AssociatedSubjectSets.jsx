import { useState, useEffect } from 'react';

const ARBITRARY_PAGE_SIZE = 250;  // If a project has more than this number of subject sets, then we need a better solution.

export default function AssociatedSubjectSets({ project, workflow }) {
  const [apiData, setApiData] = useState({
    subjectSets: null,
    status: 'ready'
  });

  useEffect(() => {
    async function fetchSubjectSets() {
      try {
        setApiData({
          subjectSets: null,
          status: 'fetching'
        });

        const ssets = await project.get('subject_sets', { sort: '-id', page_size: ARBITRARY_PAGE_SIZE });
        if (!ssets) throw new Error('No subject sets');

        setApiData({
          subjectSets: ssets,
          status: 'ready'
        });

      } catch (err) {
        console.error('AssosicatedSubjectSets: ', err);
        setApiData({
          subjectSets: null,
          status: 'error'
        });
      }
    }

    fetchSubjectSets();
  }, [project, workflow]);

  if (!project || !workflow) return null;

  if (apiData.status === 'fetching') {
    return (<div className="status-banner fetching">Fetching Subject Sets...</div>)
  }

  if (apiData.status === 'error') {
    return (<div className="status-banner error">ERROR: couldn't fetch Subject Sets</div>)
  }

  return (
    <ul className="checkbox-group">
      {apiData?.subjectSets?.map((subjectSet, index) => (
        <li key={`associated-subject-set-${subjectSet.id}`}>
          <input id={`associated-subject-set-${subjectSet.id}`} type="checkbox" />
          <label htmlFor={`associated-subject-set-${subjectSet.id}`}>{subjectSet.display_name || '???'}</label>
        </li>
      ))}
    </ul>
  );
}
