/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import BarChartBlock from './BarChartBlock';
import SectionHeading from '../SectionHeading';
import Graph from './components/Graph';
import Parameters from './components/Parameters';

describe('BarChartBlock', function () {
  let wrapper;
  before(function () {
    wrapper = shallow(<BarChartBlock type="classification" />);
  });

  it('should render without crashing', function () {
    expect(wrapper).to.be.ok;
  });

  it('should render SectionHeading', function () {
    expect(wrapper.find(SectionHeading)).to.have.lengthOf(1);
    expect(wrapper.find(SectionHeading).prop('content')).to.equal('organization.stats.classification');
  });

  it('should render Graph', function () {
    expect(wrapper.find(Graph)).to.have.lengthOf(1);
  });

  it('should render Parameters', function () {
    expect(wrapper.find(Parameters)).to.have.lengthOf(1);
  });
});
