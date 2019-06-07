import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import GenericTask from '../generic';
import DropdownEditor from './editor';

export function DropdownSummary(props) {
  function getOptionsKeys() {
    const optionsKeys = {};
    props.annotation.value.forEach((answer, i) => {
      const { id, condition } = props.task.selects[i];
      if (i === 0) {
        optionsKeys[id] = answer.value;
      } else if (answer.value === null) {
        optionsKeys[id] = null;
      } else {
        optionsKeys[id] = `${optionsKeys[condition]};${answer.value}`;
      }
    });
    return optionsKeys;
  }

  function getOptionLabel(value, i) {
    const select = props.translation.selects[i];
    const optionsKeys = getOptionsKeys();
    const optionsKey = select.condition ? optionsKeys[select.condition] : '*';
    const options = select.options[optionsKey];
    const optionSelected = options.filter(option => option.value === value);
    return optionSelected[0].label;
  }

  return (
    <div className="classification-task-summary">
      <div className="question">{props.task.instruction}</div>
      <div className="answers">
        {props.annotation.value.map((answer, i) => {
          let displayAnswer = '';
          if (answer.option) {
            displayAnswer = getOptionLabel(answer.value, i);
          } else {
            displayAnswer = answer.value;
          }
          return (<div key={i} className="answer">
            <i className="fa fa-arrow-circle-o-right" /> {props.task.selects[i].title} - {displayAnswer}
          </div>);
        })}
      </div>
    </div>);
}

DropdownSummary.propTypes = {
  task: PropTypes.shape({
    instruction: PropTypes.string,
    selects: PropTypes.array
  }),
  annotation: PropTypes.shape({
    value: PropTypes.array
  })
};

DropdownSummary.defaultProps = {
  task: {},
  annotation: {}
};

export default class DropdownTask extends React.Component {
  componentWillMount() {
    this.menus = [];
  }

  componentDidMount() {
    this.setDefaultValues();

    if (this.props.autoFocus === true) {
      this.handleFocus();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.task !== this.props.task) {
      this.setDefaultValues();
      if (this.props.autoFocus === true) {
        this.handleFocus();
      }
    }
  }

  onChangeSelect(i, option) {
    let newOption = option;
    if (!newOption) {
      newOption = { label: null, value: null };
    }
    const { value } = this.props.annotation;
    const options = this.getOptions(i);
    const newIndex = options.indexOf(newOption);

    if (newIndex === -1) {
      value[i] = { value: newOption.value, option: false };
    } else {
      value[i] = { value: newOption.value, option: true };
    }

    this.clearRelated(i);

    const newAnnotation = Object.assign({}, this.props.annotation, { value });
    this.props.onChange(newAnnotation);
  }

  setDefaultValues() {
    if (!this.props.annotation.value.length) {
      const value = this.props.task.selects.map(() => ({ option: false, value: null }));
      const newAnnotation = Object.assign({}, this.props.annotation, { value });
      this.props.onChange(newAnnotation);
    }
  }

  getOptionsKey(i, key) {
    const { selects } = this.props.task;
    const select = selects[i];
    const [parentSelect] = selects.filter(filterSelect => filterSelect.id === select.condition);
    const parentIndex = selects.indexOf(parentSelect);

    let optionsKey;
    // optionsKey is a string of option values separated with ';'.
    // the values are the option.value's for the conditional answers that have been selected which will determine which options are available in a select.
    // for example, if the selects are Country, Province (condtional to Country) and City (conditional to Province),
    // given Canada (with option.value of 'Canada-value') and Ontario (with option.value of 'ON') have been selected,
    // and we call getOptionsKey for City (getOptionsKey(2)), the first call will create an optionsKey of 'ON',
    // then because Province is conditional to Country it will call itself (getOptionsKey(1, 'ON'),
    // and on second call build and return an optionsKey of 'Canada-value;ON'.
    // this optionsKey in the City select (select.options[optionsKey]) will then provide a list cities in Ontario.

    if (this.props.annotation.value[parentIndex] && this.props.annotation.value[parentIndex].option) {
      optionsKey = this.props.annotation.value[parentIndex].value;
      if (key) {
        optionsKey = optionsKey.concat(`;${key}`);
      }
    }

    if (parentSelect.condition) {
      return this.getOptionsKey(parentIndex, optionsKey);
    }
    return optionsKey;
  }

  getOptions(i) {
    const select = this.props.translation.selects[i];
    // the root select's optionsKey is '*' by default and cannot be changed, while any other select's optionsKey is based on conditional answers selected
    const optionsKey = select.condition ? this.getOptionsKey(i) : '*';
    const options = select.options[optionsKey];
    return options || [];
  }

