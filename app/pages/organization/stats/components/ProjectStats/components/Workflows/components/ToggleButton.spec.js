/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import ToggleButton from './ToggleButton';

describe('ToggleButton', function () {
  let wrapper;
  const handleClickSpy = sinon.spy();

  before(function () {
    wrapper = shallow(
      <ToggleButton
        icon={<i className="fa fa-chevron-down fa-lg" />}
        handleClick={handleClickSpy}
        label='expand workflow list'
      />
    );
  });

  it('should render without crashing', function () {});

  it('should render with icon provided', function () {
    expect(wrapper.containsMatchingElement(<i className="fa fa-chevron-down fa-lg" />)).to.equal(true);
  });

  it('should call handleClick on click', function () {
    wrapper.simulate('click');
    expect(handleClickSpy.calledOnce).to.be.true;
  });

  it('should render with label provided', function () {
    expect(wrapper.prop('aria-label')).to.equal('expand workflow list');
  });
});
