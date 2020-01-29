/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import Select, { HiddenLabel, StyledSelect } from './Select';
import { binByOptions } from './Parameters';

describe('Select', function () {
  let wrapper;
  const handleChangeSpy = sinon.spy();

  before(function () {
    wrapper = shallow(
      <Select
        current="day"
        handleChange={handleChangeSpy}
        options={binByOptions}
        selectFor="binBy"
      />
    );
  });

  it('should render without crashing', function () {
    expect(wrapper).to.be.ok;
  });

  it('should render HiddenLabel', function () {
    expect(wrapper.find(HiddenLabel)).to.have.lengthOf(1);
    expect(wrapper.find(HiddenLabel).prop('htmlFor')).to.equal('binBy-select-day');
    expect(wrapper.find(HiddenLabel).text()).to.equal('Select binBy');
  });

  it('should render StyledSelect', function () {
    expect(wrapper.find(StyledSelect)).to.have.lengthOf(1);
    expect(wrapper.find(StyledSelect).prop('id')).to.equal('binBy-select-day');
    expect(wrapper.find(StyledSelect).prop('value')).to.equal('day');
  });

  it('should render options', function () {
    expect(wrapper.find(StyledSelect).children()).to.have.lengthOf(binByOptions.length);
  });

  it('should call handleSelectChange on select change', function () {
    const select = wrapper.find(StyledSelect);
    select.simulate('change', { target: { value: 'month' }});
    expect(handleChangeSpy.calledOnceWith('month', 'binBy')).to.be.true;
  });
});
