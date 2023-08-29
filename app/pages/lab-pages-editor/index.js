import DataManager from './DataManager.js'
import TesterA from './TesterA.js'
import TesterB from './TesterB.js'

export default function PagesEditor (props) {
  console.log('+++ props: ', props)

  return (
    <div>
      <h5>Pages Editor</h5>
      <DataManager>
        <TesterA />
        <TesterB />
      </DataManager>
    </div>
  )
}