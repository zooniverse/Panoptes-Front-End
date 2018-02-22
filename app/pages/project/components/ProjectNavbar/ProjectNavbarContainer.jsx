import _ from 'lodash';
import counterpart from 'counterpart';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import apiClient from 'panoptes-client/lib/api-client';
import isAdmin from '../../../../lib/is-admin';

import getProjectLinks from './helpers/getProjectLinks';
import ProjectNavbar from './ProjectNavbar';

class ProjectNavbarContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adminEnabled: false
    }
  }

  componentDidMount() {
    apiClient.listen('change', this.handleClientChange.bind(this));
  }

  componentWillUnmount() {
    apiClient.stopListening('change', this.handleClientChange.bind(this));
  }

  handleClientChange() {
    const adminEnabled = isAdmin();
    if (adminEnabled !== this.state.adminEnabled) {
      // Trigger a re-render if an admin user toggles the admin mode checkbox
      this.setState({ adminEnabled });
    }
  }

  getExternalLinks() {
    const allExternalLinks = _.get(this.props.project, 'urls', [])
      .map(link => ({ ...link, isExternalLink: true }));

    const partitionedLinks = _.partition(allExternalLinks, link => (link.site));

    const external = partitionedLinks[1].map(link => ({
      isExternalLink: true,
      label: link.label,
      url: link.url
    }));

    const social = partitionedLinks[0].map(link => ({
      isExternalLink: true,
      isSocialLink: true,
      label: link.label,
      site: link.site,
      url: link.url
    }));

    return {
      external,
      social
    };
  }

  getNavLinks() {
    const project = this.getProjectLinks();
    const { external, social } = this.getExternalLinks();
    const org = this.getOrganizationLink();
    return [].concat(project, org, external, social);
  }

  getOrganizationLink() {
    const { organization } = this.props;
    const link = [];

    if (organization) {
      link.push({
        isExternalLink: true,
        label: organization.display_name,
        url: `/organizations/${organization.slug}`
      });
    }

    return link;
  }

  getProjectLinks() {
    const { project, projectRoles, user, workflow } = this.props;
    const links = getProjectLinks({ project, projectRoles, workflow, user });

    return _.map(links, link => ({
      isExternalLink: link.isExternalLink || false,
      label: counterpart(link.translationPath),
      url: link.url
    }));
  }

  render() {
    const avatarSrc = _.get(this.props.projectAvatar, 'src', undefined);
    const backgroundSrc = _.get(this.props.background, 'src', undefined);
    const launched = this.props.project.launch_approved;
    const navLinks = this.getNavLinks();
    const projectTitle = _.get(this.props.translation, 'display_name', undefined);
    const projectLink = `/projects/${this.props.project.slug}`;
    const underReview = this.props.project.beta_approved;

    return (
      <ProjectNavbar
        avatarSrc={avatarSrc}
        backgroundSrc={backgroundSrc}
        launched={launched}
        navLinks={navLinks}
        projectTitle={projectTitle}
        projectLink={projectLink}
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
    slug: PropTypes.string,
    title: PropTypes.string,
    urls: PropTypes.array
  }),
  projectRoles: PropTypes.array,
  translation: PropTypes.shape({
    display_name: PropTypes.string
  }),
  user: PropTypes.object,
  workflow: PropTypes.object
};

export default ProjectNavbarContainer;
