import { useWorkflowContext } from './context.js'

export default function TesterBSub () {
  const { workflow, setWorkflow } = useWorkflowContext()

  return (
    <div style={{ pad: '1em', border: '1px solid #808080' }}>
      <h6>Tester B Sub</h6>
      <input value={workflow} onChange={setWorkflow} /> 
    </div>
  )
}