import React from 'react'
import assert from 'assert'
import sinon from 'sinon'
import ProjectMetadata from './metadata'
import {shallow, render, mount} from 'enzyme'

describe('ProjectMetadata', function(){
  var project;
  var pusher;

  before(function() {
    project = {classifiers_count: 0, classifications_count: 0, subjects_count: 0, retired_subjects_count: 0};

    const subscribe = function(channel) { return {bind: function(event, callback) { }}}
    pusher = {subscribe: subscribe};
  });

  it('renders stats', function(){
    const context = {pusher: pusher};
    const page = render(<ProjectMetadata project={project} />, {context});
    assert(page.find('.project-metadata-stat').length, 4);
  });

  it('subscribes to pusher', function() {
    const context = {pusher: pusher};
    pusher.subscribe = sinon.spy(pusher.subscribe);
    const wrapper = mount(<ProjectMetadata project={project} />, {context});
    wrapper.setContext(context);
    assert(pusher.subscribe.called, true);
  });

  it('subscribes to pusher', function() {
    const context = {pusher: pusher};
    pusher.unsubscribe = sinon.spy();

    const wrapper = mount(<ProjectMetadata project={project} />, {context});
    wrapper.setContext(context);
    wrapper.unmount();

    assert(pusher.unsubscribe.called, true);
  });
});
