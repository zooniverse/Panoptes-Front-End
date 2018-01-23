React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
{Link} = require 'react-router'
talkClient = require 'panoptes-client/lib/talk-client'
Loading = require('../../components/loading-indicator').default
CommentLink = require '../../pages/profile/comment-link'
ModerationReports = require './reports'
ModerationActions = require './actions'

module.exports = createReactClass
  displayName: 'ModerationComment'

  propTypes:
    moderation: PropTypes.object.isRequired
    user: PropTypes.object.isRequired
    updateModeration: PropTypes.func.isRequired

  getInitialState: ->
    comment: null

  getComment: ->
    if @props.moderation.destroyed_target
      Promise.resolve @props.moderation.destroyed_target
    else
      talkClient.type('comments').get @props.moderation.target_id

  componentDidMount: ->
    @getComment().then (comment) =>
      @setState {comment}

  render: ->
    <div className="talk-module">
      {if @state.comment
        profile_link = "/users/#{@state.comment.user_login}"
        if @props.project?
          profile_link = "/projects/#{@props.project.slug}#{profile_link}"
        <div key={"comment-#{@state.comment.id}"}>
          <h1>Comment {@state.comment.id} Reports</h1>
          <ModerationReports reports={@props.moderation.reports} />

          <span>Reported comment by:{' '}
            <Link to={profile_link}>
              {@state.comment.user_display_name or @state.comment.user_login}
            </Link>:
          </span>

          <CommentLink comment={@state.comment} project={@props.project} />
          <ModerationActions {...@props} comment={@state.comment} />
        </div>
      else
        <Loading />}
    </div>
