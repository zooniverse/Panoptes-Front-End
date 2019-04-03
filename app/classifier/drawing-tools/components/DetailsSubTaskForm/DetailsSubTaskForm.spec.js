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
import sinon from 'sinon';
import { DetailsSubTaskForm } from './DetailsSubTaskForm';
import tasks from '../../../tasks';

const store = {
  subscribe: () => { },
  dispatch: () => { },
  getState: () => ({
    classify: {
      workflow: {
        id: 'a'
      }
    },
    translations: {
      languages: {},
      locale: 'en',
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
  onChange: sinon.stub().callsFake(() => {}),
  scale: {},
  selected: true,
  size: "large",
  taskKey: "T0"
};

const translations = {
  languages: {},
  locale: 'en',
  strings: { workflow: {}}
}

describe('DetailsSubTaskForm', function() {
  describe('render', function() {
    let wrapper;
    before(function () {
      wrapper = shallow(<DetailsSubTaskForm
        tasks={tasks}
        translations={translations}
        toolProps={toolProps}
        workflow={{ id: 'a' }}
      />, mockReduxStore);
    });

    it('should render without crashing', function () {
      expect(wrapper).to.be.ok;
    });
  });
});
