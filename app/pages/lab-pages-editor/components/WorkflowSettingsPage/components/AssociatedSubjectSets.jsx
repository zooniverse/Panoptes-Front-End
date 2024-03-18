import { useState, useEffect } from 'react';

const ARBITRARY_PAGE_SIZE = 250;  // If a project has more than this number of subject sets, then we need a better solution.

export default function AssociatedSubjectSets({ project, workflow }) {
  const [linkedSubjectSets, setLinkedSubjectSets] = useState(workflow?.links?.subject_sets || []);
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

        const ssets = await project.get('subject_sets', { sort: '+id', page_size: ARBITRARY_PAGE_SIZE });
        if (!ssets) throw new Error('No subject sets');

        setApiData({
          subjectSets: ssets,
          status: 'ready'
        });

      } catch (err) {
        console.error('AssociatedSubjectSets: ', err);
        setApiData({
          subjectSets: null,
          status: 'error'
        });
      }
    }

    fetchSubjectSets();
  }, [project, workflow]);

  function toggleSubjectSet(e) {
    const subjectSetId = e?.currentTarget?.dataset?.subjectset;
    if (!subjectSetId) return;
    const alreadyLinked = linkedSubjectSets.includes(subjectSetId);

    if (alreadyLinked) {  // If already linked, remove it.
      setLinkedSubjectSets(linkedSubjectSets.filter(sset => sset !== subjectSetId));
      workflow.removeLink('subject_sets', [subjectSetId]);
    } else {  // If not yet linked, add it.
      setLinkedSubjectSets([ ...linkedSubjectSets, subjectSetId]);
      workflow.addLink('subject_sets', [subjectSetId]);
    }
  }

  if (!project || !workflow) return null;

  if (apiData.status === 'fetching') {
    return (<div className="status-banner fetching">Fetching Subject Sets...</div>)
  }

  if (apiData.status === 'error') {
    return (<div className="status-banner error">ERROR: couldn't fetch Subject Sets</div>)
  }

  return (
    <ul className="input-group">
      {apiData?.subjectSets?.map((subjectSet, index) => (
        <li key={`associated-subject-set-${subjectSet.id}`}>
          <input
            checked={!!linkedSubjectSets.includes(subjectSet.id)}
            data-subjectset={subjectSet.id}
            id={`associated-subject-set-${subjectSet.id}`}
            onChange={toggleSubjectSet}
            type="checkbox"
          />
          <label htmlFor={`associated-subject-set-${subjectSet.id}`}>
            {subjectSet.display_name || '???'} (#{subjectSet.id})
          </label>
        </li>
      ))}
    </ul>
  );
}
