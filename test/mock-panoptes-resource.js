import apiClient from 'panoptes-client/lib/api-client';
import sinon from 'sinon';

export default function mockPanoptesResource(type, options) {
  const resource = apiClient.type(type).create(options);
  apiClient._typesCache = {};
  sinon.stub(resource, 'save').resolves(resource);
  sinon.stub(resource, 'get');
  sinon.stub(resource, 'delete');
  sinon.spy(resource, 'update');
  return resource;
}
