import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import { Markdown } from 'markdownz';
import { sugarClient } from 'panoptes-client/lib/sugar';
import ProjectNavbar from './components/ProjectNavbar';
import PotentialFieldGuide from './potential-field-guide';
import ProjectHomeContainer from './home/';

export default class ProjectPage extends React.Component {
  getChildContext() {
    return this.context.geordi;
  }

  componentDidMount() {
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
    let backgroundStyle = {};
    if (this.props.background) {
      backgroundStyle = {
        backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url('${this.props.background.src}')`
      };
    }

    return (
      <div className="project-page project-background" style={backgroundStyle}>
        <ProjectNavbar
          background={this.props.background}
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
        {(this.props.project.configuration && this.props.project.configuration.announcement) &&
          <div className="informational project-announcement-banner">
            <Markdown>
              {this.props.project.configuration.announcement}
            </Markdown>
          </div>}
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
        {React.Children.only(this.props.children).type !== ProjectHomeContainer &&
          <PotentialFieldGuide
            guide={this.props.guide}
            guideIcons={this.props.guideIcons}
          />}
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
  organization: PropTypes.object,
  pages: PropTypes.arrayOf(PropTypes.object),
  project: PropTypes.shape({
    configuration: PropTypes.shape({
      announcement: PropTypes.string
    }),
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
