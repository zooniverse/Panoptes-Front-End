import React from 'react';
import assert from 'assert';
import NotificationSection from './notification-section';
import { render, mount } from 'enzyme';

describe('Notification Section', function() {
  let wrapper;

  describe('it can display a Zooniverse section', function() {
    beforeEach(function () {
      wrapper = mount(
        <NotificationSection projectID={""} slug={null} user={{ id: 1 }} />,
      );
    });

    it('should find the correct title', function() {
      assert.equal(wrapper.find('.notification-section__title').length, 1);
    });
  });

  describe('it correctly displays project sections', function() {
    beforeEach(function () {
      wrapper = mount(
        <NotificationSection projectID={""} slug={null} user={{ id: 1 }} />,
      );
    });

    it('should find the correct title', function() {
      assert.equal(wrapper.find('.notification-section__title').length, 1);
    });
  });
});
