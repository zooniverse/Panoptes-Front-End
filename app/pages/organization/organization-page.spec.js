/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import OrganizationPage from './organization-page';
import { organization } from './organization-container.spec';
import mockPanoptesResource from '../../../test/mock-panoptes-resource';

const noAnnounceCatUrlsOrg = mockPanoptesResource('organizations', {
  display_name: 'Test Org',
  description: 'A brief test description',
  id: '9876',
  introduction: 'A brief test introduction',
  links: {
    organization_roles: ['1']
  },
  urls: null
});

const emptyArrayUrlsOrg = mockPanoptesResource('organizations', {
  display_name: 'Test Org',
  description: 'A brief test description',
  id: '9876',
  introduction: 'A brief test introduction',
  links: {
    organization_roles: ['1']
  },
  urls: []
});

const organizationPages = [{
  content: 'test content',
  url_key: 'about'
}];

const quoteObject = {
  displayName: 'Project 2',
  researcherAvatar: 'https://panoptes-uploads.zooniverse.org/staging/user_avatar/test.jpeg',
  quote: 'Project 2 call to action!',
  slug: 'owner/project-2'
};

describe('OrganizationPage', function () {
  it('should render without crashing', function () {
    shallow(<OrganizationPage organization={organization} />);
  });

  describe('as collaborator or admin', function () {
    let wrapper;
    let label;
    let checkbox;
    const toggle = sinon.spy();

    beforeEach(function () {
      wrapper = shallow(
        <OrganizationPage
          collaborator={true}
          organization={organization}
          toggleCollaboratorView={toggle}
        />);
      label = wrapper.find('label.organization-page__toggle');
      checkbox = label.find('input[type="checkbox"]');
    });

    it('should show project view toggle', function () {
      assert.equal(label.length, 1);
      assert.equal(checkbox.length, 1);
    });

    it('should initially have project view toggle unchecked', function () {
      assert.equal(checkbox.prop('value'), false);
    });

    it('should have project view toggle checked if collaboratorView is false', function () {
      wrapper.setProps({ collaboratorView: false });
      label = wrapper.find('label.organization-page__toggle');
      checkbox = label.find('input[type="checkbox"]');
      assert.equal(checkbox.prop('value'), true);
    });

    it('should call toggleCollaboratorView if project view toggle changed', function () {
      checkbox.simulate('change');
      assert.equal(toggle.calledOnce, true);
    });
  });

  it('should not show a project view toggle if user is not a collaborator or admin', function () {
    const wrapper = shallow(
      <OrganizationPage
        collaborator={false}
        organization={organization}
      />);
    const label = wrapper.find('label.organization-page__toggle');
    assert.equal(label.length, 0);
  });

  it('should not show announcement if not defined', function () {
    const wrapper = shallow(<OrganizationPage organization={noAnnounceCatUrlsOrg} />);
    const announcement = wrapper.find('.project-announcement-banner');
    assert.equal(announcement.length, 0);
  });

  it('should show announcement if defined', function () {
    const wrapper = shallow(<OrganizationPage organization={organization} />);
    const announcement = wrapper.find('.project-announcement-banner');
    assert.equal(announcement.length, 1);
  });

  it('should render OrganizationProjectCards', function () {
    const wrapper = shallow(<OrganizationPage organization={organization} />);
    const cards = wrapper.find('OrganizationProjectCards');
    assert.equal(cards.length, 1);
  });

  it('should show category buttons if the organization has categories', function () {
    const wrapper = shallow(<OrganizationPage organization={organization} />);
    const categories = wrapper.find('.organization-page__category-button');
    assert.equal(categories.length, organization.categories.length + 1);
  });

  it('should not show category buttons if the organization does not have categories', function () {
    const wrapper = shallow(<OrganizationPage organization={noAnnounceCatUrlsOrg} />);
    const categories = wrapper.find('.organization-page__category-button');
    assert.equal(categories.length, 0);
  });

  it('should show a project researcher quote if quoteObject prop provided', function () {
    const wrapper = shallow(<OrganizationPage organization={organization} quoteObject={quoteObject} />);
    const quote = wrapper.find('.organization-researcher-words');
    assert.equal(quote.length, 1);
  });

  it('should not show a project researcher quote if quoteObject prop not provided', function () {
    const wrapper = shallow(<OrganizationPage organization={organization} />);
    const quote = wrapper.find('.organization-researcher-words');
    assert.equal(quote.length, 0);
  });

  describe('with pages about content', function () {
    let wrapper;
    let aboutPage;

    beforeEach(function () {
      wrapper = shallow(<OrganizationPage organizationPages={organizationPages} />);
      aboutPage = wrapper.find('Markdown.organization-details__about-content');
    });

    it('should initially show pages about content collapsed', function () {
      assert.equal(aboutPage.length, 1);
      assert.equal(aboutPage.contains('test content'), true);
    });

    it('should show pages about content expanded after clicking Read More', function () {
      wrapper.find('button.organization-details__button').simulate('click');
      const aboutPageExpanded = wrapper.find('Markdown.organization-details__about-content--expanded');
      assert.equal(aboutPageExpanded.length, 1);
      assert.equal(aboutPageExpanded.contains('test content'), true);
    });
  });

  it('should not render ExternalLinks section if no urls', function () {
    const wrapper = shallow(<OrganizationPage organization={noAnnounceCatUrlsOrg} />);
    assert.equal(wrapper.find('ExternalLinksBlockContainer').length, 0);
  });

  it('should not render ExternalLinks section if urls empty array', function () {
    const wrapper = shallow(<OrganizationPage organization={emptyArrayUrlsOrg} />);
    assert.equal(wrapper.find('ExternalLinksBlockContainer').length, 0);
  });

  it('should show organization links', function () {
    const wrapper = shallow(<OrganizationPage organization={organization} />);
    assert.equal(wrapper.find('ExternalLinksBlockContainer').length, 1);
  });
});
