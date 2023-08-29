/*
Data Manager
Responsible for fetching, updating, and saving Workflow resources from/to
the Panoptes service.
 */

import { useState } from 'react'
import { WorkflowContext } from './context.js'

import TesterA from './TesterA.js'
import TesterB from './TesterB.js'

export default function DataManager ({
  children
}) {
  const [ workflow, _setWorkflow ] = useState('')
  
  function setWorkflow (e) {
    _setWorkflow(e.target.value)
  }

  const workflowData = {
    workflow,
    setWorkflow,
  }

  return (
    <WorkflowContext.Provider
      value={workflowData}
    >
      {children}
    </WorkflowContext.Provider>
  )
}