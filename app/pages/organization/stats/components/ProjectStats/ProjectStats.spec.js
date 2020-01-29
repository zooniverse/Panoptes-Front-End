/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ProjectStats, { StyledProjectStatBlock } from './ProjectStats';
import SectionHeading from '../SectionHeading';
import Heading from './components/Heading';
import ProgressBar from './components/ProgressBar';
import WorkflowsShowing from './components/Workflows/WorkflowsShowing';
import WorkflowsHidden from './components/Workflows/WorkflowsHidden';

const mockProjectStats = new Map();
mockProjectStats.set('1234', {
  id: '1234',
  links: { active_workflows: [] },
  show: true
});
mockProjectStats.set('5678', {
  id: '5678',
  links: { active_workflows: [] },
  show: false
});

const mockProjectIds = ['1234', '5678'];

describe('ProjectStats', function () {
  let wrapper;
  before(function () {
    wrapper = shallow(
      <ProjectStats
        projectIds={mockProjectIds}
        projectStats={mockProjectStats}
        toggleWorkflows={() => {}}
      />
    );
  });

  it('should render without crashing', function () {
    expect(wrapper).to.be.ok;
  });

  it('should render a SectionHeading', function () {
    expect(wrapper.find(SectionHeading)).to.have.lengthOf(1);
  });

  it('should render a StyledProjectStatBlock for each project', function () {
    expect(wrapper.find(StyledProjectStatBlock)).to.have.lengthOf(2);
  });

  describe('for each StyledProjectStatBlock', function () {
    it('should render a Heading', function () {
      expect(wrapper.find(Heading)).to.have.lengthOf(2);
    });

    it('should render a ProgressBar', function () {
      expect(wrapper.find(ProgressBar)).to.have.lengthOf(2);
    });

    it('should render WorkflowsShowing if project.show is true', function () {
      const firstProjectStatBlock = wrapper.find(StyledProjectStatBlock).at(0);
      expect(firstProjectStatBlock.find(WorkflowsShowing)).to.have.lengthOf(1);
    });

    it('should render WorkflowsHidden if project.show is false', function () {
      const secondProjectStatBlock = wrapper.find(StyledProjectStatBlock).at(1);
      expect(secondProjectStatBlock.find(WorkflowsHidden)).to.have.lengthOf(1);
    });
  });
});
