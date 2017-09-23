import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import PrivacyPolicy from './privacy-policy';

describe('PrivacyPolicy', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<PrivacyPolicy />);
  });

  it('renders without crashing', () => {
    const privacyPolicyContainer = wrapper.find('div.content-container');
    assert.equal(privacyPolicyContainer.length, 1);
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
      assert.equal(headingContent, 'privacy.title');
    });
  });

  describe('user agreement section', () => {
    let markdownElements;

    beforeEach(() => {
      markdownElements = wrapper
        .find('div.content-container').children()
        .find('div.columns-container').children()
        .find('div.column')
        .first()
        .props().children;
    });

    it('renders four markdown elements', () => {
      assert.equal(markdownElements.length, 4);
    });

    it('renders each of its sections', () => {
      const sections = [
        'userAgreementSummary',
        'userAgreementContribution',
        'userAgreementData',
        'userAgreementLegal'
      ];

      markdownElements.forEach((element, index) => {
        assert.ok(element.props.children.match(sections[index]));
      });
    });
  });

  describe('privacy policy section', () => {
    let markdownElements;

    beforeEach(() => {
      markdownElements = wrapper
        .find('div.content-container').children()
        .find('div.columns-container').children()
        .find('div.column')
        .last()
        .props().children;
    });

    it('renders ten markdown elements', () => {
      assert.equal(markdownElements.length, 10);
    });

    it('renders each of its sections', () => {
      const sections = [
        'privacyPolicyIntro',
        'privacyPolicyData',
        'privacyPolicyInfo',
        'privacyPolicyThirdParties',
        'privacyPolicyCookies',
        'privacyPolicyDataStorage',
        'privacyPolicySecurity',
        'privacyPolicyDataRemoval',
        'privacyPolicyContactUser',
        'privacyPolicyFurtherInfo'
      ];

      markdownElements.forEach((element, index) => {
        assert.ok(element.props.children.match(sections[index]));
      });
    });
  });
});
