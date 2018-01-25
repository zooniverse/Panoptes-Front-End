/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import NavLink, { StyledExternalLink, StyledInternalLink } from './NavLink';

const MOCK_EXTERNAL_URL = 'https://www.google.com';

const MOCK_SOCIAL_URL = 'https://www.facebook.com';

describe.only('NavLink', function() {
  it('renders without crashing', function() {
    shallow(<NavLink />);
  });

  describe('when the link is external', function() {
    let wrapper;
    before(function() {
      wrapper = shallow(<NavLink isExternalLink={true} url={MOCK_EXTERNAL_URL} />);
    });

    it('should be the StyledExternalLink component', function() {
      // is there a better way to test this?
      expect(wrapper.name()).to.equal('styled.a');
    });

    it('should add props to open the url in a new tab', function() {
      expect(wrapper.props().target).to.equal('_blank');
      expect(wrapper.props().rel).to.equal('noopener noreferrer');
      expect(wrapper.props().href).to.equal(MOCK_EXTERNAL_URL);
    });

    it('should have the Font Awesome external link icon', function() {
      expect(wrapper.find('i').hasClass('fa-external-link')).to.be.true;
    });
  });
});
