import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import { project, workflow } from '../dev-classifier/mock-data';
import ProjectPage from './project-page';

function Page() {
  return(
    <p>Hello world!</p>
  )
}

describe('ProjectPage', () => {
  const background = {
    src: 'the project background image url'
  };

  it('should render without crashing', () => {
    shallow(<ProjectPage><Page /></ProjectPage>);
  });

  it('should render the project nav bar', () => {
    const wrapper = shallow(<ProjectPage><Page /></ProjectPage>);
    const navElement = wrapper.find('ProjectNavbar').first();
    expect(navElement).to.have.lengthOf(1);
  });

  it('should receive a background, project and workflow props', () => {
    const wrapper = mount(<ProjectPage background={background} project={project} workflow={workflow} ><Page /></ProjectPage>);
    expect(wrapper.props().background).to.equal(background);
    expect(wrapper.props().project).to.equal(project);
    expect(wrapper.props().workflow).to.equal(workflow);
  });
  
  describe('with a launch-approved project', () => {
    const project = { launch_approved: true };
    const wrapper = shallow(<ProjectPage project={project} ><Page /></ProjectPage>);
    const disclaimer = wrapper.find('Translate[className="project-disclaimer"]')
    it('should not render the Zooniverse disclaimer.', () => {
      expect(disclaimer).to.have.lengthOf(0);
    });
    
  });
  
  describe('without approval', () => {
    it('should render the Zooniverse disclaimer.');
    it('should render the disclaimer immediately after its children.')
  });
});
