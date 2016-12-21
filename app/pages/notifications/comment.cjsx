React = require 'react'
Loading = require '../../components/loading-indicator'
Comment = require '../../talk/search-result'

module.exports = React.createClass
  displayName: 'CommentNotification'

  propTypes:
    data: React.PropTypes.object.isRequired
    notification: React.PropTypes.object
    project: React.PropTypes.object
    user: React.PropTypes.object.isRequired

  getInitialState: ->
    comment: null

  render: ->
    if @props.data.comment
      <div className="talk-comment">
        <Comment
          data={@props.data.comment}
          user={@props.user}
          project={@props.project}
          params={@props.params} />
      </div>
    else
      <div className="talk-module">
        <Loading />
      </div>
