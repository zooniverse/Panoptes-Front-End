import React from 'react'
import apiClient from 'panoptes-client/lib/api-client'

class ExportWorkflowsDialog extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      project_id: -1,
      workflows: [],
      workflow_selected: false
    }
  }

  updateWorkflowsFromProject(project){
    if(!project)
      return

    apiClient.type("workflows").
      get(project.links.workflows).
      then((workflows) => {
        this.setState({workflows: workflows})
      })
  }

  componentDidMount(){
    this.updateWorkflowsFromProject(this.props.project)
  }

  componentWillReceiveProps(nextProps){
    this.updateWorkflowsFromProject(nextProps.project)
  }

  toggleExport(){
    if(this.refs.workflowList.selectedIndex >= 0)
      this.setState({workflow_selected: true})
  }

  requestDataExport(){
    var workflow_id = this.refs.workflowList.value

    apiClient.post(`/workflows/${workflow_id}/classifications_export`, {media: {content_type: 'text/csv'}})
  }

  render(){
    return (
        <div>
          <label className="form-label">Select a Workflow:</label>
          <select size="5" ref="workflowList" className="multiline-select standard-input" style={{padding: "0.3vh 0.3vw"}} onChange={this.toggleExport.bind(this)}>
            {this.state.workflows.map((result) => (
              <option key={result.id} value={result.id}>{result.display_name}</option>
            ))}
          </select>
          <div style={{textAlign: "right"}}>
            <button className="minor-button" style={{marginLeft: "1em"}}>Cancel</button>
            <button className="standard-button" style={{marginLeft: "1em"}} disabled={!this.state.workflow_selected} onClick={this.requestDataExport.bind(this)}>Export</button>
          </div>
        </div>
    );
  }
}

export default ExportWorkflowsDialog;
