import assert from 'assert';
import sinon from 'sinon';
import GALogAdapter from './ga-log-adapter';

describe('GALogAdapter', () => {
  describe('dimension handling', () => {
    it('ignores unknown keys', () => {
      const fakeWindow = {};
      const adapter = new GALogAdapter(fakeWindow, 'ga');
      adapter.onRemember({ foo: 'bar' });

      assert.equal(adapter.pending.length, 0);
    });

    it('waits to send configuration items if no layer is available', () => {
      const fakeWindow = {};
      const adapter = new GALogAdapter(fakeWindow, 'ga');
      adapter.onRemember({ experiment: 'foo' });

      assert.equal(adapter.pending.length, 1);
      assert.equal(adapter.pending[0][0], 'set');
    });

    it('forgets normal keys correctly', () => {
      const fakeWindow = {};
      const adapter = new GALogAdapter(fakeWindow, 'ga');
      adapter.onForget(['experiment']);

      assert.equal(adapter.pending.length, 1);
      assert.deepEqual(adapter.pending[0], ['set', 'dimension1', null]);
    });

    it('forgets special keys correctly', () => {
      const fakeWindow = {};
      const adapter = new GALogAdapter(fakeWindow, 'ga');
      adapter.onForget(['projectToken']);

      assert.equal(adapter.pending.length, 1);
      assert.deepEqual(adapter.pending[0], ['set', 'dimension3', 'zooHome']);
    });
  });

  describe('message handling', () => {
    it('waits to send messages if no layer is available', () => {
      const fakeWindow = {};
      const adapter = new GALogAdapter(fakeWindow, 'ga');
      adapter.logEvent({ type: 'testMessage' });

      assert.equal(adapter.pending.length, 1);
      assert.equal(adapter.pending[0][0], 'send');
    });

    it('queues up multiple messages while no layer is available', () => {
      const fakeWindow = {};
      const adapter = new GALogAdapter(fakeWindow, 'ga');
      adapter.logEvent({ type: 'testMessage' });
      adapter.logEvent({ type: 'anotherTest' });
      adapter.logEvent({ type: 'one more for good measure' });

      assert.equal(adapter.pending.length, 3);
    });
  });

  describe('analytics object lifecycle', () => {
    it('initializes the analytics object the first time it sees one', () => {
      const fakeTracker = { get: () => 'UA-AAAA-AA' };
      const fakeGA = () => null;
      fakeGA.getAll = () => [fakeTracker];

      const fakeWindow = {};

      const adapter = new GALogAdapter(fakeWindow, 'ga');
      const method = sinon.spy(GALogAdapter.prototype, 'initializeGA');

      adapter.logEvent({ type: 'testMessage' });

      fakeWindow.ga = fakeGA;

      adapter.pending = [];
      adapter.logEvent({ type: 'testMessage' });

      method.restore();
      sinon.assert.called(method);
    });

    it('dispatches delayed settings and messages after initializing', () => {
      const fakeTracker = { get: () => 'UA-AAAA-AA' };
      const fakeGA = () => null;
      fakeGA.getAll = () => [fakeTracker];
      const fakeWindow = { ga: fakeGA };
      const method = sinon.spy(fakeWindow, 'ga');

      const adapter = new GALogAdapter(fakeWindow, 'ga');
      adapter.pending = [['set', 'dimension1', 'some experiment name']];

      adapter.logEvent({ type: 'testMessage' });

      method.restore();

      assert.equal(method.callCount, 3);
      assert(method.withArgs('create', 'UA-AAAA-AA', 'auto').calledOnce);
      assert(method.withArgs('set').calledOnce);
      assert(method.withArgs('send').calledOnce);
    });
  });

  it('keeps delayed messages in proper order', () => {
    const fakeWindow = {};
    const adapter = new GALogAdapter(fakeWindow, 'ga');
    adapter.onRemember({ experiment: 'foo' });
    adapter.onRemember({ experiment: 'bar' });

    assert.equal(adapter.pending.length, 2);
    assert(adapter.pending[1].includes('bar'));
  });
});
