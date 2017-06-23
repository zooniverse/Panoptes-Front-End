import React from 'react';

const OrganizationMetadataStat = ({ value, label }) => (
  <div>
    <h2 className="organization-details__stats-value">{value > 0 ? { value } : 0}</h2>
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
      <div>
        <h6 className="organization-details__stats-title">{organization.display_name}{' '}Statistics</h6>
        <div>
          <OrganizationMetadataStat
            label="Volunteers"
            value={this.extractStat('classifiers_count').toLocaleString()}
          />
          <OrganizationMetadataStat
            label="Classifications"
            value={this.extractStat('classifications_count').toLocaleString()}
          />
          <OrganizationMetadataStat
            label="Subjects"
            value={this.extractStat('subjects_count').toLocaleString()}
          />
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
