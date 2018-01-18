import { shallow, mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import Shortcut from './';

const workflow = {
  tasks: {
    T1: {
      answers: [
        { label: 'Nothing Here' },
        { label: 'Fire' }
      ]
    }
  }
};

const task = {
  answers: [
    { label: 'Yes' },
    { label: 'No' }
  ],
  question: 'What is it',
  unlinkedTask: 'T1'
};

const annotation = {
  task: 'T0',
  shortcut: { value: [1] },
  value: null
};

describe('Shortcut', function() {
  let wrapper;

  it('should render with default props', function() {
    wrapper = shallow(<Shortcut translation={task} />);
  });

  it('should update on annotation change', function() {
    wrapper = shallow(<Shortcut translation={task} />);
    wrapper.setProps({ annotation });
  });
});

describe('Shortcut functionality', function () {
  let wrapper;

  before(function () {
    wrapper = mount(<Shortcut translation={task} task={task} annotation={annotation} workflow={workflow} />);
    wrapper.find('input').first().simulate('change', { target: { checked: true }});
    wrapper.update();
  });

  it('should show an active button with a shortcut', function () {
    assert.equal(wrapper.find('label[htmlFor="shortcut-1"]').hasClass('active'), true);
  });

  it('should remove shortcut when deselected', function () {
    wrapper.find('input').first().simulate('change', { target: { checked: false }});
    wrapper.update();
    assert.equal(wrapper.find('label').first().hasClass('active'), false);
  });

  it('should render multiple shortcuts', function () {
    assert.equal(wrapper.find('label').length, 2);
  });

  it('should add a shortcut to the current annotation', function () {
    wrapper.find('input').first().simulate('change', { target: { checked: true }});
    assert.equal(wrapper.props().annotation.shortcut.value.length, 2)
  });
});
