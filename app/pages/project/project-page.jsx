import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import { Markdown } from 'markdownz';
import { sugarClient } from 'panoptes-client/lib/sugar';
import ProjectNavbar from './project-navbar';
import ProjectNavbarFacelift from './components/ProjectNavbar';
import PotentialFieldGuide from './potential-field-guide';

export default class ProjectPage extends React.Component {
  getChildContext() {
    return this.context.geordi;
  }

  componentDidMount() {
    document.documentElement.classList.add('on-project-page');
    this.updateSugarSubscription(this.props.project);
    this.context.geordi && this.context.geordi.remember({ projectToken: this.props.project.slug });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project !== this.props.project) {
      this.removeSugarSubscription(this.props.project);
      this.updateSugarSubscription(nextProps.project);
      this.context.geordi && this.context.geordi.remember({ projectToken: nextProps.project.slug });
    }
  }

  componentWillUnmount() {
    document.documentElement.classList.remove('on-project-page');
    this.removeSugarSubscription(this.props.project);
    this.context.geordi && this.context.geordi.forget(['projectToken']);
  }

  updateSugarSubscription(project) {
    sugarClient.subscribeTo(`project-${project.id}`);
  }

  removeSugarSubscription(project) {
    sugarClient.unsubscribeFrom(`project-${project.id}`);
  }

  render() {
    const projectPath = `/projects/${this.props.project.slug}`;
    const onHomePage = this.props.routes[2] && this.props.routes[2].path === undefined;
    const pages = this.props.pages.reduce((map, page) => {
      map[page.url_key] = page;
      return map;
    }, {});

    const announcement = (this.props.project.configuration && this.props.project.configuration.announcement) ?
      <div className="informational project-announcement-banner">
        <Markdown>
          {this.props.project.configuration.announcement}
        </Markdown>
      </div> :
      null;

    const navbarComponent = (this.props.location.query.facelift) ? ProjectNavbarFacelift : ProjectNavbar;
    const navBar = (!onHomePage) ?
      <div>
        <navbarComponent
          loading={this.props.loading}
          organization={this.props.organization}
          project={this.props.project}
          projectAvatar={this.props.projectAvatar}
          projectRoles={this.props.projectRoles}
          routes={this.props.routes}
          user={this.props.user}
          translation={this.props.translation}
          workflow={this.props.workflow}
        />
        {announcement}
      </div> :
      null;

    const launchApproved = (!this.props.project.launch_approved) ?
      <Translate
        component="p"
        className="project-disclaimer"
        content="project.disclaimer"
      /> :
      null;

    const potentialFieldGuide = (this.props.location.pathname !== projectPath) ?
      <PotentialFieldGuide
        guide={this.props.guide}
        guideIcons={this.props.guideIcons}
      /> :
      null;

    let backgroundStyle = {};
    if (this.props.background) {
      backgroundStyle = {
        backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url('${this.props.background.src}')`
      };
    }

    return (
      <div className="project-page project-background" style={backgroundStyle}>
        {navBar}
        {React.cloneElement(this.props.children, {
          background: this.props.background,
          loadingSelectedWorkflow: this.props.loadingSelectedWorkflow,
          onChangePreferences: this.props.onChangePreferences,
          organization: this.props.organization,
          owner: this.props.owner,
          pages: this.props.pages,
          preferences: this.props.preferences,
          project: this.props.project,
          projectAvatar: this.props.projectAvatar,
          projectIsComplete: this.props.projectIsComplete,
          projectRoles: this.props.projectRoles,
          splits: this.props.splits,
          translation: this.props.translation,
          user: this.props.user,
          workflow: this.props.workflow
        })}
        {launchApproved}
        {potentialFieldGuide}
      </div>
    );
  }
}

ProjectPage.defaultProps = {
  background: {
    src: ''
  },
  loading: false,
  location: {},
  organization: null,
  pages: [],
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

ProjectPage.childContextTypes = {
  geordi: PropTypes.object
};

ProjectPage.propTypes = {
  background: PropTypes.shape({
    src: PropTypes.string
  }),
  loading: PropTypes.bool,
  pages: PropTypes.arrayOf(PropTypes.object),
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