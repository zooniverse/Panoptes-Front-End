/* eslint func-names: off, prefer-arrow-callback: off */
import { expect } from 'chai';

import filterTimeSeries from './filterTimeSeries';

const mockDaySeriesFilled = [
  { label: '2019-01-01T00:00:00.000Z', value: 9 },
  { label: '2019-01-02T00:00:00Z', value: 0 },
  { label: '2019-01-03T00:00:00Z', value: 0 },
  { label: '2019-01-04T00:00:00.000Z', value: 11 },
  { label: '2019-01-05T00:00:00Z', value: 0 },
  { label: '2019-01-06T00:00:00Z', value: 0 },
  { label: '2019-01-07T00:00:00Z', value: 0 },
  { label: '2019-01-08T00:00:00Z', value: 0 },
  { label: '2019-01-09T00:00:00.000Z', value: 7 }
];

const mockBelowMax = [
  { label: '2019-01-01T00:00:00.000Z', value: 9 },
  { label: '2019-01-02T00:00:00Z', value: 0 },
  { label: '2019-01-03T00:00:00Z', value: 0 }
];

const mockAboveMin = [
  { label: '2019-01-07T00:00:00Z', value: 0 },
  { label: '2019-01-08T00:00:00Z', value: 0 },
  { label: '2019-01-09T00:00:00.000Z', value: 7 }
];

const mockBelowMaxAboveMin = [
  { label: '2019-01-04T00:00:00.000Z', value: 11 },
  { label: '2019-01-05T00:00:00Z', value: 0 },
  { label: '2019-01-06T00:00:00Z', value: 0 }
];

describe('filter', function () {
  it('should return series below max', function () {
    expect(filterTimeSeries(mockDaySeriesFilled, '2019-01-03T00:00:00Z')).to.eql(mockBelowMax);
  });

  it('should return series above min', function () {
    expect(filterTimeSeries(mockDaySeriesFilled, undefined, '2019-01-07T00:00:00Z')).to.eql(mockAboveMin);
  });

  it('should return series between max and min', function () {
    expect(filterTimeSeries(mockDaySeriesFilled, '2019-01-06T00:00:00Z', '2019-01-04T00:00:00Z'))
      .to.eql(mockBelowMaxAboveMin);
  });
});
