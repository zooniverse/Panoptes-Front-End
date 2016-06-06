import React from 'react';
import qs from 'qs';
import { ProjectStatsPage } from './stats.js';

class ProjectStatsPageController extends React.Component {
  constructor(props) {
    super(props);

    this.getWorkflow = this.getWorkflow.bind(this);
    this.handleGraphChange = this.handleGraphChange.bind(this);
    this.handleWorkflowChange = this.handleWorkflowChange.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);

    const workflowList = [];
    for (let i = 1; i <= this.props.project.links.workflows.length; i++) {
      workflowList.push(null);
    }
    this.state = {
      workflowList,
      failedWorkflowIdx: [],
    };
  }

  componentDidMount() {
    let idx = 0;
    for (const workflowID of this.props.project.links.workflows) {
      this.getWorkflow(workflowID, idx);
      idx++;
    }
  }

  getQuery(which) {
    return qs.parse(location.search.slice(1))[which];
  }

  getWorkflow(workflowID, idx) {
    this.props.project.get('workflows', { id: workflowID })
      .then(([workflow]) => {
        if (workflow) {
          const currentList = [...this.state.workflowList];
          currentList[idx] = workflow;
          this.setState({ workflowList: currentList });
        } else {
          throw new Error(`No workflow ${workflowID} for project ${this.props.project.id}`);
        }
      })
      .catch(() => {
        const currentFail = [...this.state.failedWorkflowIdx];
        currentFail.push(idx);
        this.setState({ failedWorkflowIdx: currentFail });
      });
  }

  handleGraphChange(which, e) {
    const query = qs.parse(location.search.slice(1));
    query[which] = e.target.value;
    query[`${which}Range`] = undefined;
    const { owner, name } = this.props.params;
    this.context.history.replaceState(null, `/projects/${owner}/${name}/stats/`, query);
  }

  handleWorkflowChange(which, e) {
    const query = qs.parse(location.search.slice(1));
    const [nameChange, value] = e.target.value.split('=');
    if (nameChange === 'workflow_id') {
      query[nameChange] = value;
    } else {
      query.workflow_id = undefined;
    }
    query[`${which}Range`] = undefined;
    const { owner, name } = this.props.params;
    this.context.history.replaceState(null, `/projects/${owner}/${name}/stats/`, query);
  }

  handleRangeChange(which, range) {
    const query = qs.parse(location.search.slice(1));
    query[`${which}Range`] = range;
    const { owner, name } = this.props.params;
    this.context.history.replaceState(null, `/projects/${owner}/${name}/stats/`, query);
  }

  render() {
    const queryProps = {
      handleGraphChange: this.handleGraphChange,
      handleRangeChange: this.handleRangeChange,
      handleWorkflowChange: this.handleWorkflowChange,
      classificationsBy: this.getQuery('classification') || 'day',
      classificationRange: this.getQuery('classificationRange'),
      commentsBy: this.getQuery('comment') || 'day',
      commentRange: this.getQuery('commentRange'),
      projectId: this.props.project.id,
      workflowId: this.getQuery('workflow_id'),
      totalVolunteers: this.props.project.classifiers_count,
      currentClassifications: this.props.project.activity,
      workflows: this.state.workflowList,
      failedWorkflows: this.state.failedWorkflowIdx,
      startDate: this.props.project.launch_date,
    };

    return <ProjectStatsPage {...queryProps} />;
  }
}

ProjectStatsPageController.contextTypes = { history: React.PropTypes.object };

ProjectStatsPageController.propTypes = {
  project: React.PropTypes.object,
  params: React.PropTypes.object,
};

module.exports = ProjectStatsPageController;
