React = require 'react'
moment = require 'moment'
apiClient = require '../../api/client'
talkClient = require '../../api/talk'

CommentLink = React.createClass
  displayName: 'CommentLink'

  getDefaultProps: ->
    comment: null

  getInitialState: ->
    project: null
    owner: null
    discussion: null
    board: null
    href: '#'

  componentDidMount: ->
    @getCommentHREF(@props.comment)

  componentWillReceiveProps: (nextProps) ->
    unless nextProps.comment is @props.comment
      @getCommentHREF(nextProps.comment)

  getCommentHREF: (comment) ->
    @setState({href: '#'})
    [rootType, rootID] = comment.section.split('-')
    talkClient.type('discussions').get(comment.discussion_id).then (discussion) =>
      @setState({discussion})
      talkClient.type('boards').get(discussion.board_id).then (board) =>
        @setState({board})
        href = if rootID?
          if rootType is 'project'
            # TODO: Focus
            apiClient.type('projects').get(rootID).then (project) =>
              @setState({project})
              project.get('owner').then (owner) =>
                @setState({owner})
                "#/projects/#{owner.login}/#{project.slug}/talk/#{board.id}/#{discussion.id}?comment=#{comment.id}"
        else
          Promise.resolve "#/talk/#{board.id}/#{discussion.id}?comment=#{comment.id}"
        href.then (href) =>
          @setState({href})

  render: ->
    <a href={@state.href} style={color: 'inherit', textDecoration: 'inherit'}>
      <header>
        <small>
          <span title={moment(@props.comment.created_at).toISOString()}>{moment(@props.comment.created_at).fromNow()}</span> in{' '}
          {if @state.project? and @state.owner
            <span>
              <strong className="project" title="#{@state.owner.display_name}/#{@state.project.display_name}">{@state.project.display_name}</strong>
              ➞
            </span>}
          <strong className="board">{@state.board?.title}</strong>
          ➞
          <strong className="discussion">{@state.discussion?.title}</strong>
        </small>
      </header>
      {# TODO: Markdown}
      <div className="">{@props.comment.body}</div>
      <hr />
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
        meta = @state.comments[0].getMeta()
        <div>
          <h2>Recent comments</h2>

          {for comment in @state.comments
            <CommentLink key={comment.id} comment={comment} />}

          <select value={@props.query.page} disabled={meta.page_count is 1} onChange={@handlePageChange}>
            {for page in [1..meta.page_count]
              <option key={page}>{page}</option>}
          </select>
        </div>
      else if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>
      else
        null}
    </div>

  changeSearchString: (search = '', changes) ->
    params = {}
    for keyValue in search.slice(1).split('&')
      [key, value] = keyValue.split('=')
      params[key] = value
    for key, value of changes
      params[key] = value
    "?#{([key, value].join('=') for key, value of params).join('&')}"

  handlePageChange: (e) ->
    [beforeQ, afterQ] = location.hash.split('?')
    oldSearch = '?' + afterQ
    newSearch = @changeSearchString(oldSearch, {page: e.target.value})
    location.hash = beforeQ + newSearch
