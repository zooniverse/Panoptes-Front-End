import React from 'react'

import Workflow from '../lab/workflow'
import FEMWorkflow from './workflow'

/**
The Front End Monorepo Lab (Project Builder) Router returns a different
component, depending on the path AND whether or not the associated Zooniverse
Project is FEM-compatible.
 */
export default function FEMLabRouter (props) {
  // TODO: the "is it FEM-compatible?" check is pretty arbitrary, as of
  // 2 Nov 2011. We need to come back to this once we have a better foundational
  // solution to figuring out whether a project is FEM-compatible.
  const thisProjectUsesFEM = (  // Use FEM-compatible pages if...
    props?.project?.experimental_tools?.includes('femLab')  // ...the project has the femLab experimental tool
    || props?.location?.query?.femLab === 'true'  // ...OR ?femLab=true query param is set
  ) && props?.location?.query?.pfeLab !== 'true'  // ...UNLESS ?pfeLab=true query param is set

  const thisRoute = props?.routes?.map(r=>r.path).join('/').replace('//', '/') || ''
  switch (thisRoute) {
    case '/lab/:projectID/workflows/:workflowID':  // WARNING: assumes there are no child routes.
      return (thisProjectUsesFEM)
        ? <FEMWorkflow {...props} />
        : <Workflow {...props} />
  }

  return <div>ERROR: This path is not registered in the FEMLabRouter.</div>
}
