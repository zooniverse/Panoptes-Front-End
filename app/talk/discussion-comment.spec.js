import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import DiscussionComment from './discussion-comment';

const discussion = {
  section: 1
};

const user = {
  id: 1,
  display_name: 'Test User'
};

describe('DiscussionComment', () => {
  let wrapper;

  describe('not logged in', () => {
    it('will ask user to sign in', () => {
      wrapper = shallow(<DiscussionComment discussion={discussion} user={null} />);
      assert.equal(wrapper.find('.talk-comment-author').length, 0);
      assert.equal(wrapper.contains(
        <button
          className="link-style"
          type="button"
          onClick={wrapper.instance().promptToSignIn}
        >
          sign in
        </button>
      ),
      true);
    });
  });

  describe('logged in', () => {
    beforeEach(() => {
      wrapper = shallow(<DiscussionComment discussion={discussion} user={user} />);
    });

    it('will show a user avatar', () => {
      assert.equal(wrapper.find('.talk-comment-author').length, 1);
    });
    it('will show a comment box', () => {
      assert.equal(wrapper.find('Commentbox').props().user, user);
    });
  });

  describe('comment validation', () => {
    it('will not allow empty comments', () => {
      // weirdly, comment validations returns true if validation fails.
      assert.equal(wrapper.instance().commentValidations(''), true);
      assert.equal(wrapper.state().commentValidationErrors[0], 'Comments cannot be empty');
    });
    it('will allow reasonable comments', () => {
      assert.equal(wrapper.instance().commentValidations('Hello world, I\'m a valid comment.'), false);
      assert.equal(wrapper.state().commentValidationErrors.length, 0);
    });
  });
});
