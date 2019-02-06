import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as classifierActions from '../../redux/ducks/classify';
import * as translationActions from '../../redux/ducks/translations';
import { WorkflowSelection } from './workflow-selection';

export class ClassroomWorkflowSelection extends WorkflowSelection {
  getSelectedWorkflow({ location }) {
    const workflowFromURL = this.sanitiseID(location.query.workflow);
    if (workflowFromURL) return this.getWorkflow(workflowFromURL, false);
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

