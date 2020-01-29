/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import Translate from 'react-translate-component';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import SectionHeading, { StyledSectionHeading } from './SectionHeading';
import LoadingIndicator from '../../../../components/loading-indicator';

describe('SectionHeading', function () {
  it('should render without crashing', function () {
    shallow(<SectionHeading />);
  });

  it('should render StyledSectionHeading', function () {
    const wrapper = shallow(<SectionHeading content="organization.stats.byTheNumbers" />);
    expect(wrapper.find(Translate).prop('component')).to.equal(StyledSectionHeading);
  });

  it('should not render a LoadingIndicator if not loading', function () {
    const wrapper = shallow(<SectionHeading loading={false} type="classification" />);
    expect(wrapper.find(LoadingIndicator)).to.have.lengthOf(0);
  });

  it('should render LoadingIndicator if loading', function () {
    const wrapper = shallow(<SectionHeading loading={true} type="classification" />);
    expect(wrapper.find(LoadingIndicator)).to.have.lengthOf(1);
  });
});
