import React from 'react';
import sortIntoColumns from 'sort-into-columns';
import Translate from 'react-translate-component';
import TriggeredModalForm from 'modal-form/triggered';
import counterpart from 'counterpart';

// key codes
const BACKSPACE = 8;
const UP = 38;
const DOWN = 40;

class Chooser extends React.Component {
  constructor() {
    super();
    this.choiceButtons = [];
    this.handleClearFilters = this.handleClearFilters.bind(this);
  }

  componentDidMount() {
    this.sortChoiceButtons();
  }

  componentDidUpdate() {
    this.sortChoiceButtons();
  }

  getFilteredChoices() {
    return this.props.task.choicesOrder.map((choiceId) => {
      const choice = this.props.task.choices[choiceId];
      let rejected = false;
      Object.keys(this.props.filters).map((characteristicId) => {
        const valueId = this.props.filters[characteristicId];
        if (choice.characteristics[characteristicId].indexOf(valueId) > -1) {
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

  sortChoiceButtons() {
    // overrides default DOM focus order by sorting the buttons according to task.choicesOrder
    const newChoiceButtons = [];
    this.choiceButtons
      .filter(Boolean)
      .map((button) => {
        const choiceID = button.getAttribute('data-choiceID');
        const index = this.props.task.choicesOrder.indexOf(choiceID);
        newChoiceButtons[index] = button;
      });
    this.choiceButtons = newChoiceButtons.filter(Boolean);
  }

  whatSizeThumbnails({ length }) {
    if (length <= 5) {
      return 'large';
    } else if (length <= 10) {
      return 'medium';
    } else if (length <= 20) {
      return 'small';
    } else if (this.props.task.alwaysShowThumbnails) {
      return 'small';
    } else {
      return 'none';
    }
  }

  handleFilter(characteristicId, valueId) {
    this.props.onFilter(characteristicId, valueId);
  }

  handleClearFilters() {
    this.props.task.characteristicsOrder.map(characteristicId => this.props.onFilter(characteristicId, undefined));
  }

  handleKeyDown(choiceId, e) {
    const index = this.choiceButtons.indexOf(document.activeElement);
    let newIndex;
    switch (e.which) {
    case BACKSPACE:
      this.props.onRemove(choiceId);
      e.preventDefault();
      break;
    case UP:
      newIndex = index - 1;
      if (newIndex === -1) {
        newIndex = this.choiceButtons.length - 1;
      }
      this.choiceButtons[newIndex].focus();
      e.preventDefault();
      break;
    case DOWN:
      newIndex = (index + 1) % this.choiceButtons.length;
      this.choiceButtons[newIndex].focus();
      e.preventDefault();
      break;
    default:
    }
  }

  render() {
    this.choiceButtons = [];
    const filteredChoices = this.getFilteredChoices();
    const thumbnailSize = this.whatSizeThumbnails(filteredChoices);
    const columnsCount = this.howManyColumns(filteredChoices);
    const sortedFilteredChoices = sortIntoColumns(filteredChoices, columnsCount);
    const selectedChoices = this.props.annotation.value.map(item => item.choice);
    return (
      <div className="survey-task-chooser">
        <div className="survey-task-chooser-characteristics">
          {this.props.task.characteristicsOrder.map((characteristicId, i) => {
            const characteristic = this.props.task.characteristics[characteristicId];
            const selectedValue = characteristic.values[this.props.filters[characteristicId]];
            let hasBeenAutoFocused = false;
            return (
              <TriggeredModalForm
                key={characteristicId}
                ref={`${characteristicId}-dropdown`}
                className="survey-task-chooser-characteristic-menu"
                triggerProps={{ autoFocus: i === 0 && !this.props.focusedChoice }}
                trigger={
                  <span className="survey-task-chooser-characteristic" data-is-active={!!selectedValue}>
                    <span className="survey-task-chooser-characteristic-label">
                      {selectedValue ? selectedValue.label : characteristic.label}
                    </span>
                  </span>
                  }
              >
                <div className="survey-task-chooser-characteristic-menu-container">
                  {characteristic.valuesOrder.map((valueId) => {
                    const value = characteristic.values[valueId];

                    const disabled = valueId === this.props.filters[characteristicId];
                    const autoFocus = !disabled && !hasBeenAutoFocused;
                    const selected = valueId === this.props.filters[characteristicId];

                    if (autoFocus) {
                      hasBeenAutoFocused = true;
                    }

                    return (
                      <button
                        key={valueId}
                        type="submit"
                        title={value.label}
                        className="survey-task-chooser-characteristic-value"
                        disabled={disabled}
                        data-selected={selected}
                        autoFocus={autoFocus}
                        onClick={this.handleFilter.bind(this, characteristicId, valueId)}
                      >
                        {value.image ?
                          <img
                            src={this.props.task.images[value.image]}
                            alt={value.label}
                            className="survey-task-chooser-characteristic-value-icon"
                          /> :
                          value.label
                        }
                      </button>
                    );
                  })}

                  <button
                    type="submit"
                    className="survey-task-chooser-characteristic-clear-button"
                    disabled={Object.keys(this.props.filters).indexOf(characteristicId) === -1}
                    autoFocus={!hasBeenAutoFocused}
                    onClick={this.handleFilter.bind(this, characteristicId, undefined)}
                  >
                    <Translate content="tasks.survey.clear" />
                  </button>
                </div>
                <div className="survey-task-chooser-characteristic-value-label">
                  {characteristic.valuesOrder.reduce((label, valueId) => {
                    const value = characteristic.values[valueId];
                    if (valueId === this.props.filters[characteristicId]) {
                      return value.label;
                    }
                    return label;
                  }, counterpart('tasks.survey.makeSelection'))}
                </div>
              </TriggeredModalForm>
            );
          })}
        </div>

        <div className="survey-task-chooser-choices" data-thumbnail-size={thumbnailSize} data-columns={columnsCount}>
          {sortedFilteredChoices.length === 0 && <div><em>No matches.</em></div>}
          {sortedFilteredChoices.map((choiceId, i) => {
            const choice = this.props.task.choices[choiceId];
            const chosenAlready = selectedChoices.indexOf(choiceId) > -1;
            let tabIndex = -1;
            if (i === 0 && this.props.focusedChoice.length === 0) {
              tabIndex = 0;
            }
            if (choiceId === this.props.focusedChoice) {
              tabIndex = 0;
            }
            return (
              <button
                autoFocus={choiceId === this.props.focusedChoice}
                key={choiceId}
                data-choiceID={choiceId}
                ref={button => this.choiceButtons.push(button)}
                tabIndex={tabIndex}
                type="button"
                className={`survey-task-chooser-choice-button ${chosenAlready ? 'survey-task-chooser-choice-button-chosen' : ''}`}
                onClick={this.props.onChoose.bind(null, choiceId)}
                onKeyDown={this.handleKeyDown.bind(this, choiceId)}
              >
                <span className="survey-task-chooser-choice">
                  {choice.images.length > 0 &&
                    <span
                      className="survey-task-chooser-choice-thumbnail"
                      role="presentation"
                      style={{ backgroundImage: `url('${this.props.task.images[choice.images[0]]}')` }}
                    />
                  }
                  <span className="survey-task-chooser-choice-label">{choice.label}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ textAlign: 'center' }}>
          <Translate
            content="tasks.survey.showing"
            with={{ count: sortedFilteredChoices.length, max: this.props.task.choicesOrder.length }}
          />
          &ensp;
          <button
            type="button"
            className="survey-task-chooser-characteristic-clear-button"
            disabled={Object.keys(this.props.filters).length === 0}
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
  annotation: React.PropTypes.shape({
    value: React.PropTypes.array
  }),
  filters: React.PropTypes.object,
  focusedChoice: React.PropTypes.string,
  onChoose: React.PropTypes.func,
  onFilter: React.PropTypes.func,
  onRemove: React.PropTypes.func,
  task: React.PropTypes.shape({
    alwaysShowThumbnails: React.PropTypes.bool,
    characteristics: React.PropTypes.object,
    characteristicsOrder: React.PropTypes.array,
    choices: React.PropTypes.object,
    choicesOrder: React.PropTypes.array,
    images: React.PropTypes.object,
    questions: React.PropTypes.object
  })
};

Chooser.defaultProps = {
  annotation: { value: [] },
  filters: {},
  focusedChoice: '',
  onChoose: Function.prototype,
  onFilter: Function.prototype,
  onRemove: Function.prototype,
  task: null
};

export default Chooser;
