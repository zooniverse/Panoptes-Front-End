export class FakeResource {
  constructor(resourceType, attributes) {
    this.resourceType = resourceType;
    this.attributes = attributes;
  }

  save() {
    let saved = this.resourceType.save(this.attributes);

    if (saved) {
      return Promise.resolve(this);
    }
    else {
      return Promise.reject(new Error("Save failed!"));
    }
  }
}

export class FakeResourceType {
  constructor(apiClient, type) {
    this.apiClient = apiClient;
    this.type = type;
  }

  create(attributes) {
    return new FakeResource(this, attributes);
  }

  save(attributes) { return this.apiClient.save(this.type, attributes)}
}

export class FakeApiClient {
  constructor(opts={}) {
    this.saves = [];
    this.canSave = opts['canSave'] || (() => { return true; });
  }

  type(resourceType) {
    return new FakeResourceType(this, resourceType);
  }

  save(type, attributes) {
    if (this.canSave(type, attributes)) {
      this.saves.push({type: type, attributes: attributes});
      return true;
    } else {
      return false;
    }
  }
}
