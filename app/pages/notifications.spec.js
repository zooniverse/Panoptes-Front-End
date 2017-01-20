// These tests are skipped until a solution can be found for cjsx imports with the coffee-script test compiler

import React from 'react';
import assert from 'assert';
import Notifications from './notifications';
import { mount, shallow } from 'enzyme';

const testNotifications = [
  { id: '123',
    section: 'project-4321',
  },
  { id: '124',
    section: 'project-1234',
  },
  { id: '125',
    section: 'zooniverse',
  },
];

describe('Notifications', function() {
  let wrapper;

  describe('it will display according to user', function() {
    it('will ask user to sign in', function() {
      wrapper = mount(<Notifications user={null} />);
      assert.equal(wrapper.find('.talk-module').text(), 'You\'re not signed in.');
    });

    it('will notify when no notifications present', function() {
      wrapper = mount(<Notifications user={{ id: 1 }} />);
      assert(wrapper.contains(<span>You have no notifications.</span>));
    });
  });

  describe('it correctly display projects', function() {
    beforeEach(function () {
      wrapper = shallow(
        <Notifications user={{ id: 1 }} />,
      );
      const arrangedNotifications = wrapper.instance().groupNotifications(testNotifications);
      wrapper.setState({ projNotifications: arrangedNotifications });
    });

    it('will place zooniverse section first', function() {
      assert.equal(wrapper.find('.list').childAt(0).prop('section'), 'zooniverse');
    });

    it('will display correct number of sections', function() {
      assert.equal(wrapper.find('.list').children().length, 3);
    });
  });
});
