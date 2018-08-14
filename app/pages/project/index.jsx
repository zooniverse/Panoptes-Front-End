/*
 * decaffeinate suggestions:
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import apiClient from 'panoptes-client/lib/api-client';
import { Split } from 'seven-ten';
import counterpart from 'counterpart';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as translationActions from '../../redux/ducks/translations';
import ProjectPage from './project-page';
import ProjectTranslations from './project-translations';
import WorkflowSelection from './workflow-selection';
import getAllLinked from '../../lib/get-all-linked';

counterpart.registerTranslations('en', require('../../locales/en').default);
counterpart.registerTranslations('it', require('../../locales/it').default);
counterpart.registerTranslations('es', require('../../locales/es').default);
counterpart.registerTranslations('nl', require('../../locales/nl').default);

counterpart.setFallbackLocale('en');


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
      splits: null
    };
  }

  componentWillMount() {
    const { actions } = this.props;
    if (this.props.location.query.language) {
      actions.translations.setLocale(this.props.location.query.language);
    }
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

  componentDidUpdate(prevProps) {
    const { actions, translations } = this.props;
    const { project, guide, pages } = this.state;
    const { locale } = translations;
    if (project && (locale !== prevProps.translations.locale)) {
      actions.translations.load('project', project.id, locale);
      actions.translations.loadTranslations('project_page', pages.map(page => page.id), locale);
      if (guide) {
        actions.translations.load('field_guide', guide.id, locale);
      }
    }
  }

  componentWillUnmount() {
    Split.clear();
  }

  setupSplits(slug, user) {
    if (user) {
      return Split.load(slug)
      .then((splits) => {
        if (!splits) {
          return null;
        }
        if (this.context.geordi) {
          Object.keys(splits).forEach((split) => {
            let notFound = true;
            // log the first active split and skip the remaining splits
            if (notFound && splits[split].state === 'active') {
              notFound = false;
              const experiment = splits[split].name;
              const cohort = splits[split].variant ? splits[split].variant.name : undefined;
              this.context.geordi.remember({ experiment, cohort });
            }
          });
        }
        return splits;
      });
    } else {
      Split.clear();
      return null;
      if (this.context.geordi) {
        this.context.geordi.forget(['experiment', 'cohort']);
      }
    }
  }

  getUserProjectPreferences(project, user) {
    this.listenToProjectPreferences(null);

    const userPreferences = user ?
      user.get('project_preferences', { project_id: project.id })
        .then(([projectPreferences]) => {
          let newPreferences;
          return projectPreferences ||
            (newPreferences = apiClient.type('project_preferences').create({
              links: {
                project: project.id
              },
              preferences: {}
            })
            .save()
            .catch((error) => {
              console.warn(error.message);
            }));
        })
    :
      Promise.resolve(apiClient.type('project_preferences').create({
        id: 'GUEST_PREFERENCES_DO_NOT_SAVE',
        links: {
          project: project.id
        },
        preferences: {}}));

    return userPreferences
      .then((projectPreferences) => {
        this.listenToProjectPreferences(projectPreferences);
        return projectPreferences;
      })
      .catch((error) => {
        console.warn(error.message);
      });
  }

  fetchProjectData(ownerName, projectName, user) {
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
          // Use apiClient with cached resources from include to get out of cache
          let awaitOrganization;
          const awaitBackground = apiClient.type('backgrounds').get(project.links.background.id)
          .catch(error => {
            if (error.status === 404) { return { src: '' }; } else { return console.error(error); }
          });

          if (project.links && project.links.organization) {
            awaitOrganization = project.get('organization', { listed: true })
              .catch(error => [])
              .then(response => (response && response.display_name) ? response : null);
          } else {
            awaitOrganization = Promise.resolve(null);
          }

          const awaitOwner = apiClient.type('users').get(project.links.owner.id).catch(error => console.error(error));

          const awaitPages = project.get('pages').catch(error => []); // does not appear in project links?

          const awaitProjectAvatar = apiClient.type('avatars').get(project.links.avatar.id).catch(error => null);

          const awaitProjectCompleteness = Promise.resolve(project.completeness === 1.0);

          const awaitProjectRoles = getAllLinked(project, 'project_roles').catch(error => console.error(error));

          const awaitProjectPreferences = this.getUserProjectPreferences(project, user);

          const awaitSplits = this.setupSplits(slug, user)

          const awaitTranslation = this.props.actions.translations.load('project', project.id, this.props.translations.locale);

          Promise.all([
            awaitBackground,
            awaitOrganization,
            awaitOwner,
            awaitPages,
            awaitProjectAvatar,
            awaitProjectCompleteness,
            awaitProjectRoles,
            awaitProjectPreferences,
            awaitSplits,
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
            this.loadFieldGuide(project.id);
            this.props.actions.translations.loadTranslations('project_page', pages.map(page => page.id), this.props.translations.locale);
            return { projectPreferences, splits };
          })
          .then(({ projectPreferences, splits }) => {
            this.handleSplitWorkflowAssignment(projectPreferences, splits);
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
    this.listenToProjectPreferences(null);

    if (user) {
      return user.get('project_preferences', { project_id: project.id })
        .then(([projectPreferences]) => {
          this.setState({ projectPreferences });
          this.listenToProjectPreferences(projectPreferences);
        })
        .catch((error) => {
          console.warn(error.message);
        });
    } else {
      return Promise.resolve();
    }
  }

  listenToProjectPreferences(projectPreferences) {
    if (this._listenedToProjectPreferences) {
      this._listenedToProjectPreferences.stopListening('change', this._boundForceUpdate);
    }
    if (projectPreferences) {
      projectPreferences.listen('change', this._boundForceUpdate);
    }
    this._listenedToProjectPreferences = projectPreferences;
  }

  loadFieldGuide(projectId) {
    return apiClient.type('field_guides').get({ project_id: projectId })
    .then(([guide]) => {
      this.setState({ guide });
      if (guide && guide.id) {
        const { actions, translations } = this.props;
        actions.translations.load('field_guide', guide.id, translations.locale);
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

  handleSplitWorkflowAssignment(projectPreferences, splits) {
    if (splits && splits['workflow.assignment']) {
      const projectSetWorkflow = (splits['workflow.assignment'].variant
        && splits['workflow.assignment'].variant.value
        && splits['workflow.assignment'].variant.value.workflow_id)
          ? splits['workflow.assignment'].variant.value.workflow_id
          : '';

      const userSelectedWorkflow = (projectPreferences.preferences && projectPreferences.preferences.selected_workflow)
        ? projectPreferences.preferences.selected_workflow
        : '';

      if (splits['workflow.assignment'].variant.value.only_new_users) {
        const newToProject = Object.keys(projectPreferences.preferences).length === 0;
        if (newToProject) this.handleProjectPreferencesChange('settings.workflow_id', projectSetWorkflow);
      } else {
        this.handleProjectPreferencesChange('settings.workflow_id', projectSetWorkflow);

        if (userSelectedWorkflow && projectSetWorkflow &&
          userSelectedWorkflow !== projectSetWorkflow) {
            // if split is not only for new users
            // clear the user selected workflow if defined
            this.handleProjectPreferencesChange('preferences.selected_workflow', undefined)
        }
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
          <ProjectTranslations
            project={this.state.project}
          >
            <WorkflowSelection
              actions={this.props.actions}
              location={this.props.location}
              preferences={this.state.projectPreferences}
              project={this.state.project}
              projectRoles={this.state.projectRoles}
              translations={this.props.translations}
              user={this.props.user}
              onChangePreferences={this.handleProjectPreferencesChange.bind(this)}
            >
              <ProjectPage
                {...this.props}
                background={this.state.background}
                guide={this.state.guide}
                guideIcons={this.state.guideIcons}
                loading={this.state.loading}
                onChangePreferences={this.handleProjectPreferencesChange.bind(this)}
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
              />
            </WorkflowSelection>
          </ProjectTranslations>
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
      load: PropTypes.func,
      loadTranslations: PropTypes.func
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
      load: () => null,
      loadTranslations: () => null
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
  translations: state.translations
});

const mapDispatchToProps = dispatch => ({
  actions: {
    translations: bindActionCreators(translationActions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(ProjectPageController);
export { ProjectPageController };
