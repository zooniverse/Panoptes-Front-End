import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';

export const OrganizationMetadata = ({ displayName, projects }) => {
  function extractStat(statName) {
    return projects.reduce((accum, project) => {
      if (project[statName]) {
        return accum + project[statName];
      } else {
        return accum;
      }
    }, 0);
  }

  return (
    <div className="organization-page__container">
      <div className="project-metadata">
        <span className="organization-details__heading">
          {displayName}{' '}<Translate content="project.home.metadata.statistics" />
        </span>
        {projects && (projects.length > 0) &&
          <div className="project-metadata-stats">
            <div className="project-metadata-stat">
              <div className="project-metadata-stat__value">
                {projects.length.toLocaleString()}
              </div>
              <div className="project-metadata-stat__label">
                <Translate content="organization.home.metadata.projects" />
              </div>
            </div>
            <div className="project-metadata-stat">
              <div className="project-metadata-stat__value">
                {extractStat('subjects_count').toLocaleString()}
              </div>
              <div className="project-metadata-stat__label">
                <Translate content="project.home.metadata.subjects" />
              </div>
            </div>
            <div className="project-metadata-stat">
              <div className="project-metadata-stat__value">
                {extractStat('classifications_count').toLocaleString()}
              </div>
              <div className="project-metadata-stat__label">
                <Translate content="project.home.metadata.classifications" />
              </div>
            </div>
            <div className="project-metadata-stat">
              <div className="project-metadata-stat__value">
                {extractStat('retired_subjects_count').toLocaleString()}
              </div>
              <div className="project-metadata-stat__label">
                <Translate content="project.home.metadata.completedSubjects" />
              </div>
            </div>
          </div>}
      </div>
    </div>);
};

OrganizationMetadata.propTypes = {
  displayName: PropTypes.string,
  projects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      display_name: PropTypes.string
    })
  )
};

export default OrganizationMetadata;