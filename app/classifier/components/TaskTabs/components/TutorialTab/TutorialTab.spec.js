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
import TutorialTab, { StyledRestartButton } from './TutorialTab';

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

  it('should render a StyledRestartButton', function() {
    expect(wrapper.find(StyledRestartButton)).to.have.length(1);
  });

  it('should render a Translate component', function() {
    expect(wrapper.find('Translate')).to.have.lengthOf(1);
  });
});
