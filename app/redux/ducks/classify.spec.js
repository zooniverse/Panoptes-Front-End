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
  describe('next subject', function () {
    const action = {
      type: 'pfe/classify/NEXT_SUBJECT',
      payload: {
        project: { id: '1' }
      }
    };
    describe('with only one subject in the queue', function () {
      const state = {
        workflow: { id: '1' },
        upcomingSubjects: [1]
      };
      it('should empty the queue', function () {
        const newState = reducer(state, action);
        expect(newState.upcomingSubjects).to.be.empty;
      });
    });
    describe('with multiple subjects in the queue', function () {
      const state = {
        workflow: { id: '1' },
        upcomingSubjects: [{
          id: '1',
          locations: [],
          metadata: []
        },
        {
          id: '2',
          locations: [],
          metadata: []
        }]
      };
      it('should shift the first subject off the queue', function () {
        const newState = reducer(state, action);
        expect(newState.upcomingSubjects).to.deep.equal([{
          id: '2',
          locations: [],
          metadata: []
        }]);
      });
      it('should create a classification for the next subject in the queue', function () {
        const newState = reducer(state, action);
        expect(newState.classification.links.subjects).to.deep.equal(['2']);
      })
    });
  });
});
