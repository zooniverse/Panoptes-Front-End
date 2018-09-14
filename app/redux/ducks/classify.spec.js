import reducer from './classify';
import { expect } from 'chai';

describe('Classifier actions', function () {
  describe('append subjects', function () {
    const action = {
      type: 'pfe/classify/APPEND_SUBJECTS',
      payload: {
        subjects: [1, 2],
        workflowID: '1'
      }
    };
    it('should do nothing without a workflow', function () {
      const state = {
        workflow: null,
        upcomingSubjects: []
      };
      const newState = reducer(state, action);
      expect(newState.upcomingSubjects).to.be.empty;
    });
    it('should do nothing if the workflow ID does not match', function () {
      const state = {
        workflow: { id: '2'},
        upcomingSubjects: []
      };
      const newState = reducer(state, action);
      expect(newState.upcomingSubjects).to.be.empty;
    });
    it('should append subjects if the workflow ID does match', function () {
      const state = {
        workflow: { id: '1'},
        upcomingSubjects: [3, 4]
      };
      const newState = reducer(state, action);
      expect(newState.upcomingSubjects).to.deep.equal([3, 4, 1, 2]);
    });
    it('should add subjects to an empty queue', function () {
      const state = {
        workflow: { id: '1'},
        upcomingSubjects: []
      };
      const newState = reducer(state, action);
      expect(newState.upcomingSubjects).to.deep.equal([1, 2]);
    });
  });
  describe('prepend subjects', function () {
    const action = {
      type: 'pfe/classify/PREPEND_SUBJECTS',
      payload: {
        subjects: [1, 2],
        workflowID: '1'
      }
    };
    it('should do nothing without a workflow', function () {
      const state = {
        workflow: null,
        upcomingSubjects: []
      };
      const newState = reducer(state, action);
      expect(newState.upcomingSubjects).to.be.empty;
    });
    it('should do nothing if the workflow ID does not match', function () {
      const state = {
        workflow: { id: '2'},
        upcomingSubjects: []
      };
      const newState = reducer(state, action);
      expect(newState.upcomingSubjects).to.be.empty;
    });
    it('should prepend subjects if the workflow ID does match', function () {
      const state = {
        workflow: { id: '1'},
        upcomingSubjects: [3, 4]
      };
      const newState = reducer(state, action);
      expect(newState.upcomingSubjects).to.deep.equal([3, 1, 2, 4]);
    });
    it('should add subjects to an empty queue', function () {
      const state = {
        workflow: { id: '1'},
        upcomingSubjects: []
      };
      const newState = reducer(state, action);
      expect(newState.upcomingSubjects).to.deep.equal([1, 2]);
    });
  });
});
