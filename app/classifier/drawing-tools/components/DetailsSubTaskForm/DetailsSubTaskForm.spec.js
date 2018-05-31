/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import DetailsSubTaskForm from './DetailsSubTaskForm';
import tasks from '../../../tasks';

const store = {
  subscribe: () => { },
  dispatch: () => { },
  getState: () => ({ userInterface: { theme: 'light' } })
};

const mockReduxStore = {
  context: { store },
  childContextTypes: { store: PropTypes.object.isRequired }
};

const tasks
toolProps: {
  details: [],
    taskKey: '',
      mark: { }
}

describe('DetailsSubTaskForm', function() {
  let wrapper;
  before(function() {
    wrapper = mount(<DetailsSubTaskForm />, mockReduxStore);
  });

  it('should render without crashing', function() {
    expect(wrapper).to.be.ok;
  });

  it('should render a StickyModalForm component', function() {
    expect(wrapper.find('StickyModalForm')).to.have.lengthOf(1);
  });

  it('should render a Provider component', function() {
    expect(wrapper.find('Provider')).to.have.length(1);
  });

  it('should')
});
