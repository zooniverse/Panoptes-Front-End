/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */
import React from 'react';
import { shallow } from 'enzyme';
import AccountInformationPage from './AccountInformationPage';

describe('AccountInformationPage', function () {
  it('renders without crashing', function () {
    const user = {
      display_name: '',
      credited_name: ''
    };
    shallow(<AccountInformationPage user={user} />);
  });
});
