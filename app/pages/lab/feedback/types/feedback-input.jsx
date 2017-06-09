import React from 'react';

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

  return (type === 'checkbox')
    ? <FeedbackInputCheckbox {...propsWrapper} />
    : <FeedbackInputEverythingElse {...propsWrapper} />;
};

const FeedbackInputCheckbox = ({ id, title, help, inputProps }) => {
  return (
    <div key={id}>
      <label>
        <input {...inputProps} />
        {title}
      </label>
      <small className="form-help">
        {help}
      </small>
    </div>
  );
}

const FeedbackInputEverythingElse = ({ id, title, help, inputProps }) => {
  return (
    <div key={id}>
      <label>
        {title}
      </label>
      <small className="form-help">
        {help}
      </small>
      <input {...inputProps} />
    </div>
  );
}

export default FeedbackInput;
