import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as classifierActions from '../../redux/ducks/classify';
import * as translationActions from '../../redux/ducks/translations';
import { WorkflowSelection } from './workflow-selection';

export class ClassroomWorkflowSelection extends WorkflowSelection {
  getSelectedWorkflow(props) {
    const { actions, locale, location, project, preferences } = props;

    // Normally, WildCam Classrooms are "custom programs" with a different
    // (cloned) workflow for each Assignment. We expect a numerical Workflow ID.
    const workflowFromURL = this.sanitiseID(location.query.workflow);
    if (workflowFromURL) return actions.classifier.loadWorkflow(workflowFromURL, locale, preferences);

    // Some WildCam Classrooms are now "non-custom programs", meaning every
    // Assignment is associated with the current main workflow.
    // In this scenario, the expected param looks like: ?workflow=default
    const defaultWorkflow = project.configuration && this.sanitiseID(project.configuration.default_workflow);
    if (defaultWorkflow && location.query.workflow === 'default') {
      return actions.classifier.loadWorkflow(defaultWorkflow, locale, preferences);
    }

    // If neither case above, it's a failure.
    if (process.env.BABEL_ENV !== 'test') console.warn('Cannot select a workflow.');
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

export default connect(mapStateToProps, mapDispatchToProps)(ClassroomWorkflowSelection);
