import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import FeaturedProjectToggle from './featured-project-toggle';

const project = {
  featured: false
};

function mockPanoptesResource(type, options) {
  const resource = apiClient.type(type).create(options);
  apiClient._typesCache = {};
  sinon.stub(resource, 'save').callsFake(() => Promise.resolve(resource));
  sinon.stub(resource, 'get');
  sinon.stub(resource, 'delete');
  sinon.stub(resource, 'update');
  return resource;
}

describe('Featured Project Toggle', function () {
  let wrapper;
  let featuredChangeSpy;

  before(function () {
    featuredChangeSpy = sinon.spy(FeaturedProjectToggle.prototype, 'handleChange');
  });

  beforeEach(function () {
    wrapper = mount(
      <FeaturedProjectToggle
        project={mockPanoptesResource('projects', project)}
      />
    );
  })

  it('should call handleChange on featuredCheckbox change', function () {
    const featuredCheckbox = wrapper.find('input[name="featured"]');
    featuredCheckbox.simulate('change', { target: { checked: true }});
    expect(featuredChangeSpy.calledOnce).to.be.true;
  });
});
