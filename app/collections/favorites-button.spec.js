import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import FavoritesButton from './favorites-button';

const subject = { id: '4' };

describe('<Favorites Button />', function () {
  let wrapper;
  let toggleFavoriteSpy;
  let button;
  let icon;
  before(function() {
    toggleFavoriteSpy = sinon.spy(FavoritesButton.prototype, 'toggleFavorite');
    wrapper = shallow(<FavoritesButton subject={subject} />);
    button = wrapper.find('button');
    icon = wrapper.find('i');
  });

  after(function () {
    toggleFavoriteSpy.restore();
  });

  it('should render a button and an icon', function() {
    assert.equal(button.length, 1);
    assert.equal(icon.length, 1);
  });

  it('should render an empty heart icon if subject is not a favorite', function() {
    assert.equal(icon.props().className.includes('fa-heart-o'), true);
    assert.equal(wrapper.state('favorited'), false);
  });

  it('should render a filled heart icon if subject is a favorite', function() {
    wrapper.setProps({ isFavorite: true });
    assert.equal(icon.props().className.includes('fa-heart'), true);
    assert.equal(wrapper.state('favorited'), true);
  });

  it('should call toggleFavorite on click', function() {
    button.simulate('click');
    sinon.assert.calledOnce(toggleFavoriteSpy);
  });
});
