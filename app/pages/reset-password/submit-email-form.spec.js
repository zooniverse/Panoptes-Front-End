import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import SubmitEmailForm from './submit-email-form';

const user = {
  display_name: 'Test User'
};

describe('SubmitEmailForm', function () {
  let wrapper;
  const submitEmailSpy = sinon.spy();

  before(function () {
    wrapper = shallow(<SubmitEmailForm onSubmit={submitEmailSpy} />);
  });

  it('does not render a submit email form for a logged in user', function () {
    wrapper.setProps({ user });
    assert.equal(wrapper.find('Translate').prop('content'), 'resetPassword.loggedInDialog');
    assert.equal(wrapper.find('form').length, 0);
  });

  it('renders a submit email form for a logged out user', function () {
    wrapper.setProps({ user: null });
    assert.equal(wrapper.find('form').length, 1);
  });

  it('should call onSubmit when user submits email', function () {
    wrapper.find('form').simulate('submit');
    assert.equal(submitEmailSpy.calledOnce, true);
  });

  it('conditionally shows and hides an in-progress icon', function () {
    wrapper.setProps({ inProgress: true });
    assert.equal(wrapper.find('i.form-help').length, 1);
    wrapper.setProps({ inProgress: false });
    assert.equal(wrapper.find('i.form-help').length, 0);
  });

  it('conditionally shows and hides an email success icon and message', function () {
    wrapper.setProps({ emailSuccess: true });
    assert.equal(wrapper.find('i.form-help.success').length, 1);
    assert.equal(wrapper.find('Translate[content="resetPassword.emailSuccess"]').length, 1);
    wrapper.setProps({ emailSuccess: false });
    assert.equal(wrapper.find('i.form-help.success').length, 0);
  });

  it('conditionally shows and hides an email error message', function () {
    wrapper.setProps({ emailError: 'test error message' });
    assert.equal(wrapper.find('Translate[content="resetPassword.emailError"]').length, 1);
    wrapper.setProps({ emailError: null });
  });
});
