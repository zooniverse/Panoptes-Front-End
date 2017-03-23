/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'] */
/* global describe, it, beforeEach */
import React from 'react';
import DefaultClassificationSummary from './default-classification-summary';
import { TextSplit } from 'seven-ten';
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
  describe('first to classify experiment', function(){
    const splits = {
      'subject.first-to-classify': {
        key: 'subject.first-to-classify',
        state: 'active',
        variant: {
          value: {
            message: 'You\'re the first!'
          }
        }
      }
    };

    it('should show a message if the classification count is 0', function() {
      const wrapper = shallow(<DefaultClassificationSummary workflow={workflow} classification={classification} classificationCount={0} splits={splits} />);
      assert.equal(wrapper.find(TextSplit).find({splitKey:'subject.first-to-classify', textKey:'message'}).length, 1);
    });

    it('should not show a message if the classification count is greater than 0', function() {
      const wrapper = shallow(<DefaultClassificationSummary workflow={workflow} classification={classification} classificationCount={1} splits={splits} />);
      assert.equal(wrapper.find(TextSplit).find({splitKey:'subject.first-to-classify', textKey:'message'}).length, 0);
    });

  });
});
