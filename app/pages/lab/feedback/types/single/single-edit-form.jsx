import React from 'react';
import Select from 'react-select';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import CommonFormHOC from '../common-form-hoc';


counterpart.registerTranslations('en', {
  singleEditForm: {
    fields: {
      answer: {
        title: 'Select correct answer',
        help: 'The correct answer in the task for this feedback type.',
        noAnswer: 'No answer'
      }
    }
  }
});

class SingleEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentWillMount() {
    this.props.updateState({
      form: {
        answerIndex: this.props.feedback.answerIndex || ''
      },
      validations: [
        (form) => (form.answerIndex && form.answerIndex !== '')
      ]
    });
  }

  render() {
    const options = this.props.task.answers.map((option, index) => ({
      label: option.label,
      value: index.toString()
    }));

    if (!this.props.task.required) {
      options.unshift({
        label: counterpart('singleEditForm.fields.answer.noAnswer'),
        value: '-1',
      });
    }

    const selected = (this.props.formState.answerIndex)
      ? options.find(option => this.props.formState.answerIndex === option.value).value
      : '';

    return (
      <label>
        <div>
          <Translate content="singleEditForm.fields.answer.title" />
        </div>
        <small className="form-help">
          <Translate content="singleEditForm.fields.answer.help" />
        </small>
        <Select
          clearable={false}
          searchable={false}
          options={options}
          onChange={this.handleSelectChange}
          value={selected}
        />
      </label>
    );
  }

  handleSelectChange(option) {
    this.props.updateState({
      form: {
        answerIndex: option.value,
      }
    })
  }
}


export default CommonFormHOC(SingleEditForm);
