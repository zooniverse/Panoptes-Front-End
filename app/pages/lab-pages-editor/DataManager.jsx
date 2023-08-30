/*
Data Manager
Responsible for fetching, updating, and saving Workflow resources from/to
the Panoptes service.
 */

import apiClient from 'panoptes-client/lib/api-client'
import { useEffect, useState } from 'react'
import { WorkflowContext } from './context.jsx'

export default function DataManager ({
  // key: to ensure DataManager renders FRESH (with states reset) whenever workflowId changes, use <DataManager key={workflowId} ... />
  children,
  workflowId,
}) {
  let initialised = false
  const [ apiData, setApiData ] = useState({
    workflow: null,
    status: 'ready',
  })

  // Fetch workflow when the component loads for the first time.
  // See notes about 'key' prop, to ensure states are reset:
  // https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
  // Also see general pattern notes:
  // https://react.dev/reference/react/useEffect#fetching-data-with-effects
  useEffect(async function whenComponentMounts_doInitialise () {
    console.log('+++ DataManager: fetchWorkflow', workflowId)
    if (initialised) return 
    if (!workflowId) return

    try {
      setApiData({
        workflow: null,
        status: 'fetching'
      })

      const wf = await apiClient.type('workflows').get(workflowId)
      if (!wf) throw new Error('No workflow')

      setApiData({
        workflow: wf,
        status: 'ready'
      })
      initialised = true

    } catch (err) {
      console.error('DataManager: ', err)
      setApiData({
        workflow: null,
        status: 'error'
      })
      initialised = true  // Don't re-run the initialisation function again
    }

    return () => { initialised = false }
  }, [ workflowId ])

  /*
  Updates the workflow with new data.
   */
  function update (data) {
    console.log('+++ TODO')
  }

  const contextData = {
    workflow: apiData.workflow,
    update
  }

  if (!workflowId) return (<div>ERROR: no Workflow ID specified</div>)
  // if (!workflow) return null

  return (
    <WorkflowContext.Provider
      value={contextData}
    >
      <div>{apiData.status}</div>
      {children}
    </WorkflowContext.Provider>
  )
}