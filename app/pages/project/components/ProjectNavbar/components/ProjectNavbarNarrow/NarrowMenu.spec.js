/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import NarrowMenu, { MenuWrapper, Menu, StyledNavLink } from './NarrowMenu';

const MOCK_LINKS = [{ url: 'https://www.google.com' }, { url: 'https://www.yahoo.com' }];

describe('NarrowMenu', function() {
  let wrapper;
  const toggleMenuFnSpy = sinon.spy();
  before(function() {
    wrapper = shallow(<NarrowMenu toggleMenuFn={toggleMenuFnSpy} />);
  });

  it('should render without crashing', function() {});

  it('should render a MenuWrapper component', function() {
    expect(wrapper.find(MenuWrapper)).to.have.lengthOf(1);
  });

  it('should render a Menu component', function() {
    expect(wrapper.find(Menu)).to.have.lengthOf(1);
  });

  it('should wrap the Menu component with the ThemeProvider', function() {
    expect(wrapper.find('ThemeProvider')).to.have.lengthOf(1);
  });

  it('should render a StyledNavLink', function() {
    expect(wrapper.find(StyledNavLink)).to.have.lengthOf(1);
  });

  it('should render StyledNavLinks equal to the length of props.links', function() {
    wrapper.setProps({ links: MOCK_LINKS });
    expect(wrapper.find(StyledNavLink)).to.have.lengthOf(MOCK_LINKS.length);
  });

  it('should use props.toggleMenuFn on click', function() {
    wrapper.find(StyledNavLink).first().simulate('click');
    expect(toggleMenuFnSpy.calledOnce).to.be.true;
    wrapper.find(StyledNavLink).last().simulate('click');
    expect(toggleMenuFnSpy.calledTwice).to.be.true;
  });

  it('should add the open class to MenuWrapper if props.open is true', function() {
    expect(wrapper.find(MenuWrapper).hasClass('open')).to.be.true;
  });

  it('should not add the open class to MenuWrapper if props.open is false', function () {
    wrapper.setProps({ open: false });
    expect(wrapper.find(MenuWrapper).hasClass('open')).to.be.false;
  });
});
