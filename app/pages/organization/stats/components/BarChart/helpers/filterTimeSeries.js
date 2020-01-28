import moment from 'moment';

function filterTimeSeries(series = [], max, min) {
  return series
    .filter((stat) => {
      const overMin = min ? moment.utc(stat.label) >= moment.utc(min) : true;
      const underMax = max ? moment.utc(stat.label) <= moment.utc(max) : true;
      return (overMin && underMax);
    });
}

export default filterTimeSeries;
