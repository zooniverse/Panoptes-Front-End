import React from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { ProjectStatsPage } from './stats.jsx';
import getWorkflowsInOrder from '../../../lib/get-workflows-in-order';

class ProjectStatsPageController extends React.Component {
  constructor(props) {
    super(props);

    this.handleGraphChange = this.handleGraphChange.bind(this);
    this.handleWorkflowChange = this.handleWorkflowChange.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);
    this.getWorkflows = this.getWorkflows.bind(this);

    this.state = {
      workflowList: []
    };
  }

  componentDidMount() {
    this.getWorkflows(this.props.project);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.project !== nextProps.project) {
      this.getWorkflows(nextProps.project);
    }
  }

  getWorkflows(project) {
    const fields = [
      'active',
      'classifications_count',
      'completeness',
      'configuration',
      'display_name',
      'retired_set_member_subjects_count',
      'retirement,subjects_count'
    ];
    const query = {
      fields: fields.join(','),
      page_size: project.links.workflows.length
    };
    getWorkflowsInOrder(project, query)
      .then((workflows) => {
        const workflowsSetToBeVisible =
          workflows.filter((workflow) => {
            let statsVisible = workflow.active;
            if (workflow.configuration.stats_hidden !== undefined) {
              statsVisible = !workflow.configuration.stats_hidden;
            }
            // statsVisible = statsVisible || !workflow.configuration.stats_hidden;
            // let statsVisible = !workflow.configuration.stats_hidden;
            // if (!workflow.active) {
            //   statsVisible = !(workflow.configuration.stats_hidden === undefined) && statsVisible;
            // }
            return (statsVisible ? workflow : null);
          });
        this.setState({ workflowList: workflowsSetToBeVisible });
      });
  }

  getQuery(which) {
    return qs.parse(location.search.slice(1))[which];
  }

  handleGraphChange(which, e) {
    const query = qs.parse(location.search.slice(1));
    query[which] = e.target.value;
    query[`${which}Range`] = undefined;
    const { owner, name } = this.props.params;
    this.context.router.replace({ pathname: `/projects/${owner}/${name}/stats/`, query });
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
    this.context.router.replace({ pathname: `/projects/${owner}/${name}/stats/`, query });
  }

  handleRangeChange(which, range) {
    const query = qs.parse(location.search.slice(1));
    query[`${which}Range`] = range;
    const { owner, name } = this.props.params;
    this.context.router.replace({ pathname: `/projects/${owner}/${name}/stats/`, query });
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
      startDate: this.props.project.launch_date
    };

    return <ProjectStatsPage {...queryProps} />;
  }
}

ProjectStatsPageController.contextTypes = { router: PropTypes.object };

ProjectStatsPageController.propTypes = {
  project: PropTypes.object,
  params: PropTypes.object
};

module.exports = ProjectStatsPageController;