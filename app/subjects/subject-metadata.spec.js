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

const project = {
  id: '1',
  slug: 'zooniverse/survos-testing'
}

describe('SubjectMetadata', function () {
  it('should render without crashing', function () {
    const wrapper = shallow(
      <SubjectMetadata subject={subject_ofType_subjectGroup} project={project} />
    );
    expect(wrapper).to.be.ok
  })
});
