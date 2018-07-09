React = require 'react'
createReactClass = require 'create-react-class'
moment = require 'moment'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'
{Markdown} = require 'markdownz'
{Link} = require 'react-router'

module.exports = createReactClass
  displayName: 'CommentLink'

  getDefaultProps: ->
    comment: null

  getInitialState: ->
    projectTitle: ''
    owner: null
    discussionTitle: ''
    boardTitle: ''

  componentDidMount: ->
    @getLinkText(@props.comment)

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.comment is @props.comment
      @getLinkText(nextProps.comment)

  getLinkText: (comment) ->
    [rootType, rootID] = comment.section.split('-')

    talkClient.type('discussions').get(comment.discussion_id)
      .then (discussion) =>
        @setState { discussionTitle: discussion.title }
        talkClient.type('boards').get(discussion.board_id)
      .then (board) =>
        @setState { boardTitle: board.title }
        if rootType is 'project' and rootID?
          apiClient.type('projects').get(rootID)
        else
          Promise.resolve {}
      .then (project) =>
        @setState { projectTitle: project.display_name }
          

  render: ->
    { comment } = this.props
    if comment.project_slug?
      href = "/projects/#{comment.project_slug}/talk/#{comment.board_id}/#{comment.discussion_id}?comment=#{comment.id}"
    else
      href = "/talk/#{comment.board_id}/#{comment.discussion_id}?comment=#{comment.id}"
      
    <div className="profile-feed-comment-link">
      <header>
        <span className="comment-timestamp" title={moment(@props.comment.created_at).toISOString()}>
          {moment(@props.comment.created_at).fromNow()}
        </span>
          <span>
            {' '}in{' '}
            <Link to={href}>
              {if @state.projectTitle?.length and !@props.project?
                <span>
                  <strong className="comment-project">{@state.projectTitle}</strong>
                  <span>{' '}➞{' '}</span>
                </span>}
              <strong className="comment-board">{@state.boardTitle}</strong>
              <span>{' '}➞{' '}</span>
              <strong className="comment-discussion">{@state.discussionTitle}</strong>
            </Link>
          </span>
      </header>

      <Markdown className="comment-body" content={@props.comment.body} />
    </div>
