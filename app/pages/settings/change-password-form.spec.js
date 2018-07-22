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
});
