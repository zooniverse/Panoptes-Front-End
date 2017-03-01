import { shallow, mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import Shortcut from './shortcut';

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

const classification = {
  update: () => {}
};

const task = {
  answers: [
    { label: 'Yes' },
    { label: 'No' }
  ],
  question: 'What is it',
  unlinkedTask: 'T1'
};

describe('Shortcut', function() {
  let wrapper;
  const annotation = {
    task: 'T0',
    value: 'something'
  };

  it('should render with default props', function() {
    wrapper = shallow(<Shortcut />);
  });

  it('should update on annotation change', function() {
    wrapper = shallow(<Shortcut />);
    wrapper.setProps({ annotation });
  });
});

describe('Shortcut functionality', function () {
  let wrapper;
  const annotation = {
    task: 'T0',
    value: null
  };

  beforeEach(function () {
    wrapper = mount(<Shortcut annotation={annotation} classification={classification} task={task} workflow={workflow} />);
    wrapper.find('input').first().simulate('change', { target: { checked: true }});
  });

  it('should turn the button active when clicked', function () {
    assert.equal(wrapper.find('label').first().hasClass('active'), true);
  });

  it('should remove shortcut when deselected', function () {
    wrapper.find('input').first().simulate('change', { target: { checked: false }});
    assert.equal(wrapper.find('label').first().hasClass('active'), false);
  });

  it('should render multiple shortcuts', function () {
    assert.equal(wrapper.find('label').length, 2);
  });

  it('should add a shortcut to the current annotation', function () {
    assert.equal(wrapper.props().annotation.shortcut.index, 0);
  });
});
