import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import SecurityPolicy from './security-policy';

describe('SecurityPolicy', () => {
  let wrapper;

  before(() => {
    wrapper = shallow(<SecurityPolicy />);
  });

  it('should render without crashing', () => {
    const securityPolicyContainer = wrapper.find('div.content-container');
    assert.equal(securityPolicyContainer.length, 1);
  });

  describe('heading', () => {
    it('renders a <Translate /> component', () => {
      assert.equal(wrapper.find('Translate').length, 1);
    });

    it('renders page title content', () => {
      assert.equal(wrapper.find('Translate').prop('content'), 'security.title');
    });
  });

  describe('intro', () => {
    it('renders one markdown element', () => {
      const markdownElement = wrapper.find('Markdown').first();
      assert.equal(markdownElement.length, 1);
    });
  });

  describe('details', () => {
    it('renders one markdown element', () => {
      const markdownElement = wrapper.find('Markdown').last();
      assert.equal(markdownElement.length, 1);
    });
  });
});
