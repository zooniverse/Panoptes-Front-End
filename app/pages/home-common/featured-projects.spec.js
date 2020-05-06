import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import FeaturedProjects from './featured-projects';

const featuredProjects = [
  {
    avatar_src: 'project/avatar/url',
    display_name: 'Test Featured Project',
    id: '1',
    links: {
      background: {
        href: 'project/background/url'
      }
    }
  }, {
    avatar_src: 'project-2/avatar/url',
    display_name: 'Galaxy Zoo',
    id: '2',
    links: {
      background: {
        href: 'project-2/background/url'
      }
    }
  }
];

describe('FeaturedProjects', function () {
  let wrapper;

  function setup() {
    wrapper = mount(
      <FeaturedProjects
        projects={featuredProjects}
      />
    );
  }

  function tearDown() {
    wrapper = null;
  }

  beforeEach(setup);
  afterEach(tearDown);

  it('should render without crashing', function () {
    expect(wrapper).to.have.lengthOf(1);
  });

  it('should have a section as container', function () {
    expect(wrapper.find('section')).to.have.lengthOf(1);
  });

  it('should have an h2 tag containing the text "Featured Project"', function () {
    const title = wrapper.find('h2');
    expect(title.text()).to.equal('Featured Projects');
  });

  it('should render a ProjectCard component', function () {
    const projectCards = wrapper.find('ProjectCard');
    expect(projectCards).to.have.lengthOf(featuredProjects.length);
  });
});
