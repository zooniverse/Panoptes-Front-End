import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const WorkflowsTable = ({
  handleSetStatsCompletenessType,
  handleWorkflowSettingChange,
  handleWorkflowStatsVisibility,
  labPath,
  meta,
  project,
  workflows
}) => {
  return (
    <table className="standard-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Progress</th>
          <th>Status</th>
          <th>Completeness statistic</th>
          <th>Statistic visibility</th>
        </tr>
      </thead>
      <tbody>
        {workflows.map((workflow) => {
          const progressPercentage = workflow.completeness * 100;
          const statsCompletenessType = (workflow.configuration.stats_completeness_type) ? workflow.configuration.stats_completeness_type : 'retirement';
          let statsVisible = workflow.active;
          if (workflow.configuration && workflow.configuration.stats_hidden !== undefined) {
            statsVisible = !workflow.configuration.stats_hidden;
          }

          return (
            <tr key={workflow.id}>
              <td>
                <Link key={workflow.id} to={labPath(`/workflows/${workflow.id}`)} activeClassName="active">
                  {workflow.display_name}
                  {(project.configuration && workflow.id === project.configuration.default_workflow) && (
                    <span title="Default workflow">{' '}*{' '}</span>
                  )}
                </Link>
              </td>
              <td>
                {`${progressPercentage.toFixed(0)} % Complete`}
              </td>
              <td>
                <label htmlFor="active">
                  <input
                    checked={workflow.active}
                    id="active"
                    onChange={e => handleWorkflowSettingChange(e, meta.page, workflow)}
                    type="checkbox"
                  />
                  Active
                </label>
              </td>
              <td>
                <label>
                  <input
                    id="stats_completeness"
                    checked={statsCompletenessType === 'classification'}
                    name={`stats_completeness_type.${workflow.id}`}
                    onChange={e => handleSetStatsCompletenessType(e, meta.page, workflow)}
                    type="radio"
                    value="classification"
                  />
                  Classification Count
                </label>
                {' '}
                <label htmlFor="stats_completeness">
                  <input
                    id="stats_completeness"
                    checked={statsCompletenessType === 'retirement'}
                    name={`stats_completeness_type.${workflow.id}`}
                    onChange={e => handleSetStatsCompletenessType(e, meta.page, workflow)}
                    type="radio"
                    value="retirement"
                  />
                  Retirement Count
                </label>
              </td>
              <td>
                <label htmlFor="stats_visible">
                  <input
                    id="stats_visible"
                    checked={statsVisible}
                    name={`stats_visible.${workflow.id}`}
                    onChange={e => handleWorkflowStatsVisibility(e, meta.page, workflow)}
                    type="checkbox"
                    value={statsVisible}
                  />
                  Show on Stats Page
                </label>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

WorkflowsTable.propTypes = {
  handleSetStatsCompletenessType: PropTypes.func,
  handleWorkflowSettingChange: PropTypes.func,
  handleWorkflowStatsVisibility: PropTypes.func,
  labPath: PropTypes.func,
  meta: PropTypes.shape({
    page: PropTypes.number
  }),
  project: PropTypes.shape({
    configuration: PropTypes.object,
    id: PropTypes.string
  }),
  workflows: PropTypes.arrayOf(PropTypes.object),
};

export default WorkflowsTable;
