/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */
import { shallow, mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import ShortcutEditor from './editor';

const task = {
  question: 'What is it',
  type: 'single',
  unlinkedTask: 'T1'
};

const workflow = {
  tasks: {
    T1: {
      answers: [
        { label: 'Nothing Here' },
        { label: 'Fire' }
      ],
      type: 'shortcut'
    }
  }
};

const emptyWorkflow = {
  tasks: {
    T0: {
      answers: [],
      type: 'single'
    }
  }
};

const emptyTask = {
  question: 'What is it',
  type: 'single'
};

describe('ShortcutEditor', function () {
  describe('rendering', function () {
    let wrapper;

    before(function () {
      wrapper = mount(<ShortcutEditor task={task} workflow={workflow} />);
    });

    it('should show checked if shortcut is available', function () {
      assert.equal(wrapper.find('input').props().checked, true);
    });

    it('should correctly display a shortcut label', function () {
      const textarea = wrapper.find('textarea').first();
      assert.equal(textarea.text(), 'Nothing Here');
    });

    it('should display the correct number of shortcuts', function () {
      assert.equal(wrapper.find('textarea').length, 2);
    });
  });

  describe('rendering without a shortcut', function () {
    let wrapper;

    before(function () {
      wrapper = shallow(<ShortcutEditor task={emptyTask} workflow={emptyWorkflow} />);
    });

    it('should not be checked if there are not shortcuts', function () {
      assert.equal(wrapper.find('input').props().checked, false);
    });

    it('should not display shortcuts if none available', function () {
      assert.equal(wrapper.find('textarea').length, 0);
    });
  });

  describe('methods', function () {
    let wrapper;

    beforeEach(function () {
      wrapper = mount(<ShortcutEditor task={task} workflow={workflow} />);
    });

    it('should call toggleShortcut with an input toggle', function () {
      const toggleStub = sinon.stub(wrapper.instance(), 'toggleShortcut');
      wrapper.update();
      wrapper.find('input').simulate('change');
      sinon.assert.called(toggleStub);
    });

    it('should call remove handler when clicked', function () {
      const removeStub = sinon.stub(wrapper.instance(), 'removeChoice');
      const removeButton = wrapper.find('button.workflow-choice-remove-button').first();
      wrapper.update();
      removeButton.simulate('click');
      sinon.assert.called(removeStub);
    });

    it('should call add handler when clicked', function () {
      const addStub = sinon.stub(wrapper.instance(), 'addAnswer');
      const addButton = wrapper.find('button.workflow-choice-add-button').first();
      wrapper.update();
      addButton.simulate('click');
      sinon.assert.called(addStub);
    });
  });
});
