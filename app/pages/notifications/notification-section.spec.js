import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import NotificationSection from './notification-section';

const notifications = [
  { notification: {
    id: '123',
    source_type: 'DataRequest',
    url: '/',
    message: 'test message',
    created_at: '2016-12-09T16:09:50.641Z',
  },
    data: { projectName: 'TestingProject' },
  },
  { notification: {
    id: '124',
    source_type: 'DataRequest',
    url: '/',
    message: 'test message',
    created_at: '2016-12-10T16:09:50.641Z',
  },
    data: { projectName: 'TestingProject' },
  },
];

describe('Notification Section', function() {
  let wrapper;

  before(function () {
    sinon.stub(NotificationSection.prototype, 'getUnreadCount').callsFake(() => null);
  });

  after(function () {
    NotificationSection.prototype.getUnreadCount.restore();
  });

  describe('it can display a Zooniverse section', function () {
    beforeEach(function () {
      wrapper = shallow(
        <NotificationSection projectID={''} slug={null} user={{ id: 1 }} section={'zooniverse'} />,
      );
    });

    it('should display the correct title', function () {
      assert.equal(wrapper.find('.notification-section__title').text(), 'Zooniverse');
    });

    it('should link to the home page', function () {
      assert.equal(wrapper.find('Link').prop('to'), '/');
    });

    it('shows the Zooniverse logo', function () {
      assert.equal(wrapper.find('ZooniverseLogo').length, 1);
    });
  });

  describe('it correctly displays a project', function () {
    before(function () {
      sinon.stub(NotificationSection.prototype, 'componentWillMount').callsFake(() => null);
      wrapper = shallow(<NotificationSection />);
      wrapper.setState({ name: 'Testing' });
    });

    after(function () {
      NotificationSection.prototype.componentWillMount.restore();
    });

    it('should display the correct title', function () {
      assert.equal(wrapper.find('.notification-section__title').text(), 'Testing');
    });
  });

  describe('will render appropriately when open', function () {
    beforeEach(function () {
      wrapper = shallow(
        <NotificationSection expanded={true} projectID={''} slug={null} user={{ id: 1 }} section={'zooniverse'} />,
      );
      wrapper.setState({ notificationData: notifications });
    });

    it('should display the correct number of notifications', function () {
      assert.equal(wrapper.find('Notification').length, 2);
    });

    it('should show an unread notification in place of an avatar', function () {
      wrapper.setState({ unread: 1 });
      assert.equal(wrapper.find('circle').length, 1);
    });

    it('should show close icon', function () {
      assert.equal(wrapper.find('.fa-chevron-up').length, 1);
    });
  });

  describe('will update notifications as read', function () {
    const newNotifications = [
      {
        id: '123',
        delivered: false,
        source: {
          discussion_id: '456'
        },
        source_type: 'Comment',
        update: sinon.stub().returnsThis(),
        save: sinon.stub().resolves({})
      },
      {
        id: '124',
        delivered: false,
        source: {
          discussion_id: '456'
        },
        source_type: 'Comment',
        update: sinon.stub().returnsThis(),
        save: sinon.stub().rejects()
      },
      {
        id: '125',
        delivered: false,
        source_type: 'Moderation',
        source: {},
        update: sinon.stub().returnsThis(),
        save: sinon.stub().resolves({})
      },
      {
        id: '126',
        delivered: false,
        source: {
          discussion_id: '789'
        },
        source_type: 'Comment',
        update: sinon.stub().returnsThis(),
        save: sinon.stub().resolves({})
      }
    ];
    const notificationsCounter = {
      update: sinon.stub()
    };
    wrapper = shallow(
      <NotificationSection expanded={true} />,
      { context: { notificationsCounter }, disableLifeCycleMethods: true }
    );
    wrapper.setState({ notifications: newNotifications });
    wrapper.instance().markAsRead(newNotifications[0]);

    it('should update read notification as read (delivered)', function () {
      assert.equal(newNotifications[0].update.calledWith({ delivered: true }), true);
      assert.equal(newNotifications[0].save.called, true);
    });

    it('should update related notifications as read (delivered)', function () {
      assert.equal(newNotifications[1].update.calledWith({ delivered: true }), true);
      assert.equal(newNotifications[1].save.called, true);
    });

    it('should not update unrelated notifications', function () {
      assert.equal(newNotifications[2].update.called, false);
      assert.equal(newNotifications[2].save.called, false);
      assert.equal(newNotifications[3].update.called, false);
      assert.equal(newNotifications[3].save.called, false);
    });

    it('should update the notifications counter', function () {
      assert.equal(notificationsCounter.update.called, true);
    });
  });
});
