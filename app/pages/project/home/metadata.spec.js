import React from 'react';
import assert from 'assert';
import { render } from 'enzyme';

import ProjectMetadata from './metadata';

describe('ProjectMetadata', function() {
  let project;

  before(function() {
    project = {
      classifiers_count: 0,
      classifications_count: 0,
      completeness: 0.56,
      display_name: 'My test project',
      subjects_count: 0,
      retired_subjects_count: 0,
      title: 'My test project'
    };
  });

  describe('render', function() {
    let wrapper;
    before(function() {
      wrapper = render(<ProjectMetadata project={project} translation={project} />);
    });

    it('renders stats', function() {
      assert(wrapper.find('.project-metadata-stat').length, 4);
    });

    it('renders 56% completeness', function() {
      assert(wrapper.find('rect').first().prop('width'), 0.56);
    });

    it('excludes TalkStatus by default', function() {
      assert.notEqual(wrapper.find('.project-home-page__talk-stat').length, 1);
    });

    it('includes TalkStatus if showTalkStatus prop is true', function() {
      wrapper = render(<ProjectMetadata project={project} translation={project} showTalkStatus={true} />);
      assert(wrapper.find('.project-home-page__talk-stat').length, 1);
    });
  });
});
