import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { IndexLink, Link } from 'react-router';
import ProjectNavbar from './project-navbar';

describe('ProjectNavbar', () => {
  let wrapper;

  before(() => {
    wrapper = shallow(<ProjectNavbar />);
  });
  it('should render without crashing', () => {
    // const navbarContainer = wrapper.find('<nav');
    shallow(<ProjectNavbar />);
  });
});
