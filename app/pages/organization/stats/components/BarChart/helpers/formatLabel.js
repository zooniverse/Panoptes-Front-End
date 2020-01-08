import moment from 'moment';

const formatLabel = {
  hour: date => moment.utc(date).format('MMM-DD hh:mm A'),
  day: date => moment.utc(date).format('MMM-DD-YYYY'),
  week: date => moment.utc(date).format('MMM-DD-YYYY'),
  month: date => moment.utc(date).format('MMM YYYY')
};

export default formatLabel;
