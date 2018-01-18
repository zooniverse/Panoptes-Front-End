import React from 'react';
import assert from 'assert';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import SocialLinksEditor from './social-links-editor';

function mockPanoptesResource(type, options) {
  const resource = apiClient.type(type).create(options);
  apiClient._typesCache = {};
  sinon.stub(resource, 'save').callsFake(() => Promise.resolve(resource));
  sinon.stub(resource, 'get');
  sinon.stub(resource, 'delete');
  return resource;
}

const testProject = {
  urls: [
    {
      label: 'Example1',
      url: 'https://example.com/1'
    },
    {
      label: '',
      url: 'https://facebook.com/2',
      site: 'facebook.com/',
      path: 'test'
    }
  ]
};

describe('SocialLinksEditor', () => {
  let wrapper;
  let removeStub;

  it('should render without crashing', () => {
    shallow(<SocialLinksEditor project={mockPanoptesResource('projects', testProject)} />);
  });

  before(function () {
    removeStub = sinon.stub(SocialLinksEditor.prototype, 'handleRemoveLink');
    wrapper = mount(<SocialLinksEditor project={mockPanoptesResource('projects', testProject)} />);
  });

  after(function () {
    removeStub.restore();
  });

  it('should contain the correct number of rows', () => {
    const rows = wrapper.find('tr');
    assert.equal(rows.length, 13);
  });

  it('should rearrange the default social links on load', () => {
    const rearrangedLinks = wrapper.state().socialOrder;
    assert.equal(rearrangedLinks[0], 'facebook.com/');
  });

  it('should correctly display paths', () => {
    const input = wrapper.find('input').first();
    assert.equal(input.props().value, 'test');
  });

  it('should call handleRemoveLink() when link is removed', () => {
    const button = wrapper.find('button').first();
    button.simulate('click');
    sinon.assert.calledOnce(removeStub);
  });
});
