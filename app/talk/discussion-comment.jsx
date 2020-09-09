import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import talkClient from 'panoptes-client/lib/talk-client';
import Avatar from '../partials/avatar';
import DisplayRoles from './lib/display-roles';
import CommentBox from './comment-box';
import SignInPrompt from '../partials/sign-in-prompt';
import commentValidations from './lib/comment-validations';
import alert from '../lib/alert';
import { getErrors } from './lib/validations';

class DiscussionComment extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmitComment = this.onSubmitComment.bind(this);
    this.commentValidations = this.commentValidations.bind(this);
    this.state = {
      commentValidationErrors: []
    };
  }

  onSubmitComment(e, textContent, subject, reply) {
    let comment = {
      user_id: this.props.user.id,
      discussion_id: +this.props.params.discussion,
      body: textContent
    };
    if (!!subject && subject.id) {
      comment = Object.assign(comment, {
        focus_id: +subject.id,
        focus_type: 'Subject'
      });
    }
    if (reply) {
      comment = Object.assign(comment, {
        reply_id: reply.comment.id
      });
    }

    return talkClient.type('comments')
    .create(comment)
    .save()
    .then(this.props.onSubmitComment);
  }

  commentValidations(commentBody) {
    // TODO: return true if any additional validations fail
    const commentValidationErrors = getErrors(commentBody, commentValidations);
    this.setState({ commentValidationErrors });
    return !!commentValidationErrors.length;
  }

  promptToSignIn() {
    alert(resolve => <SignInPrompt onChoose={resolve} />);
  }

  render() {
    if (this.props.user && !this.props.user.valid_email) {
      return(
        <p>
          You must have a <Link to="/settings/email">valid email address</Link> in order to contribute to the conversation.
        </p>
      )
    }
    if (this.props.user && this.props.user.valid_email) {
      const baseLink = this.props.project ? `projects/${this.props.project.slug}` : '/';
      return (
        <div>
          <div className="talk-comment-author">
            <Avatar user={this.props.user} />
            <p>
              <Link to={`${baseLink}users/${this.props.user.login}`}>{this.props.user.display_name}</Link>
            </p>
            <div className="user-mention-name">@{this.props.user.login}</div>
            <DisplayRoles roles={this.props.roles} section={this.props.discussion.section} />
          </div>

          <CommentBox
            user={this.props.user}
            project={this.props.project}
            validationCheck={this.commentValidations}
            validationErrors={this.state.commentValidationErrors}
            onSubmitComment={this.onSubmitComment}
            reply={this.props.reply}
            logSubmit={true}
            onClickClearReply={this.props.onClearReply}
            header={null}
          />
        </div>
      );
    } else {
      return (
        <p>Please <button className="link-style" type="button" onClick={this.promptToSignIn}>sign in</button> to contribute to the discussion</p>
      );
    }
  }
}

DiscussionComment.propTypes = {
  params: PropTypes.object,
  project: PropTypes.object,
  user: PropTypes.object,
  roles: PropTypes.array,
  discussion: PropTypes.object,
  reply: PropTypes.object,
  onSubmitComment: PropTypes.func,
  onClearReply: PropTypes.func
};

export default DiscussionComment;