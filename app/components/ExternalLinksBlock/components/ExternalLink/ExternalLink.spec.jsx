import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import ExternalLink from './ExternalLink';
import { socialIcons } from '../../../../lib/nav-helpers';

const MOCK_EXTERNAL_URL = 'https://www.google.com';

const MOCK_SOCIAL_URL = 'https://facebook.com/my-profile';

const MOCK_SOCIAL_PATH = 'my-profile';

const MOCK_SOCIAL_SITE = 'facebook.com/';

describe('ExternalLink', function() {
  let wrapper;
  before(function() {
    wrapper = shallow(<ExternalLink />);
  });

  it('should render without crashing', function() {});

  it('should return null if isExternalLink or isSocialLink is false', function() {
    expect(wrapper.html()).to.be.null;
  });

  describe('when the link is external', function() {
    let wrapper, markdownLink, markdownHtml;
    before(function() {
      wrapper = mount(
        <ExternalLink
          isExternalLink={true}
          url={MOCK_EXTERNAL_URL}
        />
      );
      markdownLink = wrapper.find('span.link-title');
      markdownHtml = markdownLink.props().dangerouslySetInnerHTML.__html;
    });

    it('should render the markdown hyperlink correctly', function () {
      expect(markdownHtml).to.equal('<a href="https://www.google.com" target="_blank" ref="noopener nofollow"></a>')
    });

    it('should have the Font Awesome external link icon', function () {
      expect(wrapper.find('i').hasClass('fa-external-link')).to.be.true;
    });
  });

  describe('when the link is to social media', function () {
      let wrapper;
      before(function() {
        wrapper = shallow(
          <ExternalLink
            isExternalLink={false}
            isSocialLink={true}
            path={MOCK_SOCIAL_PATH}
            site={MOCK_SOCIAL_SITE}
            url={MOCK_SOCIAL_URL}
          />);
      });

      it('should add props for the aria-label', function () {
        expect(wrapper.props()['aria-label']).to.equal(socialIcons[MOCK_SOCIAL_SITE].ariaLabel);
      });

      it('should add props to open the url in a new tab', function () {
        expect(wrapper.props().target).to.equal('_blank');
        expect(wrapper.props().rel).to.equal('noopener noreferrer');
      });

      it('should use props.url for the href', function () {
        expect(wrapper.props().href).to.equal(MOCK_SOCIAL_URL);
      });

      it('should use the correct font awesome icon', function () {
        expect(wrapper.find('i').hasClass(socialIcons[MOCK_SOCIAL_SITE].icon)).to.be.true;
      });

      it('should use prop.path as the label', function () {
        expect(wrapper.text().includes(MOCK_SOCIAL_PATH)).to.be.true;
      });

      it('should structure the url with the user submitted path string as the subdomain for wordpress links', function () {
        wrapper.setProps({ site: 'wordpress.com/' })
        expect(wrapper.props().href).equal(`https://${MOCK_SOCIAL_PATH}.wordpress.com/`)
      });

      it('should not render if the site does not match allowed social media sites', function () {
        wrapper.setProps({ site: 'myh4x0rsite.com/' })
        expect(wrapper.html()).to.be.null
      })
    });
});
