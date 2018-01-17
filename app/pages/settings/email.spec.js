import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import sinon from 'sinon';
import apiClient from 'panoptes-client/lib/api-client';
import talkClient from 'panoptes-client/lib/talk-client';
import EmailSettings from './email';

function mockTalkResource(type, options) {
  const resource = talkClient.type(type).create(options);
  talkClient._typesCache = {};
  sinon.stub(resource, 'save').callsFake(() => Promise.resolve(resource));
  sinon.stub(resource, 'get');
  sinon.stub(resource, 'delete');
  return resource;
}

function mockPanoptesResource(type, options) {
  const resource = apiClient.type(type).create(options);
  apiClient._typesCache = {};
  sinon.stub(resource, 'save').callsFake(() => Promise.resolve(resource));
  sinon.stub(resource, 'get');
  sinon.stub(resource, 'delete');
  return resource;
}

const talkPreferences = [
  {
    id: 0,
    category: 'participating_discussions',
    email_digest: 'immediate'
  },
  {
    id: 1,
    category: 'followed_discussions',
    email_digest: 'daily'
  },
  {
    id: 2,
    category: 'mentions',
    email_digest: 'immediate'
  },
  {
    id: 3,
    category: 'group_mentions',
    email_digest: 'immediate'
  },
  {
    id: 4,
    category: 'messages',
    email_digest: 'daily'
  },
  {
    id: 5,
    category: 'started_discussions',
    email_digest: 'weekly'
  }
];

const projects = [
  {
    id: 'a',
    display_name: 'A test project',
    title: 'A test project'
  },
  {
    id: 'b',
    display_name: 'Another test project',
    title: 'Another test project'
  }
];

const projectPreferences = [
  {
    id: '1',
    email_communication: true,
    links: {
      project: 'a'
    }
  },
  {
    id: '2',
    email_communication: false,
    links: {
      project: 'b'
    }
  }
];

const user = {
  email: 'An email address',
  beta_email_communication: false,
  global_email_communication: true,
  project_email_communication: true,
  get() {
    return Promise.resolve([]);
  }
};

describe('EmailSettings', () => {
  let wrapper;
  let projectPreferenceSpy;

  before(() => {
    sinon.stub(apiClient, 'request').callsFake(() => Promise.resolve([]));
    sinon.stub(talkClient, 'request').callsFake(() => Promise.resolve([]));
    wrapper = mount(<EmailSettings user={user} />);
    projectPreferenceSpy = sinon.spy(wrapper.instance(), 'getProjectForPreferences');
  });

  beforeEach(() => {
    projectPreferenceSpy.resetHistory();
    wrapper.update();
  });

  after(() => {
    apiClient.request.restore();
    talkClient.request.restore();
  });

  it('renders the email address', () => {
    const email = wrapper.find('input[name="email"]');
    assert.equal(email.prop('value'), user.email);
  });

  it('shows global email preference correctly', () => {
    const projectEmail = wrapper.find('input[name="global_email_communication"]');
    assert.equal(projectEmail.prop('checked'), user.global_email_communication);
  });

  it('shows project email preference correctly', () => {
    const projectEmail = wrapper.find('input[name="project_email_communication"]');
    assert.equal(projectEmail.prop('checked'), user.project_email_communication);
  });

  it('shows beta email preference correctly', () => {
    const betaEmail = wrapper.find('input[name="beta_email_communication"]');
    assert.equal(betaEmail.prop('checked'), user.beta_email_communication);
  });

  describe('project listing', () => {
    let projectSettings;

    before(() => {
      const mockTalkPreferences = talkPreferences.map(preference => mockTalkResource('subscription_preferences', preference));
      const mockProjects = projects.map(project => mockPanoptesResource('projects', project));
      const mockProjectPreferences = projectPreferences.map(preference => mockPanoptesResource('project_preferences', preference));
      wrapper.setState({
        meta: {},
        projectPreferences: mockProjectPreferences,
        projects: mockProjects,
        talkPreferences: mockTalkPreferences
      });
      wrapper.update();
    });

    beforeEach(() => {
      projectSettings = wrapper.find('table').last().find('tbody tr');
    });

    it('lists two projects', () => {
      assert.equal(projectSettings.length, 2);
    });

    projects.forEach((project, i) => {
      it(`shows project ${i} email input correctly`, () => {
        const email = projectSettings.at(i).find('input');
        assert.equal(email.prop('checked'), projectPreferences[i].email_communication);
      });

      it(`updates project ${i} email settings on change`, () => {
        const emailPreference = projectPreferences[i].email_communication;
        const email = projectSettings.at(i).find('input');
        const fakeEvent = {
          target: {
            type: email.prop('type'),
            name: email.prop('name'),
            checked: !email.prop('checked')
          }
        };
        email.simulate('change', fakeEvent);
        assert.equal(wrapper.state().projectPreferences[i].email_communication, !emailPreference);
      });

      it(`shows project ${i} name correctly`, () => {
        const name = projectSettings.at(i).find('td').last();
        assert.equal(name.text(), project.display_name);
      });
    });
  });

  describe('Talk email preferences', () => {
    talkPreferences.forEach((preference) => {
      it(`lists ${preference.category} preferences correctly`, () => {
        const selector = `input[name="${preference.category}"][value="${preference.email_digest}"]`;
        assert.equal(wrapper.find(selector).prop('checked'), true);
      });
    });

    talkPreferences.forEach((preference, i) => {
      it(`${preference.category} updates correctly when preferences are changed`, () => {
        const selector = `input[name="${preference.category}"][value="never"]`;
        wrapper.find(selector).simulate('change');
        assert.equal(wrapper.state().talkPreferences[i].email_digest, 'never');
      });
    });
  });

  describe('Project pagination', () => {
    it('defaults to page 1', () => {
      assert.equal(wrapper.state().page, 1);
    });

    it('should be disabled with less than one page of projects', () => {
      const meta = { page_count: 1 };
      wrapper.setState({ meta });
      const pageSelector = wrapper.find('nav.pagination select');
      assert.equal(pageSelector.prop('disabled'), true);
    });

    it('should be enabled with more than one page of projects', () => {
      const meta = { page_count: 2 };
      wrapper.setState({ meta });
      const pageSelector = wrapper.find('nav.pagination select');
      assert.equal(pageSelector.prop('disabled'), false);
    });

    it('should update the page number on change', () => {
      const meta = { page_count: 2 };
      wrapper.setState({ meta });
      const pageSelector = wrapper.find('nav.pagination select');
      const fakeEvent = {
        target: {
          value: 3
        }
      };
      pageSelector.simulate('change', fakeEvent);
      assert.equal(wrapper.state().page, 3);
    });

    it('should update the project list on change', () => {
      const meta = { page_count: 2 };
      wrapper.setState({ meta });
      const pageSelector = wrapper.find('nav.pagination select');
      const fakeEvent = {
        target: {
          value: 5
        }
      };
      pageSelector.simulate('change', fakeEvent);
      wrapper.update();
      assert.equal(wrapper.state().page, 5);
      sinon.assert.calledOnce(projectPreferenceSpy);
    });
  });
});
