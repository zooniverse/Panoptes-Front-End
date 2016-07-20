React = require 'react'
{Link} = require 'react-router'
{Markdown} = (require 'markdownz').default
moment = require 'moment'
talkClient = require 'panoptes-client/lib/talk-client'
apiClient = require 'panoptes-client/lib/api-client'
Loading = require '../../components/loading-indicator'
Avatar = require '../../partials/avatar'

module.exports = React.createClass
  displayName: 'ModerationNotification'

  propTypes:
    project: React.PropTypes.object
    user: React.PropTypes.object.isRequired
    notification: React.PropTypes.object.isRequired

  getInitialState: ->
    moderation: null
    comment: null
    commentUser: null
    reports: []

  componentWillMount: ->
    talkClient.type('moderations').get(@props.notification.source_id).then (moderation) =>
      comment = moderation.target or moderation.destroyed_target
      @setState {moderation, comment}

      promises = []
      for report in moderation.reports then do (report) =>
        promises.push apiClient.type('users').get(report.user_id.toString(), { }).then (user) =>
          report.user = user
          report

      apiClient.type('users').get(comment.user_id.toString()).then (commentUser) =>
        @setState {moderation, comment, commentUser}

      Promise.all(promises).then (reports) =>
        @setState {reports}

  render: ->
    baseLink = ""
    if @props.project?
      baseLink += "projects/#{@props.project.slug}"
    notification = @props.notification
    path = if notification.project_id then "/projects/#{notification.project_slug}/talk/moderations" else '/talk/moderations'

    if @state.moderation
      <div className="moderation talk-module">
        <div className="title">
          <Link to={path} {...@props}>{notification.message}</Link>
        </div>

        <Markdown>{@state.comment.body}</Markdown>

        <p>Reports:</p>
        <ul>
          {for report, i in @state.reports
            <div key={"#{ @state.moderation.id }-report-#{ i }"}>
              <li>
                <Link className="user-profile-link" to="#{baseLink}/users/#{report.user.login}">
                  <Avatar user={report.user} />{' '}{report.user.display_name}
                </Link>
                {': '}
                {report.message}
              </li>
            </div>}
        </ul>

        <div className="bottom">
          {if @state.commentUser
            <Link className="user-profile-link" to="#{baseLink}/users/@state.commentUser.login">
              <Avatar user={@state.commentUser} />{' '}{@state.commentUser.display_name}
            </Link>}

          {' '}

          <Link to={path} {...@props}>
            {notification.message}{' '}
            {moment(notification.created_at).fromNow()}
          </Link>
        </div>
      </div>
    else
      <div className="talk-module">
        <Loading />
      </div>
