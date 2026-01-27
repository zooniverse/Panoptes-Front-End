import apiClient from 'panoptes-client/lib/api-client';
/*
  These utilities are used to determine if a Zooniverse project should be using
  the FEM-compatible (Front-End-Monorepo) version of the Project Builder (Lab).

  Context: this code was created during the 2020/2021 transitory period where
  we're migrating _some_ (but not _all_ ) projects to use FEM. However, now we want
  ALL newly-created projects to use FEM with the exception of experimental_tools?.includes('pfeLab').

  Please see the associated /app/monorepoUtils.js, and modifications to the app's router,
  which use separate checks to determine if the project should use a certain classifier.
 */

/**
  isThisProjectUsingFEMLab() does exactly what it says on the tin.

  Arguments:
  - project: Zooniverse project resource
  - location: react-router location object

  Returns: true or false
*/
export function isThisProjectUsingFEMLab (project, location) {
  if (project?.experimental_tools?.includes('pfeLab')) {
    return false
  } else if (location?.query?.pfeLab === 'true') {
    return false
  } else if (location?.query?.femLab === 'false') {
    return false
  } else {
    return true
  }
}

export const FEM_LAB_PREVIEW_HOST = 'https://frontend.preview.zooniverse.org'

/* This is a break in the typical pattern of reading an experimental flag to enable a task
   in the project builder. See https://github.com/zooniverse/Panoptes-Front-End/pull/6808
   and PFE/Panoptes-Front-End/app/pages/lab-fem/workflow.jsx **/
export async function isWorkflowUsingJSONSubjects(workflow) {
  if (workflow?.configuration.subject_viewer === 'jsonData') {
    return true;
  }
  const subjects = await apiClient.type('subjects').get({ workflow_id: workflow.id });
  return subjects.some(subject => {
    return subject.locations.some(l => {
      const [ key ] = Object.keys(l);
      return key === 'application/json';
    });
  });
}
