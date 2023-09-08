/* eslint-disable func-names, prefer-arrow-callback, react/jsx-filename-extension */

import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import NotificationSection from './notification-section';

const notificationComment = {
  id: '123',
  source_type: 'Comment',
  delivered: true,
  source: {
    discussion_id: '456'
  }
};

const notificationDataRequest = {
  id: '124',
  source_type: 'DataRequest',
  delivered: true
};

const notificationDiscussion = {
  id: '456',
  source_type: 'Discussion',
  delivered: true
};

const notificationModeration = {
  id: '457',
  source_type: 'Moderation',
  delivered: true
};

const notificationCommentUnread = {
  id: '125',
  source_type: 'Comment',
  delivered: false,
  source: {
    discussion_id: '456'
  }
};

const notifications = [
  notificationComment,
  notificationDataRequest,
  notificationDiscussion,
  notificationModeration
];

const notificationData = notifications.map((notification) => {
  const dataType = notification.source_type.toLowerCase();
  return {
    notification,
    data: {
      [dataType]: {
        id: notification.id.split('').reverse().join('')
      }
    }
  };
});

describe('NotificationSection', function () {
  describe('it can display a Zooniverse section', function () {
    let wrapper;

    before(function () {
      wrapper = shallow(
        <NotificationSection
          expanded={false}
          notifications={notifications}
          projectID="zooniverse"
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
      sinon.stub(NotificationSection.prototype, 'componentWillMount').callsFake(() => null);

      wrapper = shallow(
        <NotificationSection
          expanded={false}
          notifications={notifications}
          projectID="1234"
          section="1234"
          user={{ id: '1' }}
        />
      );
      wrapper.setState({ name: 'Test Project' });
    });

    after(function () {
      NotificationSection.prototype.componentWillMount.restore();
    });

    it('should display the correct title', function () {
      assert.equal(wrapper.find('.notification-section__title').text(), 'Test Project');
    });
  });

  describe('it can display a section with unread notifications', function () {
    let wrapper;
    const notificationsWithUnread = Array.from(notifications);
    notificationsWithUnread.push(notificationCommentUnread);

    before(function () {
      wrapper = shallow(
        <NotificationSection
          expanded={false}
          notifications={notificationsWithUnread}
          projectID="zooniverse"
          section="zooniverse"
          user={{ id: '1' }}
        />
      );

      wrapper.setState({
        loading: false,
        name: 'Zooniverse'
      });
    });

    it('should show an unread notification in place of an avatar', function () {
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
          projectID="zooniverse"
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
      assert.equal(wrapper.find('Notification').length, 4);
    });

    it('should show close icon', function () {
      assert.equal(wrapper.find('.fa-chevron-up').length, 1);
    });
  });

  describe.skip('will update notifications as read', function () {
    let wrapper;
    const notificationsWithUnread = Array.from(notifications);
    notificationsWithUnread.push(notificationCommentUnread);

    const notificationsCounterStub = {
      update: sinon.stub()
    };

    before(function () {
      wrapper = shallow(
        <NotificationSection
          expanded={true}
          notifications={notificationsWithUnread}
          projectID="zooniverse"
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
        name: 'Zooniverse'
      });
      // wrapper.instance().markAsRead();
    });

    it('should update read notification as read (delivered)', function () {
      assert.equal(true, false);
    });

    it('should update related notifications as read (delivered)', function () {
      assert.equal(true, false);
    });

    it('should update the notifications counter', function () {
      assert.equal(true, false);
    });
  });
});
