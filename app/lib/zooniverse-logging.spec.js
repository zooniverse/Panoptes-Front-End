import assert from 'assert';
import sinon from 'sinon';
import ZooniverseLogging from './zooniverse-logging';

describe('ZooniverseLogging', () => {
  describe('dimension management', () => {
    it('keeps track of what keys it has seen', () => {
      const fakeAdapter1 = { configure: () => null, onRemember: () => null };

      const logger = new ZooniverseLogging();
      logger.subscribe(fakeAdapter1);

      assert(!Object.prototype.hasOwnProperty.call(logger.keys, 'someKey'));

      const remember1 = sinon.spy(fakeAdapter1, 'onRemember');
      logger.remember({ someKey: 'someValue' });
      remember1.restore();

      sinon.assert.called(remember1);
      assert(Object.prototype.hasOwnProperty.call(logger.keys, 'someKey'));
    });

    it('forgets keys it has been told to forget', () => {
      const fakeAdapter1 = { configure: () => null, onForget: () => null };

      const logger = new ZooniverseLogging();
      logger.remember({ someKey: 'someValue' });
      logger.subscribe(fakeAdapter1);

      assert(Object.prototype.hasOwnProperty.call(logger.keys, 'someKey'));

      const forget1 = sinon.spy(fakeAdapter1, 'onForget');
      logger.forget(['someKey']);
      forget1.restore();

      sinon.assert.called(forget1);
      assert(!Object.prototype.hasOwnProperty.call(logger.keys, 'someKey'));
    });

    it('passes dimension changes to subscribed adapters', () => {
      const fakeAdapter1 = { configure: () => null, onRemember: () => null };
      const fakeAdapter2 = { configure: () => null, onRemember: () => null };

      const configure1 = sinon.spy(fakeAdapter1, 'configure');
      const configure2 = sinon.spy(fakeAdapter2, 'configure');

      const logger = new ZooniverseLogging();
      logger.subscribe(fakeAdapter1);
      logger.subscribe(fakeAdapter2);

      configure1.restore();
      configure2.restore();

      sinon.assert.called(configure1);
      sinon.assert.called(configure2);

      const remember1 = sinon.spy(fakeAdapter1, 'onRemember');
      const remember2 = sinon.spy(fakeAdapter2, 'onRemember');

      logger.remember({ someKey: 'someValue' });

      remember1.restore();
      remember2.restore();

      sinon.assert.called(remember1);
      sinon.assert.called(remember2);
    });
  });

  describe('subscription management', () => {
    it('keeps track of all subscribed adapters', () => {
      const fakeAdapter1 = { configure: () => null, onRemember: () => null };
      const logger = new ZooniverseLogging();

      assert.equal(logger.adapters.length, 0);

      logger.subscribe(fakeAdapter1);

      assert.equal(logger.adapters.length, 1);
    });

    it('drops adapters when they unsubscribe', () => {
      const fakeAdapter1 = { configure: () => null, onRemember: () => null };
      const logger = new ZooniverseLogging();
      logger.adapters = [fakeAdapter1];

      assert.equal(logger.adapters.length, 1);

      logger.unsubscribe(fakeAdapter1);

      assert.equal(logger.adapters.length, 0);
    });
  });

  describe('event logging', () => {
    it('sends events to all configured adapters', () => {
      const fakeAdapter1 = { logEvent: () => null, configure: () => null };
      const fakeAdapter2 = { logEvent: () => null, configure: () => null };

      const method1 = sinon.spy(fakeAdapter1, 'logEvent');
      const method2 = sinon.spy(fakeAdapter2, 'logEvent');

      const logger = new ZooniverseLogging();
      logger.subscribe(fakeAdapter1, fakeAdapter2);
      logger.logEvent('foo');

      method1.restore();
      method2.restore();

      sinon.assert.called(method1);
      sinon.assert.called(method2);
    });
  });
});
