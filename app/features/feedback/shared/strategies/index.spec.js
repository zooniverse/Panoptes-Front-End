import { expect } from 'chai';
import strategies from './index';

describe('feedback strategies registry', function () {
  const geoStrategies = ['geoBox', 'geoLine', 'geoPolygon', 'geoRadial'];

  geoStrategies.forEach((id) => {
    describe(id, function () {
      it('is registered as Lab-config-only: a title, a lab component and validations, no reducer', function () {
        const strategy = strategies[id];
        expect(strategy.id).to.equal(id);
        expect(strategy.title).to.be.a('string');
        expect(strategy.labComponent).to.be.a('function');
        expect(strategy.validations).to.be.an('array');
        expect(strategy.reducer).to.be.undefined;
        expect(strategy.createRule).to.be.undefined;
      });
    });
  });
});
