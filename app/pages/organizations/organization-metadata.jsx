import React from 'react';

const OrganizationMetadataStat = ({ value, label }) => (
  <div>
    <div className="organization-metadata-stat__value">{value}</div>
    <div>{label}</div>
  </div>
);

OrganizationMetadataStat.propTypes = {
  label: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired
};

export default class OrganizationMetaData extends React.Component {
  constructor(props) {
    super(props);

    this.extractStat = this.extractStat.bind(this);
  }

  extractStat(statName) {
    const projects = this.props.organization.projects;
    return projects.reduce((accum, project) => accum + project[statName], 0);
  }

  render() {
    const organization = this.props.organization;

    return (
      <div className="organization-metadata">
        <div className="organization-metadata-title">
          <h1 className="organization-metadata--name">{organization.display_name}{' '}Statistics</h1>
          <div>
            <OrganizationMetadataStat label="Volunteers" value={this.extractStat('classifiers_count').toLocaleString()} />
            <OrganizationMetadataStat label="Classifications" value={this.extractStat('classifications_count').toLocaleString()} />
            <OrganizationMetadataStat label="Subjects" value={this.extractStat('subjects_count').toLocaleString()} />
            <OrganizationMetadataStat label="Completed Subjects" value={this.extractStat('retired_subjects_count').toLocaleString()} />
          </div>
        </div>
      </div>
    );
  }

}

OrganizationMetaData.propTypes = {
  organization: React.PropTypes.shape({
    projects: React.PropTypes.arrayOf(React.PropTypes.object)
  }).isRequired
};
