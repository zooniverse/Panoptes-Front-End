import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { AboutProject } from './';

function Page() {
  return (
    <p>Hello world!</p>
  );
}

describe('AboutProject', function () {
  describe('with only default props', function () {
    it('should render', function () {
      const wrapper = shallow(<AboutProject />);
      expect(wrapper.instance()).to.be.instanceOf(AboutProject);
    });
  });
  describe('with a child page', function () {
    const wrapper = mount(
      <AboutProject>
        <Page />
      </AboutProject>
    );
    const page = wrapper.update().find('Page');
    it('should render', function () {
      expect(wrapper.instance()).to.be.instanceOf(AboutProject);
    });
    it('should pass pages and team arrays to the child page', function () {
      expect(page.props().pages).to.equal(wrapper.state().pages);
      expect(page.props().pages).to.be.instanceOf(Array);
      expect(page.props().team).to.equal(wrapper.state().team);
      expect(page.props().team).to.be.instanceOf(Array);
    });
  });
});
