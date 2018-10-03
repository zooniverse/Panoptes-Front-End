/* eslint prefer-arrow-callback: 0, func-names: 0, 'react/jsx-boolean-value': ['error', 'always'], 'react/jsx-filename-extension': 0 */
/* global describe, it, beforeEach */
import { shallow, mount } from 'enzyme';
import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import ShortcutEditor from './editor';
import mockPanoptesResource from '../../../../test/mock-panoptes-resource';

const task = {
  question: 'What is it',
  type: 'single',
  unlinkedTask: 'T1'
};

const emptyTask = {
  question: 'What is it',
  type: 'single'
};

describe('ShortcutEditor', function () {
  describe('rendering', function () {
    let wrapper;

    before(function () {
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
      wrapper = mount(<ShortcutEditor task={task} workflow={mockPanoptesResource('workflows', workflow)} />);
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
      const emptyWorkflow = {
        tasks: {
          T0: {
            answers: [],
            type: 'single'
          }
        }
      };
      wrapper = shallow(<ShortcutEditor task={emptyTask} workflow={mockPanoptesResource('workflows', emptyWorkflow)} />);
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
    let toggleStub;
    let addStub;
    let removeStub;
    
    before(function () {
      toggleStub = sinon.stub(ShortcutEditor.prototype, 'toggleShortcut');
      addStub = sinon.stub(ShortcutEditor.prototype, 'addAnswer');
      removeStub = sinon.stub(ShortcutEditor.prototype, 'removeChoice');
    });

    beforeEach(function () {
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
      const mockWorkflow = mockPanoptesResource('workflows', workflow);
      wrapper = mount(<ShortcutEditor task={task} workflow={mockWorkflow} />);
    });

    after(function () {
      toggleStub.restore();
      addStub.restore();
      removeStub.restore();
    });

    it('should call toggleShortcut with an input toggle', function () {
      wrapper.find('input').simulate('change', { target: { checked: true } });
      sinon.assert.called(toggleStub);
    });

    it('should call remove handler when clicked', function () {
      const removeButton = wrapper.find('button.workflow-choice-remove-button').first();
      removeButton.simulate('click');
      sinon.assert.called(removeStub);
    });

    it('should call add handler when clicked', function () {
      const addButton = wrapper.find('button.workflow-choice-add-button').first();
      addButton.simulate('click');
      sinon.assert.called(addStub);
    });
  });
});
