/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */

import React from 'react';
import assert from 'assert';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import Translate from 'react-translate-component';
import OrganizationContainer from './organization-container';
import mockPanoptesResource from '../../../test/mock-panoptes-resource';

const params = {
  name: 'org-name',
  owner: 'org-owner'
};

export const organization = mockPanoptesResource('organizations', {
  announcement: 'Test announcement',
  categories: ['Plants', 'Bugs', 'Butterflies'],
  display_name: 'Test Org',
  description: 'A brief test description',
  id: '9876',
  introduction: 'A brief test introduction',
  links: {
    avatar: { id: '1', type: 'avatars' },
    background: { id: '1', type: 'backgrounds' },
    organization_roles: ['1', '2', '3'],
    pages: ['1'],
    projects: []
  },
  urls: [
    {
      key: 0.123,
      url: 'https://blog.com/',
      label: 'Blog'
    },
    {
      key: 0.456,
      url: 'https://fieldbook.com/',
      label: 'Field Book'
    },
    {
      url: 'https://github.com/testrepo',
      path: 'testrepo',
      site: 'github.com/',
      label: ''
    },
    {
      url: 'https://facebook.com/testfb',
      path: 'testfb',
      site: 'facebook.com/',
      label: ''
    }
  ]
});

describe('OrganizationContainer', function () {
  let wrapper;

  beforeEach(function () {
    wrapper = shallow(<OrganizationContainer params={params} />, { context: { router: {}}});
  });

  it('should render without crashing', function () {
  });

  it('should initially render please wait message', function () {
    const message = <Translate content="organization.pleaseWait" />;

    const orgPage = wrapper.find('OrganizationPage');

    assert.equal(orgPage.length, 0);
    assert.equal(wrapper.contains(message), true);
  });

  it('while fetching organization should render loading message', function () {
    const message = <Translate content="organization.loading" />;

    wrapper.setState({ fetchingOrganization: true });
    const orgPage = wrapper.find('OrganizationPage');

    assert.equal(orgPage.length, 0);
    assert.equal(wrapper.contains(message), true);
  });

  it('with error should render error message', function () {
    const message = <Translate content="organization.error" />;

    wrapper.setState({ error: { message: 'test error message' }});
    const orgPage = wrapper.find('OrganizationPage');

    assert.equal(orgPage.length, 0);
    assert.equal(wrapper.contains(message), true);
  });

  describe('with a succesfully fetched organization', function () {
    it('should render OrganizationPage if organization is listed', function () {
      const listedOrg = organization;
      listedOrg.listed = true;

      wrapper.setState({ organization: listedOrg });
      const orgPage = wrapper.find('OrganizationPage');

      assert.equal(orgPage.length, 1);
    });

    describe('and request for organization roles', function () {
      wrapper = mount(<OrganizationContainer params={params} location={{}} />, { context: { router: {}}});
      const container = wrapper.instance();
      const fetchAllOrganizationRolesSpy = sinon.spy(container, 'fetchAllOrganizationRoles');

      before(function () {
        sinon.stub(apiClient, 'request').callsFake((method, url, payload) => {
          let response = [];
          if (url === '/organization_roles') {
            const role = {
              getMeta: () => ({ page: payload.page, next_page: null }),
              roles: ['collaborator'],
              links: {
                owner: {
                  id: payload.page
                }
              }
            };
            if (payload.page === 1) {
              role.getMeta = () => ({ page: 1, next_page: 2 });
            }
            response = [role];
          }
          return Promise.resolve(response);
        });

        container.fetchAllOrganizationRoles(organization);
      });

      after(function () {
        apiClient.request.restore();
      });

      it('should call fetchAllOrganizationRoles until no next_page in API response meta', function () {
        const secondCallArgs = fetchAllOrganizationRolesSpy.getCall(1).args;
        sinon.assert.calledTwice(fetchAllOrganizationRolesSpy);
        assert.equal(secondCallArgs[2], 2);
      });
    });

    it('should render OrganizationPage if organization not listed and user is collaborator', function () {
      const isCollabSpy = sinon.stub(OrganizationContainer.prototype, 'isCollaborator').returns(true);

      const unlistedOrg = organization;
      unlistedOrg.listed = false;

      wrapper.setState({ organization: unlistedOrg });
      const orgPage = wrapper.find('OrganizationPage');

      assert.equal(orgPage.length, 1);

      isCollabSpy.restore();
    });

    it('should render no permission message if organization not listed and user is not collaborator', function () {
      const message = <Translate content="organization.notPermission" />;
      const unlistedOrg = organization;
      unlistedOrg.listed = false;

      wrapper.setState({ organization: unlistedOrg });
      const orgPage = wrapper.find('OrganizationPage');

      assert.equal(orgPage.length, 0);
      assert.equal(wrapper.contains(message), true);
    });
  });
});
