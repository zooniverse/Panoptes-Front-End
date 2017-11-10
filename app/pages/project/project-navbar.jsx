import React, { Component, PropTypes } from 'react';
import Translate from 'react-translate-component';
import { IndexLink, Link } from 'react-router';
import classnames from 'classnames';
import partition from 'lodash/partition';
import SOCIAL_ICONS from '../../lib/social-icons';
import Thumbnail from '../../components/thumbnail';

// constants
const AVATAR_SIZE = 100;

export default class ProjectNavbar extends Component {
  constructor() {
    super();
    this.checkWorkflow = this.checkWorkflow.bind(this);
    this.logClick = this.logClick.bind(this);
    this.redirectClassifyLink = this.redirectClassifyLink.bind(this);
    this.renderAvatar = this.renderAvatar.bind(this);
    this.renderProjectName = this.renderProjectName.bind(this);
    this.renderProjectLinks = this.renderProjectLinks.bind(this);
    this.renderAboutTab = this.renderAboutTab.bind(this);
    this.renderClassifyTab = this.renderClassifyTab.bind(this);
    this.renderRouterIndex = this.renderRouterIndex.bind(this);
  }

  checkWorkflow(projectPath, workflow) {
    const opacity = {
      opacity: 0.5
    };
    return (
      workflow ?
        <Link
          to={`${projectPath}/classify`}
          activeClassName="active"
          className="classify tabbed-content-tab"
          onClick={this.logClick('project.nav.classify')}
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

  logClick() {
    if (this.context && this.context.geordi) {
      return context.geordi.makeHandler('project-menu');
    }
  }
  renderAboutTab(project, projectPath) {
    if (!project.redirect) {
      return (
        <Link
          to={`${projectPath}/about`}
          activeClassName="active"
          className="tabbed-content-tab"
          onClick={this.logClick('project.nav.about')}
        >
          <Translate content="project.nav.about" />
        </Link>
      );
    }
  }

  renderAvatar(projectAvatar) {
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

  redirectClassifyLink(redirect) {
    return `${redirect.replace(/\/?#?\/+$/, '')}/#/classify`;
  }

  renderClassifyTab(projectPath, project, workflow) {
    return (
      (project.redirect) ?
      <a
        href={this.redirectClassifyLink(project.redirect)}
        className="tabbed-content-tab"
        target="_blank"
        rel="noopener noreferrer"
        onClick={this.logClick('project.nav.classify')}
      >
        <Translate content="project.nav.classify" />
      </a> :
      this.checkWorkflow(projectPath, workflow)
    );
  }

  renderProjectName(project, loading) {
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
  }

  renderProjectLinks(urls) {
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
              target={`${this.props.project.id}${link.url}`}
            >
              {label}
            </a>
          );
        }
        (iconForLabel != null) ? iconForLabel : iconForLabel = 'globe';
        label = <i className={`fa fa-${iconForLabel} fa-fw fa-2x`} />;
        return (
          <a
            key={link.url}
            href={link.url}
            className={classnames({
              'tabbed-content-tab': true,
              'social-icon': iconForLabel !== null
            })}
            target={`${this.props.project.id}${link.url}`}
          >
            {label}
          </a>
        );
      })
    );
  }

  renderRouterIndex(loading, project, projectAvatar, projectPath) {
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
        onClick={this.logClick('project.nav.home')}
      >
        {this.renderAvatar(projectAvatar)}
        {this.renderProjectName(project, loading)}
      </IndexLink>
    );
  }

  render() {
    const { loading, projectAvatar, project, routes, workflow } = this.props;
    const { path } = routes[2] ? routes[2] : '';
    const projectPath = project ? `/projects/${project.slug}` : '';
    const activeElement = project && (path === 'collections' || path === 'favorites');
    const collectClasses = classnames({
      'tabbed-content-tab': true,
      'active': activeElement
    });
    return (
      <nav className="project-nav tabbed-content-tabs">
        {this.renderRouterIndex(loading, project, projectAvatar, projectPath)}
        <br className="responsive-break" />
        {this.renderAboutTab(project, projectPath)}
        {this.renderClassifyTab(projectPath, project, workflow)}
        <Link
          to={`${projectPath}/talk`}
          activeClassName="active"
          className="tabbed-content-tab"
          onClick={this.logClick('project.nav.classify')}
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
        {this.renderProjectLinks(project.urls)}
      </nav>
    );
  }
}

ProjectNavbar.defaultProps = {
  loading: false,
  project: null,
  projectAvatar: null,
  routes: [],
  workflow: null
};

ProjectNavbar.childContextTypes = {
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
  routes: PropTypes.array,
  workflow: PropTypes.object
};
