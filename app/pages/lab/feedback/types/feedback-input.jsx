import React, { PropTypes } from 'react';

const FeedbackInput = (props) => {
  const { field, title, help, value, onChange } = props;
  const { id, type, disabled } = field;

  const propsWrapper = {
    id,
    title,
    help,
    inputProps: {
      type: type || 'text',
      name: id,
      disabled,
      onChange
    }
  };

  if (['text', 'number'].includes(propsWrapper.inputProps.type)) {
    propsWrapper.inputProps.className = 'standard-input full';
    propsWrapper.inputProps.value = value;
  }

  if (type === 'checkbox') {
    propsWrapper.inputProps.checked = value;
  }

  const isCheckbox = type === 'checkbox';
  return (isCheckbox) ? <FeedbackInputCheckbox {...propsWrapper} /> : <FeedbackInputEverythingElse {...propsWrapper} />;
};

FeedbackInput.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool
  }),
  title: PropTypes.string,
  help: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onChange: PropTypes.func
};

const FeedbackInputCheckbox = ({ id, title, help, inputProps }) => {
  const labelId = `feedback-input-${id}`;
  return (
    <div key={id}>
      <label htmlFor={labelId}>
        <input id={labelId} {...inputProps} />
        {title}
      </label>
      <small className="form-help">
        {help}
      </small>
    </div>
  );
};

const FeedbackInputEverythingElse = ({ id, title, help, inputProps }) => {
  const labelId = `feedback-input-${id}`;
  return (
    <div key={id}>
      <label htmlFor={labelId}>
        {title}
      </label>
      <small className="form-help">
        {help}
      </small>
      <input id={labelId} {...inputProps} />
    </div>
  );
};

const feedbackInputPropTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  help: PropTypes.string,
  inputProps: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string,
    value: PropTypes.string,
    checked: PropTypes.bool
  })
};

FeedbackInputCheckbox.propTypes = feedbackInputPropTypes;
FeedbackInputEverythingElse.propTypes = feedbackInputPropTypes;

export default FeedbackInput;
