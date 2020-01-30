/* eslint func-names: off, prefer-arrow-callback: off */
import { expect } from 'chai';

import getDefaultRange from './getDefaultRange';

const mockDaySeriesFilled = [
  { label: '2019-01-01T00:00:00.000Z', value: 9 },
  { label: '2019-01-02T00:00:00Z', value: 0 },
  { label: '2019-01-03T00:00:00Z', value: 0 },
  { label: '2019-01-04T00:00:00.000Z', value: 11 },
  { label: '2019-01-05T00:00:00Z', value: 0 },
  { label: '2019-01-06T00:00:00Z', value: 0 },
  { label: '2019-01-07T00:00:00Z', value: 0 },
  { label: '2019-01-08T00:00:00Z', value: 0 },
  { label: '2019-01-09T00:00:00.000Z', value: 7 },
  { label: '2019-01-10T00:00:00Z', value: 0 },
  { label: '2019-01-11T00:00:00Z', value: 0 },
  { label: '2019-01-12T00:00:00.000Z', value: 13 },
  { label: '2019-01-13T00:00:00Z', value: 0 },
  { label: '2019-01-14T00:00:00Z', value: 0 },
  { label: '2019-01-15T00:00:00.000Z', value: 5 }
];

describe('getDefaultRange', function () {
  it('should return a max of the most recent and min of 12 less if more than 12 data', function () {
    expect(getDefaultRange(mockDaySeriesFilled))
      .to.eql({ rangeMax: '2019-01-15T00:00:00.000Z', rangeMin: '2019-01-04T00:00:00.000Z' });
  });

  it('should return a max of the most recent and the min if less than 12 data', function () {
    const splicedMockDaySeriesFilled = mockDaySeriesFilled.splice(10, 5);
    expect(getDefaultRange(splicedMockDaySeriesFilled))
      .to.eql({ rangeMax: '2019-01-15T00:00:00.000Z', rangeMin: '2019-01-11T00:00:00Z' });
  });
});
