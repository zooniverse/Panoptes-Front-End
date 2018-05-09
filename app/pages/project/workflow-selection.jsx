import PropTypes from 'prop-types';
import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import isAdmin from '../../lib/is-admin';

class WorkflowSelection extends React.Component {
  constructor() {
    super();
    this.state = {
      error: null,
      loadingSelectedWorkflow: true,
      workflow: null
    };
  }

  componentDidMount() {
    this.getSelectedWorkflow(this.props);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.preferences &&
      nextProps.preferences.preferences &&
      nextProps.preferences.preferences.selected_workflow &&
      this.state.workflow
    ) {
      const userWorkflowID = parseInt(nextProps.preferences.preferences.selected_workflow);
      if (!nextState.loadingSelectedWorkflow &&
        userWorkflowID !== parseInt(this.state.workflow.id)
      ) {
        this.getSelectedWorkflow(nextProps);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.project.id !== this.props.project.id) {
      this.getSelectedWorkflow(this.props);
    }
  }

  getSelectedWorkflow({ project, preferences, user }) {
    this.setState({ loadingSelectedWorkflow: true });
    // preference workflow query by admin/owner/collab, then workflow query if in project settings, then user selected workflow, then project owner set workflow, then default workflow
    // if none of those are set, select random workflow
    let selectedWorkflowID;
    let activeFilter = true;
    if (this.props.location.query &&
      this.props.location.query.workflow &&
      this.checkUserRoles(project, user)
    ) {
      selectedWorkflowID = parseInt(this.props.location.query.workflow);
      activeFilter = false;
      if (preferences && preferences.preferences.selected_workflow !== selectedWorkflowID) {
        this.handlePreferencesChange('preferences.selected_workflow', selectedWorkflowID);
      }
    } else if (this.props.location.query &&
      this.props.location.query.workflow &&
      project.experimental_tools &&
      project.experimental_tools.indexOf('allow workflow query') > -1
    ) {
      selectedWorkflowID = parseInt(this.props.location.query.workflow);
      if (preferences && preferences.preferences.selected_workflow !== selectedWorkflowID) {
        this.handlePreferencesChange('preferences.selected_workflow', selectedWorkflowID);
      }
    } else if (preferences && preferences.preferences.selected_workflow) {
      selectedWorkflowID = preferences.preferences.selected_workflow;
    } else if (preferences && preferences.settings && preferences.settings.workflow_id) {
      selectedWorkflowID = preferences.settings.workflow_id;
    } else if (project.configuration && project.configuration.default_workflow) {
      selectedWorkflowID = project.configuration.default_workflow;
    } else {
      selectedWorkflowID = this.selectRandomWorkflow(project);
    }

    selectedWorkflowID = parseInt(selectedWorkflowID);
    this.getWorkflow(selectedWorkflowID, activeFilter);
  }

  getWorkflow(selectedWorkflowID, activeFilter = true) {
    const { actions, translations } = this.props;
    const query = {
      id: `${selectedWorkflowID}`,
      project_id: this.props.project.id
    };
    if (activeFilter) {
      query.active = true;
    }
    apiClient
    .type('workflows')
    .get(query)
    .catch((error) => {
      if (error.status === 404) {
        this.clearInactiveWorkflow(selectedWorkflowID)
        .then(this.getSelectedWorkflow(this.props));
      } else {
        console.error(error);
        this.setState({ error, loadingSelectedWorkflow: false });
      }
    })
    .then(([workflow]) => {
      if (workflow) {
        this.setState({ loadingSelectedWorkflow: false, workflow });
        actions.translations.load('workflow', workflow.id, translations.locale);
      } else {
        console.log(`No workflow ${selectedWorkflowID} for project ${this.props.project.id}`);
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
          .then(this.getSelectedWorkflow(this.props));
        }
      }
    })
    .catch((error) => {
      console.warn(error.message);
    });
  }

  selectRandomWorkflow(project) {
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
    const selectedWorkflow = preferences.preferences ? preferences.preferences.selected_workflow : undefined;
    const projectSetWorkflow = preferences.settings ? preferences.settings.workflow_id : undefined;

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
    this.props.onChangePreferences(key, value);
  }

  workflowSelectionErrorHandler() {
    this.props.project.uncacheLink('workflows');
    throw new Error(`No active workflows for project ${this.props.project.id}`);
  }

  render() {
    const { translation } = this.props;
    const { loadingSelectedWorkflow, workflow } = this.state;
    return React.cloneElement(this.props.children, { translation, loadingSelectedWorkflow, workflow });
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
  onChangePreferences() { return null; },
  preferences: {},
  projectRoles: [],
  translation: {
    id: '',
    display_name: ''
  },
  translations: {
    locale: 'en'
  },
  user: null
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
  onChangePreferences: PropTypes.func,
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
  })
};

WorkflowSelection.contextTypes = {
  router: PropTypes.object.isRequired
};

export default WorkflowSelection;