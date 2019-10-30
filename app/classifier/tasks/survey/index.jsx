import React from 'react';
import PropTypes from 'prop-types';
import Editor from './editor';
import Summary from './summary';
import Chooser from './chooser';
import Choice from './choice';
import AnnotationView from './annotation-view';

export default class SurveyTask extends React.Component {
  static Editor = Editor

  static Summary = Summary

  static AfterSubject = AnnotationView

  static getDefaultTask() {
    return {
      type: 'survey',
      characteristicsOrder: [],
      characteristics: {},
      choicesOrder: [],
      choices: {},
      questionsOrder: [],
      questions: {},
      images: {}
    };
  }

  static getTaskText(task) {
    return `Survey of ${task.choicesOrder.length} choices`;
  }

  static getDefaultAnnotation() {
    return { value: [] };
  }

  static isAnnotationComplete(task, annotation) {
    const minRequiredAnswers = task.required ? 1 : 0;
    const { _choiceInProgress } = annotation;
    return annotation.value.length >= minRequiredAnswers && !_choiceInProgress;
  }

  constructor(props) {
    super(props);

    this.clearSelection = this.clearSelection.bind(this);
    this.handleAnnotation = this.handleAnnotation.bind(this);
    this.handleChoice = this.handleChoice.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    this.state = {
      filters: {},
      focusedChoice: '',
      selectedChoiceID: ''
    };
  }

  handleFilter(characteristicID, valueID) {
    const { filters } = this.state;

    setTimeout(() => {
      if (valueID) {
        filters[characteristicID] = valueID;
      } else {
        delete filters[characteristicID];
      }
      this.setState({ filters });
    });
  }

  handleChoice(selectedChoiceID) {
    const { annotation, onChange } = this.props;
    const newAnnotation = Object.assign({}, annotation, { _choiceInProgress: true });

    this.setState({ selectedChoiceID });
    onChange(newAnnotation);
  }

  handleRemove(choiceID) {
    const { annotation, onChange } = this.props;
    const selectedChoices = annotation.value.map(item => item.choice);
    const index = selectedChoices.indexOf(choiceID);
    annotation.value.splice(index, 1);
    const newAnnotation = Object.assign({}, annotation);
    onChange(newAnnotation);
  }

  clearFilters() {
    this.setState({ filters: {}});
  }

  clearSelection() {
    const { annotation, onChange } = this.props;
    const { selectedChoiceID } = this.state;

    this.setState({
      selectedChoiceID: '',
      focusedChoice: selectedChoiceID
    });
    const newAnnotation = Object.assign({}, annotation, { _choiceInProgress: false });
    onChange(newAnnotation);
  }

  handleAnnotation(choice, answers) {
    const { filters } = this.state;
    const { annotation, onChange } = this.props;

    const parsedFilters = JSON.parse(JSON.stringify(filters));
    const value = annotation.value.filter(item => item.choice !== choice);
    value.push({ choice, answers, filters: parsedFilters });
    this.clearFilters();
    this.clearSelection();
    const newAnnotation = Object.assign({}, annotation, { value, _choiceInProgress: false });
    onChange(newAnnotation);
  }

  render() {
    const {
      annotation,
      task,
      translation
    } = this.props;

    const {
      filters,
      focusedChoice,
      selectedChoiceID
    } = this.state;

    const existingAnnotationValue = annotation.value
      && annotation.value.find(value => value.choice === selectedChoiceID);

/* eslint-disable multiline-ternary */
    return (
      <div className="survey-task">
        {(selectedChoiceID === '') ?
          (<Chooser
            task={task}
            filters={filters}
            onFilter={this.handleFilter}
            onChoose={this.handleChoice}
            onRemove={this.handleRemove}
            annotation={annotation}
            focusedChoice={focusedChoice}
            translation={translation}
          />) :
          (<Choice
            annotation={annotation}
            annotationValue={existingAnnotationValue}
            task={task}
            choiceID={selectedChoiceID}
            onSwitch={this.handleChoice}
            onCancel={this.clearSelection}
            onConfirm={this.handleAnnotation}
            translation={translation}
          />)
        }
      </div>
    );
  }
}

SurveyTask.propTypes = {
  annotation: PropTypes.shape({
    value: PropTypes.array
  }),
  onChange: PropTypes.func,
  task: PropTypes.shape({
    choicesOrder: PropTypes.array,
    required: PropTypes.bool
  }),
  translation: PropTypes.shape({})
};

SurveyTask.defaultProps = {
  annotation: {},
  onChange: () => {},
  task: null,
  translation: null
};
