/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import Translate from 'react-translate-component';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import mockPanoptesResource from '../../../../../../../test/mock-panoptes-resource';
import ProgressBar, { StyledProgressBarMeter, StyledText } from './ProgressBar';

const mockProject = mockPanoptesResource('projects', {
  avatarSrc: '/project/avatar/url',
  completeness: 0.75,
  display_name: 'Test Project 1',
  slug: 'user/test-project-1'
});

const mockWorkflowStatsHidden = mockPanoptesResource('workflows', {
  completeness: 0.25,
  configuration: { stats_hidden: true },
  display_name: 'Test Workflow 1'
});

describe('Progress Bar', function () {
  it('should render without crashing', function () {
    shallow(<ProgressBar resource={mockProject} />);
  });

  it('should render StyledProgressBarMeter', function () {
    const wrapper = shallow(<ProgressBar resource={mockProject} />);
    expect(wrapper.find(StyledProgressBarMeter)).to.have.lengthOf(1);
  });

  it('should render explanatory text if workflow hides stats', function () {
    const wrapper = shallow(<ProgressBar resource={mockWorkflowStatsHidden} />);
    expect(wrapper.find(StyledProgressBarMeter)).to.have.lengthOf(0);
    expect(wrapper.find(Translate).prop('component')).to.equal(StyledText);
    expect(wrapper.find(Translate).prop('content')).to.equal('organization.stats.hidden');
  });
});
