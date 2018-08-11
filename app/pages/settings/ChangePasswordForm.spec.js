/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */
import React from 'react';
import { shallow } from 'enzyme';
import assert from 'assert';
import ChangePasswordForm from './ChangePasswordForm';

describe('ChangePasswordForm', () => {
 
  it('renders without crashing', () => {
    shallow(<ChangePasswordForm />);
  });

  it('renders error message', () => {
    const wrappper =  shallow(<ChangePasswordForm />);
    wrappper.setState({ error: "Error message" });
    const error = wrappper.find('.error');
    assert.equal(error.length, 1);
  });

  it('renders loading spinner when loading', () => {
    const wrappper =  shallow(<ChangePasswordForm />);
    wrappper.setState({ inProgress: true });
    const spinner = wrappper.find('.fa-spinner');
    assert.equal(spinner.length, 1);
  });

  it('renders too short message', () => {
    const wrappper =  shallow(<ChangePasswordForm />);
    wrappper.setState({ new: 'short' });
    const message = wrappper.find('.error');
    assert.equal(message.length, 1);
  });

  it('renders doesnt match message', () => {
    const wrappper =  shallow(<ChangePasswordForm />);
    wrappper.setState({ new: 'newpassword', confirmation: 'notsamepass' });
    const message = wrappper.find('.error');
    assert.equal(message.length, 1);   
  });

  it('renders disabled submit button', () => {
    const wrappper =  shallow(<ChangePasswordForm />);
    const button = wrappper.find('button');
    assert.equal(button.prop('disabled'), true);
  });

  it('renders enabled submit button when form is valid', () => {
    const wrappper =  shallow(<ChangePasswordForm />);
    wrappper.setState({ old: 'oldpassword', new: 'newpassword', confirmation: 'newpassword'});
    const button = wrappper.find('button');
    assert.equal(button.prop('disabled'), false);  
  })
});
