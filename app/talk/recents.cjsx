React = require 'react'
Comment = require './comment'
{Link} = require 'react-router'
talkClient = require '../api/talk'
Paginator = require './lib/paginator'
Loading = require '../components/loading-indicator'
talkConfig = require './config'

module?.exports = React.createClass
  displayName: 'TalkRecents'

  getInitialState: ->
    comments: []
    boardTitle: null
    loading: true

  getDefaultProps: ->
    query: page: 1

  componentWillReceiveProps: (nextProps) ->
    if nextProps.query.page isnt @props.query.page
      @getComments nextProps.query.page

  componentWillMount: ->
    @getComments @props.query.page

  commentParams: (page) ->
    params = sort: '-created_at', page: page
    if @props.params.board
      params.board_id = @props.params.board if @props.params.board
    else if @props.project
      params.section = "project-#{ @props.project.id }"
    else
      params.section = 'zooniverse'
    params

  getComments: (page = 1) ->
    talkClient.type('comments').get(@commentParams(page)).then (comments) =>
      meta = comments[0].getMeta()
      boardTitle = comments[0].board_title if @props.params.board
      loading = false
      @setState {comments, boardTitle, meta, loading}

  commentTitle: (comment) ->
    <span>
      {if @props.params.owner and @props.params.name
        <Link to="project-talk-discussion" params={
          board: comment.board_id,
          discussion: comment.discussion_id,
          owner: @props.params.owner,
          name: @props.params.name
        } query={comment: comment.id}>
          {comment.discussion_title} on {comment.board_title}
        </Link>
      else
        <Link to="talk-discussion" params={
          board: comment.board_id,
          discussion: comment.discussion_id
          } query={comment: comment.id}>
          {comment.discussion_title} on {comment.board_title}
        </Link>
        }
    </span>

  renderComment: (comment) ->
    <Comment
      {...@props}
      title={@commentTitle comment}
      project={@props.project}
      key={comment.id}
      data={comment}
      user={@props.user}
      project={@props.project} />

  renderPagination: ->
    <Paginator page={+@state.meta.page} pageCount={@state.meta.page_count} />

  render: ->
    <div className="talk-recents">
      <h1 className="talk-page-header">
        Recent Comments {"on #{ @state.boardTitle or @props.project?.display_name or 'Zooniverse' }"}
      </h1>
      {if @state.loading
        <Loading />
      else
        <div>
          {@renderPagination()}
          <div className="talk-discussion-comments">
            {@state.comments.map @renderComment}
          </div>
          {@renderPagination()}
        </div>}
    </div>
