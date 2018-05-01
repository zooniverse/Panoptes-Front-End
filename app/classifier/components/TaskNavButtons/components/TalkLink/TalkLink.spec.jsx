/* eslint
  func-names: 0,
  import/no-extraneous-dependencies: ["error", { "devDependencies": true }]
  prefer-arrow-callback: 0,
  "react/jsx-boolean-value": ["error", "always"]
*/

import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import { TalkLink, StyledTalkLink, StyledDisabledTalkPlaceholder } from './TalkLink';

describe('TalkLink', function() {
  describe('rendering', function() {
    let wrapper;
    const projectSlug = 'zooniverse/cool-project';
    const subjectId = '1';
    before(function () {
      wrapper = mount(<TalkLink projectSlug={projectSlug} subjectId={subjectId} />);
    });

    it('should render without crashing', function () {
      expect(wrapper).to.be.ok;
    });

    it('should render a Translate component', function () {
      expect(wrapper.find('Translate')).to.have.lengthOf(1);
    });

    it('should default the translation content to "classifier.talk"', function() {
      expect(wrapper.find('Translate').props().content).to.equal('classifier.talk');
    });

    it('should use props.translateContent in the Translation component if defined', function() {
      wrapper.setProps({ translateContent: 'classifier.doneAndTalk' });
      expect(wrapper.find('Translate').props().content).to.equal('classifier.doneAndTalk'); 
    });

    it('should use props.projectSlug in the Link to props', function() {
      expect(wrapper.find('Link').props().to).to.include(projectSlug);
    });

    it('should use props.subjectId in the Link to props', function() {
      expect(wrapper.find('Link').props().to).to.include(subjectId);
    });
  });

  // Test is throwing an error:
  // Invariant Violation: <Link>s rendered outside of a router context cannot handle clicks.
  // How do we get this test to work with RR v2.
  // All of the docs online are address v4 which has a radically different API.
  // describe('onClick event', function() {
  //   let wrapper;
  //   const onClickSpy = sinon.spy();
  //   before(function () {
  //     wrapper = mount(<TalkLink onClick={onClickSpy} />, { context: { router: {}}});
  //   });

  //   it('should call props.onClick', function() {
  //     wrapper.find('a').simulate('click');
  //     expect(onClickSpy.calledOnce).to.be.true;
  //   });
  // });

  describe('props.disabled', function() {
    let wrapper;
    before(function () {
      wrapper = mount(<TalkLink />);
    });

    it('should render a StyledTalkLink when props.disabled is false', function() {
      expect(wrapper.find(StyledTalkLink)).to.have.lengthOf(1);
      expect(wrapper.find(StyledDisabledTalkPlaceholder)).to.have.lengthOf(0);
    });

    it('should render a StyledDisabledTalkPlaceholder when props.disabled is true', function() {
      wrapper.setProps({ disabled: true });
      expect(wrapper.find(StyledTalkLink)).to.have.lengthOf(0);
      expect(wrapper.find(StyledDisabledTalkPlaceholder)).to.have.lengthOf(1);
    });
  });
});
