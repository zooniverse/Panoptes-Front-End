import PropTypes from 'prop-types';
import React from 'react';
import Moment from 'moment';
import apiClient from 'panoptes-client/lib/api-client';
import getWorkflowsInOrder from '../../lib/get-workflows-in-order';

class ExportWorkflowsDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      workflows: [],
      media: {},
      selectedWorkflowId: null,
      workflowError: {}
    };

    this.requestDataExport = this.requestDataExport.bind(this);
    this.updateWorkflowsFromProject = this.updateWorkflowsFromProject.bind(this);
    this.renderWorkflowOptions = this.renderWorkflowOptions.bind(this);
    this.setSelectedWorkflowId = this.setSelectedWorkflowId.bind(this);
  }

  componentDidMount() {
    this.updateWorkflowsFromProject(this.props.project);
  }

  componentWillReceiveProps(nextProps) {
    this.updateWorkflowsFromProject(nextProps.project);
  }

  setSelectedWorkflowId(id) {
    this.setState({ selectedWorkflowId: id });
  }

  updateWorkflowsFromProject(project) {
    if (!project) {
      return;
    }

    this.setState({ loading: true });
    // TODO: this API call duplicates information fetched to draw the lab sidebar.
    // when we do the lab refactor, this should be cached somewhere
    getWorkflowsInOrder(project, { fields: 'display_name' })
      .then((workflows) => {
        this.setState({ workflows, loading: false });

        workflows.forEach((workflow) => {
          workflow.get('classifications_export')
            .then((media) => {
              const mediaState = this.state.media;
              mediaState[workflow.id] = media[0];
              this.setState({ media: mediaState });
            })
            .catch((error) => {
              if (error.status !== 404) {
                const workflowErrorState = this.state.workflowError;
                workflowErrorState[workflow.id] = error[0];
                this.setState({ workflowError: workflowErrorState });
              }
            });
        });
      });
  }

  requestDataExport() {
    const url = `/workflows/${this.state.selectedWorkflowId}/classifications_export`;
    apiClient.post(url, { media: { content_type: 'text/csv' }})
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
          <ul className="workflow-export-list">
            {this.state.workflows.map((result) => {
              const boundHandler = this.setSelectedWorkflowId.bind(this, result.id);
              return <ExportWorkflowListItem key={result.id} workflow={result} media={this.state.media} onChange={boundHandler} workflowError={this.state.workflowError} />;
            })}
          </ul>
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
          <button className="standard-button" style={{ marginLeft: '1em' }} disabled={!this.state.selectedWorkflowId} onClick={this.requestDataExport}>Export</button>
        </div>
      </div>
    );
  }
}

ExportWorkflowsDialog.defaultProps = {
  project: {},
  onSuccess: () => {},
  onFail: () => {}
};

ExportWorkflowsDialog.propTypes = {
  project: PropTypes.shape({ links: PropTypes.object }).isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFail: PropTypes.func.isRequired
};

const ExportWorkflowListItem = ({ workflow, media, onChange, workflowError }) => {
  const myMedia = workflow ? media[workflow.id] : null;
  const now = new Date();
  const lockoutTime = new Date();
  lockoutTime.setDate(now.getDate() - 1);

  const lockout = myMedia && (new Date(myMedia.updated_at) > lockoutTime);
  const titleString = lockout ? 'This item can only be exported every 24 hours' : '';

  return (
    <div>
      <li className="workflow-export-list__item">
        <input
          type="radio"
          title={titleString}
          name="which-workflow"
          id={`export-${workflow.id}`}
          className="workflow-export-list__input"
          disabled={lockout}
          onChange={onChange}
        />
        {workflow.display_name}
        {' '}(#{workflow.id})
        <small>
          {myMedia &&
            <a
              title={myMedia.updated_at}
              href={myMedia.src}
              className="workflow-export-list__link"
            >
              {Moment(myMedia.updated_at).fromNow()}
            </a>}
          {!myMedia &&
            <span className="workflow-export-list__span">No exports have been requested.</span>}
        </small>
        {workflowError[workflow.id] &&
          <div className="form-help error">We had a problem requesting your export data: {workflowError[workflow.id]}</div>}
      </li>
    </div>
  );
};

ExportWorkflowListItem.defaultProps = {
  workflow: {
    id: '',
    display_name: ''
  },
  media: {
    id: ''
  },
  onChange: () => {},
  workflowError: {}
};

ExportWorkflowListItem.propTypes = {
  workflow: PropTypes.shape({
    id: PropTypes.string,
    display_name: PropTypes.string
  }).isRequired,
  media: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  onChange: PropTypes.func.isRequired,
  workflowError: PropTypes.object // eslint-disable-line react/forbid-prop-types
};

export default ExportWorkflowsDialog;
