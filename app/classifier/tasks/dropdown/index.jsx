import PropTypes from 'prop-types';
import React from 'react';
import Select from 'react-select';
import GenericTask from '../generic';
import DropdownEditor from './editor';

export const DropdownSummary = (props) => {
  const getOptionsKeys = () => {
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
  };

  const getOptionLabel = (value, i) => {
    const select = props.task.selects[i];
    const optionsKeys = getOptionsKeys();
    const optionsKey = select.condition ? optionsKeys[select.condition] : '*';
    const options = select.options[optionsKey];
    const optionSelected = options.filter(option => option.value === value);
    return optionSelected[0].label;
  };

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
};

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
    const select = this.props.task.selects[i];
    const optionsKey = select.condition ? this.getOptionsKey(i) : '*';
    const options = select.options[optionsKey];
    return options || [];
  }

  getDisabledAttribute(i) {
    const { selects } = this.props.task;
    const select = selects[i];
    const [condition] = selects.filter(filterSelect => filterSelect.id === select.condition);
    const conditionIndex = selects.indexOf(condition);

    if (
      select.condition &&
      !select.allowCreate &&
      (!this.props.annotation.value[conditionIndex] || !this.props.annotation.value[conditionIndex].option)
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
    const selectedOptions = [];
    this.props.annotation.value.map((annotation, i) => {
      if (annotation.option) {
        const [selected] = this.getOptions(i).filter(option => option.value === annotation.value);
        selectedOptions[i] = selected;
      } else {
        selectedOptions[i] = { label: annotation.value, value: annotation.value };
      }
    });
    return selectedOptions;
  }

  render() {
    const { selects } = this.props.task;

    return (
      <GenericTask
        question={this.props.task.instruction}
        help={this.props.task.help}
        required={this.props.task.required}
      >
        <div>
          {selects.map((select, i) => {
            const disabled = this.getDisabledAttribute(i);
            const options = Array.from(this.getOptions(i));
            const selectedOptions = this.selectedOptions();

            let selectedOption = null;
            if (selectedOptions && selectedOptions[i] && selectedOptions[i].value) {
              selectedOption = selectedOptions[i];
            }

            let SelectComponent = Select;
            if (select.allowCreate) {
              SelectComponent = Select.Creatable;
            }

            return (
              <div id={select.id} key={select.id}>
                {(select.title !== this.props.task.instruction) &&
                  <div>{select.title}</div>}
                <SelectComponent
                  options={options}
                  onChange={this.onChangeSelect.bind(this, i)}
                  value={selectedOption}
                  disabled={disabled}
                  noResultsText={options.length ? 'No results found' : null}
                  placeholder={disabled ? 'N/A' : 'Select...'}
                  promptTextCreator={label => `Press enter for ${label}…`}
                  shouldKeyDownEventCreateNewOption={({ keyCode }) => keyCode === 13}
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
    (annotation.value[i] && annotation.value[i].value)
  ))
);

DropdownTask.propTypes = {
  annotation: PropTypes.shape({
    value: PropTypes.array
  }),
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  task: PropTypes.shape({
    help: PropTypes.string,
    instruction: PropTypes.string,
    required: PropTypes.bool,
    selects: PropTypes.array
  })
};

DropdownTask.defaultProps = {
  task: { selects: [] }
};
