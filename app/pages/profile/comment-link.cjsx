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
    project: null
    owner: null
    discussion: null
    board: null
    href: ''

  componentDidMount: ->
    @getCommentHREF(@props.comment)

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.comment is @props.comment
      @getCommentHREF(nextProps.comment)

  getCommentHREF: (comment) ->
    [rootType, rootID] = comment.section.split('-')
    
    if comment.project_slug?
      href = "/projects/#{comment.project_slug}/talk/#{comment.board_id}/#{comment.discussion_id}?comment=#{comment.id}"
    else
      href = "/talk/#{comment.board_id}/#{comment.discussion_id}?comment=#{comment.id}"
    
    @setState({ href })

    talkClient.type('discussions').get(comment.discussion_id).then (discussion) =>

      talkClient.type('boards').get(discussion.board_id).then (board) =>
        @setState({ board, discussion })
        
        if rootType is 'project' and rootID?
          apiClient.type('projects').get(rootID).then (project) =>
            @setState
              boardProject: project
          

  render: ->
    <div className="profile-feed-comment-link">
      <header>
        <span className="comment-timestamp" title={moment(@props.comment.created_at).toISOString()}>
          {moment(@props.comment.created_at).fromNow()}
        </span>
        {if @state.board?.id and @state.discussion?.id
          <span>
            {' '}in{' '}
            <Link to={@state.href}>
              {if @state.boardProject? and !@props.project?
                <span>
                  <strong className="comment-project">{@state.boardProject.display_name}</strong>
                  <span>{' '}➞{' '}</span>
                </span>}
              <strong className="comment-board">{@state.board?.title}</strong>
              <span>{' '}➞{' '}</span>
              <strong className="comment-discussion">{@state.discussion?.title}</strong>
            </Link>
          </span>}
      </header>

      <Markdown className="comment-body" content={@props.comment.body} />
    </div>
