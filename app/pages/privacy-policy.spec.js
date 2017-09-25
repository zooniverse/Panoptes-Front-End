import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import PrivacyPolicy from './privacy-policy';
import englishTranslations from '../locales/en';

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
      assert.equal(wrapper.find('Translate').length, 1);
    });

    it('renders page title content', () => {
      assert.equal(wrapper.find('Translate').prop('content'), 'privacy.title');
    });
  });

  describe('user agreement section', () => {
    let markdownElements;

    before(() => {
      markdownElements = wrapper.find('div.column').first().children();
    });

    it('renders four markdown elements', () => {
      assert.equal(markdownElements.length, 4);
    });

    it('renders each of its sections', () => {
      const userAgreementSections = Object.keys(englishTranslations.privacy.userAgreement);

      markdownElements.forEach((element, index) => {
        assert.ok(element.props().children.match(userAgreementSections[index]));
      });
    });
  });

  describe('privacy policy section', () => {
    let markdownElements;

    before(() => {
      markdownElements = wrapper.find('div.column').last().children();
    });

    it('renders ten markdown elements', () => {
      assert.equal(markdownElements.length, 10);
    });

    it('renders each of its sections', () => {
      const privacyPolicySections = Object.keys(englishTranslations.privacy.privacyPolicy);

      markdownElements.forEach((element, index) => {
        assert.ok(element.props().children.match(privacyPolicySections[index]));
      });
    });
  });
});
