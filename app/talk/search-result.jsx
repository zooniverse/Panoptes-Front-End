import PropTypes from 'prop-types';
import React from 'react';
import { Markdown } from 'markdownz';
import { Link } from 'react-router';
import apiClient from 'panoptes-client/lib/api-client';
import DiscussionPreview from './discussion-preview';
import CommentLink from './comment-link';
import CommentContextIcon from './lib/comment-context-icon';
import getSubjectLocation from '../lib/get-subject-location';
import Thumbnail from '../components/thumbnail';

// This isn't very reuseable as it's prop is a comment resource with it's
// linked discussion added on. Probably a better way to approach this.

export default class TalkSearchResult extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subject: null
    };
  }

  componentDidMount() {
    this.getSubject(this.props.data);
  }

  getSubject(comment) {
    if (comment.focus_id && (comment.focus_type === 'Subject')) {
      apiClient.type('subjects').get(comment.focus_id)
      .then((media) => {
        const subject = getSubjectLocation(media);
        this.setState({ subject });
      });
    }
  }

  discussionFromComment(comment) {
    return ({
      id: comment.discussion_id,
      board_id: comment.board_id,
      title: comment.discussion_title,
      users_count: comment.discussion_users_count,
      comments_count: comment.discussion_comments_count,
      latest_comment: comment
    });
  }

  render() {
    const comment = this.props.data;
    const discussion = this.discussionFromComment(comment);
    const [owner, name] = comment.project_slug ? comment.project_slug.split('/') : [];

    return (
      <div className="talk-search-result talk-module">
        {this.state.subject && (
          <CommentLink comment={comment} project={this.props.project}>
            <Thumbnail
              src={this.state.subject.src}
              type={this.state.subject.type}
              format={this.state.subject.format}
              width={100}
              height={150}
              controls={false}
            />
          </CommentLink>
        )}
        <CommentContextIcon comment={comment} />
        <CommentLink comment={comment} project={this.props.project}>{comment.discussion_title}</CommentLink>
        <Markdown content={comment.body} project={this.props.project} />
        <DiscussionPreview {...this.props} discussion={discussion} owner={owner} name={name} comment={comment} />
      </div>
    );
  }
}

TalkSearchResult.defaultProps = {
  data: {},
  project: {}
};

TalkSearchResult.propTypes = {
  data: PropTypes.shape({
    board_id: PropTypes.string,
    discussion_comments_count: PropTypes.number,
    discussion_id: PropTypes.string,
    discussion_title: PropTypes.string,
    discussion_users_count: PropTypes.number
  }),
  project: PropTypes.object
};