React = require 'react'
moment = require 'moment'
apiClient = require '../../api/client'
talkClient = require '../../api/talk'
Markdown = require '../../components/markdown'
Paginator = require '../../talk/lib/paginator'
CommentLink = require './comment-link'

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

          <Paginator pageCount={meta.page_count} page={meta.page} />
        </div>
      else if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>
      else
        null}
    </div>
