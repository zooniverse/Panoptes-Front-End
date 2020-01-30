const DEFAULT_RANGE = 12;

function getDefaultRange(stats) {
  const { length } = stats;
  const rangeMax = stats[(length - 1)] ? stats[(length - 1)].label : undefined;

  let rangeMin;
  if (stats[(length - DEFAULT_RANGE)]) {
    rangeMin = stats[(length - DEFAULT_RANGE)].label;
  } else if (stats[0]) {
    rangeMin = stats[0].label;
  }

  return { rangeMax, rangeMin };
}

export default getDefaultRange;