  getDisabledAttribute(i) {
    const { selects } = this.props.task;
    const select = selects[i];
    const [condition] = selects.filter(filterSelect => filterSelect.id === select.condition);
    const conditionIndex = selects.indexOf(condition);

    // return of true will disable select, false will enable select
    if (
      select.condition && // will return false (enable select) for root/first select, which should never be disabled
      !select.allowCreate && // will return false (enable select) if select allows create, a select with allow create should never be disabled, regagrdless of condition
      (!this.props.annotation.value[conditionIndex] || !this.props.annotation.value[conditionIndex].option)
      // will return true (disable select) if no conditional answer provided or the conditional answer provided is a custom/created answer (thereby making current select's options irrelevant)
    ) {
      return true;
    }
    return false;
  }

  handleFocus() {
    this.menus[0].focus();
  }

  clearRelated(i) {
    const { selects } = this.props.task;
    const { id } = selects[i];
    const relatedSelects = Object.keys(selects).filter(key => (
      selects[key].condition === id
    ));
    relatedSelects.map(key => (
      this.onChangeSelect(key, { label: null, value: null })
    ));
  }

  selectedOptions() {
    // return annotation values mapped to react-select option objects
    const selectedOptions = this.props.annotation.value.map((annotation, i) => {
      if (annotation.option) {
        const [selected] = this.getOptions(i).filter(option => option.value === annotation.value);
        return selected;
      } else {
        return { label: annotation.value, value: annotation.value };
      }
    });
    return selectedOptions;
  }

  render() {
    const { selects } = this.props.task;

    return (
      <GenericTask
        question={this.props.translation.instruction}
        help={this.props.translation.help}
        required={this.props.task.required}
        showRequiredNotice={this.props.showRequiredNotice}
      >
        <div>
          {selects.map((select, i) => {
            const disabled = this.getDisabledAttribute(i);
            const options = Array.from(this.getOptions(i));
            const selectedOptions = this.selectedOptions();

            let selectedOption = null;
            if (selectedOptions && selectedOptions[i] && (selectedOptions[i].value || selectedOptions[i].value === 0)) {
              selectedOption = selectedOptions[i];
            }

            let SelectComponent = Select;
            if (select.allowCreate) {
              SelectComponent = Select.Creatable;
            }

            return (
              <div id={select.id} key={select.id}>
                {(select.title !== this.props.translation.instruction) &&
                  <div>{select.title}</div>}
                <SelectComponent
                  options={options}
                  onChange={this.onChangeSelect.bind(this, i)}
                  value={selectedOption}
                  disabled={disabled}
                  noResultsText={options.length ? 'No results found' : null}
                  placeholder={disabled ? 'N/A' : 'Select...'}
                  promptTextCreator={label => `Press enter or tab for ${label}…`}
                  shouldKeyDownEventCreateNewOption={({ keyCode }) => keyCode === 9 || keyCode === 13}
                  matchPos="start"
                  matchProp="label"
                  ref={(instance) => {
                    if (!instance) {
                      return;
                    }
                    if (instance.select) {
                      this.menus[i] = instance.select;
                    } else {
                      this.menus[i] = instance;
                    }
                  }}
                />
              </div>);
          })}
        </div>
      </GenericTask>
    );
  }
}

DropdownTask.Editor = DropdownEditor;
DropdownTask.Summary = DropdownSummary;
DropdownTask.getDefaultTask = () => ({
  type: 'dropdown',
  instruction: 'Select or type an option',
  help: '',
  selects: [
    {
      id: Math.random().toString(16).split('.')[1],
      title: 'Main Dropdown',
      required: true,
      allowCreate: false,
      options: {
        '*': []
      }
    }
  ]
});
DropdownTask.getTaskText = task => (task.instruction);
DropdownTask.getDefaultAnnotation = () => ({ value: [] });
DropdownTask.isAnnotationComplete = (task, annotation) => (
  task.selects.every((select, i) => (
    !select.required ||
    (annotation.value[i] && (annotation.value[i].value || annotation.value[i].value === 0))
  ))
);

DropdownTask.propTypes = {
  annotation: PropTypes.shape({
    value: PropTypes.array
  }),
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  task: PropTypes.shape({
    required: PropTypes.bool,
    selects: PropTypes.array
  }),
  translation: PropTypes.shape({
    help: PropTypes.string,
    instruction: PropTypes.string
  })
};

DropdownTask.defaultProps = {
  annotation: {
    value: []
  },
  onChange: () => true,
  task: { selects: [] }
};
