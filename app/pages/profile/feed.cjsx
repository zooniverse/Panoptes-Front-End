React = require 'react'
moment = require 'moment'
apiClient = require 'panoptes-client/lib/api-client'
talkClient = require 'panoptes-client/lib/talk-client'
{Markdown} = (require 'markdownz').default
Paginator = require '../../talk/lib/paginator'
CommentLink = require './comment-link'

module.exports = React.createClass
  displayName: 'UserProfileFeed'

  propTypes:
    user: React.PropTypes.object

  getDefaultProps: ->
    location: query: page: 1

  getInitialState: ->
    comments: null
    error: null

  componentDidMount: ->
    @getComments(@props.profileUser, @props.location.query.page)

  componentWillReceiveProps: (nextProps) ->
    unless nextProps is @props.profileUser and nextProps.location.query.page is @props.location.query.page
      @getComments(nextProps.profileUser, nextProps.location.query.page)

  getComments: (user, page) ->
    @setState {
      comments: null
      error: null
    }, =>
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
