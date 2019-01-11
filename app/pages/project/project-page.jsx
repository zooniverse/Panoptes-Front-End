import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Markdown } from 'markdownz';
import ProjectNavbar from './components/ProjectNavbar';
import FieldGuideContainer from './field-guide-container';
import ProjectHomeContainer from './home/';

export default class ProjectPage extends React.Component {
  componentDidMount() {
    this.context.geordi && this.context.geordi.remember({ projectToken: this.props.project.slug });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project !== this.props.project) {
      this.context.geordi && this.context.geordi.remember({ projectToken: nextProps.project.slug });
    }
  }

  componentWillUnmount() {
    this.context.geordi && this.context.geordi.forget(['projectToken']);
  }

  render() {
    const containerClassNames = classNames({
      'project-page': true,
      'rtl': this.props.translations.rtl
    });

    return (
      <div
        lang={this.props.translations.locale}
        className={containerClassNames}
      >
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
        />
        {(this.props.project.configuration && this.props.project.configuration.announcement) &&
          <div className="informational project-announcement-banner">
            <Markdown>
              {this.props.project.configuration.announcement}
            </Markdown>
          </div>}
        {React.cloneElement(this.props.children, {
          background: this.props.background,
          onChangePreferences: this.props.onChangePreferences,
          organization: this.props.organization,
          owner: this.props.owner,
          pages: this.props.pages,
          preferences: this.props.preferences,
          project: this.props.project,
          projectAvatar: this.props.projectAvatar,
          projectIsComplete: this.props.projectIsComplete,
          projectRoles: this.props.projectRoles,
          requestUserProjectPreferences: this.props.requestUserProjectPreferences,
          splits: this.props.splits,
          translation: this.props.translation,
          user: this.props.user,
          workflow: this.props.workflow
        })}
        {React.Children.only(this.props.children).type !== ProjectHomeContainer &&
          <FieldGuideContainer
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
  translations: {
    locale: 'en',
    rtl: false
  },
  user: null,
  workflow: null
};

ProjectPage.contextTypes = {
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
  translations: PropTypes.shape({
    locale: PropTypes.string,
    rtl: PropTypes.bool
  }),
  workflow: PropTypes.shape({
    id: PropTypes.string
  })
};
