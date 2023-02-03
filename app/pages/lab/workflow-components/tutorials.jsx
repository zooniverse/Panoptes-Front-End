import { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';

export default function Tutorials({ project, workflow }) {
  const [tutorials, setTutorials] = useState([]);
  const [linkedTutorials, setLinkedTutorials] = useState([]);

  useEffect(function loadTutorials() {
    apiClient.type('tutorials')
      .get({ project_id: project.id, page_size: 100 })
      .catch(() => [])
      .then(tutorials => {
        setTutorials(tutorials.filter(value => value.kind === 'tutorial' || value.kind === null));
      });
    apiClient.type('tutorials')
      .get({ workflow_id: workflow.id, page_size: 100 })
      .catch(() => [])
      .then(tutorials => {
        setLinkedTutorials(tutorials.filter(value => value.kind === 'tutorial' || value.kind === null));
      });
  }, [project?.id, workflow?.id]);

  function updateTutorialLinks(linkedTutorial) {
    linkedTutorials
      .filter(tutorial => tutorial.id !== linkedTutorial?.id)
      .forEach(tutorial => workflow.removeLink('tutorials', tutorial?.id));
    if (linkedTutorial) {
      workflow.addLink('tutorials', [linkedTutorial.id]);
      setLinkedTutorials([linkedTutorial]);
    } else {
      setLinkedTutorials([]);
    }
  }

  function onChange(event) {
    // TODO: radio groups only fire change events for the checked input, so what does this line do?
    const shouldAdd = event.target.checked;
    const tutorialID = event.target.value;
    const tutorial = tutorials.find(tutorial => tutorial.id === tutorialID);

    const ensureSaved = workflow.hasUnsavedChanges() ? workflow.save() : Promise.resolve();

    return ensureSaved
      .then(() => {
        if (shouldAdd) {
          updateTutorialLinks(tutorial);
        }
    });
  }

  if (tutorials.length > 0) {
    return (
      <form className="workflow-link-tutorials-form">
        <fieldset>
          <legend className="form-label">Tutorials</legend>
            <label>
              <input
                name="tutorial"
                type="radio"
                value=""
                checked={!linkedTutorials.length}
                onChange={onChange}
              />
              No tutorial
            </label>
            {tutorials.map(tutorial => {
              const assignedTutorial = linkedTutorials.includes(tutorial);
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
        </fieldset>
      </form>
    );
  }
  return <span>This project has no tutorials.</span>;
}
