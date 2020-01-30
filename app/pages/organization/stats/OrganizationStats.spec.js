/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import Translate from 'react-translate-component';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import OrganizationStats, { StyledPageHeading } from './OrganizationStats';
import BarChart from './components/BarChart';
import ByTheNumbers from './components/ByTheNumbers';
import ProjectStats from './components/ProjectStats';
import ProjectNavbar from '../../project/components/ProjectNavbar';

import mockPanoptesResource from '../../../../test/mock-panoptes-resource';

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

  it('should render StyledPageHeading', function () {
    const wrapper = shallow(<OrganizationStats />);
    expect(wrapper.find(Translate).prop('component')).to.equal(StyledPageHeading);
  });

  it('should render two BarCharts', function () {
    const wrapper = shallow(<OrganizationStats />);
    expect(wrapper.find(BarChart)).to.have.lengthOf(2);
  });

  it('should render ByTheNumbers', function () {
    const wrapper = shallow(<OrganizationStats />);
    expect(wrapper.find(ByTheNumbers)).to.have.lengthOf(1);
  });

  it('should render ProjectStats', function () {
    const wrapper = shallow(<OrganizationStats />);
    expect(wrapper.find(ProjectStats)).to.have.lengthOf(1);
  });
});
