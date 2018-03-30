/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import BackButton, {
  StyledBackButton,
  StyledBackButtonWrapper,
  StyledBackButtonToolTip
} from './BackButton';

describe('BackButton', function() {
  describe('rendering', function() {
    let wrapper;
    before(function() {
      wrapper = mount(<BackButton />);
    });

    it('should render without crashing', function () {
      expect(wrapper).to.be.ok;
    });

    it('should render a ThemeProvider', function() {
      expect(wrapper.find('ThemeProvider')).to.have.lengthOf(1);
    });

    it('should render a StyledBackButtonWrapper', function() {
      expect(wrapper.find(StyledBackButtonWrapper)).to.have.lengthOf(1);
    });

    it('should render a StyledBackButton', function() {
      expect(wrapper.find(StyledBackButton)).to.have.lengthOf(1);
    });

    it('should render a Translate component', function() {
      expect(wrapper.find('Translate')).to.have.lengthOf(1);
    });
  });

  describe('onClick event', function() {
    let wrapper;
    let destroyCurrentAnnotationSpy;
    before(function () {
      destroyCurrentAnnotationSpy = sinon.spy();
      wrapper = mount(<BackButton showButton={true} destroyCurrentAnnotation={destroyCurrentAnnotationSpy} />);
    });

    it('should call props.destroyCurrentAnnotation on the onClick event', function() {
      wrapper.find('button').simulate('click');
      expect(destroyCurrentAnnotationSpy.calledOnce).to.be.true;
    });
  });

  describe('StyledBackButtonToolTip behavior', function() {
    let wrapper;
    let toggleWarningSpy;
    let setStateSpy;
    before(function() {
      toggleWarningSpy = sinon.spy(BackButton.prototype, 'toggleWarning');
      setStateSpy = sinon.spy(BackButton.prototype, 'setState');
      wrapper = mount(<BackButton showButton={true} />);
    });

    afterEach(function() {
      wrapper.setState({ showWarning: false });
      toggleWarningSpy.resetHistory();
      setStateSpy.resetHistory();
    });

    after(function() {
      toggleWarningSpy.restore();
      setStateSpy.restore();
    });

    it('should not render a StyledBackButtonToolTip when state.showWarning is false', function () {
      expect(wrapper.find(StyledBackButtonToolTip)).to.have.lengthOf(0);
    });

    it('should render a StyledBackButtonToolTip when state.showWarning is true', function() {
      wrapper.setState({ showWarning: true });
      expect(wrapper.find(StyledBackButtonToolTip)).to.have.lengthOf(1);
      expect(wrapper.find(StyledBackButtonToolTip).find('Translate')).to.have.lengthOf(1);
    });

    it('should should call toggleWarning on the onMouseEnter event', function() {
      wrapper.find('button').simulate('mouseenter');
      expect(toggleWarningSpy.calledOnce).to.be.true;
    });

    it('should call toggleWarning on the onFocus event', function() {
      wrapper.find('button').simulate('focus');
      expect(toggleWarningSpy.calledOnce).to.be.true;
    });

    it('should call toggleWarning on the onMouseLeave event', function() {
      wrapper.find('button').simulate('mouseleave');
      expect(toggleWarningSpy.calledOnce).to.be.true;
    });

    it('should call toggleWarning on the onBlur event', function() {
      wrapper.find('button').simulate('blur');
      expect(toggleWarningSpy.calledOnce).to.be.true;
    });

    it('should not call setState if props.areAnnotationsNotPersisted is false', function() {
      wrapper.find('button').simulate('mouseenter');
      expect(setStateSpy.calledOnce).to.be.false;
      expect(wrapper.state().showWarning).to.be.false;
    });

    it('should call setState if props.areAnnotationsNotPersisted is true', function() {
      const previousShowWarningState = wrapper.state().showWarning;
      wrapper.setProps({ areAnnotationsNotPersisted: true });
      wrapper.find('button').simulate('mouseenter');
      expect(setStateSpy.calledOnce).to.be.true;
      expect(previousShowWarningState).to.be.false;
      expect(wrapper.state().showWarning).to.be.true;
      expect(previousShowWarningState).to.not.equal(wrapper.state().showWarning);
    });
  });
});
