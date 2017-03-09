import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import Shortcut from './shortcut';

describe('Shortcut', function() {
  let wrapper;
  let annotation = {
    task: 'T0',
    value: 'something'
  }
  
  it('should render with default props', function() {
    wrapper = shallow(<Shortcut />);
  });
  
  it('should update on annotation change', function() {
    wrapper = shallow(<Shortcut />);
    wrapper.setProps({annotation});
  });
});