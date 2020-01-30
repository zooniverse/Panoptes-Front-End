import moment from 'moment';

const twoWeeksBeforeNow = moment.utc().subtract(2, 'weeks');

function fillTimeSeries(series = [], by = 'day', notEarlierThan = twoWeeksBeforeNow) {
  const filledSeries = [];
  let previousLabel = '';
  series.forEach(({ label, value }) => {
    if (by === 'hour' && moment.utc(label) <= notEarlierThan) {
      return;
    }
    const difference = moment.utc(label).diff(moment.utc(previousLabel), `${by}s`);

    if (difference > 1) {
      for (let i = 1; i < difference; i += 1) {
        const shouldBe = moment.utc(previousLabel).add(i, `${by}s`).format();
        filledSeries.push({ label: shouldBe, value: 0 });
      }
    }
    filledSeries.push({ label, value });
    previousLabel = label;
  });

  return filledSeries;
}

export default fillTimeSeries;
