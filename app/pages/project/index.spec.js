import React from 'react';
import { mount } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import { Split } from 'seven-ten';
import { ProjectPageController } from './';

const location = {
  query: {}
};

const params = {
  owner: 'owner',
  name: 'test-project'
};

const context = {
  router: {}
};

describe('ProjectPageController', function () {
  describe('with initial load complete', function () {
    let wrapper;
    let apiRequestStub;
    const payload = {
      slug: 'owner/test-project',
      include: 'avatar,background,owners'
    };
    
    before(function () {
      apiRequestStub = sinon.stub(apiClient, 'request').callsFake(function (method, url, payload) {
        return Promise.resolve([]);
      }); 
      sinon.stub(Split, 'load').callsFake(() => Promise.resolve([]));
    });
    
    after(function () {
      apiRequestStub.restore();
      Split.load.restore();
    })
    
    beforeEach(function () {
      context.initialLoadComplete = true;
      wrapper = mount(
        <ProjectPageController
          location={location}
          params={params}
        />,
        { context }
      );
    });
    
    afterEach(function () {
      apiRequestStub.resetHistory();
    })
    
    it('should fetch project data on mount.', function () {
      sinon.assert.calledOnce(apiRequestStub);
      sinon.assert.calledWith(apiRequestStub, 'get', '/projects', payload);
    });
    
    it('should fetch project data again on project change.', function () {
      wrapper.setState({ loading: false });
      wrapper.setProps({
        params: {
          owner: 'someone',
          name: 'another-project'
        }
      });
      const newPayload = {
        slug: 'someone/another-project',
        include: 'avatar,background,owners'
      };
      sinon.assert.calledTwice(apiRequestStub);
      sinon.assert.calledWith(apiRequestStub, 'get', '/projects', newPayload);
    });
    
    it('should fetch project data again on user change.', function () {
      const user = { id: '1' };
      wrapper.setState({ loading: false });
      wrapper.setProps({ user });
      sinon.assert.calledTwice(apiRequestStub);
      sinon.assert.calledWith(apiRequestStub, 'get', '/projects', payload);
    });
    
    it('should not fetch project data again while the first request is still loading.', function () {
      const translations = { locale: 'es' };
      wrapper.setProps({ translations });
      sinon.assert.calledOnce(apiRequestStub);
      sinon.assert.calledWith(apiRequestStub, 'get', '/projects', payload);
    });
  });

  describe('without initial load complete', function () {
    let wrapper;
    let apiRequestStub;
    const payload = {
      slug: 'owner/test-project',
      include: 'avatar,background,owners'
    };
    
    before(function () {
      apiRequestStub = sinon.stub(apiClient, 'request').callsFake(function (method, url, payload) {
        return Promise.resolve([]);
      }); 
      sinon.stub(Split, 'load').callsFake(() => Promise.resolve([]));
    });
    
    after(function () {
      apiRequestStub.restore();
      Split.load.restore();
    })
    
    beforeEach(function () {
      context.initialLoadComplete = false;
      wrapper = mount(
        <ProjectPageController
          location={location}
          params={params}
        />,
        { context }
      );
    });
    
    afterEach(function () {
      apiRequestStub.resetHistory();
    })
    
    it('should not fetch project data on mount.', function () {
      sinon.assert.notCalled(apiRequestStub);
    });
    
    it('should fetch project data again on project change.', function () {
      wrapper.setState({ loading: false });
      wrapper.setProps({
        params: {
          owner: 'someone',
          name: 'another-project'
        }
      });
      const newPayload = {
        slug: 'someone/another-project',
        include: 'avatar,background,owners'
      };
      sinon.assert.calledOnce(apiRequestStub);
      sinon.assert.calledWith(apiRequestStub, 'get', '/projects', newPayload);
    });
    
    it('should not fetch project data again on user change.', function () {
      const user = { id: '1' };
      wrapper.setState({ loading: false });
      wrapper.setProps({ user });
      sinon.assert.notCalled(apiRequestStub);
    });
    
    it('should not fetch project data again on any other prop change.', function () {
      const translations = { locale: 'es' };
      wrapper.setProps({ translations });
      sinon.assert.notCalled(apiRequestStub);
    });
  })
});
