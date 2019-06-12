import reducer, { clearIntervention, loadWorkflow } from './classify';
import { expect } from 'chai';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import mockPanoptesResource from '../../../test/mock-panoptes-resource';
import FakeLocalStorage from '../../../test/fake-local-storage';
import seenThisSession from '../../lib/seen-this-session';

global.innerWidth = 1000;
global.innerHeight = 1000;
global.sessionStorage = new FakeLocalStorage();
sessionStorage.setItem('session_id', JSON.stringify({ id: 0, ttl: 0 }));

function mockSubject(id) {
  return mockPanoptesResource('subjects', {
    id,
    locations: [],
    metadata: {
      intervention: true
    },
  });
}

describe('Classifier actions', function () {
  describe('add intervention', function () {
    const action = {
      type: 'pfe/classify/ADD_INTERVENTION',
      payload: {
        message: 'Hi there!',
        project_id: '1',
        workflow_id: '2'
      }
    };
    const state = {
      classification: { id: '1', links: { project: '1', workflow: '2' } },
      intervention: null
    };

    describe('with non string payload IDs', function () {
      const intIDAction = {
        type: 'pfe/classify/ADD_INTERVENTION',
        payload: {
          message: 'Hi there!',
          project_id: 1,
          workflow_id: 2
        }
      };
      it('should store the intervention', function () {
        const newState = reducer(state, intIDAction);
        expect(newState.intervention).to.deep.equal(intIDAction.payload);
      });
    });
    describe('with a valid project id but no workflow id', function () {
      const noWorkflowIdAction = {
        type: 'pfe/classify/ADD_INTERVENTION',
        payload: {
          message: 'Hi there!',
          project_id: '1'
        }
      };
      it('should store the intervention', function () {
        const newState = reducer(state, noWorkflowIdAction);
        expect(newState.intervention).to.deep.equal(noWorkflowIdAction.payload);
      });
    });
    describe('with a valid project and workflow', function () {
      it('should store the intervention', function () {
        const newState = reducer(state, action);
        expect(newState.intervention).to.deep.equal(action.payload);
      });
      describe('with an invalid workflow', function () {
        const invalidWorkflowState = {
          classification: { id: '1', links: { project: '1', workflow: '1' } },
          intervention: null
        };
        it('should not store the intervention', function () {
          const newState = reducer(invalidWorkflowState, action);
          expect(newState.intervention).to.be.null;
        });
      });
    });
    describe('with an invalid project and valid workflow', function () {
      const invalidProjectState = {
        classification: { id: '1', links: { project: '2', workflow: '1' } },
        intervention: null
      };
      it('should ignore the intervention', function () {
        const newState = reducer(invalidProjectState, action);
        expect(newState.intervention).to.be.null;
      });
      describe('with an invalid workflow', function () {
        const invalidProjectWorkflowState = {
          classification: { id: '1', links: { project: '2', workflow: '2' } },
          intervention: null
        };
        it('should not store the intervention', function () {
          const newState = reducer(invalidProjectWorkflowState, action);
          expect(newState.intervention).to.be.null;
        });
      });
    });
    describe('with an existing intervention and a valid payload', function () {
      it('should ignore the intervention', function () {
        const existingIntervention = {
          message: 'this is an intervention',
          uuid: '123456'
        };
        state.intervention = existingIntervention;
        const newState = reducer(state, action);
        expect(newState.intervention).to.deep.equal(existingIntervention);
      });
    });
  });

  describe('clear intervention', function () {
    const action = {
      type: 'pfe/classify/CLEAR_INTERVENTION',
    };
    const state = {
      intervention: {
        message: 'this is an intervention'
      }
    };
    it('should clear intervention messages', function () {
      const newState = reducer(state, action);
      expect(newState.intervention).to.be.null;
    });
  });

  describe('store last intervention uuid', function () {
    const action = {
      type: 'pfe/classify/STORE_INTERVENTION_UUID',
    };
    const state = {
      intervention: {
        message: 'this is an intervention',
        uuid: '2d931510-d99f-494a-8c67-87feb05e1594'
      }
    };
    it('should store the intervention UUID to link the next classification', function () {
      const newState = reducer(state, action);
      expect(newState.lastInterventionUUID).to.equal(state.intervention.uuid);
    });
    describe('when no intervention exists', function () {
      const noInterventionState = {};
      it('should not store the last intervention UUID', function () {
        const newState = reducer(noInterventionState, action);
        expect(newState.lastInterventionUUID).to.be.null;
      });
    });
  });

  describe('append subjects', function () {
    const subjects = [
        mockSubject('3'),
        mockSubject('4'),
        mockSubject('1'),
        mockSubject('2')
      ]
    const action = {
      type: 'pfe/classify/APPEND_SUBJECTS',
      payload: {
        subjects: [subjects[2], subjects[3]],
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
        upcomingSubjects: [subjects[0], subjects[1]]
      };
      const newState = reducer(state, action);
      expect(newState.upcomingSubjects).to.deep.equal(subjects);
    });
    it('should add subjects to an empty queue', function () {
      const state = {
        workflow: { id: '1'},
        upcomingSubjects: []
      };
      const newState = reducer(state, action);
      expect(newState.upcomingSubjects).to.deep.equal(action.payload.subjects);
    });
  });
  describe('prepend subjects', function () {
    const subjects = [
      mockSubject('3'),
      mockSubject('1'),
      mockSubject('2'),
      mockSubject('4')
    ]
    const action = {
      type: 'pfe/classify/PREPEND_SUBJECTS',
      payload: {
        subjects: [subjects[1], subjects[2]],
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
        upcomingSubjects: [subjects[0], subjects[3]]
      };
      const newState = reducer(state, action);
      expect(newState.upcomingSubjects).to.deep.equal(subjects);
    });
    it('should add subjects to an empty queue', function () {
      const state = {
        workflow: { id: '1'},
        upcomingSubjects: []
      };
      const newState = reducer(state, action);
      expect(newState.upcomingSubjects).to.deep.equal(action.payload.subjects);
    });
  });
  describe('next subject', function () {
    const subjects = [mockSubject('1'), mockSubject('2')]
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
        upcomingSubjects: [subjects[0]],
        intervention: {
          message: 'This is a test intervention'
        }
      };
      it('should empty the queue', function () {
        const newState = reducer(state, action);
        expect(newState.upcomingSubjects).to.be.empty;
      });
      it('should clear the old classification', function () {
        const newState = reducer(state, action);
        expect(newState.classification).to.be.null;
      });
      it('should not clear any stored interventions', function () {
        const newState = reducer(state, action);
        expect(newState.intervention).to.eql(state.intervention);
      });
    });
    describe('with multiple subjects in the queue', function () {
      const state = {
        workflow: { id: '1' },
        upcomingSubjects: subjects,
        intervention: {
          message: 'This is a test intervention'
        }
      };
      it('should shift the first subject off the queue', function () {
        const newState = reducer(state, action);
        expect(newState.upcomingSubjects).to.deep.equal([subjects[1]]);
      });
      it('should create a classification for the next subject in the queue', function () {
        const newState = reducer(state, action);
        expect(newState.classification.links.subjects).to.deep.equal(['2']);
      });
      it('should not clear any stored interventions', function () {
        const newState = reducer(state, action);
        expect(newState.intervention).to.eql(state.intervention);
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
      upcomingSubjects: [mockSubject('1'), mockSubject('2')]
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
      upcomingSubjects: []
    };

    beforeEach(function () {
      state.upcomingSubjects = [mockSubject('1'), mockSubject('2')];
    });

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
    it('should not clear any stored interventions', function () {
      const interventionState = {
        classification: { id: '1' },
        workflow: { id: '1' },
        upcomingSubjects: [mockSubject('1')],
        intervention: {}
      };
      const newState = reducer(interventionState, action);
      expect(newState.intervention).to.equal(interventionState.intervention);
    });
    it('should clear the subject intervention flag', function () {
      const newState = reducer(state, action);
      const currentSubject = newState.upcomingSubjects[0]
      expect(currentSubject.metadata.intervention).to.be.undefined;
    });
    it('should record the subject source as metadata.source', function () {
      const newState = reducer(state, action);
      expect(newState.classification.metadata.source).to.equal('sugar');
    });
    it('should do nothing if the queue is empty', function () {
      state.upcomingSubjects = [];
      const newState = reducer(state, action);
      expect(newState).to.deep.equal(state);
    });
    it('should not record the lastInteventionUUID if not set', function () {
      const newState = reducer(state, action);
      expect(newState.classification.metadata.hasOwnProperty('intervention_uuid')).to.be.false;
    });
    describe('with lastInteventionUUID set', function () {
      const interventionUUIDState = {
        classification: { id: '1' },
        workflow: { id: '1' },
        upcomingSubjects: [mockSubject('1')],
        lastInterventionUUID: '2d931510-d99f-494a-8c67-87feb05e1594'
      };
      it('should record the lastInterventionUUID as metadata.interventions.uuid', function () {
        const newState = reducer(interventionUUIDState, action);
        expect(newState.classification.metadata.interventions.uuid).to.equal(interventionUUIDState.lastInterventionUUID);
      });
      it('should clear any lastInteventionUUID if set', function () {
        const newState = reducer(interventionUUIDState, action);
        expect(newState.lastInterventionUUID).to.be.null;
      });
    });
  });
  describe('resume classification', function () {
    const subject1 = mockSubject('1');
    const subject2 = mockSubject('2');
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
      upcomingSubjects: [mockSubject('1'), mockSubject('2')]
    };
    const subject = mockSubject('2');
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
  describe('update classification metadata', function () {
    // setup state to be reset in beforeEach function
    let state = null;
    const action = {
      type: 'pfe/classify/UPDATE_METADATA',
      payload: {
        metadata: {
          a: 1,
          b: 2
        }
      }
    };

    beforeEach(function () {
      state = {
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
        upcomingSubjects: [mockSubject('1'), mockSubject('2')]
      };
    });
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
      upcomingSubjects: [mockSubject('1'), mockSubject('1')]
    };
    it('should store the specified workflow', function () {
      const newState = reducer(state, action);
      expect(newState.workflow).to.deep.equal(action.payload.workflow);
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
      upcomingSubjects: [mockSubject('1'), mockSubject('2')]
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

  describe('clear intervention', function () {
    const state = {
      intervention: {
        message: 'this is an intervention',
        uuid: '2d931510-d99f-494a-8c67-87feb05e1594'
      }
    };
    let storeState = Object.assign({}, state);

    function fakeDispatch(action) {
      if(typeof action === 'function') {
        action = action(fakeDispatch);
      }
      storeState = reducer(storeState, action);
      return storeState;
    }

    before(function () {
      clearIntervention()(fakeDispatch);
    });

    it('should store the intervention UUID to link the next classification', function () {
      expect(storeState.lastInterventionUUID).to.equal(state.intervention.uuid);
    });

    it('should clear intervention messages', function () {
      expect(storeState.intervention).to.be.null;
    });
  });

  describe('load workflow', function () {
    let awaitWorkflow;
    let state;
    let storeState;
    let initialState = {
      classification: null,
      goldStandardMode: false,
      intervention: null,
      upcomingSubjects: [mockSubject('1'), mockSubject('2')],
      workflow: { id: 'b' }
    };
    const fakeDispatch = sinon.stub().callsFake(function (action) {
      if(typeof action === 'function') {
        action = action(fakeDispatch);
      }
      storeState = reducer(storeState, action);
      return storeState;
    });
    const fakePreferences = {
      update: sinon.stub().callsFake(changes => changes),
      save: sinon.stub()
    };
    const fakeWorkflow = {
      id: 'a'
    };

    before(function () {
      sinon.stub(apiClient, 'type').callsFake(function (type) {
        if (type === 'workflows') {
          return {
            get: sinon.stub().callsFake(() => Promise.resolve(fakeWorkflow))
          };
        }
        if (type === 'translations') {
          const fakeTranslation = {
            strings: {}
          };
          return {
            get: sinon.stub().callsFake(() => Promise.resolve([fakeTranslation]))
          };
        }
      });
    });

    after(function () {
      apiClient.type.restore();
    });

    beforeEach(function () {
      state = Object.assign({}, initialState);
      storeState = initialState;
      awaitWorkflow = loadWorkflow('a', 'en', fakePreferences)(fakeDispatch);
    });

    afterEach(function () {
      fakeDispatch.resetHistory();
      fakePreferences.update.resetHistory();
      fakePreferences.save.resetHistory();
    });

    it('should update user preferences', function () {
      expect(fakePreferences.update).to.have.been.calledWith({ 'preferences.selected_workflow': 'a' });
    });

    it('should load the workflow translation', function () {
      const expectedAction = {
        type: 'pfe/translations/LOAD',
        translated_type: 'workflow',
        translated_id: 'a',
        language: 'en'
      };
      expect(fakeDispatch).to.have.been.calledWith(expectedAction);
    });

    it('should reset the classify store', function (done) {
      const expectedState = {
        classification: null,
        goldStandardMode: false,
        intervention: null,
        lastInterventionUUID: null,
        upcomingSubjects: [],
        workflow: fakeWorkflow
      };
      awaitWorkflow.then(function () {
        expect(storeState).to.deep.equal(expectedState);
      })
      .then(done, done);
    });

    it('should save user preferences', function (done) {
      awaitWorkflow
      .then(function () {
        expect(fakePreferences.save).to.have.been.calledOnce;
      })
      .then(done, done);
    });

    it('should load a workflow', function (done) {
      awaitWorkflow
      .then(function () {
        expect(storeState.workflow).to.deep.equal(fakeWorkflow);
      })
      .then(done, done);
    });

    it('should not mutate initial state', function (done) {
      awaitWorkflow
      .then(function () {
        expect(state).to.deep.equal(initialState);
      })
      .then(done, done);
    });

    describe('on error', function () {
      describe('404 API errors', function () {
        before(function () {
          apiClient.type.restore();
          const fakeError = {
            status: 404
          };
          sinon.stub(apiClient, 'type').callsFake(function (type) {
            if (type === 'workflows') {
              return {
                get: sinon.stub().callsFake(() => Promise.reject(fakeError))
              };
            }
            if (type === 'translations') {
              const fakeTranslation = {
                strings: {}
              };
              return {
                get: sinon.stub().callsFake(() => Promise.resolve([fakeTranslation]))
              };
            }
          });
        });

        it('should clear the workflow ID from user preferences', function (done) {
          awaitWorkflow
          .then(function () {
            expect(fakePreferences.update).to.have.been.calledWith({ 'preferences.selected_workflow': undefined });
          })
          .then(done, done);
        });

        it('should set the stored workflow to null', function (done) {
          awaitWorkflow
          .then(function () {
            expect(storeState.workflow).to.be.null;
          })
          .then(done, done);
        });
      });

      describe('500 API errors', function () {
        before(function () {
          apiClient.type.restore();
          const fakeError = {
            status: 500
          };
          sinon.stub(apiClient, 'type').callsFake(function (type) {
            if (type === 'workflows') {
              return {
                get: sinon.stub().callsFake(() => Promise.reject(fakeError))
              };
            }
            if (type === 'translations') {
              const fakeTranslation = {
                strings: {}
              };
              return {
                get: sinon.stub().callsFake(() => Promise.resolve([fakeTranslation]))
              };
            }
          });
        });

        it('should not clear the workflow ID from user preferences', function (done) {
          awaitWorkflow
          .then(function () {
            expect(fakePreferences.update).to.not.have.been.calledWith({ 'preferences.selected_workflow': undefined });
          })
          .then(done, done);
        });

        it('should set the stored workflow to null', function (done) {
          awaitWorkflow
          .then(function () {
            expect(storeState.workflow).to.be.null;
          })
          .then(done, done);
        });
      });

      describe('200 responses with an undefined workflow', function () {
        before(function () {
          apiClient.type.restore();
          sinon.stub(apiClient, 'type').callsFake(function (type) {
            if (type === 'workflows') {
              return {
                get: sinon.stub().callsFake(() => Promise.resolve(undefined))
              };
            }
            if (type === 'translations') {
              const fakeTranslation = {
                strings: {}
              };
              return {
                get: sinon.stub().callsFake(() => Promise.resolve([fakeTranslation]))
              };
            }
          });
        });

        it('should not clear the workflow ID from user preferences', function (done) {
          awaitWorkflow
          .then(function () {
            expect(fakePreferences.update).to.not.have.been.calledWith({ 'preferences.selected_workflow': undefined });
          })
          .then(done, done);
        });

        it('should set the stored workflow to null', function (done) {
          awaitWorkflow
          .then(function () {
            expect(storeState.workflow).to.be.null;
          })
          .then(done, done);
        });
      });

      describe('translations API errors', function () {
        before(function () {
          apiClient.type.restore();
          const fakeError = {
            status: 500
          };
          sinon.stub(apiClient, 'type').callsFake(function (type) {
            if (type === 'workflows') {
              return {
                get: sinon.stub().callsFake(() => Promise.resolve(fakeWorkflow))
              };
            }
            if (type === 'translations') {
              const fakeTranslation = {
                strings: {}
              };
              return {
                get: sinon.stub().callsFake(() => Promise.reject(fakeError))
              };
            }
          });
        });

        it('should not clear the workflow ID from user preferences', function (done) {
          awaitWorkflow
          .then(function () {
            expect(fakePreferences.update).to.not.have.been.calledWith({ 'preferences.selected_workflow': undefined });
          })
          .then(done, done);
        });

        it('should load a workflow', function (done) {
          awaitWorkflow
          .then(function () {
            expect(storeState.workflow).to.deep.equal(fakeWorkflow);
          })
          .then(done, done);
        });
      });
    });
  });
});
