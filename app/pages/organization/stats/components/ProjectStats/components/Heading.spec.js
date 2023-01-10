/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import mockPanoptesResource from '../../../../../../../test/mock-panoptes-resource';
import Heading, {
  StyledAvatar, StyledLink, StyledPercent, StyledRedirect
} from './Heading';

const mockProject = mockPanoptesResource('projects', {
  avatarSrc: '/project/avatar/url',
  completeness: 0.75,
  display_name: 'Test Project 1',
  slug: 'user/test-project-1'
});

const mockProjectWithRedirect = mockPanoptesResource('projects', {
  avatarSrc: '/project/avatar/url',
  completeness: 0.5,
  display_name: 'Test Project 2',
  redirect: '/project/redirect',
  slug: 'user/test-project-2'
});

const mockWorkflowStatsHidden = mockPanoptesResource('workflows', {
  completeness: 0.25,
  configuration: { stats_hidden: true },
  display_name: 'Test Workflow 1'
});

describe('Heading', function () {
  let wrapper;
  it('should render without crashing', function () {
    shallow(
      <Heading
        resource={mockProject}
        title={mockProject.display_name}
      />
    );
  });

  describe('with project resource', function () {
    before(function () {
      wrapper = shallow(
        <Heading
          resource={mockProject}
          title={mockProject.display_name}
        />
      );
    });

    it('should render Avatar', function () {
      expect(wrapper.find(StyledAvatar)).to.have.lengthOf(1);
    });

    it('should render StyledLink if project not redirect', function () {
      expect(wrapper.find(StyledLink)).to.have.lengthOf(1);
    });

    it('should render StyledPercent if resource allows', function () {
      expect(wrapper.find(StyledPercent)).to.have.lengthOf(1);
    });

    describe('with redirect', function () {
      before(function () {
        wrapper = shallow(
          <Heading
            resource={mockProjectWithRedirect}
            title={mockProjectWithRedirect.display_name}
          />
        );
      });

      it('should render StyledRedirect if project redirect', function () {
        expect(wrapper.find(StyledRedirect)).to.have.lengthOf(1);
      });

      it('should render external link icon if project redirect', function () {
        const styledRedirect = wrapper.find(StyledRedirect).first();
        expect(styledRedirect.containsMatchingElement(<i className="fa fa-external-link" />)).to.equal(true);
      });
    });
  });

  it('should not render StyledPercent if resource disallows', function () {
    wrapper = shallow(
      <Heading
        resource={mockWorkflowStatsHidden}
        title={mockProjectWithRedirect.display_name}
      />
    );
    expect(wrapper.find(StyledPercent)).to.have.lengthOf(0);
  });
});
