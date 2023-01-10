import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import PrivacyPolicy from './privacy-policy';

describe('PrivacyPolicy', () => {
  let wrapper;

  before(() => {
    wrapper = shallow(<PrivacyPolicy />);
  });

  it('renders without crashing', () => {
    const privacyPolicyContainer = wrapper.find('div.content-container');
    assert.equal(privacyPolicyContainer.length, 1);
  });

  describe('heading', () => {
    it('renders a <Translate /> component', () => {
      assert.equal(wrapper.find('Translate').first().prop('component'), 'h1');
    });

    it('renders page title content', () => {
      assert.equal(wrapper.find('Translate').first().prop('content'), 'privacy.title');
    });
  });

  describe('user agreement section', () => {
    it('renders four markdown elements', () => {
      const markdownElements = wrapper.find('div.column').first().children();
      assert.equal(markdownElements.length, 4);
    });
  });

  describe('privacy policy section', () => {
    it('renders ten markdown elements', () => {
      const markdownElements = wrapper.find('div.column').last().children();
      assert.equal(markdownElements.length, 10);
    });
  });
});
