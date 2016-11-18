import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';

class ExportWorkflowsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project_id: -1,
      workflows: [],
      workflowSelected: false,
    };

    this.toggleExport = this.toggleExport.bind(this);
    this.requestDataExport = this.requestDataExport.bind(this);
  }

  componentDidMount() {
    this.updateWorkflowsFromProject(this.props.project);
  }

  componentWillReceiveProps(nextProps) {
    this.updateWorkflowsFromProject(nextProps.project);
  }

  updateWorkflowsFromProject(project) {
    if (!project) {
      return;
    }

    apiClient.type('workflows')
      .get(project.links.workflows)
      .then((workflows) => {
        this.setState({ workflows });
      });
  }

  toggleExport() {
    if (this.workflowList.selectedIndex >= 0) {
      this.setState({ workflowSelected: true });
    }
  }

  requestDataExport() {
    apiClient.post(`/workflows/${this.workflowList.value}/classifications_export`, { media: { content_type: 'text/csv' } });
  }

  render() {
    return (
      <div>
        <span className="form-label">Select a Workflow:</span>
        <select size="5" ref={(c) => { this.workflowList = c; }} className="multiline-select standard-input" style={{ padding: '0.3vh 0.3vw' }} onChange={this.toggleExport}>
          {this.state.workflows.map((result) => {
            return (
              <option key={result.id} value={result.id}>{result.display_name}</option>
            );
          })}
        </select>
        <div style={{ textAlign: 'right' }}>
          <button className="minor-button" style={{ marginLeft: '1em' }}>Cancel</button>
          <button className="standard-button" style={{ marginLeft: '1em' }} disabled={!this.state.workflowSelected} onClick={this.requestDataExport}>Export</button>
        </div>
      </div>
    );
  }
}

ExportWorkflowsDialog.propTypes = {
  project: React.PropTypes.shape({ links: React.PropTypes.object }).isRequired,
};

export default ExportWorkflowsDialog;
