/* eslint-disable func-names, prefer-arrow-callback, react/jsx-filename-extension */

import React from 'react';
import assert from 'assert';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import talkClient from 'panoptes-client/lib/talk-client';

import Loading from '../../components/loading-indicator';
import NotificationsPage from './index';

const testNotifications = [
  {
    id: '123',
    project_id: '4321',
    section: 'project-4321',
    getMeta: () => ({ next_page: null })
  },
  {
    id: '124',
    project_id: '1234',
    section: 'project-1234',
    getMeta: () => ({ next_page: null })
  },
  {
    id: '125',
    project_id: '',
    section: 'zooniverse',
    getMeta: () => ({ next_page: null })
  },
  {
    id: '126',
    project_id: '4321',
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

    describe('with notifications', function () {
      let wrapper;

      before(function () {
        wrapper = shallow(
          <NotificationsPage
            project={{ id: '1234' }}
            user={{ id: '456' }}
          />,
          { disableLifecycleMethods: true }
        );
        wrapper.setState({
          expanded: '1234',
          notifications: testNotifications
        });
      });

      it('will display correct number of sections', function () {
        assert.equal(wrapper.find('CollapsableSection').length, 3);
      });

      it('will place Zooniverse section first', function () {
        assert.equal(wrapper.find('CollapsableSection').at(0).prop('section'), 'zooniverse');
      });

      it('will open the active project', function () {
        assert.equal(wrapper.find('CollapsableSection').at(1).prop('expanded'), true);
        assert.equal(wrapper.find('CollapsableSection').at(1).prop('section'), '1234');
      });

      it('will keep other projects closed', function () {
        assert.equal(wrapper.find('CollapsableSection').at(0).prop('expanded'), false);
        assert.equal(wrapper.find('CollapsableSection').at(2).prop('expanded'), false);
      });
    });
  });
});
