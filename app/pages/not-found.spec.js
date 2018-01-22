import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import NotFoundPage from './not-found';

describe('NotFoundPage', function () {
  let wrapper;

  before(function () {
    wrapper = shallow(<NotFoundPage />);
  });

  it('should render without crashing', function () {
    const notFoundContainer = wrapper.find('div.content-container');
    assert.equal(notFoundContainer.length, 1);
  });

  it('renders a not found message', function () {
    assert.equal(wrapper.find('Translate').prop('content'), 'notFoundPage.message');
  });
});
