import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter'
import every from 'lodash/every';
import reduce from 'lodash/reduce';
import MobileSection from './mobile-section';

const VALID_QUESTION_LENGTH = 200;
const VALID_TASK_TYPES_FOR_MOBILE = ['single', 'multiple'];

function launchApprovedProject ({ project }) {
  return project.launch_approved || false;
}

function taskQuestionNotTooLong ({ task }) {
  return task.question.length < VALID_QUESTION_LENGTH;
}

function taskFeedbackDisabled ({ task }) {
  return !task.feedback || !task.feedback.enabled;
}

function taskHasTwoAnswers ({ task }) {
  return task.answers.length === 2;
}

function workflowFlipbookDisabled ({ workflow }) {
  return (workflow.configuration) ? workflow.configuration.multi_image_mode !== 'flipbook' : true;
}

function workflowHasSingleTask ({ workflow }) {
  return filter(workflow.tasks, ({ type }) => type !== 'shortcut').length === 1;
}

function workflowNotTooManyShortcuts ({ task, workflow }) {
  const shortcut = workflow.tasks[task.unlinkedTask];
  return (shortcut) ? shortcut.answers.length <= 2 : true;
}

const validatorFns = {
  launchApprovedProject,
  taskQuestionNotTooLong,
  taskFeedbackDisabled,
  taskHasTwoAnswers,
  workflowFlipbookDisabled,
  workflowHasSingleTask,
  workflowNotTooManyShortcuts
};

class MobileSectionContainer extends Component {
  constructor(props) {
    super(props);
    this.checkShowSection = this.checkShowSection.bind(this);
    this.renderMobileSection = this.renderMobileSection.bind(this);
    this.toggleChecked = this.toggleChecked.bind(this);
    this.toggleMobileFriendlyStatus = this.toggleMobileFriendlyStatus.bind(this);
    this.validate = this.validate.bind(this);
    this.state = {
      enabled: false,
      showSection: false,
      validations: reduce(validatorFns, (valObj, fn, key) => {
        valObj[key] = false;
        return valObj;
      }, {})
    };
  }

  checkShowSection() {
    const isValidTaskType = VALID_TASK_TYPES_FOR_MOBILE.includes(this.props.task.type);
    this.setState({ showSection: isValidTaskType });
  }

  componentWillReceiveProps(nextProps) {
    this.validate(nextProps);
  }

  componentWillMount() {
    this.checkShowSection();
    this.validate(this.props);
  }

  render() {
    return (this.state.showSection)
      ? this.renderMobileSection()
      : null;
  }

  renderMobileSection() {
    const checked = this.props.workflow.configuration.swipe_enabled || false;
    return <MobileSection
      checked={checked}
      enabled={this.state.enabled}
      toggleChecked={this.toggleChecked}
      validations={this.state.validations}
    />;
  }

  toggleChecked() {
    const { project, workflow } = this.props;
    const currentStatus = workflow.configuration.swipe_enabled || false;
    const updateWorkflow = workflow.update({
      'configuration.swipe_enabled': !currentStatus
    });

    return updateWorkflow.save()
      .then(() => project.get('workflows'))
      .then(allWorkflows => {
        return allWorkflows.reduce((hasSwipeWorkflow, thisWorkflow) => {
          return (hasSwipeWorkflow)
            ? hasSwipeWorkflow
            : (thisWorkflow.configuration && thisWorkflow.configuration.swipe_enabled);
        }, false);
      })
      .then(mobileFriendly => {
        return (mobileFriendly === project.mobile_friendly)
          ? true
          : this.toggleMobileFriendlyStatus();
      })
      .catch(error => console.error(error));
  }

  toggleMobileFriendlyStatus() {
    const { project } = this.props;
    const updatedProject = project.update({
      mobile_friendly: !project.mobile_friendly
    });
    return updatedProject.save()
      .catch(error => console.error(error));
  }

  validate(props) {
    const validatorArgs = { task: props.task, workflow: props.workflow, project: props.project };

    const validations = reduce(validatorFns, (validationObj, fn, key) => {
      validationObj[key] = fn.call(this, validatorArgs);
      return validationObj;
    }, {});

    const enabled = every(validations, validation => validation);

    this.setState({
      enabled,
      validations
    });

    if (!enabled && this.props.workflow.configuration.swipe_enabled) {
      this.toggleChecked();
    }
  }
}

MobileSectionContainer.propTypes = {
  task: React.PropTypes.shape({
    answers: React.PropTypes.array,
    feedback: React.PropTypes.object,
    question: React.PropTypes.string,
    type: React.PropTypes.string,
    unlinkedTask: React.PropTypes.string
  }),
  workflow: React.PropTypes.shape({
    configuration: React.PropTypes.object,
    tasks: React.PropTypes.object,
    update: React.PropTypes.func
  }),
  project: React.PropTypes.shape({
    launch_approved: React.PropTypes.bool,
    update: React.PropTypes.func
  })
};

MobileSectionContainer.defaultProps = {
  task: {
    type: '',
    question: '',
    answers: [],
    feedback: {
      enabled: false
    }
  }
};

export default MobileSectionContainer;
