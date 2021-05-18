/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */
import React from 'react';
import DefaultClassificationSummary from './default-classification-summary';
import assert from 'assert';
import { shallow } from 'enzyme';

const workflow = {
  tasks: {
    T0: {
      type: 'single',
      question: 'question one',
      help: '',
      answers: [
        { label: 'answer one' },
        { label: 'answer two' }
      ]
    }
  }
};

const classification = {
  annotations: [
    {
      task: 'T0',
      value: 0
    }
  ]
};

describe('DefaultClassificationSummary', function () {
  describe('if classification is provided', function () {
    let wrapper;

    beforeEach(function () {
      wrapper = shallow(<DefaultClassificationSummary workflow={workflow} classification={classification} />);
    });

    it('should render without crashing', function () {
    });

    it('should have a summary component for each annotation', function () {
      const summaries = wrapper.find('div.classification-task-summary');
      assert.equal(summaries.length, classification.annotations.length);
    });
  });

  describe('if classification is not provided', function () {
    it('should render without crashing', function () {
      shallow(<DefaultClassificationSummary />);
    });
  });
});
