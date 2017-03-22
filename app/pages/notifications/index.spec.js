// These tests are skipped until a solution can be found for cjsx imports with the coffee-script test compiler

import React from 'react';
import assert from 'assert';
import Notifications from './index';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

const testNotifications = [
  { id: '123',
    section: 'project-4321'
  },
  { id: '124',
    section: 'project-1234'
  },
  { id: '125',
    section: 'zooniverse'
  },
  { id: '126',
    section: 'project-4321'
  }
];

describe('Notifications', function() {
  let wrapper;
  let notifications;

  describe('it will display according to user', function() {
    it('will ask user to sign in', function() {
      wrapper = mount(<Notifications user={null} />);
      assert.equal(wrapper.find('.talk-module').text(), 'You\'re not signed in.');
    });

    it('will notify when no notifications present', function() {
      const stub = sinon.stub(Notifications.prototype, 'componentDidMount');
      wrapper = mount(<Notifications user={{ id: 1 }} />);
      assert(wrapper.contains(<span>You have no notifications.</span>));
      stub.restore();
    });
  });

  describe('it correctly display projects', function() {
    beforeEach(function () {
      wrapper = shallow(
        <Notifications user={{ id: 1 }} />,
        { disableLifecycleMethods: true }
      );
      wrapper.instance().groupNotifications(testNotifications);
      notifications = shallow(wrapper.instance().renderNotifications());
    });

    it('will place zooniverse section first', function() {
      assert.equal(notifications.find('.list').childAt(0).prop('section'), 'zooniverse');
    });

    it('will display correct number of sections', function() {
      assert.equal(notifications.find('.list').children().length, 3);
    });
  });

  describe('will open sections correctly', function() {
    beforeEach(function () {
      wrapper = shallow(
        <Notifications user={{ id: 1 }} />,
        { disableLifecycleMethods: true }
      );
      wrapper.setState({ expanded: 'project-1234' });
      wrapper.instance().groupNotifications(testNotifications);
      notifications = shallow(wrapper.instance().renderNotifications());
    });

    it('will open the active project', function() {
      const activeProject = notifications.find('CollapsableSection').filterWhere(n => n.prop('section') === 'project-1234');
      assert.equal(activeProject.prop('expanded'), true);
    });

    it('will keep other projects closed', function() {
      const activeProject = notifications.find('CollapsableSection').filterWhere(n => n.prop('section') === 'project-4321');
      assert.equal(activeProject.prop('expanded'), false);
    });
  });
});
