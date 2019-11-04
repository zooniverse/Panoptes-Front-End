import PropTypes from 'prop-types';
import React from 'react';
import Translate from 'react-translate-component';
import CharacteristicsFilter from './CharacteristicsFilter';
import Choices from './Choices';

class Chooser extends React.Component {

  getFilteredChoices() {
    return this.props.task.choicesOrder.map((choiceId) => {
      const choice = this.props.task.choices[choiceId];
      let rejected = false;
      Object.keys(this.props.filters).map((characteristicId) => {
        const valueId = this.props.filters[characteristicId];
        const characteristic = choice.characteristics[characteristicId] || [];
        if (characteristic.indexOf(valueId) === -1) {
          rejected = true;
        }
      });
      if (rejected) {
        return null;
      } else {
        return choiceId;
      }
    }).filter(Boolean);
  }

  handleClearFilters() {
    this.props.task.characteristicsOrder.map(characteristicId => this.props.onFilter(characteristicId, undefined));
  }

  render() {
    const { annotation, task, translation, filters, focusedChoice, onChoose, onFilter, onRemove } = this.props;
    const filteredChoices = this.getFilteredChoices();
    return (
      <div className="survey-task-chooser">
        <CharacteristicsFilter
          filters={filters}
          focusedChoice={focusedChoice}
          task={task}
          translation={translation}
          onFilter={onFilter}
        />
        <hr className="survey-task-chooser__divider" />
        <Choices
          annotation={annotation}
          filters={filters}
          filteredChoices={filteredChoices}
          focusedChoice={focusedChoice}
          task={task}
          translation={translation}
          onChoose={onChoose}
          onRemove={onRemove}
        />
        <div style={{ textAlign: 'center' }}>
          <Translate
            content="tasks.survey.showing"
            with={{ count: filteredChoices.length, max: task.choicesOrder.length }}
          />
          &ensp;
          <button
            type="button"
            className="survey-task-chooser-characteristic-clear-button"
            disabled={Object.keys(filters).length === 0}
            onClick={this.handleClearFilters.bind(this)}
          >
            <i className="fa fa-ban" /> <Translate content="tasks.survey.clearFilters" />
          </button>
        </div>
      </div>
    );
  }
}

Chooser.propTypes = {
  annotation: PropTypes.shape({
    task: PropTypes.string,
    value: PropTypes.array
  }),
  filters: PropTypes.object,
  focusedChoice: PropTypes.string,
  onChoose: PropTypes.func,
  onFilter: PropTypes.func,
  onRemove: PropTypes.func,
  task: PropTypes.shape({
    alwaysShowThumbnails: PropTypes.bool,
    characteristics: PropTypes.object,
    characteristicsOrder: PropTypes.array,
    choices: PropTypes.object,
    choicesOrder: PropTypes.array,
    images: PropTypes.object,
    questions: PropTypes.object
  }),
  translation: PropTypes.shape({
    characteristics: PropTypes.object,
    choices: PropTypes.object,
    questions: PropTypes.object
  }).isRequired
};

Chooser.defaultProps = {
  annotation: {
    task: '',
    value: []
  },
  filters: {},
  focusedChoice: '',
  onChoose: Function.prototype,
  onFilter: Function.prototype,
  onRemove: Function.prototype,
  task: null
};

export default Chooser;
