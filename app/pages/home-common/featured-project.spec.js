import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import FeaturedProject from './featured-project';

describe('FeaturedProject', () => {
  it('should render without crashing', () => {
    shallow(<FeaturedProject />);
  });

  it('should have a section as container', () => {
    const wrapper = shallow(<FeaturedProject />);
    assert.strictEqual(wrapper.type(), 'section');
  });

  it('should have an h1 tag containing the text "Featured Project"', () => {
    const wrapper = shallow(<FeaturedProject />);
    const title = wrapper.find('h1');
    assert.strictEqual(title.contains(<h1>Featured Project</h1>), true);
  });

  it('should have an img tag with src and alt properties', () => {
    const wrapper = shallow(<FeaturedProject />);
    const { alt, src } = wrapper.find('img').props();
    assert.equal(wrapper.find('img').length, 1);
    assert.ok(alt.length > 1, 'alt attribute is empty');
    assert.ok(src.length > 1, 'src attribute is empty');
  });

  it('should have a link to the featured project', () => {
    const wrapper = shallow(<FeaturedProject />);
    assert.strictEqual(wrapper.find('Link').length, 1);
  });
});
