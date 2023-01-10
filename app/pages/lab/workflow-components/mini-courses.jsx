import { useEffect, useState } from 'react';
import apiClient from 'panoptes-client/lib/api-client';

export default function MiniCourses({ project, workflow }) {
  const [tutorials, setTutorials] = useState([]);
  const [workflowTutorial, setWorkflowTutorial] = useState(null);

  useEffect(() => {
    Promise.all([
      apiClient.type('tutorials')
        .get({ project_id: project.id, page_size: 100, kind: 'mini-course' })
        .catch(() => []),
      apiClient.type('tutorials')
        .get({ workflow_id: workflow.id, page_size: 100, kind: 'mini-course' })
        .catch(() => [])
    ])
      .then(([projectTutorials, workflowTutorials]) => {
        const [workflowTutorial] = projectTutorials.filter(value => workflowTutorials.includes(value));
        setTutorials(projectTutorials);
        setWorkflowTutorial(workflowTutorial);
      });
  }, [project?.id, workflow?.id]);

  function removeTutorial() {
    setWorkflowTutorial(null);
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
          setWorkflowTutorial(tutorial);
        }
      });
  }

  if (tutorials.length > 0) {
    return (
      <form className="workflow-link-tutorials-form">
        <fieldset>
          <legend className="form-label">Mini-Courses</legend>
          <label>
            <input
              name="minicourse"
              type="radio"
              value=""
              checked={!workflowTutorial}
              onChange={removeTutorial}
            />
            No mini-course
          </label>
          {tutorials.map((tutorial) => {
            const assignedTutorial = tutorial === workflowTutorial;
            return (
              <label key={tutorial.id}>
                <input
                  name="minicourse"
                  type="radio"
                  checked={assignedTutorial}
                  value={tutorial.id}
                  onChange={onChange}
                />
                Mini-Course #
                {tutorial.id}
                {' '}
                {tutorial.display_name ? ` - ${tutorial.display_name}` : undefined}
              </label>
            );
          })}
        </fieldset>
      </form>
    );
  }
  return <span>This project has no mini-courses.</span>;
}
