import PropTypes from 'prop-types';
import React from 'react';
import TriggeredModalForm from 'modal-form/triggered';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

class CharacteristicsFilter extends React.Component {
  handleFilter(characteristicId, valueId) {
    this.props.onFilter(characteristicId, valueId);
  }

  render() {
    const { task, translation, filters } = this.props;
    return (
      <div className="survey-task-chooser-characteristics">
        {task.characteristicsOrder.map((characteristicId, i) => {
          const characteristic = task.characteristics[characteristicId];
          const selectedValue = characteristic.values[filters[characteristicId]];
          const characteristicStrings = translation.characteristics[characteristicId];
          const selectedValueStrings = characteristicStrings.values[filters[characteristicId]];
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
                    {selectedValue ? selectedValueStrings.label : characteristicStrings.label}
                  </span>
                </span>
                }
            >
              <div className="survey-task-chooser-characteristic-menu-container">
                {characteristic.valuesOrder.map((valueId) => {
                  const value = characteristic.values[valueId];
                  const valueStrings = characteristicStrings.values[valueId];
                  const disabled = (valueId === filters[characteristicId]);
                  const autoFocus = (!disabled && !hasBeenAutoFocused);
                  const selected = (valueId === filters[characteristicId]);

                  if (autoFocus) {
                    hasBeenAutoFocused = true;
                  }

                  return (
                    <button
                      key={valueId}
                      type="submit"
                      title={valueStrings.label}
                      className="survey-task-chooser-characteristic-value"
                      disabled={disabled}
                      data-selected={selected}
                      autoFocus={autoFocus}
                      onClick={this.handleFilter.bind(this, characteristicId, valueId)}
                    >
                      {value.image ?
                        <img
                          src={task.images[value.image]}
                          alt={valueStrings.label}
                          className="survey-task-chooser-characteristic-value-icon"
                        /> :
                        valueStrings.label
                      }
                    </button>
                  );
                })}

                <button
                  type="submit"
                  className="survey-task-chooser-characteristic-clear-button"
                  disabled={Object.keys(filters).indexOf(characteristicId) === -1}
                  autoFocus={!hasBeenAutoFocused}
                  onClick={this.handleFilter.bind(this, characteristicId, undefined)}
                >
                  <Translate content="tasks.survey.clear" />
                </button>
              </div>
              <div className="survey-task-chooser-characteristic-value-label">
                {characteristic.valuesOrder.reduce((label, valueId) => {
                  const valueStrings = characteristicStrings.values[valueId];
                  if (valueId === filters[characteristicId]) {
                    return valueStrings.label;
                  }
                  return label;
                }, counterpart('tasks.survey.makeSelection'))}
              </div>
            </TriggeredModalForm>
          );
        })}
      </div>
    );
  }
}

CharacteristicsFilter.propTypes = {
  filters: PropTypes.object,
  focusedChoice: PropTypes.string,
  onFilter: PropTypes.func,
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

CharacteristicsFilter.defaultProps = {
  filters: {},
  focusedChoice: '',
  onFilter: Function.prototype,
  task: null
};

export default CharacteristicsFilter;
