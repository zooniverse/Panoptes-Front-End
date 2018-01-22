/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */
import React from 'react';
import WarningBanner from './warning-banner';
import assert from 'assert';
import { shallow } from 'enzyme';

describe('WarningBanner', function () {
  let wrapper;

  beforeEach(function () {
    wrapper = shallow(
      <WarningBanner label="testing">
        <p>Some test text.</p>
      </WarningBanner>
    );
  });

  it('should render without crashing', function () {
  });

  it('should pass label and children to TriggeredModalForm', function () {
    assert.equal(wrapper.getElement().props.trigger, 'testing');
    assert.equal(wrapper.getElement().props.children.type, 'p');
    assert.equal(wrapper.getElement().props.children.props.children, 'Some test text.');
  });
});
