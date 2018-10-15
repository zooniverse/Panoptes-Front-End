import PropTypes from 'prop-types';
import React from 'react';
import statsClient from 'panoptes-client/lib/stats-client';
import moment from 'moment';
import { Progress, Graph } from './charts.jsx';

export class GraphSelect extends React.Component {
  constructor(props) {
    super(props);

    this.getStats = this.getStats.bind(this);
    this.getRange = this.getRange.bind(this);
    this.workflowSelect = this.workflowSelect.bind(this);
    this.handleWorkflowSelect = this.handleWorkflowSelect.bind(this);
    this.handleGraphChange = this.handleGraphChange.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);

    this.state = {
      workflowsLoaded: false,
      statData: null,
    };
  }

  componentDidMount() {
    this.getStats(this.props.workflowId, this.props.by);
  }

  componentWillReceiveProps(nextProps) {
    // update the stats when dropdown options change
    if ((this.props.workflowId !== nextProps.workflowId) || (this.props.by !== nextProps.by)) {
      this.getStats(nextProps.workflowId, nextProps.by);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const newBy = (this.props.by !== nextProps.by);
    const newWorkflowId = (this.props.workflowId !== nextProps.workflowId);
    const newWorkflows = (this.props.workflows !== nextProps.workflows);
    const newState = (this.state !== nextState);
    return newBy || newWorkflowId || newWorkflows || newState;
  }

  getStats(workflowId, binBy) {
    statsClient
      .query({
        projectID: this.props.projectId,
        workflowID: workflowId,
        period: binBy,
        type: this.props.type,
      })
      .then((data) => (
        data.map((statObject) => ({
          label: statObject.key_as_string,
          value: statObject.doc_count,
        }))
      ))
      .then((statData) => {
        this.setState({ statData });
      })
      .catch(() => {
        if (console) {
          console.warn('Failed to fetch stats');
        }
      });
  }

  getRange() {
    let range = [];
    if (this.props.range) {
      for (const r of this.props.range.split(',')) {
        if (r) {
          range.push(parseInt(r, 10));
        } else {
          range.push(undefined);
        }
      }
    } else {
      range = [undefined, undefined];
    }
    return range;
  }

  workflowSelect() {
    let workflowSelect;
    if (this.props.workflows) {
      const options = [
        <option value={`project_id=${this.props.projectId}`} key={"workflowSelectAll"}>All</option>,
      ];
      let key = 0;
      for (const workflow of this.props.workflows) {
        options.push(
          <option value={`workflow_id=${workflow.id}`} key={`workflowSelect${key}`}>
            {workflow.display_name}
          </option>
        );
        key++;
      }
      if (options.length > 1) {
        let value;
        if (this.props.workflowId) {
          value = `workflow_id=${this.props.workflowId}`;
        } else {
          value = `project_id=${this.props.projectId}`;
        }
        workflowSelect = (
          <span>
            {' '}for{' '}
            <select onChange={this.handleWorkflowSelect} value={value}>
              {options}
            </select>
          </span>
        );
      }
    }
    return workflowSelect;
  }

  handleWorkflowSelect(event) {
    this.props.handleWorkflowChange(this.props.type, event);
  }

  handleGraphChange(event) {
    this.props.handleGraphChange(this.props.type, event);
  }

  handleRangeChange(range) {
    this.props.handleRangeChange(this.props.type, range);
  }

  render() {
    let output = (
      <div>
        There is no stats data available at this time.
      </div>
    );
    if (this.state.statData) {
      const range = this.getRange();
      const workflowSelect = this.workflowSelect();
      output = (
        <div>
          {this.props.type[0].toUpperCase() + this.props.type.substring(1)}s per{' '}
          <select value={this.props.by} onChange={this.handleGraphChange}>
            <option value="hour">hour</option>
            <option value="day">day</option>
            <option value="week">week</option>
            <option value="month">month</option>
          </select>
          {workflowSelect}
          <br />
          <Graph
            data={this.state.statData}
            by={this.props.by}
            range={range}
            num={24}
            handleRangeChange={this.handleRangeChange}
          />
        </div>
      );
    }
    return output;
  }
}

GraphSelect.defaultProps = {
  by: 'day',
};

GraphSelect.propTypes = {
  by: PropTypes.string,
  failedWorkflows: PropTypes.array,
  projectId: PropTypes.string,
  workflowId: PropTypes.string,
  range: PropTypes.string,
  type: PropTypes.string,
  workflows: PropTypes.array,
  handleGraphChange: PropTypes.func,
  handleRangeChange: PropTypes.func,
  handleWorkflowChange: PropTypes.func,
};

