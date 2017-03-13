import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import tasks from './';

for (const key in tasks) {
  const TaskComponent = tasks[key];
  describe('Task ' + key, function() {
    let wrapper;
  
    it('should render with default props', function() {
      wrapper = shallow(<TaskComponent />);
    });
  });
}
