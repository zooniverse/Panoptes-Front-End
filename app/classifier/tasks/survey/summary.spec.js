import { shallow } from 'enzyme';
import assert from 'assert';
import React from 'react';
import Summary from './summary';
import { workflow } from '../../../pages/dev-classifier/mock-data';

const annotation = { 
  value: [{
    "choice": "ar",
    "answers": {
      "ho": "two",
      "be": [
        "mo",
        "ea"
      ]
    },
    "filters": {}
  }]
};
const task = workflow.tasks.survey
const expectedSummary = 'Armadillo: 2; Moving, Eating';

describe('Survey task summary, not expanded', function() {
  const wrapper = shallow(<Summary annotation={annotation} task={task} />);
  const answers = wrapper.find('.answers .answer');

  it('should show one answer node', function(){
    assert.equal(answers.length, 1);
  });

  it('should summarise the number of identifications', function() {
    assert.equal(answers.text(), '1 identifications');
  });
});

describe('Survey task summary, expanded', function() {
  const wrapper = shallow(<Summary annotation={annotation} task={task} expanded={true} />);
  const answers = wrapper.find('.answers .answer');

  it('should show two answer nodes', function(){
    assert.equal(answers.length, 2);
  });
  
  it('should summarise the identification and questions', function() {
    assert.equal(answers.last().text(), expectedSummary);
  });
})