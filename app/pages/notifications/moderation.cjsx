React = require 'react'
{Link} = require 'react-router'
{Markdown} = require 'markdownz'
moment = require 'moment'
Loading = require '../../components/loading-indicator'
Avatar = require '../../partials/avatar'

module.exports = React.createClass
  displayName: 'ModerationNotification'

  propTypes:
    data: React.PropTypes.object.isRequired
    notification: React.PropTypes.object.isRequired
    project: React.PropTypes.object
    user: React.PropTypes.object.isRequired

  render: ->
    baseLink = ""
    if @props.project?
      baseLink += "projects/#{@props.project.slug}"
    notification = @props.notification
    path = if notification.project_id then "/projects/#{notification.project_slug}/talk/moderations" else '/talk/moderations'

    if @props.data.moderation
      <div className="moderation talk-module">
        {if notification.delivered is false
          <i title="Unread" className="fa fa-star fa-lg" />}
        <div className="title">
          <Link to={path}>{notification.message}</Link>
        </div>

        <Markdown>{@props.data.comment.body}</Markdown>

        <p>Reports:</p>
        <ul>
          {for report, i in @props.data.reports
            <div key={"#{ @props.data.moderation.id }-report-#{ i }"}>
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
          {if @props.data.commentUser
            <Link className="user-profile-link" to="#{baseLink}/users/@props.data.commentUser.login">
              <Avatar user={@props.data.commentUser} />{' '}{@props.data.commentUser.display_name}
            </Link>}

          {' '}

          <Link to={path}>
            {notification.message}{' '}
            {moment(notification.created_at).fromNow()}
          </Link>
        </div>
      </div>
    else
      <div className="talk-module">
        <Loading />
      </div>
