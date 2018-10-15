import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import mockData from './mock-data';
import { ClassifierWrapper } from '../../classifier';
import ClassificationViewer from './ClassificationViewer';
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

  componentDidMount() {
    const { actions, project } = this.props;
    const workflow = mockData.classification._workflow;
    const subjects = mockData.classification._subjects;
    actions.classify.setWorkflow(workflow);
    actions.classify.appendSubjects(subjects, workflow.id);
    actions.classify.createClassification(project);
  }

  componentDidUpdate() {
    const { actions, project, user } = this.props;
    const workflow = mockData.classification._workflow;
    const subjects = mockData.classification._subjects;
    if (!this.props.classification) {
      actions.classify.appendSubjects(subjects, workflow.id);
      actions.classify.createClassification(project);
    }
  }

  componentDidCatch(error, info) {
    console.log(error, info);
    this.setState({ error, info });
  }

  reload() {
    const { actions, project } = this.props;
    const workflow = mockData.classification._workflow;
    const subjects = mockData.classification._subjects;
    actions.classify.appendSubjects(subjects, workflow.id);
    actions.classify.nextSubject(project);
  }

  render() {
    const { error, info } = this.state;
    const { classification, workflow } = this.props;
    const classname = classNames({
      'classify-page--dark-theme': this.props.theme === zooTheme.mode.dark
    });
    const [subject] = mockData.classification._subjects;

    if (error) {
      return (
        <div className={classname}>
          {error.message}
          <hr />
          <pre>{info.componentStack}</pre>
        </div>
      );
    }
    if (classification) {
      return (
        <div className={classname}>
          <ClassifierWrapper
            className="classifier--dev"
            user={this.props.user}
            project={this.props.project}
            workflow={workflow}
            preferences={this.props.preferences}
            classification={classification}
            subject={subject}
            onClickNext={this.reload.bind(this)}
          >
            <ClassificationViewer
              classification={classification}
              workflow={workflow}
            />
          </ClassifierWrapper>
        </div>
      );
    }
    return (
      <div className={classname}>
        Loading…
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
