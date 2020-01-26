/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import Translate from 'react-translate-component';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import SectionHeading, { StyledSectionHeading } from './SectionHeading';

describe('SectionHeading', function () {
  it('should render without crashing', function () {
    shallow(<SectionHeading />);
  });

  it('should render StyledSectionHeading', function () {
    const wrapper = shallow(<SectionHeading content="organization.stats.byTheNumbers" />);
    expect(wrapper.find(Translate).prop('component')).to.equal(StyledSectionHeading);
  });
});
