import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import apiClient from 'panoptes-client/lib/api-client';
import { ProjectPageController } from './';

const location = {
  query: {}
};

const context = {
  initialLoadComplete: true,
  router: {}
};

const resources = {
  pages: [],
  project_roles: []
};

const project = apiClient.type('projects').create({
  display_name: 'A test project',
  get(type) {
    return Promise.resolve(resources[type]);
  },
  links: {
    avatar: { id: '1' },
    background: { id: '1' },
    owner: { id: '1' }
  }
});

const background = apiClient.type('backgrounds').create({
  id: project.links.background.id
});

const owner = apiClient.type('users').create({
  id: project.links.owner.id
});

const projectAvatar = apiClient.type('avatars').create({
  id: project.links.avatar.id
});

describe('ProjectPageController', () => {
  const wrapper = shallow(<ProjectPageController project={project} location={location} />, { context });
  const controller = wrapper.instance();

  beforeEach(() => {
    wrapper.setState({
      loading: false,
      project,
      background,
      owner,
      pages: resources.pages,
      projectAvatar,
      projectRoles: resources.project_roles
    });
    wrapper.update();
  });
});
