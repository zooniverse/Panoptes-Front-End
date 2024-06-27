import { expect } from 'chai';
import sinon from 'sinon';
import removeTaskKeyFromWorkflow from './removeTaskKeyFromWorkflow.js';

describe('removeTaskKeyFromWorkflow', function () {
  let workflow;

  beforeEach(function () {
    workflow = {
      tasks: {
        'T1': {
          type: 'single',
          answers: [
            { label: 'Yes', next: 'T3' },
            { label: 'No', next: 'T2' }
          ]
        },
        'T2': {
          type: 'multiple',
          next: 'T3',
          answers: [
            { label: 'Blue' },
            { label: 'Green' }
          ]
        },
        'T3': {
          type: 'text',
          next: ''
        }
      },
      update: sinon.stub(),
      save: sinon.stub()
    };
  });

  it('should delete the selected key from each task', function () {
    removeTaskKeyFromWorkflow(workflow, 'T3');
    expect(workflow.update).to.have.been.calledWith({
      'tasks.T1.answers.0.next': '',
      'tasks.T2.next': ''
    });
  });
});
