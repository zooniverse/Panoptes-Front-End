import { useWorkflowContext } from './context'

export default function Tester () {
  const { workflow } = useWorkflowContext()

  console.log('+++ workflow: ', workflow)

  return (
    <div style={{ pad: '1em', border: '1px solid #808080' }}>
      <h6>Tester</h6>
      <div>Workflow is called "{workflow?.display_name}"</div>
    </div>
  )
}