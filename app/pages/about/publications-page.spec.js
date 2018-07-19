/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx"] }] */

import React from 'react';
import assert from 'assert';
import PublicationsPage from './publications-page';
import { shallow } from 'enzyme';


describe('PublicationsPage', () => {

  it('renders without crashing', function () {
    shallow(<PublicationsPage />);
  });

  it('renders side navigation', () => {
    const wrapper = shallow(<PublicationsPage />);
    const navItems = wrapper.find('.side-bar-button');
    assert.notEqual(navItems.length, 0);
  });

  it('renders publication lists when projects not null', () =>  {
    const wrapper = shallow(<PublicationsPage />);
    wrapper.setState({ projects: {} });
    const publications = wrapper.find('.publications-list');
    assert.notEqual(publications.length, 0);
  });

  it('renders one publication list when current sort is space', () => {
    const wrapper = shallow(<PublicationsPage />);
    wrapper.setState({ projects: {}, currentSort: 'space' });
    const publications = wrapper.find('.publications-list');
    assert.equal(publications.length, 1);
  });
});
