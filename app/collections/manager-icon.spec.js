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
};

describe('<CollectionsManagerIcon />', () => {
  let wrapper;
  before(() => {
    wrapper = shallow(
      <CollectionsManagerIcon
        className="icon"
        project={project}
        subject={subject}
        user={user}
      />
    );
  });

  it('renders without crashing', () => {
    assert.equal(wrapper, wrapper);
  });

  it('should render a button with an icon label', () => {
    assert.equal(wrapper.find('.collections-manager-icon').length, 1);
    assert.equal(wrapper.find('i').length, 1);
  });

  it('should add the className prop to the component classes', () => {
    assert.equal(wrapper.props().className.includes('icon'), true);
  });

  it('should not render <CollectionsManager /> when open state is false', () => {
    assert.equal(wrapper.find('CollectionsManager').length, 0);
  });

  it('should set the open state to true when the button is clicked', () => {
    wrapper.find('button').simulate('click');
    assert.equal(wrapper.state('open'), true);
  });
});
