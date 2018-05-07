/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import { expect } from 'chai';
import TutorialTab from './TutorialTab';

const tutorial = {
  steps: [
    { content: 'Step 1', media: '' }
  ]
};

const store = {
  subscribe: () => { },
  dispatch: () => { },
  getState: () => ({ userInterface: { theme: 'light' } })
};

const mockReduxStore = {
  context: { store },
  childContextTypes: { store: PropTypes.object.isRequired }
};

describe('TutorialTab', function() {
  let wrapper;
  before(function () {
    wrapper = mount(<TutorialTab tutorial={tutorial} />, mockReduxStore);
  });
  it('should render without crashing', function() {
    expect(wrapper).to.be.ok;
  });

  it('should render a ThemeProvider', function() {
    expect(wrapper.find('ThemeProvider')).to.have.lengthOf(1);
  });

  it('should render a Translate component', function() {
    expect(wrapper.find('Translate')).to.have.lengthOf(1);
  });

  it('should disable the button if there isn\'t a tutorial', function() {
    wrapper.setProps({ tutorial: null });
    expect(wrapper.find('button').props().disabled).to.be.true;
  });

  it('should disable the button if the tutorial has no steps', function() {
    wrapper.setProps({ tutorial: { steps: [] }});
    expect(wrapper.find('button').props().disabled).to.be.true;
  });

  it('should enable the button if the tutorial has steps', function() {
    wrapper.setProps({ tutorial });
    expect(wrapper.find('button').props().disabled).to.be.false;
  });
});
