import React, { Component, PropTypes } from 'react';
import counterpart from 'counterpart';
import CommonFormHOC from '../common-form-hoc';
import FeedbackInput from '../feedback-input';

/* eslint-disable max-len */
counterpart.registerTranslations('en', {
  PointEditForm: {
    fields: {
      dud: {
        title: 'No markings',
        help: 'Check this box if there should be no annotations on this feedback type (also known as a dud).'
      },
      tol: {
        title: 'Default tolerance',
        help: 'The radius around the point that counts as a correct classification. Can be overridden using subject metadata.'
      }
    }
  }
});
/* eslint-enable max-len */

class PointEditForm extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    this.props.updateState({
      form: {
        dud: (typeof this.props.feedback.dud === 'boolean') ? this.props.feedback.dud : false,
        tol: this.props.feedback.tol || ''
      },
      validations: [
        form => (form.dud || (!form.dud && form.tol && form.tol !== ''))
      ]
    });
  }

  handleInputChange({ target }) {
    this.props.updateState({
      form: {
        [target.name]: (target.type === 'checkbox') ? target.checked : target.value
      }
    });
  }

  render() {
    const fields = [
      { id: 'dud', type: 'checkbox' },
      { id: 'tol', type: 'number', disabled: this.props.formState.dud }
    ];

    return (
      <div>
        {fields.map(field =>
          <FeedbackInput
            key={`feedback-input-${field.id}`}
            field={field}
            title={counterpart(`PointEditForm.fields.${field.id}.title`)}
            help={counterpart(`PointEditForm.fields.${field.id}.help`)}
            value={this.props.formState[field.id]}
            onChange={this.handleInputChange.bind(this)}
          />
        )}
      </div>
    );
  }
}

PointEditForm.propTypes = {
  updateState: PropTypes.func,
  feedback: PropTypes.shape({
    dud: PropTypes.bool,
    tol: PropTypes.string
  }),
  formState: PropTypes.shape({
    dud: PropTypes.bool
  })
};

export default CommonFormHOC(PointEditForm);
