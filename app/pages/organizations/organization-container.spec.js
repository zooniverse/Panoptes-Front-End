/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import OrganizationContainer from './organization-container';

const params = {
  name: 'org-name',
  owner: 'org-owner'
};

export const organization = {
  id: '9876',
  display_name: 'Test Org',
  description: 'A brief test description',
  introduction: 'A brief test introduction'
};

describe('OrganizationContainer', function () {
  let wrapper;

  beforeEach(function () {
    wrapper = shallow(<OrganizationContainer params={params} />);
  });

  it('should render without crashing', function () {
  });

  it('should initially render please wait message', function () {
    const message = <p>Please wait...</p>;

    const orgPage = wrapper.find('OrganizationPage');

    assert.equal(orgPage.length, 0);
    assert.equal(wrapper.contains(message), true);
  });

  it('while fetching organization should render loading message', function () {
    const message = <p>Loading organization{' '}<strong>{params.name}</strong>...</p>;

    wrapper.setState({ fetchingOrganization: true });
    const orgPage = wrapper.find('OrganizationPage');

    assert.equal(orgPage.length, 0);
    assert.equal(wrapper.contains(message), true);
  });

  it('with error should render error message', function () {
    const message = <p>There was an error retrieving organization{' '}<strong>{params.name}</strong>.</p>;

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

      assert.ok(orgPage, 'OrganizationPage render');
    });

    it('should render OrganizationPage if organization not listed and user is collaborator', function () {
      const isCollabSpy = sinon.stub(OrganizationContainer.prototype, 'isCollaborator').returns(true);

      const unlistedOrg = organization;
      unlistedOrg.listed = false;

      wrapper.setState({ organization: unlistedOrg });
      const orgPage = wrapper.find('OrganizationPage');

      assert.ok(orgPage, 'OrganizationPage render');

      isCollabSpy.restore();
    });

    it('should render no permission message if organization not listed and user is not collaborator', function () {
      const message = <p>Organization <strong>{params.name}</strong> not found.</p>;
      const unlistedOrg = organization;
      unlistedOrg.listed = false;

      wrapper.setState({ organization: unlistedOrg });
      const orgPage = wrapper.find('OrganizationPage');

      assert.equal(orgPage.length, 0);
      assert.equal(wrapper.contains(message), true);
    });
  });
});
