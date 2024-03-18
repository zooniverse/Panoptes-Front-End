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
        if (!workflow || !project) throw new Error('No workflow and/or no project.');

        setApiData({
          tutorials: null,
          status: 'fetching'
        });

        // First we need to fetch all tutorials associated with the project.
        const tutorialsLinkedToProject = await apiClient.type('tutorials').get({ project_id: project.id, page_size: ARBITRARY_PAGE_SIZE });
        
        // If a project has no tutorials, tutorialsLinkedToProject will be [].
        // If tutorialsLinkedToProject is undefined, then that's an error.
        if (!tutorialsLinkedToProject) throw new Error('Unexpected error fetching tutorials.');

        // Now we need to fetch all tutorials associated with the workflow!
        // There should be only one linked workflow, at maximum.
        const tutorialsLinkedToWorkflow = await apiClient.type('tutorials').get({ workflow_id: workflow.id, page_size: ARBITRARY_PAGE_SIZE });
        const currentlyLinkedWorkflowId = tutorialsLinkedToWorkflow?.[0]?.id || null;

        setLinkedTutorial(currentlyLinkedWorkflowId);
        setApiData({
          tutorials: tutorialsLinkedToProject,
          status: 'ready'
        });

      } catch (err) {
        console.error('AssociatedTutorial: ', err);
        setApiData({
          tutorials: null,
          status: 'error'
        });
      }
    }

    fetchTutorials();
  }, [project, workflow]);

  async function updateWorkflow(tutorialId = null) {
    try {
      if (tutorialId === linkedTutorial) return;
      if (!workflow || !project) throw new Error('No workflow and/or no project.');

      setApiData({
        ...apiData,
        status: 'updating'
      });

      if (linkedTutorial) { // Unlink any current tutorial...
        await workflow.removeLink('tutorials', linkedTutorial);
      }

      if (tutorialId) { // ...before linking a new one
        await workflow.addLink('tutorials', [tutorialId]);
      }

      setLinkedTutorial(tutorialId);
      setApiData({
        ...apiData,
        status: 'ready'
      });
    } catch (err) {
      console.error('AssociatedTutorial: ', err);
      setApiData({
        ...apiData,
        status: 'error'
      });
    }
  }

  function selectTutorial(e) {
    const tutorialId = e?.currentTarget?.dataset?.tutorial;
    updateWorkflow(tutorialId);
  }

  if (!project || !workflow) return null;

  if (apiData.status === 'fetching') {
    return (<div className="status-banner fetching">Fetching Tutorials...</div>)
  }

  if (apiData.status === 'updating') {
    return (<div className="status-banner updating">Updating...</div>)
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
