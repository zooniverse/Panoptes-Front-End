import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import apiClient from 'panoptes-client/lib/api-client';
import isAdmin from '../../lib/is-admin';
import * as classifierActions from '../../redux/ducks/classify';
import * as translationActions from '../../redux/ducks/translations';

class WorkflowSelection extends React.Component {
  constructor() {
    super();
    this.state = {
      error: null,
      loadingSelectedWorkflow: true
    };
  }

  componentDidMount() {
    this.getSelectedWorkflow(this.props);
  }

  componentWillUpdate(nextProps, nextState) {
    const { preferences } = nextProps;
    const userSelectedWorkflow = (preferences && preferences.preferences) ? this.sanitiseID(preferences.preferences.selected_workflow) : undefined;
    if (userSelectedWorkflow &&
      this.props.workflow
    ) {
      if (!nextState.loadingSelectedWorkflow &&
        userSelectedWorkflow !== this.props.workflow.id
      ) {
        this.getSelectedWorkflow(nextProps);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.project.id !== this.props.project.id) {
      this.getSelectedWorkflow(this.props);
    }
    if (prevProps.translations.locale !== this.props.translations.locale) {
      this.props.actions.translations.load('workflow', this.props.workflow.id, this.props.translations.locale);
    }
  }

  getSelectedWorkflow({ project, preferences, user }) {
    this.setState({ loadingSelectedWorkflow: true });
    // preference workflow query by admin/owner/collab, then workflow query if in project settings, then user selected workflow, then project owner set workflow, then default workflow
    // if none of those are set, select random workflow
    let selectedWorkflowID;
    let activeFilter = true;
    const workflowFromURL = this.sanitiseID(this.props.location.query.workflow);
    const userSelectedWorkflow = (preferences && preferences.preferences) ? this.sanitiseID(preferences.preferences.selected_workflow) : undefined;
    const projectSetWorkflow = (preferences && preferences.settings) ? this.sanitiseID(preferences.settings.workflow_id) : undefined;
    if (workflowFromURL &&
      this.checkUserRoles(project, user)
    ) {
      selectedWorkflowID = workflowFromURL;
      activeFilter = false;
      if (userSelectedWorkflow && userSelectedWorkflow !== selectedWorkflowID) {
        this.handlePreferencesChange('preferences.selected_workflow', selectedWorkflowID);
      }
    } else if (workflowFromURL &&
      project.experimental_tools &&
      project.experimental_tools.indexOf('allow workflow query') > -1
    ) {
      selectedWorkflowID = workflowFromURL;
      if (userSelectedWorkflow && userSelectedWorkflow !== selectedWorkflowID) {
        this.handlePreferencesChange('preferences.selected_workflow', selectedWorkflowID);
      }
    } else if (userSelectedWorkflow) {
      selectedWorkflowID = userSelectedWorkflow;
    } else if (projectSetWorkflow) {
      selectedWorkflowID = projectSetWorkflow;
    } else if (project.configuration && project.configuration.default_workflow) {
      selectedWorkflowID = project.configuration.default_workflow;
    } else {
      selectedWorkflowID = this.selectRandomActiveWorkflow(project);
    }

    if (selectedWorkflowID) return this.getWorkflow(selectedWorkflowID, activeFilter);
    if (process.env.BABEL_ENV !== 'test') console.warn('Cannot select a workflow.')
  }

  getWorkflow(selectedWorkflowID, activeFilter = true) {
    const { actions, project, translations } = this.props;
    const sanitisedWorkflowID = this.sanitiseID(selectedWorkflowID);
    let isValidWorkflow = false;

    if (activeFilter && project.links.active_workflows) {
      isValidWorkflow = project.links.active_workflows.indexOf(sanitisedWorkflowID) > -1;
    } else if (project.links.workflows) {
      isValidWorkflow = project.links.workflows.indexOf(sanitisedWorkflowID) > -1;
    }
    let awaitWorkflow;
    if (isValidWorkflow) {
      awaitWorkflow = apiClient
        .type('workflows')
        .get(sanitisedWorkflowID, {}) // the empty query here forces the client to bypass its internal cache
        .catch((error) => {
          if (error.status === 404) {
            this.clearInactiveWorkflow(sanitisedWorkflowID)
            .then(this.getSelectedWorkflow(this.props));
          } else {
            console.error(error);
            this.setState({ error, loadingSelectedWorkflow: false });
          }
        });
    } else {
      awaitWorkflow = Promise.resolve(null);
    }

    return awaitWorkflow
    .then((workflow) => {
      if (workflow) {
        actions.translations.load('workflow', workflow.id, translations.locale);
        actions.classifier.setWorkflow(workflow);
        this.setState({ loadingSelectedWorkflow: false });
      } else {
        if (process.env.BABEL_ENV !== 'test') console.log(`No workflow ${selectedWorkflowID} for project ${this.props.project.id}`);
        if (this.props.project.configuration &&
          selectedWorkflowID === this.props.project.configuration.default_workflow
        ) {
          // If a project still has an inactive workflow set as a default workflow prior to this being fix in the lab.
          // Don't try again and get caught in a loop
          this.workflowSelectionErrorHandler();
        } else {
          if (this.props.location.query && this.props.location.query.workflow) {
            this.context.router.push(`/projects/${this.props.project.slug}/classify`);
          }

          this.clearInactiveWorkflow(selectedWorkflowID)
            .then(() => {
              this.getSelectedWorkflow(this.props);
            });
        }
      }
    })
    .catch((error) => {
      console.error(error.message);
    });
  }

  selectRandomActiveWorkflow(project) {
    const linkedActiveWorkflows = project.links.active_workflows;
    if (linkedActiveWorkflows && linkedActiveWorkflows.length > 0) {
      const randomIndex = Math.floor(Math.random() * linkedActiveWorkflows.length);
      // console.log 'Chose random workflow', linkedActiveWorkflows[randomIndex]
      return linkedActiveWorkflows[randomIndex];
    } else {
      this.workflowSelectionErrorHandler();
      return '';
    }
  }

  checkUserRoles(project, user) {
    const currentUserRoleSets = this.props.projectRoles.filter(roleSet => (user && user.id && roleSet.links.owner.id === user.id));
    const roles = currentUserRoleSets[0] ? currentUserRoleSets[0].roles : [];

    return isAdmin() || roles.indexOf('owner') > -1 || roles.indexOf('collaborator') > -1 || roles.indexOf('tester') > -1;
  }

  clearInactiveWorkflow(selectedWorkflowID) {
    const { preferences } = this.props;
    const selectedWorkflow = (preferences && preferences.preferences) ? this.sanitiseID(preferences.preferences.selected_workflow) : undefined;
    const projectSetWorkflow = (preferences && preferences.settings) ? this.sanitiseID(preferences.settings.workflow_id) : undefined;

    if (selectedWorkflowID === selectedWorkflow) {
      preferences.update({ 'preferences.selected_workflow': undefined });
      return preferences.save().catch(error => console.warn(error.message));
    } else if (selectedWorkflowID === projectSetWorkflow) {
      preferences.update({ 'settings.workflow_id': undefined });
      return preferences.save().catch(error => console.warn(error.message));
    } else {
      return Promise.resolve({});
    }
  }

  handlePreferencesChange(key, value) {
    this.props.preferences.update({ [key]: value });
  }

  workflowSelectionErrorHandler() {
    this.props.project.uncacheLink('workflows');
    if (process.env.BABEL_ENV !== 'test') console.error(`No active workflows for project ${this.props.project.id}`);
  }

  sanitiseID(resourceID) {
    const sanitisedID = resourceID ? parseInt(resourceID) : undefined;
    return sanitisedID ? sanitisedID.toString() : undefined;
  }

  render() {
    const { translation, workflow } = this.props;
    const { loadingSelectedWorkflow } = this.state;
    return React.cloneElement(this.props.children, { translation, loadingSelectedWorkflow });
  }
}

WorkflowSelection.defaultProps = {
  actions: {
    translations: {
      load() { return null; }
    }
  },
  children: null,
  location: {
    query: {}
  },
  preferences: {},
  projectRoles: [],
  translation: {
    id: '',
    display_name: ''
  },
  translations: {
    locale: 'en'
  },
  user: null,
  workflow: null
};

WorkflowSelection.propTypes = {
  actions: PropTypes.shape({
    translations: PropTypes.shape({
      load: PropTypes.func
    })
  }),
  children: PropTypes.node,
  location: PropTypes.shape({
    query: PropTypes.shape({
      workflow: PropTypes.string
    })
  }),
  preferences: PropTypes.shape({
    save: PropTypes.func,
    update: PropTypes.func
  }),
  project: PropTypes.shape({
    id: PropTypes.string,
    configuration: PropTypes.shape({
      default_workflow: PropTypes.string
    }),
    slug: PropTypes.string,
    uncacheLink: PropTypes.func
  }).isRequired,
  projectRoles: PropTypes.arrayOf(PropTypes.object),
  translation: PropTypes.shape({
    display_name: PropTypes.string
  }),
  translations: PropTypes.shape({
    locale: PropTypes.string
  }),
  workflow: PropTypes.shape({
    id: PropTypes.string
  })
};

WorkflowSelection.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  workflow: state.classify.workflow
});

const mapDispatchToProps = dispatch => ({
  actions: {
    classifier: bindActionCreators(classifierActions, dispatch),
    translations: bindActionCreators(translationActions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(WorkflowSelection);
export { WorkflowSelection };