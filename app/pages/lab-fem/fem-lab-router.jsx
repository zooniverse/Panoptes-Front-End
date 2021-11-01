import React from 'react'

import Workflow from '../lab/workflow'
import FEMWorkflow from './workflow'

/**
The Front End Monorepo Lab (Project Builder) Router returns a different
component, depending on the path AND whether or not the associated Zooniverse
Project is FEM-compatible.
 */
export default function FEMLabRouter (props) {
  const thisProjectUsesFEM = props.project?.id === '1873'  // DEBUG
  const thisRoute = props?.routes?.map(r=>r.path).join('/').replace('//', '/') || ''

  switch (thisRoute) {
    case '/lab/:projectID/workflows/:workflowID':  // WARNING: assumes there are no child routes.
      return (thisProjectUsesFEM)
        ? <FEMWorkflow {...props} />
        : <Workflow {...props} />
  }

  return <div>ERROR: This path is not registered in the FEMLabRouter.</div>
}
