const dimensionMap = {
  experiment: 1,
  cohort: 2,
  projectToken: 3,
  userID: 4,
  subjectID: 5,
  workflowID: 6
};

class GALogAdapter {
  constructor(windowObj, layerName) {
    this.windowObj = windowObj;
    this.layerName = layerName;
    this.gaLayer = null;
    this.pending = [];
    this.enqueue = this.enqueue.bind(this);
  }

  layer() {
    if (this.gaLayer) {
      // just send the event if we can
      return this.gaLayer;
    }

    if (!this.layerPresent()) {
      // if we still can't find google's analytics object, queue the event up for later
      return this.enqueue;
    }

    // if we go there, this is the first time we've seen an analytics object so we need to set it up
    this.gaLayer = this.windowObj[this.layerName];
    this.initializeGA();

    return this.gaLayer;
  }

  layerPresent() {
    return this.windowObj[this.layerName] && this.windowObj[this.layerName].getAll;
  }

  initializeGA() {
    // initialize the google analytics object with the tracking code
    const tracker = this.gaLayer.getAll()[0];
    const code = tracker.get('trackingId');
    this.gaLayer('create', code, 'auto');

    // send any analytics messages we'd been waiting to send
    this.pending.forEach(params => this.gaLayer.apply(null, params));
    this.pending = [];
  }

  enqueue(...args) {
    this.pending.push(args);
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
        if (key === 'projectToken') {
          this.layer()('set', `dimension${dimensionMap[key]}`, 'zooHome');
        } else {
          this.layer()('set', `dimension${dimensionMap[key]}`, null);
        }
      }
    });
  }

  logEvent(logEntry) {
    this.layer()('send', {
      hitType: 'event',
      eventCategory: 'ZooniverseEvents2.0',
      eventAction: logEntry.type,
      eventLabel: logEntry.relatedID || logEntry.data
    });
  }
}

export default GALogAdapter;
