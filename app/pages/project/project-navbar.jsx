import React, { Component, PropTypes } from 'react';
import Translate from 'react-translate-component';
import { IndexLink, Link } from 'react-router';
import classnames from 'classnames';
import partition from 'lodash/partition';
import SOCIAL_ICONS from '../../lib/social-icons';
import Thumbnail from '../../components/thumbnail';
import isAdmin from '../../lib/is-admin';

// constants
const AVATAR_SIZE = 100;

const ProjectNavbar = ({
  loading,
  project,
  projectAvatar,
  projectRoles,
  routes,
  user,
  workflow
}, context) => {
  const { path } = routes[2];
  const projectPath = `/projects/${project.slug}`;
  const labPath = `/lab/${project.id}`;
  const adminPath = `/admin/project_status/${project.slug}`;
  const activeElement = project && (path === 'collections' || path === 'favorites');
  const collectClasses = classnames({
    'tabbed-content-tab': true,
    'active': activeElement
  });

  // helpers
  const logClick = () => {
    if (context && context.geordi) {
      return context.geordi.makeHandler('project-menu');
    }
  };

  const checkWorkflow = () => {
    const opacity = {
      opacity: 0.5
    };
    return (
      workflow ?
        <Link
          to={`${projectPath}/classify`}
          activeClassName="active"
          className="classify tabbed-content-tab"
          onClick={logClick('project.nav.classify')}
        >
          <Translate content="project.nav.classify" />
        </Link> :
        <span
          className="classify tabbed-content-tab"
          title="Loading..."
          style={opacity}
        >
          <Translate content="project.nav.classify" />
        </span>
    );
  };

  const renderAdminTab = () => {
    return (
      (isAdmin()) ?
        <Link
          to={`${adminPath}/`}
          activeClassName="active"
          className="tabbed-content-tab"
        >
          <Translate content="project.nav.adminPage" />
        </Link> :
        null
    );
  };

  const userHasLabAccess = () => {
    projectRoles.some(role => {
      if (role.links.owner.id === user.id) {
        return role.roles.includes('owner') || role.roles.includes('collaborator');
      }
    });
  };

  const renderLabTab = () => {
    return (
      (user && userHasLabAccess()) ?
      <Link
        to={`${labPath}/`}
        activeClassName="active"
        className="tabbed-content-tab"
      >
        <Translate content="project.nav.lab" />
      </Link> :
      null
    );
  };

  const renderAboutTab = () => {
    if (!project.redirect) {
      return (
        <Link
          to={`${projectPath}/about`}
          activeClassName="active"
          className="tabbed-content-tab"
          onClick={logClick('project.nav.about')}
        >
          <Translate content="project.nav.about" />
        </Link>
      );
    }
  };

  const renderRecents = () => {
    return (
      user ?
      <Link to="#{projectPath}/recents" activeClassName="active" className="tabbed-content-tab">
        <Translate content="project.nav.recents" />
      </Link> :
      null
    );
  };

  const renderAvatar = () => {
    return (
      projectAvatar ?
      <Thumbnail
        src={projectAvatar.src}
        className="avatar"
        width={AVATAR_SIZE}
        height={AVATAR_SIZE}
      />
      : null
    );
  };

  const redirectClassifyLink = (redirect) => {
    return `${redirect.replace(/\/?#?\/+$/, '')}/#/classify`;
  };

  const renderClassifyTab = () => {
    return (
      (project.redirect) ?
      <a
        href={redirectClassifyLink(project.redirect)}
        className="tabbed-content-tab"
        target="_blank"
        rel="noopener noreferrer"
        onClick={logClick('project.nav.classify')}
      >
        <Translate content="project.nav.classify" />
      </a> :
      checkWorkflow()
    );
  };

  const renderProjectName = () => {
    if (loading) {
      return 'Loading...';
    }
    if (project.betaApproved) {
      return (
        <div>
          <p>Under Review</p>
          {project.display_name}
        </div>
      );
    }
    return project.display_name;
  };

  const renderProjectLinks = (urls) => {
    const sortedUrls = partition(urls, (url => !url.path));
    const joinedSortedUrls = sortedUrls[0].concat(sortedUrls[1]);
    return (
      joinedSortedUrls.map(link => {
        let label = '';
        let iconForLabel;
        if (!link.label) {
          Object.keys(SOCIAL_ICONS).forEach(root => {
            const icon = SOCIAL_ICONS[root];
            if (link.url.indexOf(root) !== -1) {
              iconForLabel = icon;
              return iconForLabel;
            }
          });
          label = <i className={`fa fa-${iconForLabel} fa-fw fa-2x`} />;
          return (
            <a
              key={link.label}
              href={link.url}
              className={classnames({
                'tabbed-content-tab': true,
                'social-icon': iconForLabel !== null
              })}
              target={`${project.id}${link.url}`}
            >
              {label}
            </a>
          );
        }
        label = <i className={`fa fa-${iconForLabel} fa-fw fa-2x`} />;
        return (
          <a
            key={link.url}
            href={link.url}
            className={classnames({
              'tabbed-content-tab': true,
              'social-icon': iconForLabel !== null
            })}
            target={`${project.id}${link.url}`}
          >
            {link.label}
          </a>
        );
      })
    );
  };

  const renderRouterIndex = () => {
    const avatarClasses = classnames('tabbed-content-tab', {
      'beta-approved': project.beta_approved
    });
    return (
      project.redirect ?
      <a
        href={project.redirect}
        className="tabbed-content-tab"
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit {project.display_name}
      </a> :
      <IndexLink
        to={projectPath}
        activeClassName="active"
        className={avatarClasses}
        onClick={logClick('project.nav.home')}
      >
        {renderAvatar()}
        {renderProjectName()}
      </IndexLink>
    );
  };

  return (
    <nav className="project-nav tabbed-content-tabs">
      {renderRouterIndex()}
      <br className="responsive-break" />
      {renderAboutTab()}
      {renderClassifyTab()}
      <Link
        to={`${projectPath}/talk`}
        activeClassName="active"
        className="tabbed-content-tab"
        onClick={logClick('project.nav.classify')}
      >
        <Translate content="project.nav.talk" />
      </Link>

      <Link
        to={`${projectPath}/collections`}
        activeClassName="active"
        className={collectClasses}
      >
        <Translate content="project.nav.collections" />
      </Link>
      {renderRecents()}
      {renderLabTab()}
      {renderAdminTab()}
      {renderProjectLinks(project.urls)}
    </nav>
  );
};

ProjectNavbar.defaultProps = {
  loading: false,
  project: null,
  projectAvatar: null,
  projectRoles: [],
  routes: [],
  user: null,
  workflow: null
};

ProjectNavbar.contextTypes = {
  geordi: PropTypes.object
};

ProjectNavbar.propTypes = {
  loading: PropTypes.bool,
  project: PropTypes.shape({
    id: PropTypes.string,
    display_name: PropTypes.string,
    slug: PropTypes.string
  }),
  projectAvatar: PropTypes.shape({
    src: PropTypes.string
  }),
  projectRoles: PropTypes.array,
  user: PropTypes.shape({
    id: PropTypes.string
  }),
  routes: PropTypes.array,
  workflow: PropTypes.shape({
    id: PropTypes.string
  }),
};

export default ProjectNavbar;
