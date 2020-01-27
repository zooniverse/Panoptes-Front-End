/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import Translate from 'react-translate-component';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import mockPanoptesResource from '../../../../../../../../test/mock-panoptes-resource';
import WorkflowsShowing from './WorkflowsShowing';
import ToggleButton from './components/ToggleButton';
import Heading from '../Heading';
import ProgressBar from '../ProgressBar';

const mockProject = mockPanoptesResource('projects', {
  avatarSrc: '/project/avatar/url',
  completeness: 0.75,
  display_name: 'Test Project 1',
  slug: 'user/test-project-1'
});

const mockWorkflow1 = mockPanoptesResource('workflows', {
  id: '1234',
  display_name: 'Workflow 1'
});

const mockWorkflow2 = mockPanoptesResource('workflows', {
  id: '5678',
  display_name: 'Workflow 2'
});

mockProject.workflows = [mockWorkflow1, mockWorkflow2];

describe('Workflows Showing', function () {
  let wrapper;
  before(function () {
    wrapper = shallow(<WorkflowsShowing project={mockProject} toggleWorkflows={() => {}} />);
  });

  it('should render without crashing', function () {});

  it('should render a ToggleButton', function () {
    expect(wrapper.find(ToggleButton)).to.have.lengthOf(1);
    expect(wrapper.find(ToggleButton).prop('label')).to.equal('collapse workflow list');
  });

  it('should render Heading and ProgressBar per workflow', function () {
    expect(wrapper.find(Heading)).to.have.lengthOf(2);
    expect(wrapper.find(ProgressBar)).to.have.lengthOf(2);
  });
});
