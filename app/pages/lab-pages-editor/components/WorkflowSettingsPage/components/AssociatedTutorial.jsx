import { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';

const ARBITRARY_PAGE_SIZE = 100;  // If a project has more than this number of tutorials, then we need a better solution.

export default function AssociatedTutorial({ project, workflow }) {
  const [ linkedTutorial, setLinkedTutorial ] = useState(null); 
  const [apiData, setApiData] = useState({
    tutorials: null,
    status: 'ready'
  });

  useEffect(() => {
    async function fetchTutorials() {
      try {
        setApiData({
          tutorials: null,
          status: 'fetching'
        });

        const tutorials = await apiClient.type('tutorials').get({ project_id: project.id, page_size: ARBITRARY_PAGE_SIZE });
        if (!tutorials) throw new Error('No tutorials');

        setApiData({
          tutorials,
          status: 'ready'
        });

        console.log('+++ tutorials', tutorials);

      } catch (err) {
        console.error('AssosicatedTutorial: ', err);
        setApiData({
          subjectSets: null,
          status: 'error'
        });
      }
    }

    fetchTutorials();
  }, [project, workflow]);

  function selectTutorial(e) {
    const tutorialId = e?.currentTarget?.dataset?.tutorial;

    console.log('+++ selectTutorial: ', tutorialId)
    
    setLinkedTutorial(tutorialId);
  }

  if (!project || !workflow) return null;

  if (apiData.status === 'fetching') {
    return (<div className="status-banner fetching">Fetching Tutorials...</div>)
  }

  if (apiData.status === 'error') {
    return (<div className="status-banner error">ERROR: couldn't fetch Tutorials</div>)
  }

  return (
    <ul className="input-group">
      <li key={`associated-tutorial-none`}>
        <input
          checked={!linkedTutorial}
          data-tutorial={null}
          id={`associated-tutorial-none`}
          onChange={selectTutorial}
          name="associated-tutorial"
          type="radio"
        />
        <label htmlFor={`associated-tutorial-none`}>
          No tutorial
        </label>
      </li>
      {apiData?.tutorials?.map(tutorial => (
        <li key={`associated-tutorial-${tutorial.id}`}>
          <input
            checked={linkedTutorial === tutorial.id}
            data-tutorial={tutorial.id}
            id={`associated-tutorial-${tutorial.id}`}
            onChange={selectTutorial}
            name="associated-tutorial"
            type="radio"
          />
          <label htmlFor={`associated-tutorial-${tutorial.id}`}>
            {tutorial.display_name || '???'} (#{tutorial.id})
          </label>
        </li>
      ))}
    </ul>
  );
}
