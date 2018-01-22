import React from 'react';
import assert from 'assert';
import {Link} from 'react-router';
import { shallow } from 'enzyme';
import DiscussionPreview from './discussion-preview';

const validProject = {
  id: 34,
  slug: 'test/project'
};

const discussion = {
  id: 42,
  board_id: 3456,
  latest_comment: 1234
};

describe('DiscussionPreview', function(){
  it('should link to /talk without a project', function () {
    const wrapper = shallow(<DiscussionPreview discussion={discussion} />);
    assert.equal(wrapper.find(Link).prop('to'), '/talk/3456/42');
  });
  it('should link to /talk with an empty project', function () {
    const project = {};
    const wrapper = shallow(<DiscussionPreview project={project} discussion={discussion} />);
    assert.equal(wrapper.find(Link).prop('to'), '/talk/3456/42');
  });
  it('should link to a project slug if present', function () {
    const wrapper = shallow(<DiscussionPreview project={validProject} discussion={discussion} />);
    assert.equal(wrapper.find(Link).prop('to'), '/projects/test/project/talk/3456/42');
  });
});
