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

describe('ResetPasswordPage', function () {
  let wrapper;

  before(function () {
    wrapper = shallow(<ResetPasswordPage />, { context: { router: { push: function () {} }}});
  });

  it('renders without crashing', function () {
    const ResetPasswordPageContainer = wrapper.find('div.centered-grid');
    assert.equal(ResetPasswordPageContainer.length, 1);
  });

  it('renders SubmitEmailForm for a not logged in user', function () {
    wrapper.setProps({ user: null });
    assert.equal(wrapper.find('SubmitEmailForm').length, 1);
  });

  it('renders NewPasswordForm when given a password reset token', function () {
    wrapper.setProps({ user, location });
    assert.equal(wrapper.find('NewPasswordForm').length, 1);
  });
});
