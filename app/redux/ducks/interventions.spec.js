import { expect } from 'chai';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import { sugarClient } from 'panoptes-client/lib/sugar';
import reducer, { intervention, subscribe, unsubscribe, dismiss } from './interventions';
import mockPanoptesResource from '../../../test/mock-panoptes-resource';

describe('Intervention actions', function () {
  let subscribeSpy;
  let unsubscribeSpy;
  before(function () {
    subscribeSpy = sinon.stub(sugarClient, 'subscribeTo').callsFake(() => true);
    unsubscribeSpy = sinon.stub(sugarClient, 'unsubscribeFrom').callsFake(() => true);
  });
  after(function () {
    subscribeSpy.restore();
    unsubscribeSpy.restore();
  });
  describe('add notification', function () {
    const state = {
      error: null,
      notifications: []
    };
    const action = {
      type: 'pfe/interventions/ADD_NOTIFICATION',
      payload: 'Hello'
    };
    it('should store a notification', function () {
      const newState = reducer(state, action);
      expect(newState.notifications).to.deep.equal(['Hello']);
    });
  });
  describe('dismiss notification', function () {
    const state = {
      error: null,
      notifications: ['Goodbye','Hello']
    };
    const action = {
      type: 'pfe/interventions/DISMISS_NOTIFICATION'
    };
    it('should remove the most recent notification', function () {
      const newState = reducer(state, action);
      expect(newState.notifications).to.deep.equal(['Goodbye']);
    });
  });
  describe('subscribe', function () {
    const state = {
      error: null,
      notifications: []
    };
    const action = {
      type: 'pfe/interventions/SUBSCRIBE',
      payload: 'A channel'
    };
    before(function () {
      const newState = reducer(state, action);
    });
    it('should subscribe to Sugar', function () {
      expect(subscribeSpy.callCount).to.equal(1);
    });
    it('should subscribe to the specified channel', function () {
      expect(subscribeSpy.calledWith(action.payload)).to.be.true;
    });
  });
  describe('unsubscribe', function () {
    const state = {
      error: null,
      notifications: []
    };
    const action = {
      type: 'pfe/interventions/UNSUBSCRIBE',
      payload: 'A channel'
    };
    before(function () {
      const newState = reducer(state, action);
    });
    it('should unsubscribe from Sugar', function () {
      expect(unsubscribeSpy.callCount).to.equal(1);
    });
    it('should unsubscribe from the specified channel', function () {
      expect(unsubscribeSpy.calledWith(action.payload)).to.be.true;
    });
  });
  describe('on error', function () {
    const state = {
      error: null,
      notifications: ['Goodbye','Hello']
    };
    const action = {
      type: 'pfe/interventions/ERROR',
      payload: 'Oh no!'
    };
    it('should store the error', function () {
      const newState = reducer(state, action);
      expect(newState.error).to.equal(action.payload);
    });
  });
  describe('action creators', function () {
    describe('notify', function () {
      describe('unknown experiment behaviour', function () {
        const message = {
          data: {
            payload: 'do something unkown'
          }
        };
        it('should dispatch the unknown experiment handler', function () {
          const action = intervention(message);
          const expectedAction = {
            type: 'pfe/interventions/UNKNOWN_EXPERIMENT'
          };
          expect(action).to.deep.equal(expectedAction);
        });
      });

      describe('missing data in payload', function () {
        const message = {
          type: 'experiment',
          payload: {
            message: 'can i haz your money?'
          }
        };
        it('should dispatch the missing data handler', function () {
          const action = intervention(message);
          const expectedAction = {
            type: 'pfe/interventions/MISSING_DATA'
          };
          expect(action).to.deep.equal(expectedAction);
        });
      });

      describe('non intervention message', function () {
        const message = {
          type: 'experiment',
          data: {
            event: "unknown",
            event_type: "message",
            message: 'You are doing great'
          }
        };
        it('should dispatch the unknown event handler', function () {
          const action = intervention(message);
          const expectedAction = {
            type: 'pfe/interventions/UNKNOWN_EVENT'
          };
          expect(action).to.deep.equal(expectedAction);
        });
      });

      describe('unknown intervention type', function () {
        const message = {
          type: 'experiment',
          data: {
            event: 'intervention',
            event_type: "unknown",
            message: 'can i send you pics?'
          }
        };
        it('should dispatch the unknown type handler', function () {
          const action = intervention(message);
          const expectedAction = {
            type: 'pfe/interventions/UNKNOWN_TYPE'
          };
          expect(action).to.deep.equal(expectedAction);
        });
      });

      describe('with a message event', function () {
        const message = {
          type: 'experiment',
          data: {
            event: "intervention",
            event_type: "message",
            message: 'a generic message'
          }
        };
        it('should store the notification', function () {
          const action = intervention(message);
          const expectedAction = {
            type: 'pfe/interventions/ADD_NOTIFICATION',
            payload: message
          };
          expect(action).to.deep.equal(expectedAction);
        });
      });

      describe('with subject IDs', function () {
        const message = {
          type: 'experiment',
          data: {
            event: "intervention",
            event_type: "subject_queue",
            subject_ids: [1, 2],
            workflow_id: 1
          }
        };
        const subject = mockPanoptesResource('subjects', { id: 'a', metadata: {} });
        const fakeType = {
          get: sinon.stub().resolves([subject])
        };
        const fakeDispatch = sinon.stub().callsFake(() => true);
        before(function () {
          sinon.stub(apiClient, 'type').callsFake(() => fakeType);
          intervention(message)(fakeDispatch);
        });
        after(function () {
          apiClient.type.restore();
        });
        it('should request new subjects', function () {
          const { subject_ids } = message.data;
          expect(fakeType.get.calledWith(subject_ids)).to.be.true;
        })
        it('should flag new subjects', function () {
          expect(subject.metadata.intervention).to.be.true;
        });
        it('should dispatch a prependSubjects action', function () {
          const { subject_ids, workflow_id } = message.data;
          const expectedAction = {
            type: 'pfe/classify/PREPEND_SUBJECTS',
            payload: {
              subjects: [subject],
              workflowID: workflow_id
            }
          };
          expect(fakeDispatch.calledWith(expectedAction)).to.be.true;
        });
      });
    });
    describe('subscribe', function () {
      it('should create a subscribe action', function () {
        const expectedAction = {
          type: 'pfe/interventions/SUBSCRIBE',
          payload: 'A channel'
        };
        expect(subscribe('A channel')).to.deep.equal(expectedAction);
      });
    });
    describe('unsubscribe', function () {
      it('should create an unsubscribe action', function () {
        const expectedAction = {
          type: 'pfe/interventions/UNSUBSCRIBE',
          payload: 'A channel'
        };
        expect(unsubscribe('A channel')).to.deep.equal(expectedAction);
      });
    });
    describe('dismiss', function () {
      it('should create a dismiss action', function () {
        const expectedAction = {
          type: 'pfe/interventions/DISMISS_NOTIFICATION'
        };
        expect(dismiss()).to.deep.equal(expectedAction);
      });
    });
  });
});
