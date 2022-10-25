import { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';

export default function Tutorials({ project, workflow }) {
  const [tutorials, setTutorials] = useState([]);
  const [workflowTutorial, setWorkflowTutorial] = useState(null);

  useEffect(function loadTutorials() {
    Promise.all([
      apiClient.type('tutorials')
        .get({ project_id: project.id, page_size: 100 })
        .catch(() => []),
      apiClient.type('tutorials')
        .get({ workflow_id: workflow.id, page_size: 100 })
        .catch(() => [])
    ])
    .then(([projectTutorials, workflowTutorials]) => {
      const tutorials = projectTutorials.filter(value => value.kind === 'tutorial' || value.kind === null);
      const [workflowTutorial] = tutorials.filter(value => workflowTutorials.includes(value));
      setTutorials(tutorials);
      setWorkflowTutorial(workflowTutorial);
    });
  }, [project?.id, workflow?.id]);

  function removeTutorial() {
    setWorkflowTutorial(null)
    return workflow.removeLink('tutorials', workflowTutorial?.id);
  }

  function onChange(event) {
    const shouldAdd = event.target.checked;
    const tutorialID = event.target.value;
    const tutorial = tutorials.find(tutorial => tutorial.id === tutorialID);

    const ensureSaved = workflow.hasUnsavedChanges() ? workflow.save() : Promise.resolve();

    return ensureSaved
      .then(() => {
        if (shouldAdd) {
          workflow.addLink('tutorials', [tutorial.id]);
          if (workflowTutorial?.id) {
            workflow.removeLink('tutorials', workflowTutorial.id);
          }
          setWorkflowTutorial(tutorial)
        }
    });
  }

  if (tutorials.length > 0) {
    return (
      <form className="workflow-link-tutorials-form">
        <span className="form-label">Tutorials</span>
        <label>
          <input
            name="tutorial"
            type="radio"
            value=""
            checked={!workflowTutorial}
            onChange={removeTutorial}
          />
          No tutorial
        </label>
        {tutorials.map(tutorial => {
          const assignedTutorial = tutorial === workflowTutorial;
          return (
            <label key={tutorial.id}>
              <input
                name="tutorial"
                type="radio"
                checked={assignedTutorial}
                value={tutorial.id}
                onChange={onChange}
              />
              Tutorial #{tutorial.id} {tutorial.display_name ? ` - ${tutorial.display_name}` : undefined}
            </label>
          );
        })}
      </form>
    );
  }
  return <span>This project has no tutorials.</span>;
}
