import React from 'react';
import assert from 'assert';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import SubmitEmailForm from './submit-email-form';

const user = {
  display_name: 'Test User'
};

describe('SubmitEmailForm', () => {
  let wrapper;

  before(() => {
    wrapper = shallow(<SubmitEmailForm />);
  });

  it('does not render a submit email form for a logged in user', () => {
    wrapper.setProps({ user });
    assert.equal(wrapper.find('Translate').prop('content'), 'resetPassword.loggedInDialog');
    assert.equal(wrapper.find('form').length, 0);
  });

  it('renders a submit email form for a logged out user', () => {
    wrapper.setProps({ user: null });
    assert.equal(wrapper.find('form').length, 1);
  });

  it('should call onSubmit when user submits email', () => {
    const submitEmailSpy = sinon.spy();
    wrapper = mount(<SubmitEmailForm user={null} onSubmit={submitEmailSpy} />);
    wrapper.find('button').simulate('submit');
    assert.equal(submitEmailSpy.calledOnce, true);
  });

  it('conditionally shows and hides an in-progress icon', () => {
    wrapper.setProps({ inProgress: true });
    assert.equal(wrapper.find('i').length, 1);
    wrapper.setProps({ inProgress: false });
    assert.equal(wrapper.find('i').length, 0);
  });

  it('conditionally shows and hides an email success icon and message', () => {
    wrapper.setProps({ emailSuccess: true });
    assert.equal(wrapper.find('i').length, 1);
    assert.equal(wrapper.find('Translate').last().prop('content'), 'resetPassword.emailSuccess');
    wrapper.setProps({ emailSuccess: false });
    assert.equal(wrapper.find('i').length, 0);
    assert.notEqual(wrapper.find('Translate').last().prop('content'), 'resetPassword.emailSuccess');
  });

  it('conditionally shows and hides an email error message', () => {
    wrapper.setProps({ emailError: 'test error message' });
    assert.equal(wrapper.find('Translate').last().prop('content'), 'resetPassword.emailError');
    wrapper.setProps({ emailError: null });
    assert.notEqual(wrapper.find('Translate').last().prop('content'), 'resetPassword.emailError');
  });
});
