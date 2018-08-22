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
    beforeEach(function () {
      wrapper = shallow(<NotificationSection />);
      wrapper.setState({ name: 'Testing' });
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
});
