/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
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
    this._listenedToPreferences = null;
    this._boundForceUpdate = null;
    this.state = {
      background: null,
      error: null,
      guide: null,
      guideIcons: {},
      loading: false,
      organization: null,
      owner: null,
      preferences: null,
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
    if (this.props.location.query.language) { return actions.translations.setLocale(this.props.location.query.language); }
  }

  componentDidMount() {
    this._boundForceUpdate = this.forceUpdate.bind(this);
    if (this.context.initialLoadComplete) { this.fetchProjectData(this.props.params.owner, this.props.params.name, this.props.user); }
    this.setupSplits();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { owner, name } = nextProps.params;
    const pathChanged = (owner !== this.props.params.owner) || (name !== this.props.params.name);
    const userChanged = nextContext.initialLoadComplete && (nextProps.user !== this.props.user);
    const initialLoadCompleted = nextContext.initialLoadComplete === !this.context.initialLoadComplete;

    // Wait until we know if there's a user
    if (pathChanged || userChanged || (initialLoadCompleted && (this.state.project === null))) {
      if (!this.state.loading) { this.fetchProjectData(owner, name, nextProps.user); }
      this.setupSplits(nextProps);
    }
  }

  componentWillUnmount() {
    Split.clear();
  }

  setupSplits(props) {
    if (props == null) { ({ props } = this); }
    const { user } = props;
    const { owner, name } = props.params;

    if (user) {
      return Split.load(`${owner}/${name}`)
      .then(splits => {
        this.setState({ splits });
        if (!splits) { return; }
        const result = [];
        for (let split in splits) {
          if (splits[split].state !== 'active') { continue; }
          if (this.context.geordi != null) {
            this.context.geordi.remember({experiment: splits[split].name});
          }
          if (this.context.geordi != null) {
            this.context.geordi.remember({ cohort: (splits[split].variant != null ? splits[split].variant.name : undefined) });
          }
          break;
        }
        return result;
      });
    } else {
      Split.clear();
      this.setState({ splits: null });
      (this.context.geordi != null ? this.context.geordi.forget(['experiment', 'cohort']) : undefined);
    }
  }

  fetchProjectData(ownerName, projectName, user) {
    this.setState({
      error: null,
      loading: true,
      preferences: null
    });

    const slug = `${ownerName}/${projectName}`;

    return apiClient.type('projects').get({ slug, include: 'avatar,background,owners' })
      .then(([project]) => {
        this.setState({ project });

        if (project != null) {
          // Use apiClient with cached resources from include to get out of cache
          let awaitOrganization;
          const awaitBackground = apiClient.type('backgrounds').get(project.links.background.id)
          .catch(error => {
            if (error.status === 404) { return { src: '' }; } else { return console.error(error); }
          });

          if ((project.links != null ? project.links.organization : undefined) != null) {
            awaitOrganization = project.get('organization', { listed: true })
              .catch(error => [])
              .then(response => (response != null ? response.display_name : undefined) ? response : null);
          } else {
            awaitOrganization = Promise.resolve(null);
          }

          const awaitOwner = apiClient.type('users').get(project.links.owner.id).catch(error => console.error(error));

          const awaitPages = project.get('pages').catch(error => []); // does not appear in project links?

          const awaitProjectAvatar = apiClient.type('avatars').get(project.links.avatar.id).catch(error => null);

          const awaitProjectCompleteness = Promise.resolve(project.completeness === 1.0);

          const awaitProjectRoles = getAllLinked(project, 'project_roles').catch(error => console.error(error));

          const awaitPreferences = this.getUserProjectPreferences(project, user);

          const awaitTranslation = this.props.actions.translations.load('project', project.id, this.props.translations.locale);

          Promise.all([
            awaitBackground,
            awaitOrganization,
            awaitOwner,
            awaitPages,
            awaitProjectAvatar,
            awaitProjectCompleteness,
            awaitProjectRoles,
            awaitPreferences,
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
            preferences
          ]) => {
            const ready = true;
            this.setState({ background, organization, owner, pages, projectAvatar, projectIsComplete, projectRoles, preferences, ready });
            this.loadFieldGuide(project.id);
            this.props.actions.translations.loadTranslations('project_page', pages.map(page => page.id), this.props.translations.locale);
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
            preferences: null,
            projectAvatar: null,
            projectIsComplete: false,
            projectRoles: null,
            workflow: null
          });
        }
    })
    .catch(error => {
      this.setState({ error });
    })
    .then(() => {
      this.setState({ loading: false });
    });
  }

  getUserProjectPreferences(project, user) {
    this.listenToPreferences(null);

    const userPreferences = (user != null) ?
      user.get('project_preferences', { project_id: project.id })
        .then(([preferences]) => {
          let newPreferences;
          return preferences != null ?
            preferences :
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
      .then((preferences) => {
        this.listenToPreferences(preferences);
        return preferences;
      })
      .catch((error) => {
        console.warn(error.message);
      });
  }

  requestUserProjectPreferences(project, user) {
    this.listenToPreferences(null);

    if (user != null) {
      return user.get('project_preferences', { project_id: project.id })
        .then(([preferences]) => {
          this.setState({ preferences });
          this.listenToPreferences(preferences);
        })
        .catch((error) => {
          console.warn(error.message);
        });
    } else {
      return Promise.resolve();
    }
  }

  listenToPreferences(preferences) {
    if (this._listenedToPreferences != null) {
      this._listenedToPreferences.stopListening('change', this._boundForceUpdate);
    }
    if (preferences != null) {
      preferences.listen('change', this._boundForceUpdate);
    }
    this._listenedToPreferences = preferences;
  }

  loadFieldGuide(projectId) {
    return apiClient.type('field_guides').get({ project_id: projectId })
    .then(([guide]) => {
      const { actions, translations } = this.props;
      this.setState({ guide });
      actions.translations.load('field_guide', guide != null ? guide.id : undefined, translations.locale);
      getAllLinked(guide, 'attached_images')
      .then((images) => {
        const guideIcons = {};
        images.map(image => guideIcons[image.id] = image);
        this.setState({ guideIcons });
      });
    });
  }

  handlePreferencesChange(key, value) {
    const changes = {};
    changes[key] = value;
    const { preferences } = this.state;
    if (preferences != null) {
      preferences.update(changes);
      this.setState({ preferences });
      if (this.props.user != null) {
        preferences.save();
      }
    }
  }

  render() {
    const slug = `${this.props.params.owner}/${this.props.params.name}`;
    const betaApproved = this.state.project != null ? this.state.project.beta_approved : undefined;
    const launchApproved = this.state.project != null ? this.state.project.launch_approved : undefined;

    return (
      <div className="project-page-wrapper">
        <Helmet title={`${(this.state.project != null ? this.state.project.display_name : undefined) != null ? (this.state.project != null ? this.state.project.display_name : undefined) : counterpart('loading')}`} />
        {(!launchApproved && betaApproved) ?
          <div className="beta-border"/> : undefined}

        {!!this.state.ready &&
          <ProjectTranslations
            project={this.state.project}
          >
            <WorkflowSelection
              actions={this.props.actions}
              location={this.props.location}
              preferences={this.state.preferences}
              project={this.state.project}
              projectRoles={this.state.projectRoles}
              translations={this.props.translations}
              user={this.props.user}
              onChangePreferences={this.handlePreferencesChange.bind(this)}
            >
              <ProjectPage
                {...this.props}
                background={this.state.background}
                guide={this.state.guide}
                guideIcons={this.state.guideIcons}
                loading={this.state.loading}
                onChangePreferences={this.handlePreferencesChange.bind(this)}
                organization={this.state.organization}
                owner={this.state.owner}
                pages={this.state.pages}
                preferences={this.state.preferences}
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
  params: PropTypes.object,
  user: PropTypes.object
};

ProjectPageController.defaultProps = {
  params: {},
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
