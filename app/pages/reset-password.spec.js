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
    wrapper = shallow(<ResetPasswordPage />, { context: { router: { push: () => {} }}});
  });

  it('should render without crashing', () => {
    const ResetPasswordPageContainer = wrapper.find('div.centered-grid');
    assert.equal(ResetPasswordPageContainer.length, 1);
  });

  describe('#renderSubmitEmailForm', () => {
    it('does not allow a signed in user to submit their email', () => {
      wrapper.setProps({ user });
      assert.equal(wrapper.find('Translate').prop('content'), 'resetPassword.loggedInDialog');
    });

    it('renders an email input form for a not logged in user', () => {
      wrapper.setProps({ user: null });
      const emailInput = wrapper.find('input');
      assert.equal(wrapper.find('Translate').prop('content'), 'resetPassword.enterEmailDialog');
      assert.equal(emailInput.length, 1);
    });

    it('renders a success message when emailSuccess state is true', () => {
      wrapper.setState({ emailSuccess: true });
      assert.equal(wrapper.find('Translate').last().prop('content'), 'resetPassword.emailSuccess');
    });

    it('renders an email error if there is an error', () => {
      wrapper.setState({ emailError: 'Test error message' });
      assert.equal(wrapper.find('Translate.form-help').prop('content'), 'resetPassword.emailError');
    });
  });

  describe('#renderNewPasswordForm', () => {
    before(() => {
      wrapper.setProps({ location });
    });

    it('renders a form when given a password reset token', () => {
      assert.equal(wrapper.find('Translate').first().prop('content'), 'resetPassword.newPasswordFormDialog');
    });

    it('renders inputs for password and confirmation', () => {
      const passwordInputs = wrapper.find('input');
      assert.equal(passwordInputs.length, 2);
    });

    it('renders a reset error if there is a reset error', () => {
      wrapper.setState({ resetError: 'Test error message' });
      assert.equal(wrapper.find('Translate.form-help').prop('content'), 'resetPassword.resetError');
    });
  });
});
