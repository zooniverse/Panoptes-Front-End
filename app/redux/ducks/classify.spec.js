import reducer from './classify';
import { expect } from 'chai';
import mockPanoptesResource from '../../../test/mock-panoptes-resource';
import FakeLocalStorage from '../../../test/fake-local-storage';
import seenThisSession from '../../lib/seen-this-session';

global.innerWidth = 1000;
global.innerHeight = 1000;
global.sessionStorage = new FakeLocalStorage();
sessionStorage.setItem('session_id', JSON.stringify({ id: 0, ttl: 0 }));

describe('Classifier actions', function () {
  describe('add intervention', function () {
    const action = {
      type: 'pfe/classify/ADD_INTERVENTION',
      payload: {
        message: 'Hi there!',
        project_id: '1'
      }
    };
    describe('with a valid project', function () {
      const state = {
        classification: { id: '1', links: { project: '1' } },
        intervention: null
      };
      it('should store the intervention', function () {
        const newState = reducer(state, action);
        expect(newState.intervention).to.deep.equal(action.payload);
      });
    });
    describe('with an invalid project', function () {
      const state = {
        classification: { id: '1', links: { project: '2' } },
        intervention: null
      };
      it('should ignore the intervention', function () {
        const newState = reducer(state, action);
        expect(newState.intervention).to.be.null;
      });
    });
  });
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
        classification: { id: '1' },
        workflow: { id: '1' },
        upcomingSubjects: [1]
      };
      it('should empty the queue', function () {
        const newState = reducer(state, action);
        expect(newState.upcomingSubjects).to.be.empty;
      });
      it('should clear the old classification', function () {
        const newState = reducer(state, action);
        expect(newState.classification).to.be.null;
      });
      it('should clear any stored interventions', function () {
        const newState = reducer(state, action);
        expect(newState.intervention).to.be.null;
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
      });
      it('should clear any stored interventions', function () {
        const newState = reducer(state, action);
        expect(newState.intervention).to.be.null;
      });
    });
  });
  describe('reset subjects', function () {
    const action = {
      type: 'pfe/classify/RESET_SUBJECTS'
    };
    const state = {
      classification: { id: '1' },
      workflow: { id: '1' },
      upcomingSubjects: [{
        id: '1',
        locations: [],
        metadata: [],
        destroy: function () {}
      },
      {
        id: '2',
        locations: [],
        metadata: [],
        destroy: function () {}
      }]
    };
    it('should set the classification to null', function () {
      const newState = reducer(state, action);
      expect(newState.classification).to.be.null;
    });
    it('should empty the subject queue', function () {
      const newState = reducer(state, action);
      expect(newState.upcomingSubjects).to.be.empty;
    });
  });
  describe('create classification', function () {
    const action = {
      type: 'pfe/classify/CREATE_CLASSIFICATION',
      payload: {
        project: { id: '1' }
      }
    };
    const state = {
      classification: { id: '1' },
      workflow: { id: '1' },
      upcomingSubjects: [{
        id: '1',
        locations: [],
        metadata: [],
        destroy: function () {}
      },
      {
        id: '2',
        locations: [],
        metadata: [],
        destroy: function () {}
      }]
    };
    it('should create a classification for the first subject in the queue', function () {
      const newState = reducer(state, action);
      expect(newState.classification.links.subjects).to.deep.equal(['1']);
    });
    it('should create a classification for the specified project', function () {
      const newState = reducer(state, action);
      expect(newState.classification.links.project).to.equal('1');
    });
    it('should create a classification for the current workflow', function () {
      const newState = reducer(state, action);
      expect(newState.classification.links.workflow).to.equal('1');
    });
    it('should clear any stored interventions', function () {
      const newState = reducer(state, action);
      expect(newState.intervention).to.be.null;
    });
    it('should do nothing if the queue is empty', function () {
      state.upcomingSubjects = [];
      const newState = reducer(state, action);
      expect(newState).to.deep.equal(state);
    });
  });
  describe('resume classification', function () {
    const subject1 = {
      id: '1',
      locations: [],
      metadata: [],
      destroy: function () {}
    };
    const subject2 = {
      id: '2',
      locations: [],
      metadata: [],
      destroy: function () {}
    };
    const action = {
      type: 'pfe/classify/RESUME_CLASSIFICATION',
      payload: {
        classification: { id: '1' },
        subject: subject1
      }
    };
    const state = {
      classification: { id: '1' },
      workflow: { id: '1' },
      upcomingSubjects: [subject1, subject2]
    };
    it('should do nothing if the classification subject matches the current subject', function () {
      const newState = reducer(state, action);
      expect(newState).to.deep.equal(state);
    });
    it('should unshift the classification subject onto the queue if it is not the current subject', function () {
      const testState = Object.assign({}, state, { upcomingSubjects: [subject2] });
      const newState = reducer(testState, action);
      expect(newState).to.deep.equal(state);
    });
    it('should replace the current classification with the new classification', function () {
      const testState = Object.assign({}, state, { classification: { id: '2' } });
      const newState = reducer(testState, action);
      expect(newState).to.deep.equal(state);
    });
  });
  describe('complete classification', function () {
    const action = {
      type: 'pfe/classify/COMPLETE_CLASSIFICATION',
      payload: {
        annotations: [{ task: 'a', value: 'hello' }]
      }
    };
    const state = {
      classification: mockPanoptesResource('classifications', {
        id: '1',
        links: {
          subjects: ['2'],
          workflow: '3'
        }
      }),
      workflow: {
        id: '3',
        tasks: {
          a: {}
        }
      },
      upcomingSubjects: [1, 2]
    };
    const subject = {
      id: '2',
      locations: [],
      metadata: [],
      destroy: function () {}
    };
    it('should mark the workflow subject as seen', function () {
      expect(seenThisSession.check(state.workflow, subject)).to.be.false;
      const newState = reducer(state, action);
      expect(seenThisSession.check(newState.workflow, subject)).to.be.true;
    });
    it('should set the classification completed flag', function () {
      const newState = reducer(state, action);
      expect(newState.classification.completed).to.be.true;
    });
    it('should set the classification finished_at time', function () {
      const newState = reducer(state, action);
      expect(newState.classification.metadata.finished_at).to.be.ok;
    });
    it('should record the classification annotations', function () {
      const newState = reducer(state, action);
      expect(newState.classification.annotations).to.deep.equal(action.payload.annotations);
    });
  });
  describe('update classification', function () {
    const action = {
      type: 'pfe/classify/UPDATE_CLASSIFICATION',
      payload: {
        metadata: {
          a: 1,
          b: 2
        }
      }
    };
    const state = {
      classification: mockPanoptesResource('classifications', {
        id: '1',
        metadata: {
          b: 3,
          c: 4
        }
      }),
      workflow: {
        id: '1',
        tasks: {
          a: {}
        }
      },
      upcomingSubjects: [1, 2]
    };
    it('should add new keys to classification metadata', function () {
      const newState = reducer(state, action);
      expect(newState.classification.metadata.a).to.equal(1);
    });
    it('should overwrite classification metadata with changes', function () {
      const newState = reducer(state, action);
      expect(newState.classification.metadata.b).to.equal(2);
    });
    it('should preserve unchanged classification metadata', function () {
      const newState = reducer(state, action);
      expect(newState.classification.metadata.c).to.equal(4);
    });
  });
  describe('set workflow', function () {
    const action = {
      type: 'pfe/classify/SET_WORKFLOW',
      payload: {
        workflow: { id: '2' }
      }
    };
    const state = {
      classification: { id: '1' },
      workflow: { id: '1' },
      upcomingSubjects: [1, 2]
    };
    it('should store the specified workflow', function () {
      const newState = reducer(state, action);
      expect(newState.workflow).to.deep.equal(action.payload.workflow);
    });
  });
  describe('set workflow translation id', function () {
    const action = {
      type: 'pfe/classify/SET_WORKFLOW_TRANSLATION_ID',
      payload: '3'
    };
    const state = {
      classification: { id: '1' },
      workflow: { id: '2' },
      workflowTranslationId: '4',
      upcomingSubjects: [1, 2]
    };
    it('should store the specified workflow translation id', function () {
      const newState = reducer(state, action);
      expect(newState.workflowTranslationId).to.deep.equal(action.payload.workflowTranslationId);
    });
  });  
  describe('save annotations', function () {
    const action = {
      type: 'pfe/classify/SAVE_ANNOTATIONS',
      payload: {
        annotations: [1, 2, 3, 4]
      }
    };
    const state = {
      classification: mockPanoptesResource('classifications', {}),
      workflow: { id: '1' },
      upcomingSubjects: [1, 2]
    };
    it('should add annotations to the classification', function () {
      const newState = reducer(state, action);
      expect(newState.classification.annotations).to.deep.equal(action.payload.annotations);
    });
  });
  describe('toggle gold standard', function () {
    it('should set gold standard classifications and mode', function () {
      const action = {
        type: 'pfe/classify/TOGGLE_GOLD_STANDARD',
        payload: {
          goldStandard: true
        }
      };
      const state = {
        classification: mockPanoptesResource('classifications', {})
      };
      const newState = reducer(state, action);
      expect(newState.classification.gold_standard).to.be.true;
      expect(newState.goldStandardMode).to.be.true;
    });
    it('should unset gold standard classifications and mode', function () {
      const action = {
        type: 'pfe/classify/TOGGLE_GOLD_STANDARD',
        payload: {
          goldStandard: false
        }
      };
      const state = {
        classification: mockPanoptesResource('classifications', {})
      };
      const newState = reducer(state, action);
      expect(newState.classification.gold_standard).to.be.false;
      expect(newState.goldStandardMode).to.be.false;
    });
    it('should unset gold standard classifications if undefined', function () {
      const action = {
        type: 'pfe/classify/TOGGLE_GOLD_STANDARD',
        payload: {}
      };
      const state = {
        classification: mockPanoptesResource('classifications', {})
      };
      const newState = reducer(state, action);
      expect(newState.classification.gold_standard).to.be.undefined;
    });
  });
});
