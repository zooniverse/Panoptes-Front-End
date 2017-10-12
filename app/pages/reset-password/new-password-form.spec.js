import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import NewPasswordForm from './new-password-form';

describe('NewPasswordForm', () => {
  let wrapper;
  const newPasswordSpy = sinon.spy();


  before(() => {
    wrapper = shallow(<NewPasswordForm onSubmit={newPasswordSpy} />);
  });

  it('renders a new password form for a user', () => {
    assert.equal(wrapper.find('form').length, 1);
  });

  it('should call onSubmit when user submits a new password', () => {
    wrapper.find('form').simulate('submit');
    assert.equal(newPasswordSpy.calledOnce, true);
  });

  it('conditionally shows and hides an in-progress icon', () => {
    wrapper.setProps({ inProgress: true });
    assert.equal(wrapper.find('i.form-help').length, 1);
    wrapper.setProps({ inProgress: false });
    assert.equal(wrapper.find('i.form-help').length, 0);
  });

  it('conditionally shows and hides a reset success icon', () => {
    wrapper.setProps({ resetSuccess: true });
    assert.equal(wrapper.find('i.form-help.success').length, 1);
    wrapper.setProps({ resetSuccess: false });
    assert.equal(wrapper.find('i.form-help.success').length, 0);
  });

  it('conditionally shows and hides a reset password error message', () => {
    wrapper.setProps({ resetError: 'test error message' });
    assert.equal(wrapper.find('Translate').last().prop('content'), 'resetPassword.resetError');
    wrapper.setProps({ resetError: null });
    assert.equal(wrapper.find('Translate').length, 3);
  });
});
