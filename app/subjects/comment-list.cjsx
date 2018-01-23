React = require 'react'
createReactClass = require 'create-react-class'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'
Comment = require '../talk/comment'
Paginator = require '../talk/lib/paginator'
Loading = require('../components/loading-indicator').default

module.exports = createReactClass
  displayName: 'SubjectCommentList'

  componentWillMount: ->
    @getComments()

  componentWillReceiveProps: (nextProps) ->
    if nextProps.location.query.page isnt @props.location.query.page
      @getComments nextProps.location.query.page

  getDefaultProps: ->
    location: query: page: 1

  getInitialState: ->
    meta: { }
    authors: {}
    author_roles: {}

  getComments: (page = @props.location.query.page) ->
    query =
      section: @props.section
      focus_id: @props.subject.id
      focus_type: 'Subject'
      page: page or 1
      sort: '-created_at'

    talkClient.type('comments').get(query).then (comments) =>
        author_ids = []
        authors = {}
        author_roles = {}
        meta = comments[0]?.getMeta() or { }
        @setState {comments, meta}
        comments.map (comment) ->
          author_ids.push comment.user_id
        author_ids = author_ids.filter (id, i) -> author_ids.indexOf(id) is i

        apiClient
          .type 'users'
          .get
            id: author_ids
          .then (users) =>
            users.map (user) -> authors[user.id] = user
            @setState {authors}

        talkClient
          .type 'roles'
          .get
            user_id: author_ids
            section: ['zooniverse', @props.section]
            is_shown: true
            page_size: 100
          .then (roles) =>
            roles.map (role) ->
              author_roles[role.user_id] ?= []
              author_roles[role.user_id].push role
            @setState {author_roles}

  render: ->
    return <Loading /> unless @state.comments

    if @state.comments.length > 0
      <div>
        <h2>Comments:</h2>
        <div>
          {for comment in @state.comments
            <Comment
              {...@props}
              key={"comment-#{comment.id}"}
              data={comment}
              author={@state.authors[comment.user_id]}
              roles={@state.author_roles[comment.user_id]}
              locked={true}
              linked={true}
              hideFocus={true}
            />}
        </div>

        {if +@state.meta.page_count > 1
          <Paginator
            page={+@state.meta.page}
            pageCount={+@state.meta.page_count} />}
      </div>
    else
      <p>There are no comments yet</p>
