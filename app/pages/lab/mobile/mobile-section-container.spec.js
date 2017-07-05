/* eslint 
  prefer-arrow-callback: 0, 
  func-names: 0, 
  'react/jsx-boolean-value': ['error', 'always'], 
  'react/jsx-filename-extension': 0 
*/

/* global describe, it */

import MobileSectionContainer from './mobile-section-container';
import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import * as fixtures from './mobile-section-container.fixtures';

let wrapper;

describe('<MobileSectionContainer />', function () {

  describe('rendering', function () {

    it('should render without crashing', function () {
      shallow(<MobileSectionContainer task={fixtures.defaultTask} />);
    });

    it('should render the <MobileSection /> component if the task type is single or multiple', function () {
      wrapper = shallow(<MobileSectionContainer task={fixtures.defaultTask} />);
      assert.strictEqual(wrapper.find('MobileSection').length, 1);
    });

    it('should render nothing if the task type isn\'t single or multiple', function () {
      const task = fixtures.createTask({ type: 'drawing' });
      wrapper = shallow(<MobileSectionContainer task={task} />);
      assert.strictEqual(wrapper.type(), null);
    });

  });

});
