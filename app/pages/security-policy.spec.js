import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import SecurityPolicy from './security-policy';

describe('SecurityPolicy', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SecurityPolicy />);
  });

  it('should render without crashing', () => {
    const securityPolicyContainer = wrapper.find('div.content-container');
    assert.equal(securityPolicyContainer.length, 1);
  });

  describe('heading', () => {
    it('renders the page title', () => {
      const headingElement = wrapper
        .find('div.content-container').children()
        .first()
        .props().component;
      assert.equal(headingElement, 'h1');
    });

    it('renders page title content', () => {
      const headingContent = wrapper
        .find('div.content-container').children()
        .first()
        .props().content;
      assert.equal(headingContent, 'security.title');
    });
  });

  describe('intro section', () => {
    it('renders one markdown element', () => {
      const markdownElement = wrapper
        .find('div.content-container').children()
        .find('div.columns-container').children()
        .find('div.column')
        .first();
      assert.equal(markdownElement.length, 1);
    });

    it('renders the intro section', () => {
      const section = 'intro';
      const markdownElement = wrapper
        .find('div.content-container').children()
        .find('div.columns-container').children()
        .find('div.column')
        .first()
        .props().children.props.children;
      assert.ok(markdownElement.match(section));
    });
  });

  describe('details section', () => {
    it('renders one markdown element', () => {
      const markdownElement = wrapper
        .find('div.content-container').children()
        .find('div.columns-container').children()
        .find('div.column')
        .last();
      assert.equal(markdownElement.length, 1);
    });

    it('renders the details section', () => {
      const section = 'details';
      const markdownElement = wrapper
        .find('div.content-container').children()
        .find('div.columns-container').children()
        .find('div.column')
        .last()
        .props().children.props.children;
      assert.ok(markdownElement.match(section));
    });
  });
});
