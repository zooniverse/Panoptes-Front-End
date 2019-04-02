import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import PrivacyPolicy from './privacy-policy';

describe('PrivacyPolicy', function () {
  let wrapper;

  before(function () {
    wrapper = shallow(<PrivacyPolicy />);
  });

  it('renders without crashing', function () {
    const privacyPolicyContainer = wrapper.find('div.content-container');
    assert.equal(privacyPolicyContainer.length, 1);
  });

  describe('heading', function () {
    it('renders a <Translate /> component', function () {
      assert.equal(wrapper.find('Translate').first().prop('component'), 'h1');
    });

    it('renders page title content', function () {
      assert.equal(wrapper.find('Translate').first().prop('content'), 'privacy.title');
    });
  });

  describe('user agreement section', function () {
    it('renders four markdown elements', function () {
      const markdownElements = wrapper.find('div.column').first().children();
      assert.equal(markdownElements.length, 4);
    });
  });

  describe('privacy policy section', function () {
    it('renders ten markdown elements', function () {
      const markdownElements = wrapper.find('div.column').last().children();
      assert.equal(markdownElements.length, 10);
    });
  });
});
