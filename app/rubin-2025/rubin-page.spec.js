/* Temporarily isabled on 2025.06.13: need to configure Enzyme or Mocha to mock PNG files.

import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import RubinPage from './rubin-page';

describe('RubinPage', function () {
  let wrapper;

  before(function () {
    wrapper = shallow(<RubinPage initialLoadComplete={true} />);
  });

  it('renders without crashing', function () {
    const RubinPageContainer = wrapper.find('div.new-accounts-page');
    assert.equal(RubinPageContainer.length, 1);
  });

  describe('heading', function () {
    it('renders newAccountsPage.signIn content', function () {
      assert.equal(wrapper.find('Translate').first().prop('content'), 'newAccountsPage.signIn');
    });
  });

  describe('tabbed content tabs', function () {
    it('renders two buttons', function () {
      const tabElements = wrapper.find('button');
      assert.equal(tabElements.length, 2);
    });
  });
});
*/