/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */
import React from 'react';
import { shallow } from 'enzyme';
import assert from 'assert';
import ChangePasswordForm from './change-password-form';

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
});
