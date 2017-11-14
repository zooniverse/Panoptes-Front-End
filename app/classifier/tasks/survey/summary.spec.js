import { mount } from 'enzyme';
import assert from 'assert';
import counterpart from 'counterpart';
import React from 'react';
import Summary from './summary';
import { workflow } from '../../../pages/dev-classifier/mock-data';
import enLocale from '../../../locales/en';

counterpart.registerTranslations('en', enLocale);

const noIdentification = { 
  task: 'survey',
  value: []
};

const oneIdentification = {
  task: 'survey',
  value: [{
    choice: 'ar',
    answers: {
      ho: 'two',
      be: [
        'mo',
        'ea'
      ]
    },
    filters: {}
  }]
};

const twoIdentifications = {
  task: 'survey',
  value: [{
    choice: 'ar',
    answers: {
      ho: 'one',
      be: [
        'mo'
      ]
    },
    filters: {}
    }, {
    choice: 'to',
    answers: {
      ho: 'two',
      be: [
        'ea'
      ],
      in: 'n',
      bt: 'Y'
    },
    filters: {}
  }]
};

const task = workflow.tasks.survey;
const oneExpectedSummary = 'Armadillo: 2; Moving, Eating';
const twoExpectedSummary = ['Armadillo: 1; Moving', 'Tortoise: 2; Eating; Nope; HECK YES'];

describe('Survey task summary, no identifications, not expanded', function() {
  const wrapper = mount(<Summary annotation={noIdentification} task={task} translation={task} />);
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
    assert.equal(answers.text(), 'No identifications');
  });
});

describe('Survey task summary, no identifications, expanded', function() {
  const wrapper = mount(<Summary annotation={noIdentification} task={task} translation={task} />);
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
    assert.equal(answers.text(), 'No identifications');
  });
});

describe('Survey task summary, one identification, not expanded', function() {
  const wrapper = mount(<Summary annotation={oneIdentification} task={task} translation={task} />);
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
    assert.equal(answers.text(), '1 identification');
  });
});

describe('Survey task summary, one identification, expanded', function() {
  const wrapper = mount(<Summary annotation={oneIdentification} task={task} translation={task} expanded={true} />);
  const question = wrapper.find('.question span').first();
  const answers = wrapper.find('.answers .answer');

  it('should summarise the survey task', function() {
    const count = task.choicesOrder.length;
    assert.equal(`Survey of ${count}`, question.text());
  });

  it('should show two answer nodes', function() {
    assert.equal(answers.length, 2);
  });

  it('should summarise the identification and questions', function() {
    assert.equal(answers.last().text(), oneExpectedSummary);
  });
});

describe('Survey task summary, two identifications, not expanded', function() {
  const wrapper = mount(<Summary annotation={twoIdentifications} task={task} translation={task} />);
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

describe('Survey task summary, two identifications, expanded', function() {
  const wrapper = mount(<Summary annotation={twoIdentifications} task={task} translation={task} expanded={true} />);
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
    assert.equal(answers.at(0).text(), '2 identifications');
    assert.equal(answers.at(1).text(), twoExpectedSummary[0]);
    assert.equal(answers.at(2).text(), twoExpectedSummary[1]);
  });
});
