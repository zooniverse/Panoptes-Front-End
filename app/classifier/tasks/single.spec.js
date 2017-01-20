/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */
import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import SingleTask from './single';

const task = {
  question: 'Is there something here?',
  answers: [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ]
};

const annotation = {
  value: 1
};

describe.skip('SingleChoiceTask', function () {
  let wrapper;

  beforeEach(function () {
    wrapper = shallow(<SingleTask task={task} annotation={annotation} />);
  });

  it('should render without crashing', function () {
  });
  
  it('should have a question', function () {
    const question = wrapper.find('div.question');
    assert.equal(summaries.length, 1);
  });
  
  it('should have answers', function () {
    const answers = wrapper.find('div.answer');
    assert.equal(answers.length, task.answers.length);
  });

});
