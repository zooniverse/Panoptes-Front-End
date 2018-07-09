import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import apiClient from 'panoptes-client/lib/api-client';
import { Markdown } from 'markdownz';
import { Link } from 'react-router';

class CommentLink extends React.Component {
  constructor() {
    super();
    this.state = {
      projectTitle: ''
    };
  }

  componentDidMount() {
    this.getProject(this.props.comment);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.comment.section !== this.props.comment.section) {
      this.getProject(this.props.comment);
    }
  }

  getProject(comment) {
    const [rootType, rootID] = comment.section.split('-');
    if (rootType === 'project' && rootID) {
      apiClient.type('projects').get(rootID)
      .then(project => this.setState({ projectTitle: project.display_name }));
    }
  }

  render() {
    const { comment } = this.props;
    const href = comment.project_slug ?
      `/projects/${comment.project_slug}/talk/${comment.board_id}/${comment.discussion_id}?comment=${comment.id}` :
      `/talk/${comment.board_id}/${comment.discussion_id}?comment=${comment.id}`;
    return (
      <div className="profile-feed-comment-link">
        <header>
          <span className="comment-timestamp" title={moment(comment.created_at).toISOString()}>
            {moment(comment.created_at).fromNow()}
          </span>
          <span>
            {' '}in{' '}
            <Link to={href}>
              {!!this.state.projectTitle.length && !this.props.project &&
                <span>
                  <strong className="comment-project">{this.state.projectTitle}</strong>
                  <span>{' '}➞{' '}</span>
                </span>}
              <strong className="comment-board">{comment.board_title}</strong>
              <span>{' '}➞{' '}</span>
              <strong className="comment-discussion">{comment.discussion_title}</strong>
            </Link>
          </span>
        </header>

        <Markdown className="comment-body" content={comment.body} />
      </div>
    );
  }
}

CommentLink.propTypes = {
  comment: PropTypes.shape({
    section: PropTypes.string
  }),
  project: PropTypes.shape({})
};

CommentLink.defaultProps = {
  comment: null,
  project: null
};

export default CommentLink;
