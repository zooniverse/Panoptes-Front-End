import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { ProjectThemeButton, StyledProjectThemeButtonWrapper, StyledProjectThemeButton } from './ProjectThemeButton';

describe('ProjectThemeButton', function() {
  let wrapper;
  let toggleThemeStub;
  before(function() {
    toggleThemeStub = sinon.stub(ProjectThemeButton.prototype, 'toggleTheme').callsFake(() => {});
    wrapper = mount(<ProjectThemeButton />);
  });
  afterEach(function() {
    toggleThemeStub.resetHistory();
  });
  after(function() {
    toggleThemeStub.restore();
  })

  it('should render without crashing', function() {
    expect(wrapper).to.be.ok;
  });

  it('should render a StyledProjectThemeButtonWrapper component', function() {
    expect(wrapper.find(StyledProjectThemeButtonWrapper)).to.have.lengthOf(1);
  });

  it('should render a StyledProjectThemeButton', function() {
    expect(wrapper.find(StyledProjectThemeButton)).to.have.lengthOf(1);
  });

  it('should render a ThemeProvider component', function() {
    expect(wrapper.find('ThemeProvider')).to.have.lengthOf(1);
  });

  it('should render a Translate component', function() {
    expect(wrapper.find('Translate')).to.have.lengthOf(1);
  });

  it('should call toggleTheme when the button is clicked', function() {
    wrapper.find('button').simulate('click');
    expect(toggleThemeStub.calledOnce).to.be.true;
  });
});
