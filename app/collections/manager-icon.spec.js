import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import CollectionsManagerIcon from './manager-icon';

const project = {
  id: '342'
};

const subject = {
  id: '3632'
};

const user = {
  id: '1'
}

describe('<CollectionsManagerIcon />', function() {
  let wrapper;
  before(function() {
    wrapper = shallow(
      <CollectionsManagerIcon
        className="icon"
        project={project}
        subject={subject}
        user={user}
      />);
  });

  it('renders without crashing', function() {
    assert.equal(wrapper, wrapper);
  });

  it('should render a button with an icon label', function() {
    assert.equal(wrapper.find('.collections-manager-icon').length, 1);
    assert.equal(wrapper.find('i').length, 1);
  });

  it('should add the className prop to the component classes', function() {
    assert.equal(wrapper.props().className.includes('icon'), true);
  });

  it('should not render <CollectionsManager /> when open state is false', function() {
    assert.equal(wrapper.find('CollectionsManager').length, 0);
  });

  it('should set the open state to true when the button is clicked', function() {
    wrapper.find('button').simulate('click');
    assert.equal(wrapper.state('open'), true);
  });
});
