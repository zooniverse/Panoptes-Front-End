import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import talkClient from 'panoptes-client/lib/talk-client';
import EmailSettings from './email';

const subscriptionPreferences = [
  {
    id: 1,
    category: 'participating_discussions',
    email_digest: 'daily',
    update(changes) {
      subscriptionPreferences[0] = Object.assign(subscriptionPreferences[0], changes);
      return { save: () => null };
    }
  },
  {
    id: 2,
    category: 'followed_discussions',
    email_digest: 'daily',
    update(changes) {
      subscriptionPreferences[1] = Object.assign(subscriptionPreferences[1], changes);
      return { save: () => null };
    }
  },
  {
    id: 3,
    category: 'mentions',
    email_digest: 'immediate',
    update(changes) {
      subscriptionPreferences[2] = Object.assign(subscriptionPreferences[2], changes);
      return { save: () => null };
    }
  },
  {
    id: 4,
    category: 'group_mentions',
    email_digest: 'immediate',
    update(changes) {
      subscriptionPreferences[3] = Object.assign(subscriptionPreferences[3], changes);
      return { save: () => null };
    }
  },
  {
    id: 5,
    category: 'messages',
    email_digest: 'never',
    update(changes) {
      subscriptionPreferences[4] = Object.assign(subscriptionPreferences[4], changes);
      return { save: () => null };
    }
  },
  {
    id: 6,
    category: 'started_discussions',
    email_digest: 'weekly',
    update(changes) {
      subscriptionPreferences[5] = Object.assign(subscriptionPreferences[5], changes);
      return { save: () => null };
    }
  }
];

talkClient.type = () => {
  return {
    get() {
      return Promise.resolve(subscriptionPreferences);
    }
  };
};

const project = {
  display_name: 'A test project',
  title: 'A test project'
};

const anotherProject = {
  display_name: 'Another test project',
  title: 'Another test project'
};

const preferences = [
  {
    email_communication: true,
    get() {
      return Promise.resolve(project);
    },
    getMeta() {
      return {};
    }
  },
  {
    email_communication: false,
    get() {
      return Promise.resolve(anotherProject);
    },
    getMeta() {
      return {};
    }
  }
];

const user = {
  email: 'An email address',
  beta_email_communication: false,
  global_email_communication: true,
  project_email_communication: true,
  get() {
    return Promise.resolve(preferences);
  }
};

describe('EmailSettings', () => {
  const wrapper = mount(<EmailSettings user={user} />);

  beforeEach(() => wrapper.update());

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
    let projects;

    beforeEach(() => {
      projects = wrapper.update().find('table').last().find('tbody tr');
    });

    it('lists two projects (plus pagination)', () => {
      assert.equal(projects.length, 3);
    });

    it('shows the first project email input correctly', () => {
      const email = projects.first().find('td').first();
      assert.equal(email.find('input').prop('checked'), preferences[0].email_communication);
    });

    it('shows the first project name correctly', () => {
      const name = projects.first().find('td').last();
      assert.equal(name.text(), project.display_name);
    });

    it('shows the second project email input correctly', () => {
      const email = projects.at(1).find('td').first();
      assert.equal(email.find('input').prop('checked'), preferences[1].email_communication);
    });

    it('shows the second project name correctly', () => {
      const name = projects.at(1).find('td').last();
      assert.equal(name.text(), anotherProject.display_name);
    });
  });

  describe('Talk email preferences', () => {
    let talkPreferences;

    beforeEach(() => {
      talkPreferences = wrapper.update().find('table').first().find('tbody tr');
    });

    it('lists Talk preferences correctly', () => {
      talkPreferences.forEach((preference, i) => {
        const subscriptionPreference = subscriptionPreferences[i];
        const selector = `input[name="${subscriptionPreference.category}"][value="${subscriptionPreference.email_digest}"]`;
        const input = preference.find(selector);
        assert.equal(input.prop('checked'), true);
      });
    });

    subscriptionPreferences.forEach((preference) => {
      it(`${preference.category} updates correctly when preferences are changed`, () => {
        const selector = `input[name="${preference.category}"][value="never"]`;
        wrapper.find(selector).simulate('change');
        assert.equal(preference.email_digest, 'never');
      });
    });
  });
});
