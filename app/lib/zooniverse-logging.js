const excludedProjects = []

class ZooniverseLogging {
  constructor() {
    this.keys = { projectToken: 'zooHome' };
    this.adapters = [];
  }

  makeHandler(defaultEventType) {
    return ((eventData, eventType) => {
      eventType = (typeof eventType === 'string') ? eventType : defaultEventType; // eslint-disable-line no-param-reassign
      this.logEvent({
        type: eventType,
        relatedID: eventData
      });
    });
  }

  remember(eventData) {
    Object.assign(this.keys, eventData);
    this.adapters.forEach(adapter => adapter.onRemember(eventData));
  }

  forget(keyList) {
    keyList.forEach((key) => { delete this.keys[key]; });
    this.adapters.forEach(adapter => adapter.onForget(keyList));
  }

  logEvent(logEntry) {
    if (!excludedProjects.includes(this.keys.projectToken)) {
      const newEntry = Object.assign({}, this.keys, logEntry);
      this.adapters.forEach(adapter => adapter.logEvent(newEntry));
    }
  }

  subscribe(...newAdapters) {
    this.adapters = this.adapters.concat(newAdapters);
    this.adapters.forEach(adapter => adapter.configure(this.keys));
  }

  unsubscribe(adapter) {
    this.adapters = this.adapters.filter(i => i !== adapter);
  }
}

export default ZooniverseLogging;
