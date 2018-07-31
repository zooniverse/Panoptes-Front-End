import PropTypes from 'prop-types';

export const store = {
  subscribe: () => { },
  dispatch: () => { },
  getState: () => ({ userInterface: { theme: 'light' } })
};

export const mockReduxStore = {
  context: { store },
  childContextTypes: { store: PropTypes.object.isRequired }
};

export const radioTypeAnnotation = {
  _key: 1,
  task: 'T0',
  value: null
};

export const checkboxTypeAnnotation = {
  _key: 1,
  task: 'T0',
  value: []
};

export const textTypeAnnotation = {
  _key: 1,
  task: 'T0',
  value: ''
};

export const radioTypeTask = {
  question: 'Is there something here?',
  answers: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ],
  required: true
};

export const checkboxTypeTask = {
  question: 'Is there something here?',
  answers: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
    { label: 'Maybe', value: 'maybe' }
  ],
  required: true
};

export const textTypeTask = {
  instruction: 'Enter some text.',
  required: true,
  text_tags: ['deletion', 'insertion', 'unclear']
};
