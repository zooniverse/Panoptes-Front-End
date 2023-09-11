import apiClient from 'panoptes-client/lib/api-client';
/*
These utilities are used to determine if a Zooniverse project should be using
the FEM-compatible (Front-End-Monorepo) version of the Project Builder (Lab).

Context: this code was created during the 2020/2021 transitory period where
we're migrating _some_ (but not _all_ ) projects to use FEM.

Please see the associated /app/monorepoUtils.js , /app/MonorepoRoute.jsx,
and /app/MonorepoRoutes.jsx code, which use separate checks to determine if the
project should use the **FEM Classifier + project page.**
 */

/**
isThisProjectUsingFEMLab() does exactly what it says on the tin.

Arguments:
- project: Zooniverse project resource
- location: react-router location object

Returns: true or false
 */
export function isThisProjectUsingFEMLab (project, location) {
  return (  // Use FEM-compatible pages if...
    project?.experimental_tools?.includes('femLab')  // ...the project has the femLab experimental tool
    || location?.query?.femLab === 'true'  // ...OR ?femLab=true query param is set
  ) && location?.query?.pfeLab !== 'true'  // ...UNLESS ?pfeLab=true query param is set
}

export const FEM_LAB_PREVIEW_HOST = 'https://frontend.preview.zooniverse.org'

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
