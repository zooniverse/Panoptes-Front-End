React = require 'react'
{Link} = require 'react-router'
moment = require 'moment'
apiClient = require 'panoptes-client/lib/api-client'
Loading = require '../../components/loading-indicator'

actionTaken =
  destroy: 'Deleted'
  destroyed: 'Deleted'
  open: 'Opened'
  opened: 'Opened'
  close: 'Deleted'
  closed: 'Deleted'
  ignore: 'Ignored'
  ignored: 'Ignored'
  watch: 'Watched'
  watched: 'Watched'

module.exports = React.createClass
  displayName: 'ModerationActions'

  propTypes:
    moderation: React.PropTypes.object.isRequired
    comment: React.PropTypes.object.isRequired
    user: React.PropTypes.object.isRequired
    updateModeration: React.PropTypes.func.isRequired

  getInitialState: ->
    actions: null

  componentDidMount: ->
    if @props.moderation.actions.length is 0
      @setState actions: []
    else
      Promise.all(@props.moderation.actions.map (action) =>
        apiClient.type('users').get(action.user_id.toString()).then (user) =>
          Object.assign { }, action, {user}
      ).then (actions) =>
        @setState {actions}

  confirmDelete: ->
    window.confirm 'Are you sure that you want to delete the reported comment?'

  updateModeration: (action) ->
    =>
      return if action is 'destroy' and not @confirmDelete()
      message = @refs.message.value ? null
      @refs.message.value = ''
      @props.updateModeration @props.moderation, action, message

  availableActions: ->
    @props.comment.moderatable_actions.filter (action) =>
      (@props.moderation.state.indexOf(action) is -1) and action isnt 'report'

  actionButtons: ->
    @availableActions().map (action) =>
      label = if action is 'destroy' then 'delete' else action
      <button
        key={"action-#{@props.comment.id}-#{action}"}
        className="moderations-#{action}"
        onClick={@updateModeration(action)}>
          {label}
      </button>

  render: ->
    {moderation} = @props
    <div className="moderations-actions-buttons">
      <p>
        Status: <strong>
          {actionTaken[moderation.state] ? moderation.state}
        </strong> {moment(moderation.created_at).fromNow()}
      </p>

      {if @state.actions
        <div>
          {for action in @state.actions
            profile_link = "/users/#{action.user.login}"
            if @props.project?
              profile_link = "/projects/#{@props.project.slug}#{profile_link}"
            <div key={"moderation-#{moderation.id}-action-#{action.action}"}>
              {actionTaken[action.action] ? action.action} by <Link to={profile_link}>{action.user.display_name}</Link>
              {if action.message
                <div>
                  <i className="fa fa-quote-left"/> {action.message} <i className="fa fa-quote-right"/>
                </div>}
            </div>}
        </div>
      else
        <Loading />}

      {if moderation.state isnt 'closed'
        <div>
          <div className="textarea-container">
            <textarea ref="message" placeholder="Optional message" />
          </div>

          {@actionButtons()}
        </div>}
    </div>
