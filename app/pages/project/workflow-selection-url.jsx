import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as classifierActions from '../../redux/ducks/classify';
import * as translationActions from '../../redux/ducks/translations';
import { WorkflowSelection } from './workflow-selection';

export class URLWorkflowSelection extends WorkflowSelection {
  getSelectedWorkflow(props) {
    const { actions, locale, location, preferences, project, user } = props;
    const workflowFromURL = this.sanitiseID(location.query.workflow);
    const projectAllowsWorkflowQuery =
      project.experimental_tools &&
      project.experimental_tools.indexOf('allow workflow query') > -1;
    // admin users can load any workflow. Others can only load active workflows
    const validWorkflows = this.checkUserRoles(project, user) ?
      project.links.workflows :
      project.links.active_workflows;
    const isValidWorkflow = validWorkflows.indexOf ? validWorkflows.indexOf(workflowFromURL) > -1 : false;
    // admin users can always use query params
    const canUseQueryParams = projectAllowsWorkflowQuery || this.checkUserRoles(project, user);
    if (isValidWorkflow && canUseQueryParams && workflowFromURL) {
      return actions.classifier.loadWorkflow(workflowFromURL, locale, preferences);
    }
    if (process.env.BABEL_ENV !== 'test') console.warn('Cannot select a workflow.');
    this.context.router.push(`/projects/${this.props.project.slug}/classify`);
    return Promise.resolve(null);
  }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(URLWorkflowSelection);

