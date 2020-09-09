import apiClient from 'panoptes-client/lib/api-client';
import React from 'react';
import { Link } from 'react-router';
import assert from 'assert';
import { expect } from 'chai';
import DiscussionComment from './discussion-comment';
import { shallow } from 'enzyme';

const discussion = {
  section: 1
};

const validUser = apiClient.type('users').create({
  login: 'test-account',
  display_name: 'Test Account',
  email: 'test@zooniverse.org',
  global_email_communication: false,
  beta_email_communication: true,
  valid_email: true
});

const invalidUser = apiClient.type('users').create({
  login: 'test-account',
  display_name: 'Test Account',
  email: 'test@zooniverse',
  global_email_communication: false,
  beta_email_communication: true,
  valid_email: false
});

describe('DiscussionComment', function() {
  let wrapper;

  describe('not logged in', function() {
    it('will ask user to sign in', function() {
      wrapper = shallow(<DiscussionComment discussion={discussion} user={null} />);
      assert.equal(wrapper.find('.talk-comment-author').length, 0);
      assert.equal(wrapper.contains(
        <button
          className="link-style"
          type="button"
          onClick={wrapper.instance().promptToSignIn}
        >
          sign in
        </button>),
        true);
    });
  });

  describe('logged in', function() {
    beforeEach(function() {
      wrapper = shallow(<DiscussionComment discussion={discussion} user={validUser} />);
    });

    it('will show a user avatar', function() {
      assert.equal(wrapper.find('.talk-comment-author').length, 1);
    });

    describe('with a valid email', function() {
      it('will show a comment box', function() {
        assert.equal(wrapper.find('Commentbox').props().user, validUser);
      });
    })

    describe('with an invalid email', function() {
      beforeEach(function () {
        wrapper.setProps({ user: invalidUser });
        wrapper.update();
      });

      it('will not show a comment box', function() {
        expect(wrapper.find('Commentbox').length).to.equal(0);
      });
      it('will show a link to update your email address', function () {
        expect(wrapper.find(Link).props().to).to.equal('/settings/email');
      })
    })
  });

  describe('comment validation', function(){
    it('will not allow empty comments', function(){
      // weirdly, comment validations returns true if validation fails.
      assert.equal(wrapper.instance().commentValidations(''), true);
      assert.equal(wrapper.state().commentValidationErrors[0], 'Comments cannot be empty');
    });
    it('will allow reasonable comments', function(){
      assert.equal(wrapper.instance().commentValidations('Hello world, I\'m a valid comment.'), false);
      assert.equal(wrapper.state().commentValidationErrors.length, 0);
    });
  });
});
