import React from 'react';
import assert from 'assert';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import NewPasswordForm from './new-password-form';

describe('NewPasswordForm', () => {
  it('renders a new password form for a user', () => {
    const wrapper = shallow(<NewPasswordForm />);
    assert.equal(wrapper.find('form').length, 1);
  });

  it('should call onSubmit when user submits a new password', () => {
    const newPasswordSpy = sinon.spy();
    const wrapper = mount(<NewPasswordForm onSubmit={newPasswordSpy} />);
    wrapper.find('button').simulate('submit');
    assert.equal(newPasswordSpy.calledOnce, true);
  });
});
