/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ProjectTitle, { H1, StyledLink } from './ProjectTitle';
import {
  projectWithoutRedirect,
} from '../../testHelpers';

describe('ProjectTitle', function() {
  let wrapper;
  const link = `/projects/${projectWithoutRedirect.slug}`;

  before(function() {
    wrapper = shallow(
      <ProjectTitle
        link={link}
        title={projectWithoutRedirect.title}
      />);
  });

  it('should render without crashing', function() {});

  it('should render a H1 component', function() {
    expect(wrapper.find(H1)).to.have.lengthOf(1);
  });

  it('should render a StyledLink component', function() {
    expect(wrapper.find(StyledLink)).to.have.lengthOf(1);
  });

  it('should render the project title', function() {
    expect(wrapper.html().includes(projectWithoutRedirect.title)).to.be.true;
  });

  it('should use the project slug in the StyledLink to prop', function() {
    expect(wrapper.find(StyledLink).props().to).to.equal(`${link}?facelift=true`);
  });
});