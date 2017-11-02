/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import Translate from 'react-translate-component';
import OrganizationPage, { OrganizationProjectCards } from './organization-page';
import { organization } from './organization-container.spec';

const organizationProjects = [1, 2, 3].map(i => ({
  id: i.toString(),
  display_name: `Project #${i}`
}));

const organizationPages = [{
  content: 'test content',
  url_key: 'about'
}];

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

  it('should render OrganizationProjectCards', function () {
    const wrapper = shallow(<OrganizationPage organization={organization} />);
    const cards = wrapper.find('OrganizationProjectCards');
    assert.equal(cards.length, 1);
  });

  it('should show loading projects message if fetchingProjects', function () {
    const message = <Translate content="organization.home.projects.loading" />;
    const wrapper = shallow(
      <OrganizationProjectCards fetchingProjects={true} />);
    const status = wrapper.find('.organization-page__projects-status');
    assert.equal(status.length, 1);
    assert.equal(status.contains(message), true);
  });

  it('should show projects error message if errorFetchingProjects', function () {
    const message = <Translate content="organization.home.projects.error" />;
    const wrapper = shallow(
      <OrganizationProjectCards errorFetchingProjects={{ message: 'test error' }} />);
    const status = wrapper.find('.organization-page__projects-status');
    assert.equal(status.length, 1);
    assert.equal(status.contains(message), true);
  });

  it('should show no projects associated message if fetchingProjects false and no projects', function () {
    const message = <Translate content="organization.home.projects.none" />;
    const wrapper = shallow(
      <OrganizationProjectCards
        fetchingProjects={false}
        projects={[]}
      />);
    const status = wrapper.find('.organization-page__projects-status');
    assert.equal(status.length, 1);
    assert.equal(status.contains(message), true);
  });

  it('should show project cards once fetched', function () {
    const wrapper = shallow(
      <OrganizationProjectCards
        fetchingProjects={false}
        projects={organizationProjects}
      />);
    const cards = wrapper.find('ProjectCard');
    assert.equal(cards.length, organizationProjects.length);
  });

  it('should show category buttons if the organization has categories', function () {
    const wrapper = shallow(<OrganizationPage organization={organization} />);
    const categories = wrapper.find('.organization-page__category-button');
    assert.equal(categories.length, organization.categories.length + 1);
  });

  it('should not show category buttons if the organization does not have categories', function () {
    const noCategoriesOrg = organization;
    delete noCategoriesOrg.categories;
    const wrapper = shallow(<OrganizationPage organization={noCategoriesOrg} />);
    const categories = wrapper.find('.organization-page__category-button');
    assert.equal(categories.length, 0);
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

  it('should show organization links', function () {
    const wrapper = shallow(<OrganizationPage organization={organization} />);
    const links = wrapper.find('.organization-details__link');
    assert.equal(organization.urls.length, links.length);
  });
});
