import { mount } from 'enzyme';
import assert from 'assert';
import counterpart from 'counterpart';
import React from 'react';
import Summary from './summary';
import { workflow } from '../../../pages/dev-classifier/mock-data';
import enLocale from '../../../locales/en';

counterpart.registerTranslations('en', enLocale);

const annotation = {
  value: [{
    "choice": "ar",
    "answers": {
      "ho": "one",
      "be": [
        "mo"
      ]
    },
    "filters": {}
    }, {
    "choice": "to",
    "answers": {
      "ho": "two",
      "be": [
        "ea"
      ],
      "in": "n",
      "bt": "Y"
    },
    "filters": {}
  }]
};
const task = workflow.tasks.survey;
const expectedSummary = 'Tortoise: 2; Eating; Nope; HECK YES';

describe('Survey task summary, not expanded', function() {
  const wrapper = mount(<Summary annotation={annotation} task={task} />);
  const question = wrapper.find('.question span').first();
  const answers = wrapper.find('.answers .answer');

  it('should summarise the survey task', function() {
    const count = task.choicesOrder.length;
    assert.equal(`Survey of ${count}`, question.text());
  });

  it('should show one answer node', function() {
    assert.equal(answers.length, 1);
  });

  it('should summarise the number of identifications', function() {
    assert.equal(answers.text(), '2 identifications');
  });
});

describe('Survey task summary, expanded', function() {
  const wrapper = mount(<Summary annotation={annotation} task={task} expanded={true} />);
  const question = wrapper.find('.question span').first();
  const answers = wrapper.find('.answers .answer');

  it('should summarise the survey task', function() {
    const count = task.choicesOrder.length;
    assert.equal(`Survey of ${count}`, question.text());
  });

  it('should show three answer nodes', function() {
    assert.equal(answers.length, 3);
  });

  it('should summarise the identification and questions', function() {
    assert.equal(answers.last().text(), expectedSummary);
  });
})
