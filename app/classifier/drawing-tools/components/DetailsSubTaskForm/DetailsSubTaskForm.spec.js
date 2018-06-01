/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import PropTypes from 'prop-types';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import DetailsSubTaskForm from './DetailsSubTaskForm';
import tasks from '../../../tasks';

const store = {
  subscribe: () => { },
  dispatch: () => { },
  getState: () => ({
    translations: {
      languages: {},
      locale: "en",
      strings: { workflow: {}}
    },
    userInterface: { theme: 'light' }
  })
};

const mockReduxStore = {
  context: { store },
  childContextTypes: { store: PropTypes.object.isRequired }
};

const toolProps = {
  annotations: [],
  color: "#00ff00",
  containerRect: {},
  details: [{
    _key: 0.41412246953808407,
    answers: [{ label: 'yes' }, { label: 'no' }],
    help: "",
    question: "Is this fragmentary?",
    required: false,
    type: "multiple"
  }],
  disabled: false,
  mark: {
    _inProgress: false,
    _key: 0.4139859318882131,
    details: [{ value: [] }],
    frame: 0,
    tool: 0,
    x: 547.92529296875,
    y: 62.75926208496094
  },
  scale: {},
  selected: true,
  size: "large",
  taskKey: "T0"
};

describe.only('DetailsSubTaskForm', function() {
  let wrapper;
  before(function() {
    wrapper = shallow(<DetailsSubTaskForm tasks={tasks} toolProps={toolProps} />, mockReduxStore);
  });

  it('should render without crashing', function() {
    expect(wrapper).to.be.ok;
  });

  it('should render a StickyModalForm component', function() {
    expect(wrapper.find('StickyModalForm')).to.have.lengthOf(1);
  });

  it('should render a Provider component', function() {
    expect(wrapper.find('Provider')).to.have.lengthOf(1);
  });

  it('should render a ModalFocus component', function() {
    expect(wrapper.find('ModalFocus')).to.have.lengthOf(1);
  });
});
