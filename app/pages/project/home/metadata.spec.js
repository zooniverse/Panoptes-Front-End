import React from 'react';
import assert from 'assert';
import { render } from 'enzyme';

import ProjectMetadata from './metadata';

describe('ProjectMetadata', () => {
  let project;

  before(() => {
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

  describe('render', () => {
    let wrapper;
    before(() => {
      wrapper = render(<ProjectMetadata project={project} translation={project} />);
    });

    it('renders stats', () => {
      assert(wrapper.find('.project-metadata-stat').length, 4);
    });

    it('renders 56% completeness', () => {
      assert(wrapper.find('rect').first().prop('width'), 0.56);
    });

    it('excludes TalkStatus by default', () => {
      assert.notEqual(wrapper.find('.project-home-page__talk-stat').length, 1);
    });

    it('includes TalkStatus if showTalkStatus prop is true', () => {
      wrapper = render(<ProjectMetadata project={project} translation={project} showTalkStatus={true} />);
      assert(wrapper.find('.project-home-page__talk-stat').length, 1);
    });
  });
});
