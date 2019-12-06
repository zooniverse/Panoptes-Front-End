/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import OrganizationStats from './OrganizationStats';
import ProjectNavbar from '../../project/components/ProjectNavbar';

import mockPanoptesResource from '../../../test/mock-panoptes-resource';

const mockOrg = mockPanoptesResource('organizations', {
  display_name: 'Test Org',
  description: 'A brief test description',
  id: '9876',
  introduction: 'A brief test introduction',
  links: {
    organization_roles: ['1']
  },
  urls: null
});

describe('OrganizationStats', function () {
  it('should render without crashing', function () {
    shallow(<OrganizationStats />);
  });

  it('should render a ProjectNavbar', function () {
    const wrapper = shallow(<OrganizationStats />);
    expect(wrapper.find(ProjectNavbar)).to.have.lengthOf(1);
  });

  describe('conditional rendering of the organization announcement', function () {
    it('should not render a Markdown component if there is not an announcement', function () {
      const wrapper = shallow(
        <OrganizationStats
          organization={mockOrg}
        />
      );
      expect(wrapper.find('Markdown')).to.have.lengthOf(0);
    });

    it('should render a Markdown component if there is an announcement', function () {
      const organizationWithAnnouncement = Object.assign(
        {},
        mockOrg,
        { announcement: 'Big Announcement!' }
      );
      const wrapper = shallow(
        <OrganizationStats
          organization={organizationWithAnnouncement}
        />
      );
      const markdown = wrapper.find('Markdown');
      expect(markdown).to.have.lengthOf(1);
      expect(markdown.children().text()).to.equal('Big Announcement!');
    });
  });
});
