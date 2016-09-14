import React from 'react';
import qs from 'qs';
import { ProjectStatsPage } from './stats.jsx';
import getWorkflowsInOrder from '../../../lib/get-workflows-in-order.coffee';

class ProjectStatsPageController extends React.Component {
  constructor(props) {
    super(props);

    this.handleGraphChange = this.handleGraphChange.bind(this);
    this.handleWorkflowChange = this.handleWorkflowChange.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);

    this.state = {
      workflowList: [],
    };
  }

  componentDidMount() {
    const fields = [
      'classifications_count',
      'completeness',
      'display_name',
      'retired_set_member_subjects_count',
      'retirement,subjects_count',
    ];
    const query = {
      active: true,
      fields: fields.join(','),
    };
    getWorkflowsInOrder(this.props.project, query)
      .then((workflows) => {
        this.setState({ workflowList: workflows });
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
      startDate: this.props.project.launch_date,
    };

    return <ProjectStatsPage {...queryProps} />;
  }
}

ProjectStatsPageController.contextTypes = { router: React.PropTypes.object };

ProjectStatsPageController.propTypes = {
  project: React.PropTypes.object,
  params: React.PropTypes.object,
};

module.exports = ProjectStatsPageController;
