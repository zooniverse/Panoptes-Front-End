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
import { getProjectLinks  } from '../../../../../../lib/nav-helpers';
import {
  buildLinksWithLabels,
  projectRoles,
  projectWithoutRedirect,
  workflow
} from '../../../../../../../test';

const MOCK_EXTERNAL_URL = 'https://www.google.com';

describe('NavLink', function() {
  it('renders without crashing', function() {
    shallow(<NavLink />);
  });

  describe('when the link is disabled', function() {
    it('should be the StyledLinkPlaceholder component ', function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, user: null });
      const navLinksWithLabels = buildLinksWithLabels(navLinks);
      const classifyLink = navLinksWithLabels[1];
      const wrapper = shallow(<NavLink url={classifyLink.url} label={classifyLink.label} disabled={true} />);
      expect(wrapper.name()).to.equal('styled.span');
    });
  });

  describe('when the link is internal', function() {
    let wrapper;
    let firstLink;
    before(function() {
      const navLinks = getProjectLinks({ project: projectWithoutRedirect, projectRoles, user: null });
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
      expect(wrapper.name()).to.equal('Styled(ExternalLink)');
    });
  });
});
