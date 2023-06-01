/*
 * decaffeinate suggestions:
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { captureException, withScope } from '@sentry/browser';
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import apiClient from 'panoptes-client/lib/api-client';
import counterpart from 'counterpart';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as interventionActions from '../../redux/ducks/interventions';
import * as translationActions from '../../redux/ducks/translations';
import ProjectPage from './project-page';
import Translations from '../../classifier/translations';
import getAllLinked from '../../lib/get-all-linked';
import isAdmin from '../../lib/is-admin';

/**
  Send exceptions and React error info to Sentry
*/
function logToSentry(error, info) {
  withScope((scope) => {
    Object.keys(info).forEach((key) => {
      scope.setExtra(key, info[key]);
    });
    captureException(error);
  });
}

class ProjectPageController extends React.Component {
  constructor() {
    super();
    this._listenedToProjectPreferences = null;
    this._boundForceUpdate = null;
    this.state = {
      background: null,
      error: null,
      guide: null,
      guideIcons: {},
      loading: false,
      organization: null,
      owner: null,
      projectPreferences: null,
      project: null,
      projectAvatar: null,
      projectIsComplete: false,
      projectRoles: null,
      ready: false,
      splits: {}
    };
  }

  componentDidMount() {
    this._boundForceUpdate = this.forceUpdate.bind(this);
    if (this.context.initialLoadComplete) {
      this.fetchProjectData(this.props.params.owner, this.props.params.name, this.props.user);
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { owner, name } = nextProps.params;
    const pathChanged = (owner !== this.props.params.owner) || (name !== this.props.params.name);
    const userChanged = nextContext.initialLoadComplete && (nextProps.user !== this.props.user);
    const initialLoadCompleted = nextContext.initialLoadComplete === !this.context.initialLoadComplete;

    // Wait until we know if there's a user
    if (pathChanged || userChanged || (initialLoadCompleted && (this.state.project === null))) {
      if (!this.state.loading) {
        this.fetchProjectData(owner, name, nextProps.user);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { actions, translations } = this.props;
    const { project, guide, pages } = this.state;
    const { locale } = translations;
    if (project && pages && (locale !== prevProps.translations.locale)) {
      actions.translations.load('project', project.id, locale);
      actions.translations.load('project_page', pages.map(page => page.id), locale);
      if (guide) {
        actions.translations.load('field_guide', guide.id, locale);
      }
    }
    if (project && project !== prevState.project) {
      actions.interventions.subscribe(`project-${project.id}`);
      if (prevState.project) {
        actions.interventions.unsubscribe(`project-${prevState.project.id}`);
      }
    }
  }

  componentWillUnmount() {
    const { actions } = this.props;
    const { project } = this.state;
    if (project) {
      actions.interventions.unsubscribe(`project-${this.state.project.id}`);
    }
  }

  componentDidCatch(error, info) {
    console.log(error, info);
    logToSentry(error, info);
    const loading = false;
    const ready = false;
    this.setState({ error, info, loading, ready });
  }

  getUserProjectPreferences(project, user) {
    const userPreferences = user ?
      user.get('project_preferences', { project_id: project.id })
        .then(([projectPreferences]) => {
          if (projectPreferences) {
            return projectPreferences;
          } else {
            return apiClient.type('project_preferences').create({
              links: {
                project: project.id
              },
              preferences: {}
            })
            .save();
          }
        })
    :
      Promise.resolve(null);

    return userPreferences
      .catch((error) => {
        console.warn(error.message);
        return null;
      });
  }

  fetchProjectData(ownerName, projectName, user) {
    const { actions, location, params } = this.props
    this.setState({
      error: null,
      loading: true,
      projectPreferences: null
    });

    const slug = `${ownerName}/${projectName}`;

    return apiClient.type('projects').get({ slug, include: 'avatar,background,owners' })
      .then(([project]) => {
        this.setState({ project });

        if (project) {
          let locale = project.primary_language
          if (params.locale) {
            locale = params.locale
          }
          if (location.query.language) {
            locale = location.query.language;
          }
          actions.translations.setLocale(locale);
          // Use apiClient with cached resources from include to get out of cache
          let awaitOrganization;
          const awaitBackground = apiClient.type('backgrounds').get(project.links.background.id)
          .catch(error => {
            if (error.status === 404) { return { src: '' }; } else { return console.error(error); }
          });

          if (project.links?.organization) {
            const query = isAdmin() ? null : { listed: true }
            awaitOrganization = project.get('organization', query)
              .catch(error => null);
          } else {
            awaitOrganization = Promise.resolve(null);
          }

          const awaitOwner = apiClient.type('users').get(project.links.owner.id).catch(error => console.error(error));

          const awaitPages = project.get('pages').catch(error => []); // does not appear in project links?

          const awaitProjectAvatar = apiClient.type('avatars').get(project.links.avatar.id).catch(error => null);

          const awaitProjectCompleteness = Promise.resolve(project.completeness === 1.0);

          const awaitProjectRoles = getAllLinked(project, 'project_roles').catch(error => console.error(error));

          const awaitProjectPreferences = this.getUserProjectPreferences(project, user);

          const awaitTranslation = actions.translations.load('project', project.id, locale);

          Promise.all([
            awaitBackground,
            awaitOrganization,
            awaitOwner,
            awaitPages,
            awaitProjectAvatar,
            awaitProjectCompleteness,
            awaitProjectRoles,
            awaitProjectPreferences,
            awaitTranslation
          ])
          .then(([
            background,
            organization,
            owner,
            pages,
            projectAvatar,
            projectIsComplete,
            projectRoles,
            projectPreferences,
            splits
          ]) => {
            const ready = true;
            this.setState({ background, organization, owner, pages, projectAvatar, projectIsComplete, projectRoles, projectPreferences, splits });
            this.loadFieldGuide(project.id, locale);
            actions.translations.load('project_page', pages.map(page => page.id), locale);
            return { project, projectPreferences, splits };
          })
          .then(() => {
            this.setState({ ready: true })
          })
          .catch((error) => {
            this.setState({ error });
            console.error(error);
          });
        } else {
          this.setState({
            background: null,
            error: new Error('NOT_FOUND'),
            organization: null,
            owner: null,
            pages: null,
            projectPreferences: null,
            projectAvatar: null,
            projectIsComplete: false,
            projectRoles: null,
            workflow: null
          });
        }
    })
    .catch((error) => {
      this.setState({ error });
    })
    .then(() => {
      this.setState({ loading: false });
    });
  }

  requestUserProjectPreferences(project, user) {

    if (user) {
      return user.get('project_preferences', { project_id: project.id })
        .then(([projectPreferences]) => {
          this.setState({ projectPreferences });
        })
        .catch((error) => {
          console.warn(error.message);
        });
    } else {
      return Promise.resolve();
    }
  }

  loadFieldGuide(projectId, locale) {
    return apiClient.type('field_guides').get({ project_id: projectId })
    .then(([guide]) => {
      this.setState({ guide });
      if (guide && guide.id) {
        const { actions, translations } = this.props;
        actions.translations.load('field_guide', guide.id, locale);
        getAllLinked(guide, 'attached_images')
        .then((images) => {
          const guideIcons = {};
          images.map(image => guideIcons[image.id] = image);
          this.setState({ guideIcons });
        });
      }
    });
  }

  handleProjectPreferencesChange(key, value) {
    const changes = {};
    changes[key] = value;
    const { projectPreferences } = this.state;
    if (projectPreferences) {
      projectPreferences.update(changes);
      this.setState({ projectPreferences });
      if (this.props.user) {
        projectPreferences.save();
      }
    }
  }

  render() {
    const slug = `${this.props.params.owner}/${this.props.params.name}`;
    const betaApproved = this.state.project ? this.state.project.beta_approved : undefined;
    const launchApproved = this.state.project ? this.state.project.launch_approved : undefined;
    const displayName = this.state.project ? this.state.project.display_name : undefined;
    const title = displayName || counterpart('loading');

    return (
      <div className="project-page-wrapper">
        <Helmet title={title} />
        {(!launchApproved && betaApproved) ?
          <div className="beta-border" /> : undefined}

        {!!this.state.ready &&
          <Translations
            original={this.state.project}
            type="project"
          >
            <ProjectPage
              {...this.props}
              background={this.state.background}
              guide={this.state.guide}
              guideIcons={this.state.guideIcons}
              loading={this.state.loading}
              organization={this.state.organization}
              owner={this.state.owner}
              pages={this.state.pages}
              preferences={this.state.projectPreferences}
              project={this.state.project}
              projectAvatar={this.state.projectAvatar}
              projectIsComplete={this.state.projectIsComplete}
              projectRoles={this.state.projectRoles}
              requestUserProjectPreferences={this.requestUserProjectPreferences.bind(this)}
              splits={this.state.splits}
              workflow={this.props.workflow}
            />
          </Translations>
        }
        {!!this.state.loading &&
          <div className="content-container">
            <p>
              Loading{' '}
              <strong>{slug}</strong>...
            </p>
          </div>
        }
        {!!this.state.error &&
          ((this.state.error.message === 'NOT_FOUND') ?
            <div className="content-container">
              <p>Project <code>{slug}</code> not found.</p>
              <p>If you are sure the URL is correct, you might not have permission to view this project.</p>
            </div> :
            <div className="content-container">
              <p>
                There was an error retrieving project{' '}
                <strong>{slug}</strong>.
              </p>
              <p>
                <code>{this.state.error.message}</code>
                {!!this.state.info && <pre>{this.state.info.componentStack}</pre>}
              </p>
            </div>
          )
        }
      </div>
    );
  }
}

ProjectPageController.contextTypes = {
  geordi: PropTypes.object,
  initialLoadComplete: PropTypes.bool,
  router: PropTypes.object.isRequired
};

ProjectPageController.propTypes = {
  actions: PropTypes.shape({
    translations: PropTypes.shape({
      load: PropTypes.func
    })
  }).isRequired,
  location: PropTypes.shape({
    query: PropTypes.shape({
      language: PropTypes.string
    })
  }),
  params: PropTypes.shape({
    name: PropTypes.string,
    owner: PropTypes.string
  }).isRequired,
  translations: PropTypes.shape({
    locale: PropTypes.string
  }),
  user: PropTypes.shape({})
};

ProjectPageController.defaultProps = {
  actions: {
    translations: {
      load: () => null
    }
  },
  location: {
    query: {}
  },
  params: {},
  translations: {},
  user: null
};

const mapStateToProps = state => ({
  interventions: state.interventions,
  translations: state.translations,
  workflow: state.classify.workflow
});

const mapDispatchToProps = dispatch => ({
  actions: {
    interventions: bindActionCreators(interventionActions, dispatch),
    translations: bindActionCreators(translationActions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectPageController);
export { ProjectPageController };
