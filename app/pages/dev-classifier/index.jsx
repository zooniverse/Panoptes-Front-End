import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import mockData from './mock-data';
import { ClassifierWrapper } from '../../classifier';
import tasks from '../../classifier/tasks';
import ClassificationViewer from './ClassificationViewer';
import * as userInterfaceActions from '../../redux/ducks/userInterface';
import { zooTheme } from '../../theme';

export class DevClassifierPage extends React.Component {
  static defaultProps = {
    classification: mockData.classification,
    preferences: mockData.preferences,
    project: mockData.project
  }

  reload() {
    const workflow = this.props.classification._workflow;
    const firstTask = workflow.tasks[workflow.first_task];
    const FirstTaskComponent = tasks[firstTask.type];
    const firstAnnotation = Object.assign({}, { task: workflow.first_task }, FirstTaskComponent.getDefaultAnnotation());
    this.props.classification.update({
      annotations: [firstAnnotation],
      completed: false
    });
  }

  render() {
    const classname = classNames({
      'classify-page--dark-theme': this.props.theme === zooTheme.mode.dark
    });
    const [subject] = this.props.classification._subjects;

    return (
      <div className={classname}>
        <ClassifierWrapper
          className="classifier--dev"
          user={this.props.user}
          project={this.props.project}
          workflow={this.props.classification._workflow}
          preferences={this.props.preferences}
          classification={this.props.classification}
          subject={subject}
          onClickNext={this.reload}
        >
          <ClassificationViewer classification={this.props.classification} />
        </ClassifierWrapper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  theme: state.userInterface.theme
});

export default connect(mapStateToProps)(DevClassifierPage);
