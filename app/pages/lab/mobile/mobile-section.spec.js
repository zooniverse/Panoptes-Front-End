/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: 0,
  no-shadow: 0,
  prefer-arrow-callback: 0,
  prefer-const: 0,
  'react/jsx-boolean-value': ['error', 'always'],
  'react/jsx-filename-extension': 0
*/

/* global describe, it, beforeEach, afterEach */

import { mount } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import assert from 'assert';
import MobileSection from './mobile-section';

let checkbox;
let wrapper;
const toggleChecked = sinon.spy();

function setup(props = {}) {
  wrapper = mount(<MobileSection
    checked={true}
    enabled={true}
    toggleChecked={toggleChecked}
    validations={{}}
    {...props}
  />);
  checkbox = wrapper.find('input[type="checkbox"]').first();
}

function tearDown() {
  wrapper = null;
}

describe('<MobileSection />', function () {
  beforeEach(setup);
  afterEach(tearDown);

  it('should render without crashing', function () {
    assert.strictEqual(wrapper.length, 1);
  });

  describe('checkbox', function () {
    beforeEach(setup);
    afterEach(tearDown);

    it('should exist', function () {
      assert.strictEqual(checkbox.length, 1);
    });

    it('should be enabled if the enabled prop is true', function () {
      assert.strictEqual(checkbox.prop('disabled'), false);
    });

    it('should be disabled if the enabled prop is false', function () {
      setup({ enabled: false });
      assert.strictEqual(checkbox.prop('disabled'), true);
    });

    it('should be checked if the checked prop is true', function () {
      assert.strictEqual(checkbox.prop('checked'), true);
    });

    it('should be unchecked if the checked prop is false', function () {
      setup({ checked: false });
      assert.strictEqual(checkbox.prop('checked'), false);
    });

    it('should call toggleChecked on change', function () {
      checkbox.simulate('change');
      assert.strictEqual(toggleChecked.called, true);
    });
  });
});
