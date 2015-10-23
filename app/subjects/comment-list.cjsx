React = require 'react'
talkClient = require '../api/talk'
Comment = require '../talk/comment'
Paginator = require '../talk/lib/paginator'
Loading = require '../components/loading-indicator'

module?.exports = React.createClass
  displayName: 'SubjectCommentList'

  componentWillMount: ->
    @getComments()

  componentWillReceiveProps: (nextProps) ->
    if nextProps.query.page isnt @props.query.page
      @getComments nextProps.query.page

  getDefaultProps: ->
    query: page: 1

  getInitialState: ->
    meta: { }

  getComments: (page = @props.query.page) ->
    query =
      section: @props.section
      focus_id: @props.subject.id
      focus_type: 'Subject'
      page: page or 1
      sort: '-created_at'

    talkClient.type('comments').get(query).then (comments) =>
        meta = comments[0]?.getMeta() or { }
        @setState {comments, meta}

  render: ->
    return <Loading /> unless @state.comments

    if @state.comments.length > 0
      <div>
        <h2>Comments:</h2>
        <div>
          {for comment in @state.comments
            <Comment key={comment.id} data={comment} locked={true} linked={true} />}
        </div>

        <Paginator
          page={+@state.meta.page}
          pageCount={+@state.meta.page_count}
        />
      </div>
    else
      <p>There are no comments yet</p>
