import PropTypes from 'prop-types';
import React from 'react';
import { Markdown } from 'markdownz';

import ProjectNavbar from '../../project/components/ProjectNavbar';

class OrganizationStats extends React.Component {
  render() {
    return (
      <div
        className="project-page"
      >
        <ProjectNavbar 
          background={this.props.organizationBackground}
          loading={this.props.fetchingProjects}
          organization={this.props.organization}
          project={this.props.organization}
          projectAvatar={this.props.organizationAvatar}
          projectRoles={this.props.organizationRoles}
          routes={this.props.routes}
          translation={{ id: this.props.organization.id, display_name: this.props.organization.display_name }}
          user={this.props.user}
        />
        {(this.props.organization.announcement)
          && (
            <div className="informational project-announcement-banner">
              <Markdown>
                {this.props.organization.announcement}
              </Markdown>
            </div>
          )}
        <div>
          <h1>
            Organization Stats Page
          </h1>
          <p>
            This is the organization stats page.
          </p>
        </div>
      </div>
    );
  }
}

OrganizationStats.defaultProps = {
  fetchingProjects: false,
  organization: {
    id: '',
    display_name: '',
    redirect: '',
    slug: ''
  },
  organizationAvatar: null,
  organizationBackground: {
    src: ''
  },
  organizationRoles: [],
  routes: [],
  translation: {
    id: '',
    display_name: ''
  },
  user: null
};

OrganizationStats.propTypes = {
  fetchingProjects: PropTypes.bool,
  organization: PropTypes.shape({
    configuration: PropTypes.shape({
      announcement: PropTypes.string
    }),
    id: PropTypes.string,
    display_name: PropTypes.string,
    slug: PropTypes.string
  }),
  organizationBackground: PropTypes.shape({
    src: PropTypes.string
  }),
  organizationAvatar: PropTypes.shape({
    src: PropTypes.string
  }),
  organizationRoles: PropTypes.array,
  user: PropTypes.shape({
    id: PropTypes.string
  }),
  routes: PropTypes.array,
  translation: PropTypes.shape({
    display_name: PropTypes.string
  })
};

export default OrganizationStats;
