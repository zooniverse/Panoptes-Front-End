/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import NavLink from './NavLink';
import { getProjectLinks, socialIcons } from '../../../helpers';
import {
  buildLinksWithLabels,
  projectRoles,
  projectWithoutRedirect,
  workflow
} from '../../../testHelpers';

const MOCK_EXTERNAL_URL = 'https://www.google.com';

const MOCK_SOCIAL_URL = 'https://www.facebook.com';

const MOCK_SOCIAL_SITE = 'facebook.com/';

describe('NavLink', function() {
  it('renders without crashing', function() {
    shallow(<NavLink />);
  });

  describe('when the link is disabled', function() {
    it('should be the StyledLinkPlaceholder component ', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow: null, user: null });
      const navLinksWithLabels = buildLinksWithLabels(navLinks);
      const classifyLink = navLinksWithLabels[1];
      const wrapper = shallow(<NavLink url={classifyLink.url} label={classifyLink.label} disabled={classifyLink.disabled} />);
      expect(wrapper.name()).to.equal('styled.span');
    });
  });

  describe('when the link is internal', function() {
    let wrapper;
    let firstLink;
    before(function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, workflow, user: null });
      const navLinksWithLabels = buildLinksWithLabels(navLinks);
      firstLink = navLinksWithLabels[0];
      wrapper = shallow(<NavLink url={firstLink.url} label={firstLink.label} />);
    });

    it('should be the StyledInternalLink component', function () {
      // is there a better way to test this?
      expect(wrapper.name()).to.equal('Styled(Link)');
    });

    it('should set props.to using props.url', function() {
      expect(wrapper.props().to).to.equal(firstLink.url);
    });

    it('should use props.label as the text', function() {
      expect(wrapper.html().includes(firstLink.label)).to.true;
    });

    it('should not use a font awesome icon', function() {
      expect(wrapper.find('i')).to.have.lengthOf(0);
    });
  });

  describe('when the link is external', function() {
    let wrapper;
    before(function() {
      wrapper = shallow(<NavLink isExternalLink={true} url={MOCK_EXTERNAL_URL} label="My Link" />);
    });

    it('should be the StyledExternalLink component', function() {
      expect(wrapper.name()).to.equal('styled.a');
    });

    it('should add props to open the url in a new tab', function() {
      expect(wrapper.props().target).to.equal('_blank');
      expect(wrapper.props().rel).to.equal('noopener noreferrer');
    });

    it('should use props.url for the href', function () {
      expect(wrapper.props().href).to.equal(MOCK_EXTERNAL_URL);
    });

    it('should have the Font Awesome external link icon', function() {
      expect(wrapper.find('i').hasClass('fa-external-link')).to.be.true;
    });
  });

  describe('when the link is social media', function() {
    let wrapper;
    before(function() {
      wrapper = shallow(
        <NavLink
          isExternalLink={true}
          isSocialLink={true}
          site={MOCK_SOCIAL_SITE}
          url={MOCK_SOCIAL_URL}
        />);
    });

    it('should be the StyledExternalLink component', function() {
    });

    it('should add props for the aria-label', function() {
      expect(wrapper.props()['aria-label']).to.equal(socialIcons[MOCK_SOCIAL_SITE].label);
    });

    it('should add props to open the url in a new tab', function () {
      expect(wrapper.props().target).to.equal('_blank');
      expect(wrapper.props().rel).to.equal('noopener noreferrer');
    });

    it('should use props.url for the href', function () {
      expect(wrapper.props().href).to.equal(MOCK_SOCIAL_URL);
    });

    it('should use the correct font awesome icon', function() {
      expect(wrapper.find('i').hasClass(socialIcons[MOCK_SOCIAL_SITE].icon)).to.be.true;
    });

    it('should not use prop.label if defined', function() {
      wrapper.setProps({ label: 'A label' });
      expect(wrapper.text().includes('A label')).to.be.false;
    });
  });
});
