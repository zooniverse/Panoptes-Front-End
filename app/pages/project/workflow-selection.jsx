import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import isAdmin from '../../lib/is-admin';
import * as classifierActions from '../../redux/ducks/classify';
import * as translationActions from '../../redux/ducks/translations';

class WorkflowSelection extends React.Component {
  constructor() {
    super();
    this.state = {
      error: null
    };
  }

  componentDidMount() {
    const { project, workflow } = this.props;
    const linkedActiveWorkflows = project.links.active_workflows || [];
    const workflowExistsForProject = workflow && linkedActiveWorkflows.indexOf(workflow.id) > -1;
    if (!workflowExistsForProject) {
      this.getSelectedWorkflow(this.props);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { actions, locale, preferences, workflow } = this.props;
    const prevPrefs = prevProps.preferences && prevProps.preferences.id;
    const currentPrefs = preferences && preferences.id;
    
    if (prevProps.project.id !== this.props.project.id) {
      this.getSelectedWorkflow(this.props);
    }
    if (workflow && prevProps.locale !== locale) {
      actions.translations.load('workflow', workflow.id, locale);
    }
    if (currentPrefs !== prevPrefs) {
      actions.classifier.reset();
    }
  }

  getSelectedWorkflow({ project, preferences, user }) {
    // preference workflow query by admin/owner/collab, then workflow query if in project settings, then user selected workflow, then project owner set workflow, then default workflow
    // if none of those are set, select random workflow
    let selectedWorkflowID;
    let activeFilter = true;
    const workflowFromURL = this.sanitiseID(this.props.location.query.workflow);
    const userSelectedWorkflow = (user && preferences && preferences.preferences) ? this.sanitiseID(preferences.preferences.selected_workflow) : undefined;
    const projectSetWorkflow = (user && preferences && preferences.settings) ? this.sanitiseID(preferences.settings.workflow_id) : undefined;
    if (workflowFromURL &&
      this.checkUserRoles(project, user)
    ) {
      selectedWorkflowID = workflowFromURL;
      activeFilter = false;
    } else if (workflowFromURL &&
      project.experimental_tools &&
      project.experimental_tools.indexOf('allow workflow query') > -1
    ) {
      selectedWorkflowID = workflowFromURL;
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
    if (process.env.BABEL_ENV !== 'test') console.warn('Cannot select a workflow.');
  }

  getWorkflow(selectedWorkflowID, activeFilter = true) {
    const { actions, locale, preferences, project } = this.props;
    const sanitisedWorkflowID = this.sanitiseID(selectedWorkflowID);
    const validWorkflows = activeFilter ? project.links.active_workflows : project.links.workflows;
    const isValidWorkflow = validWorkflows.indexOf ? validWorkflows.indexOf(sanitisedWorkflowID) > -1 : false;

    if (isValidWorkflow) {
      return actions.classifier.loadWorkflow(sanitisedWorkflowID, locale, preferences);
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
      actions.classifier.setWorkflow(null);
      return Promise.resolve();
    }
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

  workflowSelectionErrorHandler() {
    this.props.project.uncacheLink('workflows');
    if (process.env.BABEL_ENV !== 'test') console.error(`No active workflows for project ${this.props.project.id}`);
  }

  sanitiseID(resourceID) {
    const sanitisedID = resourceID ? parseInt(resourceID) : undefined;
    return sanitisedID ? sanitisedID.toString() : undefined;
  }

  render() {
    const { children, project, workflow } = this.props;
    const validWorkflowForProject = workflow && workflow.links.project === project.id;
    return validWorkflowForProject ? children : <p>Loading workflow</p>;
  }
}

WorkflowSelection.defaultProps = {
  actions: {
    translations: {
      load() { return null; }
    }
  },
  children: null,
  locale: 'en',
  location: {
    query: {}
  },
  preferences: null,
  projectRoles: [],
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
  locale: PropTypes.string,
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
  workflow: PropTypes.shape({
    id: PropTypes.string
  })
};

WorkflowSelection.contextTypes = {
  router: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  locale: state.translations.locale,
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
