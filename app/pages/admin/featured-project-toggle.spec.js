import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import FeaturedProjectToggle from './featured-project-toggle';

let checkbox;
let featuredChangeSpy;
let wrapper;
const project = {
  featured: false,
  launch_approved: true
};

function setup() {
  featuredChangeSpy = sinon.spy();
  wrapper = shallow(
    <FeaturedProjectToggle
      handleProjectChange={featuredChangeSpy}
      project={project}
    />
  );
  checkbox = wrapper.find('input[name="featured"]');
}

function tearDown() {
  wrapper = null;
}

describe('Featured Project Toggle', function () {
  beforeEach(setup);
  afterEach(tearDown);

  it('should render the featured checkbox when the project is launch_approved', function () {
    expect(checkbox).to.have.lengthOf(1);
  });

  it('should render a checked featured check box when the project is launch_approved and featured', function () {
    wrapper.setProps({
      project: {
        featured: true,
        launch_approved: true
      }
    });
    expect(wrapper.find('input[type="checkbox"][checked=true]')).to.have.lengthOf(1);
  });

  it('should call handleProjectChange on checkbox change', function () {
    checkbox.simulate('change');
    expect(featuredChangeSpy.called).to.be.true;
  });

  it('should not render the featured checkbox when the project is not launch_approved', function () {
    wrapper.setProps({
      project: {
        featured: false,
        launch_approved: false
      }
    });
    expect(wrapper.find('input[name="featured"]')).to.have.lengthOf(0);
  });
});
