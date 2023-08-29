import { createContext, useContext } from 'react'

const defaultWorkflowData = {}
export const WorkflowContext = createContext(defaultWorkflowData)

export function useWorkflowContext () {
  const workflowData = useContext(WorkflowContext)
  return workflowData
}