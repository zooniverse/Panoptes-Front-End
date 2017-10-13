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

  describe('SubmitEmailForm', () => {
    it('renders without crashing', () => {
      assert.equal(wrapper.find('SubmitEmailForm').length, 1);
    });

    it('renders with no user if none is passed in', () => {
      assert.equal(wrapper.find('SubmitEmailForm').nodes[0].props.user, null)
    })

    it('renders for a user when a user prop is passed in', () => {
      wrapper.setProps({ user });
      assert.equal(wrapper.find('SubmitEmailForm').nodes[0].props.user.display_name, 'Test User')
    })
  });

  describe('NewPasswordForm', () => {
    it('renders when given a password reset token', () => {
      wrapper.setProps({ user, location });
      assert.equal(wrapper.find('NewPasswordForm').length, 1);
    });
  });

});
