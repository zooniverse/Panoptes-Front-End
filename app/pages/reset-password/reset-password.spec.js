import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import ResetPasswordPage from './reset-password';

const user = {
  display_name: 'Test User'
};

const location = {
  query: {
    reset_password_token: 'test'
  }
};

describe('ResetPasswordPage', () => {
  let wrapper;

  before(() => {
    wrapper = shallow(<ResetPasswordPage />, { context: { router: { push() {} }}});
  });

  it('renders without crashing', () => {
    const ResetPasswordPageContainer = wrapper.find('div.centered-grid');
    assert.equal(ResetPasswordPageContainer.length, 1);
  });

  it('renders SubmitEmailForm for a not logged in user', () => {
    wrapper.setProps({ user: null });
    assert.equal(wrapper.find('SubmitEmailForm').length, 1);
  });

  it('renders NewPasswordForm when given a password reset token', () => {
    wrapper.setProps({ user, location });
    assert.equal(wrapper.find('NewPasswordForm').length, 1);
  });
});
