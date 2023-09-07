/* eslint-disable prefer-arrow-callback, react/jsx-filename-extension */

import React from 'react';
import assert from 'assert';
import { mount } from 'enzyme';
import sinon from 'sinon';

import talkClient from 'panoptes-client/lib/talk-client';

import Loading from '../../components/loading-indicator';
import NotificationsPage from './index';

const testNotifications = [
  {
    id: '123',
    section: 'project-4321',
    getMeta: () => ({ next_page: null })
  },
  {
    id: '124',
    section: 'project-1234',
    getMeta: () => ({ next_page: null })
  },
  {
    id: '125',
    section: 'zooniverse',
    getMeta: () => ({ next_page: null })
  },
  {
    id: '126',
    section: 'project-4321',
    getMeta: () => ({ next_page: null })
  }
];

describe('NotificationsPage', function () {
  describe('without a user', function () {
    let wrapper;

    before(function () {
      wrapper = mount(<NotificationsPage user={null} />);
    });

    it('should render not signed in message', function () {
      assert.equal(wrapper.find('.centering').text(), 'You\'re not signed in.');
    });
  });

  describe('with a user', function () {
    describe('with an error', function () {
      let wrapper;
      const testError = new Error('Test error');

      before(function () {
        sinon.stub(talkClient, 'request').callsFake(() => Promise.reject(testError));

        wrapper = mount(<NotificationsPage user={{ id: '456' }} />);
      });

      after(function () {
        talkClient.request.restore();
      });

      it('should render an error message', function () {
        assert.equal(wrapper.find('.centering').text(), 'Test error');
      });
    });

    describe('while loading', function () {
      let wrapper;

      before(function () {
        sinon.stub(talkClient, 'request').callsFake(() => Promise.resolve(null));

        wrapper = mount(<NotificationsPage user={{ id: '456' }} />);
      });

      after(function () {
        talkClient.request.restore();
      });

      it('should render a loading message', function () {
        assert.equal(wrapper.find(Loading).length, 1);
      });
    });

    describe('without notifications', function () {
      let wrapper;

      before(function () {
        sinon.stub(talkClient, 'request').callsFake(() => Promise.resolve([]));

        wrapper = mount(<NotificationsPage user={{ id: '456' }} />);
      });

      after(function () {
        talkClient.request.restore();
      });

      it('should render a no notifications message', function () {
        assert.equal(wrapper.find('.centering').text(), 'You have no notifications. You can receive notifications by participating in Talk, following discussions, and receiving messages.');
      });
    });

    // The following tests are failing because the CollapsableSection component and Paginator component (child of NotificationSection) require router context.
    // There are also issues with enzyme, coffeescript, and children that are class components.

    // describe('with notifications', function () {
    //   let wrapper;

    //   before(function () {
    //     sinon.stub(talkClient, 'request').callsFake(() => Promise.resolve(testNotifications));

    //     wrapper = mount(<NotificationsPage user={{ id: '456' }} />);
    //   });

    //   after(function () {
    //     talkClient.request.restore();
    //   });

    //   it('should render notifications sections', function () {
    //     assert.equal(wrapper.find('.notification-section').length, 3);
    //   });
    // });
  });
});
