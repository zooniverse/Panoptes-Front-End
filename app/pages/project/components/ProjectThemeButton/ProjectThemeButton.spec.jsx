import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { ProjectThemeButton, StyledProjectThemeButtonWrapper, StyledProjectThemeButton } from './ProjectThemeButton';

describe('ProjectThemeButton', () => {
  let wrapper;
  let toggleThemeStub;
  before(() => {
    toggleThemeStub = sinon.stub(ProjectThemeButton.prototype, 'toggleTheme').callsFake(() => {});
    wrapper = mount(<ProjectThemeButton />);
  });
  afterEach(() => {
    toggleThemeStub.resetHistory();
  });
  after(() => {
    toggleThemeStub.restore();
  });

  it('should render without crashing', () => {
    expect(wrapper).to.be.ok;
  });

  it('should render a StyledProjectThemeButtonWrapper component', () => {
    expect(wrapper.find(StyledProjectThemeButtonWrapper)).to.have.lengthOf(1);
  });

  it('should render a StyledProjectThemeButton', () => {
    expect(wrapper.find(StyledProjectThemeButton)).to.have.lengthOf(1);
  });

  it('should render a ThemeProvider component', () => {
    expect(wrapper.find('ThemeProvider')).to.have.lengthOf(1);
  });

  it('should render a Translate component', () => {
    expect(wrapper.find('Translate')).to.have.lengthOf(1);
  });

  it('should call toggleTheme when the button is clicked', () => {
    wrapper.find('button').simulate('click');
    expect(toggleThemeStub.calledOnce).to.be.true;
  });
});
