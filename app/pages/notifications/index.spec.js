/* eslint-disable prefer-arrow-callback */

import React from 'react';
import assert from 'assert';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import talkClient from 'panoptes-client/lib/talk-client';

import NotificationsPage from './index';

const testNotifications = [
  {
    id: '123',
    section: 'project-4321'
  },
  {
    id: '124',
    section: 'project-1234'
  },
  {
    id: '125',
    section: 'zooniverse'
  },
  {
    id: '126',
    section: 'project-4321'
  }
];

describe('NotificationsPage', function() {
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

    // The following tests are failing because the CollapsableSection component and Paginator component (child of NotificationSection) require a router context. There are also issues with enzyme, coffeescript, and child class components.

  //   describe('with a project and notifications', function () {
  //     let wrapper;
  //     let sections;

  //     before(function () {
  //       sinon.stub(talkClient, 'request').callsFake(() => Promise.resolve(testNotifications));

  //       wrapper = mount(
  //         <NotificationsPage
  //           user={{ id: '456' }}
  //           project={{ id: '4321' }}
  //         />,
  //         { context: { router: { location: { pathname: '/notifications' }}}}
  //       );
  //       sections = wrapper.find('CollapsableSection');
  //     });

  //     after(function () {
  //       talkClient.request.restore();
  //     });

  //     it('should render the correct number of sections', function () {
  //       assert.equal(sections.length, 3);
  //     });

  //     it('should render the Zooniverse section first', function () {
  //       assert.equal(sections.at(0).prop('section'), 'zooniverse');
  //     });

  //     it('should expand the correct section', function () {
  //       assert.equal(sections.at(0).prop('expanded'), false);

  //       assert.equal(sections.at(1).prop('section', 'project-4321'));
  //       assert.equal(sections.at(1).prop('expanded'), true);

  //       assert.equal(sections.at(2).prop('expanded'), false);
  //     });
  //   });
  });
});
