/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import Translate from 'react-translate-component';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import Parameters, { StyledResetButton } from './Parameters';
import Select from './Select';

describe('Parameters', function () {
  let wrapper;
  const handleResetSpy = sinon.spy();

  before(function () {
    wrapper = shallow(
      <Parameters
        handleReset={handleResetSpy}
        type="classification"
      />
    );
  });

  it('should render without crashing', function () {
    expect(wrapper).to.be.ok;
  });

  it('should render binBy Select', function () {
    expect(wrapper.find(Select).at(0).prop('selectFor')).to.equal('binBy');
  });

  it('should render resource Select', function () {
    expect(wrapper.find(Select).at(1).prop('selectFor')).to.equal('resourceId');
  });

  it('should render range minimum Select', function () {
    expect(wrapper.find(Select).at(2).prop('selectFor')).to.equal('rangeMin');
  });

  it('should render range maximum Select', function () {
    expect(wrapper.find(Select).at(3).prop('selectFor')).to.equal('rangeMax');
  });

  it('should render Reset button', function () {
    expect(wrapper.find(StyledResetButton)).to.have.lengthOf(1);
  });

  it('should call handleReset on Reset button click', function () {
    wrapper.find(StyledResetButton).simulate('click');
    expect(handleResetSpy.calledOnce).to.be.true;
  });

  it('should not render hourly warning if binBy is not hour', function () {
    wrapper.setProps({ binBy: 'day' });
    expect(wrapper.find(Translate).filterWhere(n => n.prop('content') === 'organization.stats.hourly'))
      .to.have.lengthOf(0);
  });

  it('should render hourly warning if binBy is hour', function () {
    wrapper.setProps({ binBy: 'hour' });
    expect(wrapper.find(Translate).filterWhere(n => n.prop('content') === 'organization.stats.hourly'))
      .to.have.lengthOf(1);
  });
});
