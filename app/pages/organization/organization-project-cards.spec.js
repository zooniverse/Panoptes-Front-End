/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import Translate from 'react-translate-component';
import OrganizationProjectCards from './organization-project-cards';

export const organizationProjects = [1, 2, 3].map(i => ({
  id: i.toString(),
  display_name: `Project #${i}`,
  subjects_count: Math.floor(Math.random() * 10000),
  classifications_count: Math.floor(Math.random() * 30000),
  retired_subjects_count: 25
}));

describe('OrganizationProjectCards', function () {
  it('should render without crashing', function () {
    shallow(<OrganizationProjectCards />);
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
        projectAvatars={[]}
      />);
    const cards = wrapper.find('ProjectCard');
    assert.equal(cards.length, organizationProjects.length);
  });
});
