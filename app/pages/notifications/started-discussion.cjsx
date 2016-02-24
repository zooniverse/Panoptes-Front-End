React = require 'react'
talkClient = require 'panoptes-client/lib/talk-client'
{Link} = require 'react-router'
{Markdown} = require 'markdownz'
Loading = require '../../components/loading-indicator'
Comment = require '../../talk/search-result'

module?.exports = React.createClass
  displayName: 'CommentNotification'

  propTypes:
    project: React.PropTypes.object
    user: React.PropTypes.object.isRequired
    notification: React.PropTypes.object.isRequired

  getInitialState: ->
    discussion: null
    comment: null

  componentWillMount: ->
    talkClient.type('discussions').get(@props.notification.source_id).then (discussion) =>
      @setState {discussion}
      talkClient.type('comments').get(discussion_id: discussion.id, sort: 'created_at', page_size: 1).then ([comment]) =>
        @setState {comment}

  render: ->
    if @state.discussion
      [owner, name] = @state.discussion.project_slug?.split('/') or []
      slug = if @state.discussion.project_slug
        "/projects/#{@state.discussion.project_slug}"
      else
        ''

      <div className="talk-started-discussion talk-module">
        <div>
          <div className="title">
            <Link to={"#{slug}/talk/#{@state.discussion.board_id}/#{@state.discussion.id}"} {...@props}>
              {@props.notification.message}
            </Link>
          </div>

          {if @state.comment
            <Comment
              data={@state.comment}
              user={@props.user}
              project={@props.project} />
          }
        </div>
      </div>
    else
      <div className="talk-module">
        <Loading />
      </div>
