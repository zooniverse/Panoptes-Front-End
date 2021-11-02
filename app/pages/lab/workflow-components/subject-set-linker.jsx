import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// 6 is Cats on staging, 1166 is Ghosts on production.
const DEMO_SUBJECT_SET_ID = process.env.NODE_ENV === 'production' ? '6' : '1166';

function fetchSubjectSets(project) {
  return project.get('subject_sets', { sort: '-id', page_size: 250 });
}

/**
  List checkboxes for available subject sets. Linked subject sets are checked.
*/
export default function SubjectSetLinker({
  /** The active project. */
  project,
  /** The active workflow. Subject sets will be linked to this. */
  workflow
}) {
  const [projectSets, setProjectSets] = useState([]);
  const [workflowSets, setWorkflowSets] = useState(workflow.links.subject_sets);

  function fetchData() {
    fetchSubjectSets(project)
      .then(setProjectSets);
  }

  function onProjectChange() {
    fetchData();
  }
  useEffect(onProjectChange, [project]);

  const hasNoSets = projectSets.length === 0;

  function updateLink(checked, subjectSet) {
    if (checked) {
      setWorkflowSets([...workflowSets, subjectSet.id]);
      workflow.addLink('subject_sets', [subjectSet.id]);
    } else {
      const removeIndex = workflowSets.indexOf(subjectSet.id);
      workflowSets.splice(removeIndex, 1);
      setWorkflowSets(workflowSets);
      workflow.removeLink('subject_sets', [subjectSet.id]);
    }
  }

  function addDemoSet() {
    project.uncacheLink('subject_sets');
    workflow.addLink('subject_sets', [DEMO_SUBJECT_SET_ID]);
  }

  function handleToggle(subjectSet, event) {
    if (workflow.hasUnsavedChanges()) {
      workflow.save()
      .then(() => updateLink(event.target.checked, subjectSet));
    } else {
      updateLink(event.target.checked, subjectSet);
    }
  }

  if (hasNoSets) {
    return (
      <p>
        This project has no subject sets.{' '}
        <button type="button" onClick={addDemoSet}>Add an example subject set</button>
      </p>
    );
  }
  return (
    <ul>
      {projectSets.map(subjectSet => (
        <li key={subjectSet.id}>
          <input
            id={`subjectSet${subjectSet.id}`}
            type="checkbox"
            checked={workflowSets.includes(subjectSet.id)}
            onChange={event => handleToggle(subjectSet, event)}
          />
          <label htmlFor={`subjectSet${subjectSet.id}`}>
            {subjectSet.display_name} (#{subjectSet.id})
          </label>
        </li>
      ))}
    </ul>
  );
}

SubjectSetLinker.propTypes = {
  project: PropTypes.shape({
    get: PropTypes.func
  }).isRequired,
  workflow: PropTypes.shape({
    get: PropTypes.func
  }).isRequired
};
