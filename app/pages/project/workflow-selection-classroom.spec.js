import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { ClassroomWorkflowSelection } from './workflow-selection-classroom';
import mockPanoptesResource from '../../../test/mock-panoptes-resource';

function StubPage(props) {
  return <p>{props.workflow ? props.workflow.id : 'Hello'}</p>;
}

const location = {
  query: {
    workflow: '1234',
    classroom: '1'
  }
};

const context = {
  router: {
    push: sinon.stub()
  }
};

const projectRoles = [
  {
    roles: ['owner'],
    links: {
      owner: {
        id: '1'
      }
    }
  },
  {
    roles: ['collaborator'],
    links: {
      owner: {
        id: '2'
      }
    }
  },
  {
    roles: ['tester'],
    links: {
      owner: {
        id: '3'
      }
    }
  }
];

const project = mockPanoptesResource('projects',
  {
    id: 'a',
    display_name: 'A test project',
    experimental_tools: ['wildcam classroom'],
    slug: 'test/test-project',
    links: {
      active_workflows: ['1', '2', '3', '4', '5'],
      owner: { id: '1' },
      workflows: ['1', '2', '3', '4', '5']
    }
  }
);

const owner = mockPanoptesResource(
  'users',
  {
    id: project.links.owner.id
  }
);

const preferences = mockPanoptesResource(
  'project_preferences',
  {
    preferences: {},
    links: {
      project: project.id
    }
  }
);

describe('ClassroomWorkflowSelection', function () {
  let wrapper;
  let controller;
  let workflowStub;
  const actions = {
    classifier: {
      loadWorkflow: sinon.spy(),
      reset: sinon.spy(),
      setWorkflow: sinon.spy()
    },
    translations: {
      load: sinon.stub().callsFake(() => Promise.resolve([]))
    }
  };

  before(function () {
    workflowStub = sinon.stub(ClassroomWorkflowSelection.prototype, 'getWorkflow').callsFake(() => {});
  });

  describe('selecting a workflow ID', function () {

    beforeEach(function () {
      actions.classifier.loadWorkflow.resetHistory();
    });

    afterEach(function () {
      project.experimental_tools = [];
      location.query = {};
    });

    after(function () {
      workflowStub.restore();
    });

    it('should always load the workflow specified in the URL', function () {
      location.query.workflow = '1234';
      wrapper = shallow(
        <ClassroomWorkflowSelection
          actions={actions}
          project={project}
          preferences={preferences}
          projectRoles={projectRoles}
          locale='en'
          location={location}
        >
          <StubPage />
        </ClassroomWorkflowSelection>,
        { context }
      );
      expect(actions.classifier.loadWorkflow).to.have.been.calledOnce;
      expect(actions.classifier.loadWorkflow).to.have.been.calledWith(location.query.workflow, 'en', preferences);
    });

    it('should sanitise the workflow query param', function () {
      location.query.workflow = '12345rty'
      wrapper = shallow(
        <ClassroomWorkflowSelection
          actions={actions}
          project={project}
          preferences={preferences}
          projectRoles={projectRoles}
          locale='en'
          location={location}
        >
          <StubPage />
        </ClassroomWorkflowSelection>,
        { context }
      );
      expect(actions.classifier.loadWorkflow).to.have.been.calledOnce;
      expect(actions.classifier.loadWorkflow).to.have.been.calledWith('12345', 'en', preferences);
    });

    it('should not load a workflow without a workflow query parameter', function () {
      location.query = {}
      wrapper = shallow(
        <ClassroomWorkflowSelection
          actions={actions}
          project={project}
          preferences={preferences}
          projectRoles={projectRoles}
          locale='en'
          location={location}
        >
          <StubPage />
        </ClassroomWorkflowSelection>,
        { context }
      );
      expect(actions.classifier.loadWorkflow).to.have.not.been.called;
    });
  });

  describe('with a valid workflow loaded', function () {
    before(function () {
      wrapper = shallow(
        <ClassroomWorkflowSelection
          actions={actions}
          project={project}
          preferences={preferences}
          projectRoles={projectRoles}
          locale='en'
          location={location}
        >
          <StubPage />
        </ClassroomWorkflowSelection>,
        { context }
      );
    })
    it('should render the child component', function () {
      const workflow = mockPanoptesResource('workflows',
        {
          id: 'a',
          tasks: [],
          links: {
            project: project.id
          }
        }
      );
      expect(wrapper.find(StubPage)).to.have.lengthOf(0);
      wrapper.setProps({ workflow });
      const child = wrapper.find(StubPage);
      expect(wrapper.find(StubPage)).to.have.lengthOf(1);
    });
  });
});