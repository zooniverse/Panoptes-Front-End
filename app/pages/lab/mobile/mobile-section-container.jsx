import React, { Component } from 'react';
import PropTypes from 'prop-types';
import filter from 'lodash/filter';
import every from 'lodash/every';
import reduce from 'lodash/reduce';
import MobileSection from './mobile-section';
import ValidationValue, { convertBooleanToValidation } from './mobile-validations';

const VALID_QUESTION_LENGTH = 200;
const VALID_TASK_TYPES_FOR_MOBILE = ['single', 'multiple'];

function taskQuestionNotTooLong({ task }) {
  return convertBooleanToValidation(task.question ? task.question.length < VALID_QUESTION_LENGTH : false);
}

function taskFeedbackDisabled({ task }) {
  return convertBooleanToValidation(!task.feedback || !task.feedback.enabled);
}

function taskHasTwoAnswers({ task }) {
  return convertBooleanToValidation(task.answers ? task.answers.length === 2 : false);
}

function workflowFlipbookDisabled({ workflow }) {
  return convertBooleanToValidation((workflow.configuration) ? workflow.configuration.multi_image_mode !== 'flipbook' : true);
}

function workflowHasSingleTask({ workflow }) {
  return convertBooleanToValidation(filter(workflow.tasks, ({ type }) => type !== 'shortcut').length === 1);
}

function workflowNotTooManyShortcuts({ task, workflow }) {
  const shortcut = workflow.tasks[task.unlinkedTask];
  return convertBooleanToValidation((shortcut) ? shortcut.answers.length <= 2 : true);
}

const validatorFns = {
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
    const checked = this.props.workflow.mobile_friendly || false;
    return (
      <MobileSection
        checked={checked}
        enabled={this.state.enabled}
        toggleChecked={this.toggleChecked}
        validations={this.state.validations}
      />
    );
  }

  toggleChecked() {
    const { project, workflow } = this.props;
    const currentStatus = workflow.mobile_friendly || false;
    const updateWorkflow = workflow.update({
      mobile_friendly: !currentStatus
    });

    return updateWorkflow.save()
      .then(() => project.get('workflows'))
      .then(allWorkflows => {
        return allWorkflows.reduce((hasSwipeWorkflow, thisWorkflow) => {
          return (hasSwipeWorkflow)
            ? hasSwipeWorkflow
            : thisWorkflow.mobile_friendly;
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

    const enabled = every(validations, validation => validation !== ValidationValue.fail);

    this.setState({
      enabled,
      validations
    });

    if (!enabled && this.props.workflow.mobile_friendly) {
      this.toggleChecked();
    }
  }
}

MobileSectionContainer.propTypes = {
  task: PropTypes.shape({
    answers: PropTypes.array,
    feedback: PropTypes.object,
    question: PropTypes.string,
    type: PropTypes.string,
    unlinkedTask: PropTypes.string
  }),
  workflow: PropTypes.shape({
    configuration: PropTypes.object,
    mobile_friendly: PropTypes.bool,
    tasks: PropTypes.object,
    update: PropTypes.func
  }),
  project: PropTypes.shape({
    update: PropTypes.func
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
