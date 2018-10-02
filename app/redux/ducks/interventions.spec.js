import { expect } from 'chai';
import sinon from 'sinon';
import { sugarClient } from 'panoptes-client/lib/sugar';
import reducer from './interventions';

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
});
