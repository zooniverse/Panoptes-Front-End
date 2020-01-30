import _ from 'lodash';
import counterpart from 'counterpart';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import apiClient from 'panoptes-client/lib/api-client';
import isAdmin from '../../../../lib/is-admin';

import { getProjectLinks } from '../../../../lib/nav-helpers';
import ProjectNavbar from './ProjectNavbar';

function isResourceAProject(resource) {
  return Object.keys(resource).includes('workflow_description');
}

class ProjectNavbarContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adminEnabled: false
    };
  }

  componentDidMount() {
    apiClient.listen('change', this.handleClientChange.bind(this));
  }

  componentWillUnmount() {
    apiClient.stopListening('change', this.handleClientChange.bind(this));
  }

  getNavLinks() {
    const project = this.getProjectLinks();
    const org = this.getOrganizationLink();
    return [].concat(project, org);
  }

  getOrganizationLink() {
    const { organization } = this.props;
    const link = [];

    if (organization) {
      link.push({
        label: organization.display_name,
        url: `/organizations/${organization.slug}`
      });
    }

    return link;
  }

  getProjectLinks() {
    const { project, projectRoles, user } = this.props;
    const links = getProjectLinks({ project, projectRoles, user });

    return _.map(links, link => ({
      disabled: link.disabled || false,
      isExternalLink: link.isExternalLink || false,
      label: counterpart(link.translationPath),
      url: link.url
    }));
  }


  handleClientChange() {
    const adminEnabled = isAdmin();
    if (adminEnabled !== this.state.adminEnabled) {
      // Trigger a re-render if an admin user toggles the admin mode checkbox
      this.setState({ adminEnabled });
    }
  }

  render() {
    const avatarSrc = _.get(this.props.projectAvatar, 'src', undefined);
    const backgroundSrc = _.get(this.props.background, 'src', undefined);
    const launched = this.props.project.launch_approved || this.props.project.listed;
    const navLinks = isResourceAProject(this.props.project) ? this.getNavLinks() : [];
    const projectTitle = _.get(this.props.translation, 'display_name', undefined);
    const projectLink = isResourceAProject(this.props.project) ? `/projects/${this.props.project.slug}` : `/organizations/${this.props.project.slug}`;
    const redirect = this.props.project.redirect ? this.props.project.redirect : '';
    const underReview = this.props.project.beta_approved;

    return (
      <ProjectNavbar
        avatarSrc={avatarSrc}
        backgroundSrc={backgroundSrc}
        launched={launched}
        navLinks={navLinks}
        project={this.props.project}
        projectTitle={projectTitle}
        projectLink={projectLink}
        redirect={redirect}
        underReview={underReview}
      />
    );
  }
}

ProjectNavbarContainer.propTypes = {
  background: PropTypes.shape({
    src: PropTypes.string
  }),
  organization: PropTypes.shape({
    display_name: PropTypes.string,
    slug: PropTypes.string
  }),
  projectAvatar: PropTypes.shape({
    src: PropTypes.string
  }),
  project: PropTypes.shape({
    beta_approved: PropTypes.bool,
    launch_approved: PropTypes.bool,
    redirect: PropTypes.string,
    slug: PropTypes.string,
    title: PropTypes.string,
    urls: PropTypes.array
  }),
  projectRoles: PropTypes.array,
  translation: PropTypes.shape({
    display_name: PropTypes.string
  }),
  user: PropTypes.object
};

export default ProjectNavbarContainer;
