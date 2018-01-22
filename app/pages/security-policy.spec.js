import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import SecurityPolicy from './security-policy';

describe('SecurityPolicy', function () {
  let wrapper;

  before(function () {
    wrapper = shallow(<SecurityPolicy />);
  });

  it('should render without crashing', function () {
    const securityPolicyContainer = wrapper.find('div.content-container');
    assert.equal(securityPolicyContainer.length, 1);
  });

  describe('heading', function () {
    it('renders a <Translate /> component', function () {
      assert.equal(wrapper.find('Translate').length, 1);
    });

    it('renders page title content', function () {
      assert.equal(wrapper.find('Translate').prop('content'), 'security.title');
    });
  });

  describe('intro', function () {
    it('renders one markdown element', function () {
      const markdownElement = wrapper.find('Markdown').first();
      assert.equal(markdownElement.length, 1);
    });
  });

  describe('details', function () {
    it('renders one markdown element', function () {
      const markdownElement = wrapper.find('Markdown').last();
      assert.equal(markdownElement.length, 1);
    });
  });
});
