React = require 'react'
PropTypes = require 'prop-types'
createReactClass = require 'create-react-class'
{Link} = require 'react-router'
LoadingIndicator = require('../../components/loading-indicator').default
Comment = require './comment'

module.exports = createReactClass
  displayName: 'StartedDiscussionNotification'

  propTypes:
    data: PropTypes.object.isRequired
    notification: PropTypes.object.isRequired
    project: PropTypes.object
    user: PropTypes.object.isRequired

  render: ->
    if @props.data.discussion
      [owner, name] = @props.data.discussion.project_slug?.split('/') or []
      slug = if @props.data.discussion.project_slug
        "/projects/#{@props.data.discussion.project_slug}"
      else
        ''

      <div className="talk-started-discussion talk-module">
        <div>
          {if @props.notification.delivered is false
            <i title="Unread" className="fa fa-star fa-lg" />}

          <div className="title">
            <Link
              onClick={() => @props.markAsRead(notification)}
              to={"#{slug}/talk/#{@props.data.discussion.board_id}/#{@props.data.discussion.id}"}
            >
              {@props.notification.message}
            </Link>
          </div>

          {if @props.data.comment
            <Comment
              data={@props.data}
              notification={@props.notification}
              params={@props.params}
              project={@props.project}
              startedDiscussion={true}
              user={@props.user} />
          }
        </div>
      </div>
    else
      <div className="talk-module">
        <Loading />
      </div>
