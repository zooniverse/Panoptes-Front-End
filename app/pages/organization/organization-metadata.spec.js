/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import OrganizationMetadata from './organization-metadata';
import { organization } from './organization-container.spec';
import { organizationProjects } from './organization-project-cards.spec';

describe('OrganizationMetadata', function () {
  it('should render without crashing', function () {
    shallow(<OrganizationMetadata />);
  });

  it('should render a stats section', function () {
    const wrapper = shallow(
      <OrganizationMetadata
        displayName={organization.display_name}
        projects={organizationProjects}
      />);
    const stats = wrapper.find('.project-metadata-stat');
    assert.equal(stats.length, 4);
  });

  it('should reduce retired subjects count to 75', function () {
    const wrapper = shallow(
      <OrganizationMetadata
        displayName={organization.display_name}
        projects={organizationProjects}
      />);
    const retiredSubjects = wrapper.find('.project-metadata-stat__value').at(3);
    assert.equal(retiredSubjects.text(), '75');
  });
});
