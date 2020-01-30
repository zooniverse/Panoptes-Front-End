/* eslint func-names: off, prefer-arrow-callback: off */
import React from 'react';
import Translate from 'react-translate-component';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import mockPanoptesResource from '../../../../../test/mock-panoptes-resource';

import ByTheNumbers, { StyledStatBlock, StyledStat, StyledStatDescription } from './ByTheNumbers';
import SectionHeading from './SectionHeading';

const liveProject1 = mockPanoptesResource('projects', {
  classifications_count: 18000,
  display_name: 'Live Project 1',
  launch_approved: true,
  launch_date: '2019-09-09T09:00:00',
  retired_subjects_count: 3000,
  state: 'live',
  subjects_count: 9000
});

const liveProject2 = mockPanoptesResource('projects', {
  classifications_count: 16000,
  display_name: 'Live Project 2',
  launch_approved: true,
  launch_date: '2018-08-08T08:00:00',
  retired_subjects_count: 2000,
  state: 'live',
  subjects_count: 8000
});

const pausedProject1 = mockPanoptesResource('projects', {
  classifications_count: 14000,
  display_name: 'Paused Project 1',
  launch_approved: true,
  launch_date: '2017-07-07T07:00:00',
  retired_subjects_count: 2000,
  state: 'paused',
  subjects_count: 7000
});

const finishedProject1 = mockPanoptesResource('projects', {
  classifications_count: 18000,
  display_name: 'Finished Project 1',
  launch_approved: true,
  launch_date: '2016-06-06T06:00:00',
  retired_subjects_count: 6000,
  state: 'finished',
  subjects_count: 6000
});

const mockProjects = [liveProject1, finishedProject1, pausedProject1, liveProject2];

describe('ByTheNumbers', function () {
  it('should render without crashing', function () {
    shallow(<ByTheNumbers projects={[]} />);
  });

  it('should render a SectionHeading', function () {
    const wrapper = shallow(<ByTheNumbers projects={[]} />);
    expect(wrapper.find(SectionHeading)).to.have.lengthOf(1);
  });

  let wrapper;
  before(function () {
    wrapper = shallow(<ByTheNumbers projects={mockProjects} />);
  });

  it('should render 8 StyledStatBlocks', function () {
    expect(wrapper.find(StyledStatBlock)).to.have.lengthOf(8);
  });

  it('should render live projects count', function () {
    expect(wrapper.find(StyledStat).at(0).text()).to.equal('2');
  });

  it('should render live projects count description', function () {
    expect(wrapper.find(Translate).at(0).props().component)
      .to.equal(StyledStatDescription);
    expect(wrapper.find(Translate).at(0).props().content)
      .to.equal('organization.stats.byTheNumbersContent.liveProjects');
  });

  it('should render paused projects count', function () {
    expect(wrapper.find(StyledStat).at(1).text()).to.equal('1');
  });

  it('should render paused projects count description', function () {
    expect(wrapper.find(Translate).at(1).props().component)
      .to.equal(StyledStatDescription);
    expect(wrapper.find(Translate).at(1).props().content)
      .to.equal('organization.stats.byTheNumbersContent.pausedProjects');
  });

  it('should render retired projects count', function () {
    expect(wrapper.find(StyledStat).at(2).text()).to.equal('1');
  });

  it('should render retired projects count description', function () {
    expect(wrapper.find(Translate).at(2).props().component)
      .to.equal(StyledStatDescription);
    expect(wrapper.find(Translate).at(2).props().content)
      .to.equal('organization.stats.byTheNumbersContent.retiredProjects');
  });

  it('should render projects\' classifications count', function () {
    expect(wrapper.find(StyledStat).at(3).text()).to.equal((66000).toLocaleString());
  });

  it('should render classifications description', function() {
    expect(wrapper.find(Translate).at(3).props().component)
      .to.equal(StyledStatDescription);
    expect(wrapper.find(Translate).at(3).props().content)
      .to.equal('organization.stats.byTheNumbersContent.classifications');
  });

  it('should render projects\' subjects count', function () {
    expect(wrapper.find(StyledStat).at(4).text()).to.equal((30000).toLocaleString());
  });

  it('should render subjects description', function () {
    expect(wrapper.find(Translate).at(4).props().component)
      .to.equal(StyledStatDescription);
    expect(wrapper.find(Translate).at(4).props().content)
      .to.equal('organization.stats.byTheNumbersContent.subjects');
  });

  it('should render projects\' retired subjects count', function () {
    expect(wrapper.find(StyledStat).at(5).text()).to.equal((13000).toLocaleString());
  });

  it('should render retired subjects description', function () {
    expect(wrapper.find(Translate).at(5).props().component)
      .to.equal(StyledStatDescription);
    expect(wrapper.find(Translate).at(5).props().content)
      .to.equal('organization.stats.byTheNumbersContent.retiredSubjects');
  });

  it('should render oldest project\'s display name', function () {
    expect(wrapper.find(StyledStat).at(6).text()).to.equal('Finished Project 1');
  });

  it('should render first project description', function () {
    expect(wrapper.find(Translate).at(6).props().component)
      .to.equal(StyledStatDescription);
    expect(wrapper.find(Translate).at(6).props().content)
      .to.equal('organization.stats.byTheNumbersContent.firstProject');
  });

  it('should render oldest project\'s launch date', function () {
    expect(wrapper.find(StyledStat).at(7).text()).to.equal('2016');
  });

  it('should render first project launch date description', function () {
    expect(wrapper.find(Translate).at(7).props().component)
      .to.equal(StyledStatDescription);
    expect(wrapper.find(Translate).at(7).props().content)
      .to.equal('organization.stats.byTheNumbersContent.firstProjectLaunch');
  });
});
