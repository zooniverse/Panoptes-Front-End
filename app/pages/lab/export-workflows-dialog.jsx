import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import getWorkflowsInOrder from '../../lib/get-workflows-in-order';
import Moment from 'moment';

class ExportWorkflowsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      workflows: [],
      media: {},
      workflowSelected: false,
    };

    this.toggleExport = this.toggleExport.bind(this);
    this.requestDataExport = this.requestDataExport.bind(this);
    this.updateWorkflowsFromProject = this.updateWorkflowsFromProject.bind(this);
    this.renderWorkflowOptions = this.renderWorkflowOptions.bind(this);
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

    const self = this;

    this.setState({ loading: true });
    // TODO: this API call duplicates information fetched to draw the lab sidebar.
    // when we do the lab refactor, this should be cached somewhere
    getWorkflowsInOrder(project, { fields: 'display_name' })
      .then((workflows) => {
        this.setState({ workflows, loading: false });

        // TODO: load the exports for each workflow
        workflows.forEach((wf) => {
          wf.get('classifications_export')
            .then((media) => {
              const mediaState = self.state.media;
              mediaState[wf.id.toString()] = media[0];
              self.setState({ media: mediaState });
            })
            .catch(() => {
              // this is gonna happen, oh well
            });
        });
      });
  }

  toggleExport() {
    if (this.workflowList.selectedIndex >= 0) {
      this.setState({ workflowSelected: true });
    }
  }

  requestDataExport() {
    apiClient.post(`/workflows/${this.workflowList.value}/classifications_export`, { media: { content_type: 'text/csv' } })
      .then(() => { this.props.onSuccess(); })
      .catch((err) => { this.props.onFail(err); });
  }

  renderWorkflowOptions() {
    if (this.state.loading) {
      return (<p>Loading...</p>);
    }

    if (this.state.workflows && this.state.workflows.length > 0) {
      return (
        <div>
          <ul>
            {this.state.workflows.map((result) => {
              return <ExportWorkflowListItem key={result.id} workflow={result} media={this.state.media} />;
            })}
          </ul>
          <select size="5" ref={(c) => { this.workflowList = c; }} className="multiline-select standard-input" style={{ padding: '0.3vh 0.3vw' }} onChange={this.toggleExport} style={{'display': 'none'}}>
            {this.state.workflows.map((result) => {
              return (
                <option key={result.id} value={result.id}>{result.display_name}</option>
              );
            })}
          </select>
        </div>
      );
    }

    return (
      <p>No workflows available to export.</p>
    );
  }

  render() {
    return (
      <div>
        <span className="form-label">Select a Workflow:</span>
        {this.renderWorkflowOptions()}
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
  onSuccess: React.PropTypes.func.isRequired,
  onFail: React.PropTypes.func.isRequired,
};

const ExportWorkflowListItem = ({ workflow, media }) => {

  const myMedia = workflow ? media[workflow.id.toString()] : null;

  return (
    <li>
      <input type="radio" name="which-workflow" id={`export-${workflow.id}`} />
      {workflow.display_name}
      <ExportWorkflowLink media={myMedia} />
    </li>
  );
};

const ExportWorkflowLink = ({ media }) => {
  return (
    media ?
      <a href={media.src}>{Moment(media.updated_at).fromNow()}</a> :
      <span>No exports have been requested.</span>
  );
}

export default ExportWorkflowsDialog;
