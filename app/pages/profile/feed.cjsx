React = require 'react'
moment = require 'moment'
apiClient = require '../../api/client'
talkClient = require '../../api/talk'
Markdown = require '../../components/markdown'
Paginator = require '../../talk/lib/paginator'

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
    <div className="profile-feed-comment-link">
      <header>
        <span className="comment-timestamp"title={moment(@props.comment.created_at).toISOString()}>
          {moment(@props.comment.created_at).fromNow()}
        </span>{' '}
        in{' '}
        <a href={@state.href}>
          {if @state.project? and @state.owner
            <span>
              <strong className="comment-project" title="#{@state.owner.display_name}/#{@state.project.display_name}">{@state.project.display_name}</strong>
              ➞
            </span>}
          <strong className="comment-board">{@state.board?.title}</strong>
          ➞
          <strong className="comment-discussion">{@state.discussion?.title}</strong>
        </a>
      </header>

      <Markdown className="comment-body" content={@props.comment.body} />
    </div>

module.exports = React.createClass
  displayName: 'UserProfileFeed'

  propTypes:
    user: React.PropTypes.object

  getDefaultProps: ->
    query:
      page: 1

  getInitialState: ->
    comments: null
    error: null

  componentDidMount: ->
    @getComments(@props.profileUser, @props.query.page)

  componentWillReceiveProps: (nextProps) ->
    unless nextProps is @props.profileUser and nextProps.query.page is @props.query.page
      @getComments(nextProps.profileUser, nextProps.query.page)

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

          <Paginator pageCount={meta.page_count} page={meta.page} />
        </div>
      else if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>
      else
        null}
    </div>
