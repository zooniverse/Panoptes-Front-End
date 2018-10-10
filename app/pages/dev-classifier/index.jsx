import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import mockData from './mock-data';
import { ClassifierWrapper } from '../../classifier';
import tasks from '../../classifier/tasks';
import ClassificationViewer from './ClassificationViewer';
import * as userInterfaceActions from '../../redux/ducks/userInterface';
import * as classifierActions from '../../redux/ducks/classify';
import { zooTheme } from '../../theme';

export class DevClassifierPage extends React.Component {
  static defaultProps = {
    classification: mockData.classification,
    preferences: mockData.preferences,
    project: mockData.project
  }

  state = {
    error: null,
    info: null
  }

  componentDidCatch(error, info) {
    console.log(error, info);
    this.setState({ error, info });
  }

  componentDidMount() {
    const { actions } = this.props;
    const workflow = mockData.classification._workflow;
    actions.classify.setWorkflow(workflow);
  }

  componentDidUpdate(prevProps) {
    const { actions, project, user } = this.props;
    const workflow = mockData.classification._workflow;
    const subjects = mockData.classification._subjects
    if (user !== prevProps.user) {
      actions.classify.appendSubjects(subjects, workflow.id);
      actions.classify.createClassification(project);
    }
  }

  reload() {
    const workflow = mockData.classification._workflow;
    const firstTask = workflow.tasks[workflow.first_task];
    const FirstTaskComponent = tasks[firstTask.type];
    const firstAnnotation = Object.assign({}, { task: workflow.first_task }, FirstTaskComponent.getDefaultAnnotation());
    mockData.classification.update({
      annotations: [firstAnnotation],
      completed: false
    });
  }

  render() {
    const { error, info } = this.state;
    const { classification, workflow } = this.props;
    const classname = classNames({
      'classify-page--dark-theme': this.props.theme === zooTheme.mode.dark
    });
    const [subject] = mockData.classification._subjects;

    return (
      <div className={classname}>
        {!!error &&
          <div>
            {error.message}
            <hr/>
            <pre>{info.componentStack}</pre>
          </div>
        }
        {!error &&
        !!classification &&
          <ClassifierWrapper
            className="classifier--dev"
            user={this.props.user}
            project={this.props.project}
            workflow={workflow}
            preferences={this.props.preferences}
            classification={classification}
            subject={subject}
            onClickNext={this.reload}
          >
            <ClassificationViewer
              classification={classification}
              workflow={workflow}
            />
          </ClassifierWrapper>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  classification: state.classify.classification,
  theme: state.userInterface.theme,
  workflow: state.classify.workflow
});

const mapDispatchToProps = dispatch => ({
  actions: {
    classify: bindActionCreators(classifierActions, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DevClassifierPage);
