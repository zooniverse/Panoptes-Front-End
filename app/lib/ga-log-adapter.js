const dimensionMap = {
  experiment: 1,
  cohort: 2,
  projectToken: 3,
  userID: 4,
  subjectID: 5,
  workflowID: 6
};

class GALogAdapter {
  constructor(layerName) {
    this.layerName = layerName;
    this.gaLayer = null;
  }

  layer() {
    this.gaLayer = this.gaLayer || window[this.layerName];
    return this.gaLayer || (() => null);
  }

  configure(keys) {
    this.onRemember(keys);
  }

  onRemember(newKeys) {
    Object.keys(newKeys).forEach((key) => {
      if (Object.keys(dimensionMap).includes(key)) {
        this.layer()('set', `dimension${dimensionMap[key]}`, newKeys[key]);
      }
    });
  }

  onForget(keyList) {
    keyList.forEach((key) => {
      if (Object.keys(dimensionMap).includes(key)) {
        this.layer()('set', `dimension${dimensionMap[key]}`, null);
        if (key === 'projectToken') {
          this.layer()('set', `dimension${dimensionMap[key]}`, 'zooHome');
        }
      }
    });
  }

  logEvent(logEntry) {
    this.layer()('send', {
      hitType: 'event',
      eventCategory: 'ZooniverseEvents2.0',
      eventAction: logEntry.type,
      eventLabel: logEntry.relatedID
    });
  }
}

export default GALogAdapter;
