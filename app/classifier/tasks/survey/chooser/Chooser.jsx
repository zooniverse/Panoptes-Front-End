import PropTypes from 'prop-types';
import React from 'react';
import sortIntoColumns from 'sort-into-columns';
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
        if (choice.characteristics[characteristicId] && choice.characteristics[characteristicId].indexOf(valueId) === -1) {
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

  howManyColumns({ length }) {
    if (length <= 5) {
      return 1;
    } else if (length <= 20) {
      return 2;
    } else {
      return 3;
    }
  }

  render() {
    const { annotation, task, translation, filters, focusedChoice, onChoose, onFilter, onRemove } = this.props;
    const filteredChoices = this.getFilteredChoices();
    const columnsCount = this.howManyColumns(filteredChoices);
    const sortedFilteredChoices = sortIntoColumns(filteredChoices, columnsCount);
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
          columnsCount={columnsCount}
          filters={filters}
          filteredChoices={filteredChoices}
          focusedChoice={focusedChoice}
          sortedFilteredChoices={sortedFilteredChoices}
          task={task}
          translation={translation}
          onChoose={onChoose}
          onRemove={onRemove}
        />
        <div style={{ textAlign: 'center' }}>
          <Translate
            content="tasks.survey.showing"
            with={{ count: sortedFilteredChoices.length, max: task.choicesOrder.length }}
          />
          &ensp;
          <button
            type="button"
            className="survey-task-chooser-characteristic-clear-button"
            disabled={Object.keys(filters).length === 0}
            onClick={this.handleClearFilters}
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
