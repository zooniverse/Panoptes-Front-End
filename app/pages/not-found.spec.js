import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import NotFoundPage from './not-found';

describe('NotFoundPage', () => {
  let wrapper;

  before(() => {
    wrapper = shallow(<NotFoundPage />);
  });

  it('should render without crashing', () => {
    const notFoundContainer = wrapper.find('div.content-container');
    assert.equal(notFoundContainer.length, 1);
  });

  it('renders a not found message', () => {
    assert.equal(wrapper.find('Translate').prop('content'), 'notFoundPage.message');
  });
});
