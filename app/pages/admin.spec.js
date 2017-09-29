import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import AdminPage from './admin';

const adminUser = {
  admin: true
};

const nonAdminUser = {
  admin: false
};

const content = <span id="test-content" />;

describe('AdminPage', () => {
  let wrapper;

  before(() => {
    wrapper = shallow(<AdminPage>{content}</AdminPage>);
  });

  it('renders admin page content for an admin user', () => {
    wrapper.setProps({ user: adminUser });
    assert.equal(wrapper.find('section.admin-page-content').length, 1);
    assert.equal(wrapper.find('div.content-container').length, 0);
  });

  it('renders a not admin message for non-admin users', () => {
    wrapper.setProps({ user: nonAdminUser });
    assert.equal(wrapper.find('div.content-container').length, 1);
    assert.equal(wrapper.find('section.admin-page-content').length, 0);
    assert.equal(wrapper.find('div.content-container').children().text(), 'You are not an administrator');
  });

  it('renders a not signed in message for a user that is not signed in', () => {
    wrapper.setProps({ user: null });
    assert.equal(wrapper.find('div.content-container').length, 1);
    assert.equal(wrapper.find('section.admin-page-content').length, 0);
    assert.equal(wrapper.find('div.content-container').children().text(), 'You are not signed in');
  });
});
