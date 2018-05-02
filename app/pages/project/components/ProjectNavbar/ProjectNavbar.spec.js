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
import ProjectNavbar from './ProjectNavbar';

describe('ProjectNavbar', function () {
  before(function() {
    Object.defineProperty(document.body, 'clientWidth', { value: 100 });
  });

  it('should render without crashing', function () {
    expect(shallow(<ProjectNavbar />)).to.be.ok;
  });

  describe('child rendering', function () {
    let wrapper;
    before(function() {
      wrapper = shallow(<ProjectNavbar />);
    });

    it('should not render either navbar variants if SizeAwareProjectNavbarWide component\'s callback hasn\'t fired yet', function() {
      expect(wrapper.find('withSizes(ProjectNavbarNarrow)')).to.have.lengthOf(0);
      expect(wrapper.find('ProjectNavbarWide')).to.have.lengthOf(0);
    });

    it('should render ProjectNavbarWide if state.useWide is true', function () {
      wrapper.setState({ loading: false, useWide: true });
      expect(wrapper.find('withSizes(ProjectNavbarNarrow)')).to.have.lengthOf(0);
      expect(wrapper.find('ProjectNavbarWide')).to.have.lengthOf(1);
    });

    it('should render ProjectNavbarNarrow if state.useWide is false', function () {
      wrapper.setState({ useWide: false });
      expect(wrapper.find('withSizes(ProjectNavbarNarrow)')).to.have.lengthOf(1);
      expect(wrapper.find('ProjectNavbarWide')).to.have.lengthOf(0);
    });
  });

  describe('setBreakpoint behavior', function () {
    let wrapper;
    let setBreakpointSpy;
    before(function() {
      setBreakpointSpy = sinon.spy(ProjectNavbar.prototype, 'setBreakpoint');
      wrapper = shallow(<ProjectNavbar />);
      wrapper.setState({ loading: false });
    });

    afterEach(function () {
      setBreakpointSpy.resetHistory();
    });

    after(function() {
      setBreakpointSpy.restore();
    });

    it('should correctly set the state if clientWidth is enough to render ProjectNavbarWide', function () {
      wrapper.instance().setBreakpoint({ width: 90 });
      expect(setBreakpointSpy.calledOnce).to.be.true;
      expect(wrapper.state('useWide')).to.equal(true);
    });

    it('should correctly set the state if clientWidth is too narrow to render ProjectNavbarWide', function () {
      wrapper.instance().setBreakpoint({ width: 110 });
      expect(setBreakpointSpy.calledOnce).to.be.true;      
      expect(wrapper.state('useWide')).to.equal(false);
    });
  });
});
