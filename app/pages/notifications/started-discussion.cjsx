React = require 'react'
{Link} = require 'react-router'
Loading = require '../../components/loading-indicator'
Comment = require '../../talk/search-result'

module.exports = React.createClass
  displayName: 'CommentNotification'

  propTypes:
    data: React.PropTypes.object.isRequired
    notification: React.PropTypes.object.isRequired
    project: React.PropTypes.object
    user: React.PropTypes.object.isRequired

  render: ->
    if @props.data.discussion
      [owner, name] = @props.data.discussion.project_slug?.split('/') or []
      slug = if @props.data.discussion.project_slug
        "/projects/#{@props.data.discussion.project_slug}"
      else
        ''

      <div className="talk-started-discussion talk-module">
        <div>
          <div className="title">
            <Link to={"#{slug}/talk/#{@props.data.discussion.board_id}/#{@props.data.discussion.id}"} {...@props}>
              {@props.notification.message}
            </Link>
          </div>

          {if @props.data.comment
            <Comment
              data={@props.data.comment}
              user={@props.user}
              project={@props.project}
              params={@props.params} />
          }
        </div>
      </div>
    else
      <div className="talk-module">
        <Loading />
      </div>
