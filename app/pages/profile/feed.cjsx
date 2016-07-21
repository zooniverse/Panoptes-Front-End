React = require 'react'
talkClient = require 'panoptes-client/lib/talk-client'
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
    if @props.project? or @props.params?.profile_name?
      document.documentElement.classList.add 'on-secondary-page'
    @getComments(@props.profileUser, @props.location.query.page)

  componentWillReceiveProps: (nextProps) ->
    unless nextProps is @props.profileUser and nextProps.location.query.page is @props.location.query.page
      @getComments(nextProps.profileUser, nextProps.location.query.page)

  componentWillUnmount: ->
    if @props.project? or @props.params?.profile_name?
      document.documentElement.classList.remove 'on-secondary-page'

  getComments: (user, page) ->
    @setState {
      comments: null
      error: null
    }, =>
      criteria = {user_id: user.id, page: page, sort: '-created_at'}
      if @props.project?
        criteria.section = "project-#{@props.project.id}"
      talkClient.type('comments').get(criteria)
        .catch (error) =>
          @setState({error})
        .then (comments) =>
          @setState({comments})

  render: ->
    console.log @props.params
    <div className="content-container">
      {if @state.comments?.length is 0
        <p className="form-help">No recent comments</p>
      else if @state.comments?
        meta = @state.comments[0].getMeta()
        <div>
          <h2>Recent comments</h2>

          {for comment in @state.comments
            <CommentLink key={comment.id} comment={comment} project={@props.project}/>}

          <Paginator pageCount={meta.page_count} page={meta.page} />
        </div>
      else if @state.error?
        <p className="form-help error">{@state.error.toString()}</p>
      else
        null}
    </div>
