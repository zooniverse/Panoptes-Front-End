/* eslint-disable func-names, prefer-arrow-callback, react/jsx-filename-extension */

import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import talkClient from 'panoptes-client/lib/talk-client';

import NotificationSection from './notification-section';

const notificationComment = {
  id: '123',
  source_type: 'Comment',
  delivered: true,
  source: {
    discussion_id: '789'
  },
  update: sinon.stub().returnsThis(),
  save: sinon.stub().resolves({})
};

const notificationDataRequest = {
  id: '124',
  source_type: 'DataRequest',
  delivered: true,
  update: sinon.stub().returnsThis(),
  save: sinon.stub().resolves({})
};

const notificationModeration = {
  id: '126',
  source_type: 'Moderation',
  delivered: true,
  update: sinon.stub().returnsThis(),
  save: sinon.stub().resolves({})
};

const notificationCommentUnread1 = {
  id: '127',
  source_type: 'Comment',
  delivered: false,
  source: {
    discussion_id: '790'
  },
  update: sinon.stub().returnsThis(),
  save: sinon.stub().resolves({})
};

const notificationCommentUnread2 = {
  id: '128',
  source_type: 'Comment',
  delivered: false,
  source: {
    discussion_id: '790'
  },
  update: sinon.stub().returnsThis(),
  save: sinon.stub().resolves({})
};

const notifications = [
  notificationComment,
  notificationDataRequest,
  notificationModeration
];

const notificationsWithUnread = notifications.concat([notificationCommentUnread1, notificationCommentUnread2]);

function notificationDataItem(notification) {
  const dataType = notification.source_type.toLowerCase();
  return {
    notification,
    data: {
      [dataType]: {
        id: notification.id.split('').reverse().join('')
      }
    }
  };
}

const notificationData = notifications.map((notification) => notificationDataItem(notification));

const notificationDataUnread = notificationsWithUnread.map((notification) => notificationDataItem(notification));

describe('NotificationSection', function () {
  describe('it can display a Zooniverse section', function () {
    let wrapper;

    before(function () {
      wrapper = shallow(
        <NotificationSection
          expanded={false}
          notifications={notifications}
          section="zooniverse"
          user={{ id: '1' }}
        />
      );
    });

    it('should display the correct title', function () {
      assert.equal(wrapper.find('.notification-section__title').text(), 'Zooniverse');
    });

    it('should link to the Zooniverse home page', function () {
      assert.equal(wrapper.find('Link').prop('to'), '/');
    });

    it('shows the Zooniverse logo', function () {
      assert.equal(wrapper.find('ZooniverseLogo').length, 1);
    });
  });

  describe('it can display a project section', function () {
    let wrapper;

    before(function () {
      wrapper = shallow(
        <NotificationSection
          expanded={false}
          notifications={notifications}
          section="1234"
          user={{ id: '1' }}
        />,
        { disableLifecycleMethods: true }
      );
      wrapper.setState({
        avatar: '/project/avatar/url',
        name: 'Test Project'
      });
    });

    it('should display the correct title', function () {
      assert.equal(wrapper.find('.notification-section__title').text(), 'Test Project');
    });
  });

  describe('it can display a section with unread notifications', function () {
    let wrapper;

    before(function () {
      wrapper = shallow(
        <NotificationSection
          expanded={false}
          notifications={notificationsWithUnread}
          section="zooniverse"
          user={{ id: '1' }}
        />
      );

      wrapper.setState({
        loading: false,
        name: 'Zooniverse'
      });
    });

    it('should show an unread notification circle in place of an avatar', function () {
      assert.equal(wrapper.find('circle').length, 1);
    });
  });

  describe('will render appropriately when open', function () {
    let wrapper;

    before(function () {
      wrapper = shallow(
        <NotificationSection
          expanded={true}
          notifications={notifications}
          section="zooniverse"
          user={{ id: '1' }}
        />,
        { disableLifecycleMethods: true }
      );
      wrapper.setState({
        loading: false,
        name: 'Zooniverse',
        notificationData
      });
    });

    it('should display the correct number of notifications', function () {
      assert.equal(wrapper.find('Notification').length, 3);
    });

    it('should show close icon', function () {
      assert.equal(wrapper.find('.fa-chevron-up').length, 1);
    });
  });

  describe('will update notification as read', function () {
    let wrapper;

    const notificationsCounterStub = {
      update: sinon.stub()
    };

    before(function () {
      wrapper = shallow(
        <NotificationSection
          expanded={true}
          notifications={notificationsWithUnread}
          section="zooniverse"
          user={{ id: '1' }}
        />,
        {
          context: {
            notificationsCounter: notificationsCounterStub
          },
          disableLifecycleMethods: true
        }
      );
      wrapper.setState({
        loading: false,
        name: 'Zooniverse',
        notificationData: notificationDataUnread
      });
      wrapper.instance().markAsRead(notificationDataUnread[4].notification);
    });

    it('should update unread notification as read (delivered)', function () {
      assert.equal(notificationCommentUnread2.update.calledWith({ delivered: true }), true);
      assert.equal(notificationCommentUnread2.save.called, true);
    });

    it('should update related unread notifications as read (delivered)', function () {
      assert.equal(notificationCommentUnread1.update.calledWith({ delivered: true }), true);
      assert.equal(notificationCommentUnread1.save.called, true);
    });

    it('should not update unrelated notifications', function () {
      assert.equal(notificationComment.update.called, false);
      assert.equal(notificationDataRequest.update.called, false);
      assert.equal(notificationModeration.update.called, false);
    });

    it('should update the notifications counter', function () {
      assert.equal(notificationsCounterStub.update.called, true);
    });
  });

  describe('will update all notifications as read', function () {
    let wrapper;
    let toggleSectionSpy;

    const notificationsCounterStub = {
      setUnread: sinon.stub()
    };

    before(function () {
      sinon.stub(talkClient, 'request').callsFake(() => Promise.resolve([]));
      toggleSectionSpy = sinon.spy();

      wrapper = shallow(
        <NotificationSection
          expanded={true}
          notifications={notificationsWithUnread}
          section="zooniverse"
          toggleSection={toggleSectionSpy}
          user={{ id: '1' }}
        />,
        {
          context: {
            notificationsCounter: notificationsCounterStub
          },
          disableLifecycleMethods: true
        }
      );
      wrapper.setState({
        loading: false,
        name: 'Zooniverse',
        notificationData: notificationDataUnread
      });
      wrapper.instance().markAllRead();
    });

    after(function () {
      talkClient.request.restore();
    });

    it('should update all notifications as read (delivered)', function () {
      assert.equal(notificationComment.update.calledWith({ delivered: true }), true);
      assert.equal(notificationDataRequest.update.calledWith({ delivered: true }), true);
      assert.equal(notificationModeration.update.calledWith({ delivered: true }), true);
      assert.equal(notificationCommentUnread1.update.calledWith({ delivered: true }), true);
      assert.equal(notificationCommentUnread2.update.calledWith({ delivered: true }), true);
    });

    it('should call toggleSection', function () {
      assert.equal(toggleSectionSpy.calledWith(false), true);
    });

    it('should update the notifications counter', function () {
      assert.equal(notificationsCounterStub.setUnread.calledWith(0), true);
    });
  });
});
