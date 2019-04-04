import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import YouthPrivacyPolicy from './youth-privacy-policy';

describe('YouthPrivacyPolicy', function () {
  let wrapper;

  before(function () {
    wrapper = shallow(<YouthPrivacyPolicy />);
  });

  it('renders without crashing', function () {
    const privacyPolicyContainer = wrapper.find('div.container');
    assert.equal(privacyPolicyContainer.length, 1);
  });

  describe('heading', function () {
    it('renders a <Translate /> component', function () {
      assert.equal(wrapper.find('Translate').first().prop('component'), 'h1');
    });

    it('renders page title content', function () {
      assert.equal(wrapper.find('Translate').first().prop('content'), 'privacy.youthPolicy.title');
    });
  });

  describe('policy agreement section', function () {
    it('renders one markdown element', function () {
      assert.equal(wrapper.find('div.container').children.length, 1);
    });
  });
});
