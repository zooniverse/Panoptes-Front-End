/*
Data Manager
Responsible for fetching, updating, and saving Workflow resources from/to
the Panoptes service.
 */

import apiClient from 'panoptes-client/lib/api-client'
import { useEffect, useState } from 'react'
import { WorkflowContext } from './context.js'

export default function DataManager ({
  children,
  workflowId,
}) {
  const [ workflow, setWorkflow ] = useState(null)
  const [ status, setStatus ] = useState('ready')

  useEffect(async function fetchWorkflow () {
    if (workflowId) {
      setWorkflow(null)
      setStatus('fetching')
      try {
        const wf = await apiClient.type('workflows').get(workflowId)
        setWorkflow(wf)
        setStatus('success')
      } catch (err) {
        console.error('DataManager: ', err)
        setWorkflow(null)
        setStatus('error')
      }
    } else {
      setWorkflow(null)
      setStatus('ready')
    }
  }, [ workflowId ])

  if (!workflowId) return (<div>ERROR: no Workflow ID specified</div>)
  // if (!workflow) return null

  /*
  Updates the workflow with new data.
   */
  function update (data) {
    console.log('+++ TODO')
  }

  const workflowData = {
    workflow, update
  }

  return (
    <WorkflowContext.Provider
      value={workflowData}
    >
      <div>{status}</div>
      {children}
    </WorkflowContext.Provider>
  )
}