import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import FeaturedProjectToggle from './featured-project-toggle';

let checkbox;
let featuredChangeSpy;
let wrapper;
const project = {
  featured: false
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
  it('should call handleProjectChange on checkbox change', function () {
    checkbox.simulate('change');
    expect(featuredChangeSpy.called).to.be.true;
  });
});
