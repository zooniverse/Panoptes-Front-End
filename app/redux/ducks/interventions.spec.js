import { expect } from 'chai';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import { sugarClient } from 'panoptes-client/lib/sugar';
import reducer, { processIntervention, subscribe, unsubscribe } from './interventions';
import mockPanoptesResource from '../../../test/mock-panoptes-resource';

describe('Intervention actions', () => {
  let subscribeSpy;
  let unsubscribeSpy;
  before(() => {
    subscribeSpy = sinon.stub(sugarClient, 'subscribeTo').callsFake(() => true);
    unsubscribeSpy = sinon.stub(sugarClient, 'unsubscribeFrom').callsFake(() => true);
  });
  after(() => {
    subscribeSpy.restore();
    unsubscribeSpy.restore();
  });
  describe('subscribe', () => {
    const state = {
      error: null
    };
    const action = {
      type: 'pfe/interventions/SUBSCRIBE',
      payload: 'A channel'
    };
    before(() => {
      const newState = reducer(state, action);
    });
    it('should subscribe to Sugar', () => {
      expect(subscribeSpy.callCount).to.equal(1);
    });
    it('should subscribe to the specified channel', () => {
      expect(subscribeSpy.calledWith(action.payload)).to.be.true;
    });
  });
  describe('unsubscribe', () => {
    const state = {
      error: null
    };
    const action = {
      type: 'pfe/interventions/UNSUBSCRIBE',
      payload: 'A channel'
    };
    before(() => {
      const newState = reducer(state, action);
    });
    it('should unsubscribe from Sugar', () => {
      expect(unsubscribeSpy.callCount).to.equal(1);
    });
    it('should unsubscribe from the specified channel', () => {
      expect(unsubscribeSpy.calledWith(action.payload)).to.be.true;
    });
  });
  describe('on error', () => {
    const state = {
      error: null
    };
    const action = {
      type: 'pfe/interventions/ERROR',
      payload: 'Oh no!'
    };
    it('should store the error', () => {
      const newState = reducer(state, action);
      expect(newState.error).to.equal(action.payload);
    });
  });
  describe('action creators', () => {
    describe('processIntervention', () => {
      describe('unknown experiment data format', () => {
        const message = {
          data: {
            payload: 'do something unknown'
          }
        };
        it('should dispatch the error action with useful message', () => {
          const action = processIntervention(message);
          const expectedAction = {
            type: 'pfe/interventions/ERROR',
            payload: 'Unexpected message on user experiment channel'
          };
          expect(action).to.deep.equal(expectedAction);
        });
      });

      describe('missing data in payload', () => {
        const message = {
          type: 'experiment',
          payload: {
            message: 'can i haz your money?'
          }
        };
        it('should dispatch the error action with useful message', () => {
          const action = processIntervention(message);
          const expectedAction = {
            type: 'pfe/interventions/ERROR',
            payload: 'Missing data object in message'
          };
          expect(action).to.deep.equal(expectedAction);
        });
      });

      describe('non intervention message', () => {
        const message = {
          type: 'experiment',
          data: {
            event: 'unknown',
            event_type: 'message',
            message: 'You are doing great'
          }
        };
        it('should dispatch the error action with useful message', () => {
          const action = processIntervention(message);
          const expectedAction = {
            type: 'pfe/interventions/ERROR',
            payload: 'Unknown intervention event message'
          };
          expect(action).to.deep.equal(expectedAction);
        });
      });

      describe('unknown intervention type', () => {
        const message = {
          type: 'experiment',
          data: {
            event: 'intervention',
            event_type: 'unknown',
            message: 'can i send you pics?'
          }
        };
        it('should dispatch the error action with useful message', () => {
          const action = processIntervention(message);
          const expectedAction = {
            type: 'pfe/interventions/ERROR',
            payload: "Unknown intervention event type, expected 'message' or 'subject_queue'"
          };
          expect(action).to.deep.equal(expectedAction);
        });
      });

      describe('with an intervention message event', () => {
        const message = {
          type: 'experiment',
          data: {
            event: 'intervention',
            event_type: 'message',
            message: 'a generic message'
          }
        };
        it('should store the message data', () => {
          const action = processIntervention(message);
          const expectedAction = {
            type: 'pfe/classify/ADD_INTERVENTION',
            payload: message.data
          };
          expect(action).to.deep.equal(expectedAction);
        });
      });

      describe('with an intervention subject queue event', () => {
        const message = {
          type: 'experiment',
          data: {
            event: 'intervention',
            event_type: 'subject_queue',
            subject_ids: [1, 2],
            workflow_id: 1
          }
        };
        const subject = mockPanoptesResource('subjects', { id: 'a', metadata: {}});
        const fakeType = {
          get: sinon.stub().resolves([subject])
        };
        const fakeDispatch = sinon.stub().callsFake(() => true);
        before(() => {
          sinon.stub(apiClient, 'type').callsFake(() => fakeType);
          processIntervention(message)(fakeDispatch);
        });
        after(() => {
          apiClient.type.restore();
        });
        it('should request new subjects', () => {
          const { subject_ids } = message.data;
          expect(fakeType.get.calledWith(subject_ids)).to.be.true;
        });
        it('should flag new subjects', () => {
          expect(subject.metadata.intervention).to.be.true;
        });
        it('should dispatch a prependSubjects action', () => {
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
    describe('subscribe', () => {
      it('should create a subscribe action', () => {
        const expectedAction = {
          type: 'pfe/interventions/SUBSCRIBE',
          payload: 'A channel'
        };
        expect(subscribe('A channel')).to.deep.equal(expectedAction);
      });
    });
    describe('unsubscribe', () => {
      it('should create an unsubscribe action', () => {
        const expectedAction = {
          type: 'pfe/interventions/UNSUBSCRIBE',
          payload: 'A channel'
        };
        expect(unsubscribe('A channel')).to.deep.equal(expectedAction);
      });
    });
  });
});