export const Eta = (props) => {
  let output = <div />;
  if (props.numDays !== undefined) {
    output = (
      <div>
        <span className="progress-stats-label">ETC*</span> {`${props.numDays} days`}
      </div>
    );
  }
  return output;
};

Eta.propTypes = {
  numDays: PropTypes.number,
};

export class WorkflowProgress extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);

    this.state = {
      statData: null,
    };
  }

  componentDidMount() {
    statsClient
      .query({
        workflowID: this.props.workflow.id,
        period: 'day',
        type: 'classification',
      })
      .then((data) => (
        data.map((statObject) => (
          statObject.doc_count
        ))
      ))
      .then((statData) => {
        this.setState({ statData });
      })
      .catch(() => {
        if (console) {
          console.warn('Failed to fetch stats');
        }
      });
  }

  calcDaysToCompletion(totalCount) {
    let numDays = undefined;
    const dataLength = this.state.statData.length;
    const compeletness = this.props.workflow.completeness == 1;
    if (compeletness) {
      numDays = 0;
    }
    else if (dataLength > 1) {
      let value;
      let days;
      if (dataLength > 15) {
        // don't count the last bin since the current day is not over yet
        value = this.state.statData.slice(dataLength - 15, dataLength - 1);
        days = 14;
      } else {
        value = this.state.statData.slice(0, dataLength - 1);
        days = dataLength - 1;
      }
      const rate = value.reduce((a, b) => (a + b));
      numDays = Math.max(0, Math.ceil(days * (totalCount - this.props.workflow.classifications_count) / rate));
    }
    return numDays;
  }

  render() {
    let retirement;
    let eta;
    let retiredDiv;
    let classificationDiv;
    let completeness = this.props.workflow.completeness;
    const totalCount = this.props.workflow.subjects_count * this.props.workflow.retirement.options.count;
    if (this.props.workflow.retirement.criteria !== 'never_retire') {
      retiredDiv = (
        <div>
          <span className="progress-stats-label">Images retired:</span>
          {' '}{this.props.workflow.retired_set_member_subjects_count.toLocaleString()}
          {' / '}{this.props.workflow.subjects_count.toLocaleString()}
        </div>
      );
    }
    let classificationsString = ` ${this.props.workflow.classifications_count.toLocaleString()}`;
    if (this.props.workflow.retirement.criteria === 'classification_count') {
      retirement = (
        <div>
          <span className="progress-stats-label">Retirement limit:</span>
          {' '}{this.props.workflow.retirement.options.count.toLocaleString()}
        </div>
      );
      if (this.state.statData) {
        eta = <Eta numDays={this.calcDaysToCompletion(totalCount)}/>;
      }
      if (this.props.workflow.configuration) {
        if (this.props.workflow.configuration.stats_completeness_type === 'classification' && completeness !== 1) {
          completeness = this.props.workflow.classifications_count / totalCount;
          classificationsString += ` / ${totalCount.toLocaleString()}`;
          classificationDiv = (
            <div>
              <span className="progress-stats-label">Classifications:</span>
              {classificationsString}
            </div>
          );
        }
      }
    }
    return (
      <div className="progress-element">
        <div className="flex-wrapper">
          <h3>{this.props.workflow.display_name}</h3>
          <div>
            {retirement}
          </div>
          {retiredDiv}
          {classificationDiv}
          {eta}
          <Progress progress={completeness} />
        </div>
      </div>
    );
  }
}

WorkflowProgress.propTypes = {
  workflow: PropTypes.object,
};

export class ProjectStatsPage extends React.Component {
  constructor(props) {
    super(props);
    this.workflowInfo = this.workflowInfo.bind(this);
  }

  workflowInfo() {
    const progress = [];
    let ETAVisible = false;
    let key = 0;
    for (const workflow of this.props.workflows) {
      progress.push(<WorkflowProgress key={key} workflow={workflow} />);
      ETAVisible = ETAVisible || (workflow.retirement.criteria === 'classification_count');
      key++;
    }
    return { progress, ETAVisible };
  }

