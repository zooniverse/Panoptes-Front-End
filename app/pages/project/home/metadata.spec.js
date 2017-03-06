import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { render, mount } from 'enzyme';

import ProjectMetadata from './metadata';

describe('ProjectMetadata', function(){
  let project;
  let pusher;

  before(function() {
    project = { classifiers_count: 0, classifications_count: 0, completeness: 0.56, subjects_count: 0, retired_subjects_count: 0 };

    const subscribe = function(channel) { return { bind: function(event, callback) { } }};
    pusher = { subscribe };
  });

  describe('render', function() {
    let wrapper;
    before(function() {
      const context = { pusher };
      wrapper = render(<ProjectMetadata project={project} />, { context });
    });

    it('renders stats', function() {
      assert(wrapper.find('.project-metadata-stat').length, 4);
    });

    it('renders 56% completeness', function() {
      assert(wrapper.find('rect').first().prop('width'), 0.56);
    });
  });

  describe('pusher', function() {
    it('subscribes to pusher', function() {
      const context = { pusher };
      pusher.subscribe = sinon.spy(pusher.subscribe);
      const wrapper = mount(<ProjectMetadata project={project} />, { context });

      wrapper.setContext(context);
      assert(pusher.subscribe.called, true);
    });

    it('unsubscribes to pusher', function() {
      pusher.unsubscribe = sinon.spy();
      const context = { pusher };
      const wrapper = mount(<ProjectMetadata project={project} />, { context });
      wrapper.setContext(context);
      wrapper.unmount();
      assert(pusher.unsubscribe.called, true);
    });
  });
});
