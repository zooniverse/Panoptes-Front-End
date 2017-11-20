import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import talkClient from 'panoptes-client/lib/talk-client';
import EmailSettings from './email';

const subscriptionPreferences = [
  {
    id: 1,
    category: 'participating_discussions',
    email_digest: 'daily'
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

const preferences = [
  {
    get() {
      return Promise.resolve(project);
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
  let wrapper;

  before(() => {
    wrapper = shallow(<EmailSettings user={user} />);
  });

  beforeEach(() => wrapper.update());

  it('renders the email address', () => {
    const email = wrapper.find('input[name="email"]');
    assert.equal(email.prop('value'), user.email);
  });

  it('shows global email preference correctly', () => {
    const projectEmail = wrapper.find('input[name="global_email_communication"]');
    assert.equal(projectEmail.prop('checked'), user.project_email_communication);
  });

  it('shows project email preference correctly', () => {
    const projectEmail = wrapper.find('input[name="project_email_communication"]');
    assert.equal(projectEmail.prop('checked'), user.project_email_communication);
  });

  it('shows beta email preference correctly', () => {
    const betaEmail = wrapper.find('input[name="beta_email_communication"]');
    assert.equal(betaEmail.prop('checked'), user.beta_email_communication);
  });
});
