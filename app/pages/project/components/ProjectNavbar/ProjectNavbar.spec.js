/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { mount, shallow, render } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import ProjectNavbar from './ProjectNavbar';

describe('ProjectNavbar', function () {

  Object.defineProperty(document.body, 'clientWidth', { value: 100 });

  it('should render without crashing', function () {
    shallow(<ProjectNavbar />);
  });

  describe('child rendering', function () {
    it('should render ProjectNavbarNarrow by default', function () {
      const wrapper = shallow(<ProjectNavbar />);

      // Note - we check for `withSizes(ProjectNavbarNarrow)` as it's a
      // component wrapped in a HOC.
      expect(wrapper.find('withSizes(ProjectNavbarNarrow)')).to.have.lengthOf(1);
      expect(wrapper.find('ProjectNavbarWide')).to.have.lengthOf(0);
    });

    it('should render ProjectNavbarWide if state.useWide is true', function () {
      const wrapper = shallow(<ProjectNavbar />);
      wrapper.setState({ useWide: true });
      expect(wrapper.find('ProjectNavbarWide')).to.have.lengthOf(1);
      expect(wrapper.find('withSizes(ProjectNavbarNarrow)')).to.have.lengthOf(0);
    });

    it('should render ProjectNavbarNarrow if state.useWide is false', function () {
      const wrapper = shallow(<ProjectNavbar />);
      wrapper.setState({ useWide: false });
      expect(wrapper.find('withSizes(ProjectNavbarNarrow)')).to.have.lengthOf(1);
      expect(wrapper.find('ProjectNavbarWide')).to.have.lengthOf(0);
    });
  });

  describe('setBreakpoint behavior', function () {
    it('should correctly set the state if clientWidth is enough to render ProjectNavbarWide', function () {
      const wrapper = shallow(<ProjectNavbar />);
      wrapper.instance().setBreakpoint({ width: 90 });
      expect(wrapper.state('useWide')).to.equal(true);
    });

    it('should correctly set the state if clientWidth is too narrow to render ProjectNavbarWide', function () {
      const wrapper = shallow(<ProjectNavbar />);
      wrapper.instance().setBreakpoint({ width: 110 });
      expect(wrapper.state('useWide')).to.equal(false);
    });
  });
});
