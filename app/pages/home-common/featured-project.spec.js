import React from 'react';
import { shallow } from 'enzyme';
import assert from 'assert';
import FeaturedProject from './featured-project';

let wrapper;
const featuredProject = {
  display_name: 'Test Feature Project'
};

function setup() {
  wrapper = shallow(
    <FeaturedProject
      project={featuredProject}
    />
  );
}

function tearDown() {
  wrapper = null;
}

describe('FeaturedProject', function () {
  beforeEach(setup);
  afterEach(tearDown);

  it('should render without crashing', function () {
    wrapper;
  });

  it('should have a section as container', function () {
    assert.strictEqual(wrapper.type(), 'section');
  });

  it('should have an h1 tag containing the text "Featured Project"', function () {
    const title = wrapper.find('h1');
    assert.strictEqual(title.text(), 'Featured Project');
  });

  it('should have an img tag with src and alt properties', function () {
    const { alt, src } = wrapper.find('Thumbnail').props();
    assert.equal(wrapper.find('Thumbnail').length, 1);
    assert.ok(alt.length > 0, 'alt attribute is empty');
    assert.ok(src.length > 0, 'src attribute is empty');
  });

  it('should have a link to the featured project', function () {
    assert.strictEqual(wrapper.find('Link').length, 1);
  });
});
