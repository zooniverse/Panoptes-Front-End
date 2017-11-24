import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import talkClient from 'panoptes-client/lib/talk-client';
import EmailSettings from './email';

const subscriptionPreferences = [
  talkClient.type('subscription_preferences').create({ id: 0, category: 'participating_discussions', email_digest: 'immediate' }),
  talkClient.type('subscription_preferences').create({ id: 1, category: 'followed_discussions', email_digest: 'daily' }),
  talkClient.type('subscription_preferences').create({ id: 2, category: 'mentions', email_digest: 'immediate' }),
  talkClient.type('subscription_preferences').create({ id: 3, category: 'group_mentions', email_digest: 'immediate' }),
  talkClient.type('subscription_preferences').create({ id: 4, category: 'messages', email_digest: 'daily' }),
  talkClient.type('subscription_preferences').create({ id: 5, category: 'started_discussions', email_digest: 'weekly' })
];

talkClient.type = () => {
  return {
    get() {
      return Promise.resolve(subscriptionPreferences);
    }
  };
};

const projects = [
  {
    display_name: 'A test project',
    title: 'A test project'
  },
  {
    display_name: 'Another test project',
    title: 'Another test project'
  }
];

const projectPreferences = [
  {
    email_communication: true,
    get() {
      return Promise.resolve(projects[0]);
    },
    getMeta() {
      return {};
    }
  },
  {
    email_communication: false,
    get() {
      return Promise.resolve(projects[1]);
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
    return Promise.resolve(projectPreferences);
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
    let projectSettings;

    beforeEach(() => {
      projectSettings = wrapper.update().find('table').last().find('tbody tr');
    });

    it('lists two projects (plus pagination)', () => {
      assert.equal(projectSettings.length, 3);
    });

    projects.forEach((project, i) => {
      it(`shows project ${i} email input correctly`, () => {
        const email = projectSettings.at(i).find('td').first();
        assert.equal(email.find('input').prop('checked'), projectPreferences[i].email_communication);
      });

      it(`shows project ${i} name correctly`, () => {
        const name = projectSettings.at(i).find('td').last();
        assert.equal(name.text(), project.display_name);
      });
    });
  });

  describe('Talk email preferences', () => {

    subscriptionPreferences.forEach((preference, i) => {
      it(`lists ${preference.category} preferences correctly`, () => {
        const selector = `input[name="${preference.category}"][value="${preference.email_digest}"]`;
        assert.equal(wrapper.find(selector).prop('checked'), true);
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
