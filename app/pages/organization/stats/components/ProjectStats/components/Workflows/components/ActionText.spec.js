/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import Translate from 'react-translate-component';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import ActionText from './ActionText';

describe('ActionText', function () {
  let wrapper;
  const handleClickSpy = sinon.spy();

  before(function () {
    wrapper = shallow(
      <ActionText
        content='organization.stats.expandWorkflowStats'
        handleClick={handleClickSpy}
      />
    );
  });

  it('should render without crashing', function () {
    expect(wrapper).to.be.ok;
  });

  it('should call handleClick on click', function () {
    wrapper.simulate('click');
    expect(handleClickSpy.calledOnce).to.be.true;
  });

  it('should render with content provided', function () {
    expect(wrapper.find(Translate).prop('content')).to.equal('organization.stats.expandWorkflowStats');
  });
});
