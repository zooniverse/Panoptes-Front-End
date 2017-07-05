import React, { Component } from 'react';
import forOwn from 'lodash/forOwn';
import isEqual from 'lodash/isEqual';
import map from 'lodash/map';
import MobileSection from './mobile-section';

const VALID_QUESTION_LENGTH = 200;
const VALID_TASK_TYPES_FOR_MOBILE = ['single', 'multiple'];

const validatorFns = {
  questionNotTooLong: ({ task }) => task.question.length < VALID_QUESTION_LENGTH,
  taskFeedbackDisabled: ({ task }) => !task.feedback || !task.feedback.enabled,
  taskHasTwoAnswers: ({ task }) => task.answers.length === 2,
  workflowFlipbookDisabled: ({ workflow }) => (workflow.configuration) ? workflow.configuration.multi_image_mode !== 'flipbook' : true,
};

class MobileSectionContainer extends Component {
  constructor(props) {
    super(props);
    this.checkShowSection = this.checkShowSection.bind(this);
    this.getValidations = this.getValidations.bind(this);
    this.renderMobileSection = this.renderMobileSection.bind(this);
    this.validate = this.validate.bind(this);
    this.state = {
      showSection: false,
      validations: Object.keys(validatorFns).reduce((acc, key) => { 
        acc[key] = false;
        return acc;
      }, {}),
    };
  }

  checkShowSection() {
    const isValidTaskType = VALID_TASK_TYPES_FOR_MOBILE.includes(this.props.task.type);
    this.setState({ showSection: isValidTaskType });
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.task, prevProps.task) || 
      !isEqual(this.props.workflow.configuration, prevProps.workflow.configuration )) {
      this.validate();
    }
  }

  componentWillMount() {
    this.checkShowSection();
    this.validate();
  }

  getValidations() {
    const validations = {};
    forOwn(this.state.validations, (value, key) => {
      validations[key] = {
        message: '',
        value
      };
    });
   return validations;
  }

  render() {
    return (this.state.showSection)
      ? this.renderMobileSection()
      : null;
  }

  renderMobileSection() {
    const validations = this.getValidations();
    return <MobileSection validations={validations} />;
  }

  validate() {
    const checked = {};
    const { task, workflow } = this.props;
    const validatorArgs = { task, workflow };
    forOwn(validatorFns, (fn, key) => checked[key] = fn.call(this, validatorArgs));
    this.setState({ validations: checked });
  }
}

MobileSectionContainer.propTypes = {
  task: React.PropTypes.shape({
    type: React.PropTypes.string,
  }),
};

MobileSectionContainer.defaultProps = {
  task: {
    type: '',
    question: '',
    answers: [],
    feedback: {
      enabled: false,
    }
  },
};

export default MobileSectionContainer;
