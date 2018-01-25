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
import NarrowMenuButton, { OpenMenuButton } from './NarrowMenuButton';
import en from '../../../../../../locales/en';

describe('NarrowMenuButton', function() {
  let wrapper;
  const onClickSpy = sinon.spy();
  before(function() {
    wrapper = shallow(<NarrowMenuButton onClick={onClickSpy} />);
  });

  it('should render without crashing', function() {});

  it('should use the ThemeProvider', function() {
    expect(wrapper.find('ThemeProvider')).to.have.lengthOf(1);
  });

  it('should render an OpenMenuButton', function() {
    expect(wrapper.find(OpenMenuButton)).to.have.lengthOf(1);
  });

  it('should call props.onClick on click', function() {
    wrapper.find(OpenMenuButton).simulate('click');
    expect(onClickSpy.calledOnce).to.be.true;
  });

  it('should use project.nav.exploreProject English string as the default label', function() {
    expect(wrapper.dive().html().includes(en.project.nav.exploreProject)).to.be.true;
  });

  describe('when props.open is false', function() {
    let icon;
    before(function() {
      icon = wrapper.find('i');
    });

    it('should use font awesome arrow down if props.open is false', function () {
      expect(icon.hasClass('fa-angle-down')).to.be.true;
      expect(icon.hasClass('fa-angle-up')).to.be.false;
    });

    it('should not add the open class to OpenMenuButton', function() {
      expect(wrapper.find(OpenMenuButton).hasClass('open')).to.be.false;
    });
  });

  describe('when props.open is true', function() {
    let icon;
    before(function() {
      wrapper.setProps({ open: true });
      icon = wrapper.find('i');
    });

    it('should use font awesome arrow up if props.open is true', function () {
      expect(icon.hasClass('fa-angle-up')).to.be.true;
      expect(icon.hasClass('fa-angle-down')).to.be.false;
    });

    it('should add the open class to OpenMenuButton', function() {
      expect(wrapper.find(OpenMenuButton).hasClass('open')).to.be.true;
    });
  });
});
