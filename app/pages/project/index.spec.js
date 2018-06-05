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
  let wrapper;
  let apiRequestStub;
  let fetchProjectStub;

  before(function () {
    apiRequestStub = sinon.stub(apiClient, 'request').callsFake(function (method, url, payload) {
      return Promise.resolve([]);
    }); 
    sinon.stub(Split, 'load').callsFake(() => Promise.resolve([]));
    fetchProjectStub = sinon.stub(ProjectPageController.prototype, 'fetchProjectData').callsFake(function () {
      return Promise.resolve([]);
    });
  });

  after(function () {
    apiRequestStub.restore();
    Split.load.restore();
    fetchProjectStub.restore();
  });

  describe('with initial load complete', function () {
    
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
      fetchProjectStub.resetHistory();
    });
    
    it('should fetch project data on mount.', function () {
      sinon.assert.calledOnce(fetchProjectStub);
      sinon.assert.calledWith(fetchProjectStub, params.owner, params.name);
    });
    
    it('should fetch project data again on project change.', function () {
      wrapper.setState({ loading: false });
      wrapper.setProps({
        params: {
          owner: 'someone',
          name: 'another-project'
        }
      });
      sinon.assert.calledTwice(fetchProjectStub);
      sinon.assert.calledWith(fetchProjectStub, 'someone', 'another-project');
    });
    
    it('should fetch project data again on user change.', function () {
      const user = { id: '1' };
      wrapper.setState({ loading: false });
      wrapper.setProps({ user });
      sinon.assert.calledTwice(fetchProjectStub);
      sinon.assert.calledWith(fetchProjectStub, params.owner, params.name, user);
    });
    
    it('should not fetch project data again while the first request is still loading.', function () {
      const translations = { locale: 'es' };
      wrapper.setState({ loading: false });
      wrapper.setProps({ translations });
      sinon.assert.calledOnce(fetchProjectStub);
      sinon.assert.calledWith(fetchProjectStub, params.owner, params.name);
    });
  });

  describe('without initial load complete', function () {
    
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
      fetchProjectStub.resetHistory();
    });
    
    it('should not fetch project data on mount.', function () {
      sinon.assert.notCalled(fetchProjectStub);
    });
    
    it('should fetch project data again on project change.', function () {
      wrapper.setState({ loading: false });
      wrapper.setProps({
        params: {
          owner: 'someone',
          name: 'another-project'
        }
      });
      sinon.assert.calledOnce(fetchProjectStub);
      sinon.assert.calledWith(fetchProjectStub, 'someone', 'another-project');
    });
    
    it('should not fetch project data again on user change.', function () {
      const user = { id: '1' };
      wrapper.setState({ loading: false });
      wrapper.setProps({ user });
      sinon.assert.notCalled(fetchProjectStub);
    });
    
    it('should not fetch project data again on any other prop change.', function () {
      const translations = { locale: 'es' };
      wrapper.setProps({ translations });
      sinon.assert.notCalled(fetchProjectStub);
    });
  });
});