  render() {
    const { progress, ETAVisible } = this.workflowInfo();
    // Dates for gap in classification stats
    const classificationGap = ['2015-06-30T00:00:00.000Z', '2016-06-09T00:00:00.000Z'];
    // Dates for gap in talk stats
    const talkGap = ['2015-06-30T00:00:00.000Z', '2016-06-09T00:00:00.000Z'];
    let start;
    if (this.props.startDate) {
      start = (
        <div className="project-metadata-stat">
          <div>{moment.utc(this.props.startDate).format('MMM-DD-YYYY')}</div>
          <div>Launch Date</div>
        </div>
      );
    }
    let classificationFootnoteMarker;
    let classificationFootnote;
    if (moment.utc(this.props.startDate) <= moment.utc(classificationGap[1])) {
      classificationFootnoteMarker = <span><sup>&#8224;</sup></span>;
      classificationFootnote = (
        <span className="project-stats-footer">
         {classificationFootnoteMarker}
         Due to an issue with our stats server all data before
         {' '}{moment.utc(classificationGap[1]).format('MMM-DD-YYYY')} is
         {' '}currently unavailable.  We are currently working to resolve this issue.
         {' '}<b>No</b> classifications were lost in this time.
        </span>
      );
    }
    let talkFootnoteMarker;
    let talkFootnote;
    if (moment.utc(this.props.startDate) <= moment.utc(talkGap[1])) {
      talkFootnoteMarker = <span><sup>&#8225;</sup></span>;
      talkFootnote = (
        <span className="project-stats-footer">
          {talkFootnoteMarker}
          Due to an issue with our stats server all data before
          {' '}{moment.utc(talkGap[1]).format('MMM-DD-YYYY')} is
          {' '}currently unavailable.  We are currently working to resolve this issue.
          {' '}<b>No</b> talk comments were lost in this time.
        </span>
      );
    }
    let ETAFootnote;
    if (ETAVisible) {
      ETAFootnote = (
        <span className="project-stats-footer">
          *Estimated time to completion is based on the classification rate
          {' '}for the past 14 days and may be incorrect due to the way
          {' '}we currently report the data, or unavailable for some workflows.
        </span>
      );
    }
    return (
      <div className="project-text-content content-container">
        <div className="project-stats-dashboard">
          <div className="project-metadata-stats">
            {start}
            <div className="project-metadata-stat">
              <div>{this.props.totalVolunteers.toLocaleString()}</div>
              <div>Registered Volunteers</div>
            </div>
            <div className="project-metadata-stat">
              <div>{this.props.currentClassifications.toLocaleString()}</div>
              <div>Classifications Yesterday</div>
            </div>
          </div>
          <hr />
          <div className="project-stats-progress">
            <span className="project-stats-heading">Live Workflows</span>
            {progress}
            {ETAFootnote}
          </div>
          <hr />
        </div>
        <span className="project-stats-heading">
          Classification Stats{classificationFootnoteMarker}
        </span>
        <div>
          <GraphSelect
            handleGraphChange={this.props.handleGraphChange}
            handleRangeChange={this.props.handleRangeChange}
            handleWorkflowChange={this.props.handleWorkflowChange}
            workflows={this.props.workflows}
            failedWorkflows={this.props.failedWorkflows}
            workflowId={this.props.workflowId}
            type="classification"
            projectId={this.props.projectId}
            by={this.props.classificationsBy}
            range={this.props.classificationRange}
          />
        </div>
        {classificationFootnote}
        <hr />
        <span className="project-stats-heading">Talk Stats{talkFootnoteMarker}</span>
        <div>
          <GraphSelect
            handleGraphChange={this.props.handleGraphChange}
            handleRangeChange={this.props.handleRangeChange}
            type="comment"
            projectId={this.props.projectId}
            by={this.props.commentsBy}
            range={this.props.commentRange}
          />
        </div>
        {talkFootnote}
      </div>
    );
  }
}

ProjectStatsPage.defaultProps = {
  totalVolunteers: 0,
  currentClassifications: 0,
};

ProjectStatsPage.propTypes = {
  classificationRange: PropTypes.string,
  classificationsBy: PropTypes.string,
  commentsBy: PropTypes.string,
  commentRange: PropTypes.string,
  currentClassifications: PropTypes.number,
  failedWorkflows: PropTypes.array,
  projectId: PropTypes.string,
  totalVolunteers: PropTypes.number,
  workflows: PropTypes.array,
  startDate: PropTypes.string,
  handleGraphChange: PropTypes.func,
  handleRangeChange: PropTypes.func,
  handleWorkflowChange: PropTypes.func,
  workflowId: PropTypes.string,
};