import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import FeaturedProject from './featured-project';

describe.only('FeaturedProject', () => {
  it('should render without crashing', () => {
    shallow(<FeaturedProject />);
  });

  it('should have a section as container', () => {
    const wrapper = shallow(<FeaturedProject />);
    assert.strictEqual(wrapper.type(), 'section');
  });

  it('should have an img tag', () => {
    const wrapper = shallow(<FeaturedProject />);
    assert.equal(wrapper.find('img').length, 1);
  });

  it('should have an h1 tag containing the text "Featured Project"', () => {
    const wrapper = shallow(<FeaturedProject />);
    const title = wrapper.find('h1');
    assert.strictEqual(title.contains(<h1>Featured Project</h1>), true);
  });
});
