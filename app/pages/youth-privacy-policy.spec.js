import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import YouthPrivacyPolicy from './youth-privacy-policy';

describe('YouthPrivacyPolicy', () => {
  let wrapper;

  before(() => {
    wrapper = shallow(<YouthPrivacyPolicy />);
  });

  it('renders without crashing', () => {
    const privacyPolicyContainer = wrapper.find('div.container');
    assert.equal(privacyPolicyContainer.length, 1);
  });

  describe('heading', () => {
    it('renders a <Translate /> component', () => {
      assert.equal(wrapper.find('Translate').first().prop('component'), 'h1');
    });

    it('renders page title content', () => {
      assert.equal(wrapper.find('Translate').first().prop('content'), 'privacy.youthPolicy.title');
    });
  });

  describe('policy agreement section', () => {
    it('renders one markdown element', () => {
      assert.equal(wrapper.find('div.container').children.length, 1);
    });
  });
});
