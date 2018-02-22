/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { ProjectNavbarNarrow, StyledBackground, StyledOuterWrapper, StyledInnerWrapper } from './ProjectNavbarNarrow';

const MOCK_LINKS = [{ url: 'https://www.google.com' }, { url: 'https://www.yahoo.com' }];

describe('ProjectNavbarNarrow', function() {
  let wrapper;
  const handleOpenSpy = sinon.spy(ProjectNavbarNarrow.prototype, 'handleOpen');
  before(function() {
    wrapper = shallow(
      <ProjectNavbarNarrow
        navLinks={MOCK_LINKS}
      />
    );
  });

  it('should render without crashing', function() {});

  it('should render a StyledBackground component', function() {
    expect(wrapper.find(StyledBackground)).to.have.lengthOf(1);
  });

  it('should render a StyledOuterWrapper component', function () {
    expect(wrapper.find(StyledOuterWrapper)).to.have.lengthOf(1);
  });

  it('should render a StyledInnerWrapper component', function () {
    expect(wrapper.find(StyledInnerWrapper)).to.have.lengthOf(1);
  });

  it('should render an Avatar component', function () {
    expect(wrapper.find('Avatar')).to.have.lengthOf(1);
  });

  it('should render a ProjectTitle component', function () {
    expect(wrapper.find('ProjectTitle')).to.have.lengthOf(1);
  });

  it('should render a NarrowMenuButton component', function () {
    expect(wrapper.find('NarrowMenuButton')).to.have.lengthOf(1);
  });

  it('should render a NarrowMenu component', function () {
    expect(wrapper.find('NarrowMenu')).to.have.lengthOf(1);
  });

  describe('when #handleOpen is toggled', function() {
    it('should call setState when #handleOpen is toggled', function() {
      const previousState = wrapper.state();
      wrapper.instance().handleOpen();
      expect(handleOpenSpy.calledOnce).to.be.true;
      expect(previousState).to.not.equal(wrapper.state());
    });
  });
});
