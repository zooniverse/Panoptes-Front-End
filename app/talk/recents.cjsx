React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
Comment = require './comment'
{Link} = require 'react-router'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'
Paginator = require './lib/paginator'
updateQueryParams = require './lib/update-query-params'
Loading = require('../components/loading-indicator').default
talkConfig = require './config'

module.exports = createReactClass
  displayName: 'TalkRecents'

  contextTypes:
    router: PropTypes.object.isRequired

  getInitialState: ->
    comments: []
    authors: {}
    subjects: {}
    author_roles: {}
    boardTitle: null
    loading: true

  getDefaultProps: ->
    location:
      query:
        page: 1
        showNotes: 'true'

  componentWillReceiveProps: (nextProps) ->
    if nextProps.location.query.page isnt @props.location.query.page
      @getComments nextProps.location.query.page

  componentDidMount: ->
    @getComments()

  commentParams: (page) ->
    params = sort: '-created_at', page: page

    showNotes = if @refs.showNotes
      @refs.showNotes.checked
    else
      # Occurs before the dom has rendered (default: 'true')
      @props.location.query.showNotes is 'true'

    params.page_size = talkConfig.recentsPageSize
    params.subject_default = false unless showNotes or @props.params.board

    if @props.params.board
      params.board_id = @props.params.board if @props.params.board
    else if @props.project
      params.section = "project-#{ @props.project.id }"
    else
      params.section = 'zooniverse'
    params

  getComments: (page = @props.location.query.page) ->
    params = @commentParams(page)
    talkClient.type('comments').get(params).then (comments) =>
      meta = comments[0]?.getMeta() or { }
      boardTitle = comments[0].board_title if @props.params.board
      loading = false
      @setState {comments, boardTitle, meta, loading}

      author_ids = []
      subject_ids = []
      authors = {}
      subjects = {}
      author_roles={}
      comments.map (comment) =>
        author_ids.push comment.user_id
        subject_ids.push comment.focus_id if comment.focus_id.length
      author_ids = author_ids.filter (id, i) -> author_ids.indexOf(id) is i
      subject_ids = subject_ids.filter (id, i) -> subject_ids.indexOf(id) is i

      apiClient
        .type 'users'
        .get
          id: author_ids
        .then (users) =>
          users.map (user) -> authors[user.id] = user
          @setState {authors}

      apiClient
        .type 'subjects'
        .get
          id: subject_ids
        .then (comment_subjects) =>
          comment_subjects.map (subject) -> subjects[subject.id] = subject
          @setState {subjects}

      talkClient
        .type 'roles'
        .get
          user_id: author_ids
          section: ['zooniverse', params.section]
          is_shown: true
          page_size: 100
        .then (roles) =>
          roles.map (role) ->
            author_roles[role.user_id] ?= []
            author_roles[role.user_id].push role
          @setState {author_roles}

  toggleNotes: ->
    # Always reset to first page when toggling
    updateQueryParams @context.router, showNotes: @refs.showNotes.checked, page: 1
    @getComments()

  commentTitle: (comment) ->
    <span>
      {if @props.params.owner and @props.params.name
        {owner, name} = @props.params
        <Link to="/projects/#{owner}/#{name}/talk/#{comment.board_id}/#{comment.discussion_id}?comment=#{comment.id}">
          {comment.discussion_title} on {comment.board_title}
        </Link>
      else
        <Link to="/talk/#{comment.board_id}/#{comment.discussion_id}?comment=#{comment.id}">
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
      author={@state.authors[comment.user_id]}
      subject={@state.subjects[comment.focus_id]}
      roles={@state.author_roles[comment.user_id]}
      user={@props.user}
      project={@props.project} />

  renderPagination: ->
    <Paginator page={+@state.meta.page} pageCount={@state.meta.page_count} />

  render: ->
    showNotes = @props.location.query.showNotes ? 'true'
    <div className="talk-recents">
      <h1 className="talk-page-header">
        Recent Comments {"on #{ @state.boardTitle or @props.project?.display_name or 'Zooniverse' }"}
        {unless @props.params.board
          <small className="talk-subject-default-toggle">
            <label>
              <input ref="showNotes" type="checkbox" checked={showNotes is 'true'} onChange={@toggleNotes}/>
              Show subject notes
            </label>
          </small>
        }
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
