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
});
