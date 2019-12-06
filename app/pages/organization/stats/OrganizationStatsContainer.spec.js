/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import OrganizationStatsContainer from './OrganizationStatsContainer';

describe('OrganizationStatsContainer', function () {
  it('should render without crashing', function () {
    const wrapper = shallow(
      <OrganizationStatsContainer />
    );
  });
});
