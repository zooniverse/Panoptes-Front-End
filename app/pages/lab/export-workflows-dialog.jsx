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
      selectedWorkflowId: null
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

        // TODO: load the exports for each workflow
        workflows.forEach((wf) => {
          wf.get('classifications_export')
            .then((media) => {
              const mediaState = this.state.media;
              mediaState[wf.id.toString()] = media[0];
              this.setState({ media: mediaState });
            })
            .catch(() => {
              // this is gonna happen, oh well
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
              return <ExportWorkflowListItem key={result.id} workflow={result} media={this.state.media} onChange={boundHandler} />;
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

ExportWorkflowsDialog.propTypes = {
  project: React.PropTypes.shape({ links: React.PropTypes.object }).isRequired,
  onSuccess: React.PropTypes.func.isRequired,
  onFail: React.PropTypes.func.isRequired
};

const ExportWorkflowListItem = ({ workflow, media, onChange }) => {
  const myMedia = workflow ? media[workflow.id.toString()] : null;
  const now = new Date();
  const lockoutTime = new Date();
  lockoutTime.setDate(now.getDate() - 1);

  const lockout = myMedia && (new Date(myMedia.updated_at) > lockoutTime);
  const titleString = lockout ? 'This item can only be exported every 24 hours' : '';

  return (
    <li>
      <input type="radio" title={titleString} name="which-workflow" id={`export-${workflow.id}`} disabled={lockout} onChange={onChange} />
      {workflow.display_name}
      <small>
        <ExportWorkflowLink media={myMedia} />
      </small>
    </li>
  );
};

ExportWorkflowListItem.propTypes = {
  workflow: React.PropTypes.shape({ id: React.PropTypes.string, display_name: React.PropTypes.string }).isRequired,
  media: React.PropTypes.shape({}).isRequired,
  onChange: React.PropTypes.func.isRequired
};


/* eslint-disable multiline-ternary, no-confusing-arrow */
const ExportWorkflowLink = ({ media }) =>
  media ?
    <a title={media.updated_at} href={media.src}>{Moment(media.updated_at).fromNow()}</a> :
    <span>No exports have been requested.</span>;
/* eslint-enable */


ExportWorkflowLink.propTypes = {
  media: React.PropTypes.shape({ src: React.PropTypes.string, updated_at: React.PropTypes.string })
};

ExportWorkflowLink.defaultProps = {
  media: null
};

export default ExportWorkflowsDialog;
