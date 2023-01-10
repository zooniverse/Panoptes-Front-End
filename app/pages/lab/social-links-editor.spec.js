import React from 'react';
import assert from 'assert';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import SocialLinksEditor from './social-links-editor';
import mockPanoptesResource from '../../../test/mock-panoptes-resource';

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

  before(() => {
    removeStub = sinon.stub(SocialLinksEditor.prototype, 'handleRemoveLink');
    wrapper = mount(<SocialLinksEditor project={mockPanoptesResource('projects', testProject)} />);
  });

  after(() => {
    removeStub.restore();
  });

  it('should contain the correct number of rows', () => {
    const rows = wrapper.find('tr');
    assert.equal(rows.length, 12);
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
