import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import RubinPage from './rubin-page';

describe('RubinPage', function () {
  let wrapper;

  before(function () {
    wrapper = shallow(<RubinPage />);
  });

  it('renders without crashing', function () {
    const RubinPageContainer = wrapper.find('div.sign-in-page');
    assert.equal(RubinPageContainer.length, 1);
  });

  describe('heading', function () {
    it('renders signIn.signIn content', function () {
      assert.equal(wrapper.find('Translate').first().prop('content'), 'signIn.signIn');
    });
  });

  describe('tabbed content tabs', function () {
    it('renders two links', function () {
      const linkElements = wrapper.find('Link');
      assert.equal(linkElements.length, 2);
    });
  });
});
