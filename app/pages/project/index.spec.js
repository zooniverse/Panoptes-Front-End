import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import { ProjectPageController } from '.';
import { project } from '../dev-classifier/mock-data';

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

describe('ProjectPageController', () => {
  let wrapper;
  let apiRequestStub;
  let fetchProjectStub;

  before(() => {
    apiRequestStub = sinon.stub(apiClient, 'request').callsFake((method, url, payload) => Promise.resolve([]));
    fetchProjectStub = sinon.stub(ProjectPageController.prototype, 'fetchProjectData').callsFake(() => Promise.resolve([]));
  });

  after(() => {
    apiRequestStub.restore();
    fetchProjectStub.restore();
  });

  describe('with initial load complete', () => {
    beforeEach(() => {
      context.initialLoadComplete = true;
      wrapper = mount(
        <ProjectPageController
          location={location}
          params={params}
        />,
        { context }
      );
    });

    afterEach(() => {
      fetchProjectStub.resetHistory();
    });

    it('should fetch project data on mount.', () => {
      sinon.assert.calledOnce(fetchProjectStub);
      sinon.assert.calledWith(fetchProjectStub, params.owner, params.name);
    });

    it('should fetch project data again on project change.', () => {
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

    it('should fetch project data again on user change.', () => {
      const user = { id: '1' };
      wrapper.setState({ loading: false });
      wrapper.setProps({ user });
      sinon.assert.calledTwice(fetchProjectStub);
      sinon.assert.calledWith(fetchProjectStub, params.owner, params.name, user);
    });

    it('should not fetch project data again while the first request is still loading.', () => {
      const translations = { locale: 'es' };
      wrapper.setState({ loading: false });
      wrapper.setProps({ translations });
      sinon.assert.calledOnce(fetchProjectStub);
      sinon.assert.calledWith(fetchProjectStub, params.owner, params.name);
    });
  });

  describe('without initial load complete', () => {
    beforeEach(() => {
      context.initialLoadComplete = false;
      wrapper = mount(
        <ProjectPageController
          location={location}
          params={params}
        />,
        { context }
      );
    });

    afterEach(() => {
      fetchProjectStub.resetHistory();
    });

    it('should not fetch project data on mount.', () => {
      sinon.assert.notCalled(fetchProjectStub);
    });

    it('should fetch project data again on project change.', () => {
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

    it('should not fetch project data again on user change.', () => {
      const user = { id: '1' };
      wrapper.setState({ loading: false });
      wrapper.setProps({ user });
      sinon.assert.notCalled(fetchProjectStub);
    });

    it('should not fetch project data again on any other prop change.', () => {
      const translations = { locale: 'es' };
      wrapper.setProps({ translations });
      sinon.assert.notCalled(fetchProjectStub);
    });
  });

  describe('on component lifecycle', () => {
    const channel = `project-${project.id}`;
    const actions = {
      interventions: {
        subscribe: sinon.spy(),
        unsubscribe: sinon.spy()
      }
    };

    let wrapper;

    afterEach(() => {
      actions.interventions.subscribe.resetHistory();
      actions.interventions.unsubscribe.resetHistory();
    });

    describe('on initial project load', () => {
      beforeEach(() => {
        context.initialLoadComplete = true;
        wrapper = mount(
          <ProjectPageController
            actions={actions}
            location={location}
            params={params}
          />,
          { context }
        );
        wrapper.setState({ project });
      });

      it('subscribes the user to the sugar project channel', () => {
        expect(actions.interventions.subscribe.callCount).to.equal(1);
        expect(actions.interventions.subscribe.calledWith(channel)).to.be.true;
      });

      it('does not try to unsubcribe from a previous project channel', () => {
        expect(actions.interventions.unsubscribe.callCount).to.equal(0);
      });
    });

    describe('on project state change', () => {
      const newProject = { id: '999', title: 'fake project', slug: 'owner/name' };
      const newChannel = `project-${newProject.id}`;
      beforeEach(() => {
        wrapper = mount(
          <ProjectPageController
            actions={actions}
            location={location}
            params={params}
          />,
          { context }
        );
        wrapper.setState({ project });
        actions.interventions.subscribe.resetHistory();
        wrapper.setState({ project: newProject });
      });

      it('unsubscribes old project from sugar', () => {
        expect(actions.interventions.unsubscribe.callCount).to.equal(1);
        expect(actions.interventions.unsubscribe.calledWith(channel)).to.true;
      });

      it('subscribes new project to sugar', () => {
        expect(actions.interventions.subscribe.callCount).to.equal(1);
        expect(actions.interventions.subscribe.calledWith(newChannel)).to.be.true;
      });
    });

    describe('on unmount', () => {
      beforeEach(() => {
        context.initialLoadComplete = true;
        wrapper = mount(
          <ProjectPageController
            actions={actions}
            location={location}
            params={params}
          />,
          { context }
        );
        wrapper.setState({ project });
      });

      it('unsubscribes the user from the sugar project channel', () => {
        wrapper.unmount();
        expect(actions.interventions.unsubscribe.callCount).to.equal(1);
        expect(actions.interventions.unsubscribe.calledWith(channel)).to.be.true;
      });
    });
  });
});
