import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

// TEMPORARY HACK: Pages Editor
// (@shaunanoordin 2024.06.21)
const TEST_PROJECTS_THAT_SHOULD_USE_PAGES_EDITOR = ['23976'];  // Production IDs.
// WARNING: doesn't differentiate between production and staging projects

const WorkflowsTable = ({
  handleSetStatsCompletenessType,
  handleWorkflowStatusChange,
  handleWorkflowStatsVisibility,
  labPath,
  meta,
  project,
  workflows
}) => {
  const shouldUsePagesEditor = TEST_PROJECTS_THAT_SHOULD_USE_PAGES_EDITOR.includes(project?.id + '')
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
          const statsCompletenessType = (workflow.configuration && workflow.configuration.stats_completeness_type) ? workflow.configuration.stats_completeness_type : 'retirement';
          let statsVisible = workflow.active;
          if (workflow.configuration && workflow.configuration.stats_hidden !== undefined) {
            statsVisible = !workflow.configuration.stats_hidden;
          }

          const viewWorkflowUrl = shouldUsePagesEditor
            ? labPath(`/workflows/editor/${workflow.id}`)
            : labPath(`/workflows/${workflow.id}`);  // Default

          return (
            <tr key={workflow.id}>
              <td>
                <Link key={workflow.id} to={viewWorkflowUrl} activeClassName="active">
                  {workflow.display_name}
                  {' '}(#{workflow.id})
                  {(project.configuration && workflow.id === project.configuration.default_workflow) && (
                    <span title="Default workflow">{' '}*{' '}</span>
                  )}
                </Link>
              </td>
              <td>
                {`${progressPercentage.toFixed(0)} % Complete`}
              </td>
              <td>
                <label>
                  <input
                    checked={workflow.active}
                    name={`status.${workflow.id}`}
                    onChange={e => handleWorkflowStatusChange(e, meta.page, workflow)}
                    type="checkbox"
                    value={workflow.active}
                  />
                  Active
                </label>
              </td>
              <td>
                <label class="standard-table__label__completeness">
                  <input
                    checked={statsCompletenessType === 'classification'}
                    name={`stats_completeness_type.${workflow.id}`}
                    onChange={e => handleSetStatsCompletenessType(e, meta.page, workflow)}
                    type="radio"
                    value="classification"
                  />
                  Classification Count
                </label>
                {' '}
                <label class="standard-table__label__completeness">
                  <input
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
                <label>
                  <input
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
  handleWorkflowStatusChange: PropTypes.func,
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
