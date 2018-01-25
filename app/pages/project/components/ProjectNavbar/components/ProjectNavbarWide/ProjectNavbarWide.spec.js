/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ProjectNavbarWide, { StyledAvatar, StyledWrapper, StyledHeaderWide, StyledNavLink, Nav } from './ProjectNavbarWide';

const MOCK_LINKS = [{ url: 'https://www.google.com' }, { url: 'https://www.yahoo.com' }];

describe('ProjectNavbarWide', function() {
  let wrapper;
  before(function() {
    wrapper = shallow(<ProjectNavbarWide navLinks={MOCK_LINKS} />);
  });

  it('should render without crashing', function() {});

  it('should render a StyledHeaderWide component', function() {
    expect(wrapper.find(StyledHeaderWide)).to.have.lengthOf(1);
  });

  it('should render a Background component', function () {
    expect(wrapper.find('Background')).to.have.lengthOf(1);
  });

  it('should render a StyledWrapper component', function () {
    expect(wrapper.find(StyledWrapper)).to.have.lengthOf(1);
  });

  it('should render a StyledAvatar component', function () {
    expect(wrapper.dive().find(StyledAvatar)).to.have.lengthOf(1);
  });

  it('should render a ProjectTitle component', function () {
    expect(wrapper.find('ProjectTitle')).to.have.lengthOf(1);
  });

  it('should render a Nav component', function () {
    expect(wrapper.find(Nav)).to.have.lengthOf(1);
  });

  it('should render StyledNavLink components equal to props.navLinks length', function () {
    expect(wrapper.find(StyledNavLink)).to.have.lengthOf(MOCK_LINKS.length);
  });
});
