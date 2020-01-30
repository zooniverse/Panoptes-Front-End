/* eslint func-names: off, prefer-arrow-callback: off */
import moment from 'moment';
import { expect } from 'chai';

import fillTimeSeries from './fillTimeSeries';

const mockDaySeries = [
  { label: '2019-01-01T00:00:00.000Z', value: 9 },
  { label: '2019-01-04T00:00:00.000Z', value: 11 },
  { label: '2019-01-09T00:00:00.000Z', value: 7 }
];

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

const mockHourSeries = [
  { label: '2019-01-09T01:00:00.000Z', value: 11 },
  { label: '2019-01-09T02:00:00.000Z', value: 9 },
  { label: '2019-01-09T03:00:00.000Z', value: 7 },
  { label: '2019-01-09T04:00:00.000Z', value: 5 },
  { label: '2019-01-09T05:00:00.000Z', value: 3 }
];

const mockHourSeriesFilled = [
  { label: '2019-01-09T04:00:00.000Z', value: 5 },
  { label: '2019-01-09T05:00:00.000Z', value: 3 }
];

describe('fillTimeSeries', function () {
  it('should return a series including dates with zero value', function () {
    expect(fillTimeSeries(mockDaySeries, 'day')).to.eql(mockDaySeriesFilled);
  });

  it('should return a series by hour not earlier than two weeks before now', function () {
    const notEarlierThan = moment.utc('2019-01-09T03:00:00.000Z');
    expect(fillTimeSeries(mockHourSeries, 'hour', notEarlierThan)).to.eql(mockHourSeriesFilled);
  });
});
