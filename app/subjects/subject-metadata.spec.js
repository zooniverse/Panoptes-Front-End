import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import SubjectMetadata from './subject-metadata';

const subject_ofType_subjectGroup = {
  id: '9000',
  locations: [
    { 'image/png': 'https://placekitten.com/200/200'},
    { 'image/png': 'https://placekitten.com/200/200'},
    { 'image/png': 'https://placekitten.com/200/200'},
    { 'image/png': 'https://placekitten.com/200/200'},
  ],
  metadata: {
    '#group_subject_ids': '9001-9002-9003-9004',
    '#subject_group_id': 100,
  }
}

const subject_ofType_singleImage = {
  id: '8000',
  locations: [
    { 'image/png': 'https://placekitten.com/200/200'},
  ],
}

const project = {
  id: '1',
  slug: 'zooniverse/survos-testing'
}

describe('SubjectMetadata', function () {
  describe('with Subject Group type of Subject', function () {
    it('should render without crashing', function () {
      const wrapper = shallow(
        <SubjectMetadata subject={subject_ofType_subjectGroup} project={project} />
      );
      expect(wrapper).to.be.ok
    });
    
    it('should list the correct number of component Subjects (when expanded)', function () {
      const wrapper = shallow(
        <SubjectMetadata subject={subject_ofType_subjectGroup} project={project} expandSubjectGroup={true} />
      );
      expect(wrapper.find('li')).to.have.lengthOf(4);
    });
  });
  describe('with single image Subject', function () {
    it('should not render', function () {
      const wrapper = shallow(
        <SubjectMetadata subject={subject_ofType_subjectGroup} project={project} />
      );
      expect(wrapper).to.be.empty
    });
  });
});
