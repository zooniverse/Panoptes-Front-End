import DataManager from './DataManager.js'
import Tester from './Tester.js'

export default function PagesEditor (props) {
  console.log('+++ props: ', props)
  const { params } = props

  console.log('')

  return (
    <div>
      <h5>Pages Editor</h5>
      <DataManager
        key={params?.workflowId || '-'}  // 
        workflowId={params?.workflowId}
      >
        <h6>Workflow {params?.workflowId}</h6>
        <Tester />
      </DataManager>
    </div>
  )
}