import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import FeaturedProject from './featured-project';

let wrapper;
const featuredProject = {
  avatar_src: 'project/avatar/url',
  display_name: 'Test Featured Project',
  links: {
    background: {
      href: 'project/background/url'
    }
  }
};

function setup() {
  wrapper = mount(
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
    expect(wrapper).to.have.lengthOf(1);
  });

  it('should have a section as container', function () {
    expect(wrapper.find('section')).to.have.lengthOf(1);
  });

  it('should have an h1 tag containing the text "Featured Project"', function () {
    const title = wrapper.find('h1');
    expect(title.text()).to.equal('Featured Project');
  });

  it('should render a Thumbnail component', function () {
    const thumbnail = wrapper.find('Thumbnail');
    expect(thumbnail).to.have.lengthOf(1);
  });

  it('should render an image with the project display name as alt message', function () {
    const thumbnail = wrapper.find('Thumbnail');
    const { alt } = thumbnail.props();
    expect(alt).to.equal('Test Featured Project');
  });

  it('when project avatar is defined, should render an image with the project avatar as src', function () {
    const thumbnail = wrapper.find('Thumbnail');
    const { src } = thumbnail.props();
    expect(src).to.equal('https://project/avatar/url');
  });

  it('should have a link to the featured project', function () {
    expect(wrapper.find('Link')).to.have.lengthOf(1);
  });
});
