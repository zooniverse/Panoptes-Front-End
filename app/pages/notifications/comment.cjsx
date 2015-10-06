React = require 'react'
{Link} = require '@edpaget/react-router'
talkClient = require '../../api/talk'
apiClient = require '../../api/client'
Loading = require '../../components/loading-indicator'
Comment = require '../../talk/search-result'

module?.exports = React.createClass
  displayName: 'CommentNotification'

  propTypes:
    project: React.PropTypes.object
    user: React.PropTypes.object.isRequired
    notification: React.PropTypes.object.isRequired

  getInitialState: ->
    comment: null

  componentWillMount: ->
    talkClient.type('comments').get(@props.notification.source_id).then (comment) =>
      @setState {comment}

  render: ->
    if @state.comment
     <Comment
       data={@state.comment}
       key={"comment-#{ @state.comment.id }"}
       user={@props.user}
       project={@props.project} />
    else
      <div className="talk-module">
        <Loading />
      </div>
