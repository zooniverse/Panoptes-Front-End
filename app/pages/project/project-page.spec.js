import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { IndexLink, Link } from 'react-router';
import { project, workflow } from '../dev-classifier/mock-data';
import ProjectPage from './project-navbar';

describe('ProjectPage', () => {
  it('should render without crashing', () => {
    shallow(<ProjectPage project={project} workflow={workflow} />);
  });

  it('should render the project nav bar', () => {
    const wrapper = shallow(<ProjectPage project={project} workflow={workflow} />);
    const navElement = wrapper.find('ProjectNavbar').first();
    expect(navElement).to.have.lengthOf(1);
  });
});
