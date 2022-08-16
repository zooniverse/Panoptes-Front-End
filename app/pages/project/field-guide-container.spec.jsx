import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import FieldGuideContainer from './field-guide-container';

const guide = {
  items: [{
    content: 'Facts about this animal',
    icon: '1234',
    title: 'Fun Mammals'
  }]
};

describe('FieldGuideContainer', function () {
  it('should render without crashing', function() {
    const wrapper = shallow(<FieldGuideContainer />);
    expect(wrapper.exists()).to.be.true;
  });

  describe('when there is no guide', function () {
    it('should render null', function () {
      const wrapper = shallow(<FieldGuideContainer />);
      expect(wrapper.html()).to.be.null;
    });
  });

  describe('when there is a guide', function () {
    let wrapper;
    before(function() {
      wrapper = shallow(
        <FieldGuideContainer guide={guide} project={{ id: '2' }} guideIcons={{ 2: { src: 'icon.jpg' }}} />
      );
    });

    it('should render a Pullout component', function () {
      expect(wrapper.find('Pullout')).to.have.lengthOf(1);
    });

    it('should render a FieldGuide component', function () {
      expect(wrapper.find('FieldGuide')).to.have.lengthOf(1);
    });

    it('should wrap the FieldGuide component with a Provider', function () {
      expect(wrapper.find('Provider')).to.have.lengthOf(1);
    });
  });

  describe('the toggle field guide button', function () {
    let wrapper;
    let toggleFieldGuideSpy;
    let initialRevealedState;
    before(function () {
      toggleFieldGuideSpy = sinon.spy(FieldGuideContainer.prototype, 'toggleFieldGuide');
      wrapper = shallow(
        <FieldGuideContainer guide={guide} project={{ id: '2' }} guideIcons={{ 2: { src: 'icon.jpg' } }} />
      );
      initialRevealedState = wrapper.state('revealed');
    });

    afterEach(function () {
      toggleFieldGuideSpy.resetHistory();
    });

    after(function () {
      toggleFieldGuideSpy.restore();
    });

    it('should call toggleFieldGuide when the button is clicked', function () {
      wrapper.find('button').simulate('click');
      expect(toggleFieldGuideSpy.calledOnce).to.be.true;
    });

    it('should set the revealed state to be the opposite of the previous revealed state on button click', function () {
      expect(initialRevealedState).to.not.equal(wrapper.state('revealed'));
      expect(initialRevealedState).to.be.false;
      expect(wrapper.state('revealed')).to.be.true;
    });
  });
});
