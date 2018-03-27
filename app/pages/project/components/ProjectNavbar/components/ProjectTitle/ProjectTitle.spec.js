/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ProjectTitle, { H1, StyledLink, StyledRedirect, StyledCheckMark, StyledCheckMarkWrapper, StyledUnderReview } from './ProjectTitle';
import {
  projectWithoutRedirect, projectWithRedirect
} from '../../../../../../../test';

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

  it('should render a StyledLink component if project without redirect', function() {
    expect(wrapper.find(StyledLink)).to.have.lengthOf(1);
  });

  it('should render the project title', function() {
    expect(wrapper.html().includes(projectWithoutRedirect.title)).to.be.true;
  });

  it('should use the project slug in the StyledLink to prop', function() {
    expect(wrapper.find(StyledLink).props().to).to.equal(link);
  });

  it('should not render a StyledCheckMarkWrapper component', function() {
    expect(wrapper.find(StyledCheckMarkWrapper)).to.have.lengthOf(0);
  });

  it('should not render a StyledCheckMark component', function () {
    expect(wrapper.find(StyledCheckMark)).to.have.lengthOf(0);
  });

  it('should not render the font awesome circle icon', function () {
    expect(wrapper.find('i.fa-circle')).to.have.lengthOf(0);
  });

  it('should not render a StyledUnderReview component', function () {
    expect(wrapper.find(StyledUnderReview)).to.have.lengthOf(0);
  });

  describe('when the project is launched approved', function() {
    before(function() {
      wrapper.setProps({ launched: true });
    });

    after(function() {
      wrapper.setProps({ launched: false });
    });

    it('should render a StyledCheckMarkWrapper component', function() {
      expect(wrapper.find(StyledCheckMarkWrapper)).to.have.lengthOf(1);
    });

    it('should render a StyledCheckMark component', function() {
      expect(wrapper.find(StyledCheckMark)).to.have.lengthOf(1);
    });

    it('should render the font awesome circle icon', function() {
      expect(wrapper.find('i.fa-circle')).to.have.lengthOf(1);
    });
  });

  describe('when the project is under beta review', function() {
    before(function() {
      wrapper.setProps({ underReview: true });
    });

    it('should render a StyledUnderReview component', function() {
      expect(wrapper.find(StyledUnderReview)).to.have.lengthOf(1);
    });
  });

  describe('when the project has a redirect', function() {
    before(function() {
      wrapper.setProps({ redirect: projectWithRedirect.redirect });
    });

    it('should use the project redirect in the StyledRedirect href prop', function() {
      expect(wrapper.find(StyledRedirect).props().href).to.equal(projectWithRedirect.redirect);
    });

    it('should render the font awesome external link icon', function() {
      expect(wrapper.find('i.fa-external-link')).to.have.lengthOf(1);
    });
  });
});
