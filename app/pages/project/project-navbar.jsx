import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import { IndexLink, Link } from 'react-router';
import classnames from 'classnames';
import SOCIAL_ICONS from '../../lib/social-icons';
import Thumbnail from '../../components/thumbnail';
import isAdmin from '../../lib/is-admin';

// constants
const AVATAR_SIZE = 100;

function Avatar({ projectAvatar }) {
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
}

function ProjectName({ loading, project, translation }) {
  if (loading) {
    return <span>Loading…</span>;
  }
  if (project.launch_approved) {
    return (
      <span>
        {translation.display_name}
        <span className="checkmark-stack fa-stack" aria-label="Zooniverse Approved" title="Zooniverse Approved" role="img">
          <i className="fa fa-circle fa-stack-2x" />
          <i className="fa fa-check fa-stack-1x checkmark-stack__checkmark" />
        </span>
      </span>
    );
  }
  if (project.beta_approved) {
    return (
      <div className="project-name">
        {translation.display_name}
        <small className="project-name__under-review">Under Review</small>
      </div>
    );
  }
  return <span>{translation.display_name}</span>;
}

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
  return (
    project.redirect ?
    null :
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

function ClassifyLink({ projectPath, workflow, onClick }) {
  const opacity = {
    opacity: 0.5
  };
  return (
    workflow ?
      <Link
        to={`${projectPath}/classify`}
        activeClassName="active"
        className="classify tabbed-content-tab"
        onClick={onClick}
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
}

function ClassifyTab({ project, projectPath, workflow, onClick }) {
  function redirectClassifyLink(redirect) {
    return `${redirect}/classify`;
  }
  return (
    (project.redirect) ?
      <a
        href={redirectClassifyLink(project.redirect)}
        className="tabbed-content-tab"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
      >
        <Translate content="project.nav.classify" />
      </a> :
      <ClassifyLink
        projectPath={projectPath}
        workflow={workflow}
        onClick={onClick}
      />
  );
}

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
}

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

function OrgTab({ organization }) {
  return (
    organization ?
      <Link
        to={`/organizations/${organization.slug}`}
        className="tabbed-content-tab"
      >
        {organization.display_name}
        {' '}
        <i className="fa fa-external-link fa-fw" />
      </Link> :
      null
  );
}

function ExternalLinks({ project }) {
  if (project.urls) {
    const externalLinks = project.urls.filter(url => !url.path);

    if (externalLinks && (externalLinks.length > 0)) {
      return (
        <span>
          {externalLinks.map(link =>
            <a
              key={link.url}
              href={link.url}
              className="tabbed-content-tab"
              target={`${project.id}${link.url}`}
            >
              {link.label}
              {' '}
              <i className="fa fa-external-link fa-fw" />
            </a>
          )}
        </span>
      );
    }
    return null;
  }
  return null;
}

function SocialLinks({ project }) {
  if (project.urls) {
    const socialLinks = project.urls.filter(url => url.path);

    if (socialLinks && (socialLinks.length > 0)) {
      return (
        <span>
          {socialLinks.map((link) => {
            let icon = 'external-link';
            if (Object.keys(SOCIAL_ICONS).indexOf(link.site) !== -1) {
              icon = SOCIAL_ICONS[link.site];
            }
            return (
              <a
                key={link.url}
                href={link.url}
                className="tabbed-content-tab social-icon"
                target={`${project.id}${link.url}`}
              >
                <i className={`fa fa-${icon} fa-fw fa-2x`} />
              </a>);
          })}
        </span>);
    }
    return null;
  }
  return null;
}

const ProjectNavbar = ({
  loading,
  organization,
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
    active: activeElement
  });

  // helpers
  const logClick = () => {
    if (context && context.geordi) {
      return context.geordi.makeHandler('project-menu');
    }
  };

  return (
    <nav className="project-nav tabbed-content-tabs">
      <HomeTab
        project={project}
        projectPath={projectPath}
        translation={translation}
        onClick={logClick('project.nav.home')}
      >
        <Avatar
          projectAvatar={projectAvatar}
        />
        <ProjectName
          loading={loading}
          project={project}
          translation={translation}
        />
      </HomeTab>
      <br className="responsive-break" />

      <AboutTab
        project={project}
        projectPath={projectPath}
        onClick={logClick('project.nav.about')}
      />

      <ClassifyTab
        project={project}
        projectPath={projectPath}
        workflow={workflow}
        onClick={logClick('project.nav.classify')}
      />

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
      <OrgTab
        organization={organization}
      />
      <ExternalLinks
        project={project}
      />
      <SocialLinks
        project={project}
      />
    </nav>
  );
};

ProjectNavbar.defaultProps = {
  loading: false,
  organization: null,
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
  geordi: PropTypes.object
};

ProjectNavbar.propTypes = {
  loading: PropTypes.bool,
  organization: PropTypes.shape({
    display_name: PropTypes.string,
    slug: PropTypes.string
  }),
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
  translation: PropTypes.shape({
    display_name: PropTypes.string
  }),
  workflow: PropTypes.shape({
    id: PropTypes.string
  })
};

export default ProjectNavbar;
