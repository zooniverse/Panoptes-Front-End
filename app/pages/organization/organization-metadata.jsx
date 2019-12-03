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

  const percentComplete = Math.round((extractStat('retired_subjects_count') / extractStat('subjects_count') * 100));

  return (
    <div className="organization-details__content">
      <Translate
        className="organization-details__content-heading"
        component="h4"
        content="organization.home.metadata.heading"
      />
      {projects && (projects.length > 0)
        && (
          <div className="organization-metadata__container">
            <section className="organization-metadata__completeness-section">
              <Translate
                className="organization-metadata__subtitle"
                component="h5"
                content="organization.home.metadata.subtitle"
              />
              <Translate
                className="organization-metadata__completeness-text"
                component="p"
                content="organization.home.metadata.text"
                with={{ title: displayName }}
              />
              <div className="organization-metadata__progress-bar">
                <span
                  className="organization-metadata__progress-bar-meter"
                  style={{ width: `${percentComplete}%` }}
                >
                  {`${percentComplete}%`}
                </span>
              </div>
              <Translate
                className="organization-metadata__progress-bar-label"
                content="organization.home.metadata.complete"
              />
            </section>
            <section className="organization-metadata__numbers-section">
              <Translate
                className="organization-metadata__subtitle"
                component="h5"
                content="organization.home.metadata.numbers"
              />
              <div className="organization-metadata__numbers-stats-container">
                <div className="organization-metadata__numbers-stat-block">
                  <span className="organization-metadata__numbers-stat">
                    {projects.length.toLocaleString()}
                  </span>
                  <Translate
                    className="organization-metadata__numbers-label"
                    content="organization.home.metadata.projects"
                  />
                </div>
                <div className="organization-metadata__numbers-stat-block">
                  <span className="organization-metadata__numbers-stat">
                    {extractStat('classifications_count').toLocaleString()}
                  </span>
                  <Translate
                    className="organization-metadata__numbers-label"
                    content="project.home.metadata.classifications"
                  />
                </div>
                <div className="organization-metadata__numbers-stat-block">
                  <span className="organization-metadata__numbers-stat">
                    {extractStat('subjects_count').toLocaleString()}
                  </span>
                  <Translate
                    className="organization-metadata__numbers-label"
                    content="project.home.metadata.subjects"
                  />
                </div>
                <div className="organization-metadata__numbers-stat-block">
                  <span className="organization-metadata__numbers-stat">
                    {extractStat('retired_subjects_count').toLocaleString()}
                  </span>
                  <Translate
                    className="organization-metadata__numbers-label"
                    content="project.home.metadata.completedSubjects"
                  />
                </div>
              </div>
            </section>
          </div>
        )}
    </div>
  );
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

OrganizationMetadata.defaultProps = {
  displayName: '',
  projects: []
};

export default OrganizationMetadata;
