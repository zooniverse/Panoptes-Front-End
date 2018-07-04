import React from 'react';
import apiClient from 'panoptes-client/lib/api-client';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Tutorial from './tutorial';

function mockPanoptesResource(type, options) {
  const resource = apiClient.type(type).create(options);
  apiClient._typesCache = {};
  sinon.stub(resource, 'save').callsFake(() => Promise.resolve(resource));
  sinon.stub(resource, 'get');
  sinon.stub(resource, 'delete');
  return resource;
}

describe('Tutorial', function () {
  describe('on unmount', function () {
    let wrapper;

    before(function () {
      const tutorial = {
        id: 'a',
        steps: [{}]
      };
      const projectPreferences = mockPanoptesResource('project_preferences', {
        preferences: {
          tutorials_completed_at: []
        }
      });
      projectPreferences.preferences.tutorials_completed_at[100] = 'Hello';
      const user = {};
      wrapper = shallow(<Tutorial
        projectPreferences={projectPreferences}
        tutorial={tutorial}
        translation={tutorial}
        user={user}
      />);
      wrapper.instance().logToGeordi = sinon.stub();
      wrapper.instance().handleUnmount();
    });

    it('should convert preferences.tutorials_completed_at from array to object', function () {
      const { tutorials_completed_at } = wrapper.instance().props.projectPreferences.preferences;
      expect(tutorials_completed_at).to.not.be.an.instanceof(Array);
      expect(tutorials_completed_at['100']).to.equal('Hello');
    });

    it('should add the current tutorial to tutorials_completed_at', function () {
      const { tutorials_completed_at } = wrapper.instance().props.projectPreferences.preferences;
      const { tutorial } = wrapper.instance().props;
      expect(tutorials_completed_at[tutorial.id]).to.exist;
    });
  });
});
