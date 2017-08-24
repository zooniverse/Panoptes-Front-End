import { shallow } from 'enzyme';
import React from 'react';
import assert from 'assert';
import FeaturedProject from './featured-project';
import Thumbnail from '../../components/thumbnail';

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
    assert.strictEqual(title.text(), 'Featured Project');
  });

  it('should have an img tag with src and alt properties', () => {
    const wrapper = shallow(<FeaturedProject />);
    const { alt, src } = wrapper.find(Thumbnail).props();
    assert.equal(wrapper.find(Thumbnail).length, 1);
    assert.ok(alt.length > 0, 'alt attribute is empty');
    assert.ok(src.length > 0, 'src attribute is empty');
  });

  it('should have a link to the featured project', () => {
    const wrapper = shallow(<FeaturedProject />);
    assert.strictEqual(wrapper.find('Link').length, 1);
  });
});
