import React from 'react';
import statsClient from 'panoptes-client/lib/stats-client';
import moment from 'moment';
import { Progress, Graph } from './charts.js';

export class GraphSelect extends React.Component {
  constructor(props) {
    super(props);

    this.getStats = this.getStats.bind(this);
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
    if ((!this.state.workflowsLoaded) && (nextProps.workflows)) {
      let areNulls = false;
      let idx = 0;
      for (const w of nextProps.workflows) {
        if ((w === null) && (this.props.failedWorkflows.indexOf(idx) < 0)) {
          areNulls = true;
        }
        idx++;
      }
      if (!areNulls) {
        this.setState({ workflowsLoaded: true });
      }
    }
    // update the stats when dropdown options change
    if ((this.props.workflowId !== nextProps.workflowId) || (this.props.by !== nextProps.by)) {
      this.getStats(nextProps.workflowId, nextProps.by);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.by !== nextProps.by) || (this.props.workflowId !== nextProps.workflowId) || (this.state !== nextState);
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

  workflowSelect() {
    let workflowSelect = undefined;
    if (this.props.workflows) {
      const options = [<option value={`project_id=${this.props.projectId}`} key={"workflowSelectAll"}>All</option>];
      let key = 0;
      for (const workflow of this.props.workflows) {
        if (workflow != null ? workflow.active : void 0) {
          options.push(<option value={`workflow_id=${workflow.id}`} key={`workflowSelect${key}`}>{workflow.display_name}</option>);
        }
        key++;
      }
      if (options.length > 1) {
        const value = this.props.workflowId ? `workflow_id=${this.props.workflowId}` : `project_id=${this.props.projectId}`;
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
    const workflowSelect = this.workflowSelect();
    let graph = undefined;
    if (this.state.statData) {
      graph = <Graph data={this.state.statData} by={this.props.by} range={range} num={24} handleRangeChange={this.handleRangeChange} />;
    }
    return (
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
        {graph}
      </div>
    );
  }
}

GraphSelect.defaultProps = {
  by: 'day',
};

GraphSelect.propTypes = {
  by: React.PropTypes.string,
  failedWorkflows: React.PropTypes.array,
  projectId: React.PropTypes.string,
  workflowId: React.PropTypes.string,
  range: React.PropTypes.string,
  type: React.PropTypes.string,
  workflows: React.PropTypes.array,
  handleGraphChange: React.PropTypes.func,
  handleRangeChange: React.PropTypes.func,
  handleWorkflowChange: React.PropTypes.func,
};

export const Eta = (props) => {
  if (props.data.length > 1) {
    let value;
    let days;
    if (props.data.length > 15) {
      // don't count the last bin since the current day is not over yet
      value = props.data.slice(props.data.length - 15, props.data.length - 1);
      days = 14;
    } else {
      value = props.data.slice(0, props.data.length - 1);
      days = props.data.length - 1;
    }
    const rate = value.reduce((a, b) => (a + b));
    const eta = Math.max(0, Math.ceil(days * (props.totalCount - props.currentCount) / rate));
    return (
      <div>
        <span className="progress-stats-label">ETC*</span> {`${eta} days`}
      </div>
    );
  }
  return <div />;
};

Eta.propTypes = {
  currentCount: React.PropTypes.number,
  data: React.PropTypes.array,
  totalCount: React.PropTypes.number,
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

  render() {
    let retirement;
    let eta;
    if (this.props.workflow.retirement.criteria === 'classification_count') {
      retirement = <div><span className="progress-stats-label">Retirement limit:</span> {this.props.workflow.retirement.options.count.toLocaleString()}</div>;
    }
    if (this.state.statData) {
      eta = <Eta data={this.state.statData} currentCount={this.props.workflow.classifications_count} totalCount={this.props.workflow.subjects_count * this.props.workflow.retirement.options.count} />;
    }
    return (
      <div className="progress-element">
        <div className="flex-wrapper">
          <h3>{this.props.workflow.display_name}</h3>
          <div>
            {retirement}
          </div>
          <div>
            <span className="progress-stats-label">Images retired:</span> {this.props.workflow.retired_set_member_subjects_count.toLocaleString()} / {this.props.workflow.subjects_count.toLocaleString()}
          </div>
          <div>
            <span className="progress-stats-label">Classifications:</span> {this.props.workflow.classifications_count.toLocaleString()} / {(this.props.workflow.subjects_count * this.props.workflow.retirement.options.count).toLocaleString()}
          </div>
          {eta}
          <Progress progress={this.props.workflow.completeness} />
        </div>
      </div>
    );
  }
}

WorkflowProgress.propTypes = {
  workflow: React.PropTypes.object,
};

export class ProjectStatsPage extends React.Component {
  constructor(props) {
    super(props);
    this.workflowInfo = this.workflowInfo.bind(this);
  }

  workflowInfo() {
    const progress = [];
    let key = 0;
    for (const workflow of this.props.workflows) {
      if (workflow != null ? workflow.active : void 0) {
        progress.push(<WorkflowProgress key={key} workflow={workflow} />);
      }
      key++;
    }
    return progress;
  }

  render() {
    const progress = this.workflowInfo();
    // Dates for gap in classification stats
    const classificationGap = ['2016-01-13T00:00:00.000Z', '2016-02-07T00:00:00.000Z'];
    // Dates for gap in talk stats
    const talkGap = ['2016-02-18T00:00:00.000Z', '2016-04-07T00:00:00.000Z'];
    let start;
    if (this.props.startDate) {
      start = (
        <div className="project-metadata-stat">
          <div>{moment(this.props.startDate).format('MMM-DD-YYYY')}</div>
          <div>Launch Date</div>
        </div>
      );
    }
    let classificationFootnoteMarker;
    let classificationFootnote;
    if (moment(this.props.startDate) <= moment(classificationGap[1])) {
      classificationFootnoteMarker = <span><sup>&#8224;</sup></span>;
      classificationFootnote = (
        <span className="project-stats-footer">
         {classificationFootnoteMarker}
          The gap in the classification data from {moment(classificationGap[0]).format('MMM-DD-YYYY')} to {moment(classificationGap[1]).format('MMM-DD-YYYY')} was caused a bug in our event notification system.
          &nbsp;<b>No</b> classifications were lost in this time.
        </span>
      );
    }
    let talkFootnoteMarker;
    let talkFootnote;
    if (moment(this.props.startDate) <= moment(talkGap[1])) {
      talkFootnoteMarker = <span><sup>&#8225;</sup></span>;
      talkFootnote = (
        <span className="project-stats-footer">
          {talkFootnoteMarker}
          The gap in the talk data from {moment(talkGap[0]).format('MMM-DD-YYYY')} to {moment(talkGap[1]).format('MMM-DD-YYYY')} was caused a bug in our event notification system.
          &nbsp;<b>No</b> talk comments were lost in this time.
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
              <div>Recent Classifications</div>
            </div>
          </div>
          <hr />
          <div className="project-stats-progress">
            <span className="project-stats-heading">Live Workflows</span>
            {progress}
            <span className="project-stats-footer">*Estimated time to completion is based on the classification rate for the past 14 days and may be incorrect due to the way we currently report the data.</span>
          </div>
          <hr />
        </div>
        <span className="project-stats-heading">Classification Stats{classificationFootnoteMarker}</span>
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
  classificationRange: React.PropTypes.string,
  classificationsBy: React.PropTypes.string,
  commentsBy: React.PropTypes.string,
  commentRange: React.PropTypes.string,
  currentClassifications: React.PropTypes.number,
  failedWorkflows: React.PropTypes.array,
  projectId: React.PropTypes.string,
  totalVolunteers: React.PropTypes.number,
  workflows: React.PropTypes.array,
  startDate: React.PropTypes.string,
  handleGraphChange: React.PropTypes.func,
  handleRangeChange: React.PropTypes.func,
  handleWorkflowChange: React.PropTypes.func,
  workflowId: React.PropTypes.string,
};
