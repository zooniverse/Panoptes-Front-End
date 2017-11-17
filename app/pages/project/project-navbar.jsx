import React from 'react';
import Translate from 'react-translate-component';
import { IndexLink, Link } from 'react-router';
import classnames from 'classnames';
import partition from 'lodash/partition';
import SOCIAL_ICONS from '../../lib/social-icons';
import Thumbnail from '../../components/thumbnail';
import isAdmin from '../../lib/is-admin';

// constants
const AVATAR_SIZE = 100;

function HomeTab({ project, projectPath, translation, onClick, children }) {
  const avatarClasses = classnames('tabbed-content-tab', {
    '`beta`-approved': project
  });
  return (
    project.redirect ?
    <a
      href={project.redirect}
      className="tabbed-content-tab"
      target="_blank"
      rel="noopener noreferrer"
    >
      Visit {translation.display_name}
    </a> :
    <IndexLink
      to={projectPath}
      activeClassName="active"
      className={avatarClasses}
      onClick={onClick}
    >
      {children}
    </IndexLink>
  );
}

function AboutTab({ project, projectPath, onClick}) {
  if (!project.redirect) {
    return (
      <Link
        to={`${projectPath}/about`}
        activeClassName="active"
        className="tabbed-content-tab"
        onClick={onClick}
      >
        <Translate content="project.nav.about" />
      </Link>
    );
  }
};

function RecentsTab({ projectPath, user }) {
  return (
    user ?
    <Link
      to={`${projectPath}/recents`}
      activeClassName="active"
      className="tabbed-content-tab"
    >
      <Translate content="project.nav.recents" />
    </Link> :
    null
  );
};

function AdminTab({ project }) {
  const adminPath = `/admin/project_status/${project.slug}`;
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
}

function LabTab({ project, projectRoles, user }) {
  const labPath = `/lab/${project.id}`;

  function userHasLabAccess() {
    return projectRoles.some(role => {
      if (role.links.owner.id === user.id) {
        return role.roles.includes('owner') || role.roles.includes('collaborator');
      }
    });
  }

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
}

const ProjectNavbar = ({
  loading,
  project,
  projectAvatar,
  projectRoles,
  routes,
  translation,
  user,
  workflow
}, context) => {
  const { path } = routes[2] ? routes[2] : '';
  const projectPath = `/projects/${project.slug}`;
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

  const ClassifyTab = () => {
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
    if (project.beta_approved) {
      return (
        <div>
          <p>Under Review</p>
          {translation.display_name}
        </div>
      );
    }
    return translation.display_name;
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
              key={link.url}
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

  return (
    <nav className="project-nav tabbed-content-tabs">
      <HomeTab
        project={project}
        projectPath={projectPath}
        translation={translation}
        onClick={logClick('project.nav.home')}
      >
        {renderAvatar()}
        {renderProjectName()}
      </HomeTab>
      <br className="responsive-break" />
      <AboutTab
        project={project}
        projectPath={projectPath}
        onClick={logClick('project.nav.about')}
      />
      <ClassifyTab />
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
      <RecentsTab
        projectPath={projectPath}
        user={user}
      />
      <LabTab
        project={project}
        projectRoles={projectRoles}
        user={user}
      />
      <AdminTab
        project={project}
      />
      {renderProjectLinks(project.urls)}
    </nav>
  );
};

ProjectNavbar.defaultProps = {
  loading: false,
  project: {
    id: '',
    display_name: '',
    redirect: '',
    slug: ''
  },
  projectAvatar: null,
  projectRoles: [],
  routes: [],
  translation: {
    id: '',
    display_name: ''
  },
  user: null,
  workflow: null
};

ProjectNavbar.contextTypes = {
  geordi: React.PropTypes.object
};

ProjectNavbar.propTypes = {
  loading: React.PropTypes.bool,
  project: React.PropTypes.shape({
    id: React.PropTypes.string,
    display_name: React.PropTypes.string,
    slug: React.PropTypes.string
  }),
  projectAvatar: React.PropTypes.shape({
    src: React.PropTypes.string
  }),
  projectRoles: React.PropTypes.array,
  user: React.PropTypes.shape({
    id: React.PropTypes.string
  }),
  routes: React.PropTypes.array,
  translation: React.PropTypes.shape({
    display_name: React.PropTypes.string
  }),
  workflow: React.PropTypes.shape({
    id: React.PropTypes.string
  })
};

export default ProjectNavbar;
