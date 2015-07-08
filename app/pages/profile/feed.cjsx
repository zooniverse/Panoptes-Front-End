React = require 'react'
moment = require 'moment'
apiClient = require '../../api/client'
talkClient = require '../../api/talk'

CommentLink = React.createClass
  displayName: 'CommentLink'

  getDefaultProps: ->
    comment: null

  getInitialState: ->
    href: '#'

  componentDidMount: ->
    @getCommentHREF(@props.comment)

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.comment is @props.comment
      @getCommentHREF(nextProps.comment)

  getCommentHREF: (comment) ->
    console.log 'sec', comment.section.split('-')
    projectID = comment.section.split('-')[1]

    @setState({href: '#'})
    talkClient.type('discussions').get(comment.discussion_id).then (discussion) =>
      talkClient.type('boards').get(discussion.board_id).then (board) =>
        if projectID?
          apiClient.type('projects').get(projectID).then (project) =>
            project.get('owner').then (owner) =>
              @setState({href: "#/projects/#{owner.login}/#{project.slug}/talk/#{board.id}/#{discussion.id}?comment=#{comment.id}"})
        else
          @setState({href: "#/talk/#{board.id}/#{discussion.id}?comment=#{comment.id}"})

  render: ->
    <a href={@state.href}>
      <header>
        <span title={moment(@props.comment.created_at).toISOString()}>{moment(@props.comment.created_at).fromNow()}</span>{' '}
      </header>
      <div className="content-container">{@props.comment.body}</div>
    </a>

module.exports = React.createClass
  displayName: 'UserProfileFeed'

  getDefaultProps: ->
    user: null
    query:
      page: 1

  getInitialState: ->
    comments: null
    error: null

  componentDidMount: ->
    @getComments(@props.user, @props.query.page)

  componentWillReceiveProps: (nextProps) ->
    unless nextProps is @props.user and nextProps.query.page is @props.query.page
      @getComments(nextProps.user, nextProps.query.page)

  getComments: (user, page) ->
    @setState({
      comments: null
      error: null
    })
    talkClient.type('comments').get({user_id: user.id, page: page, sort: '-created_at'})
      .catch (error) =>
        @setState({error})
      .then (comments) =>
        @setState({comments})

  render: ->
    <div className="content-container">
      {if @state.comments?.length is 0
        <p className="form-help">No recent comments</p>
      else if @state.comments?
        # TODO: Pagination.
        for comment in @state.comments
          <CommentLink key={comment.id} comment={comment} />
      else if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>
      else
        null}
    </div>
