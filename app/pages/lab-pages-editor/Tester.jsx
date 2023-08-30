import { useWorkflowContext } from './context.jsx'

export default function Tester () {
  const { workflow, update } = useWorkflowContext()

  console.log('+++ workflow: ', workflow)
  console.log('+++ HELLO WORLD!')

  function doUpdate (e) {

  }

  if (!workflow) return null

  return (
    <div style={{ pad: '1em', border: '1px solid #808080' }}>
      <h6>Tester</h6>
      <div>Workflow is called "{workflow?.display_name}"</div>
      <form onSubmit={() => { return false }}>
        <input defaultValue={workflow?.display_name} onBlur={doUpdate} />
      </form>
    </div>
  )
}